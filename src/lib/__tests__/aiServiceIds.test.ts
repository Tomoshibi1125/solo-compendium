import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { DEFAULT_AI_SERVICES } from "@/lib/ai/types";

/**
 * Guard against the "gemini-proxy" class of bug: a component passing a literal
 * `service:` id to processRequest that no registered service matches, which
 * makes every request fail validation before reaching a provider (this is how
 * the Warden Chatbot silently died). Production code should either use
 * `aiService.getConfiguration().defaultService` or a registered id.
 */

const KNOWN_SERVICE_IDS = new Set([
	...DEFAULT_AI_SERVICES.map((service) => service.id),
	"user-custom", // buildCustomService id (userSettings.ts)
]);

const SRC_ROOT = resolve(__dirname, "../..");

function walkSourceFiles(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) {
			if (entry === "__tests__" || entry === "node_modules") continue;
			walkSourceFiles(full, out);
		} else if (
			/\.(ts|tsx)$/.test(entry) &&
			!/\.(test|spec)\.(ts|tsx)$/.test(entry)
		) {
			out.push(full);
		}
	}
	return out;
}

describe("AI service id literals", () => {
	it("every literal service id in src resolves to a registered service", () => {
		const offenders: string[] = [];
		for (const file of walkSourceFiles(SRC_ROOT)) {
			const content = readFileSync(file, "utf8");
			for (const match of content.matchAll(/service:\s*"([^"]+)"/g)) {
				if (!KNOWN_SERVICE_IDS.has(match[1])) {
					offenders.push(`${file} → "${match[1]}"`);
				}
			}
		}
		expect(offenders).toEqual([]);
	});
});
