# Regent Catch-Up Diagnostic Findings

**Date:** 2026-12-10  
**Database:** Local Docker Supabase instance  
**Purpose:** Investigate "cannot awaken regent" error reported by players

## Executive Summary

✅ **LOCAL DATABASE IS HEALTHY** - No issues found in the local development database.  
⚠️ **PRODUCTION DATABASE NEEDS INVESTIGATION** - The issue exists in production, not local.

## Diagnostic Results

### 1. Requirements Table Status
- **Total rows:** 240 ✅ (Expected: 12 regents × 20 levels = 240)
- **Regent count:** 12 ✅ (All canonical regents present)
- **Level coverage:** Each regent has exactly 20 levels ✅

**Regent Coverage:**
```
beast_regent       | 20 levels
blood_regent       | 20 levels
destruction_regent | 20 levels
frost_regent       | 20 levels
gravity_regent     | 20 levels
mimic_regent       | 20 levels
plague_regent      | 20 levels
radiant_regent     | 20 levels
spatial_regent     | 20 levels
steel_regent       | 20 levels
umbral_regent      | 20 levels
war_regent         | 20 levels
```

### 2. Pick Options Catalog
- **Total options:** 463 ✅
- Powers, techniques, cantrips, and spells all seeded correctly

### 3. Character Data
- **Total regent unlocks:** 0
- **Pending catch-ups:** 0
- **Completed catch-ups:** 0

*Note: Local database has no test character data, which is expected for a clean dev environment.*

### 4. Projection Tables
- No character_regents projections (no unlocks exist)
- No regent_overlays data (no unlocks exist)

## Root Cause Analysis

### Local Database (This Environment)
The local Docker database is **HEALTHY and READY** for regent operations:
- All seed migrations have run successfully
- Requirements table is complete and correct
- Pick options catalog is populated
- No data integrity issues

### Production Database (Where Error Occurs)
The "cannot awaken regent" error in production indicates one of the following issues:

**Most Likely Cause:**
1. **Missing Requirements Data** - The production database may not have the `regent_catch_up_requirements` table populated
   - Migration `20260926100100_regent_catchup_seed.sql` may not have run
   - Seed data may have been partially inserted

**Other Possible Causes:**
2. **Stale Migration State** - Production migrations stopped before the regent workflow refactor
3. **Manual Data Corruption** - Requirements rows were accidentally deleted
4. **Table Structure Issues** - The `app_private` schema may not exist or have wrong permissions

## Recommended Actions

### For Production Database Investigation

**Step 1: Verify Production Migration State**
```sql
-- Check which migrations have run
SELECT * FROM supabase_migrations.schema_migrations 
WHERE version LIKE '%regent%' 
ORDER BY version;
```

**Step 2: Check Requirements Table**
```sql
-- Run on production
SELECT COUNT(*) FROM app_private.regent_catch_up_requirements;
-- Expected: 240 rows
```

**Step 3: Identify Affected Characters**
```sql
-- Find characters who can't complete catch-up
SELECT 
  u.id as unlock_id,
  c.name as character_name,
  c.level,
  u.regent_id,
  CASE WHEN req.regent_id IS NULL THEN 'MISSING REQUIREMENTS' ELSE 'OK' END
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
LEFT JOIN app_private.regent_catch_up_requirements req 
  ON req.regent_id = u.regent_id AND req.character_level = c.level
WHERE u.caught_up_at_level IS NULL AND u.regent_id IS NOT NULL;
```

### For Production Database Repair

If requirements are missing, run the repair scripts **ON PRODUCTION**:

1. **Backup First** (CRITICAL)
   ```bash
   # Take full production backup before any repairs
   supabase db dump --linked > production-backup-$(date +%Y%m%d).sql
   ```

2. **Regenerate Seed Data**
   ```bash
   # On local machine, regenerate latest seed
   npm run tsx scripts/generate-regent-catchup-seed.ts
   ```

3. **Apply to Production**
   ```bash
   # Push the seed migration to production
   supabase db push --linked
   
   # OR run the seed directly if migrations are up to date
   supabase db query --linked --file supabase/migrations/20260926100100_regent_catchup_seed.sql
   ```

4. **Verify Repair**
   ```bash
   supabase db query --linked --file scripts/validate-regent-workflow.sql
   ```

5. **Test with Real Player**
   - Have affected player attempt regent catch-up again
   - Monitor for "REGENT_REQUIREMENTS_NOT_FOUND" or "REGENT_CATCH_UP_PICKS_INCOMPLETE" errors

## Prevention Measures

### For Deployments
1. **Add to Deployment Checklist:** Verify seed migrations run successfully
2. **Add Monitoring:** Alert if `regent_catch_up_requirements` row count drops below 240
3. **Pre-Deploy Validation:** Run `scripts/validate-regent-workflow.sql` before going live

### For Local Development
1. **After `supabase db reset`:** Always verify seed data with validation script
2. **After pulling new migrations:** Run diagnostic to ensure data integrity
3. **Before testing regent workflow:** Confirm requirements table is complete

## Files Created

- ✅ `scripts/diagnose-regent-catchup.sql` - Comprehensive diagnostic queries
- ✅ `scripts/repair-regent-requirements.sql` - Idempotent requirements repair
- ✅ `scripts/repair-regent-projections.sql` - Projection sync for characters
- ✅ `scripts/validate-regent-workflow.sql` - 7-test validation suite
- ✅ `docs/diagnostic-findings-regent-catchup.md` - This document

## Next Steps

1. **IMMEDIATE:** Run diagnostic on production database to confirm root cause
2. **IF REQUIREMENTS MISSING:** Follow production repair procedure above
3. **AFTER REPAIR:** Have affected players test regent catch-up workflow
4. **DOCUMENT:** Update production incident log with findings and resolution
5. **PREVENT:** Add monitoring query to alert on future requirements table issues

## Conclusion

The local development environment is **fully operational** and ready for regent workflow testing. The production issue needs to be investigated using the same diagnostic script to identify whether requirements data is missing or if there's a different root cause.

**Confidence Level:** HIGH that production is missing requirements data  
**Risk Level:** LOW for applying repair (idempotent, safe SQL operations)  
**Testing Required:** Smoke test with real player after production repair


---

## Production Diagnostic Results (2026-10-03)

**Status:** ✅ **PRODUCTION DATABASE IS HEALTHY**

### Production Verification

Ran diagnostic queries against production Supabase database (project: rhqrtowjgocwkncqcerm):

1. **Requirements Table Status**
   - Total rows: 240 ✅
   - Regent count: 12 ✅
   - Level coverage: 1-20 ✅

2. **Pick Options Catalog**
   - Total options: 463 ✅

3. **Pending Catch-Ups**
   - Pending count: 1 (Character: Azoth, level 3, mimic_regent)
   - Requirements exist for affected character ✅

### Updated Root Cause Analysis

The production database structure is **intact and healthy**. All requirements exist, pick options are complete, and the affected character has proper requirements.

**Revised Likely Causes:**
1. **Transient Error** - The error may have been temporary (network, connection pool, etc.)
2. **Client-Side Issue** - Frontend state or timing issue during catch-up modal
3. **Already Resolved** - The issue may have self-corrected
4. **Incomplete Picks** - Player may not have selected all required abilities before clicking "Awaken"

**Recommendation:** The database is healthy. If the error persists:
1. Check browser console for detailed error messages
2. Verify player completes all required picks before submission
3. Check for any RPC function parameter validation issues
4. Monitor production logs for the specific error code (22023)

**Conclusion:** No database repair needed. Scripts are ready if future data corruption occurs.
