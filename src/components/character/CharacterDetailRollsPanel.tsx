import { Badge } from "@/components/ui/badge";
import type { ActionResolutionPayload } from "@/lib/actionResolution";
import {
	formatAttackLine,
	formatDamageLine,
	formatSaveLine,
} from "@/lib/canonicalActionDisplay";
import { formatModifier } from "@/lib/characterCalculations";
import { formatRegentVernacular } from "@/lib/vernacular";

type DetailRecord = Record<string, unknown>;

interface DetailLine {
	label: string;
	value: string;
}

interface CharacterDetailRollsPanelProps {
	payload: unknown;
	type?: string;
}

function asRecord(value: unknown): DetailRecord | null {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value as DetailRecord;
}

function stringValue(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) return value.trim();
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return null;
}

function booleanValue(value: unknown): boolean | null {
	if (typeof value === "boolean") return value;
	return null;
}

function numberValue(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return null;
}

function recordField(
	record: DetailRecord | null,
	key: string,
): DetailRecord | null {
	return record ? asRecord(record[key]) : null;
}

function readString(
	primary: DetailRecord | null,
	fallback: DetailRecord | null,
	keys: string[],
): string | null {
	for (const key of keys) {
		const primaryValue = stringValue(primary?.[key]);
		if (primaryValue) return primaryValue;
		const fallbackValue = stringValue(fallback?.[key]);
		if (fallbackValue) return fallbackValue;
	}
	return null;
}

function readNumber(
	primary: DetailRecord | null,
	fallback: DetailRecord | null,
	keys: string[],
): number | null {
	for (const key of keys) {
		const primaryValue = numberValue(primary?.[key]);
		if (primaryValue !== null) return primaryValue;
		const fallbackValue = numberValue(fallback?.[key]);
		if (fallbackValue !== null) return fallbackValue;
	}
	return null;
}

function readBoolean(
	primary: DetailRecord | null,
	fallback: DetailRecord | null,
	keys: string[],
): boolean | null {
	for (const key of keys) {
		const primaryValue = booleanValue(primary?.[key]);
		if (primaryValue !== null) return primaryValue;
		const fallbackValue = booleanValue(fallback?.[key]);
		if (fallbackValue !== null) return fallbackValue;
	}
	return null;
}

function valueToText(value: unknown): string {
	const primitive = stringValue(value);
	if (primitive) return formatRegentVernacular(primitive);
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (Array.isArray(value)) {
		return value.map(valueToText).filter(Boolean).join(", ");
	}

	const record = asRecord(value);
	if (!record) return "";

	const direct =
		stringValue(record.display) ??
		stringValue(record.text) ??
		stringValue(record.label) ??
		stringValue(record.name);
	if (direct) return formatRegentVernacular(direct);

	const amount =
		stringValue(record.distance) ??
		stringValue(record.value) ??
		stringValue(record.amount) ??
		stringValue(record.time);
	const unit = stringValue(record.unit);
	const type = stringValue(record.type);
	if (amount && unit) return formatRegentVernacular(`${amount} ${unit}`);
	if (type && amount) return formatRegentVernacular(`${type} ${amount}`);
	if (type) return formatRegentVernacular(type);

	return Object.entries(record)
		.map(([key, entryValue]) => {
			const text = valueToText(entryValue);
			return text ? `${key.replace(/_/g, " ")}: ${text}` : "";
		})
		.filter(Boolean)
		.join(", ");
}

function readStringArray(
	primary: DetailRecord | null,
	fallback: DetailRecord | null,
	keys: string[],
): string[] {
	const values: string[] = [];
	for (const source of [primary, fallback]) {
		for (const key of keys) {
			const value = source?.[key];
			if (Array.isArray(value)) {
				values.push(...value.map(valueToText).filter(Boolean));
			} else {
				const text = valueToText(value);
				if (text) values.push(text);
			}
		}
	}
	return Array.from(
		new Map(values.map((value) => [value.toLowerCase(), value])).values(),
	);
}

function payloadField(
	record: DetailRecord | null,
): ActionResolutionPayload | undefined {
	const payload = asRecord(record?.payload);
	if (payload?.version === 1)
		return payload as unknown as ActionResolutionPayload;
	return undefined;
}

function isActionLike(record: DetailRecord): boolean {
	return (
		"sourceId" in record ||
		"attackBonus" in record ||
		"attackRoll" in record ||
		"damageRoll" in record ||
		"saveDC" in record ||
		payloadField(record) !== undefined
	);
}

