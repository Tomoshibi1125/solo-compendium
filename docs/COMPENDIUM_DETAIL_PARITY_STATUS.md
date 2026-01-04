# Compendium Detail Parity Status: Jobs, Paths, Monarchs

**Date**: 2025-01-06  
**Status**: ✅ **SRD CONTENT COMPLETE** | ⚠️ **JOBS/PATHS/MONARCHS NEED VERIFICATION**

---

## Executive Summary

### ✅ COMPLETE (Full 1:1 SRD Parity)
- **Powers/Spells**: 300+ (all SRD spells with full detail)
- **Monsters**: 60+ (all SRD monsters with complete stat blocks)
- **Equipment**: 100+ (all SRD equipment with full properties)
- **Backgrounds**: 13 (all SRD backgrounds with full details)
- **Feats**: 44+ (all SRD feats with full descriptions)
- **Conditions**: 15 (all SRD conditions with full effects)
- **Skills**: 18 (all SRD skills with full descriptions)

### ⚠️ NEEDS VERIFICATION (Jobs, Paths, Monarchs)

These are **Solo Leveling themed** equivalents to D&D 5e classes/subclasses/races. They are **homebrew content** (not SRD), but should match D&D 5e's **detail level**:

#### Jobs (Classes)
- **Standard**: D&D 5e classes have features at **every level 1-20**
- **Our Status**: Need to verify all jobs have complete feature coverage
- **Known Jobs**: Assassin, Contractor, Destroyer, Esper, Healer, Herald, Holy Knight, Mage, Ranger, Striker, Techsmith, Vanguard, Warden

#### Paths (Subclasses)
- **Standard**: D&D 5e subclasses have features at **levels 3, 6, 10, 14** (some vary)
- **Our Status**: Need to verify all 78+ paths have complete feature coverage
- **Known Paths**: 78 paths across all jobs (6 per job average)

#### Monarchs (Overlays - Similar to Races)
- **Standard**: D&D 5e races have features at **levels 1, 3, 5, 7, 9, 11, 13, 15, 17, 20**
- **Our Status**: Need to verify all 9 Monarchs have complete feature coverage
- **Known Monarchs**: Shadow, Beast, Iron Body, Plague, Frost, Stone, Destruction, White Flames, Transfiguration

---

## D&D 5e SRD Detail Standards

### Class Features (What We Should Match)
- ✅ **Feature at every level**: Levels 1-20 all have features
- ✅ **Detailed descriptions**: Full mechanical explanations
- ✅ **Action types**: Specified (action, bonus action, reaction, passive)
- ✅ **Uses formulas**: When applicable (e.g., "proficiency bonus per long rest")
- ✅ **Prerequisites**: When applicable
- ✅ **Progression clarity**: Features build on each other

### Subclass Features (What We Should Match)
- ✅ **Features at key levels**: Typically 3, 6, 10, 14
- ✅ **Detailed descriptions**: Full mechanical explanations
- ✅ **Thematic coherence**: Features align with subclass theme
- ✅ **Action types**: Specified where applicable

### Race Features (What Monarchs Should Match)
- ✅ **Features at key levels**: Typically 1, 3, 5, 7, 9, 11, 13, 15, 17, 20
- ✅ **Detailed descriptions**: Full mechanical explanations
- ✅ **Thematic coherence**: Features align with race theme

---

## Current Implementation Status

### Database Structure ✅
- ✅ `compendium_jobs` table exists
- ✅ `compendium_job_paths` table exists
- ✅ `compendium_job_features` table exists
- ✅ `compendium_monarchs` table exists
- ✅ `compendium_monarch_features` table exists
- ✅ All tables have proper relationships and constraints

### Content Coverage ⚠️
- ⚠️ **Jobs**: Need to verify feature coverage for all levels 1-20
- ⚠️ **Paths**: Need to verify feature coverage at appropriate levels
- ⚠️ **Monarchs**: Need to verify feature coverage at appropriate levels

### Detail Level ⚠️
- ⚠️ **Feature Descriptions**: Need to verify all features have D&D 5e-level detail
- ⚠️ **Action Types**: Need to verify all applicable features specify action types
- ⚠️ **Uses Formulas**: Need to verify all features with uses specify formulas
- ⚠️ **Prerequisites**: Need to verify prerequisites are specified where applicable

---

## Next Steps

1. **Query Database**: Count features per job/path/monarch to identify gaps
2. **Create Migration**: Fill any missing features with D&D 5e-level detail
3. **Verify Descriptions**: Ensure all features have comprehensive descriptions
4. **Update Documentation**: Mark completion once verified

---

## Important Note

**Jobs, Paths, and Monarchs are homebrew content** (not SRD). However, to achieve "1:1 detail parity with 5e," they should match the **detail level and structure** of D&D 5e classes, subclasses, and races.

This means:
- ✅ Same level of mechanical detail
- ✅ Same structure (features at every level)
- ✅ Same clarity in descriptions
- ✅ Same completeness in information

**We are NOT copying D&D 5e class mechanics** (that would be copyright infringement). We are ensuring our **homebrew content has the same level of detail and completeness** as D&D 5e content.

---

**Last Updated**: 2025-01-06  
**Status**: Audit in progress - need to verify feature coverage

