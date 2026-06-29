import { describe, expect, it } from "vitest";
import {
	allCraftingEntries,
	craftingMaterials,
	craftingProjects,
	craftingRecipes,
} from "@/data/compendium/crafting";
import { allVehicleMods } from "@/data/compendium/vehicleMods";
import { allVehicles } from "@/data/compendium/vehicles";

const RA_SOURCE = "Rift Ascendant Canon";
const RUN_SILENT_ONLY_TERMS = [
	/Gloamreach/i,
	/\bthe Quiet\b/i,
	/Hunt Clock/i,
	/named merchants?/i,
	/first-entry/i,
];

describe("P4 vehicle mods and crafting data", () => {
	it("vehicles expose requisition and condition metadata", () => {
		const missing = allVehicles
			.filter(
				(vehicle) =>
					typeof vehicle.vrp_cost !== "number" ||
					typeof vehicle.mod_capacity !== "number" ||
					!vehicle.condition_track ||
					(vehicle.allowed_mod_categories?.length ?? 0) === 0,
			)
			.map((vehicle) => vehicle.id);

		expect(missing).toEqual([]);
	});

	it("vehicle and mount mods are canonical, compatible, and spendable", () => {
		const vehicleCategories = new Set(
			allVehicles
				.filter((vehicle) => vehicle.vehicle_type !== "mount")
				.flatMap((vehicle) => vehicle.allowed_mod_categories ?? []),
		);
		const mountCategories = new Set(
			allVehicles
				.filter((vehicle) => vehicle.vehicle_type === "mount")
				.flatMap((vehicle) => vehicle.allowed_mod_categories ?? []),
		);

		const invalid = allVehicleMods
			.filter((mod) => {
				const categories =
					mod.mod_type === "mount" ? mountCategories : vehicleCategories;
				return (
					mod.source_book !== RA_SOURCE ||
					mod.vrp_cost < 0 ||
					mod.capacity_cost < 1 ||
					!categories.has(mod.category)
				);
			})
			.map((mod) => mod.id);

		expect(invalid).toEqual([]);
	});

	it("crafting recipes and projects reference real materials", () => {
		const materialIds = new Set(
			craftingMaterials.map((material) => material.id),
		);
		const brokenRecipes = craftingRecipes
			.filter(
				(recipe) =>
					recipe.source_book !== RA_SOURCE ||
					(recipe.materials?.length ?? 0) === 0 ||
					(recipe.project_clock ?? 0) < 1 ||
					recipe.materials?.some(
						(material) =>
							!materialIds.has(material.material_id) || material.quantity < 1,
					),
			)
			.map((recipe) => recipe.id);

		const brokenProjects = craftingProjects
			.filter(
				(project) =>
					project.source_book !== RA_SOURCE ||
					!craftingRecipes.some((recipe) => recipe.id === project.recipe_id) ||
					(project.progress_required ?? 0) < 1,
			)
			.map((project) => project.id);

		expect(brokenRecipes).toEqual([]);
		expect(brokenProjects).toEqual([]);
		expect(allCraftingEntries).toHaveLength(
			craftingMaterials.length +
				craftingRecipes.length +
				craftingProjects.length,
		);
	});

	it("P4 core data excludes Run Silent-only terms", () => {
		const payload = JSON.stringify({
			vehicles: allVehicles,
			mods: allVehicleMods,
			crafting: allCraftingEntries,
		});

		const offenders = RUN_SILENT_ONLY_TERMS.filter((term) =>
			term.test(payload),
		);

		expect(offenders.map(String)).toEqual([]);
	});
});
