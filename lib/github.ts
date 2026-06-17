import { z } from "zod";

/**
 * Server-only data layer for the GitHub Activity panel.
 *
 * Fetches a single GraphQL query against the GitHub API (viewer-scoped, so it
 * works with the owner's classic or fine-grained PAT), validates the response
 * with zod, and reduces it to the compact payload the home page renders. The
 * upstream fetch is cached by Next's data cache for 6h via `next.revalidate`,
 * which also gives us stale-while-revalidate + serve-stale-on-error for free.
 *
 * The client section imports ONLY the `GitHubActivityPayload` type (type-only),
 * so none of this server code reaches the client bundle.
 */

const GRAPHQL_URL = "https://api.github.com/graphql";
const REVALIDATE_SECONDS = 21600; // 6 hours

// One query, viewer-scoped. `viewer` (not `user(login:)`) makes the same token
// work for classic PATs and fine-grained PATs that belong to the owner.
const QUERY = /* GraphQL */ `
  query Activity {
    viewer {
      login
      name
      bio
      avatarUrl(size: 80)
      createdAt
      isHireable
      status {
        emoji
        message
        indicatesLimitedAvailability
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            url
            description
            stargazerCount
            forkCount
            primaryLanguage { name }
            updatedAt
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
        totalCount
        nodes {
          primaryLanguage { name }
        }
      }
      followers { totalCount }
    }
  }
`;

// ---- zod schema ---------------------------------------------------------
// Validate the GraphQL response before we trust it. GitHub returns HTTP 200
// with `data: null` + an `errors` array on auth/rate-limit failures, so a
// missing `data.viewer` fails validation and triggers the fallback path.

const ContributionLevelEnum = z.enum([
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
]);
type ContributionLevel = z.infer<typeof ContributionLevelEnum>;

const ContributionDaySchema = z.object({
  contributionCount: z.number().int().min(0),
  date: z.string(),
  contributionLevel: ContributionLevelEnum,
});

// Pinned items that aren't repositories (e.g. gists) collapse to `{}` under
// the inline fragment, so every field is optional and we filter to real repos
// in buildPayload.
const PinnedNodeSchema = z.object({
  name: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().nullable().optional(),
  stargazerCount: z.number().int().min(0).optional(),
  forkCount: z.number().int().min(0).optional(),
  primaryLanguage: z.object({ name: z.string() }).nullable().optional(),
  updatedAt: z.string().optional(),
});

const ViewerSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  bio: z.string().nullable(),
  avatarUrl: z.string().url(),
  createdAt: z.string(),
  isHireable: z.boolean(),
  status: z
    .object({
      emoji: z.string().nullable(),
      message: z.string().nullable(),
      indicatesLimitedAvailability: z.boolean(),
    })
    .nullable(),
  contributionsCollection: z.object({
    contributionCalendar: z.object({
      totalContributions: z.number().int().min(0),
      weeks: z.array(z.object({ contributionDays: z.array(ContributionDaySchema) })),
    }),
  }),
  pinnedItems: z.object({ nodes: z.array(PinnedNodeSchema) }),
  repositories: z.object({
    totalCount: z.number().int().min(0),
    nodes: z.array(z.object({ primaryLanguage: z.object({ name: z.string() }).nullable() })),
  }),
  followers: z.object({ totalCount: z.number().int().min(0) }),
});

export const GitHubResponseSchema = z.object({ data: z.object({ viewer: ViewerSchema }) });

type Viewer = z.infer<typeof ViewerSchema>;

// ---- public payload type (shared with the client via type-only import) ---

export type ContributionCell = { date: string; level: 0 | 1 | 2 | 3 | 4; count: number };
export type GitHubActivityWeek = { days: ContributionCell[] };
export type TopLanguage = { name: string; count: number; percent: number };
export type PinnedRepo = {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  forks: number;
  primaryLanguage: string | null;
  updatedAt: string;
};
export type GitHubIdentity = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  memberSince: string; // "YYYY" — year only
  isHireable: boolean;
  status: { emoji: string; message: string; limited: boolean } | null;
};

export type GitHubActivityAvailable = {
  available: true;
  identity: GitHubIdentity;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  publicRepos: number;
  followers: number;
  weeks: GitHubActivityWeek[];
  topLanguages: TopLanguage[];
  pinnedRepos: PinnedRepo[];
  fetchedAt: string;
};

export type GitHubActivityPayload = GitHubActivityAvailable | { available: false };

// ---- reduction helpers --------------------------------------------------

