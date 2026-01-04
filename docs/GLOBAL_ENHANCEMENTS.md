# Global Enhancements & QOL Improvements

## Overview

This document details all global systems, mechanics, automations, QOL improvements, and enhancements added across the entire Solo Leveling 5e application.

---

## 🎹 Global Keyboard Shortcuts System

**Location**: `src/lib/globalShortcuts.ts`, `src/hooks/useGlobalShortcuts.ts`

### Features
- **Comprehensive shortcuts** for all major actions
- **Context-aware** shortcuts (work only in relevant pages)
- **Global shortcuts** (work everywhere)
- **Shortcut help modal** (Shift+?)

### Available Shortcuts

#### Navigation
- `Ctrl+K` - Focus search (global)
- `Ctrl+H` - Go to home (global)
- `Ctrl+C` - Open compendium (global)
- `Ctrl+P` - Open characters (global)
- `Ctrl+D` - Open dice roller (global)
- `Ctrl+M` - Open DM tools (global)

#### Character Actions
- `Ctrl+Shift+N` - Create new character (global)
- `Ctrl+S` - Save character (context-specific)
- `Ctrl+R` - Short rest (context-specific)
- `Ctrl+Shift+R` - Long rest (context-specific)

#### General
- `Escape` - Close modal/dialog (global)
- `Shift+?` - Show keyboard shortcuts help (global)

### Usage
```tsx
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

// In App.tsx or any component
useGlobalShortcuts(true); // Enable global shortcuts
```

---

## ⚡ Quick Actions Panel

**Location**: `src/components/ui/QuickActionsPanel.tsx`

### Features
- **Floating action buttons** for quick access
- **Inline panel** variant for sidebars
- **Keyboard shortcuts** displayed
- **Shortcuts help** integrated

### Variants
- **Floating**: Fixed bottom-right floating buttons
- **Inline**: SystemWindow panel for sidebars

### Quick Actions
- New Character
- Compendium
- Characters
- Dice Roller
- DM Tools
- Search
- Keyboard Shortcuts Help

---

## 🤖 Advanced Automation System

**Location**: `src/lib/automation.ts`

### Auto-Calculations

#### Character Stats
- **Proficiency bonus** - Auto-calculated on level change
- **System Favor** - Auto-calculated die size and max
- **Shadow Energy** - Auto-calculated max based on level
- **Feature uses** - Auto-calculated from formulas

#### Functions
- `autoCalculateCharacterStats()` - Recalculate all derived stats
- `autoUpdateFeatureUses()` - Update feature uses on level up
- `calculateFeatureUses()` - Parse and calculate from formulas
- `autoApplyCondition()` - Apply conditions with duration tracking
- `autoCalculateEncounterDifficulty()` - Calculate encounter difficulty

### Auto-Save
- **Debounced auto-save** for character changes
- **Configurable delay** (default 1 second)
- **Error handling** with console logging

### Smart Suggestions
- `autoSuggestEquipment()` - Suggest equipment based on character

---

## 📦 Bulk Operations System

**Location**: `src/lib/bulkOperations.ts`

### Features
- **Bulk update** characters
- **Bulk delete** characters
- **Bulk add equipment** to multiple characters
- **Bulk level up** characters
- **Bulk rest** (short or long) for multiple characters

### Functions
- `bulkUpdateCharacters()` - Update multiple characters
- `bulkDeleteCharacters()` - Delete multiple characters
- `bulkAddEquipment()` - Add equipment to multiple characters
- `bulkLevelUp()` - Level up multiple characters
- `bulkRest()` - Rest multiple characters

### Usage
```typescript
import { bulkUpdateCharacters } from '@/lib/bulkOperations';

const result = await bulkUpdateCharacters(
  ['char-id-1', 'char-id-2'],
  { hp_current: 50 }
);
// Returns: { success: 2, failed: 0 }
```

---

## 📤 Enhanced Export System

**Location**: `src/lib/export.ts`

### Export Formats
- **JSON** - Full data export
- **Markdown** - Human-readable format
- **Print** - Print-friendly character sheets

### Export Options
- Include/exclude equipment
- Include/exclude features
- Include/exclude powers
- Include/exclude notes

### Functions
- `exportCharacter()` - Export character to JSON
- `exportCharacterToMarkdown()` - Export to markdown
- `exportCompendiumEntries()` - Export compendium entries
- `downloadFile()` - Download any content as file
- `printCharacterSheet()` - Print character sheet

---

## 🔍 Global Search System

**Location**: `src/components/ui/GlobalSearch.tsx`

### Features
- **Unified search** across all content types
- **Real-time results** with debouncing
- **Recent items** integration
- **Keyboard shortcut** (Ctrl+K)
- **Search in header** for easy access

### Search Scope
- Jobs
- Paths
- Powers
- Relics
- Monsters
- Shadow Soldiers
- Feats
- Skills
- Characters

### Recent Items
- **Automatic tracking** of viewed items
- **Quick access** from search
- **Persistent storage** in localStorage
- **Max 20 items** tracked

---

## 📊 Recent Items Tracking

**Location**: `src/hooks/useRecentItems.ts`, `src/components/ui/RecentItemsPanel.tsx`

### Features
- **Automatic tracking** when viewing items
- **LocalStorage persistence**
- **Recent items panel** component
- **Remove individual items**
- **Clear all** functionality

### Integration
- Automatically tracks when viewing:
  - Compendium entries
  - Character sheets
  - Any detail pages

---

## 📈 Quick Stats Dashboard

**Location**: `src/components/ui/QuickStatsDashboard.tsx`

### Features
- **Character count** summary
- **Average level** calculation
- **Total HP** tracking
- **Recent characters** list
- **Quick navigation** to characters

