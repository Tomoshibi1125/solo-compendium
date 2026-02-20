// VTT Asset Library — Catalogs ALL existing generated images for browsable VTT usage
// All images are project-owned assets in /public/generated/
// Total: 400+ images across all Roll20-equivalent categories

import { monsters } from '@/data/compendium/monsters';
import { locations } from '@/data/compendium/locations';
import { spells } from '@/data/compendium/spells';
import { items } from '@/data/compendium/items';

export type VTTAssetCategory = 'map' | 'monster' | 'portrait' | 'location' | 'effect' | 'spell' | 'prop' | 'condition' | 'item' | 'token' | 'handout' | 'technique';

export interface VTTAsset {
  id: string;
  name: string;
  category: VTTAssetCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  rank?: string;
  description?: string;
}

// ── Premade Battle Maps ──────────────────────────────────────────────────
const PREMADE_MAPS: VTTAsset[] = [
  { id: 'map-arcane-schematic', name: 'Arcane Schematic', category: 'map', imageUrl: '/generated/maps/premade/arcane-schematic.webp', thumbnailUrl: '/generated/maps/premade/arcane-schematic-thumb.webp', tags: ['arcane', 'schematic', 'blueprint', 'dungeon'] },
  { id: 'map-ascendant-capital', name: 'Ascendant Capital', category: 'map', imageUrl: '/generated/maps/premade/ascendant-capital.webp', thumbnailUrl: '/generated/maps/premade/ascendant-capital-thumb.webp', tags: ['city', 'capital', 'urban', 'ascendant'] },
  { id: 'map-ashen-forge-depths', name: 'Ashen Forge Depths', category: 'map', imageUrl: '/generated/maps/premade/ashen-forge-depths.webp', thumbnailUrl: '/generated/maps/premade/ashen-forge-depths-thumb.webp', tags: ['forge', 'fire', 'dungeon', 'depths'] },
  { id: 'map-ashen-forge', name: 'Ashen Forge', category: 'map', imageUrl: '/generated/maps/premade/ashen-forge.webp', thumbnailUrl: '/generated/maps/premade/ashen-forge-thumb.webp', tags: ['forge', 'fire', 'dungeon'] },
  { id: 'map-crystal-caverns', name: 'Crystal Caverns', category: 'map', imageUrl: '/generated/maps/premade/crystal-caverns.webp', thumbnailUrl: '/generated/maps/premade/crystal-caverns-thumb.webp', tags: ['cave', 'crystal', 'cavern', 'underground'] },
  { id: 'map-frostbound-depths', name: 'Frostbound Depths', category: 'map', imageUrl: '/generated/maps/premade/frostbound-depths.webp', thumbnailUrl: '/generated/maps/premade/frostbound-depths-thumb.webp', tags: ['ice', 'frost', 'dungeon', 'depths'] },
  { id: 'map-frostbound-vault', name: 'Frostbound Vault', category: 'map', imageUrl: '/generated/maps/premade/frostbound-vault.webp', thumbnailUrl: '/generated/maps/premade/frostbound-vault-thumb.webp', tags: ['ice', 'frost', 'vault', 'dungeon'] },
  { id: 'map-gate-antechamber', name: 'Gate Antechamber', category: 'map', imageUrl: '/generated/maps/premade/gate-antechamber.webp', thumbnailUrl: '/generated/maps/premade/gate-antechamber-thumb.webp', tags: ['gate', 'rift', 'portal', 'dungeon'] },
  { id: 'map-gatewatch-town', name: 'Gatewatch Town', category: 'map', imageUrl: '/generated/maps/premade/gatewatch-town.webp', thumbnailUrl: '/generated/maps/premade/gatewatch-town-thumb.webp', tags: ['town', 'urban', 'gate', 'settlement'] },
  { id: 'map-inkwash-ruins', name: 'Inkwash Ruins', category: 'map', imageUrl: '/generated/maps/premade/inkwash-ruins.webp', thumbnailUrl: '/generated/maps/premade/inkwash-ruins-thumb.webp', tags: ['ruins', 'ancient', 'ink', 'dungeon'] },
  { id: 'map-rank-e-outpost', name: 'Rank-E Outpost', category: 'map', imageUrl: '/generated/maps/premade/rank-e-outpost.webp', thumbnailUrl: '/generated/maps/premade/rank-e-outpost-thumb.webp', tags: ['outpost', 'e-rank', 'camp', 'starter'] },
  { id: 'map-rank-s-abyss', name: 'Rank-S Abyss', category: 'map', imageUrl: '/generated/maps/premade/rank-s-abyss.webp', thumbnailUrl: '/generated/maps/premade/rank-s-abyss-thumb.webp', tags: ['abyss', 's-rank', 'endgame', 'boss'] },
  { id: 'map-rift-citadel', name: 'Rift Citadel', category: 'map', imageUrl: '/generated/maps/premade/rift-citadel.webp', thumbnailUrl: '/generated/maps/premade/rift-citadel-thumb.webp', tags: ['rift', 'citadel', 'fortress', 'boss'] },
  { id: 'map-rift-keep', name: 'Rift Keep', category: 'map', imageUrl: '/generated/maps/premade/rift-keep.webp', thumbnailUrl: '/generated/maps/premade/rift-keep-thumb.webp', tags: ['rift', 'keep', 'fortress', 'dungeon'] },
  { id: 'map-rift-shrine', name: 'Rift Shrine', category: 'map', imageUrl: '/generated/maps/premade/rift-shrine.webp', thumbnailUrl: '/generated/maps/premade/rift-shrine-thumb.webp', tags: ['rift', 'shrine', 'sacred', 'dungeon'] },
  { id: 'map-sandswept-ruins', name: 'Sandswept Ruins', category: 'map', imageUrl: '/generated/maps/premade/sandswept-ruins.webp', thumbnailUrl: '/generated/maps/premade/sandswept-ruins-thumb.webp', tags: ['desert', 'sand', 'ruins', 'ancient'] },
  { id: 'map-sealed-vault', name: 'Sealed Vault', category: 'map', imageUrl: '/generated/maps/premade/sealed-vault.webp', thumbnailUrl: '/generated/maps/premade/sealed-vault-thumb.webp', tags: ['vault', 'sealed', 'dungeon', 'treasure'] },
  { id: 'map-shadow-crypt', name: 'Shadow Crypt', category: 'map', imageUrl: '/generated/maps/premade/shadow-crypt.webp', thumbnailUrl: '/generated/maps/premade/shadow-crypt-thumb.webp', tags: ['shadow', 'crypt', 'undead', 'dungeon'] },
  { id: 'map-shadow-labyrinth', name: 'Shadow Labyrinth', category: 'map', imageUrl: '/generated/maps/premade/shadow-labyrinth.webp', thumbnailUrl: '/generated/maps/premade/shadow-labyrinth-thumb.webp', tags: ['shadow', 'labyrinth', 'maze', 'dungeon'] },
  { id: 'map-umbral-throne', name: 'Umbral Throne', category: 'map', imageUrl: '/generated/maps/premade/umbral-throne.webp', thumbnailUrl: '/generated/maps/premade/umbral-throne-thumb.webp', tags: ['umbral', 'throne', 'boss', 'endgame'] },
  { id: 'map-veil-garden', name: 'Veil Garden', category: 'map', imageUrl: '/generated/maps/premade/veil-garden.webp', thumbnailUrl: '/generated/maps/premade/veil-garden-thumb.webp', tags: ['garden', 'veil', 'nature', 'fey'] },
  { id: 'map-dungeon-floor', name: 'Dungeon Floor (Tile)', category: 'map', imageUrl: '/generated/maps/dungeon-floor.webp', tags: ['dungeon', 'floor', 'tile', 'generic'] },
  { id: 'map-iron-gate', name: 'Iron Gate (Tile)', category: 'map', imageUrl: '/generated/maps/iron-gate.webp', tags: ['gate', 'iron', 'tile', 'entrance'] },
];

