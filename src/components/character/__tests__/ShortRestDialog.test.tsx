/**
 * Short Rest dialog: the character and its level-scaled companions spend Hit
 * Dice the same way (RA-10), and nothing is applied until the rest finishes.
 */
import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { spendMock, targetsMock } = vi.hoisted(() => ({
	spendMock: vi.fn(),
	targetsMock: vi.fn(),
}));

vi.mock("@/hooks/useGlobalDDBeyondIntegration", () => ({
	useAscendantTools: () => ({ trackHealthChange: () => Promise.resolve() }),
}));
vi.mock("@/hooks/useCompanionRest", () => ({
	useCompanionShortRestTargets: targetsMock,
	useSpendCompanionHitDice: () => ({ mutate: spendMock }),
}));

import { ShortRestDialog } from "@/components/CharacterSheet/ShortRestDialog";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const hound = {
	instanceId: "hound-1",
	name: "Ash Hound",
	hitDie: 10,
	hitDiceMax: 5,
	hitDiceAvailable: 3,
	hpCurrent: 12,
	hpMax: 50,
};

const activeCleanups: Array<() => void> = [];

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(element);
	});
	activeCleanups.push(() => {
		act(() => {
			root.unmount();
		});
		container.remove();
	});
	return (next: React.ReactElement) =>
		act(() => {
			root.render(next);
		});
};

const button = (match: (button: HTMLButtonElement) => boolean) => {
	const found = Array.from(document.querySelectorAll("button")).find(match);
	if (!found) throw new Error("Button not found");
	return found;
};
const byLabel = (label: string) =>
	button((candidate) => candidate.getAttribute("aria-label") === label);
const byText = (text: string) =>
	button((candidate) => (candidate.textContent ?? "").trim().startsWith(text));
const click = (target: HTMLButtonElement) =>
	act(() => {
		target.click();
	});

const renderDialog = (onFinishRest = vi.fn(), withCompanions = true) => {
	mount(
		<ShortRestDialog
			open={true}
			onOpenChange={vi.fn()}
			hitDiceAvailable={2}
			hitDiceMax={5}
			hitDieSize={8}
			vitScore={14}
			hpCurrent={10}
			hpMax={30}
			onFinishRest={onFinishRest}
			companionOwner={
				withCompanions ? { characterId: "character-1", level: 5 } : undefined
			}
		/>,
	);
	return onFinishRest;
};

beforeEach(() => {
	targetsMock.mockReturnValue([hound]);
	// Every roll lands mid-range: 1d8 → 5, 1d10 → 6.
	vi.spyOn(Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
	while (activeCleanups.length > 0) activeCleanups.pop()?.();
	vi.restoreAllMocks();
	spendMock.mockReset();
	targetsMock.mockReset();
});

describe("ShortRestDialog", () => {
	it("spends the character's and the companion's Hit Dice when the rest finishes", () => {
		const onFinishRest = renderDialog();

		click(byText("Spend 1d8"));
		click(byLabel("Spend a Hit Die for Ash Hound"));
		expect(document.body.textContent).toContain("(+6)");
		expect(spendMock).not.toHaveBeenCalled();

		click(byText("Finish Rest"));
		// 1d8 (5) + VIT 14 (+2) for the character; 1d10 (6) with no VIT for
		// the companion, whose maximum HP has no VIT either.
		expect(onFinishRest).toHaveBeenCalledWith(7, 1);
		expect(spendMock).toHaveBeenCalledTimes(1);
		expect(spendMock).toHaveBeenCalledWith({
			instanceId: "hound-1",
			diceSpent: 1,
			hpRecovered: 6,
		});
	});

	it("spends nothing for a companion that rolled no dice", () => {
		const onFinishRest = renderDialog();
		click(byText("Finish Rest"));
		expect(onFinishRest).toHaveBeenCalledWith(0, 0);
		expect(spendMock).not.toHaveBeenCalled();
	});

	it("applies nothing when the rest is cancelled", () => {
		const onFinishRest = renderDialog();
		click(byLabel("Spend a Hit Die for Ash Hound"));
		click(byText("Cancel"));
		expect(onFinishRest).not.toHaveBeenCalled();
		expect(spendMock).not.toHaveBeenCalled();
	});

	it("stops at the companion's remaining Hit Dice", () => {
		renderDialog();
		const spend = byLabel("Spend a Hit Die for Ash Hound");
		click(spend);
		click(spend);
		click(spend);
		expect(spend.disabled).toBe(true);
		expect(spend.textContent).toContain("No Hit Dice Left");
	});

	it("starts each rest from the character's current Hit Dice", () => {
		const onFinishRest = vi.fn();
		const dialog = (hitDiceAvailable: number) => (
			<ShortRestDialog
				hitDiceAvailable={hitDiceAvailable}
				hitDiceMax={5}
				hitDieSize={8}
				vitScore={14}
				hpCurrent={10}
				hpMax={30}
				onFinishRest={onFinishRest}
			/>
		);
		const rerender = mount(dialog(2));

		click(byText("Short Rest"));
		click(byText("Spend 1d8"));
		click(byText("Finish Rest"));
		expect(onFinishRest).toHaveBeenLastCalledWith(7, 1);

		// A Long Rest later restores the pool; the next Short Rest must not
		// count the difference as dice spent.
		rerender(dialog(5));
		click(byText("Short Rest"));
		expect(document.body.textContent).toContain("5 / 5 (d8)");
		click(byText("Finish Rest"));
		expect(onFinishRest).toHaveBeenLastCalledWith(0, 0);
	});

	it("shows no companion section without level-scaled companions or an owner", () => {
		targetsMock.mockReturnValue([]);
		renderDialog();
		expect(document.body.textContent).not.toContain("Companions");
		activeCleanups.pop()?.();

		targetsMock.mockClear();
		renderDialog(vi.fn(), false);
		expect(targetsMock).not.toHaveBeenCalled();
		expect(document.body.textContent).not.toContain("Companions");
	});
});
