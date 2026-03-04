import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SystemTextProps {
	children: ReactNode;
	variant?:
	| "heading"
	| "subheading"
	| "body"
	| "system"
	| "data"
	| "sovereign"
	| "rift"
	| "gate"
	| "shadow";
	size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
	glow?: boolean;
	dimensional?: boolean;
	className?: string;
}

const textVariants = {
	heading: {
		font: "font-display",
		weight: "font-black",
		tracking: "tracking-widest",
		color: "text-white",
	},
	subheading: {
		font: "font-heading",
		weight: "font-bold",
		tracking: "tracking-wide",
		color: "text-gray-200",
	},
	body: {
		font: "font-body",
		weight: "font-normal",
		tracking: "tracking-normal",
		color: "text-gray-300",
	},
	system: {
		font: "font-system",
		weight: "font-medium",
		tracking: "tracking-wider",
		color: "text-system-green",
	},
	data: {
		font: "font-system",
		weight: "font-normal",
		tracking: "tracking-wide",
		color: "text-primary",
	},
	sovereign: {
		font: "font-display",
		weight: "font-black",
		tracking: "tracking-widest",
		color: "text-monarch-gold",
	},
	rift: {
		font: "font-display",
		weight: "font-bold",
		tracking: "tracking-wider",
		color: "text-gate-national",
	},
	gate: {
		font: "font-heading",
		weight: "font-semibold",
		tracking: "tracking-wide",
		color: "text-gate-s",
	},
	shadow: {
		font: "font-system",
		weight: "font-medium",
		tracking: "tracking-wider",
		color: "text-shadow-deep",
	},
};

const sizeVariants = {
	xs: "text-xs",
	sm: "text-sm",
	base: "text-base",
	lg: "text-lg",
	xl: "text-xl",
	"2xl": "text-2xl",
	"3xl": "text-3xl",
	"4xl": "text-4xl",
};

/* Crisp text-shadow (no blur-causing filter) */
const dimensionalShadows: Record<string, string> = {
	heading: "0 0 8px hsl(260 30% 78% / 0.5), 0 0 20px hsl(275 72% 59% / 0.2)",
	subheading: "0 0 6px hsl(275 72% 59% / 0.4)",
	body: "",
	system: "0 0 8px hsl(145 85% 45% / 0.4), 0 0 16px hsl(145 85% 45% / 0.15)",
	data: "0 0 6px hsl(275 72% 59% / 0.3)",
	sovereign: "0 0 10px hsl(260 30% 78% / 0.4), 0 0 24px hsl(275 72% 59% / 0.15)",
	rift: "0 0 8px hsl(330 90% 52% / 0.4), 0 0 20px hsl(330 90% 52% / 0.15)",
	gate: "0 0 8px hsl(220 35% 75% / 0.4), 0 0 16px hsl(220 35% 75% / 0.15)",
	shadow: "0 0 6px hsl(270 60% 20% / 0.5)",
};

export const SystemText = ({
	children,
	variant = "body",
	size = "base",
	glow = false,
	dimensional = false,
	className,
}: SystemTextProps) => {
	const variantStyles = textVariants[variant];

	return (
		<span
			className={cn(
				variantStyles.font,
				variantStyles.weight,
				variantStyles.tracking,
				variantStyles.color,
				sizeVariants[size],
				className,
			)}
			style={
				dimensional || glow
					? { textShadow: dimensionalShadows[variant] || "" }
					: undefined
			}
		>
			{children}
		</span>
	);
};

// Enhanced heading component with dimensional effects
interface SystemHeadingProps {
	children: ReactNode;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	variant?: "system" | "sovereign" | "rift" | "gate" | "shadow";
	dimensional?: boolean;
	className?: string;
}

export const SystemHeading = ({
	children,
	level = 1,
	variant = "system",
	dimensional = false,
	className,
}: SystemHeadingProps) => {
	const componentMap = {
		1: "h1",
		2: "h2",
		3: "h3",
		4: "h4",
		5: "h5",
		6: "h6",
	} as const;

	const Component = componentMap[level];

	const variantStyles = {
		system: {
			font: "font-display",
			color: "text-system-green",
		},
		sovereign: {
			font: "font-display",
			color: "text-monarch-gold",
		},
		rift: {
			font: "font-display",
			color: "text-gate-national",
		},
		gate: {
			font: "font-heading",
			color: "text-gate-s",
		},
		shadow: {
			font: "font-system",
			color: "text-shadow-deep",
		},
	};

	const sizeStyles = {
		1: "text-4xl md:text-5xl lg:text-6xl font-black tracking-widest",
		2: "text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider",
		3: "text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide",
		4: "text-xl md:text-2xl lg:text-3xl font-medium tracking-wide",
		5: "text-lg md:text-xl lg:text-2xl font-medium tracking-normal",
		6: "text-base md:text-lg lg:text-xl font-normal tracking-normal",
	};

	const styles = variantStyles[variant];

	return (
		<Component
			className={cn(
				styles.font,
				styles.color,
				sizeStyles[level],
				className,
			)}
			style={
				dimensional
					? { textShadow: dimensionalShadows[variant] || "" }
					: undefined
			}
		>
			{children}
		</Component>
	);
};

// Data stream text component
interface DataStreamTextProps {
	children: ReactNode;
	variant?: "system" | "sovereign" | "rift";
	speed?: "slow" | "normal" | "fast";
	className?: string;
}

export const DataStreamText = ({
	children,
	variant = "system",
	speed = "normal",
	className,
}: DataStreamTextProps) => {
	const variantStyles = {
		system: {
			color: "text-system-green",
		},
		sovereign: {
			color: "text-monarch-gold",
		},
		rift: {
			color: "text-gate-national",
		},
	};

	const styles = variantStyles[variant];

	return (
		<span
			className={cn(
				"font-system font-medium tracking-wider",
				styles.color,
				className,
			)}
			style={{
				textShadow: dimensionalShadows[variant] || "",
			}}
		>
			{children}
		</span>
	);
};

export default SystemText;
