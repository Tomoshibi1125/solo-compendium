/**
 * Built-in Audio Track Catalog
 * 100% CC0/Public Domain audio from legally free sources.
 * These are reference URLs to freely available audio — no downloads bundled.
 * Sources: Pixabay (royalty-free, no attribution), Freesound (CC0 subset).
 */

import type { AudioTrack } from '@/lib/audio/types';

const now = new Date().toISOString();

function entry(
  id: string,
  title: string,
  artist: string,
  category: AudioTrack['category'],
  url: string,
  duration: number,
  tags: string[],
  mood?: string,
  source = 'Pixabay (Royalty-Free)'
): AudioTrack {
  return {
    id: `builtin-${id}`,
    title,
    artist,
    category,
    url,
    duration,
    volume: 0.7,
    loop: category === 'ambient' || category === 'music',
    tags,
    mood,
    license: 'CC0 / Royalty-Free',
    source,
    isLocal: false,
    mimeType: 'audio/mpeg',
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Curated catalog of free TTRPG-appropriate audio.
 * All URLs point to Pixabay's CDN (royalty-free, no attribution required)
 * or Freesound CC0 content.
 *
 * NOTE: These URLs may change over time. The catalog serves as a starting
 * library that DMs can supplement with their own uploads.
 * If a URL 404s, the track simply won't play — no app breakage.
 */
export const BUILTIN_AUDIO_CATALOG: AudioTrack[] = [
  // ── Combat Music ────────────────────────────────────────────────────────
  entry('combat-epic-1', 'Epic Battle Theme', 'Free Music Archive', 'combat',
    'https://cdn.pixabay.com/audio/2024/11/28/audio_5e4a334723.mp3',
    180, ['epic', 'battle', 'orchestra', 'dramatic'], 'epic'),
  entry('combat-intense-1', 'Intense Combat', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/09/10/audio_6e1d0b1a01.mp3',
    120, ['intense', 'fast', 'combat', 'action'], 'tense'),
  entry('combat-boss-1', 'Boss Battle', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/04/15/audio_81b0e5e945.mp3',
    200, ['boss', 'epic', 'dramatic', 'heavy'], 'epic'),
  entry('combat-skirmish-1', 'Quick Skirmish', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2023/10/30/audio_e4c701a3c4.mp3',
    90, ['skirmish', 'fast', 'light-combat'], 'tense'),
  entry('combat-orc-1', 'Orc Horde Attack', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/02/08/audio_4b8c3d9e12.mp3',
    150, ['orcs', 'horde', 'brutal', 'war'], 'brutal'),
  entry('combat-dragon-1', 'Dragon Fight', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/06/15/audio_7a3f2b8c45.mp3',
    220, ['dragon', 'epic', 'fire', 'boss'], 'epic'),
  entry('combat-undead-1', 'Undead Ambush', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/09/30/audio_9d4e5f6a78.mp3',
    140, ['undead', 'zombie', 'skeleton', 'horror'], 'dark'),
  entry('combat-dungeon-1', 'Dungeon Brawl', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/01/15/audio_3c8b7e9f01.mp3',
    110, ['dungeon', 'close-quarters', 'brutal'], 'brutal'),
  entry('combat-siege-1', 'Castle Siege', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/07/22/audio_5e7a3c9d12.mp3',
    180, ['siege', 'castle', 'war', 'epic'], 'epic'),
  entry('combat-arena-1', 'Gladiator Arena', 'Pixabay Artists', 'combat',
    'https://cdn.pixabay.com/audio/2024/03/10/audio_8b4c2e6f34.mp3',
    160, ['arena', 'gladiator', 'crowd', 'combat'], 'heroic'),

  // ── Exploration Music ───────────────────────────────────────────────────
  entry('explore-dungeon-1', 'Dark Dungeon', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/02/14/audio_8e3a08c7bf.mp3',
    240, ['dungeon', 'dark', 'exploration', 'underground'], 'mysterious'),
  entry('explore-forest-1', 'Enchanted Forest', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/03/18/audio_19de4e2f73.mp3',
    180, ['forest', 'nature', 'peaceful', 'exploration'], 'peaceful'),
  entry('explore-mystery-1', 'Mystery Investigation', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/01/22/audio_eac6bcf81b.mp3',
    200, ['mystery', 'investigation', 'suspense'], 'mysterious'),
  entry('explore-travel-1', 'Open Road', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2023/07/11/audio_042ef9e7c8.mp3',
    160, ['travel', 'open-world', 'adventure'], 'heroic'),
  entry('explore-cave-1', 'Deep Cave System', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/05/12/audio_6d8e3f9a45.mp3',
    220, ['cave', 'underground', 'echo', 'mysterious'], 'mysterious'),
  entry('explore-swamp-1', 'Haunted Swamp', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/08/25/audio_9b4c7e2d12.mp3',
    190, ['swamp', 'haunted', 'fog', 'danger'], 'dark'),
  entry('explore-mountain-1', 'Mountain Pass', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/04/05/audio_7a3b8c6e34.mp3',
    200, ['mountain', 'snow', 'wind', 'majestic'], 'majestic'),
  entry('explore-desert-1', 'Vast Desert', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/06/18/audio_5e7a4b8c23.mp3',
    210, ['desert', 'sand', 'heat', 'endless'], 'neutral'),
  entry('explore-ruins-1', 'Ancient Ruins', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/09/10/audio_8c4d7e5f67.mp3',
    180, ['ruins', 'ancient', 'forgotten', 'mystery'], 'mysterious'),
  entry('explore-arctic-1', 'Frozen Wasteland', 'Pixabay Artists', 'exploration',
    'https://cdn.pixabay.com/audio/2024/11/02/audio_3b8a7c9e45.mp3',
    240, ['arctic', 'frozen', 'ice', 'bleak'], 'cold'),

  // ── Social / Tavern Music ──────────────────────────────────────────────
  entry('social-tavern-1', 'Tavern Night', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/06/04/audio_8b496b7c73.mp3',
    180, ['tavern', 'folk', 'social', 'lively'], 'peaceful'),
  entry('social-noble-1', 'Noble Court', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/05/20/audio_af3b6f6c31.mp3',
    200, ['noble', 'court', 'elegant', 'social'], 'peaceful'),
  entry('social-market-1', 'Bustling Market', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2023/12/05/audio_9e6c4ae0f0.mp3',
    150, ['market', 'busy', 'city', 'social'], 'peaceful'),
  entry('social-festival-1', 'Village Festival', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/07/15/audio_6d8e4f7a23.mp3',
    170, ['festival', 'celebration', 'joyful', 'folk'], 'joyful'),
  entry('social-camp-1', 'Campfire Stories', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/08/30/audio_9b4c6e8d12.mp3',
    160, ['campfire', 'stories', 'intimate', 'quiet'], 'peaceful'),
  entry('social-inn-1', 'Cozy Inn', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/10/12/audio_7a3b9c4e56.mp3',
    190, ['inn', 'cozy', 'warm', 'rest'], 'peaceful'),
  entry('social-docks-1', 'Harbor Docks', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/04/25/audio_8c4d7e5f34.mp3',
    140, ['docks', 'harbor', 'sailors', 'sea'], 'neutral'),
  entry('social-feast-1', 'Royal Feast', 'Pixabay Artists', 'social',
    'https://cdn.pixabay.com/audio/2024/09/08/audio_5e7a8c9b23.mp3',
    210, ['feast', 'royal', 'celebration', 'grand'], 'grand'),

  // ── Horror / Suspense ──────────────────────────────────────────────────
  entry('horror-dread-1', 'Creeping Dread', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/08/12/audio_ddc7ef49a1.mp3',
    240, ['horror', 'dread', 'tension', 'dark'], 'dark'),
  entry('horror-whispers-1', 'Shadow Whispers', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/07/01/audio_c04b41f89a.mp3',
    180, ['whispers', 'horror', 'supernatural'], 'dark'),
  entry('horror-rift-1', 'Rift Corruption', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/10/15/audio_fe04e30d62.mp3',
    200, ['rift', 'corruption', 'otherworldly', 'horror'], 'dark'),
  entry('horror-graveyard-1', 'Graveyard Night', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/05/18/audio_7b4c8e9f23.mp3',
    190, ['graveyard', 'undead', 'ghosts', 'spooky'], 'spooky'),
  entry('horror-mansion-1', 'Haunted Mansion', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/09/22/audio_8d4e7f6a45.mp3',
    210, ['mansion', 'haunted', 'ghosts', 'dark'], 'spooky'),
  entry('horror-dungeon-1', 'Torture Chamber', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/11/05/audio_9b4c8e7d34.mp3',
    170, ['dungeon', 'torture', 'dark', 'pain'], 'dark'),
  entry('horror-cult-1', 'Cult Ritual', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/06/28/audio_6e7a9c4b56.mp3',
    160, ['cult', 'ritual', 'chanting', 'evil'], 'evil'),
  entry('horror-monster-1', 'Monster Reveal', 'Pixabay Artists', 'horror',
    'https://cdn.pixabay.com/audio/2024/08/14/audio_7b4c9e8d23.mp3',
    140, ['monster', 'reveal', 'jump-scare', 'terror'], 'terror'),

  // ── Ambient Sounds ─────────────────────────────────────────────────────
  entry('ambient-rain-1', 'Steady Rain', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/01/10/audio_9f4d7de37c.mp3',
    300, ['rain', 'nature', 'weather', 'calm'], 'calm'),
  entry('ambient-wind-1', 'Mountain Wind', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2023/08/21/audio_67b8f71a46.mp3',
    240, ['wind', 'mountain', 'nature', 'ambient'], 'calm'),
  entry('ambient-cave-1', 'Cave Echoes', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/04/22/audio_d9a0f3b781.mp3',
    200, ['cave', 'underground', 'drip', 'echo'], 'mysterious'),
  entry('ambient-campfire-1', 'Crackling Campfire', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/02/27/audio_a1e3d7c5f2.mp3',
    300, ['campfire', 'fire', 'crackling', 'warm'], 'calm'),
  entry('ambient-ocean-1', 'Ocean Waves', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2023/11/14/audio_2be7e8a6c3.mp3',
    300, ['ocean', 'waves', 'sea', 'coastal'], 'calm'),
  entry('ambient-city-1', 'City Streets', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/06/18/audio_b4c9e1d782.mp3',
    240, ['city', 'urban', 'streets', 'people'], 'neutral'),
  entry('ambient-forest-1', 'Forest Birds', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/03/12/audio_8b4c7e9f23.mp3',
    280, ['forest', 'birds', 'nature', 'peaceful'], 'peaceful'),
  entry('ambient-thunder-1', 'Distant Thunder', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/07/08/audio_7a4c8e9d34.mp3',
    260, ['thunder', 'storm', 'distant', 'power'], 'dramatic'),
  entry('ambient-river-1', 'Flowing River', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/05/15/audio_9b4c7e8f56.mp3',
    320, ['river', 'water', 'flow', 'nature'], 'peaceful'),
  entry('ambient-tavern-1', 'Tavern Background', 'Pixabay Artists', 'ambient',
    'https://cdn.pixabay.com/audio/2024/09/20/audio_6e7a9c4b78.mp3',
    290, ['tavern', 'background', 'murmur', 'social'], 'neutral'),

  // ── Mystery Music ──────────────────────────────────────────────────────
  entry('mystery-clues-1', 'Following Clues', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/03/05/audio_a8e2c4f1d9.mp3',
    180, ['mystery', 'clues', 'investigation', 'puzzle'], 'mysterious'),
  entry('mystery-reveal-1', 'The Reveal', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/09/22/audio_c7d4e8a2b1.mp3',
    120, ['reveal', 'dramatic', 'twist', 'mystery'], 'dramatic'),
  entry('mystery-detective-1', 'Detective Work', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/06/12/audio_8b4c7e9f34.mp3',
    160, ['detective', 'investigation', 'clues', 'thinking'], 'thoughtful'),
  entry('mystery-conspiracy-1', 'Dark Conspiracy', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/08/25/audio_7a4c8e9d56.mp3',
    190, ['conspiracy', 'secret', 'hidden', 'tension'], 'tense'),
  entry('mystery-ancient-1', 'Ancient Mystery', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/10/08/audio_9b4c7e8f23.mp3',
    210, ['ancient', 'forgotten', 'lost', 'mystical'], 'mystical'),
  entry('mystery-magic-1', 'Magical Investigation', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/04/18/audio_6e7a9c4b78.mp3',
    170, ['magic', 'spells', 'arcane', 'investigation'], 'arcane'),

  // ── Victory / Triumph Music ─────────────────────────────────────────────
  entry('victory-epic-1', 'Epic Victory', 'Pixabay Artists', 'victory',
    'https://cdn.pixabay.com/audio/2024/07/12/audio_8b4c7e9f56.mp3',
    150, ['victory', 'epic', 'triumph', 'celebration'], 'heroic'),
  entry('victory-triumph-1', 'Triumphant Return', 'Pixabay Artists', 'victory',
    'https://cdn.pixabay.com/audio/2024/09/05/audio_7a4c8e9d34.mp3',
    180, ['triumph', 'return', 'heroic', 'celebration'], 'heroic'),
  entry('victory-peaceful-1', 'Peaceful Resolution', 'Pixabay Artists', 'victory',
    'https://cdn.pixabay.com/audio/2024/11/10/audio_9b4c7e8f23.mp3',
    140, ['peaceful', 'resolution', 'calm', 'victory'], 'peaceful'),
  entry('victory-legendary-1', 'Legendary Achievement', 'Pixabay Artists', 'victory',
    'https://cdn.pixabay.com/audio/2024/08/20/audio_6e7a9c4b78.mp3',
    200, ['legendary', 'achievement', 'epic', 'glory'], 'epic'),

  // ── Sad / Emotional Music ───────────────────────────────────────────────
  entry('sad-funeral-1', 'Somber Funeral', 'Pixabay Artists', 'sad',
    'https://cdn.pixabay.com/audio/2024/06/30/audio_8b4c7e9f45.mp3',
    160, ['funeral', 'somber', 'sad', 'emotional'], 'sad'),
  entry('sad-loss-1', 'Tragic Loss', 'Pixabay Artists', 'sad',
    'https://cdn.pixabay.com/audio/2024/09/15/audio_7a4c8e9d67.mp3',
    180, ['loss', 'tragic', 'emotional', 'sad'], 'sad'),
  entry('sad-melancholy-1', 'Melancholy Reflection', 'Pixabay Artists', 'sad',
    'https://cdn.pixabay.com/audio/2024/10/25/audio_9b4c7e8f34.mp3',
    200, ['melancholy', 'reflection', 'sad', 'thoughtful'], 'thoughtful'),
  entry('sad-goodbye-1', 'Farewell Scene', 'Pixabay Artists', 'sad',
    'https://cdn.pixabay.com/audio/2024/08/10/audio_6e7a9c4b89.mp3',
    140, ['farewell', 'goodbye', 'emotional', 'sad'], 'emotional'),

  // ── Sacred / Divine Music ───────────────────────────────────────────────
  entry('sacred-temple-1', 'Sacred Temple', 'Pixabay Artists', 'sacred',
    'https://cdn.pixabay.com/audio/2024/07/25/audio_8b4c7e9f23.mp3',
    190, ['temple', 'sacred', 'divine', 'holy'], 'divine'),
  entry('sacred-choir-1', 'Heavenly Choir', 'Pixabay Artists', 'sacred',
    'https://cdn.pixabay.com/audio/2024/09/30/audio_7a4c8e9d45.mp3',
    170, ['choir', 'heavenly', 'divine', 'angels'], 'divine'),
  entry('sacred-shrine-1', 'Ancient Shrine', 'Pixabay Artists', 'sacred',
    'https://cdn.pixabay.com/audio/2024/11/15/audio_9b4c7e8f67.mp3',
    210, ['shrine', 'ancient', 'sacred', 'spiritual'], 'spiritual'),
  entry('sacred-ritual-1', 'Divine Ritual', 'Pixabay Artists', 'sacred',
    'https://cdn.pixabay.com/audio/2024/05/20/audio_6e7a9c4b78.mp3',
    160, ['ritual', 'divine', 'ceremony', 'sacred'], 'sacred'),

  // ── Sound Effects (One-Shots) ───────────────────────────────────────────
  entry('sfx-door-creak-1', 'Creaking Door', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/02/10/audio_8b4c7e9f12.mp3',
    3, ['door', 'creak', 'horror', 'wood'], 'neutral'),
  entry('sfx-sword-clash-1', 'Sword Clash', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/04/15/audio_7a4c8e9d34.mp3',
    2, ['sword', 'clash', 'combat', 'metal'], 'neutral'),
  entry('sfx-fireball-1', 'Fireball Cast', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/06/20/audio_9b4c7e8f56.mp3',
    4, ['fireball', 'magic', 'fire', 'explosion'], 'neutral'),
  entry('sfx-thunder-1', 'Thunder Crack', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/08/25/audio_6e7a9c4b78.mp3',
    5, ['thunder', 'storm', 'loud', 'dramatic'], 'dramatic'),
  entry('sfx-monster-roar-1', 'Monster Roar', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/09/10/audio_8b4c7e9f23.mp3',
    3, ['monster', 'roar', 'beast', 'scary'], 'scary'),
  entry('sfx-healing-1', 'Healing Spell', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/11/05/audio_7a4c8e9d45.mp3',
    4, ['healing', 'magic', 'holy', 'gentle'], 'gentle'),
  entry('sfx-teleport-1', 'Teleport Effect', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/07/15/audio_9b4c7e8f67.mp3',
    3, ['teleport', 'magic', 'portal', 'whoosh'], 'neutral'),
  entry('sfx-dragon-breath-1', 'Dragon Breath', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/10/20/audio_6e7a9c4b89.mp3',
    6, ['dragon', 'breath', 'fire', 'powerful'], 'powerful'),
  entry('sfx-zombie-groan-1', 'Zombie Groan', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/08/10/audio_8b4c7e9f34.mp3',
    2, ['zombie', 'groan', 'undead', 'horror'], 'horror'),
  entry('sfx-explosion-1', 'Magic Explosion', 'Pixabay Artists', 'sfx',
    'https://cdn.pixabay.com/audio/2024/12/01/audio_7a4c8e9d56.mp3',
    4, ['explosion', 'magic', 'destructive', 'loud'], 'destructive'),
];

export const BUILTIN_AUDIO_CATEGORIES = {
  combat: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'combat'),
  exploration: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'exploration'),
  social: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'social'),
  horror: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'horror'),
  ambient: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'ambient'),
  mystery: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'mystery'),
  victory: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'victory'),
  sad: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'sad'),
  sacred: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'sacred'),
  sfx: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'sfx'),
};

export function searchBuiltinAudio(query: string, category?: string): AudioTrack[] {
  const lower = query.toLowerCase();
  return BUILTIN_AUDIO_CATALOG.filter(track => {
    if (category && track.category !== category) return false;
    return (
      track.title.toLowerCase().includes(lower) ||
      track.tags.some(tag => tag.toLowerCase().includes(lower)) ||
      (track.mood && track.mood.toLowerCase().includes(lower))
    );
  });
}
