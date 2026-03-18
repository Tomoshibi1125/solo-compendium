import { ChevronRight, Edit, Eye, Star, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	description?: string;
	subtitle?: string;
	image?: string;
	icon?: React.ReactNode;
	badge?: string;
	actions?: React.ReactNode;
	footer?: React.ReactNode;
	variant?:
		| "default"
		| "character"
		| "campaign"
		| "item"
		| "tool"
		| "sovereign"
		| "gate"
		| "rift"
		| "shadow";
	interactive?: boolean;
	loading?: boolean;
	onClick?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	onFavorite?: () => void;
	isFavorite?: boolean;
	stats?: Array<{ label: string; value: string | number }>;
	metadata?: Record<string, unknown>;
}

const cardVariants = {
	default:
		"bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/50",
	character:
		"bg-gradient-to-br from-primary/10 to-primary/5 text-primary-foreground border-primary/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
	campaign:
		"bg-gradient-to-br from-purple-10 to-blue-10 text-white border-purple/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
	item: "bg-gradient-to-br from-amber-10 to-orange-10 text-white border-amber/30 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
	tool: "bg-gradient-to-br from-green-10 to-emerald-10 text-white border-green/30 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
	// System Ascendant variants with dimensional effects
	sovereign:
		"bg-gradient-to-br from-regent-gold/20 via-shadow-purple/15 to-void-black/90 text-white border-regent-gold/40 shadow-[0_0_25px_hsl(var(--regent-gold)/0.3)] hover:shadow-[0_0_40px_hsl(var(--regent-gold)/0.5)] hover:scale-[1.03] transition-all duration-500 regent-seal",
	gate: "bg-gradient-to-br from-gate-s/20 via-gate-ss/15 to-void-black/90 text-white border-gate-s/40 shadow-[0_0_20px_hsl(var(--gate-s-glow)/0.3)] hover:shadow-[0_0_35px_hsl(var(--gate-s-glow)/0.5)] hover:scale-[1.03] transition-all duration-500 dimensional-pulse",
	rift: "bg-gradient-to-br from-gate-national/20 via-void-black/80 to-shadow-deep/90 text-white border-gate-national/50 shadow-[0_0_30px_hsl(var(--gate-national-glow)/0.4)] hover:shadow-[0_0_50px_hsl(var(--gate-national-glow)/0.6)] hover:scale-[1.03] transition-all duration-500 rift-portal",
	shadow:
		"bg-gradient-to-br from-shadow-deep/30 via-void-black/80 to-shadow-dark/90 text-white border-shadow-deep/40 shadow-[0_0_20px_hsl(var(--shadow-deep)/0.3)] hover:shadow-[0_0_35px_hsl(var(--shadow-deep)/0.5)] hover:scale-[1.02] transition-all duration-500 shadow-pulse",
};

