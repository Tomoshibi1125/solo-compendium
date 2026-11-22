export type HarvestRank = "E" | "D" | "C" | "B" | "A" | "S";
export type HarvestMethod = "core" | "bulk" | "precision";

export interface HarvestCheck {
	method: HarvestMethod;
	rank: HarvestRank;
	dc: number;
	durationMinutes: number | null;
	grade: "Basic" | "Quality" | "Rare" | "Exotic" | "Legendary" | "Regent";
	requiresWardenDc: boolean;
}

const grades: Record<HarvestRank, HarvestCheck["grade"]> = {
	E: "Basic",
	D: "Quality",
	C: "Rare",
	B: "Exotic",
	A: "Legendary",
	S: "Regent",
};

const bulkDc: Partial<Record<HarvestRank, number>> = {
	E: 10,
	D: 12,
	C: 15,
	B: 18,
	A: 21,
};

const precisionDc: Partial<Record<HarvestRank, number>> = {
	E: 12,
	D: 15,
	C: 18,
	B: 21,
};

/** The authored rank ladder. A/S "21+" choices require an explicit Warden DC. */
export function resolveHarvestCheck(
	method: HarvestMethod,
	rank: HarvestRank,
	wardenDc?: number | null,
): HarvestCheck {
	if (!(rank in grades)) throw new Error("Unknown harvest rank.");
	if (method === "core") {
		if (wardenDc != null && wardenDc !== 15) {
			throw new Error("Core extraction is always DC 15.");
		}
		return {
			method,
			rank,
			dc: 15,
			durationMinutes: 1,
			grade: grades[rank],
			requiresWardenDc: false,
		};
	}

	const fixedDc = method === "bulk" ? bulkDc[rank] : precisionDc[rank];
	if (fixedDc !== undefined) {
		if (wardenDc != null && wardenDc !== fixedDc) {
			throw new Error("This rank and method have a fixed DC.");
		}
		return {
			method,
			rank,
			dc: fixedDc,
			durationMinutes: null,
			grade: grades[rank],
			requiresWardenDc: false,
		};
	}

	if (method !== "bulk" && method !== "precision") {
		throw new Error("Unknown harvest method.");
	}
	if (!Number.isSafeInteger(wardenDc) || (wardenDc ?? 0) < 21) {
		throw new Error("This rank requires a Warden-defined DC of at least 21.");
	}
	return {
		method,
		rank,
		dc: wardenDc as number,
		durationMinutes: null,
		grade: grades[rank],
		requiresWardenDc: true,
	};
}
