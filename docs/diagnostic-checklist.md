# Diagnostic Checklist

Updated: `2026-01-08`

## Phase 0 — Baseline

- [x] Identify stack + scripts (`package.json`)
- [x] Confirm Node/npm versions

## Phase 1 — Repo-Wide 100% Diagnostic

### Placeholders / stubs

- [x] Run `npm run placeholder:scan`
- [x] Ensure report is clean (`docs/placeholder-report.md` shows P0/P1/P2 = 0)
- [x] Run `npm run placeholder:check` (enforced via `npm run diagnose`)

### Static quality

- [x] `npm run lint`
- [x] `npm run typecheck`

### Tests

- [x] `npm run test -- --run`
- [x] `npm run test:e2e` (or via `npm run diagnose -- --e2e`)

### Build

- [x] `npm run build`

### Dependency / security hygiene

- [x] `npm audit --audit-level=moderate` (enforced via `npm run diagnose`)
- [x] Track a safe env template (`.env.example`)

### Compendium diagnostics

- [x] `npm run compendium:validate`
- [x] `npm run compendium:coverage` (writes `docs/compendium-coverage.md`)

## Operational "single command" gate

- [x] `npm run diagnose`
- [x] `npm run diagnose -- --e2e`
