export const personalInfo = {
  name: "Daniel Anthony S. Estrella",
  role: "Junior Backend Developer",
  title: "Software Development · Backend Engineer",
  shortBio:
    "Magna Cum Laude BS IT graduate. Built 130+ RESTful API endpoints across 7 microservices at Xentra Solutions, Inc. Core stack: ASP.NET Core (C#), Node.js, PostgreSQL, MariaDB, Redis.",
  summary:
    "Magna Cum Laude BS Information Technology graduate and backend developer with professional experience building production-grade microservice architectures using ASP.NET Core (C#). Independently developed 130+ RESTful API endpoints across 7 microservice repositories within a live commercial product. Proficient in .NET Core, Node.js, Express.js, PostgreSQL, MariaDB, and Redis, with working knowledge of React and Next.js. Experienced in Agile/Scrum workflows, Git, and relational database schema design. Oracle Cloud 2025 Certified Developer Professional.",
  phone: "+63 962 827 1366",
  email: "daniel.anth.est.03@gmail.com",
  location: "Philippines",
  linkedin: "https://linkedin.com/in/daniel-est",
  github: "https://github.com/danielEst-dev",
};

type Experience = {
  company: string;
  role: string;
  date: string;
  bullets: string[];
  /** True for low-signal entries rendered as a quiet single line instead of an expandable card. */
  muted?: boolean;
  /** Tech + team-context chips shown under the role, visible even when collapsed. */
  stack?: string[];
};

export const experiences: Experience[] = [
  {
    company: "Xentra Solutions, Inc.",
    role: "Junior Backend Developer",
    date: "September 2025 — Present",
    stack: ["ASP.NET Core", "MariaDB", "Microservices", "JIRA"],
    bullets: [
      "Led backend for an upcoming product version, shipping **130+ RESTful API endpoints** across the microservice ecosystem in 1.5 months.",
      "Own branch strategy, version control, and interservice API contracts across **7 microservice repositories**.",
      "Designed relational schemas per service — **10+ new tables, 7 modified** — translating Figma designs into API contracts with client-side developers.",
    ],
  },
  {
    company: "Xentra Solutions, Inc.",
    role: "Backend Developer Intern",
    date: "January 2025 — May 2025 · 500+ hours",
    stack: ["ASP.NET Core", "C#", "RBAC"],
    bullets: [
      "Implemented **Role-Based Access Control** in a production codebase — roles, permission scopes, and route-level authorization middleware.",
      "Built **10–20 CRUD endpoints** in ASP.NET Core modeling real interservice REST communication, with normalized schemas of 5–10 tables.",
    ],
  }
];

interface Project {
  slug: string;
  kicker: string;
  name: string;
  role: string;
  date: string;
  link?: string;
  shortDescription: string;
  fullDescription: string[];
  tags: string[];
  highlights: string[];
  adminLink?: string;
  repo?: string;
  credentials?: { user: string; pass: string };
  /** Sidebar figures. Ordered, explicitly labelled — a key alone reads badly once
   *  a label needs more than one word. */
  stats?: { label: string; value: string }[];
  /** Shown under the title when a project is not a finished, shipped thing. */
  status?: string;
  /** Replaces an empty Links block for work that has no public URL. */
  linksNote?: string;
  /** ─── The fields below are optional depth. A project that omits them renders
   *  exactly as before; only the heaviest work earns the extra sections. ─── */
  architecture?: { layer: string; choice: string; why: string }[];
  deepDives?: { title: string; problem: string; approach: string }[];
  decisions?: { decision: string; why: string; rejected?: string }[];
  quality?: string[];
  aiWorkflow?: { summary: string; points: string[] };
}

