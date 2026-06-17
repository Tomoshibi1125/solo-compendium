import { describe, expect, it } from "vitest";
import { DEFAULT_PIXI_COLOR, parsePixiColor } from "@/lib/vtt/pixiColor";

describe("parsePixiColor", () => {
	it("parses standard 6-digit hex with and without a leading #", () => {
		expect(parsePixiColor("#ff0000")).toBe(0xff0000);
		expect(parsePixiColor("00ff00")).toBe(0x00ff00);
		expect(parsePixiColor("#3B82F6")).toBe(0x3b82f6);
	});

	it("expands 3-digit shorthand", () => {
		expect(parsePixiColor("#fff")).toBe(0xffffff);
		expect(parsePixiColor("f00")).toBe(0xff0000);
		expect(parsePixiColor("#0a3")).toBe(0x00aa33);
	});

	it("trims surrounding whitespace", () => {
		expect(parsePixiColor("  #1a2b3c  ")).toBe(0x1a2b3c);
	});

	it("falls back for nullish input", () => {
		expect(parsePixiColor(undefined)).toBe(DEFAULT_PIXI_COLOR);
		expect(parsePixiColor(null)).toBe(DEFAULT_PIXI_COLOR);
		expect(parsePixiColor("")).toBe(DEFAULT_PIXI_COLOR);
	});

	it("falls back for malformed, named, transparent, and rgb() values", () => {
		expect(parsePixiColor("#xyzxyz")).toBe(DEFAULT_PIXI_COLOR);
		expect(parsePixiColor("#ff00")).toBe(DEFAULT_PIXI_COLOR); // 4 digits
		expect(parsePixiColor("#ff00000")).toBe(DEFAULT_PIXI_COLOR); // 7 digits
		expect(parsePixiColor("red")).toBe(DEFAULT_PIXI_COLOR);
		expect(parsePixiColor("transparent")).toBe(DEFAULT_PIXI_COLOR);
		expect(parsePixiColor("rgb(255,0,0)")).toBe(DEFAULT_PIXI_COLOR);
	});

	it("honors a caller-supplied fallback", () => {
		expect(parsePixiColor(undefined, 0x000000)).toBe(0x000000);
		expect(parsePixiColor("not-a-color", 0x3b82f6)).toBe(0x3b82f6);
	});

	it("never throws regardless of input", () => {
		const inputs: Array<string | undefined | null> = [
			undefined,
			null,
			"",
			"#",
			"######",
			"💀",
			"0x123456",
		];
		for (const input of inputs) {
			expect(() => parsePixiColor(input)).not.toThrow();
		}
	});
});
