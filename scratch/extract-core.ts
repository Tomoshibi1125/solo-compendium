import fs from 'fs';
import { powers } from '../src/data/compendium/powers.ts';
import { techniques } from '../src/data/compendium/techniques.ts';

const isUniquePower = (p) => !p.description.startsWith('Strikes for') && !p.description.startsWith('Channels');
const isUniqueTech = (t) => !t.description.startsWith('Strikes for') && !t.description.startsWith('Channels');

// Note: powers and techniques already have supplementals in them, but we can filter by ID. Supplemental ones have id 'power-parity-...' or 'technique-parity-...'
const uniquePowers = powers.filter(p => !p.id.includes('parity') && isUniquePower(p));
const uniqueTechs = techniques.filter(t => !t.id.includes('parity') && isUniqueTech(t));

const powerOut = `import type { CompendiumPower } from '../types/compendium';\n\nexport const powers_core: CompendiumPower[] = ${JSON.stringify(uniquePowers, null, 2)};\n`;
fs.writeFileSync('src/data/compendium/powers-core.ts', powerOut);

const techOut = `import type { CompendiumTechnique } from '../types/compendium';\n\nexport const techniques_core: CompendiumTechnique[] = ${JSON.stringify(uniqueTechs, null, 2)};\n`;
fs.writeFileSync('src/data/compendium/techniques-core.ts', techOut);
console.log('Saved', uniquePowers.length, 'unique powers and', uniqueTechs.length, 'unique techniques.');
