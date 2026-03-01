import { describe, it, expect } from 'vitest';
import {
    rayWallIntersection,
    computeLightLevel,
    createWall,
    toggleDoor,
    snapToGrid
} from '../vtt';
import type { WallSegment, LightSource } from '../vtt';

describe('VTT Lighting Engine', () => {
    describe('Wall Management', () => {
        it('creates a wall segment', () => {
            const wall = createWall(0, 0, 100, 100, 'wall');
            expect(wall.id).toMatch(/^wall-\d+-/);
            expect(wall.type).toBe('wall');
            expect(wall.x1).toBe(0);
            expect(wall.y2).toBe(100);
            expect(wall.doorOpen).toBeUndefined();
        });

        it('creates a door that can be toggled', () => {
            const door = createWall(0, 0, 50, 0, 'door');
            expect(door.type).toBe('door');
            expect(door.doorOpen).toBe(false);

            const walls = [door];
            const toggled = toggleDoor(walls, door.id);
            expect(toggled[0].doorOpen).toBe(true);

            const toggledAgain = toggleDoor(toggled, door.id);
            expect(toggledAgain[0].doorOpen).toBe(false);
        });
    });

    describe('snapToGrid', () => {
        it('snaps coordinates to the nearest grid increment', () => {
            expect(snapToGrid(24, 50)).toBe(0);
            expect(snapToGrid(26, 50)).toBe(50);
            expect(snapToGrid(75, 50)).toBe(100);
        });
    });

    describe('rayWallIntersection', () => {
        const walls: WallSegment[] = [
            createWall(100, 0, 100, 100, 'wall'), // Vertical wall at x=100
            createWall(0, 100, 50, 100, 'door'),  // Horizontal door at y=100
        ];

        it('detects intersection when ray hits a wall', () => {
            // Ray from (0, 50) heading right (dx=1, dy=0)
            const hit = rayWallIntersection(0, 50, 1, 0, walls);
            expect(hit).not.toBeNull();
            expect(hit?.x).toBe(100);
            expect(hit?.y).toBe(50);
            expect(hit?.dist).toBe(100);
        });

        it('does not intersect when ray points away', () => {
            // Ray from (0, 50) heading left (dx=-1, dy=0)
            const hit = rayWallIntersection(0, 50, -1, 0, walls);
            expect(hit).toBeNull();
        });

        it('does not intersect open doors', () => {
            // Ray from (25, 0) heading down (dx=0, dy=1) towards closed door
            const hitClosed = rayWallIntersection(25, 0, 0, 1, walls);
            expect(hitClosed).not.toBeNull();
            expect(hitClosed?.y).toBe(100);

            // Open the door
            const openWalls = toggleDoor(walls, walls[1].id);

            const hitOpen = rayWallIntersection(25, 0, 0, 1, openWalls);
            expect(hitOpen).toBeNull();
        });
    });

    describe('computeLightLevel', () => {
        const lights: LightSource[] = [
            {
                id: 'l1',
                x: 100, y: 100,
                brightRadius: 2,
                dimRadius: 4,
                color: '#fff',
                intensity: 1.0,
                type: 'torch'
            }
        ];

        it('returns full intensity inside bright radius', () => {
            // Cell 2,2 is exactly where the light is (100/50 = 2)
            const level = computeLightLevel(2, 2, lights, 50);
            expect(level).toBe(1.0);

            // Still within bright radius (dist = 1)
            const level2 = computeLightLevel(3, 2, lights, 50);
            expect(level2).toBe(1.0);
        });

        it('interpolates intensity in dim radius', () => {
            // Dist = 3. Bright = 2, Dim = 4. Factor = 1 - (3-2)/(4-2) = 0.5. Base = 1 * 0.5 * 0.5 = 0.25.
            const level = computeLightLevel(5, 2, lights, 50);
            expect(level).toBeCloseTo(0.25, 2);
        });

        it('returns 0 outside dim radius', () => {
            // Dist = 5
            const level = computeLightLevel(7, 2, lights, 50);
            expect(level).toBe(0);
        });
    });
});
