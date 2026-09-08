# Polish & Deferred-Work Findings — July 2026

**Date:** 2026-07-24
**Method:** firsthand inspection (no subagent audits), file:line evidence.
**Prompt:** "find anything else deferred or that still needs done, finished, or
polished — including ensuring the app's appearance and effects match the theme,
setting, and canon of Rift Ascendant."

## Headline

The app is **exceptionally mature.** Every documented backlog is essentially closed,
and most previously-"deferred" items were resolved by later passes. The genuinely-
open work reduces to (a) compendium **art** (509 pooled placeholders — deferred by
owner: needs a local GPU) and (b) a small set of **chrome/canon polish** items, all
of which this pass fixed. Legend: **✓ Resolved** · **◆ Fixed this pass** · **▲ Open**
· **● Intentional / won't-fix** · **⏸ Deferred by owner**.

---

## 0. Core companion-app palette pass (Track D — added after owner feedback)

The first sweep concluded "nothing broken" but flagged only book/print items. The owner
correctly noted those aren't the companion app. Re-focusing on the **core app** surfaced
a real, widespread theme gap: UI color-coded with **raw Tailwind hues**
(`red/blue/green/purple/cyan-400/500`) instead of RA Amethyst-Void tokens — Tailwind's
generics are the wrong hues (Tailwind purple 262 ≠ RA amethyst 275; Tailwind green 142
yellow-green ≠ RA teal 160; Tailwind red 0 ≠ RA crimson 350). **◆ Fixed this pass:**

- **`scripts/retune-cool-colors.mjs`** — new scoped codemod (mirrors the warm-color
  `retune-raw-colors.mjs`). Map: red→`destructive`, green→`success`, blue→`shadow-blue`,
  purple→`resurge`, cyan→`mana-cyan` (meaning preserved). **573 replacements across 75
  files** in `components/` + `pages/` + `data/toolCatalogs.ts` (the codemod itself was
  then narrowed to walk only those roots — `lib`/`hooks` excluded so OAuth **brand**
  colors and code comments are never touched).
- **Tool-catalog hub cards** (`AscendantTools`/`WardenProtocols`): these use a shimmed
  class system (custom `.from-red-500/20{background:…}` gradients in the page CSS).
  `toolCatalogs.ts` was reverted to keep its shimmed names + a working
  `tool.color.includes("red")` conditional; instead the **CSS shims were recolored**
  (61 raw HSL values → `hsl(var(--token))`) so the cards render RA colors with zero
  logic risk.
- **Guard:** new `src/lib/__tests__/coolColorClasses.test.ts` fails on raw
  `red/blue/green/purple/cyan-\d{3}` utilities in `components/`+`pages/` (book/`ui`
  excluded, matching the codemod). Negative-probed. Sits alongside `warmColorClasses`.
- **Excluded by owner scope:** book-rendering tree, shadcn `ui/` kit, print CSS.
- **Browser-verified:** all 5 token utilities compute to RA hues (destructive
  `rgb(240,66,95)`, success teal, shadow-blue stellar, resurge amethyst, mana-cyan icy),
  token gradients paint, and the recolored hub shims render the tokens (`.from-red-500/20`
  → `rgba(240,66,95,…)`, `.text-blue-400` → shadow-blue). No console errors.
- **Gates:** typecheck ✓ · biome ✓ (auto-fixed 6 wrap-width lines from longer token
  names) · vitest **2281** ✓ · verify:chunks 227 ✓ · build ✓.

---

## 1. Backlogs & prior audits — current state

| Item | Source | State | Evidence |
|---|---|---|---|
| Pending-wiring backlog | `docs/pending-wiring.md` | ✓ CLOSED; `knip` clean | file header |
| Orphan `staticDataProvider.ts` (M10) | May canon-parity audit | ✓ deleted | file absent; no importers |
| Compendium stat-block inline ability-math (M6) | May audit | ✓ gone | no `Math.floor((score-10)/2)` in `src/components/compendium` |
| `getAbilityModifier` guard divergence (M3) | May audit | ✓ fixed | both copies guard `Number.isFinite`; `5eRulesEngine.ts:211` cites M3 |
| `getRiftFavorDie`/`Max` triple/double dup (L1) | May audit | ✓ consolidated | single copy each, `5eRulesEngine.ts:234,241` |
| Off-design spell-formula path (M4) | May audit | ✓ resolved | `useCombatActions.ts:552` — powers+spells both use `resolvePowerActionFormula`, no `abilityOverride`; correct since each caster's spellcasting ability == its job primary ability |
| Anomaly lowercase ability keys (M7) | May audit | ✓ non-issue | `AnomalyDetail.tsx:508-513` reads lowercase keys w/ `?? 10`, renders UPPERCASE labels |
| Empty `saving_throws: {}` (L3) | May audit | ✓ non-issue | `AnomalyDetail.tsx:593,596` — window + row are conditionally rendered |
| Two identical `getAbilityModifier` copies | — | ● intentional | `core-rules.ts:173` + `5eRulesEngine.ts:214` — identical, documented; left as-is |

---

## 2. Canon / terminology hygiene

