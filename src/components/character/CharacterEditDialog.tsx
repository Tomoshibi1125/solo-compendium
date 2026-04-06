import { Loader2, Save, Wand2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { useUpdateCharacter } from "@/hooks/useCharacters";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { aiService } from "@/lib/ai/aiService";
import { logger } from "@/lib/logger";
import { PortraitUpload } from "./PortraitUpload";

interface CharacterEditDialogProps {
	character: CharacterWithAbilities | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStateChange?: (state: CharacterWithAbilities) => void;
}

export function CharacterEditDialog({
	character,
	open,
	onOpenChange,
	onStateChange,
}: CharacterEditDialogProps) {
	const { toast } = useToast();
	const updateCharacter = useUpdateCharacter();
	const [name, setName] = useState("");
	const [appearance, setAppearance] = useState("");
	const [backstory, setBackstory] = useState("");
	const [notes, setNotes] = useState("");
	const ascendantTools = useAscendantTools();

	// Update form when character changes
	useEffect(() => {
		if (character) {
			setName(character.name || "");
			setAppearance(character.appearance || "");
			setBackstory(character.backstory || "");
			setNotes(character.notes || "");
		}
	}, [character]);

	const [isGeneratingApp, setIsGeneratingApp] = useState(false);
	const [isGeneratingBack, setIsGeneratingBack] = useState(false);

	const handleGenerateAI = async (field: "appearance" | "backstory") => {
		if (!character) return;
		const isApp = field === "appearance";
		const setter = isApp ? setAppearance : setBackstory;
		const loader = isApp ? setIsGeneratingApp : setIsGeneratingBack;

		loader(true);
		try {
			const charDesc = `Level ${character.level} character named ${character.name || "Unknown"}`;
			const prompt = isApp
				? `Generate a 2-3 sentence evocative, dark-fantasy physical appearance description for a ${charDesc} in the Rift Ascendant universe. Emphasize their glowing aura and combat readiness.`
				: `Generate a 1-paragraph dramatic, high-stakes backstory for a ${charDesc} in the Rift Ascendant universe. They recently awoke to a powerful, mysterious System. Keep it exciting and aligned with manhwa tropes.`;

			const response = await aiService.processRequest({
				service: aiService.getConfiguration().defaultService,
				type: "generate-content",
				input: prompt,
				context: {
					contentType: "backstory",
					tone: "epic",
					length: isApp ? "short" : "medium",
					complexity: "moderate",
					universe: "Rift Ascendant",
				},
			});

			if (!response.success) {
				throw new Error(response.error || "Generation failed.");
			}

			// the response.data might be a string, or an object containing .content or .output
			let text = typeof response.data === "string" ? response.data : "";
			if (
				!text &&
				response.data?.content &&
				typeof response.data.content === "string"
			) {
				text = response.data.content;
			}
			if (
				!text &&
				response.data?.output &&
				typeof response.data.output === "string"
			) {
				text = response.data.output;
			}

			if (text) {
				setter(text);
				toast({
					title: `${isApp ? "Appearance" : "Backstory"} Generated`,
					description: "Feel free to modify the result.",
				});
			} else {
				throw new Error("Received empty response from AI.");
			}
		} catch (err) {
			toast({
				title: "Generation Failed",
				description: err instanceof Error ? err.message : String(err),
				variant: "destructive",
			});
		} finally {
			loader(false);
		}
	};

	const handleSave = async () => {
		if (!character) return;

		if (!name.trim()) {
			toast({
				title: "Name required",
				description: "Character name cannot be empty.",
				variant: "destructive",
			});
			return;
		}

		try {
			const updatedCharacter = await updateCharacter.mutateAsync({
				id: character.id,
				data: {
					name: name.trim(),
					appearance: appearance.trim() || null,
					backstory: backstory.trim() || null,
					notes: notes.trim() || null,
				},
			});

			// Notify parent of state change for undo/redo
			if (onStateChange && updatedCharacter) {
				onStateChange({
					...character,
					...updatedCharacter,
				} as CharacterWithAbilities);
			}

			toast({
				title: "Character updated",
				description: "Your changes have been saved.",
			});

			ascendantTools
				.trackCustomFeatureUsage(
					character.id,
					"Character Details Updated",
					"Appearance, backstory, or notes changed",
					"SA",
				)
				.catch(console.error);

			onOpenChange(false);
		} catch (error) {
			logger.error("Failed to update character:", error);
			toast({
				title: "Failed to update character",
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive",
			});
		}
	};

	if (!character) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Character</DialogTitle>
					<DialogDescription>
						Update your ascendant profile details and notes.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div>
						<Label className="mb-2 block">System Portrait</Label>
						<PortraitUpload
							characterId={character.id}
							currentPortraitUrl={character.portrait_url}
							onUploadComplete={(newUrl) => {
								if (onStateChange) {
									onStateChange({ ...character, portrait_url: newUrl });
								}
							}}
						/>
					</div>

					<div>
						<Label htmlFor="character-name">Name</Label>
						<Input
							id="character-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="mt-1"
							placeholder="Enter character name"
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="character-appearance">Appearance</Label>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 text-xs text-muted-foreground hover:text-primary px-2"
								onClick={() => handleGenerateAI("appearance")}
								disabled={isGeneratingApp || !name}
							>
								{isGeneratingApp ? (
									<Loader2 className="w-3 h-3 mr-1 animate-spin" />
								) : (
									<Wand2 className="w-3 h-3 mr-1" />
								)}
								Auto-fill
							</Button>
						</div>
						<Textarea
							id="character-appearance"
							value={appearance}
							onChange={(e) => setAppearance(e.target.value)}
							className="mt-1"
							rows={3}
							placeholder="Physical description, notable features, etc."
						/>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="character-backstory">Backstory</Label>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 text-xs text-muted-foreground hover:text-primary px-2"
								onClick={() => handleGenerateAI("backstory")}
								disabled={isGeneratingBack || !name}
							>
								{isGeneratingBack ? (
									<Loader2 className="w-3 h-3 mr-1 animate-spin" />
								) : (
									<Wand2 className="w-3 h-3 mr-1" />
								)}
								Auto-fill
							</Button>
						</div>
						<Textarea
							id="character-backstory"
							value={backstory}
							onChange={(e) => setBackstory(e.target.value)}
							className="mt-1"
							rows={5}
							placeholder="Character background, history, motivations, etc."
						/>
					</div>

					<div>
						<Label htmlFor="character-notes">Notes</Label>
						<Textarea
							id="character-notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="mt-1"
							rows={4}
							placeholder="Session notes, reminders, character development, etc."
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						<X className="w-4 h-4 mr-2" />
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={updateCharacter.isPending}>
						{updateCharacter.isPending ? (
							<>
								<Save className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Save Changes
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
