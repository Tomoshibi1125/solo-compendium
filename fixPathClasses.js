const fs = require('fs');

const powersPath = 'C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/powers-supplemental.ts';
let powers = fs.readFileSync(powersPath, 'utf8');

// Shadow Strike: remove Stalker
powers = powers.replace(/id:\s*"power-sup-1-7-shadow-strike",\s*classes:\s*\["Assassin",\s*"Stalker"\]/, 'id: "power-sup-1-7-shadow-strike",\n\t\tclasses: ["Assassin"]');

// Sacrifice Engine: remove Contractor
powers = powers.replace(/id:\s*"power-sup-8-3-sacrifice-engine",\s*classes:\s*\["Contractor"\]/, 'id: "power-sup-8-3-sacrifice-engine",\n\t\tclasses: []');

// Cursed Blade Edge: remove Contractor
powers = powers.replace(/id:\s*"power-sup-2-29-cursed-blade-edge",\s*classes:\s*\["Contractor"\]/, 'id: "power-sup-2-29-cursed-blade-edge",\n\t\tclasses: []');

// Dissonant Strike: remove Idol
powers = powers.replace(/id:\s*"power-sup-2-41-dissonant-strike",\s*classes:\s*\["Idol"\]/, 'id: "power-sup-2-41-dissonant-strike",\n\t\tclasses: []');

// Encore Performance: remove Idol
powers = powers.replace(/id:\s*"power-sup-6-34-encore-performance",\s*classes:\s*\["Idol"\]/, 'id: "power-sup-6-34-encore-performance",\n\t\tclasses: []');

fs.writeFileSync(powersPath, powers, 'utf8');


const techPath = 'C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/techniques.ts';
let tech = fs.readFileSync(techPath, 'utf8');

// Harmonic Counter: remove Assassin
tech = tech.replace(/id:\s*"tech-17",\s*classes:\s*\["Stalker",\s*"Assassin"\]/, 'id: "tech-17",\n\t\tclasses: ["Stalker"]');

// Pact Blade: remove Contractor
tech = tech.replace(/id:\s*"tech-18",\s*classes:\s*\["Contractor"\]/, 'id: "tech-18",\n\t\tclasses: []');

// Eldritch Riposte: remove Contractor
tech = tech.replace(/id:\s*"tech-19",\s*classes:\s*\["Contractor"\]/, 'id: "tech-19",\n\t\tclasses: []');

// Rhythmic Strike: remove Idol
tech = tech.replace(/id:\s*"tech-20",\s*classes:\s*\["Idol"\]/, 'id: "tech-20",\n\t\tclasses: []');

// Resonance Slash: remove Idol
tech = tech.replace(/id:\s*"tech-21",\s*classes:\s*\["Idol"\]/, 'id: "tech-21",\n\t\tclasses: []');

fs.writeFileSync(techPath, tech, 'utf8');

// Also fix Dimensional Anchor mechanics block
const suppPath = 'C:/Users/jjcal/Documents/solo-compendium/src/data/compendium/spells/supplemental.ts';
let supp = fs.readFileSync(suppPath, 'utf8');

supp = supp.replace(
    /name:\s*"Dimensional Anchor"([\s\S]*?)mechanics:\s*\{\s*attack:\s*\{\s*type:\s*"ranged spell attack",\s*range:\s*"120 feet",\s*\}\s*,/g,
    'name: "Dimensional Anchor"$1mechanics: {\n\t\t\tattack: {\n\t\t\t\ttype: "ranged spell attack",\n\t\t\t\trange: "120 feet",\n\t\t\t\tdamage: "4d8",\n\t\t\t\tdamage_type: "force",\n\t\t\t},'
);
fs.writeFileSync(suppPath, supp, 'utf8');

console.log("Done");
