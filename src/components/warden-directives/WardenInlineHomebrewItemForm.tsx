import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { HomebrewItemFormState } from "@/lib/wardenItemHomebrew";

const ITEM_TYPE_OPTIONS = [
	["weapon", "Weapon"],
	["armor", "Armor"],
	["shield", "Shield"],
	["gear", "Gear"],
	["tool", "Tool"],
	["consumable", "Consumable"],
	["relic", "Relic"],
	["rune", "Rune"],
	["sigil", "Sigil"],
	["tattoo", "Tattoo"],
	["artifact", "Artifact"],
] as const;

const RARITY_OPTIONS = [
	["none", "None"],
	["common", "Common"],
	["uncommon", "Uncommon"],
	["rare", "Rare"],
	["very-rare", "Very Rare"],
	["epic", "Epic"],
	["legendary", "Legendary"],
	["artifact", "Artifact"],
] as const;

export function WardenInlineHomebrewItemForm({
	form,
	onChange,
	onUse,
	onSaveAndUse,
	isSaving,
}: {
	form: HomebrewItemFormState;
	onChange: <K extends keyof HomebrewItemFormState>(
		key: K,
		value: HomebrewItemFormState[K],
	) => void;
	onUse: () => void;
	onSaveAndUse: () => void;
	isSaving: boolean;
}) {
	return (
		<div className="rounded border border-border/60 p-3 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-name">Item Name</Label>
					<Input
						id="homebrew-item-name"
						value={form.name}
						onChange={(event) => onChange("name", event.target.value)}
						placeholder="Resonance Blade"
					/>
				</div>
				<div className="space-y-2">
					<Label>Item Type</Label>
					<Select
						value={form.itemType}
						onValueChange={(value) => onChange("itemType", value)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ITEM_TYPE_OPTIONS.map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>Rarity</Label>
					<Select
						value={form.rarity}
						onValueChange={(value) => onChange("rarity", value)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{RARITY_OPTIONS.map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-source">Source</Label>
					<Input
						id="homebrew-item-source"
						value={form.sourceBook}
						onChange={(event) => onChange("sourceBook", event.target.value)}
						placeholder="Campaign Homebrew"
					/>
				</div>
				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="homebrew-item-description">Description</Label>
					<Textarea
						id="homebrew-item-description"
						value={form.description}
						onChange={(event) => onChange("description", event.target.value)}
						placeholder="Appearance, lore, activation rules, and item behavior."
						className="min-h-24"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-weight">Weight</Label>
					<Input
						id="homebrew-item-weight"
						type="number"
						step="0.1"
						min="0"
						value={form.weight}
						onChange={(event) => onChange("weight", event.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-value">Value</Label>
					<Input
						id="homebrew-item-value"
						type="number"
						min="0"
						value={form.valueCredits}
						onChange={(event) => onChange("valueCredits", event.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-charges">Charges</Label>
					<Input
						id="homebrew-item-charges"
						type="number"
						min="0"
						value={form.charges}
						onChange={(event) => onChange("charges", event.target.value)}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="homebrew-item-tags">Tags</Label>
					<Input
						id="homebrew-item-tags"
						value={form.tagsText}
						onChange={(event) => onChange("tagsText", event.target.value)}
						placeholder="blade, mana"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<FieldInput
					label="Weapon Damage"
					id="homebrew-item-damage"
					value={form.damage}
					onChange={(value) => onChange("damage", value)}
					placeholder="1d8"
				/>
				<FieldInput
					label="Damage Type"
					id="homebrew-item-damage-type"
					value={form.damageType}
					onChange={(value) => onChange("damageType", value)}
					placeholder="force"
				/>
				<FieldInput
					label="Armor Class"
					id="homebrew-item-ac"
					value={form.armorClass}
					onChange={(value) => onChange("armorClass", value)}
					placeholder="16"
				/>
				<FieldInput
					label="Armor Type"
					id="homebrew-item-armor-type"
					value={form.armorType}
					onChange={(value) => onChange("armorType", value)}
					placeholder="light, medium, heavy"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<FieldInput
					label="AC Bonus"
					id="homebrew-item-ac-bonus"
					type="number"
					value={form.acBonus}
					onChange={(value) => onChange("acBonus", value)}
					placeholder="+1"
				/>
				<FieldInput
					label="Attack Bonus"
					id="homebrew-item-attack-bonus"
					type="number"
					value={form.attackBonus}
					onChange={(value) => onChange("attackBonus", value)}
					placeholder="+1"
				/>
				<FieldInput
					label="Damage Bonus"
					id="homebrew-item-damage-bonus"
					type="number"
					value={form.damageBonus}
					onChange={(value) => onChange("damageBonus", value)}
					placeholder="+1"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<FieldInput
					label="Resistances"
					id="homebrew-item-resistances"
					value={form.resistancesText}
					onChange={(value) => onChange("resistancesText", value)}
					placeholder="fire, cold"
				/>
				<FieldInput
					label="Immunities"
					id="homebrew-item-immunities"
					value={form.immunitiesText}
					onChange={(value) => onChange("immunitiesText", value)}
					placeholder="poison"
				/>
				<FieldInput
					label="Vulnerabilities"
					id="homebrew-item-vulnerabilities"
					value={form.vulnerabilitiesText}
					onChange={(value) => onChange("vulnerabilitiesText", value)}
					placeholder="radiant"
				/>
				<FieldInput
					label="Condition Immunities"
					id="homebrew-item-condition-immunities"
					value={form.conditionImmunitiesText}
					onChange={(value) => onChange("conditionImmunitiesText", value)}
					placeholder="frightened, poisoned"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="homebrew-item-properties">
					Additional Usable Properties
				</Label>
				<Textarea
					id="homebrew-item-properties"
					value={form.propertiesText}
					onChange={(event) => onChange("propertiesText", event.target.value)}
					placeholder={"+2 to Investigation\nFinesse\nStealth disadvantage"}
					className="min-h-24 font-mono text-xs"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Label className="flex items-center gap-2 rounded border border-border/60 p-3">
					<Checkbox
						checked={form.requiresAttunement}
						onCheckedChange={(value) =>
							onChange("requiresAttunement", Boolean(value))
						}
					/>
					<span>Requires Attunement</span>
				</Label>
				<Label className="flex items-center gap-2 rounded border border-border/60 p-3">
					<Checkbox
						checked={form.isContainer}
						onCheckedChange={(value) => onChange("isContainer", Boolean(value))}
					/>
					<span>Container</span>
				</Label>
				<FieldInput
					label="Capacity Weight"
					id="homebrew-item-capacity-weight"
					type="number"
					value={form.capacityWeight}
					onChange={(value) => onChange("capacityWeight", value)}
				/>
				<FieldInput
					label="Capacity Volume"
					id="homebrew-item-capacity-volume"
					type="number"
					value={form.capacityVolume}
					onChange={(value) => onChange("capacityVolume", value)}
				/>
			</div>

			<div className="flex flex-col sm:flex-row justify-end gap-2">
				<Button type="button" variant="outline" onClick={onUse}>
					Use Without Saving
				</Button>
				<Button type="button" onClick={onSaveAndUse} disabled={isSaving}>
					{isSaving ? "Saving..." : "Save to Campaign Library & Use"}
				</Button>
			</div>
		</div>
	);
}

function FieldInput({
	label,
	id,
	type = "text",
	value,
	onChange,
	placeholder,
}: {
	label: string;
	id: string;
	type?: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}) {
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
			/>
		</div>
	);
}
