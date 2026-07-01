/**
 * Centralized rank → Rift Ascendant token color mappings.
 *
 * Keeps rank coloring consistent and free of raw Tailwind palette colors
 * (no `text-amber-400`/`text-red-400` etc.). Gate-tier text colors use the
 * `--color-gate-*` theme tokens; Umbral Legion grade badges use entity tokens.
 */

/** Letter gate tiers (lowest → highest) → canonical gate-token text color. */
const GATE_TIER_TOKEN: Record<string, string> = {
	E: "text-gate-e",
	D: "text-gate-d",
	C: "text-gate-c",
	B: "text-gate-b",
	A: "text-gate-a",
	S: "text-gate-s",
	SS: "text-gate-ss",
};

/**
 * Map a letter rank tier (E, D, C, B, A, S, SS) to its gate-token text color.
 * Falls back to the neutral E-tier token for unknown values.
 */
export function rankToGateToken(rank: string): string {
	return GATE_TIER_TOKEN[rank.trim().toUpperCase()] ?? GATE_TIER_TOKEN.E;
}

/**
 * Letter rank tier → full badge className (text + border + bg) on the cool gate
 * scale. Replaces raw rainbow rank maps (`text-green-400 … bg-purple-400/10`).
 * Literal class strings so Tailwind's scanner emits the utilities. Falls back to
 * the mid C-tier for unknown values (matching the prior maps' default).
 */
const GATE_TIER_BADGE: Record<string, string> = {
	E: "text-gate-e border-gate-e/30 bg-gate-e/10",
	D: "text-gate-d border-gate-d/30 bg-gate-d/10",
	C: "text-gate-c border-gate-c/30 bg-gate-c/10",
	B: "text-gate-b border-gate-b/30 bg-gate-b/10",
	A: "text-gate-a border-gate-a/30 bg-gate-a/10",
	S: "text-gate-s border-gate-s/30 bg-gate-s/10",
	SS: "text-gate-ss border-gate-ss/30 bg-gate-ss/10",
};

export function rankToGateBadge(rank: string): string {
	return GATE_TIER_BADGE[rank.trim().toUpperCase()] ?? GATE_TIER_BADGE.C;
}

/**
 * Item rarity tier → badge className (text + border) on the cool gate ordinal
 * ramp, ending in a crimson capstone for artifacts. Keeps the prestige
 * escalation without any warm gold. Literal strings for the Tailwind scanner.
 */
const RARITY_TIER_BADGE: Record<string, string> = {
	common: "text-gate-e border-gate-e/40",
	uncommon: "text-gate-d border-gate-d/40",
	rare: "text-gate-c border-gate-c/40",
	"very-rare": "text-gate-b border-gate-b/40",
	epic: "text-gate-national border-gate-national/40",
	legendary: "text-gate-s border-gate-s/40",
	mythic: "text-gate-ss border-gate-ss/40",
	artifact: "text-gate-red border-gate-red/50",
};

export function rarityToGateBadge(rarity: string): string {
	return (
		RARITY_TIER_BADGE[rarity.trim().toLowerCase()] ?? RARITY_TIER_BADGE.common
	);
}

/**
 * Umbral Legion soldier-grade → badge className (background + text + border +
 * glow) using Rift Ascendant entity tokens. Centralized from the roster panels.
 */
export const shadowGradeBadgeClass: Record<string, string> = {
	"General Grade":
		"bg-resurge-violet/20 text-resurge-violet border-resurge-violet/40 shadow-[0_0_10px_hsl(var(--resurge-violet)/0.3)]",
	"Marshal Grade":
		"bg-shadow-purple/20 text-shadow-purple border-shadow-purple/40 shadow-[0_0_8px_hsl(var(--shadow-purple)/0.3)]",
	"Elite Knight Grade":
		"bg-shadow-blue/20 text-shadow-blue border-shadow-blue/40 shadow-[0_0_6px_hsl(var(--shadow-blue)/0.3)]",
	"Knight Grade": "bg-primary/20 text-primary border-primary/40",
	"Soldier Grade": "bg-muted text-muted-foreground border-muted",
};
