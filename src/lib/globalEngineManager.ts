// GLOBAL ENGINE INTEGRATION SYSTEM
// Best-in-class free rendering engines, 3D engines, physics engines, and game engines

import * as THREE from 'three';
import * as BABYLON from '@babylonjs/core';
import * as CANNON from 'cannon-es';
import * as AMMO from 'ammo.js';
import * as D3 from 'd3';
import * as P5 from 'p5';
import * as Phaser from 'phaser';
import * as Kaboom from 'kaboom';
import * as PixiJS from 'pixi.js';
import * as PlayCanvas from 'playcanvas';
import * as Zephyr3D from 'zephyr3d';
import * as Two from 'two.js';
import * as Hilo from 'hilo';
import * as Box2D from 'box2d-wasm';
import * as Planck from 'planck-js';
import * as WebGPUUtils from 'webgpu-utils';
import * as TWGL from 'twgl.js';
import * as REGL from 'regl';

export interface EngineCapabilities {
  name: string;
  type: '3d' | '2d' | 'physics' | 'rendering' | 'game' | 'webgpu';
  version: string;
  features: string[];
  performance: 'high' | 'medium' | 'low';
  learningCurve: 'easy' | 'medium' | 'hard';
  documentation: string;
  license: 'MIT' | 'Apache-2.0' | 'BSD' | 'GPL';
}

export interface EngineConfig {
  enablePhysics?: boolean;
  enableWebGL?: boolean;
  enableWebGPU?: boolean;
  maxPerformance?: boolean;
  debugMode?: boolean;
}

export class GlobalEngineManager {
  private static instance: GlobalEngineManager;
  private engines: Map<string, EngineCapabilities> = new Map();
  private activeEngines: Map<string, any> = new Map();
  private config: EngineConfig;

  private constructor() {
    this.config = {
      enablePhysics: true,
      enableWebGL: true,
      enableWebGPU: true,
      maxPerformance: true,
      debugMode: false
    };
    this.initializeEngines();
  }

  public static getInstance(): GlobalEngineManager {
    if (!GlobalEngineManager.instance) {
      GlobalEngineManager.instance = new GlobalEngineManager();
    }
    return GlobalEngineManager.instance;
  }

  private initializeEngines(): void {
    // ONLY BEST-IN-CLASS ENGINES - Simplified for default use
    this.engines.set('three', {
      name: 'Three.js',
      type: '3d',
      version: '0.182.0',
      features: ['WebGL', 'WebGPU', 'VR', 'AR', 'Raycasting', 'Shaders', 'Post-processing'],
      performance: 'high',
      learningCurve: 'medium',
      documentation: 'https://threejs.org/docs/',
      license: 'MIT'
    });

    this.engines.set('babylonjs', {
      name: 'Babylon.js',
      type: '3d',
      version: '7.8.1',
      features: ['WebGL', 'WebGPU', 'Physics', 'GUI', 'Particles', 'Animation', 'Audio'],
      performance: 'high',
      learningCurve: 'easy',
      documentation: 'https://doc.babylonjs.com/',
      license: 'Apache-2.0'
    });

    // BEST GAME ENGINE - Phaser (most features, easiest to use)
    this.engines.set('phaser', {
      name: 'Phaser',
      type: 'game',
      version: '3.80.1',
      features: ['2D/3D', 'Physics', 'Animation', 'Particles', 'Tilemaps', 'Multiplayer'],
      performance: 'high',
      learningCurve: 'medium',
      documentation: 'https://phaser.io/docs/',
      license: 'MIT'
    });

    // BEST PHYSICS ENGINE - Cannon-ES (modern, industry standard)
    this.engines.set('cannon-es', {
      name: 'Cannon-ES',
      type: 'physics',
      version: '0.20.0',
      features: ['3D Physics', 'Rigid Bodies', 'Constraints', 'Collision Detection', 'Modern ES6'],
      performance: 'high',
      learningCurve: 'medium',
      documentation: 'https://github.com/pmndrs/cannon-es',
      license: 'MIT'
    });

    // BEST DATA VISUALIZATION - D3.js (industry standard)
    this.engines.set('d3', {
      name: 'D3.js',
      type: 'rendering',
      version: '7.9.0',
      features: ['Data Visualization', 'SVG', 'DOM Manipulation', 'Animations', 'Transitions'],
      performance: 'high',
      learningCurve: 'hard',
      documentation: 'https://d3js.org/',
      license: 'BSD'
    });

    // BEST WEBGPU ENGINE - Zephyr3D (modern, WebGPU-first)
    this.engines.set('zephyr3d', {
      name: 'Zephyr3D',
      type: '3d',
      version: '0.3.0',
      features: ['WebGPU', 'TypeScript', 'Modern Architecture', 'High Performance'],
      performance: 'high',
      learningCurve: 'medium',
      documentation: 'https://zephyr3d.dev/',
      license: 'MIT'
    });
  }

