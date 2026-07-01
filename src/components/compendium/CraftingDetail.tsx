import { Hammer, Package, ScrollText } from "lucide-react";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { craftingMaterials } from "@/data/compendium/crafting";
import { formatRaCurrencyAmount, type RaCurrencyId } from "@/lib/currency";
import { formatRegentVernacular } from "@/lib/vernacular";
import type {
	CompendiumCraftingMaterial,
	CompendiumCraftingProject,
	CompendiumRecipe,
} from "@/types/compendium";

export type CraftingData = (
	| CompendiumCraftingMaterial
	| CompendiumRecipe
	| CompendiumCraftingProject
) & {
	crafting_type?: string | null;
	material_type?: string | null;
	recipe_type?: string | null;
	time_required?: string | null;
	project_clock?: number | null;
	materials?: Array<{ material_id: string; quantity: number }> | null;
	required_tools?: string[] | null;
	outcome?: string | null;
	failure_risk?: string | null;
	unit?: string | null;
	progress_required?: number | null;
	material_requirements?: Array<{
		material_id: string;
		quantity: number;
	}> | null;
	recipe_id?: string | null;
	rank?: string | null;
	rarity?: string | null;
	// Guild-base salvage materials (folded into Crafting) carry where they are
	// recovered, what the forge uses them for, and a market value.
	source?: string | null;
	uses?: string | null;
	cost?: { currency: RaCurrencyId; amount: number } | null;
};

const materialNameById = new Map(
	craftingMaterials.map((material) => [material.id, material.name]),
);

const humanize = (value: string | null | undefined) =>
	value ? value.replace(/_/g, " ") : null;

export function CraftingDetail({ data }: { data: CraftingData }) {
	const displayName = formatRegentVernacular(data.display_name || data.name);
	const craftingType =
		data.crafting_type ??
		("recipe_type" in data
			? "recipe"
			: "material_type" in data
				? "material"
				: "project");
	const requirements = data.materials ?? data.material_requirements ?? [];

	return (
		<div className="space-y-6">
			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">{humanize(craftingType)}</Badge>
						{data.rank && <Badge variant="outline">Rank {data.rank}</Badge>}
						{data.rarity && <Badge variant="outline">{data.rarity}</Badge>}
						{data.cost && (
							<Badge variant="outline" className="text-primary">
								{formatRaCurrencyAmount(data.cost.amount, data.cost.currency)}
							</Badge>
						)}
						{data.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(data.source_book)}
							</Badge>
						)}
					</div>
					{data.description && (
						<p className="text-muted-foreground leading-relaxed">
							<AutoLinkText text={formatRegentVernacular(data.description)} />
						</p>
					)}
				</div>
			</AscendantWindow>

			{craftingType === "material" && (
				<AscendantWindow title="MATERIAL DETAILS">
					<span id="crafting-details" className="scroll-mt-4" />
					<div className="grid gap-3 sm:grid-cols-3">
						<div>
							<div className="text-xs uppercase text-muted-foreground">
								Type
							</div>
							<div className="font-semibold">
								{humanize(data.material_type) ?? "Material"}
							</div>
						</div>
						<div>
							<div className="text-xs uppercase text-muted-foreground">
								Rarity
							</div>
							<div className="font-semibold">{data.rarity ?? "common"}</div>
						</div>
						<div>
							<div className="text-xs uppercase text-muted-foreground">
								Unit
							</div>
							<div className="font-semibold">{data.unit ?? "unit"}</div>
						</div>
						{data.cost && (
							<div>
								<div className="text-xs uppercase text-muted-foreground">
									Value
								</div>
								<div className="font-semibold">
									{formatRaCurrencyAmount(data.cost.amount, data.cost.currency)}
								</div>
							</div>
						)}
					</div>
					{(data.source || data.uses) && (
						<div className="mt-3 space-y-2 text-sm">
							{data.source && (
								<p>
									<span className="text-xs uppercase text-muted-foreground">
										Recovered From:{" "}
									</span>
									{data.source}
								</p>
							)}
							{data.uses && (
								<p>
									<span className="text-xs uppercase text-muted-foreground">
										Used For:{" "}
									</span>
									{data.uses}
								</p>
							)}
						</div>
					)}
				</AscendantWindow>
			)}

			{craftingType === "recipe" && (
				<>
					<AscendantWindow title="RECIPE">
						<span id="crafting-details" className="scroll-mt-4" />
						<div className="grid gap-3 sm:grid-cols-3">
							<div className="flex items-center gap-2">
								<ScrollText className="w-4 h-4 text-primary" />
								<span className="text-sm">
									{humanize(data.recipe_type) ?? "Recipe"}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Hammer className="w-4 h-4 text-primary" />
								<span className="text-sm">
									{data.time_required ?? "Varies"}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Package className="w-4 h-4 text-primary" />
								<span className="text-sm">Clock {data.project_clock ?? 1}</span>
							</div>
						</div>
					</AscendantWindow>

					<AscendantWindow title="MATERIALS & TOOLS">
						<span id="crafting-materials" className="scroll-mt-4" />
						<div className="space-y-3">
							<div className="flex flex-wrap gap-2">
								{requirements.map((requirement) => (
									<Badge
										key={requirement.material_id}
										variant="outline"
										className="text-xs"
									>
										{materialNameById.get(requirement.material_id) ??
											requirement.material_id}{" "}
										x{requirement.quantity}
									</Badge>
								))}
							</div>
							{data.required_tools && data.required_tools.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{data.required_tools.map((tool) => (
										<Badge key={tool} variant="secondary" className="text-xs">
											{tool}
										</Badge>
									))}
								</div>
							)}
						</div>
					</AscendantWindow>

					<AscendantWindow title="OUTCOME">
						<span id="crafting-outcome" className="scroll-mt-4" />
						<div className="space-y-3 text-sm text-muted-foreground">
							{data.outcome && <AutoLinkText text={data.outcome} />}
							{data.failure_risk && (
								<p>
									<span className="text-amber-300">Risk: </span>
									<AutoLinkText text={data.failure_risk} />
								</p>
							)}
						</div>
					</AscendantWindow>
				</>
			)}

			{craftingType === "project" && (
				<AscendantWindow title="PROJECT TEMPLATE">
					<span id="crafting-details" className="scroll-mt-4" />
					<div className="space-y-3">
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline">
								Clock {data.progress_required ?? data.project_clock ?? 1}
							</Badge>
							{data.recipe_id && (
								<Badge variant="outline">Recipe {data.recipe_id}</Badge>
							)}
						</div>
						<div className="flex flex-wrap gap-2">
							<span id="crafting-materials" className="scroll-mt-4" />
							{requirements.map((requirement) => (
								<Badge
									key={requirement.material_id}
									variant="secondary"
									className="text-xs"
								>
									{materialNameById.get(requirement.material_id) ??
										requirement.material_id}{" "}
									x{requirement.quantity}
								</Badge>
							))}
						</div>
					</div>
				</AscendantWindow>
			)}
		</div>
	);
}
