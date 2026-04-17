/**
 * Party Dashboard Engine
 * Provides the Warden with a consolidated view of all party member stats,
 * passive scores, conditions, resources, and combat readiness.
 *
 * This is the logic layer — the UI component will consume these functions.
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { CalculatedStats } from "../5eCharacterCalculations";

// ── Types ─────────────────────────────────────────────────────────────

export interface PartyMember {
	id: string;
	name: string;
	job: string;
	level: number;
	hitPoints: { current: number; max: number; temp: number };
	armorClass: number;
	speed: number;
	passivePerception: number;
	passiveInsight: number;
	passiveInvestigation: number;
	conditions: string[];
	exhaustionLevel: number;
	riftFavor: { current: number; max: number };
	deathSaves?: { successes: number; failures: number; active: boolean };
	concentrating?: string | null;
	spellSlots?: Record<number, { current: number; max: number }>;
	calculatedStats?: CalculatedStats;
}

export interface PartyDashboardData {
	/** All party members */
	members: PartyMember[];
	/** Party-wide summary stats */
	summary: PartySummary;
	/** Members sorted by urgency (lowest HP% first) */
	urgencyOrder: PartyMember[];
	/** Active alerts the Warden should see */
	alerts: PartyAlert[];
}

export interface PartySummary {
	/** Total party size */
	partySize: number;
	/** Average party level */
	averageLevel: number;
	/** Combined party HP (current / max) */
	totalHP: { current: number; max: number };
	/** Overall party HP percentage */
	hpPercentage: number;
	/** Number of members at full HP */
	atFullHP: number;
	/** Number of members bloodied (≤50% HP) */
	bloodied: number;
	/** Number of members critical (≤25% HP) */
	critical: number;
	/** Number of members down (0 HP) */
	down: number;
	/** Number of members dead */
	dead: number;
	/** Lowest passive perception in the party (for surprise checks) */
	lowestPassivePerception: number;
	/** Highest passive perception (for detecting hidden threats) */
	highestPassivePerception: number;
	/** Average AC (for encounter balancing) */
	averageAC: number;
	/** Total remaining spell slots across the party */
	totalSpellSlots: { current: number; max: number };
	/** Total Rift Favor remaining */
	totalRiftFavor: { current: number; max: number };
}

export interface PartyAlert {
	severity: "info" | "warning" | "danger" | "critical";
	memberId: string;
	memberName: string;
	message: string;
}

// ── Core Functions ────────────────────────────────────────────────────

/**
 * Generate the full party dashboard from member data.
 */
export function generateDashboard(members: PartyMember[]): PartyDashboardData {
	const summary = calculatePartySummary(members);
	const urgencyOrder = getUrgencyOrder(members);
	const alerts = generateAlerts(members);

	return { members, summary, urgencyOrder, alerts };
}

/**
 * Calculate party-wide summary statistics.
 */
