# Pending-Wiring Backlog — CLOSED

_Last updated: 2026-07-04_

**This backlog is empty.** Knip runs clean against the whole repo (`npx knip`),
and every item this file used to track has been resolved:

- The **AFA best-in-class rebuild** (Phases 0–3 + Waves A–C, Regent Status,
  catalog prune, RA visual overhaul) shipped in June 2026.
- The 13 "legacy duplicate" files (old CharacterSheet panels, `CharacterFAB`,
  `deathSaves`/`restAutomation`/`spellCasting` libs, `MegaMenu`, …) were
  deleted once `CharacterSheetV2` superseded them.
- `useLiveEncounterScaler` was wired into `EncounterBuilder` (Wave B).
- The `vaul` dependency left with `MobileAccordionMenu`.

## Historical context

The repo once contained a dependency-proof shim (`WardenWiringHub` +
`DependencyProof`) that made Knip untrustworthy; it was removed 2026-06-29
([[dependency-proof-shim-removed]] in the workspace memory). This file then
tracked the genuinely-unwired leftovers until they were wired or deleted.

## Knip config notes (still current)

- `@radix-ui/react-slider` stays in `ignoreDependencies`: retained as a base
  UI-kit primitive for future tool controls; no importer today.
- `src/components/ui/**` and `src/integrations/supabase/types.ts` are ignored
  (shadcn kit + generated types keep deliberately-unused exports).
- `ignoreExportsUsedInFile` is on, so reported unused exports are genuinely
  unconsumed across the project.

If Knip flags something new, treat it as a real finding — fix or delete it
rather than adding it here; this file exists only to explain the history.
