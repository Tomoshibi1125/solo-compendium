/**
 * RA-18 AI isolation guard.
 *
 * AI may run only during initial Sovereign synthesis, through the dedicated
 * `/api/sovereign` server boundary. Every other generator, enhancement button,
 * narration helper, art pipeline, and local image-generation launcher is
 * deleted. These checks keep that boundary from eroding.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const thisTest = "src/lib/__tests__/aiIsolation.test.ts";
const read = (relativePath: string) =>
	readFileSync(path.join(root, relativePath), "utf8");

function walkFiles(directory: string): string[] {
	const absolute = path.join(root, directory);
	if (!existsSync(absolute)) return [];
	const files: string[] = [];
	for (const entry of readdirSync(absolute)) {
		const child = path.join(absolute, entry);
		const stat = statSync(child);
		if (stat.isDirectory()) {
			files.push(
				...walkFiles(path.relative(root, child).replaceAll(path.sep, "/")),
			);
		} else {
			files.push(path.relative(root, child).replaceAll(path.sep, "/"));
		}
	}
	return files;
}

const PROVIDER_MARKERS = [
	"generativelanguage.googleapis.com",
	"openrouter.ai",
	"text.pollinations.ai",
	"image.pollinations.ai",
	"api-inference.huggingface.co",
	"@google/genai",
];
/** Local image-generation backends (ComfyUI / A1111) retired with RA-18. */
const LOCAL_IMAGE_BACKEND_MARKERS = [
	/comfyui/i,
	/127\.0\.0\.1:8188/,
	/localhost:8188/,
	/127\.0\.0\.1:7860/,
	/\/sdapi\/v1\//,
];
const EXECUTABLE_EXT = /\.(?:[cm]?js|ts|tsx)$/;
const LAUNCHER_EXT = /\.(?:cmd|bat|ps1|sh|py)$/;
const ALLOWED_PROVIDER_FILES = new Set([
	"api/_aiProviders.js",
	"api/_sovereignGeneration.ts",
]);

function executableFiles(): string[] {
	return [
		...walkFiles("src"),
		...walkFiles("scripts"),
		...walkFiles("tools"),
		...walkFiles("supabase/functions"),
		...walkFiles("api"),
		"vite.config.ts",
		"vite.sourcebook.config.ts",
		"vite.sovereign-dev.ts",
	].filter(
		(file, index, all) =>
			(EXECUTABLE_EXT.test(file) || LAUNCHER_EXT.test(file)) &&
			!file.endsWith(".d.ts") &&
			file !== thisTest &&
			all.indexOf(file) === index,
	);
}

/** Retired general-AI modules, generators, and launchers that must stay deleted. */
const RETIRED_PATHS = [
	"api/ai.js",
	"api/ai.d.ts",
	"src/lib/ai",
	"src/lib/artPipeline",
	"src/components/art",
	"src/hooks/useAIEnhance.ts",
	"src/components/AIContentGeneratorClass.ts",
	"src/components/character/CharacterArtPanel.tsx",
	"src/components/warden-directives/NPCGenerator.tsx",
	"src/components/warden-directives/DirectiveMatrix.tsx",
	"src/components/warden-directives/DungeonMapGenerator.tsx",
	"src/pages/admin/ArtGeneration.tsx",
	"src/pages/warden-directives/ArtGenerator.tsx",
	"src/pages/warden-directives/DirectiveMatrix.tsx",
	"src/pages/warden-directives/GateGenerator.tsx",
	"src/pages/warden-directives/NPCGenerator.tsx",
	"src/pages/warden-directives/RandomEventGenerator.tsx",
	"src/pages/warden-directives/TreasureGenerator.tsx",
	"src/lib/riftGenerator.ts",
	"src/lib/treasureGenerator.ts",
	"scripts/generate-rift-assets.mjs",
	"scripts/approve-rift-candidates.mjs",
	"scripts/run-rift-assets-full.cmd",
	"scripts/run-rift-assets-generate-apply.cmd",
	"scripts/run-rift-assets-comfy-background.cmd",
	"scripts/run-rift-assets-comfy-background.ps1",
	"scripts/start-comfyui-with-logs.cmd",
	"config/comfy-rift-sdxl-workflow-api.json",
	"data/rift-image-prompts.json",
] as const;