export function calculatePartySummary(members: PartyMember[]): PartySummary {
	if (members.length === 0) {
		return {
			partySize: 0,
			averageLevel: 0,
			totalHP: { current: 0, max: 0 },
			hpPercentage: 100,
			atFullHP: 0,
			bloodied: 0,
			critical: 0,
			down: 0,
			dead: 0,
			lowestPassivePerception: 0,
			highestPassivePerception: 0,
			averageAC: 0,
			totalSpellSlots: { current: 0, max: 0 },
			totalRiftFavor: { current: 0, max: 0 },
		};
	}

	const totalHP = members.reduce(
		(acc, m) => ({
			current: acc.current + m.hitPoints.current,
			max: acc.max + m.hitPoints.max,
		}),
		{ current: 0, max: 0 },
	);

	const perceptions = members.map((m) => m.passivePerception);
	let totalSlotsCurrent = 0;
	let totalSlotsMax = 0;
	for (const m of members) {
		if (m.spellSlots) {
			for (const slot of Object.values(m.spellSlots)) {
				totalSlotsCurrent += slot.current;
				totalSlotsMax += slot.max;
			}
		}
	}

	return {
		partySize: members.length,
		averageLevel: Math.round(
			members.reduce((sum, m) => sum + m.level, 0) / members.length,
		),
		totalHP,
		hpPercentage:
			totalHP.max > 0 ? Math.round((totalHP.current / totalHP.max) * 100) : 100,
		atFullHP: members.filter((m) => m.hitPoints.current >= m.hitPoints.max)
			.length,
		bloodied: members.filter((m) => {
			const pct =
				m.hitPoints.max > 0 ? m.hitPoints.current / m.hitPoints.max : 1;
			return pct <= 0.5 && pct > 0.25;
		}).length,
		critical: members.filter((m) => {
			const pct =
				m.hitPoints.max > 0 ? m.hitPoints.current / m.hitPoints.max : 1;
			return pct <= 0.25 && pct > 0;
		}).length,
		down: members.filter(
			(m) =>
				m.hitPoints.current <= 0 &&
				!(m.deathSaves?.active === true && (m.deathSaves?.failures ?? 0) >= 3),
		).length,
		dead: members.filter(
			(m) =>
				m.deathSaves?.active === true && (m.deathSaves?.failures ?? 0) >= 3,
		).length,
		lowestPassivePerception: Math.min(...perceptions),
		highestPassivePerception: Math.max(...perceptions),
		averageAC: Math.round(
			members.reduce((sum, m) => sum + m.armorClass, 0) / members.length,
		),
		totalSpellSlots: {
			current: totalSlotsCurrent,
			max: totalSlotsMax,
		},
		totalRiftFavor: {
			current: members.reduce((sum, m) => sum + m.riftFavor.current, 0),
			max: members.reduce((sum, m) => sum + m.riftFavor.max, 0),
		},
	};
}

// ── Urgency Sorting ───────────────────────────────────────────────────

/**
 * Sort party members by urgency (most critical first).
 * Priority: death saves active > 0 HP > lowest HP% > conditions > exhaustion
 */
export function getUrgencyOrder(members: PartyMember[]): PartyMember[] {
	return [...members].sort((a, b) => {
		const urgencyA = getUrgencyScore(a);
		const urgencyB = getUrgencyScore(b);
		return urgencyB - urgencyA; // Higher urgency first
	});
}

function getUrgencyScore(member: PartyMember): number {
	let score = 0;

	// Death saves active = maximum urgency
	if (member.deathSaves?.active) {
		score += 1000 + member.deathSaves.failures * 100;
	}

	// 0 HP
	if (member.hitPoints.current <= 0) {
		score += 500;
	}

	// HP percentage (inverted — lower HP = higher urgency)
	const hpPct =
		member.hitPoints.max > 0
			? member.hitPoints.current / member.hitPoints.max
			: 1;
	score += Math.round((1 - hpPct) * 100);

	// Conditions add urgency
	score += member.conditions.length * 10;

	// Exhaustion
	score += member.exhaustionLevel * 20;

	return score;
}

// ── Alert Generation ──────────────────────────────────────────────────

/**
 * Generate alerts for the Warden based on party status.
 */
