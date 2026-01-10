import { execSync } from 'node:child_process';

function runStep(label, command) {
  console.log(`\n==> ${label}\n$ ${command}`);
  execSync(command, {
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: process.env.CI ?? '1',
    },
  });
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    e2e: args.has('--e2e'),
    skipAudit: args.has('--skip-audit'),
  };
}

const opts = parseArgs(process.argv);

try {
  runStep('Placeholder scan (write report)', 'npm run placeholder:scan');
  runStep('Placeholder check (enforce zero blocking findings)', 'npm run placeholder:check');
  runStep('Compendium coverage (generate report)', 'npm run compendium:coverage');

  if (!opts.skipAudit) {
    runStep('Dependency audit (npm audit)', 'npm audit --audit-level=moderate');
  }

  const doctorCmd = opts.e2e
    ? 'npm run doctor -- --e2e --skip-compendium-coverage'
    : 'npm run doctor -- --skip-compendium-coverage';
  runStep('Doctor (lint, typecheck, unit tests, compendium validate, build)', doctorCmd);

  console.log('\nDiagnose OK');
} catch (err) {
  console.error('\nDiagnose FAILED');
  process.exit(typeof err?.status === 'number' ? err.status : 1);
}
