import {
	AlertCircle,
	CheckCircle2,
	Download,
	Loader2,
	Play,
	Save,
	Shield,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAIAudioGeneration } from "@/lib/ai/hooks";
import type {
	AudioGenerationKind,
	AudioGenerationSuccess,
} from "@/lib/ai/types";
import type { AudioTrack } from "@/lib/audio/types";

interface AIAudioGenerateTabProps {
	canGenerate: boolean;
	campaignId?: string;
	onImportTrack: (
		track: AudioTrack,
		options: { storagePath: string; bucket?: "ai-audio" | "audio-tracks" },
	) => Promise<AudioTrack | undefined>;
	onLoadTrack?: (track: AudioTrack) => Promise<void>;
}

const CATEGORY_BY_KIND: Record<AudioGenerationKind, AudioTrack["category"]> = {
	sfx: "sfx",
	ambient: "ambient",
	music: "music",
};

export function AIAudioGenerateTab({
	canGenerate,
	campaignId,
	onImportTrack,
	onLoadTrack,
}: AIAudioGenerateTabProps) {
	const { toast } = useToast();
	const { isGenerating, result, error, status, generateAudio, reset } =
		useAIAudioGeneration();
	const [prompt, setPrompt] = useState("");
	const [kind, setKind] = useState<AudioGenerationKind>("sfx");
	const [durationSeconds, setDurationSeconds] = useState(10);
	const [category, setCategory] = useState<AudioTrack["category"]>("sfx");
	const [title, setTitle] = useState("");
	const [artist, setArtist] = useState("Stable Audio Open");
	const [mood, setMood] = useState("");
	const [tags, setTags] = useState("ai-generated");
	const [isImporting, setIsImporting] = useState(false);
	const [hasImportedCurrentResult, setHasImportedCurrentResult] =
		useState(false);

	const derivedTitle = useMemo(() => {
		const trimmed = prompt.trim();
		if (!trimmed) return "Generated Audio";
		return trimmed.slice(0, 60);
	}, [prompt]);

	const statusMessage = useMemo(() => {
		if (status.state === "retrying") {
			return `Model warming up. Retrying${status.retryAfterSeconds ? ` in ${status.retryAfterSeconds}s` : " shortly"}${status.attempt ? ` (attempt ${status.attempt})` : ""}.`;
		}
		if (status.state === "loading") {
			return "Generating audio with Stable Audio Open via Hugging Face.";
		}
		if (status.state === "success") {
			return "Audio generation complete.";
		}
		if (status.state === "error") {
			return error || "Audio generation failed.";
		}
		return null;
	}, [error, status]);

	const handleKindChange = (value: AudioGenerationKind) => {
		setKind(value);
		setCategory(CATEGORY_BY_KIND[value]);
	};

	const buildTrackFromResult = (
		generation: AudioGenerationSuccess,
	): AudioTrack => {
		const parsedTags = tags
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
		const dedupedTags = Array.from(
			new Set([...parsedTags, "ai-generated", generation.kind]),
		);

		return {
			id:
				typeof crypto !== "undefined" && "randomUUID" in crypto
					? crypto.randomUUID()
					: `ai-track-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
			title: title.trim() || derivedTitle,
			artist: artist.trim() || "Stable Audio Open",
			category,
			duration: generation.durationSeconds,
			url: generation.audioUrl,
			volume: generation.kind === "sfx" ? 0.8 : 0.7,
			loop: generation.kind !== "sfx",
			tags: dedupedTags,
			mood: mood.trim() || undefined,
			license: "AI Generated",
			source: generation.provider,
			isLocal: false,
			fileSize: generation.bytes,
			mimeType: generation.mimeType,
			createdAt: generation.createdAt,
			updatedAt: generation.createdAt,
		};
	};

	const handleGenerate = async () => {
		if (!prompt.trim() || !canGenerate) return;
		setHasImportedCurrentResult(false);
		const response = await generateAudio({
			prompt: prompt.trim(),
			durationSeconds,
			kind,
			campaignId,
		});
		if (!response.success) {
			toast({
				title: "Generation failed",
				description: response.error,
				variant: "destructive",
			});
		}
	};

	const handleImport = async () => {
		if (!result?.success) return;
		setIsImporting(true);
		try {
			const track = buildTrackFromResult(result);
			await onImportTrack(track, {
				storagePath: result.storagePath,
				bucket: "ai-audio",
			});
			setHasImportedCurrentResult(true);
			toast({
				title: "Track saved",
				description: `Added "${track.title}" to your audio library.`,
			});
		} catch (importError) {
			toast({
				title: "Import failed",
				description:
					importError instanceof Error
						? importError.message
						: "Unable to register generated audio.",
				variant: "destructive",
			});
		} finally {
			setIsImporting(false);
		}
	};

	const handleLoadTrack = async () => {
		if (!result?.success || !onLoadTrack) return;
		try {
			await onLoadTrack(buildTrackFromResult(result));
			toast({
				title: "Loaded into player",
				description: "Generated audio is ready in the Warden player.",
			});
		} catch (playbackError) {
			toast({
				title: "Playback failed",
				description:
					playbackError instanceof Error
						? playbackError.message
						: "Unable to load generated audio into the player.",
				variant: "destructive",
			});
		}
	};

	const handleReset = () => {
		reset();
		setHasImportedCurrentResult(false);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="w-5 h-5" />
						AI Audio Generation
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">
							<Shield className="mr-1 h-3 w-3" />
							Warden Only
						</Badge>
						<Badge variant="outline">Stable Audio Open</Badge>
						<Badge variant="outline">Hugging Face free tier</Badge>
						<Badge variant="outline">5 requests / minute</Badge>
					</div>

					{!canGenerate && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Audio generation is restricted to Warden sessions.
							</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<div className="text-sm font-medium">Prompt</div>
						<Textarea
							value={prompt}
							onChange={(event) => setPrompt(event.target.value)}
							placeholder="Describe the audio cue you want, e.g. metallic gate slamming shut in a haunted fortress, distant echo, dark fantasy cinematic"
							className="min-h-[120px]"
							disabled={!canGenerate || isGenerating}
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<div className="text-sm font-medium">Kind</div>
							<Select
								value={kind}
								onValueChange={(value) =>
									handleKindChange(value as AudioGenerationKind)
								}
								disabled={!canGenerate || isGenerating}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select kind" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="sfx">SFX</SelectItem>
									<SelectItem value="ambient">Ambient</SelectItem>
									<SelectItem value="music">Music</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2 md:col-span-2">
							<div className="flex items-center justify-between text-sm font-medium">
								<span>Duration</span>
								<span>{durationSeconds}s</span>
							</div>
							<Slider
								value={[durationSeconds]}
								onValueChange={(value) => setDurationSeconds(value[0] ?? 10)}
								min={1}
								max={47}
								step={1}
								disabled={!canGenerate || isGenerating}
							/>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="text-sm font-medium">Library title</div>
							<Input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder={derivedTitle}
								disabled={!canGenerate || isGenerating}
							/>
						</div>
						<div className="space-y-2">
							<div className="text-sm font-medium">Artist / source label</div>
							<Input
								value={artist}
								onChange={(event) => setArtist(event.target.value)}
								disabled={!canGenerate || isGenerating}
							/>
						</div>
						<div className="space-y-2">
							<div className="text-sm font-medium">Category</div>
							<Select
								value={category}
								onValueChange={(value) =>
									setCategory(value as AudioTrack["category"])
								}
								disabled={!canGenerate || isGenerating}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="music">Music</SelectItem>
									<SelectItem value="ambient">Ambient</SelectItem>
									<SelectItem value="sfx">SFX</SelectItem>
									<SelectItem value="effect">Effect</SelectItem>
									<SelectItem value="combat">Combat</SelectItem>
									<SelectItem value="exploration">Exploration</SelectItem>
									<SelectItem value="social">Social</SelectItem>
									<SelectItem value="horror">Horror</SelectItem>
									<SelectItem value="mystery">Mystery</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<div className="text-sm font-medium">Mood</div>
							<Input
								value={mood}
								onChange={(event) => setMood(event.target.value)}
								placeholder="tense, eerie, triumphant"
								disabled={!canGenerate || isGenerating}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-sm font-medium">Tags</div>
						<Input
							value={tags}
							onChange={(event) => setTags(event.target.value)}
							placeholder="ai-generated, ambience, dungeon"
							disabled={!canGenerate || isGenerating}
						/>
					</div>

					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => void handleGenerate()}
							disabled={!canGenerate || !prompt.trim() || isGenerating}
						>
							{isGenerating ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Generating...
								</>
							) : (
								<>
									<Wand2 className="mr-2 h-4 w-4" />
									Generate Audio
								</>
							)}
						</Button>
						<Button
							variant="outline"
							onClick={handleReset}
							disabled={isGenerating}
						>
							Reset
						</Button>
					</div>

					{statusMessage && (
						<Alert
							variant={status.state === "error" ? "destructive" : "default"}
						>
							{status.state === "success" ? (
								<CheckCircle2 className="h-4 w-4" />
							) : status.state === "error" ? (
								<AlertCircle className="h-4 w-4" />
							) : (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							<AlertDescription>{statusMessage}</AlertDescription>
						</Alert>
					)}
				</CardContent>
			</Card>

			{result?.success && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							Generated Preview
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3 md:grid-cols-4">
							<div>
								<div className="text-sm font-medium">Provider</div>
								<div className="text-sm text-muted-foreground">
									{result.provider}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium">Kind</div>
								<div className="text-sm text-muted-foreground">
									{result.kind}
								</div>
							</div>
							<div>
								<div className="text-sm font-medium">Duration</div>
								<div className="text-sm text-muted-foreground">
									{result.durationSeconds}s
								</div>
							</div>
							<div>
								<div className="text-sm font-medium">Format</div>
								<div className="text-sm text-muted-foreground">
									{result.mimeType}
								</div>
							</div>
						</div>

						<audio
							controls
							className="w-full"
							src={result.audioUrl}
							preload="metadata"
						>
							<track kind="captions" />
						</audio>

						<div className="flex flex-wrap gap-3">
							<Button variant="outline" onClick={() => void handleLoadTrack()}>
								<Play className="mr-2 h-4 w-4" />
								Load in Player
							</Button>
							<Button
								onClick={() => void handleImport()}
								disabled={isImporting || hasImportedCurrentResult}
							>
								{isImporting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										{hasImportedCurrentResult
											? "Saved to Library"
											: "Save to Library"}
									</>
								)}
							</Button>
							<Button variant="ghost" asChild>
								<a href={result.audioUrl} target="_blank" rel="noreferrer">
									<Download className="mr-2 h-4 w-4" />
									Open Asset
								</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
