# Audio Attribution

All audio files in this directory are **CC0 1.0 Universal (Public Domain)**.

## SFX (`public/audio/sfx/`)

These WAV files are algorithmically synthesised via `scripts/synthesize-audio-assets.mjs`
using standard DSP primitives (filtered noise, sine/sawtooth oscillators, pitch sweeps,
envelopes). They are self-authored and released under CC0.

Ship-ready high-fidelity replacements can be regenerated on demand through the
Warden-only AI Audio Generator (Stable Audio Open via Hugging Face).

### File list

- `door-creak.wav`
- `sword-clash.wav`
- `fireball-whoosh.wav`
- `thunder-rumble.wav`
- `heal-chime.wav`
- `monster-roar.wav`
- `arrow-shot.wav`
- `dice-roll.wav`
- `footstep-stone.wav`
- `sword-unsheath.wav`
- `spell-cast.wav`

## Ambient (`public/audio/ambient/`)

Seamlessly-looping ambient beds (6-10 s each) synthesised by the same script.
All CC0.

- `rain-light.wav`
- `rain-thunderstorm.wav`
- `wind-gust.wav`
- `forest-birds.wav`
- `forest-night.wav`
- `ocean-waves.wav`
- `marketplace-bustle.wav`
- `library-quiet.wav`
- `swamp-frogs.wav`
- `crypt-echoes.wav`
- `campfire-crackle.wav`
- `dungeon-drip.wav`

## Music (`public/audio/music/`)

- `dark-cavern-ambient-1.ogg`, `dark-cavern-ambient-2.ogg` — Paul Wortmann / CC0
- `cold-silence.ogg` — Eponasoft / CC0
- `bleeding-out.ogg` — HaelDB / CC0
- `town-theme-rpg.mp3` — cynicmusic / CC0
- `dungeon-ambience.ogg` — yd / CC0
- `epic-combat.ogg`, `tavern-ambience.ogg` — CC0

## Regeneration

To regenerate all synthesised files:

```
node scripts/synthesize-audio-assets.mjs --force
```
