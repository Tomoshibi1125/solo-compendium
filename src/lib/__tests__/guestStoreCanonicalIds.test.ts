import { beforeEach, describe, expect, it } from "vitest";
import {
	addLocalEquipment,
	addLocalFeature,
	addLocalPower,
	addLocalSigilInscription,
	addLocalSpell,
	createLocalCharacter,
	listLocalEquipment,
	listLocalFeatures,
	listLocalPowers,
	listLocalSigilInscriptions,
	listLocalSpells,
	removeLocalSigilInscription,
	updateLocalCharacter,
} from "@/lib/guestStore";

function clearGuestState() {
	if (typeof window !== "undefined" && window.localStorage) {
		window.localStorage.clear();
	}
}

describe("guestStore canonical ID parity", () => {
	beforeEach(() => {
		clearGuestState();
	});

	it("createLocalCharacter persists provided canonical IDs", () => {
		const character = createLocalCharacter({
			name: "Test",
			job: "Destroyer",
			job_id: "destroyer",
			path: "Path of the Apex Predator",
			path_id: "destroyer--apex-predator",
			background: "Rift-Displaced Contractor",
			background_id: "b-01",
		});

		expect(character.job).toBe("Destroyer");
		expect(character.job_id).toBe("destroyer");
		expect(character.path_id).toBe("destroyer--apex-predator");
		expect(character.background_id).toBe("b-01");
	});

	it("createLocalCharacter null-coalesces missing canonical IDs", () => {
		const character = createLocalCharacter({
			name: "No Canonical IDs",
			job: "Destroyer",
		});

		expect(character.job).toBe("Destroyer");
		expect(character.job_id).toBeNull();
		expect(character.path_id).toBeNull();
		expect(character.background_id).toBeNull();
	});

	it("updateLocalCharacter preserves canonical IDs through partial updates", () => {
		const character = createLocalCharacter({
			name: "Partial Update",
			job: "Destroyer",
			job_id: "destroyer",
		});

		const updated = updateLocalCharacter(character.id, {
			name: "Renamed",
		});

		expect(updated?.name).toBe("Renamed");
		expect(updated?.job).toBe("Destroyer");
		expect(updated?.job_id).toBe("destroyer");
	});

	it("updateLocalCharacter applies new canonical IDs when provided", () => {
		const character = createLocalCharacter({
			name: "Reroute",
			job: "Destroyer",
			job_id: "destroyer",
		});

		const updated = updateLocalCharacter(character.id, {
			job: "Mage",
			job_id: "mage",
		});

		expect(updated?.job).toBe("Mage");
		expect(updated?.job_id).toBe("mage");
	});

	it("addLocalPower writes power_id when supplied", () => {
		const character = createLocalCharacter({ name: "Power Holder" });
		addLocalPower(character.id, {
			name: "Shadow Step",
			power_id: "shadow-step",
			power_level: 3,
			source: "Test",
		});

		const powers = listLocalPowers(character.id);
		expect(powers).toHaveLength(1);
		expect(powers[0]).toMatchObject({
			name: "Shadow Step",
			power_id: "shadow-step",
		});
	});

	it("addLocalSpell writes spell_id when supplied", () => {
		const character = createLocalCharacter({ name: "Spell Holder" });
		addLocalSpell(character.id, {
			name: "Chill Lance",
			spell_id: "spell-d-1",
			spell_level: 0,
			source: "Test",
		});

		const spells = listLocalSpells(character.id);
		expect(spells).toHaveLength(1);
		expect(spells[0]).toMatchObject({
			name: "Chill Lance",
			spell_id: "spell-d-1",
		});
	});

	it("addLocalEquipment writes item_id when supplied", () => {
		const character = createLocalCharacter({ name: "Gear Holder" });
		addLocalEquipment(character.id, {
			name: "Padded Armor",
			item_id: "base-armor-padded",
			item_type: "armor",
		});

		const equipment = listLocalEquipment(character.id);
		expect(equipment).toHaveLength(1);
		expect(equipment[0]).toMatchObject({
			name: "Padded Armor",
			item_id: "base-armor-padded",
		});
	});

	it("addLocalFeature writes feat_id and feature_id when supplied", () => {
		const character = createLocalCharacter({ name: "Feat Holder" });
		addLocalFeature(character.id, {
			name: "Shadow Attunement",
			source: "Feat: Shadow Attunement",
			feat_id: "shadow-attunement",
			feature_id: null,
		});

		const features = listLocalFeatures(character.id);
		expect(features).toHaveLength(1);
		expect(features[0]).toMatchObject({
			name: "Shadow Attunement",
			feat_id: "shadow-attunement",
			feature_id: null,
		});
	});

	it("addLocalFeature null-coalesces missing canonical IDs", () => {
		const character = createLocalCharacter({ name: "Custom Feature" });
		addLocalFeature(character.id, {
			name: "Custom Trick",
			source: "Homebrew",
		});

		const features = listLocalFeatures(character.id);
		expect(features).toHaveLength(1);
		expect(features[0].feat_id).toBeNull();
		expect(features[0].feature_id).toBeNull();
	});

	it("addLocalSigilInscription writes canonical sigil IDs", () => {
		const character = createLocalCharacter({ name: "Sigil Holder" });
		const equipment = addLocalEquipment(character.id, {
			name: "Padded Armor",
			item_id: "base-armor-padded",
			item_type: "armor",
		});

		addLocalSigilInscription(character.id, {
			equipment_id: equipment.id,
			sigil_id: "sigil-res-fire-2",
			slot_index: 1,
			is_active: true,
		});

		const inscriptions = listLocalSigilInscriptions(character.id);
		expect(inscriptions).toHaveLength(1);
		expect(inscriptions[0]).toMatchObject({
			equipment_id: equipment.id,
			sigil_id: "sigil-res-fire-2",
			slot_index: 1,
			is_active: true,
		});
	});

	it("removeLocalSigilInscription deletes local sigil rows", () => {
		const character = createLocalCharacter({ name: "Sigil Remover" });
		const equipment = addLocalEquipment(character.id, {
			name: "Padded Armor",
			item_id: "base-armor-padded",
			item_type: "armor",
		});
		const inscription = addLocalSigilInscription(character.id, {
			equipment_id: equipment.id,
			sigil_id: "sigil-res-fire-2",
			slot_index: 0,
			is_active: true,
		});

		removeLocalSigilInscription(inscription.id);

		expect(listLocalSigilInscriptions(character.id)).toHaveLength(0);
	});
});
