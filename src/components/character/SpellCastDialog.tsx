import { AlertCircle, Bolt, Book, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SpellSlotData } from "@/hooks/useSpellSlots";
import type { Database } from "@/integrations/supabase/types";

export type PowerRow = Database["public"]["Tables"]["character_powers"]["Row"];

interface SpellCastDialogProps {
	isOpen: boolean;
	onClose: () => void;
	power: PowerRow | null;
	availableSlots: SpellSlotData[];
	onConfirm: (castAtLevel: number, asRitual: boolean) => void;
}

export function SpellCastDialog({
	isOpen,
	onClose,
	power,
	availableSlots,
	onConfirm,
}: SpellCastDialogProps) {
	const [selectedLevel, setSelectedLevel] = useState<number>(0);
	const [castAsRitual, setCastAsRitual] = useState<boolean>(false);

	// Reset state when a new power is opened
	useMemo(() => {
		if (power) {
			setSelectedLevel(power.power_level);
			setCastAsRitual(false);
		}
	}, [power]);

	if (!power) return null;

	const baseLevel = power.power_level;
	const isCantrip = baseLevel === 0;
	// Identify available upcast levels (must have > 0 slots remaining)
	const upcastOptions = availableSlots.filter(
		(slot) => slot.level >= baseLevel && slot.current > 0,
	);

	// Ritual logic: The user wants Ritual powers to be castable bypassing slot needs.
	// For SA logic, let's treat it as isRitual if explicitly set in `power.isRitual` or conceptually any spell marked ritual.
	// However, `Power` might not have `isRitual` explicitly exposed in all structures.
	// We'll allow it if the mechanics contain ritual flags or if forced.
	// Assuming `power.tags` includes "Ritual" or `power.casting_time?.toLowerCase().includes("ritual")`
	const canCastAsRitual =
		(power as any).power?.tags?.includes("Ritual") ||
		power.casting_time?.toLowerCase().includes("ritual") ||
		false;

	const handleConfirm = () => {
		onConfirm(selectedLevel, castAsRitual);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-primary/20">
				<DialogHeader>
					<DialogTitle className="font-heading text-xl flex items-center gap-2 text-primary">
						<Sparkles className="w-5 h-5" />
						Cast: {power.name}
					</DialogTitle>
					<DialogDescription>
						{isCantrip
							? "Cantrips require no mana. Cast at will."
							: "Select the spell slot level to channel this power through."}
					</DialogDescription>
				</DialogHeader>

				<div className="py-4 space-y-6">
					{/* Ritual Casting Option */}
					{canCastAsRitual && !isCantrip && (
						<div className="p-3 border border-amber-500/20 bg-amber-500/5 rounded-lg space-y-2">
							<div className="flex items-center gap-2">
								<Book className="w-4 h-4 text-amber-500" />
								<Label className="font-bold text-amber-500">
									Ritual Casting
								</Label>
							</div>
							<p className="text-xs text-muted-foreground ml-6">
								Casting as a ritual takes 10 additional minutes but expends no
								spell slots.
							</p>
							<div className="ml-6 flex gap-2">
								<Button
									variant={castAsRitual ? "default" : "outline"}
									size="sm"
									className={
										castAsRitual
											? "bg-amber-600 hover:bg-amber-700"
											: "border-amber-600/50 text-amber-500 hover:bg-amber-600/20"
									}
									onClick={() => {
										setCastAsRitual(true);
										setSelectedLevel(baseLevel);
									}}
								>
									Cast as Ritual
								</Button>
								{castAsRitual && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setCastAsRitual(false)}
									>
										Cancel Ritual
									</Button>
								)}
							</div>
						</div>
					)}

					{/* Standard Slot Selection */}
					{!castAsRitual && !isCantrip && (
						<div className="space-y-3">
							<Label className="flex items-center gap-2">
								<Bolt className="w-4 h-4 text-primary" />
								Available Spell Slots
							</Label>

							{upcastOptions.length === 0 ? (
								<div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded text-sm">
									<AlertCircle className="w-4 h-4" />
									No valid spell slots available to cast this power.
								</div>
							) : (
								<RadioGroup
									value={selectedLevel.toString()}
									onValueChange={(val) => setSelectedLevel(parseInt(val, 10))}
									className="grid grid-cols-1 gap-2"
								>
									{upcastOptions.map((slot) => {
										const isBase = slot.level === baseLevel;
										return (
											<div
												key={slot.level}
												className="flex items-center space-x-2 border border-border/50 p-2 rounded-md hover:bg-accent/50 transition-colors"
											>
												<RadioGroupItem
													value={slot.level.toString()}
													id={`slot-${slot.level}`}
												/>
												<Label
													htmlFor={`slot-${slot.level}`}
													className="flex flex-1 justify-between items-center cursor-pointer"
												>
													<span className="font-medium">
														Level {slot.level} Slot
														{isBase && (
															<span className="text-muted-foreground ml-2 text-xs">
																(Base)
															</span>
														)}
													</span>
													<span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-mono">
														{slot.current} remaining
													</span>
												</Label>
											</div>
										);
									})}
								</RadioGroup>
							)}
						</div>
					)}

					{isCantrip && (
						<div className="text-center p-4 bg-muted/20 border border-border/50 rounded-lg text-muted-foreground text-sm">
							Ready to cast.
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						onClick={handleConfirm}
						disabled={!isCantrip && !castAsRitual && upcastOptions.length === 0}
					>
						Manifest Power
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
