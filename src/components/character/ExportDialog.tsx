import { Eye, FileJson, FileText, Printer } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useCharacterExport } from "@/hooks/useCharacterExportImport";
import type { Database } from "@/integrations/supabase/types";
import { exportCharacterPDF } from "@/lib/export";

export type Character = Database["public"]["Tables"]["characters"]["Row"];
type CharacterWithAbilities = Character & {
	abilities: Record<string, number>;
};

export function ExportDialog({
	open,
	onOpenChange,
	character,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	character: CharacterWithAbilities;
}) {
	// R9 of Round 2 — preview the printable sheet in an iframe before
	// committing to download. The same `?print=true` URL the existing
	// exportCharacterPDF opens in a new tab is embedded here. The user
	// can review and then either close or trigger the print dialog
	// against the iframe directly.
	const [previewOpen, setPreviewOpen] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement | null>(null);

	const previewUrl = useMemo(() => {
		const params = new URLSearchParams();
		params.set("print", "true");
		if (character.share_token) params.set("token", character.share_token);
		return `/characters/${character.id}?${params.toString()}`;
	}, [character.id, character.share_token]);

	// Reset preview view when dialog closes.
	useEffect(() => {
		if (!open) setPreviewOpen(false);
	}, [open]);

	// Canonical v2.4 envelope export — the same shape ImportDialog reads, so
	// export → import round-trips (guest characters included).
	const { exportCharacterJson } = useCharacterExport();
	const handleExportJSON = () => {
		void exportCharacterJson(character.id);
		onOpenChange(false);
	};

	const handleExportPDF = () => {
		exportCharacterPDF(character.id, {
			shareToken: character.share_token ?? null,
		});
		onOpenChange(false);
	};

	const handlePrintFromPreview = () => {
		const iframe = iframeRef.current;
		if (iframe?.contentWindow) {
			iframe.contentWindow.focus();
			iframe.contentWindow.print();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className={previewOpen ? "max-w-5xl" : undefined}
				data-testid="export-dialog"
			>
				<DialogHeader>
					<DialogTitle>Export Character</DialogTitle>
					<DialogDescription>
						{previewOpen
							? `Preview of the print layout for ${character.name}. Use Print to send to your browser's PDF dialog.`
							: `Choose how you want to export ${character.name}`}
					</DialogDescription>
				</DialogHeader>

				{previewOpen ? (
					<div className="space-y-3 py-2">
						<div
							className="w-full h-[60vh] rounded-md border border-border/40 overflow-hidden bg-black/40"
							data-testid="export-pdf-preview"
						>
							<iframe
								ref={iframeRef}
								src={previewUrl}
								title={`PDF preview — ${character.name}`}
								className="w-full h-full"
							/>
						</div>
						<div className="flex items-center justify-between gap-2">
							<Button variant="ghost" onClick={() => setPreviewOpen(false)}>
								Back
							</Button>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									onClick={handleExportPDF}
									className="gap-2"
								>
									<FileText className="w-4 h-4" />
									Open in new tab
								</Button>
								<Button
									onClick={handlePrintFromPreview}
									className="gap-2"
									data-testid="export-print-from-preview"
								>
									<Printer className="w-4 h-4" />
									Print / Save as PDF
								</Button>
							</div>
						</div>
					</div>
				) : (
					<div className="space-y-3 py-4">
						<Button
							onClick={handleExportJSON}
							className="w-full justify-start gap-3"
							variant="outline"
						>
							<FileJson className="w-5 h-5" />
							<div className="flex-1 text-left">
								<div className="font-semibold">Export as JSON</div>
								<div className="text-xs text-muted-foreground">
									Backup file with all character data
								</div>
							</div>
						</Button>

						<Button
							onClick={() => setPreviewOpen(true)}
							className="w-full justify-start gap-3"
							variant="outline"
							data-testid="export-preview-btn"
						>
							<Eye className="w-5 h-5" />
							<div className="flex-1 text-left">
								<div className="font-semibold">Preview PDF</div>
								<div className="text-xs text-muted-foreground">
									Preview the print layout in-app before printing
								</div>
							</div>
						</Button>

						<Button
							onClick={handleExportPDF}
							className="w-full justify-start gap-3"
							variant="outline"
						>
							<FileText className="w-5 h-5" />
							<div className="flex-1 text-left">
								<div className="font-semibold">Export as PDF</div>
								<div className="text-xs text-muted-foreground">
									Opens in a new tab and triggers the browser print dialog
								</div>
							</div>
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
