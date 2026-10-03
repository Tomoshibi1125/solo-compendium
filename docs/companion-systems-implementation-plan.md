# Rift Ascendant companion systems: reviewed implementation plan

> Current completion status: see [the 2026-09-25 audit](roadmap-completion-audit-2026-09-25.md) of remote `main` at `65ce641`. This plan was based on the older local checkout.

Reviewed 2026-09-25 against local `main` at `38e473eb` and the supplied 96-section roadmap. This is a planning artifact; no application implementation is included.

## Recommendation

Keep the proposed systems and rules. Replace the long serial sequence with independently deliverable workstreams, each including persistence, permissions, runtime behavior, UI, export compatibility and tests. Reuse the existing companion sheets, crafting panel, Regent security, action and resource infrastructure.

The principal changes are:

1. Establish data authority and compatibility before adding interfaces. Sovereign attachment and material consumption need atomic server operations.
2. Reconcile existing companion stores before introducing another living-creature persistence path.
3. Deliver Warden-curated Regents independently of Sovereign presentation work.
4. Remove general AI immediately after the dedicated Sovereign path works. Crafting and companions are not dependencies for removal.
5. Ship rest, export/import, database tests and authored rule updates with each slice. Final QA is a release audit, not the first testing phase.
6. Distinguish rules already specified by the roadmap from genuine gaps. Do not invent campaign-specific defaults to fill them.

The supplied roadmap governs the requested product direction. Existing code/books establish the migration starting point; conflicting old content does not automatically override the new decisions.

## Baseline and working tree

Four pre-existing local edits must be preserved and accounted for before implementation:

- `src/components/character/AddCompanionDialog.tsx`
- `src/components/character/CharacterExtrasPanel.tsx`
- `src/components/character/VehiclesPanel.tsx`
- `src/components/character/__tests__/AddCompanionDialog.test.tsx`

Do not begin with unconditional checkout/pull or dependency installation in this working tree. Establish the intended base and use an isolated checkout when necessary. New implementation branches should use `codex/`. No branch switch, pull, dependency install, database change or application-code edit was performed for this review.

Observed checks on the existing working tree, with Node 25.6.1 / npm 11.9.0 and installed dependencies:

| Check | Result |
| --- | --- |
| `npm run lint:check` | Passed; 1,229 files checked, no fixes applied. |
| `npm run typecheck` | Passed. |
| `npm run test:run` | 271 test files passed, one failed; 2,662 tests passed, one failed. |
| Build, book verification, database/security and browser tests | Not run for this planning review. |

The existing failure is `src/lib/__tests__/detailFieldCoverage.test.ts:301`: the Path detail view does not surface populated `requirements`. Record it separately from new regressions; this review does not fix it. This is a working-tree baseline, not proof that clean `main` or CI has the same result.

Before implementation, establish a reproducible baseline using the lockfile (`npm ci`) in the prepared checkout and CI's Node 22 runtime. Add build, book verification and applicable database/browser/sourcebook gates. A missing artifact or unavailable database is an environment gap, not a pass.

## Repository findings that change the roadmap

Paths and line references describe the reviewed snapshot and may move during implementation.

