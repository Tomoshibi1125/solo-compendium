/**
 * Enhanced Player Tools Page - D&D Beyond Style Layout
 * Role-based tools for players in Rift Ascendant
 */

import {
	ChevronRight,
	Dice6,
	Grid3x3,
	Heart,
	HelpCircle,
	List,
	Map as MapIcon,
	Search,
	Settings,
	Sparkles,
	Sword,
	User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PLAYER_TOOL_CATEGORIES,
	PLAYER_TOOLS,
	type ToolCatalogItem,
} from "@/data/toolCatalogs";
import { useActiveCharacter } from "@/hooks/useActiveCharacter";
import { cn } from "@/lib/utils";
import "./PlayerTools.css";

const playerTools = PLAYER_TOOLS;
const categories = PLAYER_TOOL_CATEGORIES;

const PlayerTools = () => {
	const navigate = useNavigate();
	const { activeCharacter, isLoading: characterLoading } = useActiveCharacter();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	// Filter tools based on search and category
	const filteredTools = useMemo(() => {
		return playerTools.filter((tool) => {
			const matchesSearch =
				tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tool.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" || tool.category === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [searchQuery, selectedCategory]);

	// Group tools by category
	const toolsByCategory = useMemo(() => {
		const grouped = categories.reduce(
			(acc, category) => {
				acc[category.id] = filteredTools.filter(
					(tool) => category.id === "all" || tool.category === category.id,
				);
				return acc;
			},
			{} as Record<string, typeof playerTools>,
		);
		return grouped;
	}, [filteredTools]);

	if (characterLoading) {
		return (
			<Layout>
				<div className="player-tools-loading">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-muted rounded w-1/3"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[...Array(6)].map((_, i) => (
								<div
									key={`slot-${[...Array(i + 1)].length}`}
									className="h-48 bg-muted rounded-lg"
								></div>
							))}
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	if (!activeCharacter) {
		return (
			<Layout>
				<div className="player-tools-container">
					<div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
						<User className="w-16 h-16 text-muted-foreground/50" />
						<div>
							<RiftHeading level={2} variant="sovereign" className="mb-2">
								No Character Found
							</RiftHeading>
							<ManaFlowText variant="rift" speed="slow" className="max-w-md">
								You need to create a character before accessing Player Tools.
								Build your Ascendant and start your journey through the Rift.
							</ManaFlowText>
						</div>
						<Button size="lg" onClick={() => navigate("/characters/new")}>
							<Sparkles className="w-5 h-5 mr-2" />
							Create Your First Character
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="player-tools-container">
				{/* Header */}
				<div className="player-tools-header">
					<div className="flex items-center justify-between">
						<div>
							<RiftHeading
								level={1}
								variant="sovereign"
								dimensional
								className="player-tools-title"
							>
								Player Tools
							</RiftHeading>
							<ManaFlowText
								variant="rift"
								speed="slow"
								className="player-tools-subtitle"
							>
								Manage your Ascendant's journey through the Rift
							</ManaFlowText>
						</div>

						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/compendium")}
							>
								<HelpCircle className="w-4 h-4 mr-2" />
								Help
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigate("/profile")}
							>
								<Settings className="w-4 h-4 mr-2" />
								Settings
							</Button>
						</div>
					</div>

					{/* Character Status Bar */}
					{activeCharacter && (
						<div className="character-status-bar">
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-3">
									<div className="character-avatar">
										<User className="w-6 h-6" />
									</div>
									<div>
										<div className="character-name">{activeCharacter.name}</div>
										<div className="character-details">
											Level {activeCharacter.level}{" "}
											{activeCharacter.background || "Unknown"}{" "}
											{activeCharacter.job}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="stat-item">
										<span className="stat-label">HP</span>
										<span className="stat-value">
											{activeCharacter.hp_current}/{activeCharacter.hp_max}
										</span>
									</div>
									<div className="stat-item">
										<span className="stat-label">AC</span>
										<span className="stat-value">
											{activeCharacter.armor_class || 10}
										</span>
									</div>
									<div className="stat-item">
										<span className="stat-label">XP</span>
										<span className="stat-value">
											{activeCharacter.experience || 0}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Search and Filters */}
				<div className="player-tools-filters">
					<div className="search-bar">
						<Search className="w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="Search tools..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border-0 focus:ring-0"
						/>
					</div>

					<div className="filter-controls">
						<Select
							value={selectedCategory}
							onValueChange={setSelectedCategory}
						>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => {
									const Icon = category.icon;
									return (
										<SelectItem key={category.id} value={category.id}>
											<div className="flex items-center gap-2">
												<Icon className="w-4 h-4" />
												{category.name}
											</div>
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>

						<div className="view-toggle">
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("grid")}
							>
								<Grid3x3 className="w-4 h-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="sm"
								onClick={() => setViewMode("list")}
							>
								<List className="w-4 h-4" />
							</Button>
						</div>
					</div>
				</div>

				{/* Tools Content */}
				<div className="player-tools-content">
					{selectedCategory === "all" ? (
						// Categorized view
						<div className="space-y-8">
							{categories
								.filter((cat) => cat.id !== "all")
								.map((category) => {
									const categoryTools = toolsByCategory[category.id];
									if (categoryTools.length === 0) return null;

									const Icon = category.icon;
									return (
										<div key={category.id} className="category-section">
											<div className="category-header">
												<div className="flex items-center gap-2">
													<Icon className="w-5 h-5" />
													<RiftHeading
														level={2}
														variant="gate"
														className="category-title"
													>
														{category.name}
													</RiftHeading>
													<Badge variant="secondary">
														{categoryTools.length}
													</Badge>
												</div>
											</div>

											<div
												className={cn(
													"tools-grid",
													viewMode === "list" ? "tools-list" : "tools-grid",
												)}
											>
												{categoryTools.map((tool) => (
													<ToolCard
														key={tool.id}
														tool={tool}
														viewMode={viewMode}
													/>
												))}
											</div>
										</div>
									);
								})}
						</div>
					) : (
						// Single category view
						<div
							className={cn(
								"tools-grid",
								viewMode === "list" ? "tools-list" : "tools-grid",
							)}
						>
							{filteredTools.map((tool) => (
								<ToolCard key={tool.id} tool={tool} viewMode={viewMode} />
							))}
						</div>
					)}
				</div>

				{/* Quick Actions */}
				<div className="player-tools-quick-actions">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="w-5 h-5" />
								Quick Actions
							</CardTitle>
							<CardDescription>
								Common tasks and shortcuts for your Ascendant
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<Button
									variant="outline"
									className="justify-start"
									onClick={() =>
										activeCharacter
											? navigate(`/characters/${activeCharacter.id}`)
											: navigate("/characters/new")
									}
								>
									<Sword className="w-4 h-4 mr-2" />
									Combat Mode
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() => navigate("/dice")}
								>
									<Dice6 className="w-4 h-4 mr-2" />
									Quick Roll
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() =>
										activeCharacter
											? navigate(`/characters/${activeCharacter.id}`)
											: navigate("/characters/new")
									}
								>
									<Heart className="w-4 h-4 mr-2" />
									Rest & Recover
								</Button>
								<Button
									variant="outline"
									className="justify-start"
									onClick={() => navigate("/campaigns")}
								>
									<MapIcon className="w-4 h-4 mr-2" />
									Shared Maps
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
};

// Tool Card Component
const ToolCard = ({
	tool,
	viewMode,
}: {
	tool: ToolCatalogItem;
	viewMode: "grid" | "list";
}) => {
	const Icon = tool.icon;

	if (viewMode === "list") {
		return (
			<Link to={`/player-tools/${tool.id}`} className="block">
				<div
					className={cn(
						"rounded-[2px] p-4 transition-all duration-300 group relative overflow-hidden backdrop-blur-md",
						"border-l-4 border-y border-r bg-black/60",
						"hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_currentColor] focus:outline-none",
						tool.color,
						tool.glow,
					)}
				>
					<div className="flex items-center justify-between relative z-10">
						<div className="flex items-center gap-4">
							<div
								className={cn(
									"w-10 h-10 rounded-[2px] flex items-center justify-center shrink-0",
									"bg-black/40 border border-current shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]",
									tool.iconColor,
								)}
							>
								<Icon className="w-5 h-5" />
							</div>
							<div className="flex-1">
								<RiftHeading
									level={3}
									variant="sovereign"
									className="font-heading text-base font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
								>
									{tool.name}
								</RiftHeading>
								<ManaFlowText
									variant="rift"
									className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase"
								>
									{tool.description}
								</ManaFlowText>
							</div>
						</div>
						<div className="flex items-center gap-3">
							{tool.status === "campaign-only" && (
								<Badge
									variant="outline"
									className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20 hidden sm:inline-flex"
								>
									Campaign
								</Badge>
							)}
							{tool.status === "high-level" && (
								<Badge
									variant="outline"
									className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20 hidden sm:inline-flex"
								>
									High Level
								</Badge>
							)}
							{tool.status === "available" && (
								<Badge
									variant="secondary"
									className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20 hidden sm:inline-flex"
								>
									Available
								</Badge>
							)}
							<Button
								size="sm"
								className="font-heading tracking-widest uppercase"
								variant="outline"
								asChild
							>
								<span>
									<ChevronRight className="w-3 h-3" />
								</span>
							</Button>
						</div>
					</div>
				</div>
			</Link>
		);
	}

	return (
		<Link
			to={`/player-tools/${tool.id}`}
			className="block h-full transition-transform"
		>
			<div
				className={cn(
					"rounded-[2px] p-5 transition-all duration-300 group relative overflow-hidden backdrop-blur-md flex flex-col h-full",
					"border-l-4 border-y border-r bg-black/60",
					"hover:shadow-[0_0_20px_rgba(0,0,0,0.8),inset_0_0_15px_currentColor] focus:outline-none",
					tool.color,
					tool.glow,
				)}
			>
				{/* Background glow */}
				<div
					className={cn(
						"absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity",
						tool.color.split(" ")[0], // Uses the 'from-X' gradient class for the glow
					)}
				/>

				<div className="flex-1 relative z-10">
					<div
						className={cn(
							"w-12 h-12 rounded-[2px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110",
							"bg-black/40 border border-current shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]",
							tool.iconColor,
						)}
					>
						<Icon className="w-6 h-6" />
					</div>
					<RiftHeading
						level={3}
						variant="sovereign"
						className="font-heading text-xl font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
					>
						{tool.name}
					</RiftHeading>
					<ManaFlowText
						variant="rift"
						className="text-xs font-mono tracking-wider text-muted-foreground mb-6 uppercase leading-relaxed"
					>
						{tool.description}
					</ManaFlowText>
				</div>
				<div className="flex items-center justify-between mt-auto relative z-10">
					<div className="flex gap-2">
						{tool.status === "campaign-only" && (
							<Badge
								variant="outline"
								className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20"
							>
								Campaign
							</Badge>
						)}
						{tool.status === "high-level" && (
							<Badge
								variant="outline"
								className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20"
							>
								High Level
							</Badge>
						)}
						{tool.status === "available" && (
							<Badge
								variant="secondary"
								className="font-mono text-[10px] tracking-widest uppercase bg-black/50 border-primary/20"
							>
								Available
							</Badge>
						)}
					</div>
					<Button
						size="sm"
						className={cn(
							"font-heading tracking-widest uppercase gap-1",
							tool.color.includes("amber")
								? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 border border-amber-500/50"
								: tool.color.includes("red")
									? "bg-red-500/20 text-red-400 hover:bg-red-500/40 border border-red-500/50"
									: "bg-primary/20 text-primary hover:bg-primary/40 border border-primary/50",
						)}
						asChild
					>
						<span>
							Launch <ChevronRight className="w-3 h-3" />
						</span>
					</Button>
				</div>
			</div>
		</Link>
	);
};

export default PlayerTools;
