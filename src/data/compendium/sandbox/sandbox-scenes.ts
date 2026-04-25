import {
	getSandboxHubNpcIds,
	getSandboxNpcPortraitUrl,
	SHADOW_REGENT_TOKEN_IMAGE_URL,
	SHADOW_SOLDIER_TOKEN_IMAGE_URL,
} from "@/data/compendium/sandbox/sandbox-asset-resolver";
import { sandboxRecruitableNPCs } from "@/data/compendium/sandbox-npcs";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

// ============================================================================
// THE SHADOW OF THE REGENT — VTT SCENES
// Map configurations and token placement for the Virtual Tabletop
// ============================================================================

type TokenOptions = {
	imageOverride?: string;
	portraitUrl?: string;
	tokenType?: VTTTokenInstance["tokenType"];
};

const SANDBOX_NPC_BY_ID = new Map(
	sandboxRecruitableNPCs.map((npc) => [npc.id, npc] as const),
);

function createToken(
	id: string,
	anomalyId: string,
	name: string,
	x: number,
	y: number,
	size: "small" | "medium" | "large" | "huge",
	options?: TokenOptions,
): VTTTokenInstance {
	const imageUrl =
		options?.imageOverride ||
		`/generated/compendium/anomalies/${anomalyId}.webp`;

	return {
		id,
		tokenType: options?.tokenType || "Anomaly",
		name,
		x,
		y,
		size,
		rotation: 0,
		layer: 1,
		locked: false,
		visible: true,
		imageUrl,
		portrait_url: options?.portraitUrl || imageUrl,
	};
}

function getRandomAnomalyId() {
	const id = Math.floor(Math.random() * 243) + 1;
	return `anomaly-${String(id).padStart(4, "0")}`;
}

const HUB_TOKEN_POSITIONS = [
	{ x: 15, y: 15 },
	{ x: 22, y: 20 },
	{ x: 28, y: 15 },
];

function createSandboxNpcToken(
	tokenId: string,
	npcId: string,
	x: number,
	y: number,
): VTTTokenInstance | null {
	const npc = SANDBOX_NPC_BY_ID.get(npcId);
	if (!npc) return null;

	const portraitUrl = getSandboxNpcPortraitUrl(npc);

	return createToken(tokenId, "anomaly-0001", npc.name, x, y, "medium", {
		imageOverride: portraitUrl,
		portraitUrl,
		tokenType: "npc",
	});
}

// Map configuration array — one per major location
const mapConfigs = [
	{
		name: "Hub: Bureau District Headquarters",
		image: "hub_map.png",
		audio: "ambient_bunker.mp3",
		type: "hub" as const,
	},
	{
		name: "Hub: Vermillion Guild Hall & Bazaar",
		image: "bazaar_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Gate: The Hollow Subway (E-Rank)",
		image: "subway_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Drowned Ward (D-Rank)",
		image: "hospital_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Fungal Depths (D-Rank)",
		image: "overgrown_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Verdant Overgrowth (C-Rank)",
		image: "overgrown_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Ashen Vault (C-Rank)",
		image: "downtown_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Sunken Tunnels (B-Rank)",
		image: "sewer_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Frozen Citadel (B-Rank)",
		image: "citadel_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Obsidian Spire (A-Rank)",
		image: "citadel_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Gate: The Regent's Domain (S-Rank)",
		image: "throne_map.png",
		audio: "ambient_boss.mp3",
		type: "boss" as const,
	},
	// ── Phase 3 Scenes (Memory-Care Wing, Bureau/Vermillion keyed, Awoko, Slums, Mana Veins, Megadungeon floors)
	{
		name: "Day Zero: Memory-Care Wing Exterior",
		image: "hospital_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Day Zero: The Diagnosed's Mirror (R5)",
		image: "hospital_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Hub: Bureau HQ — Briefing Hall (Ch. 29 R3)",
		image: "bunker_map.png",
		audio: "ambient_bunker.mp3",
		type: "hub" as const,
	},
	{
		name: "Hub: Vermillion — Tattoo & Sigil Parlour (Ch. 30 R4-5)",
		image: "bazaar_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Outer Slums: Covered Market (Ch. 31 Location 2)",
		image: "slums_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Mana Vein Node 3: Hana Financial Tower SB-3 (Ch. 32)",
		image: "sewer_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Awoko Sanctum: The Nave (Ch. 33 S-3)",
		image: "citadel_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Megadungeon Floor −1: Outer Mausoleum (Ch. 28 Rooms 1-5)",
		image: "citadel_map.png",
		audio: "ambient_boss.mp3",
		type: "combat" as const,
	},
	{
		name: "Megadungeon Floor −2: Archive of His Self (Ch. 28 Rooms 6-10)",
		image: "throne_map.png",
		audio: "ambient_boss.mp3",
		type: "combat" as const,
	},
];

export type SandboxVTTScene = VTTScene & {
	audioTracks?: { url: string; name: string }[];
};

export const sandboxVTTScenesExpanded: SandboxVTTScene[] = mapConfigs.map(
	(config, index) => {
		const isHub = config.type === "hub";
		const isBoss = config.type === "boss";

		const tokens: VTTTokenInstance[] = [];

		if (config.type === "combat") {
			// Gate maps: spawn 12-15 Anomaly tokens across the map
			const enemyCount = 12 + Math.floor(Math.random() * 4);
			for (let i = 0; i < enemyCount; i++) {
				tokens.push(
					createToken(
						`e-${index}-${i}`,
						getRandomAnomalyId(),
						"Gate Anomaly",
						Math.floor(Math.random() * 50),
						Math.floor(Math.random() * 50),
						"medium",
					),
				);
			}
		} else if (isBoss) {
			// Regent's Domain: guards + the Regent itself
			for (let i = 0; i < 6; i++) {
				tokens.push(
					createToken(
						`shadow-soldier-${i}`,
						getRandomAnomalyId(),
						"Shadow Soldier",
						10 + Math.floor(Math.random() * 40),
						10 + i * 5,
						"medium",
						{
							imageOverride: SHADOW_SOLDIER_TOKEN_IMAGE_URL,
							portraitUrl: SHADOW_SOLDIER_TOKEN_IMAGE_URL,
							tokenType: "npc",
						},
					),
				);
			}
			tokens.push(
				createToken(
					"the-regent",
					getRandomAnomalyId(),
					"The Regent",
					30,
					30,
					"huge",
					{
						imageOverride: SHADOW_REGENT_TOKEN_IMAGE_URL,
						portraitUrl: SHADOW_REGENT_TOKEN_IMAGE_URL,
					},
				),
			);
		} else {
			getSandboxHubNpcIds(config.name).forEach((npcId, npcIndex) => {
				const position =
					HUB_TOKEN_POSITIONS[npcIndex] ||
					HUB_TOKEN_POSITIONS[HUB_TOKEN_POSITIONS.length - 1];
				const npcToken = createSandboxNpcToken(
					`npc-${index}-${npcId}`,
					npcId,
					position.x,
					position.y,
				);

				if (npcToken) {
					tokens.push(npcToken);
				}
			});
		}

		return {
			id: `scene-${index}`,
			name: config.name,
			width: 60,
			height: 60,
			gridSize: 70,
			gridType: "square",
			fogOfWar: !isHub,
			backgroundImage: `/generated/compendium/sandbox_assets/${config.image}`,
			audioTracks: [
				{
					url: `/generated/compendium/sandbox_assets/${config.audio}`,
					name: `${config.name} Audio`,
				},
			],
			tokens,
			drawings: [],
			annotations: [],
			walls: [],
			lights: [],
		};
	},
);
