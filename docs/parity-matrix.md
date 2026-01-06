## Parity Matrix (D&D Beyond-like Companion Systems)

This is the canonical parity status matrix. “Status” is backed by file paths + tests where available.

Legend:
- ✅ Done
- 🟡 Partial / gated / needs follow-up proof
- ❌ Missing

---

## Core Systems

| Subsystem | Status | Evidence (files) | Evidence (tests) | Notes |
|---|---:|---|---|---|
| **Bootstrap / Setup mode** | ✅ | `src/integrations/supabase/client.ts`, `src/components/auth/ProtectedRoute.tsx`, `src/pages/Setup.tsx`, `src/App.tsx` | `npm run test:e2e` | App boots without Supabase env vars; protected routes redirect to `/setup`. |
| **Guest mode (guest-lite)** | ✅ | `src/lib/guestStore.ts`, `src/hooks/useCharacters.ts` | `src/lib/guestStore.test.ts` | Unauthenticated users can create/manage **one local Hunter**. |
| **Compendium browse + search** | ✅ | `src/pages/Compendium.tsx`, `src/components/ui/GlobalSearch.tsx` | `e2e/compendium.spec.ts`, `e2e/search.spec.ts`, `e2e/global-search.spec.ts` | Data requires Supabase configured; UI remains stable in setup mode. |
| **Compendium deep links** | ✅ | `src/pages/compendium/CompendiumDetail.tsx`, `src/components/character/CompendiumLink.tsx` | `e2e/compendium-detail.spec.ts` | — |
| **Reference resolver + link integrity** | ✅ | `src/lib/compendiumResolver.ts`, `src/lib/linkIntegrity.ts` | `src/test/parity/linkIntegrity.test.ts` | Canonical ref resolution API exists. |
| **Character builder (wizard)** | ✅ | `src/pages/CharacterNew.tsx`, `src/lib/characterCreation.ts` | `e2e/character.spec.ts`, `src/lib/system-flows.test.ts` | Builder writes core records + applies starting features/equipment/powers. |
| **Character sheet** | ✅ | `src/pages/CharacterSheet.tsx` | `src/test/parity/automation.test.ts` | Derived stats + core panels wired. |
| **Rules automation (derived stats)** | ✅ | `src/lib/characterCalculations.ts`, `src/lib/equipmentModifiers.ts`, `src/lib/effectsEngine.ts` | `src/test/parity/automation.test.ts` | Deterministic derived math. |
| **Rest system** | ✅ | `src/lib/restSystem.ts` | `src/lib/system-flows.test.ts`, `src/test/parity/automation.test.ts` | Short/long rest resets. |
| **Dice roller + roll engine** | ✅ | `src/lib/diceRoller.ts`, `src/lib/rollEngine.ts`, `src/pages/DiceRoller.tsx` | `src/lib/diceRoller.test.ts`, `src/lib/rollEngine.test.ts`, `e2e/dice.spec.ts` | Advantage/disadvantage + roll UI. |
| **Roll history** | ✅ | `src/hooks/useRollHistory.ts`, `src/components/character/RollHistoryPanel.tsx` | `src/hooks/useRollHistory.test.tsx` | Requires `roll_history` table when authenticated. |
| **Encounters / combat tools** | 🟡 | `src/pages/dm-tools/EncounterBuilder.tsx`, `src/pages/dm-tools/InitiativeTracker.tsx` | `e2e/dm-tools.spec.ts` | Tools are DM-gated; e2e currently proves route wiring + protected behavior (not authenticated DM flows). |
| **Campaigns / table tools** | 🟡 | `src/pages/Campaigns.tsx`, `src/pages/CampaignDetail.tsx`, `src/hooks/useCampaigns.ts` | (needs more coverage) | Requires authenticated Supabase. Needs additional tests to prove core flows. |
| **PWA / offline** | 🟡 | `docs/PWA_SETUP.md` | (needs verification) | Intended but not fully parity-proven in tests. |
| **Deploy readiness (Vercel)** | ✅ | `docs/DEPLOY_CHECKLIST.md` | `npm run build` | Build is green; env var guidance documented. |

---

## Required Gates (Current)

All must pass before release:

- `npm run lint`
- `npm run typecheck`
- `npm run test -- --run`
- `npm run test:e2e`
- `npm run build`

Canonical evidence:
- `docs/TEST_REPORT.md`


