import * as fs from 'fs';
import * as path from 'path';
import { comprehensiveSkills } from '../src/data/compendium/skills-comprehensive';

const featsToCreate = comprehensiveSkills.filter(s => ![
	"dungeon-navigation", 
	"wilderness-survival", 
	"intimidation", 
	"persuasion", 
	"deception", 
	"performance",
	"arcana"
].includes(s.id));

const newlyGeneratedFeats = featsToCreate.map(skill => {
	const feat = {
		id: skill.id.replace('-mastery', '-expert'),
		name: skill.name,
		description: skill.description,
		prerequisites: {
			ability: skill.ability,
			score: 13
		},
		benefits: [
			...skill.benefits.basic,
			...skill.benefits.expert,
			...skill.benefits.master
		],
		mechanics: {
			type: "passive",
			frequency: "at-will"
		},
		flavor: `A deep mastery over ${skill.name.toLowerCase()} that sets you apart from mere amateurs.`,
		source: "System Ascendant Canon"
	};
	return feat;
});

fs.writeFileSync(path.join(process.cwd(), 'new_feats.json'), JSON.stringify(newlyGeneratedFeats, null, 2));
console.log(`Generated ${newlyGeneratedFeats.length} feats.`);
