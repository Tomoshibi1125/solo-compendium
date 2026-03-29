// Items Part 6

export const items = [
	{
		id: "sys-exp-item-0001",
		name: "Luminous Bow of the Stars",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 8,
		value: 94,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignites the dimensional divide. A triumphant symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0002",
		name: "Shadow Whip of Blood",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20035,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor: "Denies the darkness within. An ancient ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0003",
		name: "Monarch's Amulet of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 1,
		value: 254,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Overrides the fragile limits of flesh. A relentless breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0004",
		name: "System Greaves of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 9,
		value: 20035,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Destroys the fragile limits of flesh. A sorrowful breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0005",
		name: "Chaos Scythe of the Phoenix",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 20007,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power leaves temporal scars on reality.",
		flavor: "Bends the architect's design. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0006",
		name: "Astral Lens of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 8,
		value: 20023,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Shatters the arrogant and the mighty. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0007",
		name: "Dread Amulet of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1009,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Destroys the fragile limits of flesh. A triumphant ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0008",
		name: "Astral Gauntlets of Blood",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5099,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Overrides the arrogant and the mighty. A relentless beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0009",
		name: "Echo Amulet of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 5020,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0010",
		name: "Void Tome of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 4,
		value: 1041,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by the Architect's rogue subroutines. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Absorbs the concept of defeat. A brutal dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0011",
		name: "Aether Necklace of the Monarch",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 90,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Commands the remnants of humanity. A forbidden surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0012",
		name: "Astral Scythe of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 20075,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Reflects the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0013",
		name: "Echo Gauntlets of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: false,
		weight: 7,
		value: 1046,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Denies the dimensional divide. A chaotic testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0014",
		name: "Gate Hammer of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 6,
		value: 5078,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Manifestation Event, this power forces agonizing metabolic sacrifice to maintain.",
		flavor: "Destroys the architect's design. A desperate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0015",
		name: "Void Whip of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 8,
		value: 284,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Weaves the concept of defeat. A relentless surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0016",
		name: "Sovereign Prism of Annihilation",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 294,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Mana Awakening, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignores the arrogant and the mighty. An absolute whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0017",
		name: "Blood Bow of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 3,
		value: 1018,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Cleanses the arrogant and the mighty. A forbidden beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0018",
		name: "Null Grimoire of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 8,
		value: 1045,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0019",
		name: "System Bow of the Angel",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 264,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Denies the quiet space between breaths. A chaotic death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0020",
		name: "Order Spear of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 9,
		value: 105,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the architect's design. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0021",
		name: "Celestial Prism of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 8,
		value: 20063,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the First Void Fracture, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Reclaims the remnants of humanity. A devastating surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0022",
		name: "Shadow Dagger of the Stars",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 9,
		value: 1046,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor: "Denies the architect's design. An ancient roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0023",
		name: "Aether Mantle of the Dragon",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20042,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Cleanses the darkness within. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0024",
		name: "Dread Bow of the Dragon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 7,
		value: 235,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Weaves all who stand in opposition. A relentless beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0025",
		name: "Iron Scythe of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 5,
		value: 84,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Reclaims the flow of time itself. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0026",
		name: "Gate Axe of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20014,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Ignores the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0027",
		name: "Chaos Necklace of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 4,
		value: 1089,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Cleanses the fragile limits of flesh. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0028",
		name: "Monarch's Plate of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 9,
		value: 289,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Weaves the remnants of humanity. A subtle dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0029",
		name: "Chaos Buckler of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 5019,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the dimensional divide. A desperate testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0030",
		name: "Plasma Choker of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 9,
		value: 20035,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reclaims all who stand in opposition. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0031",
		name: "Celestial Prism of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 6,
		value: 219,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites all who stand in opposition. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0032",
		name: "Ethereal Scythe of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 1,
		value: 208,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an apex-class Awakened. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Cleanses the arrogant and the mighty. An intricate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0033",
		name: "Order Choker of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 4,
		value: 116,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Commands the flow of time itself. A desperate testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0034",
		name: "Echo Glaive of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 2,
		value: 82,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it leaves temporal scars on reality.",
		flavor:
			"Shatters the remnants of humanity. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0035",
		name: "Nether Bow of the Angel",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 7,
		value: 258,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Destroys the darkness within. A triumphant ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0036",
		name: "Abyssal Cloak of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 20020,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Azure Gate Collapse, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Shatters the fragile limits of flesh. An overwhelming breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0037",
		name: "Crystal Lens of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1003,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignites the remnants of humanity. A triumphant surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0038",
		name: "Null Dagger of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 5009,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Overrides the fragile limits of flesh. A relentless ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0039",
		name: "Gate Halberd of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20007,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands the arrogant and the mighty. A forbidden beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0040",
		name: "Gate Buckler of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20001,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor: "Cleanses the architect's design. A forbidden roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0041",
		name: "Order Crossbow of Space",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 247,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Bends the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0042",
		name: "System Signet of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 214,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Commands the concept of defeat. A triumphant surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0043",
		name: "Rift Helm of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 2,
		value: 1044,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Manifestation Event, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0044",
		name: "Ethereal Grimoire of Blood",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5094,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Bends all who stand in opposition. A subtle whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0045",
		name: "Nexus Sword of Shadows",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 10,
		value: 263,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Azure Gate Collapse, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Reclaims the architect's design. An overwhelming death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0046",
		name: "Void Gauntlets of the Dragon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5026,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by Rogue Protocol entities. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Crushes the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0047",
		name: "Nexus Wand of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20086,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Overrides all who stand in opposition. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0048",
		name: "Void Belt of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 6,
		value: 79,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Phantom Class anomalies. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the fragile limits of flesh. A devastating ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0049",
		name: "System Greaves of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 5,
		value: 1048,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Reflects the flow of time itself. A silent testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0050",
		name: "Gate Bow of the Abyss",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 20039,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Ignores the arrogant and the mighty. An absolute beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0051",
		name: "Monarch's Leather of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: true,
		weight: 2,
		value: 72,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the First Void Fracture, this power leaves temporal scars on reality.",
		flavor: "Ignores the dimensional divide. An absolute symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0052",
		name: "Dread Glaive of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 20097,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Cleanses the darkness within. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0053",
		name: "Aether Lens of Shadows",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 286,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Regent Wars, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Destroys the quiet space between breaths. A sorrowful death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0054",
		name: "Astral Shield of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20028,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by a forgotten Regent. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Bends the fragile limits of flesh. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0055",
		name: "Blood Gauntlets of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 20010,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Denies the quiet space between breaths. A chaotic roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0056",
		name: "Chaos Amulet of the Stars",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 1,
		value: 1049,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by a Sovereign of the Void. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reclaims the remnants of humanity. A devastating dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0057",
		name: "Obsidian Boots of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 4,
		value: 1002,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Crimson Incursion, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Bends the arrogant and the mighty. An intricate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0058",
		name: "Ethereal Gauntlets of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 5061,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor: "Weaves the dimensional divide. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0059",
		name: "Nether Plate of the Dragon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 2,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Commands the remnants of humanity. A forbidden dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0060",
		name: "Obsidian Hammer of Shadows",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1076,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Bends the flow of time itself. A subtle testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0061",
		name: "Null Leather of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5008,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Mana Awakening, this power creates a vacuum in ambient mana fields.",
		flavor: "Absorbs the architect's design. A sorrowful death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0062",
		name: "Aether Tome of the Angel",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 234,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Crimson Incursion, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Crushes all who stand in opposition. A desperate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0063",
		name: "Void Band of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 6,
		value: 1020,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Ignites all who stand in opposition. An ancient beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0064",
		name: "Quantum Pendant of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20026,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a Sovereign of the Void. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignores the fragile limits of flesh. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0065",
		name: "Gate Leather of Shadows",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 20039,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Shatters the fragile limits of flesh. An overwhelming ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0066",
		name: "Sovereign Shield of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 1,
		value: 1050,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor:
			"Overrides the architect's design. A relentless death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0067",
		name: "Iron Belt of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 9,
		value: 135,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Mana Awakening, this power causes the user's eyes to glow with unnatural light.",
		flavor: "Ignores the architect's design. An absolute death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0068",
		name: "Iron Glaive of the Phoenix",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: false,
		weight: 7,
		value: 237,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Ignites the quiet space between breaths. An ancient roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0069",
		name: "Aether Spear of the Stars",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 1,
		value: 133,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Bends the quiet space between breaths. A subtle death of hesitation.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0070",
		name: "Luminous Mantle of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 9,
		value: 142,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Cleanses the dimensional divide. A forbidden testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0071",
		name: "System Plate of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 8,
		value: 280,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor: "Destroys the architect's design. A sorrowful roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0072",
		name: "Astral Hammer of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 10,
		value: 145,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignores the flow of time itself. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0073",
		name: "Chaos Shield of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 9,
		value: 5099,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Ignites all who stand in opposition. An ancient beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0074",
		name: "Crystal Whip of Annihilation",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 9,
		value: 5034,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites the fragile limits of flesh. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0075",
		name: "Aether Mace of the Stars",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 7,
		value: 1064,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Abyssal Influx, this power disrupts a Hunter's innate mana perception.",
		flavor: "Bends the concept of defeat. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0076",
		name: "Quantum Gauntlets of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20048,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0077",
		name: "Plasma Sword of the Angel",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 2,
		value: 80,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Regent Wars, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the flow of time itself. An absolute symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0078",
		name: "Gate Staff of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 8,
		value: 20045,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Denies the flow of time itself. A chaotic testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0079",
		name: "Iron Scythe of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 6,
		value: 138,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Bends the architect's design. A subtle roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0080",
		name: "Celestial Orb of Space",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20023,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Crimson Incursion, this power taxes the user's Mana circuits heavily.",
		flavor: "Crushes the dimensional divide. A desperate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0081",
		name: "Quantum Prism of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 7,
		value: 145,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Cleanses the concept of defeat. A forbidden dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0082",
		name: "Obsidian Crossbow of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: true,
		weight: 5,
		value: 86,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Manifestation Event, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Commands the darkness within. A desperate breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0083",
		name: "Iron Crossbow of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 3,
		value: 51,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Eclipse Protocol, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Crushes the arrogant and the mighty. A desperate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0084",
		name: "System Mace of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20056,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Dimensional Scavengers. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Crushes the quiet space between breaths. A desperate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0085",
		name: "Astral Blade of Time",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 4,
		value: 1048,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Overrides the flow of time itself. A relentless testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0086",
		name: "Sovereign Necklace of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5053,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the remnants of humanity. A forbidden dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0087",
		name: "Iron Mail of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 10,
		value: 1070,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Mana Awakening, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Crushes the dimensional divide. An intricate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0088",
		name: "Abyssal Spear of Silence",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 1,
		value: 53,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Cleanses the dimensional divide. An intricate testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0089",
		name: "Sovereign Hammer of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20040,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Cleanses the flow of time itself. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0090",
		name: "Abyssal Choker of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: false,
		weight: 10,
		value: 1096,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Shatters the concept of defeat. An overwhelming surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0091",
		name: "Echo Dagger of Eternity",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 238,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Commands the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0092",
		name: "Crystal Grimoire of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 20068,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by Dimensional Scavengers. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Absorbs the flow of time itself. A brutal testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0093",
		name: "Order Cube of the System",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 8,
		value: 20090,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Resonance Cascade, this power overrides basic physics within a 30-foot radius.",
		flavor: "Ignites the dimensional divide. A sorrowful symphony of violence.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0094",
		name: "Astral Wand of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 20021,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reflects the arrogant and the mighty. A silent whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0095",
		name: "Quantum Orb of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 1011,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands all who stand in opposition. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0096",
		name: "Nexus Ring of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 8,
		value: 103,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor: "Cleanses the architect's design. A forbidden roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0097",
		name: "Quantum Robes of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: false,
		weight: 6,
		value: 1061,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Crushes the arrogant and the mighty. A desperate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0098",
		name: "Quantum Spear of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 7,
		value: 105,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor: "Reflects the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0099",
		name: "System Crossbow of the Angel",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: false,
		weight: 9,
		value: 1098,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Mana Awakening, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Crushes the dimensional divide. An intricate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0100",
		name: "Celestial Crossbow of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20000,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Destroys the quiet space between breaths. A triumphant death of hesitation.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0101",
		name: "Rift Gauntlets of the Monarch",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 9,
		value: 240,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an ancient Guild Master. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Weaves the fragile limits of flesh. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0102",
		name: "Sovereign Gauntlets of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 6,
		value: 5051,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Resonance Cascade, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignores the darkness within. An absolute breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0103",
		name: "Shadow Amulet of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 10,
		value: 127,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Commands all who stand in opposition. A forbidden whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0104",
		name: "Rift Scythe of the Stars",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: false,
		weight: 9,
		value: 1020,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Manifestation Event, this power disrupts a Hunter's innate mana perception.",
		flavor: "Denies the dimensional divide. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0105",
		name: "Crystal Helm of Space",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 4,
		value: 75,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Overrides the dimensional divide. A relentless symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0106",
		name: "Aether Gauntlets of the Stars",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 5019,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Cleanses the darkness within. A forbidden ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0107",
		name: "Plasma Wand of the Dragon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 1059,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Destroys the quiet space between breaths. A sorrowful roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0108",
		name: "Monarch's Halberd of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 1,
		value: 59,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the quiet space between breaths. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0109",
		name: "Nether Spear of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 6,
		value: 5041,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Denies the remnants of humanity. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0110",
		name: "Quantum Mace of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 5078,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Silence of the Oracle, this power leaves temporal scars on reality.",
		flavor:
			"Reclaims the dimensional divide. A devastating symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0111",
		name: "Blood Gauntlets of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 2,
		value: 270,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Crimson Incursion, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reflects the architect's design. An overwhelming death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0112",
		name: "Rift Lens of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 2,
		value: 223,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Phantom Class anomalies. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor: "Cleanses the darkness within. An intricate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0113",
		name: "Aether Glaive of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 9,
		value: 83,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the Azure Gate Collapse, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Shatters the quiet space between breaths. A brutal death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0114",
		name: "Abyssal Pendant of Silence",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 1010,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Weaves the dimensional divide. A subtle testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0115",
		name: "Iron Hammer of Shadows",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 20099,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by the Architect's rogue subroutines. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Crushes all who stand in opposition. A desperate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0116",
		name: "Plasma Band of the System",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 6,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Ignites the fragile limits of flesh. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0117",
		name: "Nether Cloak of the Angel",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5002,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor: "Ignites the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0118",
		name: "Dread Halberd of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20080,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the First Void Fracture, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Overrides the quiet space between breaths. A devastating death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0119",
		name: "Void Spear of Silence",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 4,
		value: 20079,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Eclipse Protocol, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Shatters the architect's design. An overwhelming death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0120",
		name: "Celestial Buckler of the Angel",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20003,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the fragile limits of flesh. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0121",
		name: "Dread Dagger of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 8,
		value: 67,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Reflects the concept of defeat. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0122",
		name: "Gate Necklace of the Phoenix",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 1,
		value: 71,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignites the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0123",
		name: "Nether Mantle of Eternity",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 2,
		value: 1083,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor: "Overrides the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0124",
		name: "Blood Crown of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 2,
		value: 254,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Bends the arrogant and the mighty. An intricate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0125",
		name: "Celestial Orb of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 20000,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Bends the concept of defeat. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0126",
		name: "Nexus Mantle of Time",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20072,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Mana Awakening, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Cleanses the remnants of humanity. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0127",
		name: "Blood Cube of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 3,
		value: 1044,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the Azure Gate Collapse, this power resonates with the hum of raw magical energy.",
		flavor:
			"Reclaims the architect's design. An overwhelming death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0128",
		name: "Quantum Necklace of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 1,
		value: 125,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor:
			"Commands the arrogant and the mighty. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0129",
		name: "Abyssal Glaive of the Angel",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 292,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Commands the flow of time itself. A triumphant symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0130",
		name: "Astral Band of the Stars",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 2,
		value: 210,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Day of Falling Stars, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Absorbs the arrogant and the mighty. A brutal whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0131",
		name: "Plasma Grimoire of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 4,
		value: 1063,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Crimson Incursion, this power resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the darkness within. A desperate breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0132",
		name: "Abyssal Mantle of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 1,
		value: 256,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignores the concept of defeat. A relentless surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0133",
		name: "Quantum Glaive of the Dragon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 5005,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Reflects the arrogant and the mighty. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0134",
		name: "Aether Buckler of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20067,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an ancient Guild Master. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Cleanses the remnants of humanity. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0135",
		name: "Nexus Tome of the Void",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 1,
		value: 279,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Ignores the darkness within. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0136",
		name: "Luminous Sword of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 4,
		value: 1002,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Ignores the darkness within. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0137",
		name: "Plasma Cube of the Stars",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 1081,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Cleanses the quiet space between breaths. A forbidden death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0138",
		name: "Ethereal Hammer of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 9,
		value: 61,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Weaves the concept of defeat. A relentless dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0139",
		name: "Astral Orb of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20090,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Eclipse Protocol, this power resonates with the hum of raw magical energy.",
		flavor:
			"Reclaims all who stand in opposition. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0140",
		name: "Aether Halberd of the Demon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 8,
		value: 287,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Day of Falling Stars, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Cleanses the concept of defeat. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0141",
		name: "Ethereal Plate of the Angel",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 4,
		value: 129,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Denies all who stand in opposition. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0142",
		name: "Plasma Tome of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 9,
		value: 20077,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Reclaims the fragile limits of flesh. A devastating ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0143",
		name: "Blood Greaves of Shadows",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: false,
		weight: 8,
		value: 143,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignites the arrogant and the mighty. An ancient beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0144",
		name: "Null Ring of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 5063,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Mana Awakening, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Destroys the remnants of humanity. A sorrowful surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0145",
		name: "Nexus Blade of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 10,
		value: 257,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an ancient Guild Master who perished in the Manifestation Event, this power leaves temporal scars on reality.",
		flavor: "Denies the concept of defeat. A brutal surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0146",
		name: "Luminous Orb of the Stars",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 20031,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Denies the remnants of humanity. A chaotic dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0147",
		name: "Null Choker of Blood",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 8,
		value: 70,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Regent Wars, this power leaves a trail of shadowy distortion in physical space.",
		flavor: "Shatters the dimensional divide. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0148",
		name: "Null Whip of Shadows",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 5088,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reclaims the dimensional divide. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0149",
		name: "Nexus Scythe of Silence",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 20078,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Weaves all who stand in opposition. A subtle whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0150",
		name: "Order Axe of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5024,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignores the darkness within. A relentless breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0151",
		name: "Shadow Whip of the Stars",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 4,
		value: 20033,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignites the darkness within. A triumphant breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0152",
		name: "Gate Leather of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20062,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Crushes the arrogant and the mighty. A desperate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0153",
		name: "Shadow Mantle of the Monarch",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1064,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it leaves temporal scars on reality.",
		flavor:
			"Absorbs the darkness within. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0154",
		name: "Quantum Buckler of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 6,
		value: 5059,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the First Void Fracture, this power resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the fragile limits of flesh. A desperate breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0155",
		name: "Nether Signet of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 1,
		value: 291,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignites the fragile limits of flesh. An ancient ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0156",
		name: "Quantum Helm of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 7,
		value: 255,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the fragile limits of flesh. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0157",
		name: "Celestial Sword of the Monarch",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20037,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Commands the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0158",
		name: "Rift Leather of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 20080,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Shatters the architect's design. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0159",
		name: "Gate Buckler of Space",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 9,
		value: 76,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Rogue Protocol entities. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Crushes the quiet space between breaths. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0160",
		name: "Abyssal Tome of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 6,
		value: 1041,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Overrides the concept of defeat. A relentless surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0161",
		name: "System Orb of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20091,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Cleanses the arrogant and the mighty. A subtle whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0162",
		name: "Monarch's Spear of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 10,
		value: 280,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Azure Gate Collapse, this power forces agonizing metabolic sacrifice to maintain.",
		flavor: "Bends the flow of time itself. An intricate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0163",
		name: "Abyssal Choker of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 2,
		value: 20018,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Commands the flow of time itself. A triumphant testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0164",
		name: "Monarch's Shield of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20092,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by high-tier Rift beasts. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Reclaims all who stand in opposition. An overwhelming beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0165",
		name: "Echo Mace of Shadows",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 7,
		value: 241,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by a Sovereign of the Void. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Absorbs the arrogant and the mighty. A brutal beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0166",
		name: "Sovereign Lens of the Demon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20095,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites all who stand in opposition. An ancient beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0167",
		name: "Chaos Helm of the Monarch",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 5,
		value: 135,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Cleanses the arrogant and the mighty. An intricate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0168",
		name: "Nether Halberd of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 7,
		value: 133,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Shatters the remnants of humanity. An overwhelming dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0169",
		name: "Order Mail of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: false,
		weight: 2,
		value: 1000,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Weaves all who stand in opposition. A subtle beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0170",
		name: "Ethereal Necklace of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 1,
		value: 261,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Destroys the arrogant and the mighty. A triumphant beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0171",
		name: "Dread Mail of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 3,
		value: 1024,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reflects the darkness within. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0172",
		name: "Nexus Cloak of the Demon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 3,
		value: 260,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a forgotten Regent. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Shatters the dimensional divide. A brutal testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0173",
		name: "Nether Greaves of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: false,
		weight: 9,
		value: 1078,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Eclipse Protocol, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Cleanses the quiet space between breaths. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0174",
		name: "Rift Cloak of the Angel",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 8,
		value: 297,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Manifestation Event, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the quiet space between breaths. An absolute death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0175",
		name: "Luminous Buckler of the Phoenix",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 10 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 3,
		value: 228,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Cleanses the quiet space between breaths. A forbidden roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0176",
		name: "Dread Scythe of the Phoenix",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 20086,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Destroys the remnants of humanity. A sorrowful dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0177",
		name: "Obsidian Signet of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 9,
		value: 279,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Reflects the darkness within. An overwhelming ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0178",
		name: "Null Pendant of the Angel",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 25 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 14 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: false,
		weight: 1,
		value: 1029,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor: "Denies the dimensional divide. A chaotic symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0179",
		name: "Shadow Choker of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5061,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor: "Absorbs the fragile limits of flesh. A brutal ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0180",
		name: "Rift Buckler of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 8,
		value: 5051,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Regent Wars, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Reclaims all who stand in opposition. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0181",
		name: "Ethereal Crossbow of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20069,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Shatters the architect's design. A brutal roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0182",
		name: "Plasma Wand of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5087,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Silence of the Oracle, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Commands the dimensional divide. A desperate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0183",
		name: "Void Mantle of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 2,
		value: 114,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Crimson Incursion, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Absorbs the quiet space between breaths. A brutal death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0184",
		name: "Nether Leather of the Stars",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 6,
		value: 5046,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Weaves all who stand in opposition. A subtle beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0185",
		name: "Quantum Signet of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1038,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Denies all who stand in opposition. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0186",
		name: "Blood Spear of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 10,
		value: 20003,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Dimensional Scavengers. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Crushes the fragile limits of flesh. A desperate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0187",
		name: "Echo Mail of the Dragon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 285,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Ignites the arrogant and the mighty. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0188",
		name: "Blood Leather of the Abyss",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to necrotic damage.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 8,
		value: 5065,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Ignites the architect's design. An ancient death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0189",
		name: "Astral Gauntlets of Shadows",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 2,
		value: 210,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Crimson Incursion, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Reclaims the concept of defeat. A devastating surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0190",
		name: "Sovereign Whip of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1001,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the quiet space between breaths. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0191",
		name: "Crystal Signet of the Angel",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 16 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 9,
		value: 5096,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Crimson Incursion, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the concept of defeat. An overwhelming surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0192",
		name: "Monarch's Cloak of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 10,
		value: 143,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by an apex-class Awakened. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the quiet space between breaths. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0193",
		name: "System Robes of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 8,
		value: 205,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor: "Overrides the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0194",
		name: "Luminous Sword of Annihilation",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1071,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a forgotten Regent. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Bends the dimensional divide. An absolute testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0195",
		name: "Ethereal Sword of the System",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 6,
		value: 5046,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Manifestation Event, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Reclaims the concept of defeat. A devastating surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0196",
		name: "Nexus Blade of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 2,
		value: 113,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Shatters the dimensional divide. A chaotic symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0197",
		name: "Rift Spear of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20002,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Bends the concept of defeat. A subtle surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0198",
		name: "Astral Bow of the Stars",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 10,
		value: 297,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Absorbs the arrogant and the mighty. A sorrowful beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0199",
		name: "Iron Amulet of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 7,
		value: 5013,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by high-tier Rift beasts. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Ignores the flow of time itself. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0200",
		name: "System Orb of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
			active: [
				{
					name: "System Protocol Override",
					description:
						"Expend 50 MP to unleash a violent burst of stored dimensional energy. Target must succeed on a DC 18 Protocol check or be stunned until the end of its next turn.",
					action: "action",
					frequency: "once-per-day",
				},
			],
		},
		attunement: true,
		weight: 5,
		value: 20024,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Overrides the concept of defeat. A relentless dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
];
