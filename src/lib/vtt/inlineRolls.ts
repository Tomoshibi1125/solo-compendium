/**
 * Inline Roll Parser for VTT Chat
 *
 * Parses inline dice notation within chat messages (e.g., [[2d6+3]])
 * and resolves them to roll results.
 *
 * Supported syntax:
 *   [[NdS+M]]     — Roll N dice with S sides, add modifier M
 *   [[NdS]]       — Roll N dice with S sides
 *   [[d20+5]]     — Roll 1d20+5
 *   [[4d6kh3]]    — Roll 4d6, keep highest 3
 *   [[2d20kl1]]   — Roll 2d20, keep lowest 1 (disadvantage)
 */

// ─── Types ──────────────────────────────────────────────────
export interface InlineRollResult {
	formula: string;
	total: number;
	dice: number[];
	kept: number[];
	modifier: number;
	isCritical: boolean;
	isFumble: boolean;
}

export interface ParsedChatMessage {
	segments: ChatSegment[];
	hasRolls: boolean;
}

export type ChatSegment =
	| { type: "text"; content: string }
	| { type: "roll"; formula: string; result: InlineRollResult };

// ─── Roll Parser ────────────────────────────────────────────

const INLINE_ROLL_REGEX = /\[\[([^\]]+)\]\]/g;
const DICE_REGEX = /^(\d*)d(\d+)(?:(kh|kl)(\d+))?(?:([+-]\d+))?$/i;

/**
 * Roll a single dice expression (e.g., "2d6+3", "4d6kh3")
 */
export function rollDiceExpression(formula: string): InlineRollResult | null {
	const normalized = formula.replace(/\s/g, "").toLowerCase();
	const match = normalized.match(DICE_REGEX);
	if (!match) return null;

	const count = parseInt(match[1], 10) || 1;
	const sides = parseInt(match[2], 10);
	const keepMode = match[3] as "kh" | "kl" | undefined;
	const keepCount = match[4] ? parseInt(match[4], 10) : undefined;
	const modifier = match[5] ? parseInt(match[5], 10) : 0;

	// Roll dice
	const dice: number[] = [];
	for (let i = 0; i < count; i++) {
		dice.push(Math.floor(Math.random() * sides) + 1);
	}

	// Apply keep highest/lowest
	let kept: number[];
	if (keepMode && keepCount !== undefined) {
		const sorted = [...dice].sort((a, b) =>
			keepMode === "kh" ? b - a : a - b,
		);
		kept = sorted.slice(0, keepCount);
	} else {
		kept = [...dice];
	}

	const total = kept.reduce((sum, d) => sum + d, 0) + modifier;
	const isCritical = sides === 20 && count === 1 && dice[0] === 20;
	const isFumble = sides === 20 && count === 1 && dice[0] === 1;

	return {
		formula,
		total,
		dice,
		kept,
		modifier,
		isCritical,
		isFumble,
	};
}

/**
 * Parse a chat message for inline roll expressions [[...]]
 * Resolves them to actual roll results
 */
export function parseInlineRolls(message: string): ParsedChatMessage {
	const segments: ChatSegment[] = [];
	let hasRolls = false;
	let lastIndex = 0;

	const regex = new RegExp(INLINE_ROLL_REGEX.source, "g");
	let match = regex.exec(message);

	while (match !== null) {
		// Add text before this roll
		if (match.index > lastIndex) {
			segments.push({
				type: "text",
				content: message.slice(lastIndex, match.index),
			});
		}

		const formula = match[1].trim();
		const result = rollDiceExpression(formula);

		if (result) {
			segments.push({ type: "roll", formula, result });
			hasRolls = true;
		} else {
			// Invalid formula — keep as text
			segments.push({ type: "text", content: match[0] });
		}

		lastIndex = regex.lastIndex;
		match = regex.exec(message);
	}

	// Add remaining text
	if (lastIndex < message.length) {
		segments.push({ type: "text", content: message.slice(lastIndex) });
	}

	// No inline rolls found
	if (segments.length === 0) {
		segments.push({ type: "text", content: message });
	}

	return { segments, hasRolls };
}

/**
 * Format a roll result for display
 * e.g., "2d6+3 → [4, 5]+3 = 12"
 */
export function formatInlineRoll(result: InlineRollResult): string {
	const diceStr = `[${result.dice.join(", ")}]`;
	const keptStr =
		result.dice.length !== result.kept.length
			? ` keep [${result.kept.join(", ")}]`
			: "";
	const modStr =
		result.modifier !== 0
			? result.modifier > 0
				? `+${result.modifier}`
				: `${result.modifier}`
			: "";

	let label = `${result.formula} → ${diceStr}${keptStr}${modStr} = ${result.total}`;

	if (result.isCritical) label += " 💥 CRIT!";
	if (result.isFumble) label += " 💀 FUMBLE!";

	return label;
}

/**
 * Check if a message contains inline roll syntax
 */
export function hasInlineRolls(message: string): boolean {
	return /\[\[[^\]]+\]\]/.test(message);
}
