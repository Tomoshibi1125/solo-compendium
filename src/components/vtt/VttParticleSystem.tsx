/**
 * VTT Particle System Component
 *
 * Connects the vast particle preset library to the PixiJS VTT stage.
 * Protocol Wardens can trigger effects on tokens or arbitrary positions.
 * Integrates with the existing `@pixi/particle-emitter` pipeline used
 * by the weather system in VttPixiStage.
 */
import { useCallback, useRef } from 'react';
import { Container, Graphics, type Application } from 'pixi.js';
import { Emitter, upgradeConfig } from '@pixi/particle-emitter';
import { getPreset, listPresets, type ParticleCategory } from '@/lib/vtt/particlePresets';

// ─── Types ──────────────────────────────────────────────────

export interface ActiveEffect {
    id: string;
    emitter: Emitter;
    presetKey: string;
    /** Whether this effect auto-removes after emitter lifetime ends */
    autoRemove: boolean;
    createdAt: number;
}

export interface VttParticleSystemHandle {
    /** Fire a one-shot effect at a world position */
    triggerEffect: (presetKey: string, worldX: number, worldY: number) => string;
    /** Attach a looping effect to a token position (returns effect ID) */
    attachEffect: (presetKey: string, worldX: number, worldY: number) => string;
    /** Remove a specific active effect by its ID */
    removeEffect: (effectId: string) => void;
    /** Remove all active effects */
    clearAll: () => void;
    /** Tick all active emitters (call from the PixiJS render loop) */
    update: (deltaSeconds: number) => void;
}

// ─── Hook ───────────────────────────────────────────────────

/**
 * useVttParticleSystem
 *
 * Provides a handle for spawning, tracking, and updating particle effects
 * within a PixiJS application. Register the returned `update` function in
 * your game ticker.
 *
 * @param app  The PixiJS Application instance
 * @param particleContainer  The Container to add effect children to
 */
export function useVttParticleSystem(
    app: Application | null,
    particleContainer: Container | null,
): VttParticleSystemHandle {
    const activeEffectsRef = useRef<Map<string, ActiveEffect>>(new Map());

    const makeTexture = useCallback(() => {
        if (!app) return null;
        const g = new Graphics();
        g.circle(0, 0, 4);
        g.fill(0xffffff);
        return app.renderer.generateTexture(g);
    }, [app]);

    const generateId = () => `fx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const triggerEffect = useCallback((presetKey: string, worldX: number, worldY: number): string => {
        if (!app || !particleContainer) return '';
        const texture = makeTexture();
        if (!texture) return '';

        const config = { ...getPreset(presetKey) };
        // Override spawn position
        if (config.pos) {
            (config.pos as { x: number; y: number }).x = worldX;
            (config.pos as { x: number; y: number }).y = worldY;
        } else {
            config.pos = { x: worldX, y: worldY };
        }

        const emitter = new Emitter(
            particleContainer as never,
            upgradeConfig(config as never, [texture]),
        );
        emitter.emit = true;

        const id = generateId();
        activeEffectsRef.current.set(id, {
            id,
            emitter,
            presetKey,
            autoRemove: true,
            createdAt: Date.now(),
        });

        return id;
    }, [app, particleContainer, makeTexture]);

    const attachEffect = useCallback((presetKey: string, worldX: number, worldY: number): string => {
        if (!app || !particleContainer) return '';
        const texture = makeTexture();
        if (!texture) return '';

        const config = { ...getPreset(presetKey) };
        // Force the emitter to loop forever
        (config as Record<string, unknown>).emitterLifetime = -1;

        if (config.pos) {
            (config.pos as { x: number; y: number }).x = worldX;
            (config.pos as { x: number; y: number }).y = worldY;
        } else {
            config.pos = { x: worldX, y: worldY };
        }

        const emitter = new Emitter(
            particleContainer as never,
            upgradeConfig(config as never, [texture]),
        );
        emitter.emit = true;

        const id = generateId();
        activeEffectsRef.current.set(id, {
            id,
            emitter,
            presetKey,
            autoRemove: false,
            createdAt: Date.now(),
        });

        return id;
    }, [app, particleContainer, makeTexture]);

    const removeEffect = useCallback((effectId: string) => {
        const effect = activeEffectsRef.current.get(effectId);
        if (effect) {
            effect.emitter.destroy();
            activeEffectsRef.current.delete(effectId);
        }
    }, []);

    const clearAll = useCallback(() => {
        for (const effect of activeEffectsRef.current.values()) {
            effect.emitter.destroy();
        }
        activeEffectsRef.current.clear();
    }, []);

    const update = useCallback((deltaSeconds: number) => {
        const toRemove: string[] = [];
        for (const [id, effect] of activeEffectsRef.current) {
            effect.emitter.update(deltaSeconds);
            // If the emitter has completed its lifetime, queue for removal
            if (effect.autoRemove && effect.emitter.particleCount === 0 && !effect.emitter.emit) {
                toRemove.push(id);
            }
        }
        for (const id of toRemove) {
            const effect = activeEffectsRef.current.get(id);
            effect?.emitter.destroy();
            activeEffectsRef.current.delete(id);
        }
    }, []);

    return { triggerEffect, attachEffect, removeEffect, clearAll, update };
}

// Re-export preset helpers for convenience
export { listPresets, type ParticleCategory };
