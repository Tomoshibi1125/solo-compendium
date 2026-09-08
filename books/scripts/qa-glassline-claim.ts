import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { anomalies } from "../../src/data/compendium/anomalies";
import { allBackgrounds } from "../../src/data/compendium/backgrounds-index";
import { allItems } from "../../src/data/compendium/items-index";
import { locations } from "../../src/data/compendium/locations";
import { glasslineSelectedArtSlots } from "./glassline_art_manifest";
import { glasslineClaimSections } from "./glassline_claim";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");
const markdownPath = resolve(repoRoot, "docs/adventure-glassline-claim.md");
const publicRoot = resolve(repoRoot, "public");

type AuditResult = "PASS" | "FAIL";

interface Check {
	label: string;
	result: AuditResult;
	detail?: string;
}

interface EncounterBudget {
	label: string;
	pcs: number;
	xp: number[];
}

const requiredSections = [
	"Warden Overview",
	"How To Run This One-Shot",
	"Episode Flow",
	"Player Briefing",
	"Key NPCs",
	"Running Escort Duty",
	"Difficulty And Checks",
	"Encounter Scaling",
	"Canon Enemy Summaries",
	"Scene 0: New License Day",
	"Scene 1: Ironclad Contract Briefing",
	"Scene 2: Bureau Threshold Intake",
	"Scene 3: First Corridor Escort",
	"Scene 4: Survey Marker L-3",
	"Scene 5: Rival Claim Dispute",
	"Scene 6: The Glassline Seam",
	"Scene 7: Claim Guardian",
	"Scene 8: Debrief And Carryover",
	"Ironclad Rift-Hauler: L3-HOUND",
	"Rewards",
	"Warden Handouts",
	"Quick Run Sheet",
	"Acceptance Checklist",
];

const sceneHeadings = requiredSections.filter((section) => section.startsWith("Scene "));

const requiredVivlioSectionIds = [
	"warden-overview",
	"episode-and-briefing",
	"npc-and-escort-duty",
	"rules-and-scaling",
	"scenes-1-2",
	"scenes-3-4",
	"scene-5-rival-claim",
	"scene-6-glassline-seam",
	"scene-7-claim-guardian",
	"scene-8-debrief",
	"rewards",
	"handouts-and-run-sheet",
];

const enemyExpectations = [
	{ id: "anomaly-0021", name: "Corrupted Shadow anomaly", rank: "D", xp: 25, ac: 13, hp: 21 },
	{ id: "anomaly-0061", name: "Cursed Shadow anomaly", rank: "D", xp: 50, ac: 13, hp: 36 },
	{ id: "anomaly-0081", name: "Ancient Shadow anomaly", rank: "D", xp: 50, ac: 13, hp: 38 },
	{ id: "anomaly-0141", name: "Legendary Shadow anomaly", rank: "D", xp: 100, ac: 13, hp: 58 },
];

const rewardIds = [
	"bg-trauma-kit",
	"bg-safety-vest",
	"bg-dented-hardhat",
	"bg-heavy-multitool",
	"bg-tactical-flashlight",
	"bg-thermal-bag",
	"gap_gear_kit_common_0",
	"gap_gear_utility_common_0",
	"bg-gate-gps",
	"bg-aetheric-scanner",
	"bg-rune-wrenches",
	"bg-tactical-vest",
	"bg-fire-jacket",
];

const backgroundNames = ["Rift Porter (Logistics)", "Construction Worker"];

const forbiddenTerms: Array<[string, RegExp]> = [
	["campaign-region lore", /\bGloamreach\b/i],
	["Memory-Care", new RegExp("\\bMemory-" + "Care\\b", "i")],
	["Day Zero", new RegExp("\\bDay " + "Zero\\b", "i")],
	["The Worn", /\bThe\s*Worn\b/i],
	["Worn Dead", /\bWorn\s*Dead\b/i],
	["The Quiet", /\bThe\s*Quiet\b/i],
	["Hunt Clock", /\bHunt\s*Clock\b/i],
	["Running This Horror", /\bRunning\s*This\s*Horror\b/i],
	["Dread", /\bDread\b/i],
	["sandbox", /\bsandbox\b/i],
];

