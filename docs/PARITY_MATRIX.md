# Parity Matrix — D&D Beyond-like Systems Audit

This document tracks the implementation status of all core systems required for D&D Beyond-like functionality.

## Legend

- ✅ **Implemented** - Feature exists and works
- ⚠️ **Partial** - Feature exists but has gaps or edge cases
- ❌ **Missing** - Feature not implemented
- 🔧 **Needs Fix** - Feature exists but needs improvement

---

## A) Compendium & Navigation

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Global Search** | ✅ | `src/components/ui/GlobalSearch.tsx`, `src/pages/Compendium.tsx` | Supabase RPCs (`search_compendium_*`) | ❌ | None | Add e2e test |
| **Deep Links** | ✅ | `src/components/character/CompendiumLink.tsx` | Route params | ❌ | None | Add e2e test |
| **Reference Resolver** | ❌ | N/A (ad-hoc queries) | Supabase tables | ❌ | No centralized `resolveRef(type, id)` | **Phase 2.1**: Create `src/lib/compendiumResolver.ts` |
| **Link Integrity** | ❌ | N/A | Character data + compendium | ❌ | No dead reference detection | **Phase 2.3**: Create `src/lib/linkIntegrity.ts` |
| **Related Content** | ⚠️ | `src/components/compendium/RelatedContent.tsx` | Tags-based queries | ❌ | Uses ad-hoc queries, not resolver | **Phase 2.2**: Update to use resolver |
| **Command Palette** | ⚠️ | `src/components/ui/CommandPalette.tsx` | Direct Supabase queries | ❌ | Uses ad-hoc queries, not resolver | **Phase 2.2**: Update to use resolver |
| **Breadcrumbs** | ✅ | `src/components/compendium/Breadcrumbs.tsx` | Route params | ❌ | None | Add unit test |

**Summary**: Core search/navigation exists but lacks centralized resolver and link integrity checking.

---

## B) Character Builder

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Step-by-Step Wizard** | ✅ | `src/pages/CharacterNew.tsx` | Compendium queries | ❌ | None | Add e2e test |
| **Ability Score Methods** | ✅ | `src/pages/CharacterNew.tsx` | Local state | ❌ | Standard array, point buy, manual | Add unit test |
| **Job Selection** | ✅ | `src/pages/CharacterNew.tsx` | `compendium_jobs` | ❌ | None | Add e2e test |
| **Path Selection** | ✅ | `src/pages/CharacterNew.tsx` | `compendium_job_paths` | ❌ | Optional selection | Add e2e test |
| **Background Selection** | ✅ | `src/pages/CharacterNew.tsx` | `compendium_backgrounds` | ❌ | Required selection | Add e2e test |
| **Skill Selection** | ✅ | `src/pages/CharacterNew.tsx` | Job `skill_choices` | ❌ | Validates choice count | Add unit test |
| **Prerequisites Validation** | ⚠️ | `src/pages/CharacterNew.tsx` | Job/Path data | ❌ | Basic validation exists, may miss edge cases | **Phase 1**: Audit validation logic |
| **Feature Auto-Application** | ✅ | `src/lib/characterCreation.ts` | `compendium_job_features` | ❌ | Adds level 1 features | Add integration test |
| **Starting Equipment** | ✅ | `src/lib/characterCreation.ts` | Job/Background data | ❌ | Adds starting equipment | Add integration test |
| **Starting Powers** | ✅ | `src/lib/characterCreation.ts` | Job data | ❌ | Adds starting powers | Add integration test |
| **Builder → Sheet Consistency** | ⚠️ | N/A | Character data | ❌ | No verification that builder output matches sheet calculations | **Phase 4**: Add test comparing builder output to sheet |

**Summary**: Builder is functional but needs validation audit and builder→sheet consistency tests.

---

