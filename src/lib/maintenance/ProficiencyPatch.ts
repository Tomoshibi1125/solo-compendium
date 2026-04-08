import { supabase } from "@/integrations/supabase/client";
import { getStaticJobs } from "@/lib/ProtocolDataManager";
import type { StaticJob } from "@/types/character";

/**
 * Protocol: Proficiency Synchronization Patch
 *
 * Target: Existing characters with NULL weapon_proficiencies or armor_proficiencies.
 * Action: Hydrate missing fields from the authoritative Job (Class) definitions.
 */
export const runProficiencyPatch = async () => {
	console.log("[Maintenance] Starting Proficiency Synchronization Patch...");

	const { data: characters, error } = await supabase
		.from("characters")
		.select("id, job, weapon_proficiencies, armor_proficiencies");

	if (error) {
		console.error(
			"[Maintenance] Patch aborted: Failed to fetch characters.",
			error,
		);
		return;
	}

	const updates = [];

	for (const char of characters) {
		if (!char.job) continue;

		const needsWeapon = !char.weapon_proficiencies;
		const needsArmor = !char.armor_proficiencies;

		if (needsWeapon || needsArmor) {
			const jobData = (getStaticJobs() as unknown as StaticJob[]).find(
				(j) => j.name === char.job,
			);

			if (jobData) {
				console.log(
					`[Maintenance] Patching character ${char.id} (${char.job})`,
				);
				const weaponProfs =
					jobData.weaponProficiencies || jobData.weapon_proficiencies || [];
				const armorProfs =
					jobData.armorProficiencies || jobData.armor_proficiencies || [];

				updates.push(
					supabase
						.from("characters")
						.update({
							weapon_proficiencies: needsWeapon
								? weaponProfs
								: char.weapon_proficiencies,
							armor_proficiencies: needsArmor
								? armorProfs
								: char.armor_proficiencies,
						})
						.eq("id", char.id),
				);
			}
		}
	}

	if (updates.length > 0) {
		const results = await Promise.all(updates);
		const failures = results.filter((r) => r.error);
		if (failures.length > 0) {
			console.error(
				`[Maintenance] Patch completed with ${failures.length} failures.`,
			);
		} else {
			console.log(
				`[Maintenance] Patch complete. Synced ${updates.length} characters.`,
			);
		}
	} else {
		console.log("[Maintenance] No synchronization required.");
	}
};
