#!/usr/bin/env node
// LinkHavoc dependency-free build.
//   node scripts/build.mjs            -> validate refs, emit dist/
//   node scripts/build.mjs --check    -> validate refs only
//
// It has no dependencies on purpose: the site is static, so the "build" is
// validation (every local href/src/file reference resolves) plus a clean copy
// of the deployable files into dist/ so Vercel has a stable output directory.

import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const ONLY_CHECK = process.argv.includes("--check");

// --- asset reference collection -------------------------------------------------

const HTML_REF_REGEX = /(?:src|href)=["']([^"'#][^"']*?)["']|(?:og:image|twitter:image)[^>]*?\bcontent=["']([^"'#][^"']*?)["']/g;
const CSS_URL_REGEX = /url\((["']?)([^"')]+?)\1\)/g;

function collectRefs(file) {
  const text = readFileSync(file, "utf8");
  const refs = [];
  if (file.endsWith(".html")) {
    for (const match of text.matchAll(HTML_REF_REGEX)) {
      // Group 1 = src/href value, group 2 = og/twitter content value.
      if (match[1]) refs.push(match[1]);
      if (match[2]) refs.push(match[2]);
    }
  } else {
    for (const match of text.matchAll(css_url_regex())) {
      refs.push(match[2]);
    }
  }
  return refs;
}

// Kept as a function so matchAll can re-read the global flag without a shared
// cursor object.
function css_url_regex() {
  return /url\((["']?)([^"')]+?)\1\)/g;
}

function isLocal(ref) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(ref)) return false; // absolute URL / scheme
  if (ref.startsWith("//")) return false;
  if (ref.startsWith("#")) return false;
  return true;
}

function resolveRef(ref, fromFile) {
  // Strip query/hash segments before resolving.
  const cleaned = ref.split(/[?#]/)[0];
  if (!cleaned) return null;
  return resolve(dirname(fromFile), cleaned);
}

const KEEP = new Set([
  ".gitignore",
  ".env.example",
  "LICENSE.md",
]);

// --- copy helpers ----------------------------------------------------------------

function copyTree(src, dest) {
  const stat = statSync(src);
  if (stat.isFile()) {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
    return;
  }
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    if (entry === ".git" || entry === "node_modules" || entry === "dist") continue;
    if (entry.startsWith(".") && !KEEP.has(entry)) continue;
    copyTree(join(src, entry), join(dest, entry));
  }
}

// --- main program ----------------------------------------------------------------

const htmlFiles = ["index.html", "privacy.html"].map((f) => join(root, f));
const cssFiles = ["style.css", "reset.css"].map((f) => join(root, "css", f));
const allFiles = [...htmlFiles, ...cssFiles];

const problems = [];
const copies = [];

for (const file of allFiles) {
  for (const fileRef of collectRefs(file)) {
    if (!isLocal(fileRef)) continue;
    const abs = resolveRef(fileRef, file);
    if (!abs) continue;
    const from = normalize(file).replace(root + sep, "");
    if (!statSyncSafe(abs)) {
      problems.push(`${from} -> ${fileRef} (missing at ${abs})`);
    } else if (!ONLY_CHECK) {
      copies.push([abs, abs.slice(root.length + 1)]);
    }
  }
}

function statSyncSafe(p) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

if (problems.length) {
  console.error("LinkHavoc build: broken local references");
  for (const p of problems) console.error(`  ! ${p}`);
  process.exit(1);
}

if (ONLY_CHECK) {
  console.log(`LinkHavoc check: OK — ${allFiles.length} files scanned, no broken local refs.`);
  process.exit(0);
}

// Emit dist/.
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

copyTree(join(root, "index.html"), join(dist, "index.html"));
copyTree(join(root, "privacy.html"), join(dist, "privacy.html"));

if (statSyncSafe(join(root, "robots.txt"))) {
  copyTree(join(root, "robots.txt"), join(dist, "robots.txt"));
}

// Copy only the assets the pages actually reference (deduped).
for (const [abs, relPath] of copies) {
  const target = join(dist, relPath);
  const stat = statSyncSafe(abs);
  if (!stat) continue;
  if (stat.isFile()) {
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(abs, target);
  }
}

console.log(`LinkHavoc build: OK — ${problems.length} problems, ${copies.length} asset refs verified.`);
console.log(`Output: ${dist}`);