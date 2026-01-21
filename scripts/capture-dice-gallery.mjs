import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as delay } from 'timers/promises';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:4173';
const headless = process.env.QA_HEADLESS !== 'false';
const previewPort = process.env.QA_PREVIEW_PORT || '4173';
const skipBuild = process.env.QA_SKIP_BUILD === 'true';
const artifactsDir =
  process.env.QA_ARTIFACTS_DIR || path.resolve(process.cwd(), 'qa-artifacts', 'dice-gallery');
const capturePhases = (process.env.QA_CAPTURE_PHASES || 'settled')
  .split(',')
  .map((phase) => phase.trim())
  .filter(Boolean);
const midRollDelayMs = Number(process.env.QA_MID_ROLL_DELAY_MS || '800');
const settledDelayMs = Number(process.env.QA_SETTLED_DELAY_MS || '2600');

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true, stdio: 'inherit', ...options });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
    child.on('error', reject);
  });

const waitForServer = async (url, timeoutMs = 60000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {
      // ignore and retry
    }
    await delay(2000);
  }
  throw new Error(`Preview server not responding at ${url}`);
};

const killPid = async (pid) => {
  if (!pid || !Number.isFinite(pid)) return;
  if (process.platform === 'win32') {
    try {
      await runCommand('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
    } catch {
      // ignore if already stopped
    }
    return;
  }
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    // ignore if already stopped
  }
};

const cleanupPreviewPid = async () => {
  const pidPath = path.resolve(process.cwd(), '.preview.pid');
  try {
    const raw = await fs.readFile(pidPath, 'utf8');
    const pid = Number.parseInt(raw.trim(), 10);
    if (Number.isFinite(pid)) {
      await killPid(pid);
    }
  } catch {
    // no pid file
  }
  try {
    await fs.unlink(pidPath);
  } catch {
    // ignore
  }
};

const safeFileName = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const parseThemes = async () => {
  const source = await fs.readFile(path.resolve(process.cwd(), 'src/components/dice/diceThemes.ts'), 'utf8');
  const typeMatch = source.match(/export type DiceTheme =([^;]+);/s);
  const keys = [];
  if (typeMatch) {
    const keyMatches = [...typeMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
    keys.push(...keyMatches);
  }

  const names = new Map();
  const entryRegex = /'([^']+)':\s*\{[\s\S]*?name:\s*'([^']+)'[\s\S]*?\}/g;
  for (const match of source.matchAll(entryRegex)) {
    names.set(match[1], match[2]);
  }

  const uniqueKeys = [...new Set(keys)];
  if (uniqueKeys.length === 0) {
    throw new Error('Failed to parse dice themes from diceThemes.ts');
  }

  return uniqueKeys.map((key) => ({ key, name: names.get(key) ?? key }));
};

const diceTypes = [
  { sides: 4, label: 'd4' },
  { sides: 6, label: 'd6' },
  { sides: 8, label: 'd8' },
  { sides: 10, label: 'd10' },
  { sides: 12, label: 'd12' },
  { sides: 20, label: 'd20' },
  { sides: 100, label: 'd100' },
];

const assertDice3D = async (page) => {
  const diagnostics = await page.evaluate(() => {
    const roller = document.querySelector('.dice-3d-roller');
    const canvas = roller?.querySelector('canvas');
    const glowCount = document.querySelectorAll('.dice-glow-effect').length;
    const overlayPanel = document.querySelector('.dice-overlay-panel');
    const audioToggle = document.querySelector('.dice-audio-toggle');
    let webgl = false;
    let canvasSize = null;
    if (canvas instanceof HTMLCanvasElement) {
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      webgl = !!gl;
      canvasSize = { width: canvas.width, height: canvas.height };
    }
    return {
      hasRoller: !!roller,
      hasCanvas: !!canvas,
      webgl,
      glowCount,
      hasOverlay: !!overlayPanel,
      hasAudioToggle: !!audioToggle,
      canvasSize,
    };
  });

  if (!diagnostics.hasRoller) {
    throw new Error('Dice 3D roller not rendered');
  }
  if (!diagnostics.hasCanvas || !diagnostics.webgl) {
    throw new Error('Dice 3D WebGL canvas not active');
  }
  if (!diagnostics.canvasSize || diagnostics.canvasSize.width < 50 || diagnostics.canvasSize.height < 50) {
    throw new Error('Dice 3D canvas size invalid');
  }
  if (diagnostics.glowCount < 2) {
    throw new Error('Dice FX glow elements missing');
  }
  if (!diagnostics.hasOverlay || !diagnostics.hasAudioToggle) {
    throw new Error('Dice overlay UI missing');
  }
};

