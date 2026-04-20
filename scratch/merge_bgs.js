const fs = require('fs');

const { backgrounds: bg1 } = require('./src/data/compendium/backgrounds.js') || { backgrounds: [] }; // Need to compile to js to require, let's just parse the json or do it differently.
