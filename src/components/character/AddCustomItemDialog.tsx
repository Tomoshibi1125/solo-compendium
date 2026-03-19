import { Plus } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEquipment } from "@/hooks/useEquipment";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";

export function AddCustomItemDialog({
	open,
	onOpenChange,
	characterId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
}) {
	const { addEquipment } = useEquipment(characterId);
	const { toast } = useToast();
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const ddbEnhancements = usePlayerToolsEnhancements();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [itemType, setItemType] = useState("item");
	const [weight, setWeight] = useState("");
	const [quantity, setQuantity] = useState("1");

	// Custom Modifiers
	const [acBonus, setAcBonus] = useState("");
	const [attackBonus, setAttackBonus] = useState("");
	const [damageBonus, setDamageBonus] = useState("");

	// Flags
	const [requiresAttunement, setRequiresAttunement] = useState(false);
	const [isContainer, setIsContainer] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			toast({ title: "Name required", variant: "destructive" });
			return;
		}

		try {
			const customModifiers: Record<string, number> = {};
			if (acBonus) customModifiers.acBonus = parseInt(acBonus, 10);
			if (attackBonus) customModifiers.attackBonus = parseInt(attackBonus, 10);
			if (damageBonus) customModifiers.damageBonus = parseInt(damageBonus, 10);

			const propsArray = [];
			if (customModifiers.acBonus)
				propsArray.push(
					`${customModifiers.acBonus >= 0 ? "+" : ""}${customModifiers.acBonus} AC`,
				);
			if (customModifiers.attackBonus)
				propsArray.push(
					`${customModifiers.attackBonus >= 0 ? "+" : ""}${customModifiers.attackBonus} to attack`,
				);
			if (customModifiers.damageBonus)
				propsArray.push(
					`${customModifiers.damageBonus >= 0 ? "+" : ""}${customModifiers.damageBonus} to damage`,
				);

			await addEquipment({
				character_id: characterId,
				name: name.trim(),
				item_type: itemType,
				description: description.trim() || null,
				weight: weight ? parseFloat(weight) : null,
				quantity: parseInt(quantity, 10) || 1,
				requires_attunement: requiresAttunement,
				is_container: isContainer,
				properties: propsArray,
				custom_modifiers:
					Object.keys(customModifiers).length > 0 ? customModifiers : null,
			});

			toast({
				title: "Custom Item Created",
				description: `${name} added to your inventory.`,
			});

			ddbEnhancements
				.trackInventoryChange(characterId, name.trim(), "add")
				.catch(console.error);

			// Reset state and close
			setName("");
			setDescription("");
			setItemType("item");
			setWeight("");
			setQuantity("1");
			setAcBonus("");
			setAttackBonus("");
			setDamageBonus("");
			setRequiresAttunement(false);
			setIsContainer(false);
			onOpenChange(false);
		} catch {
			toast({
				title: "Error",
				description: "Failed to create custom item.",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Custom Item</DialogTitle>
						<DialogDescription>
							Add a homebrew or custom item directly to your inventory.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Item Name</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="e.g. Grandma's Locket"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-2">
								<Label htmlFor="itemType">Item Type</Label>
								<Select value={itemType} onValueChange={setItemType}>
									<SelectTrigger id="itemType">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="item">Item</SelectItem>
										<SelectItem value="weapon">Weapon</SelectItem>
										<SelectItem value="armor">Armor</SelectItem>
										<SelectItem value="consumable">Consumable</SelectItem>
										<SelectItem value="gear">Gear</SelectItem>
										<SelectItem value="tool">Tool</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="weight">Weight (lbs)</Label>
								<Input
									id="weight"
									type="number"
									step="0.5"
									min="0"
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
									placeholder="e.g. 2.5"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What does this item do or look like?"
							/>
						</div>

						<div className="grid grid-cols-3 gap-4 border p-3 rounded-md bg-muted/20">
							<div className="col-span-3 pb-1 border-b">
								<Label className="text-xs text-muted-foreground uppercase tracking-wider">
									Custom Modifiers
								</Label>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="acBonus" className="text-xs">
									AC Bonus
								</Label>
								<Input
									id="acBonus"
									type="number"
									value={acBonus}
									onChange={(e) => setAcBonus(e.target.value)}
									placeholder="+1"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="attackBonus" className="text-xs">
									Attack Bonus
								</Label>
								<Input
									id="attackBonus"
									type="number"
									value={attackBonus}
									onChange={(e) => setAttackBonus(e.target.value)}
									placeholder="+1"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="damageBonus" className="text-xs">
									Damage Bonus
								</Label>
								<Input
									id="damageBonus"
									type="number"
									value={damageBonus}
									onChange={(e) => setDamageBonus(e.target.value)}
									placeholder="+1"
								/>
							</div>
						</div>

						<div className="flex gap-4 items-center">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="attunement"
									checked={requiresAttunement}
									onCheckedChange={(v) => setRequiresAttunement(!!v)}
								/>
								<Label htmlFor="attunement">Requires Attunement</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="container"
									checked={isContainer}
									onCheckedChange={(v) => setIsContainer(!!v)}
								/>
								<Label htmlFor="container">Is Container</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit">
							<Plus className="w-4 h-4 mr-2" />
							Create Item
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
