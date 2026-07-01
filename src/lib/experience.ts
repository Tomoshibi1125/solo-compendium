/**
 * Experience points and leveling calculations
 */

export type LevelingType = "xp" | "milestone";

// XP thresholds for each level
const XP_THRESHOLDS: Record<number, number> = {
	1: 0,
	2: 300,
	3: 900,
	4: 2700,
	5: 6500,
	6: 14000,
	7: 23000,
	8: 34000,
	9: 48000,
	10: 64000,
	11: 85000,
	12: 100000,
	13: 120000,
	14: 140000,
	15: 165000,
	16: 195000,
	17: 225000,
	18: 265000,
	19: 305000,
	20: 355000,
};

// CR to XP mapping
const CR_XP_MAP: Record<string, number> = {
	"0": 10,
	"1/8": 25,
	"1/4": 50,
	"1/2": 100,
	"1": 200,
	"2": 450,
	"3": 700,
	"4": 1100,
	"5": 1800,
	"6": 2300,
	"7": 2900,
	"8": 3900,
	"9": 5000,
	"10": 5900,
	"11": 7200,
	"12": 8400,
	"13": 10000,
	"14": 11500,
	"15": 13000,
	"16": 15000,
	"17": 18000,
	"18": 20000,
	"19": 22000,
	"20": 25000,
	"21": 33000,
	"22": 41000,
	"23": 50000,
	"24": 62000,
	"25": 75000,
	"26": 90000,
	"27": 105000,
	"28": 120000,
	"29": 135000,
	"30": 155000,
};

export function getLevelFromXP(xp: number): number {
	let level = 1;
	for (let i = 20; i >= 1; i--) {
		if (xp >= XP_THRESHOLDS[i]) {
			level = i;
			break;
		}
	}
	return level;
}

/**
 * P1.11 — XP threshold eligibility check.
 *
 * Determines whether a character has accumulated enough XP to advance.
 * Mirrors DDB behavior: XP crossing a threshold does NOT auto-promote;
 * it surfaces a "Level Up Available" CTA so the player still gates the
 * decision (picking HP, ASI/feat, new features, etc.).
 *
 * @param currentLevel  The character's current level (1..20)
 * @param totalXP       The character's accumulated XP
 * @param levelingMode  When "milestone", always returns canLevelUp=false
 *                      (milestone campaigns don't auto-eligibility-check).
 */
export function checkLevelUpEligibility(
	currentLevel: number,
	totalXP: number,
	levelingMode: LevelingType = "xp",
): {
	canLevelUp: boolean;
	availableLevel: number;
	currentLevel: number;
	xpToNext: number;
} {
	const safeLevel = Math.max(1, Math.min(20, currentLevel));
	if (levelingMode !== "xp" || safeLevel >= 20) {
		return {
			canLevelUp: false,
			availableLevel: safeLevel,
			currentLevel: safeLevel,
			xpToNext: 0,
		};
	}
	const eligibleLevel = getLevelFromXP(totalXP);
	const canLevelUp = eligibleLevel > safeLevel;
	const nextThreshold = XP_THRESHOLDS[safeLevel + 1] ?? totalXP;
	return {
		canLevelUp,
		availableLevel: canLevelUp ? eligibleLevel : safeLevel,
		currentLevel: safeLevel,
		xpToNext: Math.max(0, nextThreshold - totalXP),
	};
}

export function getXPForLevel(level: number): number {
	return XP_THRESHOLDS[level] || 0;
}

export function getXPProgress(currentXP: number): {
	current: number;
	next: number;
	percent: number;
} {
	const currentLevel = getLevelFromXP(currentXP);
	if (currentLevel >= 20) {
		return {
			current: currentXP,
			next: currentXP,
			percent: 100,
		};
	}

	const currentThreshold = XP_THRESHOLDS[currentLevel];
	const nextThreshold = XP_THRESHOLDS[currentLevel + 1];
	const progressInLevel = currentXP - currentThreshold;
	const totalInLevel = nextThreshold - currentThreshold;

	return {
		current: progressInLevel,
		next: totalInLevel,
		percent: Math.min(100, Math.max(0, (progressInLevel / totalInLevel) * 100)),
	};
}

export function getCRXP(cr: string): number {
	return CR_XP_MAP[cr] || 0;
}
