import * as fs from "fs";

const accessFile = "src/lib/pathAbilityAccess.ts";
const content = fs.readFileSync(accessFile, "utf-8");

// The objects are all formatted roughly as:
// 	{
// 		jobName: "...",
//      ...
// 		progression: "...",
// 	},

// Let's use a regex to capture every single one of these blocks.
const grantRegex =
	/\{\s*jobName:\s*"[^"]+",\s*pathName:\s*"[^"]+",\s*level:\s*\d+,\s*kind:\s*"[^"]+",\s*sourceTokens:\s*\[[^\]]*\],\s*entryNames:\s*\[[\s\S]*?\],\s*progression:\s*"[^"]+",\s*\}/g;

const allGrants = [];
let match;
while ((match = grantRegex.exec(content)) !== null) {
	allGrants.push(match[0]);
}

console.log("Found", allGrants.length, "grants.");

// Now let's reconstruct the file.
// Everything before `export const PATH_ABILITY_GRANTS` remains the same.
const beforeArray = content.slice(
	0,
	content.indexOf("export const PATH_ABILITY_GRANTS"),
);

// The functions after the array
const functionsText = `
export function getPathGrantMaxAbilityLevel(
	grant: PathAbilityGrant,
	characterLevel: number,
): number {
	if (typeof grant.maxLevel === "number") return grant.maxLevel;
	if (grant.progression === "third")
		return getThirdCasterMaxLevel(characterLevel);
	if (grant.progression === "full") {
		return getMaxAbilityLevelForJobAtLevel("Mage", characterLevel, "spell");
	}
	return getMaxAbilityLevelForJobAtLevel(
		grant.jobName,
		characterLevel,
		grant.kind === "technique" ? "power" : grant.kind,
	);
}

export function getActivePathAbilityGrants(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel?: number | null;
	kind?: PathAbilityKind;
}): PathAbilityGrant[] {
	if (!options.jobName || !options.pathName) return [];
	const level = options.characterLevel ?? 0;
	return PATH_ABILITY_GRANTS.filter((grant) => {
		if (options.kind && grant.kind !== options.kind) return false;
		if (!matchesName(grant.jobName, options.jobName)) return false;
		if (!matchesName(grant.pathName, options.pathName)) return false;
		return level >= grant.level;
	});
}

export function pathGrantsAbilityKind(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel?: number | null;
	kind: PathAbilityKind;
}): boolean {
	return getActivePathAbilityGrants(options).length > 0;
}

export function getEffectiveMaxAbilityLevel(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel: number;
	kind: "spell" | "power";
}): number {
	const baseMax = getMaxAbilityLevelForJobAtLevel(
		options.jobName,
		options.characterLevel,
		options.kind,
	);
	const grantMax = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: options.kind,
	})
		.filter((grant) => !grant.entryNames?.length)
		.reduce(
			(max, grant) =>
				Math.max(
					max,
					getPathGrantMaxAbilityLevel(grant, options.characterLevel),
				),
			0,
		);
	return Math.max(baseMax, grantMax);
}

export function getPathAbilityGrantTokens(
	jobName: string | null | undefined,
	pathName: string | null | undefined,
	kind?: PathAbilityKind,
): string[] {
	if (!jobName || !pathName) return [];
	const grants = getActivePathAbilityGrants({
		jobName,
		pathName,
		kind,
		characterLevel: 20,
	});
	return Array.from(new Set(grants.flatMap((g) => g.sourceTokens)));
}

export function normalizePathAbilityValue(val: string): string {
	return val.trim().toLowerCase();
}
`;

const newFileContent = `${beforeArray}export const PATH_ABILITY_GRANTS: readonly PathAbilityGrant[] = [
${allGrants.join(",\n")}
];
${functionsText}`;

fs.writeFileSync(accessFile, newFileContent);
console.log("Successfully repaired pathAbilityAccess.ts!");