// ── Effects ──────────────────────────────────────────────────────────────
const EFFECTS: VTTAsset[] = [
  { id: 'fx-arcane-glow', name: 'Arcane Glow', category: 'effect', imageUrl: '/generated/effects/arcane-glow.webp', tags: ['arcane', 'glow', 'light', 'magic'] },
  { id: 'fx-arcane-sigil', name: 'Arcane Sigil', category: 'effect', imageUrl: '/generated/effects/arcane-sigil.webp', tags: ['arcane', 'sigil', 'rune', 'magic'] },
  { id: 'fx-blood-splatter', name: 'Blood Splatter', category: 'effect', imageUrl: '/generated/effects/blood-splatter.webp', tags: ['blood', 'damage', 'gore'] },
  { id: 'fx-bright-light', name: 'Bright Light Halo', category: 'effect', imageUrl: '/generated/effects/bright-light-halo.webp', tags: ['light', 'bright', 'halo', 'holy'] },
  { id: 'fx-darkness', name: 'Darkness Shroud', category: 'effect', imageUrl: '/generated/effects/darkness-shroud.webp', tags: ['darkness', 'shadow', 'shroud'] },
  { id: 'fx-dim-light', name: 'Dim Light Halo', category: 'effect', imageUrl: '/generated/effects/dim-light-halo.webp', tags: ['light', 'dim', 'halo'] },
  { id: 'fx-fire-burst', name: 'Fire Burst', category: 'effect', imageUrl: '/generated/effects/fire-burst.webp', tags: ['fire', 'burst', 'explosion'] },
  { id: 'fx-fog-dense', name: 'Dense Fog', category: 'effect', imageUrl: '/generated/effects/fog-of-war-dense.webp', tags: ['fog', 'dense', 'obscure'] },
  { id: 'fx-fog-mist', name: 'Mist', category: 'effect', imageUrl: '/generated/effects/fog-of-war-mist.webp', tags: ['fog', 'mist', 'light'] },
  { id: 'fx-holy-aura', name: 'Holy Aura', category: 'effect', imageUrl: '/generated/effects/holy-aura.webp', tags: ['holy', 'aura', 'divine', 'light'] },
  { id: 'fx-ice-blast', name: 'Ice Blast', category: 'effect', imageUrl: '/generated/effects/ice-blast.webp', tags: ['ice', 'frost', 'blast', 'cold'] },
  { id: 'fx-lantern', name: 'Lantern Glow', category: 'effect', imageUrl: '/generated/effects/lantern-glow.webp', tags: ['lantern', 'light', 'warm'] },
  { id: 'fx-lightning', name: 'Lightning Strike', category: 'effect', imageUrl: '/generated/effects/lightning-strike.webp', tags: ['lightning', 'electric', 'strike'] },
  { id: 'fx-poison', name: 'Poison Cloud', category: 'effect', imageUrl: '/generated/effects/poison-cloud.webp', tags: ['poison', 'cloud', 'toxic'] },
  { id: 'fx-shadow-pool', name: 'Shadow Pool', category: 'effect', imageUrl: '/generated/effects/shadow-pool.webp', tags: ['shadow', 'pool', 'dark', 'umbral'] },
  { id: 'fx-smoke', name: 'Smoke Screen', category: 'effect', imageUrl: '/generated/effects/smoke-screen.webp', tags: ['smoke', 'screen', 'obscure'] },
  { id: 'fx-spotlight', name: 'Spotlight Cone', category: 'effect', imageUrl: '/generated/effects/spotlight-cone.webp', tags: ['spotlight', 'cone', 'light'] },
  { id: 'fx-torch', name: 'Torch Glow', category: 'effect', imageUrl: '/generated/effects/torch-glow.webp', tags: ['torch', 'light', 'warm', 'fire'] },
  { id: 'fx-vision-narrow', name: 'Vision Cone (Narrow)', category: 'effect', imageUrl: '/generated/effects/vision-cone-narrow.webp', tags: ['vision', 'cone', 'narrow', 'stealth'] },
  { id: 'fx-vision-wide', name: 'Vision Cone (Wide)', category: 'effect', imageUrl: '/generated/effects/vision-cone-wide.webp', tags: ['vision', 'cone', 'wide'] },
  { id: 'fx-web', name: 'Web Trap', category: 'effect', imageUrl: '/generated/effects/web-trap.webp', tags: ['web', 'trap', 'spider'] },
];