export const projects: Project[] = [
  {
    slug: "brewbank",
    kicker: "Key Project",
    name: "BrewBank",
    role: "Junior Backend Developer",
    date: "2025 — Present",
    link: "https://brewbank.app",
    shortDescription:
      "Microservices-based prepaid coffee loyalty platform for Australian cafés. Built RESTful transaction and redemption APIs across distributed services.",
    fullDescription: [
      "BrewBank is a prepaid coffee loyalty platform serving Australian cafés. As a junior backend developer at Xentra Solutions, I contribute to the backend microservice architecture that powers customer accounts, café transactions, and loyalty redemption workflows.",
      "My work focuses on building and maintaining RESTful API endpoints across multiple microservices, ensuring reliable interservice communication, and designing normalized MariaDB schemas that support high-volume transaction data.",
    ],
    tags: ["ASP.NET Core", "MariaDB", "Microservices"],
    highlights: [
      "Built and maintained RESTful API endpoints for transaction and redemption workflows",
      "Collaborated with frontend and mobile teams to align API contracts",
      "Designed normalized relational schemas per microservice",
      "Participated in Agile ceremonies and sprint planning via JIRA",
    ],
  },
  {
    slug: "cedar",
    kicker: "Solo Architect & Full Stack Developer",
    name: "CEDAR",
    role: "Solo Architect & Full Stack Developer",
    date: "Jun 2026 — Present",
    status: "In development · pilot for 13 academic programs",
    shortDescription:
      "Role-based accreditation evidence repository for all 13 academic programs at CEU Malolos. ASP.NET Core 10 on Clean Architecture, Next.js, PostgreSQL and Cloudflare R2 — architected and built solo.",
    fullDescription: [
      "Philippine universities are accredited program by program. Every few years an accrediting body schedules a survey visit, and each program hands over the documentary evidence behind its self-study — syllabi, faculty records, facility reports, minutes. At CEU Malolos that evidence lived in shared drives: no version history, no record of who changed what, and no reliable way to answer the question an accreditor's finding actually turns on — what did this document look like at the time it was submitted?",
      "CEDAR is the system of record that replaces those folders, across all 13 academic programs. An ASP.NET Core 10 Web API on Clean Architecture with vertical slices, EF Core 10 over PostgreSQL, a Next.js App Router front end, and a private Cloudflare R2 bucket reachable only through short-lived signed URLs. Sign-in is Google OAuth restricted to the two CEU mail domains. The pilot runs entirely on free tiers — Vercel, Render, Neon and R2 — deliberately co-located in one region.",
      "The hard part was never storage. It is that an accreditation record has to be provably unaltered, in an institution that cannot afford to simply trust its own application. So the design rests on three ideas: history is append-only and enforced below the application layer, the runtime connects with privileges that make tampering impossible rather than merely forbidden, and state that must not drift — such as which survey a document counts as evidence for — is derived from immutable facts instead of stored and maintained by hand.",
      "Solo across every layer: domain modelling, API, database and migrations, front end, blob storage, authentication, authorization, security headers, CI, deployment, and the operator runbooks a real handover needs. Around 660 commits and 32 written decision records so far.",
    ],
    tags: [
      "ASP.NET Core 10",
      "Clean Architecture",
      "EF Core 10",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "Cloudflare R2",
      "Docker",
    ],
    stats: [
      { label: "Institutional scope", value: "13 programs" },
      { label: "API surface", value: "91 endpoints" },
      { label: "Automated tests", value: "~2,900" },
      { label: "Backend coverage", value: "87% CI-gated" },
      { label: "Decision records", value: "32" },
      { label: "Commits", value: "660+" },
    ],
    highlights: [
      "Designed the domain model and built the full ASP.NET Core 10 API — 91 REST endpoints across 24 vertical feature slices, on a Clean Architecture dependency rule enforced by architecture tests rather than by convention",
      "Made document history tamper-evident at three independent layers: an EF Core interceptor, a PostgreSQL trigger, and a runtime database role with UPDATE and DELETE revoked outright on the append-only tables",
      "Built a four-role capability model with defense-in-depth authorization — every document route re-checks access and answers 404 on denial, so an unauthorized reader cannot even confirm a document exists",
      "Wrote an in-browser viewer for PDF, Word, Excel, CSV, text and image evidence that parses untrusted uploads inside a cross-origin sandboxed iframe with no network access, instead of handing files to a third-party embed service",
      "Implemented opaque server-side sessions over Google OAuth with instant revocation, a 12-hour absolute expiry and a 2-hour idle cutoff, aimed at shared campus machines",
      "Worked around a hosting-imposed 4.5 MB upload ceiling by moving file bytes browser-to-API directly on single-use, server-minted upload tickets, implemented as a real authentication scheme rather than a request filter",
      "Derived which accreditation cycle a document is evidence for from immutable timestamps instead of storing it, which retro-attaches every upload correctly and removed an entire class of manual administrative work",
      "Built the front end in Next.js App Router with an enforced Content-Security-Policy carrying a per-response nonce, no unsafe-inline, and a second, separate policy for the sandboxed renderer",
      "Set up CI that fails the build on high-severity dependency advisories, on backend coverage below 80%, and on custom guard tests that pin security-relevant invariants",
      "Wrote the operator documentation the system needs to actually be run — pilot onboarding, a pre-deploy smoke checklist, production cutover, and backup and recovery",
    ],
    architecture: [
      {
        layer: "Backend",
        choice: "ASP.NET Core 10 · Clean Architecture + vertical slices",
        why: "Domain ← Application ← Infrastructure ← Api, with the dependency rule enforced by architecture tests so it cannot quietly rot. Each feature is one folder — endpoint, handler, DTO, validator — rather than a fat shared service layer.",
      },
      {
        layer: "Database",
        choice: "PostgreSQL · EF Core 10, code-first migrations",
        why: "Relational, because accreditation data is inherently relational — programs, tracks, cycles, documents, versions, roles — and the integrity guarantees are the product. Trigram indexing for title search; audit and version tables protected by database triggers, not only by application code.",
      },
      {
        layer: "Frontend",
        choice: "Next.js App Router · TypeScript · Tailwind",
        why: "Server components for the shell, client components where interaction lives. The web origin also proxies the API, so the browser only ever talks to one origin — which is what makes strict cookie rules and a tight CSP possible without a custom domain.",
      },
      {
        layer: "File storage",
        choice: "Cloudflare R2, private bucket",
        why: "Downloads are short-lived signed URLs straight from R2, so file bytes never stream out through the API. Uploads deliberately go the other way — inbound through the API — so a magic-byte check can run on the real stream before anything is stored.",
      },
      {
        layer: "Authentication",
        choice: "Google OAuth · opaque server-side sessions",
        why: "CEU mail is Google Workspace, and the domain allowlist is the membership check. Sessions are opaque tokens stored hashed in PostgreSQL rather than JWTs, chosen specifically so access can be revoked instantly instead of surviving until a token expires.",
      },
      {
        layer: "Hosting",
        choice: "Vercel · Render · Neon · R2 — free tier",
        why: "A pilot for 10–20 concurrent users does not need paid infrastructure. Co-locating the API and database in one region turned latency back into a real signal: a slow endpoint is now either a genuine query problem or a documented cold start.",
      },
    ],
    deepDives: [
      {
        title: "Making history tamper-evident, not merely append-only",
        problem:
          "An audit trail the application itself can rewrite is not evidence. A bug, a careless migration, or anyone holding the app's own database credentials could silently edit the record of what happened — and an append-only table enforced only in C# is a convention, not a guarantee.",
        approach:
          "Three independent layers, each of which would have to fail. An EF Core interceptor rejects modified or deleted rows on the audit and version tables. A PostgreSQL trigger rejects the same operations underneath the ORM. And in production the API connects as a dedicated role that owns nothing and has UPDATE and DELETE revoked on those tables entirely — so disabling the trigger fails with 'must be owner', and there is no DDL permission to grant it back. Migrations run under a separate owner connection, which is why a migration attempted with the runtime credentials correctly fails.",
      },
      {
        title: "Rendering untrusted documents without trusting anyone",
        problem:
          "Users need to preview evidence in the browser — PDFs, Word documents, spreadsheets. The obvious answer is an Office Online embed, but that renders by handing a signed URL to a third party's servers to fetch, which means the institution's accreditation evidence leaves its control. The alternative — parsing those formats in the page — means running complex parsers over files uploaded by users.",
        approach:
          "One cross-origin sandboxed iframe with no same-origin access and no network of its own: the parent fetches the bytes and transfers them in. Containment is graded by what a renderer produces rather than by what it parses — pixels need none, text nodes need none but must never touch innerHTML, and markup derived from a file gets both the sandbox and HTML sanitization. Where a format's output can be data instead of markup, as with spreadsheets, it is parsed inside the box and only data comes back: strictly stronger than sanitizing markup, and it puts the rules somewhere a test can actually reach.",
      },
      {
        title: "Permanence that does not depend on an administrator remembering",
        problem:
          "Once an accrediting body has concluded a survey, the evidence behind it must stop being deletable. The first design stored, on each document, which cycle it belonged to. That meant a human had to create the link, every document uploaded between surveys stayed unattached forever, and re-filing a document silently dropped its protection.",
        approach:
          "The link is derived, never stored: a document's anchor is the earliest cycle on its track whose handover date falls after the document's own creation timestamp. Because it keys on two immutable facts, the answer cannot drift overnight — it moves only when an administrator schedules or reschedules a cycle. Documents uploaded during a quiet period retro-attach to the next survey automatically, and the freeze follows without anyone maintaining anything. A cycle locks once evidence anchors to it, and the admin override that exists to correct a mis-recorded date is itself audited.",
      },
      {
        title: "Uploads that did not fit through the platform",
        problem:
          "The web origin proxies the API so the browser sees a single origin — but that proxy runs as a serverless function whose request body caps at roughly 4.5 MB. Accreditation evidence is routinely larger, so uploads above that ceiling simply never worked.",
        approach:
          "File bytes now travel browser-to-API directly, authorized by a short-lived single-use ticket minted by a separate endpoint. The ticket is implemented as a genuine authentication scheme rather than a request filter, because authorization, the rate limiter's partition key and the audit trail all read the authenticated principal — and a filter would run after the 401. Single use is a conditional UPDATE in the database, not a boolean check that two concurrent requests would both pass.",
      },
      {
        title: "Authorization over a many-to-many filing set",
        problem:
          "One document is often evidence for several programs at once — a service unit's annual report can be filed under all thirteen. So there is no such thing as 'the document's department', and every access rule has to be asked against a set rather than read off a column.",
        approach:
          "Every rule resolves through the filing rows, and the quantifier is chosen per question. Reading and reviewing hold if the caller has the capability over any filing, because reach should be permissive. Creating requires every area in the requested set, because the create gate must be restrictive. Editing splits the difference — the owner may edit, or an area admin who covers every filing may — so a single-program document is editable by that program's admin while a document thirteen programs depend on stays with its owner. A sweep test pins the query-level visibility filter against the per-action authorizer so the two can never disagree.",
      },
      {
        title: "Sessions for machines nobody owns",
        problem:
          "Faculty sign in from shared campus computers and walk away. A stateless token that stays valid until it expires is exactly the wrong shape: it cannot be recalled, so a forgotten session on a lab machine stays live.",
        approach:
          "Opaque tokens, stored hashed, with three independent cutoffs that all fail closed — explicit revocation, a 12-hour absolute expiry, and a 2-hour idle timeout. Four separate paths revoke: logout, an admin ending a user's sessions, a user ending all of their own, and an account being disabled. The idle timeout and the write-coalescing interval that refreshes it are treated as one mechanism and clamped together, because a refresh interval at or above the cutoff turns the idle timeout into an absolute one and signs active users out mid-task with no error anywhere.",
      },
    ],
    decisions: [
      {
        decision: "PostgreSQL, not a document store",
        why: "The data is relational and the integrity constraints are the point. Referential integrity between programs, cycles, documents and versions is what makes the archive trustworthy.",
        rejected: "A document database — schema flexibility buys nothing here and costs the guarantees the system exists to provide.",
      },
      {
        decision: "Opaque server-side sessions, not JWTs",
        why: "Instant revocation. When an account is disabled or a session is reported compromised, access has to stop on the next request rather than at the end of a token's lifetime.",
        rejected: "Stateless JWT sessions — cheaper to verify, but impossible to recall without adding the server-side blocklist that makes them stateful anyway.",
      },
      {
        decision: "Downloads bypass the API; uploads deliberately do not",
        why: "Streaming file bytes out through the API spends a free tier's bandwidth for no benefit, so downloads are signed URLs straight from R2. Uploads stay inbound because ordering matters — the magic-byte check has to run on the real stream before anything is stored.",
        rejected: "A presigned PUT straight to R2 — symmetrical and faster, but it puts unvalidated bytes in the bucket with no point at which to inspect them first.",
      },
      {
        decision: "No third-party document preview, ever",
        why: "Office Online and similar services render by fetching the file themselves. For accreditation evidence that is an exfiltration path with a friendly name.",
        rejected: "An Office Online embed — a few hours of work instead of a sandboxed renderer per format, at the cost of the one property the system exists for.",
      },
      {
        decision: "Clean Architecture with vertical slices, no CQRS",
        why: "The dependency rule is worth enforcing because it keeps the domain testable with no infrastructure at all. Slicing by feature keeps a change to one workflow inside one folder.",
        rejected: "A fat shared application service layer, and full CQRS with separate read and write models — both add indirection a system this size would never repay.",
      },
      {
        decision: "Deletion is a tombstone plus a blob purge, behind an undo window",
        why: "Rows survive so the audit trail stays coherent; only the bytes go, and not for seven days. An accreditation archive should make destruction slow and recoverable.",
        rejected: "Hard row deletion — it would tear holes in the very history the system exists to preserve.",
      },
    ],
    quality: [
      "Roughly 2,900 automated tests — about 1,650 on the backend across unit, integration and architecture suites, and about 1,250 on the web.",
      "Integration tests run against real PostgreSQL in disposable containers rather than an in-memory substitute, because the invariants under test are database-level: triggers, privileges, and constraint behaviour.",
      "Architecture tests enforce the dependency rule, so a shortcut import from the domain into infrastructure fails the build instead of relying on being caught in review.",
      "Custom guard tests pin security-relevant invariants that ordinary tests miss — that every mutating endpoint carries antiforgery, that no endpoint leaks an exception message as an error code, that the preview format map and the upload whitelist cannot disagree, and that the CORS exposed-header list contains exactly one entry.",
      "CI gates backend line coverage at 80%, with the real figure around 87%, and fails outright on any high or critical dependency advisory — which is how an arbitrary-code-execution advisory in the PDF library was caught while it was still just a version bump.",
      "The suite is treated as necessary and nowhere near sufficient. Every stage of the rebuild has had at least one user-visible bug a green suite missed, each found by using the application and then reading the database — which is why a manual pre-deploy smoke checklist exists alongside CI.",
    ],
    aiWorkflow: {
      summary:
        "CEDAR is built with Claude Code as the implementation engine, under a spec-first loop: I own the architecture and the verification, the model owns the typing.",
      points: [
        "Every non-obvious choice is written as a decision record first — the problem, the decision, and the alternatives rejected — so the model implements against a specification instead of improvising one.",
        "Generated code is checked by machinery rather than by reading alone: coverage gates, architecture tests, and custom guard tests that fail the build the moment a security-relevant invariant breaks.",
        "The repository carries its own engineering notes and rules, so context that would otherwise be re-explained every session — why a decision was made, what has already broken, what must never be reintroduced — stays durable.",
        "The habit that matters most is verifying in the browser and then reading the database. Several real bugs shipped past a fully green suite, and every one of them was found that way.",
      ],
    },
    linksNote:
      "The repository is private — it holds an institution's configuration and data model. A code walkthrough is available on request.",
  },
  {
    slug: "ceu-vault",
    kicker: "Full Stack Developer",
    name: "CEU Vault",
    role: "Full Stack Developer",
    date: "Oct 2024 — Dec 2024",
    link: "https://ceu-vault.vercel.app",
    adminLink: "https://ceu-vault.vercel.app/admin",
    repo: "https://github.com/danielEst-dev/CEUVault-Redis",
    shortDescription:
      "Full-stack equipment reservation system digitizing a manual pen-and-paper lending facility. Express backend, Bootstrap frontend, PostgreSQL and Redis.",
    fullDescription: [
      "CEU Vault is a full-stack equipment reservation system built to digitize a manual pen-and-paper lending facility at Centro Escolar University Malolos.",
      "The application features an Express.js backend, an HTML5/Bootstrap frontend, and a modular MVC-inspired architecture. It integrates REST APIs, PostgreSQL, Redis Cloud, Neon DB, Nodemailer, and PDF generation to handle reservations, approvals, notifications, and reporting.",
    ],
    tags: ["Express.js", "PostgreSQL", "Bootstrap", "Redis"],
    highlights: [
      "Digitized manual lending workflows into a web-based reservation system",
      "Built RESTful APIs with Express.js and PostgreSQL",
      "Integrated Redis Cloud for session/caching needs",
      "Automated email notifications with Nodemailer",
      "Generated PDF reports for reservations and returns",
    ],
    credentials: {
      user: "admin@test.com",
      pass: "admin123",
    },
  },
  {
    slug: "hotel-booking",
    kicker: "Full Stack Developer",
    name: "Hotel Booking System",
    role: "Full Stack Developer",
    date: "2026",
    repo: "https://github.com/danielEst-dev/hotel_booking",
    shortDescription:
      "Solo-built full-stack hotel management system with a 15-endpoint REST API, Bootstrap dashboard, and automated cron jobs.",
    fullDescription: [
      "A solo-built full-stack hotel management system with a 15-endpoint RESTful API and a Bootstrap front-end dashboard.",
      "Built on Node.js and Express with a modular MVC-inspired architecture, the system covers room, guest, and booking workflows. It uses Yup for request validation, a normalized 3-table PostgreSQL schema, and stores third-party weather data from Open-Meteo as JSONB. A node-cron scheduled job automates booking completion, and Jest unit tests with mocked database calls ensure reliability.",
    ],
    tags: ["Node.js", "Express.js", "PostgreSQL", "Jest"],
    highlights: [
      "Built 15 RESTful API endpoints for room, guest, and booking workflows",
      "Designed a normalized 3-table PostgreSQL schema",
      "Implemented request validation with Yup",
      "Fetched and stored Open-Meteo weather data as JSONB",
      "Automated booking completion with node-cron",
      "Wrote Jest unit tests with mocked database calls",
    ],
    stats: [
      { label: "Endpoints", value: "15 REST" },
      { label: "Tables", value: "3 schemas" },
      { label: "Year", value: "2026" },
    ],
  },
  {
    slug: "latinpay",
    kicker: "Internship Project",
    name: "LatinPay",
    role: "Backend Developer Intern",
    date: "2025",
    link: "https://latinpay.com/",
    shortDescription:
      "Internship reference project: a U.S.-based fintech platform for prepaid cards, mobile top-up, and bill payments.",
    fullDescription: [
      "LatinPay is a U.S.-based fintech platform serving the Latin American community with prepaid Visa cards, mobile top-up, and bill payments.",
      "During my internship at Xentra Solutions, I studied LatinPay as a live reference system to understand production-grade microservice architecture, interservice REST API communication, and Agile team operations.",
    ],
    tags: ["ASP.NET Core", "Microservices", "MariaDB"],
    highlights: [
      "Studied production microservice architecture and interservice communication",
      "Observed daily standups and sprint workflows in a professional team",
      "Gained exposure to fintech domain concepts and compliance considerations",
    ],
  },
];

