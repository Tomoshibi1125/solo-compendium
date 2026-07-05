#!/usr/bin/env node
/**
 * Post-build gate: catches vendor-chunk circular-init crashes.
 *
 * Twice (Jul 3 markdown-vendor "Hr is not a function", Jul 4 editor-vendor
 * "Qe is not a function") a codeSplitting vendor group pinned a package but
 * not its full dependency subtree. The unmatched deps (often CJS) scattered
 * into the first app chunk that imported them; the vendor chunk then called
 * their `__toESM(require_*())` factories at module top-level through a
 * chunk cycle, before the app chunk had evaluated — crashing every consumer
 * route with "<minified> is not a function".
 *
 * Two layers, both against dist/ (run AFTER `npm run build`):
 *   1. Static back-edge scan — no *-vendor-* chunk may statically import a
 *      non-vendor chunk. A vendor→app edge is the precursor to this whole
 *      bug class regardless of whether today's evaluation order crashes.
 *   2. Runtime init probe — serve dist with `vite preview` and dynamically
 *      import EVERY assets/*.js chunk, each inside a fresh same-origin
 *      iframe (fresh module map), so each chunk is evaluated as the graph
 *      root — the worst-case order. Any module-init throw fails the gate.
 *
 * Usage: npm run verify:chunks
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const ASSETS = path.join(DIST, "assets");
const PORT = 4199;
const ORIGIN = `http://localhost:${PORT}`;
const PER_CHUNK_TIMEOUT_MS = 20_000;

// Chunks a vendor chunk may legitimately import: other vendor chunks and
// the bundler's own runtime helpers (rolldown runtime, vite preload helper).
// Everything else is app code — a back-edge.
const VENDOR_CHUNK = /-vendor-[\w-]+\.js$/;
const RUNTIME_CHUNK = /^(rolldown-runtime|preload-helper)-[\w-]+\.js$/;

// Static import/export-from specifiers only. `import(` (dynamic) is lazy and
// not an init hazard, so it is excluded via the negative lookahead.
const STATIC_IMPORT_RE =
	/(?<![.\w$])(?:import|export)(?!\s*\()[^"'()]*?["'](\.\/[^"']+\.js)["']/g;

function fail(msg) {
	console.error(`\n[verify-chunk-init] FAIL: ${msg}`);
	process.exitCode = 1;
}

function staticBackEdgeScan(files) {
	const violations = [];
	for (const file of files) {
		if (!VENDOR_CHUNK.test(file)) continue;
		const code = readFileSync(path.join(ASSETS, file), "utf8");
		for (const match of code.matchAll(STATIC_IMPORT_RE)) {
			const target = path.posix.basename(match[1]);
			if (VENDOR_CHUNK.test(target) || RUNTIME_CHUNK.test(target)) continue;
			violations.push({ file, target });
		}
	}
	return violations;
}

async function waitForServer(url, timeoutMs = 30_000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			// not up yet
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`vite preview did not become ready at ${url}`);
}

async function runtimeInitProbe(files) {
	const preview = spawn(
		process.execPath,
		[
			path.join(ROOT, "node_modules", "vite", "bin", "vite.js"),
			"preview",
			"--port",
			String(PORT),
			"--strictPort",
		],
		{ cwd: ROOT, stdio: "ignore" },
	);
	const failures = [];
	let browser;
	try {
		await waitForServer(`${ORIGIN}/runtime-env.js`);
		browser = await chromium.launch();
		const page = await browser.newPage();
		// Anchor on a non-HTML document so the app itself (and its service
		// worker) never boots; iframes below inherit this origin + base URL.
		await page.goto(`${ORIGIN}/runtime-env.js`, {
			waitUntil: "domcontentloaded",
		});
		for (const file of files) {
			const src = `/assets/${file}`;
			const error = await page.evaluate(
				async ({ src, timeoutMs }) => {
					const iframe = document.createElement("iframe");
					iframe.srcdoc =
						'<!doctype html><script src="/runtime-env.js"></scr' + "ipt>";
					document.body.appendChild(iframe);
					await new Promise((resolve) => {
						iframe.onload = resolve;
					});
					try {
						await Promise.race([
							iframe.contentWindow.eval(`import(${JSON.stringify(src)})`),
							new Promise((_, reject) =>
								setTimeout(
									() => reject(new Error("import timeout")),
									timeoutMs,
								),
							),
						]);
						return null;
					} catch (e) {
						return String(e?.message || e);
					} finally {
						iframe.remove();
					}
				},
				{ src, timeoutMs: PER_CHUNK_TIMEOUT_MS },
			);
			if (error) failures.push({ file, error });
		}
	} finally {
		await browser?.close();
		preview.kill();
	}
	return failures;
}

async function main() {
	if (!existsSync(ASSETS)) {
		fail("dist/assets not found — run `npm run build` first.");
		return;
	}
	const files = readdirSync(ASSETS)
		.filter((f) => f.endsWith(".js"))
		.sort();
	console.log(`[verify-chunk-init] scanning ${files.length} chunks`);

	const violations = staticBackEdgeScan(files);
	if (violations.length > 0) {
		for (const v of violations) {
			console.error(`  back-edge: ${v.file} -> ${v.target}`);
		}
		fail(
			`${violations.length} vendor→app static import(s). Pin the missing ` +
				"packages into the vendor group's regex in vite.config.ts " +
				"(the WHOLE dependency subtree, especially CJS deps).",
		);
	} else {
		console.log("[verify-chunk-init] static back-edge scan: OK");
	}

	const failures = await runtimeInitProbe(files);
	if (failures.length > 0) {
		for (const f of failures) {
			console.error(`  init crash: ${f.file}: ${f.error}`);
		}
		fail(`${failures.length} chunk(s) crashed at module init.`);
	} else {
		console.log(
			`[verify-chunk-init] runtime init probe: all ${files.length} chunks OK`,
		);
	}
}

main().catch((err) => {
	fail(err?.stack || String(err));
});
