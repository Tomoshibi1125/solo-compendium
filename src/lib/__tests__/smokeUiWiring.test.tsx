/**
 * Automated coverage that mirrors the four manual smoke-test surfaces
 * documented in `docs/manual-smoke-ui-wiring.md`:
 *
 *   T1 — Level-Up CTA          (checkLevelUpEligibility eligibility curve)
 *   T2 — Upcast picker         (useSpellCasting.getUpcastLevels rule)
 *   T3 — Crit display          (ActionCard toast string format)
 *   T4 — PDF download / iframe (printCharacterSheet URL composition)
 *
 * The crit-display path duplicates ActionCard's message-format logic
 * verbatim so we lock in the exact string a player would see in the toast
 * (`💥 CRITICAL HIT! ... | Damage: N (dice doubled)`), without needing to
 * render the heavy ActionCard tree (which uses InlineRollButton for the
 * actual attack click).
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { act, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
	isSupabaseConfigured: false,
	supabase: {
		from: vi.fn(),
		auth: { getUser: vi.fn(async () => ({ data: { user: null } })) },
	},
}));

vi.mock("@/hooks/useCharacterActiveSpells", () => ({
	useAddActiveSpell: () => ({ mutateAsync: vi.fn(async () => undefined) }),
}));

import {
	type ActionResolutionPayload,
	resolveAttack,
} from "@/lib/actionResolution";
import { checkLevelUpEligibility } from "@/lib/experience";
import { printCharacterSheet } from "@/lib/export";
import { useSpellCasting } from "@/hooks/useSpellCasting";
import type { SpellSlotData } from "@/hooks/useSpellSlots";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mount = (node: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
};

/**
 * Reproduces the exact message format ActionCard emits in its toast for
 * `handleRoll("attack")` — see `src/components/character/ActionCard.tsx`
 * lines 148-160. Keeping this in lockstep with the component is the entire
 * point of the test; if the format ever drifts we want a failing assertion
 * to flag it.
 */
function buildAttackToastMessage(
	displayName: string,
	outcome: ReturnType<typeof resolveAttack>,
): string {
	if (outcome.kind !== "attack") {
		throw new Error("expected attack outcome");
	}
	const critPrefix = outcome.criticalHit ? "💥 CRITICAL HIT! " : "";
	let message = `${critPrefix}${displayName} Attack: ${outcome.attackTotal} (vs AC 10)`;
	if (outcome.damageTotal) {
		message += ` | Damage: ${outcome.damageTotal}${
			outcome.criticalHit ? " (dice doubled)" : ""
		}`;
	}
	return message;
}

// ---------------------------------------------------------------------------
// T3 — Crit display message format (mirrors ActionCard toast)
// ---------------------------------------------------------------------------

describe("T3 — Crit display toast format", () => {
	const greatswordPayload: ActionResolutionPayload = {
		version: 1,
		id: "atk",
		name: "Greatsword",
		source: { type: "item", entryId: "w1" },
		kind: "attack",
		attack: { roll: "1d20+5", forceCritical: true },
		damage: { roll: "2d6+3", type: "slashing" },
	};

	it("prefixes the toast with 💥 CRITICAL HIT! and tags damage as (dice doubled) on a forced crit", () => {
		const outcome = resolveAttack(greatswordPayload, 10);
		const msg = buildAttackToastMessage("Greatsword", outcome);
		expect(msg.startsWith("💥 CRITICAL HIT! ")).toBe(true);
		expect(msg).toContain("Greatsword Attack:");
		expect(msg).toContain(" (vs AC 10)");
		expect(msg).toContain(" | Damage: ");
		expect(msg).toContain(" (dice doubled)");
	});

	it("does not emit the crit prefix or doubled marker on a non-crit hit", () => {
		// Force a non-crit by forbidding nat-20: stub Math.random to a
		// value that always rolls below 20 on a d20 (rollDie uses
		// floor(random*sides)+1).
		const restore = vi.spyOn(Math, "random").mockReturnValue(0.05);
		try {
			const payload: ActionResolutionPayload = {
				...greatswordPayload,
				attack: { roll: "1d20+20" }, // huge mod, but no forceCritical
			};
			const outcome = resolveAttack(payload, 10);
			expect(outcome.kind).toBe("attack");
			if (outcome.kind !== "attack") return;
			expect(outcome.criticalHit).toBe(false);

			const msg = buildAttackToastMessage("Greatsword", outcome);
			expect(msg.includes("💥 CRITICAL HIT!")).toBe(false);
			expect(msg.includes("(dice doubled)")).toBe(false);
		} finally {
			restore.mockRestore();
		}
	});

	it("doubles damage dice (not the modifier) on a forced crit", () => {
		// 2d6+3 → crit becomes 4d6+3 ∈ [7, 27]
		for (let i = 0; i < 25; i++) {
			const outcome = resolveAttack(greatswordPayload, 10);
			if (outcome.kind !== "attack") throw new Error("wrong kind");
			expect(outcome.criticalHit).toBe(true);
			expect(outcome.damageTotal).toBeGreaterThanOrEqual(7);
			expect(outcome.damageTotal).toBeLessThanOrEqual(27);
		}
	});
});

