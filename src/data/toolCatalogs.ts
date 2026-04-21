import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	Award,
	BarChart3,
	BookOpen,
	Calendar,
	Clock,
	Crown,
	Database,
	Dice6,
	Flame,
	FlaskConical,
	Gem,
	Globe,
	Grid,
	Grid3x3,
	Heart,
	Image as ImageIcon,
	Map as MapIcon,
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
	Volume2,
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
	{ id: "vtt", name: "VTT & Visual", icon: Grid },
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
			"Generate random rifts (theme, rank, biome, boss) and auto-generate procedural dungeon map layouts.",
		icon: Flame,
		status: "available",
		color:
			"from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/60",
		iconColor: "text-orange-400",
		glow: "group-hover:shadow-orange-500/20",
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
		name: "Regent's Shadow",
		description:
			"The official Shadow of the Regent sandbox module. Comprehensive guide to the district, anomalies, and plot.",
		icon: BookOpen,
		status: "available",
		color:
			"from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30 hover:border-fuchsia-500/60",
		iconColor: "text-fuchsia-400",
		glow: "group-hover:shadow-fuchsia-500/20",
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
			"from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/60",
		iconColor: "text-indigo-400",
		glow: "group-hover:shadow-indigo-500/20",
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
			"from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60",
		iconColor: "text-yellow-400",
		glow: "group-hover:shadow-yellow-500/20",
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
			"from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-500/60",
		iconColor: "text-amber-400",
		glow: "group-hover:shadow-amber-500/20",
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
			"from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/60",
		iconColor: "text-pink-400",
		glow: "group-hover:shadow-pink-500/20",
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
			"from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-500/60",
		iconColor: "text-teal-400",
		glow: "group-hover:shadow-teal-500/20",
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
			"from-lime-500/20 to-lime-600/10 border-lime-500/30 hover:border-lime-500/60",
		iconColor: "text-lime-400",
		glow: "group-hover:shadow-lime-500/20",
		category: "party",
		priority: 12,
	},
	{
		id: "vtt-enhanced",
		name: "Shared Battlemaps",
		description:
			"Virtual tabletop with maps, tokens, and real-time collaboration for your campaigns.",
		icon: Grid,
		status: "available",
		color:
			"from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-500/60",
		iconColor: "text-violet-400",
		glow: "group-hover:shadow-violet-500/20",
		category: "vtt",
		priority: 13,
	},
	{
		id: "token-library",
		name: "Entity Manifestations",
		description:
			"Manage and organize your custom token collection for Anomalies and NPCs.",
		icon: MapIcon,
		status: "available",
		color:
			"from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30 hover:border-fuchsia-500/60",
		iconColor: "text-fuchsia-400",
		glow: "group-hover:shadow-fuchsia-500/20",
		category: "vtt",
		priority: 14,
	},
	{
		id: "vtt-journal",
		name: "Localized Journals",
		description: "Campaign wiki and knowledge base for your world.",
		icon: BookOpen,
		status: "available",
		color:
			"from-rose-500/20 to-rose-600/10 border-rose-500/30 hover:border-rose-500/60",
		iconColor: "text-rose-400",
		glow: "group-hover:shadow-rose-500/20",
		category: "vtt",
		priority: 15,
	},
	{
		id: "art-generator",
		name: "Art Generation",
		description: "Generate character portraits, scenes, and concept art.",
		icon: ImageIcon,
		status: "available",
		color:
			"from-sky-500/20 to-sky-600/10 border-sky-500/30 hover:border-sky-500/60",
		iconColor: "text-sky-400",
		glow: "group-hover:shadow-sky-500/20",
		category: "creative",
		priority: 16,
	},
	{
		id: "audio-manager",
		name: "Audio Manager",
		description:
			"Manage sound effects, music, and ambient audio for your sessions.",
		icon: Volume2,
		status: "available",
		color:
			"from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-500/60",
		iconColor: "text-emerald-400",
		glow: "group-hover:shadow-emerald-500/20",
		category: "creative",
		priority: 17,
	},
	{
		id: "rift-console",
		name: "Rift Console",
		description:
			"Import and validate compendium content bundles for your campaign.",
		icon: Database,
		status: "available",
		color:
			"from-slate-500/20 to-slate-600/10 border-slate-500/30 hover:border-slate-500/60",
		iconColor: "text-slate-400",
		glow: "group-hover:shadow-slate-500/20",
		category: "rift",
		priority: 18,
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
		name: "Contract Log",
		description: "Track active Contracts, completed anomalies, and rewards.",
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
		name: "Essences & Consumables",
		description:
			"Manage your recovery essences, elixirs, and consumable items.",
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
