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
	Contractor: "/generated/compendium/jobs/warlock.webp",
	Destroyer: "/generated/compendium/jobs/tank.webp",
	Esper: "/generated/compendium/jobs/warrior.webp",
	Herald: "/generated/compendium/jobs/healer.webp",
	"Holy Knight": "/generated/compendium/jobs/paladin.webp",
	Idol: "/generated/compendium/jobs/bard.webp",
	Mage: "/generated/compendium/jobs/mage.webp",
	Stalker: "/generated/compendium/jobs/ranger.webp",
	Striker: "/generated/compendium/jobs/monk.webp",
	Summoner: "/generated/compendium/jobs/summoner.webp",
	Technomancer: "/generated/compendium/jobs/artificer.webp",
	Revenant: "/generated/compendium/jobs/necromancer.webp",
	Unknown: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	Civilian: "/generated/compendium/backgrounds/gate-survivor.webp",
	Hybrid: "/generated/compendium/backgrounds/void-touched.webp",
	Guardian: "/generated/compendium/monsters/companion-spectral-knight.webp",
	Mutant: "/generated/compendium/monsters/companion-void-walker.webp",
	Repository: "/generated/compendium/jobs/artificer.webp",
	"Beast Companion":
		"/generated/compendium/monsters/companion-chronal-hound.webp",
};

const SPECIAL_SANDBOX_NPC_IMAGE_URLS: Record<string, string> = {
	"npc-anom-001": "/generated/compendium/backgrounds/void-touched.webp",
	"npc-anom-002":
		"/generated/compendium/monsters/companion-spectral-knight.webp",
	"npc-anom-003": "/generated/compendium/monsters/companion-void-walker.webp",
	"npc-anom-004": "/generated/compendium/backgrounds/time-walker.webp",
	"npc-anom-005": "/generated/compendium/jobs/artificer.webp",
	"npc-anom-006": "/generated/compendium/monsters/companion-chronal-hound.webp",
	"npc-ind-004": "/generated/compendium/backgrounds/gate-survivor.webp",
	"npc-ind-006": "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	"npc-verm-009": "/generated/compendium/jobs/bard.webp",
};

const FACTION_FALLBACK_IMAGE_URLS: Record<string, string> = {
	bureau_sentinels:
		"/generated/compendium/backgrounds/hunter-academy-graduate.webp",
	vermillion_guild: "/generated/compendium/backgrounds/guild-master.webp",
	awoko_cult: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
	independent: "/generated/compendium/backgrounds/gate-survivor.webp",
	anomaly_adjacent: "/generated/compendium/backgrounds/void-touched.webp",
};

export const SHADOW_REGENT_TOKEN_IMAGE_URL =
	"/generated/compendium/monsters/mount-dire-shadow-wolf.webp";

export const SHADOW_SOLDIER_TOKEN_IMAGE_URL =
	"/generated/compendium/monsters/companion-spectral-knight.webp";

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

	if (normalizedSceneName.includes("tattoo")) {
		return ["npc-verm-009", "npc-verm-005", "npc-verm-001"];
	}

	if (normalizedSceneName.includes("slums")) {
		return ["npc-ind-001", "npc-ind-002", "npc-ind-007"];
	}

	if (normalizedSceneName.includes("briefing hall")) {
		return ["npc-bureau-001", "npc-bureau-003", "npc-bureau-007"];
	}

	if (normalizedSceneName.includes("memory-care")) {
		return ["npc-bureau-004", "npc-ind-001", "npc-ind-004"];
	}

	if (
		normalizedSceneName.includes("vermillion") ||
		normalizedSceneName.includes("bazaar")
	) {
		return ["npc-verm-001", "npc-verm-002", "npc-verm-008"];
	}

	return ["npc-bureau-001", "npc-bureau-002", "npc-bureau-007"];
}
