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
	Unknown: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	Civilian: "/generated/compendium/backgrounds/gate-survivor.webp",
	Hybrid: "/generated/compendium/backgrounds/void-touched.webp",
	Guardian: "/generated/compendium/anomalies/companion-spectral-knight.webp",
	Mutant: "/generated/compendium/anomalies/companion-void-walker.webp",
	Repository: "/generated/compendium/jobs/artificer.webp",
	"Beast Companion":
		"/generated/compendium/anomalies/companion-chronal-hound.webp",
};

const SPECIAL_SANDBOX_NPC_IMAGE_URLS: Record<string, string> = {
	"npc-bound-001": "/generated/compendium/backgrounds/void-touched.webp",
	"npc-bound-002":
		"/generated/compendium/anomalies/companion-spectral-knight.webp",
	"npc-bound-003": "/generated/compendium/anomalies/companion-void-walker.webp",
	"npc-bound-004": "/generated/compendium/backgrounds/time-walker.webp",
	"npc-bound-005": "/generated/compendium/jobs/artificer.webp",
	"npc-bound-006":
		"/generated/compendium/anomalies/companion-chronal-hound.webp",
};

const FACTION_FALLBACK_IMAGE_URLS: Record<string, string> = {
	bureau_sentinels: "/generated/compendium/backgrounds/gate-survivor.webp",
	vermillion_guild: "/generated/compendium/backgrounds/guild-master.webp",
	hollow_choir: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	free_ascendants: "/generated/compendium/backgrounds/gate-survivor.webp",
	gloamreach_bound: "/generated/compendium/backgrounds/void-touched.webp",
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

	if (normalizedSceneName.includes("thornwake")) {
		return ["npc-free-001", "npc-choir-001", "npc-bound-001"];
	}

	if (normalizedSceneName.includes("vermillion")) {
		return ["npc-verm-001", "npc-verm-002", "npc-verm-004"];
	}

	if (normalizedSceneName.includes("bastion")) {
		return ["npc-bureau-001", "npc-bureau-002", "npc-bureau-004"];
	}

	if (normalizedSceneName.includes("glassvine")) {
		return ["npc-bound-003", "npc-free-004", "npc-verm-005"];
	}

	if (normalizedSceneName.includes("choir")) {
		return ["npc-choir-001", "npc-choir-003", "npc-choir-005"];
	}

	return ["npc-bureau-001", "npc-free-001", "npc-verm-001"];
}
