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
	Contractor: "/generated/compendium/jobs/Contractor-generated-kth97v.webp",
	Destroyer: "/generated/compendium/jobs/tank.webp",
	Esper: "/generated/compendium/jobs/warrior.webp",
	Herald: "/generated/compendium/jobs/healer.webp",
	"Holy Knight":
		"/generated/compendium/characters/character-character-holy-knight-p092r5.webp",
	Idol: "/generated/compendium/jobs/Idol-generated-3qxkaa.webp",
	Mage: "/generated/compendium/jobs/mage.webp",
	Stalker: "/generated/compendium/jobs/Stalker-generated-1kbwpn2.webp",
	Striker: "/generated/compendium/jobs/Striker-generated-sxicfg.webp",
	Summoner: "/generated/compendium/jobs/summoner.webp",
	Technomancer: "/generated/compendium/jobs/artificer.webp",
	Revenant: "/generated/compendium/jobs/Revenant-generated-106m11v.webp",
	Oracle:
		"/generated/compendium/backgrounds/location-background-time-walker-19yoxi.webp",
	Hybrid: "/generated/compendium/backgrounds/void-touched.webp",
	Guardian:
		"/generated/compendium/anomalies/anomaly-anomaly-companion-spectral-knight-43lqjm.webp",
	Mutant:
		"/generated/compendium/anomalies/anomaly-anomaly-companion-void-walker-6xcbrr.webp",
	Repository: "/generated/compendium/jobs/artificer.webp",
	"Beast Companion":
		"/generated/compendium/anomalies/anomaly-anomaly-companion-chronal-hound-vvly1o.webp",
	Unknown:
		"/generated/compendium/backgrounds/location-background-shadow-realm-exile-1nsqp5.webp",
	Civilian: "/generated/compendium/backgrounds/gate-survivor.webp",
};

const SPECIAL_SANDBOX_NPC_IMAGE_URLS: Record<string, string> = {
	"npc-bureau-001":
		"/generated/compendium/sandbox_npcs/commander-park-jae-won.webp",
	"npc-bureau-003":
		"/generated/compendium/sandbox_npcs/sergeant-yoon-hye-jin.webp",
	"npc-bureau-004": "/generated/compendium/sandbox_npcs/dr-serin-hayashi.webp",
	"npc-bureau-005": "/generated/compendium/jobs/Stalker-generated-1kbwpn2.webp",
	"npc-verm-001": "/generated/compendium/sandbox_npcs/rat-king-ji.webp",
	"npc-verm-004": "/generated/compendium/sandbox_npcs/guildmaster-orin.webp",
	"npc-awoko-001": "/generated/compendium/sandbox_npcs/the-hollow-mother.webp",
	"npc-awoko-004": "/generated/compendium/sandbox_npcs/sister-veil.webp",
	"npc-ind-003": "/generated/compendium/sandbox_npcs/mika-the-kid.webp",
	"npc-ind-004": "/generated/compendium/sandbox_npcs/old-man-crane.webp",
	"npc-ind-005": "/generated/compendium/sandbox_npcs/professor-lun.webp",
	"npc-ind-012":
		"/generated/compendium/sandbox_npcs/the-quiet-generated-1866qac.webp",
	"npc-anom-001": "/generated/compendium/backgrounds/void-touched.webp",
	"npc-anom-002": "/generated/compendium/sandbox_npcs/the-watcher.webp",
	"npc-anom-003":
		"/generated/compendium/sandbox_npcs/the-quiet-generated-103gwoz.webp",
	"npc-anom-004": "/generated/compendium/backgrounds/time-walker.webp",
	"npc-anom-005": "/generated/compendium/sandbox_npcs/the-catalog.webp",
	"npc-anom-006": "/generated/compendium/sandbox_npcs/the-quiet.webp",
};

const FACTION_FALLBACK_IMAGE_URLS: Record<string, string> = {
	bureau_sentinels: "/generated/compendium/backgrounds/gate-survivor.webp",
	vermillion_guild: "/generated/compendium/backgrounds/guild-master.webp",
	awoko_cult:
		"/generated/compendium/sandbox_npcs/the-quiet-generated-3svbkj.webp",
	independent: "/generated/compendium/backgrounds/gate-survivor.webp",
	anomaly_adjacent: "/generated/compendium/backgrounds/void-touched.webp",
};

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
