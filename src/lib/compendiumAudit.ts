import type { Json } from "@/integrations/supabase/types";

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
	mechanics?: unknown;
	effects?: unknown;
	properties?: unknown;
	weight?: number | null;
	damage?: unknown;
}

type AuditProvider = {
	getAnomalies: (search?: string) => Promise<AuditEntry[]>;
	getBackgrounds: (search?: string) => Promise<AuditEntry[]>;
	getConditions: (search?: string) => Promise<AuditEntry[]>;
	getFeats: (search?: string) => Promise<AuditEntry[]>;
	getItems: (search?: string) => Promise<AuditEntry[]>;
	getJobs: (search?: string) => Promise<AuditEntry[]>;
	getLocations: (search?: string) => Promise<AuditEntry[]>;
	getPaths: (search?: string) => Promise<AuditEntry[]>;
	getPowers: (search?: string) => Promise<AuditEntry[]>;
	getRegents: (search?: string) => Promise<AuditEntry[]>;
	getRelics: (search?: string) => Promise<AuditEntry[]>;
	getRunes: (search?: string) => Promise<AuditEntry[]>;
	getSigils: (search?: string) => Promise<AuditEntry[]>;
	getSkills: (search?: string) => Promise<AuditEntry[]>;
	getSpells: (search?: string) => Promise<AuditEntry[]>;
	getTattoos: (search?: string) => Promise<AuditEntry[]>;
	getTechniques: (search?: string) => Promise<AuditEntry[]>;
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
	/circulating in the underground hunter markets/i,
	// Tattoo stock authoring phrases
	/inked by rogue alchemists looking to push hunter flesh/i,
	/highly regulated by the international guild association/i,
	/widespread among underground syndicates/i,
	/focus your intent on the glyph/i,
	// Cross-dataset stock flavor
	/silent, hungry\.?$/i,
	/appeared in a hunter's inventory after a system notification/i,
	/the manifestation of true hunter authority/i,
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
		pattern: /\b(Radiant|Sun|Solar|Corona|Holy|Divine|Dawn|Judgment)\b/i,
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
	{ pattern: /\b(Poison|Toxin|Venom|Plague|Blight)\b/i, expected: ["poison"] },
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
		pattern: /\b(Blood|Crimson|Sanguine|Carnage|Gore)\b/i,
		expected: ["necrotic", "slashing", "force"],
	},
	{
		pattern:
			/\b(Entropy|Decay|Rot|Wither|Siphon|Drain|Necrotic|Annihilation|Erasure|Termination)\b/i,
		expected: ["necrotic"],
	},
	{
		pattern: /\b(Lightning|Thunder|Storm|Tempest|Surge|Shock|Electric)\b/i,
		expected: ["lightning", "thunder"],
	},
	{ pattern: /\b(Arcane|Mana|Aether)\b/i, expected: ["force"] },
];

// Utility/support name tokens — entries matching any of these should not
// carry a damage roll. The audit flags entries that do.
const UTILITY_NAME_TOKENS: RegExp[] = [
	/\b(regenerat|heal|restor|mend|cure|revital)/i,
	/\b(invisibil|invisible|cloak|veil|obscure)/i,
	/\b(telepath|mind link|mind speech|mind speak)/i,
	/\b(true sight|clairvoy|scry|detect|reveal)/i,
	/\b(shadow step|blink|teleport|phase|step of)/i,
	/\b(resilience|fortitude|endurance|guard|ward)/i,
	/\b(charm|persuade|calm|beguile|pacify)/i,
	/\b(recovery|refresh|renew|meditate)/i,
	/\b(lycanthrop|shapeshift|polymorph|transform)/i,
	/\b(petrif|paralysis|stun|freeze mind)/i,
];

const DAMAGE_TYPE_PROFILE_REGEX =
	/\b(fire|cold|lightning|thunder|necrotic|radiant|psychic|force|acid|poison|slashing|piercing|bludgeoning)\b/i;

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
		backgrounds,
		conditions,
		feats,
		items,
		jobs,
		locations,
		paths,
		powers,
		regents,
		relics,
		runes,
		sigils,
		skills,
		spells,
		tattoos,
		techniques,
	] = await Promise.all([
		provider.getAnomalies(""),
		provider.getBackgrounds(""),
		provider.getConditions(""),
		provider.getFeats(""),
		provider.getItems(""),
		provider.getJobs(""),
		provider.getLocations(""),
		provider.getPaths(""),
		provider.getPowers(""),
		provider.getRegents(""),
		provider.getRelics(""),
		provider.getRunes(""),
		provider.getSigils(""),
		provider.getSkills(""),
		provider.getSpells(""),
		provider.getTattoos(""),
		provider.getTechniques(""),
	]);

	return {
		anomalies,
		backgrounds,
		conditions,
		equipment: items.filter((entry) => isEquipmentLikeEntry(entry as never)),
		feats,
		items: items.filter((entry) => !isEquipmentLikeEntry(entry as never)),
		jobs,
		locations,
		paths,
		powers,
		regents,
		relics,
		runes,
		sigils,
		skills,
		spells,
		tattoos,
		techniques,
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

	if (!attack && !savingThrow && !healing) {
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
		getString(mechanics.damage_profile) ??
		getString(mechanics.damage);
	if (!formula) {
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
	entry: AuditEntry,
	issues: CompendiumAuditIssue[],
) {
	const mechanicalSignals = [
		Array.isArray(entry.properties) ? entry.properties.length > 0 : false,
		isRecord((entry as { item_properties?: unknown }).item_properties),
		isRecord(entry.effects),
		Boolean(getString(entry.damage)),
		Boolean(getString((entry as { armor_class?: unknown }).armor_class)),
		typeof entry.weight === "number",
	];
	if (mechanicalSignals.some(Boolean)) return;

	addIssue(issues, {
		severity: "warning",
		dataset: "equipment",
		code: "mechanically_thin_equipment",
		message:
			"Equipment entry lacks explicit mechanics, properties, effects, or numeric payload.",
		entryId: entry.id,
		entryName: entry.name,
	});
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
			if (dataset === "equipment") {
				auditEquipmentEntry(entry, issues);
			}
		}
	}

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
