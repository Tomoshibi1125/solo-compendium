/**
 * Map Pins — Interactive markers on the VTT map
 *
 * Allows the Warden to place clickable markers that link to handouts,
 * notes, or URLs. Pins can be Warden-only or visible to players.
 * Matches Roll20's map marker functionality.
 */

// ─── Types ──────────────────────────────────────────────────

export type MapPinIcon =
	| "flag"
	| "star"
	| "skull"
	| "shield"
	| "sword"
	| "scroll"
	| "gem"
	| "door"
	| "campfire"
	| "eye"
	| "lock"
	| "key"
	| "question"
	| "exclamation"
	| "info"
	| "custom";

export type MapPinLinkType = "handout" | "note" | "url" | "none";

export interface MapPin {
	id: string;
	/** Grid position */
	x: number;
	y: number;
	/** Display */
	label: string;
	icon: MapPinIcon;
	color: string;
	size: "small" | "medium" | "large";
	/** Link target */
	linkType: MapPinLinkType;
	linkId?: string; // handout ID or URL
	linkLabel?: string; // display text for the link
	/** Inline note content (for linkType "note") */
	noteContent?: string;
	/** Visibility */
	wardenOnly: boolean;
	/** Tooltip text on hover */
	tooltip?: string;
	/** Scene this pin belongs to */
	sceneId: string;
	/** Metadata */
	createdBy: string;
	createdAt: number;
}

// ─── Constants ──────────────────────────────────────────────

export const PIN_ICON_EMOJIS: Record<MapPinIcon, string> = {
	flag: "🚩",
	star: "⭐",
	skull: "💀",
	shield: "🛡️",
	sword: "⚔️",
	scroll: "📜",
	gem: "💎",
	door: "🚪",
	campfire: "🔥",
	eye: "👁️",
	lock: "🔒",
	key: "🔑",
	question: "❓",
	exclamation: "❗",
	info: "ℹ️",
	custom: "📌",
};

export const PIN_COLORS = [
	"#ef4444", // Red
	"#f97316", // Orange
	"#eab308", // Yellow
	"#22c55e", // Green
	"#3b82f6", // Blue
	"#8b5cf6", // Purple
	"#ec4899", // Pink
	"#6b7280", // Gray
	"#ffffff", // White
];

export const PIN_SIZE_PX: Record<MapPin["size"], number> = {
	small: 20,
	medium: 28,
	large: 36,
};

// ─── Factory ────────────────────────────────────────────────

export function createMapPin(
	x: number,
	y: number,
	label: string,
	options: Partial<
		Pick<
			MapPin,
			| "icon"
			| "color"
			| "size"
			| "linkType"
			| "linkId"
			| "linkLabel"
			| "noteContent"
			| "wardenOnly"
			| "tooltip"
			| "sceneId"
			| "createdBy"
		>
	> = {},
): MapPin {
	return {
		id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		x,
		y,
		label,
		icon: options.icon ?? "flag",
		color: options.color ?? "#3b82f6",
		size: options.size ?? "medium",
		linkType: options.linkType ?? "none",
		linkId: options.linkId,
		linkLabel: options.linkLabel,
		noteContent: options.noteContent,
		wardenOnly: options.wardenOnly ?? false,
		tooltip: options.tooltip,
		sceneId: options.sceneId ?? "",
		createdBy: options.createdBy ?? "unknown",
		createdAt: Date.now(),
	};
}

// ─── Helpers ────────────────────────────────────────────────

/**
 * Filter pins by visibility based on viewer role
 */
export function getVisiblePins(pins: MapPin[], isWarden: boolean): MapPin[] {
	if (isWarden) return pins;
	return pins.filter((pin) => !pin.wardenOnly);
}

/**
 * Get pins for a specific scene
 */
export function getScenePins(pins: MapPin[], sceneId: string): MapPin[] {
	return pins.filter((pin) => pin.sceneId === sceneId);
}

/**
 * Find pin at a grid position (for click detection)
 */
export function findPinAtPosition(
	pins: MapPin[],
	gridX: number,
	gridY: number,
): MapPin | undefined {
	return pins.find((pin) => pin.x === gridX && pin.y === gridY);
}

/**
 * Get the emoji for a pin's icon
 */
export function getPinEmoji(icon: MapPinIcon): string {
	return PIN_ICON_EMOJIS[icon] ?? "📌";
}
