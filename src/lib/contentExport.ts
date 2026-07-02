/**
 * Markdown / row builders for user-facing content exports — compendium detail
 * entries, homebrew records, and dice-roller sessions. Pure and unit-testable;
 * the actual downloads go through the shared ExportMenu → toolExport helpers.
 */

import { formatRegentVernacular } from "@/lib/vernacular";

const titleCase = (key: string): string =>
	key
		.replace(/[_-]+/g, " ")
		.replace(/\b\w/g, (char) => char.toUpperCase())
		.trim();

const isScalar = (value: unknown): value is string | number | boolean =>
	typeof value === "string" ||
	typeof value === "number" ||
	typeof value === "boolean";

/** Keys that are noise in a reader-facing export (ids, art, timestamps). */
const HIDDEN_ENTRY_KEYS = new Set([
	"id",
	"image",
	"image_url",
	"icon",
	"embedding",
	"created_at",
	"updated_at",
	"user_id",
]);

/**
 * Entry fields rendered as dedicated prose up top rather than in the generic
 * property list.
 */
const PROSE_ENTRY_KEYS = new Set([
	"name",
	"display_name",
	"description",
	"flavor",
	"source",
	"source_book",
	"tags",
]);

/**
 * Generic, readable Markdown rendering of any compendium entry: title +
 * category line, prose (description/flavor), simple properties as a list,
 * and structured payloads (effects/abilities/…) as JSON sections so nothing
 * is silently dropped. Vernacular-formatted like the rest of the app.
 */
export function compendiumEntryToMarkdown(
	categoryLabel: string,
	entry: Record<string, unknown>,
): string {
	const name =
		(typeof entry.display_name === "string" && entry.display_name) ||
		(typeof entry.name === "string" && entry.name) ||
		"Untitled Entry";
	const source =
		(typeof entry.source_book === "string" && entry.source_book) ||
		(typeof entry.source === "string" && entry.source) ||
		"";

	const lines: string[] = [`# ${name}`, ""];
	lines.push(`*${categoryLabel}*${source ? ` · ${source}` : ""}`, "");

	if (typeof entry.description === "string" && entry.description.trim()) {
		lines.push(entry.description.trim(), "");
	}
	if (typeof entry.flavor === "string" && entry.flavor.trim()) {
		lines.push(`> ${entry.flavor.trim()}`, "");
	}
	if (
		Array.isArray(entry.tags) &&
		entry.tags.length > 0 &&
		entry.tags.every((tag) => typeof tag === "string")
	) {
		lines.push(`**Tags:** ${(entry.tags as string[]).join(", ")}`, "");
	}

	const scalars: string[] = [];
	const sections: string[] = [];
	for (const [key, value] of Object.entries(entry)) {
		if (HIDDEN_ENTRY_KEYS.has(key) || PROSE_ENTRY_KEYS.has(key)) continue;
		if (value === null || value === undefined || value === "") continue;

		const label = titleCase(key);
		if (isScalar(value)) {
			scalars.push(`- **${label}:** ${value}`);
		} else if (Array.isArray(value) && value.every(isScalar)) {
			if (value.length > 0) {
				scalars.push(`- **${label}:** ${value.join(", ")}`);
			}
		} else {
			sections.push(
				`## ${label}`,
				"",
				"```json",
				JSON.stringify(value, null, 2),
				"```",
				"",
			);
		}
	}

	if (scalars.length > 0) lines.push("## Properties", "", ...scalars, "");
	lines.push(...sections);

	return `${formatRegentVernacular(lines.join("\n")).trim()}\n`;
}

/**
 * Vernacular-formatted copy of an entry for JSON export (same semantics the
 * old hand-rolled CompendiumDetail export had). Falls back to the raw entry
 * if the formatted text no longer parses.
 */
export function vernacularizeEntry<T>(entry: T): T {
	try {
		return JSON.parse(formatRegentVernacular(JSON.stringify(entry))) as T;
	} catch {
		return entry;
	}
}

export interface HomebrewExportRecord {
	name: string;
	content_type: string;
	description: string;
	status: string;
	visibility_scope: string;
	version: number;
	tags: string[];
	source_book?: string | null;
	updated_at?: string;
	data?: Record<string, unknown> | null;
}

/** Readable Markdown rendering of a Genesis Studio (homebrew) record. */
export function homebrewRecordToMarkdown(record: HomebrewExportRecord): string {
	const lines: string[] = [`# ${record.name}`, ""];
	lines.push(
		`*Homebrew ${record.content_type}* · v${record.version} · ${record.status} · ${record.visibility_scope}`,
		"",
	);
	if (record.source_book) lines.push(`**Source:** ${record.source_book}`, "");
	if (record.description.trim()) lines.push(record.description.trim(), "");
	if (record.tags.length > 0)
		lines.push(`**Tags:** ${record.tags.join(", ")}`, "");
	if (record.updated_at) {
		lines.push(`**Updated:** ${new Date(record.updated_at).toISOString()}`, "");
	}
	lines.push(
		"## Payload",
		"",
		"```json",
		JSON.stringify(record.data ?? {}, null, 2),
		"```",
		"",
	);
	return `${formatRegentVernacular(lines.join("\n")).trim()}\n`;
}

export interface DiceSessionRoll {
	dice: string;
	rolls: number[];
	modifier: number;
	total: number;
	timestamp: Date;
	type?: "normal" | "advantage" | "disadvantage";
}

/** Flat row objects for CSV export (newest roll first, as displayed). */
export function diceSessionRows(
	history: ReadonlyArray<DiceSessionRoll>,
): Array<Record<string, unknown>> {
	return history.map((roll) => ({
		time: roll.timestamp.toISOString(),
		dice: roll.dice,
		rolls: roll.rolls.join(" "),
		modifier: roll.modifier,
		total: roll.total,
		mode: roll.type ?? "normal",
	}));
}

export const DICE_SESSION_CSV_COLUMNS = [
	"time",
	"dice",
	"rolls",
	"modifier",
	"total",
	"mode",
] as const;

/** Markdown table of the current dice session (newest roll first). */
export function diceSessionMarkdown(
	history: ReadonlyArray<DiceSessionRoll>,
): string {
	const lines: string[] = [
		`# Dice Session — ${new Date().toLocaleDateString()}`,
		"",
		`${history.length} roll${history.length === 1 ? "" : "s"} recorded.`,
		"",
		"| Time | Dice | Rolls | Modifier | Total | Mode |",
		"| --- | --- | --- | ---: | ---: | --- |",
	];
	for (const roll of history) {
		lines.push(
			`| ${roll.timestamp.toLocaleTimeString()} | ${roll.dice} | ${roll.rolls.join(
				" ",
			)} | ${roll.modifier >= 0 ? `+${roll.modifier}` : roll.modifier} | ${
				roll.total
			} | ${roll.type ?? "normal"} |`,
		);
	}
	return `${lines.join("\n")}\n`;
}
