import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const migrationsDir = path.join(repoRoot, 'supabase', 'migrations');

class ScriptError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScriptError';
  }
}

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function loadEnv() {
  const envBase = parseEnvFile(path.join(repoRoot, '.env'));
  const envLocal = parseEnvFile(path.join(repoRoot, '.env.local'));
  const envFromFiles = {
    ...envLocal,
    ...envBase,
  };

  for (const [key, value] of Object.entries(envFromFiles)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  return {
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
}

function parseArgs(argv) {
  const opts = {
    showMissing: false,
    debugTable: null,
    check: false,
    checkIntegrityMigrations: false,
  };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--missing') {
      opts.showMissing = true;
      continue;
    }
    if (arg === '--debug-table') {
      opts.debugTable = args[i + 1] || null;
      i += 1;
      continue;
    }
    if (arg === '--check') {
      opts.check = true;
      continue;
    }
    if (arg === '--check-integrity-migrations') {
      opts.checkIntegrityMigrations = true;
      continue;
    }
  }
  return opts;
}

const TABLES = [
  {
    label: 'jobs',
    table: 'compendium_jobs',
    required: ['name', 'description', 'hit_die', 'primary_abilities', 'saving_throw_proficiencies'],
  },
  {
    label: 'job_paths',
    table: 'compendium_job_paths',
    required: ['name', 'description', 'job_id'],
  },
  {
    label: 'job_features',
    table: 'compendium_job_features',
    required: ['name', 'description', 'level', 'job_id'],
  },
  {
    label: 'powers',
    table: 'compendium_powers',
    required: ['name', 'power_level', 'casting_time', 'range', 'duration', 'description'],
  },
  {
    label: 'equipment',
    table: 'compendium_equipment',
    required: ['name', 'equipment_type', 'description'],
  },
  {
    label: 'relics',
    table: 'compendium_relics',
    required: ['name', 'rarity', 'item_type', 'description'],
  },
  {
    label: 'monsters',
    table: 'compendium_monsters',
    required: [
      'name',
      'size',
      'creature_type',
      'cr',
      'armor_class',
      'hit_points_average',
      'hit_points_formula',
      'str',
      'agi',
      'vit',
      'int',
      'sense',
      'pre',
    ],
  },
  {
    label: 'monster_actions',
    table: 'compendium_monster_actions',
    required: ['name', 'description', 'action_type', 'monster_id'],
  },
  {
    label: 'monster_traits',
    table: 'compendium_monster_traits',
    required: ['name', 'description', 'monster_id'],
  },
  {
    label: 'backgrounds',
    table: 'compendium_backgrounds',
    required: ['name', 'description'],
  },
  {
    label: 'conditions',
    table: 'compendium_conditions',
    required: ['name', 'description'],
  },
  {
    label: 'feats',
    table: 'compendium_feats',
    required: ['name', 'description'],
  },
  {
    label: 'skills',
    table: 'compendium_skills',
    required: ['name', 'description', 'ability'],
  },
  {
    label: 'monarchs',
    table: 'compendium_monarchs',
    required: ['name', 'title', 'theme', 'description', 'unlock_level'],
  },
  {
    label: 'monarch_features',
    table: 'compendium_monarch_features',
    required: ['name', 'description', 'level', 'monarch_id'],
  },
  {
    label: 'sovereigns',
    table: 'compendium_sovereigns',
    required: ['name', 'description', 'unlock_level'],
  },
  {
    label: 'sovereign_features',
    table: 'compendium_sovereign_features',
    required: ['name', 'description', 'level', 'sovereign_id'],
  },
  {
    label: 'runes',
    table: 'compendium_runes',
    required: ['name', 'description', 'effect_description', 'effect_type', 'rune_category', 'rune_type', 'rune_level', 'rarity'],
  },
  {
    label: 'shadow_soldiers',
    table: 'compendium_shadow_soldiers',
    required: [
      'name',
      'title',
      'rank',
      'description',
      'shadow_type',
      'hit_points',
      'armor_class',
      'speed',
      'str',
      'agi',
      'vit',
      'int',
      'sense',
      'pre',
    ],
  },
];

function isPresent(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

async function fetchAllRows(supabase, table, columns) {
  const pageSize = 1000;
  let from = 0;
  let all = [];

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns.join(','))
      .range(from, from + pageSize - 1);

    if (error) {
      throw new ScriptError(`Failed to fetch ${table}: ${error.message}`);
    }

    const chunk = data || [];
    all = all.concat(chunk);

    if (chunk.length < pageSize) break;
    from += pageSize;
  }

  return all;
}

