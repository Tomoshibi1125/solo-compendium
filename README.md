# Solo Compendium

A professional-grade compendium and character tool web app for Solo Leveling 5e, built with React, TypeScript, and Supabase.

## ✨ Features

- **📚 Compendium**: Browse and search jobs, powers, relics, monsters, backgrounds, and more
- **👤 Character Builder**: Step-by-step character creation with rules automation
- **📊 Character Sheet**: Automated stat calculations, inventory tracking, and condition management
- **⚙️ Rules Engine**: Automatic proficiency, saves, skills, AC, HP, and more
- **💤 Rest System**: Short and long rest resource management
- **🎲 Dice Roller**: Integrated dice rolling with action cards
- **📤 Export**: JSON and PDF character export
- **⭐ Favorites**: Save favorite compendium items
- **📱 PWA**: Progressive Web App support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Supabase account and project

### Installation

```sh
# Clone the repository
git clone https://github.com/Tomoshibi1125/solo-compendium.git
cd solo-compendium

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Development

```sh
# Start development server
npm run dev

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Deployment

### Quick Deploy

See `DEPLOY.md` for detailed deployment instructions.

**Vercel** (Recommended):
```bash
vercel
```

**Netlify**:
```bash
netlify deploy --prod
```

**Pre-deployment Check**:
```bash
# Windows
.\scripts\deploy-check.ps1

# Linux/Mac
./scripts/deploy-check.sh
```

### Pre-Deployment Checklist

1. **Database Setup**
   - Apply migrations: `supabase migration up`
   - Verify SRD content migration applied

2. **Environment Variables**
   - Set `VITE_SUPABASE_URL`
   - Set `VITE_SUPABASE_PUBLISHABLE_KEY`

3. **Supabase Storage**
   - Create `character-portraits` bucket
   - Set up storage policies (see `docs/DEPLOYMENT_READINESS.md`)

## 📚 Documentation

- **[Deployment Guide](docs/DEPLOYMENT_READINESS.md)** - Complete deployment instructions
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture overview
- **[Systems Integration](docs/SYSTEMS_INTEGRATION.md)** - Integration verification
- **[SRD Coverage](docs/SRD_COVERAGE.md)** - SRD content coverage report
- **[Progress](docs/PROGRESS.md)** - Feature completion status

## 🎯 Project Status

**✅ PRODUCTION READY**

- ✅ All features complete
- ✅ All tests passing
- ✅ Build optimized
- ✅ Documentation complete
- ✅ Ready for deployment

## 📦 Project Structure

```
solo-compendium/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── types/          # TypeScript types
├── supabase/
│   └── migrations/     # Database migrations
├── docs/               # Documentation
├── scripts/            # Build/deploy scripts
└── public/             # Static assets
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Input sanitization implemented
- Environment variables for sensitive data
- Supabase authentication integrated

## 📄 License

This project uses:
- **Homebrew Content**: Original Solo Leveling themed content
- **SRD Content**: 5e SRD content (Open Game License)
- **Generated Content**: AI-generated gap-fill content

All SRD content is properly attributed with `source_kind='srd'` and `license_note='Open Game License content'`.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the repository owner.

## 📞 Support

For deployment help, see:
- `docs/DEPLOYMENT_READINESS.md` - Complete deployment guide
- `DEPLOY.md` - Quick deployment guide

---

**Built with ❤️ for Solo Leveling 5e**
