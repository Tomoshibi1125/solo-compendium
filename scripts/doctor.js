import { execSync } from 'node:child_process';

function runStep(label, command) {
  console.log(`\n==> ${label}\n$ ${command}`);
  execSync(command, {
    stdio: 'inherit',
    env: {
      ...process.env,
      // Ensure predictable output and behavior in CI-like runs
      CI: process.env.CI ?? '1',
    },
  });
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    e2e: args.has('--e2e'),
    skipBuild: args.has('--skip-build'),
    skipCompendiumCoverage: args.has('--skip-compendium-coverage'),
    skipCompendiumValidate: args.has('--skip-compendium-validate'),
  };
}

const opts = parseArgs(process.argv);

try {
  runStep('Lint', 'npm run lint');
  runStep('Typecheck', 'npm run typecheck');
  runStep('Unit tests', 'npm run test -- --run');

  if (!opts.skipCompendiumValidate) {
    runStep('Compendium validation', 'npm run compendium:validate');
  }

  if (!opts.skipCompendiumCoverage) {
    runStep('Compendium coverage + integrity', 'npm run compendium:coverage -- --check');
  }

  if (!opts.skipBuild) {
    runStep('Build', 'npm run build');
  }

  if (opts.e2e) {
    runStep('E2E tests', 'npm run test:e2e');
  }

  console.log('\nDoctor OK');
} catch (err) {
  console.error('\nDoctor FAILED');
  process.exit(typeof err?.status === 'number' ? err.status : 1);
}