| Area | Evidence | Planning consequence |
| --- | --- | --- |
| Sovereign contract | `src/lib/sovereign/sovereignContract.ts:20` already versions the external request/export contract and validates eight ordered milestones. | Extend it with structured mechanics and semantic validation; preserve v1 readers. |
| Sovereign persistence | `src/hooks/useSavedSovereigns.ts:135` saves the definition and separately changes the character/features. | Replace partial multi-write attachment with an atomic operation and durable retry receipt. |
| Sovereign runtime | `src/lib/sovereign/applySovereign.ts:46` duplicates definition fragments; `src/hooks/useCombatActions.ts:915` exposes Sovereign actions as generic effects. | Extend shared actions/resources instead of introducing a separate engine. |
| Sovereign UI | `src/components/character/SovereignOverlayPanel.tsx:166` selects one capstone with `find`. | Test that all eight milestones, including both capstones, render. |
| Regent security | `supabase/migrations/20260906010000_task8_regent_workflow.sql:1150` already provides actor checks, locks, canonical identity and the two-unlock limit. | Extend the latest migrated behavior rather than rebuilding it. |
| Regent offers/readiness | `RegentUnlocksPanel.tsx:197` computes adaptive choices; `useRegentUnlocks.ts:478` issues a quest credit directly; `useSovereignReady.ts:39` counts unlock rows. | Store candidates, restrict issuance/consumption and require two distinct resolved canonical unlocks. |
| Companion substrate | `src/lib/companions.ts:53`, `src/pages/CompanionExtraSheet.tsx` and migration `20260630070000_extend_character_extras_companions.sql` already provide provenance and companion state. | Extend the existing sheet/picker/panels and preserve current edits. |
| Companion identity | Campaign taming, personal taming, `character_extras` and `character_vehicles` coexist. | Define stable living-instance identity and explicit legacy mappings across all four stores. |
| Taming security | Migration `20260906000000_supabase_security_hardening.sql:1344` validates database UUID/DC/HP and membership; controller claims use compare-and-set. | Preserve protections while adding context, retries and release semantics; resolve static IDs versus DB UUIDs. |
| Combat/mounts | `CompanionExtraSheet.tsx:205` queues a snapshot without persistent identity; `initiativeQueue.ts:12` lacks instance links. `vehicles.ts:275` describes thin overlays but still duplicates creature stats. | Link one instance through combat and use one creature-stat resolver plus mount overrides. |
| Crafting UI | `src/components/character-v2/CharacterSheetV2.tsx:842` already renders `CraftingPanel`; `src/hooks/useCrafting.ts:239` provides state and receipts. | Evolve the current player workflow. |
| Crafting transactions | `useCrafting.ts:556` inserts a project without reserving inventory. `planning/adapters/campaignWorkflow.ts:472` explicitly does not claim DB atomicity. | Keep planning/receipts, replace execution with transactional inventory/project operations. |
| Material storage | Migration `20260628120000_vehicle_crafting_requisition.sql:114` stores integer quantities with a unique character/material pair. | Add lots; current rows cannot represent distinct provenance/condition. |
| Rest/resources/export | `restSystem.ts`, `characterResources.ts`, `useUnifiedResources.ts` and `planning/actionPlans.ts` already overlap. Export format 2.5 includes personal extras/vehicles/tamed Anomalies. | Consolidate rest execution; extend export per slice instead of restarting both systems. |
| AI reach | Vite dev middleware, `src/lib/artPipeline/service.ts:684` and `src/hooks/useCampaignDice.ts:149` also call AI. | Audit endpoints, direct providers, dev paths, scripts, packages and CI, not only `src/lib/ai`. |
| Books | `books/scripts/build-books.ts:4009` embeds retired biology wording; `:4073` requires Bureau-certified harvesting equipment. | Correct actual build inputs and semantic QA. Updating duplicated side files alone is insufficient. |

The recent `afacc0dd` ecology commit changed one compendium component, not the book generator. Existing architecture documents also contain outdated AI-selection and engine descriptions; verify current callers before following them.

## Requirements retained

- AI is limited to Sovereign creation from Job, Path, Regent A and Regent B. Saved definitions run deterministically; viewing, leveling, resting, combat, export and import never generate again.
- Sovereigns have eight ability milestones: 1, 3, 5, 7, 10, 14, 17, 20. The package represents all four sources and both capstones identify all four.
- Warden/co-Warden offers exactly three distinct canonical Regents; player chooses one stored candidate. Binary unlock, no level gate, retroactive application, maximum two, only authoritative prerequisites enforced.
- Anomalies are biological organisms in Rift ecologies. Stat blocks can be distinct from regional species metadata and encounter disposition.
- Tamed/managed, bonded, persistent companion and mount capability are distinct concepts. Initiative, action economy, progression, healing and downed rules are configurable profiles, not campaign-derived universal defaults.
- Materials use definitions plus lots, six families, separate source rank/grade, controlled extensible forms/traits and regulatory metadata. Registration does not determine physical usability.
- Ordinary crafting has four disciplines and capability tiers. Inscription retains its separate procedure while sharing inventory. Research and biological adaptation extend the project engine; no universal rejection/mutation rules are invented.
- Preserve Warden adjudication and both XP/milestone advancement options. Keep live party ownership, personal companions, events, rewards and session history out of canonical seeds. Do not interpret that boundary as deleting existing authored adventures.

## Numeric rules to preserve in fixtures and authored sources

