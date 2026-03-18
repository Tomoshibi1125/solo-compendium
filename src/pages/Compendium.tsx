import { useQuery } from "@tanstack/react-query";
import {
	AlertTriangle,
	ArrowUpDown,
	Crown,
	Dna,
	Download,
	Gem,
	GitBranch,
	Grid3X3,
	Heart,
	List,
	Loader2,
	MapPin,
	Package,
	ScrollText,
	Share2,
	Skull,
	Sparkles,
	Swords,
	Users,
	Wand2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { CompendiumSidebar } from "@/components/compendium/CompendiumSidebar";
import { EmptyState } from "@/components/compendium/EmptyState";
import { FilterChips } from "@/components/compendium/FilterChips";
import { GeminiProtocolGenerator } from "@/components/compendium/GeminiProtocolGenerator";
import { SearchHistoryDropdown } from "@/components/compendium/SearchHistoryDropdown";
import { SkeletonLoader } from "@/components/compendium/SkeletonLoader";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StaticCompendiumEntry } from "@/data/compendium/staticDataProvider";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";
import { useLicenseEnforcement } from "@/hooks/useLicenseEnforcement";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import type { CompendiumEntry } from "@/hooks/useStartupData";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { parseSearchQuery } from "@/lib/searchOperators";
import { isSetupRouteEnabled } from "@/lib/setupAccess";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import { cn } from "@/lib/utils";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

type SortOption =
	| "name-asc"
	| "name-desc"
	| "level-asc"
	| "level-desc"
	| "rarity-asc"
	| "rarity-desc"
	| "date-desc";

const categories = [
	{ id: "all", name: "All", icon: Grid3X3 },

	// Character Foundation
	{ id: "backgrounds", name: "Backgrounds", icon: Users },
	{ id: "jobs", name: "Jobs", icon: Swords },
	{ id: "paths", name: "Paths", icon: GitBranch },
	{ id: "regents", name: REGENT_LABEL_PLURAL, icon: Crown },

	// Abilities & Skills
	{ id: "feats", name: "Feats", icon: Sparkles },
	{ id: "skills", name: "Skills", icon: Dna },
	{ id: "powers", name: "Powers", icon: Wand2 },
	{ id: "techniques", name: "Techniques", icon: Package },

	// Magic & Equipment
	{ id: "spells", name: "Spells", icon: ScrollText },
	{ id: "runes", name: "Runes", icon: Gem },
	{ id: "relics", name: "Relics", icon: Skull },
	{ id: "artifacts", name: "Artifacts", icon: Crown },

	// World & Entities
	{ id: "monsters", name: "Monsters", icon: Skull },
	{ id: "locations", name: "Locations", icon: MapPin },
	{ id: "conditions", name: "Conditions", icon: AlertTriangle },
	{ id: "shadow-soldiers", name: "Umbral Legion", icon: Users },

	// Items
	{ id: "items", name: "Items", icon: Package },
];

// Enhanced rarity colors with System Ascendant theme
const rarityColors: Record<string, string> = {
	common: "text-muted-foreground border-muted",
	uncommon: "text-accent border-accent/40",
	rare: "text-shadow-blue border-shadow-blue/40",
	very_rare: "text-shadow-purple border-shadow-purple/40",
	legendary:
		"text-solar-glow border-solar-glow/40 shadow-[0_0_8px_hsl(var(--solar-glow)/0.3)]",
};

// Enhanced gate rank colors with System Ascendant theme
const gateRankColors: Record<string, string> = {
	E: "text-gate-e border-gate-e/40",
	D: "text-gate-d border-gate-d/40",
	C: "text-gate-c border-gate-c/40",
	B: "text-gate-b border-gate-b/40 shadow-[0_0_6px_hsl(var(--gate-b)/0.3)]",
	A: "text-gate-a border-gate-a/40 shadow-[0_0_8px_hsl(var(--gate-a)/0.4)]",
	S: "text-gate-s border-gate-s/40 shadow-[0_0_10px_hsl(var(--gate-s)/0.5)]",
	SS: "text-gate-ss border-gate-ss/40 shadow-[0_0_12px_hsl(var(--gate-ss)/0.6)]",
};

const rarityOrder: Record<string, number> = {
	common: 1,
	uncommon: 2,
	rare: 3,
	very_rare: 4,
	legendary: 5,
};

const gateRanks = ["E", "D", "C", "B", "A", "S", "SS"];

