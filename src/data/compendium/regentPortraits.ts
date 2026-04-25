export interface RegentPortraitDescriptor {
	regentId: string;
	name: string;
	imageUrl: string;
	tags: string[];
}

export const REGENT_PORTRAITS_DATA: RegentPortraitDescriptor[] = [
	{
		regentId: "umbral_regent",
		name: "Umbral Regent",
		imageUrl: "/generated/compendium/backgrounds/shadow-realm-exile.webp",
		tags: ["regent", "umbral", "shadow", "death"],
	},
	{
		regentId: "radiant_regent",
		name: "Radiant Regent",
		imageUrl: "/generated/compendium/backgrounds/bringer-of-dawn.webp",
		tags: ["regent", "radiant", "flame", "light"],
	},
	{
		regentId: "steel_regent",
		name: "Steel Regent",
		imageUrl: "/generated/compendium/jobs/paladin.webp",
		tags: ["regent", "steel", "iron", "defense"],
	},
	{
		regentId: "destruction_regent",
		name: "Destruction Regent",
		imageUrl: "/generated/compendium/monsters/companion-spirit-guardian.webp",
		tags: ["regent", "destruction", "dragon", "apocalypse"],
	},
	{
		regentId: "war_regent",
		name: "War Regent",
		imageUrl: "/generated/compendium/monsters/mount-dire-shadow-wolf.webp",
		tags: ["regent", "war", "command", "shadow"],
	},
	{
		regentId: "frost_regent",
		name: "Frost Regent",
		imageUrl: "/generated/compendium/monsters/companion-frost-wyrmling.webp",
		tags: ["regent", "frost", "ice", "winter"],
	},
	{
		regentId: "beast_regent",
		name: "Beast Regent",
		imageUrl: "/generated/compendium/monsters/companion-thorn-beast.webp",
		tags: ["regent", "beast", "alpha", "wild"],
	},
	{
		regentId: "plague_regent",
		name: "Plague Regent",
		imageUrl: "/generated/compendium/monsters/companion-plague-hound.webp",
		tags: ["regent", "plague", "disease", "miasma"],
	},
	{
		regentId: "spatial_regent",
		name: "Spatial Regent",
		imageUrl: "/generated/compendium/backgrounds/time-walker.webp",
		tags: ["regent", "space", "dimensional", "void"],
	},
	{
		regentId: "mimic_regent",
		name: "Mimic Regent",
		imageUrl: "/generated/compendium/monsters/companion-void-walker.webp",
		tags: ["regent", "mimic", "shapeshift", "adaptation"],
	},
	{
		regentId: "blood_regent",
		name: "Blood Regent",
		imageUrl: "/generated/compendium/monsters/companion-blood-boar.webp",
		tags: ["regent", "blood", "hemomancy", "sanguine"],
	},
	{
		regentId: "gravity_regent",
		name: "Gravity Regent",
		imageUrl: "/generated/compendium/backgrounds/cosmic-wanderer.webp",
		tags: ["regent", "gravity", "cosmic", "singularity"],
	},
];

const REGENT_PORTRAIT_URLS = Object.fromEntries(
	REGENT_PORTRAITS_DATA.map(({ regentId, imageUrl }) => [regentId, imageUrl]),
) as Record<string, string>;

export function getRegentPortraitUrl(regentId: string): string {
	return (
		REGENT_PORTRAIT_URLS[regentId.toLowerCase().replace(/-/g, "_")] ||
		"/generated/compendium/backgrounds/shadow-realm-exile.webp"
	);
}
