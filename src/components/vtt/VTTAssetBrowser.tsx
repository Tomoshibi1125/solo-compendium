import {
	BookOpen,
	Box,
	Building,
	Car,
	ChevronDown,
	Clock,
	Cloud,
	Cog,
	GripVertical,
	Heart,
	Image,
	Layers,
	MapPin,
	Moon,
	Search,
	Shield,
	Skull,
	Sparkles,
	Star,
	Sword,
	Swords,
	Trees,
	Upload,
	User,
	Wand2,
	X,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	getVTTAssetCategories,
	getVTTAssetLibrary,
	searchAssets,
	type VTTAsset,
	type VTTAssetCategory,
} from "@/data/vttAssetLibrary";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import { compressImage } from "@/lib/imageOptimization";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<VTTAssetCategory, React.ReactNode> = {
	map: <MapPin className="w-3 h-3" />,
	Anomaly: <Skull className="w-3 h-3" />,
	portrait: <User className="w-3 h-3" />,
	location: <Layers className="w-3 h-3" />,
	spell: <Wand2 className="w-3 h-3" />,
	effect: <Sparkles className="w-3 h-3" />,
	prop: <Box className="w-3 h-3" />,
	condition: <Heart className="w-3 h-3" />,
	item: <Swords className="w-3 h-3" />,
	handout: <BookOpen className="w-3 h-3" />,
	token: <Image className="w-3 h-3" />,
	technique: <Zap className="w-3 h-3" />,
	// New categories
	environment: <Trees className="w-3 h-3" />,
	weapon: <Sword className="w-3 h-3" />,
	armor: <Shield className="w-3 h-3" />,
	creature: <Skull className="w-3 h-3" />,
	npc: <User className="w-3 h-3" />,
	building: <Building className="w-3 h-3" />,
	vehicle: <Car className="w-3 h-3" />,
	nature: <Trees className="w-3 h-3" />,
	elemental: <Cloud className="w-3 h-3" />,
	divine: <Star className="w-3 h-3" />,
	shadow: <Moon className="w-3 h-3" />,
	cosmic: <Star className="w-3 h-3" />,
	mechanical: <Cog className="w-3 h-3" />,
	magical: <Sparkles className="w-3 h-3" />,
};

const RECENT_ASSETS_KEY = "vtt-recent-assets";
const MAX_RECENT = 12;
const PAGE_SIZE = 60;

function getRecentAssetIds(): string[] {
	try {
		return JSON.parse(localStorage.getItem(RECENT_ASSETS_KEY) || "[]");
	} catch {
		return [];
	}
}
function addRecentAssetId(id: string) {
	const recent = getRecentAssetIds().filter((r) => r !== id);
	recent.unshift(id);
	localStorage.setItem(
		RECENT_ASSETS_KEY,
		JSON.stringify(recent.slice(0, MAX_RECENT)),
	);
}

interface VTTAssetBrowserProps {
	onUseAsMap?: (imageUrl: string, name: string) => void;
	onUseAsToken?: (imageUrl: string, name: string) => void;
	onUseAsEffect?: (imageUrl: string, name: string) => void;
	onShareHandout?: (imageUrl: string, name: string) => void;
	campaignId?: string;
	readOnly?: boolean;
}