## C) Character Sheet Automations

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Derived Stats** | ✅ | `src/lib/characterCalculations.ts` | Character data | ✅ | Basic tests exist | Expand test coverage |
| **Proficiency Bonus** | ✅ | `src/lib/characterCalculations.ts` | Level | ✅ | Tested | None |
| **Ability Modifiers** | ✅ | `src/lib/characterCalculations.ts` | Abilities | ✅ | Tested | None |
| **Saving Throws** | ✅ | `src/lib/characterCalculations.ts` | Abilities + proficiencies | ⚠️ | Basic tests | Add edge case tests |
| **Skills** | ✅ | `src/lib/skills.ts` | Abilities + proficiencies + expertise | ⚠️ | Basic tests | Add edge case tests |
| **AC Calculation** | ✅ | `src/lib/equipmentModifiers.ts` | Base AC + equipment | ⚠️ | Basic tests | **Phase 4**: Add equip/unequip tests |
| **Speed Calculation** | ✅ | `src/lib/characterCalculations.ts` | Base speed + equipment + encumbrance | ⚠️ | Basic tests | Add encumbrance edge cases |
| **Initiative** | ✅ | `src/lib/characterCalculations.ts` | AGI modifier | ⚠️ | Basic tests | Add edge cases |
| **HP Max Calculation** | ✅ | `src/lib/characterCalculations.ts` | Level + VIT + hit die | ✅ | Tested | None |
| **Attacks** | ✅ | `src/components/character/ActionsList.tsx` | Equipment + abilities + proficiency | ❌ | None | **Phase 4**: Add attack roll tests |
| **Attack Modifiers** | ✅ | `src/lib/equipmentModifiers.ts` | Equipment properties | ⚠️ | Basic tests | Add edge cases |
| **Advantage/Disadvantage** | ⚠️ | `src/lib/rollEngine.ts` | Conditions + equipment | ❌ | Logic exists but not fully tested | **Phase 4**: Add adv/disadv tests |
| **Spellcasting** | ✅ | `src/components/character/SpellSlotsDisplay.tsx`, `src/hooks/useSpellSlots.ts` | Character level + job | ❌ | None | **Phase 4**: Add spellcasting tests |
| **Spell Save DC** | ✅ | `src/lib/characterCalculations.ts` | INT modifier + proficiency | ⚠️ | Basic tests | Add edge cases |
| **Spell Attack Bonus** | ✅ | `src/lib/characterCalculations.ts` | INT modifier + proficiency | ⚠️ | Basic tests | Add edge cases |
| **Spell Slot Tracking** | ✅ | `src/hooks/useSpellSlots.ts` | `character_spell_slots` table | ❌ | None | **Phase 4**: Add slot consumption tests |
| **Inventory Management** | ✅ | `src/components/character/EquipmentList.tsx` | `character_equipment` table | ❌ | None | Add e2e test |
| **Equip/Unequip** | ✅ | `src/components/character/EquipmentList.tsx` | Equipment state | ❌ | None | **Phase 4**: Add equip/unequip automation tests |
| **Attunement** | ✅ | `src/components/character/EquipmentList.tsx` | Equipment `requires_attunement` | ❌ | None | **Phase 4**: Add attunement tests |
| **Equipment Effects** | ✅ | `src/lib/equipmentModifiers.ts` | Equipment properties | ⚠️ | Basic tests | **Phase 3**: Integrate with effects engine |
| **Conditions** | ✅ | `src/lib/conditions.ts` | Character `conditions` array | ❌ | None | **Phase 4**: Add condition application tests |
| **Condition Stacking** | ⚠️ | `src/lib/conditions.ts` | Condition definitions | ❌ | Logic exists but not tested | **Phase 4**: Add stacking tests |
| **Short Rest** | ✅ | `src/lib/restSystem.ts` | Character + features | ❌ | None | **Phase 4**: Add rest reset tests |
| **Long Rest** | ✅ | `src/lib/restSystem.ts` | Character + features + spell slots | ❌ | None | **Phase 4**: Add rest reset tests |
| **Rune System** | ✅ | `src/lib/runeAutomation.ts`, `src/components/character/RunesList.tsx` | `compendium_runes`, `character_rune_inscriptions` | ❌ | None | **Phase 4**: Add rune tests |
| **Rune Passive Bonuses** | ✅ | `src/lib/runeAutomation.ts` | Active rune inscriptions | ❌ | None | **Phase 4**: Add bonus application tests |
| **Encumbrance** | ✅ | `src/lib/encumbrance.ts` | Equipment weight + STR | ⚠️ | Basic tests | Add edge case tests |

**Summary**: Core automations exist but need comprehensive testing and effects engine integration.

---

## D) Dice + Game Log

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Dice Rolling** | ✅ | `src/lib/diceRoller.ts` | Dice string parsing | ⚠️ | Basic tests | Add edge case tests |
| **Roll Engine** | ✅ | `src/lib/rollEngine.ts` | Advantage/disadvantage logic | ❌ | None | **Phase 4**: Add roll engine tests |
| **Roll Display** | ✅ | `src/components/character/ActionsList.tsx` | Toast notifications | ❌ | None | Add e2e test |
| **Roll History** | ✅ | `src/hooks/useRollHistory.ts` | `roll_history` table (or localStorage) | ❌ | None | Add integration test |
| **3D Dice Visualization** | ✅ | `src/components/dice/Dice3D.tsx` | Three.js | ❌ | None | Optional: Add visual test |
| **Roll Modifiers** | ✅ | `src/lib/rollEngine.ts` | Equipment + conditions | ❌ | None | **Phase 4**: Add modifier tests |
| **Roll Tags** | ⚠️ | `src/lib/rollEngine.ts` | Advantage, rerolls, minimums | ❌ | Logic exists but not fully tested | **Phase 4**: Add tag tests |

