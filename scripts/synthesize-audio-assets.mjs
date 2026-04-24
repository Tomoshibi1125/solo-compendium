#!/usr/bin/env node
/**
 * synthesize-audio-assets.mjs
 *
 * Generates real SFX and ambient WAV files via DSP synthesis. All output is
 * CC0 (self-authored). Files are 22050 Hz, 16-bit PCM, mono. Ambient loops
 * are 6-10 s and designed to loop seamlessly (fade-in/out on first and last
 * 50 ms). SFX are 200-1000 ms one-shots.
 *
 * This intentionally avoids external HTTP / API-key dependencies so the build
 * is reproducible offline. Warden-grade replacements can be regenerated at
 * runtime via the Stable Audio Open integration (Phase 3).
 *
 * Run:  node scripts/synthesize-audio-assets.mjs
 *       node scripts/synthesize-audio-assets.mjs --force   # overwrite existing
 * Outputs:
 *   public/audio/sfx/<name>.wav
 *   public/audio/ambient/<name>.wav
 *   public/audio/AUDIO_ATTRIBUTION.md
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const SFX_DIR = join(ROOT, "public", "audio", "sfx");
const AMBIENT_DIR = join(ROOT, "public", "audio", "ambient");
const ATTRIBUTION_PATH = join(ROOT, "public", "audio", "AUDIO_ATTRIBUTION.md");

const SAMPLE_RATE = 22050;
const FORCE = process.argv.includes("--force");

// ---------------------------------------------------------------------------
// WAV encoder (PCM16 mono)
// ---------------------------------------------------------------------------

function floatToPcm16(samples) {
	const buf = Buffer.alloc(samples.length * 2);
	for (let i = 0; i < samples.length; i++) {
		let s = Math.max(-1, Math.min(1, samples[i]));
		s = Math.round(s * 32767);
		buf.writeInt16LE(s, i * 2);
	}
	return buf;
}

function encodeWav(samples, sampleRate = SAMPLE_RATE) {
	const pcm = floatToPcm16(samples);
	const dataLen = pcm.length;
	const header = Buffer.alloc(44);
	header.write("RIFF", 0);
	header.writeUInt32LE(36 + dataLen, 4);
	header.write("WAVE", 8);
	header.write("fmt ", 12);
	header.writeUInt32LE(16, 16); // PCM chunk size
	header.writeUInt16LE(1, 20); // PCM format
	header.writeUInt16LE(1, 22); // mono
	header.writeUInt32LE(sampleRate, 24);
	header.writeUInt32LE(sampleRate * 2, 28); // byte rate
	header.writeUInt16LE(2, 32); // block align
	header.writeUInt16LE(16, 34); // bits per sample
	header.write("data", 36);
	header.writeUInt32LE(dataLen, 40);
	return Buffer.concat([header, pcm]);
}

// ---------------------------------------------------------------------------
// DSP primitives (deterministic LCG RNG so output is reproducible)
// ---------------------------------------------------------------------------

function makeRng(seed) {
	let s = seed | 0 || 1;
	return () => {
		s = (s * 1664525 + 1013904223) | 0;
		return ((s >>> 0) / 4294967296) * 2 - 1;
	};
}

function whiteNoise(n, seed = 42) {
	const rng = makeRng(seed);
	const out = new Float32Array(n);
	for (let i = 0; i < n; i++) out[i] = rng();
	return out;
}

/** Low-pass filter (1-pole, normalized cutoff 0..1). */
function lowpass(samples, cutoff) {
	const out = new Float32Array(samples.length);
	const a = Math.max(0.001, Math.min(0.999, cutoff));
	let y = 0;
	for (let i = 0; i < samples.length; i++) {
		y = y + a * (samples[i] - y);
		out[i] = y;
	}
	return out;
}

/** High-pass = original - lowpass. */
function highpass(samples, cutoff) {
	const lp = lowpass(samples, cutoff);
	const out = new Float32Array(samples.length);
	for (let i = 0; i < samples.length; i++) out[i] = samples[i] - lp[i];
	return out;
}

/** Band-pass with Q approximation. */
function bandpass(samples, cutoff, bw) {
	return highpass(lowpass(samples, Math.min(0.99, cutoff + bw / 2)), Math.max(0.01, cutoff - bw / 2));
}

