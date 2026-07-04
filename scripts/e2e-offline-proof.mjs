// Offline PWA proof: load the prod build, let the service worker precache,
// then go offline and verify (1) the app shell renders, (2) runtime-cached
// ui-art serves from cache, (3) the compendium — never visited online in
// this session — browses fully offline via the precached data chunks.
import { chromium } from "playwright";

const BASE = process.env.PREVIEW_URL || "http://localhost:4173";
const ART = "/ui-art/ra-logo-mark.avif";

const run = async () => {
	const browser = await chromium.launch();
	const context = await browser.newContext();
	const page = await context.newPage();

	// 1. Online first load — SW registers and precaches; reload so it controls.
	await page.goto(`${BASE}/landing`, { waitUntil: "load" });
	await page.evaluate(() => navigator.serviceWorker.ready);
	await page.reload({ waitUntil: "load" });

	await page.waitForFunction(
		async () => {
			const keys = await caches.keys();
			const precacheKey = keys.find((k) => k.includes("precache"));
			if (!precacheKey) return false;
			const cache = await caches.open(precacheKey);
			return (await cache.keys()).length > 100;
		},
		null,
		{ timeout: 90_000 },
	);
	const precacheCount = await page.evaluate(async () => {
		const keys = await caches.keys();
		const precacheKey = keys.find((k) => k.includes("precache"));
		const cache = await caches.open(precacheKey);
		return (await cache.keys()).length;
	});
	console.log("precache populated:", precacheCount, "entries");

	// Warm the ui-art runtime cache with an explicit online fetch.
	const warmed = await page.evaluate(
		(url) => fetch(url).then((r) => r.ok),
		ART,
	);
	console.log("ui-art warmed online:", warmed);
	await page.waitForTimeout(1_500);

	// 2. Offline: reload the shell.
	await context.setOffline(true);
	await page.reload({ waitUntil: "domcontentloaded" });
	await page.waitForTimeout(2_500);

	const shell = await page.evaluate(async (url) => {
		const artOk = await fetch(url)
			.then((r) => r.ok)
			.catch(() => false);
		return {
			hasRoot: !!document.getElementById("root")?.children.length,
			fatal: document.body.innerText.includes("FATAL ANOMALY"),
			artFromCache: artOk,
		};
	}, ART);
	console.log("OFFLINE shell:", JSON.stringify(shell));

	// 3. Offline compendium browse (never visited online this session).
	const failedRequests = [];
	const pageErrors = [];
	page.on("requestfailed", (req) =>
		failedRequests.push(
			`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`,
		),
	);
	page.on("pageerror", (err) => pageErrors.push(err.message));
	page.on("console", (msg) => {
		if (msg.type() === "error") pageErrors.push(`[console] ${msg.text()}`);
	});
	await page.goto(`${BASE}/compendium`, { waitUntil: "domcontentloaded" });
	await page.waitForTimeout(6_000);
	console.log(
		"failed requests:",
		JSON.stringify(failedRequests.slice(0, 12), null, 1),
	);
	console.log("page errors:", JSON.stringify(pageErrors.slice(0, 6), null, 1));
	const compendium = await page.evaluate(() => ({
		hasRoot: !!document.getElementById("root")?.children.length,
		fatal: document.body.innerText.includes("FATAL ANOMALY"),
		text: document.body.innerText.slice(0, 140).replace(/\s+/g, " "),
	}));
	console.log("OFFLINE compendium:", JSON.stringify(compendium));

	await browser.close();

	const pass =
		shell.hasRoot &&
		!shell.fatal &&
		shell.artFromCache &&
		compendium.hasRoot &&
		!compendium.fatal;
	console.log(pass ? "OFFLINE PROOF: PASS" : "OFFLINE PROOF: FAIL");
	process.exit(pass ? 0 : 1);
};

run().catch((err) => {
	console.error("offline proof error:", err);
	process.exit(1);
});