function selectAction(record: DetailRecord): DetailRecord | null {
	return (
		asRecord(record.action) ??
		asRecord(record.computedAction) ??
		(isActionLike(record) ? record : null)
	);
}

function selectEntry(record: DetailRecord): DetailRecord | null {
	return (
		asRecord(record.entry) ??
		asRecord(record.item) ??
		asRecord(record.spell) ??
		asRecord(record.power) ??
		asRecord(record.technique) ??
		record
	);
}

function selectCanonical(
	record: DetailRecord,
	entry: DetailRecord | null,
): DetailRecord | null {
	return (
		asRecord(record.canonical) ??
		recordField(entry, "spell") ??
		recordField(entry, "power") ??
		recordField(entry, "technique") ??
		null
	);
}

function buildYourRollLines(action: DetailRecord | null): DetailLine[] {
	if (!action) return [];
	const payload = payloadField(action);
	const ability = stringValue(action.formulaAbility);
	const abilityModifier = numberValue(action.formulaAbilityModifier);
	const attackBonus = numberValue(action.attackBonus);
	const attackRoll =
		stringValue(action.attackRoll) ?? payload?.attack?.roll ?? null;
	const saveDC = numberValue(action.saveDC) ?? payload?.save?.dc ?? null;
	const saveAbility =
		stringValue(action.saveAbility) ?? payload?.save?.ability ?? null;
	const damageRoll =
		stringValue(action.damageRoll) ?? payload?.damage?.roll ?? null;
	const damageType =
		stringValue(action.damageType) ?? payload?.damage?.type ?? null;
	const lines: DetailLine[] = [];

	if (ability && abilityModifier !== null) {
		lines.push({
			label: "Ability",
			value: `${ability} ${formatModifier(abilityModifier)}`,
		});
	}

	const attackLine = formatAttackLine({
		ability,
		abilityModifier,
		attackBonus,
		attackRoll,
	});
	if (attackLine) lines.push({ label: "Attack Roll", value: attackLine });

	const saveLine = formatSaveLine({ saveDC, saveAbility });
	if (saveLine) lines.push({ label: "Save DC", value: saveLine });

	const damageLine = formatDamageLine({
		damageRoll,
		damageType,
		abilityModifier,
	});
	if (damageLine) lines.push({ label: "Damage", value: damageLine });

	const activation = stringValue(action.activation);
	if (activation)
		lines.push({
			label: "Activation",
			value: formatRegentVernacular(activation),
		});

	const range = stringValue(action.range);
	if (range)
		lines.push({ label: "Range", value: formatRegentVernacular(range) });

	const resourceMax = numberValue(action.resourceMax);
	const resourceCurrent = numberValue(action.resourceCurrent);
	if (resourceMax !== null || resourceCurrent !== null) {
		lines.push({
			label: "Uses",
			value: `${resourceCurrent ?? "—"}/${resourceMax ?? "—"}`,
		});
	}

	return lines;
}