// ── Props ────────────────────────────────────────────────────────────────
const PROPS: VTTAsset[] = [
  { id: 'prop-ancient-statue', name: 'Ancient Statue', category: 'prop', imageUrl: '/generated/props/ancient-statue.webp', tags: ['statue', 'ancient', 'decoration'] },
  { id: 'prop-arcane-altar', name: 'Arcane Altar', category: 'prop', imageUrl: '/generated/props/arcane-altar.webp', tags: ['altar', 'arcane', 'ritual', 'magic'] },
  { id: 'prop-barrel', name: 'Barrel', category: 'prop', imageUrl: '/generated/props/barrel.webp', tags: ['barrel', 'container', 'storage'] },
  { id: 'prop-bedroll', name: 'Bedroll', category: 'prop', imageUrl: '/generated/props/bedroll.webp', tags: ['bed', 'camp', 'rest'] },
  { id: 'prop-bookshelf', name: 'Bookshelf', category: 'prop', imageUrl: '/generated/props/bookshelf.webp', tags: ['books', 'shelf', 'library'] },
  { id: 'prop-bunk-bed', name: 'Bunk Bed', category: 'prop', imageUrl: '/generated/props/bunk-bed.webp', tags: ['bed', 'bunk', 'barracks'] },
  { id: 'prop-crate-stack', name: 'Crate Stack', category: 'prop', imageUrl: '/generated/props/crate-stack.webp', tags: ['crate', 'storage', 'container'] },
  { id: 'prop-crystal-cluster', name: 'Crystal Cluster', category: 'prop', imageUrl: '/generated/props/crystal-cluster.webp', tags: ['crystal', 'gem', 'treasure', 'magic'] },
  { id: 'prop-chandelier', name: 'Hanging Chandelier', category: 'prop', imageUrl: '/generated/props/hanging-chandelier.webp', tags: ['chandelier', 'light', 'ceiling'] },
  { id: 'prop-obsidian-obelisk', name: 'Obsidian Obelisk', category: 'prop', imageUrl: '/generated/props/obsidian-obelisk.webp', tags: ['obelisk', 'obsidian', 'umbral', 'dark'] },
  { id: 'prop-rift-gate', name: 'Rift Gate Portal', category: 'prop', imageUrl: '/generated/props/rift-gate-portal.webp', tags: ['rift', 'gate', 'portal', 'entrance'] },
  { id: 'prop-rune-circle', name: 'Rune Circle', category: 'prop', imageUrl: '/generated/props/rune-circle.webp', tags: ['rune', 'circle', 'ritual', 'magic'] },
  { id: 'prop-shadow-brazier', name: 'Shadow Brazier', category: 'prop', imageUrl: '/generated/props/shadow-brazier.webp', tags: ['brazier', 'fire', 'shadow', 'light'] },
  { id: 'prop-ritual-table', name: 'Stone Ritual Table', category: 'prop', imageUrl: '/generated/props/stone-ritual-table.webp', tags: ['table', 'stone', 'ritual'] },
  { id: 'prop-treasure-cache', name: 'Treasure Cache', category: 'prop', imageUrl: '/generated/props/treasure-cache.webp', tags: ['treasure', 'loot', 'gold'] },
  { id: 'prop-weapon-rack', name: 'Weapon Rack', category: 'prop', imageUrl: '/generated/props/weapon-rack.webp', tags: ['weapon', 'rack', 'armory'] },
  { id: 'prop-bench', name: 'Wooden Bench', category: 'prop', imageUrl: '/generated/props/wooden-bench.webp', tags: ['bench', 'furniture', 'wood'] },
  { id: 'prop-chair', name: 'Wooden Chair', category: 'prop', imageUrl: '/generated/props/wooden-chair.webp', tags: ['chair', 'furniture', 'wood'] },
  { id: 'prop-table-rect', name: 'Wooden Table (Rect)', category: 'prop', imageUrl: '/generated/props/wooden-table-rect.webp', tags: ['table', 'furniture', 'wood'] },
  { id: 'prop-table-round', name: 'Wooden Table (Round)', category: 'prop', imageUrl: '/generated/props/wooden-table-round.webp', tags: ['table', 'furniture', 'wood', 'round'] },
];

