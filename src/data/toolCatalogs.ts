import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	BarChart3,
	BookOpen,
	Calendar,
	Clock,
	Crown,
	Dice6,
	Flame,
	Gem,
	Globe,
	Grid3x3,
	Heart,
	Image as ImageIcon,
	Palette,
	Scroll,
	Settings,
	Settings2,
	Shield,
	Sparkles,
	Star,
	Store,
	Sword,
	Target,
	TrendingUp,
	User,
	Users,
	UsersRound,
	Zap,
} from "lucide-react";
import { formatRegentVernacular } from "@/lib/vernacular";

export interface ToolCatalogItem {
	id: string;
	name: string;
	description: string;
	icon: LucideIcon;
	status: string;
	color: string;
	iconColor: string;
	glow: string;
	category: string;
	priority: number;
	path?: string;
	buttonText?: string;
}

export interface ToolCatalogCategory {
	id: string;
	name: string;
	icon: LucideIcon;
}

export const WARDEN_TOOL_CATEGORIES: ToolCatalogCategory[] = [
	{ id: "all", name: "All Protocols", icon: Grid3x3 },
	{ id: "combat", name: "Combat", icon: Sword },
	{ id: "world", name: "World Building", icon: Globe },
	{ id: "content", name: "Content", icon: BookOpen },
	{ id: "items", name: "Items & Equipment", icon: Shield },
	{ id: "party", name: "Party & Session", icon: UsersRound },
	{ id: "creative", name: "Creative", icon: Palette },
	{ id: "rift", name: "System", icon: Settings },
];

export const WARDEN_TOOLS: ToolCatalogItem[] = [
	{
		id: "encounter-builder",
		name: "Encounter Builder",
		description:
			"Create balanced encounters by adding anomalies and calculating difficulty.",
		icon: Sword,
		status: "available",
		color:
			"from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60",
		iconColor: "text-red-400",
		glow: "group-hover:shadow-red-500/20",
		category: "combat",
		priority: 1,
	},
	{
		id: "initiative-tracker",
		name: "Initiative Tracker",
		description: "Track turn order, HP, conditions, and effects during combat.",
		icon: Clock,
		status: "available",
		color:
			"from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60",
		iconColor: "text-blue-400",
		glow: "group-hover:shadow-blue-500/20",
		category: "combat",
		priority: 2,
	},
	{
		id: "gate-generator",
		name: "Rift Generator",
		description:
			"Generate random Rifts (theme, rank, biome, boss) and auto-generate procedural Rift map layouts.",
		icon: Flame,
		status: "available",
		color:
			"from-gate-a/20 to-gate-a/10 border-gate-a/30 hover:border-gate-a/60",
		iconColor: "text-gate-a",
		glow: "group-hover:shadow-gate-a/20",
		category: "world",
		priority: 3,
	},
	{
		id: "npc-generator",
		name: "NPC Generator",
		description: "Create NPCs with mannerisms, secrets, and motivations.",
		icon: Users,
		status: "available",
		color:
			"from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/60",
		iconColor: "text-purple-400",
		glow: "group-hover:shadow-purple-500/20",
		category: "world",
		priority: 4,
	},
	{
		id: "rollable-tables",
		name: "Rollable Tables",
		description:
			"Access all Warden's Guide tables for hazards, complications, rewards, and more.",
		icon: Dice6,
		status: "available",
		color:
			"from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/60",
		iconColor: "text-cyan-400",
		glow: "group-hover:shadow-cyan-500/20",
		category: "content",
		priority: 6,
	},
	{
		id: "sandbox-module",
		name: "Run Silent",
		description:
			"The official Run Silent sandbox module — a country-sized survival-horror Rift Interior, its warded native communities, its ecology of threats, and the unseen apex predator that hunts it.",
		icon: BookOpen,
		status: "available",
		color:
			"from-resurge-violet/20 to-resurge-violet/10 border-resurge-violet/30 hover:border-resurge-violet/60",
		iconColor: "text-resurge-violet",
		glow: "group-hover:shadow-resurge-violet/20",
		category: "content",
		priority: 6.5,
		path: "/source-book/module",
		buttonText: "Read Module",
	},
	{
		id: "directive-lattice",
		name: "Directive Lattice",
		description:
			"Synthesize operational directives, localized contracts, and mission parameters.",
		icon: Scroll,
		status: "available",
		color:
			"from-hunter-blue/20 to-hunter-blue/10 border-hunter-blue/30 hover:border-hunter-blue/60",
		iconColor: "text-hunter-blue",
		glow: "group-hover:shadow-hunter-blue/20",
		category: "content",
		priority: 7,
	},
	{
		id: "random-event-generator",
		name: "Random Events",
		description: "Generate unexpected events to add dynamism to your sessions.",
		icon: AlertTriangle,
		status: "available",
		color:
			"from-gate-s/20 to-gate-s/10 border-gate-s/30 hover:border-gate-s/60",
		iconColor: "text-gate-s",
		glow: "group-hover:shadow-gate-s/20",
		category: "content",
		priority: 8,
	},
	{
		id: "relic-workshop",
		name: "Relic Workshop",
		description: "Design custom relics balanced within the rift guidelines.",
		icon: Settings2,
		status: "available",
		color:
			"from-gate-s/20 to-gate-s/10 border-gate-s/30 hover:border-gate-s/60",
		iconColor: "text-gate-s",
		glow: "group-hover:shadow-gate-s/20",
		category: "items",
		priority: 9,
	},
	{
		id: "treasure-generator",
		name: "Treasure Generator",
		description:
			"Generate treasure hoards by Rift Rank with gold, items, materials, and relics.",
		icon: Gem,
		status: "available",
		color:
			"from-resurge-violet/20 to-resurge-violet/10 border-resurge-violet/30 hover:border-resurge-violet/60",
		iconColor: "text-resurge-violet",
		glow: "group-hover:shadow-resurge-violet/20",
		category: "items",
		priority: 10,
	},
	{
		id: "party-tracker",
		name: "Party Tracker",
		description: "Manage party members, levels, and shared resources.",
		icon: UsersRound,
		status: "available",
		color:
			"from-system-green/20 to-system-green/10 border-system-green/30 hover:border-system-green/60",
		iconColor: "text-system-green",
		glow: "group-hover:shadow-system-green/20",
		category: "party",
		priority: 11,
	},
	{
		id: "session-planner",
		name: "Session Planner",
		description: "Plan and organize your campaign sessions.",
		icon: Calendar,
		status: "available",
		color:
			"from-system-green/20 to-system-green/10 border-system-green/30 hover:border-system-green/60",
		iconColor: "text-system-green",
		glow: "group-hover:shadow-system-green/20",
		category: "party",
		priority: 12,
	},
	{
		id: "art-generator",
		name: "Art Generation",
		description: "Generate character portraits, scenes, and concept art.",
		icon: ImageIcon,
		status: "available",
		color:
			"from-mana-cyan/20 to-mana-cyan/10 border-mana-cyan/30 hover:border-mana-cyan/60",
		iconColor: "text-mana-cyan",
		glow: "group-hover:shadow-mana-cyan/20",
		category: "creative",
		priority: 16,
	},
	{
		id: "content-audit",
		name: "Content Audit",
		description:
			"Review database completeness, link integrity, and coverage gaps.",
		icon: BarChart3,
		status: "available",
		color:
			"from-zinc-500/20 to-zinc-600/10 border-zinc-500/30 hover:border-zinc-500/60",
		iconColor: "text-zinc-400",
		glow: "group-hover:shadow-zinc-500/20",
		category: "rift",
		priority: 19,
	},
];

