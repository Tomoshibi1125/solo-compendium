#!/bin/bash
# Deployment Pre-Flight Check Script

echo "🔍 Running deployment pre-flight checks..."
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node: $NODE_VERSION"
if [[ ! "$NODE_VERSION" =~ v(2[0-9]|1[89]) ]]; then
  echo "   ⚠️  Warning: Node 20+ recommended"
fi

# Check dependencies
echo ""
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "   ❌ node_modules not found. Run 'npm install' first."
  exit 1
fi
echo "   ✅ Dependencies installed"

# Run linting
echo ""
echo "🔍 Running linter..."
npm run lint
LINT_EXIT=$?
if [ $LINT_EXIT -ne 0 ]; then
  echo "   ⚠️  Linting issues found (may be non-blocking)"
fi

# Run type checking
echo ""
echo "🔍 Running type check..."
npm run typecheck
TYPE_EXIT=$?
if [ $TYPE_EXIT -ne 0 ]; then
  echo "   ❌ Type errors found!"
  exit 1
fi
echo "   ✅ Type check passed"

# Run tests
echo ""
echo "🧪 Running tests..."
npm run test -- --run
TEST_EXIT=$?
if [ $TEST_EXIT -ne 0 ]; then
  echo "   ❌ Tests failed!"
  exit 1
fi
echo "   ✅ Tests passed"

# Build
echo ""
echo "🏗️  Building for production..."
npm run build
BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
  echo "   ❌ Build failed!"
  exit 1
fi
echo "   ✅ Build successful"

# Check dist folder
echo ""
echo "📁 Checking build output..."
if [ ! -d "dist" ]; then
  echo "   ❌ dist folder not found!"
  exit 1
fi
echo "   ✅ dist folder created"

# Check for environment variables
echo ""
echo "🔐 Checking environment variables..."
if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "   ⚠️  VITE_SUPABASE_URL not set (required for deployment)"
fi
if [ -z "$VITE_SUPABASE_PUBLISHABLE_KEY" ]; then
  echo "   ⚠️  VITE_SUPABASE_PUBLISHABLE_KEY not set (required for deployment)"
fi

echo ""
echo "✅ All checks complete!"
echo "🚀 Ready to deploy!"

