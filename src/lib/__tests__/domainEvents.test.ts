import { beforeEach, describe, expect, it } from "vitest";
import {
	buildCorePayload,
	type CharacterLevelUpEvent,
	type CharacterSaveEvent,
	type CombatAttackEvent,
	type DomainEvent,
	DomainEventBus,
	type EncounterCreateEvent,
	type ItemAttuneEvent,
	type RestLongEvent,
	type RestShortEvent,
	type SpellCastEvent,
} from "@/lib/domainEvents";

beforeEach(() => {
	DomainEventBus.clear();
});

describe("buildCorePayload", () => {
	it("returns defaults with required fields", () => {
		const payload = buildCorePayload({
			characterId: "c1",
			characterName: "Test",
		});
		expect(payload.characterId).toBe("c1");
		expect(payload.characterName).toBe("Test");
		expect(payload.classId).toBeNull();
		expect(payload.geminiState.isActive).toBe(false);
		expect(payload.regents).toEqual([]);
		expect(payload.activeEffects).toEqual([]);
		expect(payload.timestamp).toBeTruthy();
	});

	it("allows overrides", () => {
		const payload = buildCorePayload({
			characterId: "c1",
			characterName: "Test",
			classId: "j1",
			className: "Mage",
			level: 5,
		});
		expect(payload.classId).toBe("j1");
		expect(payload.className).toBe("Mage");
		expect(payload.level).toBe(5);
	});
});

describe("DomainEventBus", () => {
	it("delivers events to typed handlers", () => {
		const received: CharacterSaveEvent[] = [];
		DomainEventBus.on<CharacterSaveEvent>("character:save", (e) =>
			received.push(e),
		);

		const event: CharacterSaveEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "Test" }),
			type: "character:save",
			changedFields: ["level", "hp_max"],
		};

		DomainEventBus.emit(event);
		expect(received).toHaveLength(1);
		expect(received[0].changedFields).toContain("level");
	});

	it("does not deliver events to wrong type handlers", () => {
		const received: SpellCastEvent[] = [];
		DomainEventBus.on<SpellCastEvent>("spell:cast", (e) => received.push(e));

		const event: CharacterSaveEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "Test" }),
			type: "character:save",
			changedFields: [],
		};

		DomainEventBus.emit(event);
		expect(received).toHaveLength(0);
	});

	it("wildcard listeners receive all events", () => {
		const received: DomainEvent[] = [];
		DomainEventBus.onAny((e) => received.push(e));

		const save: CharacterSaveEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "character:save",
			changedFields: [],
		};

		const rest: RestShortEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "rest:short",
			hitDiceSpent: 1,
			hpRecovered: 5,
			featuresRecharged: [],
			slotsRecovered: [],
		};

		DomainEventBus.emit(save);
		DomainEventBus.emit(rest);
		expect(received).toHaveLength(2);
	});

	it("off removes a handler", () => {
		const received: DomainEvent[] = [];
		const handler = (e: DomainEvent) => received.push(e);
		DomainEventBus.on("character:save", handler);

		DomainEventBus.emit({
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "character:save",
			changedFields: [],
		} as CharacterSaveEvent);

		expect(received).toHaveLength(1);

		DomainEventBus.off("character:save", handler);

		DomainEventBus.emit({
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "character:save",
			changedFields: [],
		} as CharacterSaveEvent);

		expect(received).toHaveLength(1); // still 1
	});

	it("handler errors do not break other handlers", () => {
		const received: string[] = [];
		DomainEventBus.on("character:save", () => {
			throw new Error("Boom");
		});
		DomainEventBus.on("character:save", () => {
			received.push("ok");
		});

		DomainEventBus.emit({
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "character:save",
			changedFields: [],
		} as CharacterSaveEvent);

		expect(received).toEqual(["ok"]);
	});
});

describe("Event payload contracts", () => {
	it("CharacterLevelUpEvent has required fields", () => {
		const event: CharacterLevelUpEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T", level: 5 }),
			type: "character:levelup",
			previousLevel: 4,
			newLevel: 5,
			hpIncrease: 8,
			newFeatures: ["Extra Attack"],
			isPathUnlockLevel: false,
			isASILevel: true,
		};
		expect(event.type).toBe("character:levelup");
		expect(event.previousLevel).toBe(4);
		expect(event.newLevel).toBe(5);
		expect(event.geminiState).toBeDefined();
		expect(event.regents).toBeDefined();
	});

	it("SpellCastEvent has required fields", () => {
		const event: SpellCastEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "spell:cast",
			spellName: "Fireball",
			spellLevel: 3,
			castAtLevel: 3,
			slotExpended: true,
			isRitual: false,
			isConcentration: false,
		};
		expect(event.spellLevel).toBe(3);
		expect(event.classId).toBeNull();
	});

	it("CombatAttackEvent has required fields", () => {
		const event: CombatAttackEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "combat:attack",
			attackName: "Longsword",
			attackRoll: 18,
			damageRoll: 12,
			damageType: "slashing",
			isHit: true,
			isCritical: false,
			targetName: "Goblin",
			advantageState: "normal",
		};
		expect(event.attackRoll).toBe(18);
	});

	it("RestLongEvent has required fields", () => {
		const event: RestLongEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "rest:long",
			hpRecovered: 20,
			hitDiceRecovered: 3,
			featuresRecharged: ["Action Surge"],
			slotsRecovered: [1, 2, 3],
			exhaustionReduced: true,
			conditionsCleared: ["Frightened"],
		};
		expect(event.exhaustionReduced).toBe(true);
	});

	it("ItemAttuneEvent has required fields", () => {
		const event: ItemAttuneEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "item:attune",
			itemId: "i1",
			itemName: "Sword of Kas",
			action: "attune",
			currentAttunementCount: 2,
			maxAttunementSlots: 3,
		};
		expect(event.action).toBe("attune");
		expect(event.maxAttunementSlots).toBe(3);
	});

	it("EncounterCreateEvent has required fields", () => {
		const event: EncounterCreateEvent = {
			...buildCorePayload({ characterId: "c1", characterName: "T" }),
			type: "encounter:create",
			encounterId: "enc1",
			encounterName: "Goblin Ambush",
			monsterCount: 4,
			totalXP: 400,
			difficulty: "Medium",
		};
		expect(event.monsterCount).toBe(4);
	});
});
