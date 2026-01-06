# Wiring Report — Compendium Reference Resolution

This document tracks all places in the codebase that consume compendium data and confirms they route through the centralized resolver.

## Centralized Resolver

**Location**: `src/lib/compendiumResolver.ts`

**Functions**:
- `resolveRef(type: EntryType, id: string): Promise<CompendiumEntity | null>` - Resolve single reference
- `resolveRefs(refs: Array<{type, id}>): Promise<Map<string, CompendiumEntity>>` - Resolve multiple references (keyed by `"type:id"`)
- `getTableName(type: EntryType): keyof Database['public']['Tables']` - Get table name for type
- `validateRef(type: EntryType, id: string): Promise<boolean>` - Validate reference exists
- `isValidEntryType(type: string): type is EntryType` - Validate entry type

**Resolver behavior**:
- `resolveRef()` loads the **full row** for a compendium entry (`select('*')`) so detail pages can render all fields.

**Supported Entry Types**:
- `jobs`, `paths`, `powers`, `runes`, `relics`, `monsters`, `backgrounds`, `conditions`, `monarchs`, `feats`, `skills`, `equipment`, `sovereigns`, `shadow-soldiers`

---

## Canonical Identity (Compendium Entities)

- **Canonical key**: `(type, id)` where `type` is `EntryType` and `id` is the Supabase row `id` (UUID string).
- **Type → table mapping**: Defined in `src/lib/compendiumResolver.ts` (`tableMap`).
- **Schema evidence**: Compendium tables expose `Row.id: string` in `src/integrations/supabase/types.ts`.
- **Known exception (name-based)**: `characters.job`, `characters.path`, `characters.background` are stored as names; `src/lib/linkIntegrity.ts` validates those via name lookups.

---

## Compendium Consumers Audit

### ✅ Using Resolver (Updated)

| File | Function/Component | Usage | Status |
|------|-------------------|-------|--------|
| `src/pages/compendium/CompendiumDetail.tsx` | `fetchEntry()` | Uses `resolveRef()` to load entry | ✅ Updated |
| `src/pages/compendium/CompendiumDetail.tsx` | Related content query | Uses `getTableName()` for table lookup | ✅ Updated |
| `src/components/compendium/SovereignDetail.tsx` | `fetchData()` | Uses `resolveRef()` for job/path/monarch lookups | ✅ Updated |
| `src/components/ui/CommandPalette.tsx` | Compendium search | Uses `getTableName()` for table queries | ✅ Updated |
| `src/lib/export.ts` | `exportCompendiumEntries()` | Uses `getTableName()` for table lookup | ✅ Updated |
| `src/lib/linkIntegrity.ts` | `checkLinkIntegrity()` | Uses `resolveRef()` to validate rune references | ✅ Updated |

### ✅ Single-Entity Lookups (Resolver-Backed)

- `src/components/compendium/PathDetail.tsx`: Path → Job header lookup now uses `resolveRef('jobs', jobId)` (migrated from direct `supabase.from('compendium_jobs')`).

### ⚠️ Bulk Queries (Legitimate - Not Using Resolver)

These files perform bulk queries/filtering rather than resolving individual references. They are **legitimate** and don't need the resolver:

| File | Function/Component | Usage | Reason |
|------|-------------------|-------|--------|
| `src/pages/Compendium.tsx` | Main compendium browser | Bulk queries with filters/search | Bulk operations |
| `src/components/ui/GlobalSearch.tsx` | Global search | Bulk search across multiple tables | Bulk operations |
| `src/components/compendium/CompendiumQuickStats.tsx` | Quick stats | Count queries for statistics | Statistics only |
| `src/hooks/useContentAudit.ts` | Content audit | Count queries for audit | Audit operations |
| `src/components/tools/ComparisonTool.tsx` | Comparison tool | Bulk queries for comparison | Bulk operations |

### ✅ Link Component (No Resolution Needed)

| File | Function/Component | Usage | Status |
|------|-------------------|-------|--------|
| `src/components/character/CompendiumLink.tsx` | `CompendiumLink` | Creates navigation links | ✅ No resolver needed (just creates links) |

---

## Link Integrity Checker

**Location**: `src/lib/linkIntegrity.ts`

