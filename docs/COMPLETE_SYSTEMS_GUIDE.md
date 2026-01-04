# Complete Systems & Enhancements Guide

## 🎯 Overview

This document provides a comprehensive guide to ALL systems, mechanics, automations, QOL improvements, and enhancements implemented across the Solo Leveling 5e application.

---

## 📋 Table of Contents

1. [Global Systems](#global-systems)
2. [Character Management](#character-management)
3. [Compendium System](#compendium-system)
4. [Shadow Soldiers System](#shadow-soldiers-system)
5. [DM Tools](#dm-tools)
6. [Automation Systems](#automation-systems)
7. [QOL Improvements](#qol-improvements)
8. [Data Management](#data-management)
9. [UI/UX Enhancements](#uiux-enhancements)

---

## 🌐 Global Systems

### Keyboard Shortcuts
**Files**: `src/lib/globalShortcuts.ts`, `src/hooks/useGlobalShortcuts.ts`

**Shortcuts**:
- `Ctrl+K` - Focus search (global)
- `Ctrl+H` - Go to home
- `Ctrl+C` - Open compendium
- `Ctrl+P` - Open characters
- `Ctrl+D` - Open dice roller
- `Ctrl+M` - Open DM tools
- `Ctrl+Shift+N` - Create new character
- `Ctrl+S` - Save character
- `Ctrl+R` - Short rest
- `Ctrl+Shift+R` - Long rest
- `Escape` - Close modals
- `Shift+?` - Show shortcuts help

### Global Search
**File**: `src/components/ui/GlobalSearch.tsx`

**Features**:
- Search across all content types
- Real-time results with debouncing
- Recent items integration
- Header integration

### Quick Actions Panel
**File**: `src/components/ui/QuickActionsPanel.tsx`

**Features**:
- Floating action buttons
- Inline panel variant
- Integrated shortcuts help

### Recent Items Tracking
**Files**: `src/hooks/useRecentItems.ts`, `src/components/ui/RecentItemsPanel.tsx`

**Features**:
- Automatic tracking
- LocalStorage persistence
- Recent items panel
- Max 20 items

---

## 👤 Character Management

### Character Sheet Enhancements
**File**: `src/pages/CharacterSheet.tsx`

**New Features**:
- Shadow Energy resource display
- Shadow Army Manager integration
- Print button
- Auto-save indicator
- Enhanced resource tracking

### Shadow Army Manager
**File**: `src/components/character/ShadowArmyManager.tsx`

**Features**:
- Track shadow energy
- Summon shadow soldiers
- Manage active shadows
- Track shadow HP
- Dismiss shadows
- View shadow stats

### Character Templates
**File**: `src/components/character/CharacterTemplates.tsx`

**Templates**:
- Tank Striker
- Blaster Mage
- Stealth Assassin
- Shadow Monarch

### Quick Stats Dashboard
**File**: `src/components/ui/QuickStatsDashboard.tsx`

**Features**:
- Character count
- Average level
- Total HP tracking
- Recent characters list

---

## 📚 Compendium System

### Enhanced Detail Pages
**File**: `src/pages/compendium/CompendiumDetail.tsx`

**Features**:
- Recent items tracking
- All entry types supported
- Shadow Soldiers detail page

### Enhanced Filtering
**File**: `src/components/compendium/CompendiumFilters.tsx`

**Features**:
- Shadow soldier tier filtering
- Named/Elite filters
- Advanced rarity filtering
- Level/CR ranges
- Gate rank filtering

### Shadow Soldiers Detail
**File**: `src/components/compendium/ShadowSoldiersDetail.tsx`

**Features**:
- Full stat blocks
- ARISE animation
- Traits, actions, abilities
- Legendary actions
- Summoning lore

---

## ⚔️ Shadow Soldiers System

### Database Schema
**Migrations**:
- `20260108000000_add_shadow_soldiers.sql`
- `20260108000001_add_shadow_army_tracking.sql`

### Shadow Roster
- **Tier 1**: Shadow Soldier (CR 1/4)
- **Tier 2**: Shadow Knight (CR 3)
- **Tier 3**: Shadow Marshal (CR 5)
- **Tier 4**: Igris (CR 8), Beru (CR 9), Tank (CR 8)
- **Tier 5**: Kaisel (CR 12)

### Shadow Energy System
- Scales with level (10 → 200 max)
- Consumed on summoning
- Displayed in character resources

### ARISE Animation
**File**: `src/index.css`

**Features**:
- Full-screen overlay
- Animated text
- Shadow energy burst
- 3-second duration

---

## 🎲 DM Tools

### Encounter Builder
**File**: `src/pages/dm-tools/EncounterBuilder.tsx`

**Enhancements**:
- Shadow Soldiers tab
- Unified creature management
- XP calculations include shadows
- Visual distinction

### Rollable Tables
**File**: `src/lib/rollableTables.ts`

**Tables**:
- Gate Complications
- Gate Rewards
- Gate Hazards
- NPC Motivations
- NPC Secrets
- Gate Themes
- Loot Tiers
- Encounter Types

### Comparison Tool
**File**: `src/components/tools/ComparisonTool.tsx`

**Features**:
- Side-by-side comparison
- Multiple item types
- Stat comparison tables

---

## ⚙️ Automation Systems

### Character Stats
**File**: `src/lib/automation.ts`

**Auto-Calculations**:
- Proficiency bonus
- System Favor die/max
- Shadow Energy max
- Feature uses from formulas
- Encounter difficulty

### Rest System
**File**: `src/lib/restSystem.ts`

**Automation**:
- Short rest: Hit dice, short-rest features
- Long rest: HP, hit dice, System Favor, conditions, exhaustion

### Equipment Modifiers
**File**: `src/lib/equipmentModifiers.ts`

**Auto-Application**:
- AC modifiers
- Speed modifiers
- Ability score bonuses
- Attack/damage bonuses

---

## 🎨 QOL Improvements

### Auto-Save Indicator
**File**: `src/components/ui/AutoSaveIndicator.tsx`

**Features**:
- Visual save status
- Last saved time
- Error display
- Auto-hide after 2-3 seconds

### Print Functionality
**File**: `src/components/ui/PrintButton.tsx`

**Features**:
- Print character sheets
- Print-friendly styles
- Print any page

### Bulk Operations
**File**: `src/lib/bulkOperations.ts`

**Operations**:
- Bulk update characters
- Bulk delete characters
- Bulk add equipment
- Bulk level up
- Bulk rest

### Export/Import
**File**: `src/lib/export.ts`

**Formats**:
- JSON export
- Markdown export
- Print export
- Compendium export

---

## 📊 Data Management

### Recent Items
- Automatic tracking
- LocalStorage persistence
- Quick access panel
- Remove items

### Favorites System
- Already implemented
- Works with all content types
- Persistent storage

### Saved Searches
- Future enhancement
- Filter presets
- Quick access

---

## 🎯 UI/UX Enhancements

### Print Styles
**File**: `src/index.css`

**Features**:
- Print-friendly layouts
- Hide non-essential elements
- Good contrast
- Page break controls

### Responsive Design
- Mobile-first approach
- Touch-friendly targets
- Adaptive layouts
- Breakpoint optimization

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

### Visual Feedback
- Loading states
- Error messages
- Success notifications
- Toast system

---

## 🔗 Integration Points

### App.tsx
- Global shortcuts enabled
- Available app-wide

### Header
- Global search
- Navigation
- Quick actions

### Home Page
- Quick Stats Dashboard
- Recent Items Panel
- Character Templates
- Quick Actions

### Character Sheet
- Shadow Army Manager
- Shadow Energy
- Print button
- Auto-save indicator

### Compendium
- Enhanced filtering
- Recent items tracking
- Shadow Soldiers support

### Encounter Builder
- Shadow Soldiers tab
- Unified management

---

## 📈 Performance

### Optimizations
- Debounced searches (300ms)
- Debounced auto-save (1000ms)
- React Query caching
- Conditional queries
- Pagination

### Caching Strategy
- 5 min stale time
- 10 min garbage collection
- LocalStorage for recent items
- Component memoization

---

## 🚀 Usage Examples

### Enable Global Shortcuts
```tsx
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

useGlobalShortcuts(true);
```

### Use Recent Items
```tsx
import { useRecentItems } from '@/hooks/useRecentItems';

const { addRecentItem } = useRecentItems();
addRecentItem({ id, type, name, href });
```

### Use Automation
```tsx
import { autoCalculateCharacterStats } from '@/lib/automation';

await autoCalculateCharacterStats(characterId);
```

### Use Bulk Operations
```tsx
import { bulkLevelUp } from '@/lib/bulkOperations';

const result = await bulkLevelUp(['char-1', 'char-2']);
```

### Use Export
```tsx
import { exportCharacter, downloadFile } from '@/lib/export';

const json = await exportCharacter(characterId);
downloadFile(json, 'character.json');
```

---

## ✅ Complete Feature List

### Global Features
- ✅ Global keyboard shortcuts
- ✅ Global search
- ✅ Quick actions panel
- ✅ Recent items tracking
- ✅ Quick stats dashboard
- ✅ Character templates
- ✅ Comparison tool
- ✅ Auto-save indicator
- ✅ Print functionality

### Character Features
- ✅ Shadow Army Manager
- ✅ Shadow Energy tracking
- ✅ Enhanced resource display
- ✅ Bulk operations
- ✅ Auto-calculations
- ✅ Export/import

### Compendium Features
- ✅ Shadow Soldiers detail pages
- ✅ ARISE animation
- ✅ Enhanced filtering
- ✅ Recent items integration
- ✅ All entry types supported

### DM Tools Features
- ✅ Shadow Soldiers in encounters
- ✅ Enhanced rollable tables
- ✅ Comparison tool
- ✅ Encounter balancing

### Automation Features
- ✅ Auto-calculate stats
- ✅ Auto-update features
- ✅ Auto-apply conditions
- ✅ Auto-save
- ✅ Rest automation
- ✅ Level up automation

---

## 📝 Summary

The application now includes:

1. **Comprehensive global systems** - Shortcuts, search, recent items
2. **Advanced automation** - Auto-calculations, auto-save, smart defaults
3. **Bulk operations** - Manage multiple items at once
4. **Enhanced export/import** - Multiple formats, comprehensive data
5. **Shadow Soldiers system** - Complete implementation with animations
6. **QOL improvements** - Print, auto-save, templates, comparison
7. **Enhanced filtering** - Advanced options for all content types
8. **Recent items** - Track and quick-access viewed items
9. **Character templates** - Quick-start character creation
10. **Comparison tools** - Side-by-side stat comparison

All systems are integrated, tested, and ready for production use!

