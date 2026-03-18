import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface RiftStatusIndicatorProps {
	stability: number; // 0-100
	tier: "e" | "d" | "c" | "b" | "a" | "s" | "ss" | "national";
	coordinates?: {
		x: number;
		y: number;
		z: number;
		dimension: string;
	};
	animated?: boolean;
	showCoordinates?: boolean;
	className?: string;
}

export const RiftStatusIndicator = ({
	stability,
	tier,
	coordinates = { x: 0, y: 0, z: 0, dimension: "PRIME" },
	animated = true,
	showCoordinates = true,
	className,
}: RiftStatusIndicatorProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Get tier-specific colors and properties
	const tierConfig = useMemo(() => {
		const configs = {
			e: { color: "#3b82f6", glow: "#60a5fa", name: "E-RANK" },
			d: { color: "#8b5cf6", glow: "#a855f7", name: "D-RANK" },
			c: { color: "#06b6d4", glow: "#22d3ee", name: "C-RANK" },
			b: { color: "#10b981", glow: "#34d399", name: "B-RANK" },
			a: { color: "#f59e0b", glow: "#fbbf24", name: "A-RANK" },
			s: { color: "#ef4444", glow: "#f87171", name: "S-RANK" },
			ss: { color: "#dc2626", glow: "#ef4444", name: "SS-RANK" },
			national: { color: "#7c2d12", glow: "#ea580c", name: "NATIONAL" },
		};
		return configs[tier];
	}, [tier]);

	// Calculate status based on stability
	const getStatusInfo = (stability: number) => {
		if (stability >= 90) return { status: "STABLE", color: "#10b981" };
		if (stability >= 70) return { status: "MODERATE", color: "#f59e0b" };
		if (stability >= 40) return { status: "UNSTABLE", color: "#ef4444" };
		return { status: "CRITICAL", color: "#dc2626" };
	};

	const statusInfo = getStatusInfo(stability);

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
			time += 0.02;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const radius = Math.min(canvas.width, canvas.height) * 0.35;

			// Background rift visualization
			const gradient = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				radius,
			);
			gradient.addColorStop(0, `${tierConfig.color}20`);
			gradient.addColorStop(1, "transparent");

			ctx.fillStyle = gradient;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
			ctx.fill();

			// Stability ring
			ctx.strokeStyle = tierConfig.color;
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius * 0.8, 0, Math.PI * 2);
			ctx.stroke();

			// Stability arc
			ctx.strokeStyle = statusInfo.color;
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.arc(
				centerX,
				centerY,
				radius * 0.8,
				-Math.PI / 2,
				-Math.PI / 2 + (stability / 100) * Math.PI * 2,
			);
			ctx.stroke();

			// Animated rift particles
			if (animated) {
				for (let i = 0; i < 8; i++) {
					const angle = (i / 8) * Math.PI * 2 + time;
					const particleRadius = radius * (0.5 + Math.sin(time * 2 + i) * 0.2);
					const particleX = centerX + Math.cos(angle) * particleRadius;
					const particleY = centerY + Math.sin(angle) * particleRadius;

					ctx.fillStyle = tierConfig.glow;
					ctx.globalAlpha = 0.6 + Math.sin(time * 3 + i) * 0.4;
					ctx.beginPath();
					ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			// Inner core
			ctx.globalAlpha = 0.8;
			ctx.fillStyle = tierConfig.color;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius * 0.1, 0, Math.PI * 2);
			ctx.fill();

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [stability, tierConfig, statusInfo, animated]);

	return (
		<div
			className={cn(
				"relative bg-void-black/80 border border-gate-s/30 rounded-lg p-4",
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
					<span className="font-system text-sm tracking-wider text-gate-s">
						RIFT STATUS
					</span>
				</div>
				<span className="font-display text-xs tracking-widest text-gray-400">
					{tierConfig.name}
				</span>
			</div>

			{/* Rift Visualization Canvas */}
			<div className="relative mb-3">
				<canvas
					ref={canvasRef}
					className="w-full h-32 rounded border border-gate-s/20"
				/>
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-center">
						<div className="font-system text-lg font-bold text-white">
							{stability}%
						</div>
						<div
							className="font-system text-xs tracking-wider"
							style={{ color: statusInfo.color }}
						>
							{statusInfo.status}
						</div>
					</div>
				</div>
			</div>

			{/* Coordinates Display */}
			{showCoordinates && (
				<div className="space-y-2">
					<div className="text-xs font-system tracking-wider text-gray-400 uppercase">
						Coordinates
					</div>
					<div className="grid grid-cols-3 gap-2 text-xs">
						<div className="text-center">
							<div className="font-system text-gate-s">X</div>
							<div className="font-mono text-white">
								{coordinates.x.toFixed(1)}
							</div>
						</div>
						<div className="text-center">
							<div className="font-system text-gate-s">Y</div>
							<div className="font-mono text-white">
								{coordinates.y.toFixed(1)}
							</div>
						</div>
						<div className="text-center">
							<div className="font-system text-gate-s">Z</div>
							<div className="font-mono text-white">
								{coordinates.z.toFixed(1)}
							</div>
						</div>
					</div>
					<div className="text-center">
						<div className="font-system text-xs tracking-wider text-gray-400">
							DIMENSION
						</div>
						<div className="font-display text-sm text-gate-national">
							{coordinates.dimension}
						</div>
					</div>
				</div>
			)}

			{/* Stability Warning */}
			export {stability < 50 && (
				<div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
					<div className="flex items-center space-x-2">
						<div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
						<span className="font-system text-xs text-red-400 tracking-wider">
							RIFT INSTABILITY DETECTED
						</span>
					</div>
				</div>
			)}
		</div>
	);
};