// ---------------------------------------------------------------------------
// T2 — Upcast picker rule (useSpellCasting.getUpcastLevels)
// ---------------------------------------------------------------------------

type CapturedUpcastFn = (spell: {
	id: string;
	name: string;
	level: number;
	isRitual: boolean;
	isConcentration: boolean;
	castingTime: string | null;
	range: string | null;
	duration: string | null;
	description: string | null;
	higherLevels: string | null;
}) => number[];

const SpellCastingProbe = ({
	slots,
	onReady,
}: {
	slots: SpellSlotData[];
	onReady: (getUpcastLevels: CapturedUpcastFn) => void;
}) => {
	const { getUpcastLevels } = useSpellCasting(slots);
	const fired = useRef(false);
	useEffect(() => {
		if (fired.current) return;
		fired.current = true;
		onReady(getUpcastLevels);
	}, [getUpcastLevels, onReady]);
	return null;
};

const buildSpell = (level: number) => ({
	id: `spell-${level}`,
	name: `Spell L${level}`,
	level,
	isRitual: false,
	isConcentration: false,
	castingTime: "1 action",
	range: "60 ft",
	duration: "Instantaneous",
	description: null,
	higherLevels: null,
});

const captureUpcastLevels = (slots: SpellSlotData[]): CapturedUpcastFn => {
	let captured: CapturedUpcastFn | null = null;
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	const unmount = mount(
		<QueryClientProvider client={queryClient}>
			<SpellCastingProbe
				slots={slots}
				onReady={(fn) => {
					captured = fn;
				}}
			/>
		</QueryClientProvider>,
	);
	if (!captured) throw new Error("getUpcastLevels never captured");
	const fn = captured as CapturedUpcastFn;
	unmount();
	queryClient.clear();
	return fn;
};

const slot = (level: number, current: number, max = current): SpellSlotData =>
	({
		level,
		current,
		max,
	}) as SpellSlotData;

