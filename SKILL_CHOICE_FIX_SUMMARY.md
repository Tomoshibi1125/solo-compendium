# Skill Choice Fix for Awakening Features

## Problem
Character creation was not accounting for additional skill proficiencies granted by awakening features and job traits. Specifically:

1. **Idol Job's "Broad-Spectrum Awakening"** grants "Gain proficiency in two additional skills of your choice" but the UI only showed the base `skill_choice_count: 2`
2. **Expertise traits** like "Specialist Training" (double proficiency) were not indicated to users
3. Job detail pages didn't show the enhanced skill choice counts

## Solution
Enhanced skill choice calculation in character creation and job details to parse awakening feature descriptions for additional skill grants.

### Changes Made

#### 1. CharacterNew.tsx
- Added `totalSkillChoices` useMemo that:
  - Starts with base `skill_choice_count` from job data
  - Parses level 1 awakening features for skill grant patterns:
    - "gain proficiency in X additional skills"
    - "gain X additional skill proficiencies"
    - "proficient in X additional skills"  
    - "learn X additional skills"
- Updated UI to show:
  - Total skill choices with enhanced count
  - Indicator when additional skills come from awakening features
  - Warning for expertise traits that will be handled post-creation
- Updated validation logic to use `totalSkillChoices` instead of base count

#### 2. JobDetail.tsx
- Added same `totalSkillChoices` calculation logic
- Updated skill choices display to show enhanced count
- Added badge indicator when awakening features grant additional skills

### Technical Details

#### Pattern Matching
```typescript
const patterns = [
  /gain\s+proficiency\s+in\s+(\d+)\s+additional\s+skills?/i,
  /gain\s+(\d+)\s+additional\s+skill\s+proficiencies?/i,
  /proficient\s+in\s+(\d+)\s+additional\s+skills?/i,
  /learn\s+(\d+)\s+additional\s+skills?/i
];
```

#### UI Enhancements
- Shows "+X additional skills from awakening features" 
- Displays expertise warning: "⚠️ Some traits grant expertise (double proficiency) - will be available after character creation"
- Job details show badge with additional skill count

## Jobs Affected

### Primary: Idol
- Base: 2 skill choices
- "Broad-Spectrum Awakening": +2 additional skills
- **Total: 4 skill choices**

### Secondary (Expertise Only)
- Assassin: "Specialist Training" (double proficiency on 2 skills)
- Idol: "Specialist Training" (double proficiency on 2 skills, 2 more at 10th)

## Testing
1. Create new Idol character
2. Verify skill selection shows "Select 4 Skills *"
3. Verify "+2 additional skills from awakening features" indicator appears
4. Verify expertise warning appears
5. Check Idol job detail page shows enhanced skill count with badge

## Future Considerations
- Expertise selection will be handled through FeatureChoicesPanel after character creation
- Level-up skill grants (if any) will be handled through the same system
- Pattern matching can be extended for other feature types as needed
