import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

class ScriptError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScriptError';
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const DEFAULT_OUT_PATH = path.resolve(repoRoot, 'docs', 'placeholder-report.md');

const EXCLUDED_REL_PATHS = new Set([
  'docs/placeholder-report.md',
  'scripts/placeholder-scan.js',
]);

const EXCLUDED_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'playwright-report',
  'test-results',
  'coverage',
  '.git',
]);

const EXCLUDED_FILE_NAMES = new Set([
  'package-lock.json',
]);

const INCLUDED_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.md',
  '.sql',
  '.yml',
  '.yaml',
  '.json',
]);

const JS_TS_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx']);

function normalizeReportForCompare(md) {
  return md.replace(/^Generated: `[^`]*`\s*$/m, 'Generated: `<generated>`').trim();
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = {
    outPath: DEFAULT_OUT_PATH,
    check: false,
    write: true,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--out') {
      const val = args[i + 1];
      if (!val) throw new ScriptError('--out requires a value');
      out.outPath = path.resolve(repoRoot, val);
      i++;
      continue;
    }
    if (a === '--check') {
      out.check = true;
      out.write = false;
      continue;
    }
    if (a === '--no-write') {
      out.write = false;
      continue;
    }
    if (a === '--help' || a === '-h') {
      console.log(`Usage: node scripts/placeholder-scan.js [--out <path>] [--check] [--no-write]\n`);
      process.exit(0);
    }
    throw new ScriptError(`Unknown arg: ${a}`);
  }

  return out;
}

const MATCHERS = [
  { id: 'todo', label: 'TODO', re: /\bTODO\b/i, severity: 'P2' },
  { id: 'fixme', label: 'FIXME', re: /\bFIXME\b/i, severity: 'P1' },
  { id: 'hack', label: 'HACK', re: /\bHACK\b/i, severity: 'P1' },
  { id: 'xxx', label: 'XXX', re: /\bXXX\b/i, severity: 'P1' },
  { id: 'tbd', label: 'TBD', re: /\bTBD\b/i, severity: 'P2' },
  { id: 'wip', label: 'WIP', re: /\bWIP\b/i, severity: 'P2' },
  { id: 'stub', label: 'stub', re: /\bstub\b/i, severity: 'P1' },
  { id: 'not_implemented', label: 'not implemented', re: /not[\s-]?implemented/i, severity: 'P0' },
  {
    id: 'throw_new_error',
    label: 'throw new Error',
    re: /throw\s+new\s+Error\(([^)]*)\)/i,
    severity: 'P2',
  },
  { id: 'placeholder_word', label: 'placeholder', re: /\bplaceholder\b/i, severity: 'P2' },
];

function isCommentLikeLine(line) {
  const trimmed = line.trim();
  // JS/TS
  if (trimmed.startsWith('//')) return true;
  if (trimmed.startsWith('/*') || trimmed.startsWith('*')) return true;
  // SQL
  if (trimmed.startsWith('--')) return true;
  // MD/HTML-ish
  if (trimmed.startsWith('<!--')) return true;
  return false;
}

function markerAppearsInTrailingComment(line, markerIndex) {
  const tokens = ['//', '/*', '--', '<!--'];
  for (const t of tokens) {
    const idx = line.indexOf(t);
    if (idx >= 0 && markerIndex > idx) return true;
  }
  return false;
}

function shouldIgnoreMatch({ matcher, line, relPath }) {
  const trimmed = line.trim();
  const isDocsLike = relPath.startsWith('docs/') || relPath.endsWith('.md');

  const matcherId = matcher.id;

  if (matcherId === 'not_implemented' && isDocsLike) return true;

  // Only treat these as placeholders when they appear as marker comments.
  if (
    matcherId === 'todo' ||
    matcherId === 'fixme' ||
    matcherId === 'hack' ||
    matcherId === 'xxx' ||
    matcherId === 'tbd' ||
    matcherId === 'wip' ||
    matcherId === 'stub'
  ) {
    if (isCommentLikeLine(trimmed)) return false;
    const markerIndex = line.search(matcher.re);
    if (markerIndex >= 0 && markerAppearsInTrailingComment(line, markerIndex)) return false;
    return true;
  }

  // Ignore normal UI placeholders (JSX/HTML props)
  if (matcherId === 'placeholder_word') {
    // In docs, the word "placeholder" is often descriptive and not a stub marker.
    if (isDocsLike) return true;
    if (/\bplaceholder\s*=/.test(trimmed)) return true;
    // TS/JS identifiers / props (e.g. placeholder?: string)
    if (/\bplaceholder\s*\??\s*:/.test(trimmed)) return true;
    // Query selectors that look for placeholder attributes
    if (/\bplaceholder\*?=/.test(trimmed)) return true;
    // Tailwind placeholder variants (e.g. placeholder:text-muted-foreground)
    if (/\bplaceholder:/.test(trimmed)) return true;
    // Accessibility strings like aria-label="Image placeholder ..." are not stubs
    if (/\baria-label\b/i.test(trimmed)) return true;
    if (/\bincludeAssets\b/.test(trimmed)) return true;
    if (/\/placeholder\.[a-z0-9]+/i.test(trimmed)) return true;
  }

  return false;
}

function classifyThrowSeverity(line) {
  const trimmed = line.trim();
  const m = trimmed.match(/throw\s+new\s+Error\(([^)]*)\)/i);
  const arg = (m?.[1] ?? '').trim();
  if (!arg) return 'P1';

  const unquoted = arg.replace(/^['"`]/, '').replace(/['"`]$/, '');
  if (/not[\s-]?implemented/i.test(unquoted)) return 'P0';
  if (/todo|tbd|wip|stub|placeholder/i.test(unquoted)) return 'P1';
  return 'P2';
}

function extractThrowMessage(line) {
  const trimmed = line.trim();
  const m = trimmed.match(/throw\s+new\s+Error\(([^)]*)\)/i);
  const arg = (m?.[1] ?? '').trim();
  if (!arg) return null;
  return arg.replace(/^['"`]/, '').replace(/['"`]$/, '');
}

function severityRank(sev) {
  if (sev === 'P0') return 0;
  if (sev === 'P1') return 1;
  return 2;
}

async function listFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIR_NAMES.has(entry.name)) continue;
      out.push(...(await listFiles(full)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (EXCLUDED_FILE_NAMES.has(entry.name)) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!INCLUDED_EXTS.has(ext)) continue;

    const rel = path.relative(repoRoot, full).replaceAll('\\', '/');
    if (EXCLUDED_REL_PATHS.has(rel)) continue;

    out.push(full);
  }
  return out;
}