| Procedure | Specified rule |
| --- | --- |
| Bonding | D/C/B/A/S DC 12/14/16/18/20; PRE; proficiency when applicable; one established +2 specialization bonus. |
| Rank/grade | E Basic; D Quality; C Rare; B Exotic; A Legendary; S Regent. Retain both fields. |
| Core extraction | One minute, DC 15, Harvesting Kit or stated equivalent, INT with Medicine or Survival. |
| Bulk harvest | E/D/C/B/A DC 10/12/15/18/21; S is Warden-defined at 21+. |
| Precision harvest | E/D/C/B DC 12/15/18/21; A is 21+; S is Warden-defined. |
| Capability | Basic permits Basic/Quality; Expert permits Rare/Exotic; Master permits Legendary; Regent also requires explicit access. |
| Ordinary work | Two-hour segments; specific procedures override. PB once, expertise normally, one qualified assistant can grant advantage. |
| Characterization | One hour; Basic/Quality/Rare/Exotic/Legendary/Regent DC 10/12/15/18/21/24. |
| Experiment | Normal DC +2 until proven; failed research/prototype attempt grants +1 iteration, capped at +2; successful prototype becomes Proven; mastery after three successful productions. |
| Recovery | Consumed stays consumed on failure. Incorporated is usually recoverable after one-hour disassembly; failure by five or more may damage a special component. Catalysts normally remain recoverable. Preserve procedure exceptions. |
| Inscription | INT with Inscription Tools; explicit entry/procedure DC wins; grade fallback 10/13/16/19/22/25. Failed relevant reagents are destroyed; preserve procedure-specific critical failures. |
| Improvised checks | d20 + ability + applicable proficiency; DC 10/12/15/18/21+ for routine/professional/dangerous/expert/exceptional. Specific procedures override; certain outcomes need no roll. |

The material families are Anomaly Biological, Essence, Rift Botanical, Rift Mineral, Relic Material and Technical. Ordinary disciplines are Blacksmithing, Alchemy, Enchanting and Field Engineering. Portable equipment includes the Expedition Field Station, Field Extraction Rig and Reusable Essence Stabilization Vessel, with the stated kit/storage equivalences.

`21+`, “usually,” “may” and Warden-defined outcomes are structured adjudication inputs, not permission to silently choose a fixed result.

## Data and execution contracts

### Sovereigns

Use `saved_sovereigns` as definition authority, `characters.active_sovereign_id` as attachment, `characters.gemini_state` as versioned runtime state, and `character_features` as a rebuildable mechanics projection. Explicitly migrate the older `sovereign_id` and embedded definition fragments. Give definitions, features, abilities and resources stable IDs; record schema, ruleset, canonical-source and projection revisions.

The v2 definition includes identity/title/epithet, description, manifestation, fusion theme, combat doctrine, primary abilities, affinities, traits, features, eight milestone abilities, resources, modifiers and generation metadata. Recognize unversioned existing saved records as legacy inputs; preserve v1 objects without generating replacement powers or fabricating ancestry. Unsupported legacy mechanics remain visible with explicit compatibility status. Generated and imported v2 definitions use the same strict validation boundary: milestones, unique IDs/names, known vocabulary, valid references, ancestry coverage and bounded numeric/dice/formula values. Ancestry tags prove declared provenance, not meaningful thematic synthesis.

Use a bounded declarative expression grammar and typed modifier operations, conditions, duration and stacking order. Do not evaluate arbitrary formula strings. Map supported mechanics to actual engine consumers and reject unsupported automation rather than silently dropping it. Test the shared contract in both client and production server runtimes.

Existing consumers use `bonus-action`, `short-rest` and `long-rest`. If the external schema uses underscores, provide one explicit adapter and round-trip tests. Avoid competing runtime vocabularies.

The dedicated endpoint verifies authentication, loads canonical sources and accepts only the four source IDs as generation input. Character context needed for authorization/attachment belongs in route context, never the model prompt. Reject arbitrary prompt/provider parameters; bound requests, rate-limit and use operation IDs.

Validate and durably save successful generation before reporting completion. Attachment must atomically validate ownership/eligibility/definition and write attachment, runtime and projections. If generation saves a draft first, failed attachment leaves a recoverable draft and unchanged character. Imported definitions need equivalent validation; client “validated” flags are not authoritative. Repeated requests must not regenerate or duplicate an already saved result.

