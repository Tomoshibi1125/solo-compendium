import { describe, expect, it } from "vitest";
import {
	formatActionType,
	formatEnumLabel,
	formatRarityLabel,
	formatRecharge,
	getRarityBadgeClass,
} from "@/lib/labels";

describe("formatRarityLabel", () => {
	it("maps both very-rare spellings to the canonical label", () => {
		expect(formatRarityLabel("very_rare")).toBe("Very Rare");
		expect(formatRarityLabel("very-rare")).toBe("Very Rare");
		expect(formatRarityLabel("VERY_RARE")).toBe("Very Rare");
	});

	it("covers the full 8-tier ladder", () => {
		expect(formatRarityLabel("common")).toBe("Common");
		expect(formatRarityLabel("uncommon")).toBe("Uncommon");
		expect(formatRarityLabel("rare")).toBe("Rare");
		expect(formatRarityLabel("epic")).toBe("Epic");
		expect(formatRarityLabel("legendary")).toBe("Legendary");
		expect(formatRarityLabel("mythic")).toBe("Mythic");
		expect(formatRarityLabel("artifact")).toBe("Artifact");
	});

	it("title-cases unknown values and returns empty for nullish", () => {
		expect(formatRarityLabel("foo")).toBe("Foo");
		expect(formatRarityLabel(null)).toBe("");
		expect(formatRarityLabel(undefined)).toBe("");
		expect(formatRarityLabel("")).toBe("");
	});
});

describe("formatEnumLabel", () => {
	it("title-cases short delimiter-joined tokens", () => {
		expect(formatEnumLabel("bonus_action")).toBe("Bonus Action");
		expect(formatEnumLabel("short-rest")).toBe("Short Rest");
		expect(formatEnumLabel("force")).toBe("Force");
	});

	it("leaves special tokens and free text untouched", () => {
		expect(formatEnumLabel("N/A")).toBe("N/A");
		expect(formatEnumLabel("5-6")).toBe("5-6");
		expect(formatEnumLabel("Channel mana through the ink circuits")).toBe(
			"Channel mana through the ink circuits",
		);
	});

	it("returns empty for nullish", () => {
		expect(formatEnumLabel(null)).toBe("");
		expect(formatEnumLabel(undefined)).toBe("");
	});
});

describe("formatRecharge", () => {
	it("normalizes the casings/spellings of one cadence to a canonical label", () => {
		expect(formatRecharge("long rest")).toBe("Long Rest");
		expect(formatRecharge("long-rest")).toBe("Long Rest");
		expect(formatRecharge("Long rest")).toBe("Long Rest");
		expect(formatRecharge("short-rest")).toBe("Short Rest");
		expect(formatRecharge("at-will")).toBe("At-Will");
	});

	it("passes through recharge dice and specials", () => {
		expect(formatRecharge("5-6")).toBe("5-6");
		expect(formatRecharge("N/A")).toBe("N/A");
		expect(formatRecharge("continuous")).toBe("Continuous");
	});
});

describe("formatActionType", () => {
	it("title-cases the known action-economy vocabulary", () => {
		expect(formatActionType("bonus action")).toBe("Bonus Action");
		expect(formatActionType("action")).toBe("Action");
		expect(formatActionType("reaction")).toBe("Reaction");
		expect(formatActionType("passive")).toBe("Passive");
	});

	it("returns free-text activation descriptions verbatim", () => {
		expect(formatActionType("Channel mana through the ink circuits")).toBe(
			"Channel mana through the ink circuits",
		);
		expect(formatActionType("Press your palm against the design")).toBe(
			"Press your palm against the design",
		);
	});
});

describe("getRarityBadgeClass", () => {
	it("returns a class for known tiers and matches across very-rare spellings", () => {
		expect(getRarityBadgeClass("epic")).toContain("gate-national");
		expect(getRarityBadgeClass("very_rare")).toBe(
			getRarityBadgeClass("very-rare"),
		);
		expect(getRarityBadgeClass("very_rare")).not.toBe("");
	});

	it("returns empty for nullish/unknown", () => {
		expect(getRarityBadgeClass(null)).toBe("");
		expect(getRarityBadgeClass(undefined)).toBe("");
		expect(getRarityBadgeClass("foo")).toBe("");
	});
});
