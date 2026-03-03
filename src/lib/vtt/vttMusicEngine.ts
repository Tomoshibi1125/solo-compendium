/**
 * VTT Procedural Ambient Music Engine
 *
 * Generates royalty-free, copyright-free ambient music using WebAudio API.
 * Zero external dependencies — all sounds are synthesized in real-time.
 *
 * Features:
 *   - 20+ mood presets covering all TTRPG scenarios
 *   - Seamless looping with crossfade
 *   - Volume control and fade in/out
 *   - Layered drones + melodies + textures
 *
 * Usage:
 *   const engine = new VttMusicEngine();
 *   engine.play('dungeon-exploration');
 *   engine.setVolume(0.5);
 *   engine.stop();
 */

export type MusicMood =
    | 'tavern-calm'
    | 'dungeon-exploration'
    | 'combat-tension'
    | 'boss-epic'
    | 'forest-peaceful'
    | 'ocean-ambient'
    | 'city-bustle'
    | 'cave-drip'
    | 'mystical-wonder'
    | 'horror-dread'
    | 'victory-triumph'
    | 'sadness-loss'
    | 'stealth-suspense'
    | 'desert-heat'
    | 'arctic-cold'
    | 'rainfall'
    | 'gate-resonance'
    | 'monarch-presence'
    | 'shadow-realm'
    | 'system-awakening';

interface MoodConfig {
    label: string;
    /** Base drone frequencies (Hz) */
    drones: number[];
    /** Drone waveform */
    droneType: OscillatorType;
    /** Drone volume */
    droneVolume: number;
    /** Whether to add a texture layer (filtered noise) */
    texture: boolean;
    /** Texture filter frequency */
    textureFreq: number;
    /** Texture volume */
    textureVolume: number;
    /** Optional melody note sequence (Hz values) */
    melody?: number[];
    /** Melody note duration (s) */
    melodyDuration?: number;
    /** Melody volume */
    melodyVolume?: number;
    /** Melody waveform */
    melodyType?: OscillatorType;
    /** BPM for melody pacing */
    bpm?: number;
    /** LFO modulation speed (Hz) */
    lfoSpeed?: number;
    /** LFO modulation depth (0-1) */
    lfoDepth?: number;
}

