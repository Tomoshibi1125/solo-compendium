import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AscendantWindowProps {
	children: ReactNode;
	title?: string;
	actions?: ReactNode;
	className?: string;
	contentClassName?: string;
	variant?:
		| "default"
		| "alert"
		| "quest"
		| "regent"
		| "regent"
		| "resurge"
		| "gate-e"
		| "gate-d"
		| "gate-c"
		| "gate-b"
		| "gate-a"
		| "gate-s"
		| "gate-ss"
		| "gate-national";
	compact?: boolean;
	animated?: boolean;
	id?: string;
	headerClassName?: string;
	onHeaderClick?: () => void;
	/**
	 * Visual density of the panel chrome. `full` (default) keeps the complete
	 * System-Ascendant theme (backdrop blur, scan lines, animated shadow pulse,
	 * four large corner brackets). `compact` strips the heavy overlays and
	 * uses a solid-ish background with only two small corner hints — intended
	 * for nested stacked panels (VTT sidebars) where the full chrome hurts
	 * legibility and causes corner brackets to overlap neighbours.
	 */
	density?: "full" | "compact";
}

export function AscendantWindow({
	children,
	title,
	actions,
	className,
	contentClassName,
	variant = "default",
	compact = false,
	animated = true,
	id,
	headerClassName,
	onHeaderClick,
	density = "full",
}: AscendantWindowProps) {
	const isCompactDensity = density === "compact";
	const variantStyles = {
		default:
			"border-primary/40 from-primary/10 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		alert:
			"border-destructive/40 from-destructive/10 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		quest:
			"border-accent/40 from-accent/10 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		regent:
			"border-shadow-purple/50 from-shadow-purple/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		resurge:
			"border-resurge-violet/50 from-resurge-violet/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		"gate-e": "border-gate-e/40 from-gate-e/10 via-card/80 to-void-black/90",
		"gate-d": "border-gate-d/40 from-gate-d/10 via-card/80 to-void-black/90",
		"gate-c": "border-gate-c/40 from-gate-c/10 via-card/80 to-void-black/90",
		"gate-b":
			"border-gate-b/40 from-gate-b/10 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		"gate-a":
			"border-gate-a/50 from-gate-a/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		"gate-s":
			"border-gate-s/50 from-gate-s/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		"gate-ss":
			"border-gate-ss/50 from-gate-ss/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
		"gate-national":
			"border-gate-national/50 from-gate-national/15 via-card/80 to-void-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
	};

	const _glowColors = {
		default: "hsl(var(--primary))",
		alert: "hsl(var(--destructive))",
		quest: "hsl(var(--accent))",
		regent: "hsl(var(--shadow-purple))",
		resurge: "hsl(var(--resurge-violet))",
		"gate-e": "hsl(var(--gate-e-glow))",
		"gate-d": "hsl(var(--gate-d-glow))",
		"gate-c": "hsl(var(--gate-c-glow))",
		"gate-b": "hsl(var(--gate-b-glow))",
		"gate-a": "hsl(var(--gate-a-glow))",
		"gate-s": "hsl(var(--gate-s-glow))",
		"gate-ss": "hsl(var(--gate-ss-glow))",
		"gate-national": "hsl(var(--gate-national-glow))",
	};

	// Map variant → raw HSL CSS variable name (without hsl() wrapper)
	const glowVarMap = {
		default: "--primary",
		alert: "--destructive",
		quest: "--accent",
		regent: "--shadow-purple",
		resurge: "--resurge-violet",
		"gate-e": "--gate-e-glow",
		"gate-d": "--gate-d-glow",
		"gate-c": "--gate-c-glow",
		"gate-b": "--gate-b-glow",
		"gate-a": "--gate-a-glow",
		"gate-s": "--gate-s-glow",
		"gate-ss": "--gate-ss-glow",
		"gate-national": "--gate-national-glow",
	} as const;

	const glowVar = glowVarMap[variant];

	const Component = animated ? motion.div : "div";

	return (
		<Component
			id={id}
			className={cn(
				"relative border rounded-lg transition-all duration-300 w-full max-w-full",
				isCompactDensity
					? "bg-card/95 sw-root hover:border-open/50"
					: "bg-gradient-to-br backdrop-blur-2xl sa-panel ascendant-panel hologram-flicker sw-root hover:border-open/50",
				variantStyles[variant],
				animated && !isCompactDensity && "animate-shadow-pulse",
				id && "scroll-mt-4",
				className,
			)}
			// Single CSS custom property drives all child glow effects via external CSS
			{...{ style: { "--sw-glow": `var(${glowVar})` } as React.CSSProperties }}
			{...(animated
				? {
						initial: { opacity: 0, scale: 0.95, y: -20 },
						animate: { opacity: 1, scale: 1, y: 0 },
						exit: { opacity: 0, scale: 0.95, y: -20 },
						transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
					}
				: {})}
		>
			{/* Hex grid texture overlay (muted in compact density) */}
			<div
				className={cn(
					"absolute inset-0 pointer-events-none hex-grid-overlay",
					isCompactDensity ? "opacity-10" : "opacity-30",
				)}
			/>

			{/* Holographic scan line effect — hidden in compact density */}
			{!isCompactDensity && (
				<div className="absolute inset-0 pointer-events-none overflow-hidden sw-scan-line" />
			)}

			{/* Top glow line */}
			<div className="absolute top-0 left-0 right-0 h-px sw-glow-top" />

			{/* Bottom glow line */}
			<div className="absolute bottom-0 left-0 right-0 h-px sw-glow-bottom" />

			{/* Title header — isekai System style */}
			{title && (
				<div
					className={cn(
						"border-b flex items-center gap-2 sw-title-bar w-full text-left",
						"font-heading tracking-[0.2em] uppercase",
						isCompactDensity ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
						headerClassName,
					)}
				>
					{onHeaderClick ? (
						<button
							type="button"
							className="flex items-center gap-2 flex-1 text-left hover:text-primary transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary h-full -my-2 py-2"
							onClick={onHeaderClick}
						>
							<span
								className={cn(
									"w-2 h-2 rotate-45 flex-shrink-0 sw-status-dot",
									!isCompactDensity && "animate-pulse",
								)}
							/>
							<span className="truncate sw-title-text">{title}</span>
						</button>
					) : (
						<>
							<span
								className={cn(
									"w-2 h-2 rotate-45 flex-shrink-0 sw-status-dot",
									!isCompactDensity && "animate-pulse",
								)}
							/>
							<span className="truncate sw-title-text flex-1">{title}</span>
						</>
					)}

					{actions && (
						<div className="ml-auto flex items-center gap-2">{actions}</div>
					)}
				</div>
			)}
			<div
				className={cn(
					isCompactDensity ? "p-3" : compact ? "p-3" : "p-4",
					"relative z-[1]",
					contentClassName,
				)}
			>
				{children}
			</div>

			{/* Corner brackets — isekai HUD style.
			    Compact density shows only two diagonal hints (smaller + lower
			    opacity) so stacked panels don't bleed into neighbours. */}
			{isCompactDensity ? (
				<>
					<CornerDecoration position="top-left" variant={variant} size="sm" />
					<CornerDecoration
						position="bottom-right"
						variant={variant}
						size="sm"
					/>
				</>
			) : (
				<>
					<CornerDecoration position="top-left" variant={variant} />
					<CornerDecoration position="top-right" variant={variant} />
					<CornerDecoration position="bottom-left" variant={variant} />
					<CornerDecoration position="bottom-right" variant={variant} />
				</>
			)}
		</Component>
	);
}

