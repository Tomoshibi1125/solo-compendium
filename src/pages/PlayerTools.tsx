/**
 * Enhanced Player Tools Page - D&D Beyond Style Layout
 * Role-based tools for players in System Ascendant
 */

import {
	Award,
	BookOpen,
	ChevronRight,
	Crown,
	Dice6,
	FlaskConical,
	Grid3x3,
	Heart,
	HelpCircle,
	List,
	Map as MapIcon,
	Search,
	Settings,
	Shield,
	Sparkles,
	Star,
	Store,
	Sword,
	Target,
	TrendingUp,
	User,
	Users,
	Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useActiveCharacter } from "@/hooks/useActiveCharacter";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import "./PlayerTools.css";

const playerTools = [
	{
		id: "character-sheet",
		name: "Character Sheet",
		description:
			"Manage your Ascendant stats, abilities, equipment, and progression.",
		icon: User,
		status: "available",
		color:
			"from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
		iconColor: "text-blue-400",
		glow: "group-hover:shadow-blue-500/20",
		category: "core",
		priority: 1,
	},
	{
		id: "inventory",
		name: "Inventory",
		description: "View and manage your items, equipment, and relics.",
		icon: Shield,
		status: "available",
		color:
			"from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60",
		iconColor: "text-green-400",
		glow: "group-hover:shadow-green-500/20",
		category: "core",
		priority: 2,
	},
	{
		id: "abilities",
		name: "Abilities & Skills",
		description: "Track your abilities, skills, and special powers.",
		icon: Zap,
		status: "available",
		color:
			"from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60",
		iconColor: "text-purple-400",
		glow: "group-hover:shadow-purple-500/20",
		category: "core",
		priority: 3,
	},
	{
		id: "character-art",
		name: "Character Art Generator",
		description: "Generate custom artwork for your Ascendant character.",
		icon: Star,
		status: "available",
		color:
			"from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/60",
		iconColor: "text-pink-400",
		glow: "group-hover:shadow-pink-500/20",
		category: "creative",
		priority: 4,
	},
	{
		id: "compendium-viewer",
		name: "Compendium Viewer",
		description: "Browse Anomalies, items, spells, and world information.",
		icon: BookOpen,
		status: "available",
		color:
			"from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/60",
		iconColor: "text-indigo-400",
		glow: "group-hover:shadow-indigo-500/20",
		category: "reference",
		priority: 5,
	},
	{
		id: "quest-log",
		name: "Quest Log",
		description: "Track active quests, completed missions, and rewards.",
		icon: Target,
		status: "available",
		color:
			"from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/60",
		iconColor: "text-orange-400",
		glow: "group-hover:shadow-orange-500/20",
		category: "progression",
		priority: 6,
	},
	{
		id: "party-view",
		name: "Party View",
		description: "View party members, their status, and shared information.",
		icon: Users,
		status: "campaign-only",
		color:
			"from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60",
		iconColor: "text-cyan-400",
		glow: "group-hover:shadow-cyan-500/20",
		category: "social",
		priority: 7,
	},
	{
		id: "dice-roller",
		name: "Dice Roller",
		description: "Advanced dice rolling with modifiers and history.",
		icon: Dice6,
		status: "available",
		color:
			"from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60",
		iconColor: "text-red-400",
		glow: "group-hover:shadow-red-500/20",
		category: "tools",
		priority: 8,
	},
	{
		id: "marketplace",
		name: "Marketplace",
		description: "Browse and purchase items, equipment, and services.",
		icon: Store,
		status: "available",
		color:
			"from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60",
		iconColor: "text-yellow-400",
		glow: "group-hover:shadow-yellow-500/20",
		category: "economy",
		priority: 9,
	},
	{
		id: "potions",
		name: "Potions & Consumables",
		description: "Manage your potions, elixirs, and consumable items.",
		icon: FlaskConical,
		status: "available",
		color:
			"from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60",
		iconColor: "text-emerald-400",
		glow: "group-hover:shadow-emerald-500/20",
		category: "inventory",
		priority: 10,
	},
	{
		id: "achievements",
		name: "Achievements",
		description: "View your accomplishments and unlock rewards.",
		icon: Award,
		status: "available",
		color:
			"from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60",
		iconColor: "text-amber-400",
		glow: "group-hover:shadow-amber-500/20",
		category: "progression",
		priority: 11,
	},
	{
		id: "regent-status",
		name: `${formatRegentVernacular("Regent")} Status`,
		description: `Manage your ${formatRegentVernacular("regent")} domains and powers.`,
		icon: Crown,
		status: "high-level",
		color:
			"from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/60",
		iconColor: "text-violet-400",
		glow: "group-hover:shadow-violet-500/20",
		category: "high-level",
		priority: 12,
	},
];

const categories = [
	{ id: "all", name: "All Tools", icon: Grid3x3 },
	{ id: "core", name: "Core", icon: Heart },
	{ id: "creative", name: "Creative", icon: Sparkles },
	{ id: "reference", name: "Reference", icon: BookOpen },
	{ id: "progression", name: "Progression", icon: TrendingUp },
	{ id: "social", name: "Social", icon: Users },
	{ id: "tools", name: "Tools", icon: Settings },
	{ id: "economy", name: "Economy", icon: Store },
	{ id: "inventory", name: "Inventory", icon: Shield },
	{ id: "high-level", name: "High Level", icon: Crown },
];

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
							<SystemHeading level={2} variant="sovereign" className="mb-2">
								No Character Found
							</SystemHeading>
							<DataStreamText
								variant="system"
								speed="slow"
								className="max-w-md"
							>
								You need to create a character before accessing Player Tools.
								Build your Ascendant and start your journey through the System.
							</DataStreamText>
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
							<SystemHeading
								level={1}
								variant="sovereign"
								dimensional
								className="player-tools-title"
							>
								Player Tools
							</SystemHeading>
							<DataStreamText
								variant="system"
								speed="slow"
								className="player-tools-subtitle"
							>
								Manage your Ascendant's journey through the System
							</DataStreamText>
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
													<SystemHeading
														level={2}
														variant="gate"
														className="category-title"
													>
														{category.name}
													</SystemHeading>
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
									onClick={() => navigate("/warden-protocols/vtt")}
								>
									<MapIcon className="w-4 h-4 mr-2" />
									VTT Map
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
	tool: (typeof playerTools)[0];
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
								<SystemHeading
									level={3}
									variant="sovereign"
									className="font-system text-base font-bold uppercase tracking-widest mb-1 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
								>
									{tool.name}
								</SystemHeading>
								<DataStreamText
									variant="system"
									className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase"
								>
									{tool.description}
								</DataStreamText>
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
								className="font-system tracking-widest uppercase"
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
					<SystemHeading
						level={3}
						variant="sovereign"
						className="font-system text-xl font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors drop-shadow-[0_0_8px_currentColor]"
					>
						{tool.name}
					</SystemHeading>
					<DataStreamText
						variant="system"
						className="text-xs font-mono tracking-wider text-muted-foreground mb-6 uppercase leading-relaxed"
					>
						{tool.description}
					</DataStreamText>
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
							"font-system tracking-widest uppercase gap-1",
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