const encounterBudgets: EncounterBudget[] = [
	{ label: "1 PC first fight", pcs: 1, xp: [25] },
	{ label: "1 PC finale", pcs: 1, xp: [50] },
	{ label: "2 PCs first fight", pcs: 2, xp: [50] },
	{ label: "2 PCs finale", pcs: 2, xp: [100] },
	{ label: "3 PCs first fight", pcs: 3, xp: [25, 25] },
	{ label: "3 PCs finale", pcs: 3, xp: [100, 25] },
	{ label: "4 PCs first fight", pcs: 4, xp: [50, 50] },
	{ label: "4 PCs finale", pcs: 4, xp: [100, 50] },
	{ label: "5 PCs first fight", pcs: 5, xp: [50, 50] },
	{ label: "5 PCs finale", pcs: 5, xp: [100, 50] },
];

function pass(label: string, detail?: string): Check {
	return { label, result: "PASS", detail };
}

function fail(label: string, detail?: string): Check {
	return { label, result: "FAIL", detail };
}

function sectionBody(markdown: string, heading: string): string {
	const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const source = `${markdown}\n## __END__`;
	const match = new RegExp(`^## ${escaped}\\s*$([\\s\\S]*?)(?=^## )`, "m").exec(source);
	return match?.[1]?.trim() ?? "";
}

