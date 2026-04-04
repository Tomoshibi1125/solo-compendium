import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Heart, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataStreamText, SystemHeading } from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import {
	type EntryType,
	isValidEntryType,
	resolveRefs,
} from "@/lib/compendiumResolver";
import { cn } from "@/lib/utils";
import {
	formatRegentVernacular,
	normalizeRegentSearch,
} from "@/lib/vernacular";

interface FavoriteItem {
	id: string;
	entryId: string;
	type: EntryType;
	name: string;
	displayName?: string;
	description?: string;
	tags?: string[];
	source_book?: string;
	rarity?: string;
	gate_rank?: string;
	level?: number;
	cr?: string;
}

const Favorites = () => {
	const {
		favorites,
		toggleFavorite,
		isLoading: favoritesLoading,
	} = useFavorites();
	const { toast } = useToast();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState("all");
	const canonicalQuery = normalizeRegentSearch(searchQuery.toLowerCase());

	const favoriteKeys = useMemo(() => Array.from(favorites).sort(), [favorites]);
	const favoriteRefs = useMemo(
		() =>
			favoriteKeys
				.map((favoriteId) => {
					const [type, id] = favoriteId.split(":");
					if (!type || !id) return null;
					if (!isValidEntryType(type)) return null;
					return { type: type as EntryType, id };
				})
				.filter(Boolean) as Array<{ type: EntryType; id: string }>,
		[favoriteKeys],
	);

	const { data: favoriteItems = [], isLoading: favoritesDetailLoading } =
		useQuery({
			queryKey: ["favorite-items", favoriteKeys],
			queryFn: async () => {
				if (favoriteRefs.length === 0) return [];
				const resolved = await resolveRefs(favoriteRefs);
				return favoriteRefs
					.map((ref) => {
						const entry = resolved.get(`${ref.type}:${ref.id}`);
						if (!entry) return null;

						const displayName =
							"display_name" in entry &&
							typeof entry.display_name === "string" &&
							entry.display_name.trim()
								? entry.display_name
								: entry.name;
						const description =
							"description" in entry && typeof entry.description === "string"
								? entry.description
								: undefined;
						const tags = Array.isArray("tags" in entry ? entry.tags : undefined)
							? (entry as { tags?: string[] }).tags?.filter(
									(tag: string) => typeof tag === "string",
								)
							: undefined;
						const sourceBook =
							"source_book" in entry && typeof entry.source_book === "string"
								? entry.source_book
								: undefined;
						const rarity =
							"rarity" in entry && typeof entry.rarity === "string"
								? entry.rarity
								: undefined;
						const gateRank =
							"gate_rank" in entry && typeof entry.gate_rank === "string"
								? entry.gate_rank
								: undefined;
						const level =
							"level" in entry && typeof entry.level === "number"
								? entry.level
								: undefined;
						const cr =
							"cr" in entry && typeof entry.cr === "string"
								? entry.cr
								: undefined;

						return {
							id: `${ref.type}:${ref.id}`,
							entryId: ref.id,
							type: ref.type,
							name: entry.name,
							displayName,
							description,
							tags,
							source_book: sourceBook,
							rarity,
							gate_rank: gateRank,
							level,
							cr,
						} as FavoriteItem;
					})
					.filter(Boolean) as FavoriteItem[];
			},
			enabled: favoriteRefs.length > 0,
		});

	const filteredItems = useMemo(
		() =>
			favoriteItems.filter((item) => {
				const matchesSearch =
					!searchQuery ||
					normalizeRegentSearch(item.name.toLowerCase()).includes(
						canonicalQuery,
					) ||
					normalizeRegentSearch(item.displayName?.toLowerCase() || "").includes(
						canonicalQuery,
					) ||
					normalizeRegentSearch(item.description?.toLowerCase() || "").includes(
						canonicalQuery,
					);

				const matchesType = filterType === "all" || item.type === filterType;

				return matchesSearch && matchesType;
			}),
		[favoriteItems, searchQuery, filterType, canonicalQuery],
	);

	const types = useMemo(
		() => Array.from(new Set(favoriteItems.map((item) => item.type))).sort(),
		[favoriteItems],
	);

	const handleRemoveFavorite = (entryType: EntryType, entryId: string) => {
		toggleFavorite(entryType, entryId);
		toast({
			title: "Removed from favorites",
			description: "Item has been removed from your favorites",
		});
	};

	const getTypeColor = (type: string) => {
		const colors: Record<string, string> = {
			Anomalies: "border-red-500/30 bg-red-500/10",
			powers: "border-blue-500/30 bg-blue-500/10",
			spells: "border-purple-500/30 bg-purple-500/10",
			equipment: "border-green-500/30 bg-green-500/10",
			feats: "border-yellow-500/30 bg-yellow-500/10",
			skills: "border-orange-500/30 bg-orange-500/10",
			backgrounds: "border-gray-500/30 bg-gray-500/10",
			regents: "border-indigo-500/30 bg-indigo-500/10",
			relics: "border-amber-500/30 bg-amber-500/10",
			jobs: "border-cyan-500/30 bg-cyan-500/10",
			paths: "border-teal-500/30 bg-teal-500/10",
			runes: "border-lime-500/30 bg-lime-500/10",
			sovereigns: "border-rose-500/30 bg-rose-500/10",
			"shadow-soldiers": "border-slate-500/30 bg-slate-500/10",
			items: "border-emerald-500/30 bg-emerald-500/10",
			techniques: "border-fuchsia-500/30 bg-fuchsia-500/10",
			artifacts: "border-sky-500/30 bg-sky-500/10",
			locations: "border-stone-500/30 bg-stone-500/10",
		};
		return colors[type] || "border-border bg-muted";
	};

	const favoritesCount = favorites.size;
	const isBusy = favoritesLoading || favoritesDetailLoading;

	return (
		<Layout>
			<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
				{/* Header */}
				<div className="mb-8">
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Favorites
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="text-muted-foreground"
					>
						Your curated compendium entries — {favoritesCount}{" "}
						{favoritesCount === 1 ? "artifact" : "artifacts"} saved
					</DataStreamText>
				</div>

				{/* Search and Filter */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<Input
							placeholder="Search favorites..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>

					<div className="flex gap-2">
						<select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="px-3 py-2 border rounded-md bg-background"
							aria-label="Filter by type"
							title="Filter favorites by type"
						>
							<option value="all">All Types</option>
							{types.map((type) => (
								<option key={type} value={type}>
									{formatRegentVernacular(
										type.charAt(0).toUpperCase() + type.slice(1),
									)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Results */}
				{isBusy ? (
					<SystemWindow title="LOADING FAVORITES" className="max-w-lg mx-auto">
						<div className="p-4 text-center">
							<DataStreamText
								variant="system"
								className="text-muted-foreground"
							>
								Loading your favorites...
							</DataStreamText>
						</div>
					</SystemWindow>
				) : filteredItems.length === 0 ? (
					<SystemWindow title="NO FAVORITES" className="max-w-lg mx-auto">
						<div className="p-4 text-center">
							<Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
							<DataStreamText
								variant="system"
								className="text-muted-foreground mb-4"
							>
								{favoritesCount === 0
									? "You haven't bound any imprints yet. Browse the archives and click the heart icon to add manifestations to your favorites."
									: "No imprints match your search protocols."}
							</DataStreamText>
							{favoritesCount === 0 && (
								<Link to="/compendium">
									<Button>Browse Compendium</Button>
								</Link>
							)}
						</div>
					</SystemWindow>
				) : (
					<div className="grid gap-4">
						{filteredItems.map((item) => {
							const typeLabel = formatRegentVernacular(
								item.type.replace(/-/g, " "),
							);
							const displayType =
								typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);

							return (
								<SystemWindow
									key={item.id}
									title={formatRegentVernacular(item.displayName || item.name)}
									className="glass-card"
								>
									<div className="p-4">
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<Badge
														variant="outline"
														className={cn("text-xs", getTypeColor(item.type))}
													>
														{displayType}
													</Badge>
													{item.rarity && (
														<Badge variant="secondary" className="text-xs">
															{formatRegentVernacular(item.rarity)}
														</Badge>
													)}
												</div>
												<SystemHeading
													level={3}
													variant="sovereign"
													className="font-semibold text-lg mb-1"
												>
													{formatRegentVernacular(
														item.displayName || item.name,
													)}
												</SystemHeading>
												{item.description && (
													<p className="text-sm text-muted-foreground mb-2">
														<AutoLinkText text={item.description} />
													</p>
												)}
												{item.tags && item.tags.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{item.tags.map((tag) => (
															<Badge
																key={tag}
																variant="secondary"
																className="text-xs"
															>
																{formatRegentVernacular(tag)}
															</Badge>
														))}
													</div>
												)}
											</div>
											<div className="flex gap-2">
												<Link to={`/compendium/${item.type}/${item.entryId}`}>
													<Button size="sm" variant="outline">
														<ExternalLink className="w-4 h-4 mr-1" />
														View
													</Button>
												</Link>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleRemoveFavorite(item.type, item.entryId)
													}
													className="text-destructive hover:text-destructive"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								</SystemWindow>
							);
						})}
					</div>
				)}
			</div>
		</Layout>
	);
};

export default Favorites;
