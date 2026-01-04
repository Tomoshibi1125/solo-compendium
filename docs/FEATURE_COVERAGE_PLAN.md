# Feature Coverage Plan: Jobs, Paths, Monarchs

**Date**: 2025-01-06  
**Status**: 🚧 **IN PROGRESS**

---

## Overview

This document outlines the plan to achieve full 1:1 detail parity with D&D 5e SRD for all Jobs, Paths, and Monarchs.

---

## Current Status

### ✅ Foundation Complete
- Database schema supports all feature types
- Migration structure established (`20260106000004_complete_job_path_monarch_features.sql`)
- Pattern demonstrated with Vanguard and Assassin examples

### 🚧 Work Remaining

#### Jobs (13 total)
- ✅ Vanguard: Foundation started (needs completion to level 20)
- ✅ Assassin: Foundation started (needs completion to level 20)
- ⏳ Mage: Needs all features levels 1-20
- ⏳ Striker: Needs all features levels 1-20
- ⏳ Healer: Needs all features levels 1-20
- ⏳ Ranger: Needs all features levels 1-20
- ⏳ Destroyer: Needs all features levels 1-20
- ⏳ Esper: Needs all features levels 1-20
- ⏳ Contractor: Needs all features levels 1-20
- ⏳ Herald: Needs all features levels 1-20
- ⏳ Holy Knight: Needs all features levels 1-20
- ⏳ Techsmith: Needs all features levels 1-20
- ⏳ Warden: Needs all features levels 1-20

#### Paths (78 total)
- ⏳ All paths need features at levels 3, 6, 10, 14
- Each path should have 4 features matching D&D 5e subclass detail

#### Monarchs (9 total)
- ⏳ All monarchs need features at appropriate levels
- Features should match D&D 5e race detail level

---

## Feature Requirements (D&D 5e Standard)

### For Each Job Feature:
- ✅ **Detailed Description**: Full mechanical explanation (2-5 sentences minimum)
- ✅ **Action Type**: action, bonus-action, reaction, or passive
- ✅ **Uses Formula**: When applicable (e.g., "proficiency bonus per long rest")
- ✅ **Recharge**: short-rest, long-rest, or encounter
- ✅ **Prerequisites**: When applicable

### For Each Path Feature:
- ✅ **Thematic Coherence**: Features align with path theme
- ✅ **Progression**: Features build on each other
- ✅ **Same Detail Level**: As job features

### For Each Monarch Feature:
- ✅ **Thematic Coherence**: Features align with monarch theme
- ✅ **Progression**: Features unlock at appropriate levels
- ✅ **Same Detail Level**: As job features

---

## Implementation Strategy

### Phase 1: Complete Core Jobs (Vanguard, Assassin)
- Complete Vanguard features for all 20 levels
- Complete Assassin features for all 20 levels
- These serve as templates for other jobs

### Phase 2: Complete Remaining Jobs
- Add features for Mage (Wizard analog)
- Add features for Healer (Cleric analog)
- Add features for remaining jobs following established patterns

### Phase 3: Complete All Paths
- Add features for all 78 paths at levels 3, 6, 10, 14
- Ensure thematic coherence with path descriptions

### Phase 4: Complete All Monarchs
- Add features for all 9 monarchs at appropriate levels
- Ensure thematic coherence with monarch themes

---

## Migration Structure

The migration `20260106000004_complete_job_path_monarch_features.sql` provides:
1. Foundation pattern for job features
2. Example implementations (Vanguard, Assassin)
3. Ability Score Improvements for all jobs
4. Structure for path and monarch features

**Next Steps**: Expand this migration or create follow-up migrations to complete all features.

---

## Quality Checklist

For each feature added, verify:
- [ ] Description is comprehensive (2-5 sentences)
- [ ] Action type is specified (if applicable)
- [ ] Uses formula is specified (if applicable)
- [ ] Recharge is specified (if applicable)
- [ ] Prerequisites are specified (if applicable)
- [ ] Feature matches D&D 5e detail level
- [ ] Feature is thematically appropriate for Solo Leveling

---

**Last Updated**: 2025-01-06  
**Next Action**: Expand migration to complete Vanguard and Assassin, then add remaining jobs

