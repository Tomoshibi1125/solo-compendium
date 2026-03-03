import {
	Dice5,
	Moon,
	Plus,
	PlusCircle,
	ScrollText,
	Tent,
	X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGlobalDDBeyondIntegration } from "@/hooks/useGlobalDDBeyondIntegration";
import { cn } from "@/lib/utils";
import { AddEquipmentDialog } from "./AddEquipmentDialog";

interface CharacterFABProps {
	characterId: string;
	campaignId?: string;
	onShortRest: () => void;
	onLongRest: () => void;
}

export function CharacterFAB({
	characterId,
	campaignId,
	onShortRest,
	onLongRest,
}: CharacterFABProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [addItemOpen, setAddItemOpen] = useState(false);
	const { usePlayerToolsEnhancements } = useGlobalDDBeyondIntegration();
	const { rollInCampaign } = usePlayerToolsEnhancements();

	const toggleOpen = () => setIsOpen(!isOpen);

	const handleCustomRoll = () => {
		// In a full implementation, this might open a dice roller modal
		rollInCampaign(campaignId || "local", {
			dice_formula: "1d20",
			result: Math.floor(Math.random() * 20) + 1,
			rolls: [Math.floor(Math.random() * 20) + 1],
			roll_type: "ability",
			context: "Quick Custom Roll",
			character_id: characterId,
		});
		setIsOpen(false);
	};

	return (
		<>
			<div className="fixed bottom-20 right-4 sm:right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
				{/* Expanded Menu Actions */}
				<div
					className={cn(
						"flex flex-col gap-3 transition-all duration-200 pointer-events-auto",
						isOpen
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10 pointer-events-none",
					)}
				>
					<Button
						variant="secondary"
						size="sm"
						className="rounded-full shadow-lg gap-2 justify-end px-4 h-10 w-fit self-end bg-card border-border"
						onClick={() => {
							onLongRest();
							setIsOpen(false);
						}}
					>
						<span>Long Rest</span>
						<Moon className="w-4 h-4 text-indigo-400" />
					</Button>

					<Button
						variant="secondary"
						size="sm"
						className="rounded-full shadow-lg gap-2 justify-end px-4 h-10 w-fit self-end bg-card border-border"
						onClick={() => {
							onShortRest();
							setIsOpen(false);
						}}
					>
						<span>Short Rest</span>
						<Tent className="w-4 h-4 text-emerald-400" />
					</Button>

					<Button
						variant="secondary"
						size="sm"
						className="rounded-full shadow-lg gap-2 justify-end px-4 h-10 w-fit self-end bg-card border-border"
						onClick={() => {
							setAddItemOpen(true);
							setIsOpen(false);
						}}
					>
						<span>Add Item</span>
						<PlusCircle className="w-4 h-4 text-amber-400" />
					</Button>

					<Button
						variant="secondary"
						size="sm"
						className="rounded-full shadow-lg gap-2 justify-end px-4 h-10 w-fit self-end bg-card border-border"
						onClick={handleCustomRoll}
					>
						<span>Roll Dice</span>
						<Dice5 className="w-4 h-4 text-purple-400" />
					</Button>
				</div>

				{/* Main FAB Toggle */}
				<Button
					size="icon"
					className={cn(
						"rounded-full shadow-xl w-14 h-14 pointer-events-auto transition-transform duration-200",
						isOpen
							? "bg-secondary text-secondary-foreground rotate-45"
							: "bg-primary text-primary-foreground hover:scale-105",
					)}
					onClick={toggleOpen}
					aria-label="Quick Actions"
				>
					<Plus
						className={cn("w-6 h-6 transition-all", isOpen ? "scale-110" : "")}
					/>
				</Button>
			</div>

			<AddEquipmentDialog
				open={addItemOpen}
				onOpenChange={setAddItemOpen}
				characterId={characterId}
			/>
		</>
	);
}
