import { cn } from "@/lib/utils";

interface RaLogoProps {
	className?: string;
	/** `mark` = circular monogram crop (small sizes); `full` = logo + wordmark (splash areas). */
	variant?: "mark" | "full";
	size?: "sm" | "md" | "lg" | "xl";
	/** Suppress the animated aura glow (for tight inline placements). */
	still?: boolean;
}

const SIZE_CLASSES = {
	sm: "w-12 h-12",
	md: "w-24 h-24",
	lg: "w-32 h-32",
	xl: "w-48 h-48",
};

const SOURCES = {
	mark: {
		avif: "/ui-art/ra-logo-mark.avif",
		webp: "/ui-art/ra-logo-mark.webp",
		png: "/ui-art/ra-logo-mark.png",
		alt: "Rift Ascendant monogram",
	},
	full: {
		avif: "/ui-art/ra-logo-full.avif",
		webp: "/ui-art/ra-logo-full.webp",
		png: "/ui-art/ra-logo-full.png",
		alt: "Rift Ascendant",
	},
};

/**
 * The Rift Ascendant brand logo. The source art has a solid black
 * background, which reads seamlessly on the obsidian app surface; the
 * `mark` variant's monogram is circular, so it gets a rounded mask to
 * soften the square edge at small sizes.
 */
export function RaLogo({
	className,
	variant = "mark",
	size = "md",
	still = false,
}: RaLogoProps) {
	const src = SOURCES[variant];
	return (
		<div className={cn("relative", SIZE_CLASSES[size], className)}>
			{!still && (
				<div className="absolute inset-0 rounded-full bg-gradient-radial from-shadow-purple/30 via-shadow-blue/20 to-transparent blur-xl animate-pulse-glow" />
			)}
			<picture>
				<source srcSet={src.avif} type="image/avif" />
				<source srcSet={src.webp} type="image/webp" />
				<img
					src={src.png}
					alt={src.alt}
					className={cn(
						"w-full h-full object-contain relative z-10 drop-shadow-[0_0_12px_hsl(var(--shadow-purple)/0.45)]",
						variant === "mark" && "rounded-full",
					)}
					loading="lazy"
					decoding="async"
				/>
			</picture>
		</div>
	);
}
