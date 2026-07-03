import type { ISourceOptions } from "@tsparticles/engine";
import type { IParticlesProps } from "@tsparticles/react";
import { motion } from "framer-motion";
import {
	type ComponentType,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";
import { type AppZone, useUiStore } from "@/stores/uiStore";
import { DynamicStyle } from "./DynamicStyle";
import { GateEnergyFlow } from "./GateEnergyFlow";

interface RiftCrack {
	id: number;
	x: number;
	y: number;
	rotation: number;
	width: number;
	height: number;
	delay: number;
	duration: number;
}

interface AshParticle {
	id: number;
	x: number;
	y: number;
	size: number;
	opacity: number;
	speed: number;
	drift: number;
}

interface RiftSiteBackgroundProps {
	/** `rift` = active-response blue, `domain` = amethyst failure-state, `umbral` = deep violet. */
	variant?: "default" | "rift" | "domain" | "umbral";
	intensity?: "low" | "medium" | "high";
	animated?: boolean;
	className?: string;
}

/**
 * Global ambient background: the Rift Site containment scene as the base
 * layer, with animated rift-crack fractures, ascending mana ash, canvas
 * energy streams, and tsParticles embers layered above. All effect layers
 * respect `usePerformanceProfile` (tier + reduced motion).
 */
export const RiftSiteBackground = ({
	variant = "default",
	intensity = "medium",
	animated = true,
	className,
}: RiftSiteBackgroundProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { reducedMotion, fx, tier } = usePerformanceProfile();
	const [ParticlesComponent, setParticlesComponent] =
		useState<ComponentType<IParticlesProps> | null>(null);

	const reduceEffects = reducedMotion || tier === "low";
	const finalIntensity = reduceEffects ? "low" : intensity;
	const enableAnimation = animated && !reducedMotion;

	// Accent colors per variant
	const accentHex =
		variant === "rift"
			? "#3b8cff"
			: variant === "umbral"
				? "#6b46c1"
				: "#9d4edd"; // amethyst for domain/default

	// ── Rift crack fractures (framer-motion) ─────────────────────
	const riftCracks = useMemo<RiftCrack[]>(() => {
		if (finalIntensity === "low") return [];
		const count = finalIntensity === "high" ? 6 : 3;
		return Array.from({ length: count }, (_, i) => ({
			id: i,
			x: 10 + Math.random() * 80,
			y: 10 + Math.random() * 80,
			rotation: Math.random() * 50 - 25,
			width: Math.random() * 140 + 60,
			height: Math.random() * 2 + 1,
			delay: i * 1.4 + Math.random() * 3,
			duration: Math.random() * 4 + 5,
		}));
	}, [finalIntensity]);

	// ── Mana ash particles (framer-motion) ───────────────────────
	const ashParticles = useMemo<AshParticle[]>(() => {
		const count =
			finalIntensity === "high" ? 40 : finalIntensity === "medium" ? 22 : 8;
		return Array.from({ length: count }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3.5 + 1,
			opacity: Math.random() * 0.5 + 0.15,
			speed: Math.random() * 18 + 12,
			drift: Math.random() * 16 - 8,
		}));
	}, [finalIntensity]);

	// ── Canvas: rising mana filaments + rift flares ──────────────
	// Curved, swaying wisps of rift energy drifting upward (no straight
	// scan-line streaks — those read as CRT/terminal, not Rift Ascendant).
	useEffect(() => {
		if (!canvasRef.current || !enableAnimation || finalIntensity === "low")
			return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		type Wisp = {
			baseX: number;
			y: number;
			phase: number;
			sway: number;
			swaySpeed: number;
			speed: number;
			color: string;
			trail: { x: number; y: number }[];
			trailMax: number;
		};

		const spawnWisp = (startAnywhere: boolean): Wisp => ({
			baseX: Math.random() * canvas.width,
			y: startAnywhere
				? Math.random() * canvas.height
				: canvas.height + Math.random() * 60,
			phase: Math.random() * Math.PI * 2,
			sway: Math.random() * 42 + 14,
			swaySpeed: Math.random() * 0.03 + 0.012,
			speed: Math.random() * 0.9 + 0.45,
			color: Math.random() > 0.5 ? accentHex : "#00d4ff",
			trail: [],
			trailMax: Math.floor(Math.random() * 40) + 45,
		});

		const wispCount = finalIntensity === "high" ? 10 : 6;
		const wisps = Array.from({ length: wispCount }, () => spawnWisp(true));

		// Brief radial glow pulses — a rift venting energy.
		type Flare = { x: number; y: number; r: number; life: number };
		const flares: Flare[] = [];

		let animId: number;
		const draw = () => {
			// Dark trailing fade keeps soft ghost trails between frames
			ctx.fillStyle = "rgba(7, 3, 18, 0.08)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = "screen";

			for (let i = 0; i < wisps.length; i++) {
				const w = wisps[i];
				w.phase += w.swaySpeed;
				w.y -= w.speed;
				const x = w.baseX + Math.sin(w.phase) * w.sway;
				w.trail.push({ x, y: w.y });
				if (w.trail.length > w.trailMax) w.trail.shift();

				if (w.trail.length > 2) {
					const head = w.trail[w.trail.length - 1];
					const tail = w.trail[0];
					const g = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
					g.addColorStop(0, "rgba(0,0,0,0)");
					g.addColorStop(1, w.color);
					ctx.strokeStyle = g;
					ctx.lineWidth = 1.4;
					ctx.beginPath();
					ctx.moveTo(tail.x, tail.y);
					// Smooth the path through midpoints so the filament curves
					for (let p = 1; p < w.trail.length - 1; p++) {
						const mx = (w.trail[p].x + w.trail[p + 1].x) / 2;
						const my = (w.trail[p].y + w.trail[p + 1].y) / 2;
						ctx.quadraticCurveTo(w.trail[p].x, w.trail[p].y, mx, my);
					}
					ctx.stroke();
				}

				if (w.y < -20) wisps[i] = spawnWisp(false);
			}

			// Spawn at most two concurrent flares, rarely
			if (flares.length < 2 && Math.random() < 0.004) {
				flares.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height * 0.7,
					r: 6,
					life: 1,
				});
			}
			for (let f = flares.length - 1; f >= 0; f--) {
				const flare = flares[f];
				flare.r += 1.6;
				flare.life -= 0.02;
				if (flare.life <= 0) {
					flares.splice(f, 1);
					continue;
				}
				const glow = ctx.createRadialGradient(
					flare.x,
					flare.y,
					0,
					flare.x,
					flare.y,
					flare.r,
				);
				const alpha = Math.round(flare.life * 60)
					.toString(16)
					.padStart(2, "0");
				glow.addColorStop(0, `${accentHex}${alpha}`);
				glow.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = glow;
				ctx.beginPath();
				ctx.arc(flare.x, flare.y, flare.r, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.globalCompositeOperation = "source-over";
			animId = requestAnimationFrame(draw);
		};
		draw();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animId);
		};
	}, [enableAnimation, finalIntensity, accentHex]);

	// ── tsParticles: mana embers + dimensional links ──────────────
	useEffect(() => {
		if (!fx.enableTsparticles) {
			setParticlesComponent(null);
			return;
		}
		let active = true;
		(async () => {
			try {
				const [{ Particles, ParticlesProvider }, { loadSlim }] =
					await Promise.all([
						import("@tsparticles/react"),
						import("@tsparticles/slim"),
					]);
				// tsparticles v4: engine init moved from initParticlesEngine() to a
				// ParticlesProvider wrapper that runs the registrar on mount.
				const ProvidedParticles: ComponentType<IParticlesProps> = (props) => (
					<ParticlesProvider
						init={async (engine) => {
							await loadSlim(engine);
						}}
					>
						<Particles {...props} />
					</ParticlesProvider>
				);
				if (active) setParticlesComponent(() => ProvidedParticles);
			} catch {
				if (active) setParticlesComponent(null);
			}
		})();
		return () => {
			active = false;
		};
	}, [fx.enableTsparticles]);

	const particlesOptions = useMemo<ISourceOptions>(
		() => ({
			fullScreen: { enable: false },
			fpsLimit: 60,
			detectRetina: true,
			background: { color: { value: "transparent" } },
			particles: {
				number: {
					value:
						finalIntensity === "high"
							? 80
							: finalIntensity === "medium"
								? 45
								: 20,
					density: { enable: true, area: 900 },
				},
				// Mana embers: amethyst + stellar cyan + soft violet
				color: { value: [accentHex, "#00d4ff", "#c084fc", "#67e8f9"] },
				opacity: {
					value: { min: 0.08, max: 0.55 },
					animation: { enable: true, speed: 0.5, sync: false },
				},
				size: { value: { min: 1, max: 3.5 } },
				move: {
					enable: true,
					direction: "top" as const, // ascend like mana rising from the rift
					speed: { min: 0.3, max: 1.1 },
					random: true,
					outModes: { default: "out" as const },
				},
				links: {
					enable: finalIntensity !== "low",
					distance: 140,
					opacity: 0.1,
					width: 1,
					color: accentHex,
					triangles: {
						enable: finalIntensity === "high",
						opacity: 0.03,
					},
				},
				twinkle: {
					particles: {
						enable: true,
						frequency: 0.04,
						opacity: 1,
						color: { value: "#ffffff" },
					},
				},
			},
			interactivity: {
				events: {
					onHover: { enable: true, mode: "repulse" as const },
					resize: { delay: 0 },
				},
				modes: { repulse: { distance: 100, duration: 0.4 } },
			},
		}),
		[finalIntensity, accentHex],
	);

	return (
		<div
			className={cn(
				"fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background",
				className,
			)}
		>
			{/* ── Layer 1: Rift Site scene — atmospheric base ───────── */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 rift-site-base"
				style={{
					opacity:
						finalIntensity === "high"
							? 0.95
							: finalIntensity === "medium"
								? 0.8
								: 0.5,
				}}
			/>
			{/* Dark overlay to ensure text legibility */}
			<div className="absolute inset-0 bg-black/20" />

			{/* ── Layer 2: Canvas rift energy streams ──────────────── */}
			<DynamicStyle
				as="canvas"
				ref={canvasRef}
				className="absolute inset-0 w-full h-full"
				vars={{ opacity: finalIntensity === "low" ? 0.25 : 0.7 }}
			/>

			{/* ── Layer 3: tsParticles mana embers + rift links ─────── */}
			{ParticlesComponent && (
				<div className="absolute inset-0 w-full h-full">
					<ParticlesComponent
						id="ra-riftsite-particles"
						options={particlesOptions}
						className="w-full h-full"
					/>
				</div>
			)}

			{/* ── Layer 4: Framer-motion rift crack fractures ───────── */}
			{enableAnimation &&
				riftCracks.map((crack) => (
					<motion.div
						key={crack.id}
						className="absolute pointer-events-none"
						style={{
							left: `${crack.x}%`,
							top: `${crack.y}%`,
							rotate: crack.rotation,
							width: crack.width,
							height: crack.height,
							background: `linear-gradient(90deg, transparent 0%, ${accentHex} 40%, #00d4ff 60%, transparent 100%)`,
							boxShadow: `0 0 8px 2px ${accentHex}80, 0 0 24px 6px ${accentHex}25`,
							transformOrigin: "center",
						}}
						initial={{ scaleX: 0, opacity: 0 }}
						animate={{
							scaleX: [0, 1, 1, 0],
							opacity: [0, 0.8, 0.5, 0],
						}}
						transition={{
							duration: crack.duration,
							delay: crack.delay,
							repeat: Number.POSITIVE_INFINITY,
							repeatDelay: Math.random() * 8 + 5,
							ease: "easeInOut",
						}}
					/>
				))}

			{/* ── Layer 5: Ascending mana ash (framer-motion) ───────── */}
			{!reduceEffects && (
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{ashParticles.map((p) => (
						<motion.div
							key={p.id}
							className="absolute rounded-sm"
							style={{
								left: `${p.x}%`,
								bottom: "-12px",
								width: `${p.size}px`,
								height: `${p.size}px`,
								background: p.id % 2 === 0 ? accentHex : "#00d4ff",
								boxShadow: `0 0 6px ${p.id % 2 === 0 ? accentHex : "#00d4ff"}`,
								opacity: p.opacity,
							}}
							animate={
								enableAnimation
									? {
											y: [0, -(window.innerHeight + 30)],
											x: [0, p.drift * 12],
											opacity: [p.opacity, 0],
											rotate: [0, p.drift * 20],
										}
									: {}
							}
							transition={{
								duration: p.speed,
								delay: p.id * 0.35,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							}}
						/>
					))}
				</div>
			)}

			{/* ── Layer 6: Obsidian radial vignette (breathes slowly) ── */}
			<div
				className={cn(
					"absolute inset-0",
					enableAnimation && "ra-vignette-breathe",
				)}
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.5) 80%, hsl(var(--background)) 100%)",
				}}
			/>

			{/* ── Layer 7: Rift energy flow (rift variant only) ─────── */}
			{variant === "rift" && (
				<GateEnergyFlow
					tier="e"
					intensity={finalIntensity}
					animated={enableAnimation}
				/>
			)}
		</div>
	);
};

const ZONE_BACKGROUND: Record<
	AppZone,
	{
		variant: RiftSiteBackgroundProps["variant"];
		intensity: RiftSiteBackgroundProps["intensity"];
	}
> = {
	default: { variant: "default", intensity: "medium" },
	compendium: { variant: "default", intensity: "low" },
	warden: { variant: "rift", intensity: "medium" },
	campaign: { variant: "umbral", intensity: "medium" },
	character: { variant: "domain", intensity: "medium" },
};

/**
 * Route-zone-aware ambient background. Reads the active zone from the UI store
 * (set by RouteEffects on navigation) and maps it to a RiftSiteBackground
 * variant/intensity so the vignette shifts per app area.
 */
export const ZonedRiftSiteBackground = () => {
	const zone = useUiStore((state) => state.zone);
	const { variant, intensity } =
		ZONE_BACKGROUND[zone] ?? ZONE_BACKGROUND.default;
	return <RiftSiteBackground variant={variant} intensity={intensity} />;
};
