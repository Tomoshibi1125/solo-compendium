import {
	Brain,
	Image as ImageIcon,
	Loader2,
	Palette,
	RefreshCw,
	Sparkles,
	Tag,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
	useAIEnhancement,
	useAIMoodDetection,
	useAIStyleSuggestions,
	useAITagGeneration,
} from "@/lib/ai/hooks";
import { useArtAsset, useArtPipeline } from "@/lib/artPipeline/hooks";
import type { ArtRequest, GenerationResult } from "@/lib/artPipeline/types";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface ArtGeneratorProps {
	entityType?: "character" | "npc" | "item" | "Anomaly" | "location";
	entityId?: string;
	existingData?: {
		name?: string;
		description?: string;
		tags?: string[];
		rarity?: string;
		environment?: string;
	};
	onArtGenerated?: (assetId: string, previewUrl?: string) => void;
	className?: string;
}

export function ArtGenerator({
	entityType = "character",
	entityId,
	existingData = {},
	onArtGenerated,
	className,
}: ArtGeneratorProps) {
	// --- Basic Pipeline ---
	const { generateArt, isAvailable: artAvailable } = useArtPipeline();
	const pipelineEntityType: ArtRequest["entityType"] =
		entityType === "item"
			? "item"
			: entityType === "location"
				? "location"
				: "Anomaly";
	useArtAsset(pipelineEntityType, entityId || "temp");

	// --- AI Hooks ---
	const {
		isEnhancing,
		enhancePrompt,
		error: enhanceError,
	} = useAIEnhancement();
	const { isGenerating: isGeneratingTags, generateTags } = useAITagGeneration();
	const { isDetecting, detectMood } = useAIMoodDetection();
	const {
		isSuggesting,
		suggestions: styleSuggestions,
		suggestStyles,
	} = useAIStyleSuggestions();

	// --- Component State ---
	const [genMode, setGenMode] = useState<"standard" | "ai">("standard");
	const [formData, setFormData] = useState({
		name: existingData.name || "",
		description: existingData.description || "",
		tags: existingData.tags?.join(", ") || "",
		variant: "portrait" as ArtRequest["variant"],
		rarity: existingData.rarity || "",
		environment: existingData.environment || "",
		mood: "",
		extraLore: "",
	});

	const [selectedStyle, setSelectedStyle] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [isGeneratingArt, setIsGeneratingArt] = useState(false);
	const [generationResult, setGenerationResult] =
		useState<GenerationResult | null>(null);

	// Sync tags from existing data
	useEffect(() => {
		if (existingData.tags) {
			setSelectedTags(existingData.tags);
		}
	}, [existingData.tags]);

	// --- Helpers ---

	const handleEnhancePrompt = async () => {
		if (!formData.description.trim()) return;
		try {
			const result = await enhancePrompt(formData.description, {
				style: "dark manhwa anime cinematic fantasy, System Ascendant style",
				mood: formData.mood || "dramatic, high contrast, detailed",
				universe: "System Ascendant",
				entityType,
			});
			if (result?.enhanced) {
				setFormData((prev) => ({ ...prev, description: result.enhanced }));
			}
		} catch (error) {
			logger.error("Failed to enhance prompt:", error);
		}
	};

	const handleGenerateTags = async () => {
		if (!formData.description.trim()) return;
		try {
			const tags = await generateTags(formData.description, "text");
			setSelectedTags((prev) => Array.from(new Set([...prev, ...tags])));
		} catch (error) {
			logger.error("Failed to generate tags:", error);
		}
	};

	const handleDetectMood = async () => {
		if (!formData.description.trim()) return;
		try {
			const mood = await detectMood(formData.description, "text");
			setFormData((prev) => ({ ...prev, mood }));
		} catch (error) {
			logger.error("Failed to detect mood:", error);
		}
	};

	const handleSuggestStyles = async () => {
		try {
			await suggestStyles(
				"dark manhwa anime cinematic fantasy, System Ascendant",
			);
		} catch (error) {
			logger.error("Failed to suggest styles:", error);
		}
	};

	const handleGenerate = async () => {
		if (!artAvailable) return;

		setIsGeneratingArt(true);
		setGenerationResult(null);

		const finalTags = [
			...formData.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			...selectedTags,
			selectedStyle,
		].filter(Boolean);

		const request: ArtRequest = {
			entityType: pipelineEntityType,
			entityId: entityId || `custom-${Date.now()}`,
			variant: formData.variant,
			title: formData.name || "Custom Art",
			tags: Array.from(new Set(finalTags)),
			description: formData.description,
			rarityOrCR: formData.rarity,
			environment: formData.environment,
			mood: formData.mood,
			extraLore: formData.extraLore,
		};

		try {
			const result = await generateArt(request);
			setGenerationResult(result);

			if (result.success && result.assetId) {
				const previewUrl = Array.isArray(result.paths)
					? result.paths[0]
					: typeof result.paths === "object"
						? Object.values(result.paths as Record<string, string>).find((u) =>
								u.startsWith("http"),
							)
						: undefined;
				onArtGenerated?.(result.assetId, previewUrl);
			}
		} catch (error) {
			setGenerationResult({
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			setIsGeneratingArt(false);
		}
	};

	const getVariantOptions = () => {
		switch (entityType) {
			case "character":
			case "npc":
			case "Anomaly":
				return [
					{ value: "portrait", label: "Portrait (Square)" },
					{ value: "token", label: "Token (Circle)" },
				];
			case "item":
				return [
					{ value: "icon", label: "Icon (Small)" },
					{ value: "illustration", label: "Illustration (Full)" },
				];
			case "location":
				return [{ value: "banner", label: "Banner (Wide)" }];
			default:
				return [{ value: "portrait", label: "Portrait" }];
		}
	};

	return (
		<div className={cn("space-y-6", className)}>
			{!artAvailable && (
				<Alert variant="destructive">
					<AlertDescription>
						Art generation is currently unavailable. Check feature flags or
						connection.
					</AlertDescription>
				</Alert>
			)}

			<Card className="border-primary/20 bg-muted/5 shadow-inner">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							Visualization Lattice
						</CardTitle>
						<Tabs
							value={genMode}
							onValueChange={(v) => setGenMode(v as "standard" | "ai")}
							className="w-auto"
						>
							<TabsList className="h-8">
								<TabsTrigger value="standard" className="text-xs">
									Standard
								</TabsTrigger>
								<TabsTrigger value="ai" className="text-xs">
									AI Enhanced
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Basic Info */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="art-name">Subject Name</Label>
							<Input
								id="art-name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder="Subject identification..."
								className="h-9"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="art-variant">Output Variant</Label>
							<Select
								value={formData.variant}
								onValueChange={(v: ArtRequest["variant"]) =>
									setFormData((prev) => ({ ...prev, variant: v }))
								}
							>
								<SelectTrigger id="art-variant" className="h-9">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{getVariantOptions().map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Description & AI Enhance */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="art-desc">Visual Descriptor</Label>
							{genMode === "ai" && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-6 gap-1 text-[10px] text-primary"
									onClick={handleEnhancePrompt}
									disabled={isEnhancing || !formData.description.trim()}
								>
									{isEnhancing ? (
										<Loader2 className="w-3 h-3 animate-spin" />
									) : (
										<Brain className="w-3 h-3" />
									)}
									Enhance Prompt
								</Button>
							)}
						</div>
						<Textarea
							id="art-desc"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							placeholder="Describe the subject's appearance, armor, features..."
							className={cn(
								"min-h-[100px] text-sm leading-relaxed",
								isEnhancing && "animate-pulse border-primary/40",
							)}
						/>
						{enhanceError && (
							<p className="text-[10px] text-destructive">{enhanceError}</p>
						)}
					</div>

					{/* AI Advanced Section */}
					{genMode === "ai" && (
						<div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label className="text-[10px] uppercase tracking-wider">
											Dimensional Tags
										</Label>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-5 p-0 text-primary"
											onClick={handleGenerateTags}
											disabled={isGeneratingTags}
										>
											<Tag className="w-3 h-3" />
										</Button>
									</div>
									<div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded bg-muted/30 border border-border/40">
										{selectedTags.map((tag) => (
											<Badge
												key={tag}
												variant="secondary"
												className="text-[10px] px-1.5 py-0 h-5"
											>
												{tag}
												<button
													type="button"
													className="ml-1 hover:text-destructive"
													onClick={() =>
														setSelectedTags((prev) =>
															prev.filter((t) => t !== tag),
														)
													}
												>
													×
												</button>
											</Badge>
										))}
										{selectedTags.length === 0 && (
											<span className="text-[10px] text-muted-foreground italic">
												No tags established.
											</span>
										)}
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label className="text-[10px] uppercase tracking-wider">
											Aesthetic Mood
										</Label>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-5 p-0 text-primary"
											onClick={handleDetectMood}
											disabled={isDetecting}
										>
											<RefreshCw className="w-3 h-3" />
										</Button>
									</div>
									<Input
										value={formData.mood}
										onChange={(e) =>
											setFormData((prev) => ({ ...prev, mood: e.target.value }))
										}
										placeholder="e.g. Gritty, Ethereal, Menacing..."
										className="h-8 text-xs"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label className="text-[10px] uppercase tracking-wider">
										Style Variations
									</Label>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-5 p-0 text-primary"
										onClick={handleSuggestStyles}
										disabled={isSuggesting}
									>
										<Palette className="w-3 h-3" />
									</Button>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{styleSuggestions.map((style) => (
										<Badge
											key={style}
											variant={selectedStyle === style ? "default" : "outline"}
											className="text-[10px] cursor-pointer hover:bg-primary/10"
											onClick={() => setSelectedStyle(style)}
										>
											{style}
										</Badge>
									))}
									{styleSuggestions.length === 0 && (
										<span className="text-[10px] text-muted-foreground italic">
											Request style suggestions for varied aesthetics.
										</span>
									)}
								</div>
							</div>
						</div>
					)}

					{/* Generate Button */}
					<Button
						type="button"
						onClick={handleGenerate}
						disabled={!artAvailable || isGeneratingArt || !formData.name.trim()}
						className="w-full h-11 gap-2 shadow-lg hover:shadow-primary/20"
						size="lg"
					>
						{isGeneratingArt ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Synthesizing Visual Data...
							</>
						) : (
							<>
								{genMode === "ai" ? (
									<Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
								) : (
									<Sparkles className="w-5 h-5" />
								)}
								Commence Manifestation
							</>
						)}
					</Button>

					{/* Result State */}
					{generationResult && (
						<div
							className={cn(
								"p-4 rounded-lg border animate-in zoom-in-95 duration-300",
								generationResult.success
									? "border-green-500/30 bg-green-500/5"
									: "border-red-500/30 bg-red-500/5",
							)}
						>
							{generationResult.success ? (
								<div className="flex items-center gap-3">
									<div className="p-2 bg-green-500/20 rounded-full">
										<ImageIcon className="w-4 h-4 text-green-500" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-green-400">
											Visual Record Pattern Solidified
										</p>
										<p className="text-[10px] text-muted-foreground">
											Processing duration: {generationResult.duration}ms
										</p>
									</div>
								</div>
							) : (
								<div className="flex items-center gap-3 text-destructive">
									<p className="text-sm">{generationResult.error}</p>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
