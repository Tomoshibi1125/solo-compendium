import {
	getSandboxHubNpcIds,
	getSandboxNpcPortraitUrl,
	SHADOW_REGENT_TOKEN_IMAGE_URL,
	SHADOW_SOLDIER_TOKEN_IMAGE_URL,
} from "@/data/compendium/sandbox/sandbox-asset-resolver";
import { sandboxRecruitableNPCs } from "@/data/compendium/sandbox-npcs";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

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
	{ x: 34, y: 22 },
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

const mapConfigs = [
	{
		name: "Day Zero: Memory-Care Wing Exterior",
		image: "bunker_map.png",
		audio: "ambient_bunker.mp3",
		type: "hub" as const,
	},
	{
		name: "Day Zero: The Diagnosed's Mirror (R5)",
		image: "sewer_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Bureau Domain Response Annex",
		image: "bunker_map.png",
		audio: "ambient_bunker.mp3",
		type: "hub" as const,
	},
	{
		name: "Rift Threshold",
		image: "bunker_map.png",
		audio: "ambient_bunker.mp3",
		type: "combat" as const,
	},
	{
		name: "The Hollow Way",
		image: "sewer_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Road of Writs",
		image: "downtown_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Writ-Bound Hamlet",
		image: "slums_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Vermillion Outpost",
		image: "bazaar_map.png",
		audio: "ambient_explore.mp3",
		type: "hub" as const,
	},
	{
		name: "Drowned Ledgerfen",
		image: "sewer_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Fungal Depths",
		image: "overgrown_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Remembering Orchard",
		image: "overgrown_map.png",
		audio: "ambient_explore.mp3",
		type: "combat" as const,
	},
	{
		name: "Ashen Counting-House",
		image: "downtown_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "Sunken Tunnels",
		image: "sewer_map.png",
		audio: "ambient_subway.mp3",
		type: "combat" as const,
	},
	{
		name: "Bastion Golemfall",
		image: "citadel_map.png",
		audio: "ambient_combat.mp3",
		type: "hub" as const,
	},
	{
		name: "Awoko Sanctum",
		image: "throne_map.png",
		audio: "ambient_boss.mp3",
		type: "hub" as const,
	},
	{
		name: "Obsidian Spire",
		image: "citadel_map.png",
		audio: "ambient_boss.mp3",
		type: "hub" as const,
	},
	{
		name: "Road of Final Writs",
		image: "downtown_map.png",
		audio: "ambient_combat.mp3",
		type: "combat" as const,
	},
	{
		name: "The Regent's Citadel",
		image: "citadel_map.png",
		audio: "ambient_boss.mp3",
		type: "combat" as const,
	},
	{
		name: "Throne Court",
		image: "throne_map.png",
		audio: "ambient_boss.mp3",
		type: "boss" as const,
	},
	{
		name: "Anchor-Undercroft",
		image: "throne_map.png",
		audio: "ambient_boss.mp3",
		type: "boss" as const,
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
			const enemyCount = 8 + Math.floor(Math.random() * 4);
			for (let i = 0; i < enemyCount; i++) {
				tokens.push(
					createToken(
						`e-${index}-${i}`,
						getRandomAnomalyId(),
						"Gloamreach Domain Anomaly",
						Math.floor(Math.random() * 50),
						Math.floor(Math.random() * 50),
						"medium",
					),
				);
			}
		} else if (isBoss) {
			for (let i = 0; i < 6; i++) {
				tokens.push(
					createToken(
						`regent-courtier-${i}`,
						getRandomAnomalyId(),
						"Regent Courtier",
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
						tokenType: "npc",
					},
				),
			);
		} else if (isHub) {
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
