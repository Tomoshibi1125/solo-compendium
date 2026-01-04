# Jobs, Paths, and Monarchs Detail Audit

**Date**: 2025-01-06  
**Status**: ⚠️ **AUDIT IN PROGRESS**

---

## Overview

This document tracks the detail level of Jobs (classes), Paths (subclasses), and Monarchs (overlays) to ensure 1:1 parity with D&D 5e SRD detail standards.

---

## D&D 5e SRD Detail Standards

### Classes (SRD has 4: Fighter, Rogue, Cleric, Wizard)
- **Features at every level**: Each class has features at levels 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
- **Detailed descriptions**: Each feature has a full description explaining mechanics
- **Action types**: Features specify action, bonus action, reaction, or passive
- **Uses/Recharge**: Features with limited uses specify formulas (e.g., "proficiency bonus per long rest")
- **Prerequisites**: Some features have prerequisites

### Subclasses (SRD has limited subclasses per class)
- **Features at specific levels**: Typically at levels 3, 6, 10, 14 (some vary)
- **Detailed descriptions**: Each subclass feature has full mechanical description
- **Thematic coherence**: Subclass features build on a theme

### Races (Not in SRD, but we have Monarchs as equivalent)
- **Features at specific levels**: Typically at levels 1, 3, 5, 7, 9, 11, 13, 15, 17, 20
- **Detailed descriptions**: Each feature explains mechanics and flavor
- **Thematic coherence**: Features align with the Monarch's theme

---

## Current Status

### Jobs (Classes)
**Status**: ⚠️ **NEEDS AUDIT**

We need to verify:
- [ ] All jobs have features for levels 1-20
- [ ] All features have detailed descriptions
- [ ] All features specify action types where applicable
- [ ] All features with uses specify formulas
- [ ] All features have prerequisites where applicable

**Known Jobs**:
- Assassin
- Contractor
- Mage
- Striker
- Vanguard
- Herald
- Holy Knight
- Techsmith
- Warden
- (Others may exist)

### Paths (Subclasses)
**Status**: ⚠️ **NEEDS AUDIT**

We need to verify:
- [ ] All paths have features at appropriate levels (typically 3, 6, 10, 14)
- [ ] All path features have detailed descriptions
- [ ] All path features specify action types where applicable
- [ ] All path features with uses specify formulas

**Known Paths**: 78+ paths across all jobs

### Monarchs (Overlays)
**Status**: ⚠️ **NEEDS AUDIT**

We need to verify:
- [ ] All 9 Monarchs have features at appropriate levels
- [ ] All Monarch features have detailed descriptions
- [ ] All Monarch features specify action types where applicable
- [ ] All Monarch features with uses specify formulas

**Known Monarchs**:
1. Shadow Monarch
2. Beast Monarch
3. Iron Body Monarch
4. Plague Monarch
5. Frost Monarch
6. Stone Monarch
7. Destruction Monarch
8. White Flames Monarch
9. Transfiguration Monarch

---

## Action Items

1. **Query database** to count features per job/path/monarch
2. **Identify gaps** in feature coverage
3. **Create migration** to fill missing features with D&D 5e-level detail
4. **Verify descriptions** are comprehensive and match D&D 5e detail standards
5. **Update documentation** once audit is complete

---

**Last Updated**: 2025-01-06  
**Next Steps**: Run database queries to audit feature coverage

