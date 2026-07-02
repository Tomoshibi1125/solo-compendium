/**
 * Canonical Bureau license-rank ladder, derived from character level.
 *
 * Single source of truth for "what rank is this Ascendant" — used by the
 * roster cards (Characters page) and the Bureau hub's license registry /
 * rank-evaluation panels. Licensed Ascendants start at D; S is the ceiling a
 * license can certify (SS remains a threat/content designation).
 */

export type HunterRank = "D" | "C" | "B" | "A" | "S";

/** Rank thresholds, weakest → strongest (level the rank begins at). */
export const HUNTER_RANK_THRESHOLDS: Array<{
	rank: HunterRank;
	minLevel: number;
}> = [
	{ rank: "D", minLevel: 1 },
	{ rank: "C", minLevel: 5 },
	{ rank: "B", minLevel: 9 },
	{ rank: "A", minLevel: 13 },
	{ rank: "S", minLevel: 17 },
];

export function hunterRankForLevel(level: number): HunterRank {
	let current: HunterRank = "D";
	for (const { rank, minLevel } of HUNTER_RANK_THRESHOLDS) {
		if (level >= minLevel) current = rank;
	}
	return current;
}

/** The next promotion threshold, or null when the license is S-certified. */
export function nextHunterRankAt(
	level: number,
): { rank: HunterRank; minLevel: number } | null {
	for (const step of HUNTER_RANK_THRESHOLDS) {
		if (level < step.minLevel) return step;
	}
	return null;
}

interface HunterRankStyle {
	rank: HunterRank;
	color: string;
	bg: string;
	border: string;
	glow: string;
}

/** Gate-token badge styles per rank (literal strings for Tailwind's scanner). */
const RANK_STYLES: Record<HunterRank, HunterRankStyle> = {
	D: {
		rank: "D",
		color: "text-gate-d",
		bg: "bg-gate-d/20",
		border: "border-gate-d/50",
		glow: "shadow-gate-d-glow/30",
	},
	C: {
		rank: "C",
		color: "text-gate-c",
		bg: "bg-gate-c/20",
		border: "border-gate-c/50",
		glow: "shadow-gate-c-glow/30",
	},
	B: {
		rank: "B",
		color: "text-gate-b",
		bg: "bg-gate-b/20",
		border: "border-gate-b/50",
		glow: "shadow-gate-b-glow/30",
	},
	A: {
		rank: "A",
		color: "text-gate-a",
		bg: "bg-gate-a/20",
		border: "border-gate-a/50",
		glow: "shadow-gate-a-glow/30",
	},
	S: {
		rank: "S",
		color: "text-gate-s",
		bg: "bg-gate-s/20",
		border: "border-gate-s/50",
		glow: "shadow-gate-s-glow/30",
	},
};

/** Rank badge styling for a character level (roster cards, Bureau registry). */
export function hunterRankStyleForLevel(level: number): HunterRankStyle {
	return RANK_STYLES[hunterRankForLevel(level)];
}
