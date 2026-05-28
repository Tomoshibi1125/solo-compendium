/**
 * SheetThemeDialog — per-character visual customization (F2 of May 2026
 * remediation plan). Lets the player pick a sheet theme, optional accent
 * override, and optional backdrop image. Persists via the standard
 * character-update mutation.
 */
import { Check, Palette, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DEFAULT_SHEET_THEME_ID,
	getSheetTheme,
	SHEET_THEMES,
} from "@/data/sheetThemes";
import { useDialogSwipeClose } from "@/hooks/useDialogSwipeClose";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CharacterRecord {
	id: string;
	sheet_theme?: string | null;
	sheet_backdrop?: string | null;
	sheet_accent?: string | null;
}

export interface SheetThemePreview {
	sheet_theme: string;
	sheet_backdrop: string | null;
	sheet_accent: string | null;
}

interface SheetThemeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	character: CharacterRecord;
	onSave: (patch: SheetThemePreview) => Promise<void> | void;
	/**
	 * Q1 of Round 3 — live preview. Fires on every state change inside
	 * the dialog so the underlying sheet can re-render with the
	 * in-progress theme. Cleared (called with null) when the dialog
	 * closes — the parent restores the persisted character values.
	 */
	onPreviewChange?: (preview: SheetThemePreview | null) => void;
}

export function SheetThemeDialog({
	open,
	onOpenChange,
	character,
	onSave,
	onPreviewChange,
}: SheetThemeDialogProps) {
	const { toast } = useToast();
	const [themeId, setThemeId] = useState<string>(
		character.sheet_theme || DEFAULT_SHEET_THEME_ID,
	);
	const [backdrop, setBackdrop] = useState<string>(
		character.sheet_backdrop || "",
	);
	const [accent, setAccent] = useState<string>(character.sheet_accent || "");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (open) {
			setThemeId(character.sheet_theme || DEFAULT_SHEET_THEME_ID);
			setBackdrop(character.sheet_backdrop || "");
			setAccent(character.sheet_accent || "");
		}
	}, [open, character]);

	// Q1 of Round 3 — broadcast every in-progress change so the underlying
	// sheet root re-renders with the preview theme. Clears when dialog
	// closes.
	useEffect(() => {
		if (!onPreviewChange) return;
		if (!open) {
			onPreviewChange(null);
			return;
		}
		onPreviewChange({
			sheet_theme: themeId,
			sheet_backdrop: backdrop.trim() || null,
			sheet_accent: accent.trim() || null,
		});
	}, [open, themeId, backdrop, accent, onPreviewChange]);

	const handleSave = async () => {
		setSaving(true);
		try {
			await onSave({
				sheet_theme: themeId,
				sheet_backdrop: backdrop.trim() || null,
				sheet_accent: accent.trim() || null,
			});
			toast({
				title: "Sheet customized",
				description: `Theme set to ${getSheetTheme(themeId).name}.`,
			});
			onOpenChange(false);
		} catch (err) {
			toast({
				title: "Couldn't save sheet customization",
				description:
					err instanceof Error ? err.message : "Try again in a moment.",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	const previewTheme = getSheetTheme(themeId);
	const bindSwipeClose = useDialogSwipeClose(() => onOpenChange(false));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-2xl touch-pan-y bg-background/70 backdrop-blur-md"
				data-testid="sheet-theme-dialog"
				{...bindSwipeClose()}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Palette className="w-5 h-5 text-primary" />
						Customize Sheet
					</DialogTitle>
					<DialogDescription>
						Pick a theme, optionally drop a custom accent or backdrop. Settings
						persist with the character.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-2 max-h-[60vh] overflow-y-auto">
					<div>
						<Label className="block mb-3">Theme</Label>
						<div
							className="grid grid-cols-2 md:grid-cols-3 gap-2"
							role="radiogroup"
							aria-label="Sheet theme"
						>
							{SHEET_THEMES.map((theme) => {
								const selected = themeId === theme.id;
								return (
									<button
										type="button"
										key={theme.id}
										onClick={() => setThemeId(theme.id)}
										aria-pressed={selected}
										aria-current={selected ? "true" : undefined}
										aria-label={`Set sheet theme to ${theme.name}`}
										data-testid={`sheet-theme-option-${theme.id}`}
										className={cn(
											"relative rounded-lg border p-3 text-left transition-all",
											"hover:border-primary/60 hover:ring-2 hover:ring-primary/30 focus:outline-none focus:ring-2 focus:ring-primary",
											selected
												? "border-primary ring-2 ring-primary"
												: "border-border/40",
										)}
										style={{ background: `${theme.accent}12` }}
									>
										<div className="flex items-center gap-2 mb-1">
											<span
												className="inline-block w-3 h-3 rounded-full"
												style={{ background: theme.accent }}
												aria-hidden="true"
											/>
											<span className="text-sm font-display font-semibold">
												{theme.name}
											</span>
											{selected && (
												<Check className="w-4 h-4 ml-auto text-primary" />
											)}
										</div>
										<p className="text-xs text-muted-foreground leading-snug">
											{theme.description}
										</p>
									</button>
								);
							})}
						</div>
					</div>

					<div>
						<Label htmlFor="sheet-accent">Accent override (optional)</Label>
						<div className="flex items-center gap-2 mt-2">
							<Input
								id="sheet-accent"
								type="text"
								value={accent}
								onChange={(e) => setAccent(e.target.value)}
								placeholder={previewTheme.accent}
								className="flex-1"
								data-testid="sheet-theme-accent-input"
							/>
							{accent && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setAccent("")}
									aria-label="Clear accent override"
								>
									<X className="w-4 h-4" />
								</Button>
							)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							CSS color value (hex, hsl, rgb). Leave blank to use the theme's
							default.
						</p>
					</div>

					<div>
						<Label htmlFor="sheet-backdrop">Backdrop URL (optional)</Label>
						<div className="flex items-center gap-2 mt-2">
							<Input
								id="sheet-backdrop"
								type="text"
								value={backdrop}
								onChange={(e) => setBackdrop(e.target.value)}
								placeholder="/portraits/example.jpg or https://…"
								className="flex-1"
								data-testid="sheet-theme-backdrop-input"
							/>
							{backdrop && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setBackdrop("")}
									aria-label="Clear backdrop"
								>
									<X className="w-4 h-4" />
								</Button>
							)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Backdrop image rendered behind the sheet. Leave blank to use the
							theme's default.
						</p>
					</div>

					<div className="rounded-lg border border-border/40 p-3">
						<Label className="text-xs uppercase tracking-wider text-muted-foreground">
							Preview
						</Label>
						<div
							className="mt-2 rounded-md p-4 border"
							style={{
								background: `linear-gradient(135deg, ${accent || previewTheme.accent}22 0%, transparent 70%)`,
								borderColor: accent || previewTheme.accent,
								boxShadow: `0 0 24px ${previewTheme.glow}`,
							}}
						>
							<div className="text-sm font-display">Sheet Preview</div>
							<div
								className="text-xs"
								style={{ color: accent || previewTheme.accent }}
							>
								Accent text + glow render with this color.
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={saving}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving}
						data-testid="sheet-theme-save-btn"
					>
						{saving ? "Saving…" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
