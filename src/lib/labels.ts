import { RARITY_LABELS, type Rarity } from "@/types/core-rules";

/**
 * Display formatters for enum-ish stored values.
 *
 * The compendium data stores many "enum" fields inconsistently — mixed casing,
 * hyphen vs space vs underscore, and (for some fields) free-text or special
 * tokens intermixed with the real enum values. These helpers normalize the
 * presentation **without** mutating the data, and are deliberately guarded so
 * they never corrupt free-text or special tokens (e.g. "N/A", "5-6", or an
 * activation sentence).
 */

/**
 * Title-case a short, delimiter-joined enum token while leaving free-text and
 * special tokens untouched:
 *   "bonus_action" -> "Bonus Action", "short-rest" -> "Short Rest"
 *   "N/A" -> "N/A", "5-6" -> "5-6"
 *   "Channel mana through the ink circuits" -> unchanged (free text)
 */
export function formatEnumLabel(value: string | null | undefined): string {
	if (!value) return "";
	const v = value.trim();
	if (!v) return "";
	if (/^[A-Za-z]\/[A-Za-z]$/.test(v)) return v.toUpperCase(); // N/A, etc.
	if (/^[\d\s+\-–/]+$/.test(v)) return v; // numeric ranges like 5-6 / 5–6
	if (v.split(/\s+/).length > 3) return v; // free-text sentences pass through
	return v
		.toLowerCase()
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Canonical rarity label from the closed 8-tier ladder. Normalizes the two
 * very-rare spellings (very_rare / very-rare) and any casing, then looks up
 * the canonical `RARITY_LABELS`; unknown values fall back to title-case.
 */
export function formatRarityLabel(rarity: string | null | undefined): string {
	if (!rarity) return "";
	const normalized = rarity.toLowerCase().replace(/_/g, "-");
	return RARITY_LABELS[normalized as Rarity] ?? formatEnumLabel(rarity);
}

// Recharge values appear in three casings/spellings for the same meaning plus
// special tokens and full sentences. Map the real multi-word/hyphenated forms
// to a canonical display; everything else defers to `formatEnumLabel` (which
// passes specials and sentences through unchanged).
const RECHARGE_DISPLAY: Record<string, string> = {
	"at-will": "At-Will",
	"short-rest": "Short Rest",
	"per-short-rest": "Short Rest",
	"long-rest": "Long Rest",
	"per-long-rest": "Long Rest",
	"once-per-day": "Once Per Day",
	"per-day": "Per Day",
};

export function formatRecharge(value: string | null | undefined): string {
	if (!value) return "";
	const v = value.trim();
	if (!v) return "";
	const key = v.toLowerCase().replace(/[\s_]+/g, "-");
	return RECHARGE_DISPLAY[key] ?? formatEnumLabel(v);
}

// Known action-economy vocabulary. Anything not in this set (notably the
// free-text activation descriptions some tattoos/relics store in `action_type`)
// is returned verbatim so it is never mangled.
const ACTION_TYPE_KNOWN = new Set<string>([
	"action",
	"bonus action",
	"reaction",
	"passive",
	"active",
	"free",
	"free action",
	"movement",
	"no action",
	"legendary",
	"legendary action",
	"lair",
	"lair action",
	"passive (socketed)",
]);

export function formatActionType(value: string | null | undefined): string {
	if (!value) return "";
	const v = value.trim();
	if (!v) return "";
	return ACTION_TYPE_KNOWN.has(v.toLowerCase()) ? formatEnumLabel(v) : v;
}

// Canonical per-tier badge classes on the cool gate ordinal ramp (mirrors
// rankColors.ts rarityToGateBadge, plus a bg wash). Normalizes the underscore
// very_rare spelling so data in either form styles correctly.
const RARITY_BADGE_CLASS: Record<string, string> = {
	common: "text-muted-foreground border-border bg-card",
	uncommon: "text-gate-d border-gate-d/40 bg-gate-d/10",
	rare: "text-gate-c border-gate-c/40 bg-gate-c/10",
	"very-rare": "text-gate-b border-gate-b/40 bg-gate-b/10",
	epic: "text-gate-national border-gate-national/40 bg-gate-national/10",
	legendary: "text-gate-s border-gate-s/40 bg-gate-s/10",
	mythic: "text-gate-ss border-gate-ss/40 bg-gate-ss/10",
	artifact: "text-gate-red border-gate-red/50 bg-gate-red/10",
};

export function getRarityBadgeClass(rarity: string | null | undefined): string {
	if (!rarity) return "";
	const key = rarity.toLowerCase().replace(/_/g, "-");
	return RARITY_BADGE_CLASS[key] ?? "";
}
