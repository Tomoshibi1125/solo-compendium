declare global {
	interface Window {
		webkitAudioContext?: typeof AudioContext;
	}
}

type DiceAudioEvent =
	| "roll"
	| "impact"
	| "critical"
	| "fumble"
	| "spell"
	| "shield"
	| "heal"
	| "death"
	| "coin"
	| "arrow"
	| "explosion"
	| "miss"
	| "levelUp"
	| "trap"
	| "intimidate";

type DiceAudioOptions = {
	masterVolume?: number;
};

const clamp = (value: number, min = 0, max = 1) =>
	Math.min(max, Math.max(min, value));

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
		if (!this.enabled || typeof window === "undefined") return null;
		if (!this.context) {
			const AudioCtor = window.AudioContext || window.webkitAudioContext;
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
		if (ctx && ctx.state === "suspended") {
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
			case "roll": {
				const noise = this.createNoise(ctx, 0.35, 0.18 * volume);
				const filter = ctx.createBiquadFilter();
				filter.type = "lowpass";
				filter.frequency.value = 800;
				filter.Q.value = 0.6;
				noise.connect(filter).connect(this.master);
				noise.start(now);
				noise.stop(now + 0.35);
				break;
			}
			case "impact": {
				const noise = this.createNoise(ctx, 0.12, 0.22 * volume);
				const filter = ctx.createBiquadFilter();
				filter.type = "highpass";
				filter.frequency.value = 500;
				filter.Q.value = 0.8;
				noise.connect(filter).connect(this.master);
				noise.start(now);
				noise.stop(now + 0.12);
				break;
			}
			case "critical": {
				this.playTone(ctx, now, 880, 0.25, 0.25 * volume);
				this.playTone(ctx, now + 0.05, 1320, 0.2, 0.2 * volume);
				break;
			}
			case "fumble": {
				this.playTone(ctx, now, 240, 0.3, 0.2 * volume, "sawtooth");
				this.playTone(ctx, now + 0.08, 180, 0.35, 0.22 * volume, "triangle");
				break;
			}
			case "spell": {
				// Shimmering ascending tones — arcane cast
				this.playTone(ctx, now, 660, 0.15, 0.15 * volume, "sine");
				this.playTone(ctx, now + 0.06, 990, 0.15, 0.12 * volume, "sine");
				this.playTone(ctx, now + 0.12, 1320, 0.2, 0.1 * volume, "sine");
				break;
			}
			case "shield": {
				// Metallic clang — block
				const shieldNoise = this.createNoise(ctx, 0.08, 0.3 * volume);
				const shieldFilter = ctx.createBiquadFilter();
				shieldFilter.type = "bandpass";
				shieldFilter.frequency.value = 2000;
				shieldFilter.Q.value = 3;
				shieldNoise.connect(shieldFilter).connect(this.master as GainNode);
				shieldNoise.start(now);
				shieldNoise.stop(now + 0.08);
				this.playTone(ctx, now, 400, 0.12, 0.18 * volume, "square");
				break;
			}
			case "heal": {
				// Soft warm ascending tones — restoration
				this.playTone(ctx, now, 440, 0.2, 0.12 * volume, "sine");
				this.playTone(ctx, now + 0.1, 550, 0.2, 0.12 * volume, "sine");
				this.playTone(ctx, now + 0.2, 660, 0.25, 0.14 * volume, "sine");
				break;
			}
			case "death": {
				// Low ominous descending
				this.playTone(ctx, now, 200, 0.4, 0.22 * volume, "sawtooth");
				this.playTone(ctx, now + 0.1, 140, 0.5, 0.2 * volume, "sawtooth");
				this.playTone(ctx, now + 0.25, 80, 0.6, 0.15 * volume, "triangle");
				break;
			}
			case "coin": {
				// Quick bright metallic jingle — loot pickup
				this.playTone(ctx, now, 2200, 0.06, 0.12 * volume, "sine");
				this.playTone(ctx, now + 0.04, 2800, 0.06, 0.1 * volume, "sine");
				this.playTone(ctx, now + 0.08, 3400, 0.08, 0.08 * volume, "sine");
				break;
			}
			case "arrow": {
				// Bow release twang + whoosh
				this.playTone(ctx, now, 180, 0.06, 0.15 * volume, "sawtooth");
				this.playTone(ctx, now + 0.02, 1400, 0.08, 0.08 * volume, "sine");
				const arrowNoise = this.createNoise(ctx, 0.15, 0.1 * volume);
				const arrowFilter = ctx.createBiquadFilter();
				arrowFilter.type = "bandpass";
				arrowFilter.frequency.value = 3000;
				arrowFilter.Q.value = 1.5;
				arrowNoise.connect(arrowFilter).connect(this.master as GainNode);
				arrowNoise.start(now + 0.04);
				arrowNoise.stop(now + 0.19);
				break;
			}
			case "explosion": {
				// Deep boom + rumble
				this.playTone(ctx, now, 60, 0.5, 0.3 * volume, "sine");
				this.playTone(ctx, now, 90, 0.4, 0.2 * volume, "triangle");
				const boomNoise = this.createNoise(ctx, 0.3, 0.25 * volume);
				const boomFilter = ctx.createBiquadFilter();
				boomFilter.type = "lowpass";
				boomFilter.frequency.value = 400;
				boomFilter.Q.value = 0.5;
				boomNoise.connect(boomFilter).connect(this.master as GainNode);
				boomNoise.start(now);
				boomNoise.stop(now + 0.3);
				break;
			}
			case "miss": {
				// Air whoosh — swing and miss
				const missNoise = this.createNoise(ctx, 0.2, 0.12 * volume);
				const missFilter = ctx.createBiquadFilter();
				missFilter.type = "bandpass";
				missFilter.frequency.value = 2500;
				missFilter.Q.value = 0.8;
				missNoise.connect(missFilter).connect(this.master as GainNode);
				missNoise.start(now);
				missNoise.stop(now + 0.2);
				break;
			}
			case "levelUp": {
				// Triumphant ascending fanfare
				this.playTone(ctx, now, 523, 0.15, 0.15 * volume, "sine");
				this.playTone(ctx, now + 0.12, 659, 0.15, 0.15 * volume, "sine");
				this.playTone(ctx, now + 0.24, 784, 0.15, 0.15 * volume, "sine");
				this.playTone(ctx, now + 0.36, 1047, 0.3, 0.18 * volume, "sine");
				break;
			}
			case "trap": {
				// Mechanical snap / click
				this.playTone(ctx, now, 300, 0.04, 0.2 * volume, "square");
				this.playTone(ctx, now + 0.03, 150, 0.06, 0.18 * volume, "square");
				const trapNoise = this.createNoise(ctx, 0.06, 0.15 * volume);
				trapNoise.connect(this.master as GainNode);
				trapNoise.start(now + 0.05);
				trapNoise.stop(now + 0.11);
				break;
			}
			case "intimidate": {
				// Low ominous rumble
				this.playTone(ctx, now, 70, 0.5, 0.2 * volume, "sawtooth");
				this.playTone(ctx, now + 0.1, 55, 0.5, 0.18 * volume, "triangle");
				break;
			}
			default:
				break;
		}
	}

	private createNoise(ctx: AudioContext, duration: number, gainValue: number) {
		const buffer = ctx.createBuffer(
			1,
			ctx.sampleRate * duration,
			ctx.sampleRate,
		);
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
		type: OscillatorType = "triangle",
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
