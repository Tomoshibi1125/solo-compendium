import srdItemManifest from "@/data/srd-item-manifest.json";
import type { Json } from "@/integrations/supabase/types";
import {
	type ContractIssue,
	validateArmor5e,
	validateJob5e,
	validateMonsterStatblock,
	validatePath5e,
	validateSpellComponents,
	validateWeapon5e,
} from "@/lib/compendium5eContract";

// One SRD 5.1 equipment requirement mapped to its Rift Ascendant analog.
// `present`/`authored` are gated (the RA name must resolve); `omitted` is
// documented but not gated. See src/data/srd-item-manifest.json.
interface SrdRequirement {
	category: string;
	srd: string;
	ra: string | null;
	status: "present" | "authored" | "omitted";
	note?: string;
}

// Keep aligned with `equipmentItemTypes` in @/lib/canonicalCompendium.
const equipmentItemTypes = new Set([
	"weapon",
	"armor",
	"shield",
	"gear",
	"tools",
]);

const isEquipmentLikeEntry = (entry: AuditEntry): boolean => {
	const rawType =
		(entry as { item_type?: unknown }).item_type ??
		(entry as { equipment_type?: unknown }).equipment_type ??
		"";
	if (typeof rawType !== "string") return false;
	return equipmentItemTypes.has(rawType.toLowerCase().trim());
};

export interface AuditEntry {
	id: string;
	name: string;
	description?: string | null;
	source_book?: string | null;
	item_type?: unknown;
	equipment_type?: unknown;
	mechanics?: unknown;
	effects?: unknown;
	properties?: unknown;
	activation?: unknown;
	limitations?: unknown;
	weight?: number | null;
	damage?: unknown;
	damage_type?: unknown;
	armor_class?: unknown;
	armor_type?: unknown;
	weapon_type?: unknown;
	charges?: unknown;
}

type AuditProvider = {
	getAnomalies: (search?: string) => Promise<AuditEntry[]>;
	getArtifacts: (search?: string) => Promise<AuditEntry[]>;
	getBackgrounds: (search?: string) => Promise<AuditEntry[]>;
	getConditions: (search?: string) => Promise<AuditEntry[]>;
	getFeats: (search?: string) => Promise<AuditEntry[]>;
	getFightingStyles: (search?: string) => Promise<AuditEntry[]>;
	getItems: (search?: string) => Promise<AuditEntry[]>;
	getJobs: (search?: string) => Promise<AuditEntry[]>;
	getLocations: (search?: string) => Promise<AuditEntry[]>;
	getPantheon: (search?: string) => Promise<AuditEntry[]>;
	getPaths: (search?: string) => Promise<AuditEntry[]>;
	getPowers: (search?: string) => Promise<AuditEntry[]>;
	getRegents: (search?: string) => Promise<AuditEntry[]>;
	getRelics: (search?: string) => Promise<AuditEntry[]>;
	getRunes: (search?: string) => Promise<AuditEntry[]>;
	getShadowSoldiers: (search?: string) => Promise<AuditEntry[]>;
	getSigils: (search?: string) => Promise<AuditEntry[]>;
	getSkills: (search?: string) => Promise<AuditEntry[]>;
	getSpells: (search?: string) => Promise<AuditEntry[]>;
	getTattoos: (search?: string) => Promise<AuditEntry[]>;
	getTechniques: (search?: string) => Promise<AuditEntry[]>;
	getVehicles: (search?: string) => Promise<AuditEntry[]>;
};

export type CompendiumAuditSeverity = "error" | "warning";

export interface CompendiumAuditIssue {
	severity: CompendiumAuditSeverity;
	dataset: string;
	code: string;
	message: string;
	entryId?: string;
	entryName?: string;
}

export interface CompendiumAuditSummary {
	datasets: Record<string, number>;
	totalEntries: number;
	issues: CompendiumAuditIssue[];
	errors: CompendiumAuditIssue[];
	warnings: CompendiumAuditIssue[];
}

const templatedPhrasePatterns: RegExp[] = [
	// Castable / rune stock authoring phrases
	/unleashes a surge of magical power/i,
	/targets must succeed on a dc \d+/i,
	/suffer its full effects/i,
	/recorded in the darkest archives/i,
	/known only to an elite few/i,
	/an ancient secret reclaimed from the dust/i,
	// Sigil stock authoring phrases
	/its true history remains a heavily guarded bureau secret/i,
	/deeply territorial\.?$/i,
	/circulating in the underground ascendant markets/i,
	// Tattoo stock authoring phrases
	/inked by rogue alchemists looking to push ascendant flesh/i,
	/highly regulated by the international guild association/i,
	/widespread among underground syndicates/i,
	/focus your intent on the glyph/i,
	// Cross-dataset stock flavor
	/silent, hungry\.?$/i,
	/appeared in a ascendant's inventory after a system notification/i,
	/the manifestation of true ascendant authority/i,
	/the world itself shudders/i,
	/commands the certainty of outcomes/i,
];

const castableDatasets = new Set(["spells", "powers", "techniques"]);
// Datasets whose entries carry Title-Cased display names and may host damage
// / utility mechanics (sigils and tattoos included) and therefore participate
// in the naming-case, damage-theme, and utility-damage audits.
const semanticAuditedDatasets = new Set([
	"spells",
	"powers",
	"techniques",
	"runes",
	"sigils",
	"tattoos",
]);

// Datasets whose prose fields are scanned for templated authoring phrases.
// Items, equipment, and relics have their own stock-flavor debt that the
// audit now flags alongside castables.
const templatedLanguageDatasets = new Set([
	"spells",
	"powers",
	"techniques",
	"runes",
	"sigils",
	"tattoos",
	"items",
	"equipment",
	"relics",
	"artifacts",
]);

const itemRulePayloadDatasets = new Set(["equipment", "items", "relics"]);

const itemRulesPayloadKeys = [
	"identity",
	"action_economy",
	"targeting",
	"resolution",
	"ability_modifiers",
	"formulas",
	"source_integrity",
	"audit",
];

const legacyAbilityTermsPattern =
	/\b(Dexterity|Dex|Constitution|Wisdom|Charisma)\b/i;

// Stopwords permitted to stay lowercase after the first word in a Title Case
// castable name.
const TITLE_CASE_STOPWORDS = new Set([
	"of",
	"the",
	"and",
	"or",
	"a",
	"an",
	"in",
	"to",
	"for",
	"with",
	"on",
]);

// Theme-token to acceptable-damage-type map used for name-vs-mechanics
// alignment. Each entry is evaluated in order; the first matching theme wins.
interface DamageThemePolicy {
	pattern: RegExp;
	expected: string[];
}

