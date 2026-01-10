# Diagnostic Report

Generated: `2026-01-08`

This repository uses Vite + React + TypeScript, with ESLint + TypeScript typechecks, Vitest (unit), and Playwright (e2e).

## Environment

- Node: `v20.18.0`
- npm: `10.8.2`

## Security / Dependency Hygiene

### npm audit

- Status: ✅ PASS
- Evidence:
  - `npm install` => `found 0 vulnerabilities`
  - `npm audit --audit-level=moderate` => (executed via `npm run diagnose`) ✅

### Secrets hygiene

- Status: ✅ PARTIAL (tracked files)
- Evidence:
  - `.env.example` added (tracked) with empty placeholders.
  - `.env` / `.env.local` are ignored by git.

Note: any existing local secrets in `.env.local` should be removed/rotated by the developer. This report only asserts that the repository now contains a safe, tracked template (`.env.example`) and that diagnostic automation does not require committed secrets.

## Automated Repo-Wide Diagnostics

### Diagnose runner

- Command: `npm run diagnose`
- Status: ✅ PASS
- Includes:
  - Placeholder scan + enforcement
  - Compendium coverage report generation
  - `npm audit --audit-level=moderate`
  - Full `npm run doctor` (lint, typecheck, unit tests, compendium validate, build)

### Diagnose + E2E

- Command: `npm run diagnose -- --e2e`
- Status: ✅ PASS
- Evidence (Playwright): `21 tests` => `19 passed`, `2 skipped`

Skips are expected in environments where Supabase is not configured; the e2e suite explicitly skips when an error boundary indicates missing backend configuration.

## Quality Gates

### Placeholder scan

- Command: `npm run placeholder:scan`
- Report: `docs/placeholder-report.md`
- Status: ✅ PASS
- Evidence:
  - P0: 0
  - P1: 0
  - P2: 0

### Lint

- Command: `npm run lint` (via `npm run doctor`)
- Status: ✅ PASS

### Typecheck

- Command: `npm run typecheck` (via `npm run doctor`)
- Status: ✅ PASS

### Unit tests

- Command: `npm run test -- --run` (via `npm run doctor`)
- Status: ✅ PASS

### Build

- Command: `npm run build` (via `npm run doctor`)
- Status: ✅ PASS
- Evidence:
  - Vite: `v6.4.1`
  - Build completed successfully and generated PWA assets.

## Compendium Diagnostics

### Schema validation (bundles)

- Command: `npm run compendium:validate`
- Status: ✅ PASS
- Evidence:
  - `data/compendium/base/example.bundle.json` validated
  - `Validation OK: 0 warning(s)`

### Compendium coverage

- Command: `npm run compendium:coverage`
- Output: `docs/compendium-coverage.md`
- Status: ✅ PASS (migration-derived)
- Notes:
  - Coverage report is derived from `supabase/migrations` SQL.
  - Supabase fetch was not required and may fail when backend is not configured.

## Changes Made During This Pass (high level)

- Added `scripts/diagnose.js` and `npm run diagnose` to run an end-to-end diagnostic suite.
- Eliminated placeholder scan findings in `src/components/character/RichTextNotes.tsx` without weakening the scanner.
- Dependency hardening:
  - Removed unused `react-quill` and `lovable-tagger`.
  - Upgraded `vite` to `^6.4.1`.
  - Added `overrides` to ensure patched `preact`.
- Added tracked `.env.example` template.

## Current Status

- ✅ `npm run diagnose` passes
- ✅ `npm run diagnose -- --e2e` passes
- ✅ `npm audit` reports 0 vulnerabilities
- ✅ Placeholder scan is clean

Next work: Phase 3 compendium completeness (the on-disk bundle set is currently minimal: `example.bundle.json`).
