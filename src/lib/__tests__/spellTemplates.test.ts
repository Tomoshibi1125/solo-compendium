import { describe, expect, it } from "vitest";
import {
	buildSpellTemplateDragData,
	createAoeFromSpellTemplate,
	inferSpellTemplateSpec,
} from "../vtt";

describe("spell template drag helpers", () => {
	it("infers cones from spell range text", () => {
		expect(
			inferSpellTemplateSpec({ name: "Dragon Breath", range: "30-foot cone" }),
		).toMatchObject({ shape: "cone", radiusInGridUnits: 6 });
	});

	it("infers radius bursts as circle templates", () => {
		expect(
			inferSpellTemplateSpec({ name: "Pulse", range: "20-foot radius burst" }),
		).toMatchObject({ shape: "circle", radiusInGridUnits: 4 });
	});

	it("creates pinned AoE drawings from spell drops", () => {
		const drawing = createAoeFromSpellTemplate(
			{ name: "Burning Hands", range: "15-foot cone" },
			{ x: 4, y: 5 },
			"warden-1",
		);
		expect(drawing).toMatchObject({
			type: "cone",
			kind: "aoe",
			label: "Burning Hands",
			createdBy: "warden-1",
		});
		expect(drawing?.points).toEqual([
			{ x: 4, y: 5 },
			{ x: 7, y: 5 },
		]);
	});

	it("round-trips compact drag payloads", () => {
		const payload = JSON.parse(
			buildSpellTemplateDragData({
				id: "spell-a",
				name: "Frost Cube",
				range: "10-foot cube",
			}),
		);
		expect(payload).toMatchObject({
			id: "spell-a",
			name: "Frost Cube",
			range: "10-foot cube",
		});
	});
});
