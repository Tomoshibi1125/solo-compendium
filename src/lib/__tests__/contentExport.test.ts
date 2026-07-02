import { describe, expect, it } from "vitest";
import {
	compendiumEntryToMarkdown,
	DICE_SESSION_CSV_COLUMNS,
	diceSessionMarkdown,
	diceSessionRows,
	homebrewRecordToMarkdown,
	vernacularizeEntry,
} from "@/lib/contentExport";
import { toCsv } from "@/lib/toolExport";

describe("compendiumEntryToMarkdown", () => {
	const entry = {
		id: "item-0001",
		name: "capture net",
		display_name: "Capture Net",
		description: "A reinforced net for subduing anomalies alive.",
		flavor: "Bureau retrieval teams swear by it.",
		source_book: "Rift Ascendant Canon",
		tags: ["gear", "bureau"],
		rarity: "uncommon",
		weight: 3,
		image: "/generated/items/item-0001.webp",
		properties: ["thrown", "special"],
		effects: { on_hit: { condition: "restrained", save: "STR 10" } },
	};

	it("renders title, category line, prose, and tags", () => {
		const md = compendiumEntryToMarkdown("Items", entry);
		expect(md).toContain("# Capture Net");
		expect(md).toContain("*Items* · Rift Ascendant Canon");
		expect(md).toContain("A reinforced net for subduing anomalies alive.");
		expect(md).toContain("> Bureau retrieval teams swear by it.");
		expect(md).toContain("**Tags:** gear, bureau");
	});

	it("renders scalar + string-array fields as properties and skips noise keys", () => {
		const md = compendiumEntryToMarkdown("Items", entry);
		expect(md).toContain("- **Rarity:** uncommon");
		expect(md).toContain("- **Weight:** 3");
		expect(md).toContain("- **Properties:** thrown, special");
		expect(md).not.toContain("item-0001");
		expect(md).not.toContain(".webp");
	});

	it("renders structured payloads as JSON sections so nothing is dropped", () => {
		const md = compendiumEntryToMarkdown("Items", entry);
		expect(md).toContain("## Effects");
		expect(md).toContain('"condition": "restrained"');
	});

	it("falls back to a safe title for nameless entries", () => {
		expect(compendiumEntryToMarkdown("Items", {})).toContain(
			"# Untitled Entry",
		);
	});
});

describe("vernacularizeEntry", () => {
	it("round-trips a JSON-serializable entry", () => {
		const entry = { name: "Test", nested: { values: [1, 2, 3] } };
		expect(vernacularizeEntry(entry)).toEqual(entry);
	});
});

describe("homebrewRecordToMarkdown", () => {
	const record = {
		name: "Gate Piercer",
		content_type: "item",
		description: "A homebrew lance tuned to Threshold frequencies.",
		status: "draft",
		visibility_scope: "private",
		version: 2,
		tags: ["weapon"],
		source_book: null,
		data: { damage: "1d12" },
	};

	it("renders the record header, prose, and payload", () => {
		const md = homebrewRecordToMarkdown(record);
		expect(md).toContain("# Gate Piercer");
		expect(md).toContain("*Homebrew item* · v2 · draft · private");
		expect(md).toContain("A homebrew lance tuned to Threshold frequencies.");
		expect(md).toContain("**Tags:** weapon");
		expect(md).toContain('"damage": "1d12"');
	});
});

describe("dice session export", () => {
	const history = [
		{
			dice: "2d6",
			rolls: [4, 5],
			modifier: 3,
			total: 12,
			timestamp: new Date("2026-07-01T18:30:00Z"),
			type: "advantage" as const,
		},
		{
			dice: "1d20",
			rolls: [17],
			modifier: 0,
			total: 17,
			timestamp: new Date("2026-07-01T18:29:00Z"),
		},
	];

	it("builds flat rows matching the CSV column contract", () => {
		const rows = diceSessionRows(history);
		expect(rows).toHaveLength(2);
		expect(rows[0]).toEqual({
			time: "2026-07-01T18:30:00.000Z",
			dice: "2d6",
			rolls: "4 5",
			modifier: 3,
			total: 12,
			mode: "advantage",
		});
		expect(rows[1].mode).toBe("normal");
		for (const column of DICE_SESSION_CSV_COLUMNS) {
			expect(rows[0]).toHaveProperty(column);
		}
	});

	it("produces CSV with the declared column order", () => {
		const csv = toCsv(diceSessionRows(history), DICE_SESSION_CSV_COLUMNS);
		const [header, first] = csv.split("\r\n");
		expect(header).toBe("time,dice,rolls,modifier,total,mode");
		expect(first).toContain("2d6");
		expect(first).toContain("12");
	});

	it("renders a markdown table with signed modifiers", () => {
		const md = diceSessionMarkdown(history);
		expect(md).toContain("| Time | Dice | Rolls | Modifier | Total | Mode |");
		expect(md).toContain("| 2d6 | 4 5 | +3 | 12 | advantage |");
		expect(md).toContain("| 1d20 | 17 | +0 | 17 | normal |");
		expect(md).toContain("2 rolls recorded.");
	});
});