**Functions**:
- `checkLinkIntegrity(characterId: string): Promise<BrokenLink[]>` - Check single character
- `checkAllLinkIntegrity(): Promise<IntegrityReport>` - Check all characters

**Integration**: `src/pages/admin/ContentAudit.tsx` - Added `LinkIntegritySection` component

**Checks Performed**:
1. ✅ Character job name → `compendium_jobs.name`
2. ✅ Character path name → `compendium_job_paths.name`
3. ✅ Character background name → `compendium_backgrounds.name`
4. ✅ Rune inscriptions → `compendium_runes.id` (via `resolveRef()`)
5. ✅ Rune knowledge → `compendium_runes.id` (via `resolveRef()`)

**Future Enhancements**:
- Feature source parsing (if source field is standardized)
- Power source parsing (if source field contains compendium IDs)
- Equipment compendium references (if equipment table adds `compendium_equipment_id`)

---

## Reference Patterns

### Pattern 1: Single Entity Resolution
**Use**: `resolveRef(type, id)`
**Example**: Loading a compendium entry detail page
```typescript
const entity = await resolveRef('jobs', jobId);
```

### Pattern 2: Bulk Queries
**Use**: Direct Supabase queries with `getTableName()` for type safety
**Example**: Searching/filtering compendium entries
```typescript
const tableName = getTableName('jobs');
const { data } = await supabase.from(tableName).select('*').ilike('name', `%${search}%`);
```

### Pattern 3: Table Name Lookup
**Use**: `getTableName(type)` for type-safe table access
**Example**: Exporting compendium entries
```typescript
const tableName = getTableName(entryType);
const { data } = await supabase.from(tableName).select('*').in('id', entryIds);
```

---

## Migration Status

### Phase 2.1: Resolver Creation ✅
- Created `src/lib/compendiumResolver.ts`
- Implemented `resolveRef()`, `resolveRefs()`, `getTableName()`, `validateRef()`, `isValidEntryType()`

### Phase 2.2: Wiring Updates ✅
- Updated `CompendiumDetail.tsx` to use resolver
- Updated `SovereignDetail.tsx` to use resolver
- Updated `CommandPalette.tsx` to use resolver
- Updated `export.ts` to use resolver

### Phase 2.3: Link Integrity ✅
- Created `src/lib/linkIntegrity.ts`
- Integrated into `ContentAudit.tsx`

### Phase 2.4: Documentation ✅
- Created this wiring report

---

## Verification

**Type Safety**: ✅ All resolver functions are fully typed
**Error Handling**: ✅ Resolver handles errors gracefully (returns null)
**Link Integrity**: ✅ Checker validates known reference types (tests: `src/test/parity/linkIntegrity.test.ts`, run via `npm run test -- --run`)
**Integration**: ✅ Single-entity compendium lookups are resolver-backed (see consumer audit)

---

## Known Limitations

1. **Name-based References**: Character job/path/background are stored as names, not IDs. Link integrity checker does name-based lookups, which is less robust than ID-based references.

2. **Feature/Power Sources**: The `source` field in `character_features` and `character_powers` may contain compendium references, but the format is not standardized, so we can't reliably parse them.

3. **Equipment References**: `character_equipment` stores equipment data directly (denormalized). If we add `compendium_equipment_id` in the future, we should check those references.

---

## Recommendations

1. **Future Schema Changes**: Consider adding `compendium_job_id`, `compendium_path_id`, `compendium_background_id` to `characters` table for more robust references.

2. **Standardize Source Fields**: If `character_features.source` and `character_powers.source` should reference compendium entries, standardize the format (e.g., `"Job:feature-id"` or `"Path:feature-id"`).

3. **Add Equipment References**: If equipment should reference `compendium_equipment`, add `compendium_equipment_id` to `character_equipment` table.

4. **Expand Link Integrity**: Once schema changes are made, expand link integrity checker to validate new reference types.

---

## Summary

✅ **Resolver Created**: Centralized reference resolution system in place
✅ **Key Consumers Updated**: Single-entity resolution uses resolver
✅ **Link Integrity**: Checker validates all known reference types
✅ **Documentation**: Wiring report complete

**Status**: Phase 3 in progress. Bulk queries remain as direct Supabase queries (by design); remaining single-entity lookups are listed above under “To Migrate”.

