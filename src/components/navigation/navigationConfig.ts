import {
	BookOpen,
	Dice6,
	FlaskConical,
	Heart,
	Shield,
	Sparkles,
	Store,
	Swords,
	Users,
} from "lucide-react";

export type NavSubItem = {
	title: string;
	href: string;
	description?: string;
	icon?: unknown;
};

export type NavItemConfig = {
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
				title: "Warden Tools",
				href: "/dm-tools",
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