// ── Conditions ───────────────────────────────────────────────────────────
const CONDITIONS: VTTAsset[] = [
  { id: 'cond-essence-drained', name: 'Essence Drained', category: 'condition', imageUrl: '/generated/conditions/essence-drained.webp', tags: ['condition', 'drain', 'debuff'] },
  { id: 'cond-gate-exhausted', name: 'Gate Exhausted', category: 'condition', imageUrl: '/generated/conditions/gate-exhausted.webp', tags: ['condition', 'exhausted', 'gate'] },
  { id: 'cond-regent-marked', name: 'Regent Marked', category: 'condition', imageUrl: '/generated/conditions/monarch-marked.webp', tags: ['condition', 'regent', 'mark'] },
  { id: 'cond-shadow-bound', name: 'Shadow Bound', category: 'condition', imageUrl: '/generated/conditions/shadow-bound.webp', tags: ['condition', 'shadow', 'bound', 'restrained'] },
  { id: 'cond-shadow-corrupted', name: 'Shadow Corrupted', category: 'condition', imageUrl: '/generated/conditions/shadow-corrupted.webp', tags: ['condition', 'shadow', 'corrupt'] },
  { id: 'cond-shadow-fused', name: 'Shadow Fused', category: 'condition', imageUrl: '/generated/conditions/shadow-fused.webp', tags: ['condition', 'shadow', 'fused', 'transform'] },
];

