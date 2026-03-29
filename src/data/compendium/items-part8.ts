// Items Part 8

export const items = [
	{
		id: "sys-exp-item-0401",
		name: "Sovereign Mail of the Dragon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 1,
		value: 67,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Reclaims all who stand in opposition. A devastating beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0402",
		name: "Sovereign Buckler of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
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
		weight: 4,
		value: 1091,
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
		id: "sys-exp-item-0403",
		name: "Abyssal Robes of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
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
		attunement: false,
		weight: 3,
		value: 242,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Day of Falling Stars, this power leaves temporal scars on reality.",
		flavor: "Bends the architect's design. An intricate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0404",
		name: "Shadow Plate of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 3,
		value: 291,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it leaves temporal scars on reality.",
		flavor:
			"Shatters the darkness within. A chaotic breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0405",
		name: "Obsidian Greaves of the Demon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5052,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor: "Denies the dimensional divide. An ancient symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0406",
		name: "Order Lens of the Phoenix",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 5,
		value: 5065,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignites the remnants of humanity. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0407",
		name: "Plasma Axe of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 6,
		value: 80,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Eclipse Protocol, this power forces agonizing metabolic sacrifice to maintain.",
		flavor: "Ignores the architect's design. An absolute death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0408",
		name: "Shadow Gauntlets of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 3,
		value: 20064,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Destroys the remnants of humanity. A triumphant surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0409",
		name: "Chaos Mantle of the Demon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20065,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by high-tier Rift beasts. Utilizing it taxes the user's Mana circuits heavily.",
		flavor: "Destroys the architect's design. A desperate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0410",
		name: "Plasma Belt of the Angel",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 2,
		value: 64,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by Phantom Class anomalies. Utilizing it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Cleanses the remnants of humanity. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0411",
		name: "Nexus Cube of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 2,
		value: 1081,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Commands the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0412",
		name: "System Grimoire of Eternity",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: true,
		weight: 4,
		value: 73,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Silence of the Oracle, this power overrides basic physics within a 30-foot radius.",
		flavor: "Crushes the dimensional divide. A desperate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0413",
		name: "System Staff of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20081,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Absorbs the darkness within. An ancient ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0414",
		name: "Rift Amulet of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 2,
		value: 20053,
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
		id: "sys-exp-item-0415",
		name: "Blood Necklace of the System",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 5053,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Reflects the flow of time itself. A silent symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0416",
		name: "System Choker of Space",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: false,
		weight: 4,
		value: 1056,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Crimson Incursion, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites the remnants of humanity. A sorrowful surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0417",
		name: "Sovereign Mantle of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 8,
		value: 20071,
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
		id: "sys-exp-item-0418",
		name: "System Amulet of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 3,
		value: 20072,
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
		id: "sys-exp-item-0419",
		name: "Astral Sword of the Dragon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 7,
		value: 149,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor: "Reflects the concept of defeat. A chaotic surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0420",
		name: "Sovereign Whip of Eternity",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 7,
		value: 20032,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Abyssal Influx, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor: "Destroys the darkness within. A sorrowful ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0421",
		name: "Void Choker of the Demon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20010,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Bends the flow of time itself. A subtle testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0422",
		name: "Monarch's Dagger of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1046,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Mana Awakening, this power leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Destroys all who stand in opposition. A desperate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0423",
		name: "Quantum Axe of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 2,
		value: 20012,
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
		id: "sys-exp-item-0424",
		name: "Aether Wand of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 5,
		value: 58,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Crimson Incursion, this power resonates with the hum of raw magical energy.",
		flavor: "Ignites the architect's design. A sorrowful death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0425",
		name: "Plasma Whip of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 5,
		value: 5067,
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
		id: "sys-exp-item-0426",
		name: "Shadow Hammer of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 1,
		value: 252,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Commands the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0427",
		name: "Null Spear of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: false,
		weight: 9,
		value: 1092,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Commands the fragile limits of flesh. A triumphant ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0428",
		name: "Sovereign Sword of the Stars",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
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
		weight: 4,
		value: 242,
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
		id: "sys-exp-item-0429",
		name: "Obsidian Amulet of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		value: 20046,
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
		id: "sys-exp-item-0430",
		name: "Nexus Wand of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 1,
		value: 262,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Overrides the quiet space between breaths. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0431",
		name: "Luminous Cloak of Shadows",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 7,
		value: 147,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the Manifestation Event, this power resonates with the hum of raw magical energy.",
		flavor:
			"Absorbs the flow of time itself. A sorrowful symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0432",
		name: "Gate Helm of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		weight: 5,
		value: 5098,
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
		id: "sys-exp-item-0433",
		name: "Order Band of Blood",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 10,
		value: 73,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an ancient Guild Master who perished in the Crimson Incursion, this power taxes the user's Mana circuits heavily.",
		flavor: "Weaves the concept of defeat. An absolute surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0434",
		name: "Ethereal Boots of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 4,
		value: 261,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Reflects the fragile limits of flesh. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0435",
		name: "Obsidian Leather of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 1,
		value: 5090,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor: "Bends the darkness within. A subtle breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0436",
		name: "Dread Mail of the Phoenix",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		value: 5007,
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
		id: "sys-exp-item-0437",
		name: "Obsidian Boots of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 5,
		value: 20066,
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
		id: "sys-exp-item-0438",
		name: "Astral Hammer of Space",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 7,
		value: 1058,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Bends the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0439",
		name: "Gate Axe of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
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
		attunement: true,
		weight: 10,
		value: 1000,
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
		id: "sys-exp-item-0440",
		name: "Blood Amulet of the Dragon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		value: 20096,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Manifestation Event, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0441",
		name: "Abyssal Crown of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5057,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Overrides the quiet space between breaths. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0442",
		name: "Echo Helm of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 4,
		value: 263,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor: "Reflects the darkness within. A chaotic ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0443",
		name: "Sovereign Lens of the Stars",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5072,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it overrides basic physics within a 30-foot radius.",
		flavor: "Denies the dimensional divide. An ancient symphony of violence.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0444",
		name: "Nether Wand of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 6,
		value: 87,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Denies the arrogant and the mighty. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0445",
		name: "Nether Helm of the Monarch",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
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
		weight: 6,
		value: 276,
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
		id: "sys-exp-item-0446",
		name: "Crystal Greaves of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
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
		weight: 9,
		value: 1097,
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
		id: "sys-exp-item-0447",
		name: "Nether Plate of the Abyss",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20082,
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
		id: "sys-exp-item-0448",
		name: "Echo Whip of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		weight: 10,
		value: 1031,
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
		id: "sys-exp-item-0449",
		name: "Shadow Helm of Eternity",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
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
		value: 20050,
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
		id: "sys-exp-item-0450",
		name: "Blood Wand of Space",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 3,
		value: 103,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Cleanses the remnants of humanity. A subtle surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0451",
		name: "Plasma Band of Time",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0009.webp",
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
		attunement: false,
		weight: 6,
		value: 237,
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
		id: "sys-exp-item-0452",
		name: "Celestial Necklace of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 3,
		value: 20089,
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
		id: "sys-exp-item-0453",
		name: "Sovereign Sword of Annihilation",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 10,
		value: 75,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Silence of the Oracle, this power resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. A brutal symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0454",
		name: "Void Mantle of the Demon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 9,
		value: 20077,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by an ancient Guild Master. Utilizing it taxes the user's Mana circuits heavily.",
		flavor:
			"Cleanses the fragile limits of flesh. An intricate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0455",
		name: "Aether Crossbow of the Monarch",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
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
		value: 292,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor: "Weaves the dimensional divide. A subtle symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0456",
		name: "Blood Boots of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 10,
		value: 67,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Cleanses the remnants of humanity. A subtle dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0457",
		name: "Nether Plate of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 9,
		value: 5051,
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
		id: "sys-exp-item-0458",
		name: "Rift Greaves of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
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
		attunement: true,
		weight: 6,
		value: 1048,
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
		id: "sys-exp-item-0459",
		name: "Aether Helm of Silence",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		weight: 2,
		value: 5089,
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
		id: "sys-exp-item-0460",
		name: "Monarch's Plate of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20013,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of an apex-class Awakened. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Denies the fragile limits of flesh. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0461",
		name: "Blood Helm of Time",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 20093,
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
		id: "sys-exp-item-0462",
		name: "Quantum Halberd of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 1,
		value: 1093,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Destroys the arrogant and the mighty. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0463",
		name: "Blood Prism of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 6,
		value: 235,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Weaves the flow of time itself. A relentless testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0464",
		name: "Echo Mace of the Dragon",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 2,
		value: 89,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by Dimensional Scavengers. Utilizing it creates a vacuum in ambient mana fields.",
		flavor:
			"Reclaims the quiet space between breaths. A devastating roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0465",
		name: "System Cloak of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 7,
		value: 71,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Phantom Class anomalies who perished in the Day of Falling Stars, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the architect's design. A devastating death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0466",
		name: "Null Cube of the Monarch",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 3,
		value: 20042,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Abyssal Influx, this power disrupts a Hunter's innate mana perception.",
		flavor: "Bends the concept of defeat. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0467",
		name: "Sovereign Mace of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 1,
		value: 1004,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Shatters the remnants of humanity. A brutal dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0468",
		name: "Ethereal Glaive of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20073,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Weaves all who stand in opposition. A relentless beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0469",
		name: "Astral Plate of the Phoenix",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
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
		weight: 5,
		value: 206,
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
		id: "sys-exp-item-0470",
		name: "Echo Signet of the Stars",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 1,
		value: 5073,
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
		id: "sys-exp-item-0471",
		name: "Sovereign Helm of Eternity",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 5,
		value: 124,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Reflects the flow of time itself. A silent testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0472",
		name: "Dread Prism of the Abyss",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
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
		weight: 1,
		value: 299,
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
		id: "sys-exp-item-0473",
		name: "Void Blade of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 2,
		value: 69,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Day of Falling Stars, this technique was pioneered by Rogue Protocol entities. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Destroys the flow of time itself. A desperate testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0474",
		name: "Rift Choker of Silence",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 2,
		value: 243,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Ignites the remnants of humanity. An ancient surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0475",
		name: "Nexus Helm of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 5,
		value: 284,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Shatters the arrogant and the mighty. A chaotic whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0476",
		name: "Chaos Amulet of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 1,
		value: 85,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by a forgotten Regent. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor: "Destroys the architect's design. A desperate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0477",
		name: "Aether Whip of the Demon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 slashing** damage. Properties: *finesse, reach*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
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
		weight: 7,
		value: 284,
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
		id: "sys-exp-item-0478",
		name: "Void Blade of Blood",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20023,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it resonates with the hum of raw magical energy.",
		flavor: "Absorbs the dimensional divide. An ancient symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0479",
		name: "Dread Lens of Space",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		weight: 9,
		value: 216,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor: "Cleanses the darkness within. A forbidden ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0480",
		name: "Ethereal Mantle of the Phoenix",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		value: 5019,
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
		id: "sys-exp-item-0481",
		name: "Dread Staff of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 5,
		value: 20050,
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
		id: "sys-exp-item-0482",
		name: "Monarch's Sword of the System",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: false,
		weight: 3,
		value: 1010,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an apex-class Awakened who perished in the Eclipse Protocol, this power disrupts a Hunter's innate mana perception.",
		flavor: "Commands the architect's design. A desperate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0483",
		name: "Nether Helm of Shadows",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1048,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Silence of the Oracle, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the fragile limits of flesh. An intricate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0484",
		name: "Iron Cube of Silence",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 8,
		value: 66,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it leaves temporal scars on reality.",
		flavor:
			"Ignites the fragile limits of flesh. A triumphant breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0485",
		name: "Gate Signet of the Monarch",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0010.webp",
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
		attunement: false,
		weight: 4,
		value: 256,
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
		id: "sys-exp-item-0486",
		name: "Echo Robes of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 10,
		value: 124,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Destroys the arrogant and the mighty. A triumphant whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0487",
		name: "Abyssal Halberd of Shadows",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 20032,
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
		id: "sys-exp-item-0488",
		name: "Plasma Lens of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 2,
		value: 119,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by an apex-class Awakened. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Weaves the quiet space between breaths. An absolute roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0489",
		name: "Iron Leather of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants immunity to the frightened condition.",
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
		weight: 6,
		value: 5039,
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
		id: "sys-exp-item-0490",
		name: "Null Mace of the Void",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
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
		weight: 4,
		value: 5008,
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
		id: "sys-exp-item-0491",
		name: "Order Bow of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 9,
		value: 143,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of an ancient Guild Master. Activating it taxes the user's Mana circuits heavily.",
		flavor: "Ignites the architect's design. A triumphant death of hesitation.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0492",
		name: "Echo Signet of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20007,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an ancient Guild Master who perished in the First Void Fracture, this power leaves temporal scars on reality.",
		flavor:
			"Reflects the quiet space between breaths. An overwhelming death of hesitation.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0493",
		name: "Sovereign Halberd of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 5,
		value: 1037,
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
		id: "sys-exp-item-0494",
		name: "Plasma Helm of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 4,
		value: 1017,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of Phantom Class anomalies. Activating it overrides basic physics within a 30-foot radius.",
		flavor:
			"Denies the darkness within. An ancient breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0495",
		name: "Crystal Scythe of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **2d4 slashing** damage. Properties: *reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: false,
		weight: 1,
		value: 1016,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Reflects the remnants of humanity. A chaotic dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0496",
		name: "Sovereign Cube of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 20065,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor: "Overrides the architect's design. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0497",
		name: "Obsidian Sword of Eternity",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
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
		weight: 7,
		value: 20044,
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
		id: "sys-exp-item-0498",
		name: "Order Shield of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
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
		weight: 9,
		value: 220,
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
		id: "sys-exp-item-0499",
		name: "Crystal Greaves of the Dragon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 4,
		value: 20054,
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
		id: "sys-exp-item-0500",
		name: "Order Crown of the Abyss",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 6,
		value: 64,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Shatters the arrogant and the mighty. A chaotic beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0501",
		name: "Void Signet of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: false,
		weight: 5,
		value: 213,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Manifestation Event, this power taxes the user's Mana circuits heavily.",
		flavor: "Absorbs the dimensional divide. A sorrowful symphony of violence.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0502",
		name: "Ethereal Helm of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 3,
		value: 20006,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Denies the darkness within. A chaotic breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0503",
		name: "Chaos Signet of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 20023,
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
		id: "sys-exp-item-0504",
		name: "Void Dagger of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 6,
		value: 1017,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the First Void Fracture, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Ignores all who stand in opposition. A devastating whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0505",
		name: "Obsidian Glaive of the System",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5072,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a forgotten Regent. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Bends the remnants of humanity. An absolute dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0506",
		name: "Abyssal Robes of the System",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: false,
		weight: 10,
		value: 299,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Day of Falling Stars, this ability bypasses standard biological limits and forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Ignites the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0507",
		name: "Astral Blade of the Stars",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 20079,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a forgotten Regent who perished in the Crimson Incursion, this power disrupts a Hunter's innate mana perception.",
		flavor:
			"Crushes the remnants of humanity. An intricate surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0508",
		name: "Astral Plate of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		value: 20057,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Ignores the darkness within. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0509",
		name: "Iron Plate of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 10,
		value: 20033,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the First Void Fracture, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Reclaims the dimensional divide. A devastating testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0510",
		name: "Iron Spear of Blood",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
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
		weight: 3,
		value: 5040,
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
		id: "sys-exp-item-0511",
		name: "Crystal Boots of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 9,
		value: 20082,
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
		id: "sys-exp-item-0512",
		name: "Blood Leather of Silence",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 5043,
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
		id: "sys-exp-item-0513",
		name: "Aether Robes of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 3,
		value: 20065,
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
		id: "sys-exp-item-0514",
		name: "Order Bow of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1075,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it resonates with the hum of raw magical energy.",
		flavor: "Absorbs the flow of time itself. An ancient symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0515",
		name: "Shadow Staff of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: *versatile (1d8), spell focus*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5056,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by Phantom Class anomalies. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor:
			"Weaves the fragile limits of flesh. An absolute ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0516",
		name: "Celestial Belt of the Abyss",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 7,
		value: 5089,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor:
			"Cleanses the concept of defeat. A subtle dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0517",
		name: "Iron Mace of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 5029,
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
		id: "sys-exp-item-0518",
		name: "Chaos Lens of Space",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: true,
		weight: 1,
		value: 226,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Commands the flow of time itself. A triumphant symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0519",
		name: "Monarch's Amulet of Time",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 4,
		value: 233,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Manifestation Event, this power leaves temporal scars on reality.",
		flavor:
			"Crushes the quiet space between breaths. A desperate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0520",
		name: "Nether Leather of Annihilation",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: false,
		weight: 8,
		value: 1035,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by Phantom Class anomalies. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Commands the quiet space between breaths. A desperate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0521",
		name: "Monarch's Necklace of the Phoenix",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 2,
		value: 1054,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and leaves a trail of shadowy distortion in physical space.",
		flavor: "Destroys the darkness within. A triumphant ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0522",
		name: "System Halberd of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
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
		attunement: false,
		weight: 8,
		value: 1092,
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
		id: "sys-exp-item-0523",
		name: "Luminous Greaves of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 7,
		value: 5062,
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
		id: "sys-exp-item-0524",
		name: "Null Gauntlets of the Phoenix",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *finesse, unarmed strike focus*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
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
		attunement: false,
		weight: 7,
		value: 274,
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
		id: "sys-exp-item-0525",
		name: "Aether Amulet of the Stars",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: false,
		weight: 8,
		value: 123,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by an apex-class Awakened. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Cleanses the concept of defeat. An intricate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0526",
		name: "Blood Glaive of the Demon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 2,
		value: 81,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor: "Reclaims the architect's design. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0527",
		name: "Shadow Gauntlets of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to AC."],
		},
		attunement: false,
		weight: 1,
		value: 235,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Mana Awakening, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor: "Weaves the darkness within. A subtle breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0528",
		name: "Sovereign Choker of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		weight: 8,
		value: 1013,
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
		id: "sys-exp-item-0529",
		name: "Luminous Mantle of the System",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: true,
		weight: 7,
		value: 1077,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Regent Wars, this power overrides basic physics within a 30-foot radius.",
		flavor: "Bends the architect's design. An absolute death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0530",
		name: "Luminous Hammer of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
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
		weight: 10,
		value: 235,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Azure Gate Collapse, this power forces agonizing metabolic sacrifice to maintain.",
		flavor: "Bends the flow of time itself. An intricate symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0531",
		name: "Aether Sword of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		value: 20085,
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
		id: "sys-exp-item-0532",
		name: "Sovereign Dagger of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
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
		weight: 6,
		value: 226,
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
		id: "sys-exp-item-0533",
		name: "Monarch's Mantle of the Abyss",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
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
		weight: 1,
		value: 5024,
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
		id: "sys-exp-item-0534",
		name: "Nether Plate of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0007.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 4,
		value: 20036,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Manifestation Event, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the darkness within. A relentless breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0535",
		name: "Crystal Choker of the Monarch",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: false,
		weight: 5,
		value: 1053,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Abyssal Influx, this power leaves a trail of shadowy distortion in physical space.",
		flavor: "Shatters the architect's design. A brutal death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0536",
		name: "Void Wand of Silence",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 5014,
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
		id: "sys-exp-item-0537",
		name: "Order Necklace of the Demon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants immunity to the frightened condition.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5040,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Day of Falling Stars, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignores the dimensional divide. A relentless symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0538",
		name: "Nexus Signet of Shadows",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		value: 5093,
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
		id: "sys-exp-item-0539",
		name: "Abyssal Signet of the Phoenix",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 5,
		value: 5076,
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
		id: "sys-exp-item-0540",
		name: "Celestial Mace of the Monarch",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d6 bludgeoning** damage. Properties: **. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 3,
		value: 5029,
		source: "System Ascendant Expansion",
		lore: "First recorded during the First Void Fracture, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor: "Denies the dimensional divide. A chaotic symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0541",
		name: "Crystal Necklace of Space",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 10,
		value: 1009,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and creates a vacuum in ambient mana fields.",
		flavor:
			"Shatters the concept of defeat. A chaotic dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0542",
		name: "Void Axe of the Dragon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants resistance to necrotic damage.",
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
		value: 5039,
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
		id: "sys-exp-item-0543",
		name: "Astral Greaves of the Demon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 3,
		value: 1078,
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
		id: "sys-exp-item-0544",
		name: "Echo Hammer of the Angel",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 6,
		value: 20002,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Eclipse Protocol, this technique was pioneered by Phantom Class anomalies. Utilizing it overrides basic physics within a 30-foot radius.",
		flavor:
			"Weaves the flow of time itself. An absolute testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0545",
		name: "Sovereign Helm of the Demon",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Grants resistance to psychic damage.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
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
		weight: 3,
		value: 5095,
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
		id: "sys-exp-item-0546",
		name: "Shadow Crown of Annihilation",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
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
		attunement: false,
		weight: 3,
		value: 1099,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Azure Gate Collapse, this phenomenon is often linked to the presence of a forgotten Regent. Activating it causes the user's eyes to glow with unnatural light.",
		flavor: "Ignites the architect's design. An ancient death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0547",
		name: "System Crossbow of Eternity",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: true,
		weight: 9,
		value: 104,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Resonance Cascade, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor: "Crushes the darkness within. A desperate ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0548",
		name: "Monarch's Pendant of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0018.webp",
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
		weight: 9,
		value: 237,
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
		id: "sys-exp-item-0549",
		name: "Quantum Mantle of the System",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
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
		weight: 6,
		value: 1085,
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
		id: "sys-exp-item-0550",
		name: "Plasma Prism of the Void",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: false,
		weight: 3,
		value: 64,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and resonates with the hum of raw magical energy.",
		flavor: "Reflects the architect's design. A chaotic roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0551",
		name: "Blood Glaive of the Monarch",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		value: 5028,
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
		id: "sys-exp-item-0552",
		name: "System Gauntlets of Eternity",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
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
		attunement: true,
		weight: 9,
		value: 1002,
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
		id: "sys-exp-item-0553",
		name: "Astral Choker of the Angel",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 10,
		value: 1035,
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
		id: "sys-exp-item-0554",
		name: "Iron Greaves of Shadows",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
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
		weight: 1,
		value: 5051,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Eclipse Protocol, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor: "Reflects the darkness within. A silent ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0555",
		name: "Plasma Mail of the Abyss",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
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
		attunement: false,
		weight: 8,
		value: 290,
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
		id: "sys-exp-item-0556",
		name: "Gate Gauntlets of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 5,
		value: 119,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an ancient Guild Master who perished in the Manifestation Event, this power leaves temporal scars on reality.",
		flavor:
			"Denies all who stand in opposition. A brutal whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0557",
		name: "Null Plate of Time",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants immunity to the frightened condition."],
		},
		attunement: false,
		weight: 8,
		value: 91,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of Dimensional Scavengers. Activating it overrides basic physics within a 30-foot radius.",
		flavor: "Reclaims the concept of defeat. A silent surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0558",
		name: "Nexus Bow of the Void",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **1d8 piercing** damage. Properties: *ammunition (range 150/600), heavy, two-handed*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants advantage on Initiative rolls.",
			],
		},
		attunement: true,
		weight: 2,
		value: 5075,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it leaves temporal scars on reality.",
		flavor:
			"Denies the fragile limits of flesh. A chaotic breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0559",
		name: "Obsidian Lens of Shadows",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants advantage on Initiative rolls."],
		},
		attunement: false,
		weight: 7,
		value: 90,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the flow of time itself. A relentless symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0560",
		name: "Crystal Robes of Blood",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 8,
		value: 20057,
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
		id: "sys-exp-item-0561",
		name: "Obsidian Greaves of Eternity",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 9,
		value: 254,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignores the quiet space between breaths. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0562",
		name: "Quantum Gauntlets of Time",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0009.webp",
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
		weight: 1,
		value: 257,
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
		id: "sys-exp-item-0563",
		name: "Sovereign Sword of the Angel",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 3,
		value: 20080,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of high-tier Rift beasts who perished in the Day of Falling Stars, this power taxes the user's Mana circuits heavily.",
		flavor: "Destroys the architect's design. A desperate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0564",
		name: "Blood Gauntlets of Silence",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0001.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20049,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of the Architect's rogue subroutines. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Ignores the fragile limits of flesh. A relentless breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0565",
		name: "Aether Necklace of the System",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
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
		weight: 7,
		value: 224,
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
		id: "sys-exp-item-0566",
		name: "Dread Signet of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
			],
		},
		attunement: true,
		weight: 7,
		value: 20013,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of an ancient Guild Master who perished in the Regent Wars, this power leaves temporal scars on reality.",
		flavor:
			"Commands the darkness within. A desperate breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Critical Warning: Unregistered variable isolated. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0567",
		name: "Quantum Robes of the Demon",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: true,
		weight: 4,
		value: 5025,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Silence of the Oracle, this ability bypasses standard biological limits and disrupts a Hunter's innate mana perception.",
		flavor:
			"Cleanses the fragile limits of flesh. A forbidden ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0568",
		name: "Void Shield of Silence",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **+2**. Properties: *Requires 1 hand.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0005.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants immunity to the frightened condition.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
			],
		},
		attunement: true,
		weight: 1,
		value: 20018,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Reflects the fragile limits of flesh. A silent breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0569",
		name: "Gate Dagger of the Void",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d4 piercing** damage. Properties: *finesse, light, thrown (range 20/60)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 8,
		value: 5012,
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
		id: "sys-exp-item-0570",
		name: "Crystal Signet of Silence",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 7,
		value: 72,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Resonance Cascade, this power creates a vacuum in ambient mana fields.",
		flavor:
			"Destroys the dimensional divide. A sorrowful symphony of violence.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0571",
		name: "Celestial Buckler of the Phoenix",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **+1**. Properties: *Leaves hand free for somatic components.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		value: 1079,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Crimson Incursion, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Weaves the fragile limits of flesh. A subtle breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0572",
		name: "Shadow Wand of the Dragon",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This weapon hits with brutal kinetic force dealing **1d4 bludgeoning** damage. Properties: *spell focus, light*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0012.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 20020,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Silence of the Oracle, this power overrides basic physics within a 30-foot radius.",
		flavor: "Crushes the architect's design. A desperate death of hesitation.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0573",
		name: "Ethereal Greaves of Time",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants immunity to the frightened condition.",
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
		value: 1087,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Mana Awakening, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor: "Ignites the architect's design. An ancient roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0574",
		name: "Blood Choker of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0003.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 9,
		value: 1023,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Manifestation Event, this technique was pioneered by a Sovereign of the Void. Utilizing it disrupts a Hunter's innate mana perception.",
		flavor:
			"Shatters the concept of defeat. An overwhelming dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0575",
		name: "Iron Greaves of the Monarch",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 6,
		value: 83,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Weaves the quiet space between breaths. A relentless roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0576",
		name: "Order Halberd of the Phoenix",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This weapon hits with brutal kinetic force dealing **1d10 slashing** damage. Properties: *heavy, reach, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: ["System Buff: Grants +2 bonus to attack and damage rolls."],
		},
		attunement: true,
		weight: 2,
		value: 109,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Regent Wars, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor: "Ignites the architect's design. A triumphant roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0577",
		name: "Chaos Mantle of the Stars",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0008.webp",
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
		value: 297,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Abyssal Influx, this phenomenon is often linked to the presence of Rogue Protocol entities. Activating it forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Overrides the flow of time itself. A relentless symphony of violence.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0578",
		name: "Celestial Blade of Time",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0011.webp",
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
		weight: 8,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Dimensional Scavengers who perished in the Eclipse Protocol, this power taxes the user's Mana circuits heavily.",
		flavor:
			"Bends the arrogant and the mighty. An intricate whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0579",
		name: "Ethereal Mantle of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This defensive gear provides Base AC/Bonus: **None**. Properties: *Advantage on saving throws against environmental hazards.*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0020.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants darkvision out to 60 feet.",
			],
		},
		attunement: false,
		weight: 4,
		value: 1013,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor: "Weaves the darkness within. A subtle breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0580",
		name: "Chaos Robes of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0015.webp",
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
		attunement: false,
		weight: 9,
		value: 251,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the First Void Fracture, this ability bypasses standard biological limits and causes the user's eyes to glow with unnatural light.",
		flavor:
			"Commands the arrogant and the mighty. A triumphant beautiful catastrophe.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0581",
		name: "Astral Signet of Blood",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0008.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +2 bonus to attack and damage rolls.",
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
		weight: 7,
		value: 20009,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Regent Wars, this technique was pioneered by the Architect's rogue subroutines. Utilizing it leaves a trail of shadowy distortion in physical space.",
		flavor: "Absorbs the darkness within. A brutal ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0582",
		name: "Blood Band of the Demon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0010.webp",
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
		value: 268,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Reflects the quiet space between breaths. A silent death of hesitation.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0583",
		name: "Null Robes of the Phoenix",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0013.webp",
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
		attunement: false,
		weight: 10,
		value: 222,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Day of Falling Stars, this power resonates with the hum of raw magical energy.",
		flavor:
			"Ignores the remnants of humanity. An absolute surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0584",
		name: "Monarch's Cube of the Angel",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0006.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to AC.",
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants +1 bonus to AC.",
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
		value: 20078,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Azure Gate Collapse, this ability bypasses standard biological limits and overrides basic physics within a 30-foot radius.",
		flavor:
			"Cleanses the remnants of humanity. A forbidden dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0585",
		name: "Dread Tome of the Void",
		description:
			"Developed by top Guild researchers studying concentrated void energy. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0010.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 1,
		value: 1019,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Crimson Incursion, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor:
			"Destroys the dimensional divide. A sorrowful testament to absolute power.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0586",
		name: "Sovereign Blade of Annihilation",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *finesse, light*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
				"System Buff: Grants resistance to necrotic damage.",
			],
		},
		attunement: false,
		weight: 2,
		value: 1011,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Regent Wars, this phenomenon is often linked to the presence of a forgotten Regent. Activating it resonates with the hum of raw magical energy.",
		flavor:
			"Denies the arrogant and the mighty. A chaotic whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0587",
		name: "Obsidian Spear of the Abyss",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d6 piercing** damage. Properties: *thrown (range 20/60), versatile (1d8)*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 10,
		value: 5064,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Mana Awakening, this technique was pioneered by a Sovereign of the Void. Utilizing it causes the user's eyes to glow with unnatural light.",
		flavor:
			"Crushes the concept of defeat. A desperate dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0588",
		name: "Astral Crossbow of the Dragon",
		description:
			"Refined from the crystallized essence of a fallen Regent of the Void. This weapon hits with brutal kinetic force dealing **1d10 piercing** damage. Properties: *ammunition (range 100/400), heavy, loading, two-handed*. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants resistance to fire damage.",
			],
		},
		attunement: true,
		weight: 8,
		value: 1070,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of Rogue Protocol entities who perished in the Mana Awakening, this power overrides basic physics within a 30-foot radius.",
		flavor:
			"Ignores the architect's design. A devastating death of hesitation.",
		mechanics: {
			system_interaction:
				"[Protocol Warden: Hazardous subroutine isolated. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0589",
		name: "Null Necklace of Blood",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "amulet",
		image: "/generated/compendium/items/sys-item-0013.webp",
		effects: {
			passive: [
				"System Buff: Grants darkvision out to 60 feet.",
				"System Buff: Grants advantage on Initiative rolls.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 7,
		value: 5077,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of a Sovereign of the Void who perished in the Eclipse Protocol, this power causes the user's eyes to glow with unnatural light.",
		flavor:
			"Shatters all who stand in opposition. An overwhelming whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0590",
		name: "Luminous Prism of Time",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0017.webp",
		effects: {
			passive: ["System Buff: Grants +1 bonus to attack and damage rolls."],
		},
		attunement: false,
		weight: 5,
		value: 117,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it taxes the user's Mana circuits heavily.",
		flavor:
			"Bends the arrogant and the mighty. A subtle whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0591",
		name: "Chaos Mail of the Abyss",
		description:
			"An anomaly in the System's mana distribution network, crystallized over decades. This defensive gear provides Base AC/Bonus: **16**. Properties: *Disadvantage on Stealth. Str 13 required.*. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0016.webp",
		effects: {
			passive: [
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
				"System Buff: Grants resistance to necrotic damage.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
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
		value: 20043,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Silence of the Oracle, this phenomenon is often linked to the presence of a forgotten Regent. Activating it disrupts a Hunter's innate mana perception.",
		flavor:
			"Denies all who stand in opposition. A chaotic whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0592",
		name: "Blood Amulet of the Void",
		description:
			"Forged in the heart of a collapsing C-Rank dimensional rift. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a legendary artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "legendary",
		type: "ring",
		image: "/generated/compendium/items/sys-item-0019.webp",
		effects: {
			passive: [
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants +1 bonus to attack and damage rolls.",
				"System Buff: Grants darkvision out to 60 feet.",
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
		weight: 6,
		value: 20057,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Mana Awakening, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Reclaims the fragile limits of flesh. A devastating breaking point of the world.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0593",
		name: "Astral Lens of the Demon",
		description:
			"A manifestation of pure System authority, designed to bypass mortal limitations. When equipped, the wearer feels an immediate surge of System Mana integrating into their neural network. As a rare artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "rare",
		type: "wondrous",
		image: "/generated/compendium/items/sys-item-0009.webp",
		effects: {
			passive: [
				"System Buff: Grants resistance to fire damage.",
				"System Buff: Grants +1 bonus to AC.",
			],
		},
		attunement: true,
		weight: 2,
		value: 1093,
		source: "System Ascendant Expansion",
		lore: "Originating from the aftermath of the Azure Gate Collapse, this technique was pioneered by Dimensional Scavengers. Utilizing it leaves temporal scars on reality.",
		flavor: "Bends the architect's design. An intricate roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0594",
		name: "Dread Sword of Space",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This weapon hits with brutal kinetic force dealing **1d8 slashing** damage. Properties: *versatile (1d10)*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: false,
		weight: 7,
		value: 255,
		source: "System Ascendant Expansion",
		lore: "Translated from the combat data of the Architect's rogue subroutines who perished in the Resonance Cascade, this power forces agonizing metabolic sacrifice to maintain.",
		flavor:
			"Shatters the concept of defeat. An overwhelming surge of lethal intent.",
		mechanics: {
			system_interaction:
				"[Alert: S-Rank protocol isolated. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0595",
		name: "Blood Greaves of Annihilation",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Increases movement speed by 5ft.*. As a epic artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "epic",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0018.webp",
		effects: {
			passive: [
				"System Buff: Grants +2 bonus to attack and damage rolls.",
				"System Buff: Grants advantage on Protocol checks (saving throws) against illusions.",
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
		weight: 8,
		value: 5032,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Manifestation Event, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor: "Weaves the fragile limits of flesh. A subtle ultimate equalizer.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0596",
		name: "Quantum Hammer of Shadows",
		description:
			"A tactical asset optimized for modern urban awakening zones by rogue engineers. This weapon hits with brutal kinetic force dealing **2d6 bludgeoning** damage. Properties: *heavy, two-handed*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "weapon",
		image: "/generated/compendium/items/sys-item-0002.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 1,
		value: 90,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignites all who stand in opposition. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0597",
		name: "Plasma Robes of the Void",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **10 + Dex modifier**. Properties: *Unarmored defense. Mana flow increased.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants darkvision out to 60 feet."],
		},
		attunement: true,
		weight: 7,
		value: 140,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Eclipse Protocol, this phenomenon is often linked to the presence of high-tier Rift beasts. Activating it creates a vacuum in ambient mana fields.",
		flavor:
			"Ignites all who stand in opposition. An ancient whisper in the shadows.",
		mechanics: {
			system_interaction:
				"[Fatal Error: S-Rank protocol detected. Combat parameters updated.]",
		},
	},
	{
		id: "sys-exp-item-0598",
		name: "Null Leather of the Phoenix",
		description:
			"Salvaged by an S-Rank hunter from the depths of the Abyssal gates. This defensive gear provides Base AC/Bonus: **11 + Dex modifier**. Properties: *Light armor.*. As a uncommon artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "uncommon",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0011.webp",
		effects: {
			passive: ["System Buff: Grants resistance to fire damage."],
		},
		attunement: true,
		weight: 5,
		value: 204,
		source: "System Ascendant Expansion",
		lore: "First recorded during the Resonance Cascade, this phenomenon is often linked to the presence of a Sovereign of the Void. Activating it leaves temporal scars on reality.",
		flavor:
			"Destroys the flow of time itself. A triumphant symphony of violence.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
	{
		id: "sys-exp-item-0599",
		name: "Echo Plate of Silence",
		description:
			"Developed by top Guild researchers studying concentrated void energy. This defensive gear provides Base AC/Bonus: **18**. Properties: *Disadvantage on Stealth. Str 15 required.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0004.webp",
		effects: {
			passive: ["System Buff: Grants resistance to necrotic damage."],
		},
		attunement: true,
		weight: 10,
		value: 144,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Abyssal Influx, this ability bypasses standard biological limits and leaves temporal scars on reality.",
		flavor:
			"Ignites the concept of defeat. A triumphant dance performed on the edge of a blade.",
		mechanics: {
			system_interaction:
				"[Warning: Hazardous subroutine detected. Mana integration successful.]",
		},
	},
	{
		id: "sys-exp-item-0600",
		name: "Luminous Gauntlets of Time",
		description:
			"Translated from an ancient Monarch's combat protocol during the First Awakening. This defensive gear provides Base AC/Bonus: **None**. Properties: *Prevents disarming.*. As a common artifact, the System has cataloged it as highly valuable for Hunters facing high-rank dungeon threats.",
		rarity: "common",
		type: "armor",
		image: "/generated/compendium/items/sys-item-0014.webp",
		effects: {
			passive: [
				"System Buff: Grants the ability to sense nearby rifts within 1 mile.",
			],
		},
		attunement: true,
		weight: 7,
		value: 50,
		source: "System Ascendant Expansion",
		lore: "A manifestation of raw System authority discovered after the Resonance Cascade, this ability bypasses standard biological limits and taxes the user's Mana circuits heavily.",
		flavor:
			"Reclaims the quiet space between breaths. A silent roar of raw mana.",
		mechanics: {
			system_interaction:
				"[Notice: Unregistered variable detected. Immediate caution advised.]",
		},
	},
];