/** Apply ADSR envelope in-place. */
function applyEnvelope(samples, env) {
	const n = samples.length;
	for (let i = 0; i < n; i++) samples[i] *= env(i / n);
	return samples;
}

function expDecay(decayCurve = 3) {
	return (t) => Math.exp(-t * decayCurve);
}

function attackDecay(attackPct = 0.02, decayCurve = 3) {
	return (t) => {
		const atk = t < attackPct ? t / attackPct : 1;
		const dec = Math.exp(-(t - attackPct) * decayCurve);
		return atk * Math.max(0, dec);
	};
}

function fadeInOut(samples, fadeMs = 50) {
	const fadeSamples = Math.floor((fadeMs / 1000) * SAMPLE_RATE);
	const n = samples.length;
	for (let i = 0; i < Math.min(fadeSamples, n); i++) {
		const g = i / fadeSamples;
		samples[i] *= g;
		samples[n - 1 - i] *= g;
	}
	return samples;
}

function mixInto(target, source, gain = 1) {
	const n = Math.min(target.length, source.length);
	for (let i = 0; i < n; i++) target[i] += source[i] * gain;
	return target;
}

function scale(samples, gain) {
	for (let i = 0; i < samples.length; i++) samples[i] *= gain;
	return samples;
}

function concat(...arrays) {
	const total = arrays.reduce((a, b) => a + b.length, 0);
	const out = new Float32Array(total);
	let off = 0;
	for (const a of arrays) {
		out.set(a, off);
		off += a.length;
	}
	return out;
}

function sineWave(freqHz, durationSec, phase = 0) {
	const n = Math.floor(durationSec * SAMPLE_RATE);
	const out = new Float32Array(n);
	const w = (2 * Math.PI * freqHz) / SAMPLE_RATE;
	for (let i = 0; i < n; i++) out[i] = Math.sin(w * i + phase);
	return out;
}

function sawtoothWave(freqHz, durationSec) {
	const n = Math.floor(durationSec * SAMPLE_RATE);
	const out = new Float32Array(n);
	const period = SAMPLE_RATE / freqHz;
	for (let i = 0; i < n; i++) out[i] = 2 * ((i % period) / period) - 1;
	return out;
}

function triangleWave(freqHz, durationSec) {
	const n = Math.floor(durationSec * SAMPLE_RATE);
	const out = new Float32Array(n);
	const period = SAMPLE_RATE / freqHz;
	for (let i = 0; i < n; i++) {
		const p = (i % period) / period;
		out[i] = p < 0.5 ? 4 * p - 1 : 3 - 4 * p;
	}
	return out;
}

function squareWave(freqHz, durationSec) {
	const n = Math.floor(durationSec * SAMPLE_RATE);
	const out = new Float32Array(n);
	const period = SAMPLE_RATE / freqHz;
	for (let i = 0; i < n; i++) out[i] = (i % period) / period < 0.5 ? 1 : -1;
	return out;
}

/** Pitch-sweep sine from f0 to f1. */
function pitchSweep(f0, f1, durationSec) {
	const n = Math.floor(durationSec * SAMPLE_RATE);
	const out = new Float32Array(n);
	let phase = 0;
	for (let i = 0; i < n; i++) {
		const t = i / n;
		const f = f0 + (f1 - f0) * t;
		phase += (2 * Math.PI * f) / SAMPLE_RATE;
		out[i] = Math.sin(phase);
	}
	return out;
}

function normalize(samples, peak = 0.9) {
	let max = 0;
	for (let i = 0; i < samples.length; i++) max = Math.max(max, Math.abs(samples[i]));
	if (max < 1e-6) return samples;
	return scale(samples, peak / max);
}

// ---------------------------------------------------------------------------
// SFX definitions
// ---------------------------------------------------------------------------