function buildMarkdown({ generatedAt, sourceLabel, rows, notes, integrity }) {
  const lines = [];
  lines.push('# Compendium Coverage (Schema + Automation Readiness)');
  lines.push('');
  lines.push(`Generated: \`${generatedAt}\``);
  lines.push('');
  lines.push(`Source: \`${sourceLabel}\``);
  lines.push('');
  lines.push('## Coverage Summary');
  lines.push('');
  lines.push('| Type | Table | Total | Required Fields | Complete | Required % | Automation Readiness |');
  lines.push('|---|---|---:|---|---:|---:|---:|');

  const totalEntries = rows.reduce((sum, row) => sum + row.total, 0);
  const totalComplete = rows.reduce((sum, row) => sum + row.complete, 0);

  for (const row of rows) {
    const requiredList = row.required.join(', ');
    lines.push(
      `| ${row.label} | ${row.table} | ${row.total} | ${requiredList} | ${row.complete} | ${row.percent}% | ${row.percent}% |`
    );
  }

  lines.push('');
  lines.push('## Totals');
  lines.push('');
  lines.push(`- Total entries: ${totalEntries}`);
  lines.push(`- Entries meeting all required fields: ${totalComplete}`);
  lines.push(`- Overall required-field completeness: ${totalEntries > 0 ? Math.round((totalComplete / totalEntries) * 100) : 0}%`);
  lines.push('');
  lines.push('## Notes');
  lines.push('');
  for (const note of notes || []) {
    lines.push(`- ${note}`);
  }
  lines.push('- Required fields are derived from app automation usage and table schemas.');
  lines.push('- Automation readiness is the percent of entries with all required fields present.');
  lines.push('');

  if (integrity) {
    lines.push('## Integrity Checks');
    lines.push('');
    if (integrity.mode) {
      lines.push(`- Mode: \`${integrity.mode}\``);
    }
    lines.push(`- Result: ${integrity.passed ? '✅ PASS' : '❌ FAIL'}`);
    lines.push(`- Issues: ${integrity.issues.length}`);
    lines.push('');

    if (integrity.notes?.length) {
      lines.push('### Integrity Notes');
      lines.push('');
      for (const note of integrity.notes) {
        lines.push(`- ${note}`);
      }
      lines.push('');
    }

    if (integrity.issues.length) {
      lines.push('### Integrity Issues (sample)');
      lines.push('');
      const max = 50;
      for (const issue of integrity.issues.slice(0, max)) {
        const table = issue.table ? ` (${issue.table})` : '';
        lines.push(`- ${issue.message}${table}`);
      }
      if (integrity.issues.length > max) {
        lines.push(`- ...and ${integrity.issues.length - max} more`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function stripSqlComments(sql) {
  let out = '';
  let i = 0;
  let inSingle = false;
  let inDouble = false;

  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];

    if (!inSingle && !inDouble) {
      if (ch === '-' && next === '-') {
        i += 2;
        while (i < sql.length && sql[i] !== '\n') i++;
        continue;
      }
      if (ch === '/' && next === '*') {
        i += 2;
        while (i < sql.length - 1 && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
    }

    if (ch === "'" && !inDouble) {
      if (inSingle && next === "'") {
        out += ch + next;
        i += 2;
        continue;
      }
      inSingle = !inSingle;
      out += ch;
      i++;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      out += ch;
      i++;
      continue;
    }

    out += ch;
    i++;
  }

  return out;
}

function splitTopLevel(text, delimiterChar) {
  const parts = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        current += ch + next;
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      current += ch;
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      current += ch;
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      current += ch;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      current += ch;
      continue;
    }

    if (ch === '(') {
      parenDepth++;
      current += ch;
      continue;
    }

    if (ch === ')') {
      if (parenDepth > 0) parenDepth--;
      current += ch;
      continue;
    }

    if (ch === '[') {
      bracketDepth++;
      current += ch;
      continue;
    }

    if (ch === ']') {
      if (bracketDepth > 0) bracketDepth--;
      current += ch;
      continue;
    }

    if (ch === delimiterChar && parenDepth === 0 && bracketDepth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }

    current += ch;
  }

  if (current.trim().length > 0) {
    parts.push(current.trim());
  }

  return parts;
}

function findMatchingParen(text, openIndex) {
  let inSingle = false;
  let inDouble = false;
  let depth = 0;

  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '(') {
      depth++;
      continue;
    }

    if (ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }

  return -1;
}

function findStatementEnd(text, startIndex) {
  let inSingle = false;
  let inDouble = false;
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = startIndex; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '(') {
      parenDepth++;
      continue;
    }

    if (ch === ')') {
      if (parenDepth > 0) parenDepth--;
      continue;
    }

    if (ch === '[') {
      bracketDepth++;
      continue;
    }

    if (ch === ']') {
      if (bracketDepth > 0) bracketDepth--;
      continue;
    }

    if (ch === ';' && parenDepth === 0 && bracketDepth === 0) {
      return i;
    }
  }

  return -1;
}

function findKeywordOutside(text, keyword, startIndex = 0) {
  const lower = text.toLowerCase();
  const needle = keyword.toLowerCase();
  let inSingle = false;
  let inDouble = false;
  let parenDepth = 0;
  let bracketDepth = 0;

  for (let i = startIndex; i <= text.length - needle.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '(') {
      parenDepth++;
      continue;
    }

    if (ch === ')') {
      if (parenDepth > 0) parenDepth--;
      continue;
    }

    if (ch === '[') {
      bracketDepth++;
      continue;
    }

    if (ch === ']') {
      if (bracketDepth > 0) bracketDepth--;
      continue;
    }

    if (parenDepth > 0 || bracketDepth > 0) continue;

    if (lower.startsWith(needle, i)) {
      const before = i > 0 ? lower[i - 1] : ' ';
      const after = i + needle.length < lower.length ? lower[i + needle.length] : ' ';
      if (!/[a-z0-9_]/.test(before) && !/[a-z0-9_]/.test(after)) {
        return i;
      }
    }
  }

  return -1;
}

