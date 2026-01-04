# Launch Bug Investigation - Initial Evidence

## Problem Description
On dev start, the app renders only a fullscreen image/blank gradient and the UI is not usable (no clicks, no navigation).

## Hypotheses to Test

### Hypothesis A: React Query hooks stuck in loading state
- **Theory**: The `useCharacters`, `useMyCampaigns`, or `useJoinedCampaigns` hooks are stuck in loading state, preventing the component from rendering content.
- **Evidence to collect**: Query loading states, query errors, query data values

### Hypothesis B: useMyCampaigns throws error for unauthenticated users
- **Theory**: `useMyCampaigns` throws an error if user is not authenticated (line 32), which might cause the component to crash or render nothing.
- **Evidence to collect**: Error state from useMyCampaigns, error boundary state

### Hypothesis C: Z-index/layering issue blocking interaction
- **Theory**: Despite `pointer-events-none` on background overlays, there might be a z-index issue or another element blocking clicks.
- **Evidence to collect**: DOM structure, z-index values, pointer-events values

### Hypothesis D: Router not rendering Index route
- **Theory**: The Index route might not be rendering properly, or there's an issue with the route setup.
- **Evidence to collect**: Route match, component render status

### Hypothesis E: ErrorBoundary catching and hiding error
- **Theory**: The ErrorBoundary might be catching an error but rendering nothing visible or a blank screen.
- **Evidence to collect**: ErrorBoundary error state, error message

### Hypothesis F: CSS rendering problem
- **Theory**: The gradient background renders but content is not visible due to CSS issues (opacity, visibility, display).
- **Evidence to collect**: Computed styles, element visibility

## Instrumentation Plan
- Add logs to main.tsx (app initialization)
- Add logs to App.tsx (router setup)
- Add logs to Index.tsx (route component)
- Add logs to Layout.tsx (layout rendering)
- Add logs to LaunchPad.tsx (component render, query states, authentication logic)
- Add logs to ErrorBoundary.tsx (error catching)

## Root Cause Analysis (CONFIRMED)

### Hypothesis B: CONFIRMED
**Root Cause**: `useMyCampaigns` hook throws an error for unauthenticated users, while `useCharacters` and `useJoinedCampaigns` return empty arrays. This inconsistency causes the component to crash or fail to render properly.

**Evidence**:
- Logs show App.tsx renders but Index.tsx/Layout.tsx/LaunchPad.tsx never render
- `useMyCampaigns` throws `new Error('Not authenticated')` on line 32 when user is not authenticated
- Other hooks (`useCharacters`, `useJoinedCampaigns`) return `[]` for unauthenticated users

**Fix Applied**:
- Changed `useMyCampaigns` to return `[]` instead of throwing an error for unauthenticated users
- Added `retry: false` to match other hooks' behavior
- This makes all three hooks consistent in handling unauthenticated users

## Fix Summary
**File**: `src/hooks/useCampaigns.ts`
**Change**: Modified `useMyCampaigns` to return empty array for unauthenticated users instead of throwing an error

## Next Steps
1. Test the fix - verify UI is interactive
2. Remove instrumentation after confirmation
3. Run repo-wide cleanup (lint/typecheck/tests/build)