const EnhancedCard = ({
	title,
	description,
	subtitle,
	image,
	icon,
	badge,
	actions,
	footer,
	variant = "default",
	interactive = true,
	loading = false,
	onClick,
	onEdit,
	onDelete,
	onFavorite,
	isFavorite = false,
	stats,
	metadata,
	className,
	children,
	...props
}: EnhancedCardProps) => {
	const [isHovered, setIsHovered] = useState(false);
	const [imageError, setImageError] = useState(false);

	// remove accessibility props from div to avoid Biome warnings
	const { role: _role, tabIndex: _tabIndex, ...divProps } = props;

	const handleImageError = () => {
		setImageError(true);
	};

	const renderStats = () => {
		if (!stats || stats.length === 0) return null;

		return (
			<div className="flex flex-wrap gap-2 mt-3">
				{stats.map((stat, _index) => (
					<div
						key={JSON.stringify(stat)}
						className="flex items-center space-x-1 px-2 py-1 bg-background/60 rounded text-xs"
					>
						<span className="text-muted-foreground">{stat.label}:</span>
						<span className="font-medium text-foreground">{stat.value}</span>
					</div>
				))}
			</div>
		);
	};

	const renderActions = () => {
		if (!actions && !onClick && !onEdit && !onDelete && !onFavorite)
			return null;

		return (
			<div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
				<div className="flex items-center space-x-2">
					{actions}
					{onClick && (
						<Button size="sm" onClick={onClick} className="shrink-0">
							View
							<ChevronRight className="h-4 w-4 ml-1" />
						</Button>
					)}
				</div>

				<div className="flex items-center space-x-1">
					{onFavorite && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onFavorite}
							className={cn(
								"shrink-0 transition-colors",
								isFavorite
									? "text-yellow-500 hover:text-yellow-600"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
						</Button>
					)}

					{onEdit && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onEdit}
							className="shrink-0"
						>
							<Edit className="h-4 w-4" />
						</Button>
					)}

					{onDelete && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onDelete}
							className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		);
	};

	const cardContent = (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl",
				cardVariants[variant],
				interactive && "group",
				loading && "opacity-70",
				className,
			)}
			{...divProps}
		>
			{interactive && (
				<button
					type="button"
					className="absolute inset-0 w-full h-full cursor-pointer z-0 opacity-0"
					onClick={onClick}
					aria-label={`View ${title}`}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							onClick?.();
						}
					}}
				/>
			)}
			{/* Dimensional Rift Edges for System Ascendant variants */}
			{(variant === "sovereign" ||
				variant === "gate" ||
				variant === "rift" ||
				variant === "shadow") && (
				<>
					{/* Rift Edge Overlay */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					</div>

					{/* Energy Glow Layers */}
					<div className="absolute -inset-1 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
						{variant === "sovereign" && (
							<div className="absolute inset-0 bg-gradient-to-r from-regent-gold/20 via-shadow-purple/30 to-regent-gold/20 blur-sm"></div>
						)}
						{variant === "gate" && (
							<div className="absolute inset-0 bg-gradient-to-r from-gate-s/20 via-gate-ss/30 to-gate-s/20 blur-sm"></div>
						)}
						{variant === "rift" && (
							<div className="absolute inset-0 bg-gradient-to-r from-gate-national/25 via-void-black/40 to-gate-national/25 blur-sm"></div>
						)}
						{variant === "shadow" && (
							<div className="absolute inset-0 bg-gradient-to-r from-shadow-deep/20 via-void-black/30 to-shadow-deep/20 blur-sm"></div>
						)}
					</div>

					{/* Dimensional Depth Layers */}
					<div className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden">
						{/* Primary depth layer */}
						<div className="absolute inset-1 bg-gradient-to-br from-transparent via-transparent to-black/20 rounded-lg"></div>
						{/* Secondary depth layer for rift effect */}
						{(variant === "rift" || variant === "gate") && (
							<div className="absolute inset-2 bg-gradient-to-tl from-transparent via-transparent to-white/5 rounded-md"></div>
						)}
					</div>
				</>
			)}
			{/* Badge */}
			{badge && (
				<div className="absolute top-3 right-3 z-10">
					<Badge variant="secondary" className="text-xs">
						{badge}
					</Badge>
				</div>
			)}
			{/* Background Pattern */}
			{variant !== "default" && (
				<div className="absolute inset-0 opacity-10">
					<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
				</div>
			)}
			{/* Card Content */}
			<div className="relative z-10 p-6 pointer-events-none">
				{/* Header */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center space-x-3 flex-1 min-w-0 pointer-events-auto">
						{icon && (
							<div className="flex-shrink-0 p-2 bg-background/60 rounded-lg">
								{icon}
							</div>
						)}
						<div className="flex-1 min-w-0">
							<h3 className="text-lg font-semibold text-foreground truncate">
								{title}
							</h3>
							{subtitle && (
								<p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
							)}
						</div>
					</div>

					{isFavorite && (
						<Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0 pointer-events-auto" />
					)}
				</div>

				{/* Image */}
				{image && (
					<div className="mb-4 -mx-6 pointer-events-auto">
						<div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
							{!imageError ? (
								<img
									src={image}
									alt={title}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									onError={handleImageError}
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-muted/30">
									<div className="text-center">
										<div className="text-4xl text-muted-foreground mb-2">🖼️</div>
										<p className="text-sm text-muted-foreground">
											Image unavailable
										</p>
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Description */}
				{description && (
					<p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 pointer-events-auto">
						{description}
					</p>
				)}

				{/* Stats */}
				<div className="pointer-events-auto">{renderStats()}</div>

				{/* Children */}
				<div className="pointer-events-auto">{children}</div>

				{/* Actions */}
				<div className="pointer-events-auto">{renderActions()}</div>
			</div>
			{/* Footer */}
			{footer && (
				<div className="px-6 py-4 bg-background/60 border-t border-border relative z-20 pointer-events-auto">
					{footer}
				</div>
			)}
			{/* Hover Overlay */}
			{interactive && (
				<div
					className={cn(
						"absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
						isHovered && "opacity-100",
					)}
				>
					<div className="absolute inset-0 flex items-center justify-center">
						<Eye className="h-8 w-8 text-white/80" />
					</div>
				</div>
			)}
			{/* Loading Overlay */}
			{loading && (
				<div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
					<div className="flex flex-col items-center space-y-3">
						<div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
						<p className="text-sm text-muted-foreground">Loading...</p>
					</div>
				</div>
			)}
		</div>
	);

	return cardContent;
};

export default EnhancedCard;
