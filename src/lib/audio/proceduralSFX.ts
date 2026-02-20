/**
 * Procedural SFX Engine — Web Audio API
 * 100% legally free, zero downloads. Generates combat, ambient, UI, and horror
 * sound effects on-demand using oscillators, noise, and filters.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function createNoise(ctx: AudioContext, duration: number, type: 'white' | 'pink' | 'brown' = 'white'): AudioBufferSourceNode {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (type === 'white') {
      data[i] = white;
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      // brown
      data[i] = (b0 + white * 0.02) * 0.5;
      b0 = data[i] * 0.98;
    }
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  return source;
}

// ── Combat SFX ────────────────────────────────────────────────────────────

export function playSwordClash(volume = 0.5): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.8, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  // Metallic hit: high-freq noise burst + sine ping
  const noise = createNoise(ctx, 0.1, 'white');
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 4000;
  filter.Q.value = 5;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + 0.1);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(volume * 0.4, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}

export function playExplosion(volume = 0.6): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  const noise = createNoise(ctx, 0.8, 'brown');
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, now);
  filter.frequency.exponentialRampToValueAtTime(60, now + 0.8);
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + 0.8);
}

export function playMagicZap(volume = 0.4): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.3);

  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(3000, now);
  osc2.frequency.exponentialRampToValueAtTime(500, now + 0.2);
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(volume * 0.3, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc2.connect(g2);
  g2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.2);
}

export function playCriticalHit(volume = 0.6): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Impact
  playExplosion(volume * 0.5);

  // Rising tone
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

export function playArrowFire(volume = 0.4): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  const noise = createNoise(ctx, 0.2, 'white');
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + 0.2);
}

export function playShieldBash(volume = 0.5): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.7, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

  const noise = createNoise(ctx, 0.15, 'brown');
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + 0.15);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 180;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(volume * 0.4, now);
  g2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(g2);
  g2.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

// ── Ambient SFX ───────────────────────────────────────────────────────────

export function playWindGust(volume = 0.3, duration = 2): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.3);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  const noise = createNoise(ctx, duration, 'pink');
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, now);
  filter.frequency.linearRampToValueAtTime(800, now + duration * 0.5);
  filter.frequency.linearRampToValueAtTime(300, now + duration);
  filter.Q.value = 1;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + duration);
}

export function playThunder(volume = 0.7): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Crack
  const crackGain = ctx.createGain();
  crackGain.connect(ctx.destination);
  crackGain.gain.setValueAtTime(volume, now);
  crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  const crackNoise = createNoise(ctx, 0.05, 'white');
  crackNoise.connect(crackGain);
  crackNoise.start(now);
  crackNoise.stop(now + 0.05);

  // Rumble
  const rumbleGain = ctx.createGain();
  rumbleGain.connect(ctx.destination);
  rumbleGain.gain.setValueAtTime(0, now + 0.05);
  rumbleGain.gain.linearRampToValueAtTime(volume * 0.6, now + 0.15);
  rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  const rumble = createNoise(ctx, 1.5, 'brown');
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 200;
  rumble.connect(lowpass);
  lowpass.connect(rumbleGain);
  rumble.start(now + 0.05);
  rumble.stop(now + 1.5);
}

export function playRainLoop(volume = 0.2, duration = 5): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.setValueAtTime(volume, now + duration - 0.5);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  const noise = createNoise(ctx, duration, 'pink');
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + duration);
}

export function playCampfire(volume = 0.25, duration = 3): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  const noise = createNoise(ctx, duration, 'brown');
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 600;
  filter.Q.value = 2;
  noise.connect(filter);
  filter.connect(gain);
  noise.start(now);
  noise.stop(now + duration);
}

// ── UI SFX ────────────────────────────────────────────────────────────────

export function playDiceRoll(volume = 0.4): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  for (let i = 0; i < 4; i++) {
    const t = now + i * 0.06 + Math.random() * 0.03;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume * (0.3 + Math.random() * 0.3), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    const noise = createNoise(ctx, 0.05, 'white');
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3000 + Math.random() * 2000;
    filter.Q.value = 8;
    noise.connect(filter);
    filter.connect(gain);
    noise.start(t);
    noise.stop(t + 0.05);
  }
}

export function playLevelUpFanfare(volume = 0.4): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6

  notes.forEach((freq, i) => {
    const t = now + i * 0.12;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

export function playNotificationChime(volume = 0.3): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1320, now + 0.1);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume * 0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

// ── Horror SFX ────────────────────────────────────────────────────────────

export function playHeartbeat(volume = 0.4): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  [0, 0.15].forEach((offset) => {
    const t = now + offset;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 50 + offset * 30;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * (offset === 0 ? 0.6 : 0.3), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  });
}

export function playEerieDrone(volume = 0.25, duration = 3): void {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.5);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.value = 80;
  const osc2 = ctx.createOscillator();
  osc2.type = 'sawtooth';
  osc2.frequency.value = 82; // slight detune for eerie beat
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 300;

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

// ── Catalog for VTT Quick SFX Panel ──────────────────────────────────────

export interface ProceduralSFXEntry {
  id: string;
  name: string;
  category: 'combat' | 'ambient' | 'ui' | 'horror';
  play: (volume?: number) => void;
}

export const PROCEDURAL_SFX_CATALOG: ProceduralSFXEntry[] = [
  { id: 'sword-clash', name: 'Sword Clash', category: 'combat', play: playSwordClash },
  { id: 'explosion', name: 'Explosion', category: 'combat', play: playExplosion },
  { id: 'magic-zap', name: 'Magic Zap', category: 'combat', play: playMagicZap },
  { id: 'critical-hit', name: 'Critical Hit', category: 'combat', play: playCriticalHit },
  { id: 'arrow-fire', name: 'Arrow Fire', category: 'combat', play: playArrowFire },
  { id: 'shield-bash', name: 'Shield Bash', category: 'combat', play: playShieldBash },
  { id: 'wind-gust', name: 'Wind Gust', category: 'ambient', play: (v) => playWindGust(v) },
  { id: 'thunder', name: 'Thunder', category: 'ambient', play: playThunder },
  { id: 'rain', name: 'Rain', category: 'ambient', play: (v) => playRainLoop(v) },
  { id: 'campfire', name: 'Campfire', category: 'ambient', play: (v) => playCampfire(v) },
  { id: 'dice-roll', name: 'Dice Roll', category: 'ui', play: playDiceRoll },
  { id: 'level-up', name: 'Level Up', category: 'ui', play: playLevelUpFanfare },
  { id: 'notification', name: 'Notification', category: 'ui', play: playNotificationChime },
  { id: 'heartbeat', name: 'Heartbeat', category: 'horror', play: playHeartbeat },
  { id: 'eerie-drone', name: 'Eerie Drone', category: 'horror', play: (v) => playEerieDrone(v) },
];