interface Education {
  school: string;
  degree: string;
  year: string;
  honors: string;
  detail: string;
  awards: string[];
  shs: { school: string; strand: string; year: string };
}

export const education: Education = {
  school: "Centro Escolar University Malolos",
  degree: "Bachelor of Science in Information Technology",
  year: "2021 — 2025",
  honors: "Magna Cum Laude",
  detail: "Graduated with high distinction · GWA 1.25 · Top 8 Overall, Highest-Ranking Male Graduate",
  awards: [
    "Top 8 Overall Graduate",
    "Highest-Ranking Male Graduate",
    "Dean's List — 1st Year",
    "Consistent President's List — 2nd to 4th Year",
    "Research Forum: 1st in Oral Presentations",
    "Research Forum: 3rd in Poster Presentations",
    "Meritorious Award in Research",
  ],
  shs: {
    school: "St. Mary's College of Meycauayan",
    strand: "Senior High School · Accountancy, Business and Management (ABM) Strand",
    year: "2019 — 2021",
  },
};

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credential?: string;
}

export const certifications: Certification[] = [
  {
    name: "Oracle Cloud 2025 Certified Developer Professional",
    issuer: "Oracle University",
    date: "Oct 2025 — Oct 2027",
    credential:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=7C9D000F6E0EB1B436D1DBCB0F2232B182454039B3266E6A78DA85DCEF12CBB5",
  },
  {
    name: "Fortinet Certified Associate in Cybersecurity",
    issuer: "Fortinet Training Institute",
    date: "May 2025 — May 2027",
    credential: "https://training.fortinet.com/admin/tool/certificate/index.php?code=1301643014DA",
  },
  {
    name: "Fortinet Certified Fundamentals in Cybersecurity",
    issuer: "Fortinet",
    date: "May 2025 — May 2027",
    credential: "https://training.fortinet.com/admin/tool/certificate/index.php?code=3272474919DA",
  },
  {
    name: "Foundational C# with Microsoft",
    issuer: "freeCodeCamp / Microsoft",
    date: "Jun 2025",
    credential: "https://www.freecodecamp.org/certification/daniel_est_03/foundational-c-sharp-with-microsoft",
  },
  {
    name: "Oracle Cloud 2025 Certified AI Foundations Associate",
    issuer: "Oracle University",
    date: "Oct 2025 — Oct 2027",
    credential:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=813EDF5358C156BEB66A7E82B9918C06E8BCC2D3A837D789ED28949EE929689D",
  },
  {
    name: "NC2: Computer Systems Servicing",
    issuer: "TESDA",
    date: "Jul 2022 — Jul 2027",
  },
];


