import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { artPipeline } from "@/lib/artPipeline/service";
import { AIServiceManager } from "@/lib/ai/aiService";
import { narrateCombatEvent } from "@/lib/ai/protocolWarden";

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
const EXECUTABLE_EXT = /\.(?:[cm]?js|ts|tsx)$/;
const ALLOWED_PROVIDER_FILES = new Set([
	"api/_aiProviders.js",
	"api/_sovereignGeneration.ts",
]);

function executableFiles(): string[] {
	return [
		...walkFiles("src"),
		...walkFiles("scripts"),
		...walkFiles("supabase/functions"),
		...walkFiles("api"),
		"vite.config.ts",
		"vite.sourcebook.config.ts",
		"vite.sovereign-dev.ts",
	].filter(
		(file, index, all) =>
			EXECUTABLE_EXT.test(file) &&
			file !== thisTest &&
			all.indexOf(file) === index,
	);
}

describe("A1 AI isolation", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("removes generic production and Vite AI endpoints", () => {
		expect(existsSync(path.join(root, "api/ai.js"))).toBe(false);
		const vite = read("vite.config.ts");
		const sovereignDev = read("vite.sovereign-dev.ts");
		expect(vite).not.toContain("devAIProxy");
		expect(vite).not.toContain('"/api/ai"');
		expect(vite).not.toContain("./api/_aiProviders");
		expect(sovereignDev).not.toContain('"/api/ai"');
		expect(sovereignDev).toContain('use("/api/sovereign"');
	});

	it("whitelists provider code to the dedicated Sovereign server boundary", () => {
		const offenders: string[] = [];
		for (const file of executableFiles()) {
			if (ALLOWED_PROVIDER_FILES.has(file)) continue;
			const source = read(file);
			for (const marker of PROVIDER_MARKERS) {
				if (source.includes(marker)) offenders.push(`${file}: ${marker}`);
			}
			if (source.includes("runProviderChain")) {
				offenders.push(`${file}: runProviderChain`);
			}
			if (source.includes('from "./api/_aiProviders')) {
				offenders.push(`${file}: _aiProviders import`);
			}
		}
		expect(offenders).toEqual([]);
	});

	it("keeps the browser's only AI network route in the Sovereign generation client", () => {
		const callers: string[] = [];
		for (const file of walkFiles("src")) {
			if (!EXECUTABLE_EXT.test(file) || file === thisTest) continue;
			const source = read(file);
			if (source.includes("/api/sovereign")) callers.push(file);
			expect(source, file).not.toContain("/api/ai");
		}
		expect(callers).toEqual([
			"src/lib/sovereign/sovereignGenerationClient.ts",
		]);
		const sovereignClient = read(callers[0]);
		expect(sovereignClient).toContain('fetch("/api/sovereign"');
		for (const marker of PROVIDER_MARKERS) {
			expect(sovereignClient).not.toContain(marker);
		}
	});

	it("legacy general-AI compatibility calls make zero network requests", async () => {
		const fetchMock = vi.fn(() => {
			throw new Error("network access is forbidden by A1");
		});
		vi.stubGlobal("fetch", fetchMock);

		const manager = new AIServiceManager();
		const response = await manager.processRequest({
			service: "retired",
			type: "generate-content",
			input: "test",
		});
		expect(response.success).toBe(false);
		expect(await narrateCombatEvent("Attack roll: 18")).toBe("Attack roll: 18");
		const artResult = await artPipeline.generateArt({
			entityType: "Anomaly",
			entityId: "a1-test",
			variant: "portrait",
			title: "A1 Test",
			tags: [],
		});
		expect(artResult.success).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
