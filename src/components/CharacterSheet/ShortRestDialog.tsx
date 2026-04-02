import { Dices, Heart, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useHitDiceSpending } from "@/hooks/useHitDiceSpending";
import { cn } from "@/lib/utils";

interface ShortRestDialogProps {
	hitDiceAvailable: number;
	hitDiceMax: number;
	hitDieSize: number;
	vitScore: number;
	hpCurrent: number;
	hpMax: number;
	onFinishRest: (totalRecovered: number, hitDiceSpent: number) => void;
	onHitDieSpent?: (result: {
		roll: number;
		vitModifier: number;
		hpRecovered: number;
		hitDieSize: number;
		hitDiceRemaining: number;
	}) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	characterId?: string;
}

export function ShortRestDialog({
	hitDiceAvailable,
	hitDiceMax,
	hitDieSize,
	vitScore,
	hpCurrent,
	hpMax,
	onFinishRest,
	onHitDieSpent,
	open: controlledOpen,
	onOpenChange,
	characterId,
}: ShortRestDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen =
		isControlled && onOpenChange ? onOpenChange : setUncontrolledOpen;
	const {
		hitDiceAvailable: remainingDice,
		totalHPRecovered: totalRecovered,
		rolls,
		spendHitDie,
		resetSession,
	} = useHitDiceSpending(
		hitDiceAvailable,
		hitDiceMax,
		hitDieSize,
		vitScore,
		hpCurrent,
		hpMax,
	);

	const ascendantTools = useAscendantTools();

	const handleOpen = (isOpen: boolean) => {
		if (isOpen) {
			resetSession();
		}
		setOpen(isOpen);
	};

	const handleSpend = () => {
		const result = spendHitDie();
		if (result) {
			if (characterId && result.hpRecovered > 0) {
				ascendantTools
					.trackHealthChange(characterId, result.hpRecovered, "healing")
					.catch(console.error);
			}
			if (onHitDieSpent) {
				onHitDieSpent({ ...result, hitDieSize });
			}
		}
	};

	const handleFinish = () => {
		const hitDiceSpent = hitDiceAvailable - remainingDice;
		onFinishRest(totalRecovered, hitDiceSpent);
		setOpen(false);
	};

	const atFullHP = hpCurrent + totalRecovered >= hpMax;

	return (
		<Dialog open={open} onOpenChange={handleOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-1.5">
					<Moon className="h-4 w-4" /> Short Rest
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Moon className="h-5 w-5" /> Short Rest
					</DialogTitle>
					<DialogDescription>
						Spend hit dice to recover HP. Each die: 1d{hitDieSize} + VIT
						modifier.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Hit Dice Pool */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Hit Dice Available</span>
						<span className="font-mono font-bold">
							{remainingDice} / {hitDiceMax} (d{hitDieSize})
						</span>
					</div>

					{/* HP Status */}
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">HP</span>
						<span className="font-mono">
							{Math.min(hpCurrent + totalRecovered, hpMax)} / {hpMax}
							{totalRecovered > 0 && (
								<span className="text-green-600 ml-1">(+{totalRecovered})</span>
							)}
						</span>
					</div>

					{/* Spend Button */}
					<Button
						onClick={handleSpend}
						disabled={remainingDice <= 0 || atFullHP}
						className="w-full gap-2"
					>
						<Dices className="h-4 w-4" />
						{atFullHP
							? "HP Full"
							: remainingDice <= 0
								? "No Hit Dice Left"
								: `Spend 1d${hitDieSize}`}
					</Button>

					{/* Roll Log */}
					{rolls.length > 0 && (
						<div className="rounded-md border bg-muted/50 p-3 max-h-40 overflow-y-auto space-y-1">
							{rolls.map((r, i) => (
								<div
									key={JSON.stringify(r)}
									className="flex items-center justify-between text-xs"
								>
									<span className="text-muted-foreground">Roll {i + 1}</span>
									<span className="font-mono">
										d{hitDieSize}={r.roll} {r.vitModifier >= 0 ? "+" : ""}
										{r.vitModifier} VIT
										<Heart
											className={cn(
												"inline h-3 w-3 ml-1",
												r.hpRecovered > 0 ? "text-green-500" : "text-gray-400",
											)}
										/>
										<span className="font-bold ml-1 text-green-600">
											+{r.hpRecovered} HP
										</span>
									</span>
								</div>
							))}
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleFinish}>
						Finish Rest {totalRecovered > 0 && `(+${totalRecovered} HP)`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