### Living companions

Define one stable living-instance identity and map personal/campaign taming, extras and mount references to it. Prefer extending the extras foundation where it fits; choose the physical schema after checking campaign ownership/RLS. Do not add a fifth unrelated store.

Ownership, handler, combat controller and rider are separate relationships with explicit transfer/release permissions. Two creatures sharing an anomaly ID/name remain distinct instances. Canonical stats plus a versioned progression/override profile yield effective stats; mount profiles add carrying/rider limits, tack/training and riding rules. Define source revision/snapshot behavior so catalog edits do not silently rewrite established companions.

Combat references the persistent instance. Assign authority for HP, conditions, resources and downed state during combat and reconciliation afterward. Use one turn-order resolver across tracker/session views. Test ties, handler removal/downing, duplicate handoffs and reloads. Companion reactions must not consume rider reactions unless the selected profile explicitly requires it.

### Materials, crafting and discovery

Add lot ownership, reservations and durable operation receipts. Backfill quantities, notes and references without inventing provenance/grade. Existing project `materials_committed` JSON is descriptive, not proof of an inventory debit.

Pin projects to formula revisions and requirement snapshots. Define reserve/work/resolve/cancel/disassemble transitions. Server operations validate permission, ownership, revision, formula/tier access, tools/facilities, accepted roll and adjudicated inputs, then atomically apply inventory changes, progress, proof/mastery and outputs. Do not trust client-supplied success, DC or output quantities.

Use row locks or equivalent serialization and idempotency keys; restrict bypass writes. Test competing reservations, stale revisions, rollback and retries after lost responses. Splits/merges conserve quantity and provenance; cancellation and component recovery have explicit transitions. Separate actual material properties from character-discovered knowledge if research reveals them, with hidden information protected at the read boundary.

### Rest, offline behavior and export

Extend one rest planner/executor per new resource, using stable source IDs and one recharge application. Cover individual/bulk/campaign rests, repeated events, partial failures and reloads; do not add reset callbacks to each panel.

Preserve current guest behavior. Recommended first release for newly transactional cloud systems: cached viewing and unconfirmed drafts offline; server confirmation for shared offers, inventory spending and campaign state. Mark pending state clearly. Full local transactional support is a separate feature; the generic sync queue does not provide it automatically.

Version exports in every persistence slice. Include personal definitions, runtime, lots, formula knowledge and projects with ID remapping. Campaign-owned instances export scoped references unless using an explicit campaign package. Imported approvals/ownership must not confer campaign privileges. A character import cannot retain another account's saved-definition ID as an authorized attachment.

## Decisions still needed

This register identifies stage-specific blockers; it does not block unrelated work or reopen the supplied numeric rules.

| Decision | Recommended treatment | Needed before |
| --- | --- | --- |
| Sovereign replacement/stacking, ability-score changes, balance ceilings | Write allowed operations and numeric budgets. The proposed enum is not permission to grant every operation; old docs forbid some changes. | S1/S3 |
| Trait/feature counts and resources | Make “roughly 3–5 / 4–6 / 0–2” explicit contract bounds or editorial guidance. | S1 |
| Generation failure, re-fusion/editing and archive-only generation | Recommend immutable saved revisions and explicit errors/retries; no silent fallback presented as AI output. Separate draft creation from attachment. | S2/S4 |
| Sovereign visibility and deletion | Define whether a Warden viewing a shared character can read its attached private definition, and what happens if its creator deletes it. Recommend preserving attached immutable revisions. | S2 |
| Offer edits/revocation, outstanding offers and stale prerequisites | Version pending offers, keep consumed offers immutable, revalidate authoritative requirements at consumption. Old grants require Warden configuration. | R1 |
| E/unknown-rank bonding, proficiency and specialization IDs | Require source-backed defaults; define valid attempts and retry adjudication. Do not invent universal short-rest retries. | C2 |
| Companion source changes, progression and death/release | Version profiles, bound formulas and keep campaign-specific policies in profile/instance data. | C1/C3 |
| Units/fractions and legacy rarity-to-grade mapping | Explicit unit rules/mappings; preserve unmappable quantities for review. | M1 |
| Harvest anatomy/yield, exhausted sources, retries and critical failure | Require approved availability/yield. Explicitly resolve existing core detonation and universal corpse-sublimation rules; do not invent natural-1 behavior. | M2 |
| General crafting check cadence, base DCs and failure timing | Specify checks/debits per segment, attempt or project; cancellation/disassembly and optional component damage. | M3 |
| Research ownership, visibility, iteration and mastery | Separate access (Field Standard/Known) from development (Experimental/Proven) if needed. Decide whether prototype counts among three productions, iteration scope/reset, assistant qualification and tier acquisition. | M4/M5 |
| Inscription legacy generic formula | Keep explicit entry DCs and the requested fallback; explicitly retire or scope the old `10 + 2 × rank` rule and map rank/grade/rarity. | I1 |
| Biological integration | Approved formulas specify targets, effects/removal, risks and failure profiles; no global rejection rules. | B1 |

