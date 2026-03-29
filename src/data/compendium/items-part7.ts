// Items Part 7

export const items = [
	{
		id: "sys-exp-item-0201",
		name: "Iron Gauntlets of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 1,
		value: 1019,
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
		id: "sys-exp-item-0202",
		name: "Crystal Band of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20050,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Crimson Incursion, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Crushes all who stand in opposition. An intricate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0203",
		name: "Null Band of Shadows",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0018.webp",
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
		weight: 7,
		value: 222,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power leaves temporal scars on reality.",
		flavor: "Bends the architect's design. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0204",
		name: "Quantum Robes of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5046,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Bends all who stand in opposition. A subtle beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0205",
		name: "Void Band of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 10,
		value: 1032,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Phantom Class anomalies. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Reflects the darkness within. An overwhelming ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0206",
		name: "Plasma Scythe of Shadows",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
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
		attunement: true,
		weight: 2,
		value: 207,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0207",
		name: "Null Halberd of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 3,
		value: 1095,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Overrides the fragile limits of flesh. A silent ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0208",
		name: "Abyssal Gauntlets of the Demon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
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
		weight: 5,
		value: 1048,
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
		id: "sys-exp-item-0209",
		name: "Luminous Gauntlets of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5026,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by high-tier Rift beasts. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores the fragile limits of flesh. A devastating ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0210",
		name: "Obsidian Mantle of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 6,
		value: 1048,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Shatters the flow of time itself. An overwhelming testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0211",
		name: "Void Leather of the Stars",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 2,
		value: 53,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by high-tier Rift beasts. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Bends the arrogant and the mighty. An absolute beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0212",
		name: "Astral Gauntlets of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20003,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Overrides the arrogant and the mighty. A relentless beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0213",
		name: "Chaos Pendant of the Angel",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 9,
		value: 1069,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Reflects the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0214",
		name: "Monarch's Grimoire of the Dragon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 2,
		value: 107,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Commands all who stand in opposition. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0215",
		name: "Shadow Halberd of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 4,
		value: 106,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the First Void Fracture, this power resonates with the hum of raw magical energy.",
		flavor:
			"Crushes all who stand in opposition. An intricate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0216",
		name: "Shadow Bow of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 8,
		value: 20005,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the Regent Wars, this power causes the user's eyes to glow with unnatural light.",
		flavor: "Bends the flow of time itself. An absolute symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0217",
		name: "Abyssal Pendant of the System",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 3,
		value: 123,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Abyssal Influx, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Crushes the quiet space between breaths. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0218",
		name: "Echo Glaive of the Angel",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		value: 5048,
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
		id: "sys-exp-item-0219",
		name: "Celestial Staff of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 104,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignites all who stand in opposition. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0220",
		name: "Rift Axe of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20026,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Reclaims the arrogant and the mighty. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0221",
		name: "Ethereal Crossbow of Eternity",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 8,
		value: 5008,
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
		id: "sys-exp-item-0222",
		name: "Abyssal Scythe of the Stars",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 1,
		value: 270,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Commands the arrogant and the mighty. A desperate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0223",
		name: "Crystal Dagger of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 9,
		value: 1007,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0224",
		name: "Iron Blade of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 20053,
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
		id: "sys-exp-item-0225",
		name: "Blood Belt of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20011,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Reflects all who stand in opposition. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0226",
		name: "Gate Helm of Time",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 3,
		value: 73,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Absorbs the flow of time itself. An ancient testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0227",
		name: "Shadow Prism of the Phoenix",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 20029,
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
		id: "sys-exp-item-0228",
		name: "Luminous Robes of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 4,
		value: 1014,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the First Void Fracture, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignores all who stand in opposition. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0229",
		name: "Nether Prism of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 6,
		value: 103,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Silence of the Oracle, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reclaims the architect's design. A devastating death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0230",
		name: "Ethereal Scythe of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 7,
		value: 104,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Overrides the concept of defeat. A relentless dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0231",
		name: "Astral Crown of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 2,
		value: 102,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an apex-class Awakened. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Overrides the flow of time itself. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0232",
		name: "Monarch's Belt of the Angel",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 3,
		value: 106,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by an ancient Guild Master. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Denies the dimensional divide. A brutal testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0233",
		name: "Blood Bow of Time",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 10,
		value: 5003,
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
		id: "sys-exp-item-0234",
		name: "Dread Hammer of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
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
		weight: 7,
		value: 299,
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
		id: "sys-exp-item-0235",
		name: "Nether Blade of the Stars",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 4,
		value: 56,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the remnants of humanity. A forbidden surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0236",
		name: "Null Whip of the Dragon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 8,
		value: 1038,
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
		id: "sys-exp-item-0237",
		name: "Ethereal Amulet of Space",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5061,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor:
			"Weaves the quiet space between breaths. A subtle death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0238",
		name: "Monarch's Gauntlets of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 10,
		value: 123,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Manifestation Event, this power leaves temporal scars on reality.",
		flavor:
			"Ignores the quiet space between breaths. An absolute death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0239",
		name: "Plasma Robes of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 1,
		value: 249,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Ignores the flow of time itself. An absolute testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0240",
		name: "Celestial Crown of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 4,
		value: 83,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Eclipse Protocol, this power leaves temporal scars on reality.",
		flavor:
			"Reclaims all who stand in opposition. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0241",
		name: "Gate Mace of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: false,
		weight: 8,
		value: 1023,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor: "Reflects the darkness within. An overwhelming ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0242",
		name: "Shadow Robes of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		attunement: false,
		weight: 5,
		value: 1056,
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
		id: "sys-exp-item-0243",
		name: "Rift Hammer of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		value: 1094,
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
		id: "sys-exp-item-0244",
		name: "Aether Band of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 20042,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Bends the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0245",
		name: "Plasma Buckler of the Void",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 4,
		value: 54,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by an apex-class Awakened. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the concept of defeat. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0246",
		name: "Quantum Plate of Silence",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 2,
		value: 234,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Bends the flow of time itself. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0247",
		name: "Rift Mantle of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20007,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Cleanses the arrogant and the mighty. An intricate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0248",
		name: "Abyssal Wand of the Angel",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 7,
		value: 110,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by a forgotten Regent. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignores the fragile limits of flesh. A devastating ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0249",
		name: "Abyssal Glaive of the Dragon",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
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
		weight: 9,
		value: 20018,
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
		id: "sys-exp-item-0250",
		name: "Sovereign Pendant of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 8,
		value: 111,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor: "Reflects the darkness within. A chaotic ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0251",
		name: "Abyssal Axe of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
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
		attunement: true,
		weight: 6,
		value: 1055,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Manifestation Event, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0252",
		name: "Celestial Glaive of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20085,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it creates a vacuum in ambient mana fields.",
		flavor: "Bends the flow of time itself. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0253",
		name: "Nether Glaive of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: false,
		weight: 7,
		value: 77,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Overrides the quiet space between breaths. A silent roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0254",
		name: "Blood Staff of the Void",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		weight: 1,
		value: 5097,
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
		id: "sys-exp-item-0255",
		name: "Abyssal Scythe of the Angel",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 10,
		value: 62,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by high-tier Rift beasts. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Absorbs the quiet space between breaths. A sorrowful roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0256",
		name: "Order Pendant of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 2,
		value: 101,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Reflects all who stand in opposition. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0257",
		name: "Celestial Choker of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20063,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Azure Gate Collapse, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Denies the arrogant and the mighty. A brutal whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0258",
		name: "Echo Halberd of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 4,
		value: 20085,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the arrogant and the mighty. An overwhelming beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0259",
		name: "Sovereign Belt of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1019,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor: "Denies the architect's design. A chaotic death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0260",
		name: "Dread Glaive of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 20044,
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
		id: "sys-exp-item-0261",
		name: "Dread Pendant of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 62,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Absorbs the fragile limits of flesh. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0262",
		name: "Order Gauntlets of the Void",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 8,
		value: 20085,
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
		id: "sys-exp-item-0263",
		name: "Sovereign Leather of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 8,
		value: 5025,
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
		id: "sys-exp-item-0264",
		name: "Gate Glaive of Annihilation",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 3,
		value: 220,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Rogue Protocol entities. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignores the arrogant and the mighty. A devastating beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0265",
		name: "Monarch's Mail of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 113,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by a Sovereign of the Void. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Destroys the fragile limits of flesh. A sorrowful ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0266",
		name: "Celestial Buckler of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 1,
		value: 1079,
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
		id: "sys-exp-item-0267",
		name: "Quantum Band of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 3,
		value: 54,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Ignites the flow of time itself. A triumphant symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0268",
		name: "Luminous Blade of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: false,
		weight: 8,
		value: 1003,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Shatters the concept of defeat. A chaotic dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0269",
		name: "Rift Robes of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 3,
		value: 59,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Commands the flow of time itself. A forbidden symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0270",
		name: "Null Leather of Space",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
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
		value: 245,
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
		id: "sys-exp-item-0271",
		name: "Obsidian Axe of the Stars",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 9,
		value: 20064,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reclaims the flow of time itself. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0272",
		name: "Obsidian Helm of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 5,
		value: 1008,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Commands the flow of time itself. A forbidden testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0273",
		name: "Rift Signet of the Dragon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 5054,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor: "Weaves the dimensional divide. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0274",
		name: "Ethereal Mace of the Phoenix",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 5,
		value: 232,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Destroys the arrogant and the mighty. A triumphant beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0275",
		name: "Quantum Band of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 200,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Weaves the flow of time itself. A relentless testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0276",
		name: "Nether Signet of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0016.webp",
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
		value: 290,
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
		id: "sys-exp-item-0277",
		name: "Quantum Spear of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: false,
		weight: 5,
		value: 1090,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the remnants of humanity. A desperate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0278",
		name: "Iron Wand of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 3,
		value: 20030,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by an ancient Guild Master. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Reflects the fragile limits of flesh. An overwhelming ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0279",
		name: "Nether Mail of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 7,
		value: 5017,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Overrides the arrogant and the mighty. A silent beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0280",
		name: "Plasma Necklace of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
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
		attunement: true,
		weight: 9,
		value: 275,
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
		id: "sys-exp-item-0281",
		name: "Monarch's Axe of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
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
		weight: 10,
		value: 288,
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
		id: "sys-exp-item-0282",
		name: "Shadow Tome of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 7,
		value: 124,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Crimson Incursion, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Crushes the remnants of humanity. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0283",
		name: "Void Robes of the System",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5030,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the First Void Fracture, this power taxes the user's Mana circuits heavily.",
		flavor: "Absorbs the dimensional divide. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0284",
		name: "Astral Gauntlets of the System",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 5081,
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
		id: "sys-exp-item-0285",
		name: "System Belt of Space",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5017,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Reclaims the darkness within. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0286",
		name: "Blood Tome of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 10,
		value: 298,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Crimson Incursion, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Commands the concept of defeat. A desperate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0287",
		name: "Gate Wand of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20041,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the dimensional divide. A forbidden testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0288",
		name: "Sovereign Boots of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 4,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Commands all who stand in opposition. A forbidden beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0289",
		name: "Rift Grimoire of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5090,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Overrides the arrogant and the mighty. A devastating beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0290",
		name: "Aether Crossbow of Blood",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 3,
		value: 89,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignores the quiet space between breaths. A devastating roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0291",
		name: "Plasma Crossbow of the Angel",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 4,
		value: 20032,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Abyssal Influx, this power disrupts a Hunter's innate mana perception.",
		flavor: "Bends the concept of defeat. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0292",
		name: "Obsidian Halberd of Space",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 7,
		value: 270,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Regent Wars, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Cleanses all who stand in opposition. An intricate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0293",
		name: "Null Mail of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		weight: 6,
		value: 5010,
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
		id: "sys-exp-item-0294",
		name: "Rift Tome of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: false,
		weight: 8,
		value: 1032,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Phantom Class anomalies. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reflects the quiet space between breaths. An overwhelming roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0295",
		name: "Shadow Glaive of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
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
		value: 298,
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
		id: "sys-exp-item-0296",
		name: "System Ring of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 8,
		value: 20037,
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
		id: "sys-exp-item-0297",
		name: "Celestial Gauntlets of Shadows",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 8,
		value: 5060,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0298",
		name: "Nexus Prism of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 6,
		value: 1054,
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
		id: "sys-exp-item-0299",
		name: "Crystal Buckler of the Phoenix",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 3,
		value: 20048,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Cleanses the darkness within. A forbidden ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0300",
		name: "Gate Wand of Shadows",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 10,
		value: 209,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Crimson Incursion, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Ignites the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0301",
		name: "Iron Scythe of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 4,
		value: 133,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Bends the arrogant and the mighty. A subtle beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0302",
		name: "Gate Robes of Eternity",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5049,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Ignites the quiet space between breaths. A triumphant death of hesitation.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0303",
		name: "Obsidian Hammer of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
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
		attunement: true,
		weight: 2,
		value: 204,
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
		id: "sys-exp-item-0304",
		name: "Crystal Leather of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1076,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Overrides the darkness within. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0305",
		name: "Sovereign Plate of Space",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 7,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Overrides the quiet space between breaths. A silent roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0306",
		name: "Void Plate of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
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
		weight: 1,
		value: 1069,
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
		id: "sys-exp-item-0307",
		name: "Blood Prism of Shadows",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20015,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it overrides basic physics within a 30-foot radius.",
		flavor: "Reflects the flow of time itself. A chaotic symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0308",
		name: "Aether Mantle of the Stars",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20005,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands the concept of defeat. A triumphant surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0309",
		name: "Plasma Cube of the Monarch",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 8,
		value: 1007,
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
		id: "sys-exp-item-0310",
		name: "Luminous Robes of the Angel",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 5,
		value: 20021,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Silence of the Oracle, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Ignores all who stand in opposition. An absolute whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0311",
		name: "Blood Robes of the Void",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5069,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites the darkness within. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0312",
		name: "Astral Dagger of the Phoenix",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 1,
		value: 5046,
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
		id: "sys-exp-item-0313",
		name: "Aether Sword of the Monarch",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 6,
		value: 5059,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Bends all who stand in opposition. An intricate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0314",
		name: "Dread Greaves of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 4,
		value: 5045,
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
		id: "sys-exp-item-0315",
		name: "Nexus Signet of the Stars",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 5,
		value: 282,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by Phantom Class anomalies. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignites the concept of defeat. A sorrowful dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0316",
		name: "Ethereal Gauntlets of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 10,
		value: 1075,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Mana Awakening, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Absorbs the fragile limits of flesh. A brutal breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0317",
		name: "Abyssal Helm of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
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
		value: 227,
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
		id: "sys-exp-item-0318",
		name: "Ethereal Leather of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 3,
		value: 20066,
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
		id: "sys-exp-item-0319",
		name: "Shadow Mantle of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1061,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Shatters all who stand in opposition. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0320",
		name: "Quantum Amulet of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 10,
		value: 1035,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor: "Overrides the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0321",
		name: "Null Gauntlets of the Angel",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 6,
		value: 95,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it creates a vacuum in ambient mana fields.",
		flavor: "Overrides the architect's design. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0322",
		name: "Sovereign Scythe of Blood",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20045,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Ignores the dimensional divide. A relentless symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0323",
		name: "Obsidian Mail of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5021,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Regent Wars, this power resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the flow of time itself. A desperate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0324",
		name: "Iron Crown of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		value: 20045,
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
		id: "sys-exp-item-0325",
		name: "Luminous Plate of Silence",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 4,
		value: 5092,
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
		id: "sys-exp-item-0326",
		name: "Ethereal Band of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 9,
		value: 20060,
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
		id: "sys-exp-item-0327",
		name: "Plasma Mace of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: true,
		weight: 10,
		value: 99,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by Rogue Protocol entities. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Crushes the concept of defeat. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0328",
		name: "Quantum Dagger of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 8,
		value: 5073,
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
		id: "sys-exp-item-0329",
		name: "Quantum Gauntlets of the Phoenix",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 4,
		value: 5011,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Ignores the darkness within. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0330",
		name: "Aether Leather of the Phoenix",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 2,
		value: 274,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Weaves the flow of time itself. A subtle testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0331",
		name: "Blood Amulet of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 8,
		value: 20098,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Cleanses the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0332",
		name: "Sovereign Staff of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20092,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Reflects the remnants of humanity. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0333",
		name: "Obsidian Greaves of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 5,
		value: 5066,
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
		id: "sys-exp-item-0334",
		name: "Ethereal Buckler of the Stars",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5023,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Absorbs the remnants of humanity. An ancient dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0335",
		name: "Order Gauntlets of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
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
		weight: 6,
		value: 231,
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
		id: "sys-exp-item-0336",
		name: "Monarch's Spear of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20022,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Silence of the Oracle, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Shatters the arrogant and the mighty. An overwhelming whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0337",
		name: "Luminous Sword of Time",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 5,
		value: 98,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the remnants of humanity. A forbidden dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0338",
		name: "Void Mantle of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5064,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it leaves temporal scars on reality.",
		flavor:
			"Crushes the fragile limits of flesh. A forbidden breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0339",
		name: "Chaos Plate of Blood",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
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
		value: 200,
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
		id: "sys-exp-item-0340",
		name: "System Wand of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 7,
		value: 226,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Cleanses the darkness within. A forbidden ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0341",
		name: "Iron Spear of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
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
		attunement: false,
		weight: 1,
		value: 1054,
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
		id: "sys-exp-item-0342",
		name: "Gate Halberd of the Void",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 9,
		value: 231,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor: "Denies the architect's design. An ancient death of hesitation.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0343",
		name: "Obsidian Lens of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 3,
		value: 114,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by an ancient Guild Master. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Reflects the remnants of humanity. An overwhelming dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0344",
		name: "Gate Necklace of Shadows",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 5,
		value: 5010,
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
		id: "sys-exp-item-0345",
		name: "Ethereal Axe of the Dragon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 3,
		value: 5025,
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
		id: "sys-exp-item-0346",
		name: "Shadow Boots of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 10,
		value: 78,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Rogue Protocol entities. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignores the concept of defeat. A devastating dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0347",
		name: "Astral Leather of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 7,
		value: 250,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Shatters the dimensional divide. A chaotic testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0348",
		name: "Celestial Robes of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 7,
		value: 93,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Day of Falling Stars, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Destroys the fragile limits of flesh. A desperate breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0349",
		name: "Crystal Pendant of the Void",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 3,
		value: 20056,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Azure Gate Collapse, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reflects the arrogant and the mighty. An overwhelming whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0350",
		name: "Sovereign Mace of the Abyss",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 7,
		value: 88,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Phantom Class anomalies. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the fragile limits of flesh. A devastating ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0351",
		name: "Abyssal Wand of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
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
		weight: 9,
		value: 289,
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
		id: "sys-exp-item-0352",
		name: "Crystal Shield of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 9,
		value: 1079,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Shatters the darkness within. A brutal ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0353",
		name: "Iron Buckler of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 4,
		value: 5043,
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
		id: "sys-exp-item-0354",
		name: "Nexus Robes of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 8,
		value: 76,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor: "Overrides the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0355",
		name: "Order Bow of Time",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		weight: 10,
		value: 5068,
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
		id: "sys-exp-item-0356",
		name: "Ethereal Ring of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 6,
		value: 20041,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Azure Gate Collapse, this power forces agonizing metabolic sacrifice to maintain.",
		flavor: "Bends the flow of time itself. An intricate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0357",
		name: "System Wand of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 5,
		value: 1092,
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
		id: "sys-exp-item-0358",
		name: "Quantum Helm of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
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
		weight: 5,
		value: 5084,
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
		id: "sys-exp-item-0359",
		name: "Monarch's Staff of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 3,
		value: 133,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Reflects the arrogant and the mighty. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0360",
		name: "Plasma Dagger of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: false,
		weight: 10,
		value: 239,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by an ancient Guild Master. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Denies the dimensional divide. A brutal testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0361",
		name: "Ethereal Crossbow of the Phoenix",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 10,
		value: 81,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Cleanses the remnants of humanity. A subtle surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0362",
		name: "Plasma Necklace of the Void",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 2,
		value: 241,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an apex-class Awakened. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reflects all who stand in opposition. An overwhelming beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0363",
		name: "Ethereal Staff of the Dragon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1039,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Destroys the quiet space between breaths. A triumphant death of hesitation.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0364",
		name: "Blood Staff of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1081,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor: "Ignores the darkness within. A relentless ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0365",
		name: "Echo Amulet of the Phoenix",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 2,
		value: 1094,
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
		id: "sys-exp-item-0366",
		name: "Iron Band of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0018.webp",
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
		weight: 9,
		value: 1070,
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
		id: "sys-exp-item-0367",
		name: "Dread Bow of the System",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
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
		weight: 5,
		value: 297,
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
		id: "sys-exp-item-0368",
		name: "Nexus Mace of Annihilation",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
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
		weight: 1,
		value: 1016,
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
		id: "sys-exp-item-0369",
		name: "Chaos Band of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 3,
		value: 5066,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor: "Denies the dimensional divide. A chaotic symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0370",
		name: "Nexus Wand of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 7,
		value: 224,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Absorbs all who stand in opposition. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0371",
		name: "Order Amulet of Space",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 1,
		value: 5006,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor: "Reflects the architect's design. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0372",
		name: "Plasma Gauntlets of the Monarch",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 3,
		value: 5031,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Reflects the remnants of humanity. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0373",
		name: "Blood Cube of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0013.webp",
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
		weight: 8,
		value: 280,
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
		id: "sys-exp-item-0374",
		name: "Astral Leather of the Angel",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: false,
		weight: 5,
		value: 1072,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Reflects the concept of defeat. A chaotic dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0375",
		name: "Crystal Mail of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 10,
		value: 92,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Overrides the remnants of humanity. A relentless surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0376",
		name: "Nexus Gauntlets of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5035,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Commands the dimensional divide. A forbidden symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0377",
		name: "Astral Belt of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 4,
		value: 1089,
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
		id: "sys-exp-item-0378",
		name: "Plasma Blade of the Dragon",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 4,
		value: 20079,
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
		id: "sys-exp-item-0379",
		name: "Nexus Gauntlets of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5099,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Crushes the arrogant and the mighty. A forbidden whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0380",
		name: "Plasma Whip of the Phoenix",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
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
		weight: 4,
		value: 222,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Ignites the architect's design. An ancient death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0381",
		name: "Blood Robes of Blood",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
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
		weight: 3,
		value: 231,
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
		id: "sys-exp-item-0382",
		name: "Shadow Robes of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
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
		weight: 10,
		value: 1059,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Overrides the concept of defeat. A relentless dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0383",
		name: "System Tome of Annihilation",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 9,
		value: 5076,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a Sovereign of the Void. Utilizing it resonates with the hum of raw magical energy.",
		flavor:
			"Bends the flow of time itself. An intricate testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0384",
		name: "Null Spear of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20071,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it overrides basic physics within a 30-foot radius.",
		flavor: "Cleanses the flow of time itself. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0385",
		name: "Nexus Hammer of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: false,
		weight: 4,
		value: 1067,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Reclaims the fragile limits of flesh. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0386",
		name: "Celestial Band of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		value: 20098,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands the arrogant and the mighty. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0387",
		name: "Iron Wand of the Angel",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 10,
		value: 121,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands all who stand in opposition. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0388",
		name: "Quantum Helm of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 5,
		value: 20055,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Abyssal Influx, this power leaves temporal scars on reality.",
		flavor:
			"Absorbs the darkness within. A brutal breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0389",
		name: "Obsidian Crossbow of the Stars",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 5,
		value: 138,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Resonance Cascade, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0390",
		name: "Crystal Spear of the Phoenix",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 6,
		value: 5057,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by an apex-class Awakened. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Commands all who stand in opposition. A desperate beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0391",
		name: "System Cloak of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0016.webp",
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
		weight: 2,
		value: 5013,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Reflects the darkness within. A silent ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0392",
		name: "Crystal Leather of the Demon",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 6,
		value: 20028,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by the Architect's rogue subroutines. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignores the quiet space between breaths. An absolute roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0393",
		name: "Nexus Pendant of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0017.webp",
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
		value: 209,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Cleanses the remnants of humanity. A forbidden surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0394",
		name: "Blood Mantle of the Stars",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 10,
		value: 52,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Rogue Protocol entities. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Crushes the remnants of humanity. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0395",
		name: "Rift Dagger of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: false,
		weight: 2,
		value: 1090,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by the Architect's rogue subroutines. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignores the flow of time itself. An absolute testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0396",
		name: "Crystal Blade of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 10,
		value: 264,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Resonance Cascade, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Destroys the dimensional divide. A sorrowful symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0397",
		name: "Crystal Gauntlets of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 1008,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Denies the dimensional divide. A chaotic testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0398",
		name: "Monarch's Choker of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 5,
		value: 5098,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Reclaims all who stand in opposition. A devastating beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0399",
		name: "Luminous Signet of the Phoenix",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5082,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor: "Reclaims the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0400",
		name: "Obsidian Axe of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0020.webp",
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
		weight: 9,
		value: 5004,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Weaves the fragile limits of flesh. A subtle breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
];
