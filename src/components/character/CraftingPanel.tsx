import { CheckCircle2, Hammer, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
import { useMaterialLots } from "@/hooks/useMaterialLots";

interface CraftingPanelProps {
	characterId: string;
	readOnly?: boolean;
}

const statusOptions: CraftingProjectStatus[] = [
	"active",
	"paused",
	"completed",
	"abandoned",
];

const statusLabel: Record<CraftingProjectStatus, string> = {
	active: "Active",
	paused: "Paused",
	completed: "Completed",
	abandoned: "Abandoned",
};

const operationId = (kind: string) =>
	`m1:${kind}:${globalThis.crypto.randomUUID()}`;

export function CraftingPanel({ characterId, readOnly }: CraftingPanelProps) {
	const {
		knownRecipes,
		projects,
		learnRecipe,
		startProject,
		advanceProject,
		setProjectStatus,
		deleteProject,
	} = useCrafting(characterId);
	const {
		definitions,
		lots,
		discoveries,
		createLot,
		adjustLot,
	} = useMaterialLots(characterId);
	const [recipeToLearn, setRecipeToLearn] = useState("");
	const [materialDefinitionId, setMaterialDefinitionId] = useState("");
	const [materialQuantity, setMaterialQuantity] = useState(1);
	const [projectRecipeId, setProjectRecipeId] = useState(
		craftingRecipes[0]?.id ?? "",
	);

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
		() => new Map(discoveries.map((discovery) => [discovery.lot_id, discovery])),
		[discoveries],
	);
	const learnableRecipes = craftingRecipes.filter(
		(recipe) => !knownRecipeIds.has(recipe.id),
	);

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

	const handleStartProject = () => {
		const recipe = recipeById.get(projectRecipeId);
		if (!recipe) return;
		startProject.mutate({
			recipeId: recipe.id,
			name: recipe.name,
			progressRequired: recipe.project_clock,
			materialsCommitted: recipe.materials,
		});
	};

	return (
		<AscendantWindow title="CRAFTING">
			<div className="space-y-4">
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
					<div>
						<div className="text-xs uppercase text-muted-foreground">
							Material Lots
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							Each lot keeps its own provenance, unit, grade, notes, and discovery metadata.
						</p>
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
									!materialDefinitionId || createLot.isPending || materialQuantity <= 0
								}
							>
								<Plus className="h-3.5 w-3.5" /> Add lot
							</Button>
						</div>
					)}

					<div className="space-y-2">
						{lots.length === 0 ? (
							<span className="text-xs text-muted-foreground">No stored material lots</span>
						) : (
							lots.map((lot) => {
								const definition = definitionById.get(lot.material_definition_id);
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
														<Badge variant="secondary">{definition.family}</Badge>
													)}
													<Badge variant="outline">{lot.provenance_status}</Badge>
													{lot.grade && <Badge variant="outline">Grade {lot.grade}</Badge>}
													{discovery && <Badge variant="outline">Discovered</Badge>}
												</div>
											</div>
											<div className="flex items-center gap-1">
												<span className="min-w-16 text-right font-mono text-sm">
													{lot.quantity} {lot.unit ?? definition?.unit ?? "units"}
												</span>
												{!readOnly && (
													<>
														<Button
															size="sm"
															variant="outline"
															className="h-7 w-7 p-0"
															disabled={adjustLot.isPending || lot.quantity <= 0}
															onClick={() => handleAdjustLot(lot.id, lot.row_version, -1)}
															aria-label="Remove one from material lot"
														>
															<Minus className="h-3 w-3" />
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="h-7 w-7 p-0"
															disabled={adjustLot.isPending}
															onClick={() => handleAdjustLot(lot.id, lot.row_version, 1)}
															aria-label="Add one to material lot"
														>
															<Plus className="h-3 w-3" />
														</Button>
													</>
												)}
											</div>
										</div>
										{lot.notes && (
											<p className="mt-2 text-xs text-muted-foreground">{lot.notes}</p>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>

				<div className="space-y-2 border-t border-border/40 pt-3">
					<div className="flex flex-wrap items-end gap-2">
						<div className="flex-1 min-w-56">
							<Label className="text-xs">Project Recipe</Label>
							<Select value={projectRecipeId} onValueChange={setProjectRecipeId}>
								<SelectTrigger className="h-8 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{craftingRecipes.map((recipe) => (
										<SelectItem key={recipe.id} value={recipe.id}>
											{recipe.name} ({recipe.project_clock})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{!readOnly && (
							<Button
								size="sm"
								variant="outline"
								className="h-8 gap-2"
								onClick={handleStartProject}
								disabled={!projectRecipeId || startProject.isPending}
							>
								<Hammer className="w-3.5 h-3.5" /> Start
							</Button>
						)}
					</div>

					<div className="space-y-2">
						{projects.length === 0 ? (
							<span className="text-xs text-muted-foreground">No crafting projects</span>
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
											<div className="flex items-center gap-2">
												<Badge variant="outline">{statusLabel[project.status]}</Badge>
												{!readOnly && (
													<Button
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0 text-destructive hover:text-destructive"
														onClick={() => deleteProject.mutate({ projectId: project.id })}
														aria-label="Delete project"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												)}
											</div>
										</div>
										<Progress value={percent} className="mt-2 h-1.5" />
										{!readOnly && (
											<div className="mt-2 flex flex-wrap items-center gap-2">
												<Button
													size="sm"
													variant="outline"
													className="h-7 w-7 p-0"
													onClick={() =>
														advanceProject.mutate({ projectId: project.id, delta: -1 })
													}
													disabled={project.progress <= 0}
													aria-label="Reduce project progress"
												>
													<Minus className="w-3 h-3" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="h-7 w-7 p-0"
													onClick={() =>
														advanceProject.mutate({ projectId: project.id, delta: 1 })
													}
													disabled={project.status === "completed"}
													aria-label="Advance project progress"
												>
													<Plus className="w-3 h-3" />
												</Button>
												<Select
													value={project.status}
													onValueChange={(value) =>
														setProjectStatus.mutate({
															projectId: project.id,
															status: value as CraftingProjectStatus,
														})
													}
												>
													<SelectTrigger className="h-7 w-32 text-xs">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{statusOptions.map((status) => (
															<SelectItem key={status} value={status}>
																{statusLabel[status]}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
										)}
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