const DAMAGE_THEME_POLICIES: DamageThemePolicy[] = [
	// More-specific / unambiguous themes are evaluated first so that a
	// compound name like "Radiant Sovereign's Pulse" matches on its primary
	// theme word ("Radiant") before hitting an ambiguous secondary word
	// ("Pulse").
	{
		// "Judgment" intentionally omitted: it is element-agnostic (a judgment can
		// be radiant, force, psychic, etc.) and produced false positives.
		pattern: /\b(Radiant|Sun|Solar|Corona|Holy|Divine|Dawn)\b/i,
		expected: ["radiant", "fire"],
	},
	{
		pattern: /\b(Chill|Ice|Frost|Arctic|Glacial|Blizzard|Cold)\b/i,
		expected: ["cold"],
	},
	{
		pattern: /\b(Fire|Flame|Blaze|Inferno|Scorch|Pyre|Molten|Burning)\b/i,
		expected: ["fire"],
	},
	{
		// "Plague" / "Blight" omitted: both read just as naturally as necrotic
		// decay as poison, so they are not reliable poison-only signals.
		pattern: /\b(Poison|Toxin|Venom)\b/i,
		expected: ["poison"],
	},
	{
		pattern: /\b(Psychic|Mind|Psion|Mental|Nightmare)\b/i,
		expected: ["psychic"],
	},
	{ pattern: /\b(Acid|Corrosive)\b/i, expected: ["acid"] },
	{
		pattern: /\b(Shadow|Void|Night|Dark|Umbral|Eclipse|Abyssal)\b/i,
		expected: ["necrotic", "psychic", "cold", "slashing"],
	},
	{
		// "Crimson" omitted: it is a colour descriptor (often paired with sonic /
		// kinetic effects like a war-cry "Crimson Howl") rather than a reliable
		// blood-damage signal. Explicit blood words stay.
		pattern: /\b(Blood|Sanguine|Carnage|Gore)\b/i,
		expected: ["necrotic", "slashing", "force", "fire"],
	},
	{
		// "Annihilation" / "Erasure" / "Termination" omitted: they denote
		// destruction in general (force/thunder/etc. are equally valid), not
		// necrotic specifically.
		pattern: /\b(Entropy|Decay|Rot|Wither|Siphon|Drain|Necrotic|Grave)\b/i,
		expected: ["necrotic"],
	},
	{
		pattern: /\b(Lightning|Thunder|Storm|Tempest|Shock|Electric)\b/i,
		expected: ["lightning", "thunder"],
	},
	{
		// "Mana" omitted: it is the universal magic prefix in RA and attaches to
		// abilities of every damage type (incl. physical mana-laced strikes), so
		// it is not a reliable force signal. "Arcane"/"Aether" stay.
		pattern: /\b(Arcane|Aether)\b/i,
		expected: ["force"],
	},
];

// Utility/support name tokens — entries matching any of these should not
// carry a damage roll. The audit flags entries that do.
const UTILITY_NAME_TOKENS: RegExp[] = [
	/\b(regenerat|heal|restor|mend|cure|revital)/i,
	/\b(invisibil|invisible|obscure)/i,
	/\b(telepath|mind link|mind speech|mind speak)/i,
	/\b(true sight|clairvoy|scry|detect|reveal)/i,
	/\b(shadow step|blink|teleport|phase|step of)/i,
	/\b(resilience|fortitude|endurance)/i,
	/\b(charm|persuade|calm|beguile|pacify)/i,
	/\b(recovery|refresh|renew|meditate)/i,
	/\b(lycanthrop|shapeshift|polymorph|transform)/i,
	/\b(petrif|paralysis|stun|freeze mind)/i,
];

// Explicit attack-verb name tokens. An ability named with one of these is
// intentionally a damage ability (e.g. "Phase Strike", "Void Bolt"), so the
// utility-name-with-damage heuristic must not flag it even when the name also
// carries a movement/utility-flavored word such as "phase" or "step".
const ATTACK_NAME_TOKENS =
	/\b(strike|smite|bolt|blast|slash|stab|pierc|crush|shot|burst|lance|cleave|rend|barrage|volley|slam|sever|impale|skewer)\b/i;

const DAMAGE_TYPE_PROFILE_REGEX =
	/\b(fire|cold|lightning|thunder|necrotic|radiant|psychic|force|acid|poison|slashing|piercing|bludgeoning)\b/i;

// Exact `scripts/item-forge.ts` combat-injection signatures. These phrases were
// stamped onto EVERY item (mundane tools and named weapons alike) with a random
// die + crowd-control rider; they must never appear in a shipped item.
const INJECTED_ITEM_TEMPLATE_PATTERNS: RegExp[] = [
	/Deals\s+.+\s+physical or magical damage on hit/i,
	/Target must make a standard DC saving throw or suffer .+ for 1 round/i,
];

// Datasets whose entries are item records carrying an `ra-item-v1` payload and
// therefore participate in the item coherence audits.
const itemCoherenceDatasets = new Set([
	"items",
	"equipment",
	"relics",
	"artifacts",
]);

// Bare 5e-category placeholder names. 5e ships concrete specifics (a Lute, a
// Crystal), never a generic "Musical Instrument" / "Arcane Focus". An item
// named exactly as one of these is a vague catch-all and must be expanded.
const VAGUE_CATCHALL_NAMES = new Set(
	[
		"Musical Instrument",
		"Arcane Focus",
		"Druidic Focus",
		"Primal Focus",
		"Order Focus",
		"Holy Symbol",
		"Gaming Set",
		"Artisan's Tools",
		"Trade Goods",
	].map((name) => name.toLowerCase()),
);

const isRecord = (value: unknown): value is Record<string, Json> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const getString = (value: unknown): string | null =>
	typeof value === "string" && value.trim().length > 0 ? value : null;

const getFormulaString = (value: unknown): string | null => {
	if (typeof value === "string" && value.trim().length > 0) return value;
	if (typeof value === "number") return String(value);
	if (!isRecord(value)) return null;
	return (
		getString(value.dice) ?? getString(value.roll) ?? getString(value.amount)
	);
};

const collectTextFragments = (value: unknown): string[] => {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(collectTextFragments);
	if (isRecord(value))
		return Object.values(value).flatMap(collectTextFragments);
	return [];
};

const addIssue = (
	issues: CompendiumAuditIssue[],
	issue: CompendiumAuditIssue,
) => {
	issues.push(issue);
};

async function loadAuditDatasets(
	provider: AuditProvider,
): Promise<Record<string, AuditEntry[]>> {
	const [
		anomalies,
		artifacts,
		backgrounds,
		conditions,
		feats,
		fightingStyles,
		items,
		jobs,
		locations,
		pantheon,
		paths,
		powers,
		regents,
		relics,
		runes,
		shadowSoldiers,
		sigils,
		skills,
		spells,
		tattoos,
		techniques,
		vehicles,
	] = await Promise.all([
		provider.getAnomalies(""),
		provider.getArtifacts(""),
		provider.getBackgrounds(""),
		provider.getConditions(""),
		provider.getFeats(""),
		provider.getFightingStyles(""),
		provider.getItems(""),
		provider.getJobs(""),
		provider.getLocations(""),
		provider.getPantheon(""),
		provider.getPaths(""),
		provider.getPowers(""),
		provider.getRegents(""),
		provider.getRelics(""),
		provider.getRunes(""),
		provider.getShadowSoldiers(""),
		provider.getSigils(""),
		provider.getSkills(""),
		provider.getSpells(""),
		provider.getTattoos(""),
		provider.getTechniques(""),
		provider.getVehicles(""),
	]);

	return {
		anomalies,
		artifacts,
		backgrounds,
		conditions,
		equipment: items.filter((entry) => isEquipmentLikeEntry(entry as never)),
		feats,
		fighting_styles: fightingStyles,
		items: items.filter((entry) => !isEquipmentLikeEntry(entry as never)),
		jobs,
		locations,
		pantheon,
		paths,
		powers,
		regents,
		relics,
		runes,
		shadow_soldiers: shadowSoldiers,
		sigils,
		skills,
		spells,
		tattoos,
		techniques,
		vehicles,
	};
}