## Delivery sequence and acceptance gates

IDs are dependency labels, not a mandate to implement every row serially. Split rows into smaller PRs where needed; avoid one overhaul branch. Every storage slice includes its migration, types, permissions, compatibility, export and focused tests.

| Slice | Deliverable | Dependencies | Acceptance gate |
| --- | --- | --- | --- |
| P0 | Baseline, authority/ownership map, rule matrix, compatibility inventory and immediate decisions | None | Existing edits preserved; failures separated; next-slice fixtures defined. |
| S1 | Sovereign v2 contract, semantic validator, bounded mechanics and v1 reader | P0 | Milestones/references/enums/ancestry/bounds validated; malformed generation/import rejected; old saves readable. |
| S2 | Sovereign storage, atomic attachment/runtime/projection, IDs and export | S1 | Real DB tests for unauthorized/concurrent attachment, rollback and retries; no partial character; v1 compatibility. |
| S3 | Sovereign shared actions/modifiers/resources/rests and complete sheet | S2 | Fixture exercises supported attacks/saves/damage/conditions/resources; all eight milestones visible; no duplicate modifiers/recharge; level/use/rest/export need no AI. |
| S4 | Dedicated authenticated Sovereign endpoint/provider, canonical resolution, dev/prod parity and durable retry handling | S1–S3 | Generate/import → validate/save → attach → reload → level → use → rest → export/import; invalid input/output cannot create partial state. |
| A1 | Remove general AI, settings/endpoints/flags; preserve manual workflows; add isolation CI | S4 | Only explicit Sovereign creation calls providers; cover client/server/dev/Edge/scripts; routes still work and authored assets remain. |
| R1 | Curated Regent offers, legacy-grant handling, Warden/player UI, canonical readiness and bypass restrictions | P0; coordinate S2 eligibility | Exactly three canonical candidates; forged/fourth choice rejected; concurrency cannot exceed two unlocks; retry stable; no level gate; second resolved unlock enables readiness. |
| C1 | Living identity, storage reconciliation, source resolver, ownership, existing sheets and exports | P0 | Distinct creatures stay distinct; existing fields survive; scoped access; mount views share effective creature stats. |
| C2 | Contextual tame/bond attempts, proficiency/bonus, adjudication, retry history and claim/release | C1 | D–S DCs; PB/bonus once; advantage/disadvantage and invalid attempts; no automatic rest retry; canonical ID agreement across server/client. |
| C3 | Persistent combat linkage, turn-order resolver, profile action economy/progression, mounting and rests | C1/C2 | No duplicate actor on repeat add; HP/conditions preserved; linked/independent initiative; separate reactions; rider/size/terrain limits; healing/downed and reload behavior. |
| M1 | Material definitions/lots, ownership, backfill, discovered metadata, inventory UI and export | P0 | Provenance stays distinct; old quantities/notes survive; unauthorized access rejected; regulation does not block mechanics. |
| M2 | Core extraction, then bulk/precision harvesting and portable equipment | M1 | Exact time/check/tool/DC precedence; approved yield; failures create no lot; retries never duplicate acquisition; metadata preserved. |
| M3 | One formula end to end: reserve → work → resolve/recover or complete → output | M1 | Competing reservations, stale writes, cancellation, lost-response retries and rollback; exactly one debit/output; legacy projects readable. |
| M4 | Remaining disciplines, tier/access checks, assistants, typed outputs, vehicle repair/refit and mount tack | M3 | PB/expertise/advantage correct; required tools/facilities; portable equivalents; valid owned targets; effects/repairs apply once. |
| M5 | Characterization, discovery, leads/hypotheses, approved experiments, iteration/proof/mastery | M2/M3; M4 for full outputs | One-hour and grade DC rules; experimental +2; capped iteration; approved counting/ownership; reload/export preserves knowledge. |
| I1 | Inscription using shared lots and existing target/slot logic | M1/M3 | Explicit DC wins; fallback correct; failed reagents ruined; critical-failure procedure preserved; effect and slot applied once. |
| B1 | External biological prototypes and optional formula-defined integration | M4/M5 | Approved targets/risks/requirements; linked outputs and versioned effects; no invented universal graft rules. |
| Q1 | Release audit, cross-system regressions, publication parity, migration rehearsal and final AI/dead-code audit | All shipping slices | Declared gates pass; remaining limitations recorded; no new campaign state in canon. |

