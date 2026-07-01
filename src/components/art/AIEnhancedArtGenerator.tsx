/**
 * AI-Enhanced Art Generator Component
 * Integrates AI services for intelligent art generation
 */

import {
	AlertCircle,
	Brain,
	CheckCircle,
	Download,
	FileJson,
	Image as ImageIcon,
	Palette,
	RefreshCw,
	Sparkles,
	Tag,
	Trash2,
	Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AIProviderSettings } from "@/components/ai/AIProviderSettings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { useCampaignToolState, useUserToolState } from "@/hooks/useToolState";
import type { Json } from "@/integrations/supabase/types";
import {
	useAIEnhancement,
	useAIMoodDetection,
	useAIStyleSuggestions,
	useAITagGeneration,
} from "@/lib/ai/hooks";
import { useArtPipeline } from "@/lib/artPipeline/hooks";
import { artPipeline } from "@/lib/artPipeline/service";
import type { ArtAsset, GenerationResult } from "@/lib/artPipeline/types";
import { logger } from "@/lib/logger";
import { downloadJson } from "@/lib/toolExport";
import { cn } from "@/lib/utils";

interface AIEnhancedArtGeneratorProps {
	entityType?: "Anomaly" | "npc" | "item" | "location";
	entityId?: string;
	title?: string;
	onArtGenerated?: (assetId: string, previewUrl?: string) => void;
	onGenerationStart?: () => void;
	onGenerationComplete?: (success: boolean) => void;
	className?: string;
	/** When set, the generation gallery persists to the campaign (shared). */
	campaignId?: string | null;
}

/** One persisted entry in the generation gallery/history. */
interface ArtGalleryEntry {
	id: string;
	prompt: string;
	tags: string[];
	mood: string;
	style: string;
	previewUrl?: string;
	assetId?: string;
	model?: string;
	createdAt: string;
	durationMs?: number;
}

const GALLERY_LIMIT = 24;

const extractModel = (metadata?: Json): string | undefined => {
	if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
		const value = (metadata as Record<string, Json>).model;
		if (typeof value === "string") return value;
	}
	return undefined;
};

const downloadImage = async (url?: string, name = "rift-art") => {
	if (!url) return;
	const safeName =
		name.replace(/[^a-z0-9-_]+/gi, "-").slice(0, 60) || "rift-art";
	try {
		const res = await fetch(url);
		const blob = await res.blob();
		const objectUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = `${safeName}.png`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(objectUrl);
	} catch {
		// Cross-origin or network failure â€” fall back to opening the asset.
		window.open(url, "_blank", "noopener,noreferrer");
	}
};

const pickPreviewUrl = (paths?: Json): string | undefined => {
	if (!paths) return undefined;
	if (Array.isArray(paths)) {
		const url = paths.find(
			(value) => typeof value === "string" && value.startsWith("http"),
		);
		return url as string | undefined;
	}
	if (typeof paths === "object") {
		const values = Object.values(paths as Record<string, Json>);
		const url = values.find(
			(value) => typeof value === "string" && value.startsWith("http"),
		);
		return url as string | undefined;
	}
	return undefined;
};

