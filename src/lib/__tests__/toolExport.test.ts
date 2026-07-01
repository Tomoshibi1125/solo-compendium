import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/toolExport";

describe("toCsv", () => {
	it("derives columns from the union of row keys in first-seen order", () => {
		const csv = toCsv([
			{ name: "Ardyn", rank: "A" },
			{ name: "Vex", level: 5 },
		]);
		expect(csv).toBe("name,rank,level\r\nArdyn,A,\r\nVex,,5");
	});

	it("honors an explicit column subset and order", () => {
		const csv = toCsv(
			[{ name: "Ardyn", rank: "A", secret: "x" }],
			["rank", "name"],
		);
		expect(csv).toBe("rank,name\r\nA,Ardyn");
	});

	it("escapes commas, quotes, and newlines per RFC 4180", () => {
		const csv = toCsv([
			{ note: "has, comma", quote: 'say "hi"', multi: "a\nb" },
		]);
		expect(csv).toBe('note,quote,multi\r\n"has, comma","say ""hi""","a\nb"');
	});

	it("renders null/undefined as empty cells", () => {
		const csv = toCsv([{ a: null, b: undefined, c: 0 }], ["a", "b", "c"]);
		expect(csv).toBe("a,b,c\r\n,,0");
	});

	it("returns just the header for an empty row set with explicit columns", () => {
		expect(toCsv([], ["a", "b"])).toBe("a,b");
	});
});
