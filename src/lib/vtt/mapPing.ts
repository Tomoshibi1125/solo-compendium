/**
 * VTT Map Ping System
 *
 * Allows players/Protocol Wardens to ping a location on the map with an animated indicator
 * that fades out after a short duration. Broadcasts via realtime channel.
 */

// ─── Types ──────────────────────────────────────────────────
export interface MapPing {
	id: string;
	x: number; // grid x
	y: number; // grid y
	color: string;
	createdBy: string;
	createdByName: string;
	createdAt: number; // Date.now()
	durationMs: number; // how long the ping lasts
	type: "alert" | "look" | "move" | "danger";
}

export interface PingConfig {
	defaultDurationMs: number;
	maxPings: number; // max simultaneous pings
	cooldownMs: number; // minimum time between pings from same user
}

// ─── Defaults ───────────────────────────────────────────────
export const DEFAULT_PING_CONFIG: PingConfig = {
	defaultDurationMs: 3000,
	maxPings: 10,
	cooldownMs: 500,
};

const PING_COLORS: Record<MapPing["type"], string> = {
	alert: "#ef4444", // red
	look: "#3b82f6", // blue
	move: "#22c55e", // green
	danger: "#f59e0b", // amber
};

// ─── Ping Management ────────────────────────────────────────

/**
 * Create a new map ping
 */
export function createPing(
	x: number,
	y: number,
	createdBy: string,
	createdByName: string,
	type: MapPing["type"] = "look",
	durationMs: number = DEFAULT_PING_CONFIG.defaultDurationMs,
): MapPing {
	return {
		id: `ping-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		x,
		y,
		color: PING_COLORS[type],
		createdBy,
		createdByName,
		createdAt: Date.now(),
		durationMs,
		type,
	};
}

/**
 * Remove expired pings from the active list
 */
export function pruneExpiredPings(
	pings: MapPing[],
	now: number = Date.now(),
): MapPing[] {
	return pings.filter((p) => now - p.createdAt < p.durationMs);
}

/**
 * Check if a user is within cooldown period
 */
export function isOnCooldown(
	pings: MapPing[],
	userId: string,
	cooldownMs: number = DEFAULT_PING_CONFIG.cooldownMs,
): boolean {
	const now = Date.now();
	return pings.some(
		(p) => p.createdBy === userId && now - p.createdAt < cooldownMs,
	);
}

/**
 * Get CSS animation keyframes for a ping (ripple effect)
 */
export function getPingAnimationCSS(): string {
	return `
    @keyframes vtt-ping-ripple {
      0% {
        transform: scale(0.3);
        opacity: 1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.6;
      }
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }

    .vtt-ping {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    }

    .vtt-ping-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid currentColor;
      animation: vtt-ping-ripple 1s ease-out infinite;
    }

    .vtt-ping-ring:nth-child(2) {
      animation-delay: 0.3s;
    }

    .vtt-ping-ring:nth-child(3) {
      animation-delay: 0.6s;
    }

    .vtt-ping-dot {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      transform: translate(-50%, -50%);
    }

    .vtt-ping-label {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
      text-shadow: 0 1px 2px rgba(0,0,0,0.8);
      color: white;
    }
  `;
}
