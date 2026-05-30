/**
 * Real character-sheet PDF generation (C1).
 *
 * Produces a downloadable, structured PDF via `pdf-lib` — a true file
 * export matching D&D Beyond, rather than relying on the browser's
 * print-to-PDF dialog. Mirrors the on-screen sheet section order:
 * identity → ability scores + modifiers → combat stats → saves/passives →
 * conditions → notes.
 *
 * Kept in its own module so `pdf-lib` is only bundled when a user actually
 * exports a PDF (dynamic import from the export hook).
 */

import {
	PDFDocument,
	type PDFFont,
	type PDFPage,
	rgb,
	StandardFonts,
} from "pdf-lib";
import type { Database } from "@/integrations/supabase/types";
import { getAbilityModifier } from "@/lib/5eRulesEngine";
import { formatRegentVernacular } from "@/lib/vernacular";

type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];

const ABILITIES: Array<{ key: keyof AbilityRecord; label: string }> = [
	{ key: "STR", label: "STR" },
	{ key: "AGI", label: "AGI" },
	{ key: "VIT", label: "VIT" },
	{ key: "INT", label: "INT" },
	{ key: "SENSE", label: "SENSE" },
	{ key: "PRE", label: "PRE" },
];

interface AbilityRecord {
	STR: number;
	AGI: number;
	VIT: number;
	INT: number;
	SENSE: number;
	PRE: number;
}

const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.45, 0.45, 0.5);
const ACCENT = rgb(0.35, 0.2, 0.6);

function fmtMod(mod: number): string {
	return mod >= 0 ? `+${mod}` : `${mod}`;
}

function readAbilities(character: CharacterRow): AbilityRecord {
	const raw = (character as { abilities?: unknown }).abilities;
	const rec = (raw && typeof raw === "object" ? raw : {}) as Record<
		string,
		number
	>;
	return {
		STR: rec.STR ?? 10,
		AGI: rec.AGI ?? 10,
		VIT: rec.VIT ?? 10,
		INT: rec.INT ?? 10,
		SENSE: rec.SENSE ?? 10,
		PRE: rec.PRE ?? 10,
	};
}

/**
 * Generate a character-sheet PDF and return the raw bytes.
 */
