# Parity Matrix (System-Level)

Updated: `2026-01-08`

Legend: ✅ Done | 🟡 Partial | ❌ Missing

| Subsystem | Status | Evidence (files) | Evidence (tests) | Notes |
|---|---|---|---|---|
| Auth/session + persistence + backups | ✅ | `src/integrations/supabase/client.ts`, `src/components/auth/ProtectedRoute.tsx`, `src/lib/guestStore.ts`, `src/hooks/useCharacterBackup.ts`, `src/lib/export.ts` | `src/test/releaseScenarios.test.ts`, `src/lib/guestStore.test.ts` | Guest mode + backup import/restore covered. |
| Compendium browse/search/filter/sort | ✅ | `src/pages/Compendium.tsx`, `src/components/ui/GlobalSearch.tsx` | `e2e/compendium.spec.ts`, `e2e/search.spec.ts`, `e2e/global-search.spec.ts` | Search operators + filtering verified in e2e. |
| Compendium deep links + cross-links | ✅ | `src/pages/compendium/CompendiumDetail.tsx`, `src/lib/compendiumResolver.ts` | `e2e/compendium-detail.spec.ts`, `src/test/parity/linkIntegrity.test.ts` | Resolver verifies link integrity. |
| Add-to-character flows | ✅ | `src/components/character/AddPowerDialog.tsx`, `src/components/character/AddEquipmentDialog.tsx`, `src/lib/characterCreation.ts` | `src/test/releaseScenarios.test.ts` | Equipment/power adds covered for guest flow. |
| Character builder | ✅ | `src/pages/CharacterNew.tsx`, `src/lib/characterCreation.ts` | `e2e/character.spec.ts`, `src/lib/system-flows.test.ts` | Validated steps + automation. |
| Level-up flow | ✅ | `src/pages/CharacterLevelUp.tsx`, `src/lib/characterCalculations.ts` | `src/lib/system-flows.test.ts` | HP/proficiency scaling tested. |
| Character sheet automation | ✅ | `src/pages/CharacterSheet.tsx`, `src/lib/equipmentModifiers.ts`, `src/lib/conditions.ts`, `src/lib/restSystem.ts` | `src/test/parity/automation.test.ts`, `src/lib/automation.test.ts` | Deterministic derived stats + conditions. |
| Dice roller + roll log | ✅ | `src/pages/DiceRoller.tsx`, `src/lib/diceRoller.ts`, `src/lib/rollEngine.ts`, `src/hooks/useRollHistory.ts` | `src/lib/diceRoller.test.ts`, `src/lib/rollEngine.test.ts`, `src/hooks/useRollHistory.test.tsx`, `e2e/dice.spec.ts` | Advantage/disadvantage + history verified. |
| Encounters / combat tracker | ✅ | `src/pages/dm-tools/InitiativeTracker.tsx`, `src/pages/dm-tools/EncounterBuilder.tsx` | `src/pages/dm-tools/InitiativeTracker.test.tsx`, `src/pages/dm-tools/EncounterBuilder.test.ts`, `e2e/dm-tools.spec.ts` | Initiative, HP, conditions, persistence covered. |
| Campaigns / table tools | ✅ | `src/pages/Campaigns.tsx`, `src/pages/CampaignDetail.tsx`, `src/components/campaign/*`, `src/hooks/useCampaigns.ts` | `src/hooks/useCampaigns.test.tsx` | Requires authenticated Supabase. |
| Offline / PWA | ✅ | `src/components/ui/OfflineIndicator.tsx`, `src/components/ui/ServiceWorkerUpdatePrompt.tsx`, `docs/PWA_SETUP.md` | `npm run build` | PWA build output verified. |
| UX/accessibility/performance | ✅ | `src/components/ui/*`, `src/components/layout/Layout.tsx` | `e2e/search.spec.ts`, `e2e/home.spec.ts` | ARIA + accessible navigation checks in e2e. |
