import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Wand2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const characterEditSchema = z.object({
	name: z.string().trim().min(1, "Character name cannot be empty."),
	appearance: z.string().trim(),
	backstory: z.string().trim(),
	notes: z.string().trim(),
});

type CharacterEditValues = z.infer<typeof characterEditSchema>;

export function CharacterEditDialog({
	character,
	open,
	onOpenChange,
	onStateChange,
}: CharacterEditDialogProps) {
	const { toast } = useToast();
	const updateCharacter = useUpdateCharacter();
	const ascendantTools = useAscendantTools();

	const form = useForm<CharacterEditValues>({
		resolver: zodResolver(characterEditSchema),
		defaultValues: { name: "", appearance: "", backstory: "", notes: "" },
		mode: "onSubmit",
	});

	// Sync form values when the character changes.
	useEffect(() => {
		if (character) {
			form.reset({
				name: character.name || "",
				appearance: character.appearance || "",
				backstory: character.backstory || "",
				notes: character.notes || "",
			});
		}
	}, [character, form]);

	const nameValue = form.watch("name");

	const [isGeneratingApp, setIsGeneratingApp] = useState(false);
	const [isGeneratingBack, setIsGeneratingBack] = useState(false);

	const handleGenerateAI = async (field: "appearance" | "backstory") => {
		if (!character) return;
		const isApp = field === "appearance";
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
			const dataObj = response.data as { content?: string; output?: string };
			if (!text && dataObj?.content && typeof dataObj.content === "string") {
				text = dataObj.content;
			}
			if (!text && dataObj?.output && typeof dataObj.output === "string") {
				text = dataObj.output;
			}

			if (text) {
				form.setValue(field, text, { shouldDirty: true });
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

	const onSubmit = form.handleSubmit(
		async (values) => {
			if (!character) return;
			try {
				const updatedCharacter = await updateCharacter.mutateAsync({
					id: character.id,
					data: {
						name: values.name,
						appearance: values.appearance || null,
						backstory: values.backstory || null,
						notes: values.notes || null,
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
						error instanceof Error
							? error.message
							: "An unknown error occurred",
					variant: "destructive",
				});
			}
		},
		(errors) => {
			toast({
				title: "Name required",
				description:
					errors.name?.message ?? "Please fix the highlighted fields.",
				variant: "destructive",
			});
		},
	);

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
							{...form.register("name")}
							className="mt-1"
							placeholder="Enter character name"
						/>
						{form.formState.errors.name && (
							<p className="mt-1 text-sm text-destructive">
								{form.formState.errors.name.message}
							</p>
						)}
					</div>

					<div>
						<div className="flex items-center justify-between mb-1">
							<Label htmlFor="character-appearance">Appearance</Label>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 text-xs text-muted-foreground hover:text-primary px-2"
								onClick={() => handleGenerateAI("appearance")}
								disabled={isGeneratingApp || !nameValue}
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
							{...form.register("appearance")}
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
								disabled={isGeneratingBack || !nameValue}
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
							{...form.register("backstory")}
							className="mt-1"
							rows={5}
							placeholder="Character background, history, motivations, etc."
						/>
					</div>

					<div>
						<Label htmlFor="character-notes">Notes</Label>
						<Textarea
							id="character-notes"
							{...form.register("notes")}
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
					<Button onClick={onSubmit} disabled={updateCharacter.isPending}>
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