export function VTTAssetBrowser({
	onUseAsMap,
	onUseAsToken,
	onUseAsEffect,
	onShareHandout,
	campaignId,
	readOnly,
}: VTTAssetBrowserProps) {
	const { toast } = useToast();
	const { user } = useAuth();
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState<VTTAssetCategory | null>(
		null,
	);
	const [previewAsset, setPreviewAsset] = useState<VTTAsset | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [showRecent, setShowRecent] = useState(false);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const uploadRef = useRef<HTMLInputElement>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	// Debounce search for performance with 400+ assets
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search), 200);
		return () => clearTimeout(timer);
	}, [search]);

	// Reset pagination when filters change
	useEffect(() => {
		setVisibleCount(PAGE_SIZE);
	}, []);

	const allResults = useMemo(
		() => searchAssets(debouncedSearch, activeCategory ?? undefined),
		[debouncedSearch, activeCategory],
	);

	const results = useMemo(
		() => allResults.slice(0, visibleCount),
		[allResults, visibleCount],
	);
	const hasMore = visibleCount < allResults.length;

	const recentAssets = useMemo(() => {
		const ids = getRecentAssetIds();
		return ids
			.map((id) => getVTTAssetLibrary().find((a) => a.id === id))
			.filter(Boolean) as VTTAsset[];
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const trackAndPreview = useCallback((asset: VTTAsset) => {
		setPreviewAsset((prev) => (prev?.id === asset.id ? null : asset));
	}, []);

	const handleUseAsset = useCallback(
		(asset: VTTAsset, action: "map" | "token" | "effect" | "handout") => {
			addRecentAssetId(asset.id);
			setShowRecent(false);
			if (action === "map") onUseAsMap?.(asset.imageUrl, asset.name);
			else if (action === "token") onUseAsToken?.(asset.imageUrl, asset.name);
			else if (action === "effect") onUseAsEffect?.(asset.imageUrl, asset.name);
			else if (action === "handout")
				onShareHandout?.(asset.imageUrl, asset.name);
			setPreviewAsset(null);
		},
		[onUseAsMap, onUseAsToken, onUseAsEffect, onShareHandout],
	);

	// Drag start handler for drag-drop onto map
	const handleDragStart = useCallback((e: React.DragEvent, asset: VTTAsset) => {
		e.dataTransfer.setData(
			"application/vtt-asset",
			JSON.stringify({
				imageUrl: asset.imageUrl,
				name: asset.name,
				category: asset.category,
			}),
		);
		e.dataTransfer.effectAllowed = "copy";
	}, []);

	const handleUpload = useCallback(
		async (file: File, usage: "map" | "token") => {
			if (!file.type.startsWith("image/")) {
				toast({
					title: "Invalid file",
					description: "Please upload an image file.",
					variant: "destructive",
				});
				return;
			}

			setIsUploading(true);
			try {
				let publicUrl = "";
				if (isSupabaseConfigured && user?.id) {
					const maxSize = usage === "map" ? 4096 : 512;
					const compressed = await compressImage(file, {
						maxWidth: maxSize,
						maxHeight: maxSize,
						quality: usage === "map" ? 0.85 : 0.8,
						format: "webp",
					});
					const folder = usage === "map" ? "maps" : "tokens";
					const fileName = `vtt/${folder}/${campaignId || "global"}/${usage}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
					const { error: uploadError } = await supabase.storage
						.from("compendium-images")
						.upload(fileName, compressed, {
							cacheControl: "3600",
							upsert: false,
							contentType: "image/webp",
						});
					if (uploadError) throw uploadError;
					const { data } = supabase.storage
						.from("compendium-images")
						.getPublicUrl(fileName);
					publicUrl = data.publicUrl;
				} else {
					publicUrl = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = () => reject(new Error("Failed to read file."));
						reader.readAsDataURL(file);
					});
				}

				const name = file.name.replace(/\.\w+$/, "").replace(/[-_]/g, " ");
				if (usage === "map") {
					onUseAsMap?.(publicUrl, name);
				} else {
					onUseAsToken?.(publicUrl, name);
				}
				toast({
					title: "Uploaded!",
					description: `Image ready to use as ${usage}.`,
				});
			} catch (err) {
				toast({
					title: "Upload failed",
					description: String(err),
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
				if (uploadRef.current) uploadRef.current.value = "";
			}
		},
		[campaignId, onUseAsMap, onUseAsToken, toast, user?.id],
	);

	return (
		<div className="space-y-2">
			{/* Search */}
			<div className="relative">
				<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={`Search ${getVTTAssetLibrary().length} assets...`}
					className="pl-8 text-xs h-8"
				/>
				{search && (
					<button
						type="button"
						onClick={() => setSearch("")}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						aria-label="Clear search"
					>
						<X className="w-3 h-3" />
					</button>
				)}
			</div>

			{/* Category pills */}
			<div className="flex flex-wrap gap-1">
				<button
					type="button"
					onClick={() => setActiveCategory(null)}
					className={cn(
						"px-2 py-0.5 rounded-full text-[10px] border transition-all",
						!activeCategory
							? "bg-amber-500/20 border-amber-500/50 text-amber-200"
							: "border-border/50 text-muted-foreground hover:bg-muted/30",
					)}
				>
					All ({getVTTAssetLibrary().length})
				</button>
				{getVTTAssetCategories().map((cat) => (
					<button
						type="button"
						key={cat.id}
						onClick={() =>
							setActiveCategory(activeCategory === cat.id ? null : cat.id)
						}
						className={cn(
							"px-2 py-0.5 rounded-full text-[10px] border transition-all flex items-center gap-1",
							activeCategory === cat.id
								? "bg-amber-500/20 border-amber-500/50 text-amber-200"
								: "border-border/50 text-muted-foreground hover:bg-muted/30",
						)}
					>
						{CATEGORY_ICONS[cat.id]}
						{cat.label} ({cat.count})
					</button>
				))}
			</div>

			{/* Recent assets bar */}
			{recentAssets.length > 0 && (
				<div>
					<button
						type="button"
						onClick={() => setShowRecent(!showRecent)}
						className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full"
					>
						<Clock className="w-3 h-3" />
						Recent ({recentAssets.length})
						<ChevronDown
							className={cn(
								"w-3 h-3 ml-auto transition-transform",
								showRecent && "rotate-180",
							)}
						/>
					</button>
					{showRecent && (
						<div className="grid grid-cols-6 gap-1 mt-1">
							{recentAssets.map((asset) => (
								<button
									type="button"
									key={asset.id}
									onClick={() => trackAndPreview(asset)}
									className="rounded border border-border/40 overflow-hidden hover:border-amber-500/50 transition-all"
									title={asset.name}
								>
									<div className="aspect-square bg-muted/20 overflow-hidden">
										<OptimizedImage
											src={asset.thumbnailUrl || asset.imageUrl}
											alt={asset.name}
											className="w-full h-full object-cover"
											size="thumbnail"
										/>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}

			{/* Upload section */}
			{!readOnly && (
				<div className="flex gap-1.5">
					<input
						ref={uploadRef}
						type="file"
						accept="image/*"
						className="hidden"
						title="Upload image"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleUpload(file, "map");
						}}
					/>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-[10px] h-7"
						onClick={() => {
							if (uploadRef.current) {
								uploadRef.current.onchange = (e) => {
									const file = (e.target as HTMLInputElement).files?.[0];
									if (file) handleUpload(file, "map");
								};
								uploadRef.current.click();
							}
						}}
						disabled={isUploading}
					>
						<Upload className="w-3 h-3 mr-1" />
						Upload Map
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="flex-1 text-[10px] h-7"
						onClick={() => {
							if (uploadRef.current) {
								uploadRef.current.onchange = (e) => {
									const file = (e.target as HTMLInputElement).files?.[0];
									if (file) handleUpload(file, "token");
								};
								uploadRef.current.click();
							}
						}}
						disabled={isUploading}
					>
						<Upload className="w-3 h-3 mr-1" />
						Upload Token
					</Button>
				</div>
			)}

			{/* Results count */}
			<div className="text-[10px] text-muted-foreground px-1">
				{allResults.length} asset{allResults.length !== 1 ? "s" : ""} found
				{activeCategory &&
					` in ${getVTTAssetCategories().find((c) => c.id === activeCategory)?.label}`}
				{hasMore && ` (showing ${results.length})`}
			</div>

			{/* Thumbnail grid */}
			<div
				ref={gridRef}
				className="grid grid-cols-3 gap-1.5 max-h-[400px] overflow-y-auto pr-0.5"
			>
				{results.map((asset) => (
					<button
						type="button"
						key={asset.id}
						onClick={() => trackAndPreview(asset)}
						draggable
						onDragStart={(e) => handleDragStart(e, asset)}
						className={cn(
							"rounded border overflow-hidden transition-all group relative cursor-grab active:cursor-grabbing",
							previewAsset?.id === asset.id
								? "border-amber-500 ring-1 ring-amber-500/30"
								: "border-border/40 hover:border-border",
						)}
					>
						<div className="aspect-square bg-muted/20 relative overflow-hidden">
							<OptimizedImage
								src={asset.thumbnailUrl || asset.imageUrl}
								alt={asset.name}
								className="w-full h-full object-cover group-hover:scale-105 transition-transform"
								size="thumbnail"
							/>
							<div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
								<GripVertical className="w-3 h-3 text-white drop-shadow-lg" />
							</div>
							<div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="text-[8px] text-white/80">
									{CATEGORY_ICONS[asset.category]}
								</span>
							</div>
						</div>
						<div className="p-1 bg-background/80">
							<div className="text-[9px] truncate font-medium">
								{asset.name}
							</div>
							{asset.rank && (
								<Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">
									{asset.rank}
								</Badge>
							)}
						</div>
					</button>
				))}
				{results.length === 0 && (
					<div className="col-span-3 py-8 text-center text-xs text-muted-foreground">
						No assets match your search.
					</div>
				)}
			</div>

			{/* Load more button */}
			{hasMore && (
				<Button
					variant="ghost"
					size="sm"
					className="w-full text-[10px] h-7 text-muted-foreground"
					onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
				>
					<ChevronDown className="w-3 h-3 mr-1" />
					Show more ({allResults.length - visibleCount} remaining)
				</Button>
			)}

			{/* Preview / action panel */}
			{previewAsset && (
				<SystemWindow title={previewAsset.name} compact>
					<div className="space-y-2">
						<div className="rounded overflow-hidden border border-border/40 max-h-48">
							<OptimizedImage
								src={previewAsset.imageUrl}
								alt={previewAsset.name}
								className="w-full h-full object-contain"
								size="medium"
							/>
						</div>
						{previewAsset.description && (
							<p className="text-[10px] text-muted-foreground line-clamp-2">
								{previewAsset.description}
							</p>
						)}
						<div className="flex flex-wrap gap-1">
							{previewAsset.tags.map((tag) => (
								<span
									key={tag}
									className="text-[8px] px-1.5 py-0.5 rounded-full bg-muted/30 border border-border/30 text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
						<div className="flex gap-1.5 flex-wrap">
							{/* Primary actions based on category */}
							{(previewAsset.category === "map" ||
								previewAsset.category === "location") &&
								onUseAsMap && (
									<Button
										variant="default"
										size="sm"
										className="flex-1 text-[10px] h-7"
										onClick={() => handleUseAsset(previewAsset, "map")}
									>
										<MapPin className="w-3 h-3 mr-1" /> Use as Map
									</Button>
								)}
							{(previewAsset.category === "Anomaly" ||
								previewAsset.category === "token" ||
								previewAsset.category === "portrait") &&
								onUseAsToken && (
									<Button
										variant="default"
										size="sm"
										className="flex-1 text-[10px] h-7"
										onClick={() => handleUseAsset(previewAsset, "token")}
									>
										<Image className="w-3 h-3 mr-1" /> Place Token
									</Button>
								)}
							{(previewAsset.category === "effect" ||
								previewAsset.category === "condition" ||
								previewAsset.category === "technique") &&
								onUseAsEffect && (
									<Button
										variant="default"
										size="sm"
										className="flex-1 text-[10px] h-7"
										onClick={() => handleUseAsset(previewAsset, "effect")}
									>
										<Sparkles className="w-3 h-3 mr-1" /> Place Effect
									</Button>
								)}
							{previewAsset.category === "prop" && onUseAsEffect && (
								<Button
									variant="default"
									size="sm"
									className="flex-1 text-[10px] h-7"
									onClick={() => handleUseAsset(previewAsset, "effect")}
								>
									<Box className="w-3 h-3 mr-1" /> Place Prop
								</Button>
							)}
							{previewAsset.category === "spell" && onUseAsEffect && (
								<Button
									variant="default"
									size="sm"
									className="flex-1 text-[10px] h-7"
									onClick={() => handleUseAsset(previewAsset, "effect")}
								>
									<Wand2 className="w-3 h-3 mr-1" /> Place Spell
								</Button>
							)}
							{previewAsset.category === "item" && onUseAsToken && (
								<Button
									variant="default"
									size="sm"
									className="flex-1 text-[10px] h-7"
									onClick={() => handleUseAsset(previewAsset, "token")}
								>
									<Swords className="w-3 h-3 mr-1" /> Place Item
								</Button>
							)}
							{previewAsset.category === "handout" && onShareHandout && (
								<Button
									variant="default"
									size="sm"
									className="flex-1 text-[10px] h-7"
									onClick={() => handleUseAsset(previewAsset, "handout")}
								>
									<BookOpen className="w-3 h-3 mr-1" /> Share Handout
								</Button>
							)}

							{/* Secondary actions — any asset can be used as map or token */}
							{previewAsset.category !== "map" &&
								previewAsset.category !== "location" &&
								onUseAsMap && (
									<Button
										variant="outline"
										size="sm"
										className="text-[10px] h-7 px-2"
										onClick={() => handleUseAsset(previewAsset, "map")}
										title="Use as map background"
									>
										<MapPin className="w-3 h-3" />
									</Button>
								)}
							{previewAsset.category !== "Anomaly" &&
								previewAsset.category !== "token" &&
								previewAsset.category !== "portrait" &&
								onUseAsToken && (
									<Button
										variant="outline"
										size="sm"
										className="text-[10px] h-7 px-2"
										onClick={() => handleUseAsset(previewAsset, "token")}
										title="Place as token"
									>
										<Image className="w-3 h-3" />
									</Button>
								)}
							{previewAsset.category !== "effect" &&
								previewAsset.category !== "condition" &&
								previewAsset.category !== "technique" &&
								previewAsset.category !== "spell" &&
								previewAsset.category !== "prop" &&
								onUseAsEffect && (
									<Button
										variant="outline"
										size="sm"
										className="text-[10px] h-7 px-2"
										onClick={() => handleUseAsset(previewAsset, "effect")}
										title="Place as effect overlay"
									>
										<Sparkles className="w-3 h-3" />
									</Button>
								)}
							{onShareHandout && previewAsset.category !== "handout" && (
								<Button
									variant="outline"
									size="sm"
									className="text-[10px] h-7 px-2"
									onClick={() => handleUseAsset(previewAsset, "handout")}
									title="Share as handout"
								>
									<BookOpen className="w-3 h-3" />
								</Button>
							)}
						</div>
					</div>
				</SystemWindow>
			)}
		</div>
	);
}
