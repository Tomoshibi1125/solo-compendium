import { describe, expect, it } from 'vitest';

import {
  extractInsertStatements,
  inferJobAndPathFromSelect,
  isConflictNameRow,
  parseBraceArrayOfStrings,
  parseInsertStatement,
  parseSqlArrayOfStrings,
  parseStringLiteral,
} from '../../scripts/compendium/coverage.js';

describe('compendium migration SQL parsing helpers', () => {
  it('parses SQL string literals (standard, E-prefixed, dollar-quoted)', () => {
    expect(parseStringLiteral("'hello'")).toBe('hello');
    expect(parseStringLiteral("E'it''s ok'")).toBe("it's ok");
    expect(parseStringLiteral("$$multi\nline$$")).toBe('multi\nline');
    expect(parseStringLiteral("$tag$abc$tag$")).toBe('abc');
  });

  it('parses SQL text[] array literals (ARRAY[...] and brace literals)', () => {
    expect(parseSqlArrayOfStrings("ARRAY['A','B']")).toEqual(['A', 'B']);
    expect(parseSqlArrayOfStrings("array[ 'A' , 'B' ]::text[]")).toEqual(['A', 'B']);
    expect(parseSqlArrayOfStrings('NULL')).toEqual([]);

    expect(parseBraceArrayOfStrings("'{A,B}'::text[]")).toEqual(['A', 'B']);
    expect(parseBraceArrayOfStrings("'{\"A,B\",C}'::text[]")).toEqual(['A,B', 'C']);
  });

  it('extracts INSERT statements in presence of whitespace/newlines', () => {
    const sql = `
      -- comment
      INSERT\n      INTO compendium_jobs (name) VALUES ('Vanguard');

      /* block comment */
      insert into compendium_powers (name, job_names)
      values ('Fireball', ARRAY['Mage']);
    `;

    const statements = extractInsertStatements(sql);
    expect(statements).toHaveLength(2);
    expect(statements[0].toLowerCase()).toContain('insert');
    expect(statements[0].toLowerCase()).toContain('into compendium_jobs');
    expect(statements[1].toLowerCase()).toContain('into compendium_powers');
  });

  it('infers job+path names from SELECT/JOIN patterns', () => {
    const selectText = `
      SELECT j.id, p.id
      FROM compendium_jobs j
      JOIN compendium_job_paths p ON p.job_id = j.id
      WHERE j.name = 'Contractor' AND p.name = 'Path of the Data Pact'
    `;

    expect(inferJobAndPathFromSelect(selectText)).toEqual({
      jobAlias: 'j',
      pathAlias: 'p',
      jobName: 'Contractor',
      pathName: 'Path of the Data Pact',
    });
  });

  it('infers job name from SELECT ... FROM compendium_jobs j WHERE j.name = ...', () => {
    const selectText = `
      SELECT j.id
      FROM compendium_jobs j
      WHERE j.name = 'Vanguard'
    `;

    const inferred = inferJobAndPathFromSelect(selectText);
    expect(inferred.jobAlias).toBe('j');
    expect(inferred.jobName).toBe('Vanguard');
    expect(inferred.pathAlias).toBeNull();
    expect(inferred.pathName).toBeNull();
  });

  it('parses INSERT ... SELECT statements and includes selectText', () => {
    const statement = `
      INSERT INTO compendium_job_features (job_id, name, description, level)
      SELECT j.id, 'Feature A', 'Desc', 1
      FROM compendium_jobs j
      WHERE j.name = 'Vanguard';
    `;

    const parsed = parseInsertStatement(statement, 'compendium_job_features');
    expect(parsed?.mode).toBe('select');
    expect(parsed?.rows?.length).toBe(1);
    expect(parsed?.selectText?.toLowerCase()).toContain('from compendium_jobs');
  });

  it('recognizes the ON CONFLICT (name) parse artifact row', () => {
    expect(isConflictNameRow(['name'])).toBe(true);
    expect(isConflictNameRow(['Name'])).toBe(true);
    expect(isConflictNameRow(['not_name'])).toBe(false);
    expect(isConflictNameRow(['name', 'other'])).toBe(false);
  });
});