function computePlan(filePath, label) {
  const rel = path.relative(repoRoot, filePath).replaceAll('\\', '/');
  const isTest = /(^|\/)src\/(test|__tests__)\//.test(rel) || rel.endsWith('.test.ts') || rel.endsWith('.test.tsx');
  const isDocs = rel.startsWith('docs/');

  if (isDocs) {
    return 'Update documentation to remove the placeholder marker or replace it with final, actionable guidance.';
  }
  if (isTest) {
    return 'If this is an intentional test sentinel, replace placeholder wording with an explicit assertion message; otherwise, implement the missing behavior and expand test coverage.';
  }

  if (label === 'not implemented') {
    return 'Implement the missing behavior (no placeholder branches). Add validation + user-safe error handling for expected failure cases.';
  }

  if (label.includes('throw new Error')) {
    return 'Audit this throw: if it is reachable via normal user flows, replace with user-safe handling (toasts/UI error state) and keep throws only for truly impossible states. Add tests for both success and failure paths.';
  }

  return 'Replace placeholder marker with a complete implementation. Add tests covering the missing behavior and edge cases.';
}

function computeTests(filePath) {
  const rel = path.relative(repoRoot, filePath).replaceAll('\\', '/');
  if (rel.startsWith('src/lib/')) return 'Add/extend unit tests (Vitest) for the affected module.';
  if (rel.startsWith('src/pages/') || rel.startsWith('src/components/')) return 'Add/extend integration/e2e tests (Playwright) covering the affected flow.';
  if (rel.startsWith('supabase/migrations/')) return 'Add a migration verification step (SQL smoke check) and ensure the UI path is covered by an integration test.';
  return 'Add tests appropriate to the affected subsystem (unit for logic, e2e for user flows).';
}

