/**
 * SANDBOX LOOT TABLES - The Shadow of the Regent
 */

export type SandboxLootRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface SandboxLootEntry {
	name: string;
	rarity: "common" | "uncommon" | "rare" | "very-rare" | "legendary";
	weight: number;
	description: string;
}

export interface SandboxLootTable {
	id: string;
	rank: SandboxLootRank;
	title: string;
	description: string;
	entries: SandboxLootEntry[];
}

export const sandboxLootTables: SandboxLootTable[] = [
	{
		id: "loot-e",
		rank: "E",
		title: "E-Rank Loot - Threshold Scraps",
		description: "Early Gloamreach finds: practical, ugly, and half-spent.",
		entries: [
			{ name: "Cracked AFA Battery", rarity: "common", weight: 30, description: "Restores one failed route ping or powers a relay for one scene." },
			{ name: "Clean Essence Ampoule", rarity: "common", weight: 25, description: "Trade good or emergency stabilizer for one medicine check." },
			{ name: "Roadward Chalk", rarity: "common", weight: 20, description: "Marks a path that tax hounds cannot track for one travel leg." },
			{ name: "Splinter Rune", rarity: "uncommon", weight: 15, description: "One-use burst of force or barrier at Warden discretion." },
			{ name: "Thornwake Meal Token", rarity: "uncommon", weight: 10, description: "Buys food or trust in the first settlement." },
		],
	},
	{
		id: "loot-d",
		rank: "D",
		title: "D-Rank Loot - Bastion and Camp",
		description: "Recovered expedition gear and Vermillion salvage.",
		entries: [
			{ name: "Bureau Foil Seal", rarity: "uncommon", weight: 25, description: "Stabilizes a corrupted door, wound, or Relic for one scene." },
			{ name: "Vermillion Suture Kit", rarity: "uncommon", weight: 20, description: "Heals a serious injury if clean Essence is spent." },
			{ name: "AFA Route Spike", rarity: "uncommon", weight: 20, description: "Pins one safe route on the Gallows Road." },
			{ name: "Patrol Mask Fragment", rarity: "rare", weight: 15, description: "Grants advantage on one deception against court Anomalies." },
			{ name: "Glassvine Sap Vial", rarity: "rare", weight: 10, description: "Potion component; heals well but leaves thorn scarring." },
		],
	},
	{
		id: "loot-c",
		rank: "C",
		title: "C-Rank Loot - Mill and Works",
		description: "Rewards from the Domain's production organs.",
		entries: [
			{ name: "Malformed Core", rarity: "rare", weight: 25, description: "High-value Essence source; unstable if carried through Red Phase weather." },
			{ name: "Root-Script Sigil", rarity: "rare", weight: 20, description: "Lets an Ascendant command plant matter for one encounter." },
			{ name: "Rendering Hook", rarity: "rare", weight: 15, description: "Weapon Relic that harms Anomalies and injures the wielder on critical hits." },
			{ name: "Crown Thorn", rarity: "very-rare", weight: 10, description: "Fragment of the Crown of Thorns; points toward the full Relic." },
			{ name: "Essence Mill Key", rarity: "very-rare", weight: 5, description: "Opens a sealed service road beneath the Mill." },
		],
	},
	{
		id: "loot-b",
		rank: "B",
		title: "B-Rank Loot - Oath and Choir",
		description: "Relics taken from oath-sites and tribute rites.",
		entries: [
			{ name: "Aegis Iron Plate", rarity: "rare", weight: 25, description: "Armor component that can bind one promise into protection." },
			{ name: "Copper Choir Mask", rarity: "rare", weight: 20, description: "Amplifies Presence checks and attracts court attention." },
			{ name: "Oathfire Rune", rarity: "very-rare", weight: 15, description: "One-use ward against a Citadel patrol." },
			{ name: "Bell Clapper Shard", rarity: "very-rare", weight: 10, description: "Fragment of the Choir Bell; resonates near tribute law." },
			{ name: "Knight's Last Core", rarity: "very-rare", weight: 5, description: "Can power the White Heron Seal or an Aegis Relic craft." },
		],
	},
	{
		id: "loot-a",
		rank: "A",
		title: "A-Rank Loot - Vault and Crown",
		description: "High-risk rewards that change the final assault.",
		entries: [
			{ name: "Black Vault Key", rarity: "legendary", weight: 5, description: "Anchor Relic. Opens forbidden doors and invites Subject Zero pressure." },
			{ name: "Beast Crown Fang", rarity: "legendary", weight: 5, description: "Anchor Relic. Redirects predator law in the Citadel." },
			{ name: "Zero-Pressure Shard", rarity: "very-rare", weight: 15, description: "Suppresses one Regent law for a scene; advances pressure if abused." },
			{ name: "Apex Hide Mantle", rarity: "very-rare", weight: 15, description: "Advantage on stealth and survival in predator regions." },
			{ name: "Forbidden Route Map", rarity: "rare", weight: 20, description: "Reveals one dangerous Citadel approach." },
		],
	},
	{
		id: "loot-s",
		rank: "S",
		title: "S-Rank Loot - Anchor Spoils",
		description: "Rewards tied to the campaign ending.",
		entries: [
			{ name: "Regent Anchor Core", rarity: "legendary", weight: 5, description: "Proof that the Gate is cleared; dangerous beyond price." },
			{ name: "Citadel Law Fragment", rarity: "legendary", weight: 10, description: "Relic material for a Warden-gated campaign sequel." },
			{ name: "White Heron Seal Plate", rarity: "very-rare", weight: 15, description: "Records the sealing method if the party learned it." },
			{ name: "Gloamreach Ash", rarity: "rare", weight: 25, description: "Crafting reagent left by a collapsed Domain." },
			{ name: "Court Mask of the Fallen Regent", rarity: "legendary", weight: 5, description: "A trophy that may not stay quiet." },
		],
	},
];
