# Test Report — Parity Test Suite

This document provides a comprehensive overview of the test suite for Solo Compendium, including how to run tests and test coverage summary.

## Phase 1 — CI Loop Verification (Green)

**Date**: 2026-01-06  
**Status**: ✅ All commands green (install, typecheck, lint, test, build)

### Commands Verified
- **install**: `npm install` ✅
- **typecheck**: `npm run typecheck` ✅
- **lint**: `npm run lint` ✅
- **test**: `npm run test -- --run` ✅
- **build**: `npm run build` ✅

### Fixes Applied During Verification
- **ESLint**: Removed explicit `any` + unused `eslint-disable` directives that were hard-failing `npm run lint`.
- **Parity test**: Fixed HP max test to pass VIT **modifier** (not raw score) into `calculateHPMax`.
- **Vitest stability**: Skipped the Supabase “connection probe” during Vitest to prevent happy-dom teardown `AbortError`.
- **Dice engine correctness**: Fixed `rollCheck()` defaulting to normal rolls when advantage/disadvantage is omitted (`src/lib/rollEngine.ts`).

### Evidence (Output Excerpts)

**typecheck**
```text
tsc -p tsconfig.app.json --noEmit
tsc -p tsconfig.node.json --noEmit
```

**test**
```text
Test Files  9 passed (9)
Tests       112 passed (112)
```

**build**
```text
✓ built in 19.93s
(!) Some chunks are larger than 1000 kB after minification. (warning only)
```

## Phase 5 — E2E Smoke (Playwright)

**Date**: 2026-01-06  
**Command**: `npm run test:e2e`  
**Result**: ✅ 19 passed, ⚠️ 2 skipped (data/env dependent)

### Notes
- Updated Playwright selectors to avoid strict-mode collisions between **Global Search** (header) and **Compendium Search** (page-level), and to align navigation labels with current UI ("Hunters" / "Hunter Registry").
- Added smoke coverage for **Global Search** and **DM Tools** routes (tests allow `/auth` redirect when unauthenticated).

## Test Structure

### Unit/Integration Tests
**Location**: `src/test/parity/`
- `fixtures.ts` - Test character fixtures (martial, caster, hybrid)
- `automation.test.ts` - Comprehensive automation flow tests
- `linkIntegrity.test.ts` - Reference resolution and link integrity tests

**Framework**: Vitest
**Command**: `npm test` or `npm test -- --run`

### Existing Unit Tests
**Location**: `src/lib/*.test.ts`
- `automation.test.ts` - Basic automation tests
- `diceRoller.test.ts` - Dice string rolling + formatting
- `rollEngine.test.ts` - Advantage/disadvantage, crit damage, and default behavior
- `system-flows.test.ts` - System flow tests
- `utils.test.ts` - Utility function tests

### Hook Tests
**Location**: `src/hooks/*.test.tsx`
- `useRollHistory.test.tsx` - Roll history hook returns empty array when unauthenticated

### Component Tests
**Location**: `src/components/**`
- `src/components/character/PowersList.test.tsx` - Spell slot consumption on cast (incl. cantrips)

### E2E Tests
**Location**: `e2e/*.spec.ts`
- `home.spec.ts` - Home page tests
- `search.spec.ts` - Search functionality tests
- `compendium.spec.ts` - Compendium browsing tests
- `compendium-detail.spec.ts` - Compendium detail page tests
- `character.spec.ts` - Character sheet tests
- `global-search.spec.ts` - Global header search smoke
- `dm-tools.spec.ts` - DM tools routes smoke (protected route behavior)
- `dice.spec.ts` - Dice roller route smoke

**Framework**: Playwright
**Command**: `npm run test:e2e`

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Test File
```bash
npm test -- automation.test.ts
```

### Run E2E Tests
```bash
npm run test:e2e
```

### Run E2E Tests in UI Mode
```bash
npm run test:e2e:ui
```

## Test Coverage Summary

