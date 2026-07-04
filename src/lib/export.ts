/**
 * Enhanced export system
 * Export characters, compendium entries, campaigns, etc.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError } from "@/lib/appError";
import { getLocalCharacterState, isLocalCharacterId } from "@/lib/guestStore";

export type Character = Database["public"]["Tables"]["characters"]["Row"];

/**
 * Download file
 */
export function downloadFile(
	content: string,
	filename: string,
	mimeType: string = "application/json",
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Export character as a printable / print-to-PDF page.
 *
 * Opens the live character sheet in a new tab in print mode and triggers
 * the browser's native print dialog. Users get the standard "Save as PDF"
 * option from any modern browser.
 */
export function exportCharacterPDF(
	characterId: string,
	options: { shareToken?: string | null } = {},
): void {
	printCharacterSheet(characterId, options);
}

/**
 * C1: True downloadable PDF file — fetches the character row and renders a
 * structured character-sheet PDF via pdf-lib, then triggers a direct file
 * download (no print dialog). This is the DDB-parity "Export to PDF."
 */
export async function downloadCharacterPdfFile(
	characterId: string,
): Promise<void> {
	let character: Character | null = null;
	if (isLocalCharacterId(characterId)) {
		// Guest characters render from the per-browser store.
		character = getLocalCharacterState(characterId)?.character ?? null;
	} else {
		const { data } = await supabase
			.from("characters")
			.select("*")
			.eq("id", characterId)
			.single();
		character = (data as Character | null) ?? null;
	}
	if (!character) {
		throw new AppError("Character not found for PDF export", "NOT_FOUND");
	}
	const { generateCharacterPdf } = await import("@/lib/characterPdf");
	const bytes = await generateCharacterPdf(character as Character);
	const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${(character.name || "character").replace(/[^a-z0-9]/gi, "_")}.pdf`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

/**
 * Print character sheet (or save as PDF via the browser's print dialog).
 *
 * D&D Beyond parity (#17): threads the share token so read-only viewers
 * with a share link can also print/PDF the sheet.
 */
export function printCharacterSheet(
	characterId: string,
	options: { shareToken?: string | null } = {},
): void {
	const params = new URLSearchParams();
	params.set("print", "true");
	if (options.shareToken) params.set("token", options.shareToken);
	const printWindow = window.open(
		`/characters/${characterId}?${params.toString()}`,
		"_blank",
	);
	if (printWindow) {
		printWindow.onload = () => {
			setTimeout(() => {
				printWindow.print();
			}, 500);
		};
	}
}