const dismissBanners = async (page) => {
  const buttonNames = ['No Thanks', 'Dismiss', 'Close', 'Got it'];
  for (const name of buttonNames) {
    const locator = page.getByRole('button', { name });
    try {
      if (await locator.isVisible({ timeout: 1000 })) {
        await locator.click();
        await page.waitForTimeout(200);
      }
    } catch {
      // ignore
    }
  }
};

const clearSelection = async (page) => {
  await page.evaluate(() => {
    const rollButton = document.querySelector('[data-testid="dice-roll-button"]');
    const clearButton = rollButton?.nextElementSibling;
    if (clearButton instanceof HTMLElement) {
      clearButton.click();
    }
  });
  await page.waitForTimeout(200);
};

const run = async () => {
  await fs.mkdir(artifactsDir, { recursive: true });

  if (!skipBuild) {
    await runCommand('npm', ['run', 'build']);
  }

  await cleanupPreviewPid();
  const previewProcess = spawn('npx', ['vite', 'preview', '--port', previewPort, '--strictPort'], {
    shell: true,
    stdio: 'inherit',
  });
  const previewPidPath = path.resolve(process.cwd(), '.preview.pid');
  if (previewProcess.pid) {
    await fs.writeFile(previewPidPath, String(previewProcess.pid), 'utf8');
  }
  await waitForServer(baseUrl);

  const browser = await chromium.launch({
    headless,
    args: headless
      ? ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage']
      : ['--disable-dev-shm-usage'],
  });

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on('console', (msg) => {
      const text = msg.text();
      if (text) {
        console.log(`[browser:${msg.type()}] ${text}`);
      }
    });
    page.on('pageerror', (err) => {
      const stack = err?.stack ? `\n${err.stack}` : '';
      console.log(`[browser:error] ${err.toString()}${stack}`);
    });
    await page.goto(`${baseUrl}/dice`, { waitUntil: 'networkidle' });
    try {
      await page.getByText(/Dice Roller/i).first().waitFor({ timeout: 20000 });
    } catch (error) {
      const debugPath = path.join(artifactsDir, 'debug-dice-page.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      const debugText = await page.evaluate(() => document.body.innerText.slice(0, 800));
      console.log('Dice page debug URL:', page.url());
      console.log('Dice page debug text:', debugText);
      console.log('Dice page debug screenshot:', debugPath);
      throw error;
    }
    await dismissBanners(page);

    const themes = await parseThemes();
    const captures = [];

    for (const theme of themes) {
      console.log(`\nTheme: ${theme.name}`);
      const themeButton = page.getByRole('button', { name: new RegExp(theme.name, 'i') });
      await themeButton.scrollIntoViewIfNeeded();
      await themeButton.first().click();
      await page.waitForTimeout(200);
      await dismissBanners(page);

      for (const die of diceTypes) {
        console.log(`  Capturing ${die.label}...`);
        await clearSelection(page);
        await page.getByRole('button', { name: die.label, exact: true }).click();
        await page.getByTestId('dice-roll-button').click();
        await page.locator('.dice-3d-roller').waitFor({ timeout: 20000 });
        await page.waitForTimeout(midRollDelayMs);
        await assertDice3D(page);

        if (capturePhases.includes('mid')) {
          const fileName = `${safeFileName(theme.key)}-${safeFileName(die.label)}-mid.png`;
          const filePath = path.join(artifactsDir, fileName);
          await page.locator('.dice-3d-roller').screenshot({ path: filePath });
          captures.push(filePath);
        }

        const remainingDelay = Math.max(0, settledDelayMs - midRollDelayMs);
        await page.waitForTimeout(remainingDelay);
        await assertDice3D(page);

        if (capturePhases.includes('settled')) {
          const fileName = `${safeFileName(theme.key)}-${safeFileName(die.label)}-settled.png`;
          const filePath = path.join(artifactsDir, fileName);
          await page.locator('.dice-3d-roller').screenshot({ path: filePath });
          captures.push(filePath);
        }
      }
    }

    console.log('\nDice Gallery Captures:');
    captures.forEach((entry) => console.log(`- ${entry}`));
  } finally {
    await browser.close();
    if (previewProcess) {
      await killPid(previewProcess.pid);
      try {
        await fs.unlink(previewPidPath);
      } catch {
        // ignore
      }
    }
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
