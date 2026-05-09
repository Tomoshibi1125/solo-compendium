import { powers } from "@/data/compendium/powers";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import type {
	CompendiumPower,
	CompendiumSpell,
	CompendiumTechnique,
	CompendiumRune as RuneCompendiumEntry,
} from "@/types/compendium";
import { runes_power_powers } from "./power-powers";
import { runes_a } from "./spell-rank-a";
import { runes_b } from "./spell-rank-b";
import { runes_c } from "./spell-rank-c";
import { spell_rank_d_runes } from "./spell-rank-d";
import { runes_s } from "./spell-rank-s";
import { technique_runes } from "./technique-techniques";

type RuneTeachKind = "spell" | "power" | "technique";

type AbilityEntry = CompendiumSpell | CompendiumPower | CompendiumTechnique;

const RUNE_CROSS_CLASS_TEXT =
	"Cross-Class Adaptation: If the learned ability is outside your native access (Job or unlocked Regent), uses per long rest = max(1, proficiency bonus + primary stat modifier + rune rarity bonus). Native-access abilities follow their normal recharge.";

const rawAuthoredRunes: RuneCompendiumEntry[] = [
	...spell_rank_d_runes,
	...runes_c,
	...runes_b,
	...runes_a,
	...runes_s,
	...runes_power_powers,
	...technique_runes,
];