export const PLAYER_TOOL_CATEGORIES: ToolCatalogCategory[] = [
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

export const PLAYER_TOOLS: ToolCatalogItem[] = [
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
			"from-resurge-violet/20 to-resurge-violet/10 border-resurge-violet/30 hover:border-resurge-violet/60",
		iconColor: "text-resurge-violet",
		glow: "group-hover:shadow-resurge-violet/20",
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
			"from-hunter-blue/20 to-hunter-blue/10 border-hunter-blue/30 hover:border-hunter-blue/60",
		iconColor: "text-hunter-blue",
		glow: "group-hover:shadow-hunter-blue/20",
		category: "reference",
		priority: 5,
	},
	{
		id: "quest-log",
		name: "Contract Log",
		description: "Track active Contracts, completed anomalies, and rewards.",
		icon: Target,
		status: "available",
		color:
			"from-gate-a/20 to-gate-a/10 border-gate-a/30 hover:border-gate-a/60",
		iconColor: "text-gate-a",
		glow: "group-hover:shadow-gate-a/20",
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
			"from-gate-s/20 to-gate-s/10 border-gate-s/30 hover:border-gate-s/60",
		iconColor: "text-gate-s",
		glow: "group-hover:shadow-gate-s/20",
		category: "economy",
		priority: 9,
	},
	{
		id: "regent-status",
		name: `${formatRegentVernacular("Regent")} Status`,
		description: `Manage your ${formatRegentVernacular("regent")} domains and powers.`,
		icon: Crown,
		status: "high-level",
		color:
			"from-resurge-violet/20 to-resurge-violet/10 border-resurge-violet/30 hover:border-resurge-violet/60",
		iconColor: "text-resurge-violet",
		glow: "group-hover:shadow-resurge-violet/20",
		category: "high-level",
		priority: 12,
	},
];
