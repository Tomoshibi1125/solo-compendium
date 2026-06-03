import type { SandboxNPC } from "@/data/compendium/sandbox-npcs";

type SandboxNpcAssetDescriptor = Pick<
	SandboxNPC,
	"id" | "name" | "title" | "job" | "faction"
>;

const DEFAULT_SANDBOX_NPC_IMAGE_URL =
	"/generated/compendium/backgrounds/gate-survivor.webp";

const JOB_PORTRAIT_URL_BY_JOB: Record<string, string> = {
	Assassin: "/generated/compendium/jobs/assassin.webp",
	Berserker: "/generated/compendium/jobs/berserker.webp",
	Contractor: "/generated/compendium/jobs/Contractor.webp",
	Destroyer: "/generated/compendium/jobs/tank.webp",
	Esper: "/generated/compendium/jobs/warrior.webp",
	Herald: "/generated/compendium/jobs/healer.webp",
	"Holy Knight": "/generated/compendium/jobs/Holy Knight.webp",
	Idol: "/generated/compendium/jobs/Idol.webp",
	Mage: "/generated/compendium/jobs/mage.webp",
	Stalker: "/generated/compendium/jobs/Stalker.webp",
	Striker: "/generated/compendium/jobs/Striker.webp",
	Summoner: "/generated/compendium/jobs/summoner.webp",
	Technomancer: "/generated/compendium/jobs/artificer.webp",
	Revenant: "/generated/compendium/jobs/Revenant.webp",
	Oracle: "/generated/compendium/backgrounds/time-walker.webp",
	Hybrid: "/generated/compendium/backgrounds/void-touched.webp",
	Guardian: "/generated/compendium/anomalies/companion-spectral-knight.webp",
	Mutant: "/generated/compendium/anomalies/companion-void-walker.webp",
	Repository: "/generated/compendium/jobs/artificer.webp",
	"Beast Companion":
		"/generated/compendium/anomalies/companion-chronal-hound.webp",
	Unknown: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	Civilian: "/generated/compendium/backgrounds/gate-survivor.webp",
};

const SPECIAL_SANDBOX_NPC_IMAGE_URLS: Record<string, string> = {
	"npc-bureau-001": "/generated/compendium/jobs/tank.webp",
	"npc-bureau-004": "/generated/compendium/jobs/warrior.webp",
	"npc-bureau-005": "/generated/compendium/jobs/Stalker.webp",
	"npc-verm-004": "/generated/compendium/backgrounds/guild-master.webp",
	"npc-awoko-001": "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	"npc-awoko-004": "/generated/compendium/jobs/mage.webp",
	"npc-ind-003": "/generated/compendium/backgrounds/time-walker.webp",
	"npc-ind-004": "/generated/compendium/jobs/warrior.webp",
	"npc-ind-012": "/generated/compendium/anomalies/companion-spectral-knight.webp",
	"npc-anom-001": "/generated/compendium/backgrounds/void-touched.webp",
	"npc-anom-002": "/generated/compendium/anomalies/companion-spectral-knight.webp",
	"npc-anom-003": "/generated/compendium/anomalies/companion-void-walker.webp",
	"npc-anom-004": "/generated/compendium/backgrounds/time-walker.webp",
	"npc-anom-005": "/generated/compendium/jobs/artificer.webp",
	"npc-anom-006": "/generated/compendium/anomalies/companion-chronal-hound.webp",
};

const FACTION_FALLBACK_IMAGE_URLS: Record<string, string> = {
	bureau_sentinels: "/generated/compendium/backgrounds/gate-survivor.webp",
	vermillion_guild: "/generated/compendium/backgrounds/guild-master.webp",
	awoko_cult: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	independent: "/generated/compendium/backgrounds/gate-survivor.webp",
	anomaly_adjacent: "/generated/compendium/backgrounds/void-touched.webp",
};

export const SHADOW_REGENT_TOKEN_IMAGE_URL =
	"/generated/compendium/anomalies/mount-dire-shadow-wolf.webp";

export const SHADOW_SOLDIER_TOKEN_IMAGE_URL =
	"/generated/compendium/anomalies/companion-spectral-knight.webp";

export function getSandboxNpcPortraitUrl(
	npc: SandboxNpcAssetDescriptor,
): string {
	return (
		SPECIAL_SANDBOX_NPC_IMAGE_URLS[npc.id] ||
		JOB_PORTRAIT_URL_BY_JOB[npc.job] ||
		FACTION_FALLBACK_IMAGE_URLS[npc.faction] ||
		DEFAULT_SANDBOX_NPC_IMAGE_URL
	);
}

export function getSandboxHubNpcIds(sceneName: string): string[] {
	const normalizedSceneName = sceneName.toLowerCase();

	if (normalizedSceneName.includes("bureau domain response annex")) {
		return ["npc-bureau-001", "npc-bureau-004", "npc-bureau-005"];
	}

	if (normalizedSceneName.includes("memory-care")) {
		return ["npc-bureau-004", "npc-bureau-007", "npc-ind-003"];
	}

	if (normalizedSceneName.includes("vermillion outpost")) {
		return ["npc-verm-004", "npc-verm-001", "npc-verm-003"];
	}

	if (normalizedSceneName.includes("writ-bound") || normalizedSceneName.includes("tribute")) {
		return ["npc-ind-007", "npc-ind-001", "npc-ind-003"];
	}

	if (normalizedSceneName.includes("awoko sanctum")) {
		return ["npc-awoko-001", "npc-awoko-004", "npc-awoko-006"];
	}

	if (normalizedSceneName.includes("bastion golemfall")) {
		return ["npc-ind-012", "npc-bureau-003", "npc-ind-004"];
	}

	if (normalizedSceneName.includes("obsidian spire")) {
		return ["npc-anom-002", "npc-anom-004", "npc-ind-005"];
	}

	if (normalizedSceneName.includes("drowned ledgerfen")) {
		return ["npc-anom-005", "npc-anom-003", "npc-bureau-004"];
	}

	if (normalizedSceneName.includes("road of writs")) {
		return ["npc-verm-008", "npc-anom-006", "npc-bureau-003"];
	}

	return ["npc-bureau-001", "npc-ind-001", "npc-verm-001"];
}