function auditDuplicates(
	dataset: string,
	entries: AuditEntry[],
	issues: CompendiumAuditIssue[],
) {
	const ids = new Map<string, number>();
	const names = new Map<string, number>();

	for (const entry of entries) {
		ids.set(entry.id, (ids.get(entry.id) ?? 0) + 1);
		names.set(entry.name, (names.get(entry.name) ?? 0) + 1);
	}

	for (const [id, count] of ids.entries()) {
		if (count > 1) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "duplicate_id",
				message: `Duplicate id "${id}" appears ${count} times.`,
				entryId: id,
			});
		}
	}

	for (const [name, count] of names.entries()) {
		if (count > 1) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "duplicate_name",
				message: `Duplicate name "${name}" appears ${count} times.`,
				entryName: name,
			});
		}
	}
}

const RA_CANON_SOURCE_BOOK = "Rift Ascendant Canon";

function auditRequiredFields(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	if (!entry.source_book) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_source_book",
			message: "Missing source_book.",
			entryId: entry.id,
			entryName: entry.name,
		});
	} else if (entry.source_book !== RA_CANON_SOURCE_BOOK) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "invalid_source_book",
			message: `source_book must be exactly "${RA_CANON_SOURCE_BOOK}" (was "${entry.source_book}"). Merge content into RA Canon or remove the entry.`,
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	if (!entry.description || entry.description.trim().length === 0) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_description",
			message: "Missing description.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditTemplatedLanguage(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const text = collectTextFragments([
		entry.description,
		(entry as { flavor?: unknown }).flavor,
		(entry as { lore?: unknown }).lore,
		(entry as { effects?: unknown }).effects,
	]).join("\n");

	const matchedPattern = templatedPhrasePatterns.find((pattern) =>
		pattern.test(text),
	);
	if (!matchedPattern) return;

	addIssue(issues, {
		severity: "warning",
		dataset,
		code: "templated_language",
		message: `Contains templated authoring phrase matching ${matchedPattern}.`,
		entryId: entry.id,
		entryName: entry.name,
	});
}

