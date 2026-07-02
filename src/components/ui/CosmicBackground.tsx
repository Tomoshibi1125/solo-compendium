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

interface CosmicBackgroundProps {
	variant?: "default" | "gate" | "sovereign" | "shadow";
	intensity?: "low" | "medium" | "high";
	animated?: boolean;
	className?: string;
}

export const CosmicBackground = ({
	variant = "default",
	intensity = "medium",
	animated = true,
	className,
}: CosmicBackgroundProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { reducedMotion, fx, tier } = usePerformanceProfile();
	const [ParticlesComponent, setParticlesComponent] =
		useState<ComponentType<IParticlesProps> | null>(null);

	const reduceEffects = reducedMotion || tier === "low";
	const finalIntensity = reduceEffects ? "low" : intensity;
	const enableAnimation = animated && !reducedMotion;

	// Accent colors per variant
	const accentHex =
		variant === "gate"
			? "#3b8cff"
			: variant === "shadow"
				? "#6b46c1"
				: "#9d4edd"; // amethyst for sovereign/default

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

	// ── Canvas: animated gate energy streams ─────────────────────
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

		const streamCount = finalIntensity === "high" ? 10 : 6;
		const streams = Array.from({ length: streamCount }, () => ({
			x: Math.random() * window.innerWidth,
			y: Math.random() * window.innerHeight,
			length: Math.random() * 220 + 80,
			speed: Math.random() * 1.4 + 0.5,
			horizontal: Math.random() > 0.5,
			color: Math.random() > 0.5 ? accentHex : "#00d4ff",
		}));

		let animId: number;
		const draw = () => {
			// Dark trailing fade for ghost trails
			ctx.fillStyle = "rgba(7, 3, 18, 0.07)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = "screen";

			for (const s of streams) {
				ctx.beginPath();
				ctx.moveTo(s.x, s.y);
				if (s.horizontal) {
					ctx.lineTo(s.x + s.length, s.y);
					s.x += s.speed;
					if (s.x > canvas.width) {
						s.x = -s.length;
						s.y = Math.random() * canvas.height;
					}
				} else {
					ctx.lineTo(s.x, s.y + s.length);
					s.y -= s.speed;
					if (s.y + s.length < 0) {
						s.y = canvas.height;
						s.x = Math.random() * canvas.width;
					}
				}

				const g = s.horizontal
					? ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y)
					: ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.length);
				g.addColorStop(0, "rgba(0,0,0,0)");
				g.addColorStop(0.5, s.color);
				g.addColorStop(1, "rgba(0,0,0,0)");
				ctx.strokeStyle = g;
				ctx.lineWidth = 1.5;
				ctx.stroke();

				// Occasional 90-degree branch — feels like gate circuit energy
				if (Math.random() < 0.008) s.horizontal = !s.horizontal;
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
					direction: "top" as const, // ascend like mana rising from gates
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
			{/* ── Layer 1: RA Hero — atmospheric base ──────────────── */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
				style={{
					backgroundImage: "url('/ui-art/rift-gate-hero.png')",
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

			{/* ── Layer 2: Canvas gate energy streams ──────────────── */}
			<DynamicStyle
				as="canvas"
				ref={canvasRef}
				className="absolute inset-0 w-full h-full"
				vars={{ opacity: finalIntensity === "low" ? 0.25 : 0.7 }}
			/>

			{/* ── Layer 3: tsParticles mana embers + gate links ─────── */}
			{ParticlesComponent && (
				<div className="absolute inset-0 w-full h-full">
					<ParticlesComponent
						id="ra-cosmic-particles"
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

			{/* ── Layer 6: Obsidian radial vignette ────────────────── */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.5) 80%, hsl(var(--background)) 100%)",
				}}
			/>

			{/* ── Layer 7: Gate energy flow (gate variant only) ─────── */}
			{variant === "gate" && (
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
		variant: CosmicBackgroundProps["variant"];
		intensity: CosmicBackgroundProps["intensity"];
	}
> = {
	default: { variant: "default", intensity: "medium" },
	compendium: { variant: "default", intensity: "low" },
	warden: { variant: "gate", intensity: "medium" },
	campaign: { variant: "shadow", intensity: "medium" },
	character: { variant: "sovereign", intensity: "medium" },
};

/**
 * Route-zone-aware ambient background. Reads the active zone from the UI store
 * (set by RouteEffects on navigation) and maps it to a CosmicBackground
 * variant/intensity so the vignette shifts per app area.
 */
export const ZonedCosmicBackground = () => {
	const zone = useUiStore((state) => state.zone);
	const { variant, intensity } =
		ZONE_BACKGROUND[zone] ?? ZONE_BACKGROUND.default;
	return <CosmicBackground variant={variant} intensity={intensity} />;
};