/** UI affordances of retired AI features; none may reappear in the app. */
const RETIRED_AFFORDANCES = [
	"Enhance with AI",
	"Enhance All Results",
	"AI Narrate",
	"AI Draft",
	"AI-ENHANCED",
	"Ascendant Enhancement",
	"Generate Character Art",
	"useAIEnhance",
];

const GENERAL_AI_SDKS = [
	"@google/genai",
	"@google/generative-ai",
	"openai",
	"@anthropic-ai/sdk",
	"@pollinations_ai/sdk",
	"@huggingface/inference",
	"replicate",
];

describe("RA-18 AI isolation", () => {
	it("removes generic production and Vite AI endpoints", () => {
		const vite = read("vite.config.ts");
		const sovereignDev = read("vite.sovereign-dev.ts");
		expect(vite).not.toContain("devAIProxy");
		expect(vite).not.toContain('"/api/ai"');
		expect(vite).not.toContain("./api/_aiProviders");
		expect(sovereignDev).not.toContain('"/api/ai"');
		expect(sovereignDev).toContain('use("/api/sovereign"');
	});

	it("keeps retired AI modules, generators, and launchers deleted", () => {
		const present = RETIRED_PATHS.filter((relativePath) =>
			existsSync(path.join(root, relativePath)),
		);
		expect(present).toEqual([]);
	});

	it("whitelists provider code to the dedicated Sovereign server boundary", () => {
		const offenders: string[] = [];
		for (const file of executableFiles()) {
			if (ALLOWED_PROVIDER_FILES.has(file)) continue;
			const source = read(file);
			for (const marker of PROVIDER_MARKERS) {
				if (source.includes(marker)) offenders.push(`${file}: ${marker}`);
			}
			for (const marker of LOCAL_IMAGE_BACKEND_MARKERS) {
				if (marker.test(source)) offenders.push(`${file}: ${marker}`);
			}
			if (source.includes("runProviderChain")) {
				offenders.push(`${file}: runProviderChain`);
			}
			if (source.includes("_aiProviders")) {
				offenders.push(`${file}: _aiProviders import`);
			}
		}
		expect(offenders).toEqual([]);
		expect(read("api/_sovereignGeneration.ts")).toContain("runProviderChain");
	});

	it("keeps the browser's only AI network route in the Sovereign generation client", () => {
		const callers: string[] = [];
		for (const file of walkFiles("src")) {
			if (!EXECUTABLE_EXT.test(file) || file === thisTest) continue;
			const source = read(file);
			if (source.includes("/api/sovereign")) callers.push(file);
			expect(source, file).not.toContain("/api/ai");
		}
		expect(callers).toEqual(["src/lib/sovereign/sovereignGenerationClient.ts"]);
		const sovereignClient = read(callers[0]);
		expect(sovereignClient).toContain('fetch("/api/sovereign"');
		for (const marker of PROVIDER_MARKERS) {
			expect(sovereignClient).not.toContain(marker);
		}
	});

	it("shows no retired AI affordance anywhere in the app", () => {
		const offenders: string[] = [];
		for (const file of walkFiles("src")) {
			if (!EXECUTABLE_EXT.test(file) || file === thisTest) continue;
			const source = read(file);
			for (const text of RETIRED_AFFORDANCES) {
				if (source.includes(text)) offenders.push(`${file}: ${text}`);
			}
		}
		expect(offenders).toEqual([]);
	});

	it("ships no general-purpose AI SDK dependency", () => {
		const manifest = JSON.parse(read("package.json")) as {
			dependencies?: Record<string, string>;
			devDependencies?: Record<string, string>;
		};
		const installed = Object.keys({
			...manifest.dependencies,
			...manifest.devDependencies,
		});
		expect(installed.filter((name) => GENERAL_AI_SDKS.includes(name))).toEqual(
			[],
		);
	});

	it("redirects retired generator URLs to the Warden tools hub", () => {
		const app = read("src/App.tsx");
		for (const retired of [
			"/warden-directives/gate-generator",
			"/warden-directives/npc-generator",
			"/warden-directives/treasure-generator",
			"/warden-directives/quest-generator",
			"/warden-directives/directive-lattice",
			"/warden-directives/random-event-generator",
			"/warden-directives/art-generator",
			"/player-tools/map",
		]) {
			expect(app, retired).toContain(`"${retired}"`);
		}
		expect(app).toContain("RETIRED_GENERATOR_PATHS.map");
		expect(app).toContain('<Navigate to="/warden-protocols" replace />');
	});
});