// ── Items ────────────────────────────────────────────────────────────────
const ITEMS: VTTAsset[] = [
  { id: 'item-health-potion', name: 'Health Potion', category: 'item', imageUrl: '/generated/items/health-potion.webp', tags: ['potion', 'health', 'healing'] },
  { id: 'item-mana-potion', name: 'Mana Potion', category: 'item', imageUrl: '/generated/items/mana-potion.webp', tags: ['potion', 'mana', 'magic'] },
  { id: 'item-shadow-armor', name: 'Shadow Armor', category: 'item', imageUrl: '/generated/items/shadow-armor.webp', tags: ['armor', 'shadow', 'equipment'] },
  { id: 'item-shadow-blade', name: 'Shadow Blade', category: 'item', imageUrl: '/generated/items/shadow-blade.webp', tags: ['weapon', 'shadow', 'blade'] },
  { id: 'item-shadow-ring', name: 'Shadow Ring', category: 'item', imageUrl: '/generated/items/shadow-ring.webp', tags: ['ring', 'shadow', 'accessory'] },
  { id: 'item-shadow-scroll', name: 'Shadow Scroll', category: 'item', imageUrl: '/generated/items/shadow-scroll.webp', tags: ['scroll', 'shadow', 'spell'] },
];

// ── Token Templates ──────────────────────────────────────────────────────
const TOKEN_TEMPLATES: VTTAsset[] = [
  { id: 'tpl-boss', name: 'Boss Token Frame', category: 'token', imageUrl: '/generated/tokens/boss-token.webp', tags: ['token', 'boss', 'frame'] },
  { id: 'tpl-guard', name: 'Guard Token Frame', category: 'token', imageUrl: '/generated/tokens/guard-token.webp', tags: ['token', 'guard', 'npc', 'frame'] },
  { id: 'tpl-merchant', name: 'Merchant Token Frame', category: 'token', imageUrl: '/generated/tokens/merchant-token.webp', tags: ['token', 'merchant', 'npc', 'frame'] },
  { id: 'tpl-monster', name: 'Monster Token Frame', category: 'token', imageUrl: '/generated/tokens/monster-token.webp', tags: ['token', 'monster', 'frame'] },
  { id: 'tpl-npc', name: 'NPC Token Frame', category: 'token', imageUrl: '/generated/tokens/npc-token.webp', tags: ['token', 'npc', 'frame'] },
  { id: 'tpl-player', name: 'Player Token Frame', category: 'token', imageUrl: '/generated/tokens/player-token.webp', tags: ['token', 'player', 'character', 'frame'] },
];

// ── Monster Portraits (from compendium) ──────────────────────────────────
const MONSTER_ASSETS: VTTAsset[] = monsters.map((m) => ({
  id: `vtt-${m.id}`,
  name: m.name,
  category: 'monster' as VTTAssetCategory,
  imageUrl: m.image,
  tags: ['monster', (m.rank || '').toLowerCase(), (m.type || '').toLowerCase()].filter(Boolean),
  rank: m.rank,
  description: m.description,
}));

// ── Location Portraits (from compendium — usable as scene art) ───────────
const LOCATION_ASSETS: VTTAsset[] = locations.map((l) => ({
  id: `vtt-${l.id}`,
  name: l.name,
  category: 'location' as VTTAssetCategory,
  imageUrl: l.image,
  tags: ['location', (l.rank || '').toLowerCase(), (l.type || '').toLowerCase()].filter(Boolean),
  rank: l.rank,
  description: l.description,
}));

// ── Portraits — Regents (boss NPC tokens) ───────────────────────────────
const toTitleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const REGENT_PORTRAITS: VTTAsset[] = [
  'berserker-monarch', 'blood-monarch', 'destruction-monarch', 'dragon-monarch',
  'ice-cold-monarch', 'plague-monarch', 'shadow-command-monarch', 'steel-flesh-monarch',
  'umbral-sovereign', 'white-flame-monarch',
].map((fileName) => ({
  id: `portrait-${fileName}`, name: toTitleCase(fileName).replace(/Monarch/g, 'Regent'), category: 'portrait' as VTTAssetCategory,
  imageUrl: `/generated/compendium/monarchs/${fileName}.webp`,
  tags: ['portrait', 'regent', 'boss', 'npc', fileName.split('-')[0]],
}));