function toFindingSummary(matches) {
  const labels = [];

  const throwMatches = matches.filter((m) => m.label === 'throw new Error');
  const nonThrowLabels = Array.from(new Set(matches.filter((m) => m.label !== 'throw new Error').map((m) => m.label)));
  labels.push(...nonThrowLabels);

  if (throwMatches.length > 0) {
    const firstMsg = extractThrowMessage(throwMatches[0].line);
    const msgPart = firstMsg ? `: ${firstMsg.length > 60 ? `${firstMsg.slice(0, 57)}...` : firstMsg}` : '';
    const countPart = throwMatches.length > 1 ? ` (x${throwMatches.length})` : '';
    labels.push(`throw new Error${countPart}${msgPart}`);
  }

  return labels.join(', ');
}

async function scanFile(filePath) {
  let text;
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch {
    return [];
  }

  const lines = text.split(/\r?\n/);
  const hits = [];

  const relPath = path.relative(repoRoot, filePath).replaceAll('\\', '/');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const matcher of MATCHERS) {
      if (!matcher.re.test(line)) continue;
      if (shouldIgnoreMatch({ matcher, line, relPath })) continue;

      const severity = matcher.id === 'throw_new_error' ? classifyThrowSeverity(line) : matcher.severity;

      hits.push({
        filePath,
        lineNumber: i + 1,
        line: line.trimEnd(),
        label: matcher.label,
        severity,
      });
    }
  }

  // Heuristic: empty function bodies in JS/TS often indicate stubs.
  const ext = path.extname(filePath).toLowerCase();
  if (JS_TS_EXTS.has(ext)) {
    const patterns = [
      { label: 'empty function body', re: /function\s+([A-Za-z0-9_$]+)\s*\([^)]*\)\s*{\s*}/g },
      {
        label: 'empty arrow function body',
        re: /\b(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z0-9_$]+)\s*=>\s*{\s*}/g,
      },
    ];

    for (const p of patterns) {
      let match;
      while ((match = p.re.exec(text)) !== null) {
        const before = text.slice(0, match.index);
        const lineNumber = before.split(/\r?\n/).length;
        hits.push({
          filePath,
          lineNumber,
          line: match[0],
          label: p.label,
          severity: 'P2',
        });
      }
    }
  }

  return hits;
}

function groupHits(hits) {
  const byFile = new Map();
  for (const h of hits) {
    const rel = path.relative(repoRoot, h.filePath).replaceAll('\\', '/');
    if (!byFile.has(rel)) byFile.set(rel, []);
    byFile.get(rel).push({ ...h, relPath: rel });
  }

  const findings = [];

  for (const [relPath, fileHits] of byFile.entries()) {
    fileHits.sort((a, b) => a.lineNumber - b.lineNumber);

    let current = null;
    for (const hit of fileHits) {
      if (!current) {
        current = {
          relPath,
          startLine: hit.lineNumber,
          endLine: hit.lineNumber,
          matches: [hit],
        };
        continue;
      }

      if (hit.lineNumber <= current.endLine + 2) {
        current.endLine = hit.lineNumber;
        current.matches.push(hit);
        continue;
      }

      findings.push(current);
      current = {
        relPath,
        startLine: hit.lineNumber,
        endLine: hit.lineNumber,
        matches: [hit],
      };
    }

    if (current) findings.push(current);
  }

  // Merge throw-only clusters per file into a single finding to keep the report readable.
  const byFileFinding = new Map();
  for (const f of findings) {
    if (!byFileFinding.has(f.relPath)) byFileFinding.set(f.relPath, []);
    byFileFinding.get(f.relPath).push(f);
  }

  const mergedFindings = [];
  for (const [relPath, fileFindings] of byFileFinding.entries()) {
    const throwOnly = fileFindings.filter((f) => f.matches.every((m) => m.label === 'throw new Error'));
    const other = fileFindings.filter((f) => !f.matches.every((m) => m.label === 'throw new Error'));

    if (throwOnly.length > 0) {
      const allThrowMatches = throwOnly
        .flatMap((f) => f.matches)
        .sort((a, b) => a.lineNumber - b.lineNumber);

      mergedFindings.push({
        relPath,
        startLine: allThrowMatches[0].lineNumber,
        endLine: allThrowMatches[allThrowMatches.length - 1].lineNumber,
        matches: allThrowMatches,
      });
    }

    mergedFindings.push(...other);
  }

  // Compute finding-level severity
  return mergedFindings
    .map((f) => {
      const mostSevere = f.matches.reduce((acc, m) => (severityRank(m.severity) < severityRank(acc) ? m.severity : acc), 'P2');
      const isDocsLike = f.relPath.startsWith('docs/') || f.relPath.endsWith('.md');
      return {
        ...f,
        severity: isDocsLike && (mostSevere === 'P0' || mostSevere === 'P1') ? 'P2' : mostSevere,
        summary: toFindingSummary(f.matches),
      };
    })
    .sort((a, b) => {
      const s = severityRank(a.severity) - severityRank(b.severity);
      if (s !== 0) return s;
      if (a.relPath !== b.relPath) return a.relPath.localeCompare(b.relPath);
      return a.startLine - b.startLine;
    });
}

