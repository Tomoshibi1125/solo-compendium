/**
 * CustomSkillsList — DDB parity (R4 of Round 2). Lets the player insert
 * arbitrary skill rows beyond the canonical RA skill set (e.g. "Custom
 * Skill: Streetwise +5"). Persists into
 * `character_sheet_state.resources.customSkills`.
 *
 * Roll integration: each row is clickable and emits a roll via the
 * provided `onRoll` callback. Auto-mode uses the chosen ability
 * modifier + proficiency / expertise like the canonical skills.
 */
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCharacterSheetState } from "@/hooks/useCharacterSheetState";
import {
	formatModifier,
	getAbilityModifier,
} from "@/lib/characterCalculations";
import type { AbilityScore } from "@/types/core-rules";

export interface CustomSkill {
	id: string;
	name: string;
	ability: AbilityScore;
	proficient: boolean;
	expertise: boolean;
	bonus: number;
	notes?: string;
}

interface CustomSkillsListProps {
	characterId: string;
	abilities: Record<AbilityScore, number>;
	proficiencyBonus: number;
	readOnly?: boolean;
	onRoll?: (skill: CustomSkill, modifier: number) => void;
}

interface CharacterResourcesWithCustomSkills {
	customSkills?: CustomSkill[];
}

const ABILITIES: AbilityScore[] = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"];

function computeModifier(
	skill: CustomSkill,
	abilities: Record<AbilityScore, number>,
	proficiencyBonus: number,
): number {
	const abilityMod = getAbilityModifier(abilities[skill.ability]);
	const profMultiplier = skill.expertise ? 2 : skill.proficient ? 1 : 0;
	return abilityMod + profMultiplier * proficiencyBonus + (skill.bonus ?? 0);
}

