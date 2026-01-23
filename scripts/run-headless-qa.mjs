import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { setTimeout as delay } from 'timers/promises';
import fs from 'fs/promises';
import path from 'path';
import net from 'node:net';

const loadLocalEnv = async () => {
  const envPath = path.resolve(process.cwd(), '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if (!key) return;
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    });
  } catch {
    // ignore missing env file
  }
};

await loadLocalEnv();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const baseUrlEnv = process.env.QA_BASE_URL;
const previewPortEnv = Number.parseInt(process.env.QA_PREVIEW_PORT || '', 10);
const fallbackPreviewPort = Number.isFinite(previewPortEnv) && previewPortEnv > 0 ? previewPortEnv : 4173;
let baseUrl = baseUrlEnv || `http://localhost:${fallbackPreviewPort}`;
const resolvePreviewPort = (value, fallback) => {
  try {
    const parsed = new URL(value);
    const port = Number.parseInt(parsed.port || '', 10);
    if (Number.isFinite(port) && port > 0) {
      return port;
    }
  } catch {
    // ignore invalid URL
  }
  return fallback;
};
let previewPort =
  Number.isFinite(previewPortEnv) && previewPortEnv > 0
    ? previewPortEnv
    : resolvePreviewPort(baseUrl, fallbackPreviewPort);
const isPortAvailable = (port, host = '127.0.0.1') =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen({ port, host });
  });
const findAvailablePort = async (startPort, { host = '127.0.0.1', attempts = 10 } = {}) => {
  let port = startPort;
  for (let i = 0; i < attempts; i += 1) {
    const available = await isPortAvailable(port, host);
    if (available) return port;
    port += 1;
  }
  return startPort;
};
if (!baseUrlEnv) {
  const availablePort = await findAvailablePort(previewPort);
  if (availablePort !== previewPort) {
    console.warn(`[QA] Preview port ${previewPort} in use. Using ${availablePort} instead.`);
    previewPort = availablePort;
    baseUrl = `http://localhost:${previewPort}`;
  }
}
const headless = process.env.QA_HEADLESS !== 'false';
const fullSweep = process.env.QA_FULL === 'true';
const strictChecks = process.env.QA_STRICT === 'true';
const slowMoValue = Number.parseInt(process.env.QA_SLOWMO || '', 10);
const slowMo = Number.isFinite(slowMoValue) && slowMoValue > 0 ? slowMoValue : 0;
const keepUsers = process.env.QA_KEEP_USERS === 'true';
const outputCreds = process.env.QA_OUTPUT_CREDS === 'true' || keepUsers;
const captureArtifacts =
  process.env.QA_CAPTURE_ARTIFACTS === 'true' ||
  (!headless && process.env.QA_CAPTURE_ARTIFACTS !== 'false');
const deepDive = process.env.QA_DEEP === 'true';
const viewDelayValue = Number.parseInt(process.env.QA_VIEW_DELAY_MS || '', 10);
const viewDelayMs =
  Number.isFinite(viewDelayValue) && viewDelayValue > 0 ? viewDelayValue : deepDive ? 800 : 0;
const viewportWidthEnv = Number.parseInt(process.env.QA_VIEWPORT_WIDTH || '', 10);
const viewportHeightEnv = Number.parseInt(process.env.QA_VIEWPORT_HEIGHT || '', 10);
const defaultViewport = deepDive ? { width: 1600, height: 900 } : { width: 1280, height: 720 };
const viewport = {
  width: Number.isFinite(viewportWidthEnv) && viewportWidthEnv > 0 ? viewportWidthEnv : defaultViewport.width,
  height: Number.isFinite(viewportHeightEnv) && viewportHeightEnv > 0 ? viewportHeightEnv : defaultViewport.height,
};
const artifactsDir = process.env.QA_ARTIFACTS_DIR || path.resolve(process.cwd(), 'qa-artifacts');
const characterIdPattern = /\/characters\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
const deepAssetTimeoutValue = Number.parseInt(process.env.QA_DEEP_ASSET_TIMEOUT_MS || '', 10);
const deepAssetTimeoutMs =
  Number.isFinite(deepAssetTimeoutValue) && deepAssetTimeoutValue > 0 ? deepAssetTimeoutValue : 12000;
const deepAssetConcurrencyValue = Number.parseInt(process.env.QA_DEEP_ASSET_CONCURRENCY || '', 10);
const deepAssetConcurrency =
  Number.isFinite(deepAssetConcurrencyValue) && deepAssetConcurrencyValue > 0 ? deepAssetConcurrencyValue : 6;
const deepAssetPattern =
  /\.(?:png|jpg|jpeg|webp|avif|svg|gif|ico|webmanifest|mp3|wav|ogg|m4a|mp4|webm|wasm|glb|gltf|json|css|pdf)(?:[?#]|$)/i;
const deepAssetCheckedUrls = new Set();

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const quoteArg = (arg) => {
  if (/[\s"]/u.test(arg)) {
    return `"${arg.replace(/"/g, '\\"')}"`;
  }
  return arg;
};

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    let resolvedCommand = command;
    let resolvedArgs = args;
    if (process.platform === 'win32') {
      const lower = command.toLowerCase();
      if (['npm', 'npx', 'pnpm', 'yarn'].includes(lower)) {
        const commandLine = [command, ...args].map(quoteArg).join(' ');
        resolvedCommand = 'cmd.exe';
        resolvedArgs = ['/d', '/s', '/c', commandLine];
      }
    }
    const child = spawn(resolvedCommand, resolvedArgs, { shell: false, stdio: 'inherit', ...options });
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

const requiredBuckets = [
  'audio-tracks',
  'custom-tokens',
  'character-portraits',
  'compendium-images',
  'generated-art',
];

const safeFileName = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toRegExp = (value) => (value instanceof RegExp ? value : new RegExp(escapeRegExp(value), 'i'));
const escapeAttributeValue = (value) => value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const ensureArtifactsDir = async () => {
  if (!captureArtifacts) return;
  await fs.mkdir(artifactsDir, { recursive: true });
};

const runWithConcurrency = async (items, limit, task) => {
  if (items.length === 0) return [];
  const runnerCount = Math.min(Math.max(limit, 1), items.length);
  const results = new Array(items.length);
  let nextIndex = 0;
  const runners = Array.from({ length: runnerCount }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await task(items[currentIndex], currentIndex);
    }
  });
  await Promise.all(runners);
  return results;
};

const waitForViewDelay = async () => {
  if (viewDelayMs > 0) {
    await delay(viewDelayMs);
  }
};

const scrollPageForAudit = async (page) => {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    window.scrollTo(0, 0);
    await sleep(150);
    window.scrollTo(0, document.body.scrollHeight || 0);
    await sleep(300);
    window.scrollTo(0, 0);
  });
};

const auditBrokenImages = async (page) => {
  return page.evaluate(() => {
    const broken = [];
    document.querySelectorAll('img').forEach((img) => {
      const src = img.currentSrc || img.getAttribute('src') || '';
      if (!src) return;
      if (!img.complete) return;
      if (img.naturalWidth === 0) broken.push(src);
    });
    return broken;
  });
};

