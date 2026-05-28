import { Hammer, Plus, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCharacter, useUpdateCharacter } from "@/hooks/useCharacters";

interface ToolProficienciesPanelProps {
	characterId: string;
	className?: string;
}

export function ToolProficienciesPanel({
	characterId,
	className,
}: ToolProficienciesPanelProps) {
	const { data: character } = useCharacter(characterId);
	const updateCharacter = useUpdateCharacter();
	const { toast } = useToast();
	const [draft, setDraft] = useState("");

	const tools = useMemo(() => {
		const raw = (
			character as { tool_proficiencies?: string[] | null } | undefined
		)?.tool_proficiencies;
		return Array.isArray(raw) ? raw : [];
	}, [character]);

	const handleAdd = async () => {
		const trimmed = draft.trim();
		if (!trimmed || !character) return;
		if (tools.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
			toast({ title: "Already proficient", description: trimmed });
			return;
		}
		const next = [...tools, trimmed];
		try {
			await updateCharacter.mutateAsync({
				id: characterId,
				data: { tool_proficiencies: next },
			});
			setDraft("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to add tool proficiency.",
				variant: "destructive",
			});
		}
	};

	const handleRemove = async (tool: string) => {
		if (!character) return;
		const next = tools.filter((t) => t !== tool);
		try {
			await updateCharacter.mutateAsync({
				id: characterId,
				data: { tool_proficiencies: next },
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to remove tool proficiency.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Hammer className="w-4 h-4" />
					Tool Proficiencies
					<Badge variant="outline" className="text-xs ml-auto">
						{tools.length}
					</Badge>
				</CardTitle>
				<CardDescription className="text-xs">
					Tools you can use with proficiency. Granted by job, background, and
					training.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex flex-wrap gap-2">
					{tools.length === 0 ? (
						<span className="text-sm text-muted-foreground italic">
							No tool proficiencies yet.
						</span>
					) : (
						tools.map((tool) => (
							<Badge key={tool} variant="secondary" className="gap-1 pr-1">
								{tool}
								<button
									type="button"
									onClick={() => handleRemove(tool)}
									className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
									aria-label={`Remove ${tool}`}
								>
									<X className="w-3 h-3" />
								</button>
							</Badge>
						))
					)}
				</div>
				<div className="flex items-center gap-2">
					<Input
						placeholder="Add a tool (e.g. Thieves' Tools)"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleAdd();
							}
						}}
						className="h-9 text-sm"
					/>
					<Button
						size="sm"
						onClick={handleAdd}
						disabled={!draft.trim() || updateCharacter.isPending}
					>
						<Plus className="w-4 h-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
