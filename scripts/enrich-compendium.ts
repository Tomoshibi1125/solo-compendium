import fs from 'node:fs';
import path from 'node:path';

import { spells as rawSpells } from '../src/data/compendium/spells';
import { monsters as rawMonsters } from '../src/data/compendium/monsters';

type SpellRank = 'D' | 'C' | 'B' | 'A' | 'S';

type SpellInput = {
  id: string;
  name: string;
  description: string;
  type: 'Attack' | 'Defense' | 'Utility' | 'Healing';
  rank: SpellRank;
  manaCost: number;
  damage?: number;
  healing?: number;
  image: string;
  effect: string;
  range?: number | { type?: string; value?: number; unit?: string };
  cooldown: number;
  [key: string]: unknown;
};

type LegacyMonster = {
  id: string;
  name: string;
  type: string;
  rank: SpellRank;
  stats?: unknown;
  traits?: unknown;
  actions?: unknown;
  legendary?: unknown;
  lair?: unknown;
  image: string;
  description: string;
  abilities: string[];
  weaknesses: string[];
  hp?: number;
  ac?: number;
  skills?: unknown;
  damageResistances?: unknown;
  damageImmunities?: unknown;
  damageVulnerabilities?: unknown;
  conditionImmunities?: unknown;
  senses?: unknown;
  languages?: unknown;
  xp?: number;
  [key: string]: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const hasNonEmptyString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const rankToCr = (rank: SpellRank): number => {
  switch (rank) {
    case 'D':
      return 1;
    case 'C':
      return 4;
    case 'B':
      return 8;
    case 'A':
      return 13;
    case 'S':
      return 18;
  }
};

const crToProf = (cr: number): number => {
  if (cr <= 4) return 2;
  if (cr <= 8) return 3;
  if (cr <= 12) return 4;
  if (cr <= 16) return 5;
  return 6;
};

const rankToSpellSaveDC = (rank: SpellRank): number => {
  switch (rank) {
    case 'D':
      return 12;
    case 'C':
      return 13;
    case 'B':
      return 14;
    case 'A':
      return 16;
    case 'S':
      return 18;
  }
};

const inferDamageType = (name: string, effect: string): string => {
  const text = `${name} ${effect}`.toLowerCase();
  if (text.includes('shadow') || text.includes('umbral')) return 'necrotic';
  if (text.includes('void') || text.includes('abyss')) return 'force';
  if (text.includes('frost') || text.includes('ice')) return 'cold';
  if (text.includes('infernal') || text.includes('demonic') || text.includes('flame')) return 'fire';
  if (text.includes('thunder') || text.includes('storm') || text.includes('lightning')) return 'lightning';
  if (text.includes('holy') || text.includes('divine') || text.includes('celestial')) return 'radiant';
  return 'arcane';
};

const rankToDice = (rank: SpellRank, kind: 'damage' | 'healing'): string => {
  if (kind === 'healing') {
    switch (rank) {
      case 'D':
        return '1d8';
      case 'C':
        return '2d8';
      case 'B':
        return '3d8';
      case 'A':
        return '4d8';
      case 'S':
        return '6d8';
    }
  }

  switch (rank) {
    case 'D':
      return '2d6';
    case 'C':
      return '3d6';
    case 'B':
      return '5d6';
    case 'A':
      return '7d6';
    case 'S':
      return '10d6';
  }
};

const getMonsterBaselineHP = (rank: SpellRank): number => {
  switch (rank) {
    case 'D':
      return 45;
    case 'C':
      return 85;
    case 'B':
      return 135;
    case 'A':
      return 195;
    case 'S':
      return 285;
  }
};

const getMonsterBaselineAC = (rank: SpellRank): number => {
  switch (rank) {
    case 'D':
      return 12;
    case 'C':
      return 14;
    case 'B':
      return 16;
    case 'A':
      return 18;
    case 'S':
      return 20;
  }
};

const inferMonsterScores = (monsterType: string, rank: SpellRank) => {
  const t = monsterType.toLowerCase();

  const base = {
    strength: 12,
    dexterity: 12,
    constitution: 12,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  };

  if (t.includes('dragon') || t.includes('titan')) {
    base.strength += 6;
    base.constitution += 6;
    base.charisma += 2;
  } else if (t.includes('undead')) {
    base.constitution += 4;
    base.wisdom += 2;
  } else if (t.includes('demon')) {
    base.strength += 4;
    base.charisma += 4;
  } else if (t.includes('elemental')) {
    base.constitution += 4;
    base.dexterity += 2;
  } else if (t.includes('beast')) {
    base.strength += 4;
    base.dexterity += 2;
  } else if (t.includes('humanoid')) {
    base.dexterity += 2;
    base.intelligence += 2;
    base.wisdom += 2;
  }

  const rankBoost = rank === 'D' ? 0 : rank === 'C' ? 2 : rank === 'B' ? 4 : rank === 'A' ? 6 : 8;

  return {
    strength: clamp(base.strength + rankBoost, 6, 30),
    dexterity: clamp(base.dexterity + rankBoost, 6, 30),
    constitution: clamp(base.constitution + rankBoost, 6, 30),
    intelligence: clamp(base.intelligence + Math.floor(rankBoost / 2), 3, 30),
    wisdom: clamp(base.wisdom + Math.floor(rankBoost / 2), 3, 30),
    charisma: clamp(base.charisma + Math.floor(rankBoost / 2), 3, 30),
  };
};

const ensureSpellStructured = (spell: SpellInput) => {
  const out: Record<string, unknown> = { ...spell };

  const damageType = inferDamageType(spell.name, spell.effect);
  const dc = rankToSpellSaveDC(spell.rank);

  const legacyRangeValue =
    typeof spell.range === 'number'
      ? spell.range
      : isRecord(spell.range) && typeof spell.range.value === 'number'
        ? spell.range.value
        : 60;

  if (!isRecord(out.activation)) {
    out.activation = {
      type: 'action',
      cost: 1,
    };
  }

  if (!isRecord(out.duration)) {
    out.duration = {
      type: 'instant',
    };
  }

  if (!isRecord(out.range)) {
    out.range = {
      type: 'distance',
      value: legacyRangeValue,
      unit: 'ft',
    };
  }

  if (!isRecord(out.components)) {
    out.components = {
      verbal: true,
      somatic: true,
      material: false,
      focus: 'Ascendant focus (attuned conduit)',
    };
  }

  if (!isRecord(out.effects)) {
    out.effects = {
      primary: hasNonEmptyString(spell.effect) ? spell.effect : 'Channels ascendant force into a defined outcome.',
    };
  } else if (!hasNonEmptyString((out.effects as any).primary)) {
    (out.effects as any).primary = hasNonEmptyString(spell.effect)
      ? spell.effect
      : 'Channels ascendant force into a defined outcome.';
  }

  const mechanics = isRecord(out.mechanics) ? (out.mechanics as Record<string, unknown>) : null;
  const hasAttack = !!(mechanics && isRecord(mechanics.attack));
  const hasSave = !!(mechanics && isRecord(mechanics.saving_throw));
  const hasHealing = !!(mechanics && isRecord(mechanics.healing));

  if (!mechanics) {
    out.mechanics = {};
  }

  const mechanicsOut = (out.mechanics as Record<string, unknown>);

  if (!hasAttack && !hasSave && !hasHealing) {
    if (spell.type === 'Attack') {
      mechanicsOut.attack = {
        mode: 'ranged',
        resolution: 'spell_attack',
        damage: {
          dice: rankToDice(spell.rank, 'damage'),
          type: damageType,
        },
      };
    } else if (spell.type === 'Healing') {
      mechanicsOut.healing = {
        dice: rankToDice(spell.rank, 'healing'),
        notes: 'Restores vitality; does not remove conditions unless stated.',
      };
    } else {
      mechanicsOut.saving_throw = {
        ability: 'CON',
        dc,
        on_save: 'Half effect or negates secondary impairment (if any).',
      };
    }
  }

  if (!isRecord(out.limitations)) {
    out.limitations = {
      mana_cost: spell.manaCost,
      cooldown: spell.cooldown,
    };
  }

  if (!hasNonEmptyString(out.flavor)) {
    out.flavor = `In the post-reset lattice, ${spell.name} is a repeatable protocol: precise inputs, predictable outcomes, and a price paid in focus.`;
  }

  return out;
};

const ensureMonsterStructured = (monster: LegacyMonster) => {
  const out: Record<string, unknown> = { ...monster };

  const existingStats = isRecord(out.stats) ? (out.stats as Record<string, unknown>) : null;
  const abilityScores = existingStats && isRecord(existingStats.abilityScores)
    ? (existingStats.abilityScores as Record<string, unknown>)
    : null;

  const inferredScores = inferMonsterScores(monster.type, monster.rank);

  const armorClass =
    typeof (existingStats?.armorClass) === 'number'
      ? (existingStats?.armorClass as number)
      : typeof monster.ac === 'number'
        ? monster.ac
        : getMonsterBaselineAC(monster.rank);

  const hitPoints =
    typeof (existingStats?.hitPoints) === 'number'
      ? (existingStats?.hitPoints as number)
      : typeof monster.hp === 'number'
        ? monster.hp
        : getMonsterBaselineHP(monster.rank);

  const cr = typeof (existingStats?.challengeRating) === 'number'
    ? (existingStats?.challengeRating as number)
    : rankToCr(monster.rank);

  const prof = typeof (existingStats?.proficiencyBonus) === 'number'
    ? (existingStats?.proficiencyBonus as number)
    : crToProf(cr);

  out.stats = {
    abilityScores: {
      strength: typeof abilityScores?.strength === 'number' ? (abilityScores.strength as number) : inferredScores.strength,
      dexterity: typeof abilityScores?.dexterity === 'number' ? (abilityScores.dexterity as number) : inferredScores.dexterity,
      constitution:
        typeof abilityScores?.constitution === 'number' ? (abilityScores.constitution as number) : inferredScores.constitution,
      intelligence:
        typeof abilityScores?.intelligence === 'number' ? (abilityScores.intelligence as number) : inferredScores.intelligence,
      wisdom: typeof abilityScores?.wisdom === 'number' ? (abilityScores.wisdom as number) : inferredScores.wisdom,
      charisma: typeof abilityScores?.charisma === 'number' ? (abilityScores.charisma as number) : inferredScores.charisma,
    },
    armorClass,
    hitPoints,
    speed: typeof existingStats?.speed === 'number' ? (existingStats.speed as number) : 30,
    challengeRating: cr,
    proficiencyBonus: prof,
    savingThrows: isRecord(existingStats?.savingThrows) ? (existingStats?.savingThrows as Record<string, unknown>) : {},
  };

  const traits = Array.isArray(out.traits) ? (out.traits as any[]) : null;
  if (!traits || traits.length === 0) {
    out.traits = [
      {
        name: 'Ascendant Physiology',
        description: 'This entity is stabilized by post-reset lattice pressure. It cannot be surprised while conscious and has advantage on checks to resist forced movement.',
        action: 'passive',
        frequency: 'at-will',
      },
      {
        name: `${monster.type} Instinct`,
        description: 'When reduced below half hit points, it enters a surge state until the end of its next turn: its movement increases by 10 feet and its first strike deals extra damage.',
        action: 'passive',
        frequency: 'once-per-day',
      },
    ];
  }

  const actions = Array.isArray(out.actions) ? (out.actions as any[]) : null;
  if (!actions || actions.length === 0) {
    const damageType = inferDamageType(monster.name, monster.description);
    const baseDice = rankToDice(monster.rank, 'damage');
    const bonus = Math.max(0, prof + Math.floor((inferredScores.strength - 10) / 2));

    const abilityActions = Array.isArray(monster.abilities) ? monster.abilities : [];
    const templated = abilityActions.slice(0, 3).map((name, idx) => ({
      name,
      description:
        idx === 0
          ? `Melee Weapon Attack: +${bonus} to hit, reach 5 ft., one target. Hit: ${baseDice} ${damageType} damage.`
          : `Protocol action. The target must succeed on a DC ${rankToSpellSaveDC(monster.rank)} Constitution saving throw or take ${baseDice} ${damageType} damage and suffer a brief impairment (start-of-next-turn).`,
      type: idx === 0 ? 'melee' : 'special',
      attackBonus: idx === 0 ? bonus : undefined,
      damage: baseDice,
      damageType,
      range: idx === 0 ? 5 : 60,
      save: idx === 0 ? undefined : 'Constitution',
      dc: idx === 0 ? undefined : rankToSpellSaveDC(monster.rank),
      recharge: idx === 0 ? 'recharge' : 'short-rest',
      usage: idx === 0 ? 'at-will' : 'recharge',
    }));

    const fallback = {
      name: 'Lattice Strike',
      description: `Melee Weapon Attack: +${bonus} to hit, reach 5 ft., one target. Hit: ${baseDice} ${damageType} damage.`,
      type: 'melee',
      attackBonus: bonus,
      damage: baseDice,
      damageType,
      range: 5,
      recharge: 'recharge',
      usage: 'at-will',
    };

    out.actions = templated.length > 0 ? templated : [fallback];
  }

  return out;
};

const replaceExportedArray = (fileText: string, exportConstName: string, newArrayText: string) => {
  const startToken = `export const ${exportConstName} = [`;
  const start = fileText.indexOf(startToken);
  if (start === -1) {
    throw new Error(`Could not find ${startToken}`);
  }

  const fromArrayStart = start + startToken.length;
  const end = fileText.indexOf('];', fromArrayStart);
  if (end === -1) {
    throw new Error(`Could not find end of export const ${exportConstName} array`);
  }

  return `${fileText.slice(0, start)}export const ${exportConstName} = ${newArrayText};${fileText.slice(end + 2)}`;
};

const formatArray = (value: unknown) => JSON.stringify(value, null, 2);

async function main() {
  const args = new Set(process.argv.slice(2));
  const write = args.has('--write');

  const projectRoot = path.resolve(process.cwd());

  const spellsPath = path.join(projectRoot, 'src', 'data', 'compendium', 'spells.ts');
  const monstersPath = path.join(projectRoot, 'src', 'data', 'compendium', 'monsters.ts');

  const enrichedSpells = (rawSpells as unknown as SpellInput[]).map(ensureSpellStructured);
  const enrichedMonsters = (rawMonsters as LegacyMonster[]).map(ensureMonsterStructured);

  if (!write) {
    process.stdout.write(`Enrichment preview (no files written).\n`);
    process.stdout.write(`- spells: ${enrichedSpells.length}\n`);
    process.stdout.write(`- monsters: ${enrichedMonsters.length}\n`);
    process.stdout.write(`\nRun with --write to apply changes.\n`);
    return;
  }

  const spellsText = fs.readFileSync(spellsPath, 'utf8');
  const monstersText = fs.readFileSync(monstersPath, 'utf8');

  const spellsUpdated = replaceExportedArray(spellsText, 'spells', formatArray(enrichedSpells));
  const monstersUpdated = replaceExportedArray(monstersText, 'monsters', formatArray(enrichedMonsters));

  fs.writeFileSync(spellsPath, spellsUpdated, 'utf8');
  fs.writeFileSync(monstersPath, monstersUpdated, 'utf8');

  process.stdout.write(`Enrichment applied.\n`);
}

main().catch((err) => {
  process.stderr.write(`${String(err)}\n`);
  process.exitCode = 1;
});
