import { Heart, Minus, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface HealthDialogProps {
	hpCurrent: number;
	hpMax: number;
	tempHp: number;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onTakeDamage: (amount: number) => void;
	onHeal: (amount: number) => void;
}

export function HealthDialog({
	hpCurrent,
	hpMax,
	tempHp,
	isOpen,
	onOpenChange,
	onTakeDamage,
	onHeal,
}: HealthDialogProps) {
	const [amount, setAmount] = useState<string>("");

	const handleDamage = () => {
		const val = parseInt(amount, 10);
		if (!Number.isNaN(val) && val > 0) {
			onTakeDamage(val);
			setAmount("");
			onOpenChange(false);
		}
	};

	const handleHeal = () => {
		const val = parseInt(amount, 10);
		if (!Number.isNaN(val) && val > 0) {
			onHeal(val);
			setAmount("");
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-red-500" />
						Manage Hit Points
					</DialogTitle>
					<DialogDescription>
						Apply damage or healing to your character.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Current Status */}
					<div className="flex items-center justify-around p-4 bg-muted/30 rounded-lg border border-border/50">
						<div className="flex flex-col items-center">
							<span className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-1">
								Current HP
							</span>
							<span className="text-3xl font-display font-bold text-foreground">
								{hpCurrent}
							</span>
							<span className="text-xs text-muted-foreground font-mono">
								/ {hpMax}
							</span>
						</div>
						{tempHp > 0 && (
							<div className="flex flex-col items-center px-4 border-l border-border/50">
								<span className="text-xs text-cyan-500/70 uppercase tracking-wider font-mono mb-1 flex items-center gap-1">
									<Shield className="w-3 h-3" /> Temp
								</span>
								<span className="text-xl font-display font-bold text-cyan-400">
									{tempHp}
								</span>
							</div>
						)}
					</div>

					{/* Amount Input */}
					<div className="space-y-3">
						<div className="relative">
							<Input
								type="number"
								min="1"
								placeholder="Enter amount..."
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className="text-center text-lg h-12 font-mono"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										// Default to damage if enter is pressed, as it's the more common urgent action
										handleDamage();
									}
								}}
							/>
						</div>

						{/* Action Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								variant="destructive"
								className="h-12 text-base font-bold"
								onClick={handleDamage}
								disabled={!amount || parseInt(amount, 10) <= 0}
							>
								<Minus className="w-5 h-5 mr-1" />
								Damage
							</Button>
							<Button
								variant="default"
								className="h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white"
								onClick={handleHeal}
								disabled={!amount || parseInt(amount, 10) <= 0}
							>
								<Plus className="w-5 h-5 mr-1" />
								Heal
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