function auditCastableEntry(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	if (!mechanics) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_mechanics",
			message: "Missing mechanics object.",
			entryId: entry.id,
			entryName: entry.name,
		});
		return;
	}

	const attack =
		(isRecord((entry as { attack?: unknown }).attack)
			? ((entry as { attack?: Record<string, Json> }).attack ?? null)
			: null) ||
		(isRecord((entry as { spell_attack?: unknown }).spell_attack)
			? ((entry as { spell_attack?: Record<string, Json> }).spell_attack ??
				null)
			: null) ||
		(isRecord(mechanics.attack) ? mechanics.attack : null);
	const savingThrow =
		(isRecord((entry as { saving_throw?: unknown }).saving_throw)
			? ((entry as { saving_throw?: Record<string, Json> }).saving_throw ??
				null)
			: null) ||
		(isRecord(mechanics.saving_throw) ? mechanics.saving_throw : null);
	const healing = isRecord(mechanics.healing) ? mechanics.healing : null;
	const utility = isRecord(mechanics.utility) ? mechanics.utility : null;
	const resolution = isRecord(mechanics.resolution)
		? mechanics.resolution
		: null;

	if (!attack && !savingThrow && !healing && !utility && !resolution) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_resolution",
			message:
				"Mechanics do not expose an attack, save, or healing resolution.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const formula =
		getFormulaString((entry as { damage_roll?: unknown }).damage_roll) ??
		getFormulaString(attack?.damage) ??
		getFormulaString(healing) ??
		getFormulaString(utility?.formula) ??
		getFormulaString(resolution?.formula) ??
		getString(mechanics.damage_profile) ??
		getString(mechanics.damage);
	// A pure utility / save-or-suffer / control spell legitimately has no
	// damage or healing formula — its resolution IS the saving throw + the
	// failure prose. Only warn when there's also no save/utility/resolution
	// block to carry the effect.
	const hasNonFormulaResolution = Boolean(savingThrow || utility || resolution);
	if (!formula && !hasNonFormulaResolution) {
		addIssue(issues, {
			severity: "warning",
			dataset,
			code: "missing_formula",
			message: "No explicit damage/healing formula was found in the mechanics.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const hasActionEconomy = Boolean(
		getString((entry as { casting_time?: unknown }).casting_time) ||
			getString((entry as { activation_time?: unknown }).activation_time) ||
			getString((entry as { activation_action?: unknown }).activation_action) ||
			isRecord((entry as { activation?: unknown }).activation),
	);
	if (!hasActionEconomy) {
		addIssue(issues, {
			severity: "warning",
			dataset,
			code: "missing_action_economy",
			message: "No explicit activation or casting time was found.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const hasTargeting = Boolean(
		(entry as { range?: unknown }).range !== undefined ||
			getString((entry as { target?: unknown }).target) ||
			isRecord((entry as { area?: unknown }).area),
	);
	if (!hasTargeting) {
		addIssue(issues, {
			severity: "warning",
			dataset,
			code: "missing_targeting",
			message: "No range, target, or area metadata was found.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function collectDamageType(entry: AuditEntry): string | null {
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	if (mechanics) {
		const attack = isRecord(mechanics.attack) ? mechanics.attack : null;
		const damageType = getString(attack?.damage_type);
		if (damageType) return damageType.toLowerCase();
		const type = getString(attack?.type);
		if (type && DAMAGE_TYPE_PROFILE_REGEX.test(type)) return type.toLowerCase();
		const profile = getString(mechanics.damage_profile);
		if (profile) {
			const match = profile.match(DAMAGE_TYPE_PROFILE_REGEX);
			if (match) return match[1].toLowerCase();
		}
	}
	return null;
}

function hasDamageRoll(entry: AuditEntry): boolean {
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	const attack =
		mechanics && isRecord(mechanics.attack) ? mechanics.attack : null;
	const attackDamage = getString(attack?.damage);
	if (attackDamage && /\d+d\d+/.test(attackDamage)) return true;
	const profile = mechanics ? getString(mechanics.damage_profile) : null;
	if (profile && /\d+d\d+/.test(profile)) return true;
	const topAttack = isRecord((entry as { attack?: unknown }).attack)
		? ((entry as { attack?: Record<string, Json> }).attack ?? null)
		: null;
	const topAttackDamage = getString(topAttack?.damage);
	if (topAttackDamage && /\d+d\d+/.test(topAttackDamage)) return true;
	const damageRoll = getString(
		(entry as { damage_roll?: unknown }).damage_roll,
	);
	if (damageRoll && /\d+d\d+/.test(damageRoll)) return true;
	return false;
}

function getEquipmentKind(entry: AuditEntry): string {
	const raw = entry.item_type ?? entry.equipment_type ?? "";
	return typeof raw === "string" ? raw.toLowerCase().trim() : "";
}

function hasDiceNotation(value: unknown): boolean {
	const formula = getFormulaString(value);
	return Boolean(formula && /\d+d\d+/i.test(formula));
}

function getNestedRecord(
	value: unknown,
	key: string,
): Record<string, Json> | null {
	if (!isRecord(value)) return null;
	const nested = value[key];
	return isRecord(nested) ? nested : null;
}

function hasWeaponDamage(entry: AuditEntry): boolean {
	if (hasDiceNotation(entry.damage)) return true;
	const weapon = getNestedRecord(entry.properties, "weapon");
	return hasDiceNotation(weapon?.damage);
}

function hasWeaponDamageType(entry: AuditEntry): boolean {
	if (getString(entry.damage_type)) return true;
	const weapon = getNestedRecord(entry.properties, "weapon");
	return Boolean(
		getString(weapon?.damage_type) ||
			getString(weapon?.damageType) ||
			getString(weapon?.type),
	);
}

function hasWeaponType(entry: AuditEntry): boolean {
	if (getString(entry.weapon_type)) return true;
	const propertiesText = collectTextFragments(entry.properties).join(" ");
	return /\b(simple|martial|melee|ranged|weapon)\b/i.test(propertiesText);
}

function hasArmorClass(entry: AuditEntry): boolean {
	if (typeof entry.armor_class === "number") return true;
	if (getString(entry.armor_class)) return true;
	const armor = getNestedRecord(entry.properties, "armor");
	return Boolean(
		armor && (typeof armor.baseAC === "number" || getString(armor.baseAC)),
	);
}

function hasArmorType(entry: AuditEntry): boolean {
	if (getString(entry.armor_type)) return true;
	const kind = getEquipmentKind(entry);
	if (kind === "shield") return true;
	const armor = getNestedRecord(entry.properties, "armor");
	return Boolean(
		getString(armor?.type) ||
			/\b(light|medium|heavy|shield)\b/i.test(
				collectTextFragments(entry.properties).join(" "),
			),
	);
}

function hasValidCharges(entry: AuditEntry): boolean {
	if (entry.charges == null) return true;
	if (typeof entry.charges === "number") return entry.charges > 0;
	if (!isRecord(entry.charges)) return false;
	const max = entry.charges.max;
	const current = entry.charges.current;
	return (
		(typeof max === "number" && max > 0) ||
		(typeof current === "number" && current >= 0)
	);
}

function auditNamingCase(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const name = getString(entry.name);
	if (!name || !name.includes(" ")) return;
	const parts = name.split(/\s+/);
	for (let i = 1; i < parts.length; i += 1) {
		const word = parts[i];
		const lower = word.toLowerCase();
		if (TITLE_CASE_STOPWORDS.has(lower)) continue;
		if (!/^[A-Z]/.test(word) && /^[a-z]/.test(word)) {
			addIssue(issues, {
				severity: "warning",
				dataset,
				code: "naming_case",
				message: `Non-stopword word "${word}" in "${name}" should be Title Case.`,
				entryId: entry.id,
				entryName: entry.name,
			});
			return;
		}
	}
}

function auditDamageThemeMismatch(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const name = getString(entry.name);
	if (!name) return;
	const damageType = collectDamageType(entry);
	if (!damageType) return;

	// Exemption for resistance sigils: they are intentionally themed as opposites
	// of what they resist (e.g., Frost-Ward resists fire, Hearth-Fire resists cold).
	// Check if the entry is a resistance sigil by looking at effect_description.
	const effectDesc = getString(
		(entry as { effect_description?: unknown }).effect_description,
	);
	const isResistanceSigil =
		dataset === "sigils" &&
		effectDesc !== null &&
		(/Reduces all \w+ damage taken by/i.test(effectDesc) ||
			/Grants Resistance to \w+ damage/i.test(effectDesc));
	if (isResistanceSigil) return;

	// Primary theme = the policy whose pattern matches earliest in the name.
	// For compound names like "Frost Judgment" or "Night Storm" this anchors
	// on the first word (Frost / Night) rather than a secondary theme word.
	let best: { policy: DamageThemePolicy; index: number } | null = null;
	for (const policy of DAMAGE_THEME_POLICIES) {
		const execResult = policy.pattern.exec(name);
		if (!execResult) continue;
		const index = execResult.index;
		if (!best || index < best.index) {
			best = { policy, index };
		}
	}
	if (!best) return;
	if (!best.policy.expected.includes(damageType)) {
		addIssue(issues, {
			severity: "warning",
			dataset,
			code: "damage_theme_mismatch",
			message: `Name theme expects ${best.policy.expected.join("/")} but damage_type is "${damageType}".`,
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditUtilityWithDamage(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const name = getString(entry.name);
	if (!name) return;
	if (!hasDamageRoll(entry)) return;
	// An explicit attack verb in the name (Strike, Bolt, Smite, ...) marks the
	// ability as an intended damage option, so its damage roll is expected.
	if (ATTACK_NAME_TOKENS.test(name)) return;
	for (const token of UTILITY_NAME_TOKENS) {
		if (token.test(name)) {
			addIssue(issues, {
				severity: "warning",
				dataset,
				code: "utility_name_with_damage",
				message: `Utility/support-named entry "${name}" carries a damage roll.`,
				entryId: entry.id,
				entryName: entry.name,
			});
			return;
		}
	}
}

function auditEquipmentEntry(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const kind = getEquipmentKind(entry);
	if (kind === "weapon") {
		if (!hasWeaponType(entry)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_weapon_type",
				message:
					"Weapon entry lacks weapon_type or simple/martial/ranged/melee metadata.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
		if (!hasWeaponDamage(entry)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_weapon_damage",
				message: "Weapon entry lacks parseable damage dice.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
		if (!hasWeaponDamageType(entry)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_weapon_damage_type",
				message: "Weapon entry lacks damage_type metadata.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}

	if (kind === "armor" || kind === "shield") {
		if (!hasArmorClass(entry)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_armor_class",
				message: "Armor or shield entry lacks armor_class metadata.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
		if (!hasArmorType(entry)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_armor_type",
				message: "Armor or shield entry lacks armor_type metadata.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}

	if (!hasValidCharges(entry)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "invalid_charges",
			message:
				"Entry has charges metadata but no positive max/current charge payload.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const mechanicalSignals = [
		Array.isArray(entry.properties) ? entry.properties.length > 0 : false,
		isRecord((entry as { item_properties?: unknown }).item_properties),
		isRecord(entry.mechanics),
		isRecord(entry.effects),
		Boolean(getString(entry.damage)),
		Boolean(getString((entry as { armor_class?: unknown }).armor_class)),
		typeof entry.weight === "number",
	];
	if (mechanicalSignals.some(Boolean)) return;

	addIssue(issues, {
		severity: "warning",
		dataset,
		code: "mechanically_thin_equipment",
		message:
			"Equipment entry lacks explicit mechanics, properties, effects, or numeric payload.",
		entryId: entry.id,
		entryName: entry.name,
	});
}

function hasNonEmptyRecordValue(record: Record<string, Json>): boolean {
	return Object.values(record).some((value) => {
		if (value == null) return false;
		if (typeof value === "string") return value.trim().length > 0;
		if (typeof value === "number" || typeof value === "boolean") return true;
		if (Array.isArray(value)) return value.length > 0;
		return isRecord(value) && hasNonEmptyRecordValue(value);
	});
}

function auditItemRulesPayload(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	if (!mechanics) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_rules_payload",
			message: "Item lacks a structured mechanics rules payload.",
			entryId: entry.id,
			entryName: entry.name,
		});
		return;
	}

	if (mechanics.rules_payload_version !== "ra-item-v1") {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "invalid_item_rules_payload_version",
			message:
				'Item mechanics must declare rules_payload_version "ra-item-v1".',
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	for (const key of itemRulesPayloadKeys) {
		if (!isRecord(mechanics[key])) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "incomplete_item_rules_payload",
				message: `Item mechanics missing required "${key}" rules block.`,
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}

	const activation = isRecord(entry.activation) ? entry.activation : null;
	if (
		!activation ||
		!getString(activation.type) ||
		!getString(activation.cost)
	) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_activation_payload",
			message: "Item lacks explicit activation type and action cost metadata.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	if (!isRecord(entry.limitations)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_limitations_payload",
			message:
				"Item lacks explicit limitations, attunement, charge, or use-state metadata.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const identity = isRecord(mechanics.identity) ? mechanics.identity : null;
	if (
		!identity ||
		!getString(identity.archetype) ||
		!getString(identity.signature) ||
		!getString(identity.distinguishing_rule) ||
		!getString(identity.canon_basis)
	) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_identity_payload",
			message:
				"Item lacks a unique RA identity signature, archetype, and canon basis.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const formulas = isRecord(mechanics.formulas) ? mechanics.formulas : null;
	if (!formulas || !hasNonEmptyRecordValue(formulas)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_formula_payload",
			message: "Item lacks explicit formula metadata.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const abilityModifiers = isRecord(mechanics.ability_modifiers)
		? mechanics.ability_modifiers
		: null;
	if (!abilityModifiers || !hasNonEmptyRecordValue(abilityModifiers)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_item_ability_modifier_payload",
			message: "Item lacks explicit RA ability modifier metadata.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}

	const payloadText = collectTextFragments([
		mechanics,
		entry.activation,
		entry.limitations,
	]).join("\n");
	if (legacyAbilityTermsPattern.test(payloadText)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "legacy_ability_terms_in_item_rules",
			message:
				"Item rules payload uses legacy ability terminology instead of RA ability names.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditItemPayloadUniqueness(
	datasets: Record<string, AuditEntry[]>,
	issues: CompendiumAuditIssue[],
) {
	const signatures = new Map<string, AuditEntry[]>();
	const seeds = new Map<string, AuditEntry[]>();
	for (const dataset of itemRulePayloadDatasets) {
		for (const entry of datasets[dataset] ?? []) {
			const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
			const identity =
				mechanics && isRecord(mechanics.identity) ? mechanics.identity : null;
			const audit =
				mechanics && isRecord(mechanics.audit) ? mechanics.audit : null;
			const signature = identity ? getString(identity.signature) : null;
			const seed = audit ? getString(audit.uniqueness_seed) : null;
			if (signature) {
				const current = signatures.get(signature) ?? [];
				current.push(entry);
				signatures.set(signature, current);
			}
			if (seed) {
				const current = seeds.get(seed) ?? [];
				current.push(entry);
				seeds.set(seed, current);
			}
		}
	}

	for (const [signature, entries] of signatures.entries()) {
		if (entries.length <= 1) continue;
		for (const entry of entries) {
			addIssue(issues, {
				severity: "error",
				dataset: "items",
				code: "duplicate_item_identity_signature",
				message: `Item identity signature "${signature}" is reused by ${entries.length} entries.`,
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}

	for (const [seed, entries] of seeds.entries()) {
		if (entries.length <= 1) continue;
		for (const entry of entries) {
			addIssue(issues, {
				severity: "error",
				dataset: "items",
				code: "duplicate_item_uniqueness_seed",
				message: `Item uniqueness seed "${seed}" is reused by ${entries.length} entries.`,
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}
}

// ──────────────────────────────────────────────────────────────────────
// Item coherence audits (Phase 0). These gate the `scripts/item-forge.ts`
// combat-injection defect and its downstream contradictions.
// ──────────────────────────────────────────────────────────────────────

function auditItemInjectedTemplate(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const text = collectTextFragments([entry.effects, entry.mechanics]).join(
		"\n",
	);
	const matched = INJECTED_ITEM_TEMPLATE_PATTERNS.find((pattern) =>
		pattern.test(text),
	);
	if (matched) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "item_injected_template",
			message:
				"Item carries item-forge injected combat boilerplate (random 'Deals Xd6 … damage on hit' + save rider).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditVagueCatchallName(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const name = getString(entry.name);
	if (name && VAGUE_CATCHALL_NAMES.has(name.trim().toLowerCase())) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "vague_catchall_name",
			message: `Item name "${name}" is a bare 5e category — expand into concrete specifics (e.g. Lute, Drum, Flute).`,
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditTattooFieldContradiction(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const bodyPart = getString((entry as { body_part?: unknown }).body_part);
	const ink = getString((entry as { ink_type?: unknown }).ink_type);
	const mechanics = isRecord(entry.mechanics) ? entry.mechanics : null;
	const limitations = isRecord((entry as { limitations?: unknown }).limitations)
		? (entry as { limitations: Record<string, Json> }).limitations
		: null;

	// Placement: every slot/attunement rule must name the tattoo's body_part.
	if (bodyPart) {
		const bp = bodyPart.toLowerCase();
		const slotStrings = [
			...collectTextFragments(mechanics?.restrictions),
			...collectTextFragments(limitations?.conditions),
		].filter((line) => /tattoo slot|attunement slot/i.test(line));
		const mismatch = slotStrings.find(
			(line) => !line.toLowerCase().includes(bp),
		);
		if (mismatch) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "tattoo_field_contradiction",
				message: `Placement "${bodyPart}" contradicts slot rule "${mismatch}".`,
				entryId: entry.id,
				entryName: entry.name,
			});
			return;
		}
	}

	// Material: every inscription/resonance rule must name the tattoo's ink_type.
	if (ink) {
		const inkLower = ink.toLowerCase();
		const materialStrings = [
			getString(mechanics?.lattice_interaction),
			...collectTextFragments(mechanics?.special_abilities),
		].filter(
			(line): line is string =>
				!!line && /resonates|inscription requires/i.test(line),
		);
		const mismatch = materialStrings.find(
			(line) => !line.toLowerCase().includes(inkLower),
		);
		if (mismatch) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "tattoo_field_contradiction",
				message: `Ink "${ink}" contradicts material rule "${mismatch}".`,
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}
}

// ──────────────────────────────────────────────────────────────────────
// Category-specific completeness audits (Pass 2).
//
// Each function asserts that an entry of a given dataset carries the
// minimum fleshing-out the engine and UI expect. These run alongside the
// generic dup/required-field checks and are wired into the dispatch loop
// at the bottom of this file.
// ──────────────────────────────────────────────────────────────────────

const getNumber = (value: unknown): number | null =>
	typeof value === "number" && Number.isFinite(value) ? value : null;

const getArray = (value: unknown): unknown[] | null =>
	Array.isArray(value) ? value : null;

const hasMinArrayEntries = (value: unknown, min: number): boolean => {
	const arr = getArray(value);
	return !!arr && arr.length >= min;
};

const recordHasAnyKey = (value: unknown): boolean => {
	if (!isRecord(value)) return false;
	return Object.keys(value).length > 0;
};

function auditVehicleCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	const vehicleType = getString(e.vehicle_type);
	const size = getString(e.size);
	const speed = e.speed;
	const ac = getNumber(e.armor_class);
	const hp = e.hit_points;
	const crew = e.crew_positions;

	if (!vehicleType) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_vehicle_type",
			message: "Vehicle missing vehicle_type.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (!size) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_size",
			message: "Vehicle missing size.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (!recordHasAnyKey(speed)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_speed",
			message: "Vehicle missing speed (need land/air/water/etc.).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (ac === null || ac <= 0) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_armor_class",
			message: "Vehicle missing positive armor_class.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (
		!isRecord(hp) ||
		getNumber((hp as Record<string, unknown>).max) === null ||
		(getNumber((hp as Record<string, unknown>).max) ?? 0) <= 0
	) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_hit_points",
			message: "Vehicle missing hit_points.max (> 0).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (!hasMinArrayEntries(crew, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_crew_positions",
			message: "Vehicle missing crew_positions (need ≥1 position).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditVehicleBondedReferences(
	vehicles: AuditEntry[],
	anomalies: AuditEntry[],
	issues: CompendiumAuditIssue[],
) {
	// Vehicles that DECLARE an anomaly_id must resolve it in the anomalies
	// dataset. `bonded: true` alone does NOT imply an anomaly link — it just
	// flags character-bonding for stat-modifier rules. Net-new RA mounts may
	// be bonded without overlaying an existing anomaly.
	const anomalyIds = new Set(anomalies.map((a) => a.id));
	for (const v of vehicles) {
		const e = v as unknown as Record<string, unknown>;
		const anomalyId = getString(e.anomaly_id);
		if (!anomalyId) continue;
		if (!anomalyIds.has(anomalyId)) {
			addIssue(issues, {
				severity: "error",
				dataset: "vehicles",
				code: "unresolved_anomaly_id",
				message: `Vehicle anomaly_id "${anomalyId}" does not resolve to any anomaly.`,
				entryId: v.id,
				entryName: v.name,
			});
		}
	}
}

function auditDeityCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	const checks: Array<{ key: string; ok: boolean; code: string; msg: string }> =
		[
			{
				key: "rank",
				ok: !!getString(e.rank),
				code: "missing_deity_rank",
				msg: "Deity missing rank.",
			},
			{
				key: "directive",
				ok: !!getString(e.directive),
				code: "missing_deity_directive",
				msg: "Deity missing directive.",
			},
			{
				key: "sigil",
				ok: !!getString(e.sigil),
				code: "missing_deity_sigil",
				msg: "Deity missing sigil description.",
			},
			{
				key: "manifestation",
				ok: !!getString(e.manifestation),
				code: "missing_deity_manifestation",
				msg: "Deity missing manifestation.",
			},
			{
				key: "home_realm",
				ok: !!getString(e.home_realm),
				code: "missing_deity_home_realm",
				msg: "Deity missing home_realm.",
			},
			{
				key: "portfolio",
				ok: hasMinArrayEntries(e.portfolio, 1),
				code: "missing_deity_portfolio",
				msg: "Deity missing portfolio (need ≥1 entry).",
			},
			{
				key: "specializations",
				ok: hasMinArrayEntries(e.specializations, 1),
				code: "missing_deity_specializations",
				msg: "Deity missing specializations (need ≥1).",
			},
			{
				key: "dogma",
				ok: hasMinArrayEntries(e.dogma, 1),
				code: "missing_deity_dogma",
				msg: "Deity missing dogma (need ≥1 tenet).",
			},
		];
	for (const c of checks) {
		if (c.ok) continue;
		addIssue(issues, {
			severity: "error",
			dataset,
			code: c.code,
			message: c.msg,
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditFeatCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	const hasEffects =
		hasMinArrayEntries(e.effects, 1) ||
		isRecord(e.effects) ||
		hasMinArrayEntries(e.benefits, 1) ||
		isRecord(e.mechanics);
	if (!hasEffects) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_feat_effects",
			message: "Feat missing effects/benefits/mechanics payload.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	// Prerequisites may legitimately be empty for general feats, so allow null
	// but require the FIELD to be present (object or array) so omission is
	// distinguishable from intentional emptiness.
	const prereq = e.prerequisites;
	if (
		prereq !== null &&
		prereq !== undefined &&
		!isRecord(prereq) &&
		!Array.isArray(prereq) &&
		typeof prereq !== "string"
	) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "malformed_feat_prerequisites",
			message: "Feat prerequisites must be null, string, array, or object.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditBackgroundCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	if (!hasMinArrayEntries(e.skill_proficiencies, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_skill_proficiencies",
			message: "Background missing skill_proficiencies (need ≥1).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	const equipment = e.starting_equipment ?? e.equipment;
	if (!getString(equipment) && !hasMinArrayEntries(equipment, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_starting_equipment",
			message: "Background missing starting_equipment.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	const featureName = getString(e.feature_name);
	const featureDesc = getString(e.feature_description);
	const features = e.background_features;
	const hasInlineFeature = !!(featureName && featureDesc);
	const hasStructuredFeature =
		Array.isArray(features) &&
		features.length > 0 &&
		features.every(
			(f) =>
				isRecord(f) &&
				!!getString((f as Record<string, unknown>).name) &&
				!!getString((f as Record<string, unknown>).description),
		);
	if (!hasInlineFeature && !hasStructuredFeature) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_background_feature",
			message:
				"Background missing feature (need feature_name + feature_description, or background_features[] with name/description).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditConditionCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	const hasEffects =
		hasMinArrayEntries(e.condition_effects, 1) ||
		isRecord(e.effects) ||
		isRecord(e.mechanics);
	if (!hasEffects) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_condition_effects",
			message:
				"Condition missing mechanical effects (condition_effects[]/effects/mechanics).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditSkillCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	const ability = getString(e.ability) ?? getString(e.ability_score);
	if (!ability) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_skill_ability",
			message:
				"Skill missing keying ability (need `ability` or `ability_score`).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditSigilOrTattooCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	// Sigils carry their bonus payload in `passive_bonuses`; tattoos express
	// mechanical effect via `mechanics`/`effects` (the CompendiumTattoo type
	// has no `passive_bonuses` field).
	if (dataset === "sigils") {
		if (!recordHasAnyKey(e.passive_bonuses)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_passive_bonuses",
				message: "Sigil missing passive_bonuses (need ≥1 keyed bonus).",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
		if (!hasMinArrayEntries(e.can_inscribe_on, 1)) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_can_inscribe_on",
				message: "Sigil missing can_inscribe_on (need ≥1 socket type).",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	} else {
		// tattoos
		const hasMechanicalPayload =
			recordHasAnyKey(e.mechanics) || recordHasAnyKey(e.effects);
		if (!hasMechanicalPayload) {
			addIssue(issues, {
				severity: "error",
				dataset,
				code: "missing_tattoo_mechanics",
				message: "Tattoo missing mechanics/effects payload.",
				entryId: entry.id,
				entryName: entry.name,
			});
		}
	}
	if (!hasMinArrayEntries(e.tags, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_tags",
			message: `${dataset === "sigils" ? "Sigil" : "Tattoo"} missing tags (need ≥1).`,
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditFightingStyleCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	// Fighting styles always have a prose description (verified by
	// auditRequiredFields). Beyond that, prerequisites being present (even
	// empty) and the structured modifiers OR a prose description that mentions
	// a numeric effect are what flag fleshing-out.
	if (
		e.prerequisites !== null &&
		e.prerequisites !== undefined &&
		!Array.isArray(e.prerequisites)
	) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "malformed_fighting_style_prerequisites",
			message: "Fighting style prerequisites must be null or string[].",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

function auditShadowSoldierCompleteness(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const e = entry as unknown as Record<string, unknown>;
	if (!getString(e.rank) && !getString(e.gate_rank)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_rank",
			message: "Shadow soldier missing rank.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (!getString(e.role)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_role",
			message: "Shadow soldier missing role.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	// Tolerant of both raw (`hp`) and provider-shaped (`hit_points_average`).
	const hp =
		getNumber(e.hit_points_average) ??
		getNumber(e.hit_points) ??
		getNumber(e.hp);
	if (hp === null || hp <= 0) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_hp",
			message: "Shadow soldier missing positive hit points.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	const ac = getNumber(e.armor_class) ?? getNumber(e.ac);
	if (ac === null || ac <= 0) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_ac",
			message: "Shadow soldier missing positive armor_class.",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	const traits = e.Anomaly_traits ?? e.traits;
	const actions = e.Anomaly_actions ?? e.actions;
	if (!hasMinArrayEntries(traits, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_traits",
			message: "Shadow soldier missing traits (need ≥1).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
	if (!hasMinArrayEntries(actions, 1)) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: "missing_shadow_actions",
			message: "Shadow soldier missing actions (need ≥1).",
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

/**
 * Run a 5e-contract validator (from compendium5eContract.ts) against an entry
 * and fold its findings into the audit issue stream as errors.
 */
function runContract(
	dataset: string,
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
	validator: (e: Record<string, unknown>) => ContractIssue[],
) {
	const found = validator(entry as unknown as Record<string, unknown>);
	for (const issue of found) {
		addIssue(issues, {
			severity: "error",
			dataset,
			code: issue.code,
			message: issue.message,
			entryId: entry.id,
			entryName: entry.name,
		});
	}
}

// ──────────────────────────────────────────────────────────────────────
// Phase 2 — de-boilerplate + effect depth.
//
// `boilerplate_repetition`: a narrative field whose value is shared by more
// than BOILERPLATE_MAX_SHARE entries across the item corpus is pool-drawn
// boilerplate and must be replaced with bespoke per-entry text.
// `shallow_magic_effect`: an uncommon+ item whose only mechanical effect is a
// flat "+X" (and whose name doesn't mark it an intentional "+N" item) is flagged.
//
// Both gates enforce only datasets in `boilerplateEnforcedDatasets` — the tiers
// already cleaned — so the pass can land tier by tier while the suite stays
// green. The frequency map is still computed over the whole corpus, so a
// cleaned tier that still reuses a pooled line is caught. Grow the set as each
// tier is de-boilerplated.
// ──────────────────────────────────────────────────────────────────────
const BOILERPLATE_CORPUS_DATASETS = [
	"equipment",
	"items",
	"relics",
	"artifacts",
	"sigils",
	"tattoos",
];
const BOILERPLATE_MAX_SHARE = 2;
const boilerplateEnforcedDatasets = new Set<string>([
	"relics",
	"artifacts",
	"items",
	"equipment",
	"sigils",
	"tattoos",
]);

const boilerplateNarrativeFields: Record<string, (e: AuditEntry) => unknown> = {
	description: (e) => e.description,
	flavor: (e) => (e as { flavor?: unknown }).flavor,
	"lore.origin": (e) => {
		const lore = (e as { lore?: unknown }).lore;
		return isRecord(lore) ? lore.origin : undefined;
	},
	"lore.history": (e) => {
		const lore = (e as { lore?: unknown }).lore;
		return isRecord(lore) ? lore.history : undefined;
	},
	discovery_lore: (e) => (e as { discovery_lore?: unknown }).discovery_lore,
};

function auditBoilerplateRepetition(
	datasets: Record<string, AuditEntry[]>,
	issues: CompendiumAuditIssue[],
) {
	const freq: Record<string, Map<string, number>> = {};
	for (const label of Object.keys(boilerplateNarrativeFields))
		freq[label] = new Map();
	for (const ds of BOILERPLATE_CORPUS_DATASETS) {
		for (const entry of datasets[ds] ?? []) {
			for (const [label, get] of Object.entries(boilerplateNarrativeFields)) {
				const value = getString(get(entry));
				if (value) freq[label].set(value, (freq[label].get(value) ?? 0) + 1);
			}
		}
	}
	for (const ds of BOILERPLATE_CORPUS_DATASETS) {
		if (!boilerplateEnforcedDatasets.has(ds)) continue;
		for (const entry of datasets[ds] ?? []) {
			for (const [label, get] of Object.entries(boilerplateNarrativeFields)) {
				const value = getString(get(entry));
				const count = value ? (freq[label].get(value) ?? 0) : 0;
				if (count > BOILERPLATE_MAX_SHARE) {
					addIssue(issues, {
						severity: "error",
						dataset: ds,
						code: "boilerplate_repetition",
						message: `${label} is pooled boilerplate (shared by ${count} entries) — author bespoke text.`,
						entryId: entry.id,
						entryName: entry.name,
					});
				}
			}
		}
	}
}

function auditShallowMagicEffect(
	datasets: Record<string, AuditEntry[]>,
	issues: CompendiumAuditIssue[],
) {
	for (const ds of BOILERPLATE_CORPUS_DATASETS) {
		if (!boilerplateEnforcedDatasets.has(ds)) continue;
		for (const entry of datasets[ds] ?? []) {
			const rarity = (
				getString((entry as { rarity?: unknown }).rarity) ?? ""
			).toLowerCase();
			if (!rarity || rarity === "common") continue;
			const name = getString(entry.name) ?? "";
			// An intentional "+N Weapon/Armor/…" plain item is allowed to be flat.
			if (/\+\s*\d+\s+\w+/.test(name)) continue;
			const effects = isRecord(entry.effects) ? entry.effects : null;
			const passive = Array.isArray(effects?.passive) ? effects.passive : [];
			const active = Array.isArray(effects?.active) ? effects.active : [];
			// Relics carry their mechanics in an `abilities[]` array (each an
			// object with a `description`), not the Item-shaped effects.passive/
			// active. Fold those descriptions in so a relic whose only mechanic is
			// a flat "+X" is caught the same as a shallow item.
			const rawAbilities = (entry as { abilities?: unknown }).abilities;
			const abilityList: unknown[] = Array.isArray(rawAbilities)
				? rawAbilities
				: [];
			const abilityText = abilityList
				.map((a) => (isRecord(a) ? getString(a.description) : undefined))
				.filter((x): x is string => typeof x === "string");
			const strings = [...passive, ...active, ...abilityText].filter(
				(x): x is string => typeof x === "string",
			);
			if (strings.length !== 1) continue;
			const only = strings[0];
			const flatPlus =
				/\+\s*\d+/.test(only) &&
				only.length < 40 &&
				!/(on\s+(hit|crit)|when|if|reroll|advantage|resist|ignore|extra|additional|instead|regain|bonus action|reaction|per turn|once per)/i.test(
					only,
				);
			if (flatPlus) {
				addIssue(issues, {
					severity: "error",
					dataset: ds,
					code: "shallow_magic_effect",
					message: `Uncommon+ item's only effect is a flat "${only}" — give it a distinctive mechanic or name it an intentional "+N" item.`,
					entryId: entry.id,
					entryName: entry.name,
				});
			}
		}
	}
}

// SRD 5.1 completeness (Phase 1b). Every requirement in the manifest whose
// status is `present` or `authored` must resolve to a real item name in the
// equipment/items corpus; `omitted` requirements are documented but not gated.
function auditSrdCompleteness(
	datasets: Record<string, AuditEntry[]>,
	issues: CompendiumAuditIssue[],
) {
	const names = new Set<string>();
	for (const dataset of ["equipment", "items"]) {
		for (const entry of datasets[dataset] ?? []) {
			const name = getString(entry.name);
			if (name) names.add(name.trim().toLowerCase());
		}
	}

	for (const req of srdItemManifest.requirements as SrdRequirement[]) {
		if (req.status === "omitted") continue;
		const ra = req.ra?.trim();
		if (!ra) {
			addIssue(issues, {
				severity: "error",
				dataset: "items",
				code: "srd_completeness",
				message: `SRD "${req.srd}" (${req.category}) is marked ${req.status} but has no RA analog name.`,
			});
			continue;
		}
		if (!names.has(ra.toLowerCase())) {
			addIssue(issues, {
				severity: "error",
				dataset: "items",
				code: "srd_completeness",
				message: `SRD "${req.srd}" (${req.category}) has no RA analog "${ra}" in the compendium.`,
				entryName: ra,
			});
		}
	}
}

export async function runCompendiumAudit(
	provider: AuditProvider,
): Promise<CompendiumAuditSummary> {
	const datasets = await loadAuditDatasets(provider);
	const issues: CompendiumAuditIssue[] = [];

	for (const [dataset, entries] of Object.entries(datasets)) {
		auditDuplicates(dataset, entries, issues);
		for (const entry of entries) {
			auditRequiredFields(dataset, entry, issues);
			if (castableDatasets.has(dataset)) {
				auditCastableEntry(dataset, entry, issues);
			}
			if (semanticAuditedDatasets.has(dataset)) {
				auditNamingCase(dataset, entry, issues);
				auditDamageThemeMismatch(dataset, entry, issues);
				auditUtilityWithDamage(dataset, entry, issues);
			}
			if (templatedLanguageDatasets.has(dataset)) {
				auditTemplatedLanguage(dataset, entry, issues);
			}
			if (dataset === "equipment" || dataset === "relics") {
				auditEquipmentEntry(dataset, entry, issues);
			}
			if (itemRulePayloadDatasets.has(dataset)) {
				auditItemRulesPayload(dataset, entry, issues);
			}
			if (itemCoherenceDatasets.has(dataset)) {
				auditItemInjectedTemplate(dataset, entry, issues);
				auditVagueCatchallName(dataset, entry, issues);
			}
			if (dataset === "tattoos") {
				auditTattooFieldContradiction(dataset, entry, issues);
			}
			if (dataset === "vehicles") {
				auditVehicleCompleteness(dataset, entry, issues);
			}
			if (dataset === "pantheon") {
				auditDeityCompleteness(dataset, entry, issues);
			}
			if (dataset === "feats") {
				auditFeatCompleteness(dataset, entry, issues);
			}
			if (dataset === "backgrounds") {
				auditBackgroundCompleteness(dataset, entry, issues);
			}
			if (dataset === "conditions") {
				auditConditionCompleteness(dataset, entry, issues);
			}
			if (dataset === "skills") {
				auditSkillCompleteness(dataset, entry, issues);
			}
			if (dataset === "sigils" || dataset === "tattoos") {
				auditSigilOrTattooCompleteness(dataset, entry, issues);
			}
			if (dataset === "fighting_styles") {
				auditFightingStyleCompleteness(dataset, entry, issues);
			}
			if (dataset === "shadow_soldiers") {
				auditShadowSoldierCompleteness(dataset, entry, issues);
			}
			// 5e completeness contract (compendium5eContract.ts).
			if (dataset === "anomalies") {
				runContract(dataset, entry, issues, validateMonsterStatblock);
			}
			if (dataset === "spells") {
				runContract(dataset, entry, issues, validateSpellComponents);
			}
			if (dataset === "jobs") {
				runContract(dataset, entry, issues, validateJob5e);
			}
			if (dataset === "paths") {
				runContract(dataset, entry, issues, validatePath5e);
			}
			if (dataset === "equipment") {
				const kind = getEquipmentKind(entry);
				if (kind === "weapon") {
					runContract(dataset, entry, issues, validateWeapon5e);
				}
				if (kind === "armor" || kind === "shield") {
					runContract(dataset, entry, issues, validateArmor5e);
				}
			}
		}
	}
	auditItemPayloadUniqueness(datasets, issues);
	auditSrdCompleteness(datasets, issues);
	auditBoilerplateRepetition(datasets, issues);
	auditShallowMagicEffect(datasets, issues);
	auditVehicleBondedReferences(
		datasets.vehicles ?? [],
		datasets.anomalies ?? [],
		issues,
	);

	const errors = issues.filter((issue) => issue.severity === "error");
	const warnings = issues.filter((issue) => issue.severity === "warning");
	const datasetCounts = Object.fromEntries(
		Object.entries(datasets).map(([dataset, entries]) => [
			dataset,
			entries.length,
		]),
	);
	const totalEntries = Object.values(datasetCounts).reduce(
		(total, count) => total + count,
		0,
	);

	return {
		datasets: datasetCounts,
		totalEntries,
		issues,
		errors,
		warnings,
	};
}

export function formatCompendiumAuditIssue(
	issue: CompendiumAuditIssue,
): string {
	const entryLabel =
		issue.entryName || issue.entryId
			? ` (${issue.entryName ?? issue.entryId})`
			: "";
	return `[${issue.severity.toUpperCase()}] ${issue.dataset}:${issue.code}${entryLabel} ${issue.message}`;
}

export function formatCompendiumAuditReport(
	summary: CompendiumAuditSummary,
): string {
	const lines = [
		"=== COMPENDIUM AUDIT START ===",
		`Datasets: ${Object.entries(summary.datasets)
			.map(([dataset, count]) => `${dataset}=${count}`)
			.join(", ")}`,
		`Total entries: ${summary.totalEntries}`,
		`Errors: ${summary.errors.length}`,
		`Warnings: ${summary.warnings.length}`,
	];

	const buckets = new Map<string, number>();
	for (const issue of summary.issues) {
		const key = `${issue.severity}:${issue.dataset}:${issue.code}`;
		buckets.set(key, (buckets.get(key) ?? 0) + 1);
	}

	if (buckets.size > 0) {
		lines.push("Issue buckets:");
		for (const [key, count] of [...buckets.entries()].sort(
			(a, b) => b[1] - a[1],
		)) {
			lines.push(`- ${key} x${count}`);
		}
	}

	if (summary.errors.length > 0) {
		lines.push("Error details:");
		for (const issue of summary.errors) {
			lines.push(`- ${formatCompendiumAuditIssue(issue)}`);
		}
	}

	const warningPreview = summary.warnings.slice(0, 12);
	if (warningPreview.length > 0) {
		lines.push("Warning preview:");
		for (const issue of warningPreview) {
			lines.push(`- ${formatCompendiumAuditIssue(issue)}`);
		}
	}

	lines.push("=== COMPENDIUM AUDIT COMPLETE ===");
	return lines.join("\n");
}
