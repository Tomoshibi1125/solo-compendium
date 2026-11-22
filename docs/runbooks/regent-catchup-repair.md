# Runbook: Regent Catch-Up "Cannot Awaken Regent" Error Repair

**Incident:** Players receive "cannot awaken regent" error when completing regent attunement  
**Root Cause:** Missing `app_private.regent_catch_up_requirements` table data  
**Impact:** All players attempting regent catch-up ritual affected  
**Severity:** HIGH (blocks core game progression)  
**Status:** Repair scripts ready, awaiting production deployment

---

## Quick Reference

| Script | Purpose | Safe to Re-run? |
|--------|---------|-----------------|
| `scripts/diagnose-regent-catchup.sql` | Identify exact issue | ✅ Yes (read-only) |
| `scripts/repair-regent-requirements.sql` | Fix requirements table | ✅ Yes (idempotent) |
| `scripts/repair-regent-projections.sql` | Sync character projections | ✅ Yes (idempotent) |
| `scripts/validate-regent-workflow.sql` | Verify complete fix | ✅ Yes (read-only) |

---

## Pre-Flight Checklist

- [ ] **Database backup taken** (CRITICAL - required before any writes)
- [ ] **Maintenance window scheduled** (if possible)
- [ ] **Affected players notified** (optional - fix is fast)
- [ ] **Diagnostic script reviewed** to understand current state
- [ ] **Rollback procedure prepared** (restore from backup if needed)
- [ ] **Test player identified** for post-repair verification

---

## Diagnosis Phase

### Step 1: Connect to Production Database

**Via Supabase CLI:**
```bash
# Ensure you're linked to production
supabase link --project-ref YOUR_PROJECT_REF

# Verify connection
supabase db query --linked -c "SELECT current_database();"
```

**Via Direct Connection:**
```bash
# Use production connection string from environment
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

### Step 2: Run Diagnostic Script

```bash
# Execute diagnostic queries
supabase db query --linked --file scripts/diagnose-regent-catchup.sql
```

**Expected Output Analysis:**

#### If Requirements Table is EMPTY or INCOMPLETE:
```
regent_count: 0-11 (should be 12)
total_rows: 0-239 (should be 240)
```
**Action:** Proceed to Repair Phase - Requirements missing

#### If Requirements Table is COMPLETE but Characters Have Issues:
```
regent_count: 12 ✓
total_rows: 240 ✓
pending_catchup_count: > 0
requirements_status: "NO REQUIREMENTS" for some characters
```
**Action:** Proceed to Repair Phase - Projection sync needed

#### If Everything Looks Healthy:
```
regent_count: 12 ✓
total_rows: 240 ✓
all tests showing "OK"
```
**Action:** Issue is elsewhere - escalate to engineering team

### Step 3: Document Current State

Save diagnostic output to file for incident report:
```bash
supabase db query --linked --file scripts/diagnose-regent-catchup.sql > diagnostic-output-$(date +%Y%m%d-%H%M%S).txt
```

---

## Repair Phase

### CRITICAL: Take Production Backup

```bash
# Full database dump (recommended)
supabase db dump --linked > production-backup-regent-repair-$(date +%Y%m%d).sql

# Verify backup file exists and is not empty
ls -lh production-backup-regent-repair-*.sql
```

**⚠️ DO NOT PROCEED WITHOUT BACKUP ⚠️**

---

### Repair Scenario A: Requirements Table is Missing/Incomplete

This is the most likely scenario based on error symptoms.

#### A1. Regenerate Seed Data (Local Machine)

```bash
# Ensure compendium data is latest
cd /path/to/solo-compendium

# Regenerate the seed migration
npm run tsx scripts/generate-regent-catchup-seed.ts

# Verify the seed file was updated
git diff supabase/migrations/20260926100100_regent_catchup_seed.sql
```

#### A2. Apply Requirements Repair to Production

```bash
# Execute the repair script
supabase db query --linked --file scripts/repair-regent-requirements.sql
```

**Expected Output:**
```
Step 1: Verifying current state...
current_regent_count: [0-11]
current_total_rows: [0-239]

Step 2: Re-running seed migration...
INSERT 0 463  (pick options)
INSERT 0 240  (requirements)

Step 3: Verifying repair results...
regent_count: 12
total_rows: 240
min_level: 1
max_level: 20

Step 4: Checking each regent...
[12 rows showing all regents with 20 levels each]