interface CornerDecorationProps {
	position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	variant:
		| "default"
		| "alert"
		| "quest"
		| "regent"
		| "regent"
		| "resurge"
		| "gate-e"
		| "gate-d"
		| "gate-c"
		| "gate-b"
		| "gate-a"
		| "gate-s"
		| "gate-ss"
		| "gate-national";
	size?: "sm" | "md";
}

function CornerDecoration({
	position,
	variant,
	size = "md",
}: CornerDecorationProps) {
	const positionClasses = {
		"top-left": "top-0 left-0 border-l-2 border-t-2 rounded-tl",
		"top-right": "top-0 right-0 border-r-2 border-t-2 rounded-tr",
		"bottom-left": "bottom-0 left-0 border-l-2 border-b-2 rounded-bl",
		"bottom-right": "bottom-0 right-0 border-r-2 border-b-2 rounded-br",
	};

	const variantClasses = {
		default: "border-primary/40 shadow-[0_0_6px_hsl(var(--primary)/0.5)]",
		alert: "border-destructive/40 shadow-[0_0_6px_hsl(var(--destructive)/0.5)]",
		quest: "border-accent/40 shadow-[0_0_6px_hsl(var(--accent)/0.5)]",
		regent:
			"border-shadow-purple/40 shadow-[0_0_6px_hsl(var(--shadow-purple)/0.5)]",
		resurge:
			"border-resurge-violet/50 shadow-[0_0_8px_hsl(var(--resurge-violet)/0.6)]",
		"gate-e": "border-gate-e/40 shadow-[0_0_6px_hsl(var(--gate-e-glow)/0.5)]",
		"gate-d": "border-gate-d/40 shadow-[0_0_6px_hsl(var(--gate-d-glow)/0.5)]",
		"gate-c": "border-gate-c/40 shadow-[0_0_6px_hsl(var(--gate-c-glow)/0.5)]",
		"gate-b": "border-gate-b/40 shadow-[0_0_6px_hsl(var(--gate-b-glow)/0.5)]",
		"gate-a": "border-gate-a/40 shadow-[0_0_6px_hsl(var(--gate-a-glow)/0.5)]",
		"gate-s": "border-gate-s/40 shadow-[0_0_6px_hsl(var(--gate-s-glow)/0.5)]",
		"gate-ss":
			"border-gate-ss/40 shadow-[0_0_6px_hsl(var(--gate-ss-glow)/0.5)]",
		"gate-national":
			"border-gate-national/40 shadow-[0_0_6px_hsl(var(--gate-national-glow)/0.5)]",
	};

	return (
		<div
			className={cn(
				"absolute",
				size === "sm" ? "w-2.5 h-2.5 opacity-60" : "w-4 h-4",
				positionClasses[position],
				variantClasses[variant],
			)}
		/>
	);
}
