# Development Roadmap

## Milestones Toward D&D Beyond Parity

This roadmap outlines the phases to achieve feature parity with D&D Beyond while maintaining legal compliance and using only homebrew + SRD-safe content.

---

## PHASE 1: Compendium MVP (Professional-Grade) ⏳

**Goal**: Make the compendium feel production-ready with excellent UX.

### Tasks
- [x] Basic browse/search (already implemented)
- [ ] **Enhanced Search**
  - [ ] Full-text search across all fields
  - [ ] Advanced filters (level, rarity, tags, etc.)
  - [ ] Sort options (name, level, rarity, date added)
  - [ ] Search result highlighting
- [ ] **Detail Pages**
  - [x] Basic detail components exist
  - [ ] Complete all detail page implementations
  - [ ] Related entities links (e.g., "Powers that use this" → link to powers)
  - [ ] Shareable URLs with deep linking
  - [ ] Print-friendly views
- [ ] **Favorites/Collections**
  - [ ] User favorites system (Supabase table)
  - [ ] Collections/bookmarks UI
  - [ ] Quick access from character builder
- [ ] **UI Polish**
  - [ ] Loading states for all async operations
  - [ ] Error boundaries and error states
  - [ ] Empty states with helpful messages
  - [ ] Responsive design testing (mobile/tablet/desktop)

**Success Criteria**: User can browse, search, filter, and view any compendium entry with a smooth, professional experience.

---

## PHASE 2: Character Sheet MVP (Rules Automation Foundation) ⏳

**Goal**: Functional character sheet with correct 5e-style calculations and automation.

### Tasks
- [ ] **Character Model & Persistence**
  - [x] Database schema exists
  - [ ] Character CRUD operations (create, read, update, delete)
  - [ ] Character list page with real data
  - [ ] Character detail/sheet page
- [ ] **Derived Stats Engine**
  - [ ] Proficiency bonus calculation (`Math.ceil(level / 4) + 1`)
  - [ ] Ability modifiers (`Math.floor((score - 10) / 2)`)
  - [ ] Saving throws (ability mod + proficiency if proficient)
  - [ ] Skills (ability mod + proficiency/expertise if applicable)
  - [ ] AC calculation (base 10 + DEX mod + armor + shields + modifiers)
  - [ ] Initiative (DEX mod + modifiers)
  - [ ] Speed (base from job + modifiers)
  - [ ] HP max (job hit die + CON mod per level)
- [ ] **Inventory/Equipment**
  - [ ] Equipment list with attunement tracking
  - [ ] Equipment modifiers applied to stats
  - [ ] Weight tracking (optional)
  - [ ] Currency tracking
- [ ] **Action List**
  - [ ] Attacks (weapons with to-hit and damage)
  - [ ] Powers/spells with casting info
  - [ ] Features with usage tracking
  - [ ] Roll buttons (integrate with dice roller)
- [ ] **Conditions Tracking**
  - [ ] Apply/remove conditions
  - [ ] Condition effects applied to stats automatically
  - [ ] Condition expiration tracking
- [ ] **Rest System**
  - [ ] Short rest: restore hit dice, reset short-rest features
  - [ ] Long rest: restore HP, hit dice, long-rest features, remove exhaustion
  - [ ] System Favor recharge rules

**Success Criteria**: Character sheet displays all stats correctly, updates automatically when abilities/equipment change, and handles rest resets properly.

---

## PHASE 3: Character Builder + Level Up ⏳

**Goal**: Step-by-step character creation and leveling with choice handling.

### Tasks
- [ ] **Character Creation Wizard**
  - [ ] Step 1: Concept (name, appearance, backstory)
  - [ ] Step 2: Ability Scores (point buy, standard array, or roll)
  - [ ] Step 3: Job Selection (with preview of features)
  - [ ] Step 4: Path Selection (if applicable)
  - [ ] Step 5: Background Selection
  - [ ] Step 6: Equipment Selection (starting equipment or credits)
  - [ ] Step 7: Powers Selection (if applicable)
  - [ ] Step 8: Review & Create
