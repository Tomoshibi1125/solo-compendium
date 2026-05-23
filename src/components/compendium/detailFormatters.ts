import { formatRegentVernacular } from "@/lib/vernacular";

type DetailLine = {
	label: string;
	text: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const compact = (values: Array<string | null | undefined>): string[] =>
	values.filter((value): value is string => Boolean(value?.trim()));

const stringifyScalar = (value: unknown): string => {
	if (typeof value === "string") return formatRegentVernacular(value);
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return "";
};

export const formatDetailValue = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	if (Array.isArray(value)) {
		return value.map(formatDetailValue).filter(Boolean).join(", ");
	}
	if (!isRecord(value)) return stringifyScalar(value);

	const type = stringifyScalar(value.type);
	const primary = stringifyScalar(value.distance ?? value.value ?? value.time);
	const unit = stringifyScalar(value.unit);
	const cost = stringifyScalar(value.cost);
	const primaryWithUnit = compact([primary, unit]).join(" ");
	const label = primaryWithUnit || type || cost;
	const details = compact([
		type && label.toLowerCase() !== type.toLowerCase() ? type : null,
		cost && label.toLowerCase() !== cost.toLowerCase() ? `Cost ${cost}` : null,
	]);

	return details.length > 0 ? `${label} (${details.join("; ")})` : label;
};

export const formatAreaValue = (area: unknown): string => {
	if (!isRecord(area)) return formatDetailValue(area);
	const type = stringifyScalar(area.type);
	const size = stringifyScalar(area.size);
	const shape = stringifyScalar(area.shape);
	const label = compact([size, shape]).join(" ") || type;
	return type && label.toLowerCase() !== type.toLowerCase()
		? `${label} (${type})`
		: label;
};

const pushLine = (lines: DetailLine[], label: string, value: unknown) => {
	const text = formatDetailValue(value);
	if (text) lines.push({ label, text });
};

export const getEffectLines = (effects: unknown): DetailLine[] => {
	if (!effects) return [];
	if (Array.isArray(effects)) {
		return effects
			.map(formatDetailValue)
			.filter(Boolean)
			.map((text) => ({ label: "Effect", text }));
	}
	if (!isRecord(effects)) return [];

	const lines: DetailLine[] = [];
	pushLine(lines, "Primary", effects.primary ?? effects.primaryEffect);
	pushLine(lines, "Secondary", effects.secondary ?? effects.secondaryEffect);
	pushLine(lines, "Tertiary", effects.tertiary);
	pushLine(lines, "Passive", effects.passive);

	if (Array.isArray(effects.active)) {
		for (const active of effects.active) {
			if (!isRecord(active)) continue;
			const name = formatDetailValue(active.name) || "Active Effect";
			const detail = compact([
				formatDetailValue(active.description),
				formatDetailValue(active.action),
				formatDetailValue(active.frequency),
			]).join(" · ");
			if (detail) lines.push({ label: name, text: detail });
		}
	}

	if (Array.isArray(effects.passiveBonuses)) {
		for (const bonus of effects.passiveBonuses) {
			if (!isRecord(bonus)) continue;
			const stat = formatDetailValue(bonus.stat);
			const value = formatDetailValue(bonus.value);
			if (stat || value) {
				lines.push({
					label: "Passive Bonus",
					text: compact([stat, value]).join(" "),
				});
			}
		}
	}

	return lines;
};

export const getLimitationLines = (limitations: unknown): DetailLine[] => {
	if (!isRecord(limitations)) return [];
	const lines: DetailLine[] = [];
	pushLine(lines, "Uses", limitations.uses ?? limitations.uses_per_rest);
	pushLine(lines, "Recharge", limitations.recharge);
	pushLine(lines, "Charges", limitations.charges);
	pushLine(lines, "Conditions", limitations.conditions);
	pushLine(lines, "Prerequisites", limitations.prerequisites);
	pushLine(lines, "Cost", limitations.cost);
	pushLine(lines, "Exhaustion", limitations.exhaustion);
	if (Object.hasOwn(limitations, "requires_attunement")) {
		lines.push({
			label: "Attunement",
			text: limitations.requires_attunement ? "Required" : "Not required",
		});
	}
	if (Object.hasOwn(limitations, "consumable")) {
		lines.push({
			label: "Consumable",
			text: limitations.consumable ? "Yes" : "No",
		});
	}
	return lines;
};
