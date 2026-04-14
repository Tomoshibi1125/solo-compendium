/**
 * Token Status Markers — Numeric/Icon overlays on VTT tokens
 *
 * Provides Roll20-style status markers that appear as small colored
 * badges on token corners, showing conditions, counters, or numeric values.
 * Supports both icon-based markers and numeric values (0-99).
 *
 * This closes the final feature gap vs Roll20's token status system.
 */

// ─── Types ──────────────────────────────────────────────────

export type MarkerShape = "circle" | "diamond" | "square" | "triangle";

export interface TokenStatusMarker {
	id: string;
	/** Display label (shown in marker list) */
	label: string;
	/** Short display text on the token (1-2 chars max) */
	displayText: string;
	/** Background color */
	color: string;
	/** Text/icon color */
	textColor: string;
	/** Shape of the badge */
	shape: MarkerShape;
	/** Optional numeric value (e.g., AC bonus, damage per round) */
	value?: number;
}

export interface TokenMarkerAssignment {
	tokenId: string;
	markerId: string;
	/** Optional numeric override displayed on the badge (0-99) */
	numericValue?: number;
}

// ─── Position Slots ─────────────────────────────────────────

/**
 * Marker positions around the token (clockwise from top-left).
 * Max 8 markers per token matching Roll20's layout.
 */
export type MarkerSlot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const SLOT_POSITIONS: Record<
	MarkerSlot,
	{ xPercent: number; yPercent: number }
> = {
	0: { xPercent: 0, yPercent: 0 }, // top-left
	1: { xPercent: 33, yPercent: 0 }, // top-center-left
	2: { xPercent: 66, yPercent: 0 }, // top-center-right
	3: { xPercent: 100, yPercent: 0 }, // top-right
	4: { xPercent: 100, yPercent: 100 }, // bottom-right
	5: { xPercent: 66, yPercent: 100 }, // bottom-center-right
	6: { xPercent: 33, yPercent: 100 }, // bottom-center-left
	7: { xPercent: 0, yPercent: 100 }, // bottom-left
};

/**
 * Get pixel position for a marker slot on a token of given size
 */
export function getMarkerPosition(
	slot: MarkerSlot,
	tokenSizePx: number,
	markerSizePx: number = 16,
): { x: number; y: number } {
	const pos = SLOT_POSITIONS[slot];
	return {
		x: (pos.xPercent / 100) * tokenSizePx - markerSizePx / 2,
		y: (pos.yPercent / 100) * tokenSizePx - markerSizePx / 2,
	};
}

// ─── Built-in Markers (Roll20 Parity) ───────────────────────

