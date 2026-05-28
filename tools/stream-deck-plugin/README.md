# Rift Ascendant Comm Deck — Stream Deck plugin

Misty Pearl H3. Companion plugin for Elgato Stream Deck hardware that
exposes 12 Bureau actions for the Warden's left hand: scene switching,
Comm-Net mute / PTT, ping, Field Roll, Bureau Broadcast, scene
transition, music next, Player View toggle, fog reveal, calendar long
rest, and Field Calibration.

## Install

1. Download the latest `.streamDeckPlugin` from the [Releases](https://github.com/rift-ascendant/stream-deck-plugin) page.
2. Double-click — the Stream Deck Software installs it automatically.
3. Open the Stream Deck app → drag any "Rift Ascendant" action onto a key.
4. In the Property Inspector for that key, paste:
   - **Share code** (from your campaign settings → "Permanent Share Code")
   - **Supabase URL** (same value as `VITE_SUPABASE_URL`)
   - **Anon key** (same value as `VITE_SUPABASE_PUBLISHABLE_KEY`)
   - **Scene id / Ping coord / Roll formula / Broadcast text** — per-action.

## Distribution

The plugin is **100% free** and MIT-licensed. No subscription, no paid
tier, no telemetry beyond opt-in Sentry crash reports.

## Build (developers)

```bash
cd tools/stream-deck-plugin
npx tsc plugin.ts --target es2020 --module umd --outFile plugin.js
# Then run the Stream Deck Distribution Tool to bundle:
#   DistributionTool -b -i tools/stream-deck-plugin -o tools/stream-deck-plugin/dist
```

## Actions

| UUID | Action | Notes |
|---|---|---|
| `scene-switch` | Switch Rift Scene | Push the saved scene to LIVE. |
| `commnet-mute` | Cloak Channel | Toggles Comm-Net mic. State-aware icon. |
| `commnet-ptt` | Push Burst | Hold-to-talk on Comm-Net while pressed. |
| `ping` | Bureau Ping | Drops a ping at the saved coordinate. |
| `dice-roll` | Field Roll | Rolls the saved formula (default 1d20). |
| `transition` | Scene Transition | Bureau Field Brief title card. |
| `music-next` | Next Music Track | Advances the playlist queue. |
| `player-view` | Player View | Toggles Simulate Ascendant. |
| `fog-clear` | Reveal Fog Region | Clears fog inside the saved Region. |
| `broadcast` | Warden Broadcast | Fires the saved broadcast macro. |
| `calendar-rest` | Take Long Rest | Advances the in-world calendar by 8h. |
| `encounter-pulse` | Field Calibration | Opens the live encounter calibration panel. |
