/**
 * Phase 0 data-integrity gate (see AGENTS.md rebuild brief §0.2).
 *
 * Runs before every build via `prebuild`. Scans every content module for
 * unresolved template tokens and format violations, and fails the build
 * (non-zero exit) the moment it finds one. The previous build shipped
 * unrendered `{{TOKEN}}` strings to production and broke every phone and
 * WhatsApp link on the site — this exists so that failure mode is
 * structurally impossible: broken data does not compile.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const TOKEN_PATTERN = /\{\{|\}\}|TODO|TBD|XXX|LOREM/i;
const PHONE_PATTERN = /^\+91[6-9]\d{9}$/;
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/;
const STALE_STOCK_DAYS = 14;

interface Violation {
  file: string;
  message: string;
}

const violations: Violation[] = [];

function listContentFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listContentFiles(full);
      if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) return [full];
      return [];
    });
}

function checkTokens(file: string, source: string) {
  source.split("\n").forEach((line, i) => {
    // Skip comment lines (// and /** */ blocks) — this scans content values,
    // not prose that documents the gate's own pattern.
    if (/^\s*(\/\/|\/\*|\*)/.test(line)) return;
    if (TOKEN_PATTERN.test(line)) {
      violations.push({
        file: `${file}:${i + 1}`,
        message: `unresolved template token or marker found: ${line.trim().slice(0, 100)}`,
      });
    }
  });
}

function checkEntityFormats(file: string, source: string) {
  const phoneMatches = [...source.matchAll(/(phoneE164|whatsappE164)\s*:\s*"([^"]*)"/g)];
  for (const [, field, value] of phoneMatches) {
    if (TOKEN_PATTERN.test(value)) continue; // already reported by checkTokens
    if (!PHONE_PATTERN.test(value)) {
      violations.push({ file, message: `${field} "${value}" does not match /^\\+91[6-9]\\d{9}$/` });
    }
  }

  const gstinMatches = [...source.matchAll(/gstin\s*:\s*"([^"]*)"/g)];
  for (const [, value] of gstinMatches) {
    if (TOKEN_PATTERN.test(value)) continue;
    if (!GSTIN_PATTERN.test(value)) {
      violations.push({ file, message: `gstin "${value}" does not match the 15-character GSTIN pattern` });
    }
  }

  const yearMatches = [...source.matchAll(/(partnershipYear|established)\s*:\s*(-?\d+)/g)];
  for (const [, field, value] of yearMatches) {
    if (Number(value) <= 0) {
      violations.push({ file, message: `${field} is ${value} — must be a real positive year` });
    }
  }

  const geoMatches = [...source.matchAll(/geo\s*:\s*\{\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+)\s*\}/g)];
  for (const [, lat, lng] of geoMatches) {
    if (Number(lat) === 0 && Number(lng) === 0) {
      violations.push({ file, message: `geo coordinates are {0, 0} — not a real location` });
    }
  }
}

function checkStockFreshness(file: string, source: string) {
  const checkedAtMatches = [...source.matchAll(/stockCheckedAt\s*:\s*"([^"]*)"/g)];
  for (const [, value] of checkedAtMatches) {
    const checkedAt = new Date(value);
    if (Number.isNaN(checkedAt.getTime())) {
      violations.push({ file, message: `stockCheckedAt "${value}" is not a valid date` });
      continue;
    }
    const ageDays = (Date.now() - checkedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > STALE_STOCK_DAYS) {
      violations.push({
        file,
        message: `stockCheckedAt "${value}" is ${Math.floor(ageDays)} days old — exceeds the ${STALE_STOCK_DAYS}-day freshness limit`,
      });
    }
  }
}

function checkStatsAndCounters(file: string, source: string) {
  const statMatches = [...source.matchAll(/(years|count|value|stat)\s*:\s*(0|null|undefined)\b/g)];
  for (const [, field, value] of statMatches) {
    violations.push({ file, message: `${field} is ${value} — a stat, counter, or timeline value must not be null/zero` });
  }
}

function checkUnresolvedHrefs(file: string, source: string) {
  const hrefMatches = [...source.matchAll(/href\s*=\s*[`"']([^`"']*\$\{[^`"']*)[`"']/g)];
  for (const [, value] of hrefMatches) {
    violations.push({ file, message: `href contains an unresolved expression: ${value}` });
  }
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`[validate-content] content directory not found: ${CONTENT_DIR}`);
    process.exit(1);
  }

  const files = listContentFiles(CONTENT_DIR);
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const rel = path.relative(process.cwd(), file);
    checkTokens(rel, source);
    checkEntityFormats(rel, source);
    checkStockFreshness(rel, source);
    checkStatsAndCounters(rel, source);
    checkUnresolvedHrefs(rel, source);
  }

  if (violations.length > 0) {
    console.error(`\n[validate-content] FAILED — ${violations.length} violation(s):\n`);
    for (const v of violations) {
      console.error(`  ${v.file}\n    ${v.message}\n`);
    }
    console.error("Fix every violation above before building. See AGENTS.md Phase 0 for the rule set.\n");
    process.exit(1);
  }

  console.log(`[validate-content] OK — ${files.length} content file(s) clean.`);
}

main();
