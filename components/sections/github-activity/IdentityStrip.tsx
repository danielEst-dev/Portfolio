"use client";

import Image from "next/image";
import { MotionWrapper } from "@/components/motion-wrapper";
import type { ActivityData } from "./shared";

// Avatar + name + login + member-since + bio + status. The avatar is fetched
// from avatars.githubusercontent.com (allowed via images.remotePatterns in
// next.config.ts and by the CSP img-src). Replaces the raw <img> with next/image
// for automatic sizing/format negotiation without layout shift.
export function IdentityStrip({ identity }: { identity: ActivityData["identity"] }) {
  return (
    <MotionWrapper delay={0.05} className="mb-8">
      <div className="corner-bracket flex items-start gap-4 sm:gap-5 p-5 border border-border/60">
        <Image
          src={identity.avatarUrl}
          alt={identity.name ?? identity.login}
          width={56}
          height={56}
          loading="lazy"
          className="rounded-full border border-border/60 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg sm:text-xl font-medium text-foreground truncate">
              {identity.name ?? identity.login}
            </h3>
            <span className="font-mono text-xs text-muted-foreground">
              @{identity.login}
            </span>
            <span className="text-xs text-muted-foreground">
              · on GitHub since {identity.memberSince}
            </span>
            {identity.isHireable && (
              <span className="text-[10px] font-medium uppercase tracking-wider text-accent border border-accent/40 px-1.5 py-0.5">
                Open to work
              </span>
            )}
          </div>
          {identity.bio && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 line-clamp-2">
              {identity.bio}
            </p>
          )}
          {identity.status && (
            <p className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center gap-1.5">
              {identity.status.emoji && (
                <span className="text-base leading-none">
                  {identity.status.emoji}
                </span>
              )}
              {identity.status.message && (
                <span>{identity.status.message}</span>
              )}
              {identity.status.limited && (
                <span className="opacity-60">· limited availability</span>
              )}
            </p>
          )}
        </div>
      </div>
    </MotionWrapper>
  );
}