# Architecture Documentation

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: TanStack Query 5.83.0 (for server state)
- **Form Handling**: React Hook Form 7.61.1 + Zod 3.25.76

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (via @supabase/supabase-js 2.89.0)
- **API**: Supabase REST API (auto-generated from schema)

### Development Tools
- **Linting**: ESLint 9.32.0 with TypeScript ESLint
- **Package Manager**: npm (package-lock.json present)
- **Type Checking**: TypeScript (tsconfig.json)

## Project Structure

```
solo-compendium/
├── src/
│   ├── components/          # React components
│   │   ├── compendium/      # Detail views for compendium entries
│   │   ├── home/            # Home page sections
│   │   ├── layout/          # Layout components (Header, Layout)
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   │   └── compendium/      # Compendium detail pages
│   ├── types/               # TypeScript type definitions
│   │   └── solo-leveling.ts # Core game system types
│   └── main.tsx             # App entry point
├── supabase/
│   ├── migrations/          # Database migrations
│   └── config.toml          # Supabase config
├── public/                  # Static assets
└── docs/                    # Documentation (this directory)
```

## Database Schema

### Core Entities

#### Compendium Tables
- `compendium_jobs` - Character classes (Striker, Mage, etc.)
- `compendium_job_paths` - Subclass paths
- `compendium_job_features` - Class features by level
- `compendium_monarchs` - Monarch overlays
- `compendium_monarch_features` - Monarch features
- `compendium_sovereigns` - Sovereign combinations
- `compendium_sovereign_features` - Sovereign features
- `compendium_powers` - Spells/techniques
- `compendium_relics` - Magic items
- `compendium_equipment` - Standard equipment
- `compendium_monsters` - Creatures
- `compendium_backgrounds` - Character backgrounds
- `compendium_conditions` - Status conditions
- `compendium_feats` - Feats
- `compendium_skills` - Skills

#### Character Tables
- `characters` - Main character records
- `character_abilities` - Ability scores (STR, AGI, VIT, INT, SENSE, PRE)
- `character_features` - Active features with usage tracking
- `character_powers` - Known/prepared powers
- `character_equipment` - Inventory items

### Enums
- `ability_score`: STR, AGI, VIT, INT, SENSE, PRE
- `rarity`: common, uncommon, rare, very_rare, legendary
- `relic_tier`: dormant, awakened, resonant

## Data Flow

1. **Compendium Browsing**
   - User navigates to `/compendium`
   - Frontend queries Supabase for entries
   - Results displayed in grid/list view
   - Clicking entry navigates to `/compendium/:type/:id`
   - Detail component fetches full entry data

2. **Character Management**
   - Characters stored per user (via `user_id` foreign key)
   - Character creation: multi-step form → Supabase insert
   - Character sheet: fetches character + related data (abilities, features, equipment)
   - Derived stats calculated client-side from base data

3. **Rules Automation**
   - Proficiency bonus: `Math.ceil(level / 4) + 1`
   - Ability modifiers: `Math.floor((score - 10) / 2)`
   - System Favor die scales with level (d4 → d6 → d8 → d10)
   - AC, saves, skills calculated from abilities + proficiencies + modifiers

## Current State

### Implemented
- ✅ Basic routing structure
- ✅ Compendium browse/search page
- ✅ Detail page components (JobDetail, PowerDetail, etc.)
- ✅ Database schema with comprehensive tables
- ✅ Type definitions for game system
- ✅ UI component library (shadcn/ui)

### Missing / Incomplete
- ❌ Provenance tracking (sourceKind, sourceName, licenseNote)
- ❌ Character sheet implementation (currently sample data)
- ❌ Character builder/creation flow
- ❌ Rules automation engine
- ❌ Rest system (short/long rest resets)
- ❌ Testing infrastructure
- ❌ CI/CD pipeline
- ❌ Import pipeline for homebrew content
- ❌ Admin tools

## Recommended Architecture Improvements

### 1. Content Layer
- **Zod Schemas**: Add validation schemas for all compendium entities
- **Normalized Data**: Ensure consistent entity structure
- **Search Indexing**: Consider full-text search (PostgreSQL `tsvector` or external service)

### 2. Rules Engine
- **Modifier System**: Centralized modifier calculation (equipment, features, conditions)
- **Feature Resolution**: Engine to resolve feature choices, scaling, prerequisites
- **Rest Handler**: Automated resource recharge on rest

### 3. Character Builder
- **Step-by-Step Flow**: Multi-step wizard with validation
- **Live Preview**: Show derived stats as user makes choices
- **Choice System**: Handle features that require choices (skill selections, etc.)

### 4. Content Management
- **Import Pipeline**: Scripts to import JSON/YAML/MD homebrew files
- **Validator**: Schema validation before import
- **Migration System**: Version-controlled content updates

### 5. Performance
- **Caching**: React Query caching for compendium data
- **Pagination**: Implement pagination for large result sets
- **Code Splitting**: Lazy load detail pages

## Security Considerations

- **Row Level Security (RLS)**: Characters should be user-scoped
- **Auth Required**: Character creation/editing requires authentication
- **Input Validation**: All user inputs validated (Zod schemas)
- **SQL Injection**: Supabase client handles parameterization

## Deployment

- **Frontend**: Static site (Vite build) → Vercel/Netlify/Cloudflare Pages
- **Backend**: Supabase (hosted PostgreSQL + Auth)
- **Environment Variables**: 
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

