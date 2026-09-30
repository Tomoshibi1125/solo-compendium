import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { CharacterDetailRollsPanel } from "@/components/character/CharacterDetailRollsPanel";
import {
	type ActionResolutionPayloadV1,
	type ActionResolutionPayloadV2,
	isActionResolutionPayload,
} from "@/lib/actionResolution";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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
	return container;
};

afterEach(() => {
	while (activeCleanups.length > 0) activeCleanups.pop()?.();
});

/** A Sovereign v2 save ability: its DC exists only inside the payload. */
const sovereignSave: ActionResolutionPayloadV2 = {
	version: 2,
	id: "sovereign-v2-definition-gravity-well",
	name: "Gravity Well",
	source: { type: "power", entryId: "gravity-well" },
	kind: "save",
	actor: null,
	targets: [],
	actionEconomy: { type: "action", cost: 1 },
	resourceCosts: [],
	conditionIntents: [],
	duration: null,
	concentration: null,
	saveSuccessDamagePolicy: "half",
	mitigationMode: "typed",
	applicationGate: "always",
	automationState: "automated",
	save: { dc: 15, ability: "Agility" },
	damage: { roll: "4d6", type: "force" },
};

const legacySave: ActionResolutionPayloadV1 = {
	version: 1,
	id: "power-mind-spike",
	name: "Mind Spike",
	source: { type: "power", entryId: "mind-spike" },
	kind: "save",
	save: { dc: 13, ability: "Sense" },
};

const actionWith = (payload: unknown) => ({
	action: { name: "Ability", sourceId: "ability", payload },
});

describe("CharacterDetailRollsPanel payload reading", () => {
	it("shows the save DC carried only by a v2 payload", () => {
		expect(isActionResolutionPayload(sovereignSave)).toBe(true);
		const container = mount(
			<CharacterDetailRollsPanel payload={actionWith(sovereignSave)} />,
		);
		expect(container.textContent).toContain("DC 15 Agility");
	});

	it("still reads a v1 payload", () => {
		const container = mount(
			<CharacterDetailRollsPanel payload={actionWith(legacySave)} />,
		);
		expect(container.textContent).toContain("DC 13 Sense");
	});

	it("ignores a payload that fails validation", () => {
		const invalid = { ...sovereignSave, actionEconomy: undefined };
		expect(isActionResolutionPayload(invalid)).toBe(false);
		const container = mount(
			<CharacterDetailRollsPanel payload={actionWith(invalid)} />,
		);
		expect(container.textContent ?? "").not.toContain("DC 15");
	});
});
