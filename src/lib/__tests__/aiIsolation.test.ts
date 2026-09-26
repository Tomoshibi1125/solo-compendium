import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { artPipeline } from "@/lib/artPipeline/service";
import { AIServiceManager } from "@/lib/ai/aiService";
import { narrateCombatEvent } from "@/lib/ai/protocolWarden";

const root = process.cwd();
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

describe("A1 AI isolation", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("removes the generic production AI endpoint", () => {
		expect(existsSync(path.join(root, "api/ai.js"))).toBe(false);
	});

	it("retires the generic Vite dev route before legacy middleware", () => {
		const source = read("vite.sovereign-dev.ts");
		expect(source).toContain('enforce: "pre"');
		expect(source).toContain('use("/api/ai"');
		expect(source).toContain("statusCode = 410");
		expect(source).toContain('use("/api/sovereign"');
	});

	it("allows executable scripts no provider imports or provider URLs", () => {
		const offenders: string[] = [];
		for (const file of walkFiles("scripts")) {
			if (!/\.(?:[cm]?js|ts|tsx)$/.test(file)) continue;
			const source = read(file);
			for (const marker of PROVIDER_MARKERS) {
				if (source.includes(marker)) offenders.push(`${file}: ${marker}`);
			}
		}
		expect(offenders).toEqual([]);
	});

	it("keeps client provider access limited to the dedicated Sovereign route", () => {
		const sovereignClient = read(
			"src/lib/sovereign/sovereignGenerationClient.ts",
		);
		expect(sovereignClient).toContain('fetch("/api/sovereign"');
		expect(sovereignClient).not.toContain("/api/ai");
		for (const marker of PROVIDER_MARKERS) {
			expect(sovereignClient).not.toContain(marker);
		}

		for (const file of [
			"src/lib/ai/aiService.ts",
			"src/hooks/useAIEnhance.ts",
			"src/lib/artPipeline/service.ts",
			"src/hooks/useCampaignDice.ts",
			"src/lib/ai/protocolWarden.ts",
		]) {
			const source = read(file);
			expect(source, file).not.toContain("/api/ai");
			for (const marker of PROVIDER_MARKERS) {
				expect(source, file).not.toContain(marker);
			}
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
