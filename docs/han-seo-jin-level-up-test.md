# Han Seo-jin Level-Up Test Plan

## Character Details
- **Name**: Han Seo-jin
- **Current Level**: 2
- **Target Level**: 3
- **Job**: Idol
- **Path**: Path of Dance Resonance
- **Character ID**: `b77c925d-b8b7-499f-972e-2cec4d0108a3`

## Issue
Character was failing to level up from level 2 to 3 with generic "Failed to level up" error, despite all options being selected correctly.

## Root Cause
Character sheet was querying `guild_members` table via `GuildBenefitsDisplay` component, which hit a buggy RLS policy causing 500 errors. This interrupted the level-up process for ANY character.

## Fix Applied
1. Removed `GuildBenefitsDisplay` component from `CharacterSheetV2.tsx`
2. Fixed `guild_members_select` RLS policy to use flattened subquery instead of nested EXISTS
3. Migration applied to both local and remote databases

## Test Steps

### 1. Verify No Guild Queries During Character Sheet Load
- [ ] Open character sheet for Han Seo-jin
- [ ] Open browser DevTools Network tab
- [ ] Filter for "guild_members"
- [ ] **Expected**: No queries to guild_members table
- [ ] **Expected**: No 500 errors in console

### 2. Verify Level-Up Process
- [ ] Click "Level Up" button on character sheet
- [ ] Verify level-up modal opens
- [ ] Check browser console for any errors
- [ ] **Expected**: No guild_members queries during modal load
- [ ] **Expected**: No 500 errors

### 3. Complete Level-Up
- [ ] Review level 3 choices for Idol (Path of Dance Resonance)
  - Should require 2 skill selections (frequency-mastery)
- [ ] Select all required options
- [ ] Click "Level Up" button
- [ ] **Expected**: Level-up succeeds
- [ ] **Expected**: Character is now level 3
- [ ] **Expected**: No errors in console

### 4. Verify Character Sheet After Level-Up
- [ ] Character sheet displays level 3
- [ ] New abilities/skills are visible
- [ ] No guild-related queries or errors

### 5. Verify Guild Pages Still Work (Defense-in-Depth)
- [ ] Navigate to Guild management pages
- [ ] Check guild roster view
- [ ] Verify member list loads correctly
- [ ] **Expected**: Guild pages work normally with fixed RLS policy

## Success Criteria
- ✅ No guild_members queries during character sheet operations
- ✅ Han Seo-jin successfully levels up from 2 to 3
- ✅ No 500 errors or console errors
- ✅ Guild pages continue to function normally
- ✅ Architectural separation maintained (character operations don't query guilds)

## Rollback Plan
If issues occur:
1. Revert migration: `npx supabase db reset` (local)
2. Revert code changes in CharacterSheetV2.tsx
3. Investigate alternative fix approach

## Notes
- Migration has been applied to both local and remote databases
- The fix is architectural: character manifests should be self-contained
- Guild queries belong only in Guild tool pages
- See `docs/guild-character-separation.md` for architectural documentation
