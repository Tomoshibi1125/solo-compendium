/**
 * SANDBOX LOOT TABLES — "The Shadow of the Regent"
 *
 * One loot table per threat rank (E through S). Entries are weighted; the
 * Warden rolls on the encounter's loot context to produce a specific drop.
 * Seeded as wiki articles with `category: "loot"`.
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
		title: "E-Rank Loot Table — Threshold Roads",
		description:
			"Low-tier drops from the Gate Threshold, Hollow Subway, and early Road of Writs encounters. These rewards should feel practical, fragile, and newly stained by Domain law.",
		entries: [
			{
				name: "Bureau Field Kit",
				rarity: "common",
				weight: 30,
				description:
					"Three emergency medical charges and a stabilizer injector. Useful, official, and not enough for what the Gloamreach is.",
			},
			{
				name: "Glow Rod Bundle",
				rarity: "common",
				weight: 25,
				description:
					"Six cold-light rods. They flicker near ledgers, toll-houses, and Regent invitations.",
			},
			{
				name: "Minor Anomaly Core",
				rarity: "common",
				weight: 20,
				description:
					"Tradeable at the Annex or Vermillion Outpost. Vermillion pays better; the Bureau asks better questions.",
			},
			{
				name: "Frayed Ward Patch",
				rarity: "uncommon",
				weight: 15,
				description:
					"Single-use patch that grants advantage on one save against fear, charm, or Regent-Marked dream pressure.",
			},
			{
				name: "Ticket Stub Relic",
				rarity: "uncommon",
				weight: 10,
				description:
					"A transit ticket that refuses to tear. Once, it lets the bearer pass a minor toll without paying a name.",
			},
		],
	},
	{
		id: "loot-d",
		rank: "D",
		title: "D-Rank Loot Table — Ledger and Growth",
		description:
			"Drops from the Drowned Ledgerfen, Fungal Depths, and low-rank Domain sites where records, illness, and secrets begin to grow teeth.",
		entries: [
			{
				name: "Surgical Sigil",
				rarity: "uncommon",
				weight: 25,
				description:
					"A clean white Sigil that restores a burst of health or stabilizes a Domain-touched injury. It smells faintly of ink.",
			},
			{
				name: "Mycelium Reagent",
				rarity: "uncommon",
				weight: 20,
				description:
					"A living fungal sample Mother Rust can use for medicine, poison resistance, or something ethically worse.",
			},
			{
				name: "Corrected Casualty File",
				rarity: "rare",
				weight: 10,
				description:
					"A Bureau file legally proving someone marked dead is still alive. Can contradict one minor Ledgerfen effect or open a Bureau trust scene.",
			},
			{
				name: "Brine Salve",
				rarity: "common",
				weight: 30,
				description:
					"Ends one mundane disease or grants advantage on one save against rot, poison, or contaminated water.",
			},
			{
				name: "Awoko Comfort Pamphlet",
				rarity: "common",
				weight: 15,
				description:
					"A grief-soaked pamphlet offering help in language that is almost kind. Foreshadows the Hollow Mother's inheritance theology.",
			},
		],
	},
	{
		id: "loot-c",
		rank: "C",
		title: "C-Rank Loot Table — Orchard and Ash",
		description:
			"Mid-tier rewards from the Remembering Orchard, Ashen Counting-House, and settlement tribute sites. First rare story-facing drops appear here.",
		entries: [
			{
				name: "Memory Fruit",
				rarity: "rare",
				weight: 15,
				description:
					"Answers one question about a person, Claim, or settlement truth when eaten. The eater also receives a memory that was not theirs.",
			},
			{
				name: "Fireweave Rune",
				rarity: "uncommon",
				weight: 25,
				description:
					"A short-lived combat Rune that adds fire damage or suppresses regeneration for one encounter.",
			},
			{
				name: "Ledger Hook",
				rarity: "rare",
				weight: 10,
				description:
					"Pulls one hidden name from a document. The document then learns one name from the wielder.",
			},
			{
				name: "Orchard Knife",
				rarity: "uncommon",
				weight: 20,
				description:
					"A pruning blade that can cut memory-fruit safely. Against oathbreakers, it leaves wounds shaped like handwriting.",
			},
			{
				name: "Empty Witness Vessel",
				rarity: "very-rare",
				weight: 5,
				description:
					"Can hold one testimony, ghost-echo, or dying confession without distortion. Useful in the Throne Court.",
			},
			{
				name: "Rare Anomaly Core",
				rarity: "rare",
				weight: 15,
				description:
					"Valuable to both Bureau researchers and Vermillion brokers. Spending it says something about the party's priorities.",
			},
			{
				name: "Cultist Diary of Inheritance",
				rarity: "rare",
				weight: 10,
				description:
					"Reveals that at least one Awoko ritualist understands the Hollow Mother intends to inherit the Domain rather than serve the Regent.",
			},
		],
	},
	{
		id: "loot-b",
		rank: "B",
		title: "B-Rank Loot Table — Oath and Pressure",
		description:
			"High-mid tier rewards from the Sunken Tunnels, Bastion Golemfall, Mana Vein nodes, and other sites where debts survive death.",
		entries: [
			{
				name: "Pressure Sigil",
				rarity: "rare",
				weight: 20,
				description:
					"Grants water breathing, swim speed, or pressure resistance for one major scene.",
			},
			{
				name: "Oath-Forge Fragment",
				rarity: "rare",
				weight: 15,
				description:
					"A piece of Bastion iron still warm with duty. Can upgrade armor, shields, or a defensive Relic.",
			},
			{
				name: "Awoko Herald's Letter",
				rarity: "rare",
				weight: 10,
				description:
					"A letter proving the cult knows the word inherit. Opens the Sister Veil defection path or weakens the Hollow Mother's public claim.",
			},
			{
				name: "Writ-Knife",
				rarity: "very-rare",
				weight: 5,
				description:
					"Cuts written contracts and false charges. It cannot cut flesh unless the target has broken an oath.",
			},
			{
				name: "Bureau Signet Ring",
				rarity: "rare",
				weight: 15,
				description:
					"Grants Bureau leverage when shown openly. Inside the Gloamreach, it also marks the wearer as someone who believes in outside authority.",
			},
			{
				name: "Aether-Charged Crystal",
				rarity: "rare",
				weight: 25,
				description:
					"Recharges one Sigil, Rune, or Relic use once per long rest. It pulses near Mana Vein nodes.",
			},
			{
				name: "Map to a Settlement Cache",
				rarity: "uncommon",
				weight: 10,
				description:
					"Leads to food, medicine, and survival gear hidden by people who may need it more than the party does.",
			},
		],
	},
	{
		id: "loot-a",
		rank: "A",
		title: "A-Rank Loot Table — Spire and Precedent",
		description:
			"High-tier rewards from the Obsidian Spire, Forbidden Vault, and late-campaign Claim race. Legendary drops become possible, but costs should become explicit.",
		entries: [
			{
				name: "Obsidian Prism",
				rarity: "legendary",
				weight: 5,
				description:
					"Requires the Spire's trial to be resolved without choosing domination. Grants a reflection-based defensive reaction or reveals one false authority.",
			},
			{
				name: "Mirror-Self Shard",
				rarity: "very-rare",
				weight: 15,
				description:
					"Once per long rest, answer an attack or accusation with the version of yourself that almost made the opposite choice.",
			},
			{
				name: "Citadel Iron Plate",
				rarity: "very-rare",
				weight: 10,
				description:
					"A material component for Claim-safe housings, defensive Sigils, or armor that resists Regent court pressure.",
			},
			{
				name: "Unopened Commendation",
				rarity: "rare",
				weight: 15,
				description:
					"Addressed to a name reality struggles to preserve. Can trigger the Regent's Human Remnant phase if paired with other proof.",
			},
			{
				name: "Awoko Grief-Tattoo",
				rarity: "rare",
				weight: 15,
				description:
					"A dangerous tattoo that grants advantage against fear or despair, but lets the Warden call for one grief-based complication later.",
			},
			{
				name: "Relic Forge Pattern",
				rarity: "rare",
				weight: 25,
				description:
					"Combines three compatible fragments into a complete Relic or stabilizes one Claim for safer use.",
			},
			{
				name: "Bureau Prosthesis Blueprint",
				rarity: "rare",
				weight: 15,
				description:
					"Crafting pattern for mana-reinforced prosthetics designed for Domain survivors, not clean laboratory subjects.",
			},
		],
	},
	{
		id: "loot-s",
		rank: "S",
		title: "S-Rank Loot Table — Anchor Resolution",
		description:
			"Campaign-ending rewards. Choose results according to whether the party breaks, seals, transforms, or inherits the Anchor. The ending matters more than random weight.",
		entries: [
			{
				name: "Regent's Edge",
				rarity: "legendary",
				weight: 20,
				description:
					"A weaponized shard of the broken Anchor. Best suited to a Break ending. Powerful, unstable, and remembered by every road.",
			},
			{
				name: "Sovereign Aegis",
				rarity: "legendary",
				weight: 20,
				description:
					"A protective Relic formed by sealing, not destroying, the Anchor. It carries restraint as part of its power.",
			},
			{
				name: "Origin Reliquary",
				rarity: "legendary",
				weight: 15,
				description:
					"A transformed Anchor vessel that preserves one old law and rewrites another. Campaign-defining and sequel-facing.",
			},
			{
				name: "Shadow Regent's Mantle",
				rarity: "legendary",
				weight: 15,
				description:
					"A dark authority mantle from an Inherit ending. Treat as dangerous power, not clean reward.",
			},
			{
				name: "Archive Mirror Shard",
				rarity: "very-rare",
				weight: 15,
				description:
					"Preserves one true memory, testimony, or name from being altered by Domain law.",
			},
			{
				name: "The Regent's Circlet",
				rarity: "very-rare",
				weight: 10,
				description:
					"A crown-fragment that grants authority at the cost of attention. Requires the bearer to answer one question of ownership before attunement.",
			},
			{
				name: "Anchor Fragment",
				rarity: "very-rare",
				weight: 5,
				description:
					"Raw Anchor material. Ten fragments can craft one Regent-tier Relic, but every crafting attempt creates a legal echo.",
			},
		],
	},
];
