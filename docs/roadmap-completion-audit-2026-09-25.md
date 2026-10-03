# Rift Ascendant roadmap completion audit — 2026-09-25

Audited the user's claimed-complete roadmap slices against remote `main` at commit `65ce6416859424eef564940e7312a87c98a8812f`. The code was inspected in the managed checkout `C:\Users\jjcal\.codex\worktrees\roadmap-verification\solo-compendium`; that checkout was not merged into the older local `main` at `38e473eb`. Source paths and line numbers below refer to the remote commit. The older local planning document remains an architectural plan, not a verified current status report.

## Verdict

The claim that S1, S2, S4, A1, R1, C1 and C2 are all **done correctly** is not supported. Major components exist, but S2 and C2 have authority defects, S1/S3/S4 miss full mechanics acceptance, and repository checks do not pass. C3 should follow corrective work on the dependencies it uses.

| Slice | Verified status | Reason |
| --- | --- | --- |
| P0 | Informal/partial | No standalone authority/rules baseline; the new remote revision has failing local gates. |
| S1 — v2 contract | Partial | Eight levels, stable IDs, ancestry and legacy reader exist; semantic bounds, known values and modifier linkage have holes. |
| S2 — persistence | Incomplete, release blocker | Typecheck fails; SQL save validator appears broken; definition/runtime authority and export/import can be bypassed or fail. |
| S3 — runtime/sheet | Partial | Milestone display and some resources exist; structured combat effects, use counters, reliable/atomic resource changes and full sheet details do not. |
| S4 — dedicated AI | Endpoint core present, full slice incomplete | Authenticated four-source endpoint and validation exist, but generation deliberately omits resources/modifiers and relies on the broken S2 save path. No live provider round trip was run in this audit. |
| A1 — remove general AI | Provider isolation substantially done; cleanup incomplete | Generic provider paths appear retired, but dead AI buttons remain and the repository's own isolation test fails on a leftover declaration. |
| R1 — Regents | Provisionally verified in source | Warden three-candidate offer, actor checks, max two, legacy configuration and canonical readiness are present. Live database concurrency/security tests remain unverified. |
| C1 — companion identity | Partial | Stable registry, ownership and per-row backfill exist; living-mount classification trusts client data and legacy tame snapshots cannot support C2 bonding. |
| C2 — tame/bond | Incomplete, release blocker | Client-authored rank/HP can drive server tame resolution; legacy bonds fail; roster removal erases supposedly durable history. |

These statuses are about the stated acceptance criteria, not whether the files or initial happy-path UI exist.

## Blocking findings

1. **C2 trusts a purported canonical source from the caller.** `supabase/migrations/20260926040000_companion_c2_bonding.sql:594-608` checks only snapshot kind/type/collection/id, then reads rank and HP from caller-controlled `sourceFields` at `:643-650` and stores that snapshot on success at `:685-708`. The later wrapper in `20260926041000_companion_c2_retry_source_hardening.sql:159-168` adds retry checks but forwards the same JSON. A character owner can submit a real anomaly text ID with a forged D rank and inflated HP, obtaining the lower DC and saving false canonical stats. The existing compendium Anomaly IDs are text (`src/data/compendium/anomalies/rank-d.ts:6`); the legacy DB compendium table uses UUID IDs, so a direct join to that old table is not a complete fix. Server-authenticated canonical source data keyed by the real text IDs is needed, with parity tests and forged-request DB tests.

2. **The S2 definition authority is bypassable.** The character guard in `supabase/migrations/20260925010000_sovereign_s2_storage.sql:1060-1071` protects attachment IDs/revision but permits edits to `gemini_state.sovereignDefinition` and `isActive`. `src/lib/sovereign/sovereignRuntime.ts:99-105` reads that mutable snapshot. An owner can change displayed/mechanical v2 content or reactivate an imported detached snapshot without a saved-definition attachment. The save RPC is granted to authenticated callers (`...sql:1167-1170`), while its SQL validator checks less than the strict TypeScript v2 schema (`...sql:230-456`), allowing direct RPC content the sheet later rejects. Existing owner UPDATE RLS plus the trigger's `NEW.schema_version = 2` condition at `:468-481` also allow an attempted 2-to-1 downgrade around v2 immutability. Restrict writes at the database boundary and make the saved definition the single runtime authority.

3. **The S2 save path and export/import need a real database round trip.** In `20260925010000_sovereign_s2_storage.sql:367-381`, duplicate queries select raw `entry->>'id'`/`name` while grouping by `lower(...)`; PostgreSQL normally rejects those ungrouped selected expressions when executed. This was identified by source review, not confirmed against a running DB. Export includes projected `character_features` (`src/hooks/useCharacterExportImport.ts:1228-1230`); import inserts them unchanged (`:280-303`, `:799-804`), while the S2 projection trigger rejects inserted rows with `sovereign_definition_id` (`...sql:1127-1135`). The new character is created before this failure, so import can be left partial. The existing `supabase/tests/sovereign_s2_storage.sql` does not run a valid save/attach/export/import transaction.

