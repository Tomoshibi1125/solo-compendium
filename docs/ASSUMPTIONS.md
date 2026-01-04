# Assumptions & Decisions

This document captures assumptions made during development when information was ambiguous or missing.

---

## Environment & Configuration

### Supabase
- **Assumption**: Supabase project is already set up and migrations have been applied
- **Assumption**: Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) are provided via `.env.local` or deployment environment
- **Decision**: Using Supabase Auth for user management (no custom auth)

### Package Manager
- **Assumption**: Using npm (package-lock.json present)
- **Decision**: Will use npm for all package management commands

---

## Content & Legal Compliance

### Homebrew Content
- **Assumption**: Existing homebrew content in the repo is the authoritative canon
- **Decision**: Never overwrite homebrew silently; use explicit migrations/patches if changes needed
- **Assumption**: Homebrew content may be in JSON/YAML/MD format in the repo (to be discovered)

### Generated Content
- **Decision**: When generating missing content:
  1. Use existing homebrew patterns first
  2. Use SRD-compatible mechanics (numbers/structure) but rewrite in own words
  3. Create original theme-consistent content only when SRD doesn't cover it
- **Decision**: All generated content must include provenance fields (sourceKind: "generated", generatedReason, themeTags)

### SRD Usage
- **Assumption**: 5e SRD is available and can be used for mechanics
- **Decision**: SRD mechanics will be adapted to Solo Leveling theme (e.g., "spells" → "powers", "classes" → "jobs")
- **Decision**: Never copy-paste copyrighted text; always rewrite in own words

---

## Technical Decisions

### Testing
- **Decision**: Using Vitest for unit tests (matches Vite ecosystem)
- **Decision**: Using Playwright for E2E tests (modern, reliable)
- **Assumption**: Tests will be added incrementally, not all at once

### CI/CD
- **Decision**: Using GitHub Actions (standard for GitHub repos)
- **Assumption**: CI will run on push/PR to main branch
- **Decision**: CI will run: install → lint → typecheck → test → build

### Data Validation
- **Decision**: Using Zod for runtime validation (already in dependencies)
- **Decision**: Zod schemas will be created for all compendium entities

### State Management
- **Decision**: Using TanStack Query for server state (already in dependencies)
- **Decision**: Local component state for UI state (no global state library needed yet)

---

## User Experience

### Character Creation
- **Assumption**: Users will create characters through a step-by-step wizard
- **Decision**: Wizard will show live preview of derived stats
- **Decision**: Wizard will validate choices against rules

### Character Sheet
- **Decision**: Character sheet will be read-only by default, with edit mode
- **Decision**: Derived stats will be calculated client-side (not stored, except for caching)

### Compendium
- **Decision**: Search will be client-side initially (can upgrade to server-side full-text search later)
- **Decision**: Results will be paginated if >100 items (to be implemented)

---

## Performance

### Initial Load
- **Assumption**: Compendium data will be fetched on-demand (not all at once)
- **Decision**: Will use React Query caching to minimize redundant requests

### Bundle Size
- **Assumption**: Bundle size is acceptable for now (will optimize in Phase 5)
- **Decision**: Will use code splitting for detail pages (lazy loading)

---

## Security

### Authentication
- **Assumption**: Supabase Auth handles token management
- **Decision**: Characters will be user-scoped (RLS policies needed)

### Input Validation
- **Decision**: All user inputs will be validated with Zod schemas
- **Decision**: SQL injection is handled by Supabase client (parameterized queries)

---

## Content Management

### Import Pipeline
- **Assumption**: Homebrew content may be in various formats (JSON/YAML/MD)
- **Decision**: Import pipeline will support JSON first, then extend to YAML/MD if needed
- **Decision**: Import will be idempotent (upsert, not insert)

### Provenance Tracking
- **Decision**: All content must have:
  - `sourceKind`: "homebrew" | "srd" | "generated"
  - `sourceName`: e.g., "Solo Compendium Homebrew", "5e SRD", "Generated Gap-Fill"
  - `licenseNote`: short note for SRD/generated content
  - `createdAt`, `updatedAt`: timestamps
- **Decision**: Generated content must also have:
  - `generatedReason`: what gap it filled
  - `themeTags`: Solo/Gravesong/etc.

---

## Future Considerations

- May need to add server-side search if client-side becomes too slow
- May need to add real-time features (collaborative character editing) later
- May need to add export functionality (PDF character sheets) later
- May need to add mobile app (React Native) later

---

## Questions to Resolve

- [ ] Where is the homebrew content source located? (JSON/YAML/MD files?)
- [ ] Are there existing content files to import?
- [ ] What is the Supabase project URL and keys? (user must provide via .env)
- [ ] Are there any specific design requirements beyond the existing UI?

