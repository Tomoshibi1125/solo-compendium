/**
 * Character Sheet PDF Export
 *
 * Generates a PDF of the character sheet using jspdf + html-to-image.
 * Lazy-loaded to avoid bundle bloat (jspdf is 250KB).
 */

import { toPng } from 'html-to-image';

// ─── Types ──────────────────────────────────────────────────
export interface PDFExportOptions {
    characterName: string;
    elementSelector: string; // CSS selector for the sheet container
    format?: 'a4' | 'letter';
    orientation?: 'portrait' | 'landscape';
    quality?: number; // 0-1
    backgroundColor?: string;
}

export interface PDFExportResult {
    success: boolean;
    filename?: string;
    error?: string;
}

// ─── Export Function ────────────────────────────────────────

/**
 * Export a character sheet DOM element to PDF
 * Lazy-loads jspdf to keep initial bundle small
 */
export async function exportCharacterSheetPDF(
    options: PDFExportOptions,
): Promise<PDFExportResult> {
    const {
        characterName,
        elementSelector,
        format = 'letter',
        orientation = 'portrait',
        quality = 0.95,
        backgroundColor = '#111111',
    } = options;

    try {
        // Find the element to capture
        const element = document.querySelector(elementSelector) as HTMLElement | null;
        if (!element) {
            return { success: false, error: `Element not found: ${elementSelector}` };
        }

        // Capture DOM to PNG
        const dataUrl = await toPng(element, {
            quality,
            backgroundColor,
            pixelRatio: 2, // High-res capture
            filter: (node) => {
                // Skip buttons, tooltips, and other interactive elements
                const el = node as HTMLElement;
                if (el.classList?.contains('pdf-exclude')) return false;
                if (el.tagName === 'BUTTON' && !el.classList?.contains('pdf-include')) return false;
                return true;
            },
        });

        // Lazy-load jspdf
        const { jsPDF } = await import('jspdf');

        // Create PDF
        const pageWidth = format === 'a4' ? 210 : 215.9; // mm
        const pageHeight = format === 'a4' ? 297 : 279.4; // mm

        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format,
        });

        // Calculate image dimensions to fit page with margins
        const margin = 10; // mm
        const maxWidth = (orientation === 'portrait' ? pageWidth : pageHeight) - margin * 2;
        const maxHeight = (orientation === 'portrait' ? pageHeight : pageWidth) - margin * 2;

        // Get image dimensions
        const img = new Image();
        img.src = dataUrl;
        await new Promise<void>((resolve) => {
            img.onload = () => resolve();
        });

        const aspectRatio = img.width / img.height;
        let imgWidth = maxWidth;
        let imgHeight = imgWidth / aspectRatio;

        if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight * aspectRatio;
        }

        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = margin;

        // Add character name as title
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${characterName} — Solo Compendium`, margin, margin - 2);

        // Add the image
        pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

        // Save
        const filename = `${characterName.replace(/[^a-zA-Z0-9]/g, '_')}_character_sheet.pdf`;
        pdf.save(filename);

        return { success: true, filename };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'PDF export failed';
        console.error('[PDF Export]', error);
        return { success: false, error: message };
    }
}