interface SkillSet {
  Backend: string[];
  Databases: string[];
  Frontend: string[];
  "DevOps & Tools": string[];
  Languages: string[];
  [key: string]: string[];
}

export const skills: SkillSet = {
  Backend: ["ASP.NET Core (C#)", ".NET Core", "Node.js", "Express.js", "REST APIs", "Microservices", "gRPC", "MVC"],
  Databases: ["PostgreSQL", "MariaDB", "MySQL", "MS SQL", "Redis"],
  Frontend: ["React", "Next.js", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"],
  "DevOps & Tools": ["Git", "GitHub", "JIRA", "Figma", "Visual Studio", "VS Code", "Vercel"],
  Languages: ["C#", "JavaScript", "TypeScript", "Python", "Java"],
};

export const skillBeltItems = [
  "ASP.NET Core",
  "C#",
  ".NET Core",
  "Node.js",
  "Express.js",
  "REST APIs",
  "Microservices",
  "gRPC",
  "MVC",
  "PostgreSQL",
  "MariaDB",
  "MySQL",
  "MS SQL",
  "Redis",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Bootstrap",
  "HTML5",
  "CSS3",
  "Git",
  "GitHub",
  "JIRA",
  "Figma",
  "Visual Studio",
  "VS Code",
  "Vercel",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
];


export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];
