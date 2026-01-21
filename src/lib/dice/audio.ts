type DiceAudioEvent = 'roll' | 'impact' | 'critical' | 'fumble';

type DiceAudioOptions = {
  masterVolume?: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export class DiceAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = true;
  private options: Required<DiceAudioOptions>;

  constructor(options: DiceAudioOptions = {}) {
    this.options = {
      masterVolume: options.masterVolume ?? 0.35,
    };
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private ensureContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.context) {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      this.context = new AudioCtor();
      this.master = this.context.createGain();
      this.master.gain.value = this.options.masterVolume;
      this.master.connect(this.context.destination);
    }
    return this.context;
  }

  async resume() {
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  play(event: DiceAudioEvent, intensity = 1) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;

    const now = ctx.currentTime;
    const volume = clamp(intensity, 0.1, 1);

    switch (event) {
      case 'roll': {
        const noise = this.createNoise(ctx, 0.35, 0.18 * volume);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.6;
        noise.connect(filter).connect(this.master);
        noise.start(now);
        noise.stop(now + 0.35);
        break;
      }
      case 'impact': {
        const noise = this.createNoise(ctx, 0.12, 0.22 * volume);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 500;
        filter.Q.value = 0.8;
        noise.connect(filter).connect(this.master);
        noise.start(now);
        noise.stop(now + 0.12);
        break;
      }
      case 'critical': {
        this.playTone(ctx, now, 880, 0.25, 0.25 * volume);
        this.playTone(ctx, now + 0.05, 1320, 0.2, 0.2 * volume);
        break;
      }
      case 'fumble': {
        this.playTone(ctx, now, 240, 0.3, 0.2 * volume, 'sawtooth');
        this.playTone(ctx, now + 0.08, 180, 0.35, 0.22 * volume, 'triangle');
        break;
      }
      default:
        break;
    }
  }

  private createNoise(ctx: AudioContext, duration: number, gainValue: number) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = gainValue;
    source.connect(gain);
    gain.connect(this.master as GainNode);
    return source;
  }

  private playTone(
    ctx: AudioContext,
    start: number,
    frequency: number,
    duration: number,
    gainValue: number,
    type: OscillatorType = 'triangle'
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.value = gainValue;
    osc.connect(gain).connect(this.master as GainNode);
    osc.start(start);
    osc.stop(start + duration);
  }
}
