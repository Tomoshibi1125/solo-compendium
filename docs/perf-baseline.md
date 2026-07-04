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

## After targets — CLOSED 2026-07-04

| Target | Result |
| --- | --- |
| `public/` < 500 MB | **367 MB** ✓ |
| PWA precache < 15 MB | **13.8 MB** (255 entries; baseline 25.6 MB) ✓ — compendium data incl. all 12 items parts precached for offline; 3D/PDF/media vendors + `ui-art/**` + `generated/**` excluded |
| Boot without data chunks | ✓ idle-deferred; boot modulepreload carries zero data chunks (items/anomalies/locations/etc. load post-boot) |
| Items data split per part | ✓ `items-lazy.ts` assembles parts 1–9 via dynamic imports; each part is its own ~90–150 KB chunk (was one 3.2 MB `items-index`); `items-gap-fill` (2.7 MB source data) is its own on-demand chunk |
| Vendor chunk audited | ✓ boot vendor 1.4 MB → **~128 KB residual**; pdf-lib/posthog/auth-ui/mediapipe/markdown/forms/supabase split into lazy or cache-stable chunks |

### Chunking rework (2026-07-04, root-cause fix)

Under rolldown-vite the rollup-style `manualChunks(id)` function was emulated
with **recursive dependency capture**: named groups absorbed their matched
modules' shared deps (react-dom landed inside the 4.9 MB `dice-3d` chunk,
compendium helpers inside `particles-vendor`), so unrelated chunks statically
imported multi-MB vendors and index.html **modulepreloaded ~7 MB+ at boot**.
Replaced with rolldown-native `codeSplitting.groups`
(`includeDependenciesRecursively: false`) and **no node_modules catch-all**
(a catch-all vendor chunk sits in the boot graph and drags lazy-only libs'
deps into boot). See vite.config.ts for the group list and rationale.

**Boot modulepreload after: 30 chunks, ~1.16 MB minified total** — zero
3D/PDF/analytics/markdown/auth-UI vendors in the boot graph (verified against
`dist/index.html`).

**markdown-vendor circular-init fix (2026-07-04).** `codeSplitting.groups`
with `includeDependenciesRecursively: false` only assigns *matched* modules, so
react-markdown/unified helpers left off the `markdown-vendor` regex
(`style-to-object` + `inline-style-parser` are CJS, plus `style-to-js`,
`html-url-attributes`, `bail`, `trough`, `is-plain-obj`, `extend`,
`estree-util-is-identifier-name`, `@ungap/structured-clone`) scattered into
whichever lazy app chunk imported them first. `markdown-vendor` then did a
cross-chunk `__toESM(require())` against that app chunk — which has a back-edge
to `markdown-vendor` — so the circular eval order left the CJS factory
undefined (`TypeError: Hr is not a function`) and crashed **every** markdown
surface (compendium detail, players-book) in the production build. Latent since
the chunking rework; only observable once the build could run again. Fix: the
whole subtree is now pinned to `markdown-vendor` (boot size unchanged).

### Offline art fix (2026-07-04)

Precache previously shipped ~5 MB of `/ui-art/*.png` `<picture>` fallbacks
while the webp/avif variants browsers actually request had no cache route —
offline art was broken. Now: `ui-art/**` excluded from precache + a
`CacheFirst` runtime route for `/ui-art/*.(png|webp|avif|jpg|svg)`, plus a
`CacheFirst` route for hashed `/assets/*.js` so precache-excluded lazy chunks
still work offline after first use.