### Automation Tests (`automation.test.ts`)

#### ✅ Proficiency Bonus Scaling
- Tests proficiency bonus calculation from level 1-20
- Verifies correct scaling at level thresholds (5, 9, 13, 17)

#### ✅ Derived Stats Correctness
- Saving throws with proficiencies
- Skills with proficiency and expertise
- Initiative calculation
- HP max calculation

#### ✅ AC Changes on Equip/Unequip
- AC modifier from equipped armor
- AC bonus from equipped relics
- Attunement requirement handling
- Multiple equipment stacking

#### ✅ Attack Roll Modifiers
- Attack bonus from equipment
- Multiple attack bonuses combination
- Damage bonus application

#### ✅ Spell Save DC and Spell Attack Bonus
- Spell save DC calculation (8 + proficiency + ability modifier)
- Spell attack bonus calculation (proficiency + ability modifier)

#### ✅ Condition Effects
- Disadvantage application
- Speed modifiers
- Multiple condition stacking

#### ✅ Rune Bonuses
- Passive bonus application
- Active vs inactive rune handling
- Multiple rune stacking

#### ✅ Rest System
- Hit dice restoration logic
- Resource restoration validation

#### ✅ Builder → Sheet Consistency
- Martial character fixture validation
- Caster character fixture validation
- Hybrid character fixture validation

#### ✅ Edge Cases
- Zero ability scores
- Maximum ability scores
- Negative AC modifiers
- Speed reduction to zero

### Link Integrity Tests (`linkIntegrity.test.ts`)

#### ✅ Compendium Resolver
- Entry type validation
- Reference resolution
- Non-existent reference handling
- Reference validation

#### ✅ Link Integrity Checker
- Broken job reference detection
- Broken rune reference detection
- Character data validation

## Test Fixtures

### `createMartialCharacter()`
Creates a level 5 Striker character with:
- High STR/AGI
- Weapon-focused equipment
- Armor equipped
- Attack-focused features

### `createCasterCharacter()`
Creates a level 5 Mage character with:
- High INT
- Spell-focused powers
- Spell slots
- Spellcasting features

### `createHybridCharacter()`
Creates a level 3 Ranger character with:
- Mixed stats
- Conditions applied
- Equipment with attunement
- Complex interactions

## Integration with CI/CD

### Pre-commit Checks
```bash
npm run lint && npm run typecheck && npm test -- --run
```

### Pre-deploy Checks
```bash
npm run lint && npm run typecheck && npm test -- --run && npm run build
```

## Known Limitations

1. **E2E Tests**: Some E2E tests may fail due to timing issues or environment setup. These are being addressed incrementally.

2. **Mocking**: Some tests require Supabase mocking. The current implementation uses vi.mock() for Supabase client.

3. **Coverage**: Full test coverage is a work in progress. Current focus is on critical automation flows.

## Future Test Additions

### Planned Tests
- [ ] Equipment equip/unequip integration tests
- [ ] Spell slot consumption integration tests
- [ ] Rest system integration tests (with mocked Supabase)
- [ ] Character creation flow E2E tests
- [ ] Compendium navigation E2E tests
- [ ] Dice rolling E2E tests

### Test Infrastructure Improvements
- [ ] Add test coverage reporting
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add accessibility testing

## Running Tests in Development

### Watch Mode
```bash
npm test -- --watch
```

### Debug Mode
```bash
npm test -- --inspect-brk
```

### Run Tests Matching Pattern
```bash
npm test -- -t "proficiency"
```

## Test Results

See **Phase 1 — CI Loop Verification (Green)** above for the latest verified results.

## Contributing Tests

When adding new features:
1. Add unit tests for calculation logic
2. Add integration tests for automation flows
3. Add E2E tests for user-facing features
4. Update this report with new test coverage

## Test Maintenance

- Run tests before committing: `npm test -- --run`
- Fix failing tests before merging PRs
- Update fixtures when schema changes
- Keep test documentation up to date

