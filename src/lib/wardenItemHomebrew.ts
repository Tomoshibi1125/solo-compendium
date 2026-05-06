import type { WardenDeliverableItem } from "@/hooks/useWardenItemDelivery";

export type HomebrewItemFormState = {
	name: string;
	description: string;
	itemType: string;
	rarity: string;
	sourceBook: string;
	tagsText: string;
	weight: string;
	valueCredits: string;
	damage: string;
	damageType: string;
	armorClass: string;
	armorType: string;
	propertiesText: string;
	acBonus: string;
	attackBonus: string;
	damageBonus: string;
	charges: string;
	requiresAttunement: boolean;
	isContainer: boolean;
	capacityWeight: string;
	capacityVolume: string;
	resistancesText: string;
	immunitiesText: string;
	vulnerabilitiesText: string;
	conditionImmunitiesText: string;
};

export const createDefaultHomebrewItemForm = (): HomebrewItemFormState => ({
	name: "",
	description: "",
	itemType: "gear",
	rarity: "none",
	sourceBook: "Campaign Homebrew",
	tagsText: "",
	weight: "",
	valueCredits: "",
	damage: "",
	damageType: "",
	armorClass: "",
	armorType: "",
	propertiesText: "",
	acBonus: "",
	attackBonus: "",
	damageBonus: "",
	charges: "",
	requiresAttunement: false,
	isContainer: false,
	capacityWeight: "",
	capacityVolume: "",
	resistancesText: "",
	immunitiesText: "",
	vulnerabilitiesText: "",
	conditionImmunitiesText: "",
});

export const parseHomebrewTags = (raw: string): string[] =>
	raw
		.split(",")
		.map((entry) => entry.trim())
		.filter(
			(entry, index, all) => entry.length > 0 && all.indexOf(entry) === index,
		);

export const buildHomebrewItemProperties = (
	form: HomebrewItemFormState,
): string[] => {
	const properties: string[] = [];
	const push = (value: string | null | undefined) => {
		const trimmed = value?.trim();
		if (!trimmed) return;
		const key = trimmed.toLowerCase();
		if (properties.some((entry) => entry.toLowerCase() === key)) return;
		properties.push(trimmed);
	};
	const pushSigned = (raw: string, suffix: string) => {
		const value = parseOptionalNumber(raw);
		if (value === null || value === 0) return;
		push(`${value >= 0 ? "+" : ""}${value} ${suffix}`);
	};
	const pushCsvProperty = (raw: string, label: string) => {
		const entries = parseHomebrewTags(raw);
		if (entries.length > 0) push(`${label}: ${entries.join(", ")}`);
	};

	if (form.damage.trim()) {
		push(
			form.damageType.trim()
				? `${form.damage.trim()} ${form.damageType.trim()}`
				: form.damage.trim(),
		);
	}
	if (form.armorClass.trim()) push(`AC ${form.armorClass.trim()}`);
	push(form.armorType);
	for (const property of form.propertiesText
		.split(/\r?\n/)
		.map((entry) => entry.trim())
		.filter(Boolean)) {
		push(property);
	}
	pushSigned(form.acBonus, "AC");
	pushSigned(form.attackBonus, "to attack");
	pushSigned(form.damageBonus, "to damage");
	pushCsvProperty(form.resistancesText, "Resistance");
	pushCsvProperty(form.immunitiesText, "Immunity");
	pushCsvProperty(form.vulnerabilitiesText, "Vulnerability");
	pushCsvProperty(form.conditionImmunitiesText, "Condition immunity");

	return properties;
};

export const buildHomebrewItemData = (
	form: HomebrewItemFormState,
): Record<string, unknown> => {
	const rarity = normalizeHomebrewRarity(form.rarity);
	const charges = parseOptionalInteger(form.charges);
	const modifiers: Record<string, number> = {};
	const acBonus = parseOptionalNumber(form.acBonus);
	const attackBonus = parseOptionalNumber(form.attackBonus);
	const damageBonus = parseOptionalNumber(form.damageBonus);
	if (acBonus !== null && acBonus !== 0) modifiers.acBonus = acBonus;
	if (attackBonus !== null && attackBonus !== 0)
		modifiers.attackBonus = attackBonus;
	if (damageBonus !== null && damageBonus !== 0)
		modifiers.damageBonus = damageBonus;

	return {
		type: form.itemType,
		equipment_type: form.itemType,
		item_type: form.itemType,
		description: form.description.trim(),
		rarity,
		weight: parseOptionalNumber(form.weight),
		value_credits: parseOptionalInteger(form.valueCredits),
		damage: form.damage.trim() || null,
		damage_type: form.damageType.trim() || null,
		armor_class: form.armorClass.trim() || null,
		armor_type: form.armorType.trim() || null,
		properties: buildHomebrewItemProperties(form),
		requires_attunement: form.requiresAttunement,
		charges,
		charges_max: charges,
		is_container: form.isContainer,
		capacity_weight: parseOptionalNumber(form.capacityWeight),
		capacity_volume: parseOptionalNumber(form.capacityVolume),
		modifiers,
		resistances: parseHomebrewTags(form.resistancesText),
		immunities: parseHomebrewTags(form.immunitiesText),
		vulnerabilities: parseHomebrewTags(form.vulnerabilitiesText),
		condition_immunities: parseHomebrewTags(form.conditionImmunitiesText),
	};
};

export const buildHomebrewDeliverableItem = (
	form: HomebrewItemFormState,
	homebrewId?: string | null,
): WardenDeliverableItem => {
	const charges = parseOptionalInteger(form.charges);
	const modifiers = buildHomebrewItemData(form).modifiers as Record<
		string,
		number
	>;
	return {
		id: homebrewId ?? undefined,
		name: form.name.trim(),
		description: form.description.trim() || null,
		type: form.itemType,
		sourceKind: "homebrew",
		rarity: normalizeHomebrewRarity(form.rarity),
		weight: parseOptionalNumber(form.weight),
		valueCredits: parseOptionalInteger(form.valueCredits),
		properties: buildHomebrewItemProperties(form),
		requiresAttunement: form.requiresAttunement,
		sourceBook: form.sourceBook.trim() || "Campaign Homebrew",
		homebrewId: homebrewId ?? null,
		tags: parseHomebrewTags(form.tagsText),
		damage: form.damage.trim() || null,
		damageType: form.damageType.trim() || null,
		armorClass: form.armorClass.trim() || null,
		chargesCurrent: charges,
		chargesMax: charges,
		customModifiers: {
			...modifiers,
			source: "homebrew",
			homebrew_id: homebrewId ?? null,
		},
		isContainer: form.isContainer,
		capacityWeight: parseOptionalNumber(form.capacityWeight),
		capacityVolume: parseOptionalNumber(form.capacityVolume),
	};
};

export const normalizeHomebrewRarity = (rarity: string): string | null =>
	rarity && rarity !== "none" ? rarity : null;

const parseOptionalNumber = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const parsed = Number.parseFloat(trimmed);
	return Number.isFinite(parsed) ? parsed : null;
};

const parseOptionalInteger = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const parsed = Number.parseInt(trimmed, 10);
	return Number.isFinite(parsed) ? parsed : null;
};
