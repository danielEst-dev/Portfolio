#!/usr/bin/env node
// Pre-commit hook guard. Reads the list of staged file paths from argv
// (passed by the `simple-git-hooks` config in package.json) and greps
// each one for known secret prefixes. Exits non-zero on the first match.
//
// Extend the SECRETS array when adding new token types.

import { readFileSync, statSync } from "node:fs";

const SECRETS = [
  // Vercel OIDC tokens are JWTs starting with eyJ. Match the prefix only
  // to avoid false positives on prose that happens to contain the
  // substring (e.g. documentation). Anywhere we write a real token the
  // assignment will be `...=eyJ...` which the regex catches.
  { name: "Vercel OIDC token (eyJ...)", re: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  // Resend API keys
  { name: "Resend API key (re_...)", re: /re_[A-Za-z0-9]{24,}/ },
  // Upstash Redis REST tokens. Require an assignment/value boundary
  // (start of line, whitespace, `=`, or quote) on each side so we don't
  // match `AX` substrings inside base64-encoded `sha512-` integrity
  // hashes in package-lock.json. Real tokens also use `_` and `-` in
  // the body, so the character class includes those.
  { name: "Upstash token (AX...)", re: /(?:^|[="'\s])AX[A-Za-z0-9_-]{32,}(?:["'\s]|$)/m },
  // GitHub personal access tokens (classic and fine-grained)
  { name: "GitHub PAT (ghp_/gho_/ghu_/ghs_/ghr_)", re: /gh[pousr]_[A-Za-z0-9]{36,}/ },
  // AWS access key IDs
  { name: "AWS access key (AKIA...)", re: /AKIA[0-9A-Z]{16}/ },
];

const files = process.argv.slice(2);

if (files.length === 0) {
  // Nothing staged — nothing to check.
  process.exit(0);
}

let failed = false;

for (const file of files) {
  // Skip deleted paths and any non-regular file (symlinks, etc.)
  let stat;
  try {
    stat = statSync(file);
  } catch {
    continue;
  }
  if (!stat.isFile()) continue;

  // Only text files worth scanning. Skip anything in public/, .next/,
  // node_modules/, and binary files.
  if (
    file.startsWith("node_modules/") ||
    file.startsWith(".next/") ||
    file.startsWith("public/") ||
    file.startsWith("out/") ||
    file.startsWith(".git/")
  ) {
    continue;
  }

  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const { name, re } of SECRETS) {
    if (re.test(content)) {
      console.error(`\n  ✗ ${name} detected in ${file}\n`);
      console.error("  Aborting commit. Remove the secret, rotate it in the");
      console.error("  service's dashboard, and try again.\n");
      failed = true;
      break;
    }
  }
}

if (failed) process.exit(1);
process.exit(0);