// ── Portraits — Jobs (class/archetype tokens) ───────────────────────────
const JOB_PORTRAITS: VTTAsset[] = [
  'artificer', 'assassin', 'bard', 'berserker', 'healer', 'mage', 'monk',
  'necromancer', 'paladin', 'ranger', 'summoner', 'tank', 'warlock', 'warrior',
].map((name) => ({
  id: `portrait-job-${name}`, name: toTitleCase(name), category: 'portrait' as VTTAssetCategory,
  imageUrl: `/generated/compendium/jobs/${name}.webp`,
  tags: ['portrait', 'job', 'class', 'player', name],
}));

// ── Portraits — Backgrounds (character archetype tokens) ─────────────────
const BACKGROUND_PORTRAITS: VTTAsset[] = [
  'ancient-guardian', 'artifact-keeper', 'bringer-of-dawn', 'champion-of-light',
  'cosmic-wanderer', 'demon-hunter', 'dimensional-traveler', 'dragon-slayer',
  'essence-user', 'eternal-watcher', 'forgotten-king', 'gate-survivor',
  'guild-master', 'hunter-academy-graduate', 'monarchs-chosen', 'reality-bender',
  'rune-master', 'shadow-realm-exile', 'shadow-soldier', 'star-born',
  'time-walker', 'void-touched',
].map((fileName) => ({
  id: `portrait-bg-${fileName}`, name: toTitleCase(fileName).replace(/Monarchs/g, 'Regents').replace(/Monarch/g, 'Regent'), category: 'portrait' as VTTAssetCategory,
  imageUrl: `/generated/compendium/backgrounds/${fileName}.webp`,
  tags: ['portrait', 'background', 'character', fileName.split('-')[0]],
}));

// ── Spell Effects (from compendium — usable as spell overlays) ───────────
const SPELL_ASSETS: VTTAsset[] = (spells as { id: string; name: string; image: string; type?: string; rank?: string; description?: string }[]).map((s) => ({
  id: `vtt-${s.id}`,
  name: s.name,
  category: 'spell' as VTTAssetCategory,
  imageUrl: s.image,
  tags: ['spell', (s.type || '').toLowerCase(), (s.rank || '').toLowerCase()].filter(Boolean),
  rank: s.rank,
  description: s.description,
}));

// ── Compendium Items (weapons, armor, consumables — handout art) ─────────
const COMPENDIUM_ITEMS: VTTAsset[] = (items as { id: string; name: string; image: string; rarity?: string; type?: string; description?: string }[]).map((i) => ({
  id: `vtt-${i.id}`,
  name: i.name,
  category: 'item' as VTTAssetCategory,
  imageUrl: i.image,
  tags: ['item', (i.rarity || '').toLowerCase(), (i.type || '').toLowerCase()].filter(Boolean),
  description: i.description,
}));

// ── Artifacts (legendary item handout art) ───────────────────────────────
const ARTIFACT_ITEMS: VTTAsset[] = [
  'chaos-heart', 'destiny-book', 'divine-crown', 'dragon-god-spear', 'eternal-heart',
  'infinity-orb', 'monarch-gauntlets', 'order-crystal', 'reality-weaver',
  'shadow-lord-blade', 'soul-harvester', 'time-master-staff', 'void-armor', 'world-tree-acorn',
].map((fileName) => ({
  id: `artifact-${fileName}`, name: toTitleCase(fileName).replace(/Monarch/g, 'Regent'), category: 'handout' as VTTAssetCategory,
  imageUrl: `/generated/compendium/artifacts/${fileName}.webp`,
  tags: ['artifact', 'legendary', 'handout', fileName.split('-')[0]],
}));

