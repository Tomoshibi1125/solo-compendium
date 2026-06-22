import { Trash2 } from "lucide-react";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RegionPolygonEditor } from "@/components/vtt/RegionPolygonEditor";
import { RIFT_REGION_PRESETS } from "@/lib/vtt/regions";
import type { VTTRegionBehavior, VTTRiftRegion } from "@/types/vtt";

/**
 * Misty Pearl A3 — Rift Region authoring dialog.
 *
 * Edit a region's metadata (name, color, opacity, player visibility)
 * and the list of behaviors that fire on token entry. The polygon
 * itself is drawn on the canvas — this dialog only handles the
 * non-spatial side.
 *
 * RA theming: surfaces the six built-in presets (Mana Storm, Void
 * Bleed, Sovereign Aura, Sanctum Ward, Healing Spring, Difficult
 * Terrain) plus custom behavior add-on.
 */
export interface RegionConfigDialogProps {
	open: boolean;
	region: VTTRiftRegion | null;
	onClose: () => void;
	onSave: (region: VTTRiftRegion) => void;
	onDelete?: (regionId: string) => void;
}

export function RegionConfigDialog({
	open,
	region,
	onClose,
	onSave,
	onDelete,
}: RegionConfigDialogProps) {
	const [draft, setDraft] = useState<VTTRiftRegion | null>(region);

	useEffect(() => {
		setDraft(region);
	}, [region]);

	if (!draft) return null;

	const patch = (delta: Partial<VTTRiftRegion>) =>
		setDraft((prev) => (prev ? { ...prev, ...delta } : prev));

	const applyPreset = (presetId: string) => {
		const preset = RIFT_REGION_PRESETS.find((p) => p.id === presetId);
		if (!preset || !draft) return;
		patch({
			name: preset.name,
			color: preset.color,
			opacity: preset.opacity,
			behaviors: [...preset.behaviors],
		});
	};

	const setBehavior = (index: number, next: VTTRegionBehavior | null) => {
		const list = draft.behaviors.slice();
		if (next === null) list.splice(index, 1);
		else list[index] = next;
		patch({ behaviors: list });
	};

	const addBehavior = (kind: VTTRegionBehavior["kind"]) => {
		const next: VTTRegionBehavior =
			kind === "difficult_terrain"
				? { kind: "difficult_terrain", multiplier: 2 }
				: kind === "damage_on_enter"
					? { kind: "damage_on_enter", dice: "1d6", damageType: "force" }
					: kind === "whisper_warden"
						? { kind: "whisper_warden", message: "A token entered the region." }
						: kind === "apply_condition"
							? { kind: "apply_condition", condition: "frightened" }
							: { kind: "play_sound", soundId: "alert" };
		patch({ behaviors: [...draft.behaviors, next] });
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent className="max-w-xl" data-testid="region-config-dialog">
				<DialogHeader>
					<DialogTitle>Rift Region</DialogTitle>
					<DialogDescription>
						Configure a bounded Anomaly field on the active scene.
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="general">
					<TabsList className="grid grid-cols-4">
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="polygon">Polygon</TabsTrigger>
						<TabsTrigger value="behaviors">Behaviors</TabsTrigger>
						<TabsTrigger value="presets">Presets</TabsTrigger>
					</TabsList>

					<TabsContent value="general" className="space-y-3 pt-4">
						<div>
							<Label htmlFor="region-name">Name</Label>
							<Input
								id="region-name"
								value={draft.name}
								onChange={(e) => patch({ name: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-3 gap-3">
							<div>
								<Label htmlFor="region-color">Tint</Label>
								<Input
									id="region-color"
									type="color"
									value={draft.color}
									onChange={(e) => patch({ color: e.target.value })}
								/>
							</div>
							<div>
								<Label htmlFor="region-opacity">Opacity</Label>
								<Input
									id="region-opacity"
									type="number"
									min={0}
									max={1}
									step={0.05}
									value={draft.opacity}
									onChange={(e) =>
										patch({ opacity: Number(e.target.value) || 0 })
									}
								/>
							</div>
							<div className="flex items-center gap-2 pt-6">
								<Switch
									id="region-visible"
									checked={draft.visibleToPlayers}
									onCheckedChange={(checked) =>
										patch({ visibleToPlayers: checked })
									}
								/>
								<Label htmlFor="region-visible" className="text-xs">
									Visible to Ascendants
								</Label>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="polygon" className="space-y-3 pt-4">
						<RegionPolygonEditor
							polygon={draft.polygon}
							onChange={(polygon) => patch({ polygon })}
						/>
					</TabsContent>

					<TabsContent value="behaviors" className="space-y-3 pt-4">
						{draft.behaviors.length === 0 && (
							<p className="text-xs text-muted-foreground">
								No behaviors yet. Add one below or apply a preset.
							</p>
						)}
						{draft.behaviors.map((b, i) => {
							const itemKey = `beh-${i}`;
							return (
								<div
									key={itemKey}
									className="rounded-md border border-border/60 bg-muted/30 p-3 space-y-2"
								>
									<div className="flex items-center justify-between">
										<span className="font-mono text-xs uppercase">
											{b.kind}
										</span>
										<Button
											size="icon"
											variant="ghost"
											className="h-7 w-7 text-destructive"
											onClick={() => setBehavior(i, null)}
										>
											<Trash2 className="w-3.5 h-3.5" />
										</Button>
									</div>
									{b.kind === "damage_on_enter" && (
										<div className="grid grid-cols-2 gap-2">
											<Input
												value={b.dice}
												onChange={(e) =>
													setBehavior(i, { ...b, dice: e.target.value })
												}
												placeholder="2d6"
											/>
											<Input
												value={b.damageType}
												onChange={(e) =>
													setBehavior(i, { ...b, damageType: e.target.value })
												}
												placeholder="necrotic"
											/>
										</div>
									)}
									{b.kind === "difficult_terrain" && (
										<Input
											type="number"
											min={1}
											step={0.5}
											value={b.multiplier}
											onChange={(e) =>
												setBehavior(i, {
													...b,
													multiplier: Number(e.target.value) || 1,
												})
											}
										/>
									)}
									{b.kind === "whisper_warden" && (
										<Textarea
											rows={2}
											value={b.message}
											onChange={(e) =>
												setBehavior(i, { ...b, message: e.target.value })
											}
										/>
									)}
									{b.kind === "apply_condition" && (
										<Input
											value={b.condition}
											onChange={(e) =>
												setBehavior(i, { ...b, condition: e.target.value })
											}
										/>
									)}
									{b.kind === "play_sound" && (
										<Input
											value={b.soundId}
											onChange={(e) =>
												setBehavior(i, { ...b, soundId: e.target.value })
											}
										/>
									)}
								</div>
							);
						})}
						<div className="flex flex-wrap gap-1.5 pt-2">
							{(
								[
									"difficult_terrain",
									"damage_on_enter",
									"whisper_warden",
									"apply_condition",
									"play_sound",
								] as VTTRegionBehavior["kind"][]
							).map((kind) => (
								<Button
									key={kind}
									size="sm"
									variant="outline"
									onClick={() => addBehavior(kind)}
								>
									+ {kind.replace(/_/g, " ")}
								</Button>
							))}
						</div>
					</TabsContent>

					<TabsContent value="presets" className="space-y-2 pt-4">
						<Label className="text-xs">Apply a preset</Label>
						<Select onValueChange={applyPreset}>
							<SelectTrigger>
								<SelectValue placeholder="Choose preset…" />
							</SelectTrigger>
							<SelectContent>
								{RIFT_REGION_PRESETS.map((preset) => (
									<SelectItem key={preset.id} value={preset.id}>
										{preset.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-[10px] text-muted-foreground">
							Applying a preset overwrites the current name, tint, opacity, and
							behavior list.
						</p>
					</TabsContent>
				</Tabs>

				<DialogFooter className="gap-2">
					{onDelete && (
						<Button
							variant="destructive"
							onClick={() => {
								onDelete(draft.id);
								onClose();
							}}
						>
							<Trash2 className="w-3.5 h-3.5 mr-1" />
							Delete region
						</Button>
					)}
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							onSave(draft);
							onClose();
						}}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
