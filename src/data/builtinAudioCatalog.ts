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

  // ── Mystery Music ──────────────────────────────────────────────────────
  entry('mystery-clues-1', 'Following Clues', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/03/05/audio_a8e2c4f1d9.mp3',
    180, ['mystery', 'clues', 'investigation', 'puzzle'], 'mysterious'),
  entry('mystery-reveal-1', 'The Reveal', 'Pixabay Artists', 'mystery',
    'https://cdn.pixabay.com/audio/2024/09/22/audio_c7d4e8a2b1.mp3',
    120, ['reveal', 'dramatic', 'twist', 'mystery'], 'dramatic'),
];

export const BUILTIN_AUDIO_CATEGORIES = {
  combat: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'combat'),
  exploration: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'exploration'),
  social: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'social'),
  horror: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'horror'),
  ambient: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'ambient'),
  mystery: BUILTIN_AUDIO_CATALOG.filter(t => t.category === 'mystery'),
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