- [ ] **Choices System**
  - [ ] Features that require choices (e.g., "Choose 2 skills")
  - [ ] UI for making choices with validation
  - [ ] Store choices in database
  - [ ] Revisit choices on level up if needed
- [ ] **Level Up Flow**
  - [ ] Level up button/trigger
  - [ ] Show new features gained at this level
  - [ ] Handle HP increase (roll or average)
  - [ ] Handle ability score improvements (ASI/feats)
  - [ ] Handle new powers (if applicable)
  - [ ] Update all derived stats
- [ ] **Scaling System**
  - [ ] Features that scale with level (e.g., "damage = proficiency bonus")
  - [ ] Features that scale with ability modifier
  - [ ] Features that scale with proficiency bonus
  - [ ] Dynamic calculation in UI

**Success Criteria**: User can create a character from scratch through a guided wizard, and level up with all choices and scaling handled correctly.

---

## PHASE 4: Import/Admin Tools ⏳

**Goal**: Maintainable content pipeline for homebrew and generated content.

### Tasks
- [ ] **Import Pipeline**
  - [ ] Script to read JSON/YAML/MD files from repo
  - [ ] Parse and validate against Zod schemas
  - [ ] Upsert into Supabase with provenance
  - [ ] Handle relationships (e.g., job → features → powers)
- [ ] **Validator**
  - [ ] Schema validation (Zod)
  - [ ] Referential integrity checks
  - [ ] Balance checks (optional, for generated content)
- [ ] **Migration System**
  - [ ] Version-controlled content updates
  - [ ] Rollback capability
  - [ ] Change tracking
- [ ] **Admin UI** (Optional, gated behind auth)
  - [ ] Content editor for compendium entries
  - [ ] Bulk import interface
  - [ ] Validation results display
  - [ ] Content approval workflow (if multi-user)

**Success Criteria**: Content can be imported from source files, validated, and updated in the database with full provenance tracking.

---

## PHASE 5: Shipping Polish ⏳

**Goal**: Production-ready app with performance, accessibility, and security.

### Tasks
- [ ] **Performance**
  - [ ] Code splitting (lazy load routes)
  - [ ] Image optimization
  - [ ] Search result pagination
  - [ ] Caching strategy (React Query)
  - [ ] Bundle size optimization
- [ ] **Accessibility**
  - [ ] Keyboard navigation
  - [ ] ARIA labels
  - [ ] Focus states
  - [ ] Screen reader testing
  - [ ] Color contrast checks
- [ ] **Security**
  - [ ] Row Level Security (RLS) policies
  - [ ] Input sanitization
  - [ ] XSS prevention
  - [ ] CSRF protection (Supabase handles)
  - [ ] Auth token refresh handling
- [ ] **Testing**
  - [ ] Unit tests for utility functions
  - [ ] Component tests for critical UI
  - [ ] E2E tests (Playwright) for key workflows:
    - [ ] Home page loads
    - [ ] Search compendium
    - [ ] View detail page
    - [ ] Create character
    - [ ] Level up character
    - [ ] Rest system
- [ ] **Documentation**
  - [ ] User guide
  - [ ] API documentation (if needed)
  - [ ] Contributing guide (for content)

**Success Criteria**: App is fast, accessible, secure, and well-tested with comprehensive E2E coverage.

---

## Timeline Estimate

- **Phase 1**: 1-2 weeks
- **Phase 2**: 2-3 weeks
- **Phase 3**: 2-3 weeks
- **Phase 4**: 1-2 weeks
- **Phase 5**: 1-2 weeks

**Total**: ~7-12 weeks for full parity

---

## Dependencies

- Supabase project must be set up with migrations applied
- Environment variables configured
- Content source files identified (if importing homebrew)

---

## Notes

- Each phase should be shippable independently
- Keep dev/build green throughout
- Commit frequently with conventional commits
- Test as you go (don't defer all testing to Phase 5)

