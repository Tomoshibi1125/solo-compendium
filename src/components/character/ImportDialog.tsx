import { AlertCircle, Check, FileJson, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCreateCharacter } from "@/hooks/useCharacters";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import {
	type CharacterExportSchema,
	validateCharacterImport,
} from "@/lib/characterSchema";
import { ABILITY_NAMES } from "@/types/system-rules";

export function ImportDialog({
	open,
	onOpenChange,
	onImportSuccess,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onImportSuccess?: (characterId: string) => void;
}) {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<CharacterExportSchema | null>(null);
	const [errors, setErrors] = useState<string[]>([]);
	const [importing, setImporting] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const createCharacter = useCreateCharacter();
	const { toast } = useToast();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const ddbEnhancements = usePlayerToolsEnhancements();

	const handleFileSelect = async (selectedFile: File) => {
		setFile(selectedFile);
		setErrors([]);
		setPreview(null);

		try {
			const text = await selectedFile.text();
			const json = JSON.parse(text);
			const result = validateCharacterImport(json);

			if (!result.valid) {
				setErrors(result.errors);
				return;
			}

			setPreview(result.data);
		} catch {
			setErrors(["Could not parse file. Please ensure it is valid JSON."]);
		}
	};

	const handleImport = async () => {
		if (!preview) return;
		setImporting(true);

		try {
			const character = await createCharacter.mutateAsync({
				name: preview.name,
				level: preview.level,
				job: preview.job,
				path: preview.path,
				background: preview.background,
				hp_current: preview.stats.hp.current,
				hp_max: preview.stats.hp.max,
				hp_temp: preview.stats.hp.temp,
				hit_dice_current: preview.stats.hitDice.current,
				hit_dice_max: preview.stats.hitDice.max,
				hit_dice_size: preview.stats.hitDice.size,
				system_favor_current: preview.stats.systemFavor.current,
				system_favor_max: preview.stats.systemFavor.max,
				system_favor_die: preview.stats.systemFavor.die,
				armor_class: preview.stats.armorClass,
				speed: preview.stats.speed,
				initiative: preview.stats.initiative,
				proficiency_bonus: preview.stats.proficiencyBonus,
				conditions: preview.conditions || [],
				exhaustion_level: preview.exhaustionLevel || 0,
				experience: preview.experience || 0,
				notes: preview.notes,
				appearance: preview.appearance,
				backstory: preview.backstory,
				saving_throw_proficiencies: (preview.proficiencies?.savingThrows ||
					[]) as ("STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE")[],
				skill_proficiencies: preview.proficiencies?.skills || [],
				armor_proficiencies: preview.proficiencies?.armor || [],
				weapon_proficiencies: preview.proficiencies?.weapons || [],
				tool_proficiencies: preview.proficiencies?.tools || [],
			});

			toast({
				title: "Character imported",
				description: `${preview.name} has been created from the import file.`,
			});

			ddbEnhancements
				.trackCustomFeatureUsage(
					character.id,
					"Character Imported",
					`Level ${preview.level}`,
					"5e",
					{ skipBroadcast: true },
				)
				.catch(console.error);

			onOpenChange(false);
			resetState();

			if (character?.id && onImportSuccess) {
				onImportSuccess(character.id);
			}
		} catch (error) {
			toast({
				title: "Import failed",
				description:
					error instanceof Error
						? error.message
						: "Could not import character.",
				variant: "destructive",
			});
		} finally {
			setImporting(false);
		}
	};

	const resetState = () => {
		setFile(null);
		setPreview(null);
		setErrors([]);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) resetState();
				onOpenChange(isOpen);
			}}
		>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Import Character</DialogTitle>
					<DialogDescription>
						Upload a character JSON file to create a new character
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* File Upload */}
					<button
						type="button"
						className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-transparent"
						onClick={() => fileInputRef.current?.click()}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept=".json"
							aria-label="Select character JSON file"
							className="hidden"
							onChange={(e) => {
								const f = e.target.files?.[0];
								if (f) handleFileSelect(f);
							}}
						/>
						{file ? (
							<div className="flex items-center justify-center gap-2">
								<FileJson className="w-5 h-5 text-primary" />
								<span className="text-sm font-medium">{file.name}</span>
							</div>
						) : (
							<div className="space-y-2">
								<Upload className="w-8 h-8 mx-auto text-muted-foreground" />
								<p className="text-sm text-muted-foreground">
									Click to select a character JSON file
								</p>
							</div>
						)}
					</button>

					{/* Validation Errors */}
					{errors.length > 0 && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								<ul className="list-disc list-inside text-xs space-y-1">
									{errors.map((error) => (
										<li key={error}>{error}</li>
									))}
								</ul>
							</AlertDescription>
						</Alert>
					)}

					{/* Character Preview */}
					{preview && (
						<div className="border rounded-lg p-4 space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="font-heading font-semibold text-lg">
									{preview.name}
								</h4>
								<Badge>Level {preview.level}</Badge>
							</div>

							<div className="grid grid-cols-2 gap-2 text-sm">
								{preview.job && (
									<div>
										<span className="text-muted-foreground">Job: </span>
										<span>{preview.job}</span>
									</div>
								)}
								{preview.background && (
									<div>
										<span className="text-muted-foreground">Background: </span>
										<span>{preview.background}</span>
									</div>
								)}
							</div>

							<div className="grid grid-cols-6 gap-2">
								{Object.entries(preview.abilities).map(([key, value]) => (
									<div key={key} className="text-center">
										<div className="text-xs text-muted-foreground">
											{ABILITY_NAMES[key as keyof typeof ABILITY_NAMES] || key}
										</div>
										<div className="font-display font-bold">{value}</div>
									</div>
								))}
							</div>

							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Check className="w-3 h-3 text-green-400" />
								<span>Valid character file — ready to import</span>
							</div>

							<Button
								onClick={handleImport}
								disabled={importing}
								className="w-full"
							>
								{importing ? "Importing..." : `Import ${preview.name}`}
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