const MOOD_CONFIGS: Record<MusicMood, MoodConfig> = {
    'tavern-calm': {
        label: 'Tavern (Calm)', drones: [130.81, 196.00], droneType: 'triangle', droneVolume: 0.06,
        texture: true, textureFreq: 400, textureVolume: 0.02,
        melody: [392, 440, 494, 523, 494, 440, 392, 330], melodyDuration: 0.8, melodyVolume: 0.04, melodyType: 'sine', bpm: 90,
    },
    'dungeon-exploration': {
        label: 'Dungeon (Exploration)', drones: [82.41, 110.00], droneType: 'sine', droneVolume: 0.05,
        texture: true, textureFreq: 200, textureVolume: 0.03,
        lfoSpeed: 0.1, lfoDepth: 0.3,
    },
    'combat-tension': {
        label: 'Combat (Tension)', drones: [98.00, 146.83, 196.00], droneType: 'sawtooth', droneVolume: 0.04,
        texture: true, textureFreq: 600, textureVolume: 0.03,
        melody: [196, 220, 247, 294, 330, 294, 247, 220], melodyDuration: 0.25, melodyVolume: 0.03, melodyType: 'square', bpm: 140,
        lfoSpeed: 2.0, lfoDepth: 0.2,
    },
    'boss-epic': {
        label: 'Boss (Epic)', drones: [65.41, 98.00, 130.81], droneType: 'sawtooth', droneVolume: 0.05,
        texture: true, textureFreq: 800, textureVolume: 0.04,
        melody: [262, 330, 392, 523, 392, 330, 262, 196], melodyDuration: 0.3, melodyVolume: 0.04, melodyType: 'square', bpm: 160,
        lfoSpeed: 3.0, lfoDepth: 0.25,
    },
    'forest-peaceful': {
        label: 'Forest (Peaceful)', drones: [196.00, 293.66], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 1200, textureVolume: 0.015,
        melody: [523, 587, 659, 784, 659, 587, 523, 440], melodyDuration: 1.2, melodyVolume: 0.03, melodyType: 'sine', bpm: 60,
    },
    'ocean-ambient': {
        label: 'Ocean (Ambient)', drones: [110.00, 164.81], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 300, textureVolume: 0.04,
        lfoSpeed: 0.15, lfoDepth: 0.4,
    },
    'city-bustle': {
        label: 'City (Bustle)', drones: [146.83, 220.00], droneType: 'triangle', droneVolume: 0.03,
        texture: true, textureFreq: 500, textureVolume: 0.04,
    },
    'cave-drip': {
        label: 'Cave (Drip)', drones: [73.42, 110.00], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 150, textureVolume: 0.02,
        lfoSpeed: 0.05, lfoDepth: 0.3,
    },
    'mystical-wonder': {
        label: 'Mystical (Wonder)', drones: [220.00, 329.63], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 900, textureVolume: 0.02,
        melody: [659, 784, 880, 1047, 880, 784, 659, 523], melodyDuration: 1.5, melodyVolume: 0.025, melodyType: 'sine', bpm: 50,
        lfoSpeed: 0.2, lfoDepth: 0.15,
    },
    'horror-dread': {
        label: 'Horror (Dread)', drones: [55.00, 82.41], droneType: 'sawtooth', droneVolume: 0.04,
        texture: true, textureFreq: 120, textureVolume: 0.04,
        lfoSpeed: 0.08, lfoDepth: 0.5,
    },
    'victory-triumph': {
        label: 'Victory (Triumph)', drones: [130.81, 196.00, 261.63], droneType: 'triangle', droneVolume: 0.05,
        texture: false, textureFreq: 0, textureVolume: 0,
        melody: [523, 659, 784, 1047, 784, 1047, 1319, 1047], melodyDuration: 0.4, melodyVolume: 0.05, melodyType: 'sine', bpm: 120,
    },
    'sadness-loss': {
        label: 'Sadness (Loss)', drones: [110.00, 146.83], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 250, textureVolume: 0.015,
        melody: [330, 294, 262, 247, 220, 196, 220, 247], melodyDuration: 1.0, melodyVolume: 0.03, melodyType: 'sine', bpm: 55,
    },
    'stealth-suspense': {
        label: 'Stealth (Suspense)', drones: [73.42, 98.00], droneType: 'sine', droneVolume: 0.03,
        texture: true, textureFreq: 180, textureVolume: 0.02,
        lfoSpeed: 0.3, lfoDepth: 0.2,
    },
    'desert-heat': {
        label: 'Desert (Heat)', drones: [146.83, 220.00], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 350, textureVolume: 0.03,
        melody: [440, 494, 523, 587, 523, 494, 440, 392], melodyDuration: 0.9, melodyVolume: 0.025, melodyType: 'triangle', bpm: 70,
    },
    'arctic-cold': {
        label: 'Arctic (Cold)', drones: [130.81, 196.00], droneType: 'sine', droneVolume: 0.035,
        texture: true, textureFreq: 800, textureVolume: 0.02,
        lfoSpeed: 0.1, lfoDepth: 0.2,
    },
    'rainfall': {
        label: 'Rainfall', drones: [110.00], droneType: 'sine', droneVolume: 0.02,
        texture: true, textureFreq: 2000, textureVolume: 0.06,
    },
    'gate-resonance': {
        label: 'Gate Resonance (SA)', drones: [82.41, 123.47, 164.81], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 400, textureVolume: 0.025,
        lfoSpeed: 0.25, lfoDepth: 0.3,
    },
    'monarch-presence': {
        label: 'Monarch Presence (SA)', drones: [65.41, 98.00, 130.81], droneType: 'triangle', droneVolume: 0.05,
        texture: true, textureFreq: 600, textureVolume: 0.03,
        melody: [262, 330, 392, 523, 659, 523, 392, 330], melodyDuration: 0.6, melodyVolume: 0.04, melodyType: 'sine', bpm: 80,
        lfoSpeed: 0.15, lfoDepth: 0.15,
    },
    'shadow-realm': {
        label: 'Shadow Realm (SA)', drones: [55.00, 73.42], droneType: 'sawtooth', droneVolume: 0.035,
        texture: true, textureFreq: 100, textureVolume: 0.04,
        lfoSpeed: 0.06, lfoDepth: 0.5,
    },
    'system-awakening': {
        label: 'System Awakening (SA)', drones: [196.00, 293.66, 392.00], droneType: 'sine', droneVolume: 0.04,
        texture: true, textureFreq: 1000, textureVolume: 0.025,
        melody: [523, 659, 784, 1047, 1319, 1047, 784, 659], melodyDuration: 0.5, melodyVolume: 0.035, melodyType: 'sine', bpm: 100,
        lfoSpeed: 0.4, lfoDepth: 0.1,
    },
};