function mdEscape(s) {
  return s.replaceAll('|', '\\|');
}

function formatMarkdown(findings) {
  const generatedAt = new Date().toISOString();

  const counts = { P0: 0, P1: 0, P2: 0 };
  for (const f of findings) counts[f.severity]++;

  const lines = [];
  lines.push(`# Placeholder Report`);
  lines.push('');
  lines.push(`Generated: ${'`'}${generatedAt}${'`'}`);
  lines.push('');
  lines.push('This report is generated by `node scripts/placeholder-scan.js`.');
  lines.push('');
  lines.push(`Summary:`);
  lines.push('');
  lines.push(`- **P0**: ${counts.P0}`);
  lines.push(`- **P1**: ${counts.P1}`);
  lines.push(`- **P2**: ${counts.P2}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  lines.push('| Severity | File | Lines | What | Replacement plan | Tests needed |');
  lines.push('|---:|---|---:|---|---|---|');

  for (const f of findings) {
    const file = `${'`'}${f.relPath}${'`'}`;
    const lineRange = f.startLine === f.endLine ? `${f.startLine}` : `${f.startLine}-${f.endLine}`;
    const what = mdEscape(f.summary);
    const plan = mdEscape(computePlan(path.resolve(repoRoot, f.relPath), what));
    const tests = mdEscape(computeTests(path.resolve(repoRoot, f.relPath)));
    lines.push(`| **${f.severity}** | ${file} | ${lineRange} | ${what} | ${plan} | ${tests} |`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- This scan is conservative and may include some intentional sentinel strings (especially in docs/tests).');
  lines.push('- The goal for release is **zero placeholder markers** in production code paths.');
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const opts = parseArgs(process.argv);

  const files = await listFiles(repoRoot);
  const allHits = [];

  for (const filePath of files) {
    const hits = await scanFile(filePath);
    allHits.push(...hits);
  }

  const findings = groupHits(allHits);
  const md = formatMarkdown(findings);

  const hasBlockingFindings = findings.some((f) => f.severity === 'P0' || f.severity === 'P1');

  if (opts.check) {
    let existing = null;
    try {
      existing = await fs.readFile(opts.outPath, 'utf8');
    } catch {
      // If the report doesn't exist, treat it as out of date.
    }

    const reportOutOfDate = normalizeReportForCompare(existing ?? '') !== normalizeReportForCompare(md);
    if (reportOutOfDate) {
      console.error(`Placeholder report is out of date. Re-generate with: node scripts/placeholder-scan.js --out ${path.relative(repoRoot, opts.outPath)}`);
    }

    if (hasBlockingFindings) {
      console.error('Blocking placeholder findings detected (P0/P1).');
    }

    if (reportOutOfDate || hasBlockingFindings) process.exit(1);
    return;
  }

  if (opts.write) {
    await fs.mkdir(path.dirname(opts.outPath), { recursive: true });
    await fs.writeFile(opts.outPath, md, 'utf8');
    console.log(`Wrote ${path.relative(repoRoot, opts.outPath)}`);
  } else {
    console.log(md);
  }
}

await main();