const SFX = {
	"door-creak": () => {
		// Low-frequency creak: sawtooth pitch-swept down + noise burst
		const base = pitchSweep(180, 90, 0.8);
		applyEnvelope(base, attackDecay(0.1, 2));
		const creak = sawtoothWave(220, 0.8);
		applyEnvelope(creak, (t) => Math.sin(t * Math.PI * 6) * Math.exp(-t * 2) * 0.6);
		const creakFiltered = bandpass(creak, 0.15, 0.08);
		const noise = lowpass(whiteNoise(Math.floor(0.8 * SAMPLE_RATE), 1), 0.1);
		applyEnvelope(noise, expDecay(4));
		const out = new Float32Array(Math.floor(0.8 * SAMPLE_RATE));
		mixInto(out, base, 0.6);
		mixInto(out, creakFiltered, 0.8);
		mixInto(out, noise, 0.3);
		return normalize(out);
	},
	"sword-clash": () => {
		// Metallic impact: high-frequency noise burst + resonant tone
		const duration = 0.35;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 2);
		const noiseFiltered = bandpass(noise, 0.35, 0.15);
		applyEnvelope(noiseFiltered, attackDecay(0.005, 8));
		const tone = sineWave(2400, duration);
		const tone2 = sineWave(3200, duration);
		applyEnvelope(tone, expDecay(10));
		applyEnvelope(tone2, expDecay(12));
		const out = new Float32Array(n);
		mixInto(out, noiseFiltered, 1.2);
		mixInto(out, tone, 0.4);
		mixInto(out, tone2, 0.3);
		return normalize(out);
	},
	"fireball-whoosh": () => {
		// Whoosh: filtered noise with rising cutoff sweep + sub boom at end
		const duration = 1.0;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 3);
		const out = new Float32Array(n);
		let y = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const cutoff = 0.05 + 0.45 * t;
			y = y + cutoff * (noise[i] - y);
			const env = t < 0.7 ? Math.sin(t * Math.PI * 0.7) : Math.exp(-(t - 0.7) * 8);
			out[i] = y * env * 1.2;
		}
		// Sub boom at t=0.7s
		const sub = pitchSweep(80, 40, 0.3);
		applyEnvelope(sub, expDecay(5));
		const subOffset = Math.floor(0.65 * SAMPLE_RATE);
		for (let i = 0; i < sub.length && subOffset + i < n; i++) {
			out[subOffset + i] += sub[i] * 0.8;
		}
		return normalize(out);
	},
	"thunder-rumble": () => {
		// Distant thunder: low-passed pink noise with slow crackles
		const duration = 2.5;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 4);
		const low = lowpass(noise, 0.05);
		const out = new Float32Array(n);
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const envA = t < 0.05 ? t / 0.05 : 1;
			const envB = t > 0.3 ? Math.exp(-(t - 0.3) * 2.5) : 1;
			out[i] = low[i] * envA * envB * 1.8;
		}
		// Secondary crack burst
		const crackOffset = Math.floor(0.15 * SAMPLE_RATE);
		const crack = highpass(whiteNoise(Math.floor(0.15 * SAMPLE_RATE), 5), 0.25);
		applyEnvelope(crack, expDecay(15));
		for (let i = 0; i < crack.length && crackOffset + i < n; i++) {
			out[crackOffset + i] += crack[i] * 0.5;
		}
		return normalize(out);
	},
	"heal-chime": () => {
		// Bell chime: multiple sine partials with harmonic decay
		const duration = 1.5;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		const partials = [
			{ freq: 523.25, gain: 1.0, decay: 3 },
			{ freq: 784, gain: 0.7, decay: 4 },
			{ freq: 1046.5, gain: 0.5, decay: 5 },
			{ freq: 1568, gain: 0.3, decay: 7 },
		];
		for (const p of partials) {
			const tone = sineWave(p.freq, duration);
			applyEnvelope(tone, expDecay(p.decay));
			mixInto(out, tone, p.gain);
		}
		// Slight shimmer attack
		const shimmer = highpass(whiteNoise(Math.floor(0.05 * SAMPLE_RATE), 6), 0.5);
		applyEnvelope(shimmer, expDecay(20));
		mixInto(out, shimmer, 0.3);
		return normalize(out);
	},
	"monster-roar": () => {
		// Low sawtooth with pitch wobble + growl
		const duration = 1.3;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		let phase = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const vibrato = 1 + Math.sin(t * Math.PI * 2 * 8) * 0.08;
			const base = 85 * vibrato * (1 - t * 0.15);
			phase += (2 * Math.PI * base) / SAMPLE_RATE;
			// Hard-clip sawtooth with second harmonic
			const saw = ((phase / (2 * Math.PI)) % 1) * 2 - 1;
			const harmonic = Math.sin(phase * 2) * 0.4;
			const env = t < 0.1 ? t / 0.1 : Math.exp(-(t - 0.1) * 1.5);
			out[i] = (saw + harmonic) * env;
		}
		// Growl noise layer
		const growl = bandpass(whiteNoise(n, 7), 0.12, 0.06);
		applyEnvelope(growl, (t) => (t < 0.1 ? t / 0.1 : Math.exp(-(t - 0.1) * 2)));
		mixInto(out, growl, 0.35);
		return normalize(out, 0.95);
	},
	"arrow-shot": () => {
		// Whoosh + thwip: noise sweep + pluck
		const duration = 0.4;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 8);
		const out = new Float32Array(n);
		let y = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const cutoff = 0.1 + 0.4 * t;
			y = y + cutoff * (noise[i] - y);
			out[i] = y * (1 - t) * 1.3;
		}
		// Pluck transient
		const pluck = pitchSweep(1200, 800, 0.05);
		applyEnvelope(pluck, expDecay(30));
		mixInto(out, pluck, 0.8);
		return normalize(out);
	},
	"dice-roll": () => {
		// Short random clicks with wood-like resonance
		const duration = 0.9;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		const rng = makeRng(9);
		let nextClick = 0;
		let clickCount = 0;
		while (nextClick < n && clickCount < 7) {
			const clickLen = Math.floor((0.015 + Math.abs(rng()) * 0.01) * SAMPLE_RATE);
			const clickNoise = highpass(whiteNoise(clickLen, 10 + clickCount), 0.2);
			applyEnvelope(clickNoise, expDecay(40));
			const resonance = sineWave(400 + Math.abs(rng()) * 300, clickLen / SAMPLE_RATE);
			applyEnvelope(resonance, expDecay(25));
			for (let i = 0; i < clickLen && nextClick + i < n; i++) {
				out[nextClick + i] += clickNoise[i] * 0.9 + resonance[i] * 0.4;
			}
			nextClick += Math.floor((0.08 + Math.abs(rng()) * 0.1) * SAMPLE_RATE);
			clickCount++;
		}
		return normalize(out);
	},
	"footstep-stone": () => {
		// Short impact: filtered noise burst
		const duration = 0.18;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 11);
		const filtered = lowpass(highpass(noise, 0.08), 0.25);
		applyEnvelope(filtered, attackDecay(0.01, 15));
		// Thunk resonance
		const thunk = sineWave(120, duration);
		applyEnvelope(thunk, expDecay(20));
		const out = new Float32Array(n);
		mixInto(out, filtered, 1.2);
		mixInto(out, thunk, 0.6);
		return normalize(out);
	},
	"sword-unsheath": () => {
		// Metallic slide: filtered noise with rising pitch
		const duration = 0.5;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 12);
		const out = new Float32Array(n);
		let y = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			const cutoff = 0.08 + 0.35 * t;
			y = y + cutoff * (noise[i] - y);
			const env = t < 0.05 ? t / 0.05 : (t > 0.4 ? (1 - t) / 0.6 : 1);
			out[i] = y * env * 1.3;
		}
		// Final ring
		const ring = sineWave(3200, duration);
		applyEnvelope(ring, (t) => (t > 0.7 ? Math.exp(-(t - 0.7) * 8) : 0));
		mixInto(out, ring, 0.35);
		return normalize(out);
	},
	"spell-cast": () => {
		// Rising magical shimmer: multiple sine sweeps + high-frequency sparkle
		const duration = 0.9;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		mixInto(out, pitchSweep(220, 880, duration), 0.5);
		mixInto(out, pitchSweep(330, 1320, duration), 0.4);
		mixInto(out, pitchSweep(440, 1760, duration), 0.3);
		const sparkle = highpass(whiteNoise(n, 13), 0.5);
		applyEnvelope(sparkle, (t) => t * Math.exp(-(1 - t) * 0));
		mixInto(out, sparkle, 0.4);
		applyEnvelope(out, (t) => (t < 0.05 ? t / 0.05 : t > 0.8 ? (1 - t) / 0.2 : 1));
		return normalize(out);
	},
};

