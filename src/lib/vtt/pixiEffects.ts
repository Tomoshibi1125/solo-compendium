import type { Container, Texture } from "pixi.js";
import { Sprite } from "pixi.js";

/**
 * Native Pixi v8 one-shot combat/spell effect runtime (Roll20/Foundry-style FX).
 *
 * A burst of pooled sprites that fly outward, tint-shift, scale, and fade, then
 * report themselves finished so the caller can drop them. Distinct from the
 * looping weather emitter (`pixiWeather`): effects play once and end.
 *
 * Purely visual — no bearing on any rule, mechanic, or canonical data. Budgets
 * scale with the active performance profile.
 */

export type EffectPreset = "fire" | "impact" | "magic" | "heal" | "sparkle";

export const EFFECT_PRESETS: readonly EffectPreset[] = [
	"fire",
	"impact",
	"magic",
	"heal",
	"sparkle",
];

export type EffectInstance = {
	/** Advance the burst; returns `false` once every particle has expired. */
	update: (deltaMs: number) => boolean;
	/** Remove sprites + release references (idempotent). */
	destroy: () => void;
};

type CreateEffectOptions = {
	preset: EffectPreset;
	/** Burst centre in world pixels. */
	cx: number;
	cy: number;
	/** Cell size in px (gridSize × zoom) — scales the burst radius/speed. */
	cell: number;
	/** Shared particle texture (a small white circle from the renderer). */
	texture: Texture;
	/** Performance budget from the active performance profile (fx.particleCount). */
	particleCount: number;
};

type EffectParticle = {
	sprite: Sprite;
	x: number;
	y: number;
	vx: number;
	vy: number;
	age: number;
	life: number;
};

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const lerpColor = (from: number, to: number, t: number): number => {
	const fr = (from >> 16) & 0xff;
	const fg = (from >> 8) & 0xff;
	const fb = from & 0xff;
	const tr = (to >> 16) & 0xff;
	const tg = (to >> 8) & 0xff;
	const tb = to & 0xff;
	const r = Math.round(lerp(fr, tr, t)) & 0xff;
	const g = Math.round(lerp(fg, tg, t)) & 0xff;
	const b = Math.round(lerp(fb, tb, t)) & 0xff;
	return (r << 16) | (g << 8) | b;
};

type EffectPresetDef = {
	count: (budget: number) => number;
	blendMode: Sprite["blendMode"];
	fromTint: number;
	toTint: number;
	/** Speed range in cells/sec. */
	speed: [number, number];
	/** Lifetime range in seconds. */
	life: [number, number];
	/** Scale from → to. */
	scale: [number, number];
	/** Vertical acceleration in cells/sec² (negative = rise). */
	gravity: number;
	/** Emission spread: 1 = full circle, <1 = upward-biased cone. */
	spread: number;
};

const PRESETS: Record<EffectPreset, EffectPresetDef> = {
	fire: {
		count: (b) => clamp(Math.round(b * 2), 8, 60),
		blendMode: "add",
		fromTint: 0xffcc33,
		toTint: 0xff3300,
		speed: [0.6, 1.6],
		life: [0.5, 0.9],
		scale: [0.5, 0.1],
		gravity: -1.5,
		spread: 0.5,
	},
	impact: {
		count: (b) => clamp(Math.round(b * 2), 10, 70),
		blendMode: "add",
		fromTint: 0xffffff,
		toTint: 0xffaa33,
		speed: [2, 4],
		life: [0.25, 0.45],
		scale: [0.4, 0.05],
		gravity: 0,
		spread: 1,
	},
	magic: {
		count: (b) => clamp(Math.round(b * 2), 10, 70),
		blendMode: "add",
		fromTint: 0x88aaff,
		toTint: 0xaa66ff,
		speed: [0.8, 2],
		life: [0.7, 1.1],
		scale: [0.45, 0.1],
		gravity: 0,
		spread: 1,
	},
	heal: {
		count: (b) => clamp(Math.round(b * 2), 8, 50),
		blendMode: "add",
		fromTint: 0xaaffaa,
		toTint: 0x22cc55,
		speed: [0.4, 1],
		life: [0.8, 1.3],
		scale: [0.4, 0.1],
		gravity: -2,
		spread: 0.6,
	},
	sparkle: {
		count: (b) => clamp(Math.round(b * 1.5), 6, 40),
		blendMode: "add",
		fromTint: 0xffffff,
		toTint: 0xffdd66,
		speed: [0.5, 1.5],
		life: [0.4, 0.8],
		scale: [0.35, 0.05],
		gravity: 0,
		spread: 1,
	},
};

/**
 * Spawn a one-shot effect burst parented to `layer`. Drive it from the ticker
 * via `update(deltaMs)` until it returns `false`, then call `destroy()`.
 */
export function createEffect(
	layer: Container,
	{ preset, cx, cy, cell, texture, particleCount }: CreateEffectOptions,
): EffectInstance {
	const def = PRESETS[preset] ?? PRESETS.impact;
	const size = Math.max(1, cell);
	const count = def.count(Math.max(0, particleCount));
	const particles: EffectParticle[] = [];

	for (let i = 0; i < count; i++) {
		const sprite = new Sprite(texture);
		sprite.anchor.set(0.5);
		sprite.blendMode = def.blendMode;
		sprite.tint = def.fromTint;
		sprite.scale.set(def.scale[0]);
		sprite.position.set(cx, cy);
		const angle =
			def.spread >= 1
				? rand(0, TAU)
				: -Math.PI / 2 + rand(-Math.PI * def.spread, Math.PI * def.spread);
		const speed = rand(def.speed[0], def.speed[1]) * size;
		layer.addChild(sprite);
		particles.push({
			sprite,
			x: cx,
			y: cy,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			age: 0,
			life: rand(def.life[0], def.life[1]),
		});
	}

	let destroyed = false;
	return {
		update: (deltaMs) => {
			if (destroyed) return false;
			const dt = clamp(deltaMs / 1000, 0, 0.05);
			let alive = false;
			for (const p of particles) {
				if (p.age >= p.life) {
					p.sprite.visible = false;
					continue;
				}
				alive = true;
				p.age += dt;
				p.vy += def.gravity * size * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				const f = clamp(p.age / p.life, 0, 1);
				p.sprite.position.set(p.x, p.y);
				p.sprite.scale.set(lerp(def.scale[0], def.scale[1], f));
				p.sprite.tint = lerpColor(def.fromTint, def.toTint, f);
				p.sprite.alpha = 1 - f;
			}
			return alive;
		},
		destroy: () => {
			if (destroyed) return;
			destroyed = true;
			for (const p of particles) p.sprite.destroy();
			particles.length = 0;
		},
	};
}