  public getEngine(name: string): EngineCapabilities | null {
    return this.engines.get(name) || null;
  }

  public getAllEngines(): Map<string, EngineCapabilities> {
    return new Map(this.engines);
  }

  public getEnginesByType(type: EngineCapabilities['type']): Map<string, EngineCapabilities> {
    const filtered = new Map<string, EngineCapabilities>();
    for (const [name, engine] of this.engines) {
      if (engine.type === type) {
        filtered.set(name, engine);
      }
    }
    return filtered;
  }

  public getEnginesByPerformance(performance: EngineCapabilities['performance']): Map<string, EngineCapabilities> {
    const filtered = new Map<string, EngineCapabilities>();
    for (const [name, engine] of this.engines) {
      if (engine.performance === performance) {
        filtered.set(name, engine);
      }
    }
    return filtered;
  }

  public getEnginesByLearningCurve(learningCurve: EngineCapabilities['learningCurve']): Map<string, EngineCapabilities> {
    const filtered = new Map<string, EngineCapabilities>();
    for (const [name, engine] of this.engines) {
      if (engine.learningCurve === learningCurve) {
        filtered.set(name, engine);
      }
    }
    return filtered;
  }

  public async initializeEngine(name: string, config?: Partial<EngineConfig>): Promise<boolean> {
    const engine = this.engines.get(name);
    if (!engine) {
      console.error(`Engine ${name} not found`);
      return false;
    }

    try {
      switch (name) {
        case 'three':
          // Initialize Three.js with optimal settings
          const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          });
          this.activeEngines.set(name, { renderer, THREE });
          return true;

        case 'babylonjs':
          // Initialize Babylon.js with optimal settings
          const canvas = document.createElement('canvas');
          const engine = new BABYLON.Engine(canvas, true);
          this.activeEngines.set(name, { engine, BABYLON });
          return true;

        case 'phaser':
          // Initialize Phaser with optimal settings
          const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            physics: {
              default: 'arcade',
              arcade: {
                gravity: { y: 300 },
                debug: this.config.debugMode
              }
            }
          });
          this.activeEngines.set(name, { game, Phaser });
          return true;

        case 'd3':
          // Initialize D3.js
          this.activeEngines.set(name, { d3: D3 });
          return true;

        default:
          console.log(`Engine ${name} initialization not yet implemented`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to initialize ${name}:`, error);
      return false;
    }
  }

  public getActiveEngine(name: string): any {
    return this.activeEngines.get(name);
  }

  public getAllActiveEngines(): Map<string, any> {
    return new Map(this.activeEngines);
  }

  public getBestEngineForUseCase(useCase: string): EngineCapabilities | null {
    switch (useCase) {
      case '3d-graphics':
        // Best for 3D graphics: Babylon.js (easiest) or Three.js (most flexible)
        return this.engines.get('babylonjs') || this.engines.get('three');
      
      case '2d-game':
        // Best for 2D games: Phaser (most features) or Kaboom (easiest)
        return this.engines.get('phaser') || this.engines.get('kaboom');
      
      case 'physics-simulation':
        // Best for physics: Cannon-ES (modern) or Ammo.js (industry standard)
        return this.engines.get('cannon-es') || this.engines.get('ammo.js');
      
      case 'data-visualization':
        // Best for data viz: D3.js (industry standard)
        return this.engines.get('d3');
      
      case 'webgpu-graphics':
        // Best for WebGPU: Zephyr3D (modern) or Babylon.js (WebGPU support)
        return this.engines.get('zephyr3d') || this.engines.get('babylonjs');
      
      default:
        return null;
    }
  }

  public compareEngines(engine1: string, engine2: string): {
    engine1: EngineCapabilities;
    engine2: EngineCapabilities;
    winner: string;
    reason: string;
  } {
    const e1 = this.engines.get(engine1);
    const e2 = this.engines.get(engine2);
    
    if (!e1 || !e2) {
      throw new Error('One or both engines not found');
    }

    // Simple scoring system
    const score1 = this.calculateEngineScore(e1);
    const score2 = this.calculateEngineScore(e2);
    
    return {
      engine1: e1,
      engine2: e2,
      winner: score1 > score2 ? engine1 : engine2,
      reason: score1 > score2 ? 
        `${e1.name} wins with score ${score1} vs ${score2}` : 
        `${e2.name} wins with score ${score2} vs ${score1}`
    };
  }

  private calculateEngineScore(engine: EngineCapabilities): number {
    let score = 0;
    
    // Performance scoring
    if (engine.performance === 'high') score += 30;
    else if (engine.performance === 'medium') score += 20;
    else score += 10;
    
    // Learning curve scoring
    if (engine.learningCurve === 'easy') score += 20;
    else if (engine.learningCurve === 'medium') score += 10;
    else score += 5;
    
    // Feature count scoring
    score += engine.features.length * 2;
    
    // License preference (MIT/Apache preferred)
    if (engine.license === 'MIT' || engine.license === 'Apache-2.0') score += 10;
    else if (engine.license === 'BSD') score += 5;
    
    return score;
  }

  public getRecommendedStack(useCase: string): {
    primary: EngineCapabilities;
    secondary: EngineCapabilities[];
    physics?: EngineCapabilities;
    rendering?: EngineCapabilities;
  } {
    const primary = this.getBestEngineForUseCase(useCase as any);
    if (!primary) {
      throw new Error(`No engine found for use case: ${useCase}`);
    }

    const stack: any = {
      primary,
      secondary: []
    };

    // Add complementary engines
    if (primary.type === '3d' || primary.type === 'game') {
      stack.physics = this.getBestEngineForUseCase('physics-simulation');
      if (stack.physics) stack.secondary.push(stack.physics);
    }

    if (primary.type === 'rendering' || primary.type === 'game') {
      stack.rendering = this.getBestEngineForUseCase('data-visualization');
      if (stack.rendering) stack.secondary.push(stack.rendering);
    }

    return stack;
  }

  public getEngineStatistics(): {
    totalEngines: number;
    byType: Record<string, number>;
    byPerformance: Record<string, number>;
    byLicense: Record<string, number>;
  } {
    const stats = {
      totalEngines: this.engines.size,
      byType: {} as Record<string, number>,
      byPerformance: {} as Record<string, number>,
      byLicense: {} as Record<string, number>
    };

    for (const engine of this.engines.values()) {
      stats.byType[engine.type] = (stats.byType[engine.type] || 0) + 1;
      stats.byPerformance[engine.performance] = (stats.byPerformance[engine.performance] || 0) + 1;
      stats.byLicense[engine.license] = (stats.byLicense[engine.license] || 0) + 1;
    }

    return stats;
  }
}

// Export singleton instance
export const engineManager = GlobalEngineManager.getInstance();

// Utility functions for global access
export const getBest3DEngine = () => engineManager.getBestEngineForUseCase('3d-graphics');
export const getBest2DGameEngine = () => engineManager.getBestEngineForUseCase('2d-game');
export const getBestPhysicsEngine = () => engineManager.getBestEngineForUseCase('physics-simulation');
export const getBestRenderingEngine = () => engineManager.getBestEngineForUseCase('data-visualization');
export const getBestWebGPUEngine = () => engineManager.getBestEngineForUseCase('webgpu-graphics');

// Initialize all engines on import
if (typeof window !== 'undefined') {
  console.log('🚀 Global Engine Manager initialized with', engineManager.getEngineStatistics().totalEngines, 'engines');
  console.log('📊 Engine breakdown:', engineManager.getEngineStatistics().byType);
}
