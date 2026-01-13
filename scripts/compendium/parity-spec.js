export const ABILITY_SCORES = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];

export const SKILLS = [
  'Athletics',
  'Acrobatics',
  'Sleight of Hand',
  'Stealth',
  'Investigation',
  'History',
  'Arcana',
  'Nature',
  'Religion',
  'Perception',
  'Insight',
  'Medicine',
  'Survival',
  'Deception',
  'Intimidation',
  'Performance',
  'Persuasion',
];

export const ABILITY_TO_SKILLS = {
  STR: ['Athletics'],
  AGI: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
  VIT: ['Survival', 'Medicine'],
  INT: ['Investigation', 'History', 'Arcana', 'Nature', 'Religion'],
  SENSE: ['Perception', 'Insight', 'Medicine', 'Survival'],
  PRE: ['Deception', 'Intimidation', 'Performance', 'Persuasion'],
};

export const RANK_TO_CR = {
  D: '1/4',
  C: '1/2',
  B: '1',
  A: '5',
  S: '10',
};

export const CR_TO_XP = {
  '0': 0,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
};

export const RANK_TO_SIZE = {
  D: 'small',
  C: 'medium',
  B: 'large',
  A: 'huge',
  S: 'gargantuan',
};

export const RANK_TO_SPEED = {
  D: 25,
  C: 30,
  B: 35,
  A: 40,
  S: 45,
};

export const RARITY_TO_LEVEL = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  very_rare: 4,
  legendary: 5,
};

export function hashString(value) {
  let hash = 2166136261;
  const str = String(value);
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function makeRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function pick(list, rng) {
  if (!list || list.length === 0) return null;
  const idx = Math.floor(rng() * list.length);
  return list[idx];
}

export function pickMany(list, count, rng) {
  const out = [];
  const pool = Array.from(list || []);
  while (pool.length > 0 && out.length < count) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function toTitleCase(value) {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
