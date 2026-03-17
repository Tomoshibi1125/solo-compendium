import { useEffect, useMemo, useRef } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";
import { GateEnergyFlow } from "./GateEnergyFlow";

interface HexNode {
	id: number;
	x: number;
	y: number;
	size: number;
	rotation: number;
	opacity: number;
	animationDelay: number;
	color: string;
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
	const ashRef = useRef<HTMLDivElement>(null);
	const hexRef = useRef<HTMLDivElement>(null);
	const { reducedMotion, tier } = usePerformanceProfile();

	const reduceEffects = reducedMotion || tier === "low";
	const finalIntensity = reduceEffects ? "low" : intensity;
	const enableAnimation = animated && !reducedMotion;

	// Generate hex nodes based on variant and intensity
	const hexNodes = useMemo(() => {
		const nodes: HexNode[] = [];
		const nodeCount =
			finalIntensity === "high" ? 12 : finalIntensity === "medium" ? 8 : 4;

		for (let i = 0; i < nodeCount; i++) {
			let color = "";
			switch (variant) {
				case "gate":
					color = `hsl(${200 + i * 10}, 80%, ${50 + i * 5}%)`; // Blue-cyan spectrum
					break;
				case "sovereign":
					color = `hsl(${270 + i * 5}, 85%, ${55 + i * 5}%)`; // Amethyst spectrum
					break;
				case "shadow":
					color = `hsl(${260}, 40%, ${20 + i * 10}%)`; // Deep obsidian-purple
					break;
				default:
					color = `hsl(${275}, 80%, 65%)`; // Default Amethyst
			}

			// Add a few Stellar Cyan nodes for contrast
			if (i % 3 === 0 && variant !== "shadow") {
				color = `hsl(195, 90%, 65%)`; // Stellar Cyan Accent
			}

			nodes.push({
				id: i,
				x: Math.random() * 110 - 5, // Allow slight overflow
				y: Math.random() * 110 - 5,
				size: Math.random() * 150 + 50,
				rotation: Math.random() * 360,
				opacity: Math.random() * 0.15 + 0.05,
				animationDelay: Math.random() * 10,
				color,
			});
		}
		return nodes;
	}, [variant, finalIntensity]);

