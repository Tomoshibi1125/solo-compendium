/**
 * Tiny Markdown/JSON download helpers for the Warden generator tools.
 * Both route through the shared {@link downloadFile} util in `@/lib/export`.
 */

import { downloadFile } from "@/lib/export";

const slugify = (value: string): string =>
	value
		.replace(/[^a-z0-9]+/gi, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase() || "export";

export function downloadMarkdown(baseName: string, markdown: string): void {
	downloadFile(markdown, `${slugify(baseName)}.md`, "text/markdown");
}

export function downloadJson(baseName: string, data: unknown): void {
	downloadFile(
		JSON.stringify(data, null, 2),
		`${slugify(baseName)}.json`,
		"application/json",
	);
}

const csvEscape = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	const text = typeof value === "string" ? value : String(value);
	return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * Serialize an array of row objects to CSV. When `columns` is omitted the
 * header is the union of all row keys in first-seen order. Pure + testable.
 */
export function toCsv(
	rows: ReadonlyArray<Record<string, unknown>>,
	columns?: ReadonlyArray<string>,
): string {
	const cols =
		columns && columns.length > 0
			? [...columns]
			: Array.from(
					rows.reduce<Set<string>>((set, row) => {
						for (const key of Object.keys(row)) set.add(key);
						return set;
					}, new Set<string>()),
				);
	const header = cols.map(csvEscape).join(",");
	const body = rows
		.map((row) => cols.map((col) => csvEscape(row[col])).join(","))
		.join("\r\n");
	return body ? `${header}\r\n${body}` : header;
}

export function downloadCsv(
	baseName: string,
	rows: ReadonlyArray<Record<string, unknown>>,
	columns?: ReadonlyArray<string>,
): void {
	downloadFile(toCsv(rows, columns), `${slugify(baseName)}.csv`, "text/csv");
}

/**
 * Parse CSV text (RFC-4180-ish: quoted fields, doubled-quote escapes, \r\n or
 * \n) into row objects keyed by the header line. Inverse of {@link toCsv}.
 */
export function parseCsv(text: string): Array<Record<string, string>> {
	const records: string[][] = [];
	let field = "";
	let record: string[] = [];
	let inQuotes = false;

	const pushField = () => {
		record.push(field);
		field = "";
	};
	const pushRecord = () => {
		pushField();
		// Skip fully empty lines (e.g. trailing newline).
		if (record.length > 1 || record[0] !== "") records.push(record);
		record = [];
	};

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
		} else if (char === '"') {
			inQuotes = true;
		} else if (char === ",") {
			pushField();
		} else if (char === "\n") {
			pushRecord();
		} else if (char !== "\r") {
			field += char;
		}
	}
	if (field !== "" || record.length > 0) pushRecord();

	const [header, ...rows] = records;
	if (!header) return [];
	return rows.map((cells) =>
		Object.fromEntries(header.map((col, i) => [col.trim(), cells[i] ?? ""])),
	);
}

/**
 * Apply the book-brand print stylesheet to a target element and open the
 * browser's print dialog (Save-as-PDF). `selector` defaults to `<body>`.
 * The `.book-print-root` class is removed again on `afterprint` (with a
 * timeout safety net for browsers that don't fire it reliably).
 *
 * Callers must ensure `@/styles/book-print.css` is imported on the page —
 * the shared {@link "@/components/shared/ExportMenu"} does this for you.
 */
export function printViaBookBrand(selector?: string): void {
	if (typeof window === "undefined" || typeof document === "undefined") return;
	const target = selector
		? document.querySelector<HTMLElement>(selector)
		: document.body;
	if (!target) {
		window.print();
		return;
	}
	const cleanup = () => {
		target.classList.remove("book-print-root");
		window.removeEventListener("afterprint", cleanup);
	};
	target.classList.add("book-print-root");
	window.addEventListener("afterprint", cleanup);
	window.print();
	window.setTimeout(cleanup, 1500);
}