| Item | State | Evidence |
|---|---|---|
| `MONARCH_LABEL` / stray "MONARCH" in prose | ✓ guarded | `vernacular.ts:4` → "Regent"; `formatRegentVernacular` scrubs MONARCH→REGENT |
| Direct "Solo Leveling / Jinwoo / Shadow Monarch" in code+CSS comments | ◆ reworded to RA-native | `regentGestalt.ts:8,117`; `useGuilds.ts:39,704`; `guildPermissions.ts:2`; `useCharacterDerivedStats.ts:350`; `CharacterSheet.css:3` |
| SL terms in `raCanon*.test.ts` / `generatorCanon.test.ts` | ● keep | these tests **assert SL-term absence** — the strings are probes, not leaks |
| Warm gold in theme | ✓ none | `--regent-gold` aliased to cool platinum (`index.css:299`) |
| `--warning` token | ✓ cool | Stellar Cyan `195 85% 65%` (`index.css:200`) |

---

## 3. Visual chrome & effects

### ◆ Fixed — vendored fonts were never `@font-face`-declared (the big one)
`share-tech-mono-400.woff2` and `orbitron-700-900.woff2` shipped in `public/fonts/`
but had **no `@font-face` block anywhere**, so they never loaded. `ascendant-ui.css`
(imported in `main.tsx:5`, live app-wide) references "Share Tech Mono" 8× for the
dark-tech HUD, and the source-book uses "Orbitron" for display headers — **all
silently fell back to Courier New / system sans.** Additionally `.system-badge` /
`[data-badge]` / `.resurge-text` requested unhosted "JetBrains Mono"/"Fira Code", and
`--font-body` + `source-book.css:12` listed unhosted "Space Grotesk".

Fixes:
- Added `@font-face` for **Share Tech Mono** (400) and **Orbitron** (700–900) from the
  already-vendored woff2 (`index.css`, after the Rajdhani blocks). SIL OFL 1.1.
- Retargeted orphan refs to loaded fonts: `.system-badge`/`[data-badge]`/`.resurge-text`
  → `"Share Tech Mono"` (`index.css:387,531`); `.stat-value` → `"Share Tech Mono"`
  (`AscendantTools.css:130`); `source-book.css:12` → `"Inter"`; dropped dead
  "Space Grotesk" from `--font-body`.
- Result: the HUD terminal text + source-book headers now render in their intended
  faces on every machine, not the OS default.

### ◆ Fixed — off-palette category / hue colors in app chrome
- `Favorites.tsx:170` `getTypeColor` mixed RA tokens with raw Tailwind
  red/blue/purple/green/cyan/gray/slate/stone-500 → retuned entirely to Amethyst-Void
  tokens (`destructive`, `gate-c`, `shadow-purple`, `system-green`, `gate-e`,
  `mana-cyan`, …), preserving category distinguishability.
- `Landing.tsx:92,234` hero subtitle `text-gray-300` → `text-muted-foreground`.
- `RelicWorkshop.tsx:365` lone raw-gray `common` rarity → `gate-e` token.

### ✓ Already themed (verified, left as-is)
- `CompendiumImage.tsx` — canonical image renderer; loading spinner and
  missing/broken-image fallback both use Amethyst-Void tokens (`bg-muted/30`,
  `text-muted-foreground`, dashed border), not gray shadcn defaults (`:166-195`).
- `GlobalEffects.tsx` — perf-profiled ambient glows + pointer glow; zone theming via
  `RouteEffects.tsx`.

### ● Intentional / deferred (documented, not changed)
- **Book-rendering components** (`components/compendium/{players-book,wardens-directive,
  anomaly-manifest}`, `SourceBook*`, `CampaignBookView.tsx`) use a deliberate
  `slate-*` + `void-black` + `resurge-violet` reader palette (their own design system
  in `source-book.css` / `book-print.css`). ~119 `slate/gray` utilities live here.
  They are cool-toned and cohesive; a full token migration is a **separate opt-in
  refactor**, not chrome polish — left untouched to avoid disturbing the book design.
- `book-print.css` references print-only "Outfit" / "Source Serif 4" (unhosted) with
  sane system fallbacks (Segoe UI / Georgia). Print export only; low priority.
- `AnomalyDetail.tsx:540` uses `text-red-400` for "Vulnerabilities" — semantic red;
  acceptable.

---

## 4. Compendium art — ⏸ deferred by owner (needs local GPU)

The asset audit (`audit/SUMMARY.md`, regenerate via `npm run audit:assets`) finds
**509 placeholder images**, mostly *pooled* item art where one generic
`item-XXXX.webp` is reused across many distinct items; anomalies use a keyword→pool
fallback (`src/lib/anomalyImageResolver.ts`, which respects an explicit `image`/
`image_url` first). **0 files missing on disk** — it's a uniqueness/quality gap, not a
break. The full SDXL pipeline is built and ready; generation needs a local backend.

To run it later (unchanged, ready):
```bash
# 1. (re)build the prompt pack + audit reports
npm run audit:assets
# 2. dry-run against a LOCAL SDXL backend (A1111 :7860 or ComfyUI :8188)
node scripts/generate-rift-assets.mjs --dry-run
node scripts/generate-rift-assets.mjs --backend auto --limit 10
# 3. review candidates in art-archive/, then approve + apply
node scripts/approve-rift-candidates.mjs --all
node scripts/generate-rift-assets.mjs --apply
```
See `docs/rift-local-image-generation.md` and `docs/rift-ascendant-art-bible.md`.

---

## 5. Not raised / larger separate efforts
- Per-path (85) and per-regent (12) deep content-correctness audits (M11/M12).
- Full token migration of the book-rendering component tree (§3, ~119 utilities).
- Collapsing the two identical `getAbilityModifier` copies (intentional).
