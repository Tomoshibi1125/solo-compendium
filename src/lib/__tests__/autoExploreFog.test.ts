import { describe, expect, it } from "vitest";
import { createWall } from "../vtt";
import { applyTokenVisionToFog, normalizeFogData } from "../vtt/autoExploreFog";

describe("auto-explore fog", () => {
	it("creates normalized fog data when revealing token vision", () => {
		const result = applyTokenVisionToFog(
			{
				width: 5,
				height: 5,
				gridSize: 50,
				tokens: [{ id: "token-a", x: 2, y: 2, visionRange: 1 }],
			},
			{ tokenId: "token-a" },
		);
		expect(result.changed).toBe(true);
		expect(result.scene.fogData).toHaveLength(5);
		expect(result.scene.fogData?.[2][2]).toBe(true);
	});

	it("unions visible cells without hiding already revealed fog", () => {
		const fogData = normalizeFogData({ width: 6, height: 3 });
		fogData[0][0] = true;
		const result = applyTokenVisionToFog(
			{
				width: 6,
				height: 3,
				gridSize: 50,
				fogData,
				tokens: [{ id: "token-a", x: 4, y: 1, visionRange: 1 }],
			},
			{ tokenId: "token-a" },
		);
		expect(result.scene.fogData?.[0][0]).toBe(true);
		expect(result.scene.fogData?.[1][4]).toBe(true);
	});

	it("respects scene wall blockers stored in grid coordinates", () => {
		const result = applyTokenVisionToFog(
			{
				width: 5,
				height: 3,
				gridSize: 50,
				walls: [createWall(2, 0, 2, 3, "wall")],
				tokens: [{ id: "token-a", x: 0, y: 1, visionRange: 5 }],
			},
			{ tokenId: "token-a" },
		);
		expect(result.scene.fogData?.[1][0]).toBe(true);
		expect(result.scene.fogData?.[1][1]).toBe(true);
		expect(result.scene.fogData?.[1][3]).toBe(false);
	});

	it("does nothing for hidden tokens", () => {
		const result = applyTokenVisionToFog(
			{
				width: 3,
				height: 3,
				gridSize: 50,
				tokens: [{ id: "token-a", x: 1, y: 1, visible: false }],
			},
			{ tokenId: "token-a" },
		);
		expect(result.changed).toBe(false);
		expect(result.scene.fogData).toBeUndefined();
	});
});
