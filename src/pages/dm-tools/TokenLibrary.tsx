import {
	ArrowLeft,
	Download,
	ImageIcon,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DynamicStyle } from "@/components/ui/DynamicStyle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
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
import {
	DEFAULT_TOKENS,
	type LibraryToken,
	mergeBaseTokens,
	normalizeLibraryTokens,
	type TokenCategory,
	type TokenType,
} from "@/data/tokenLibraryDefaults";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { supabase } from "@/integrations/supabase/client";
import { error as logError } from "@/lib/logger";
import { cn } from "@/lib/utils";

type Token = LibraryToken;

const TOKEN_CATEGORIES = [
	{ value: "all", label: "All", icon: ImageIcon },
	{ value: "custom", label: "Custom", icon: Plus },
	{ value: "monster", label: "Monsters", icon: Trash2 },
	{ value: "npc", label: "NPCs", icon: ImageIcon },
	{ value: "object", label: "Objects", icon: ImageIcon },
	{ value: "effect", label: "Effects", icon: ImageIcon },
];

const TokenLibrary = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const [isCreating, setIsCreating] = useState(false);
	const [_imagePreview, setImagePreview] = useState<string | null>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const {
		state: storedTokens,
		isLoading: tokensLoading,
		saveNow: saveTokenLibrary,
	} = useUserToolState<Token[]>("token_library", {
		initialState: DEFAULT_TOKENS,
		storageKey: "vtt-tokens",
	});

	const [tokens, setTokens] = useState<Token[]>([]);
	const [selectedToken, setSelectedToken] = useState<Token | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isHydrating, setIsHydrating] = useState(true);
	const [newToken, setNewToken] = useState<Partial<Token>>({
		name: "",
		type: "custom" as TokenType,
		category: "other" as TokenCategory,
		size: "medium",
		tags: [],
	});

	const normalizedMergedTokens = useMemo(() => {
		const normalized = normalizeLibraryTokens(
			Array.isArray(storedTokens) ? storedTokens : [],
		);
		const sourceTokens = normalized.length > 0 ? normalized : DEFAULT_TOKENS;
		return mergeBaseTokens(sourceTokens);
	}, [storedTokens]);

	useEffect(() => {
		if (tokensLoading) return;
		setTokens(normalizedMergedTokens);
		setIsHydrating(false);
		if (normalizedMergedTokens !== storedTokens) {
			void saveTokenLibrary(normalizedMergedTokens);
		}
	}, [normalizedMergedTokens, saveTokenLibrary, storedTokens, tokensLoading]);

	const debouncedTokens = useDebounce(tokens, 400);

	useEffect(() => {
		if (tokensLoading) return;
		if (isHydrating) return;
		void saveTokenLibrary(debouncedTokens);
	}, [debouncedTokens, isHydrating, saveTokenLibrary, tokensLoading]);

	const _handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// setUploading(true);

		try {
			// Create image preview
			const reader = new FileReader();
			reader.onload = (event) => {
				const result = event.target?.result as string;
				setImagePreview(result);
			};
			reader.readAsDataURL(file);

			// Compress image
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				// Set max dimensions
				const maxSize = 256;
				const aspectRatio = img.width / img.height;
				let width = maxSize;
				let height = maxSize;

				if (img.width > img.height) {
					height = Math.round(maxSize / aspectRatio);
				} else {
					width = Math.round(maxSize * aspectRatio);
				}

				canvas.width = width;
				canvas.height = height;
				ctx?.drawImage(img, 0, 0, width, height);

				// Convert to webp
				canvas.toBlob(
					async (blob) => {
						if (!blob) return;

						// Generate unique filename with .webp extension
						const fileName = `token-${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
						const filePath = `tokens/${fileName}`;

						// Upload compressed image to Supabase Storage
						const { error: uploadError } = await supabase.storage
							.from("custom-tokens")
							.upload(filePath, blob, {
								cacheControl: "3600",
								upsert: false,
								contentType: "image/webp",
							});

						if (uploadError) throw uploadError;

						// Get public URL
						const {
							data: { publicUrl },
						} = supabase.storage.from("custom-tokens").getPublicUrl(filePath);

						// Update newToken with image URL
						setNewToken((prev: Partial<Token>) => ({
							...prev,
							imageUrl: publicUrl,
						}));

						toast({
							title: "Image uploaded",
							description: "Token image has been uploaded successfully.",
						});
					},
					"image/webp",
					0.8,
				);
			};
			img.src = URL.createObjectURL(file);
		} catch (error) {
			logError("Failed to process image:", error);
			toast({
				title: "Upload failed",
				description: "Could not upload image. Please try again.",
				variant: "destructive",
			});
		} finally {
			// setUploading(false);
		}
	};

	const _handleRemoveImage = () => {
		setImagePreview(null);
		setNewToken((prev: Partial<Token>) => ({ ...prev, imageUrl: undefined }));
		if (imageInputRef.current) {
			imageInputRef.current.value = "";
		}
	};

	const handleCreateToken = () => {
		const resolvedName = (
			newToken.name ||
			nameInputRef.current?.value ||
			""
		).trim();
		if (!resolvedName) {
			toast({
				title: "Error",
				description: "Please enter a token name.",
				variant: "destructive",
			});
			return;
		}

		const token: Token = {
			id: `token-${Date.now()}`,
			name: resolvedName,
			type: newToken.type || "custom",
			category: newToken.category || "other",
			size: newToken.size || "medium",
			emoji: newToken.emoji,
			color: newToken.color,
			imageUrl: newToken.imageUrl,
			tags: newToken.tags || [],
			notes: newToken.notes,
			createdAt: new Date().toISOString(),
		};

		const nextTokens = [...tokens, token];
		setTokens(nextTokens);
		setSelectedToken(token);
		setSelectedCategory(token.category);
		setSearchQuery(token.name);
		setIsCreating(false);
		setImagePreview(null);
		setNewToken({
			name: "",
			type: "custom" as TokenType,
			category: "other" as TokenCategory,
			size: "medium",
			tags: [],
		});
		if (imageInputRef.current) {
			imageInputRef.current.value = "";
		}

		toast({
			title: "Created!",
			description: "Token created successfully.",
		});
	};

	const handleDeleteToken = (id: string) => {
		const updated = tokens.filter((t) => t.id !== id);
		setTokens(updated);
		if (selectedToken?.id === id) {
			setSelectedToken(null);
		}
		toast({
			title: "Deleted!",
			description: "Token deleted.",
		});
	};

	const handleExport = () => {
		const blob = new Blob([JSON.stringify(tokens, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `vtt-tokens-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);

		toast({
			title: "Exported!",
			description: "Token library exported.",
		});
	};

	const handleTokenKeyDown = (token: Token, e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setSelectedToken(token);
		}
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const imported = JSON.parse(e.target?.result as string);
				if (Array.isArray(imported)) {
					const nextTokens = [...tokens, ...imported];
					setTokens(nextTokens);
					toast({
						title: "Imported!",
						description: `${imported.length} tokens imported.`,
					});
				}
			} catch {
				toast({
					title: "Error",
					description: "Invalid file format.",
					variant: "destructive",
				});
			}
		};
		reader.readAsText(file);
	};

	const filteredTokens = tokens.filter((token) => {
		const matchesSearch =
			!searchQuery ||
			token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			token.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		const matchesCategory =
			selectedCategory === "all" || token.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const getCategoryIcon = (category: string) => {
		const cat = TOKEN_CATEGORIES.find((c) => c.value === category);
		return cat?.icon || ImageIcon;
	};

	const getCategoryLabel = (category: string) => {
		const cat = TOKEN_CATEGORIES.find((c) => c.value === category);
		return cat?.label || category;
	};

	if (isHydrating) {
		return (
			<Layout>
				<div className="container mx-auto px-4 py-8 max-w-7xl">
					<SystemWindow title="LOADING TOKEN LIBRARY">
						<SystemText className="block text-sm text-muted-foreground">
							Loading tokens and settings...
						</SystemText>
					</SystemWindow>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Entity Manifestation
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Manage physical representations for dimensional anomalies and allied
						entities within localized fields. Create custom manifestations,
						categorize parameters, and sync local records.
					</DataStreamText>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-1 space-y-6">
						<SystemWindow title="SEARCH & FILTER">
							<div className="space-y-4">
								<div>
									<Label htmlFor="search">Search Tokens</Label>
									<div className="relative">
										<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="search"
											value={searchQuery || ""}
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search tokens..."
											className="pl-8"
										/>
									</div>
								</div>
							</div>
						</SystemWindow>
					</div>

					<div className="lg:col-span-1 space-y-6">
						{isCreating ? (
							<SystemWindow title="CREATE TOKEN" id="token-create-window">
								<div className="space-y-4">
									<div>
										<Label htmlFor="token-name">Token Name</Label>
										<Input
											id="token-name"
											ref={nameInputRef}
											value={newToken.name || ""}
											onChange={(e) =>
												setNewToken((prev: Partial<Token>) => ({
													...prev,
													name: e.target.value,
												}))
											}
											placeholder="Token name"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="token-type">Type</Label>
											<Select
												value={newToken.type}
												onValueChange={(value) =>
													setNewToken((prev: Partial<Token>) => ({
														...prev,
														type: value as Token["type"],
													}))
												}
											>
												<SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
													<SelectValue placeholder="Select type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="custom">Custom</SelectItem>
													<SelectItem value="monster">Monster</SelectItem>
													<SelectItem value="npc">NPC</SelectItem>
													<SelectItem value="object">Object</SelectItem>
													<SelectItem value="effect">Effect</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="token-category">Category</Label>
											<Select
												value={newToken.category}
												onValueChange={(value) =>
													setNewToken((prev: Partial<Token>) => ({
														...prev,
														category: value as Token["category"],
													}))
												}
											>
												<SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{TOKEN_CATEGORIES.map((cat) => (
														<SelectItem key={cat.value} value={cat.value}>
															{cat.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="token-size">Size</Label>
											<Select
												value={newToken.size}
												onValueChange={(value) =>
													setNewToken((prev: Partial<Token>) => ({
														...prev,
														size: value as Token["size"],
													}))
												}
											>
												<SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
													<SelectValue placeholder="Select size" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="tiny">Tiny</SelectItem>
													<SelectItem value="small">Small</SelectItem>
													<SelectItem value="medium">Medium</SelectItem>
													<SelectItem value="large">Large</SelectItem>
													<SelectItem value="huge">Huge</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="token-emoji">Emoji/Icon</Label>
											<Input
												id="token-emoji"
												value={newToken.emoji || ""}
												onChange={(e) =>
													setNewToken((prev: Partial<Token>) => ({
														...prev,
														emoji: e.target.value,
													}))
												}
												placeholder="🗡️"
												maxLength={2}
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="token-color">Color (hex)</Label>
										<Input
											id="token-color"
											type="color"
											value={newToken.color || "#3b82f6"}
											onChange={(e) =>
												setNewToken((prev: Partial<Token>) => ({
													...prev,
													color: e.target.value,
												}))
											}
											className="h-10 w-full"
										/>
									</div>
									<div className="flex gap-2">
										<Button onClick={handleCreateToken} className="flex-1">
											<Plus className="w-4 h-4 mr-2" />
											Create Token
										</Button>
										<Button
											onClick={() => {
												setIsCreating(false);
												setNewToken({
													name: "",
													type: "custom" as TokenType,
													category: "other" as TokenCategory,
													size: "medium",
													tags: [],
												});
											}}
											variant="outline"
										>
											Cancel
										</Button>
									</div>
								</div>
							</SystemWindow>
						) : (
							<>
								<SystemWindow
									title={`TOKENS (${filteredTokens.length})`}
									id="token-list-window"
								>
									{filteredTokens.length === 0 ? (
										<div className="text-center py-12">
											<ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
											<SystemText className="block text-muted-foreground font-heading mb-4">
												No tokens found.{" "}
												{searchQuery
													? "Try a different search."
													: "Create your first token!"}
											</SystemText>
										</div>
									) : (
										<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
											{filteredTokens.map((token) => {
												const CategoryIcon = getCategoryIcon(token.category);
												const isSelected =
													!!selectedToken && selectedToken.id === token.id;

												return (
													<button
														type="button"
														key={token.id}
														className={cn(
															"w-full text-left p-4 rounded-lg border border-border bg-background/50 hover:bg-muted/50 transition-all cursor-pointer group",
															isSelected && "ring-2 ring-primary",
														)}
														data-token-name={token.name}
														data-selected={isSelected || undefined}
														aria-label={`Token ${token.name}`}
														aria-current={isSelected ? "true" : undefined}
														onClick={() => setSelectedToken(token)}
														onKeyDown={(e: React.KeyboardEvent) =>
															handleTokenKeyDown(token, e)
														}
													>
														<div className="flex flex-col items-center gap-3">
															<DynamicStyle
																className={cn(
																	"token-display",
																	`token-display-${token.size}`,
																	token.color
																		? `border-[${token.color}]`
																		: "border-border",
																)}
																vars={{
																	backgroundColor: token.color
																		? `${token.color}20`
																		: undefined,
																}}
															>
																{token.imageUrl ? (
																	<OptimizedImage
																		src={token.imageUrl}
																		alt={token.name}
																		className="w-full h-full object-cover rounded-full"
																		size="small"
																	/>
																) : (
																	token.emoji || "TK"
																)}
															</DynamicStyle>
															<div className="text-center w-full">
																<div className="font-heading font-semibold text-sm mb-1 truncate">
																	{token.name}
																</div>
																<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
																	<CategoryIcon className="w-3 h-3" />
																	<Badge variant="outline" className="text-xs">
																		{token.size}
																	</Badge>
																	<Badge variant="outline">
																		{getCategoryLabel(token.category)}
																	</Badge>
																	<Badge variant="outline">{token.type}</Badge>
																</div>
															</div>
														</div>
														<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
															<Button
																variant="ghost"
																size="sm"
																onClick={(e) => {
																	e.stopPropagation();
																	handleDeleteToken(token.id);
																}}
															>
																<Trash2 className="w-3 h-3" />
															</Button>
														</div>
													</button>
												);
											})}
										</div>
									)}
								</SystemWindow>

								{selectedToken && (
									<SystemWindow title="TOKEN DETAILS" id="token-details-window">
										<div className="space-y-4">
											<div className="flex items-start justify-between">
												<div className="flex items-center gap-4">
													<DynamicStyle
														className={cn(
															"token-detail-display",
															`token-detail-display-${selectedToken.size}`,
															selectedToken.color
																? `border-[${selectedToken.color}]`
																: "border-border",
														)}
														vars={{
															backgroundColor: selectedToken.color
																? `${selectedToken.color}20`
																: undefined,
														}}
													>
														{selectedToken.imageUrl ? (
															<OptimizedImage
																src={selectedToken.imageUrl}
																alt={selectedToken.name}
																className="w-full h-full object-cover rounded-full"
																size="small"
															/>
														) : (
															selectedToken.emoji || "TK"
														)}
													</DynamicStyle>
													<div>
														<h3 className="font-heading font-semibold text-xl">
															{selectedToken.name}
														</h3>
														<div className="flex items-center gap-2 mt-1">
															<Badge variant="outline">
																{selectedToken.type}
															</Badge>
															<Badge variant="outline">
																{getCategoryLabel(selectedToken.category)}
															</Badge>
															<Badge variant="outline">
																{selectedToken.size}
															</Badge>
														</div>
													</div>
												</div>
												<Button
													variant="ghost"
													onClick={() => setSelectedToken(null)}
												>
													Close
												</Button>
											</div>

											{selectedToken.tags.length > 0 && (
												<div>
													<Label>Tags</Label>
													<div className="flex flex-wrap gap-2 mt-2">
														{selectedToken.tags.map((tag) => (
															<Badge key={`tag-${tag}`} variant="secondary">
																{tag}
															</Badge>
														))}
													</div>
												</div>
											)}

											{selectedToken.notes && (
												<div>
													<Label>Notes</Label>
													<SystemText className="block text-sm text-muted-foreground mt-1">
														{selectedToken.notes}
													</SystemText>
												</div>
											)}

											<div className="text-xs text-muted-foreground">
												Created:{" "}
												{new Date(selectedToken.createdAt).toLocaleDateString()}
											</div>
										</div>
									</SystemWindow>
								)}
							</>
						)}
					</div>

					<div className="lg:col-span-1 space-y-6">
						<SystemWindow title="LIBRARY ACTIONS" variant="quest">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
								<Button onClick={handleExport} variant="outline" size="sm">
									<Download className="w-4 h-4 mr-2" />
									Export Library
								</Button>
								<label className="w-full" aria-label="Import token library">
									<input type="file" accept=".json" onChange={handleImport} />
								</label>
							</div>
						</SystemWindow>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default TokenLibrary;
