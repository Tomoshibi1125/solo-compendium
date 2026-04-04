import { supabase } from "@/integrations/supabase/client";

/**
 * Maps RIFT Ranks to Challenge Rating ranges
 */
export const RANK_TO_CR: Record<string, string[]> = {
	E: ["0", "1/8", "1/4", "1/2", "1"],
	D: ["2", "3", "4"],
	C: ["5", "6", "7", "8"],
	B: ["9", "10", "11", "12"],
	A: ["13", "14", "15", "16"],
	S: [
		"17",
		"18",
		"19",
		"20",
		"21",
		"22",
		"23",
		"24",
		"25",
		"26",
		"27",
		"28",
		"29",
		"30",
	],
};

export async function getRandomAnomaly(rank?: string) {
	let query = supabase.from("compendium_Anomalies").select("*");

	if (rank && RANK_TO_CR[rank]) {
		query = query.in("cr", RANK_TO_CR[rank]);
	}

	const { data, error } = await query;

	if (error || !data || data.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * data.length);
	return data[randomIndex];
}

export async function getRandomEquipment(rank?: string) {
	let query = supabase
		.from("compendium_equipment")
		.select("id, name, rarity, description");

	// Filter by rarity based on rank
	if (rank === "E" || rank === "D") {
		query = query.in("rarity", ["common", "uncommon"]);
	} else if (rank === "C" || rank === "B") {
		query = query.in("rarity", ["rare", "very_rare"]);
	} else if (rank === "A" || rank === "S") {
		query = query.in("rarity", ["legendary", "very_rare"]);
	}

	const { data, error } = await query;

	if (error || !data || data.length === 0) {
		// Fallback to any equipment if specific rarity not found
		const { data: fallbackData } = await supabase
			.from("compendium_equipment")
			.select("id, name, rarity, description")
			.limit(50);
		if (!fallbackData || fallbackData.length === 0) return null;
		return fallbackData[Math.floor(Math.random() * fallbackData.length)];
	}

	const randomIndex = Math.floor(Math.random() * data.length);
	return data[randomIndex];
}

export async function getRandomFeat() {
	const { data, error } = await supabase
		.from("compendium_feats")
		.select("id, name, description");

	if (error || !data || data.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * data.length);
	return data[randomIndex];
}

export async function getRandomRune() {
	const { data, error } = await supabase
		.from("compendium_runes")
		.select("id, name, description");

	if (error || !data || data.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * data.length);
	return data[randomIndex];
}