export const BUILT_IN_MARKERS: TokenStatusMarker[] = [
	// D&D 5e conditions
	{
		id: "marker-blinded",
		label: "Blinded",
		displayText: "Bl",
		color: "#1e293b",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-charmed",
		label: "Charmed",
		displayText: "Ch",
		color: "#ec4899",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-deafened",
		label: "Deafened",
		displayText: "Df",
		color: "#6b7280",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-frightened",
		label: "Frightened",
		displayText: "Fr",
		color: "#7c3aed",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-grappled",
		label: "Grappled",
		displayText: "Gr",
		color: "#d97706",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-incapacitated",
		label: "Incapacitated",
		displayText: "In",
		color: "#dc2626",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-invisible",
		label: "Invisible",
		displayText: "Iv",
		color: "#94a3b8",
		textColor: "#334155",
		shape: "diamond",
	},
	{
		id: "marker-paralyzed",
		label: "Paralyzed",
		displayText: "Pa",
		color: "#fbbf24",
		textColor: "#1e293b",
		shape: "circle",
	},
	{
		id: "marker-petrified",
		label: "Petrified",
		displayText: "Pe",
		color: "#78716c",
		textColor: "#fff",
		shape: "square",
	},
	{
		id: "marker-poisoned",
		label: "Poisoned",
		displayText: "Po",
		color: "#16a34a",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-prone",
		label: "Prone",
		displayText: "Pr",
		color: "#854d0e",
		textColor: "#fff",
		shape: "triangle",
	},
	{
		id: "marker-restrained",
		label: "Restrained",
		displayText: "Re",
		color: "#ea580c",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-stunned",
		label: "Stunned",
		displayText: "St",
		color: "#eab308",
		textColor: "#1e293b",
		shape: "circle",
	},
	{
		id: "marker-unconscious",
		label: "Unconscious",
		displayText: "Un",
		color: "#0f172a",
		textColor: "#ef4444",
		shape: "circle",
	},

	// Common game markers
	{
		id: "marker-concentration",
		label: "Concentration",
		displayText: "C",
		color: "#3b82f6",
		textColor: "#fff",
		shape: "diamond",
	},
	{
		id: "marker-rage",
		label: "Rage",
		displayText: "R",
		color: "#dc2626",
		textColor: "#fff",
		shape: "diamond",
	},
	{
		id: "marker-haste",
		label: "Haste",
		displayText: "H",
		color: "#22d3ee",
		textColor: "#fff",
		shape: "diamond",
	},
	{
		id: "marker-bless",
		label: "Bless",
		displayText: "B",
		color: "#fbbf24",
		textColor: "#1e293b",
		shape: "diamond",
	},
	{
		id: "marker-hex",
		label: "Hex/Curse",
		displayText: "X",
		color: "#7c3aed",
		textColor: "#fff",
		shape: "diamond",
	},
	{
		id: "marker-shield",
		label: "Shield",
		displayText: "S",
		color: "#6366f1",
		textColor: "#fff",
		shape: "square",
	},
	{
		id: "marker-dead",
		label: "Dead",
		displayText: "💀",
		color: "#0f172a",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-bloodied",
		label: "Bloodied",
		displayText: "🩸",
		color: "#7f1d1d",
		textColor: "#fca5a5",
		shape: "circle",
	},

	// Numeric counters (user assigns the value)
	{
		id: "marker-blue-counter",
		label: "Blue Counter",
		displayText: "0",
		color: "#3b82f6",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-red-counter",
		label: "Red Counter",
		displayText: "0",
		color: "#ef4444",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-green-counter",
		label: "Green Counter",
		displayText: "0",
		color: "#22c55e",
		textColor: "#fff",
		shape: "circle",
	},
	{
		id: "marker-yellow-counter",
		label: "Yellow Counter",
		displayText: "0",
		color: "#eab308",
		textColor: "#1e293b",
		shape: "circle",
	},
];

// ─── Helpers ────────────────────────────────────────────────

/**
 * Find a built-in marker by ID
 */
export function getMarkerById(markerId: string): TokenStatusMarker | undefined {
	return BUILT_IN_MARKERS.find((m) => m.id === markerId);
}

/**
 * Get SVG clip-path for a marker shape
 */
export function getMarkerClipPath(shape: MarkerShape): string {
	switch (shape) {
		case "diamond":
			return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
		case "square":
			return "none";
		case "triangle":
			return "polygon(50% 0%, 100% 100%, 0% 100%)";
		default:
			return "circle(50%)";
	}
}

/**
 * Generate inline CSS for a marker badge
 */
export function getMarkerBadgeStyle(
	marker: TokenStatusMarker,
	sizePx: number = 16,
	numericValue?: number,
): Record<string, string | number> {
	const displayText =
		numericValue !== undefined ? String(numericValue) : marker.displayText;
	const fontSize = displayText.length > 1 ? sizePx * 0.5 : sizePx * 0.65;

	return {
		width: `${sizePx}px`,
		height: `${sizePx}px`,
		backgroundColor: marker.color,
		color: marker.textColor,
		fontSize: `${fontSize}px`,
		fontWeight: "bold",
		lineHeight: `${sizePx}px`,
		textAlign: "center",
		borderRadius: marker.shape === "square" ? "2px" : "50%",
		clipPath: getMarkerClipPath(marker.shape),
		border: `1px solid rgba(255,255,255,0.3)`,
		boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
		position: "absolute",
		pointerEvents: "none",
		userSelect: "none",
		zIndex: 10,
	};
}

/**
 * Get the display text for a marker assignment
 */
export function getMarkerDisplayText(
	assignment: TokenMarkerAssignment,
): string {
	const marker = getMarkerById(assignment.markerId);
	if (!marker) return "?";
	if (assignment.numericValue !== undefined) {
		return String(assignment.numericValue);
	}
	return marker.displayText;
}