export function AIEnhancedArtGenerator({
	entityType,
	entityId,
	title,
	onArtGenerated,
	onGenerationStart,
	onGenerationComplete,
	className,
	campaignId,
}: AIEnhancedArtGeneratorProps) {
	const { generateArt, isAvailable: artAvailable } = useArtPipeline();
	const {
		isEnhancing,
		enhancedPrompt,
		enhancement,
		error: enhanceError,
		enhancePrompt,
	} = useAIEnhancement();

	const {
		isGenerating: isGeneratingTags,
		tags: aiTags,
		error: tagsError,
		generateTags,
	} = useAITagGeneration();

	const {
		isDetecting,
		mood: detectedMood,
		error: moodError,
		detectMood,
	} = useAIMoodDetection();

	const {
		isSuggesting,
		suggestions: styleSuggestions,
		error: styleError,
		suggestStyles,
	} = useAIStyleSuggestions();

	const [originalPrompt, setOriginalPrompt] = useState("");
	const [finalPrompt, setFinalPrompt] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [selectedMood, setSelectedMood] = useState("");
	const [selectedStyle, setSelectedStyle] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [generationResult, setGenerationResult] =
		useState<GenerationResult | null>(null);

	// --- Generation gallery / history (persisted; campaign-scoped when selected) ---
	const isCampaignScoped = !!campaignId;
	const galleryUser = useUserToolState<ArtGalleryEntry[]>("art_gallery", {
		initialState: [],
		enabled: !isCampaignScoped,
	});
	const galleryCampaign = useCampaignToolState<ArtGalleryEntry[]>(
		campaignId ?? null,
		"art_gallery",
		{ initialState: [], enabled: isCampaignScoped },
	);
	const {
		state: storedGallery,
		isLoading: galleryLoading,
		saveNow: saveGallery,
	} = isCampaignScoped ? galleryCampaign : galleryUser;
	const [gallery, setGallery] = useState<ArtGalleryEntry[]>([]);
	const galleryContext = campaignId ? `campaign:${campaignId}` : "user";
	const galleryHydratedRef = useRef<string | null>(null);

	useEffect(() => {
		if (galleryLoading) return;
		if (galleryHydratedRef.current === galleryContext) return;
		if (Array.isArray(storedGallery)) setGallery(storedGallery);
		galleryHydratedRef.current = galleryContext;
	}, [galleryLoading, storedGallery, galleryContext]);

	const debouncedGallery = useDebounce(gallery, 600);
	useEffect(() => {
		if (galleryLoading || galleryHydratedRef.current !== galleryContext) return;
		void saveGallery(debouncedGallery);
	}, [debouncedGallery, galleryLoading, saveGallery, galleryContext]);

	useEffect(() => {
		if (!finalPrompt.trim() && originalPrompt.trim() && !enhancedPrompt) {
			setFinalPrompt(originalPrompt.trim());
		}
	}, [enhancedPrompt, finalPrompt, originalPrompt]);

	const handleEnhancePrompt = async () => {
		if (!originalPrompt.trim()) return;

		try {
			const result = await enhancePrompt(originalPrompt, {
				style: "dark manhwa anime cinematic fantasy, Rift Ascendant style",
				mood: "dramatic, high contrast, detailed",
				universe: "Rift Ascendant",
			});

			if (result?.enhanced) {
				setFinalPrompt(result.enhanced);
			} else if (!finalPrompt && originalPrompt.trim()) {
				setFinalPrompt(originalPrompt.trim());
			}
		} catch (error) {
			logger.error("Failed to enhance prompt:", error);
		}
	};

	const handleGenerateTags = async () => {
		if (!finalPrompt.trim()) return;

		try {
			await generateTags(finalPrompt, "text");
		} catch (error) {
			logger.error("Failed to generate tags:", error);
		}
	};

	const handleDetectMood = async () => {
		if (!finalPrompt.trim()) return;

		try {
			const mood = await detectMood(finalPrompt, "text");
			setSelectedMood(mood);
		} catch (error) {
			logger.error("Failed to detect mood:", error);
		}
	};

	const handleSuggestStyles = async () => {
		if (!finalPrompt.trim()) return;

		try {
			await suggestStyles(
				"dark manhwa anime cinematic fantasy, Rift Ascendant",
			);
		} catch (error) {
			logger.error("Failed to suggest styles:", error);
		}
	};

	const handleGenerateArt = async () => {
		if (!finalPrompt.trim() || !artAvailable) return;

		setIsGenerating(true);
		setGenerationResult(null);
		onGenerationStart?.();
		let completedSuccessfully = false;

		try {
			const startedAt = Date.now();
			const resolvedEntityType = entityType ?? "Anomaly";
			const resolvedEntityId = entityId ?? `ai-enhanced-${Date.now()}`;
			const resolvedTitle = title?.trim() || "AI Enhanced Art";
			const resolvedTags =
				selectedStyle.trim().length > 0
					? Array.from(new Set([...selectedTags, selectedStyle.trim()]))
					: selectedTags;
			const request = {
				entityType: resolvedEntityType,
				entityId: resolvedEntityId,
				variant: "portrait" as const,
				title: resolvedTitle,
				tags: resolvedTags,
				description: finalPrompt,
				mood: selectedMood,
				environment: "fantasy world",
			};

			const result = await generateArt(request);
			let resolvedResult = result;

			const needsFallback =
				!resolvedResult ||
				typeof resolvedResult.success !== "boolean" ||
				!resolvedResult.success ||
				!resolvedResult.assetId;

			if (needsFallback) {
				let fallbackAsset: ArtAsset | null = null;
				for (let attempt = 0; attempt < 5; attempt += 1) {
					const fallbackAssets = await artPipeline.getAssetsForEntity(
						request.entityType,
						request.entityId,
					);
					if (fallbackAssets.length > 0) {
						fallbackAsset = fallbackAssets[0];
						break;
					}
					if (attempt < 4) {
						await new Promise((resolve) => setTimeout(resolve, 2000));
					}
				}

				if (fallbackAsset) {
					resolvedResult = {
						success: true,
						assetId: fallbackAsset.id,
						paths: Object.values(fallbackAsset.paths),
						metadata: fallbackAsset.metadata,
						duration: Date.now() - startedAt,
					};
				} else if (
					!resolvedResult ||
					typeof resolvedResult.success !== "boolean"
				) {
					resolvedResult = {
						success: false,
						error: "Art generation returned no result",
						duration: Date.now() - startedAt,
					};
				} else if (!resolvedResult.success) {
					resolvedResult = {
						...resolvedResult,
						duration: resolvedResult.duration ?? Date.now() - startedAt,
					};
				}
			}

			let nextResult = resolvedResult;

			if (!nextResult.success) {
				const fallbackAssets = await artPipeline.getAssetsForEntity(
					request.entityType,
					request.entityId,
				);
				if (fallbackAssets.length > 0) {
					const fallbackAsset = fallbackAssets[0];
					nextResult = {
						success: true,
						assetId: fallbackAsset.id,
						paths: Object.values(fallbackAsset.paths),
						metadata: fallbackAsset.metadata,
						duration: Date.now() - startedAt,
					};
				}
			}

			setGenerationResult(nextResult);

			if (nextResult.success) {
				completedSuccessfully = true;
				const previewUrl = pickPreviewUrl(nextResult.paths);
				const assetId = nextResult.assetId || previewUrl;
				if (assetId) {
					onArtGenerated?.(assetId, previewUrl);
				}
				const entry: ArtGalleryEntry = {
					id: nextResult.assetId || `art-${Date.now()}`,
					prompt: finalPrompt.trim(),
					tags: resolvedTags,
					mood: selectedMood,
					style: selectedStyle,
					previewUrl,
					assetId: nextResult.assetId,
					model: extractModel(nextResult.metadata),
					createdAt: new Date().toISOString(),
					durationMs: nextResult.duration,
				};
				setGallery((prev) => [entry, ...prev].slice(0, GALLERY_LIMIT));
			}
		} catch (error) {
			setGenerationResult({
				success: false,
				error: error instanceof Error ? error.message : "Generation failed",
			});
		} finally {
			setIsGenerating(false);
			onGenerationComplete?.(completedSuccessfully);
		}
	};

	const toggleTag = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
		);
	};

	const removeGalleryEntry = (id: string) =>
		setGallery((prev) => prev.filter((entry) => entry.id !== id));
	const exportGallery = () =>
		downloadJson(`art-gallery${campaignId ? `-${campaignId}` : ""}`, gallery);

	const resultPreviewUrl = generationResult?.success
		? pickPreviewUrl(generationResult.paths)
		: undefined;

	return (
		<div className={cn("space-y-6", className)}>
			<AIProviderSettings />
			{/* AI Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="w-5 h-5" />
						AI-Enhanced Art Generation
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-2">
							<div
								className={cn(
									"w-3 h-3 rounded-full",
									artAvailable ? "bg-green-500" : "bg-red-500",
								)}
							/>
							<span className="text-sm">
								Art Generation: {artAvailable ? "Available" : "Unavailable"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-blue-500" />
							<span className="text-sm">AI Enhancement: Active</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded-full bg-purple-500" />
							<span className="text-sm">Rift Ascendant Style</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* AI Enhancement Panel */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="w-4 h-4" />
						AI Enhancement Tools
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="prompt" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="prompt">Prompt</TabsTrigger>
							<TabsTrigger value="tags">Tags</TabsTrigger>
							<TabsTrigger value="mood">Mood</TabsTrigger>
							<TabsTrigger value="style">Style</TabsTrigger>
						</TabsList>

						<TabsContent value="prompt" className="space-y-4">
							<div>
								<p className="text-sm font-medium">Original Prompt</p>
								<Textarea
									value={originalPrompt}
									onChange={(e) => setOriginalPrompt(e.target.value)}
									placeholder="Enter your basic prompt here..."
									rows={3}
								/>
							</div>

							<Button
								type="button"
								onClick={handleEnhancePrompt}
								disabled={!originalPrompt.trim() || isEnhancing}
								className="w-full"
							>
								{isEnhancing ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Enhancing...
									</>
								) : (
									<>
										<Sparkles className="w-4 h-4 mr-2" />
										Enhance with AI
									</>
								)}
							</Button>

							{enhanceError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{enhanceError}</AlertDescription>
								</Alert>
							)}

							{(enhancedPrompt || finalPrompt || originalPrompt.trim()) && (
								<div className="space-y-2">
									<p className="text-sm font-medium">
										{enhancedPrompt ? "Enhanced Prompt" : "Final Prompt"}
									</p>
									<Textarea
										value={finalPrompt || enhancedPrompt || originalPrompt}
										onChange={(e) => setFinalPrompt(e.target.value)}
										rows={4}
										className={cn(
											enhancedPrompt
												? "border-green-500/30 bg-green-50"
												: "border-border",
										)}
									/>
									{enhancement && (
										<div className="text-xs text-muted-foreground">
											<p>- AI enhanced with Rift Ascendant styling</p>
											<p>- Added dramatic lighting and contrast</p>
											<p>- Included manhwa anime elements</p>
										</div>
									)}
								</div>
							)}
						</TabsContent>

						<TabsContent value="tags" className="space-y-4">
							<Button
								type="button"
								onClick={handleGenerateTags}
								disabled={!finalPrompt.trim() || isGeneratingTags}
								className="w-full"
							>
								{isGeneratingTags ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Generating Tags...
									</>
								) : (
									<>
										<Tag className="w-4 h-4 mr-2" />
										Generate AI Tags
									</>
								)}
							</Button>

							{tagsError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{tagsError}</AlertDescription>
								</Alert>
							)}

							{aiTags.length > 0 && (
								<div className="space-y-2">
									<p className="text-sm font-medium">AI-Generated Tags</p>
									<div className="flex flex-wrap gap-2">
										{aiTags.map((tag) => (
											<Badge
												key={tag}
												variant={
													selectedTags.includes(tag) ? "default" : "outline"
												}
												className="cursor-pointer"
												onClick={() => toggleTag(tag)}
											>
												{tag}
											</Badge>
										))}
									</div>
								</div>
							)}
						</TabsContent>

						<TabsContent value="mood" className="space-y-4">
							<Button
								type="button"
								onClick={handleDetectMood}
								disabled={!finalPrompt.trim() || isDetecting}
								className="w-full"
							>
								{isDetecting ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Detecting Mood...
									</>
								) : (
									<>
										<Brain className="w-4 h-4 mr-2" />
										Detect Mood
									</>
								)}
							</Button>

							{moodError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{moodError}</AlertDescription>
								</Alert>
							)}

							{detectedMood && (
								<div className="space-y-2">
									<p className="text-sm font-medium">Detected Mood</p>
									<Badge variant="secondary" className="text-lg">
										{detectedMood}
									</Badge>
								</div>
							)}
						</TabsContent>

						<TabsContent value="style" className="space-y-4">
							<Button
								type="button"
								onClick={handleSuggestStyles}
								disabled={!finalPrompt.trim() || isSuggesting}
								className="w-full"
							>
								{isSuggesting ? (
									<>
										<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
										Suggesting Styles...
									</>
								) : (
									<>
										<Palette className="w-4 h-4 mr-2" />
										Suggest Variations
									</>
								)}
							</Button>

							{styleError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{styleError}</AlertDescription>
								</Alert>
							)}

							{styleSuggestions.length > 0 && (
								<div className="space-y-2">
									<p className="text-sm font-medium">Style Variations</p>
									<div className="space-y-2">
										{styleSuggestions.map((style, _index) => (
											<Badge
												key={style}
												variant={
													selectedStyle === style ? "default" : "outline"
												}
												className="cursor-pointer hover:bg-primary/20"
												onClick={() => setSelectedStyle(style)}
											>
												{style}
											</Badge>
										))}
									</div>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Final Generation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="w-4 h-4" />
						Generate AI-Enhanced Art
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Summary */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
						<div>
							<span className="font-medium">Prompt:</span>
							<p className="text-muted-foreground truncate">
								{finalPrompt || "No enhanced prompt"}
							</p>
						</div>
						<div>
							<span className="font-medium">Tags:</span>
							<p className="text-muted-foreground">
								{selectedTags.length > 0
									? selectedTags.join(", ")
									: "No tags selected"}
							</p>
						</div>
						<div>
							<span className="font-medium">Style:</span>
							<p className="text-muted-foreground">
								{selectedStyle || "No style selected"}
							</p>
						</div>
						<div>
							<span className="font-medium">Mood:</span>
							<p className="text-muted-foreground">
								{selectedMood || "No mood detected"}
							</p>
						</div>
					</div>

					<Button
						type="button"
						onClick={handleGenerateArt}
						disabled={!finalPrompt.trim() || !artAvailable || isGenerating}
						className="w-full"
						size="lg"
					>
						{isGenerating ? (
							<>
								<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
								Generating AI Art...
							</>
						) : (
							<>
								<Zap className="w-4 h-4 mr-2" />
								Generate AI-Enhanced Art
							</>
						)}
					</Button>

					{generationResult && (
						<div
							className={cn(
								"p-4 rounded-lg border",
								generationResult.success
									? "border-green-500/30 bg-green-500/10"
									: "border-red-500/30 bg-red-500/10",
							)}
						>
							{generationResult.success ? (
								<div className="space-y-3">
									<div className="flex items-center gap-2 text-green-700">
										<CheckCircle className="w-4 h-4" />
										<span className="font-medium">
											AI-Enhanced Art Generated Successfully!
										</span>
									</div>
									{resultPreviewUrl && (
										<div className="space-y-2">
											<img
												src={resultPreviewUrl}
												alt={finalPrompt || "Generated art"}
												className="w-full max-w-md rounded-lg border border-primary/20"
											/>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="gap-1"
												onClick={() =>
													downloadImage(
														resultPreviewUrl,
														finalPrompt || "rift-art",
													)
												}
											>
												<Download className="w-4 h-4" /> Download Image
											</Button>
										</div>
									)}
								</div>
							) : (
								<div className="flex items-center gap-2 text-red-700">
									<AlertCircle className="w-4 h-4" />
									<span className="font-medium">Generation Failed</span>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Generation Gallery / History */}
			{gallery.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between gap-2">
							<span className="flex items-center gap-2">
								<ImageIcon className="w-4 h-4" />
								Generation Gallery
								{isCampaignScoped && (
									<Badge variant="outline" className="text-[10px]">
										Shared
									</Badge>
								)}
							</span>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="gap-1"
								onClick={exportGallery}
							>
								<FileJson className="w-4 h-4" /> Export
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{gallery.map((entry) => (
								<div
									key={entry.id}
									className="space-y-2 rounded-lg border border-primary/15 bg-black/20 p-3"
								>
									{entry.previewUrl ? (
										<img
											src={entry.previewUrl}
											alt={entry.prompt}
											className="aspect-square w-full rounded-md object-cover"
										/>
									) : (
										<div className="flex aspect-square w-full items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
											<ImageIcon className="h-8 w-8 opacity-50" />
										</div>
									)}
									<p className="line-clamp-2 text-xs text-foreground/80">
										{entry.prompt || "Untitled generation"}
									</p>
									<p className="text-[11px] text-muted-foreground">
										{new Date(entry.createdAt).toLocaleString()}
										{entry.model ? ` Â· ${entry.model}` : ""}
									</p>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-7 flex-1 gap-1 text-[11px]"
											onClick={() =>
												downloadImage(
													entry.previewUrl,
													entry.prompt || "rift-art",
												)
											}
											disabled={!entry.previewUrl}
										>
											<Download className="h-3 w-3" /> Save
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-7 gap-1 text-[11px] text-muted-foreground"
											onClick={() => removeGalleryEntry(entry.id)}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
