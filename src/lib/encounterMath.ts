import type { Database } from "@/integrations/supabase/types";

type Anomaly = Database["public"]["Tables"]["compendium_Anomalies"]["Row"];

const DIFFICULTY_THRESHOLDS = {
	easy: {
		1: 25,
		2: 50,
		3: 75,
		4: 100,
		5: 125,
		6: 150,
		7: 175,
		8: 200,
		9: 225,
		10: 250,
		11: 275,
		12: 300,
		13: 325,
		14: 350,
		15: 400,
		16: 450,
		17: 500,
		18: 550,
		19: 600,
		20: 650,
	},
	medium: {
		1: 50,
		2: 100,
		3: 150,
		4: 200,
		5: 250,
		6: 300,
		7: 350,
		8: 400,
		9: 450,
		10: 500,
		11: 600,
		12: 700,
		13: 800,
		14: 900,
		15: 1000,
		16: 1100,
		17: 1200,
		18: 1300,
		19: 1400,
		20: 1500,
	},
	hard: {
		1: 75,
		2: 150,
		3: 225,
		4: 300,
		5: 375,
		6: 450,
		7: 525,
		8: 600,
		9: 675,
		10: 750,
		11: 900,
		12: 1000,
		13: 1100,
		14: 1250,
		15: 1400,
		16: 1600,
		17: 1800,
		18: 2000,
		19: 2200,
		20: 2400,
	},
	deadly: {
		1: 100,
		2: 200,
		3: 300,
		4: 450,
		5: 550,
		6: 600,
		7: 750,
		8: 900,
		9: 1100,
		10: 1200,
		11: 1600,
		12: 1900,
		13: 2200,
		14: 2600,
		15: 3000,
		16: 3500,
		17: 4000,
		18: 4500,
		19: 5000,
		20: 5500,
	},
} as const;

type EncounterDifficulty = "easy" | "medium" | "hard" | "deadly";

export function calculateXP(Anomaly: Anomaly, quantity: number): number {
	const xp = Anomaly.xp || 0;
	return xp * quantity;
}

export function calculateDifficulty(
	totalXP: number,
	hunterLevel: number,
	hunterCount: number,
): EncounterDifficulty {
	const multiplier =
		hunterCount === 1 ? 1 : hunterCount <= 2 ? 1.5 : hunterCount <= 6 ? 2 : 2.5;
	const adjustedXP = totalXP * multiplier;
	const thresholds = DIFFICULTY_THRESHOLDS;

	if (
		adjustedXP >=
		(thresholds.deadly[hunterLevel as keyof typeof thresholds.deadly] || 1200)
	) {
		return "deadly";
	}
	if (
		adjustedXP >=
		(thresholds.hard[hunterLevel as keyof typeof thresholds.hard] || 750)
	) {
		return "hard";
	}
	if (
		adjustedXP >=
		(thresholds.medium[hunterLevel as keyof typeof thresholds.medium] || 500)
	) {
		return "medium";
	}
	return "easy";
}