export async function generateCharacterPdf(
	character: CharacterRow,
): Promise<Uint8Array> {
	const doc = await PDFDocument.create();
	const page = doc.addPage([612, 792]); // US Letter
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);

	const margin = 48;
	const width = page.getWidth();
	let y = page.getHeight() - margin;

	const vern = (s: string | null | undefined) =>
		s ? formatRegentVernacular(s) : "";

	const text = (
		str: string,
		x: number,
		size: number,
		f: PDFFont = font,
		color = INK,
	) => {
		page.drawText(str, { x, y, size, font: f, color });
	};

	const rule = (yy: number) => {
		page.drawLine({
			start: { x: margin, y: yy },
			end: { x: width - margin, y: yy },
			thickness: 0.75,
			color: rgb(0.8, 0.8, 0.85),
		});
	};

	// ── Identity header ───────────────────────────────────────────
	text(vern(character.name) || "Unnamed", margin, 24, bold, ACCENT);
	y -= 26;
	const subtitle = [
		`Level ${character.level ?? 1}`,
		vern(character.job),
		character.path ? `(${vern(character.path)})` : "",
	]
		.filter(Boolean)
		.join("  ");
	text(subtitle, margin, 12, font, MUTED);
	y -= 18;
	rule(y);
	y -= 24;

	// ── Ability scores ────────────────────────────────────────────
	const abilities = readAbilities(character);
	text("ABILITY SCORES", margin, 11, bold, ACCENT);
	y -= 18;
	const colW = (width - margin * 2) / 6;
	ABILITIES.forEach((ab, i) => {
		const x = margin + i * colW;
		const score = abilities[ab.key];
		const mod = getAbilityModifier(score);
		page.drawText(ab.label, { x, y, size: 9, font: bold, color: MUTED });
		page.drawText(`${score}`, {
			x,
			y: y - 16,
			size: 16,
			font: bold,
			color: INK,
		});
		page.drawText(fmtMod(mod), {
			x: x + 28,
			y: y - 14,
			size: 11,
			font,
			color: MUTED,
		});
	});
	y -= 44;
	rule(y);
	y -= 24;

	// ── Combat stats ──────────────────────────────────────────────
	text("COMBAT", margin, 11, bold, ACCENT);
	y -= 18;
	const stats: Array<[string, string]> = [
		["Armor Class", `${character.armor_class ?? "—"}`],
		[
			"Hit Points",
			`${character.hp_current ?? 0} / ${character.hp_max ?? 0}${
				(character.hp_temp ?? 0) > 0 ? ` (+${character.hp_temp})` : ""
			}`,
		],
		[
			"Hit Dice",
			`${character.hit_dice_current ?? 0}/${character.hit_dice_max ?? 0}d${
				character.hit_dice_size ?? 8
			}`,
		],
		[
			"Initiative",
			`${(character.initiative ?? 0) >= 0 ? "+" : ""}${character.initiative ?? 0}`,
		],
		["Speed", `${character.speed ?? 30} ft.`],
		[
			"Rift Favor",
			`${character.rift_favor_current ?? 0}/${character.rift_favor_max ?? 0} (d${
				character.rift_favor_die ?? 4
			})`,
		],
	];
	stats.forEach(([label, value], i) => {
		const col = i % 3;
		const row = Math.floor(i / 3);
		const x = margin + col * ((width - margin * 2) / 3);
		const yy = y - row * 34;
		page.drawText(label, { x, y: yy, size: 9, font: bold, color: MUTED });
		page.drawText(value, { x, y: yy - 14, size: 13, font, color: INK });
	});
	y -= 34 * 2 + 16;
	rule(y);
	y -= 24;

	// ── Conditions ────────────────────────────────────────────────
	text("CONDITIONS", margin, 11, bold, ACCENT);
	y -= 16;
	const conditions = (character.conditions as string[] | null) ?? [];
	text(
		conditions.length > 0 ? conditions.map(vern).join(", ") : "None",
		margin,
		11,
		font,
	);
	y -= 24;

	// ── Notes ─────────────────────────────────────────────────────
	if (character.notes) {
		rule(y);
		y -= 24;
		text("NOTES", margin, 11, bold, ACCENT);
		y -= 16;
		y = drawWrapped(page, vern(character.notes), margin, y, {
			font,
			size: 10,
			maxWidth: width - margin * 2,
			lineHeight: 14,
			color: INK,
		});
	}

	// ── Footer ────────────────────────────────────────────────────
	page.drawText("Generated by Rift Ascendant", {
		x: margin,
		y: margin - 12,
		size: 8,
		font,
		color: MUTED,
	});

	return doc.save();
}

/** Word-wrap helper. Returns the new y after drawing. */
function drawWrapped(
	page: PDFPage,
	str: string,
	x: number,
	startY: number,
	opts: {
		font: PDFFont;
		size: number;
		maxWidth: number;
		lineHeight: number;
		color: ReturnType<typeof rgb>;
	},
): number {
	const words = str.split(/\s+/);
	let line = "";
	let y = startY;
	for (const word of words) {
		const test = line ? `${line} ${word}` : word;
		if (opts.font.widthOfTextAtSize(test, opts.size) > opts.maxWidth && line) {
			page.drawText(line, {
				x,
				y,
				size: opts.size,
				font: opts.font,
				color: opts.color,
			});
			y -= opts.lineHeight;
			line = word;
		} else {
			line = test;
		}
	}
	if (line) {
		page.drawText(line, {
			x,
			y,
			size: opts.size,
			font: opts.font,
			color: opts.color,
		});
		y -= opts.lineHeight;
	}
	return y;
}
