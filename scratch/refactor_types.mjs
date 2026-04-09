import fs from 'fs';

const TYPES_PATH = 'c:/Users/jjcal/Documents/solo-compendium/src/types/compendium.ts';

function refactorTypes() {
    console.log('Refactoring Compendium Types via script...');
    let content = fs.readFileSync(TYPES_PATH, 'utf8');

    // Refactor CompendiumRune
    const runePattern = /export interface CompendiumRune extends BaseCompendiumItem {[\s\S]*?}/;
    const runeReplacement = `export interface CompendiumRune extends BaseCompendiumItem {
	effect_description: string;
	aliases?: string[];
	rune_type: "martial" | "caster" | "hybrid" | "utility" | "offensive" | "defensive";
	rune_category?: string;
	effect_type?: "active" | "passive" | "both";
	activation_action?: string;
	activation_cost?: string;
	activation_cost_amount?: number;
	duration?: string;
	range?: string;
	concentration?: boolean;
	uses_per_rest?: string;
	recharge?: string;
	higher_levels?: string;
	discovery_lore?: string;
}`;
    content = content.replace(runePattern, runeReplacement);

    // Refactor/Add CompendiumSigil
    const sigilPattern = /export interface CompendiumSigil extends BaseCompendiumItem {[\s\S]*?}/;
    const sigilReplacement = `export interface CompendiumSigil extends BaseCompendiumItem {
	passive_bonuses: Record<string, number | string | string[]>;
	can_inscribe_on: string[];
	rarity: string;
	tags: string[];
}`;
    if (sigilPattern.test(content)) {
        content = content.replace(sigilPattern, sigilReplacement);
    } else {
        // Find a good place to insert it if missing (e.g., after CompendiumRune)
        content = content.replace(runeReplacement, `${runeReplacement}\n\n${sigilReplacement}`);
    }

    // Ensure CompendiumSigil is in CompendiumEntity union
    if (!content.includes('| CompendiumSigil')) {
        content = content.replace(/\| CompendiumDeity/, '| CompendiumDeity\n\t| CompendiumSigil');
    }

    fs.writeFileSync(TYPES_PATH, content, 'utf8');
    console.log('Compendium Types refactored successfully.');
}

try {
    refactorTypes();
} catch (error) {
    console.error('Error refactoring types:', error);
}
