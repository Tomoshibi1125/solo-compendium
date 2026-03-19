import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
	useCharacterSigilInscriptions,
	useCompendiumSigils,
	useInscribeSigil,
	useRemoveSigil,
	type SigilRow,
} from "@/hooks/useSigils";
import {
	getSigilSlotBonusForRarity,
	getEffectiveSigilSlots,
	getEquipmentSigilCategory,
} from "@/lib/sigilAutomation";
import { formatRegentVernacular } from "@/lib/vernacular";

export function SigilSlotsDialog({
	open,
	onOpenChange,
	characterId,
	equipment,
	onUpdateBaseSlots,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	characterId: string;
	equipment: {
		id: string;
		name: string;
		item_type: string | null;
		properties: unknown;
		rarity: string | null;
		sigil_slots_base?: number | null;
	};
	onUpdateBaseSlots: (nextBaseSlots: number) => Promise<void>;
}) {
	const { toast } = useToast();
	const { data: inscriptions = [] } = useCharacterSigilInscriptions(characterId);
	const { data: sigils = [] } = useCompendiumSigils(characterId);
	const inscribeSigil = useInscribeSigil();
	const removeSigil = useRemoveSigil();

	const [selectedSigilId, setSelectedSigilId] = useState<string>("");
	const [selectedSlot, setSelectedSlot] = useState<string>("0");
	const [baseSlotsDraft, setBaseSlotsDraft] = useState<string>(
		String(equipment.sigil_slots_base ?? 0),
	);

	const effectiveSlots = getEffectiveSigilSlots({
		sigil_slots_base: equipment.sigil_slots_base ?? 0,
		rarity: equipment.rarity,
	});
	const rarityBonus = getSigilSlotBonusForRarity(equipment.rarity);

	const equipmentCategory = getEquipmentSigilCategory({
		item_type: equipment.item_type,
		name: equipment.name,
		properties: Array.isArray(equipment.properties)
			? (equipment.properties as unknown as string[])
			: [],
	});

	const equipmentInscriptions = useMemo(() => {
		return inscriptions
			.filter((i) => i.equipment_id === equipment.id)
			.sort((a, b) => (a.slot_index ?? 0) - (b.slot_index ?? 0));
	}, [inscriptions, equipment.id]);

	const occupiedBySlot = useMemo(() => {
		const map = new Map<number, (typeof equipmentInscriptions)[number]>();
		for (const i of equipmentInscriptions) map.set(i.slot_index, i);
		return map;
	}, [equipmentInscriptions]);

	const compatibleSigils = useMemo(() => {
		return (sigils as SigilRow[]).filter((s) => {
			const allowed = Array.isArray(s.can_inscribe_on)
				? (s.can_inscribe_on as string[])
				: [];
			return allowed.includes(equipmentCategory) || allowed.includes("accessory");
		});
	}, [sigils, equipmentCategory]);

	const handleInscribe = async () => {
		const slotIndex = parseInt(selectedSlot, 10);
		if (!selectedSigilId) {
			toast({ title: "Select a sigil", variant: "destructive" });
			return;
		}
		if (!Number.isFinite(slotIndex) || slotIndex < 0 || slotIndex >= effectiveSlots) {
			toast({ title: "Invalid slot", variant: "destructive" });
			return;
		}
		if (occupiedBySlot.has(slotIndex)) {
			toast({ title: "Slot already occupied", variant: "destructive" });
			return;
		}

		try {
			await inscribeSigil.mutateAsync({
				characterId,
				equipmentId: equipment.id,
				sigilId: selectedSigilId,
				slotIndex,
			});
			toast({
				title: "Sigil inscribed",
				description: `${formatRegentVernacular(equipment.name)} updated.`,
			});
			setSelectedSigilId("");
		} catch (e) {
			toast({
				title: "Failed to inscribe sigil",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	const handleSaveBaseSlots = async () => {
		const parsed = parseInt(baseSlotsDraft, 10);
		const next = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
		try {
			await onUpdateBaseSlots(next);
			toast({ title: "Base slots updated" });
		} catch (e) {
			toast({
				title: "Failed to update base slots",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	const handleRemove = async (inscriptionId: string) => {
		try {
			await removeSigil.mutateAsync({ characterId, inscriptionId });
			toast({ title: "Sigil removed" });
		} catch (e) {
			toast({
				title: "Failed to remove sigil",
				description: e instanceof Error ? e.message : "Unknown error",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Sigil Slots</DialogTitle>
					<DialogDescription>
						{formatRegentVernacular(equipment.name)} ({equipmentCategory})
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							Slots: {equipmentInscriptions.length}/{effectiveSlots}
						</Badge>
						{equipment.rarity && (
							<Badge variant="outline" className="capitalize">
								{equipment.rarity}
							</Badge>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
						<div className="space-y-1">
							<Label
								htmlFor="sigil-base-slots"
								className="text-xs text-muted-foreground"
							>
								Base Slots
							</Label>
							<input
								id="sigil-base-slots"
								aria-label="Base Sigil Slots"
								className="w-full h-10 rounded-md border bg-background px-3 text-sm"
								type="number"
								min={0}
								value={baseSlotsDraft}
								onChange={(e) => setBaseSlotsDraft(e.target.value)}
							/>
						</div>
						<div className="space-y-1">
							<div className="text-xs text-muted-foreground">Rarity Bonus</div>
							<div className="h-10 px-3 rounded-md border bg-muted/30 flex items-center text-sm">
								+{rarityBonus}
							</div>
						</div>
						<div>
							<Button
								variant="outline"
								className="w-full"
								onClick={handleSaveBaseSlots}
							>
								Save Base Slots
							</Button>
						</div>
					</div>

					{effectiveSlots <= 0 ? (
						<div className="text-sm text-muted-foreground">
							This item has no sigil slots.
						</div>
					) : (
						<div className="space-y-2">
							{Array.from({ length: effectiveSlots }).map((_, idx) => {
								const existing = occupiedBySlot.get(idx);
								return (
									<div
										key={idx}
										className="p-3 rounded-lg border bg-muted/30 flex items-center justify-between"
									>
										<div className="min-w-0">
											<div className="text-xs text-muted-foreground">Slot {idx + 1}</div>
											<div className="font-heading font-semibold truncate">
												{existing?.sigil?.name
													? formatRegentVernacular(existing.sigil.name)
													: "Empty"}
											</div>
											{existing?.sigil?.effect_description && (
												<div className="text-xs text-muted-foreground line-clamp-1">
													{formatRegentVernacular(existing.sigil.effect_description)}
												</div>
											)}
										</div>
										{existing ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleRemove(existing.id)}
												disabled={removeSigil.isPending}
											>
												Remove
											</Button>
										) : (
											<span className="text-xs text-muted-foreground">—</span>
										)}
									</div>
								);
							})}
						</div>
					)}

					{effectiveSlots > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
							<div className="space-y-1">
								<div className="text-xs text-muted-foreground">Slot</div>
								<Select value={selectedSlot} onValueChange={setSelectedSlot}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Array.from({ length: effectiveSlots }).map((_, idx) => (
											<SelectItem key={idx} value={String(idx)}>
												{idx + 1}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-1 md:col-span-2">
								<div className="text-xs text-muted-foreground">Sigil</div>
								<Select value={selectedSigilId} onValueChange={setSelectedSigilId}>
									<SelectTrigger>
										<SelectValue placeholder="Select a sigil..." />
									</SelectTrigger>
									<SelectContent>
										{compatibleSigils.map((s: SigilRow) => (
											<SelectItem key={s.id} value={s.id}>
												{formatRegentVernacular(s.name)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="md:col-span-3">
								<Button
									onClick={handleInscribe}
									disabled={inscribeSigil.isPending}
									className="w-full"
								>
									Inscribe Sigil
								</Button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
