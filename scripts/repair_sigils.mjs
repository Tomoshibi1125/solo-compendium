import fs from "node:fs";

const filePath = "src/data/compendium/sigils.ts";
let content = fs.readFileSync(filePath, "utf8");

console.log("Initial file length:", content.length);

// 1. Remove the corrupted top part (everything before sigil-fire-accessory-4)
const midPoint = content.indexOf('id: "sigil-fire-accessory-4"');
if (midPoint !== -1) {
	const entryStart = content.lastIndexOf("{", midPoint);
	if (entryStart !== -1) {
		content = content.substring(entryStart);
	}
}

// 2. Prepend the correct header and first 3 entries
const header = `interface SigilEntry {
	id: string;
	name: string;
	description: string;
	effect_description: string;
	rune_type: string;
	rune_category: string;
	rune_level: number;
	rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";
	effect_type: "active" | "passive" | "both";
	requires_level?: number;
	passive_bonuses?: Record<string, unknown>;
	active_feature?: Record<string, unknown>;
	can_inscribe_on?: string[];
	inscription_difficulty?: number;
	tags?: string[];
	image?: string;
	source_book?: string;
	mechanics?: any;
	stats?: any;
	uses_per_rest?: string | null;
}

export const sigils: SigilEntry[] = [
	{
		id: "sigil-fire-weapon-1",
		name: "Sigil of Fire Strikes",
		description: "This sovereign skill-stone teaches the target how to mandate the local authority-sigil. For those without an innate mana-heart, the stone provides a fixed usage lattice, allowing the technique to be manifested through the stone's residual resonance.",
		effect_description: "Your weapon attacks deal an extra 1d6 fire damage. Once per short rest, you can unleash a 'Searing Burst' on hit, dealing an extra 1d6 fire damage and forcing the target to make a DC 13 Strength check or be knocked prone by the thermal shock.",
		rune_type: "offensive",
		rune_category: "Combat",
		rune_level: 2,
		rarity: "uncommon",
		effect_type: "both",
		requires_level: 2,
		can_inscribe_on: ["weapon"],
		inscription_difficulty: 12,
		passive_bonuses: {
			damage_bonus: "1d6 fire",
		},
		active_feature: {
			name: "Searing Burst",
			description: "When you hit with this weapon, add 1d6 fire damage and knock the target prone (DC 13 Str check).",
			action_type: "bonus-action",
			damage: "1d6 fire",
			resolution: "DC 13 Str check",
		},
		tags: ["fire", "sigil", "weapon"],
		image: "/generated/sigils/fire-sigil.webp",
		mechanics: {
			"stat_bonuses": { "Presence": 1 },
			"resistance": ["force"],
			"special": "Aligned with Absolute resonance."
		},
		uses_per_rest: "2/long rest (non-casters)"
	},
	{
		id: "sigil-fire-armor-2",
		name: "Sigil of Fire Bulwark",
		description: "This sovereign skill-stone teaches the target how to mandate the local authority-sigil. For those without an innate mana-heart, the stone provides a fixed usage lattice, allowing the technique to be manifested through the stone's residual resonance.",
		effect_description: "Grants resistance to fire damage. Once per long rest, you can activate 'Inferno Aura' as a bonus action. For 1 minute, any creature that starts its turn within 5 feet of you takes 2d6 fire damage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 4,
		rarity: "rare",
		effect_type: "both",
		requires_level: 4,
		can_inscribe_on: ["armor"],
		inscription_difficulty: 14,
		passive_bonuses: {
			traits: ["Resistance to Fire damage"],
		},
		active_feature: {
			name: "Inferno Aura",
			description: "For 1 minute, enemies within 5ft take 2d6 fire damage at the start of their turn.",
			action_type: "bonus-action",
			duration: "1 minute",
			damage: "2d6 fire",
		},
		tags: ["fire", "sigil", "armor"],
		image: "/generated/sigils/fire-sigil.webp",
		mechanics: {
			"stat_bonuses": { "Presence": 1 },
			"resistance": ["force"],
			"special": "Aligned with Absolute resonance."
		},
		uses_per_rest: "2/long rest (non-casters)"
	},
	{
		id: "sigil-fire-shield-3",
		name: "Sigil of Fire Deflection",
		description: "A heavy basalt plate inscribed with the geometry of a dying star. When inscribed on a shield, it absorbs kinetic force and vents it as a solar flare.",
		effect_description: "When you block an attack, you can use your reaction to emit a burst of flame. Attackers within 5 feet must make a DC 30 Agility check or take 3d8 fire damage.",
		rune_type: "defensive",
		rune_category: "Defense",
		rune_level: 8,
		rarity: "legendary",
		effect_type: "passive",
		requires_level: 8,
		can_inscribe_on: ["shield"],
		inscription_difficulty: 23,
		active_feature: {
			name: "Nova Deflection",
			description: "As a reaction when you block an attack, emit a blinding solar flare. All creatures in a 15ft cone must make a DC 20 Agility check or take 4d8 fire damage and be blinded until the end of your next turn.",
			action_type: "reaction",
			range: "15 ft cone",
			target: "All in cone",
			resolution: "DC 20 Agility check",
			damage: "4d8 fire",
			condition: "Blinded",
		},
		tags: ["fire", "sigil", "shield"],
		image: "/generated/sigils/fire-sigil.webp",
		mechanics: {
			"stat_bonuses": { "Presence": 1 },
			"resistance": ["force"],
			"special": "Aligned with Absolute resonance."
		},
		uses_per_rest: "2/long rest (non-casters)"
	}`;

content = `${header},\n\t${content}`;

// 3. Fix double commas
content = content.replace(/,,/g, ",");

// 4. Fix duplicate requires_level and trailing commas/syntax errors
// The duplicate looks like: requires_level: 15,\n\t\teffect_type: "...",\n\t\trequires_level: 2,
content = content.replace(
	/requires_level: 15,\s*(effect_type: "[^"]+",)\s*requires_level: (\d+),/g,
	"$1\n\t\trequires_level: $2,",
);

// 5. Final array closing (ensure it ends with ];)
if (!content.trim().endsWith("];")) {
	content = content.trim();
	if (content.endsWith("}")) {
		content += "\n];";
	} else if (content.endsWith(",")) {
		content = `${content.slice(0, -1)}\n];`;
	}
}

fs.writeFileSync(filePath, content);
console.log("Repair script finished. Final file length:", content.length);
