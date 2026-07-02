# Performance Baseline — UX/Perf Overhaul Program

Recorded 2026-07-02 at `main` (post `f16838fc`), before any program changes.
Rebuild with `ANALYZE=1 npm run build` → treemap at `audit-artifacts/bundle-stats.html`.

## Payload / deploy

| Metric | Baseline |
| --- | --- |
| `public/` size | **1.8 GB** |
| `dist/` size (deploy) | **1.8 GB** |
| PWA precache | 232 entries, **25.6 MB** |
| PNG files | 1,073 = **1.3 GB** (929 in `rift-ascendant-candidates/`) |
| WebP files | 4,394 = 311 MB |

Unreferenced in src **and** supabase/migrations (grep-verified):
- `public/generated/rift-ascendant-candidates/` (~1 GB, git-tracked ×1,925)
- `public/generated/original-backups/`
- `public/generated/maps/premade/` (56 files) — no manifest, no consumer
- `public/generated/maps/tilesets/` (70 PNGs, dungeon-pack) — VTT leftovers

Referenced and kept: `/generated/compendium/**` (2,260 refs), `/generated/maps/Meridian` (meridian.ts:70), `/ui-art/*` (webp/avif variants; PNGs are `<picture>` fallbacks only), `adventures/glassline-claim` (books pipeline input — do not recompress).

## JS chunks (minified │ gzip)

| Chunk | Min | Gzip | Loaded |
| --- | ---: | ---: | --- |
| dice-3d | 5,111 kB | 1,712 kB | lazy + idle prefetch |
| items-index (data) | 3,325 kB | 274 kB | on compendium data need (single chunk for ALL items) |
| vendor (catch-all) | 1,404 kB | 479 kB | boot |
| items-part5 (data) | 1,017 kB | 92 kB | with items |
| anomalies (data) | 677 kB | 35 kB | startup prefetch |
| locations (data) | 540 kB | 37 kB | startup prefetch |
| index (entry) | 387 kB | 114 kB | boot |
| spells (data) | 352 kB | 55 kB | startup prefetch |
| CharacterSheetV2 | 346 kB | 86 kB | route |
| powers (data) | 304 kB | 44 kB | startup prefetch |

## Boot behavior (before)

- `useStartupData` loads **all 24 compendium categories** immediately on app mount (App.tsx) → pulls most data chunks above at boot.
- `useOfflineCacheWarmer` then writes every startup entry to IndexedDB at boot.
- `GlobalCharacterHUD` runs ~8 character data hooks + derived-stats on every non-sheet page.
- Fonts: Google Fonts CSS (render-blocking third-party chain) + 1 local preload.

## After targets (fill in at program close)

- `public/` < 500 MB; precache < 15 MB; boot network without data chunks (idle-deferred); items data split per part; vendor chunk audited.
- Boot waterfall + Lighthouse mobile run captured via preview/final verification.
