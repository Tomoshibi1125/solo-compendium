const fs = require('fs');
const path = require('path');
const dir = 'src/data/compendium/runes';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const keysToRemove = [
	'requires_job',
	'requirement_agi',
	'requirement_int',
	'requirement_pre',
	'requirement_sense',
	'requirement_str',
	'requirement_vit',
	'caster_penalty',
	'martial_penalty',
	'caster_requirement_multiplier',
	'martial_requirement_multiplier'
];

const nullsToRemove = [
	'passive_bonuses',
	'can_inscribe_on',
	'inscription_difficulty',
	'discovery_lore'
];

files.forEach(file => {
	const filePath = path.join(dir, file);
	let content = fs.readFileSync(filePath, 'utf8');
	
	keysToRemove.forEach(key => {
		// Match "key": value, with optional trailing space/newline
		const regex = new RegExp(`\\s*"${key}":\\s*(null|\\d+|".*"|\\[\\]),?\\r?\\n?`, 'g');
		content = content.replace(regex, '');
	});
	
	nullsToRemove.forEach(key => {
		// Match "key": null, with optional trailing space/newline
		const regex = new RegExp(`\\s*"${key}":\\s*null,?\\r?\\n?`, 'g');
		content = content.replace(regex, '');
	});
	
	// Clean up trailing commas before closing braces
	content = content.replace(/,\s*}/g, '\n\t}');
	
	fs.writeFileSync(filePath, content);
	console.log(`Cleaned ${file}`);
});
