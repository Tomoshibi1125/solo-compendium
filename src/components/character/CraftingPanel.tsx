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
import { craftingMaterials, craftingRecipes } from "@/data/compendium/crafting";
import { type CraftingProjectStatus, useCrafting } from "@/hooks/useCrafting";

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

export function CraftingPanel({ characterId, readOnly }: CraftingPanelProps) {
	const {
		knownRecipes,
		materials,
		projects,
		learnRecipe,
		adjustMaterial,
		startProject,
		advanceProject,
		setProjectStatus,
		deleteProject,
	} = useCrafting(characterId);
	const [recipeToLearn, setRecipeToLearn] = useState("");
	const [materialId, setMaterialId] = useState(craftingMaterials[0]?.id ?? "");
	const [materialDelta, setMaterialDelta] = useState(1);
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
	const materialById = useMemo(
		() => new Map(craftingMaterials.map((material) => [material.id, material])),
		[],
	);
	const learnableRecipes = craftingRecipes.filter(
		(recipe) => !knownRecipeIds.has(recipe.id),
	);

	const handleLearnRecipe = () => {
		if (!recipeToLearn) return;
		learnRecipe.mutate({ recipeId: recipeToLearn });
		setRecipeToLearn("");
	};

	const handleAdjustMaterial = (direction: 1 | -1) => {
		if (!materialId || materialDelta <= 0) return;
		adjustMaterial.mutate({
			materialId,
			delta: materialDelta * direction,
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
							knownRecipes.map((known) => {
								const recipe = recipeById.get(known.recipe_id);
								return (
									<Badge key={known.id} variant="secondary">
										{recipe?.name ?? known.recipe_id}
									</Badge>
								);
							})
						)}
					</div>
				</div>

				<div className="space-y-2 border-t border-border/40 pt-3">
					<div className="flex flex-wrap items-end gap-2">
						<div className="flex-1 min-w-44">
							<Label className="text-xs">Material</Label>
							<Select value={materialId} onValueChange={setMaterialId}>
								<SelectTrigger className="h-8 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{craftingMaterials.map((material) => (
										<SelectItem key={material.id} value={material.id}>
											{material.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="w-24">
							<Label htmlFor="crafting-material-qty" className="text-xs">
								Amount
							</Label>
							<Input
								id="crafting-material-qty"
								type="number"
								min={1}
								value={materialDelta}
								onChange={(event) =>
									setMaterialDelta(
										Math.max(1, Number.parseInt(event.target.value, 10) || 1),
									)
								}
								className="h-8"
								disabled={readOnly}
							/>
						</div>
						{!readOnly && (
							<div className="flex gap-1">
								<Button
									size="sm"
									variant="outline"
									className="h-8 w-8 p-0"
									onClick={() => handleAdjustMaterial(-1)}
									disabled={adjustMaterial.isPending}
									aria-label="Remove material"
								>
									<Minus className="w-3.5 h-3.5" />
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="h-8 w-8 p-0"
									onClick={() => handleAdjustMaterial(1)}
									disabled={adjustMaterial.isPending}
									aria-label="Add material"
								>
									<Plus className="w-3.5 h-3.5" />
								</Button>
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-1.5">
						{materials.length === 0 ? (
							<span className="text-xs text-muted-foreground">
								No stored materials
							</span>
						) : (
							materials.map((row) => {
								const material = materialById.get(row.material_id);
								return (
									<Badge key={row.id} variant="outline">
										{material?.name ?? row.material_id}: {row.quantity}{" "}
										{material?.unit ?? "units"}
									</Badge>
								);
							})
						)}
					</div>
				</div>

				<div className="space-y-2 border-t border-border/40 pt-3">
					<div className="flex flex-wrap items-end gap-2">
						<div className="flex-1 min-w-56">
							<Label className="text-xs">Project Recipe</Label>
							<Select
								value={projectRecipeId}
								onValueChange={setProjectRecipeId}
							>
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
								<Hammer className="w-3.5 h-3.5" />
								Start
							</Button>
						)}
					</div>

					<div className="space-y-2">
						{projects.length === 0 ? (
							<span className="text-xs text-muted-foreground">
								No crafting projects
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
											<div className="flex items-center gap-2">
												<Badge variant="outline">
													{statusLabel[project.status]}
												</Badge>
												{!readOnly && (
													<Button
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0 text-destructive hover:text-destructive"
														onClick={() =>
															deleteProject.mutate({ projectId: project.id })
														}
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
														advanceProject.mutate({
															projectId: project.id,
															delta: -1,
														})
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
														advanceProject.mutate({
															projectId: project.id,
															delta: 1,
														})
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