function slugifyRuneRef(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function getAbilityLevel(kind: RuneTeachKind, entry: AbilityEntry): number {
	if (kind === "power") return (entry as CompendiumPower).power_level ?? 0;
	if (kind === "technique") {
		const technique = entry as CompendiumTechnique & { level?: number | null };
		return technique.level_requirement ?? technique.level ?? 0;
	}
	return (entry as CompendiumSpell).level ?? 0;
}

function getCoverageKeys(kind: RuneTeachKind, entry: AbilityEntry): string[] {
	return [entry.id, slugifyRuneRef(entry.name)].map((ref) => `${kind}:${ref}`);
}

function buildCanonicalRefMap(): Map<string, string> {
	const refs = new Map<string, string>();
	const add = (kind: RuneTeachKind, entry: AbilityEntry) => {
		for (const key of getCoverageKeys(kind, entry)) {
			refs.set(key, entry.id);
		}
	};
	spells.forEach((entry) => {
		add("spell", entry);
	});
	powers.forEach((entry) => {
		add("power", entry);
	});
	techniques.forEach((entry) => {
		add("technique", entry as CompendiumTechnique);
	});
	return refs;
}

const canonicalRefMap = buildCanonicalRefMap();

function normalizeAuthoredRuneTeaches(
	rune: RuneCompendiumEntry,
): RuneCompendiumEntry {
	const teaches = rune.teaches;
	if (!teaches?.ref) return rune;
	const canonicalRef =
		canonicalRefMap.get(`${teaches.kind}:${teaches.ref}`) ??
		canonicalRefMap.get(`${teaches.kind}:${slugifyRuneRef(teaches.ref)}`);
	if (!canonicalRef || canonicalRef === teaches.ref) return rune;
	return {
		...rune,
		teaches: {
			...teaches,
			ref: canonicalRef,
		},
	};
}

const authoredRunes: RuneCompendiumEntry[] = rawAuthoredRunes.map(
	normalizeAuthoredRuneTeaches,
);

function getExistingRuneCoverageKeys(
	runes: RuneCompendiumEntry[],
): Set<string> {
	const keys = new Set<string>();
	for (const rune of runes) {
		const teaches = rune.teaches;
		if (!teaches?.ref) continue;
		keys.add(`${teaches.kind}:${teaches.ref}`);
	}
	return keys;
}

function formatAbilityValue(value: unknown): string | null {
	if (typeof value === "string" && value.trim()) return value;
	if (typeof value === "number") return String(value);
	if (value && typeof value === "object" && !Array.isArray(value)) {
		const record = value as Record<string, unknown>;
		const amount = record.value ?? record.distance ?? record.time;
		const unit = record.unit ?? record.type;
		if (amount != null && unit != null) return `${amount} ${unit}`.trim();
		if (unit != null) return String(unit);
	}
	return null;
}

function getAbilityCategory(kind: RuneTeachKind, entry: AbilityEntry): string {
	if (kind === "spell") return (entry as CompendiumSpell).school ?? "Spell";
	if (kind === "power") return (entry as CompendiumPower).power_type ?? "Power";
	return (entry as CompendiumTechnique).type ?? "Technique";
}

function getAbilityRank(kind: RuneTeachKind, entry: AbilityEntry): string {
	const spellRank = (entry as CompendiumSpell).rank;
	if (spellRank) return spellRank;
	if (kind === "power") return `Level ${getAbilityLevel(kind, entry)} Power`;
	if (kind === "technique") {
		return `Level ${getAbilityLevel(kind, entry)} Technique`;
	}
	return `Level ${getAbilityLevel(kind, entry)} Spell`;
}

function getAbilityRange(entry: AbilityEntry): string {
	return formatAbilityValue((entry as { range?: unknown }).range) ?? "Self";
}

function getAbilityDuration(entry: AbilityEntry): string {
	return (
		formatAbilityValue((entry as { duration?: unknown }).duration) ??
		"Instantaneous"
	);
}

function getAbilityActivation(
	kind: RuneTeachKind,
	entry: AbilityEntry,
): string {
	const castable = entry as CompendiumPower | CompendiumSpell;
	const technique = entry as CompendiumTechnique;
	return (
		formatAbilityValue(castable.casting_time) ??
		formatAbilityValue(castable.activation) ??
		formatAbilityValue(technique.activation) ??
		(kind === "technique" ? "Action" : "Action")
	);
}

function getAbilityUses(entry: AbilityEntry): string {
	const limitations = entry.limitations as
		| { uses?: unknown; recharge?: unknown; uses_per_rest?: unknown }
		| null
		| undefined;
	return (
		formatAbilityValue(limitations?.uses) ??
		formatAbilityValue(limitations?.uses_per_rest) ??
		"Rune-granted use"
	);
}

function getAbilityRecharge(entry: AbilityEntry): string {
	const limitations = entry.limitations as
		| { recharge?: unknown }
		| null
		| undefined;
	return formatAbilityValue(limitations?.recharge) ?? "long rest";
}

function getPrimaryEffect(entry: AbilityEntry): string {
	const effects = entry.effects;
	if (Array.isArray(effects)) return effects.filter(Boolean).join("; ");
	if (effects && typeof effects === "object") {
		const record = effects as Record<string, unknown>;
		return [record.primary, record.secondary, record.tertiary]
			.map(formatAbilityValue)
			.filter((value): value is string => Boolean(value))
			.join("; ");
	}
	return entry.description ?? `Teaches ${entry.name}.`;
}

function getAbilityDamageProfile(entry: AbilityEntry): string {
	const damageRoll = (entry as { damage_roll?: string | null }).damage_roll;
	if (damageRoll && /\d+d\d+/i.test(damageRoll)) {
		const damageType = (entry as { damage_type?: string | null }).damage_type;
		return damageType ? `${damageRoll} ${damageType}` : damageRoll;
	}
	const mechanics = entry.mechanics as
		| { damage_profile?: unknown }
		| null
		| undefined;
	const profile =
		typeof mechanics?.damage_profile === "string"
			? mechanics.damage_profile
			: null;
	return profile && /\d+d\d+/i.test(profile)
		? profile
		: "non-damage learning payload";
}

function getAbilityLore(entry: AbilityEntry): string {
	const lore = entry.lore;
	if (typeof lore === "string" && lore.trim()) return lore;
	if (lore && typeof lore === "object") {
		const record = lore as unknown as Record<string, unknown>;
		return [
			formatAbilityValue(record.origin),
			formatAbilityValue(record.history),
			formatAbilityValue(record.current_owner),
		]
			.filter((value): value is string => Boolean(value))
			.join(" ");
	}
	return `Bureau runewrights stabilized the combat memory of ${entry.name} into a teachable absorption lattice.`;
}

function makeCatalogAuthoredRune(
	kind: RuneTeachKind,
	entry: AbilityEntry,
): RuneCompendiumEntry {
	const abilityLevel = getAbilityLevel(kind, entry);
	const kindLabel =
		kind === "spell" ? "Spell" : kind === "power" ? "Power" : "Technique";
	const runeName = `${kindLabel} Rune of ${entry.name}`;
	const category = getAbilityCategory(kind, entry);
	const rank = getAbilityRank(kind, entry);
	const primaryEffect = getPrimaryEffect(entry);
	const activation = getAbilityActivation(kind, entry);
	const range = getAbilityRange(entry);
	const duration = getAbilityDuration(entry);
	const uses = getAbilityUses(entry);
	const recharge = getAbilityRecharge(entry);
	const description = [
		`Consuming this rune permanently teaches ${entry.name}, a ${rank} ${category} ${kindLabel.toLowerCase()}.`,
		entry.description ?? primaryEffect,
		`Native absorption adds the actual ${kindLabel.toLowerCase()} to the character's ${kindLabel.toLowerCase()} list. If the character is native but under-level, the rune grants one dedicated ${rank} slot for ${entry.name} until that level is naturally unlocked; after that it becomes a general extra ${rank} slot.`,
		RUNE_CROSS_CLASS_TEXT,
	].join("\n\n");
	return {
		id: `rune-${kind}-${entry.id}`,
		name: runeName,
		display_name: runeName,
		aliases: [
			`Rune of ${entry.name}`,
			`${entry.name} Rune`,
			`${rank} Rune of ${category}`,
		],
		teaches: { kind, ref: entry.id },
		description,
		flavor:
			entry.flavor ??
			`A rune-cut mnemonic crystal that pulses with the exact cadence of ${entry.name}.`,
		tags: [
			"awakened",
			"rune",
			kind,
			category.toLowerCase(),
			rank.toLowerCase(),
			"one-time-use",
			"learning-item",
			"authored",
			"canonical",
		],
		rarity: entry.rarity ?? "rare",
		source_book: entry.source_book ?? "Rift Ascendant Canon",
		effects: {
			primary: `Permanently teaches ${entry.name}.`,
			secondary: primaryEffect,
			tertiary: `Activation: ${activation}; Range: ${range}; Duration: ${duration}.`,
		},
		effect_description: `Teaches ${entry.name}: ${primaryEffect} Activation: ${activation}; range ${range}; duration ${duration}. Native under-level users gain one dedicated ${rank} slot until progression unlocks that level.`,
		rune_type: "Consumable",
		rune_category: `${kindLabel} Learning Rune`,
		effect_type: "active",
		activation_action: "Action",
		activation_cost:
			"Consumed on use — the rune shatters and the knowledge is permanently absorbed",
		activation_cost_amount: 1,
		duration: "Permanent — the learned ability persists indefinitely",
		range: "Self",
		concentration: false,
		rune_level: abilityLevel,
		rank,
		lore: getAbilityLore(entry),
		mechanics: {
			action: "Absorb rune",
			ability_id: entry.id,
			ability_kind: kind,
			ability_level: abilityLevel,
			ability_category: category,
			activation,
			duration,
			damage_profile: getAbilityDamageProfile(entry),
			range: "Self",
			taught_range: range,
			taught_duration: duration,
			native_under_level_slot: "Dedicated until naturally unlocked",
			cross_class_formula:
				"max(1, proficiency bonus + primary stat modifier + rune rarity bonus)",
		},
		limitations: {
			uses,
			recharge,
			requires_attunement: false,
			conditions: [
				"Consumed on absorption",
				"Native eligibility is checked strictly against job, path, and regent access",
				"Under-level native slots are dedicated until naturally unlocked",
			],
		},
		discovery_lore:
			entry.discovery_lore ??
			`Recovered from a stabilized Gate echo where ${entry.name} had been etched into the local mana lattice deeply enough for runewrights to preserve it.`,
		image: entry.image ?? entry.image_url ?? undefined,
		higher_levels: `When the bearer naturally unlocks ${rank}, this rune's dedicated slot becomes a general extra ${rank} slot of the same type.`,
	};
}

function makeCatalogAuthoredRunes(): RuneCompendiumEntry[] {
	const covered = getExistingRuneCoverageKeys(authoredRunes);
	const catalogRunes: RuneCompendiumEntry[] = [];
	const addMissing = (kind: RuneTeachKind, entry: AbilityEntry) => {
		if (getCoverageKeys(kind, entry).some((key) => covered.has(key))) return;
		const rune = makeCatalogAuthoredRune(kind, entry);
		catalogRunes.push(rune);
		covered.add(`${kind}:${rune.teaches?.ref ?? entry.id}`);
	};
	spells.forEach((entry) => {
		addMissing("spell", entry);
	});
	powers.forEach((entry) => {
		addMissing("power", entry);
	});
	techniques.forEach((entry) => {
		addMissing("technique", entry as CompendiumTechnique);
	});
	return catalogRunes;
}

export const catalogAuthoredAbilityRunes: RuneCompendiumEntry[] =
	makeCatalogAuthoredRunes();

export const allRunes: RuneCompendiumEntry[] = [
	...authoredRunes,
	...catalogAuthoredAbilityRunes,
];
