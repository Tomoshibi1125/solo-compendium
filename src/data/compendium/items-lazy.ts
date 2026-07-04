import type { Item } from "./items";

/**
 * Lazy per-part item assembly for the app bundle.
 *
 * `items.ts` / `items-index.ts` import every part statically, which makes
 * Rollup emit one multi-MB data chunk and invalidates it whenever any part
 * changes. The app loads items through these assemblers instead, so each
 * part stays its own parallel-loaded, independently-cacheable chunk. The
 * static indexes remain for Node scripts and tests.
 *
 * Order matches the static indexes (later parts win name-dedupe).
 */
const dedupeByName = (parts: Item[][]): Item[] =>
	Array.from(
		new Map(
			parts.flat().map((item) => [item.name.toLowerCase().trim(), item]),
		).values(),
	);

/** Mirrors `items` from items.ts (base equipment + parts 1-5). */
export const loadCoreItems = (): Promise<Item[]> =>
	Promise.all([
		import("./items-base-equipment").then((m) => m.baseEquipment),
		import("./items-part1").then((m) => m.items_part1),
		import("./items-part2").then((m) => m.items_part2),
		import("./items-part3").then((m) => m.items_part3),
		import("./items-part4").then((m) => m.items_part4),
		import("./items-part5").then((m) => m.items_part5),
	]).then(dedupeByName);

/** Mirrors `allItems` from items-index.ts (everything incl. artifacts). */
export const loadAllItems = (): Promise<Item[]> =>
	Promise.all([
		import("./items-base-equipment").then((m) => m.baseEquipment),
		import("./items-part1").then((m) => m.items_part1),
		import("./items-part2").then((m) => m.items_part2),
		import("./items-part3").then((m) => m.items_part3),
		import("./items-part4").then((m) => m.items_part4),
		import("./items-part5").then((m) => m.items_part5),
		import("./items-part6").then((m) => m.items_part6),
		import("./items-part7").then((m) => m.items_part7),
		import("./items-part8").then((m) => m.items_part8),
		import("./items-part9").then((m) => m.items_part9),
		import("./items-gap-fill").then((m) => m.items_gap_fill),
		import("./artifacts").then((m) => m.artifacts),
	]).then(dedupeByName);