export function generateAlerts(members: PartyMember[]): PartyAlert[] {
	const alerts: PartyAlert[] = [];

	for (const member of members) {
		// Death saves
		if (member.deathSaves?.active) {
			alerts.push({
				severity: "critical",
				memberId: member.id,
				memberName: member.name,
				message: `Making death saves (${member.deathSaves.successes}✓ / ${member.deathSaves.failures}✗)`,
			});
		}

		// 0 HP (not doing death saves — stabilized?)
		if (member.hitPoints.current <= 0 && !member.deathSaves?.active) {
			alerts.push({
				severity: "danger",
				memberId: member.id,
				memberName: member.name,
				message: "At 0 HP (stabilized or unconscious)",
			});
		}

		// Critical HP (≤25%)
		const hpPct =
			member.hitPoints.max > 0
				? member.hitPoints.current / member.hitPoints.max
				: 1;
		if (hpPct <= 0.25 && hpPct > 0) {
			alerts.push({
				severity: "danger",
				memberId: member.id,
				memberName: member.name,
				message: `Critical HP: ${member.hitPoints.current}/${member.hitPoints.max} (${Math.round(hpPct * 100)}%)`,
			});
		}

		// Bloodied (≤50%)
		if (hpPct <= 0.5 && hpPct > 0.25) {
			alerts.push({
				severity: "warning",
				memberId: member.id,
				memberName: member.name,
				message: `Bloodied: ${member.hitPoints.current}/${member.hitPoints.max} (${Math.round(hpPct * 100)}%)`,
			});
		}

		// High exhaustion
		if (member.exhaustionLevel >= 4) {
			alerts.push({
				severity: "danger",
				memberId: member.id,
				memberName: member.name,
				message: `Exhaustion level ${member.exhaustionLevel} — ${member.exhaustionLevel >= 6 ? "DEAD" : "severe penalties"}`,
			});
		} else if (member.exhaustionLevel >= 2) {
			alerts.push({
				severity: "warning",
				memberId: member.id,
				memberName: member.name,
				message: `Exhaustion level ${member.exhaustionLevel}`,
			});
		}

		// Dangerous conditions
		const dangerousConditions = member.conditions.filter((c) =>
			["paralyzed", "petrified", "stunned", "unconscious"].includes(
				c.toLowerCase(),
			),
		);
		for (const condition of dangerousConditions) {
			alerts.push({
				severity: "warning",
				memberId: member.id,
				memberName: member.name,
				message: `${condition.charAt(0).toUpperCase() + condition.slice(1)} condition active`,
			});
		}

		// No Rift Favor remaining
		if (member.riftFavor.current === 0 && member.riftFavor.max > 0) {
			alerts.push({
				severity: "info",
				memberId: member.id,
				memberName: member.name,
				message: "No Rift Favor remaining",
			});
		}
	}

	// Sort by severity (critical first)
	const severityOrder: Record<string, number> = {
		critical: 0,
		danger: 1,
		warning: 2,
		info: 3,
	};
	alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

	return alerts;
}

// ── Encounter Balancing Helpers ───────────────────────────────────────

/**
 * Get encounter difficulty thresholds for the party.
 * Returns XP thresholds per difficulty tier.
 */
export function getEncounterThresholds(members: PartyMember[]): {
	easy: number;
	medium: number;
	hard: number;
	deadly: number;
} {
	// 5e encounter XP thresholds by character level
	const thresholds: Record<number, [number, number, number, number]> = {
		1: [25, 50, 75, 100],
		2: [50, 100, 150, 200],
		3: [75, 150, 225, 400],
		4: [125, 250, 375, 500],
		5: [250, 500, 750, 1100],
		6: [300, 600, 900, 1400],
		7: [350, 750, 1100, 1700],
		8: [450, 900, 1400, 2100],
		9: [550, 1100, 1600, 2400],
		10: [600, 1200, 1900, 2800],
		11: [800, 1600, 2400, 3600],
		12: [1000, 2000, 3000, 4500],
		13: [1100, 2200, 3400, 5100],
		14: [1250, 2500, 3800, 5700],
		15: [1400, 2800, 4300, 6400],
		16: [1600, 3200, 4800, 7200],
		17: [2000, 3900, 5900, 8800],
		18: [2100, 4200, 6300, 9500],
		19: [2400, 4900, 7300, 10900],
		20: [2800, 5700, 8500, 12700],
	};

	const result = { easy: 0, medium: 0, hard: 0, deadly: 0 };

	for (const member of members) {
		const level = Math.max(1, Math.min(20, member.level));
		const t = thresholds[level] ?? thresholds[1];
		result.easy += t[0];
		result.medium += t[1];
		result.hard += t[2];
		result.deadly += t[3];
	}

	return result;
}

/**
 * Estimate adjusted encounter XP based on number of monsters.
 * Per DMG: multiply total XP by a factor based on monster count vs party size.
 */
export function getEncounterMultiplier(
	monsterCount: number,
	partySize: number,
): number {
	// Standard multipliers
	const multipliers: [number, number][] = [
		[1, 1],
		[2, 1.5],
		[3, 2],
		[7, 2.5],
		[11, 3],
		[15, 4],
	];

	let base = 1;
	for (const [threshold, mult] of multipliers) {
		if (monsterCount >= threshold) base = mult;
	}

	// Adjust for small/large parties
	if (partySize < 3) base *= 1.5;
	if (partySize >= 6) base *= 0.5;

	return base;
}