function buildCanonicalLines(
	canonical: DetailRecord | null,
	entry: DetailRecord | null,
): DetailLine[] {
	const lines: DetailLine[] = [];
	const level = readNumber(canonical, entry, [
		"spell_level",
		"power_level",
		"level_requirement",
		"level",
	]);
	if (level !== null) lines.push({ label: "Level", value: String(level) });

	const activation = readString(canonical, entry, [
		"casting_time",
		"activation_time",
		"activation_action",
	]);
	if (activation)
		lines.push({
			label: "Activation",
			value: formatRegentVernacular(activation),
		});

	const activationRecord =
		recordField(canonical, "activation") ?? recordField(entry, "activation");
	if (!activation && activationRecord) {
		const activationText = valueToText(activationRecord);
		if (activationText)
			lines.push({ label: "Activation", value: activationText });
	}

	const range = readString(canonical, entry, ["range"]);
	if (range)
		lines.push({ label: "Range", value: formatRegentVernacular(range) });

	const duration = readString(canonical, entry, ["duration"]);
	if (duration)
		lines.push({ label: "Duration", value: formatRegentVernacular(duration) });

	const target = readString(canonical, entry, ["target"]);
	if (target)
		lines.push({ label: "Target", value: formatRegentVernacular(target) });

	const mechanics =
		recordField(canonical, "mechanics") ?? recordField(entry, "mechanics");
	const mechanicsAttack = recordField(mechanics, "attack");
	const mechanicsSave = recordField(mechanics, "saving_throw");
	const hasAttack = readBoolean(canonical, entry, ["has_attack_roll"]);
	if (hasAttack || mechanicsAttack) {
		const modifier = stringValue(mechanicsAttack?.modifier);
		lines.push({
			label: "Attack",
			value: modifier ? `Attack roll ${modifier}` : "Attack roll",
		});
	}

	const hasSave = readBoolean(canonical, entry, ["has_save"]);
	const saveAbility =
		readString(canonical, entry, ["save_ability", "saving_throw_ability"]) ??
		stringValue(mechanicsSave?.ability);
	const saveDc = stringValue(mechanicsSave?.dc);
	if (hasSave || mechanicsSave || saveAbility) {
		lines.push({
			label: "Save",
			value: saveDc
				? formatSaveLine({ saveDC: Number(saveDc), saveAbility }) ||
					`DC ${saveDc}`
				: saveAbility
					? `${saveAbility} save`
					: "Saving throw",
		});
	}

	const mechanicsDamage =
		stringValue(recordField(mechanicsAttack, "damage")?.dice) ??
		stringValue(mechanicsAttack?.damage);
	const damage =
		readString(canonical, entry, ["damage_roll", "damage"]) ?? mechanicsDamage;
	const damageType = readString(canonical, entry, ["damage_type"]);
	const damageLine = formatDamageLine({ damageRoll: damage, damageType });
	if (damageLine) lines.push({ label: "Base Damage", value: damageLine });

	const armorClass = readString(canonical, entry, ["armor_class"]);
	if (armorClass) lines.push({ label: "Armor Class", value: armorClass });

	const weaponType = readString(canonical, entry, [
		"weapon_type",
		"armor_type",
		"item_type",
		"equipment_type",
	]);
	if (weaponType)
		lines.push({ label: "Type", value: formatRegentVernacular(weaponType) });

	const properties = readStringArray(canonical, entry, [
		"properties",
		"simple_properties",
	]);
	if (properties.length > 0) {
		lines.push({ label: "Properties", value: properties.join(", ") });
	}

	const rarity = readString(canonical, entry, ["rarity"]);
	if (rarity)
		lines.push({ label: "Rarity", value: formatRegentVernacular(rarity) });

	const weight = readNumber(canonical, entry, ["weight"]);
	if (weight !== null) lines.push({ label: "Weight", value: `${weight} lb.` });

	return lines;
}

function DetailLinesSection({
	title,
	subtitle,
	lines,
}: {
	title: string;
	subtitle?: string;
	lines: DetailLine[];
}) {
	if (lines.length === 0) return null;

	return (
		<div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-3">
			<div className="flex items-center justify-between gap-2">
				<div>
					<div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
						{title}
					</div>
					{subtitle && (
						<div className="text-[10px] text-muted-foreground mt-1">
							{subtitle}
						</div>
					)}
				</div>
				<Badge variant="outline" className="text-[10px] uppercase">
					{lines.length} stat{lines.length === 1 ? "" : "s"}
				</Badge>
			</div>
			<div className="space-y-2">
				{lines.map((line) => (
					<div
						key={`${line.label}:${line.value}`}
						className="flex items-start justify-between gap-3 rounded-sm border border-primary/10 bg-black/20 px-2 py-1.5"
					>
						<span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
							{line.label}
						</span>
						<span className="text-right text-xs font-semibold text-foreground">
							{line.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function CharacterDetailRollsPanel({
	payload,
	type,
}: CharacterDetailRollsPanelProps) {
	const record = asRecord(payload);
	if (!record) return null;

	const entry = selectEntry(record);
	const canonical = selectCanonical(record, entry);
	const action = selectAction(record);
	const yourLines = buildYourRollLines(action);
	const canonicalLines = buildCanonicalLines(canonical, entry);

	if (yourLines.length === 0 && canonicalLines.length === 0) return null;

	return (
		<div className="space-y-3">
			<DetailLinesSection
				title="YOUR ROLLS"
				subtitle="Resolved from this character's current sheet, equipment, proficiency, and modifiers."
				lines={yourLines}
			/>
			<DetailLinesSection
				title="CANONICAL REFERENCE"
				subtitle={
					type
						? `${type} rules data before character-specific modifiers.`
						: undefined
				}
				lines={canonicalLines}
			/>
		</div>
	);
}