// GitHub's own quartile buckets are more robust than hardcoded count
// thresholds because they adapt to each user's contribution range.
const LEVEL_INT: Record<ContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Streaks are computed from the calendar days without touching `new Date()`.
// GitHub returns contiguous full weeks, so "today" is simply the last entry.
// The final day is allowed to be a zero (today isn't over yet) before the
// current streak begins counting back — matches GitHub's own behavior.
function computeStreaks(days: { contributionCount: number }[]): {
  current: number;
  longest: number;
} {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    if (d.contributionCount > 0) {
      run += 1;
      if (run > longest) longest = run;
    } else {
      run = 0;
    }
  }

  let i = days.length - 1;
  if (i >= 0 && days[i].contributionCount === 0) i -= 1;
  let current = 0;
  while (i >= 0 && days[i].contributionCount > 0) {
    current += 1;
    i -= 1;
  }
  return { current, longest };
}

// Top languages by repo count (not bytes). Byte totals would need a
// `languages` connection per repo (N+1 calls, rate-limit risk); repo count is
// a meaningful proxy and keeps this to a single GraphQL query. Percentages
// are relative to repos that have a primary language set.
function computeTopLanguages(
  nodes: { primaryLanguage: { name: string } | null }[]
): TopLanguage[] {
  const counts = new Map<string, number>();
  let total = 0;
  for (const node of nodes) {
    const lang = node.primaryLanguage?.name;
    if (!lang) continue;
    counts.set(lang, (counts.get(lang) ?? 0) + 1);
    total += 1;
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count, percent: total > 0 ? (count / total) * 100 : 0 }));
}

function buildPayload(viewer: Viewer): GitHubActivityAvailable {
  const calendar = viewer.contributionsCollection.contributionCalendar;
  const allDays = calendar.weeks.flatMap((w) => w.contributionDays);
  const { current, longest } = computeStreaks(allDays);

  const weeks: GitHubActivityWeek[] = calendar.weeks.map((w) => ({
    days: w.contributionDays.map((d) => ({
      date: d.date,
      level: LEVEL_INT[d.contributionLevel],
      count: d.contributionCount,
    })),
  }));

  const pinnedRepos: PinnedRepo[] = viewer.pinnedItems.nodes
    .map((n): PinnedRepo | null => {
      if (!n.name || !n.url) return null;
      return {
        name: n.name,
        url: n.url,
        description: n.description ?? null,
        stars: n.stargazerCount ?? 0,
        forks: n.forkCount ?? 0,
        primaryLanguage: n.primaryLanguage?.name ?? null,
        updatedAt: n.updatedAt ?? "",
      };
    })
    .filter((r): r is PinnedRepo => r !== null);

  const memberSinceYear = new Date(viewer.createdAt).getUTCFullYear().toString();
  const status =
    viewer.status && (viewer.status.emoji || viewer.status.message)
      ? {
          emoji: viewer.status.emoji ?? "",
          message: viewer.status.message ?? "",
          limited: viewer.status.indicatesLimitedAvailability,
        }
      : null;

  return {
    available: true,
    identity: {
      login: viewer.login,
      name: viewer.name,
      bio: viewer.bio,
      avatarUrl: viewer.avatarUrl,
      memberSince: memberSinceYear,
      isHireable: viewer.isHireable,
      status,
    },
    totalContributions: calendar.totalContributions,
    currentStreak: current,
    longestStreak: longest,
    publicRepos: viewer.repositories.totalCount,
    followers: viewer.followers.totalCount,
    weeks,
    topLanguages: computeTopLanguages(viewer.repositories.nodes),
    pinnedRepos,
    fetchedAt: new Date().toISOString(),
  };
}

// ---- fetch + cache ------------------------------------------------------

export async function getGitHubActivity(): Promise<GitHubActivityPayload> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { available: false };

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY }),
      // Cache the GitHub response for 6h. Next serves the cached result on
      // subsequent requests and revalidates in the background; if the
      // revalidation fetch fails it keeps serving the last-good response
      // (stale-while-revalidate), so the panel stays populated when GitHub is
      // down. In development this cache is bypassed.
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

    const json: unknown = await res.json();
    const parsed = GitHubResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error(
        `GitHub response schema mismatch: ${parsed.error.issues[0]?.message ?? "unknown"}`
      );
    }
    return buildPayload(parsed.data.data.viewer);
  } catch (err) {
    console.error("GitHub activity fetch failed:", err instanceof Error ? err.message : err);
    return { available: false };
  }
}