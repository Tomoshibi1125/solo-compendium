# Parity Definition (System-Level)

This document defines the contract for "1:1 functional parity" with a D&D Beyond-like companion at the system level. UI visuals are not required to match, but core flows, data integrity, and automation must be equivalent.

## Global Requirements
- All primary flows are reachable without dead routes or blocked interactions.
- Persistence is reliable (guest/local and authenticated where supported).
- Automation is deterministic and test-backed.
- No placeholder or "coming soon" paths in core flows.

## Subsystem Definitions

### Auth + Session + Persistence + Backups
Parity requires: session restore, protected routes, guest mode fallback, local backups, and import/export for characters.

### Compendium
Parity requires: browse/search/filter/sort, deep links, cross-links, and add-to-character flows for equipment/powers/conditions where applicable.

### Character Builder
Parity requires: validated multi-step creation, job/path/background selection, and initial automation (stats, features, equipment, powers).

### Level-Up
Parity requires: level validation, hit point increases, feature unlocks, and resource scaling.

### Character Sheet Automation
Parity requires: derived stats, equipment effects, conditions, rests, runes, skills, and deterministic recalculation.

### Dice Roller + Roll Log
Parity requires: dice notation parsing, advantage/disadvantage handling, and persistent roll history.

### Encounters / Combat Tracker
Parity requires: initiative order, rounds/turns, HP tracking, conditions, and persistence.

### Campaigns / Table Tools
Parity requires: campaign creation/joining, member roles, chat/notes/characters tools, and VTT entry points.

### Offline / PWA (If In Scope)
Parity requires: service worker registration, offline indicator, and documented install flow.

## Evidence Expectations
For each subsystem, parity is proven by a combination of:
- source files showing the implementation,
- tests covering the main flow,
- docs or scripts that validate data completeness.
