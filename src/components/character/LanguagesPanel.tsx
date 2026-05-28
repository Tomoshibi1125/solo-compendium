import { Languages, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import { EARTH_LANGUAGES } from "@/types/character";

interface LanguagesPanelProps {
	characterId: string;
	className?: string;
}

export function LanguagesPanel({
	characterId,
	className,
}: LanguagesPanelProps) {
	const { data: character } = useCharacter(characterId);
	const updateCharacter = useUpdateCharacter();
	const { toast } = useToast();
	const [selected, setSelected] = useState<string>("");

	const languages = useMemo(() => {
		const raw = (character as { languages?: string[] | null } | undefined)
			?.languages;
		return Array.isArray(raw) ? raw : [];
	}, [character]);

	const availableLanguages = useMemo(() => {
		const known = new Set(languages.map((l) => l.toLowerCase()));
		return EARTH_LANGUAGES.filter((l) => !known.has(l.toLowerCase()));
	}, [languages]);

	const handleAdd = async () => {
		if (!selected || !character) return;
		const next = [...languages, selected];
		try {
			await updateCharacter.mutateAsync({
				id: characterId,
				data: { languages: next },
			});
			setSelected("");
			toast({
				title: "Language added",
				description: `${selected} added to your known languages.`,
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to add language.",
				variant: "destructive",
			});
		}
	};

	const handleRemove = async (language: string) => {
		if (!character) return;
		const next = languages.filter((l) => l !== language);
		try {
			await updateCharacter.mutateAsync({
				id: characterId,
				data: { languages: next },
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to remove language.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Languages className="w-4 h-4" />
					Languages
					<Badge variant="outline" className="text-xs ml-auto">
						{languages.length} known
					</Badge>
				</CardTitle>
				<CardDescription className="text-xs">
					Languages granted by your job, background, and personal study.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					{languages.length === 0 ? (
						<span className="text-sm text-muted-foreground italic">
							No languages known yet.
						</span>
					) : (
						languages.map((language) => (
							<Badge key={language} variant="secondary" className="gap-1 pr-1">
								{language}
								<button
									type="button"
									onClick={() => handleRemove(language)}
									className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
									aria-label={`Remove ${language}`}
								>
									<X className="w-3 h-3" />
								</button>
							</Badge>
						))
					)}
				</div>
				<div className="flex items-center gap-2">
					<Select value={selected} onValueChange={setSelected}>
						<SelectTrigger className="flex-1 h-9 text-sm">
							<SelectValue placeholder="Add a language..." />
						</SelectTrigger>
						<SelectContent>
							{availableLanguages.map((lang) => (
								<SelectItem key={lang} value={lang}>
									{lang}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						onClick={handleAdd}
						disabled={!selected || updateCharacter.isPending}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
