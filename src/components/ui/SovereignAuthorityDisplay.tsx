import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface SovereignAuthorityDisplayProps {
	authority: number; // 0-100
	tier: "ascendant" | "sovereign" | "regent" | "regent";
	domain?: string;
	decrees?: number;
	vassals?: number;
	className?: string;
}

export const SovereignAuthorityDisplay = ({
	authority,
	tier,
	domain = "UNKNOWN",
	decrees = 0,
	vassals = 0,
	className,
}: SovereignAuthorityDisplayProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Get tier-specific configuration
	const tierConfig = useMemo(() => {
		const configs = {
			ascendant: {
				color: "#8b5cf6",
				glow: "#a855f7",
				name: "ASCENDANT",
				crown: "👑",
			},
			sovereign: {
				color: "#ffd700",
				glow: "#ffed4e",
				name: "SOVEREIGN",
				crown: "👑",
			},
			regent: {
				color: "#f59e0b",
				glow: "#fbbf24",
				name: "REGENT",
				crown: "👑",
			},
			monarch: {
				color: "#dc2626",
				glow: "#ef4444",
				name: "MONARCH",
				crown: "👑",
			},
		};
		return configs[tier];
	}, [tier]);

	useEffect(() => {
		if (!canvasRef.current) return;

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
			time += 0.01;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const radius = Math.min(canvas.width, canvas.height) * 0.35;

			// Authority circle background
			const gradient = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				radius,
			);
			gradient.addColorStop(0, `${tierConfig.color}30`);
			gradient.addColorStop(1, "transparent");

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fill();

			// Authority ring
			ctx.strokeStyle = tierConfig.color;
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
			ctx.stroke();

			// Authority arc
			ctx.strokeStyle = tierConfig.glow;
			ctx.lineWidth = 8;
			ctx.beginPath();
			ctx.arc(
				centerX,
				centerY,
				radius * 0.8,
				-Math.PI / 2,
				-Math.PI / 2 + (authority / 100) * Math.PI * 2,
			);
			ctx.stroke();

			// Crown symbol at center
			ctx.fillStyle = tierConfig.color;
			ctx.font = `${radius * 0.4}px serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(tierConfig.crown, centerX, centerY);

			// Authority level markers
			for (let i = 0; i < 4; i++) {
				const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
				const markerX = centerX + Math.cos(angle) * (radius * 0.9);
				const markerY = centerY + Math.sin(angle) * (radius * 0.9);

				ctx.fillStyle = tierConfig.glow;
				ctx.beginPath();
				ctx.arc(markerX, markerY, 3, 0, Math.PI * 2);
				ctx.fill();
			}

			// Pulsing authority glow
			const pulseRadius = radius * (1 + Math.sin(time * 2) * 0.05);
			ctx.strokeStyle = tierConfig.glow;
			ctx.globalAlpha = 0.3 + Math.sin(time * 3) * 0.2;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
			ctx.stroke();

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [authority, tierConfig]);

	return (
		<div
			className={cn(
				"relative bg-void-black/80 border border-regent-gold/30 rounded-lg p-4",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center space-x-2">
					<div
						className="w-2 h-2 rounded-full animate-pulse"
						style={{ backgroundColor: tierConfig.color }}
					/>
					<span className="font-display text-sm tracking-widest text-regent-gold">
						SOVEREIGN AUTHORITY
					</span>
				</div>
				<span className="font-system text-xs tracking-wider text-gray-400">
					{tierConfig.name}
				</span>
			</div>

			{/* Authority Visualization */}
			<div className="relative mb-4">
				<canvas
					ref={canvasRef}
					className="w-full h-32 rounded border border-regent-gold/20"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center">
						<div className="font-display text-xl font-black text-white">
							{authority}%
						</div>
						<div className="font-system text-xs tracking-wider text-regent-gold">
							AUTHORITY
						</div>
					</div>
				</div>
			</div>

			{/* Domain Information */}
			<div className="grid grid-cols-3 gap-3 text-center">
				<div>
					<div className="font-system text-xs tracking-wider text-gray-400 uppercase">
						Domain
					</div>
					<div className="font-display text-sm text-regent-gold">{domain}</div>
				</div>
				<div>
					<div className="font-system text-xs tracking-wider text-gray-400 uppercase">
						Decrees
					</div>
					<div className="font-mono text-sm text-white">{decrees}</div>
				</div>
				<div>
					<div className="font-system text-xs tracking-wider text-gray-400 uppercase">
						Vassals
					</div>
					<div className="font-mono text-sm text-white">{vassals}</div>
				</div>
			</div>

			{/* Authority Level Indicator */}
			<div className="mt-4">
				<div className="flex justify-between text-xs font-system tracking-wider text-gray-400 mb-1">
					<span>LEVEL</span>
					<span>{Math.floor(authority / 25) + 1}/4</span>
				</div>
				<div className="w-full bg-void-black/50 rounded-full h-2">
					<div
						className="h-full rounded-full transition-all duration-500"
						style={{
							width: `${authority}%`,
							background: `linear-gradient(90deg, ${tierConfig.color}, ${tierConfig.glow})`,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

// Ascension Meter Component
interface AscensionMeterProps {
	progress: number; // 0-100
	tier: "ascendant" | "sovereign" | "regent" | "regent";
	nextTier?: string;
	className?: string;
}

export const AscensionMeter = ({
	progress,
	tier,
	nextTier,
	className,
}: AscensionMeterProps) => {
	const tierConfig = useMemo(() => {
		const configs = {
			ascendant: {
				color: "#8b5cf6",
				glow: "#a855f7",
				bg: "from-purple-900/20 to-purple-800/20",
			},
			sovereign: {
				color: "#ffd700",
				glow: "#ffed4e",
				bg: "from-yellow-900/20 to-yellow-800/20",
			},
			regent: {
				color: "#f59e0b",
				glow: "#fbbf24",
				bg: "from-orange-900/20 to-orange-800/20",
			},
			monarch: {
				color: "#dc2626",
				glow: "#ef4444",
				bg: "from-red-900/20 to-red-800/20",
			},
		};
		return configs[tier];
	}, [tier]);

	return (
		<div
			className={cn(
				"relative bg-gradient-to-r rounded-lg p-4 border overflow-hidden",
				tierConfig.bg,
				className,
			)}
		>
			{/* Background glow effect */}
			<div
				className="absolute inset-0 opacity-30"
				style={{
					background: `linear-gradient(45deg, ${tierConfig.color}20, transparent, ${tierConfig.glow}20)`,
				}}
			/>

			<div className="relative z-10">
				{/* Header */}
				<div className="flex items-center justify-between mb-3">
					<span className="font-display text-sm tracking-widest text-white">
						ASCENSION PROGRESS
					</span>
					<span className="font-system text-xs tracking-wider text-gray-300 uppercase">
						{tier}
					</span>
				</div>

				{/* Progress Bar */}
				<div className="mb-2">
					<div className="flex justify-between text-xs font-system tracking-wider text-gray-400 mb-1">
						<span>0%</span>
						<span>{progress}%</span>
					</div>
					<div className="w-full bg-void-black/50 rounded-full h-3 overflow-hidden">
						<div
							className="h-full transition-all duration-1000 ease-out relative"
							style={{
								width: `${progress}%`,
								background: `linear-gradient(90deg, ${tierConfig.color}, ${tierConfig.glow})`,
							}}
						>
							{/* Animated shine effect */}
							<div
								className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
								style={{
									animation: "shimmer 2s linear infinite",
								}}
							/>
						</div>
					</div>
				</div>

				{/* Next Tier Preview */}
				{nextTier && (
					<div className="text-center">
						<div className="font-system text-xs tracking-wider text-gray-400 uppercase mb-1">
							Next: {nextTier}
						</div>
						<div className="font-display text-sm text-white">
							{100 - progress}% to Ascension
						</div>
					</div>
				)}

				{/* Ascension particles effect */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={`slot-${[...Array(i + 1)].length}`}
							className="absolute w-1 h-1 bg-current rounded-full animate-pulse opacity-60"
							style={{
								left: `${20 + i * 15}%`,
								top: `${30 + (i % 2) * 40}%`,
								color: tierConfig.glow,
								animationDelay: `$export {i * 0.2}s`,
								animationDuration: "1.5s",
							}}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