function splitUnionAll(text) {
  const lower = text.toLowerCase();
  const segments = [];
  let inSingle = false;
  let inDouble = false;
  let parenDepth = 0;
  let bracketDepth = 0;
  let start = 0;

  for (let i = 0; i <= text.length - 9; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '(') {
      parenDepth++;
      continue;
    }

    if (ch === ')') {
      if (parenDepth > 0) parenDepth--;
      continue;
    }

    if (ch === '[') {
      bracketDepth++;
      continue;
    }

    if (ch === ']') {
      if (bracketDepth > 0) bracketDepth--;
      continue;
    }

    if (parenDepth > 0 || bracketDepth > 0) continue;

    if (lower.startsWith('union all', i)) {
      const segment = text.slice(start, i).trim();
      if (segment.length > 0) segments.push(segment);
      i += 'union all'.length - 1;
      start = i + 1;
    }
  }

  const tail = text.slice(start).trim();
  if (tail.length > 0) segments.push(tail);

  return segments;
}

function parseColumns(text) {
  return splitTopLevel(text, ',').map((c) => c.replaceAll('"', '').trim());
}

function parseValuesSection(text) {
  const rows = [];
  let inSingle = false;
  let inDouble = false;
  let parenDepth = 0;
  let rowStart = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inSingle) {
      if (ch === "'" && next === "'") {
        i++;
        continue;
      }
      if (ch === "'") {
        inSingle = false;
      }
      continue;
    }

    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === "'") {
      inSingle = true;
      continue;
    }

    if (ch === '"') {
      inDouble = true;
      continue;
    }

    if (ch === '(') {
      if (parenDepth === 0) rowStart = i + 1;
      parenDepth++;
      continue;
    }

    if (ch === ')') {
      if (parenDepth > 0) parenDepth--;
      if (parenDepth === 0 && rowStart >= 0) {
        const rowText = text.slice(rowStart, i);
        rows.push(splitTopLevel(rowText, ','));
        rowStart = -1;
      }
      continue;
    }

    if (ch === ';' && parenDepth === 0) {
      break;
    }
  }

  return rows;
}

function parseSelectRows(text) {
  const rows = [];
  const clauses = splitUnionAll(text);

  for (const clause of clauses) {
    const selectIndex = findKeywordOutside(clause, 'select', 0);
    if (selectIndex === -1) continue;
    const fromIndex = findKeywordOutside(clause, 'from', selectIndex + 6);
    if (fromIndex === -1) continue;
    const listText = clause.slice(selectIndex + 6, fromIndex);
    const values = splitTopLevel(listText, ',');
    if (values.length > 0) rows.push(values);
  }

  return rows;
}

function parseStringLiteral(value) {
  const trimmed = value.trim();
  const match = trimmed.match(/^(?:e)?'(.*)'(?:\s*::[a-z0-9_]+)?$/is);
  if (match) return match[1].replace(/''/g, "'");

  const dollar = trimmed.match(/^\$([a-z0-9_]*)\$(.*)\$\1\$(?:\s*::[a-z0-9_]+)?$/is);
  if (dollar) return dollar[2];

  return null;
}

function parseSqlArrayOfStrings(value) {
  const trimmed = (value ?? '').trim();
  if (/^null$/i.test(trimmed)) return [];

  const match = trimmed.match(/^array\s*\[(.*?)\]\s*(?:::([a-z0-9_\[\]]+))?$/is);
  if (!match) return null;
  const inner = match[1].trim();
  if (!inner) return [];
  const parts = splitTopLevel(inner, ',');
  const out = [];
  for (const part of parts) {
    const literal = parseStringLiteral(part);
    if (literal === null) return null;
    out.push(literal);
  }
  return out;
}

