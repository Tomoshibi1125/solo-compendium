import {
	CheckCircle2,
	Download,
	Hammer,
	Minus,
	Plus,
	Upload,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { HarvestingPanel } from "@/components/character/HarvestingPanel";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { craftingRecipes } from "@/data/compendium/crafting";
import { type CraftingProjectStatus, useCrafting } from "@/hooks/useCrafting";
import { useCraftProjectsM3 } from "@/hooks/useCraftProjectsM3";
import {
	parseMaterialLotBundle,
	useMaterialLots,
} from "@/hooks/useMaterialLots";

interface CraftingPanelProps {
	characterId: string;
	readOnly?: boolean;
}

const statusLabel: Record<CraftingProjectStatus, string> = {
	active: "Active",
	paused: "Paused",
	completed: "Completed",
	abandoned: "Abandoned",
};

const operationId = (kind: string) =>
	`m1:${kind}:${globalThis.crypto.randomUUID()}`;
const craftOperationId = (kind: string) =>
	`m3:${kind}:${globalThis.crypto.randomUUID()}`;

export function CraftingPanel({ characterId, readOnly }: CraftingPanelProps) {
	const { knownRecipes, projects, learnRecipe } = useCrafting(characterId);
	const {
		definitions,
		lots,
		discoveries,
		createLot,
		adjustLot,
		importBundle,
		buildExportBundle,
	} = useMaterialLots(characterId);
	const craft = useCraftProjectsM3(
		characterId,
		lots.map((lot) => lot.id),
	);
	const importInputRef = useRef<HTMLInputElement>(null);
	const [recipeToLearn, setRecipeToLearn] = useState("");
	const [materialDefinitionId, setMaterialDefinitionId] = useState("");
	const [materialQuantity, setMaterialQuantity] = useState(1);
	const [formulaId, setFormulaId] = useState("");
	const [selectedInputLots, setSelectedInputLots] = useState<
		Record<string, string>
	>({});

	const knownRecipeIds = useMemo(
		() => new Set(knownRecipes.map((recipe) => recipe.recipe_id)),
		[knownRecipes],
	);
	const recipeById = useMemo(
		() => new Map(craftingRecipes.map((recipe) => [recipe.id, recipe])),
		[],
	);
	const definitionById = useMemo(
		() => new Map(definitions.map((definition) => [definition.id, definition])),
		[definitions],
	);
	const discoveryByLotId = useMemo(
		() =>
			new Map(discoveries.map((discovery) => [discovery.lot_id, discovery])),
		[discoveries],
	);
	const learnableRecipes = craftingRecipes.filter(
		(recipe) => !knownRecipeIds.has(recipe.id),
	);
	const activeFormula =
		craft.formulas.find((formula) => formula.id === formulaId) ??
		craft.formulas[0];
	const formulaRequirements = Object.entries(
		activeFormula?.requirement_snapshot ?? {},
	);
	const reservedByLotId = useMemo(() => {
		const totals = new Map<string, number>();
		for (const reservation of craft.reservations) {
			totals.set(
				reservation.lot_id,
				(totals.get(reservation.lot_id) ?? 0) + reservation.quantity,
			);
		}
		return totals;
	}, [craft.reservations]);
	const inputSelectionReady =
		formulaRequirements.length > 0 &&
		formulaRequirements.every(([materialId, quantity]) => {
			const selectedId = selectedInputLots[materialId];
			const lot = lots.find((candidate) => candidate.id === selectedId);
			return (
				lot?.material_definition_id === materialId &&
				lot.quantity - (reservedByLotId.get(lot.id) ?? 0) >= quantity
			);
		});

	const handleLearnRecipe = () => {
		if (!recipeToLearn) return;
		learnRecipe.mutate({ recipeId: recipeToLearn });
		setRecipeToLearn("");
	};

	const handleCreateLot = () => {
		if (!materialDefinitionId || materialQuantity <= 0) return;
		createLot.mutate({
			materialDefinitionId,
			quantity: materialQuantity,
			operationId: operationId("create"),
		});
	};

	const handleAdjustLot = (
		lotId: string,
		rowVersion: number,
		delta: number,
	) => {
		if (!delta) return;
		adjustLot.mutate({
			lotId,
			delta,
			expectedVersion: rowVersion,
			operationId: operationId("adjust"),
		});
	};

	const handleExportLots = () => {
		const bundle = buildExportBundle();
		const blob = new Blob([JSON.stringify(bundle, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `material-lots-${characterId}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleImportLots = async (file: File | undefined) => {
		if (!file) return;
		const parsed = parseMaterialLotBundle(JSON.parse(await file.text()));
		await importBundle.mutateAsync({
			bundle: parsed,
			operationId: operationId("import"),
		});
		if (importInputRef.current) importInputRef.current.value = "";
	};

	const handleReserveProject = () => {
		if (!activeFormula) return;
		const inputs = formulaRequirements.map(([materialId, quantity]) => ({
			lot_id: selectedInputLots[materialId] ?? "",
			quantity,
		}));
		if (!inputSelectionReady) return;
		craft.reserve.mutate({
			formulaId: activeFormula.id,
			inputs,
			operationId: craftOperationId("reserve"),
		});
	};

	return (
		<AscendantWindow title="CRAFTING">
			<div className="space-y-4">
				<HarvestingPanel characterId={characterId} readOnly={readOnly} />
				<div className="space-y-2">
					<div className="flex items-center justify-between gap-2">
						<div>
							<div className="text-xs uppercase text-muted-foreground">
								Known Recipes
							</div>
							<div className="text-sm font-semibold">
								{knownRecipes.length} learned
							</div>
						</div>
						{!readOnly && (
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<Select
									value={recipeToLearn}
									onValueChange={setRecipeToLearn}
									disabled={learnableRecipes.length === 0}
								>
									<SelectTrigger className="h-8 text-xs sm:w-56">
										<SelectValue
											placeholder={
												learnableRecipes.length === 0
													? "All recipes learned"
													: "Learn recipe"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{learnableRecipes.map((recipe) => (
											<SelectItem key={recipe.id} value={recipe.id}>
												{recipe.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									size="sm"
									variant="outline"
									className="h-8 gap-2"
									onClick={handleLearnRecipe}
									disabled={!recipeToLearn || learnRecipe.isPending}
								>
									<CheckCircle2 className="w-3.5 h-3.5" />
									Learn
								</Button>
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-1.5">
						{knownRecipes.length === 0 ? (
							<span className="text-xs text-muted-foreground">
								No known recipes yet
							</span>
						) : (
							knownRecipes.map((known) => (
								<Badge key={known.id} variant="secondary">
									{recipeById.get(known.recipe_id)?.name ?? known.recipe_id}
								</Badge>
							))
						)}
					</div>
				</div>

				<div className="space-y-3 border-t border-border/40 pt-3">
					<div className="flex flex-wrap items-start justify-between gap-2">
						<div>
							<div className="text-xs uppercase text-muted-foreground">
								Material Lots
							</div>
							<p className="mt-1 text-xs text-muted-foreground">
								Each lot keeps its own provenance, unit, grade, notes, and
								discovery metadata.
							</p>
						</div>
						<div className="flex gap-1">
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="h-8 gap-1.5"
								onClick={handleExportLots}
								disabled={lots.length === 0}
							>
								<Download className="h-3.5 w-3.5" /> Export lots
							</Button>
							{!readOnly && (
								<>
									<input
										ref={importInputRef}
										type="file"
										accept="application/json,.json"
										className="hidden"
										onChange={(event) =>
											void handleImportLots(event.target.files?.[0])
										}
									/>
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="h-8 gap-1.5"
										onClick={() => importInputRef.current?.click()}
										disabled={importBundle.isPending}
									>
										<Upload className="h-3.5 w-3.5" /> Import lots
									</Button>
								</>
							)}
						</div>
					</div>
					{!readOnly && (
						<div className="flex flex-wrap items-end gap-2">
							<div className="min-w-52 flex-1">
								<Label className="text-xs">Material definition</Label>
								<Select
									value={materialDefinitionId}
									onValueChange={setMaterialDefinitionId}
								>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue placeholder="Choose material" />
									</SelectTrigger>
									<SelectContent>
										{definitions.map((definition) => (
											<SelectItem key={definition.id} value={definition.id}>
												{definition.name}
												{definition.family ? ` · ${definition.family}` : ""}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="w-24">
								<Label htmlFor="material-lot-qty" className="text-xs">
									Quantity
								</Label>
								<Input
									id="material-lot-qty"
									type="number"
									min={1}
									step={1}
									value={materialQuantity}
									onChange={(event) =>
										setMaterialQuantity(
											Math.max(1, Number.parseInt(event.target.value, 10) || 1),
										)
									}
									className="h-8"
								/>
							</div>
							<Button
								size="sm"
								variant="outline"
								className="h-8 gap-2"
								onClick={handleCreateLot}
								disabled={
									!materialDefinitionId ||
									createLot.isPending ||
									materialQuantity <= 0
								}
							>
								<Plus className="h-3.5 w-3.5" /> Add lot
							</Button>
						</div>
					)}

					<div className="space-y-2">
						{lots.length === 0 ? (
							<span className="text-xs text-muted-foreground">
								No stored material lots
							</span>
						) : (
							lots.map((lot) => {
								const definition = definitionById.get(
									lot.material_definition_id,
								);
								const discovery = discoveryByLotId.get(lot.id);
								return (
									<div
										key={lot.id}
										className="rounded border border-border/40 bg-black/20 p-3"
									>
										<div className="flex flex-wrap items-start justify-between gap-2">
											<div>
												<div className="text-sm font-semibold">
													{definition?.name ?? lot.material_definition_id}
												</div>
												<div className="mt-1 flex flex-wrap gap-1.5">
													{definition?.family && (
														<Badge variant="secondary">
															{definition.family}
														</Badge>
													)}
													<Badge variant="outline">
														{lot.provenance_status}
													</Badge>
													{lot.grade && (
														<Badge variant="outline">Grade {lot.grade}</Badge>
													)}
													{discovery && (
														<Badge variant="outline">Discovered</Badge>
													)}
												</div>
											</div>
											<div className="flex items-center gap-1">
												<span className="min-w-16 text-right font-mono text-sm">
													{lot.quantity}{" "}
													{lot.unit ?? definition?.unit ?? "units"}
												</span>
												{!readOnly && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="h-7 w-7 p-0"
															disabled={
																adjustLot.isPending || lot.quantity <= 0
															}
															onClick={() =>
																handleAdjustLot(lot.id, lot.row_version, -1)
															}
															aria-label="Remove one from material lot"
														>
															<Minus className="h-3 w-3" />
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="h-7 w-7 p-0"
															disabled={adjustLot.isPending}
															onClick={() =>
																handleAdjustLot(lot.id, lot.row_version, 1)
															}
															aria-label="Add one to material lot"
														>
															<Plus className="h-3 w-3" />
														</Button>
													</>
												)}
											</div>
										</div>
										{lot.notes && (
											<p className="mt-2 text-xs text-muted-foreground">
												{lot.notes}
											</p>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>

				<div className="space-y-2 border-t border-border/40 pt-3">
					<div>
						<div className="text-xs uppercase text-muted-foreground">
							Lot-backed projects
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							Select exact lots, reserve them, complete the listed work, then
							resolve the server roll. Inputs are spent when work begins.
						</p>
					</div>
					<div className="flex flex-wrap items-end gap-2">
						<div className="flex-1 min-w-56">
							<Label className="text-xs">Executable formula</Label>
							<Select
								value={activeFormula?.id ?? ""}
								onValueChange={(value) => {
									setFormulaId(value);
									setSelectedInputLots({});
								}}
							>
								<SelectTrigger className="h-8 text-xs">
									<SelectValue placeholder="No executable formulas" />
								</SelectTrigger>
								<SelectContent>
									{craft.formulas.map((formula) => (
										<SelectItem key={formula.id} value={formula.id}>
											{formula.name} · {formula.work_minutes} min
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					{activeFormula && (
						<p className="text-xs text-muted-foreground">
							{activeFormula.discipline} · {activeFormula.ability} (
							{activeFormula.skill}) DC {activeFormula.dc} · Tool:{" "}
							{activeFormula.tool_names.join(" or ")}· Output:{" "}
							{activeFormula.output_quantity} servings
						</p>
					)}
					{!readOnly && activeFormula && (
						<div className="flex flex-wrap items-end gap-2">
							{formulaRequirements.map(([materialId, quantity]) => {
								const eligibleLots = lots.filter(
									(lot) =>
										lot.material_definition_id === materialId &&
										lot.quantity - (reservedByLotId.get(lot.id) ?? 0) >=
											quantity,
								);
								return (
									<div key={materialId} className="min-w-52 flex-1">
										<Label className="text-xs">
											{quantity} ×{" "}
											{definitionById.get(materialId)?.name ?? materialId}
										</Label>
										<Select
											value={selectedInputLots[materialId] ?? ""}
											onValueChange={(value) =>
												setSelectedInputLots((current) => ({
													...current,
													[materialId]: value,
												}))
											}
										>
											<SelectTrigger className="h-8 text-xs">
												<SelectValue placeholder="Select available lot" />
											</SelectTrigger>
											<SelectContent>
												{eligibleLots.map((lot) => (
													<SelectItem key={lot.id} value={lot.id}>
														{lot.quantity - (reservedByLotId.get(lot.id) ?? 0)}{" "}
														available · {lot.provenance_status}
														{lot.grade ? ` · ${lot.grade}` : ""}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								);
							})}
							<Button
								size="sm"
								variant="outline"
								className="h-8 gap-2"
								onClick={handleReserveProject}
								disabled={
									craft.isLoading ||
									craft.reserve.isPending ||
									!knownRecipeIds.has(activeFormula.recipe_id) ||
									!inputSelectionReady
								}
							>
								<Hammer className="w-3.5 h-3.5" /> Reserve
							</Button>
						</div>
					)}
					{activeFormula && !knownRecipeIds.has(activeFormula.recipe_id) && (
						<p className="text-xs text-muted-foreground">
							Learn this recipe before reserving its materials.
						</p>
					)}

					<div className="space-y-2">
						{craft.projects.map((project) => (
							<div
								key={project.id}
								className="rounded border border-border/40 bg-black/20 p-3"
							>
								<div className="flex flex-wrap items-center justify-between gap-2">
									<div>
										<div className="text-sm font-semibold">
											{String(
												project.formula_snapshot.name ?? project.formula_id,
											)}
										</div>
										<div className="text-xs text-muted-foreground">
											Revision {project.formula_revision} ·{" "}
											{project.work_minutes} /{" "}
											{String(project.formula_snapshot.workMinutes ?? "?")} min
										</div>
									</div>
									<Badge variant="outline">{project.status}</Badge>
								</div>
								{project.roll !== null && (
									<p className="mt-1 text-xs text-muted-foreground">
										Roll {project.roll} +{" "}
										{(project.ability_modifier ?? 0) +
											(project.proficiency_bonus ?? 0)}{" "}
										= {project.total} vs DC {project.dc}
									</p>
								)}
								{!readOnly &&
									(project.status === "reserved" ||
										project.status === "worked") && (
										<div className="mt-2 flex flex-wrap gap-2">
											{project.status === "reserved" && (
												<Button
													size="sm"
													variant="outline"
													disabled={craft.work.isPending}
													onClick={() =>
														craft.work.mutate({
															projectId: project.id,
															expectedVersion: project.row_version,
															operationId: craftOperationId("work"),
														})
													}
												>
													Complete work and spend inputs
												</Button>
											)}
											{project.status === "worked" && (
												<Button
													size="sm"
													variant="outline"
													disabled={craft.resolve.isPending}
													onClick={() =>
														craft.resolve.mutate({
															projectId: project.id,
															expectedVersion: project.row_version,
															operationId: craftOperationId("resolve"),
														})
													}
												>
													Resolve check
												</Button>
											)}
											<Button
												size="sm"
												variant="ghost"
												disabled={craft.cancel.isPending}
												onClick={() =>
													craft.cancel.mutate({
														projectId: project.id,
														expectedVersion: project.row_version,
														operationId: craftOperationId("cancel"),
													})
												}
											>
												Cancel{" "}
												{project.status === "worked"
													? "(inputs stay spent)"
													: "(release lots)"}
											</Button>
										</div>
									)}
							</div>
						))}
					</div>

					<div className="pt-2 text-xs uppercase text-muted-foreground">
						Legacy projects · descriptive history
					</div>

					<div className="space-y-2">
						{projects.length === 0 ? (
							<span className="text-xs text-muted-foreground">
								No legacy projects
							</span>
						) : (
							projects.map((project) => {
								const recipe = recipeById.get(project.recipe_id);
								const percent = Math.min(
									100,
									(project.progress / project.progress_required) * 100,
								);
								return (
									<div
										key={project.id}
										className="rounded border border-border/40 bg-black/20 p-3"
									>
										<div className="flex flex-wrap items-center justify-between gap-2">
											<div>
												<div className="font-semibold text-sm">
													{project.name ?? recipe?.name ?? project.recipe_id}
												</div>
												<div className="text-xs text-muted-foreground">
													{project.progress} / {project.progress_required}
												</div>
											</div>
											<Badge variant="outline">
												{statusLabel[project.status]}
											</Badge>
										</div>
										<Progress value={percent} className="mt-2 h-1.5" />
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</AscendantWindow>
	);
}
