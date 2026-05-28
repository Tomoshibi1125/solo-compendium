/**
 * InlineSectionNote — per-section freeform note disclosure (F3 of May
 * 2026 remediation plan). DDB parity: each major sheet section can
 * carry a small scratchpad next to the data.
 *
 * Persists via `useCharacterSheetState.setSectionNote(section, value)`,
 * which stores the entry inside the existing
 * `character_sheet_state.resources.ui.sectionNotes` JSON blob — no
 * schema change required.
 *
 * Component is presentational; the parent passes the current value and
 * an onChange callback. The 500ms debounce is intentionally local so
 * fast typing doesn't flood the server.
 */
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SheetNoteSection } from "@/lib/characterSheetState";
import { cn } from "@/lib/utils";

interface InlineSectionNoteProps {
	section: SheetNoteSection;
	label?: string;
	value: string;
	onChange: (value: string) => void;
	readOnly?: boolean;
	/** Render the note expanded by default. Default: false. */
	defaultOpen?: boolean;
}

export function InlineSectionNote({
	section,
	label,
	value,
	onChange,
	readOnly,
	defaultOpen,
}: InlineSectionNoteProps) {
	const [open, setOpen] = useState(defaultOpen ?? value.trim().length > 0);
	const [local, setLocal] = useState(value);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Sync external value changes (e.g. character reload) into local state.
	useEffect(() => {
		setLocal(value);
	}, [value]);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const handleChange = (next: string) => {
		setLocal(next);
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			onChange(next);
		}, 500);
	};

	const sectionId = `inline-note-${section}`;
	const buttonLabel = label || `${section} notes`;

	return (
		<div
			className={cn(
				"mt-2 rounded-md border border-border/30 bg-black/20 transition-all",
				open ? "border-primary/30" : "",
			)}
			data-testid={`inline-section-note-${section}`}
		>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls={sectionId}
				className="w-full justify-start gap-2 h-8 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
			>
				<FileText className="w-3.5 h-3.5" />
				<span className="flex-1 text-left">Notes — {buttonLabel}</span>
				{local.trim().length > 0 && (
					<span
						className="text-[10px] font-mono text-primary/70"
						title="Note has content"
						role="img"
						aria-label="Note has content"
					>
						•
					</span>
				)}
				{open ? (
					<ChevronUp className="w-4 h-4" />
				) : (
					<ChevronDown className="w-4 h-4" />
				)}
			</Button>
			{open && (
				<div id={sectionId} className="p-2">
					<Textarea
						value={local}
						onChange={(e) => handleChange(e.target.value)}
						placeholder={readOnly ? "" : "Quick note for this section…"}
						readOnly={readOnly}
						rows={3}
						aria-label={`${buttonLabel} freeform note`}
						className="text-sm bg-black/30 border-border/40 focus-visible:ring-primary/40"
						data-testid={`inline-section-note-textarea-${section}`}
					/>
				</div>
			)}
		</div>
	);
}