// ── Relics (magic item handout art) ──────────────────────────────────────
const RELIC_ITEMS: VTTAsset[] = [
  'amulet-of-health', 'amulet-of-life-draining', 'amulet-of-proof-against-detection',
  'amulet-of-the-forsaken', 'bag-of-holding', 'boots-of-levitation', 'boots-of-speed',
  'boots-of-striding-and-springing', 'boots-of-winter-wolf', 'bracers-of-archery',
  'bracers-of-defense', 'bracers-of-dexterity', 'bracers-of-mountaineering',
  'bracers-of-weapon-throwing', 'chime-of-opening', 'circlet-of-wisdom',
  'cloak-of-displacement', 'cloak-of-elvenkind', 'cloak-of-protection',
  'cloak-of-the-bat', 'cloak-of-the-manta-ray', 'cloak-of-the-manta-ray-2',
  'crystal-of-clairvoyance', 'decanter-of-endless-water', 'dragonscale-helmet',
  'efficient-quiver', 'eyes-of-minute-seeing', 'eyes-of-the-eagle',
  'gauntlets-of-ogre-power', 'gauntlets-of-the-sky', 'giants-belt',
  'girdle-of-giant-strength', 'gloves-of-swimming-and-climbing', 'gloves-of-thievery',
  'goggles-of-night', 'handy-haversack', 'headband-of-intellect',
  'helm-of-brilliance', 'helm-of-comprehending-languages', 'helm-of-telepathy',
].map((name) => ({
  id: `relic-${name}`, name: toTitleCase(name), category: 'handout' as VTTAssetCategory,
  imageUrl: `/generated/compendium/relics/${name}.webp`,
  tags: ['relic', 'magic-item', 'handout', name.split('-')[0]],
}));

// ── Powers (ability effect overlays) ─────────────────────────────────────
const POWER_EFFECTS: VTTAsset[] = [
  'angelic-wings', 'arcane-ascension', 'arcane-recovery', 'avatar-of-battle',
  'demonic-aura', 'divine-intervention', 'divine-smite', 'dragon-breath',
  'dwarven-resilience', 'fey-charm', 'gaze-of-petrification', 'halfling-luck',
  'holy-aura', 'invisibility', 'ki-point', 'lycanthropy', 'orcish-rage',
  'regeneration', 'shadow-essence', 'shadow-step', 'sneak-attack',
  'telepathy', 'true-sight', 'vampiric-touch', 'wild-shape',
].map((name) => ({
  id: `power-${name}`, name: toTitleCase(name), category: 'effect' as VTTAssetCategory,
  imageUrl: `/generated/compendium/powers/${name}.webp`,
  tags: ['effect', 'power', 'ability', name.split('-')[0]],
}));

// ── Runes (rune effect overlays) ─────────────────────────────────────────
const RUNE_EFFECTS: VTTAsset[] = [
  'assassin-rune', 'blood-rune', 'death-rune', 'fire-rune', 'frost-rune',
  'guardian-rune', 'healing-rune', 'ice-rune', 'life-rune', 'lightning-rune',
  'magma-rune', 'mind-rune', 'protection-rune', 'shadow-rune', 'soul-rune',
  'storm-rune', 'time-rune', 'void-rune', 'war-rune',
].map((name) => ({
  id: `rune-${name}`, name: toTitleCase(name), category: 'effect' as VTTAssetCategory,
  imageUrl: `/generated/runes/${name}.webp`,
  tags: ['effect', 'rune', 'overlay', name.split('-')[0]],
}));

// ── Techniques (combat technique art — usable as spell/ability overlays) ──
const TECHNIQUE_ASSETS: VTTAsset[] = [
  'arcane-overload', 'counter-strike', 'deflect-arrows', 'disarming-strike',
  'divine-execution', 'dragon-fist', 'dragon-slaying-blow', 'grappling-strike',
  'guardian-stance', 'intimidating-presence', 'iron-wall', 'leap-strike',
  'multi-shot', 'phase-walk', 'shadow-bind', 'shadow-dodge',
  'shadow-step-mobility', 'shadow-strike', 'shadow-termination', 'trip-attack',
  'void-annihilation', 'void-slash', 'wall-run', 'whirlwind-strike', 'wind-dash',
].map((name) => ({
  id: `technique-${name}`, name: toTitleCase(name), category: 'technique' as VTTAssetCategory,
  imageUrl: `/generated/compendium/techniques/${name}.webp`,
  tags: ['technique', 'combat', 'ability', name.split('-')[0]],
}));