function parseBraceArrayOfStrings(value) {
  const trimmed = (value ?? '').trim();
  const match = trimmed.match(/^'(.*)'\s*::\s*[a-z0-9_]+\[\]\s*$/is);
  if (!match) return null;
  const inner = match[1];
  const brace = inner.match(/^\{(.*)\}$/s);
  if (!brace) return null;
  const content = brace[1];
  if (!content) return [];

  const parts = splitTopLevel(content, ',');
  const out = [];
  for (const part of parts) {
    const p = String(part).trim();
    if (!p) continue;
    if (p.startsWith('"') && p.endsWith('"')) {
      out.push(p.slice(1, -1).replace(/\\"/g, '"'));
    } else {
      out.push(p);
    }
  }
  return out;
}

function extractNameEqualsLiteral(expr) {
  const text = String(expr ?? '');
  const match = text.match(/where\s+(?:"?name"?)\s*=\s*((?:e)?'(?:[^']|'')*')/i);
  if (!match) return null;
  return parseStringLiteral(match[1]);
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractTableAlias(selectText, tableName) {
  const table = escapeRegex(tableName);
  const match = String(selectText).match(new RegExp(`(?:\\b[a-z0-9_]+\\.)?${table}\\s+([a-z_][a-z0-9_]*)`, 'i'));
  return match?.[1] ?? null;
}

function extractNameForAlias(selectText, alias) {
  if (!alias) return null;
  const a = escapeRegex(alias);
  const match = String(selectText).match(new RegExp(`\\b${a}\\s*\\.\\s*\\"?name\\"?\\s*=\\s*((?:e)?'(?:[^']|'')*')`, 'i'));
  if (!match) return null;
  return parseStringLiteral(match[1]);
}

function extractBareWhereName(selectText) {
  const match = String(selectText).match(/where\s+(?:\"?name\"?)\s*=\s*((?:e)?'(?:[^']|'')*')/i);
  if (!match) return null;
  return parseStringLiteral(match[1]);
}

function isAliasIdExpression(expr, alias) {
  if (!expr || !alias) return false;
  const a = escapeRegex(alias);
  return new RegExp(`^\\s*${a}\\s*\\.\\s*\\"?id\\"?\\s*(?:\\:\\:[a-z0-9_]+)?\\s*$`, 'i').test(String(expr));
}

function inferJobAndPathFromSelect(selectText) {
  const jobAlias = extractTableAlias(selectText, 'compendium_jobs');
  const pathAlias = extractTableAlias(selectText, 'compendium_job_paths');
  const jobName = extractNameForAlias(selectText, jobAlias) || (pathAlias ? null : extractBareWhereName(selectText));
  const pathName = extractNameForAlias(selectText, pathAlias);
  return {
    jobAlias,
    pathAlias,
    jobName,
    pathName,
  };
}

function isConflictNameRow(row) {
  if (!Array.isArray(row) || row.length !== 1) return false;
  const first = row[0];
  return typeof first === 'string' && first.trim().toLowerCase() === 'name';
}

function isPresentSqlValue(value) {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return false;
  if (/^null$/i.test(trimmed)) return false;

  const literal = parseStringLiteral(trimmed);
  if (literal !== null) {
    return literal.trim().length > 0;
  }

  if (/^''(::[a-z0-9_]+)?$/i.test(trimmed)) return false;

  return true;
}

function extractTableName(statement) {
  const match = statement.match(/insert\s+into\s+([a-z0-9_.\"]+)/i);
  if (!match) return null;
  const rawName = match[1].replaceAll('"', '');
  const tableName = rawName.includes('.') ? rawName.split('.').pop() : rawName;
  if (!TABLES.some((t) => t.table === tableName)) return null;
  return tableName;
}

function parseInsertStatement(statement, tableName) {
  const match = statement.match(/insert\s+into\s+([a-z0-9_.\"]+)/i);
  if (!match) return null;
  const table = tableName || extractTableName(statement);
  if (!table) return null;

  const tableRef = match[1].replaceAll('"', '');
  const tableIndex = statement.toLowerCase().indexOf(tableRef.toLowerCase(), match.index || 0);
  const openIndex = statement.indexOf('(', tableIndex + tableRef.length);
  if (openIndex === -1) return null;
  const closeIndex = findMatchingParen(statement, openIndex);
  if (closeIndex === -1) return null;

  const columnsText = statement.slice(openIndex + 1, closeIndex);
  const columns = parseColumns(columnsText);
  if (columns.length === 0) return null;

  const remainder = statement.slice(closeIndex + 1);
  const valuesIndex = findKeywordOutside(remainder, 'values', 0);
  const selectIndex = findKeywordOutside(remainder, 'select', 0);

  if (valuesIndex !== -1 && (selectIndex === -1 || valuesIndex < selectIndex)) {
    const rows = parseValuesSection(remainder.slice(valuesIndex + 6));
    return { table, columns, rows, mode: 'values' };
  }

  if (selectIndex !== -1) {
    const selectText = remainder.slice(selectIndex);
    const rows = parseSelectRows(selectText);
    return { table, columns, rows, mode: 'select', selectText };
  }

  return null;
}

function extractInsertStatements(sql) {
  const statements = [];
  let index = 0;

  while (index < sql.length) {
    const found = findKeywordOutside(sql, 'insert', index);
    if (found === -1) break;

    let j = found + 'insert'.length;
    while (j < sql.length && /\s/.test(sql[j])) j++;
    if (!sql.slice(j, j + 4).toLowerCase().startsWith('into')) {
      index = found + 1;
      continue;
    }

    const end = findStatementEnd(sql, found);
    if (end === -1) break;

    statements.push(sql.slice(found, end + 1));
    index = end + 1;
  }

  return statements;
}

function collectCoverageFromMigrations({ includeMissing, debugTable } = {}) {
  if (!fs.existsSync(migrationsDir)) {
    throw new ScriptError('Supabase migrations directory not found.');
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const results = TABLES.map((table) => ({
    label: table.label,
    table: table.table,
    required: table.required,
    total: 0,
    complete: 0,
  }));

  const tableMap = new Map(results.map((row) => [row.table, row]));
  let parsedStatements = 0;
  let skippedStatements = 0;
  const missingByTable = new Map();

  for (const file of files) {
    const raw = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const cleaned = stripSqlComments(raw);
    const statements = extractInsertStatements(cleaned);

    for (const statement of statements) {
      const tableName = extractTableName(statement);
      if (!tableName) continue;

      const parsed = parseInsertStatement(statement, tableName);
      if (!parsed || parsed.rows.length === 0) {
        skippedStatements += 1;
        continue;
      }

      const entry = tableMap.get(tableName);
      if (!entry) continue;

      parsedStatements += 1;

      if (debugTable && tableName === debugTable) {
        const sampleRow = parsed.rows[0] || [];
        console.log(`\n[debug] ${file} ${tableName} columns=${parsed.columns.length} row0=${sampleRow.slice(0, 6).join(' | ')}`);
        const odd = parsed.rows.find((row) => {
          const first = row[0];
          return typeof first === 'string' && first.trim() === 'name';
        });
        if (odd) {
          console.log(`[debug] ${file} ${tableName} row with first='name': ${odd.slice(0, 6).join(' | ')}`);
        }
      }

      const isMonsterBulkInsert =
        parsed.mode === 'select' &&
        (tableName === 'compendium_monster_actions' || tableName === 'compendium_monster_traits');

      if (isMonsterBulkInsert) {
        const sampleRow = parsed.rows[0] || [];
        const missingFields = [];
        for (const field of entry.required) {
          const idx = parsed.columns.findIndex((col) => col.toLowerCase() === field.toLowerCase());
          if (idx === -1 || !isPresentSqlValue(sampleRow[idx])) {
            missingFields.push(field);
          }
        }

        const monsterCount = tableMap.get('compendium_monsters')?.total ?? parsed.rows.length;
        entry.total += monsterCount;
        if (missingFields.length === 0) {
          entry.complete += monsterCount;
        } else if (includeMissing) {
          if (!missingByTable.has(entry.table)) missingByTable.set(entry.table, []);
          missingByTable.get(entry.table).push({
            name: null,
            sample: sampleRow.slice(0, 4).map((val) => (val ?? '').trim?.() || String(val ?? '')).join(' | '),
            missing: missingFields,
            file,
            columns: parsed.columns,
          });
        }

        continue;
      }

      for (const row of parsed.rows) {
        const first = row[0];
        if (row.length === 1 && typeof first === 'string' && first.trim().toLowerCase() === 'name') {
          continue;
        }
        entry.total += 1;
        const missingFields = [];
        for (const field of entry.required) {
          const idx = parsed.columns.findIndex((col) => col.toLowerCase() === field.toLowerCase());
          if (idx === -1 || !isPresentSqlValue(row[idx])) {
            missingFields.push(field);
          }
        }
        const isComplete = missingFields.length === 0;
        if (isComplete) entry.complete += 1;
        if (!isComplete && includeMissing) {
          const nameIdx = parsed.columns.findIndex((col) => col.toLowerCase() === 'name');
          const nameValue = nameIdx >= 0 ? row[nameIdx] : null;
          const name = typeof nameValue === 'string' ? nameValue.trim() : null;
          const sample = row.slice(0, 4).map((val) => (val ?? '').trim?.() || String(val ?? '')).join(' | ');
          if (!missingByTable.has(entry.table)) missingByTable.set(entry.table, []);
          missingByTable.get(entry.table).push({
            name: name || null,
            sample,
            missing: missingFields,
            file,
            columns: parsed.columns,
          });
        }
      }
    }
  }

  const rows = results.map((row) => ({
    ...row,
    percent: row.total > 0 ? Math.round((row.complete / row.total) * 100) : 0,
  }));

  const notes = [
    'Coverage derived from SQL migrations in supabase/migrations.',
    `Statements parsed: ${parsedStatements}; statements skipped: ${skippedStatements}.`,
    'SELECT-based inserts are counted as one row per SELECT or UNION ALL clause.',
  ];

  return { rows, sourceLabel: 'supabase/migrations', notes, missingByTable };
}

function collectIntegrityFromMigrations() {
  if (!fs.existsSync(migrationsDir)) {
    throw new ScriptError('Supabase migrations directory not found.');
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const jobNames = new Set();
  const pathKeys = new Set();
  const monarchNames = new Set();

  const jobPathRefs = [];
  const jobFeatureRefs = [];
  const powerJobRefs = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    const cleaned = stripSqlComments(raw);
    const statements = extractInsertStatements(cleaned);

    for (const statement of statements) {
      const tableName = extractTableName(statement);
      if (!tableName) continue;

      const parsed = parseInsertStatement(statement, tableName);
      if (!parsed || parsed.rows.length === 0) continue;

      const lowerColumns = parsed.columns.map((c) => c.toLowerCase());
      const nameIdx = lowerColumns.indexOf('name');

      if (tableName === 'compendium_jobs') {
        if (nameIdx === -1) continue;
        for (const row of parsed.rows) {
          if (isConflictNameRow(row)) continue;
          const name = parseStringLiteral(row[nameIdx] ?? '');
          if (name) jobNames.add(name);
        }
        continue;
      }

      if (tableName === 'compendium_monarchs') {
        if (nameIdx === -1) continue;
        for (const row of parsed.rows) {
          if (isConflictNameRow(row)) continue;
          const name = parseStringLiteral(row[nameIdx] ?? '');
          if (name) monarchNames.add(name);
        }
        continue;
      }

      if (tableName === 'compendium_job_paths') {
        const jobIdIdx = lowerColumns.indexOf('job_id');
        if (nameIdx === -1 || jobIdIdx === -1) continue;

        for (const row of parsed.rows) {
          if (isConflictNameRow(row)) continue;
          const pathName = parseStringLiteral(row[nameIdx] ?? '');
          const jobName = extractNameEqualsLiteral(row[jobIdIdx]);
          if (pathName && jobName) {
            pathKeys.add(`${jobName}:${pathName}`);
          }
          jobPathRefs.push({ file, pathName: pathName || null, jobName: jobName || null });
        }
        continue;
      }

      if (tableName === 'compendium_job_features') {
        const jobIdIdx = lowerColumns.indexOf('job_id');
        const pathIdIdx = lowerColumns.indexOf('path_id');
        if (nameIdx === -1 || jobIdIdx === -1) continue;

        const inferred = parsed.mode === 'select' && parsed.selectText ? inferJobAndPathFromSelect(parsed.selectText) : null;

        for (const row of parsed.rows) {
          if (isConflictNameRow(row)) continue;
          const featureName = parseStringLiteral(row[nameIdx] ?? '');
          let jobName = extractNameEqualsLiteral(row[jobIdIdx]);
          if (!jobName && inferred?.jobAlias && isAliasIdExpression(row[jobIdIdx], inferred.jobAlias)) {
            jobName = inferred.jobName ?? '__ALL_JOBS__';
          }

          let pathName = pathIdIdx === -1 ? null : extractNameEqualsLiteral(row[pathIdIdx]);
          if (!pathName && inferred?.pathAlias && isAliasIdExpression(row[pathIdIdx], inferred.pathAlias)) {
            pathName = inferred.pathName;
          }

          jobFeatureRefs.push({ file, featureName: featureName || null, jobName: jobName || null, pathName });
        }
        continue;
      }

      if (tableName === 'compendium_powers') {
        const jobNamesIdx = lowerColumns.indexOf('job_names');
        if (nameIdx === -1 || jobNamesIdx === -1) continue;

        for (const row of parsed.rows) {
          if (isConflictNameRow(row)) continue;
          const powerName = parseStringLiteral(row[nameIdx] ?? '');
          const jobs = parseSqlArrayOfStrings(row[jobNamesIdx]) ?? parseBraceArrayOfStrings(row[jobNamesIdx]);
          powerJobRefs.push({ file, powerName: powerName || null, jobs });
        }
        continue;
      }
    }
  }

  const structuralJobNames = new Set(jobNames);
  for (const ref of jobPathRefs) {
    if (ref.jobName) structuralJobNames.add(ref.jobName);
  }
  for (const ref of jobFeatureRefs) {
    if (ref.jobName && ref.jobName !== '__ALL_JOBS__') structuralJobNames.add(ref.jobName);
  }

  const allowedPowerNames = new Set(structuralJobNames);
  for (const name of monarchNames) allowedPowerNames.add(name);

  const jobsReferencedButNotInserted = Array.from(structuralJobNames)
    .filter((name) => !jobNames.has(name))
    .sort((a, b) => a.localeCompare(b));

  const issues = [];

  for (const ref of jobPathRefs) {
    if (!ref.jobName) {
      issues.push({ table: 'compendium_job_paths', message: `Unparseable job reference for job_paths row in ${ref.file}` });
      continue;
    }
    if (!structuralJobNames.has(ref.jobName)) {
      const suffix = ref.pathName ? ` (path: ${ref.pathName})` : '';
      issues.push({ table: 'compendium_job_paths', message: `Unknown job for job_paths: ${ref.jobName}${suffix} in ${ref.file}` });
    }
  }

  for (const ref of jobFeatureRefs) {
    if (!ref.jobName) {
      const suffix = ref.featureName ? ` (feature: ${ref.featureName})` : '';
      issues.push({ table: 'compendium_job_features', message: `Unparseable job reference for job_features${suffix} in ${ref.file}` });
      continue;
    }
    if (ref.jobName === '__ALL_JOBS__') {
      continue;
    }
    if (!structuralJobNames.has(ref.jobName)) {
      const suffix = ref.featureName ? ` (feature: ${ref.featureName})` : '';
      issues.push({ table: 'compendium_job_features', message: `Unknown job for job_features: ${ref.jobName}${suffix} in ${ref.file}` });
      continue;
    }
    if (ref.pathName) {
      const key = `${ref.jobName}:${ref.pathName}`;
      if (!pathKeys.has(key)) {
        const suffix = ref.featureName ? ` (feature: ${ref.featureName})` : '';
        issues.push({ table: 'compendium_job_features', message: `Missing job_path for job_features: ${key}${suffix} in ${ref.file}` });
      }
    }
  }

  for (const ref of powerJobRefs) {
    if (ref.jobs === null) {
      const suffix = ref.powerName ? ` (power: ${ref.powerName})` : '';
      issues.push({ table: 'compendium_powers', message: `Unparseable job_names array for compendium_powers${suffix} in ${ref.file}` });
      continue;
    }
    for (const jobName of ref.jobs) {
      if (!allowedPowerNames.has(jobName)) {
        const suffix = ref.powerName ? ` (power: ${ref.powerName})` : '';
        issues.push({ table: 'compendium_powers', message: `Unknown job name in powers.job_names: ${jobName}${suffix} in ${ref.file}` });
      }
    }
  }

  const notes = [
    'Integrity checks for migrations are best-effort and focused on name-based references in VALUES inserts and simple SELECT/JOIN patterns.',
    'SELECT-based inserts (CTEs, bulk inserts) are not fully evaluated in migration parsing mode.',
    `Jobs referenced by migrations but not inserted by migrations: ${jobsReferencedButNotInserted.length}.`,
  ];

  return {
    mode: 'migrations',
    passed: issues.length === 0,
    issues,
    notes,
  };
}

async function collectIntegrityFromSupabase(supabaseUrl, supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const jobs = await fetchAllRows(supabase, 'compendium_jobs', ['id', 'name']);
  const jobIds = new Set(jobs.map((j) => j.id));
  const jobNames = new Set(jobs.map((j) => j.name));

  const jobPaths = await fetchAllRows(supabase, 'compendium_job_paths', ['id', 'job_id', 'name']);
  const jobPathIds = new Set(jobPaths.map((p) => p.id));

  const jobFeatures = await fetchAllRows(supabase, 'compendium_job_features', ['id', 'job_id', 'path_id', 'name']);

  const monsters = await fetchAllRows(supabase, 'compendium_monsters', ['id', 'name']);
  const monsterIds = new Set(monsters.map((m) => m.id));
  const monsterActions = await fetchAllRows(supabase, 'compendium_monster_actions', ['id', 'monster_id', 'name']);
  const monsterTraits = await fetchAllRows(supabase, 'compendium_monster_traits', ['id', 'monster_id', 'name']);

  const monarchs = await fetchAllRows(supabase, 'compendium_monarchs', ['id', 'name']);
  const monarchIds = new Set(monarchs.map((m) => m.id));
  const monarchFeatures = await fetchAllRows(supabase, 'compendium_monarch_features', ['id', 'monarch_id', 'name']);

  const sovereigns = await fetchAllRows(supabase, 'compendium_sovereigns', ['id', 'name', 'monarch_a_id', 'monarch_b_id']);
  const sovereignIds = new Set(sovereigns.map((s) => s.id));
  const sovereignFeatures = await fetchAllRows(supabase, 'compendium_sovereign_features', ['id', 'sovereign_id', 'name']);

  const powers = await fetchAllRows(supabase, 'compendium_powers', ['id', 'name', 'job_names']);

  const issues = [];

  for (const row of jobPaths) {
    if (!row.job_id || !jobIds.has(row.job_id)) {
      issues.push({ table: 'compendium_job_paths', message: `job_paths.job_id missing job for path: ${row.name}` });
    }
  }

  for (const row of jobFeatures) {
    if (!row.job_id || !jobIds.has(row.job_id)) {
      issues.push({ table: 'compendium_job_features', message: `job_features.job_id missing job for feature: ${row.name}` });
    }
    if (row.path_id && !jobPathIds.has(row.path_id)) {
      issues.push({ table: 'compendium_job_features', message: `job_features.path_id missing job_path for feature: ${row.name}` });
    }
  }

  for (const row of monsterActions) {
    if (!row.monster_id || !monsterIds.has(row.monster_id)) {
      issues.push({ table: 'compendium_monster_actions', message: `monster_actions.monster_id missing monster for action: ${row.name}` });
    }
  }

  for (const row of monsterTraits) {
    if (!row.monster_id || !monsterIds.has(row.monster_id)) {
      issues.push({ table: 'compendium_monster_traits', message: `monster_traits.monster_id missing monster for trait: ${row.name}` });
    }
  }

  for (const row of monarchFeatures) {
    if (!row.monarch_id || !monarchIds.has(row.monarch_id)) {
      issues.push({ table: 'compendium_monarch_features', message: `monarch_features.monarch_id missing monarch for feature: ${row.name}` });
    }
  }

  for (const row of sovereigns) {
    if (row.monarch_a_id && !monarchIds.has(row.monarch_a_id)) {
      issues.push({ table: 'compendium_sovereigns', message: `sovereigns.monarch_a_id missing monarch for sovereign: ${row.name}` });
    }
    if (row.monarch_b_id && !monarchIds.has(row.monarch_b_id)) {
      issues.push({ table: 'compendium_sovereigns', message: `sovereigns.monarch_b_id missing monarch for sovereign: ${row.name}` });
    }
  }

  for (const row of sovereignFeatures) {
    if (!row.sovereign_id || !sovereignIds.has(row.sovereign_id)) {
      issues.push({ table: 'compendium_sovereign_features', message: `sovereign_features.sovereign_id missing sovereign for feature: ${row.name}` });
    }
  }

  for (const row of powers) {
    const list = Array.isArray(row.job_names) ? row.job_names : [];
    for (const jobName of list) {
      if (typeof jobName === 'string' && jobName.trim()) {
        if (!jobNames.has(jobName)) {
          issues.push({ table: 'compendium_powers', message: `powers.job_names unknown job '${jobName}' for power: ${row.name}` });
        }
      }
    }
  }

  return {
    mode: 'supabase',
    passed: issues.length === 0,
    issues,
    notes: ['Integrity checks executed against live Supabase tables.'],
  };
}

function getCoverageFailures(rows) {
  return (rows || []).filter((r) => r.total > 0 && r.percent < 100);
}

async function collectCoverageFromSupabase(supabaseUrl, supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const results = [];

  for (const config of TABLES) {
    const columns = Array.from(new Set(['id', ...config.required]));
    const rows = await fetchAllRows(supabase, config.table, columns);

    let complete = 0;
    for (const row of rows) {
      const hasAll = config.required.every((field) => isPresent(row[field]));
      if (hasAll) complete += 1;
    }

    const total = rows.length;
    const percent = total > 0 ? Math.round((complete / total) * 100) : 0;

    results.push({
      label: config.label,
      table: config.table,
      required: config.required,
      total,
      complete,
      percent,
    });
  }

  return results;
}

async function main() {
  const opts = parseArgs(process.argv);
  const { supabaseUrl, supabaseKey } = loadEnv();

  let rows = null;
  let sourceLabel = 'unknown';
  const notes = [];
  let integrity = null;

  if (supabaseUrl && supabaseKey) {
    try {
      rows = await collectCoverageFromSupabase(supabaseUrl, supabaseKey);
      sourceLabel = supabaseUrl;
      integrity = await collectIntegrityFromSupabase(supabaseUrl, supabaseKey);
    } catch (error) {
      notes.push(`Supabase fetch failed: ${error.message}`);
    }
  } else {
    notes.push('Supabase env vars missing; falling back to migrations.');
  }

  if (!rows) {
    const migrationResult = collectCoverageFromMigrations({
      includeMissing: opts.showMissing,
      debugTable: opts.debugTable,
    });
    rows = migrationResult.rows;
    sourceLabel = migrationResult.sourceLabel;
    notes.push(...migrationResult.notes);
    integrity = collectIntegrityFromMigrations();
    if (opts.showMissing && migrationResult.missingByTable.size > 0) {
      console.log('\nMissing required fields (migration scan):');
      for (const [table, entries] of migrationResult.missingByTable.entries()) {
        console.log(`- ${table}: ${entries.length} row(s)`);
        for (const entry of entries) {
          const label = entry.name ? `  - ${entry.name}` : '  - <unknown>';
          const sample = entry.sample ? ` [${entry.sample}]` : '';
          const file = entry.file ? ` (${entry.file})` : '';
          const columns = entry.columns ? ` cols=[${entry.columns.join(', ')}]` : '';
          console.log(`${label}: ${entry.missing.join(', ')}${sample}${file}${columns}`);
        }
      }
    }
  }

  const generatedAt = new Date().toISOString();
  const markdown = buildMarkdown({ generatedAt, sourceLabel, rows, notes, integrity });
  const outPath = path.join(repoRoot, 'docs', 'compendium-coverage.md');

  fs.writeFileSync(outPath, markdown, 'utf8');
  console.log(`Wrote ${path.relative(repoRoot, outPath)}`);

  const coverageFailures = getCoverageFailures(rows);
  const integrityIssues = integrity?.issues?.length ? integrity.issues : [];
  const shouldEnforceIntegrity = integrity?.mode === 'supabase';
  const shouldEnforceIntegrityInMigrations = Boolean(opts.checkIntegrityMigrations) && integrity?.mode === 'migrations';
  const shouldEnforceIntegrityOverall = shouldEnforceIntegrity || shouldEnforceIntegrityInMigrations;

  if (opts.check && (coverageFailures.length > 0 || (shouldEnforceIntegrityOverall && integrityIssues.length > 0))) {
    if (coverageFailures.length > 0) {
      console.error('\nCoverage check failed (required-field completeness < 100%):');
      for (const fail of coverageFailures) {
        console.error(`- ${fail.table}: ${fail.percent}% (${fail.complete}/${fail.total})`);
      }
      console.error('Run `npm run compendium:coverage -- --missing` for migration-mode row samples.');
    }
    if (shouldEnforceIntegrityOverall && integrityIssues.length > 0) {
      console.error(`\nIntegrity check failed: ${integrityIssues.length} issue(s)`);
      for (const issue of integrityIssues.slice(0, 50)) {
        const table = issue.table ? ` (${issue.table})` : '';
        console.error(`- ${issue.message}${table}`);
      }
      if (integrityIssues.length > 50) {
        console.error(`- ...and ${integrityIssues.length - 50} more`);
      }
    }
    process.exit(1);
  }

  if (opts.check && !shouldEnforceIntegrity && integrityIssues.length > 0) {
    console.warn(`\n⚠️ Integrity issues detected in migrations parsing mode: ${integrityIssues.length} issue(s)`);
    console.warn('These are not enforced by --check because SQL parsing mode cannot fully emulate migrations execution.');
    console.warn('To strictly enforce integrity, configure Supabase env vars so the script can validate live tables.');
  }
}

export {
  extractInsertStatements,
  extractNameEqualsLiteral,
  inferJobAndPathFromSelect,
  isConflictNameRow,
  parseBraceArrayOfStrings,
  parseInsertStatement,
  parseSqlArrayOfStrings,
  parseStringLiteral,
  splitTopLevel,
  stripSqlComments,
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  await main();
}
