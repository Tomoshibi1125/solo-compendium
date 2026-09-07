import { describe, expect, it } from "vitest";
import { parsePortraitObjectPath } from "./PortraitUpload";

const origin = "https://project.supabase.co";
const bucketUrl = `${origin}/storage/v1/object/public/character-portraits`;
const characterId = "character-1";
const ownerId = "owner-1";

const parse = (url: string) =>
	parsePortraitObjectPath(url, characterId, ownerId, origin);

describe("parsePortraitObjectPath", () => {
	it("accepts owner-first and legacy portrait URLs", () => {
		expect(
			parse(
				`${bucketUrl}/${ownerId}/portraits/${characterId}-1700000000000.webp?width=512`,
			),
		).toBe(`${ownerId}/portraits/${characterId}-1700000000000.webp`);
		expect(
			parse(`${bucketUrl}/portraits/${characterId}-1700000000000.webp`),
		).toBe(`portraits/${characterId}-1700000000000.webp`);
	});

	it.each([
		[
			"foreign origin",
			`https://evil.example/storage/v1/object/public/character-portraits/${ownerId}/portraits/${characterId}-1.webp`,
		],
		[
			"wrong bucket",
			`${origin}/storage/v1/object/public/custom-tokens/${ownerId}/portraits/${characterId}-1.webp`,
		],
		["wrong owner", `${bucketUrl}/other-owner/portraits/${characterId}-1.webp`],
		["wrong character", `${bucketUrl}/${ownerId}/portraits/character-2-1.webp`],
		[
			"extra path segment",
			`${bucketUrl}/${ownerId}/extra/portraits/${characterId}-1.webp`,
		],
		[
			"nonnumeric suffix",
			`${bucketUrl}/${ownerId}/portraits/${characterId}-latest.webp`,
		],
		[
			"encoded slash",
			`${bucketUrl}/${ownerId}/portraits/${characterId}-1%2F.webp`,
		],
		[
			"encoded backslash",
			`${bucketUrl}/${ownerId}/portraits/${characterId}-1%5C.webp`,
		],
		[
			"wrong extension",
			`${bucketUrl}/${ownerId}/portraits/${characterId}-1.png`,
		],
		["malformed URL", "not-a-url"],
	])("rejects %s", (_label, url) => {
		expect(parse(url)).toBeNull();
	});
});