export function CustomSkillsList({
	characterId,
	abilities,
	proficiencyBonus,
	readOnly,
	onRoll,
}: CustomSkillsListProps) {
	const { toast } = useToast();
	const sheet = useCharacterSheetState(characterId);

	const customSkills: CustomSkill[] = useMemo(() => {
		const resources = sheet.state.resources as unknown as
			| CharacterResourcesWithCustomSkills
			| undefined;
		return Array.isArray(resources?.customSkills)
			? (resources.customSkills as CustomSkill[])
			: [];
	}, [sheet.state.resources]);

	const [editorOpen, setEditorOpen] = useState(false);
	const [editing, setEditing] = useState<CustomSkill | null>(null);
	const [name, setName] = useState("");
	const [ability, setAbility] = useState<AbilityScore>("INT");
	const [proficient, setProficient] = useState(false);
	const [expertise, setExpertise] = useState(false);
	const [bonus, setBonus] = useState(0);
	const [notes, setNotes] = useState("");

	const openAdd = () => {
		setEditing(null);
		setName("");
		setAbility("INT");
		setProficient(false);
		setExpertise(false);
		setBonus(0);
		setNotes("");
		setEditorOpen(true);
	};

	const openEdit = (skill: CustomSkill) => {
		setEditing(skill);
		setName(skill.name);
		setAbility(skill.ability);
		setProficient(skill.proficient);
		setExpertise(skill.expertise);
		setBonus(skill.bonus);
		setNotes(skill.notes ?? "");
		setEditorOpen(true);
	};

	const persist = (next: CustomSkill[]) => {
		void sheet.saveSheetState({
			resources: {
				...(sheet.state.resources as unknown as Record<string, unknown>),
				customSkills: next,
			} as unknown as typeof sheet.state.resources,
		});
	};

	const handleSave = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		const draft: CustomSkill = {
			id: editing?.id ?? crypto.randomUUID(),
			name: trimmed,
			ability,
			proficient,
			expertise,
			bonus: Number.isFinite(bonus) ? bonus : 0,
			notes: notes.trim() || undefined,
		};
		const next = editing
			? customSkills.map((s) => (s.id === editing.id ? draft : s))
			: [...customSkills, draft];
		persist(next);
		toast({
			title: editing ? "Custom skill updated" : "Custom skill added",
			description: draft.name,
		});
		setEditorOpen(false);
	};

	const handleDelete = (id: string) => {
		persist(customSkills.filter((s) => s.id !== id));
	};

	return (
		<section className="space-y-2 mt-4">
			<h3 className="text-[10px] font-mono text-resurge-violet font-bold uppercase tracking-[0.2em] px-2 mb-2 border-l-2 border-resurge-violet">
				CUSTOM_SKILLS
			</h3>
			<div className="flex flex-col gap-1">
				{customSkills.map((skill) => {
					const modifier = computeModifier(skill, abilities, proficiencyBonus);
					return (
						<div
							key={skill.id}
							className="group flex items-center justify-between px-2 py-1.5 rounded-[2px] border border-resurge-violet/20 bg-black/20"
							data-testid={`custom-skill-row-${skill.id}`}
						>
							<button
								type="button"
								onClick={() => onRoll?.(skill, modifier)}
								className="flex-1 flex items-center gap-2 min-w-0 text-left"
								aria-label={`Roll ${skill.name}`}
							>
								<span className="text-xs font-heading font-medium truncate text-white/80">
									{skill.name}
								</span>
								<span className="text-[9px] font-mono text-resurge-violet/60 uppercase">
									{skill.ability.substring(0, 3)}
								</span>
								{(skill.proficient || skill.expertise) && (
									<span className="text-[8px] font-mono uppercase tracking-widest rounded border px-1 py-0.5 text-resurge-violet/80 border-resurge-violet/30 bg-resurge-violet/5">
										{skill.expertise ? "EXP" : "PROF"}
									</span>
								)}
								<span className="ml-auto text-xs font-display font-bold text-white/90">
									{formatModifier(modifier)}
								</span>
							</button>
							{!readOnly && (
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										size="sm"
										variant="ghost"
										onClick={() => openEdit(skill)}
										aria-label={`Edit ${skill.name}`}
										className="h-6 w-6 p-0"
									>
										<Pencil className="w-3 h-3" />
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => handleDelete(skill.id)}
										aria-label={`Delete ${skill.name}`}
										className="h-6 w-6 p-0 text-destructive"
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								</div>
							)}
						</div>
					);
				})}
				{!readOnly && (
					<Button
						variant="ghost"
						size="sm"
						onClick={openAdd}
						className="mt-1 h-7 gap-1.5 text-xs text-resurge-violet hover:text-resurge-violet hover:bg-resurge-violet/10"
						data-testid="custom-skill-add-btn"
					>
						<Plus className="w-3 h-3" />
						Add Custom Skill
					</Button>
				)}
			</div>

			<Dialog open={editorOpen} onOpenChange={setEditorOpen}>
				<DialogContent className="max-w-md" data-testid="custom-skill-dialog">
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit Custom Skill" : "Add Custom Skill"}
						</DialogTitle>
						<DialogDescription>
							Modifier auto-calculates: ability mod + (PB × prof / 2× expertise)
							+ flat bonus.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<div className="space-y-2">
							<Label htmlFor="custom-skill-name">Skill Name</Label>
							<Input
								id="custom-skill-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Streetwise"
								autoFocus
								data-testid="custom-skill-name-input"
							/>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="space-y-2">
								<Label htmlFor="custom-skill-ability">Ability</Label>
								<Select
									value={ability}
									onValueChange={(v) => setAbility(v as AbilityScore)}
								>
									<SelectTrigger id="custom-skill-ability">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ABILITIES.map((a) => (
											<SelectItem key={a} value={a}>
												{a}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="custom-skill-bonus">Flat Bonus</Label>
								<Input
									id="custom-skill-bonus"
									type="number"
									value={bonus}
									onChange={(e) =>
										setBonus(Number.parseInt(e.target.value, 10) || 0)
									}
								/>
							</div>
						</div>
						<div className="flex items-center gap-4 pt-1">
							<div className="flex items-center gap-2 text-sm">
								<Checkbox
									id="custom-skill-proficient"
									checked={proficient}
									onCheckedChange={(v) => setProficient(Boolean(v))}
								/>
								<Label
									htmlFor="custom-skill-proficient"
									className="cursor-pointer"
								>
									Proficient
								</Label>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Checkbox
									id="custom-skill-expertise"
									checked={expertise}
									onCheckedChange={(v) => {
										const next = Boolean(v);
										setExpertise(next);
										if (next) setProficient(true);
									}}
								/>
								<Label
									htmlFor="custom-skill-expertise"
									className="cursor-pointer"
								>
									Expertise
								</Label>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="custom-skill-notes">Notes (optional)</Label>
							<Input
								id="custom-skill-notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Where you'd use this skill"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="ghost" onClick={() => setEditorOpen(false)}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={!name.trim()}
							data-testid="custom-skill-save-btn"
						>
							{editing ? "Update" : "Add"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
