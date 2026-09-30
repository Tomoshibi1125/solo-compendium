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

/**
 * Vercel compiles each api/ function file by file and runs the output as plain
 * Node ESM ("type": "module"). It neither rewrites the "@/" alias
 * (vercel/vercel#14058) nor adds file extensions, so an alias or an
 * extensionless relative import anywhere on a function's runtime graph makes
 * the function fail to load with ERR_MODULE_NOT_FOUND. Type-only imports are
 * erased and exempt.
 */
const runtimeImportPattern =
	/(?:^|\n)\s*(?:import|export)\s+(type\s+)?(?:([^'";]*?)\s+from\s+)?["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/g;

const isTypeOnlyClause = (clause: string | undefined): boolean => {
	if (!clause) return false;
	const named = clause.match(/^\{([^}]*)\}$/);
	if (!named) return false;
	const members = named[1]
		.split(",")
		.map((member) => member.trim())
		.filter(Boolean);
	return (
		members.length > 0 && members.every((member) => member.startsWith("type "))
	);
};

function runtimeSpecifiers(source: string): string[] {
	const specifiers: string[] = [];
	for (const match of source.matchAll(runtimeImportPattern)) {
		if (match[4]) {
			specifiers.push(match[4]);
			continue;
		}
		if (match[1] || isTypeOnlyClause(match[2]?.trim())) continue;
		specifiers.push(match[3]);
	}
	return specifiers;
}

const resolveRelative = (
	fromFile: string,
	specifier: string,
): string | null => {
	const base = resolve(root, dirname(fromFile), specifier);
	const candidates = /\.js$/.test(specifier)
		? [base, base.replace(/\.js$/, ".ts"), base.replace(/\.js$/, ".tsx")]
		: [base];
	const hit = candidates.find((candidate) => existsSync(candidate));
	return hit ? relative(root, hit).split(sep).join("/") : null;
};

describe("Vercel function runtime imports", () => {
	it("recognizes aliased, extensionless, and type-only imports", () => {
		expect(
			runtimeSpecifiers(
				[
					'import { a } from "@/lib/a";',
					'import type { B } from "@/lib/b";',
					'import { type C } from "./c";',
					'import d from "./d.js";',
					'export { e } from "../e";',
				].join("\n"),
			),
		).toEqual(["@/lib/a", "./d.js", "../e"]);
	});

	it("every api/ function graph uses only packages and explicit .js relative imports", () => {
		const entries = readdirSync(resolve(root, "api"))
			.filter((file) => /\.(ts|js)$/.test(file) && !file.endsWith(".d.ts"))
			.map((file) => `api/${file}`);
		const problems: string[] = [];
		const visited = new Set<string>();
		const queue = [...entries];
		while (queue.length > 0) {
			const file = queue.pop() as string;
			if (visited.has(file)) continue;
			visited.add(file);
			if (file.endsWith(".json")) continue;
			const source = readFileSync(resolve(root, file), "utf8");
			for (const specifier of runtimeSpecifiers(source)) {
				if (specifier.startsWith("@/")) {
					problems.push(`${file} imports alias ${specifier}`);
					continue;
				}
				if (!specifier.startsWith(".")) continue;
				if (!/\.(js|mjs|cjs|json)$/.test(specifier)) {
					problems.push(`${file} imports ${specifier} without an extension`);
					continue;
				}
				const target = resolveRelative(file, specifier);
				if (!target) {
					problems.push(`${file} imports missing ${specifier}`);
					continue;
				}
				queue.push(target);
			}
		}
		expect(problems).toEqual([]);
		// The Sovereign function must reach its shared contract through this walk.
		expect(visited).toContain("src/lib/sovereign/sovereignV2Contract.ts");
		expect(visited).toContain("api/_sovereignSources.ts");
	});
});
