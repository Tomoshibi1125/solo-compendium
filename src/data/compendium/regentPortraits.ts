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
		imageUrl: "/generated/compendium/regents/umbral-regent.webp",
		tags: ["regent", "umbral", "shadow", "death"],
	},
	{
		regentId: "radiant_regent",
		name: "Radiant Regent",
		imageUrl: "/generated/compendium/regents/radiant-regent.webp",
		tags: ["regent", "radiant", "flame", "light"],
	},
	{
		regentId: "steel_regent",
		name: "Steel Regent",
		imageUrl: "/generated/compendium/regents/steel-regent.webp",
		tags: ["regent", "steel", "iron", "defense"],
	},
	{
		regentId: "destruction_regent",
		name: "Destruction Regent",
		imageUrl: "/generated/compendium/regents/destruction-regent.webp",
		tags: ["regent", "destruction", "dragon", "apocalypse"],
	},
	{
		regentId: "war_regent",
		name: "War Regent",
		imageUrl: "/generated/compendium/regents/war-regent.webp",
		tags: ["regent", "war", "command", "shadow"],
	},
	{
		regentId: "frost_regent",
		name: "Frost Regent",
		imageUrl: "/generated/compendium/regents/frost-regent.webp",
		tags: ["regent", "frost", "ice", "winter"],
	},
	{
		regentId: "beast_regent",
		name: "Beast Regent",
		imageUrl: "/generated/compendium/regents/beast-regent.webp",
		tags: ["regent", "beast", "alpha", "wild"],
	},
	{
		regentId: "plague_regent",
		name: "Plague Regent",
		imageUrl: "/generated/compendium/regents/plague-regent.webp",
		tags: ["regent", "plague", "disease", "miasma"],
	},
	{
		regentId: "spatial_regent",
		name: "Spatial Regent",
		imageUrl: "/generated/compendium/regents/spatial-regent.webp",
		tags: ["regent", "space", "dimensional", "void"],
	},
	{
		regentId: "mimic_regent",
		name: "Mimic Regent",
		imageUrl: "/generated/compendium/regents/mimic-regent.webp",
		tags: ["regent", "mimic", "shapeshift", "adaptation"],
	},
	{
		regentId: "blood_regent",
		name: "Blood Regent",
		imageUrl: "/generated/compendium/regents/blood-regent.webp",
		tags: ["regent", "blood", "hemomancy", "sanguine"],
	},
	{
		regentId: "gravity_regent",
		name: "Gravity Regent",
		imageUrl:
			"/generated/compendium/regents/gravity-regent-generated-10x4ud5.webp",
		tags: ["regent", "gravity", "cosmic", "singularity"],
	},
];

const REGENT_PORTRAIT_URLS = Object.fromEntries(
	REGENT_PORTRAITS_DATA.map(({ regentId, imageUrl }) => [regentId, imageUrl]),
) as Record<string, string>;

export function getRegentPortraitUrl(regentId: string): string {
	return (
		REGENT_PORTRAIT_URLS[regentId.toLowerCase().replace(/-/g, "_")] ||
		"/generated/compendium/regents/gravity-regent.webp"
	);
}