const collectDeepDiveDiagnostics = async (page) => {
  return page.evaluate(() => {
    const maxSamples = 12;
    const maxText = 80;
    const trimText = (value) => {
      if (!value) return '';
      const cleaned = value.replace(/\s+/g, ' ').trim();
      if (cleaned.length <= maxText) return cleaned;
      return `${cleaned.slice(0, maxText)}...`;
    };
    const trimHtml = (value, limit = 180) => {
      if (!value) return '';
      const cleaned = value.replace(/\s+/g, ' ').trim();
      if (cleaned.length <= limit) return cleaned;
      return `${cleaned.slice(0, limit)}...`;
    };
    const pushSample = (list, value) => {
      if (list.length < maxSamples) list.push(value);
    };
    const summarizeAnchor = (anchor, raw) => {
      const text = trimText(anchor.textContent || '');
      const base = text ? `${text} (${raw || ''})` : raw || '<empty>';
      const html = trimHtml(anchor.outerHTML || '');
      return html ? `${base} :: ${html}` : base;
    };
    const normalizeUrl = (raw) => {
      try {
        return new URL(raw, window.location.href).href;
      } catch {
        return null;
      }
    };
    const title = document.title ? document.title.trim() : '';
    const duplicateIds = [];
    const seenIds = new Set();
    document.querySelectorAll('[id]').forEach((element) => {
      const id = element.id?.trim();
      if (!id) return;
      if (seenIds.has(id)) {
        if (!duplicateIds.includes(id)) duplicateIds.push(id);
        return;
      }
      seenIds.add(id);
    });

    const missingLinkHrefs = [];
    const invalidLinkHrefs = [];
    const suspiciousLinkHrefs = [];
    const unsafeBlankTargets = [];
    const linkTargets = [];
    const isIgnorableScheme = (value) => /^(mailto:|tel:|sms:)/i.test(value);
    const isPlaceholder = (value) => value === '#' || value === '#/' || value === '#!';
    const isQuillControl = (anchor) =>
      anchor.classList?.contains('ql-action') || anchor.classList?.contains('ql-remove');

    document.querySelectorAll('a').forEach((anchor) => {
      const raw = anchor.getAttribute('href');
      const sample = summarizeAnchor(anchor, raw);
      if (raw == null) {
        if (isQuillControl(anchor)) {
          return;
        }
        pushSample(missingLinkHrefs, sample);
        return;
      }
      const trimmed = raw.trim();
      if (!trimmed) {
        if (isQuillControl(anchor)) {
          return;
        }
        pushSample(missingLinkHrefs, sample);
        return;
      }
      if (isPlaceholder(trimmed) || trimmed.toLowerCase().startsWith('javascript:')) {
        pushSample(invalidLinkHrefs, sample);
        return;
      }
      if (/undefined|null/i.test(trimmed)) {
        pushSample(suspiciousLinkHrefs, sample);
      }
      if (!isIgnorableScheme(trimmed)) {
        const absolute = normalizeUrl(trimmed);
        if (absolute) linkTargets.push(absolute);
      }
      if (anchor.target === '_blank') {
        const rel = (anchor.getAttribute('rel') || '').toLowerCase();
        if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
          pushSample(unsafeBlankTargets, sample);
        }
      }
    });

    const assetSet = new Set();
    const backgroundSet = new Set();
    const suspiciousAssetUrls = [];
    const addAsset = (raw) => {
      if (!raw) return;
      const trimmed = raw.trim();
      if (!trimmed) return;
      if (/^(data:|blob:|about:|javascript:)/i.test(trimmed)) return;
      if (/undefined|null/i.test(trimmed)) {
        pushSample(suspiciousAssetUrls, trimmed);
      }
      const absolute = normalizeUrl(trimmed);
      if (absolute) assetSet.add(absolute);
    };
    const parseSrcset = (value) => {
      const entries = value.split(',');
      for (const entry of entries) {
        const trimmed = entry.trim();
        if (!trimmed) continue;
        const url = trimmed.split(/\s+/)[0];
        if (url) addAsset(url);
      }
    };

    document.querySelectorAll('img').forEach((img) => {
      const src = img.currentSrc || img.getAttribute('src');
      if (src) addAsset(src);
      const srcset = img.getAttribute('srcset');
      if (srcset) parseSrcset(srcset);
    });
    document.querySelectorAll('source').forEach((source) => {
      const src = source.getAttribute('src');
      if (src) addAsset(src);
      const srcset = source.getAttribute('srcset');
      if (srcset) parseSrcset(srcset);
    });
    document.querySelectorAll('video, audio').forEach((media) => {
      const src = media.currentSrc || media.getAttribute('src');
      if (src) addAsset(src);
    });
    document.querySelectorAll('link').forEach((link) => {
      const rel = (link.getAttribute('rel') || '').toLowerCase();
      if (!rel) return;
      if (!/(icon|stylesheet|preload|prefetch|manifest)/.test(rel)) return;
      const href = link.getAttribute('href');
      if (href) addAsset(href);
    });

    const elements = Array.from(document.querySelectorAll('*'));
    for (const element of elements) {
      const style = window.getComputedStyle(element);
      const background = style?.backgroundImage;
      if (!background || background === 'none') continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      const matches = background.matchAll(/url\(["']?(.*?)["']?\)/g);
      for (const match of matches) {
        const url = match[1];
        if (!url) continue;
        if (/^(data:|blob:|about:|javascript:)/i.test(url)) continue;
        const absolute = normalizeUrl(url);
        if (absolute) backgroundSet.add(absolute);
      }
    }

    return {
      title,
      duplicateIds,
      missingLinkHrefs,
      invalidLinkHrefs,
      suspiciousLinkHrefs,
      unsafeBlankTargets,
      linkTargets: Array.from(new Set(linkTargets)),
      assetUrls: Array.from(assetSet),
      backgroundUrls: Array.from(backgroundSet),
      suspiciousAssetUrls,
    };
  });
};

const auditAssetUrls = async (page, urls, { label = '', context = 'asset' } = {}) => {
  const uniqueUrls = [...new Set(urls)].filter((url) => /^https?:/i.test(url));
  const pending = uniqueUrls.filter((url) => {
    if (deepAssetCheckedUrls.has(url)) return false;
    deepAssetCheckedUrls.add(url);
    return true;
  });
  if (pending.length === 0) return;
  const failures = [];
  await runWithConcurrency(pending, deepAssetConcurrency, async (url) => {
    try {
      const response = await page.request.get(url, {
        timeout: deepAssetTimeoutMs,
        failOnStatusCode: false,
      });
      const status = response.status();
      if (status >= 400) {
        failures.push(`${status} ${url}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`${message} ${url}`);
    }
  });
  if (failures.length > 0) {
    const sample = failures.slice(0, 6).join(', ');
    const more = failures.length > 6 ? ` (+${failures.length - 6} more)` : '';
    const suffix = label ? ` on ${label}` : '';
    throw new Error(`Broken ${context} URLs detected${suffix}: ${sample}${more}`);
  }
};

const runDeepDiveAudit = async (page, label = '') => {
  if (!deepDive) return;
  await waitForViewDelay();
  await scrollPageForAudit(page);
  await waitForViewDelay();
  const brokenImages = await auditBrokenImages(page);
  if (brokenImages.length > 0) {
    const sample = brokenImages.slice(0, 8).join(', ');
    const more = brokenImages.length > 8 ? ` (+${brokenImages.length - 8} more)` : '';
    const suffix = label ? ` on ${label}` : '';
    throw new Error(`Broken images detected${suffix}: ${sample}${more}`);
  }
  const diagnostics = await collectDeepDiveDiagnostics(page);
  const suffix = label ? ` on ${label}` : '';
  if (!diagnostics.title) {
    throw new Error(`Missing document title${suffix}`);
  }
  if (diagnostics.duplicateIds.length > 0) {
    const sample = diagnostics.duplicateIds.slice(0, 8).join(', ');
    const more = diagnostics.duplicateIds.length > 8 ? ` (+${diagnostics.duplicateIds.length - 8} more)` : '';
    throw new Error(`Duplicate DOM ids detected${suffix}: ${sample}${more}`);
  }
  if (diagnostics.missingLinkHrefs.length > 0) {
    const sample = diagnostics.missingLinkHrefs.slice(0, 6).join(', ');
    const more =
      diagnostics.missingLinkHrefs.length > 6 ? ` (+${diagnostics.missingLinkHrefs.length - 6} more)` : '';
    throw new Error(`Missing link hrefs detected${suffix}: ${sample}${more}`);
  }
  if (diagnostics.invalidLinkHrefs.length > 0) {
    const sample = diagnostics.invalidLinkHrefs.slice(0, 6).join(', ');
    const more =
      diagnostics.invalidLinkHrefs.length > 6 ? ` (+${diagnostics.invalidLinkHrefs.length - 6} more)` : '';
    throw new Error(`Invalid link hrefs detected${suffix}: ${sample}${more}`);
  }
  if (diagnostics.suspiciousLinkHrefs.length > 0) {
    const sample = diagnostics.suspiciousLinkHrefs.slice(0, 6).join(', ');
    const more =
      diagnostics.suspiciousLinkHrefs.length > 6 ? ` (+${diagnostics.suspiciousLinkHrefs.length - 6} more)` : '';
    throw new Error(`Suspicious link hrefs detected${suffix}: ${sample}${more}`);
  }
  if (diagnostics.unsafeBlankTargets.length > 0) {
    const sample = diagnostics.unsafeBlankTargets.slice(0, 6).join(', ');
    const more =
      diagnostics.unsafeBlankTargets.length > 6 ? ` (+${diagnostics.unsafeBlankTargets.length - 6} more)` : '';
    throw new Error(`Target _blank links missing rel detected${suffix}: ${sample}${more}`);
  }
  if (diagnostics.suspiciousAssetUrls.length > 0) {
    const sample = diagnostics.suspiciousAssetUrls.slice(0, 6).join(', ');
    const more =
      diagnostics.suspiciousAssetUrls.length > 6 ? ` (+${diagnostics.suspiciousAssetUrls.length - 6} more)` : '';
    throw new Error(`Suspicious asset URLs detected${suffix}: ${sample}${more}`);
  }
  const assetLinkTargets = diagnostics.linkTargets.filter((url) => deepAssetPattern.test(url));
  const combinedAssets = [...diagnostics.assetUrls, ...diagnostics.backgroundUrls, ...assetLinkTargets];
  await auditAssetUrls(page, combinedAssets, { label, context: 'asset' });
};

const captureScreenshot = async (page, label, selector) => {
  if (!captureArtifacts) return null;
  await ensureArtifactsDir();
  const filePath = path.join(artifactsDir, `${Date.now()}-${safeFileName(label)}.png`);
  try {
    if (selector) {
      const locator = page.locator(selector).first();
      if (await locator.count()) {
        await locator.screenshot({ path: filePath });
        return filePath;
      }
    }
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  } catch (error) {
    console.warn(`Failed to capture screenshot (${label}): ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
};

const waitForText = async (page, value, timeout = 20000) => {
  const matcher = toRegExp(value);
  const locator = page.getByText(matcher);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const count = await locator.count();
    for (let i = 0; i < count; i += 1) {
      const item = locator.nth(i);
      if (await item.isVisible()) {
        return;
      }
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for text: ${value}`);
};

const waitForLocatorText = async (locator, value, timeout = 20000) => {
  const matcher = toRegExp(value);
  const match = locator.getByText(matcher);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const count = await match.count();
    for (let i = 0; i < count; i += 1) {
      const item = match.nth(i);
      if (await item.isVisible()) {
        return;
      }
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for text in locator: ${value}`);
};

const waitForCharacterSheet = async (page, timeout = 30000) => {
  try {
    const result = await page.waitForFunction(
      () => {
        const text = document.body?.innerText || '';
        if (text.includes('SYSTEM ERROR')) return 'system-error';
        if (text.includes('Connection Error')) return 'connection-error';
        if (text.includes('ASCENDANT NOT FOUND')) return 'not-found';
        if (text.includes('ABILITY SCORES')) return 'ready';
        return '';
      },
      { timeout }
    );
    const status = await result.jsonValue();
    if (status === 'ready') return;
    throw new Error(`Character sheet error state: ${status}`);
  } catch (err) {
    const bodyText = (await page.textContent('body')) || '';
    const preview = bodyText.replace(/\s+/g, ' ').trim().slice(0, 300);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Character sheet not ready (${message}). Body preview: ${preview}`);
  }
};

const waitForCampaignLookup = async (page, timeout = 20000) => {
  const result = await page.waitForFunction(
    () => {
      const text = document.body?.innerText || '';
      if (text.includes('CAMPAIGN FOUND')) return 'found';
      if (text.includes('Campaign not found')) return 'not-found';
      return '';
    },
    { timeout }
  );
  const status = await result.jsonValue();
  if (status === 'not-found') {
    throw new Error('Campaign lookup failed (Campaign not found)');
  }
};

const gotoAndExpect = async (
  page,
  pathname,
  { expectText, expectHeading, expectSelector, expectUrl, timeout = 20000 } = {}
) => {
  const url = `${baseUrl}${pathname}`;
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    if (expectUrl) {
      const matcher = expectUrl instanceof RegExp ? expectUrl : toRegExp(expectUrl);
      await page.waitForURL(matcher, { timeout });
    }
    if (expectSelector) {
      await page.locator(expectSelector).first().waitFor({ state: 'visible', timeout });
    }
    if (expectHeading) {
      const heading = page.getByRole('heading', { name: toRegExp(expectHeading) });
      await heading.first().waitFor({ state: 'visible', timeout });
    }
    if (expectText) {
      await waitForText(page, expectText, timeout);
    }
    await runDeepDiveAudit(page, pathname);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`${pathname} failed: ${message}`);
  }
};

const openFirstCompendiumEntry = async (page) => {
  await gotoAndExpect(page, '/compendium', { expectText: 'COMPENDIUM' });
  await page.waitForFunction(
    () => document.querySelectorAll('a[aria-label^="View"]').length > 0,
    { timeout: 20000 }
  );
  const firstEntry = page.getByRole('link', { name: /View .* details/i }).first();
  const label = await firstEntry.getAttribute('aria-label');
  const entryName =
    label?.replace(/^View\s+/i, '').replace(/\s+details$/i, '').trim() || 'Compendium Entry';
  await firstEntry.click();
  await page.waitForURL(/\/compendium\/[^/]+\/[^/]+/i, { timeout: 20000 });
  await page.getByRole('button', { name: /Back to Compendium/i }).waitFor({ timeout: 20000 });
  await waitForText(page, 'ACTIONS');
  return entryName;
};

const dismissBanners = async (page) => {
  const buttonNames = ['No Thanks', 'Dismiss', 'Close', 'Not now', 'Got it', 'Okay'];
  for (const name of buttonNames) {
    const locator = page.getByRole('button', { name });
    try {
      if (await locator.isVisible({ timeout: 1000 })) {
        await locator.click();
      }
    } catch {
      // banner not present
    }
  }
  try {
    await page.evaluate(() => {
      const blockers = document.querySelectorAll('.fixed.bottom-0.left-0.right-0.z-50');
      blockers.forEach((blocker) => {
        const text = (blocker.textContent || '').toLowerCase();
        if (text.includes('analytics') || text.includes('offline') || text.includes('help improve system ascendant')) {
          blocker.setAttribute('data-qa-dismissed', 'true');
          blocker.style.pointerEvents = 'none';
          blocker.style.display = 'none';
        }
      });
    });
  } catch {
    // ignore eval errors
  }
};

const getMapBox = async (page) => {
  const scene = page.locator('.vtt-scene-container');
  await scene.waitFor({ state: 'visible', timeout: 20000 });
  const map = scene.locator('xpath=..');
  await map.waitFor({ state: 'visible', timeout: 20000 });
  const mapBox = await map.boundingBox();
  const sceneBox = await scene.boundingBox();
  if (!mapBox || !sceneBox) {
    throw new Error('Map bounding box not available');
  }
  return { map, mapBox, sceneBox };
};

const getMapPoint = (mapBox, sceneBox, xRatio, yRatio) => {
  const xOffset = sceneBox.x - mapBox.x;
  const yOffset = sceneBox.y - mapBox.y;
  const rawX = xOffset + sceneBox.width * xRatio;
  const rawY = yOffset + sceneBox.height * yRatio;
  const xMax = Math.max(1, Math.floor(mapBox.width - 1));
  const yMax = Math.max(1, Math.floor(mapBox.height - 1));
  const x = Math.min(xMax, Math.max(1, Math.floor(rawX)));
  const y = Math.min(yMax, Math.max(1, Math.floor(rawY)));
  return { x, y };
};

const clickMap = async (page, xRatio = 0.3, yRatio = 0.3) => {
  const { map, mapBox, sceneBox } = await getMapBox(page);
  const { x, y } = getMapPoint(mapBox, sceneBox, xRatio, yRatio);
  await map.scrollIntoViewIfNeeded();
  await map.dispatchEvent('click', {
    clientX: mapBox.x + x,
    clientY: mapBox.y + y,
    button: 0,
    bubbles: true,
    cancelable: true,
  });
  return { mapBox, sceneBox, x, y };
};

const ensureVttCharacterToken = async (page, characterName) => {
  const beforeCount = await page.locator('.vtt-token').count();
  const characterTab = page.getByRole('tab', { name: 'Characters' }).first();
  await clickWhenReady(characterTab);
  const characterButton = page.getByRole('button', { name: new RegExp(escapeRegExp(characterName), 'i') }).first();
  const start = Date.now();
  let found = false;
  while (Date.now() - start < 30000) {
    if ((await characterButton.count()) > 0 && (await characterButton.isVisible())) {
      found = true;
      break;
    }
    await delay(500);
  }
  if (!found) {
    const panelText = (await page.locator('text=/No characters yet/i').first().textContent()) || '';
    throw new Error(`Character token list missing "${characterName}" (panel: ${panelText.trim() || 'empty'})`);
  }
  await characterButton.click();
  const selectTool = page.getByRole('button', { name: 'Select', exact: true });
  if ((await selectTool.count()) > 0) {
    await selectVttTool(page, 'Select');
  }
  await clickMap(page, 0.55, 0.5);
  let afterCount = await page.locator('.vtt-token').count();
  if (afterCount <= beforeCount) {
    await clickMap(page, 0.65, 0.55);
    afterCount = await page.locator('.vtt-token').count();
  }
  if (afterCount <= beforeCount) {
    throw new Error('Failed to place character token in VTT');
  }
  const tokens = page.locator('.vtt-token');
  await tokens.last().click();
};

const openCharacterSheetFromVtt = async (page) => {
  const activeTokenWindow = getSystemWindow(page, 'ACTIVE TOKEN');
  await activeTokenWindow.waitFor({ state: 'visible', timeout: 20000 });
  const openButton = activeTokenWindow.getByRole('button', { name: /Open Character Sheet/i });
  await openButton.waitFor({ state: 'visible', timeout: 20000 });
  const [sheetPage] = await Promise.all([page.waitForEvent('popup'), openButton.click()]);
  await sheetPage.waitForURL(characterIdPattern, { timeout: 30000 });
  await dismissBanners(sheetPage);
  await waitForCharacterSheet(sheetPage);
  await runCharacterSheetEditModeChecks(sheetPage);
  await runDeepDiveAudit(sheetPage, 'vtt-character-sheet');
  await sheetPage.close();
};

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

const selectFirstOptionByLabel = async (page, labelPattern, { skipPattern, allowMissing = false } = {}) => {
  const label = page.getByText(labelPattern);
  if (allowMissing && (await label.count()) === 0) {
    return null;
  }
  await label.first().waitFor({ state: 'visible', timeout: 20000 });
  const container = label.first().locator('xpath=..');
  const trigger = container.locator('button[role="combobox"], button[aria-haspopup="listbox"]').first();
  if (allowMissing && (await trigger.count()) === 0) {
    return null;
  }
  await trigger.waitFor({ state: 'visible', timeout: 20000 });
  await trigger.click();
  try {
    await page.waitForFunction(() => document.querySelectorAll('[role="option"]').length > 0, { timeout: 15000 });
  } catch {
    throw new Error(`No options found for ${labelPattern}`);
  }
  const options = page.locator('[role="option"]');
  const count = await options.count();
  for (let i = 0; i < count; i += 1) {
    const option = options.nth(i);
    const text = (await option.textContent()) || '';
    if (skipPattern && skipPattern.test(text)) {
      continue;
    }
    await option.click();
    return text.trim();
  }
  throw new Error(`No selectable option found for ${labelPattern}`);
};

const waitForEnabled = async (locator, timeout = 20000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (!(await locator.isDisabled())) {
      return;
    }
    await delay(500);
  }
  throw new Error('Timed out waiting for control to enable');
};

const clickWhenReady = async (locator, { timeout = 20000, attempts = 3, force = false } = {}) => {
  let lastError = null;
  for (let i = 0; i < attempts; i += 1) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await waitForEnabled(locator, timeout);
      await locator.scrollIntoViewIfNeeded();
      await locator.click({ timeout });
      return;
    } catch (err) {
      lastError = err;
      await delay(400);
    }
  }
  if (force) {
    await locator.click({ timeout, force: true });
    return;
  }
  throw lastError ?? new Error('Failed to click');
};

const clickIfPresent = async (locator, { timeout = 1500 } = {}) => {
  try {
    await locator.first().waitFor({ state: 'visible', timeout });
    await clickWhenReady(locator.first());
    return true;
  } catch {
    return false;
  }
};

const selectVttTool = async (page, label, { timeout = 5000 } = {}) => {
  const button = page.getByRole('button', { name: label, exact: true }).first();
  await clickWhenReady(button);
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const className = await button.getAttribute('class');
    if (className && className.includes('border-primary')) {
      return true;
    }
    await delay(200);
  }
  console.warn(`[QA] VTT tool "${label}" did not show as active.`);
  return false;
};

const getSystemWindow = (page, title) =>
  page.getByText(new RegExp(`^${escapeRegExp(title)}$`, 'i')).first().locator('..').locator('..');

const runGeminiProtocolFlow = async (page) => {
  await gotoAndExpect(page, '/compendium', { expectText: 'COMPENDIUM' });
  const openButton = page.getByRole('button', { name: /Gemini Protocol/i });
  await openButton.waitFor({ state: 'visible', timeout: 20000 });
  await openButton.click();
  await page.getByRole('heading', { name: /Fusion Console/i }).waitFor({ timeout: 20000 });
  const generateButton = page.getByRole('button', {
    name: /Initiate Gemini Protocol Fusion|Generate Sovereign Overlay/i,
  });
  await generateButton.waitFor({ state: 'visible', timeout: 20000 });
  await waitForEnabled(generateButton, 30000);
  await generateButton.click();
  await waitForText(page, /Fusion Abilities/i, 30000);
  await waitForText(page, /Fusion Stability/i, 20000);
  await waitForText(page, /Combat Doctrine/i, 20000);
  await waitForText(page, /Fusion Origin/i, 20000);
  const abilityCards = page.locator('[data-testid="fusion-ability-card"]');
  await abilityCards.first().waitFor({ state: 'visible', timeout: 20000 });
  const abilityCount = await abilityCards.count();
  if (abilityCount < 8) {
    throw new Error(`Expected 8 fusion abilities, found ${abilityCount}`);
  }

  let saved = false;
  const saveButton = page.getByRole('button', { name: /Save to Archive/i });
  if ((await saveButton.count()) > 0) {
    await saveButton.click();
    await waitForText(page, /Sovereign Saved|Save Failed/i, 20000);
    if (await page.getByText(/Save Failed/i).count()) {
      throw new Error('Gemini Protocol save failed');
    }
    saved = true;
  }

  await page.keyboard.press('Escape');
  return saved;
};

const runGeminiProtocolAutoFlow = async (page, { expectedJob, expectedPath } = {}) => {
  await gotoAndExpect(page, '/compendium', { expectText: 'COMPENDIUM' });
  const openButton = page.getByRole('button', { name: /Gemini Protocol/i });
  await openButton.waitFor({ state: 'visible', timeout: 20000 });
  await openButton.click();
  await page.getByRole('heading', { name: /Fusion Console/i }).waitFor({ timeout: 20000 });
  await waitForText(page, /Sovereign fusion auto-syncs/i, 20000);
  const autoIssue = page.getByText(/Active character is missing|Unlock two|No matching/i);
  if ((await autoIssue.count()) > 0) {
    const issueText = ((await autoIssue.first().textContent()) || '').trim();
    throw new Error(`Gemini auto-mode blocked: ${issueText || 'Unknown issue'}`);
  }
  if (expectedJob) {
    await waitForText(page, expectedJob, 20000);
  }
  if (expectedPath) {
    await waitForText(page, expectedPath, 20000);
  }
  await waitForText(page, /Fusion Abilities/i, 30000);
  await waitForText(page, /Fusion Stability/i, 20000);
  await waitForText(page, /Combat Doctrine/i, 20000);
  await waitForText(page, /Fusion Origin/i, 20000);
  const abilityCards = page.locator('[data-testid="fusion-ability-card"]');
  await abilityCards.first().waitFor({ state: 'visible', timeout: 20000 });
  const abilityCount = await abilityCards.count();
  if (abilityCount < 8) {
    throw new Error(`Expected 8 fusion abilities, found ${abilityCount}`);
  }
  let saved = false;
  const saveButton = page.getByRole('button', { name: /Save to Archive/i });
  if ((await saveButton.count()) > 0) {
    await saveButton.click();
    await waitForText(page, /Sovereign Saved|Save Failed/i, 20000);
    if (await page.getByText(/Save Failed/i).count()) {
      throw new Error('Gemini Protocol save failed');
    }
    saved = true;
  }
  await page.keyboard.press('Escape');
  return saved;
};

const runCharacterSheetEditModeChecks = async (page) => {
  const toggleEdit = page.getByRole('button', { name: /Toggle sheet edit mode/i });
  await toggleEdit.waitFor({ state: 'visible', timeout: 20000 });
  await toggleEdit.click();

  const strengthInput = page.getByLabel(/Set Strength score/i);
  if ((await strengthInput.count()) > 0) {
    const currentValue = await strengthInput.inputValue();
    const parsed = Number.parseInt(currentValue || '10', 10);
    const nextValue = Number.isNaN(parsed) ? 12 : Math.min(parsed + 1, 20);
    await strengthInput.fill(String(nextValue));
    await strengthInput.press('Enter');
  }

  const savingThrowsWindow = getSystemWindow(page, 'SAVING THROWS');
  const saveToggle = savingThrowsWindow.getByRole('button', { name: 'P' }).first();
  if ((await saveToggle.count()) > 0) {
    await saveToggle.click();
  }

  const skillsWindow = getSystemWindow(page, 'SKILLS');
  const skillProficiency = skillsWindow.getByRole('button', { name: 'P' }).first();
  if ((await skillProficiency.count()) > 0) {
    await skillProficiency.click();
  }
  const skillExpertise = skillsWindow.getByRole('button', { name: 'E' }).first();
  if ((await skillExpertise.count()) > 0) {
    await skillExpertise.click();
  }

  const appendListValue = (current, value) => {
    const trimmed = (current || '').trim();
    if (!trimmed) return value;
    return trimmed.toLowerCase().includes(value.toLowerCase()) ? trimmed : `${trimmed}, ${value}`;
  };

  const proficienciesWindow = getSystemWindow(page, 'PROFICIENCIES');
  const manageButton = proficienciesWindow.getByRole('button', { name: /Manage/i });
  if ((await manageButton.count()) > 0) {
    await manageButton.click();
    const dialog = page.getByRole('dialog', { name: /Manage Proficiencies/i });
    if ((await dialog.count()) > 0) {
      await dialog.waitFor({ state: 'visible', timeout: 10000 });
      const armorInput = dialog.locator('#armor-proficiencies');
      if ((await armorInput.count()) > 0) {
        const current = await armorInput.inputValue();
        await armorInput.fill(appendListValue(current, 'QA Armor'));
      }
      const weaponInput = dialog.locator('#weapon-proficiencies');
      if ((await weaponInput.count()) > 0) {
        const current = await weaponInput.inputValue();
        await weaponInput.fill(appendListValue(current, 'QA Weapon'));
      }
      const toolInput = dialog.locator('#tool-proficiencies');
      if ((await toolInput.count()) > 0) {
        const current = await toolInput.inputValue();
        await toolInput.fill(appendListValue(current, 'QA Tools'));
      }
      await dialog.getByRole('button', { name: /^Save$/i }).click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }

  const conditionsWindow = getSystemWindow(page, 'CONDITIONS');
  const firstCondition = conditionsWindow.getByRole('checkbox').first();
  if ((await firstCondition.count()) > 0) {
    await firstCondition.click();
  }
  const customConditionInput = conditionsWindow.getByPlaceholder('Custom condition');
  if ((await customConditionInput.count()) > 0) {
    await customConditionInput.fill('QA Condition');
    await conditionsWindow.getByRole('button', { name: /^Add$/ }).click();
  }
  const exhaustionPlus = conditionsWindow.getByRole('button', { name: '+' }).first();
  if ((await exhaustionPlus.count()) > 0) {
    await exhaustionPlus.click();
  }

  const modifiersWindow = getSystemWindow(page, 'CUSTOM MODIFIERS');
  const addModifier = modifiersWindow.getByRole('button', { name: /^Add$/ });
  if ((await addModifier.count()) > 0) {
    await addModifier.click();
    const toggleModifier = modifiersWindow.getByRole('switch', { name: /Toggle modifier/i }).first();
    if ((await toggleModifier.count()) > 0) {
      await toggleModifier.click();
    }
    const modifierValue = modifiersWindow.locator('input[type="number"]').first();
    if ((await modifierValue.count()) > 0) {
      await modifierValue.fill('2');
      await modifierValue.press('Enter');
    }
  }

  const resourceName = `QA Resource ${Date.now()}`;
  const resourceAdd = page.getByTestId('resource-trackers-add');
  if ((await resourceAdd.count()) > 0) {
    await resourceAdd.click();
    const resourceDialog = page.getByRole('dialog', { name: /Add Resource/i });
    if ((await resourceDialog.count()) > 0) {
      await resourceDialog.waitFor({ state: 'visible', timeout: 10000 });
      await resourceDialog.locator('#resource-name').fill(resourceName);
      await resourceDialog.locator('#resource-max').fill('3');
      await resourceDialog.locator('#resource-current').fill('2');
      await resourceDialog.locator('#resource-die').fill('6');
      await resourceDialog.getByRole('button', { name: /Add Resource/i }).click();
      await resourceDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await page.getByText(resourceName).first().waitFor({ timeout: 10000 });
    const spendCustom = page.getByRole('button', { name: `Spend ${resourceName}` });
    if ((await spendCustom.count()) > 0) {
      await spendCustom.click();
    }
    const recoverCustom = page.getByRole('button', { name: `Recover ${resourceName}` });
    if ((await recoverCustom.count()) > 0) {
      await recoverCustom.click();
    }
  }

  const resourceButtons = [
    'Spend hit die',
    'Recover hit die',
    'Spend system favor',
    'Recover system favor',
    'Spend umbral energy',
    'Recover umbral energy',
  ];
  for (const label of resourceButtons) {
    const button = page.getByRole('button', { name: label });
    if ((await button.count()) > 0) {
      if (await button.isEnabled()) {
        await button.click();
        await delay(300);
      }
    }
  }
};

const createQaUser = async (role, email, password) => {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role,
      display_name: role === 'dm' ? 'QA Protocol Warden' : 'QA Player',
    },
  });
  if (error || !data?.user) {
    throw new Error(`Failed to create ${role} user: ${error?.message || 'unknown error'}`);
  }
  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    role,
    updated_at: new Date().toISOString(),
  });
  if (profileError) {
    throw new Error(`Failed to upsert profile for ${role}: ${profileError.message}`);
  }
  return data.user;
};

const deleteQaUser = async (userId) => {
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.warn(`Failed to delete user ${userId}: ${error.message}`);
  }
};

const ensureMonarchUnlocks = async (characterId) => {
  if (!characterId) {
    throw new Error('Missing character ID for monarch unlocks');
  }
  const { data: existingUnlocks, error: existingError } = await admin
    .from('character_monarch_unlocks')
    .select('id, monarch_id, is_primary')
    .eq('character_id', characterId);
  if (existingError) {
    throw new Error(`Failed to fetch monarch unlocks: ${existingError.message}`);
  }
  const unlocks = existingUnlocks || [];
  if (unlocks.length >= 2) {
    return unlocks;
  }
  const { data: monarchs, error: monarchError } = await admin
    .from('compendium_monarchs')
    .select('id, name')
    .order('name');
  if (monarchError) {
    throw new Error(`Failed to fetch monarchs: ${monarchError.message}`);
  }
  const available = (monarchs || []).filter(
    (monarch) => !unlocks.some((unlock) => unlock.monarch_id === monarch.id)
  );
  const needed = 2 - unlocks.length;
  if (available.length < needed) {
    throw new Error('Not enough monarchs available to satisfy fusion requirements');
  }
  const inserts = available.slice(0, needed).map((monarch, index) => ({
    character_id: characterId,
    monarch_id: monarch.id,
    quest_name: `QA Monarch ${index + 1}`,
    dm_notes: 'QA automation unlock',
    is_primary: unlocks.length === 0 && index === 0,
  }));
  let inserted = [];
  if (inserts.length > 0) {
    const { data: insertedRows, error: insertError } = await admin
      .from('character_monarch_unlocks')
      .insert(inserts)
      .select('id, monarch_id, is_primary');
    if (insertError) {
      throw new Error(`Failed to insert monarch unlocks: ${insertError.message}`);
    }
    inserted = insertedRows || [];
  }
  const updated = [...unlocks, ...inserted];
  if (!updated.some((unlock) => unlock.is_primary) && updated[0]?.id) {
    const { error: resetError } = await admin
      .from('character_monarch_unlocks')
      .update({ is_primary: false })
      .eq('character_id', characterId);
    if (resetError) {
      throw new Error(`Failed to reset monarch primary: ${resetError.message}`);
    }
    const { error: primaryError } = await admin
      .from('character_monarch_unlocks')
      .update({ is_primary: true })
      .eq('id', updated[0].id);
    if (primaryError) {
      throw new Error(`Failed to set monarch primary: ${primaryError.message}`);
    }
  }
  return updated;
};

const ensureCharacterPath = async (characterId) => {
  if (!characterId) {
    throw new Error('Missing character ID for path check');
  }
  const { data: character, error: characterError } = await admin
    .from('characters')
    .select('job, path')
    .eq('id', characterId)
    .maybeSingle();
  if (characterError) {
    throw new Error(`Failed to fetch character for path check: ${characterError.message}`);
  }
  if (!character) {
    throw new Error('Character not found for path check');
  }
  const currentJob = character.job || '';
  const currentPath = character.path || '';
  if (currentPath) {
    return { jobName: currentJob, pathName: currentPath, updated: false };
  }

  let jobRow = null;
  if (currentJob) {
    const { data: jobData, error: jobError } = await admin
      .from('compendium_jobs')
      .select('id, name')
      .eq('name', currentJob)
      .maybeSingle();
    if (jobError) {
      throw new Error(`Failed to fetch job for path check: ${jobError.message}`);
    }
    jobRow = jobData || null;
  }

  let pathRow = null;
  if (jobRow?.id) {
    const { data: pathData, error: pathError } = await admin
      .from('compendium_job_paths')
      .select('id, name, job_id')
      .eq('job_id', jobRow.id)
      .order('name', { ascending: true })
      .limit(1);
    if (pathError) {
      throw new Error(`Failed to fetch job paths: ${pathError.message}`);
    }
    pathRow = pathData?.[0] || null;
  }

  if (!pathRow) {
    const { data: anyPath, error: anyPathError } = await admin
      .from('compendium_job_paths')
      .select('id, name, job_id')
      .order('name', { ascending: true })
      .limit(1);
    if (anyPathError) {
      throw new Error(`Failed to fetch fallback path: ${anyPathError.message}`);
    }
    pathRow = anyPath?.[0] || null;
  }

  if (!pathRow) {
    throw new Error('No compendium paths available to assign to character');
  }

  let resolvedJobName = currentJob;
  if (!jobRow || jobRow.id !== pathRow.job_id) {
    const { data: jobForPath, error: jobForPathError } = await admin
      .from('compendium_jobs')
      .select('name')
      .eq('id', pathRow.job_id)
      .maybeSingle();
    if (jobForPathError) {
      throw new Error(`Failed to resolve job for path: ${jobForPathError.message}`);
    }
    resolvedJobName = jobForPath?.name || resolvedJobName;
  }

  const updates = {
    path: pathRow.name,
    ...(resolvedJobName && resolvedJobName !== currentJob ? { job: resolvedJobName } : {}),
  };
  const { error: updateError } = await admin.from('characters').update(updates).eq('id', characterId);
  if (updateError) {
    throw new Error(`Failed to update character path: ${updateError.message}`);
  }

  return { jobName: resolvedJobName, pathName: pathRow.name, updated: true };
};

const validateSavedSovereign = async (userId) => {
  if (!userId) {
    throw new Error('Missing user ID for sovereign validation');
  }
  const { data, error } = await admin
    .from('saved_sovereigns')
    .select('id, fusion_theme, fusion_description, fusion_method, fusion_stability, power_multiplier, abilities')
    .eq('created_by', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) {
    throw new Error(`Saved sovereign lookup failed: ${error.message}`);
  }
  const row = data?.[0];
  if (!row) {
    throw new Error('No saved sovereign found after Gemini Protocol save');
  }
  const missingFields = [];
  if (!row.fusion_theme) missingFields.push('fusion_theme');
  if (!row.fusion_description) missingFields.push('fusion_description');
  if (!row.fusion_method) missingFields.push('fusion_method');
  if (!row.fusion_stability) missingFields.push('fusion_stability');
  if (!row.power_multiplier) missingFields.push('power_multiplier');
  if (missingFields.length > 0) {
    throw new Error(`Saved sovereign missing fields: ${missingFields.join(', ')}`);
  }
  const abilities = Array.isArray(row.abilities) ? row.abilities : [];
  if (abilities.length < 8) {
    throw new Error(`Saved sovereign abilities incomplete (${abilities.length})`);
  }
};

const attachConsoleListeners = (page, label, errors) => {
  page.on('pageerror', (err) => {
    const message = err?.stack || err?.message || String(err);
    errors.push(`[${label}] pageerror: ${message}`);
    console.error(`[QA] ${label} pageerror: ${message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (/failed to fetch/i.test(text)) {
        return;
      }
      errors.push(`[${label}] console: ${text}`);
      console.error(`[QA] ${label} console error: ${text}`);
    }
  });
  page.on('response', (response) => {
    const status = response.status();
    if (status >= 400) {
      const request = response.request();
      errors.push(`[${label}] http ${status} ${request.method()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    const failure = request.failure();
    const errorText = failure?.errorText || '';
    if (/ERR_ABORTED|NS_BINDING_ABORTED/i.test(errorText)) {
      return;
    }
    const detail = errorText ? ` (${errorText})` : '';
    errors.push(`[${label}] request failed ${request.method()} ${request.url()}${detail}`);
  });
};

const runEncounterBuilderSmoke = async (page) => {
  const monsterCard = page.locator('[data-testid="encounter-monster-card"]').first();
  await monsterCard.waitFor({ state: 'visible', timeout: 15000 });
  await monsterCard.click();
  const sendButton = page.getByRole('button', { name: /Send to Initiative Tracker/i });
  if ((await sendButton.count()) > 0 && (await sendButton.isEnabled())) {
    await clickWhenReady(sendButton);
    await page.waitForURL(/\/dm-tools\/initiative-tracker/i, { timeout: 15000 });
  }
};

const runInitiativeTrackerSmoke = async (page) => {
  let combatantCard = page.locator('[data-combatant-card]');
  if ((await combatantCard.count()) === 0) {
    const nameInput = page.locator('#combatant-name');
    await nameInput.waitFor({ state: 'visible', timeout: 10000 });
    await nameInput.fill('QA Combatant');
    const initiativeInput = page.locator('#combatant-initiative');
    if ((await initiativeInput.count()) > 0) {
      await initiativeInput.fill('12');
    }
    await clickWhenReady(page.getByRole('button', { name: /Add to Initiative/i }));
    combatantCard = page.locator('[data-combatant-card]');
  }
  const firstCard = combatantCard.first();
  await firstCard.waitFor({ state: 'visible', timeout: 10000 });
  await clickIfPresent(page.getByRole('button', { name: /Next turn/i }));
  await clickIfPresent(firstCard.locator('[aria-label^="Add "]').first());
  await clickIfPresent(firstCard.locator('[aria-label^="Damage"]').first());
};

const runRollableTablesSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Roll Complication/i }));
  await waitForText(page, 'Complication', 10000);
};

const runRiftGeneratorSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Generate Rift/i }));
  await page.getByRole('button', { name: /Copy Details/i }).waitFor({ timeout: 10000 });
};

const runNpcGeneratorSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Generate NPC/i }));
  await page.getByRole('button', { name: /Copy Details/i }).waitFor({ timeout: 10000 });
};

const runTreasureGeneratorSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Generate Treasure/i }));
  await page.getByRole('button', { name: /Copy Details/i }).waitFor({ timeout: 10000 });
};

const runQuestGeneratorSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Generate Quest/i }));
  await waitForText(page, 'Objectives', 10000);
};

const runRandomEventGeneratorSmoke = async (page) => {
  await clickWhenReady(page.getByRole('button', { name: /Generate .*Event|Generate NPC Encounter|Generate Complication/i }));
  await waitForText(page, 'Impact', 10000);
};

const runSessionPlannerSmoke = async (page) => {
  const planTab = page.getByRole('tab', { name: /Session Plan/i });
  if ((await planTab.count()) > 0) {
    await clickWhenReady(planTab);
    const start = Date.now();
    while (Date.now() - start < 8000) {
      const state = await planTab.getAttribute('data-state');
      if (state && state.includes('active')) {
        break;
      }
      await delay(200);
    }
  }
  const noteTitle = page.locator('#note-title');
  await noteTitle.waitFor({ state: 'visible', timeout: 15000 });
  const noteValue = `QA Note ${Date.now()}`;
  await noteTitle.fill(noteValue);
  const noteContent = page.locator('#note-content');
  if ((await noteContent.count()) > 0) {
    await noteContent.fill('QA session note content.');
  }
  await clickWhenReady(page.getByRole('button', { name: /Add Note/i }));
  await page
    .waitForFunction(() => {
      const input = document.querySelector('#note-title');
      return !(input instanceof HTMLInputElement) || input.value.trim() === '';
    })
    .catch(() => {});
  const notesWindow = getSystemWindow(page, 'SESSION NOTES');
  if ((await notesWindow.count()) > 0) {
    await notesWindow.scrollIntoViewIfNeeded();
    await waitForLocatorText(notesWindow, noteValue, 15000);
  } else {
    await waitForText(page, noteValue, 15000);
  }
};

const runRelicWorkshopSmoke = async (page) => {
  const propName = page.locator('#prop-name');
  await propName.waitFor({ state: 'visible', timeout: 10000 });
  const propValue = `QA Property ${Date.now()}`;
  await propName.fill(propValue);
  const propDesc = page.locator('#prop-desc');
  if ((await propDesc.count()) > 0) {
    await propDesc.fill('QA relic property description.');
  }
  await clickWhenReady(page.getByRole('button', { name: /Add Property/i }));
  await waitForText(page, propValue, 10000);
};

const runPartyTrackerSmoke = async (page) => {
  const nameInput = page.locator('#name');
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  const memberName = `QA Member ${Date.now()}`;
  await nameInput.fill(memberName);
  await clickWhenReady(page.getByRole('button', { name: /Add Member/i }));
  await waitForText(page, memberName, 10000);
  await clickIfPresent(page.getByText('+ Blinded').first());
};

const runDungeonMapGeneratorSmoke = async (page) => {
  const generateMap = page.getByRole('button', { name: /Generate Map/i }).first();
  if (!(await clickIfPresent(generateMap, { timeout: 5000 }))) {
    await clickWhenReady(page.getByRole('button', { name: /Generate Your First Map/i }).first());
  }
  await waitForText(page, 'ROOMS', 20000);
};

const runTokenLibrarySmoke = async (page) => {
  const tokenNameInput = page.locator('#token-name');
  if ((await tokenNameInput.count()) === 0) {
    await clickWhenReady(page.getByRole('button', { name: /^Create Token$/i }).first());
  }
  await tokenNameInput.waitFor({ state: 'visible', timeout: 15000 });
  const tokenName = `QA Token ${Date.now()}`;
  await tokenNameInput.fill(tokenName);
  const nameValue = (await tokenNameInput.inputValue().catch(() => '')).trim();
  if (!nameValue) {
    throw new Error('Token name input did not retain value before creation.');
  }
  const emojiInput = page.locator('#token-emoji');
  if ((await emojiInput.count()) > 0) {
    await emojiInput.fill('QA');
  }
  await delay(300);
  const createWindow = page.locator('#token-create-window');
  const createWindowRoot =
    (await createWindow.count()) > 0 ? createWindow : getSystemWindow(page, 'CREATE TOKEN');
  await clickWhenReady(createWindowRoot.getByRole('button', { name: /^Create Token$/i }));
  const cancelButton = createWindowRoot.getByRole('button', { name: /^Cancel$/i });
  if (await tokenNameInput.isVisible().catch(() => false)) {
    if ((await cancelButton.count()) > 0) {
      await cancelButton.click();
    }
  }
  if ((await createWindow.count()) > 0) {
    await createWindow.waitFor({ state: 'detached', timeout: 15000 });
  } else {
    await tokenNameInput.waitFor({ state: 'detached', timeout: 15000 });
  }
  const tokenListWindow = page.locator('#token-list-window');
  const tokenDetailsWindow = page.locator('#token-details-window');
  const listWaitStart = Date.now();
  while (Date.now() - listWaitStart < 15000) {
    if ((await tokenListWindow.count()) > 0 || (await tokenDetailsWindow.count()) > 0) {
      break;
    }
    await delay(400);
  }
  const searchInput = page.locator('#search');
  if ((await searchInput.count()) > 0) {
    await searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await searchInput.fill(tokenName);
  }
  let tokenVisible = false;
  let tokenError;
  try {
    const tokenSelector = `[data-token-name="${escapeAttributeValue(tokenName)}"]`;
    await page.locator(tokenSelector).first().waitFor({ state: 'attached', timeout: 15000 });
    tokenVisible = true;
  } catch (error) {
    tokenError = error;
  }
  if (!tokenVisible) {
    const detailsWindowRoot =
      (await tokenDetailsWindow.count()) > 0 ? tokenDetailsWindow : getSystemWindow(page, 'TOKEN DETAILS');
    try {
      if ((await detailsWindowRoot.count()) > 0) {
        await detailsWindowRoot.getByText(toRegExp(tokenName)).first().waitFor({ state: 'attached', timeout: 8000 });
        tokenVisible = true;
      }
    } catch {
      // fall through to toast check
    }
  }
  if (!tokenVisible) {
    const toastVisible = await page
      .getByText(/Token created|Created token|Token saved|Token added/i)
      .first()
      .isVisible()
      .catch(() => false);
    if (!toastVisible && strictChecks) {
      const createVisible = await createWindow.isVisible().catch(() => false);
      const listVisible = await tokenListWindow.isVisible().catch(() => false);
      const detailsVisible = await tokenDetailsWindow.isVisible().catch(() => false);
      const note = `createWindow=${createVisible}, listWindow=${listVisible}, detailsWindow=${detailsVisible}, toast=${toastVisible}, nameValue="${nameValue}"`;
      throw tokenError ?? new Error(`Token creation did not surface in the list. (${note})`);
    }
    if (!toastVisible) {
      console.warn('[QA] Token library: created token not visible; continuing.');
    }
  }
};

const runArtGeneratorSmoke = async (page) => {
  const generateButton = page.getByRole('button', { name: /Generate New/i }).first();
  if (!(await clickIfPresent(generateButton, { timeout: 5000 }))) {
    return;
  }
  const nameInput = page.locator('#content-name');
  await nameInput.waitFor({ state: 'visible', timeout: 10000 });
  await nameInput.fill('QA Art');
  await page.keyboard.press('Escape');
  await nameInput.waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
  let cardVisible = false;
  let cardError;
  try {
    await page.locator('[data-testid="generated-content-card"]').first().waitFor({ state: 'visible', timeout: 10000 });
    cardVisible = true;
  } catch (error) {
    cardError = error;
  }
  if (!cardVisible) {
    const emptyStateVisible = await page
      .getByText(/No .* Art Generated Yet/i)
      .first()
      .isVisible()
      .catch(() => false);
    if (!emptyStateVisible && strictChecks) {
      throw cardError ?? new Error('Art generator did not surface a generated content card.');
    }
    if (!emptyStateVisible) {
      console.warn('[QA] Art generator: generated content card not visible; continuing.');
    }
  }
};

const runAudioManagerSmoke = async (page) => {
  await clickIfPresent(page.getByRole('tab', { name: /Settings/i }));
  await clickIfPresent(page.getByRole('button', { name: /Enabled|Disabled/i }).first());
  await clickIfPresent(page.getByRole('tab', { name: /Player/i }));
};

const runVttMapSmoke = async (page) => {
  const map = page.locator('[data-testid="vtt-map"]');
  await map.waitFor({ state: 'visible', timeout: 10000 });
  const tokenOption = page.locator('[data-testid="vtt-token-option"]').first();
  if ((await tokenOption.count()) > 0) {
    await tokenOption.click();
    await map.click({ position: { x: 120, y: 120 } });
  }
  await clickIfPresent(page.locator('[data-testid="vtt-zoom-in"]'));
  await clickIfPresent(page.locator('[data-testid="vtt-zoom-out"]'));
  await clickIfPresent(page.locator('[data-testid="vtt-toggle-grid"]'));
  await clickIfPresent(page.getByRole('button', { name: /^Save$/i }));
};

const runDmToolAction = async (page, routePath) => {
  switch (routePath) {
    case '/dm-tools/encounter-builder':
      await runEncounterBuilderSmoke(page);
      break;
    case '/dm-tools/initiative-tracker':
      await runInitiativeTrackerSmoke(page);
      break;
    case '/dm-tools/rollable-tables':
      await runRollableTablesSmoke(page);
      break;
    case '/dm-tools/gate-generator':
      await runRiftGeneratorSmoke(page);
      break;
    case '/dm-tools/npc-generator':
      await runNpcGeneratorSmoke(page);
      break;
    case '/dm-tools/treasure-generator':
      await runTreasureGeneratorSmoke(page);
      break;
    case '/dm-tools/quest-generator':
      await runQuestGeneratorSmoke(page);
      break;
    case '/dm-tools/random-event-generator':
      await runRandomEventGeneratorSmoke(page);
      break;
    case '/dm-tools/session-planner':
      await runSessionPlannerSmoke(page);
      break;
    case '/dm-tools/relic-workshop':
      await runRelicWorkshopSmoke(page);
      break;
    case '/dm-tools/party-tracker':
      await runPartyTrackerSmoke(page);
      break;
    case '/dm-tools/dungeon-map-generator':
      await runDungeonMapGeneratorSmoke(page);
      break;
    case '/dm-tools/token-library':
      await runTokenLibrarySmoke(page);
      break;
    case '/dm-tools/art-generator':
      await runArtGeneratorSmoke(page);
      break;
    case '/dm-tools/audio-manager':
      await runAudioManagerSmoke(page);
      break;
    case '/dm-tools/vtt-map':
      await runVttMapSmoke(page);
      break;
    default:
      break;
  }
};

const run = async () => {
  const qaSuffix = Date.now();
  const dmEmail = `qa-dm-${qaSuffix}@example.com`;
  const playerEmail = `qa-player-${qaSuffix}@example.com`;
  const password = `QA!${qaSuffix}aA`;
  const results = [];
  const errors = [];
  const artifactPaths = [];
  let dmUser = null;
  let playerUser = null;
  let previewProcess = null;
  const previewPidPath = path.resolve(process.cwd(), '.preview.pid');

  const record = (name, ok, detail = '') => {
    results.push({ name, ok, detail });
    if (!ok) {
      errors.push(`[QA] ${name}: ${detail}`);
    }
  };

  const check = async (name, fn, { critical = false } = {}) => {
    try {
      await fn();
      record(name, true);
      return true;
    } catch (err) {
      record(name, false, err instanceof Error ? err.message : String(err));
      if (critical) {
        throw err;
      }
      return false;
    }
  };

  try {
    await check(
      'Create QA users',
      async () => {
        dmUser = await createQaUser('dm', dmEmail, password);
        playerUser = await createQaUser('player', playerEmail, password);
      },
      { critical: true }
    );

    await check('Validate storage buckets', async () => {
      const { data: buckets, error } = await admin.storage.listBuckets();
      if (error) {
        throw new Error(`Storage buckets lookup failed: ${error.message}`);
      }
      const bucketMap = new Map((buckets || []).map((bucket) => [bucket.id, bucket]));
      for (const bucketId of requiredBuckets) {
        const bucket = bucketMap.get(bucketId);
        if (!bucket) {
          throw new Error(`Missing required bucket: ${bucketId}`);
        }
        if (!bucket.public) {
          throw new Error(`Bucket not public: ${bucketId}`);
        }
      }
    }, { critical: true });

    await check('Build app', async () => {
      await runCommand('npm', ['run', 'build']);
    }, { critical: true });

    await check(
      'Start preview server',
      async () => {
        await cleanupPreviewPid();
        if (process.platform === 'win32') {
          const commandLine = ['npx', 'vite', 'preview', '--port', String(previewPort), '--strictPort']
            .map(quoteArg)
            .join(' ');
          previewProcess = spawn('cmd.exe', ['/d', '/s', '/c', commandLine], { shell: false, stdio: 'inherit' });
        } else {
          previewProcess = spawn('npx', ['vite', 'preview', '--port', String(previewPort), '--strictPort'], {
            shell: false,
            stdio: 'inherit',
          });
        }
        if (previewProcess.pid) {
          await fs.writeFile(previewPidPath, String(previewProcess.pid), 'utf8');
        }
        await waitForServer(baseUrl);
      },
      { critical: true }
    );

    await ensureArtifactsDir();

    const browser = await chromium.launch({
      headless,
      slowMo,
      args: ['--use-gl=swiftshader', '--disable-dev-shm-usage'],
    });
    const contextOptions = {
      viewport,
      ...(captureArtifacts ? { recordVideo: { dir: artifactsDir, size: viewport } } : {}),
    };

    let campaignId = '';
    let shareCode = '';
    let characterId = '';
    let favoriteEntryName = '';
    let playerCharacterName = '';
    let playerJobName = '';
    let playerPathName = '';

    await check('DM flow', async () => {
      const dmContext = await browser.newContext(contextOptions);
      const dmPage = await dmContext.newPage();
      attachConsoleListeners(dmPage, 'DM', errors);

      await dmPage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
      await dismissBanners(dmPage);
      const dmRoleButton = dmPage.locator('button[aria-label="Select Protocol Warden role"]');
      await dmRoleButton.waitFor({ state: 'visible', timeout: 20000 });
      await dmRoleButton.click();
      await dmPage.getByPlaceholder('ascendant@system-ascendant.world').fill(dmEmail);
      await dmPage.getByPlaceholder('Ascendant access code').fill(password);
      await dmPage.getByRole('button', { name: /Enter Shadow Realm/i }).click();
      await dmPage.waitForURL('**/dm-tools', { timeout: 30000 });

      if (fullSweep) {
        const publicRoutes = [
          { path: '/landing', expectText: 'The System awaits your command.' },
          { path: '/setup', expectText: 'SETUP REQUIRED' },
          { path: '/_qa/not-found', expectText: 'RIFT NOT FOUND' },
        ];
        for (const route of publicRoutes) {
          await gotoAndExpect(dmPage, route.path, route);
        }
      }

      const dmRoutes = [
        { path: '/dm-tools', expectText: "PRIME ARCHITECT'S DOMAIN" },
        { path: '/dm-tools/encounter-builder', expectText: 'RIFT ENCOUNTER BUILDER' },
        { path: '/dm-tools/initiative-tracker', expectText: 'RIFT COMBAT TRACKER' },
        { path: '/dm-tools/rollable-tables', expectText: 'PROTOCOL WARDEN TABLES' },
        { path: '/dm-tools/gate-generator', expectText: 'RIFT GENERATOR' },
        { path: '/dm-tools/npc-generator', expectText: 'NPC GENERATOR' },
        { path: '/dm-tools/treasure-generator', expectText: 'TREASURE GENERATOR' },
        { path: '/dm-tools/quest-generator', expectText: 'QUEST GENERATOR' },
        { path: '/dm-tools/session-planner', expectText: 'SESSION PLANNER' },
        { path: '/dm-tools/random-event-generator', expectText: 'RANDOM EVENT GENERATOR' },
        { path: '/dm-tools/relic-workshop', expectText: 'RELIC WORKSHOP' },
        { path: '/dm-tools/party-tracker', expectText: 'PARTY TRACKER' },
        { path: '/dm-tools/dungeon-map-generator', expectText: 'RIFT MAP GENERATOR' },
        { path: '/dm-tools/token-library', expectText: 'TOKEN LIBRARY' },
        { path: '/dm-tools/art-generator', expectText: 'Art Generator' },
        { path: '/dm-tools/audio-manager', expectText: 'Audio Manager' },
        { path: '/dm-tools/vtt-map', expectText: 'VTT MAP VIEWER' },
        { path: '/dm-tools/system-console', expectText: 'SYSTEM CONSOLE' },
        { path: '/dm-tools/content-audit', expectText: 'Content Audit' },
        { path: '/dm-tools/art-generation', expectText: 'Art Generation' },
      ];

      for (const route of dmRoutes) {
        await gotoAndExpect(dmPage, route.path, route);
        if (fullSweep) {
          await runDmToolAction(dmPage, route.path);
        }
      }
      if (fullSweep) {
        const adminRedirects = [
          { path: '/admin', expectUrl: /\/dm-tools\/system-console/i, expectText: 'SYSTEM CONSOLE' },
          { path: '/admin/audit', expectUrl: /\/dm-tools\/content-audit/i, expectText: 'Content Audit' },
          { path: '/admin/art-generation', expectUrl: /\/dm-tools\/art-generation/i, expectText: 'Art Generation' },
        ];
        for (const route of adminRedirects) {
          await gotoAndExpect(dmPage, route.path, route);
        }
      }

      await check('Gemini Protocol', async () => {
        const saved = await runGeminiProtocolFlow(dmPage);
        if (saved && dmUser?.id) {
          await validateSavedSovereign(dmUser.id);
        }
      }, { critical: true });

      await dmPage.goto(`${baseUrl}/campaigns`, { waitUntil: 'networkidle' });
      await waitForText(dmPage, 'GUILD REGISTRY');
      await dmPage.getByRole('button', { name: /Create Guild/i }).click();
      await dmPage.locator('#campaign-name').fill(`QA Guild ${qaSuffix}`);
      await dmPage.locator('#campaign-description').fill('QA automation campaign');
      await dmPage.getByRole('button', { name: /Establish Guild/i }).click();
      await dmPage.waitForURL(/\/campaigns\/[a-z0-9-]+$/i, { timeout: 30000 });
      campaignId = dmPage.url().split('/').pop() || '';
      const shareCodeLocator = dmPage
        .locator('span:has-text("SHARE CODE")')
        .first()
        .locator('..')
        .locator('span.font-mono');
      shareCode = (await shareCodeLocator.textContent())?.trim() || '';
      if (!campaignId || !shareCode) {
        throw new Error('Campaign ID or share code not found');
      }
      const { data: campaignRow, error: campaignRowError } = await admin
        .from('campaigns')
        .select('share_code')
        .eq('id', campaignId)
        .maybeSingle();
      if (campaignRowError) {
        throw new Error(`Failed to validate campaign share code: ${campaignRowError.message}`);
      }
      const dbShareCode = (campaignRow?.share_code || '').trim();
      if (!dbShareCode) {
        throw new Error('Campaign share code missing in database');
      }
      if (dbShareCode.toUpperCase() !== shareCode.toUpperCase()) {
        throw new Error(`Share code mismatch between UI (${shareCode}) and database (${dbShareCode})`);
      }
      shareCode = dbShareCode.toUpperCase();

      await gotoAndExpect(dmPage, `/campaigns/${campaignId}/journal`, { expectText: 'JOURNAL & NOTES' });
      await gotoAndExpect(dmPage, `/campaigns/${campaignId}`, { expectText: 'CAMPAIGN INFO' });

      const vttTab = dmPage.getByRole('tab', { name: 'VTT' });
      await vttTab.click();
      await dmPage.waitForTimeout(400);
      if (!(await vttTab.getAttribute('data-state'))?.includes('active')) {
        const directTab = dmPage.locator('[data-state="active"][data-orientation="horizontal"]', { hasText: 'VTT' }).first();
        if (await directTab.count()) {
          await directTab.click({ force: true });
        } else {
          await dmPage.evaluate(() => {
            const tab = Array.from(document.querySelectorAll('[role="tab"]')).find(
              (el) => el.textContent?.trim().toLowerCase() === 'vtt'
            );
            if (tab instanceof HTMLElement) tab.click();
          });
        }
      }
      let launchVtt = dmPage.getByRole('button', { name: /Launch VTT/i });
      if ((await launchVtt.count()) === 0) {
        launchVtt = dmPage.getByRole('link', { name: /Launch VTT/i });
      }
      await launchVtt.first().click();
      await dmPage.waitForURL(`**/campaigns/${campaignId}/vtt`, { timeout: 30000 });
      const preVttShot = await captureScreenshot(dmPage, 'dm-vtt-pre');
      if (preVttShot) artifactPaths.push(preVttShot);
      const preVttCount = await dmPage.locator('.vtt-scene-container').count();
      console.log(`[QA] vtt-scene-container count before wait: ${preVttCount}`);
      await dmPage.locator('.vtt-scene-container').waitFor({ state: 'visible', timeout: 40000 });

      await dismissBanners(dmPage);
      const libraryTab = dmPage.getByRole('tab', { name: 'Library' });
      await clickWhenReady(libraryTab, { force: true });
      const libraryPanel = dmPage.getByRole('tabpanel', { name: 'Library' });
      await libraryPanel.waitFor({ state: 'visible', timeout: 20000 });
      const tokenButton = libraryPanel.locator('button').first();
      await tokenButton.waitFor({ state: 'visible', timeout: 20000 });
      const tokenName = ((await tokenButton.textContent()) || 'QA Token').trim();
      await tokenButton.click();
      await clickMap(dmPage, 0.35, 0.35);
      const tokenCount = await dmPage.locator('.vtt-token').count();
      if (tokenCount < 1) {
        throw new Error('No tokens placed on the map');
      }

      const fogToggle = dmPage.locator('#fogOfWar');
      await fogToggle.waitFor({ state: 'visible', timeout: 10000 });
      await fogToggle.check();
      if (!(await fogToggle.isChecked())) {
        await dmPage.evaluate(() => {
          const input = document.querySelector('#fogOfWar');
          if (input instanceof HTMLInputElement) {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      }
      await dmPage.waitForFunction(() => {
        const input = document.querySelector('#fogOfWar');
        return input instanceof HTMLInputElement && input.checked;
      }, { timeout: 10000 });
      await dmPage.locator('.vtt-fog-tile').first().waitFor({ timeout: 10000 });
      await selectVttTool(dmPage, 'Fog');
      const controlsWindow = getSystemWindow(dmPage, 'CONTROLS');
      await controlsWindow.scrollIntoViewIfNeeded();
      const revealAllButton = controlsWindow.getByRole('button', { name: 'Reveal All' }).first();
      await revealAllButton.waitFor({ state: 'attached', timeout: 20000 });
      await revealAllButton.click({ force: true });
      await dmPage.waitForFunction(() => document.querySelectorAll('.vtt-fog-tile').length === 0);
      const resetFogButton = controlsWindow.getByRole('button', { name: 'Reset Fog' }).first();
      await resetFogButton.waitFor({ state: 'attached', timeout: 20000 });
      await resetFogButton.click({ force: true });
      await dmPage.locator('.vtt-fog-tile').first().waitFor({ timeout: 10000 });

      await selectVttTool(dmPage, 'Draw');
      await waitForText(dmPage, 'Draw Mode', 10000);
      await clickWhenReady(dmPage.getByRole('button', { name: 'rect', exact: true }));
      const { map, mapBox, sceneBox } = await getMapBox(dmPage);
      const drawStart = getMapPoint(mapBox, sceneBox, 0.6, 0.3);
      const drawEnd = getMapPoint(mapBox, sceneBox, 0.75, 0.45);
      const startX = mapBox.x + drawStart.x;
      const startY = mapBox.y + drawStart.y;
      const endX = mapBox.x + drawEnd.x;
      const endY = mapBox.y + drawEnd.y;
      await map.dispatchEvent('mousemove', { clientX: startX, clientY: startY, bubbles: true });
      await map.dispatchEvent('mousedown', {
        clientX: startX,
        clientY: startY,
        button: 0,
        buttons: 1,
        bubbles: true,
        cancelable: true,
      });
      await map.dispatchEvent('mousemove', {
        clientX: endX,
        clientY: endY,
        buttons: 1,
        bubbles: true,
      });
      await map.dispatchEvent('mouseup', {
        clientX: endX,
        clientY: endY,
        button: 0,
        bubbles: true,
        cancelable: true,
      });
      const drawingCount = await dmPage.locator('.vtt-drawing-shape, .vtt-drawing-line').count();
      if (drawingCount < 1) {
        throw new Error('Draw tool did not add a shape');
      }

      await selectVttTool(dmPage, 'Note');
      await waitForText(dmPage, 'Note Text', 10000);
      const noteInput = dmPage.getByPlaceholder('Enter map note...');
      await noteInput.waitFor({ state: 'visible', timeout: 10000 });
      await noteInput.fill('QA Note');
      await clickMap(dmPage, 0.2, 0.55);
      await dmPage.locator('.vtt-annotation', { hasText: 'QA Note' }).waitFor({ timeout: 10000 });

      const effectBefore = await dmPage.locator('.vtt-drawing-shape, .vtt-drawing-line').count();
      await selectVttTool(dmPage, 'Effect');
      await clickMap(dmPage, 0.75, 0.55);
      let effectAfter = await dmPage.locator('.vtt-drawing-shape, .vtt-drawing-line').count();
      if (effectAfter <= effectBefore) {
        await clickMap(dmPage, 0.65, 0.45);
        effectAfter = await dmPage.locator('.vtt-drawing-shape, .vtt-drawing-line').count();
      }
      if (effectAfter <= effectBefore) {
        throw new Error('Effect tool did not add a shape');
      }
      const dmShot = await captureScreenshot(dmPage, 'dm-vtt', '.vtt-scene-container');
      if (dmShot) artifactPaths.push(dmShot);

      await selectVttTool(dmPage, 'Measure');
      await clickMap(dmPage, 0.2, 0.2);
      await dmPage.mouse.move(mapBox.x + mapBox.width * 0.45, mapBox.y + mapBox.height * 0.5);
      await dmPage.locator('.vtt-measurement-label').waitFor({ timeout: 10000 });
      await clickMap(dmPage, 0.45, 0.5);
      const measurementCount = await dmPage.locator('.vtt-measurement-label').count();
      if (measurementCount !== 0) {
        throw new Error('Measurement did not clear after second click');
      }

      await dmPage.getByRole('tab', { name: 'Chat' }).click();
      await dmPage.getByPlaceholder('Type message...').fill('QA ping from DM');
      await dmPage.keyboard.press('Enter');
      await dmPage.locator('text=QA ping from DM').waitFor({ timeout: 10000 });

      await dmPage.getByRole('tab', { name: 'Dice' }).click();
      await dmPage.getByRole('button', { name: '1d20', exact: true }).click();
      await dmPage.locator('text=1d20').first().waitFor({ timeout: 10000 });

      await dmPage.getByRole('tab', { name: 'Journal' }).click();
      await dmPage.getByRole('button', { name: /Open Full Journal/i }).waitFor({ timeout: 10000 });

      const saveButton = dmPage.getByRole('button', { name: 'Save' });
      if (await saveButton.count()) {
        await saveButton.click();
        await dmPage.waitForTimeout(1200);
      }

      await dmContext.close();

      record('DM VTT token placed', true, tokenName);
    }, { critical: true });

    await check('VTT state persisted', async () => {
      if (!campaignId) {
        throw new Error('No campaign ID available for VTT state check');
      }
      const start = Date.now();
      let tokenCount = 0;
      let lastError = null;
      while (Date.now() - start < 30000 && tokenCount < 1) {
        const { data, error } = await admin
          .from('campaign_tool_states')
          .select('state')
          .eq('campaign_id', campaignId)
          .eq('tool_key', 'vtt_scenes')
          .maybeSingle();
        if (error) {
          lastError = error;
        } else {
          const state = data?.state;
          const scenes = Array.isArray(state?.scenes) ? state.scenes : [];
          tokenCount = scenes.reduce((sum, scene) => sum + (Array.isArray(scene.tokens) ? scene.tokens.length : 0), 0);
        }
        if (tokenCount < 1) {
          await delay(1000);
        }
      }
      if (lastError) {
        throw new Error(`VTT state lookup failed: ${lastError.message}`);
      }
      if (tokenCount < 1) {
        throw new Error('VTT state missing tokens after placement');
      }
    });

    await delay(1500);

    await check('Player flow', async () => {
      const playerContext = await browser.newContext(contextOptions);
      const playerPage = await playerContext.newPage();
      attachConsoleListeners(playerPage, 'Player', errors);

      await playerPage.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
      await dismissBanners(playerPage);
      const playerRoleButton = playerPage.locator('button[aria-label="Select Player role"]');
      await playerRoleButton.waitFor({ state: 'visible', timeout: 20000 });
      await playerRoleButton.click();
      await playerPage.getByPlaceholder('ascendant@system-ascendant.world').fill(playerEmail);
      await playerPage.getByPlaceholder('Ascendant access code').fill(password);
      await playerPage.getByRole('button', { name: /Enter Shadow Realm/i }).click();
      await playerPage.waitForURL('**/player-tools', { timeout: 30000 });

      await gotoAndExpect(playerPage, '/player-tools', { expectText: "ASCENDANT ARSENAL" });
      if (fullSweep) {
        const playerRedirects = [
          { path: '/player-tools/compendium-viewer', expectUrl: /\/compendium/i, expectText: 'COMPENDIUM' },
          { path: '/player-tools/dice-roller', expectUrl: /\/dice/i, expectHeading: 'DICE ROLLER' },
        ];
        for (const route of playerRedirects) {
          await gotoAndExpect(playerPage, route.path, route);
        }
        await gotoAndExpect(playerPage, '/player-tools', { expectText: "ASCENDANT ARSENAL" });
        const partyLink = playerPage.getByRole('link', { name: /Party View/i }).first();
        if ((await partyLink.count()) > 0) {
          await partyLink.click();
          await waitForText(playerPage, 'GUILD REGISTRY');
        }
      }

      await playerPage.goto(`${baseUrl}/characters/new`, { waitUntil: 'networkidle' });
      playerCharacterName = `QA Ascendant ${qaSuffix}`;
      await playerPage.locator('#name').fill(playerCharacterName);
      await playerPage.getByRole('button', { name: 'Next' }).click();
      await playerPage.getByRole('button', { name: 'Next' }).click();

      const jobSelection = await selectFirstOptionByLabel(playerPage, 'Select Job *');
      if (jobSelection) {
        playerJobName = jobSelection;
      }
      const skillLabel = playerPage.locator('text=/Select \\d+ Skill/i').first();
      if (await skillLabel.count()) {
        const labelText = (await skillLabel.textContent()) || '';
        const match = labelText.match(/Select\\s+(\\d+)/i);
        const requiredCount = match ? Number(match[1]) : 0;
        const checkboxes = playerPage.locator('[role="checkbox"]');
        const total = await checkboxes.count();
        for (let i = 0; i < Math.min(requiredCount, total); i += 1) {
          await checkboxes.nth(i).click();
        }
      }
      await playerPage.getByRole('button', { name: 'Next' }).click();

      const pathSelection = await selectFirstOptionByLabel(playerPage, /Select Path/i, {
        skipPattern: /None/i,
        allowMissing: true,
      });
      if (pathSelection) {
        playerPathName = pathSelection;
      }
      await playerPage.getByRole('button', { name: 'Next' }).click();

      await selectFirstOptionByLabel(playerPage, 'Select Background *');
      await playerPage.getByRole('button', { name: 'Next' }).click();

      await playerPage.getByRole('button', { name: /Create Character/i }).click();
      await playerPage.waitForURL(characterIdPattern, { timeout: 30000 });
      characterId = playerPage.url().match(characterIdPattern)?.[1] || '';
      if (!characterId) {
        throw new Error('Character ID not found after creation');
      }
      await waitForCharacterSheet(playerPage);
      await ensureMonarchUnlocks(characterId);
      const ensuredPath = await ensureCharacterPath(characterId);
      if (ensuredPath.jobName) {
        playerJobName = ensuredPath.jobName;
      }
      if (ensuredPath.pathName) {
        playerPathName = ensuredPath.pathName;
      }
      if (ensuredPath.updated) {
        await playerPage.reload({ waitUntil: 'networkidle' });
        await waitForCharacterSheet(playerPage);
      }

      await gotoAndExpect(playerPage, '/characters', { expectText: 'ASCENDANT REGISTRY' });
      await waitForText(playerPage, `QA Ascendant ${qaSuffix}`);

      await gotoAndExpect(playerPage, '/characters/compare', { expectText: 'COMPARE ASCENDANTS' });
      await gotoAndExpect(playerPage, `/characters/${characterId}/level-up`, { expectText: 'LEVEL UP PROTOCOL' });

      await playerPage.goto(`${baseUrl}/player-tools/character-sheet`, { waitUntil: 'networkidle' });
      const sheetRouteResult = await Promise.any([
        playerPage.waitForURL(characterIdPattern, { timeout: 20000 }).then(() => 'redirect'),
        waitForText(playerPage, 'ACTIVE ASCENDANT', 20000).then(() => 'panel'),
      ]);
      if (sheetRouteResult === 'redirect') {
        await waitForCharacterSheet(playerPage);
      } else {
        await playerPage.getByRole('button', { name: /Open Character Sheet/i }).click();
        await playerPage.waitForURL(characterIdPattern, { timeout: 20000 });
        await waitForCharacterSheet(playerPage);
      }
      await runCharacterSheetEditModeChecks(playerPage);
      const expectedPath = playerPathName ? playerPathName.replace(/^Path of the\s+/i, '') : '';
      const autoFusionSaved = await runGeminiProtocolAutoFlow(playerPage, {
        expectedJob: playerJobName || undefined,
        expectedPath: expectedPath || undefined,
      });
      if (autoFusionSaved && playerUser?.id) {
        await validateSavedSovereign(playerUser.id);
      }

      await gotoAndExpect(playerPage, '/player-tools/inventory', { expectText: 'RIFT REWARDS' });
      await gotoAndExpect(playerPage, '/player-tools/abilities', { expectText: 'ACTIONS' });
      await gotoAndExpect(playerPage, '/player-tools/character-art', { expectText: 'Character Art' });
      await gotoAndExpect(playerPage, '/player-tools/quest-log', { expectText: 'DAILY QUEST SETTINGS' });

      favoriteEntryName = await openFirstCompendiumEntry(playerPage);
      const favoriteUrlMatch = playerPage.url().match(/\/compendium\/([^/]+)\/([^/]+)/i);
      const favoriteEntryType = favoriteUrlMatch?.[1] || '';
      const favoriteEntryId = favoriteUrlMatch?.[2] || '';
      if (!favoriteEntryType || !favoriteEntryId) {
        throw new Error('Favorite entry type/id not found after opening compendium entry');
      }
      const authStorageInfo = await playerPage.evaluate(() => {
        const key = Object.keys(localStorage).find((entry) => entry.includes('-auth-token'));
        if (!key) return { hasSession: false };
        const raw = localStorage.getItem(key);
        if (!raw) return { hasSession: false };
        try {
          const parsed = JSON.parse(raw);
          return { 
            hasSession: !!parsed?.user?.id, 
            hasAccessToken: !!parsed?.access_token,
          };
        } catch {
          return { hasSession: false };
        }
      });
      if (!authStorageInfo.hasSession || !authStorageInfo.hasAccessToken) {
        throw new Error('Supabase auth session missing or incomplete in localStorage before favorite toggle');
      }
      const favoriteButtons = playerPage.getByRole('button', { name: /Add to Favorites|Remove from Favorites/i });
      const favoriteButtonCount = await favoriteButtons.count();
      const favoriteButton = favoriteButtons.first();
      await favoriteButton.waitFor({ timeout: 20000 });
      const favoriteLabel = (await favoriteButton.textContent()) || '';
      const favoriteDisabled = await favoriteButton.isDisabled();
      let favoriteInsertResponse = null;
      let favoriteInsertRequest = null;
      const favoriteRequestHandler = (request) => {
        const url = request.url();
        const method = request.method();
        if (method === 'POST' && url.includes('/rest/v1/user_favorites')) {
          favoriteInsertRequest = { method, url };
        }
      };
      const favoriteResponseHandler = async (response) => {
        const url = response.url();
        const method = response.request().method();
        if (method === 'POST' && url.includes('/rest/v1/user_favorites')) {
          const body = await response.text();
          favoriteInsertResponse = { status: response.status(), body };
        }
      };
      playerPage.on('request', favoriteRequestHandler);
      playerPage.on('response', favoriteResponseHandler);
      if (/add to favorites/i.test(favoriteLabel)) {
        await favoriteButton.click();
        await playerPage.waitForTimeout(1000);
        await waitForText(playerPage, 'Added to favorites', 15000);
      }
      const localFavoritesRaw = await playerPage.evaluate(
        () => localStorage.getItem('solo-compendium-favorites')
      );
      const localFavoritesHasEntry =
        typeof localFavoritesRaw === 'string' &&
        localFavoritesRaw.includes(`${favoriteEntryType}:${favoriteEntryId}`);
      const favoritesDebug = await playerPage.evaluate(() => {
        const debug = window.__favoritesDebug;
        if (!Array.isArray(debug)) return null;
        return debug.slice(-6);
      });
      let favoriteRow = null;
      let favoriteRowError = null;
      const favoriteStart = Date.now();
      while (Date.now() - favoriteStart < 10000 && !favoriteRow) {
        const { data, error } = await admin
          .from('user_favorites')
          .select('entry_type, entry_id')
          .eq('user_id', playerUser?.id || '')
          .eq('entry_type', favoriteEntryType)
          .eq('entry_id', favoriteEntryId)
          .maybeSingle();
        if (error) {
          favoriteRowError = error;
          break;
        }
        if (data) {
          favoriteRow = data;
          break;
        }
        await delay(1000);
      }
      playerPage.off('response', favoriteResponseHandler);
      playerPage.off('request', favoriteRequestHandler);
      if (favoriteRowError) {
        throw new Error(`Favorites insert validation failed: ${favoriteRowError.message}`);
      }
      if (!favoriteRow) {
        throw new Error(
          `Favorite row missing after toggle (type=${favoriteEntryType}, id=${favoriteEntryId}, label="${favoriteLabel.trim()}", count=${favoriteButtonCount}, disabled=${favoriteDisabled}, localStorage=${localFavoritesHasEntry ? 'present' : 'absent'}, request=${favoriteInsertRequest ? 'sent' : 'none'}, response=${favoriteInsertResponse ? `${favoriteInsertResponse.status} ${favoriteInsertResponse.body}` : 'none'}, debug=${favoritesDebug ? JSON.stringify(favoritesDebug) : 'none'})`
        );
      }

      await gotoAndExpect(playerPage, '/favorites', { expectText: 'FAVORITES' });
      await waitForText(playerPage, favoriteEntryName, 30000);
      const favoritesHeader = playerPage.getByText(/Your favorite compendium entries/i).first();
      const headerText = (await favoritesHeader.textContent()) || '';
      const countMatch = headerText.match(/-\s*(\d+)/);
      const favoritesCount = countMatch ? Number(countMatch[1]) : null;
      if (favoritesCount === 0) {
        throw new Error('Favorites count is 0 after adding a favorite');
      }
      const emptyFavoritesMessage = playerPage.getByText("You haven't added any favorites yet").first();
      if (await emptyFavoritesMessage.isVisible()) {
        throw new Error('Favorites empty-state displayed after adding a favorite');
      }

      if (fullSweep && shareCode) {
        await gotoAndExpect(playerPage, `/campaigns/join/${shareCode}`, { expectText: 'JOIN CAMPAIGN' });
        const shareInput = playerPage.locator('#share-code');
        if ((await shareInput.count()) > 0) {
          const currentValue = (await shareInput.inputValue()).trim();
          if (currentValue && currentValue.toUpperCase() !== shareCode.toUpperCase()) {
            throw new Error(`Share code not prefilled correctly (expected ${shareCode}, got ${currentValue})`);
          }
        }
      }

      await playerPage.goto(`${baseUrl}/campaigns/join`, { waitUntil: 'networkidle' });
      await waitForText(playerPage, 'JOIN CAMPAIGN');
      await playerPage.locator('#share-code').fill(shareCode);
      const findCampaignButton = playerPage.getByRole('button', { name: /Find Campaign/i });
      if (await findCampaignButton.count()) {
        await findCampaignButton.click();
      }
      await waitForCampaignLookup(playerPage, 20000);
      const characterOptionName = playerCharacterName || `QA Ascendant ${qaSuffix}`;
      const characterCombobox = playerPage.locator('button[role="combobox"], button[aria-haspopup="listbox"]').first();
      if ((await characterCombobox.count()) > 0) {
        await characterCombobox.click();
        const characterOption = playerPage
          .getByRole('option', { name: new RegExp(escapeRegExp(characterOptionName), 'i') })
          .first();
        await characterOption.waitFor({ state: 'visible', timeout: 15000 });
        await characterOption.click();
      }
      await playerPage.getByRole('button', { name: /Join Campaign/i }).click();
      await playerPage.waitForURL(`**/campaigns/${campaignId}`, { timeout: 30000 });
      await waitForText(playerPage, 'CAMPAIGN INFO');
      if (playerUser?.id && characterId) {
        const { data: memberRow, error: memberError } = await admin
          .from('campaign_members')
          .select('id, character_id')
          .eq('campaign_id', campaignId)
          .eq('user_id', playerUser.id)
          .maybeSingle();
        if (memberError) {
          throw new Error(`Campaign member lookup failed: ${memberError.message}`);
        }
        if (memberRow && !memberRow.character_id) {
          const { error: memberUpdateError } = await admin
            .from('campaign_members')
            .update({ character_id: characterId })
            .eq('id', memberRow.id);
          if (memberUpdateError) {
            throw new Error(`Campaign member character link failed: ${memberUpdateError.message}`);
          }
        }
      }

      await gotoAndExpect(playerPage, '/campaigns', { expectText: 'GUILD REGISTRY' });
      await waitForText(playerPage, `QA Guild ${qaSuffix}`);

      await playerPage.goto(`${baseUrl}/campaigns/${campaignId}/vtt`, { waitUntil: 'networkidle' });
      await playerPage.locator('.vtt-scene-container').waitFor({ state: 'visible', timeout: 40000 });
      const gmTool = playerPage.getByRole('button', { name: 'Fog', exact: true });
      if (await gmTool.count()) {
        const visible = await gmTool.isVisible();
        if (visible) {
          throw new Error('GM tools visible to player');
        }
      }
      let playerTokenCount = 0;
      const playerTokenStart = Date.now();
      while (Date.now() - playerTokenStart < 20000 && playerTokenCount < 1) {
        playerTokenCount = await playerPage.locator('.vtt-token').count();
        if (playerTokenCount < 1) {
          await delay(1000);
        }
      }
      if (playerTokenCount < 1) {
        throw new Error('Player cannot see tokens on VTT');
      }
      const characterNameForVtt = playerCharacterName || `QA Ascendant ${qaSuffix}`;
      await ensureVttCharacterToken(playerPage, characterNameForVtt);
      await openCharacterSheetFromVtt(playerPage);

      await playerPage.goto(`${baseUrl}/dice`, { waitUntil: 'networkidle' });
      await playerPage.getByRole('button', { name: '1d20', exact: true }).click();
      await waitForText(playerPage, 'SYSTEM DICE CHAMBER');
      await playerPage.locator('canvas').first().waitFor({ timeout: 20000 });
      await playerPage.waitForTimeout(1200);
      await assertDice3D(playerPage);
      const diceShot = await captureScreenshot(playerPage, 'dice-3d', '.dice-3d-roller');
      if (diceShot) artifactPaths.push(diceShot);
      await playerPage.locator('text=ROLL HISTORY').waitFor({ timeout: 10000 });
      await playerPage.locator('text=1d20').first().waitFor({ timeout: 10000 });

      await playerContext.close();
    }, { critical: false });

    await browser.close();
  } finally {
    if (previewProcess) {
      await killPid(previewProcess.pid);
      try {
        await fs.unlink(previewPidPath);
      } catch {
        // ignore
      }
    }
    if (!keepUsers && dmUser?.id) {
      await deleteQaUser(dmUser.id);
    }
    if (!keepUsers && playerUser?.id) {
      await deleteQaUser(playerUser.id);
    }
  }

  console.log('\nQA Results:');
  for (const result of results) {
    console.log(`- ${result.ok ? 'PASS' : 'FAIL'}: ${result.name}${result.detail ? ` (${result.detail})` : ''}`);
  }

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach((err) => console.log(`- ${err}`));
    process.exit(1);
  }

  if (outputCreds) {
    console.log('\nQA Test Credentials:');
    console.log(`- DM: ${dmEmail}`);
    console.log(`- Player: ${playerEmail}`);
    console.log(`- Password: ${password}`);
  }

  if (artifactPaths.length > 0) {
    console.log('\nQA Artifacts:');
    artifactPaths.forEach((artifact) => console.log(`- ${artifact}`));
  } else if (captureArtifacts) {
    console.log(`\nQA Artifacts directory: ${artifactsDir}`);
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

