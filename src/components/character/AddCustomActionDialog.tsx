/**
 * AddCustomActionDialog — editor for CustomAction (R1 of Round 2).
 * Persistence is handled by the parent CustomActionsList.
 */
import { Sparkles } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDialogSwipeClose } from "@/hooks/useDialogSwipeClose";
import { type CustomAction, createCustomAction } from "@/lib/customActions";
import type { AbilityScore } from "@/types/core-rules";

interface AddCustomActionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: CustomAction | null;
	onSave: (action: CustomAction) => void;
}

const ABILITIES: AbilityScore[] = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"];

const ACTION_TYPES: ReadonlyArray<{
	value: CustomAction["actionType"];
	label: string;
}> = [
	{ value: "action", label: "Action" },
	{ value: "bonus-action", label: "Bonus Action" },
	{ value: "reaction", label: "Reaction" },
	{ value: "free", label: "Free" },
	{ value: "other", label: "Other" },
];

const ATTACK_TYPES: ReadonlyArray<{
	value: NonNullable<CustomAction["attackType"]>;
	label: string;
}> = [
	{ value: "none", label: "None" },
	{ value: "melee", label: "Melee" },
	{ value: "ranged", label: "Ranged" },
	{ value: "spell", label: "Spell" },
];

export function AddCustomActionDialog({
	open,
	onOpenChange,
	initial,
	onSave,
}: AddCustomActionDialogProps) {
	const [name, setName] = useState("");
	const [actionType, setActionType] =
		useState<CustomAction["actionType"]>("action");
	const [attackType, setAttackType] =
		useState<NonNullable<CustomAction["attackType"]>>("none");
	const [attackAbility, setAttackAbility] = useState<AbilityScore>("STR");
	const [damageDice, setDamageDice] = useState("");
	const [damageType, setDamageType] = useState("");
	const [damageAbility, setDamageAbility] = useState<AbilityScore | "">("");
	const [saveAbility, setSaveAbility] = useState<AbilityScore | "">("");
	const [range, setRange] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (open) {
			setName(initial?.name ?? "");
			setActionType(initial?.actionType ?? "action");
			setAttackType(initial?.attackType ?? "none");
			setAttackAbility((initial?.attackAbility as AbilityScore) ?? "STR");
			setDamageDice(initial?.damageDice ?? "");
			setDamageType(initial?.damageType ?? "");
			setDamageAbility((initial?.damageAbility as AbilityScore) ?? "");
			setSaveAbility((initial?.saveAbility as AbilityScore) ?? "");
			setRange(initial?.range ?? "");
			setDescription(initial?.description ?? "");
		}
	}, [open, initial]);

	const handleSubmit = () => {
		if (!name.trim()) return;
		const next: CustomAction = initial
			? {
					...initial,
					name: name.trim(),
					actionType,
					attackType,
					attackAbility: attackType !== "none" ? attackAbility : undefined,
					attackBonus: attackType !== "none" ? "auto" : undefined,
					damageDice: damageDice.trim() || undefined,
					damageType: damageType.trim() || undefined,
					damageAbility: (damageAbility || undefined) as
						| AbilityScore
						| undefined,
					saveAbility: (saveAbility || undefined) as AbilityScore | undefined,
					saveDC: saveAbility ? "auto" : undefined,
					range: range.trim() || undefined,
					description: description.trim() || undefined,
				}
			: createCustomAction({
					name: name.trim(),
					actionType,
					attackType,
					attackAbility: attackType !== "none" ? attackAbility : undefined,
					attackBonus: attackType !== "none" ? "auto" : undefined,
					damageDice: damageDice.trim() || undefined,
					damageType: damageType.trim() || undefined,
					damageAbility: (damageAbility || undefined) as
						| AbilityScore
						| undefined,
					saveAbility: (saveAbility || undefined) as AbilityScore | undefined,
					saveDC: saveAbility ? "auto" : undefined,
					range: range.trim() || undefined,
					description: description.trim() || undefined,
				});
		onSave(next);
	};

	const bindSwipeClose = useDialogSwipeClose(() => onOpenChange(false));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-lg touch-pan-y"
				data-testid="custom-action-dialog"
				{...bindSwipeClose()}
			>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="w-5 h-5 text-fuchsia-300" />
						{initial ? "Edit Custom Action" : "Add Custom Action"}
					</DialogTitle>
					<DialogDescription>
						Auto-calculates attack bonus, damage formula, and save DC from your
						stats. Set attack to "Auto" with an ability and the formula uses
						your proficiency bonus + ability modifier.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
					<div className="space-y-2">
						<Label htmlFor="custom-action-name">Name</Label>
						<Input
							id="custom-action-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Soul Sword Strike"
							autoFocus
							data-testid="custom-action-name-input"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="custom-action-type">Action Type</Label>
							<Select
								value={actionType}
								onValueChange={(v) =>
									setActionType(v as CustomAction["actionType"])
								}
							>
								<SelectTrigger id="custom-action-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ACTION_TYPES.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="custom-action-attack-type">Attack Type</Label>
							<Select
								value={attackType}
								onValueChange={(v) =>
									setAttackType(v as NonNullable<CustomAction["attackType"]>)
								}
							>
								<SelectTrigger id="custom-action-attack-type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ATTACK_TYPES.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{attackType !== "none" && (
						<div className="space-y-2">
							<Label htmlFor="custom-action-attack-ability">
								Attack Ability (auto: ability mod + PB)
							</Label>
							<Select
								value={attackAbility}
								onValueChange={(v) => setAttackAbility(v as AbilityScore)}
							>
								<SelectTrigger id="custom-action-attack-ability">
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
					)}

					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="custom-action-damage-dice">Damage Dice</Label>
							<Input
								id="custom-action-damage-dice"
								value={damageDice}
								onChange={(e) => setDamageDice(e.target.value)}
								placeholder="2d6"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="custom-action-damage-type">Damage Type</Label>
							<Input
								id="custom-action-damage-type"
								value={damageType}
								onChange={(e) => setDamageType(e.target.value)}
								placeholder="slashing"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<div className="space-y-2">
							<Label htmlFor="custom-action-damage-ability">
								Damage Ability (optional)
							</Label>
							<Select
								value={damageAbility || "_none"}
								onValueChange={(v) =>
									setDamageAbility(v === "_none" ? "" : (v as AbilityScore))
								}
							>
								<SelectTrigger id="custom-action-damage-ability">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="_none">None</SelectItem>
									{ABILITIES.map((a) => (
										<SelectItem key={a} value={a}>
											{a}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="custom-action-save-ability">
								Save Ability (optional)
							</Label>
							<Select
								value={saveAbility || "_none"}
								onValueChange={(v) =>
									setSaveAbility(v === "_none" ? "" : (v as AbilityScore))
								}
							>
								<SelectTrigger id="custom-action-save-ability">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="_none">None</SelectItem>
									{ABILITIES.map((a) => (
										<SelectItem key={a} value={a}>
											{a}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="custom-action-range">Range</Label>
						<Input
							id="custom-action-range"
							value={range}
							onChange={(e) => setRange(e.target.value)}
							placeholder="30 ft, Self, Touch"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="custom-action-description">Description</Label>
						<Textarea
							id="custom-action-description"
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Optional flavor and rules text"
						/>
					</div>
				</div>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!name.trim()}
						data-testid="custom-action-save-btn"
					>
						{initial ? "Update" : "Add"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
