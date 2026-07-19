import { Heart, Minus, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import {
	applyDamageMitigation,
	DAMAGE_TYPES,
	type DamageMitigationProfile,
} from "@/lib/damageApplication";

const UNTYPED = "untyped";

export interface TakeDamageOptions {
	damageType?: string | null;
	isCritical?: boolean;
}

interface HealthDialogProps {
	hpCurrent: number;
	hpMax: number;
	tempHp: number;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onTakeDamage: (amount: number, options?: TakeDamageOptions) => void;
	onHeal: (amount: number) => void;
	/** The character's damage resistances/immunities/vulnerabilities. */
	mitigation?: DamageMitigationProfile | null;
}

export function HealthDialog({
	hpCurrent,
	hpMax,
	tempHp,
	isOpen,
	onOpenChange,
	onTakeDamage,
	onHeal,
	mitigation,
}: HealthDialogProps) {
	const [amount, setAmount] = useState<string>("");
	const [damageType, setDamageType] = useState<string>(UNTYPED);
	const [isCritical, setIsCritical] = useState(false);

	const parsed = parseInt(amount, 10);
	const hasAmount = !Number.isNaN(parsed) && parsed > 0;

	const reset = () => {
		setAmount("");
		setDamageType(UNTYPED);
		setIsCritical(false);
	};

	const handleDamage = () => {
		if (!hasAmount) return;
		onTakeDamage(parsed, {
			damageType: damageType === UNTYPED ? null : damageType,
			isCritical,
		});
		reset();
		onOpenChange(false);
	};

	const handleHeal = () => {
		if (!hasAmount) return;
		onHeal(parsed);
		reset();
		onOpenChange(false);
	};

	// Live preview of what the damage button will actually do: mitigation
	// first, then temp HP absorbs, then the remainder hits real HP. Mirrors
	// the handler's pipeline so the number shown is the number applied.
	const preview = (() => {
		if (!hasAmount) return null;
		const mitigated = applyDamageMitigation({
			rawDamage: parsed,
			damageType: damageType === UNTYPED ? null : damageType,
			mitigation,
		});
		const absorbed = Math.min(tempHp, mitigated.finalDamage);
		const toHp = mitigated.finalDamage - absorbed;
		const parts: string[] = [];
		if (mitigated.finalDamage !== parsed) {
			parts.push(
				mitigated.immunityApplied
					? `immunity negates ${parsed}`
					: mitigated.resistanceApplied
						? `resistance halves ${parsed} → ${mitigated.finalDamage}`
						: `vulnerability doubles ${parsed} → ${mitigated.finalDamage}`,
			);
		}
		if (absorbed > 0) parts.push(`temp HP absorbs ${absorbed}`);
		if (parts.length === 0) return null;
		return `${parts.join("; ")} — ${toHp} to HP`;
	})();

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

						{/* Damage options — ignored by Heal. */}
						<div className="grid grid-cols-2 gap-3 items-center">
							<Select value={damageType} onValueChange={setDamageType}>
								<SelectTrigger
									className="h-10"
									aria-label="Damage type"
									data-testid="damage-type-select"
								>
									<SelectValue placeholder="Damage type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={UNTYPED}>Untyped</SelectItem>
									{DAMAGE_TYPES.map((type) => (
										<SelectItem key={type} value={type}>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<div className="flex items-center gap-2">
								<Checkbox
									id="critical-hit"
									checked={isCritical}
									onCheckedChange={(checked) => setIsCritical(checked === true)}
									data-testid="critical-hit-checkbox"
								/>
								<Label
									htmlFor="critical-hit"
									className="text-sm cursor-pointer leading-tight"
								>
									Critical hit
									<span className="block text-[10px] text-muted-foreground">
										2 death saves at 0 HP
									</span>
								</Label>
							</div>
						</div>

						{preview && (
							<p
								className="text-xs font-mono text-cyan-400/90 text-center"
								data-testid="damage-preview"
							>
								{preview}
							</p>
						)}

						{/* Action Buttons */}
						<div className="grid grid-cols-2 gap-3">
							<Button
								variant="destructive"
								className="h-12 text-base font-bold"
								onClick={handleDamage}
								disabled={!hasAmount}
							>
								<Minus className="w-5 h-5 mr-1" />
								Damage
							</Button>
							<Button
								variant="default"
								className="h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white"
								onClick={handleHeal}
								disabled={!hasAmount}
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