The early parallel lanes are Sovereigns, Regent offers, companion identity and material lots. They share P0 decisions and small adapters; they do not require a wholesale character-engine rewrite. Coordinate edits to shared types, exports, rest code and migration numbering.

**Recommended first implementation PR: S1.** After resolving its limited mechanics/budget decisions, scope it to compatibility readers, typed v2 mechanics, semantic validation and fixtures. Keep persistence and UI out of this PR. R1 and M1 can proceed independently once their contracts are settled.

## Migration, rollout and verification policy

Use additive migrations and regenerate Supabase types after the local schema is valid. Validate the full migration chain and effective permissions. Source-text assertions alone do not prove RLS/RPC behavior.

Deploy compatible schema first, then readers/writers. Backfills must be restartable with counts and invariant reports. Keep old/new ID mappings and a compatibility-read period. Retire old writers/columns only after all consumers and exports move. Rollback disables new writes while retaining data; avoid destructive down-migrations.

For each storage slice, test owner, non-owner, Warden, co-Warden and unrelated campaign membership. Cover service execution where applicable and direct table/API bypasses, not only RPC calls. Existing Warden roster SELECT access does not imply new crafting/companion write permission.

For each behavior slice, add focused unit/integration tests and one complete user workflow. Use synthetic generic fixtures rather than live campaign content. Include reload, reconnect, stale writes, rests and export/import. Final Q1 testing supplements these gates.

Update authored rules and semantic book checks with each rule-changing slice. The build script embeds text duplicated in side files. Catalog parity currently lacks crafting book records (`scripts/validate-sourcebook-canon-parity.ts:133`), so its success alone cannot establish crafting prose correctness. Build affected books when inputs change; run full publication QA at release.

AI isolation checks must cover actual imports, endpoints and provider calls across runtime, dev tooling and executable scripts. Keep a precise allow-list: the client generator calls only the dedicated endpoint; SDKs/secrets remain server-side. Add runtime network assertions for zero provider requests on loading, leveling, actions, rests and exports. Historical documentation and existing generated assets are not active AI consumers.

Existing CI already includes lint, TypeScript, unused-code checks, Vitest, application/chunk verification, browser/mobile/accessibility checks, sourcebook/PDF gates, Edge checks and local database security tests. Extend those gates instead of replacing them with a text-search script.

## Traceability to the supplied roadmap

| Original sections | Refined home |
| --- | --- |
| 1–3, 68, 81 | P0, requirements, baseline and execution contracts |
| 4–15, 87 | S1–S4, versioned authority, atomic attachment and compatibility |
| 16–19, 70, 86 | R1, candidate offers and canonical readiness |
| 20–30, 73–74, 76–78, 80, 88–89 | C1–C3, ecology, identity, bonding, combat and profile progression; preserve XP/milestone choices |
| 31–42, 64, 72, 90 | M1/M2/M4, lots, harvesting, repair/refit |
| 43–56, 63, 65–66, 91, 93 | M3–M5, atomic projects, disciplines and research |
| 57–58, 92 | I1, common inventory and separate inscription procedures |
| 59–62 | B1 and typed project outputs in M4 |
| 67, 83–84 | Regulatory metadata and campaign boundaries throughout |
| 69, 71, 94 | A1 immediately after S4, with network/import regression checks |
| 75, 79, 85 | Existing sheet organization, rest and export acceptance per affected slice |
| 82 | Sourcebook changes within rule slices, plus Q1 publication verification |
| 95–96 | Replaced by the dependency-based delivery sequence above |