	// Generate ash particles (rising upwards instead of drifting randomly)
	const ashParticles = useMemo(() => {
		const particles: AshParticle[] = [];
		const particleCount =
			finalIntensity === "high" ? 40 : finalIntensity === "medium" ? 25 : 10;

		for (let i = 0; i < particleCount; i++) {
			particles.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 120 - 10, // Start slightly below screen
				size: Math.random() * 4 + 1, // Sharp, small particles
				opacity: Math.random() * 0.4 + 0.1,
				speed: Math.random() * 15 + 10, // Ascend speed
				drift: Math.random() * 20 - 10, // Sideways drift amount
			});
		}
		return particles;
	}, [finalIntensity]);

	// Canvas animation for data streams / sharp circuit lines
	useEffect(() => {
		if (!canvasRef.current || !enableAnimation || finalIntensity === "low")
			return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		let animationId: number;
		let _time = 0;

		// Data stream configuration
		const streams = Array.from({ length: 8 }, (_, _i) => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			length: Math.random() * 200 + 100,
			speed: Math.random() * 2 + 1,
			horizontal: Math.random() > 0.5,
			color: variant === "sovereign" ? "#9d4edd" : "#67e8f9", // Amethyst or Cyan
		}));

		const animate = () => {
			_time += 0.01;
			// Dark trailing effect for light trails
			ctx.fillStyle = "rgba(10, 10, 15, 0.1)"; // Dark obsidian fade
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw background grid lightly
			ctx.strokeStyle = "rgba(103, 232, 249, 0.03)";
			ctx.lineWidth = 1;

			// Draw angular data streams
			ctx.globalCompositeOperation = "screen";
			streams.forEach((stream) => {
				ctx.beginPath();
				ctx.moveTo(stream.x, stream.y);

				if (stream.horizontal) {
					ctx.lineTo(stream.x + stream.length, stream.y);
					stream.x += stream.speed;
					if (stream.x > canvas.width) {
						stream.x = -stream.length;
						stream.y = Math.random() * canvas.height;
					}
				} else {
					ctx.lineTo(stream.x, stream.y + stream.length);
					stream.y -= stream.speed; // Move up
					if (stream.y + stream.length < 0) {
						stream.y = canvas.height;
						stream.x = Math.random() * canvas.width;
					}
				}

				const grad = stream.horizontal
					? ctx.createLinearGradient(
							stream.x,
							stream.y,
							stream.x + stream.length,
							stream.y,
						)
					: ctx.createLinearGradient(
							stream.x,
							stream.y,
							stream.x,
							stream.y + stream.length,
						);

				grad.addColorStop(0, "rgba(0,0,0,0)");
				grad.addColorStop(0.5, stream.color);
				grad.addColorStop(1, "rgba(0,0,0,0)");

				ctx.strokeStyle = grad;
				ctx.lineWidth = 2;
				ctx.stroke();

				// Occasional 90-degree branch
				if (Math.random() < 0.01) {
					stream.horizontal = !stream.horizontal;
				}
			});
			ctx.globalCompositeOperation = "source-over";

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [enableAnimation, finalIntensity, variant]);

	return (
		<div
			className={cn(
				"fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background",
				className,
			)}
		>
			{/* Base canvas for data streams */}
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full"
				style={{ opacity: finalIntensity === "low" ? 0.3 : 0.8 }}
			/>

			{/* Floating System Hexagons */}
			<div ref={hexRef} className="absolute inset-0 overflow-hidden">
				{hexNodes.map((node) => (
					<div
						key={node.id}
						className={cn(
							"absolute flex items-center justify-center",
							enableAnimation && "animate-spin-slow",
						)}
						style={{
							left: `${node.x}%`,
							top: `${node.y}%`,
							width: `${node.size}px`,
							height: `${node.size}px`,
							opacity: node.opacity,
							animationDelay: enableAnimation
								? `${node.animationDelay}s`
								: undefined,
							animationDuration: enableAnimation
								? `${40 + node.id * 10}s`
								: undefined,
							animationDirection: node.id % 2 === 0 ? "normal" : "reverse",
						}}
					>
						{/* CSS Hexagon shape */}
						<svg
							viewBox="0 0 100 100"
							className="w-full h-full overflow-visible"
						>
							<title>Hexagon Theme Background Overlay</title>
							<polygon
								points="50 3, 93 28, 93 72, 50 97, 7 72, 7 28"
								fill="none"
								stroke={node.color}
								strokeWidth="1"
								className={cn(enableAnimation && "animate-pulse")}
								style={{
									filter: `drop-shadow(0 0 10px ${node.color})`,
									animationDuration: `${3 + (node.id % 3)}s`,
								}}
							/>
							{/* Inner geometric accent */}
							{node.id % 2 === 0 && (
								<circle
									cx="50"
									cy="50"
									r="3"
									fill={node.color}
									className={cn(enableAnimation && "animate-ping")}
									style={{ animationDuration: "4s" }}
								/>
							)}
						</svg>
					</div>
				))}
			</div>

			{/* Sharp Umbral Ash / Cyan Particles (Rising) */}
			<div ref={ashRef} className="absolute inset-0 overflow-hidden">
				{ashParticles.map((particle) => (
					<div
						key={particle.id}
						className="absolute bg-accent rounded-sm shadow-[0_0_8px_hsl(var(--accent))]" // Sharp square particles
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`,
							width: `${particle.size}px`,
							height: `${particle.size}px`,
							opacity: particle.opacity,
							transform: enableAnimation
								? `translate(${particle.drift}vw, -120vh) rotate(${particle.drift * 20}deg)`
								: undefined,
							transition: enableAnimation
								? `transform ${particle.speed}s linear infinite`
								: undefined,
							animationDelay: enableAnimation
								? `-${particle.id}s` // Negative delay to start mid-animation
								: undefined,
						}}
					/>
				))}
			</div>

			{/* Base Vignette fading to Obsidian */}
			<div
				className="absolute inset-0"
				style={{
					background:
						"radial-gradient(circle at center, transparent 30%, hsl(var(--background)) 100%)",
				}}
			/>

			{/* Gate energy flows for gate variant */}
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


