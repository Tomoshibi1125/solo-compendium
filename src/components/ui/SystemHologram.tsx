import { useEffect, useMemo, useRef } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";

interface DataStream {
	id: number;
	text: string;
	x: number;
	y: number;
	speed: number;
	opacity: number;
	length: number;
}

interface HolographicPanelProps {
	children?: React.ReactNode;
	title?: string;
	variant?: "default" | "system" | "sovereign" | "gate";
	streams?: number;
	animated?: boolean;
	className?: string;
	showGrid?: boolean;
}

export const SystemHologram = ({
	children,
	title,
	variant = "default",
	streams = 8,
	animated = true,
	className,
	showGrid = true,
}: HolographicPanelProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamsRef = useRef<HTMLDivElement>(null);
	const { reducedMotion, fx, tier } = usePerformanceProfile();

	const reduceEffects = reducedMotion || tier === "low";
	const finalStreams = reduceEffects ? Math.floor(streams / 2) : streams;
	const enableAnimation = animated && !reducedMotion;

	// Generate data streams
	const dataStreams = useMemo(() => {
		const streams: DataStream[] = [];
		const systemTexts = [
			"ACCESSING_CORE_PROTOCOLS",
			"DIMENSIONAL_STABILITY_98%",
			"RIFT_ENERGY_LEVELS_OPTIMAL",
			"SOVEREIGN_AUTHORITY_VERIFIED",
			"SYSTEM_INTEGRITY_INTACT",
			"GATE_COORDINATES_LOCKED",
			"SHADOW_NETWORK_ACTIVE",
			"ASCENDANT_PROTOCOL_INITIATED",
			"VOID_BARRIER_STABLE",
			"REGENT_SEAL_ENGAGED",
			"DATA_STREAM_ENCRYPTED",
			"REALITY_ANCHOR_ACTIVE",
			"SYSTEM_STATUS_NOMINAL",
			"DIMENSIONAL_SYNC_COMPLETE",
			"RIFT_CONDUIT_OPERATIONAL",
		];

		for (let i = 0; i < finalStreams; i++) {
			const text = systemTexts[i % systemTexts.length];
			streams.push({
				id: i,
				text,
				x: Math.random() * 100,
				y: Math.random() * 100,
				speed: 0.5 + Math.random() * 1.5,
				opacity: 0.3 + Math.random() * 0.4,
				length: text.length,
			});
		}
		return streams;
	}, [finalStreams]);

	// Canvas animation for holographic grid
	useEffect(() => {
		if (!canvasRef.current || !showGrid || reduceEffects) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		let animationId: number;
		let time = 0;

		const animate = () => {
			time += 0.02;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Set holographic colors based on variant
			let primaryColor = "#00ff88";
			let secondaryColor = "#0088ff";

			switch (variant) {
				case "sovereign":
					primaryColor = "#ffd700";
					secondaryColor = "#8b008b";
					break;
				case "gate":
					primaryColor = "#ff4500";
					secondaryColor = "#4169e1";
					break;
				case "system":
					primaryColor = "#00ff88";
					secondaryColor = "#0088ff";
					break;
			}

			// Draw grid lines
			ctx.strokeStyle = primaryColor;
			ctx.globalAlpha = 0.2;
			ctx.lineWidth = 1;

			const gridSize = 20;
			for (let x = 0; x <= canvas.width; x += gridSize) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvas.height);
				ctx.stroke();
			}

			for (let y = 0; y <= canvas.height; y += gridSize) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
				ctx.stroke();
			}

			// Draw animated nodes
			ctx.globalAlpha = 0.6;
			for (let x = 0; x <= canvas.width; x += gridSize) {
				for (let y = 0; y <= canvas.height; y += gridSize) {
					const distance = Math.sqrt(
						(x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2,
					);
					const pulse = Math.sin(time * 2 + distance * 0.01) * 0.5 + 0.5;

					ctx.beginPath();
					ctx.arc(x, y, 2 * pulse, 0, Math.PI * 2);
					ctx.fillStyle = primaryColor;
					ctx.fill();

					// Inner glow
					ctx.beginPath();
					ctx.arc(x, y, 1 * pulse, 0, Math.PI * 2);
					ctx.fillStyle = secondaryColor;
					ctx.fill();
				}
			}

			// Draw scanning line
			if (enableAnimation) {
				const scanY = (time * 50) % canvas.height;
				ctx.globalAlpha = 0.8;
				ctx.strokeStyle = secondaryColor;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0, scanY);
				ctx.lineTo(canvas.width, scanY);
				ctx.stroke();

				// Scan line glow
				ctx.globalAlpha = 0.3;
				ctx.strokeStyle = primaryColor;
				ctx.lineWidth = 4;
				ctx.stroke();
			}

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [enableAnimation, showGrid, reduceEffects, variant]);

	// Get variant-specific styling
	const getVariantStyles = () => {
		const baseStyles =
			"relative bg-gradient-to-br backdrop-blur-xl border overflow-hidden";

		switch (variant) {
			case "sovereign":
				return cn(
					baseStyles,
					"from-monarch-gold/10 via-shadow-purple/15 to-void-black/90 border-monarch-gold/40 shadow-[0_0_30px_hsl(var(--monarch-gold)/0.3)]",
				);
			case "gate":
				return cn(
					baseStyles,
					"from-gate-s/10 via-gate-ss/15 to-void-black/90 border-gate-s/40 shadow-[0_0_25px_hsl(var(--gate-s-glow)/0.3)]",
				);
			case "system":
				return cn(
					baseStyles,
					"from-system-green/10 via-primary/15 to-void-black/90 border-system-green/40 shadow-[0_0_25px_hsl(var(--system-green)/0.3)]",
				);
			default:
				return cn(
					baseStyles,
					"from-primary/10 via-secondary/15 to-void-black/90 border-primary/40 shadow-[0_0_25px_hsl(var(--primary)/0.3)]",
				);
		}
	};

	return (
		<div className={cn("relative rounded-lg", getVariantStyles(), className)}>
			{/* Holographic Grid Canvas */}
			{showGrid && (
				<canvas
					ref={canvasRef}
					className="absolute inset-0 w-full h-full pointer-events-none"
				/>
			)}

			{/* Data Streams */}
			{enableAnimation && (
				<div
					ref={streamsRef}
					className="absolute inset-0 pointer-events-none overflow-hidden"
				>
					{dataStreams.map((stream) => (
						<div
							key={stream.id}
							className="absolute font-mono text-xs whitespace-nowrap animate-float"
							style={{
								left: `${stream.x}%`,
								top: `${stream.y}%`,
								opacity: stream.opacity,
								color:
									variant === "sovereign"
										? "#ffd700"
										: variant === "gate"
											? "#ff4500"
											: variant === "system"
												? "#00ff88"
												: "#00ffff",
								textShadow: `0 0 8px ${
									variant === "sovereign"
										? "#ffd700"
										: variant === "gate"
											? "#ff4500"
											: variant === "system"
												? "#00ff88"
												: "#00ffff"
								}`,
								animationDelay: `${stream.id * 0.5}s`,
								animationDuration: `${8 / stream.speed}s`,
								transform: `translateX(${Math.random() * 200 - 100}px)`,
							}}
						>
							{stream.text}
						</div>
					))}
				</div>
			)}

			{/* Holographic Flicker Effect */}
			{enableAnimation && (
				<div className="absolute inset-0 pointer-events-none">
					<div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse opacity-30"></div>
				</div>
			)}

			{/* Header */}
			{title && (
				<div className="relative z-10 px-6 py-4 border-b border-current/20">
					<h3
						className={cn(
							"font-display text-sm tracking-widest",
							variant === "sovereign" && "text-monarch-gold",
							variant === "gate" && "text-gate-s",
							variant === "system" && "text-system-green",
							variant === "default" && "text-primary",
						)}
					>
						{title}
					</h3>
				</div>
			)}

			{/* Content */}
			<div className="relative z-10">{children}</div>

			{/* Corner Holographic Indicators */}
			<div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"></div>
			<div
				className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"
				style={{ animationDelay: "0.5s" }}
			></div>
			<div
				className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"
				style={{ animationDelay: "1s" }}
			></div>
			<div
				className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"
				style={{ animationDelay: "1.5s" }}
			></div>
		</div>
	);
};

export default SystemHologram;
