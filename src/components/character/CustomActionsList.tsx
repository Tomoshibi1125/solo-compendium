/**
 * CustomActionsList — surfaces homebrew attacks / abilities defined via
 * `src/lib/customActions.ts`. R1 of Round 2 remediation: the engine
 * existed but no UI consumed it.
 *
 * Persistence: stored on the character sheet state JSON blob
 * (`character_sheet_state.resources.customActions`). Reuses the same
 * "resources" upsert path the rest of the sheet already uses, so no
 * schema change is required.
 */
import { Pencil, Plus, Sparkles, Swords, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AddCustomActionDialog } from "@/components/character/AddCustomActionDialog";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import type { CalculatedStats } from "@/lib/5eCharacterCalculations";
import {
	type CustomAction,
	resolveAction,
} from "@/lib/customActions";
import type { AbilityScore } from "@/types/core-rules";

interface CustomActionsListProps {
	characterId: string;
	stats: CalculatedStats;
	abilities: Record<AbilityScore, number>;
	readOnly?: boolean;
}

interface CharacterResourcesWithCustomActions {
	customActions?: CustomAction[];
}

export function CustomActionsList({
	characterId,
	stats,
	abilities,
	readOnly,
}: CustomActionsListProps) {
	const { toast } = useToast();
	const sheet = useCharacterSheetState(characterId);

	const customActions: CustomAction[] = useMemo(() => {
		const resources = sheet.state.resources as unknown as
			| CharacterResourcesWithCustomActions
			| undefined;
		return Array.isArray(resources?.customActions)
			? (resources.customActions as CustomAction[])
			: [];
	}, [sheet.state.resources]);

	const [editorOpen, setEditorOpen] = useState(false);
	const [editingAction, setEditingAction] = useState<CustomAction | null>(null);

	const persist = (next: CustomAction[]) => {
		void sheet.saveSheetState({
			resources: {
				...(sheet.state.resources as unknown as Record<string, unknown>),
				customActions: next,
			} as unknown as typeof sheet.state.resources,
		});
	};

	const handleSave = (action: CustomAction) => {
		const idx = customActions.findIndex((a) => a.id === action.id);
		const next =
			idx >= 0
				? customActions.map((a) => (a.id === action.id ? action : a))
				: [...customActions, action];
		persist(next);
		toast({
			title: idx >= 0 ? "Custom action updated" : "Custom action added",
			description: action.name,
		});
		setEditorOpen(false);
		setEditingAction(null);
	};

	const handleDelete = (id: string) => {
		const next = customActions.filter((a) => a.id !== id);
		persist(next);
		toast({
			title: "Custom action removed",
		});
	};

	return (
		<AscendantWindow title="CUSTOM ACTIONS">
			<div className="space-y-3">
				{customActions.length === 0 ? (
					<div className="text-center py-6 text-muted-foreground text-sm">
						No custom actions yet. Add a homebrew attack or ability — auto-
						calculates attack bonus, damage formula, and save DC from your
						stats.
					</div>
				) : (
					<div className="space-y-2">
						{customActions.map((action) => {
							const resolved = resolveAction(action, stats, abilities);
							return (
								<div
									key={action.id}
									className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/40 bg-black/20"
									data-testid={`custom-action-row-${action.id}`}
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 flex-wrap">
											<span className="font-display font-semibold text-sm">
												{action.name}
											</span>
											<Badge variant="outline" className="text-[10px]">
												{action.actionType === "action"
													? "Action"
													: action.actionType === "bonus-action"
														? "Bonus Action"
														: action.actionType === "reaction"
															? "Reaction"
															: action.actionType === "free"
																? "Free"
																: "Other"}
											</Badge>
											{action.attackType && action.attackType !== "none" && (
												<Badge variant="secondary" className="text-[10px] gap-1">
													<Swords className="w-3 h-3" />
													{action.attackType}
												</Badge>
											)}
										</div>
										<p className="text-xs text-muted-foreground mt-1">
											{resolved.summary}
										</p>
										{action.description && (
											<p className="text-xs text-muted-foreground/80 mt-1 italic">
												{action.description}
											</p>
										)}
									</div>
									{!readOnly && (
										<div className="flex items-center gap-1 shrink-0">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => {
													setEditingAction(action);
													setEditorOpen(true);
												}}
												aria-label={`Edit ${action.name}`}
												data-testid={`custom-action-edit-${action.id}`}
											>
												<Pencil className="w-3.5 h-3.5" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => handleDelete(action.id)}
												aria-label={`Delete ${action.name}`}
												data-testid={`custom-action-delete-${action.id}`}
												className="text-destructive hover:text-destructive"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
				{!readOnly && (
					<Button
						variant="outline"
						size="sm"
						className="w-full gap-2"
						onClick={() => {
							setEditingAction(null);
							setEditorOpen(true);
						}}
						data-testid="custom-action-add-btn"
					>
						<Plus className="w-4 h-4" />
						<Sparkles className="w-4 h-4 text-fuchsia-300" />
						Add Custom Action
					</Button>
				)}
			</div>
			<AddCustomActionDialog
				open={editorOpen}
				onOpenChange={(open) => {
					setEditorOpen(open);
					if (!open) setEditingAction(null);
				}}
				initial={editingAction}
				onSave={handleSave}
			/>
		</AscendantWindow>
	);
}
