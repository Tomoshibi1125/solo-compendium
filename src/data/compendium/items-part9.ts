// Items Part 9

export const items = [
	{
		id: "sys-exp-item-0601",
		name: "Plasma Greaves of Blood",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
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
		attunement: true,
		weight: 6,
		value: 1031,
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
		id: "sys-exp-item-0602",
		name: "Nether Pendant of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 10,
		value: 65,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Reflects the arrogant and the mighty. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0603",
		name: "Nether Mail of the Dragon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1064,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Regent Wars, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Ignores the arrogant and the mighty. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0604",
		name: "Dread Orb of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		weight: 10,
		value: 218,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power leaves temporal scars on reality.",
		flavor: "Bends the architect's design. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0605",
		name: "Crystal Cloak of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 4,
		value: 5056,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0606",
		name: "Null Ring of the Dragon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 6,
		value: 1003,
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
		id: "sys-exp-item-0607",
		name: "Null Band of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 9,
		value: 20011,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Reflects the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0608",
		name: "Crystal Tome of the Stars",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20028,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by Phantom Class anomalies. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Denies the concept of defeat. A brutal dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0609",
		name: "Obsidian Greaves of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 7,
		value: 5089,
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
		id: "sys-exp-item-0610",
		name: "Echo Sword of the Void",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20093,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Silence of the Oracle, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Crushes the remnants of humanity. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0611",
		name: "Blood Crossbow of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 7,
		value: 145,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Bends the remnants of humanity. A subtle dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0612",
		name: "Monarch's Gauntlets of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 20034,
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
		id: "sys-exp-item-0613",
		name: "Order Axe of the Monarch",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		value: 5034,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0614",
		name: "System Cube of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 7,
		value: 1091,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Bends the fragile limits of flesh. An intricate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0615",
		name: "Nether Axe of Space",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
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
		weight: 9,
		value: 265,
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
		id: "sys-exp-item-0616",
		name: "Dread Gauntlets of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5058,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Crimson Incursion, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Absorbs all who stand in opposition. A sorrowful whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0617",
		name: "Void Amulet of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
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
		value: 5097,
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
		id: "sys-exp-item-0618",
		name: "Obsidian Prism of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 8,
		value: 226,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Destroys the quiet space between breaths. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0619",
		name: "Nether Hammer of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 6,
		value: 5082,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignites the quiet space between breaths. An ancient death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0620",
		name: "Sovereign Tome of the Monarch",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5070,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Shatters the flow of time itself. A chaotic testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0621",
		name: "Sovereign Cube of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 8,
		value: 246,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the remnants of humanity. A forbidden surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0622",
		name: "Order Axe of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 1,
		value: 141,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by Phantom Class anomalies. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Reflects the quiet space between breaths. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0623",
		name: "Monarch's Hammer of the System",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
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
		value: 201,
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
		id: "sys-exp-item-0624",
		name: "Echo Choker of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 5,
		value: 220,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by high-tier Rift beasts. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the quiet space between breaths. A devastating roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0625",
		name: "Crystal Robes of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 4,
		value: 56,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Abyssal Influx, this power leaves temporal scars on reality.",
		flavor:
			"Ignores the remnants of humanity. A devastating surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0626",
		name: "Gate Axe of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 3,
		value: 116,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Reclaims the architect's design. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0627",
		name: "Abyssal Crossbow of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: false,
		weight: 5,
		value: 1027,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Reclaims the quiet space between breaths. A devastating roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0628",
		name: "Dread Tome of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
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
		weight: 4,
		value: 5001,
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
		id: "sys-exp-item-0629",
		name: "Nexus Whip of the Stars",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 6,
		value: 61,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Denies all who stand in opposition. A brutal beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0630",
		name: "Monarch's Crossbow of the Stars",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20030,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor: "Bends the quiet space between breaths. A subtle roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0631",
		name: "Aether Mantle of the Phoenix",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: true,
		weight: 8,
		value: 289,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor: "Denies the architect's design. A chaotic roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0632",
		name: "Void Buckler of Silence",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 1,
		value: 88,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Crimson Incursion, this power resonates with the hum of raw magical energy.",
		flavor:
			"Ignites the darkness within. A sorrowful breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0633",
		name: "Gate Scythe of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		weight: 5,
		value: 1006,
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
		id: "sys-exp-item-0634",
		name: "Abyssal Shield of the Dragon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		value: 1026,
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
		id: "sys-exp-item-0635",
		name: "Null Signet of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0008.webp",
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
		attunement: true,
		weight: 4,
		value: 231,
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
		id: "sys-exp-item-0636",
		name: "Nexus Gauntlets of the Demon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 7,
		value: 257,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Commands the dimensional divide. A triumphant testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0637",
		name: "Aether Bow of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5077,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Manifestation Event, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Reclaims the flow of time itself. A devastating symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0638",
		name: "Void Signet of Shadows",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 2,
		value: 5026,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Bends the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0639",
		name: "System Cube of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 9,
		value: 277,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by Phantom Class anomalies. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Reflects the quiet space between breaths. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0640",
		name: "Plasma Amulet of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
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
		value: 5000,
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
		id: "sys-exp-item-0641",
		name: "Crystal Helm of the Void",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants immunity to the frightened condition.",
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
		value: 5001,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Manifestation Event, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0642",
		name: "Luminous Spear of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20052,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the architect's design. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0643",
		name: "Aether Necklace of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0001.webp",
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
		value: 20040,
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
		id: "sys-exp-item-0644",
		name: "Echo Shield of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 1,
		value: 73,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Overrides the fragile limits of flesh. A relentless breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0645",
		name: "System Cloak of the Angel",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 7,
		value: 5083,
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
		id: "sys-exp-item-0646",
		name: "Blood Spear of Time",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 1,
		value: 261,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignores the remnants of humanity. A relentless surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0647",
		name: "Ethereal Orb of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 9,
		value: 5055,
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
		id: "sys-exp-item-0648",
		name: "Aether Helm of the Dragon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 6,
		value: 5074,
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
		id: "sys-exp-item-0649",
		name: "Rift Dagger of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 8,
		value: 244,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Regent Wars, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignores the remnants of humanity. An absolute surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0650",
		name: "Rift Necklace of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1001,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by an apex-class Awakened. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Denies the arrogant and the mighty. A brutal beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
];
