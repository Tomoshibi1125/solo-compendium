# Guild and Character Manifest Separation

## Architecture Decision

Guilds are a separate manifest tool and should not be queried from character sheets or character-related operations (like level-up). Characters and Guilds are independent systems that should remain decoupled.

## Why This Matters

- **Performance**: Character operations should not depend on external guild queries
- **Reliability**: Guild query failures should not break character functionality
- **Separation of Concerns**: Character sheet = self-contained manifest of character data
- **Tool Independence**: Each manifest tool (Characters, Guilds, Campaigns, etc.) should be self-contained

## Implementation

### What Was Removed

- `GuildBenefitsDisplay` component removed from `CharacterSheetV2.tsx`
- Guild membership queries (`guild_members` table) no longer fire during character sheet rendering
- Character level-up process is now isolated from guild system

### Guild Benefits and Character Stats

If a guild provides mechanical benefits (e.g., +3 Initiative from a War Room), these should be applied through the **custom modifiers system**:

1. Guild benefits are viewed and managed in the **Guild Tool** (separate tab/page)
2. If benefits provide stat bonuses that should appear on character sheet:
   - Manually add them as **Custom Modifiers** on the character
   - Label them clearly (e.g., "Guild War Room: +3 Initiative")
3. Custom modifiers integrate into the character sheet calculation pipeline

### Where Guilds ARE Queried

Guild data should only be accessed from:
- **Guild Tool pages**: Guild roster, member management, guild details
- **Guild-specific operations**: Join guild, leave guild, promote members
- **Guild management features**: Base upgrades, skill purchases, quest tracking

### Where Guilds Should NOT Be Queried

- Character sheet rendering
- Character level-up process
- Character creation
- Character stat calculations (use custom modifiers instead)
- Combat/action resolution

## Benefits of This Architecture

1. **Faster character operations**: No unnecessary joins or queries
2. **More reliable level-ups**: Guild query failures don't interrupt progression
3. **Clearer code**: Each tool's responsibilities are well-defined
4. **Better scaling**: Character queries don't cross-reference guild data
5. **Easier testing**: Character functionality can be tested independently of guilds

## For Developers

When building new features:

- ✅ **DO**: Keep character features self-contained
- ✅ **DO**: Use custom modifiers for external stat bonuses
- ✅ **DO**: Query guild data only from Guild tool pages
- ❌ **DON'T**: Add guild queries to character components
- ❌ **DON'T**: Cross-reference guild data during character operations
- ❌ **DON'T**: Make character functionality depend on guild membership

---

**Date**: 2026-10-03  
**Related Issue**: Level-up failures caused by guild_members query errors