const Compendium = () => {
	const [searchDraft, setSearchDraft] = useState("");
	const debouncedSearchDraft = useDebounce(searchDraft, 300);

	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [currentPage, setCurrentPage] = useState(1);
	const [showGeminiProtocol, setShowGeminiProtocol] = useState(false);
	const itemsPerPage = 24;

	const { favorites, toggleFavorite } = useFavorites();
	const { toast } = useToast();
	const { canAccessMarketplace } = useLicenseEnforcement();
	const isE2E = import.meta.env.VITE_E2E === "true";
	const setupRouteEnabled = isSetupRouteEnabled();
	const showSetup = !isSupabaseConfigured && setupRouteEnabled && !isE2E;

	// Persist filters
	const [filters, setFilters] = useFilterPersistence("compendium", {
		selectedCategory: "all",
		searchQuery: "",
		sortBy: "name-asc" as SortOption,
		selectedRarities: [] as string[],
		minLevel: "" as number | "",
		maxLevel: "" as number | "",
		showFavoritesOnly: false,
		selectedSourceBooks: [] as string[],
		selectedSchools: [] as string[],
		selectedGateRanks: [] as string[],
		showBossOnly: false,
		showMiniBossOnly: false,
		minCR: "" as number | "",
		maxCR: "" as number | "",
	});

	// Sync local search draft with persisted filter (for clear all / back nav)
	useEffect(() => {
		setSearchDraft(filters.searchQuery);
	}, [filters.searchQuery]);

	// Update persisted search when debounced draft changes
	useEffect(() => {
		if (debouncedSearchDraft !== filters.searchQuery) {
			setFilters((prev) => ({ ...prev, searchQuery: debouncedSearchDraft }));
		}
	}, [debouncedSearchDraft, filters.searchQuery, setFilters]);

	const parsedQuery = useMemo(
		() => parseSearchQuery(filters.searchQuery),
		[filters.searchQuery],
	);

	// Fetch compendium data (using comprehensive static data loading)
	const {
		data: entries = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: [
			"compendium",
			filters.selectedCategory,
			parsedQuery.text,
			parsedQuery.operators,
			currentPage,
		],
		queryFn: async () => {
			logger.debug("=== COMPREHENSIVE DATA LOADING ===");
			logger.debug("Query called with:", {
				selectedCategory: filters.selectedCategory,
				searchQuery: parsedQuery.text,
				isSupabaseConfigured,
			});

			const allEntries: CompendiumEntry[] = [];

			const { staticDataProvider } = await import(
				"@/data/compendium/staticDataProvider"
			);

			// Always use static data provider for comprehensive loading
			logger.debug("Using comprehensive static data provider");

			// Use static data provider - fetch ALL categories for comprehensive loading
			const categories = [
				"backgrounds",
				"jobs",
				"paths",
				"regents",
				"feats",
				"skills",
				"powers",
				"techniques",
				"spells",
				"runes",
				"relics",
				"artifacts",
				"monsters",
				"locations",
				"conditions",
				"shadow-soldiers",
				"items",
				"sigils",
			] as const;

			for (const category of categories) {
				if (
					filters.selectedCategory === "all" ||
					filters.selectedCategory === category
				) {
					logger.debug(`Fetching ${category} data...`);
					let data: StaticCompendiumEntry[] = [];

					try {
						switch (category) {
							case "backgrounds":
								data = await staticDataProvider.getBackgrounds(
									parsedQuery.text,
								);
								break;
							case "jobs":
								data = await staticDataProvider.getJobs(parsedQuery.text);
								break;
							case "paths":
								data = await staticDataProvider.getPaths(parsedQuery.text);
								break;
							case "regents":
								data = await staticDataProvider.getRegents(parsedQuery.text);
								break;
							case "feats":
								data = await staticDataProvider.getFeats(parsedQuery.text);
								break;
							case "skills":
								data = await staticDataProvider.getSkills(parsedQuery.text);
								break;
							case "powers":
								data = await staticDataProvider.getPowers(parsedQuery.text);
								break;
							case "techniques":
								data = await staticDataProvider.getTechniques(parsedQuery.text);
								break;
							case "spells":
								data = await staticDataProvider.getSpells(parsedQuery.text);
								break;
							case "runes":
								data = await staticDataProvider.getRunes(parsedQuery.text);
								break;
							case "sigils":
								data = await staticDataProvider.getSigils(parsedQuery.text);
								break;
							case "relics":
								data = await staticDataProvider.getRelics(parsedQuery.text);
								break;
							case "artifacts":
								data = await staticDataProvider.getArtifacts(parsedQuery.text);
								break;
							case "monsters":
								data = await staticDataProvider.getMonsters(parsedQuery.text);
								break;
							case "locations":
								data = await staticDataProvider.getLocations(parsedQuery.text);
								break;
							case "conditions":
								data = await staticDataProvider.getConditions(parsedQuery.text);
								break;
							case "shadow-soldiers":
								data = await staticDataProvider.getShadowSoldiers(
									parsedQuery.text,
								);
								break;
							case "items":
								data = await staticDataProvider.getItems(parsedQuery.text);
								break;
						}

						logger.debug(`Got ${data.length} ${category} entries`);

						allEntries.push(
							...data.map((item) => ({
								id: item.id,
								name: item.display_name || item.name,
								type: category,
								description: item.description || "No description available",
								rarity: item.rarity || "common",
								tags: item.tags || [],
								level: item.level ?? undefined,
								created_at: item.created_at,
								source_book: item.source_book,
								source_kind:
									(item as unknown as { source_kind?: string }).source_kind ||
									"sa",
								image_url: item.image_url,
								isFavorite: favorites.has(`${category}:${item.id}`) || false,
								// Include type-specific fields
								...(category === "monsters" && {
									cr: item.cr ?? undefined,
									gate_rank: item.gate_rank ?? undefined,
									is_boss: item.is_boss,
								}),
								...(category === "powers" && {
									power_level: item.power_level,
									school: item.school,
								}),
								...(category === "runes" && {
									rune_type: item.rune_type,
									rune_category: item.rune_category,
									level: item.rune_level ?? undefined,
								}),
								...(category === "skills" && {
									ability: item.ability,
								}),
								...(category === "feats" && {
									prerequisites: item.prerequisites,
								}),
								...(category === "regents" && {
									title: item.title,
									theme: item.theme,
								}),
							})),
						);
					} catch (error) {
						logger.error(`Error fetching ${category}:`, error);
					}
				}
			}

			const accessibleEntries = await filterRowsBySourcebookAccess(
				allEntries,
				(entry) => entry.source_book,
			);

			logger.debug("=== TOTAL ENTRIES LOADED ===:", accessibleEntries.length);
			return accessibleEntries;
		},
		enabled: true, // Always enable this query since we have both Supabase and static data fallback
	});

	// Track search history
	const { addToHistory } = useSearchHistory();
	useEffect(() => {
		if (filters.searchQuery.trim() && entries.length > 0) {
			addToHistory(
				filters.searchQuery,
				{
					category: filters.selectedCategory,
					rarities: filters.selectedRarities,
					schools: filters.selectedSchools,
				},
				entries.length,
			);
		}
	}, [
		filters.searchQuery,
		entries.length,
		filters.selectedCategory,
		filters.selectedRarities,
		filters.selectedSchools,
		addToHistory,
	]);

	// Extract unique source books
	const { sourceBooks, counts, favoriteCount } = useMemo(() => {
		const books = new Set<string>();
		const nextCounts: Record<string, number> = { all: 0 };
		let nextFavoriteCount = 0;

		for (const entry of entries) {
			nextCounts.all += 1;
			nextCounts[entry.type] = (nextCounts[entry.type] || 0) + 1;
			if (entry.isFavorite) nextFavoriteCount += 1;
			if (entry.source_book) books.add(entry.source_book);
		}

		return {
			sourceBooks: Array.from(books).sort(),
			counts: nextCounts,
			favoriteCount: nextFavoriteCount,
		};
	}, [entries]);

	// Filter and sort entries
	const filteredAndSortedEntries = useMemo(() => {
		let filtered = [...entries];

		const selectedSourceBooksSet =
			filters.selectedSourceBooks.length > 0
				? new Set(filters.selectedSourceBooks)
				: null;
		const selectedSchoolsSet =
			filters.selectedSchools.length > 0
				? new Set(filters.selectedSchools)
				: null;
		const selectedGateRanksSet =
			filters.selectedGateRanks.length > 0
				? new Set(filters.selectedGateRanks)
				: null;
		const selectedRaritiesSet =
			filters.selectedRarities.length > 0
				? new Set(filters.selectedRarities)
				: null;

		// Filter by favorites
		if (filters.showFavoritesOnly) {
			filtered = filtered.filter((e) => e.isFavorite);
		}

		// Filter by source books
		if (selectedSourceBooksSet) {
			filtered = filtered.filter(
				(e) => e.source_book && selectedSourceBooksSet.has(e.source_book),
			);
		}

		// Filter by power schools (for powers)
		if (selectedSchoolsSet) {
			filtered = filtered.filter(
				(e) => e.school && selectedSchoolsSet.has(e.school),
			);
		}

		// Filter by gate ranks (for monsters)
		if (selectedGateRanksSet) {
			filtered = filtered.filter(
				(e) => e.gate_rank && selectedGateRanksSet.has(e.gate_rank),
			);
		}

		// Filter by rarity
		if (selectedRaritiesSet) {
			filtered = filtered.filter(
				(e) => e.rarity && selectedRaritiesSet.has(e.rarity),
			);
		}

		// Filter by level
		if (filters.minLevel !== "") {
			filtered = filtered.filter(
				(e) => e.level !== undefined && e.level >= (filters.minLevel as number),
			);
		}
		if (filters.maxLevel !== "") {
			filtered = filtered.filter(
				(e) => e.level !== undefined && e.level <= (filters.maxLevel as number),
			);
		}

		// Filter by CR
		if (filters.minCR !== "") {
			filtered = filtered.filter((e) => {
				if (!e.cr) return false;
				const crNum = parseFloat(e.cr);
				return !Number.isNaN(crNum) && crNum >= (filters.minCR as number);
			});
		}
		if (filters.maxCR !== "") {
			filtered = filtered.filter((e) => {
				if (!e.cr) return false;
				const crNum = parseFloat(e.cr);
				return !Number.isNaN(crNum) && crNum <= (filters.maxCR as number);
			});
		}

		// Filter by boss/mini-boss
		if (filters.showBossOnly) {
			filtered = filtered.filter((e) => e.is_boss === true);
		}
		if (filters.showMiniBossOnly) {
			filtered = filtered.filter((e) => e.tags?.includes("mini-boss") === true);
		}

		// Filter by named NPCs/bosses (if tag exists)
		// Named NPCs have 'named-npc' or 'named-boss' tags

		// Sort
		filtered.sort((a, b) => {
			switch (filters.sortBy) {
				case "name-asc":
					return a.name.localeCompare(b.name);
				case "name-desc":
					return b.name.localeCompare(a.name);
				case "level-asc":
					return (a.level || 0) - (b.level || 0);
				case "level-desc":
					return (b.level || 0) - (a.level || 0);
				case "rarity-asc":
					return (
						(rarityOrder[a.rarity || "common"] || 0) -
						(rarityOrder[b.rarity || "common"] || 0)
					);
				case "rarity-desc":
					return (
						(rarityOrder[b.rarity || "common"] || 0) -
						(rarityOrder[a.rarity || "common"] || 0)
					);
				case "date-desc":
					return (
						new Date(b.created_at || 0).getTime() -
						new Date(a.created_at || 0).getTime()
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [entries, filters]);

	// Paginate results
	const paginatedEntries = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return filteredAndSortedEntries.slice(start, end);
	}, [filteredAndSortedEntries, currentPage]);

	const totalPages = Math.ceil(filteredAndSortedEntries.length / itemsPerPage);

	// Load URL parameters on mount
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const updates: Partial<typeof filters> = {};

		if (params.get("category")) {
			updates.selectedCategory = params.get("category") || "all";
		}
		if (params.get("search")) {
			// update draft immediately
			setSearchDraft(params.get("search") || "");
			updates.searchQuery = params.get("search") || "";
		}
		if (params.get("favorites") === "true") {
			updates.showFavoritesOnly = true;
		}
		if (params.get("sources")) {
			updates.selectedSourceBooks = params.get("sources")?.split(",") || [];
		}

		if (Object.keys(updates).length > 0) {
			setFilters((prev) => ({ ...prev, ...updates }));
		}
	}, [setFilters]);

	// counts + favoriteCount are derived above in a single pass

	// Build filter chips
	const filterChips = useMemo(() => {
		const chips: Array<{
			id: string;
			label: string;
			value: string;
			onRemove: () => void;
		}> = [];

		if (filters.showFavoritesOnly) {
			chips.push({
				id: "favorites",
				label: "Favorites",
				value: "Only",
				onRemove: () =>
					setFilters((prev) => ({ ...prev, showFavoritesOnly: false })),
			});
		}

		filters.selectedSourceBooks.forEach((book) => {
			chips.push({
				id: `source-${book}`,
				label: "Source",
				value: book,
				onRemove: () =>
					setFilters((prev) => ({
						...prev,
						selectedSourceBooks: prev.selectedSourceBooks.filter(
							(b) => b !== book,
						),
					})),
			});
		});

		filters.selectedSchools.forEach((school) => {
			chips.push({
				id: `school-${school}`,
				label: "School",
				value: school,
				onRemove: () =>
					setFilters((prev) => ({
						...prev,
						selectedSchools: prev.selectedSchools.filter((s) => s !== school),
					})),
			});
		});

		filters.selectedGateRanks.forEach((rank) => {
			chips.push({
				id: `rank-${rank}`,
				label: "Rank",
				value: `${rank}-Rank`,
				onRemove: () =>
					setFilters((prev) => ({
						...prev,
						selectedGateRanks: prev.selectedGateRanks.filter((r) => r !== rank),
					})),
			});
		});

		filters.selectedRarities.forEach((rarity) => {
			chips.push({
				id: `rarity-${rarity}`,
				label: "Rarity",
				value: rarity.replace("_", " "),
				onRemove: () =>
					setFilters((prev) => ({
						...prev,
						selectedRarities: prev.selectedRarities.filter((r) => r !== rarity),
					})),
			});
		});

		if (filters.minLevel !== "" || filters.maxLevel !== "") {
			chips.push({
				id: "level",
				label: "Level",
				value: `${filters.minLevel || 0}-${filters.maxLevel || 9}`,
				onRemove: () => {
					setFilters((prev) => ({ ...prev, minLevel: "", maxLevel: "" }));
				},
			});
		}

		if (filters.minCR !== "" || filters.maxCR !== "") {
			chips.push({
				id: "cr",
				label: "CR",
				value: `${filters.minCR || 0}-${filters.maxCR || 30}`,
				onRemove: () => {
					setFilters((prev) => ({ ...prev, minCR: "", maxCR: "" }));
				},
			});
		}

		return chips;
	}, [filters, setFilters]);

	const handleClearAllFilters = () => {
		setFilters((prev) => ({
			...prev,
			showFavoritesOnly: false,
			selectedSourceBooks: [],
			selectedSchools: [],
			selectedGateRanks: [],
			selectedRarities: [],
			minLevel: "",
			maxLevel: "",
			minCR: "",
			maxCR: "",
			searchQuery: "",
		}));
		setSearchDraft("");
	};

	const handleSourceBookToggle = (book: string) => {
		setFilters((prev) => {
			const current = prev.selectedSourceBooks;
			const next = current.includes(book)
				? current.filter((b) => b !== book)
				: [...current, book];
			return { ...prev, selectedSourceBooks: next };
		});
	};

	const handleSchoolToggle = (school: string) => {
		setFilters((prev) => {
			const current = prev.selectedSchools;
			const next = current.includes(school)
				? current.filter((s) => s !== school)
				: [...current, school];
			return { ...prev, selectedSchools: next };
		});
	};

	const handleGateRankToggle = (rank: string) => {
		setFilters((prev) => {
			const current = prev.selectedGateRanks;
			const next = current.includes(rank)
				? current.filter((r) => r !== rank)
				: [...current, rank];
			return { ...prev, selectedGateRanks: next };
		});
	};

	const getRarityOrRankColor = (entry: CompendiumEntry) => {
		if (entry.gate_rank) {
			return gateRankColors[entry.gate_rank] || "border-border";
		}
		if (entry.rarity) {
			return rarityColors[entry.rarity] || "border-border";
		}
		return "border-border";
	};

	const getRarityOrRankLabel = (entry: CompendiumEntry) => {
		if (entry.gate_rank) {
			return `${entry.gate_rank}-Rank`;
		}
		if (entry.level !== undefined) {
			return entry.level === 0 ? "Cantrip" : `Tier ${entry.level}`;
		}
		if (entry.rarity) {
			return entry.rarity.replace("_", " ");
		}
		return entry.type;
	};

	const handleToggleFavorite = (
		e: React.MouseEvent,
		entry: CompendiumEntry,
	) => {
		e.preventDefault();
		e.stopPropagation();
		const wasFavorite = favorites.has(`${entry.type}:${entry.id}`);
		toggleFavorite(entry.type, entry.id);
		const displayName = formatRegentVernacular(entry.name);

		if (wasFavorite) {
			toast({
				title: "Removed from favorites",
				description: `${displayName} has been removed from your favorites`,
			});
		} else {
			toast({
				title: "Added to favorites",
				description: `${displayName} has been added to your favorites`,
			});
		}
	};

	const handleExport = () => {
		const dataStr = formatRegentVernacular(
			JSON.stringify(filteredAndSortedEntries, null, 2),
		);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `compendium-export-${new Date().toISOString().split("T")[0]}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast({
			title: "Export complete",
			description: `Exported ${filteredAndSortedEntries.length} entries.`,
		});
	};

	const handleShare = () => {
		const params = new URLSearchParams();
		if (filters.selectedCategory !== "all")
			params.set("category", filters.selectedCategory);
		if (filters.searchQuery) params.set("search", filters.searchQuery);
		if (filters.showFavoritesOnly) params.set("favorites", "true");
		if (filters.selectedSourceBooks.length > 0)
			params.set("sources", filters.selectedSourceBooks.join(","));
		const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				toast({
					title: "Link copied",
					description: "Shareable link copied to clipboard.",
				});
			})
			.catch(() => {
				toast({
					title: "Failed to copy",
					description: "Could not copy link to clipboard.",
					variant: "destructive",
				});
			});
	};

	// Highlight search terms in text (sanitized)
	const highlightText = (text: string, query: string) => {
		const displayText = formatRegentVernacular(text);
		const displayQuery = formatRegentVernacular(query);
		if (!displayQuery.trim()) return displayText;
		const escapedQuery = displayQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const parts = displayText.split(new RegExp(`(${escapedQuery})`, "gi"));
		return parts.map((part, _i) =>
			part.toLowerCase() === displayQuery.toLowerCase() ? (
				<mark
					key={part}
					className="bg-primary/20 text-primary font-semibold"
					title={`Search match: ${part}`}
				>
					{part}
				</mark>
			) : (
				part
			),
		);
	};

	// Get unique schools from powers
	const availableSchools = useMemo(() => {
		const schools = new Set<string>();
		entries.forEach((e) => {
			if (e.school) schools.add(e.school);
		});
		return Array.from(schools).sort();
	}, [entries]);

	return (
		<Layout>
			<div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative">
				{/* System UI Background Effects */}
				<div className="absolute inset-0 hex-grid-overlay opacity-30 pointer-events-none" />
				<div className="absolute inset-0 bg-gradient-to-b from-amethyst-purple/5 via-transparent to-transparent pointer-events-none" />

				{/* Header with System UI styling */}
				<div className="mb-6 sm:mb-8 relative z-10">
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2 tracking-wider"
					>
						Compendium
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="text-sm sm:text-base leading-relaxed block"
					>
						Browse the complete collection of System knowledge, from character
						foundations to world entities.
					</DataStreamText>
				</div>

				{/* Search and Controls */}
				<section
					className="flex flex-col gap-4 mb-6"
					aria-label="Search and filters"
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1 flex items-center gap-2 group">
							<div className="relative flex-1">
								<div
									className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-primary font-bold animate-pulse"
									aria-hidden="true"
								>
									{">_"}
								</div>
								<Input
									placeholder="[ QUERY_TERMINAL ] awaiting input... (e.g., type:power, level:>3)"
									aria-label="Search compendium"
									value={searchDraft || ""}
									onChange={(e) => setSearchDraft(e.target.value)}
									className="pl-12 h-14 bg-black/80 border-primary/50 text-primary font-mono tracking-widest focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2),inset_0_0_10px_hsl(var(--primary)/0.1)] rounded-[2px] transition-all duration-300 placeholder:text-primary/40 placeholder:font-system"
									autoComplete="off"
									spellCheck="false"
									title="Advanced search: type:jobs, level:>3, rarity:rare, school:evocation, cr:>5, tag:boss, source:core"
								/>
							</div>
							<SearchHistoryDropdown
								onSelect={(query) => setSearchDraft(query)}
							/>
						</div>
						<div className="flex gap-2 flex-wrap sm:flex-nowrap">
							<Select
								value={filters.sortBy}
								onValueChange={(v) =>
									setFilters((prev) => ({ ...prev, sortBy: v as SortOption }))
								}
							>
								<SelectTrigger
									className="w-full sm:w-[180px] min-h-[44px]"
									aria-label="Sort by"
								>
									<ArrowUpDown className="w-4 h-4 mr-2" aria-hidden="true" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name-asc">Name (A-Z)</SelectItem>
									<SelectItem value="name-desc">Name (Z-A)</SelectItem>
									<SelectItem value="level-asc">Level (Low-High)</SelectItem>
									<SelectItem value="level-desc">Level (High-Low)</SelectItem>
									<SelectItem value="rarity-asc">Rarity (Low-High)</SelectItem>
									<SelectItem value="rarity-desc">Rarity (High-Low)</SelectItem>
									<SelectItem value="date-desc">Newest First</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant={viewMode === "grid" ? "default" : "outline"}
								size="icon"
								onClick={() => setViewMode("grid")}
								aria-label="Grid view"
							>
								<Grid3X3 className="w-4 h-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "outline"}
								size="icon"
								onClick={() => setViewMode("list")}
								aria-label="List view"
							>
								<List className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Filter Chips */}
					{filterChips.length > 0 && (
						<FilterChips
							chips={filterChips}
							onClearAll={handleClearAllFilters}
						/>
					)}

					{/* Search hint */}
					{searchDraft !== filters.searchQuery && (
						<div className="text-xs text-muted-foreground flex items-center gap-1">
							<Loader2 className="w-3 h-3 animate-spin" />
							Searching...
						</div>
					)}
				</section>

				<div className="flex flex-col lg:flex-row gap-6">
					{/* Sidebar */}
					<CompendiumSidebar
						categories={categories.map((cat) => ({
							...cat,
							count: counts[cat.id],
						}))}
						selectedCategory={filters.selectedCategory}
						onCategoryChange={(cat) =>
							setFilters((prev) => ({ ...prev, selectedCategory: cat }))
						}
						sourceBooks={sourceBooks}
						selectedSourceBooks={filters.selectedSourceBooks}
						onSourceBookToggle={handleSourceBookToggle}
						schools={availableSchools}
						selectedSchools={filters.selectedSchools}
						onSchoolToggle={handleSchoolToggle}
						gateRanks={gateRanks}
						selectedGateRanks={filters.selectedGateRanks}
						onGateRankToggle={handleGateRankToggle}
						showFavoritesOnly={filters.showFavoritesOnly}
						onToggleFavorites={() =>
							setFilters((prev) => ({
								...prev,
								showFavoritesOnly: !prev.showFavoritesOnly,
							}))
						}
						favoriteCount={favoriteCount}
						showBossOnly={filters.showBossOnly}
						onToggleBossOnly={() =>
							setFilters((prev) => ({
								...prev,
								showBossOnly: !prev.showBossOnly,
							}))
						}
						showMiniBossOnly={filters.showMiniBossOnly}
						onToggleMiniBossOnly={() =>
							setFilters((prev) => ({
								...prev,
								showMiniBossOnly: !prev.showMiniBossOnly,
							}))
						}
					/>

					{/* Results Grid */}
					<div className="flex-1 min-w-0">
						<div className="mb-4 flex items-center justify-between flex-wrap gap-2">
							<SystemText className="block text-sm text-muted-foreground font-heading">
								Showing {paginatedEntries.length} of{" "}
								{filteredAndSortedEntries.length}{" "}
								{filteredAndSortedEntries.length === 1 ? "result" : "results"}
							</SystemText>
							<div className="flex gap-2">
								<Dialog
									open={showGeminiProtocol}
									onOpenChange={setShowGeminiProtocol}
								>
									<DialogTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
										>
											<Dna className="w-4 h-4 text-primary" />
											Gemini Protocol
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)]">
										<DialogHeader>
											<DialogTitle>Gemini Protocol</DialogTitle>
											<DialogDescription>
												Fuse Job, Path, and {REGENT_LABEL} essences into a
												Sovereign overlay.
											</DialogDescription>
										</DialogHeader>
										<GeminiProtocolGenerator />
									</DialogContent>
								</Dialog>
								<Button
									variant="outline"
									size="sm"
									onClick={handleExport}
									className="gap-2"
									disabled={filteredAndSortedEntries.length === 0}
								>
									<Download className="w-4 h-4" />
									Export
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={handleShare}
									className="gap-2"
									disabled={filteredAndSortedEntries.length === 0}
								>
									<Share2 className="w-4 h-4" />
									Share
								</Button>
							</div>
						</div>

						{showSetup ? (
							<SystemWindow title="SETUP REQUIRED" className="max-w-lg mx-auto">
								<div className="p-4 space-y-2">
									<p className="text-destructive font-heading">
										Compendium data is unavailable
									</p>
									<SystemText className="block text-sm text-muted-foreground">
										Configure Supabase to load compendium content.
									</SystemText>
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.location.assign("/setup")}
										className="mt-4"
									>
										Go to Setup
									</Button>
								</div>
							</SystemWindow>
						) : isLoading ? (
							<div
								className={cn(
									viewMode === "grid"
										? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
										: "flex flex-col gap-2",
								)}
							>
								<SkeletonLoader count={itemsPerPage} variant={viewMode} />
							</div>
						) : error ? (
							<SystemWindow title="ERROR" className="max-w-lg mx-auto">
								<div className="p-4 space-y-2">
									<p className="text-destructive font-heading">
										Failed to load compendium data
									</p>
									<SystemText className="block text-sm text-muted-foreground">
										Please try refreshing the page or check your connection.
									</SystemText>
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.location.reload()}
										className="mt-4"
									>
										Reload Page
									</Button>
								</div>
							</SystemWindow>
						) : (
							<div
								className={cn(
									viewMode === "grid"
										? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
										: "flex flex-col gap-2",
								)}
							>
								{paginatedEntries.map((entry) => (
									<Link
										key={`${entry.type}-${entry.id}`}
										to={`/compendium/${entry.type}/${entry.id}`}
										className={cn(
											"glass-card border hover:border-primary/30 hover:scale-[1.02] transition-all duration-200 group relative",
											"hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
											viewMode === "grid"
												? "p-4"
												: "p-3 flex items-center gap-4",
											getRarityOrRankColor(entry),
										)}
										aria-label={`View ${entry.name} details`}
									>
										<button
											type="button"
											onClick={(e) => handleToggleFavorite(e, entry)}
											className={cn(
												"absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200",
												"hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
												entry.isFavorite
													? "text-amber-400 hover:text-amber-300 bg-amber-400/10"
													: "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm",
											)}
											aria-label={
												entry.isFavorite
													? "Remove from favorites"
													: "Add to favorites"
											}
										>
											<Heart
												className={cn(
													"w-4 h-4 transition-all",
													entry.isFavorite && "fill-current",
												)}
											/>
										</button>

										{viewMode === "grid" ? (
											<>
												<div className="mb-3">
													<CompendiumImage
														src={entry.image_url}
														alt={entry.name}
														size="thumbnail"
														aspectRatio="square"
														className="w-full"
														fallbackIcon={(() => {
															const IconMap: Record<string, typeof Swords> = {
																jobs: Swords,
																powers: Wand2,
																relics: Gem,
																monsters: Skull,
																equipment: Package,
															};
															const Icon = IconMap[entry.type] || Package;
															return (
																<Icon className="w-8 h-8 text-muted-foreground" />
															);
														})()}
													/>
												</div>
												<div className="flex items-start justify-between mb-2">
													<span
														className={cn(
															"text-xs font-display uppercase",
															getRarityOrRankColor(entry),
														)}
													>
														{getRarityOrRankLabel(entry)}
													</span>
													<div className="flex items-center gap-2">
														{entry.source_book && (
															<Badge variant="outline" className="text-xs">
																{entry.source_book}
															</Badge>
														)}
														<span className="text-xs text-muted-foreground capitalize">
															{entry.type}
														</span>
													</div>
												</div>
												<h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
													{highlightText(entry.name, filters.searchQuery)}
													{entry.source_book !== "System Ascendant Canon" &&
														!canAccessMarketplace && (
															<span title="Premium Content">
																<AlertTriangle className="w-4 h-4 text-amber-500" />
															</span>
														)}
												</h3>
												<SystemText className="block text-sm text-muted-foreground line-clamp-2">
													{highlightText(
														entry.description,
														filters.searchQuery,
													)}
												</SystemText>
												<div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
													{entry.cr && <span>CR {entry.cr}</span>}
													{entry.school && <span>• {entry.school}</span>}
												</div>
											</>
										) : (
											<>
												<CompendiumImage
													src={entry.image_url}
													alt={entry.name}
													size="thumbnail"
													aspectRatio="square"
													className="flex-shrink-0"
													fallbackIcon={(() => {
														const IconMap: Record<string, typeof Swords> = {
															jobs: Swords,
															powers: Wand2,
															relics: Gem,
															monsters: Skull,
															equipment: Package,
														};
														const Icon = IconMap[entry.type] || Package;
														return (
															<Icon className="w-8 h-8 text-muted-foreground" />
														);
													})()}
												/>
												<span
													className={cn(
														"text-xs font-display uppercase w-24 flex-shrink-0",
														getRarityOrRankColor(entry),
													)}
												>
													{getRarityOrRankLabel(entry)}
												</span>
												<div className="flex-1 min-w-0">
													<h3 className="font-heading font-semibold group-hover:text-primary transition-colors leading-tight flex items-center gap-2">
														{highlightText(entry.name, filters.searchQuery)}
														{entry.source_book !== "System Ascendant Canon" &&
															!canAccessMarketplace && (
																<span title="Premium Content">
																	<AlertTriangle className="w-3 h-3 text-amber-500" />
																</span>
															)}
													</h3>
													<SystemText className="block text-sm text-muted-foreground line-clamp-1 mt-1 leading-relaxed">
														{highlightText(
															entry.description,
															filters.searchQuery,
														)}
													</SystemText>
												</div>
												<div className="flex items-center gap-2 flex-shrink-0">
													{entry.source_book && (
														<Badge variant="outline" className="text-xs">
															{entry.source_book}
														</Badge>
													)}
													<span className="text-xs text-muted-foreground capitalize">
														{entry.type}
													</span>
												</div>
											</>
										)}
									</Link>
								))}
							</div>
						)}

						{!isLoading && filteredAndSortedEntries.length === 0 && (
							<EmptyState
								type={
									filters.showFavoritesOnly
										? "no-favorites"
										: filters.searchQuery || filterChips.length > 0
											? "no-results"
											: "no-category"
								}
								searchQuery={filters.searchQuery}
								onClearFilters={handleClearAllFilters}
								onClearSearch={() => {
									setFilters((prev) => ({ ...prev, searchQuery: "" }));
									setSearchDraft("");
								}}
							/>
						)}

						{/* Pagination */}
						{!isLoading && filteredAndSortedEntries.length > itemsPerPage && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
								itemsPerPage={itemsPerPage}
								totalItems={filteredAndSortedEntries.length}
							/>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Compendium;
