import type { Json } from "@/integrations/supabase/types";
import { resolveCanonicalReference } from "@/lib/canonicalCompendium";

const OVERLAY_KEYS = ["monarch_overlays", "regent_overlays"] as const;
const GEMINI_OVERLAY_KEYS = [
	"monarch_overlays",
	"monarchOverlays",
	"regent_overlays",
	"regentOverlays",
] as const;
const MODIFIER_OPERATIONS = new Set(["add", "set", "multiply"]);

function stringOrNull(value: unknown): string | null {
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function recordOrNull(value: unknown): Record<string, unknown> | null {
	return value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: null;
}

function normalizeModifiers(value: unknown): Json {
	if (!Array.isArray(value)) return [];
	return value
		.map((modifier) => {
			const record = recordOrNull(modifier);
			if (!record) return null;
			const stat = stringOrNull(record.stat);
			const source = stringOrNull(record.source);
			const numericValue = Number(record.value);
			const operation = stringOrNull(record.operation);
			if (
				!stat ||
				!source ||
				!Number.isFinite(numericValue) ||
				!operation ||
				!MODIFIER_OPERATIONS.has(operation)
			) {
				return null;
			}
			return {
				stat,
				source,
				value: numericValue,
				operation,
				condition: stringOrNull(record.condition),
			};
		})
		.filter((modifier): modifier is NonNullable<typeof modifier> => !!modifier);
}

export async function normalizeRegentOverlayIds(
	value: unknown,
): Promise<string[] | null> {
	if (!Array.isArray(value)) return null;
	const normalized: string[] = [];
	const seen = new Set<string>();

	for (const raw of value) {
		const ref = stringOrNull(raw);
		if (!ref) continue;
		const resolution = await resolveCanonicalReference("regents", {
			id: ref,
			name: ref,
		});
		const id = resolution.entry?.id;
		if (!id || seen.has(id)) continue;
		seen.add(id);
		normalized.push(id);
	}

	return normalized.length > 0 ? normalized : null;
}

export async function normalizeGeminiState(
	value: unknown,
): Promise<Json | null> {
	const record = recordOrNull(value);
	if (!record) return null;

	const next: Record<string, Json> = { ...(record as Record<string, Json>) };
	if (Object.hasOwn(record, "sovereignId")) {
		next.sovereignId = stringOrNull(record.sovereignId);
	}
	if (Object.hasOwn(record, "sovereignName")) {
		next.sovereignName = stringOrNull(record.sovereignName);
	}
	if (Object.hasOwn(record, "fusionTheme")) {
		next.fusionTheme = stringOrNull(record.fusionTheme);
	}
	if (Object.hasOwn(record, "fusionStability")) {
		next.fusionStability = stringOrNull(record.fusionStability);
	}
	if (Object.hasOwn(record, "powerMultiplier")) {
		next.powerMultiplier = stringOrNull(record.powerMultiplier);
	}
	if (Object.hasOwn(record, "isActive")) {
		next.isActive = record.isActive === true;
	}
	if (Object.hasOwn(record, "corruptionRisk")) {
		const risk = Number(record.corruptionRisk);
		next.corruptionRisk = Number.isFinite(risk)
			? Math.max(0, Math.min(100, risk))
			: 0;
	}
	if (Object.hasOwn(record, "modifiers")) {
		next.modifiers = normalizeModifiers(record.modifiers);
	}
	for (const key of GEMINI_OVERLAY_KEYS) {
		if (Object.hasOwn(record, key)) {
			next[key] = await normalizeRegentOverlayIds(record[key]);
		}
	}

	return next;
}

export async function normalizeCharacterOverlayFields<T extends object>(
	data: T,
): Promise<T> {
	const source = data as Record<string, unknown>;
	const next: Record<string, unknown> = { ...source };
	for (const key of OVERLAY_KEYS) {
		if (Object.hasOwn(source, key)) {
			next[key] = await normalizeRegentOverlayIds(source[key]);
		}
	}
	if (Object.hasOwn(source, "gemini_state")) {
		next.gemini_state = await normalizeGeminiState(source.gemini_state);
	}
	return next as T;
}
