# Deprecated: Regent Catch-Up Curation System

## Overview
The Regent catch-up curation system has been deprecated as of 2026-10-02. The Warden pre-approval workflow for Regent attunement powers/techniques/spells is no longer required.

## What Changed
Previously, when a player attuned to a Regent and needed to catch up on abilities:
1. **Warden** would use `RegentCatchUpCatalogDialog` to curate/approve a list of canonical options
2. Choices were saved to `regent_catch_up_options` table
3. **Player** could only pick from pre-approved options in `RegentCatchUpModal`

Now:
- **Players** select powers/techniques/spells directly from the canonical catalog
- This matches the pattern used for job/path selections
- No Warden pre-approval required

## Deprecated Components

### Frontend
- `RegentCatchUpCatalogDialog` component (`src/components/campaign/RegentCatchUpCatalogDialog.tsx`)
  - Can be removed or repurposed
- "Curate picks" button in `CampaignRegentOversight` component
  - Located around line 424 in `src/components/campaign/CampaignRegentOversight.tsx`

### Backend
- `regent_catch_up_options` table
  - Still exists but no longer enforced
  - Can be dropped in a future cleanup migration
- `set_regent_catch_up_options` RPC function
  - No longer called by frontend
- `listRegentCuratedOptions` and `setRegentCuratedOptions` functions
  - Located in `src/lib/regentCatchUpCatalog.ts`
  - No longer used

### Database Migration
- Created `20261002120000_remove_regent_catch_up_approval_requirement.sql`
- Removed validation checks in `complete_regent_catch_up` function that required picks to exist in `regent_catch_up_options` table

## Rationale
This change aligns Regent ability selection with the established pattern for job and path abilities, where players make their own choices directly from the canonical catalog. The Warden's role is to provide the initial 3 Regent choices, not to micromanage every power/technique/spell selection during catch-up.

## Future Cleanup
If desired, a future migration can:
1. Drop the `regent_catch_up_options` table
2. Drop the `set_regent_catch_up_options` function
3. Remove the deprecated frontend components
4. Remove the `regentCatchUpCatalog.ts` module