4. **Sovereign combat mechanics remain descriptive.** The v2 ability schema at `src/lib/sovereign/sovereignV2Contract.ts:241-255` has no typed attack, save, damage, range/target or applied-condition structure. `src/lib/sovereign/sovereignRuntime.ts:431-451` converts every ability to a generic `effect` action with `Self` range. `api/_sovereignGeneration.ts:243-264` explicitly asks for empty resources/modifiers and empty ability resource costs. This does not meet the roadmap's full-overlay generation and shared action acceptance. Short/long-rest abilities without resource costs also have no use counter (`sovereignRuntime.ts:409-443`; `src/components/character/ActionCard.tsx:309-326`). The panel at `src/components/character/SovereignOverlayPanel.tsx:291-339` omits much of the requested full source, trait, feature and resource detail.

5. **Companion legacy behavior and history are incomplete.** C1 backfills campaign tames without `sourceFields.rank` (`20260926020000_companion_c1_identity.sql:222-260`), while C2 bond resolution reads only that rank (`20260926040000_companion_c2_bonding.sql:811`); these existing creatures reach unsupported-rank handling. C1 mount registration accepts caller JSON to classify a mount as living (`20260926020200_companion_c1_mount_snapshot.sql:131-160`). C1 cleanup deletes unreferenced instances (`20260926020000...sql:530-548`), and C2 attempts/control events cascade on instance deletion (`20260926040000...sql:19,125-126`), so removing a tamed roster row erases recorded bond/control history. Decide retention and implement canonical source resolution before calling C1/C2 complete.

6. **S1 validation remains too permissive.** `src/lib/sovereign/sovereignV2Contract.ts:143-170` accepts unconstrained damage-type/target strings. Resource dice count and sides each permit values up to `Number.MAX_SAFE_INTEGER` (`:58-72`, `:102-108`); e.g. `70d100` is not excluded. Duplicate-name checking skips a name equal to its entity ID (`:412-416`), and a `manual-only` entity can still own a modifier through `source_id` despite empty `modifier_ids` (`:429-455`; runtime applies by source at `sovereignRuntime.ts:263-272`). These violate the requested known-value, bounds and compatibility rules.

## Checks run against `65ce641`

| Check | Result |
| --- | --- |
| `npm ci --prefer-offline` | Passed; installed lockfile dependencies in the isolated checkout. |
| `npm run typecheck` | **Failed**, four TypeScript errors in `src/hooks/useSavedSovereigns.ts:152-180`: generated Supabase types do not contain new `saved_sovereigns.schema_version` and related v2 fields. |
| `npm run lint:check` | **Failed**, 50 errors and one warning. Includes formatting/import issues in new Sovereign, Regent and companion files; the script also refers to absent `supabase/functions`. |
| `npm run test:run` | **Failed**, 2,723 passed and 10 failed across 282 files. Failures include A1 isolation's leftover `api/_aiProviders.d.ts`, two C1/C2 stale source-text assertions, an unlabeled icon in Regent oversight, the pre-existing Path detail `requirements` failure, and five scanner timeouts. The two C1 assertions are not by themselves evidence that C1 behavior is broken; they expect retired implementation text. |
| `npm run build` | Passed with CI placeholder Supabase settings. Vite's build does not replace the failing typecheck or DB tests. |
| Local Supabase/database, browser, live provider | Not run; Docker and a standalone Supabase CLI are unavailable on this host. Code-level SQL findings need executable migration/security tests. |

The [latest public GitHub Actions run](https://github.com/Tomoshibi1125/solo-compendium/actions/runs/36219022387) for this exact SHA reports failure and **zero jobs** through the GitHub API. Its only public check run is a successful Supabase Preview; that does not exercise the declared lint, typecheck, Vitest, build, browser or DB-security gates. The zero-job problem is an independent CI issue whose root cause was not established here.

The managed worktree showed 57 pre-existing line-ending-only SQL changes after creation. `git diff --ignore-space-at-eol` found zero semantic tracked changes; this audit made no application-code edits. Dependencies and build outputs in that worktree are local verification artifacts.

## Corrective order before C3

1. Restore real validation: fix the zero-job workflow, checked-in generated types, lint, and the focused stale/failing tests. Add executable local DB tests for successful v2 save/attach and each actor boundary.
2. Repair Sovereign authority and export/import: immutable definitions, strong DB v2 validation, guarded runtime snapshot, atomic import/projection handling, and retry/rollback tests. Close S1 bounds and modifier-linkage gaps.
3. Finish S3/S4 mechanics: typed attack/save/damage/conditions, generated traits/features/resources/modifiers within approved budgets, use counters, reliable rest/resource spending and full sheet presentation. Keep A1's provider boundary while removing dead AI controls.
4. Repair C1/C2 source authority and compatibility: a server-owned canonical anomaly/mount source with text-ID parity, legacy rank recovery or explicit adjudication, and retained attempt/control history. Test forged source JSON, old tames, retry chains and claim/release in an actual DB.
5. Re-run all required gates and one end-to-end generate → save → attach → reload → combat → rest → export/import flow, plus Warden offer → player choice and tame → bond workflows. Only then mark these slices complete and move to C3.

R1 can remain **provisionally complete** while its live database checks are added. Build passing and a successful preview are useful evidence, but they do not certify the other slices.