REQUIREMENTS REPAIR COMPLETE
```

#### A3. Verify Requirements Fix

```bash
# Quick verification query
supabase db query --linked -c "SELECT COUNT(*) FROM app_private.regent_catch_up_requirements;"
# Expected: 240
```

---

### Repair Scenario B: Projection Mismatches

If requirements exist but character projections are out of sync.

#### B1. Sync All Character Projections

```bash
# Execute projection repair
supabase db query --linked --file scripts/repair-regent-projections.sql
```

**Expected Output:**
```
Step 1: Identifying characters...
characters_with_unlocks: [number]

Step 2: Syncing projections...
Successfully synced [number] character regent projections

Step 3: Verifying consistency...
remaining_mismatches: 0

Step 4: Verifying overlays...
remaining_overlay_mismatches: 0

PROJECTION REPAIR COMPLETE
```

#### B2. Handle Sync Errors (If Any)

If warnings appear during sync:
```
WARNING: Failed to sync character [uuid]: [error message]
```

**Action:**
1. Note the character UUID
2. Manually investigate that specific character
3. Check for data corruption in `character_regent_unlocks`
4. May need manual intervention for that character

---

## Validation Phase

### Step 1: Run Complete Validation Suite

```bash
# Execute all validation tests
supabase db query --linked --file scripts/validate-regent-workflow.sql
```

**Success Criteria:**
```
Test 1: ✓ PASS - All 240 requirement rows present
Test 2: ✓ PASS - All regents have 20 levels
Test 3: ✓ PASS - All projections match unlock authority
Test 4: ✓ PASS - All overlay arrays match unlock authority
Test 5: ✓ PASS - All pending catch-ups have requirements available
Test 6: ✓ PASS - [number] pick options available
Test 7: ✓ PASS - All 12 regents have requirements

VALIDATION SUMMARY:
tests_passed: 7
total_tests: 7
overall_status: ✓✓✓ ALL TESTS PASSED - SYSTEM HEALTHY ✓✓✓
```

### Step 2: Test with Real Player

**Identify Test Subject:**
```sql
-- Find a player with pending catch-up
SELECT 
  c.id,
  c.name,
  c.level,
  u.regent_id,
  u.unlocked_at
FROM public.character_regent_unlocks u
JOIN public.characters c ON c.id = u.character_id
WHERE u.caught_up_at_level IS NULL 
  AND u.regent_id IS NOT NULL
ORDER BY u.unlocked_at DESC
LIMIT 5;
```

**Test Procedure:**
1. Contact the player (or use test account)
2. Have them navigate to their character sheet
3. Click on regent catch-up modal
4. Select powers/spells/techniques
5. Click "MANIFEST REGENT POWER"
6. **Expected:** Success! Catch-up completes without error
7. **If error:** Capture exact error message and database logs

### Step 3: Monitor for Recurrence

**Add Monitoring Query (Run Periodically):**
```sql
-- Alert if requirements drop below expected count
SELECT 
  CASE 
    WHEN COUNT(*) < 240 THEN 'ALERT: Requirements table incomplete!'
    ELSE 'OK'
  END as status,
  COUNT(*) as current_rows,
  240 - COUNT(*) as missing_rows
FROM app_private.regent_catch_up_requirements;
```

---

## Rollback Procedure

**If repair causes unexpected issues:**

### Option 1: Restore from Backup (Nuclear Option)

```bash
# Restore the full backup taken earlier
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres" < production-backup-regent-repair-[timestamp].sql
```

⚠️ **This rolls back ALL changes since backup, not just regent fixes**

### Option 2: Selective Rollback (Requirements Only)

```sql
-- Delete all requirements data
TRUNCATE app_private.regent_catch_up_requirements CASCADE;
TRUNCATE app_private.regent_canonical_pick_options CASCADE;

-- Restore from previous state (if available)
-- Or leave empty until proper seed migration can be re-run
```

---

## Post-Repair Actions

### Update Incident Log

Document in your team's incident tracking system:
- Root cause: Missing seed migration data
- Impact: [number] players affected
- Resolution time: [duration]
- Repair actions taken: Requirements table re-seeded
- Validation results: All tests passed
- Player verification: Successful catch-up completion

### Update Deployment Documentation

Add to deployment checklist:
```markdown
## Regent Workflow Verification

After any migration deploy:

1. Verify requirements table:
   ```sql
   SELECT COUNT(*) FROM app_private.regent_catch_up_requirements; -- Expected: 240
   ```

