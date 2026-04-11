import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	BookOpen,
	Crown,
	Dice6,
	Dna,
	FlaskConical,
	Gem,
	GitBranch,
	Heart,
	MapPin,
	Package,
	ScrollText,
	Shield,
	Skull,
	Sparkles,
	Store,
	Swords,
	Users,
	Wand2,
} from "lucide-react";

type NavSubItem = {
	title: string;
	href: string;
	description?: string;
	icon?: LucideIcon;
};

type NavItemConfig = {
	title: string;
	href?: string;
	items?: NavSubItem[];
};

export const navigationConfig: NavItemConfig[] = [
	{
		title: "Compendium",
		items: [
			{
				title: "Ascendants",
				href: "/characters",
				description: "Manage your player characters and progression.",
				icon: Swords,
			},
			{
				title: "Game Rules",
				href: "/compendium",
				description: "Explore the core rules, mechanics, and systems.",
				icon: BookOpen,
			},
			{
				title: "Classes & Features",
				href: "/compendium?tab=classes",
				description: "Discover paths of ascension and abilities.",
				icon: Shield,
			},
			{
				title: "Anomalies",
				href: "/compendium?category=anomalies",
				description: "Rift-born creatures and hostile entities.",
				icon: Skull,
			},
			{
				title: "Backgrounds",
				href: "/compendium?category=backgrounds",
				description: "Character origins and backstory options.",
				icon: Users,
			},
			{
				title: "Jobs",
				href: "/compendium?category=jobs",
				description: "Ascendant class archetypes and roles.",
				icon: Swords,
			},
			{
				title: "Paths",
				href: "/compendium?category=paths",
				description: "Specialization paths and subclass options.",
				icon: GitBranch,
			},
			{
				title: "Regents",
				href: "/compendium?category=regents",
				description: "Powerful sovereign entities and patrons.",
				icon: Crown,
			},
			{
				title: "Feats",
				href: "/compendium?category=feats",
				description: "Special abilities and character enhancements.",
				icon: Sparkles,
			},
			{
				title: "Skills",
				href: "/compendium?category=skills",
				description: "Trainable proficiencies and expertise.",
				icon: Dna,
			},
			{
				title: "Powers",
				href: "/compendium?category=powers",
				description: "Supernatural abilities and manifestations.",
				icon: Wand2,
			},
			{
				title: "Techniques",
				href: "/compendium?category=techniques",
				description: "Combat techniques and martial arts.",
				icon: Package,
			},
			{
				title: "Spells",
				href: "/compendium?category=spells",
				description: "Arcane and divine spell listings.",
				icon: ScrollText,
			},
			{
				title: "Runes",
				href: "/compendium?category=runes",
				description: "Absorbable runes and rune protocols.",
				icon: Gem,
			},
			{
				title: "Sigils",
				href: "/compendium?category=sigils",
				description: "Command sigils and system inscriptions.",
				icon: Sparkles,
			},
			{
				title: "Relics",
				href: "/compendium?category=relics",
				description: "Ancient relics of immense power.",
				icon: Skull,
			},
			{
				title: "Artifacts",
				href: "/compendium?category=artifacts",
				description: "Legendary artifacts and unique treasures.",
				icon: Crown,
			},
			{
				title: "Equipment",
				href: "/compendium?category=equipment",
				description: "Weapons, armor, shields, and adventuring gear.",
				icon: Shield,
			},
			{
				title: "Items",
				href: "/compendium?category=items",
				description: "Consumables, materials, and miscellaneous items.",
				icon: Store,
			},
			{
				title: "Tattoos",
				href: "/compendium?category=tattoos",
				description: "Mystical body inscriptions and enhancements.",
				icon: Heart,
			},
			{
				title: "Pantheon",
				href: "/compendium?category=pantheon",
				description: "Deities, divine entities, and cosmic powers.",
				icon: Crown,
			},
			{
				title: "Locations",
				href: "/compendium?category=locations",
				description: "Notable places, dungeons, and territories.",
				icon: MapPin,
			},
			{
				title: "Conditions",
				href: "/compendium?category=conditions",
				description: "Status effects, buffs, and debuffs.",
				icon: AlertTriangle,
			},
			{
				title: "Umbral Legion",
				href: "/compendium?category=shadow-soldiers",
				description: "Shadow soldier summons and legion units.",
				icon: Users,
			},
		],
	},
	{
		title: "Tools",
		items: [
			{
				title: "Player Tools",
				href: "/player-tools",
				description: "Tools for ascendant gameplay.",
				icon: Sparkles,
			},
			{
				title: "Warden Protocols",
				href: "/warden-protocols",
				description: "Master the rifts with Warden tools.",
				icon: Shield,
			},
			{
				title: "Dice Roller",
				href: "/dice",
				description: "Roll dice for your encounters.",
				icon: Dice6,
			},
		],
	},
	{
		title: "Campaigns",
		items: [
			{
				title: "My Campaigns",
				href: "/campaigns",
				description: "View and manage your active campaigns.",
				icon: Users,
			},
			{
				title: "Join a Campaign",
				href: "/campaigns/join",
				description: "Enter a friend's active campaign.",
				icon: Store,
			},
		],
	},
	{
		title: "Guilds",
		items: [
			{
				title: "My Guilds",
				href: "/guilds",
				description: "Manage your guilds and NPC recruits.",
				icon: Shield,
			},
			{
				title: "Join a Guild",
				href: "/guilds/join",
				description: "Join an existing guild with a share code.",
				icon: Users,
			},
		],
	},
	{
		title: "Collections",
		items: [
			{
				title: "Favorites",
				href: "/favorites",
				description: "Your saved and bookmarked items.",
				icon: Heart,
			},
			{
				title: "Homebrew",
				href: "/homebrew",
				description: "Custom ascendant creations.",
				icon: FlaskConical,
			},
			{
				title: "Marketplace",
				href: "/marketplace",
				description: "Get new assets and modules.",
				icon: Store,
			},
		],
	},
];