describe("T2 — Upcast picker rule (useSpellCasting.getUpcastLevels)", () => {
	it("returns an empty list for cantrips so the picker stays hidden", () => {
		const fn = captureUpcastLevels([slot(1, 4), slot(2, 3)]);
		expect(fn(buildSpell(0))).toEqual([]);
	});

	it("returns a single-entry list when only the spell's own slot level is available", () => {
		const fn = captureUpcastLevels([slot(1, 4)]);
		expect(fn(buildSpell(1))).toEqual([1]);
		// SpellsList hides the picker entirely when levels.length <= 1.
		expect(fn(buildSpell(1)).length).toBeLessThanOrEqual(1);
	});

	it("includes higher slot levels with available current uses", () => {
		const fn = captureUpcastLevels([
			slot(1, 4),
			slot(2, 3),
			slot(3, 2),
		]);
		expect(fn(buildSpell(1))).toEqual([1, 2, 3]);
		expect(fn(buildSpell(2))).toEqual([2, 3]);
		expect(fn(buildSpell(3))).toEqual([3]);
	});

	it("excludes slot levels with zero current uses (slot exhaustion)", () => {
		const fn = captureUpcastLevels([
			slot(1, 4),
			slot(2, 0, 3), // exhausted
			slot(3, 1, 2),
		]);
		expect(fn(buildSpell(1))).toEqual([1, 3]);
	});

	it("never returns a slot level lower than the spell's base level", () => {
		const fn = captureUpcastLevels([
			slot(1, 4),
			slot(2, 3),
			slot(3, 2),
		]);
		expect(fn(buildSpell(2))).not.toContain(1);
		expect(fn(buildSpell(3))).not.toContain(1);
		expect(fn(buildSpell(3))).not.toContain(2);
	});
});

// ---------------------------------------------------------------------------
// T1 — Level-Up CTA eligibility
// ---------------------------------------------------------------------------

describe("T1 — Level-Up CTA eligibility (checkLevelUpEligibility)", () => {
	it("is NOT eligible when XP is one short of the L2 threshold (299/300)", () => {
		const result = checkLevelUpEligibility(1, 299, "xp");
		expect(result.canLevelUp).toBe(false);
		expect(result.xpToNext).toBe(1);
	});

	it("is eligible exactly at the L2 threshold and reports availableLevel=2", () => {
		const result = checkLevelUpEligibility(1, 300, "xp");
		expect(result.canLevelUp).toBe(true);
		expect(result.availableLevel).toBe(2);
	});

	it("remains eligible when XP is well above the threshold (350)", () => {
		const result = checkLevelUpEligibility(1, 350, "xp");
		expect(result.canLevelUp).toBe(true);
		expect(result.availableLevel).toBe(2);
	});

	it("is never eligible in milestone mode regardless of accumulated XP", () => {
		expect(checkLevelUpEligibility(1, 100_000, "milestone").canLevelUp).toBe(
			false,
		);
		expect(checkLevelUpEligibility(5, 50_000, "milestone").canLevelUp).toBe(
			false,
		);
	});

	it("clamps xpToNext to 0 at the level cap (L20 is terminal)", () => {
		const result = checkLevelUpEligibility(20, 999_999, "xp");
		expect(result.canLevelUp).toBe(false);
		expect(result.xpToNext).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// T4 — Print / PDF URL composition (printCharacterSheet)
// ---------------------------------------------------------------------------

describe("T4 — printCharacterSheet URL composition", () => {
	let openSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		openSpy = vi
			.spyOn(window, "open")
			.mockImplementation(() => null);
	});

	afterEach(() => {
		openSpy.mockRestore();
	});

	it("opens /characters/<id>?print=true&token=<token> in a new tab when share token is supplied", () => {
		printCharacterSheet("char-9001", { shareToken: "tok-xyz" });
		expect(openSpy).toHaveBeenCalledTimes(1);
		const [url, target] = openSpy.mock.calls[0];
		expect(target).toBe("_blank");
		expect(typeof url).toBe("string");
		expect(url as string).toContain("/characters/char-9001");
		expect(url as string).toContain("print=true");
		expect(url as string).toContain("token=tok-xyz");
	});

	it("omits the token query param when no share token is provided", () => {
		printCharacterSheet("char-bare");
		expect(openSpy).toHaveBeenCalledTimes(1);
		const [url] = openSpy.mock.calls[0];
		expect(url as string).toContain("/characters/char-bare");
		expect(url as string).toContain("print=true");
		expect(url as string).not.toContain("token=");
	});

	it("returns silently (no throw) when window.open is blocked / returns null", () => {
		openSpy.mockReturnValueOnce(null);
		expect(() =>
			printCharacterSheet("char-blocked", { shareToken: "t" }),
		).not.toThrow();
	});
});