2. Verify pick options:
   ```sql
   SELECT COUNT(*) FROM app_private.regent_canonical_pick_options; -- Expected: 463+
   ```

3. Run validation suite:
   ```bash
   supabase db query --linked --file scripts/validate-regent-workflow.sql
   ```
```

### Set Up Monitoring

**Option A: Supabase Dashboard Alert**
Create custom SQL query in Supabase dashboard:
```sql
SELECT COUNT(*) as requirement_count 
FROM app_private.regent_catch_up_requirements;
```
Alert if `requirement_count < 240`

**Option B: Application Health Check**
Add to application health check endpoint:
```typescript
async function checkRegentSystem() {
  const { count } = await supabase
    .from('regent_catch_up_requirements')
    .select('*', { count: 'exact', head: true });
  
  if (count !== 240) {
    throw new Error(`Regent requirements incomplete: ${count}/240`);
  }
}
```

---

## Prevention Strategies

### For Seed Migrations

**Problem:** Seed migrations can be skipped if they're older than current migration state

**Solution:**
1. **Always re-run seed migrations after major schema changes**
   ```bash
   # Force re-seed after database reset
   supabase db reset --linked
   ```

2. **Make seed migrations idempotent** (already done)
   - All INSERT statements use `ON CONFLICT ... DO UPDATE`
   - Safe to re-run multiple times

3. **Add seed verification to CI/CD**
   ```yaml
   # In deployment pipeline
   - name: Verify Regent Seed Data
     run: |
       COUNT=$(supabase db query --linked -c "SELECT COUNT(*) FROM app_private.regent_catch_up_requirements;" | grep -o '[0-9]\+')
       if [ "$COUNT" -ne 240 ]; then
         echo "ERROR: Regent requirements incomplete ($COUNT/240)"
         exit 1
       fi
   ```

### For Local Development

**After any `supabase db reset`:**
```bash
# Run validation to catch issues early
supabase db query --local --file scripts/validate-regent-workflow.sql
```

**Before committing migration changes:**
```bash
# Ensure seed data is regenerated if compendium changed
npm run tsx scripts/generate-regent-catchup-seed.ts
git add supabase/migrations/20260926100100_regent_catchup_seed.sql
```

---

## Contact and Escalation

**If this runbook doesn't resolve the issue:**

1. **Check for related errors:**
   - `REGENT_UNLOCK_NOT_FOUND`
   - `LEGACY_REGENT_UNLOCK_NOT_ACTIONABLE`
   - `REGENT_CATCH_UP_PICKS_INCOMPLETE`

2. **Gather diagnostic data:**
   - Full diagnostic script output
   - Character regent_unlocks table dump for affected players
   - Application logs showing exact RPC call failures

3. **Escalate to engineering:**
   - Provide all diagnostic data
   - Include validation script results
   - Note any deviations from expected repair procedure

---

## Appendix: Common Issues

### Issue: "PgClient: Connection timed out"

**Cause:** Database connection problems  
**Solution:**
```bash
# Verify database is accessible
supabase db query --linked -c "SELECT 1;"

# Check firewall/network rules
# Verify Supabase project is not paused
```

### Issue: "Permission denied for schema app_private"

**Cause:** User lacks permissions on app_private schema  
**Solution:**
```sql
-- Grant necessary permissions (run as superuser)
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA app_private TO authenticated;
```

### Issue: Validation fails after successful repair

**Cause:** Cached query results or replication lag  
**Solution:**
```bash
# Wait 30 seconds for replication
sleep 30

# Re-run validation
supabase db query --linked --file scripts/validate-regent-workflow.sql
```

### Issue: Players still see error after repair

**Cause:** Client-side cache or API gateway cache  
**Solution:**
1. Have player hard-refresh (Ctrl+Shift+R)
2. Clear API gateway cache if applicable
3. Restart application servers to clear query cache

---

## Document History

| Date | Author | Changes |
|------|--------|---------|
| 2026-12-10 | AI Assistant | Initial runbook creation |

---

## Related Documentation

- Technical Deep Dive: `docs/diagnostic-findings-regent-catchup.md`
- Regent System Design: `docs/regent-gemini-implementation.md`
- Migration Reference: `supabase/migrations/20260906010000_task8_regent_workflow.sql`
- Seed Generator: `scripts/generate-regent-catchup-seed.ts`