export class VttMusicEngine {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private activeSources: AudioNode[] = [];
    private currentMood: MusicMood | null = null;
    private melodyInterval: ReturnType<typeof setInterval> | null = null;
    private volume = 0.3;

    /** Start playing a mood. Fades in over 2s. */
    play(mood: MusicMood) {
        this.stop();
        this.currentMood = mood;
        const config = MOOD_CONFIGS[mood];
        if (!config) return;

        const ctx = this.ensureContext();
        if (!ctx) return;

        this.masterGain = ctx.createGain();
        this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + 2);
        this.masterGain.connect(ctx.destination);

        // Drone layer
        for (const freq of config.drones) {
            const osc = ctx.createOscillator();
            osc.type = config.droneType;
            osc.frequency.value = freq;
            const gain = ctx.createGain();
            gain.gain.value = config.droneVolume;

            if (config.lfoSpeed) {
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                lfo.frequency.value = config.lfoSpeed;
                lfoGain.gain.value = freq * (config.lfoDepth ?? 0.1);
                lfo.connect(lfoGain).connect(osc.frequency);
                lfo.start();
                this.activeSources.push(lfo);
            }

            osc.connect(gain).connect(this.masterGain);
            osc.start();
            this.activeSources.push(osc);
        }

        // Texture layer (filtered noise)
        if (config.texture) {
            const bufferSize = ctx.sampleRate * 4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = config.textureFreq;
            filter.Q.value = 0.5;
            const gain = ctx.createGain();
            gain.gain.value = config.textureVolume;
            noise.connect(filter).connect(gain).connect(this.masterGain);
            noise.start();
            this.activeSources.push(noise);
        }

        // Melody layer
        if (config.melody && config.melodyDuration) {
            let noteIndex = 0;
            const interval = (config.melodyDuration * 1000) * (60 / (config.bpm ?? 80));
            this.melodyInterval = setInterval(() => {
                if (!this.context || !this.masterGain) return;
                const freq = config.melody![noteIndex % config.melody!.length];
                const osc = this.context.createOscillator();
                osc.type = config.melodyType ?? 'sine';
                osc.frequency.value = freq;
                const gain = this.context.createGain();
                const vol = config.melodyVolume ?? 0.03;
                const now = this.context.currentTime;
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(vol, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + config.melodyDuration! * 0.9);
                osc.connect(gain).connect(this.masterGain);
                osc.start(now);
                osc.stop(now + config.melodyDuration!);
                noteIndex++;
            }, interval);
        }
    }

    /** Stop all music with a 1.5s fade-out. */
    stop() {
        if (this.melodyInterval) {
            clearInterval(this.melodyInterval);
            this.melodyInterval = null;
        }
        if (this.masterGain && this.context) {
            const now = this.context.currentTime;
            this.masterGain.gain.linearRampToValueAtTime(0, now + 1.5);
            const sources = [...this.activeSources];
            setTimeout(() => {
                for (const s of sources) {
                    try { (s as OscillatorNode).stop?.(); } catch { /* already stopped */ }
                }
            }, 2000);
        }
        this.activeSources = [];
        this.currentMood = null;
    }

    /** Set master volume (0–1). */
    setVolume(v: number) {
        this.volume = Math.max(0, Math.min(1, v));
        if (this.masterGain && this.context) {
            this.masterGain.gain.linearRampToValueAtTime(this.volume, this.context.currentTime + 0.1);
        }
    }

    /** Get current mood, or null if stopped. */
    getCurrentMood(): MusicMood | null { return this.currentMood; }

    /** List all available moods with labels. */
    static listMoods(): Array<{ id: MusicMood; label: string }> {
        return (Object.entries(MOOD_CONFIGS) as [MusicMood, MoodConfig][]).map(([id, c]) => ({
            id,
            label: c.label,
        }));
    }

    private ensureContext(): AudioContext | null {
        if (typeof window === 'undefined') return null;
        if (!this.context) {
            const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!Ctor) return null;
            this.context = new Ctor();
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        return this.context;
    }

    /** Clean up all resources. */
    dispose() {
        this.stop();
        if (this.context) {
            this.context.close();
            this.context = null;
        }
    }
}