### Display
- Total characters
- Average level
- Total HP (current/max)
- Recent 5 characters with stats

---

## 🔄 Comparison Tool

**Location**: `src/components/tools/ComparisonTool.tsx`

### Features
- **Side-by-side comparison** of items
- **Multiple item types** supported
- **Stat comparison** tables
- **Add/remove items** dynamically

### Supported Types
- Characters
- Monsters
- Shadow Soldiers
- Powers
- Relics

---

## 📋 Character Templates

**Location**: `src/components/character/CharacterTemplates.tsx`

### Features
- **Pre-built character builds**
- **Quick-start creation**
- **Template descriptions**
- **Tag system** for filtering

### Available Templates
- **Tank Striker** - Defensive frontline warrior
- **Blaster Mage** - Damage-focused spellcaster
- **Stealth Assassin** - Sneaky damage dealer
- **Shadow Monarch** - Necromancer with shadow army

### Usage
- Click template to start character creation
- Pre-fills job, path, background
- Saves time on character creation

---

## 🎲 Enhanced Rollable Tables

**Location**: `src/lib/rollableTables.ts`

### Available Tables
- **Gate Complications** - Unexpected events
- **Gate Rewards** - Completion rewards
- **Gate Hazards** - Environmental dangers
- **NPC Motivations** - Character drives
- **NPC Secrets** - Hidden truths
- **Gate Themes** - Thematic elements
- **Loot Tiers** - Quality of drops
- **Encounter Types** - Combat scenarios

### Functions
- `rollTable()` - Roll on any table
- `rollDice()` - Parse and roll dice notation

---

## 🎨 UI Enhancements

### Quick Actions Panel
- Floating action buttons
- Inline panel variant
- Integrated shortcuts help

### Recent Items Panel
- Recent items display
- Quick navigation
- Remove items

### Global Search
- Header integration
- Recent items in search
- Multi-type search

### Quick Stats Dashboard
- Character overview
- Recent characters
- Quick stats

---

## 🔧 Integration Points

### App.tsx
- Global shortcuts enabled
- Available throughout app

### Header
- Global search integrated
- Quick access to all features

### Home Page (LaunchPad)
- Quick Stats Dashboard
- Recent Items Panel
- Character Templates

### Compendium Detail
- Recent items tracking
- Auto-adds to recent on view

### Character Sheet
- Shadow Army Manager (if applicable)
- Shadow Energy display
- All automation active

### Encounter Builder
- Shadow Soldiers tab
- Unified creature management
- XP calculations include shadows

---

## 📝 Database Enhancements

### New Tables
- `character_shadow_army` - Track summoned shadows
- `compendium_shadow_soldiers` - Shadow soldier entries
- `compendium_shadow_soldier_traits` - Shadow traits
- `compendium_shadow_soldier_actions` - Shadow actions
- `compendium_shadow_soldier_abilities` - Shadow abilities

### New Columns
- `characters.shadow_energy_current` - Current shadow energy
- `characters.shadow_energy_max` - Max shadow energy

---

## 🚀 Performance Optimizations

### Debouncing
- Search queries (300ms)
- Auto-save (1000ms)
- All user inputs

### Query Optimization
- Conditional queries (only fetch when needed)
- Limit results (pagination)
- Indexed searches

### Caching
- React Query caching (5 min stale, 10 min GC)
- LocalStorage for recent items
- Component-level memoization

---

## 🎯 QOL Improvements

### Keyboard Navigation
- Full keyboard support
- Tab navigation
- Focus management

### Visual Feedback
- Loading states
- Error messages
- Success notifications
- Toast system

### Accessibility
- ARIA labels
- Screen reader support
- Keyboard shortcuts
- Focus indicators

### Responsive Design
- Mobile-first approach
- Touch-friendly targets
- Adaptive layouts

---

## 📚 Usage Examples

### Enable Global Shortcuts
```tsx
// In App.tsx
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';

const App = () => {
  useGlobalShortcuts(true);
  // ... rest of app
};
```

### Use Recent Items
```tsx
import { useRecentItems } from '@/hooks/useRecentItems';

const { addRecentItem, recentItems } = useRecentItems();

// When viewing an item
addRecentItem({
  id: 'item-id',
  type: 'monsters',
  name: 'Goblin',
  href: '/compendium/monsters/item-id',
});
```

### Use Automation
```tsx
import { autoCalculateCharacterStats } from '@/lib/automation';

// After level up
await autoCalculateCharacterStats(characterId);
```

### Use Bulk Operations
```tsx
import { bulkLevelUp } from '@/lib/bulkOperations';

const result = await bulkLevelUp(['char-1', 'char-2']);
console.log(`Leveled up ${result.success} characters`);
```

### Use Export
```tsx
import { exportCharacter, downloadFile } from '@/lib/export';

const json = await exportCharacter(characterId, {
  includeEquipment: true,
  includeFeatures: true,
});
downloadFile(json, 'character.json');
```

---

## 🔮 Future Enhancements

Potential additions:
- Undo/redo system
- Auto-save with version history
- Advanced filtering presets
- Custom rollable tables
- Character sharing system
- Campaign templates
- Advanced analytics
- Mobile app
- Offline support
- Sync across devices

---

## 📖 Summary

All systems are integrated and working together to provide:
- ✅ Comprehensive keyboard shortcuts
- ✅ Quick actions and navigation
- ✅ Advanced automation
- ✅ Bulk operations
- ✅ Enhanced export/import
- ✅ Global search
- ✅ Recent items tracking
- ✅ Comparison tools
- ✅ Character templates
- ✅ Enhanced rollable tables
- ✅ Quick stats dashboard
- ✅ Shadow Soldiers system
- ✅ Full QOL improvements

The application now has enterprise-level features and automations throughout!