// ── Compendium Runes (rune inscription art — usable as handout/effect art) ──
const COMPENDIUM_RUNE_ASSETS: VTTAsset[] = [
  'rune-of-balance', 'rune-of-blood', 'rune-of-chaos', 'rune-of-creation',
  'rune-of-darkness', 'rune-of-death', 'rune-of-despair', 'rune-of-destruction',
  'rune-of-dreams', 'rune-of-earth', 'rune-of-exhaustion', 'rune-of-fate',
  'rune-of-flames', 'rune-of-frost', 'rune-of-hope', 'rune-of-ignorance',
  'rune-of-knowledge', 'rune-of-life', 'rune-of-light', 'rune-of-mind',
  'rune-of-order', 'rune-of-soul', 'rune-of-space', 'rune-of-the-storm',
  'rune-of-the-void', 'rune-of-time', 'rune-of-vitality', 'rune-of-winds',
].map((name) => ({
  id: `comp-rune-${name}`, name: toTitleCase(name), category: 'handout' as VTTAssetCategory,
  imageUrl: `/generated/compendium/runes/${name}.webp`,
  tags: ['rune', 'inscription', 'handout', 'magic', name.replace('rune-of-', '').split('-')[0]],
}));

// ── Standalone Spell Effects (visual effect overlays) ─────────────────────
const STANDALONE_SPELL_EFFECTS: VTTAsset[] = [
  'fireball', 'healing-light', 'ice-shard', 'lightning-strike',
  'protection-barrier', 'shadow-bolt',
].map((name) => ({
  id: `spell-fx-${name}`, name: toTitleCase(name), category: 'effect' as VTTAssetCategory,
  imageUrl: `/generated/spells/${name}.webp`,
  tags: ['effect', 'spell', 'overlay', name.split('-')[0]],
}));

// ── Combined Library ─────────────────────────────────────────────────────
export const VTT_ASSET_LIBRARY: VTTAsset[] = [
  ...PREMADE_MAPS,
  ...MONSTER_ASSETS,
  ...LOCATION_ASSETS,
  ...REGENT_PORTRAITS,
  ...JOB_PORTRAITS,
  ...BACKGROUND_PORTRAITS,
  ...SPELL_ASSETS,
  ...EFFECTS,
  ...POWER_EFFECTS,
  ...RUNE_EFFECTS,
  ...PROPS,
  ...CONDITIONS,
  ...COMPENDIUM_ITEMS,
  ...ARTIFACT_ITEMS,
  ...RELIC_ITEMS,
  ...TECHNIQUE_ASSETS,
  ...COMPENDIUM_RUNE_ASSETS,
  ...STANDALONE_SPELL_EFFECTS,
  ...ITEMS,
  ...TOKEN_TEMPLATES,
];

export const VTT_ASSET_CATEGORIES: { id: VTTAssetCategory; label: string; count: number }[] = [
  { id: 'map', label: 'Battle Maps', count: PREMADE_MAPS.length },
  { id: 'monster', label: 'Monsters', count: MONSTER_ASSETS.length },
  { id: 'portrait', label: 'Portraits', count: REGENT_PORTRAITS.length + JOB_PORTRAITS.length + BACKGROUND_PORTRAITS.length },
  { id: 'location', label: 'Locations', count: LOCATION_ASSETS.length },
  { id: 'spell', label: 'Spells', count: SPELL_ASSETS.length },
  { id: 'effect', label: 'Effects', count: EFFECTS.length + POWER_EFFECTS.length + RUNE_EFFECTS.length + STANDALONE_SPELL_EFFECTS.length },
  { id: 'prop', label: 'Props', count: PROPS.length },
  { id: 'item', label: 'Items', count: COMPENDIUM_ITEMS.length + ITEMS.length },
  { id: 'handout', label: 'Handouts', count: ARTIFACT_ITEMS.length + RELIC_ITEMS.length + COMPENDIUM_RUNE_ASSETS.length },
  { id: 'technique', label: 'Techniques', count: TECHNIQUE_ASSETS.length },
  { id: 'condition', label: 'Conditions', count: CONDITIONS.length },
  { id: 'token', label: 'Token Frames', count: TOKEN_TEMPLATES.length },
];

export function searchAssets(query: string, category?: VTTAssetCategory): VTTAsset[] {
  const q = query.toLowerCase().trim();
  let results = VTT_ASSET_LIBRARY;
  if (category) {
    results = results.filter((a) => a.category === category);
  }
  if (!q) return results;
  return results.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.tags.some((t) => t.includes(q)) ||
      (a.rank && a.rank.toLowerCase() === q) ||
      (a.description && a.description.toLowerCase().includes(q))
  );
}
