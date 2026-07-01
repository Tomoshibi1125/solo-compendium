/**
 * Campaign session-log PDF (Part B / B1).
 *
 * Renders the structured {@link SessionLogModel} (rules + rolls + notes) to a
 * real, downloadable PDF via `pdf-lib` — mirroring the character-sheet path in
 * `characterPdf.ts` rather than relying on the browser print dialog. Kept in
 * its own module so `pdf-lib` is only bundled when a user actually exports
 * (dynamic import from the export menu).
 */

import { PDFDocument, type PDFFont, rgb, StandardFonts } from "pdf-lib";
import type { SessionLogModel } from "@/lib/campaignExport";

const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.45, 0.45, 0.5);
const ACCENT = rgb(0.35, 0.2, 0.6);

const PAGE: [number, number] = [612, 792]; // US Letter
const MARGIN = 48;
const BOTTOM = MARGIN + 24;

/**
 * Generate the session-log PDF bytes. Paginates automatically so long note
 * logs flow onto additional pages instead of overrunning the footer.
 */
export async function generateCampaignSessionLogPdf(
	model: SessionLogModel,
): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);

	let page = doc.addPage(PAGE);
	const width = page.getWidth();
	const maxWidth = width - MARGIN * 2;
	let y = page.getHeight() - MARGIN;

	const newPage = () => {
		page = doc.addPage(PAGE);
		y = page.getHeight() - MARGIN;
	};
	const ensure = (needed: number) => {
		if (y - needed < BOTTOM) newPage();
	};

	const line = (
		str: string,
		size: number,
		f: PDFFont = font,
		color = INK,
		indent = 0,
	) => {
		for (const wrapped of wrapText(str, f, size, maxWidth - indent)) {
			ensure(size + 4);
			page.drawText(wrapped, {
				x: MARGIN + indent,
				y,
				size,
				font: f,
				color,
			});
			y -= size + 4;
		}
	};

	// ── Title ─────────────────────────────────────────────────────
	line(model.title || "Untitled Campaign", 22, bold, ACCENT);
	y -= 4;
	line(`Session Log · Exported ${model.generatedAt}`, 10, font, MUTED);
	y -= 12;

	for (const section of model.sections) {
		ensure(28);
		line(section.heading.toUpperCase(), 12, bold, ACCENT);
		y -= 2;
		if (section.lines.length === 0) {
			line("—", 10, font, MUTED);
		}
		for (const text of section.lines) {
			if (text.trim() === "") {
				y -= 6;
				continue;
			}
			line(text, 10, font, INK, 6);
		}
		y -= 10;
	}

	return doc.save();
}

/** Trigger a browser download of the session-log PDF. */
export async function downloadCampaignSessionLogPdf(
	model: SessionLogModel,
	baseName: string,
): Promise<void> {
	const bytes = await generateCampaignSessionLogPdf(model);
	const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${slugify(baseName)}-session-log.pdf`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

const slugify = (value: string): string =>
	value
		.replace(/[^a-z0-9]+/gi, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase() || "campaign";

/** Word-wrap a string to lines that fit `maxWidth` at the given font/size. */
function wrapText(
	str: string,
	font: PDFFont,
	size: number,
	maxWidth: number,
): string[] {
	const words = str.split(/\s+/).filter(Boolean);
	if (words.length === 0) return [""];
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const test = current ? `${current} ${word}` : word;
		if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
			lines.push(current);
			current = word;
		} else {
			current = test;
		}
	}
	if (current) lines.push(current);
	return lines;
}
