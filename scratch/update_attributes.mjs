import fs from "fs";

let content = fs.readFileSync("src/data/compendium/jobs.ts", "utf-8");

const updates = {
  Berserker: `		abilityScoreImprovements: {
			strength: 2,
			vitality: 1,
		},
		size: "medium",
		speed: 35,
		languages: ["English", "Primordial"],
		darkvision: 60,`,
  Assassin: `		abilityScoreImprovements: {
			agility: 2,
			intelligence: 1,
		},
		size: "medium",
		speed: 40,
		languages: ["English", "Undercommon"],
		darkvision: 120,`,
  Striker: `		abilityScoreImprovements: {
			agility: 2,
			vitality: 1,
		},
		size: "medium",
		speed: 45,
		languages: ["English", "Elvish"],
		darkvision: 60,`,
  Mage: `		abilityScoreImprovements: {
			intelligence: 2,
			sense: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Draconic", "Celestial"],
		darkvision: 60,`,
  Esper: `		abilityScoreImprovements: {
			sense: 2,
			intelligence: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Deep Speech"],
		darkvision: 60,`,
  Revenant: `		abilityScoreImprovements: {
			vitality: 2,
			strength: 1,
		},
		size: "medium",
		speed: 25,
		languages: ["English", "Abyssal"],
		darkvision: 60,`,
  Summoner: `		abilityScoreImprovements: {
			presence: 2,
			intelligence: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Sylvan", "Infernal"],
		darkvision: 60,`,
  Herald: `		abilityScoreImprovements: {
			presence: 2,
			vitality: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Celestial"],
		darkvision: 60,`,
  Contractor: `		abilityScoreImprovements: {
			intelligence: 1,
			presence: 1,
			sense: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Infernal"],
		darkvision: 60,`,
  Stalker: `		abilityScoreImprovements: {
			agility: 2,
			sense: 1,
		},
		size: "medium",
		speed: 35,
		languages: ["English", "Undercommon"],
		darkvision: 90,`,
  "Holy Knight": `		abilityScoreImprovements: {
			strength: 2,
			presence: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Celestial"],
		darkvision: 60,`,
  Technomancer: `		abilityScoreImprovements: {
			intelligence: 2,
			agility: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Binary", "Dwarvish"],
		darkvision: 60,`,
  Idol: `		abilityScoreImprovements: {
			presence: 2,
			agility: 1,
		},
		size: "medium",
		speed: 30,
		languages: ["English", "Sylvan"],
		darkvision: 60,`
};

for (const [jobName, replacement] of Object.entries(updates)) {
  // Regex to match the block starting from abilityScoreImprovements down to darkvision or damage_resistances
  const regexStr = '(name: "' + jobName + '"[\\\\s\\\\S]*?)(abilityScoreImprovements:\\s*\\{[\\\\s\\\\S]*?\\},[\\\\s\\\\S]*?size:\\s*"[^"]+",[\\\\s\\\\S]*?speed:\\s*\\d+,[\\\\s\\\\S]*?languages:\\s*\\[[^\\]]*\\](?:,[\\\\s\\\\S]*?darkvision:\\s*\\d+)?)(,)';
  const blockRegex = new RegExp(regexStr);
  
  if (blockRegex.test(content)) {
    content = content.replace(blockRegex, "$1" + replacement + "$3");
    console.log("Updated " + jobName);
  } else {
    console.log(\`Could not find block for \${jobName}\`);
  }
}

fs.writeFileSync("src/data/compendium/jobs.ts", content);
console.log("Done updating jobs.ts");
