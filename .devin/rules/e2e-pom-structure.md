---
description: Enforces Playwright E2E Page Object Model structure and conventions
---

# E2E POM Structure Rules

## File Layout

```
tests/
├── pages/            # Page Object Models (one per logical page/flow)
│   ├── AuthPage.ts
│   ├── DMPage.ts
│   ├── PlayerPage.ts
│   ├── DiceRollerPage.ts
│   └── CharacterSheetPage.ts   (future)
├── helpers/          # Shared utilities (auth helpers, fixtures, etc.)
└── *.e2e.spec.ts     # Test spec files
```

## Conventions

1. **One POM per logical page/flow** — group related actions (e.g., DMPage handles both campaign creation and homebrew creation since both are DM workflows).

2. **Selector priority** (most stable → least stable):
   - `data-testid` attributes (e.g., `getByTestId('email-input')`)
   - `role` + `name` (e.g., `getByRole('button', { name: /Create Guild/i })`)
   - `aria-label` (e.g., `getByLabel('Roll attack for Dagger')`)
   - `#id` selectors for form fields (e.g., `#campaign-name`)
   - CSS class selectors (last resort, document why)

3. **POM methods should**:
   - Accept parameters for variable data (campaign name, character name, etc.)
   - Return relevant data (campaign IDs, share codes, character IDs)
   - Include built-in waits (`waitForURL`, `waitFor`, `expect(...).toBeVisible()`)
   - Document the fallback selector strategy in a JSDoc comment

4. **Dual-context tests** use `browser.newContext()` for each role (DM, Player) to ensure isolated cookies/storage. Never share contexts between roles.

5. **Environment variables** for credentials:
   - `E2E_DM_EMAIL`, `E2E_DM_PASSWORD`
   - `E2E_PLAYER_EMAIL`, `E2E_PLAYER_PASSWORD`
   - `E2E_USE_GUEST_PLAYER` — set to `"true"` if no player account exists

6. **Analytics consent** must be dismissed via `addInitScript` localStorage injection before any navigation (see `AuthPage.dismissAnalytics()`).

7. **Supabase intercepts** — the app has no REST `/api/*` endpoints. Network waits should target `*.supabase.co/rest/v1/*` or RPC function names.

8. **Artifacts** — attach screenshots on failure via `test.info().attach()`. Config should use `retain-on-failure` for traces and video.
