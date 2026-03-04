import {
	Download,
	Edit,
	Package,
	Plus,
	Save,
	Search,
	Star,
	Trash2,
	Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
	type MarketplaceItemRecord,
	type MarketplaceItemType,
	type MarketplacePriceType,
	useDeleteMarketplaceItem,
	useMarketplaceItems,
	useRecordMarketplaceDownload,
	useSaveMarketplaceItem,
	useUpsertMarketplaceReview,
} from "@/hooks/useMarketplaceData";
import { useAuth } from "@/lib/auth/authContext";

const ITEM_TYPES: MarketplaceItemType[] = [
	"campaign",
	"character",
	"item",
	"map",
	"module",
	"template",
];

const PRICE_TYPES: MarketplacePriceType[] = ["free", "paid", "donation"];

export function MarketplaceWorkbench() {
	const { user } = useAuth();
	const { toast } = useToast();

	const [scope, setScope] = useState<"listed" | "mine" | "all">("listed");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState<MarketplaceItemType | "all">(
		"all",
	);

	const [tab, setTab] = useState<"browse" | "publish">("browse");
	const [editingId, setEditingId] = useState<string | null>(null);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [itemType, setItemType] = useState<MarketplaceItemType>("campaign");
	const [category, setCategory] = useState("General");
	const [tagsText, setTagsText] = useState("");
	const [priceType, setPriceType] = useState<MarketplacePriceType>("free");
	const [priceAmount, setPriceAmount] = useState("");
	const [priceCurrency, setPriceCurrency] = useState("USD");
	const [license, setLicense] = useState("Custom");
	const [fileUrl, setFileUrl] = useState("");
	const [contentJson, setContentJson] = useState('{\n  "summary": ""\n}');
	const [isListed, setIsListed] = useState(true);

	const [ratingByItem, setRatingByItem] = useState<Record<string, number>>({});
	const [commentByItem, setCommentByItem] = useState<Record<string, string>>(
		{},
	);
	const {
		data: items = [],
		isLoading,
		error,
	} = useMarketplaceItems({
		scope,
		search,
		itemType: typeFilter === "all" ? null : typeFilter,
	});

	const saveItem = useSaveMarketplaceItem();
	const deleteItem = useDeleteMarketplaceItem();
	const recordDownload = useRecordMarketplaceDownload();
	const submitReview = useUpsertMarketplaceReview();

	const resetForm = () => {
		setEditingId(null);
		setTitle("");
		setDescription("");
		setItemType("campaign");
		setCategory("General");
		setTagsText("");
		setPriceType("free");
		setPriceAmount("");
		setPriceCurrency("USD");
		setLicense("Custom");
		setFileUrl("");
		setContentJson('{\n  "summary": ""\n}');
		setIsListed(true);
	};

	const loadForEdit = (item: MarketplaceItemRecord) => {
		setEditingId(item.id);
		setTitle(item.title);
		setDescription(item.description);
		setItemType(item.item_type);
		setCategory(item.category || "General");
		setTagsText(item.tags.join(", "));
		setPriceType(item.price_type);
		setPriceAmount(item.price_amount !== null ? String(item.price_amount) : "");
		setPriceCurrency(item.price_currency || "USD");
		setLicense(item.license || "Custom");
		setFileUrl(item.file_url || "");
		setContentJson(JSON.stringify(item.content || {}, null, 2));
		setIsListed(item.is_listed);
		setTab("publish");
	};

	const parsedTags = useMemo(
		() =>
			tagsText
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag, index, all) => tag && all.indexOf(tag) === index),
		[tagsText],
	);

	const handleSubmit = async () => {
		if (!title.trim() || !description.trim()) {
			toast({
				title: "Missing required fields",
				description: "Title and description are required to publish.",
				variant: "destructive",
			});
			return;
		}

		let parsedContent: Record<string, unknown>;
		try {
			const value = JSON.parse(contentJson);
			if (typeof value !== "object" || value === null || Array.isArray(value)) {
				throw new Error("Content payload must be a JSON object.");
			}
			parsedContent = value as Record<string, unknown>;
		} catch (error) {
			toast({
				title: "Invalid content JSON",
				description:
					error instanceof Error
						? error.message
						: "Could not parse content JSON.",
				variant: "destructive",
			});
			return;
		}

		await saveItem.mutateAsync({
			id: editingId ?? undefined,
			title,
			description,
			itemType,
			category,
			tags: parsedTags,
			priceType,
			priceAmount: priceType === "paid" ? Number(priceAmount || 0) : null,
			priceCurrency,
			license,
			fileUrl: fileUrl.trim() || null,
			content: parsedContent,
			isListed,
		});

		if (!editingId) {
			resetForm();
		}
	};

	const handleDelete = async (itemId: string) => {
		await deleteItem.mutateAsync({ id: itemId });
		if (editingId === itemId) {
			resetForm();
		}
	};

	const proceedDownload = async (item: MarketplaceItemRecord) => {
		await recordDownload.mutateAsync({ itemId: item.id });
		if (item.file_url) {
			window.open(item.file_url, "_blank", "noopener,noreferrer");
		} else {
			toast({
				title: "Download recorded",
				description: "No file URL is attached to this listing yet.",
			});
		}
	};

	const handleDownload = async (item: MarketplaceItemRecord) => {
		if (!item.has_access) {
			toast({
				title: "Access required",
				description: "You do not currently have entitlement to this listing.",
				variant: "destructive",
			});
			return;
		}

		await proceedDownload(item);
	};

	const handleImportToCompendium = (item: MarketplaceItemRecord) => {
		if (!item.has_access && item.price_type !== "free") {
			toast({
				title: "Access required",
				description: "You do not currently have entitlement to this listing.",
				variant: "destructive",
			});
			return;
		}

		try {
			const saved = localStorage.getItem("sa_homebrew_content");
			const homebrewList = saved ? JSON.parse(saved) : [];
			let mappedType = "job";
			if (item.tags?.includes("path")) mappedType = "path";
			if (item.tags?.includes("relic") || item.item_type === "item")
				mappedType = "relic";

			homebrewList.push({
				id: item.id || crypto.randomUUID(),
				name: item.title,
				type: mappedType,
				description: item.description,
				data: item.content,
				isPublic: false,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});

			localStorage.setItem("sa_homebrew_content", JSON.stringify(homebrewList));
			toast({
				title: "Imported to Compendium",
				description: `${item.title} has been added to your Homebrew collection.`,
			});
		} catch (_e) {
			toast({
				title: "Import Failed",
				description: "Failed to import to Compendium.",
				variant: "destructive",
			});
		}
	};

	const handleReview = async (itemId: string) => {
		const rating = Math.min(Math.max(ratingByItem[itemId] || 5, 1), 5);
		const comment = commentByItem[itemId]?.trim();

		await submitReview.mutateAsync({
			itemId,
			rating,
			comment: comment || undefined,
		});
	};

	return (
		<Tabs
			value={tab}
			onValueChange={(value) => setTab(value as "browse" | "publish")}
			className="space-y-4"
		>
			<TabsList>
				<TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
				<TabsTrigger value="publish">Publish / Manage Listing</TabsTrigger>
			</TabsList>

			<TabsContent value="browse" className="space-y-4">
				<SystemWindow title="MARKETPLACE BROWSE">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
						<div>
							<Label htmlFor="market-scope">Scope</Label>
							<Select
								value={scope}
								onValueChange={(value) =>
									setScope(value as "listed" | "mine" | "all")
								}
							>
								<SelectTrigger id="market-scope">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="listed">Public Listings</SelectItem>
									<SelectItem value="mine">My Listings</SelectItem>
									<SelectItem value="all">All Accessible</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="market-type">Type</Label>
							<Select
								value={typeFilter}
								onValueChange={(value) =>
									setTypeFilter(value as MarketplaceItemType | "all")
								}
							>
								<SelectTrigger id="market-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									{ITEM_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="md:col-span-2">
							<Label htmlFor="market-search">Search</Label>
							<div className="relative">
								<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									id="market-search"
									className="pl-8"
									placeholder="Search marketplace listings"
									value={search}
									onChange={(event) => setSearch(event.target.value)}
								/>
							</div>
						</div>
					</div>

					{error instanceof Error && (
						<p className="mt-4 text-sm text-destructive">{error.message}</p>
					)}
				</SystemWindow>

				<SystemWindow title="LISTINGS">
					{isLoading ? (
						<p className="text-sm text-muted-foreground">
							Loading marketplace...
						</p>
					) : items.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No listings matched your filters.
						</p>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{items.map((item) => {
								const isOwner = user?.id === item.author_id;
								return (
									<div
										key={item.id}
										className="rounded-lg border border-border bg-muted/30 p-4"
									>
										<div className="flex items-start justify-between gap-2">
											<div>
												<p className="font-heading text-lg font-semibold">
													{item.title}
												</p>
												<p className="text-xs text-muted-foreground">
													{item.item_type} · {item.category}
												</p>
											</div>
											<div className="text-right">
												<p className="text-xs text-muted-foreground">Rating</p>
												<p className="font-semibold">
													{item.rating_avg.toFixed(2)} ({item.rating_count})
												</p>
											</div>
										</div>

										<p className="mt-2 text-sm text-muted-foreground">
											{item.description}
										</p>

										<div className="mt-3 flex flex-wrap gap-2">
											<Badge
												variant={
													item.price_type === "free" ? "secondary" : "outline"
												}
											>
												{item.price_type === "paid"
													? `${item.price_currency || "USD"} ${item.price_amount || 0}`
													: item.price_type}
											</Badge>
											<Badge variant={item.is_listed ? "default" : "outline"}>
												{item.is_listed ? "listed" : "unlisted"}
											</Badge>
											{item.is_verified && <Badge>verified</Badge>}
											{!item.has_access && (
												<Badge variant="destructive">locked</Badge>
											)}
										</div>

										{item.tags.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-1">
												{item.tags.map((tag) => (
													<Badge
														key={tag}
														variant="outline"
														className="text-[10px]"
													>
														{tag}
													</Badge>
												))}
											</div>
										)}

										<div className="mt-4 flex flex-wrap gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => handleDownload(item)}
												disabled={recordDownload.isPending}
											>
												<Download className="w-4 h-4 mr-2" />
												Download
											</Button>
											<Button
												size="sm"
												variant="default"
												onClick={() => handleImportToCompendium(item)}
											>
												<Plus className="w-4 h-4 mr-2" />
												Add to Compendium
											</Button>
											{isOwner && (
												<>
													<Button
														size="sm"
														variant="outline"
														onClick={() => loadForEdit(item)}
													>
														<Edit className="w-4 h-4 mr-2" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() => handleDelete(item.id)}
														disabled={deleteItem.isPending}
													>
														<Trash2 className="w-4 h-4 mr-2" />
														Delete
													</Button>
												</>
											)}
										</div>

										<div className="mt-4 rounded border border-border p-3">
											<p className="text-xs font-semibold text-muted-foreground mb-2">
												Submit Review
											</p>
											<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
												<Select
													value={String(ratingByItem[item.id] || 5)}
													onValueChange={(value) =>
														setRatingByItem((prev) => ({
															...prev,
															[item.id]: Number(value),
														}))
													}
												>
													<SelectTrigger
														aria-label={`Rating for ${item.title}`}
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{[1, 2, 3, 4, 5].map((value) => (
															<SelectItem key={value} value={String(value)}>
																{value} Star{value > 1 ? "s" : ""}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Input
													placeholder="Comment (optional)"
													value={commentByItem[item.id] || ""}
													onChange={(event) =>
														setCommentByItem((prev) => ({
															...prev,
															[item.id]: event.target.value,
														}))
													}
												/>
												<Button
													variant="outline"
													onClick={() => handleReview(item.id)}
													disabled={submitReview.isPending}
												>
													<Star className="w-4 h-4 mr-2" />
													Save Review
												</Button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</SystemWindow>
			</TabsContent>

			<TabsContent value="publish">
				<SystemWindow title="PUBLISH / MANAGE">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<Label htmlFor="publish-title">Title</Label>
							<Input
								id="publish-title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="publish-type">Type</Label>
							<Select
								value={itemType}
								onValueChange={(value) =>
									setItemType(value as MarketplaceItemType)
								}
							>
								<SelectTrigger id="publish-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ITEM_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="md:col-span-2">
							<Label htmlFor="publish-description">Description</Label>
							<Textarea
								id="publish-description"
								rows={3}
								value={description}
								onChange={(event) => setDescription(event.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor="publish-category">Category</Label>
							<Input
								id="publish-category"
								value={category}
								onChange={(event) => setCategory(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="publish-tags">Tags (comma separated)</Label>
							<Input
								id="publish-tags"
								value={tagsText}
								onChange={(event) => setTagsText(event.target.value)}
							/>
						</div>

						<div>
							<Label htmlFor="publish-price-type">Price Type</Label>
							<Select
								value={priceType}
								onValueChange={(value) =>
									setPriceType(value as MarketplacePriceType)
								}
							>
								<SelectTrigger id="publish-price-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PRICE_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{priceType === "paid" && (
							<>
								<div>
									<Label htmlFor="publish-price-amount">Amount</Label>
									<Input
										id="publish-price-amount"
										type="number"
										min={0}
										value={priceAmount}
										onChange={(event) => setPriceAmount(event.target.value)}
									/>
								</div>
								<div>
									<Label htmlFor="publish-price-currency">Currency</Label>
									<Input
										id="publish-price-currency"
										value={priceCurrency}
										onChange={(event) => setPriceCurrency(event.target.value)}
									/>
								</div>
							</>
						)}

						<div>
							<Label htmlFor="publish-license">License</Label>
							<Input
								id="publish-license"
								value={license}
								onChange={(event) => setLicense(event.target.value)}
							/>
						</div>
						<div>
							<Label htmlFor="publish-file-url">File URL</Label>
							<Input
								id="publish-file-url"
								value={fileUrl}
								onChange={(event) => setFileUrl(event.target.value)}
							/>
						</div>

						<div className="md:col-span-2">
							<Label htmlFor="publish-content">Content JSON</Label>
							<Textarea
								id="publish-content"
								rows={10}
								className="font-mono text-xs"
								value={contentJson}
								onChange={(event) => setContentJson(event.target.value)}
							/>
						</div>

						<div className="md:col-span-2 flex items-center justify-between rounded border border-border px-3 py-2">
							<div className="flex items-center gap-2 text-sm">
								<Package className="w-4 h-4 text-muted-foreground" />
								<span>Listing visibility in browse feed</span>
							</div>
							<Select
								value={isListed ? "listed" : "hidden"}
								onValueChange={(value) => setIsListed(value === "listed")}
							>
								<SelectTrigger className="w-28" aria-label="Listing visibility">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="listed">Listed</SelectItem>
									<SelectItem value="hidden">Hidden</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="mt-4 flex flex-wrap gap-2">
						<Button onClick={handleSubmit} disabled={saveItem.isPending}>
							{editingId ? (
								<Edit className="w-4 h-4 mr-2" />
							) : (
								<Upload className="w-4 h-4 mr-2" />
							)}
							{editingId ? "Update Listing" : "Publish Listing"}
						</Button>
						<Button variant="outline" onClick={resetForm}>
							<Save className="w-4 h-4 mr-2" />
							Reset Form
						</Button>
					</div>
				</SystemWindow>
			</TabsContent>
		</Tabs>
	);
}
