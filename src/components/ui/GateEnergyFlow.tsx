import { useMemo, useRef } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";
import { cn } from "@/lib/utils";

interface EnergyStream {
	id: number;
	x: number;
	y: number;
	length: number;
	angle: number;
	speed: number;
	tier: "e" | "d" | "c" | "b" | "a" | "s" | "ss" | "national";
	delay: number;
}

interface GateEnergyFlowProps {
	tier?: "e" | "d" | "c" | "b" | "a" | "s" | "ss" | "national";
	intensity?: "low" | "medium" | "high";
	animated?: boolean;
	className?: string;
}

export const GateEnergyFlow = ({
	tier = "e",
	intensity = "medium",
	animated = true,
	className,
}: GateEnergyFlowProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { reducedMotion, tier: performanceTier } = usePerformanceProfile();

	const reduceEffects = reducedMotion || performanceTier === "low";
	const finalIntensity = reduceEffects ? "low" : intensity;
	const enableAnimation = animated && !reducedMotion;

	// Generate energy streams based on tier and intensity
	const energyStreams = useMemo(() => {
		const streams: EnergyStream[] = [];
		const streamCount =
			finalIntensity === "high" ? 12 : finalIntensity === "medium" ? 8 : 4;

		for (let i = 0; i < streamCount; i++) {
			const availableTiers: EnergyStream["tier"][] = [
				"e",
				"d",
				"c",
				"b",
				"a",
				"s",
				"ss",
				"national",
			];
			const tierIndex = Math.min(i, availableTiers.length - 1);

			streams.push({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				length: Math.random() * 200 + 100,
				angle: Math.random() * 360,
				speed: Math.random() * 2 + 1,
				tier: availableTiers[tierIndex],
				delay: Math.random() * 3,
			});
		}
		return streams;
	}, [finalIntensity]);

	// Get glow color for tier
	const getTierGlowColor = (streamTier: EnergyStream["tier"]) => {
		const colorMap = {
			e: "gate-e-glow",
			d: "gate-d-glow",
			c: "gate-c-glow",
			b: "gate-b-glow",
			a: "gate-a-glow",
			s: "gate-s-glow",
			ss: "gate-ss-glow",
			national: "gate-national-glow",
		};
		return colorMap[streamTier];
	};

	// Get base color for tier
	const getTierColor = (streamTier: EnergyStream["tier"]) => {
		const colorMap = {
			e: "gate-e",
			d: "gate-d",
			c: "gate-c",
			b: "gate-b",
			a: "gate-a",
			s: "gate-s",
			ss: "gate-ss",
			national: "gate-national",
		};
		return colorMap[streamTier];
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"absolute inset-0 pointer-events-none overflow-hidden",
				className,
			)}
		>
			{energyStreams.map((stream) => (
				<div
					key={stream.id}
					className={cn(
						"absolute origin-left",
						enableAnimation && "animate-gate-energy-flow",
					)}
					style={{
						left: `${stream.x}%`,
						top: `${stream.y}%`,
						width: `${stream.length}px`,
						height: "3px",
						transform: `rotate(${stream.angle}deg)`,
						background: `linear-gradient(90deg, transparent 0%, hsl(var(--${getTierColor(stream.tier)})) 20%, hsl(var(--${getTierGlowColor(stream.tier)})) 50%, hsl(var(--${getTierColor(stream.tier)})) 80%, transparent 100%)`,
						boxShadow: `0 0 10px hsl(var(--${getTierGlowColor(stream.tier)}) / 0.6), 0 0 20px hsl(var(--${getTierGlowColor(stream.tier)}) / 0.4)`,
						opacity: 0.7,
						animationDelay: enableAnimation ? `${stream.delay}s` : undefined,
						animationDuration: enableAnimation
							? `${4 / stream.speed}s`
							: undefined,
					}}
				/>
			))}

			{/* Central rift portal effect */}
			<div
				className={cn(
					"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
					enableAnimation && "animate-rift-portal",
				)}
				style={{
					width: "200px",
					height: "200px",
					background: `radial-gradient(circle, hsl(var(--${getTierGlowColor(tier)}) / 0.3) 0%, transparent 70%)`,
					borderRadius: "50%",
					animationDelay: "1s",
				}}
			/>

			{/* Pulsing dimensional core */}
			<div
				className={cn(
					"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
					enableAnimation && "animate-dimensional-pulse",
				)}
				style={{
					width: "20px",
					height: "20px",
					background: `hsl(var(--${getTierGlowColor(tier)}))`,
					boxShadow: `0 0 30px hsl(var(--$export {getTierGlowColor(tier)}) / 0.8)`,
				}}
			/>
		</div>
	);
};