// ---------------------------------------------------------------------------
// Ambient loop definitions (all designed to loop: fade in/out 50 ms edges)
// ---------------------------------------------------------------------------

const AMBIENT = {
	"rain-light": () => {
		// Filtered noise with subtle high-frequency shimmer
		const duration = 8;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise1 = lowpass(whiteNoise(n, 20), 0.3);
		const noise2 = highpass(whiteNoise(n, 21), 0.4);
		const out = new Float32Array(n);
		mixInto(out, noise1, 0.7);
		mixInto(out, noise2, 0.25);
		// Occasional drop clicks
		const rng = makeRng(22);
		let i = 0;
		while (i < n) {
			if (Math.abs(rng()) > 0.9) {
				const clickLen = Math.floor(0.004 * SAMPLE_RATE);
				for (let j = 0; j < clickLen && i + j < n; j++) {
					out[i + j] += rng() * Math.exp(-j / (clickLen * 0.5)) * 0.15;
				}
			}
			i += Math.floor(0.002 * SAMPLE_RATE);
		}
		return fadeInOut(normalize(out, 0.7), 50);
	},
	"rain-thunderstorm": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		// Base heavy rain
		const base = lowpass(whiteNoise(n, 23), 0.35);
		const out = new Float32Array(n);
		mixInto(out, base, 0.85);
		mixInto(out, highpass(whiteNoise(n, 24), 0.5), 0.2);
		// Thunder at ~2s and ~6s
		for (const startSec of [2.0, 6.2]) {
			const offset = Math.floor(startSec * SAMPLE_RATE);
			const thunderDur = 2.5;
			const thunderN = Math.floor(thunderDur * SAMPLE_RATE);
			const thunder = lowpass(whiteNoise(thunderN, 25 + offset), 0.04);
			for (let i = 0; i < thunderN && offset + i < n; i++) {
				const t = i / thunderN;
				const env = t < 0.05 ? t / 0.05 : Math.exp(-(t - 0.05) * 2.2);
				out[offset + i] += thunder[i] * env * 2.2;
			}
		}
		return fadeInOut(normalize(out, 0.85), 80);
	},
	"wind-gust": () => {
		const duration = 8;
		const n = Math.floor(duration * SAMPLE_RATE);
		const noise = whiteNoise(n, 30);
		const out = new Float32Array(n);
		let y = 0;
		for (let i = 0; i < n; i++) {
			const t = i / n;
			// Slow LFO modulating cutoff -> gust
			const lfo = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.4);
			const cutoff = 0.05 + 0.25 * lfo;
			y = y + cutoff * (noise[i] - y);
			out[i] = y * (0.4 + 0.6 * lfo);
		}
		return fadeInOut(normalize(out, 0.75), 100);
	},
	"forest-birds": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Base forest rustle
		const rustle = lowpass(whiteNoise(n, 40), 0.18);
		mixInto(out, rustle, 0.25);
		// Random bird chirps
		const rng = makeRng(41);
		let t = 0.5;
		while (t < duration - 0.5) {
			const chirpDur = 0.08 + Math.abs(rng()) * 0.08;
			const chirpN = Math.floor(chirpDur * SAMPLE_RATE);
			const f0 = 2000 + Math.abs(rng()) * 1500;
			const f1 = f0 + (rng() > 0 ? 1 : -1) * (500 + Math.abs(rng()) * 800);
			const chirp = pitchSweep(f0, f1, chirpDur);
			applyEnvelope(chirp, (u) => Math.sin(u * Math.PI) * 0.8);
			const offset = Math.floor(t * SAMPLE_RATE);
			for (let i = 0; i < chirpN && offset + i < n; i++) {
				out[offset + i] += chirp[i] * 0.5;
			}
			t += 0.2 + Math.abs(rng()) * 0.6;
		}
		return fadeInOut(normalize(out, 0.75), 80);
	},
	"forest-night": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Wind base
		const wind = lowpass(whiteNoise(n, 50), 0.08);
		mixInto(out, wind, 0.4);
		// Cricket chorus — high-frequency intermittent chirps
		const rng = makeRng(51);
		for (let k = 0; k < 400; k++) {
			const start = Math.abs(rng()) * duration;
			const chirpLen = 0.02 + Math.abs(rng()) * 0.02;
			const chirpN = Math.floor(chirpLen * SAMPLE_RATE);
			const freq = 3500 + Math.abs(rng()) * 1000;
			const chirp = sineWave(freq, chirpLen);
			applyEnvelope(chirp, expDecay(30));
			const offset = Math.floor(start * SAMPLE_RATE);
			for (let i = 0; i < chirpN && offset + i < n; i++) {
				out[offset + i] += chirp[i] * 0.1;
			}
		}
		// Occasional owl hoot
		for (const startSec of [3.2, 7.8]) {
			const hootDur = 0.4;
			const hoot = sineWave(220, hootDur);
			applyEnvelope(hoot, (u) => Math.sin(u * Math.PI) * 0.8);
			const offset = Math.floor(startSec * SAMPLE_RATE);
			for (let i = 0; i < hoot.length && offset + i < n; i++) {
				out[offset + i] += hoot[i] * 0.15;
			}
		}
		return fadeInOut(normalize(out, 0.7), 100);
	},
	"ocean-waves": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		const noise = whiteNoise(n, 60);
		// Wave rhythm: ~0.2 Hz undulation
		let y = 0;
		for (let i = 0; i < n; i++) {
			const t = i / SAMPLE_RATE;
			const wave = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 0.15);
			const cutoff = 0.03 + 0.15 * wave;
			y = y + cutoff * (noise[i] - y);
			out[i] = y * (0.6 + 0.4 * wave) * 1.5;
		}
		return fadeInOut(normalize(out, 0.85), 100);
	},
	"marketplace-bustle": () => {
		const duration = 8;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Crowd murmur base (bandpass noise)
		const crowd = bandpass(whiteNoise(n, 70), 0.12, 0.15);
		mixInto(out, crowd, 0.6);
		// Random voice-like formant blips
		const rng = makeRng(71);
		for (let k = 0; k < 80; k++) {
			const start = Math.abs(rng()) * duration;
			const blipDur = 0.05 + Math.abs(rng()) * 0.15;
			const blipN = Math.floor(blipDur * SAMPLE_RATE);
			const formant = 300 + Math.abs(rng()) * 400;
			const blip = sineWave(formant, blipDur);
			const blip2 = sineWave(formant * 1.5, blipDur);
			applyEnvelope(blip, (u) => Math.sin(u * Math.PI));
			applyEnvelope(blip2, (u) => Math.sin(u * Math.PI) * 0.6);
			const offset = Math.floor(start * SAMPLE_RATE);
			for (let i = 0; i < blipN && offset + i < n; i++) {
				out[offset + i] += (blip[i] + blip2[i]) * 0.08;
			}
		}
		return fadeInOut(normalize(out, 0.7), 80);
	},
	"library-quiet": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Very quiet room tone
		const tone = lowpass(whiteNoise(n, 80), 0.03);
		mixInto(out, tone, 0.35);
		// Occasional paper rustle
		const rng = makeRng(81);
		for (let k = 0; k < 5; k++) {
			const start = 1 + Math.abs(rng()) * (duration - 2);
			const rustleDur = 0.3 + Math.abs(rng()) * 0.4;
			const rustleN = Math.floor(rustleDur * SAMPLE_RATE);
			const rustle = highpass(whiteNoise(rustleN, 82 + k), 0.35);
			applyEnvelope(rustle, (u) => Math.sin(u * Math.PI) * 0.6);
			const offset = Math.floor(start * SAMPLE_RATE);
			for (let i = 0; i < rustleN && offset + i < n; i++) {
				out[offset + i] += rustle[i] * 0.1;
			}
		}
		return fadeInOut(normalize(out, 0.5), 100);
	},
	"swamp-frogs": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Low drone
		const drone = lowpass(whiteNoise(n, 90), 0.04);
		mixInto(out, drone, 0.4);
		// Frog croaks
		const rng = makeRng(91);
		for (let k = 0; k < 25; k++) {
			const start = Math.abs(rng()) * duration;
			const croakDur = 0.2 + Math.abs(rng()) * 0.15;
			const croakN = Math.floor(croakDur * SAMPLE_RATE);
			const f0 = 120 + Math.abs(rng()) * 80;
			// Growling croak — sawtooth with pitch wobble
			const croak = new Float32Array(croakN);
			let phase = 0;
			for (let i = 0; i < croakN; i++) {
				const t = i / croakN;
				const vib = 1 + Math.sin(t * Math.PI * 2 * 20) * 0.15;
				phase += (2 * Math.PI * f0 * vib) / SAMPLE_RATE;
				const env = Math.sin(t * Math.PI);
				croak[i] = (((phase / (2 * Math.PI)) % 1) * 2 - 1) * env;
			}
			const offset = Math.floor(start * SAMPLE_RATE);
			for (let i = 0; i < croakN && offset + i < n; i++) {
				out[offset + i] += croak[i] * 0.25;
			}
		}
		return fadeInOut(normalize(out, 0.75), 100);
	},
	"crypt-echoes": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Low sub drone
		const drone = lowpass(whiteNoise(n, 100), 0.03);
		mixInto(out, drone, 0.45);
		// Distant water drips (long echo tails)
		const rng = makeRng(101);
		for (let k = 0; k < 12; k++) {
			const start = Math.abs(rng()) * duration;
			const dripFreq = 600 + Math.abs(rng()) * 400;
			const dripLen = 0.5;
			const drip = sineWave(dripFreq, dripLen);
			applyEnvelope(drip, (u) => (u < 0.02 ? u / 0.02 : Math.exp(-(u - 0.02) * 5)));
			const offset = Math.floor(start * SAMPLE_RATE);
			for (let i = 0; i < drip.length && offset + i < n; i++) {
				out[offset + i] += drip[i] * 0.15;
			}
		}
		// Occasional low groan
		for (const startSec of [3.5, 8.0]) {
			const groan = pitchSweep(55, 42, 1.5);
			applyEnvelope(groan, (u) => Math.sin(u * Math.PI) * 0.7);
			const offset = Math.floor(startSec * SAMPLE_RATE);
			for (let i = 0; i < groan.length && offset + i < n; i++) {
				out[offset + i] += groan[i] * 0.2;
			}
		}
		return fadeInOut(normalize(out, 0.7), 100);
	},
	"campfire-crackle": () => {
		const duration = 8;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Base hiss
		const hiss = bandpass(whiteNoise(n, 110), 0.12, 0.1);
		mixInto(out, hiss, 0.45);
		// Crackles
		const rng = makeRng(111);
		let t = 0.1;
		while (t < duration - 0.1) {
			const crackLen = Math.floor((0.005 + Math.abs(rng()) * 0.02) * SAMPLE_RATE);
			const crack = highpass(whiteNoise(crackLen, 112 + Math.floor(t * 100)), 0.3);
			applyEnvelope(crack, expDecay(25));
			const offset = Math.floor(t * SAMPLE_RATE);
			const gain = 0.3 + Math.abs(rng()) * 0.3;
			for (let i = 0; i < crackLen && offset + i < n; i++) {
				out[offset + i] += crack[i] * gain;
			}
			t += 0.03 + Math.abs(rng()) * 0.15;
		}
		return fadeInOut(normalize(out, 0.8), 80);
	},
	"dungeon-drip": () => {
		const duration = 10;
		const n = Math.floor(duration * SAMPLE_RATE);
		const out = new Float32Array(n);
		// Low rumble base
		const rumble = lowpass(whiteNoise(n, 120), 0.02);
		mixInto(out, rumble, 0.35);
		// Rhythmic drips
		const dripTimes = [1.2, 3.1, 4.8, 6.4, 8.3, 9.5];
		for (const ts of dripTimes) {
			const dripDur = 0.4;
			const drip = sineWave(800, dripDur);
			applyEnvelope(drip, (u) => (u < 0.01 ? u * 100 : Math.exp(-(u - 0.01) * 8)));
			const offset = Math.floor(ts * SAMPLE_RATE);
			for (let i = 0; i < drip.length && offset + i < n; i++) {
				out[offset + i] += drip[i] * 0.25;
			}
		}
		return fadeInOut(normalize(out, 0.6), 100);
	},
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	await mkdir(SFX_DIR, { recursive: true });
	await mkdir(AMBIENT_DIR, { recursive: true });

	const results = { sfx: [], ambient: [], skipped: [], errors: [] };

	for (const [name, fn] of Object.entries(SFX)) {
		const outPath = join(SFX_DIR, `${name}.wav`);
		if (existsSync(outPath) && !FORCE) {
			results.skipped.push(`sfx/${name}.wav`);
			continue;
		}
		try {
			const samples = fn();
			const wav = encodeWav(samples);
			await writeFile(outPath, wav);
			results.sfx.push({ name, bytes: wav.length, durationSec: (samples.length / SAMPLE_RATE).toFixed(2) });
			console.log(`  [sfx] ${name}.wav (${(wav.length / 1024).toFixed(1)} KB, ${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
		} catch (err) {
			results.errors.push({ name, type: "sfx", error: String(err) });
			console.error(`  [sfx] FAILED ${name}:`, err.message);
		}
	}

	for (const [name, fn] of Object.entries(AMBIENT)) {
		const outPath = join(AMBIENT_DIR, `${name}.wav`);
		if (existsSync(outPath) && !FORCE) {
			results.skipped.push(`ambient/${name}.wav`);
			continue;
		}
		try {
			const samples = fn();
			const wav = encodeWav(samples);
			await writeFile(outPath, wav);
			results.ambient.push({ name, bytes: wav.length, durationSec: (samples.length / SAMPLE_RATE).toFixed(2) });
			console.log(`  [ambient] ${name}.wav (${(wav.length / 1024).toFixed(1)} KB, ${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
		} catch (err) {
			results.errors.push({ name, type: "ambient", error: String(err) });
			console.error(`  [ambient] FAILED ${name}:`, err.message);
		}
	}

	// Attribution file
	const attr = [
		"# Audio Attribution",
		"",
		"All audio files in this directory are **CC0 1.0 Universal (Public Domain)**.",
		"",
		"## SFX (`public/audio/sfx/`)",
		"",
		"These WAV files are algorithmically synthesised via `scripts/synthesize-audio-assets.mjs`",
		"using standard DSP primitives (filtered noise, sine/sawtooth oscillators, pitch sweeps,",
		"envelopes). They are self-authored and released under CC0.",
		"",
		"Ship-ready high-fidelity replacements can be regenerated on demand through the",
		"Warden-only AI Audio Generator (Stable Audio Open via Hugging Face).",
		"",
		"### File list",
		"",
		...Object.keys(SFX).map((n) => `- \`${n}.wav\``),
		"",
		"## Ambient (`public/audio/ambient/`)",
		"",
		"Seamlessly-looping ambient beds (6-10 s each) synthesised by the same script.",
		"All CC0.",
		"",
		...Object.keys(AMBIENT).map((n) => `- \`${n}.wav\``),
		"",
		"## Music (`public/audio/music/`)",
		"",
		"- `dark-cavern-ambient-1.ogg`, `dark-cavern-ambient-2.ogg` — Paul Wortmann / CC0",
		"- `cold-silence.ogg` — Eponasoft / CC0",
		"- `bleeding-out.ogg` — HaelDB / CC0",
		"- `town-theme-rpg.mp3` — cynicmusic / CC0",
		"- `dungeon-ambience.ogg` — yd / CC0",
		"- `epic-combat.ogg`, `tavern-ambience.ogg` — CC0",
		"",
		"## Regeneration",
		"",
		"To regenerate all synthesised files:",
		"",
		"```",
		"node scripts/synthesize-audio-assets.mjs --force",
		"```",
		"",
	].join("\n");

	await writeFile(ATTRIBUTION_PATH, attr, "utf8");

	console.log("");
	console.log(`[audio] Generated ${results.sfx.length} SFX + ${results.ambient.length} ambient files`);
	console.log(`[audio] Skipped ${results.skipped.length} existing files (use --force to regenerate)`);
	if (results.errors.length > 0) {
		console.log(`[audio] ${results.errors.length} errors`);
	}
	console.log(`[audio] Attribution written to ${ATTRIBUTION_PATH}`);
}

main().catch((err) => {
	console.error("[audio] FAILED:", err);
	process.exit(1);
});
