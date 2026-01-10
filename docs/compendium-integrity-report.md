# Compendium Integrity Report

Generated: `2026-01-08`

## Scope

This report covers two compendium sources:

1. **On-disk content bundles** under:
   - `data/compendium/base`
   - `data/compendium/generated`

2. **Migration-derived coverage** from:
   - `supabase/migrations`

## 1) On-disk bundle validation (Zod schema)

### Command

- `npm run compendium:validate`

### Result

- ✅ PASS
- Evidence:
  - `[base] data/compendium/base` => `example.bundle.json` validated
  - `Validation OK: 0 warning(s)`

### Notes

- `data/compendium/base` currently contains:
  - `example.bundle.json`
- `data/compendium/generated` currently contains:
  - `README.md` only

The bundle validator includes global integrity checks across all bundles discovered under `data/compendium/**`:

- Missing-reference checks across bundles (e.g., `job_paths.job_name`, `job_features.job_name` + `job_features.path_name`, `powers.job_names`)
- Duplicate definition checks across bundles for name-keyed entities (jobs/powers/relics/monsters/backgrounds and job_paths)

This means the repository’s **bundle-based compendium** is presently a minimal example set; completeness work belongs to Phase 3.

## 2) Migration-derived coverage (schema + automation readiness)

### Command (coverage)

- `npm run compendium:coverage`

### Output

- `docs/compendium-coverage.md`

### Result (as of latest run)

- ✅ Required-field completeness: **100%** (migration-derived)
- Totals:
  - Total entries: `2813`
  - Entries meeting all required fields: `2813`

The coverage script also performs **integrity checks** (referential consistency) and can be enforced via:

- `npm run compendium:coverage -- --check`

This mode is executed by `npm run doctor`. Integrity enforcement is strict when Supabase is configured; when falling back to migration parsing, integrity findings are reported but do not fail the check.

To enforce integrity failures even when falling back to migrations mode, run:

- `npm run compendium:coverage -- --check --check-integrity-migrations`

### Notes / Caveats

- The coverage script reports:
  - `Supabase fetch failed: Failed to fetch ...`

This is expected when Supabase is not configured locally; the script still produces useful results by parsing SQL migrations.

Integrity checks behave as follows:

- When Supabase is configured, checks are executed against live tables (authoritative runtime data).
- When Supabase is not configured, checks are best-effort by parsing migration `INSERT ... VALUES` statements for name-based references.

## Follow-ups (Phase 3)

- Expand `data/compendium/generated/` with real, validated bundles (original/homebrew as needed).
- Consider adding additional global integrity checks as more bundle types are introduced.