**Summary**: Dice system is complete but needs comprehensive testing.

---

## E) Encounters/Combat

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Initiative Tracker** | ✅ | `src/pages/dm-tools/InitiativeTracker.tsx` | Local state | ❌ | None | Add e2e test |
| **Encounter Builder** | ✅ | `src/pages/dm-tools/EncounterBuilder.tsx` | Compendium monsters | ❌ | None | Add e2e test |
| **Monster Addition** | ✅ | `src/pages/dm-tools/EncounterBuilder.tsx` | `compendium_monsters` | ❌ | None | Add e2e test |
| **HP Tracking** | ✅ | Initiative tracker | Character/monster HP | ❌ | None | Add e2e test |
| **Condition Tracking** | ✅ | Initiative tracker | Character conditions | ❌ | None | Add e2e test |
| **Turn Flow** | ✅ | Initiative tracker | Turn order logic | ❌ | None | Add e2e test |
| **Party Tracker** | ✅ | `src/pages/dm-tools/PartyTracker.tsx` | Campaign characters | ❌ | None | Add e2e test |

**Summary**: Encounter tools are complete but need e2e tests.

---

## F) Additional Systems

| Feature/System | Status | Where (Files/Modules) | Data Deps | Tests | Gaps | Fix Plan |
|----------------|--------|----------------------|-----------|-------|------|----------|
| **Character Templates** | ✅ | `src/hooks/useCharacterTemplates.ts` | `character_templates` table | ❌ | None | Add integration test |
| **Character Sharing** | ✅ | `src/hooks/useCharacters.ts` | `share_token` field | ❌ | None | Add e2e test |
| **Character Export** | ✅ | `src/lib/export.ts` | Character data | ❌ | None | Add unit test |
| **Character Backup** | ✅ | `src/hooks/useCharacterBackup.ts` | Supabase storage | ❌ | None | Add integration test |
| **Favorites** | ✅ | `src/hooks/useFavorites.ts` | `user_favorites` table | ❌ | None | Add e2e test |
| **Campaigns** | ✅ | `src/pages/Campaigns.tsx` | `campaigns` table | ❌ | None | Add e2e test |
| **Campaign Chat** | ✅ | `src/components/campaign/CampaignChat.tsx` | `campaign_chat` table | ❌ | None | Add e2e test |
| **Content Audit** | ✅ | `src/pages/admin/ContentAudit.tsx` | All compendium tables | ❌ | None | Add integration test |

**Summary**: Additional systems are complete but need tests.

---

## Critical Gaps Summary

### High Priority (Phase 2)
1. ❌ **No centralized reference resolver** - All components query Supabase directly
2. ❌ **No link integrity checker** - Dead references not detected

### Medium Priority (Phase 3)
3. ⚠️ **Scattered automation** - No unified effects engine
4. ⚠️ **Hardcoded logic** - Some automation uses ad-hoc calculations

### Testing Gaps (Phase 4)
5. ❌ **Limited test coverage** - Most features lack tests
6. ❌ **No builder→sheet consistency tests** - No verification that builder output matches sheet
7. ❌ **No automation edge case tests** - Equip/unequip, condition stacking, rest resets

### UX Gaps (Phase 5)
8. ⚠️ **Inconsistent error handling** - Some async operations lack error handling
9. ⚠️ **Missing loading states** - Some data-fetching components lack loading indicators
10. ⚠️ **Missing empty states** - Some lists don't show empty state

---

## Fix Priority Order

1. **Phase 2**: Create resolver and link integrity checker (foundation)
2. **Phase 3**: Create unified effects engine (automation hardening)
3. **Phase 4**: Add comprehensive test suite (verification)
4. **Phase 5**: Polish UX (user experience)
5. **Phase 6**: Deploy readiness (production)

---

## Success Metrics

- ✅ All systems have at least basic tests
- ✅ Reference resolver used everywhere
- ✅ Link integrity checker works
- ✅ Effects engine handles all automation
- ✅ Builder output matches sheet calculations
- ✅ All edge cases tested
- ✅ No console noise
- ✅ Consistent UX patterns
- ✅ Deploy checklist complete

