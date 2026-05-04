import { Activity, HeartPulse, Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
	type CharacterTattoo,
	type CharacterTattooUpdate,
	useTattoos,
} from "@/hooks/useTattoos";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { DetailData } from "@/types/character";
import { AddTattooDialog } from "./AddTattooDialog";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const getTattooEffectSummary = (tattoo: CharacterTattoo) => {
	const effects = tattoo.custom_effects ?? tattoo.tattoo?.effects;
	if (isRecord(effects)) {
		const primary = effects.primary ?? effects.primaryEffect;
		if (typeof primary === "string") return primary;
		if (Array.isArray(effects.passive)) {
			const firstPassive = effects.passive.find(
				(value): value is string => typeof value === "string",
			);
			if (firstPassive) return firstPassive;
		}
	}
	return tattoo.tattoo?.description ?? tattoo.notes ?? "";
};

export function TattoosList({
	characterId,
	onSelectDetail,
}: {
	characterId: string;
	onSelectDetail?: (detail: DetailData) => void;
}) {
	const { tattoos, updateTattoo, removeTattoo, isLoading } =
		useTattoos(characterId);
	const { toast } = useToast();
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const tattooStats = useMemo(
		() => ({
			total: tattoos.length,
			active: tattoos.filter((tattoo) => tattoo.is_active).length,
			attuned: tattoos.filter(
				(tattoo) => tattoo.requires_attunement && tattoo.is_attuned,
			).length,
			requiresAttunement: tattoos.filter((tattoo) => tattoo.requires_attunement)
				.length,
		}),
		[tattoos],
	);

	const handleToggleActive = async (
		tattoo: CharacterTattoo,
		isActive: boolean,
	) => {
		try {
			const updates: CharacterTattooUpdate = { is_active: isActive };
			await updateTattoo({ id: tattoo.id, updates });
			toast({
				title: isActive ? "Tattoo activated" : "Tattoo dormant",
				description: `${formatRegentVernacular(tattoo.name)} is now ${isActive ? "active" : "inactive"}.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to update tattoo state.",
				variant: "destructive",
			});
		}
	};

	const handleToggleAttuned = async (
		tattoo: CharacterTattoo,
		isAttuned: boolean,
	) => {
		try {
			const updates: CharacterTattooUpdate = { is_attuned: isAttuned };
			await updateTattoo({ id: tattoo.id, updates });
			toast({
				title: isAttuned ? "Tattoo attuned" : "Tattoo unattuned",
				description: `${formatRegentVernacular(tattoo.name)} has been ${isAttuned ? "attuned" : "unattuned"}.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to update tattoo attunement.",
				variant: "destructive",
			});
		}
	};

	const handleRemove = async (tattoo: CharacterTattoo) => {
		const displayName = formatRegentVernacular(tattoo.name);
		if (!confirm(`Remove ${displayName} from this ascendant?`)) return;
		try {
			await removeTattoo(tattoo.id);
			toast({
				title: "Tattoo removed",
				description: `${displayName} has been removed.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to remove tattoo.",
				variant: "destructive",
			});
		}
	};

	return (
		<AscendantWindow title="TATTOOS">
			<div className="space-y-4">
				<div className="grid grid-cols-3 gap-2">
					<div className="rounded-lg border bg-muted/30 p-3">
						<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
							Owned
						</div>
						<div className="text-xl font-heading text-primary">
							{tattooStats.total}
						</div>
					</div>
					<div className="rounded-lg border bg-muted/30 p-3">
						<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
							Active
						</div>
						<div className="text-xl font-heading text-primary">
							{tattooStats.active}
						</div>
					</div>
					<div className="rounded-lg border bg-muted/30 p-3">
						<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
							Attuned
						</div>
						<div className="text-xl font-heading text-primary">
							{tattooStats.attuned}/{tattooStats.requiresAttunement}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-between gap-3">
					<div className="text-xs text-muted-foreground">
						Tattoo effects feed the same runtime stack as relics, runes, and
						sigils.
					</div>
					<Button
						onClick={() => setAddDialogOpen(true)}
						size="sm"
						className="gap-2 shrink-0"
					>
						<Plus className="w-4 h-4" />
						Add Tattoo
					</Button>
				</div>

				{isLoading ? (
					<div className="text-center py-8 text-muted-foreground">
						Loading tattoos...
					</div>
				) : tattoos.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<HeartPulse className="w-12 h-12 mx-auto mb-2 opacity-50" />
						<p>No tattoos inscribed yet.</p>
						<p className="text-xs mt-1">
							Add tattoos to activate dermal resonance effects.
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setAddDialogOpen(true)}
							className="mt-4"
						>
							Add your first tattoo
						</Button>
					</div>
				) : (
					<div className="space-y-3">
						{tattoos.map((tattoo) => {
							const effectSummary = getTattooEffectSummary(tattoo);
							return (
								<div
									key={tattoo.id}
									className="rounded-lg border bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2 flex-wrap">
												<HeartPulse className="w-4 h-4 text-primary" />
												<span className="font-heading font-semibold">
													{formatRegentVernacular(tattoo.name)}
												</span>
												<Badge
													variant={tattoo.is_active ? "secondary" : "outline"}
												>
													{tattoo.is_active ? "Active" : "Dormant"}
												</Badge>
												{tattoo.body_part && (
													<Badge variant="outline" className="text-xs">
														{tattoo.body_part}
													</Badge>
												)}
												{tattoo.requires_attunement && (
													<Badge
														variant="outline"
														className={
															tattoo.is_attuned
																? "text-primary border-primary/40"
																: "text-muted-foreground"
														}
													>
														{tattoo.is_attuned ? "Attuned" : "Needs attunement"}
													</Badge>
												)}
											</div>
											{effectSummary && (
												<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
													{formatRegentVernacular(effectSummary)}
												</p>
											)}
											{tattoo.source && (
												<div className="text-[10px] text-muted-foreground mt-2">
													Source: {tattoo.source}
												</div>
											)}
										</div>
										<div className="flex items-center gap-1">
											{onSelectDetail && (
												<Button
													variant="outline"
													size="icon"
													className="h-8 w-8"
													onClick={() =>
														onSelectDetail({
															title: tattoo.name,
															description: effectSummary,
															payload: tattoo,
														})
													}
													aria-label={`View ${tattoo.name}`}
												>
													<Sparkles className="w-4 h-4" />
												</Button>
											)}
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-destructive"
												onClick={() => handleRemove(tattoo)}
												aria-label={`Remove ${tattoo.name}`}
											>
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									</div>

									<div className="mt-3 grid gap-3 sm:grid-cols-2">
										<div className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
											<Label
												htmlFor={`tattoo-active-${tattoo.id}`}
												className="flex items-center gap-2 text-xs cursor-pointer"
											>
												<Activity className="w-3.5 h-3.5" />
												Active effects
											</Label>
											<Switch
												id={`tattoo-active-${tattoo.id}`}
												checked={tattoo.is_active}
												onCheckedChange={(checked) =>
													handleToggleActive(tattoo, checked)
												}
											/>
										</div>
										{tattoo.requires_attunement && (
											<div className="flex items-center justify-between rounded-md border bg-background/40 px-3 py-2">
												<Label
													htmlFor={`tattoo-attuned-${tattoo.id}`}
													className="flex items-center gap-2 text-xs cursor-pointer"
												>
													<Sparkles className="w-3.5 h-3.5" />
													Tattoo attunement
												</Label>
												<Switch
													id={`tattoo-attuned-${tattoo.id}`}
													checked={tattoo.is_attuned}
													onCheckedChange={(checked) =>
														handleToggleAttuned(tattoo, checked)
													}
												/>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			<AddTattooDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				characterId={characterId}
			/>
		</AscendantWindow>
	);
}
