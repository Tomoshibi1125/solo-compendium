import { Activity, Dices, Heart, Moon, RefreshCw, Zap } from "lucide-react";
import type React from "react";
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

interface LongRestDialogProps {
	onConfirmRest: () => void;
	triggerButton?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function LongRestDialog({
	onConfirmRest,
	triggerButton,
	open: controlledOpen,
	onOpenChange,
}: LongRestDialogProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : uncontrolledOpen;
	const setOpen =
		isControlled && onOpenChange ? onOpenChange : setUncontrolledOpen;

	const handleConfirm = () => {
		onConfirmRest();
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{triggerButton || (
					<Button
						variant="outline"
						size="sm"
						className="gap-1.5 w-full justify-start text-left"
					>
						<Moon className="h-4 w-4 mr-2" />
						<span>Long Rest</span>
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Moon className="h-5 w-5" /> Confirm Long Rest
					</DialogTitle>
					<DialogDescription>
						A long rest requires at least 8 hours of downtime (at least 6 hours
						sleeping). Are you sure you want to take a long rest?
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="bg-muted/50 p-4 rounded-lg space-y-3">
						<h4 className="font-medium text-sm mb-3">
							Recovering upon completion:
						</h4>
						<ul className="text-sm space-y-3 text-muted-foreground">
							<li className="flex items-center gap-2">
								<Heart className="h-4 w-4 text-green-500 flex-shrink-0" />
								<span>All Hit Points</span>
							</li>
							<li className="flex items-center gap-2">
								<Dices className="h-4 w-4 text-primary flex-shrink-0" />
								<span>Up to half of your maximum Hit Dice</span>
							</li>
							<li className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
								<span>All expended Spell Slots</span>
							</li>
							<li className="flex items-center gap-2">
								<RefreshCw className="h-4 w-4 text-blue-500 flex-shrink-0" />
								<span>All Long Rest class features and abilities</span>
							</li>
							<li className="flex items-center gap-2">
								<Activity className="h-4 w-4 text-red-500 flex-shrink-0" />
								<span>Reduces Exhaustion level by 1</span>
							</li>
						</ul>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Take Long Rest</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