function stripHtml(value: string): string {
	return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function enemyMultiplier(enemyCount: number): number {
	if (enemyCount <= 1) return 1;
	if (enemyCount === 2) return 1.5;
	if (enemyCount <= 6) return 2;
	return 2.5;
}

function adjustedEncounterXp(xp: number[]): number {
	return xp.reduce((sum, value) => sum + value, 0) * enemyMultiplier(xp.length);
}

function normalizePublicPath(publicPath: string): string {
	return publicPath.replace(/^\//, "").replace(/\//g, "\\");
}

function audit(): Check[] {
	const checks: Check[] = [];
	if (!existsSync(markdownPath)) {
		return [fail("Markdown source exists", markdownPath)];
	}

	const markdown = readFileSync(markdownPath, "utf8").replace(/\r\n/g, "\n");
	const vivlioText = glasslineClaimSections
		.map((section) => {
			const body = typeof section.body === "function" ? section.body() : section.body;
			return [section.title, section.summary, stripHtml(body)].join("\n");
		})
		.join("\n");
	const combinedText = `${markdown}\n${vivlioText}`;

	const missingSections = requiredSections.filter((section) => !markdown.includes(`## ${section}`));
	checks.push(
		missingSections.length
			? fail("Required one-shot sections", missingSections.join(", "))
			: pass("Required one-shot sections", `${requiredSections.length} sections found`),
	);

	const missingVivlioIds = requiredVivlioSectionIds.filter(
		(id) => !glasslineClaimSections.some((section) => section.id === id),
	);
	checks.push(
		missingVivlioIds.length
			? fail("Vivlio section IDs", missingVivlioIds.join(", "))
			: pass("Vivlio section IDs", `${requiredVivlioSectionIds.length} sections found`),
	);

	const runtimeOk = /3\.5-5 hours/i.test(combinedText) || /3\.5\s*-\s*5 hour/i.test(combinedText);
	checks.push(runtimeOk ? pass("Runtime target", "3.5-5 hours") : fail("Runtime target", "3.5-5 hours missing"));

	const sceneStructureFailures = sceneHeadings.flatMap((scene) => {
		const body = sectionBody(markdown, scene);
		const missing = [
			"Read-Aloud",
			"Dialogue",
			"If Players Ask",
			"Player Spotlight",
			"Exit Condition",
			"Transition",
		].filter((marker) => !body.includes(`### ${marker}`));
		return missing.length ? [`${scene} missing ${missing.join(", ")}`] : [];
	});
	checks.push(
		sceneStructureFailures.length
			? fail("Scene run-at-table structure", sceneStructureFailures.join("; "))
			: pass("Scene run-at-table structure", "9 scenes include read-aloud, dialogue, questions, spotlight, exits, and transitions"),
	);

	const liveTableAnchors = [
		"Scene 0: New License Day",
		"K. Serrano",
		"AFA FILE NOTE",
		"L-3 Glassline Haul Sector",
		"Rank measures threat, not square footage",
		"L3-HOUND",
		"Ironclad Rift-Hauler",
		"Transport-Risk Bonus",
		"Vehicle Complications",
	];
	const missingLiveAnchors = liveTableAnchors.filter((anchor) => !combinedText.includes(anchor));
	checks.push(
		missingLiveAnchors.length
			? fail("Live-table revision anchors", missingLiveAnchors.join(", "))
			: pass("Live-table revision anchors", liveTableAnchors.join(", ")),
	);

	const location = locations.find((entry) => entry.id === "location-0001");
	checks.push(
		location?.name === "Eternal Shadow Dungeon" && location.rank === "D"
			? pass("Location canon ID", "location-0001 Eternal Shadow Dungeon Rank D")
			: fail("Location canon ID", "location-0001 did not resolve as Eternal Shadow Dungeon Rank D"),
	);

	for (const expected of enemyExpectations) {
		const anomaly = anomalies.find((entry) => entry.id === expected.id);
		const ok =
			anomaly?.name === expected.name &&
			anomaly.rank === expected.rank &&
			anomaly.xp === expected.xp &&
			anomaly.ac === expected.ac &&
			anomaly.hp === expected.hp;
		checks.push(
			ok
				? pass(`Enemy canon stats ${expected.id}`, `${expected.name}, Rank ${expected.rank}, XP ${expected.xp}, AC ${expected.ac}, HP ${expected.hp}`)
				: fail(`Enemy canon stats ${expected.id}`, JSON.stringify(anomaly ?? null)),
		);
	}

	const missingRewardIds = rewardIds.filter((id) => !allItems.some((item) => item.id === id));
	checks.push(
		missingRewardIds.length
			? fail("Reward IDs resolve", missingRewardIds.join(", "))
			: pass("Reward IDs resolve", `${rewardIds.length} canon reward items found`),
	);

	const missingBackgrounds = backgroundNames.filter(
		(name) => !allBackgrounds.some((background) => background.name === name),
	);
	checks.push(
		missingBackgrounds.length
			? fail("Referenced labor backgrounds resolve", missingBackgrounds.join(", "))
			: pass("Referenced labor backgrounds resolve", backgroundNames.join(", ")),
	);

	const nonDeadlyFailures = encounterBudgets.flatMap((budget) => {
		const adjusted = adjustedEncounterXp(budget.xp);
		const deadly = budget.pcs * 100;
		return adjusted < deadly ? [] : [`${budget.label} adjusted XP ${adjusted} >= deadly ${deadly}`];
	});
	checks.push(
		nonDeadlyFailures.length
			? fail("Encounter scaling below deadly", nonDeadlyFailures.join("; "))
			: pass("Encounter scaling below deadly", `${encounterBudgets.length} scaled encounters checked`),
	);

	const forbiddenHits = forbiddenTerms
		.filter(([, pattern]) => pattern.test(combinedText))
		.map(([label]) => label);
	checks.push(
		forbiddenHits.length
			? fail("Forbidden campaign/mechanic terms absent", forbiddenHits.join(", "))
			: pass("Forbidden campaign/mechanic terms absent"),
	);

	const missingArt = glasslineSelectedArtSlots()
		.map((slot) => ({ slot, path: resolve(publicRoot, normalizePublicPath(slot.selectedPath)) }))
		.filter(({ path }) => !existsSync(path))
		.map(({ slot }) => `${slot.slug}: ${slot.selectedPath}`);
	checks.push(
		missingArt.length
			? fail("One-shot art assets resolve", missingArt.join("; "))
			: pass("One-shot art assets resolve", `${glasslineSelectedArtSlots().length} selected assets found`),
	);

	return checks;
}

const checks = audit();
console.log("=========================================");
console.log("   THE GLASSLINE CLAIM SOURCE QA AUDIT   ");
console.log("=========================================\n");

for (const check of checks) {
	console.log(`- ${check.label}: ${check.result}${check.detail ? ` (${check.detail})` : ""}`);
}

const failures = checks.filter((check) => check.result === "FAIL");
console.log("\n=========================================");
if (failures.length) {
	console.log("QA STATUS: FAILED");
	process.exit(1);
}

console.log("QA STATUS: PASSED");
