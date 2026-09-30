/**
 * Vercel deletes everything .vercelignore lists (supabase/, tests/, books/,
 * audit/, ...) before it runs `npm run build:vercel`. Shipped code that imports
 * from those folders still builds locally, then fails on Vercel with an
 * unresolved import. This keeps app, serverless, and Vite config sources free
 * of such imports.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

const ignoreRules = readFileSync(resolve(root, ".vercelignore"), "utf8")
	.split(/\r?\n/)
	.map((line) => line.trim())
	.filter((line) => line && !line.startsWith("#") && !line.includes("*"));
// "/name" only matches at the repo root; a bare "name" matches at any depth.
const rootOnly = new Set(
	ignoreRules
		.filter((rule) => rule.startsWith("/"))
		.map((rule) => rule.slice(1)),
);
const anyDepth = new Set(ignoreRules.filter((rule) => !rule.startsWith("/")));

const ignoredBy = (repoPath: string): string | null => {
	const segments = repoPath.split("/");
	if (rootOnly.has(segments[0])) return `/${segments[0]}`;
	return segments.find((segment) => anyDepth.has(segment)) ?? null;
};

const isShippedSource = (file: string): boolean =>
	/\.(ts|tsx|js|mjs|cjs)$/.test(file) &&
	!/(^|\/)__tests__\//.test(file) &&
	!/\.(test|spec)\.[cm]?[jt]sx?$/.test(file);

const listSources = (dir: string): string[] =>
	(readdirSync(resolve(root, dir), { recursive: true }) as string[])
		.map((file) => `${dir}/${file.split(sep).join("/")}`)
		.filter(isShippedSource);

const buildConfigFiles = ["vite.config.ts", "vite.sovereign-dev.ts"].filter(
	(file) => existsSync(resolve(root, file)),
);

const specifierPattern =
	/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*|import\.meta\.glob\s*\(\s*\[?\s*)["']([^"']+)["']/g;

describe("Vercel deploy inputs", () => {
	it("reads the anchored and nested ignore rules", () => {
		expect(ignoredBy("supabase/sovereign_v2.schema.json")).toBe("/supabase");
		expect(ignoredBy("tests/pages/SharedPage.ts")).toBe("/tests");
		expect(ignoredBy("scripts/audit/report.json")).toBe("audit");
		expect(ignoredBy("src/lib/sovereign/sovereignV2Contract.ts")).toBeNull();
	});

	it("keeps shipped code free of imports from .vercelignore'd folders", () => {
		const offenders: string[] = [];
		for (const file of [
			...listSources("src"),
			...listSources("api"),
			...buildConfigFiles,
		]) {
			const source = readFileSync(resolve(root, file), "utf8");
			for (const match of source.matchAll(specifierPattern)) {
				const specifier = match[1].split("?")[0];
				if (!specifier.startsWith(".")) continue;
				const target = relative(root, resolve(root, dirname(file), specifier))
					.split(sep)
					.join("/");
				if (target.startsWith("..")) continue;
				const rule = ignoredBy(target);
				if (rule) offenders.push(`${file} imports ${target} (${rule})`);
			}
		}
		expect(offenders).toEqual([]);
	});
});
