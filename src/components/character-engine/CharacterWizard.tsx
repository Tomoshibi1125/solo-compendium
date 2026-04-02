import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./CharacterWizard.css";

export type WizardStep = {
	id: string;
	name: string;
};

interface CharacterWizardProps {
	steps: WizardStep[];
	currentStepIndex: number;
	onNext: () => void;
	onBack: () => void;
	canNext: boolean;
	showFinish: boolean;
	onFinish: () => void;
	isSubmitting: boolean;
	children: React.ReactNode;
}

export const CharacterWizard: React.FC<CharacterWizardProps> = ({
	steps,
	currentStepIndex,
	onNext,
	onBack,
	canNext,
	showFinish,
	onFinish,
	isSubmitting,
	children,
}) => {
	const progressBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (progressBarRef.current) {
			const progress = (currentStepIndex / (steps.length - 1)) * 100;
			progressBarRef.current.style.width = `${progress}%`;
		}
	}, [currentStepIndex, steps.length]);

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			{/* Progress Indicator */}
			<div className="relative pt-4">
				<div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/10 -translate-y-1/2" />
				<div
					ref={progressBarRef}
					className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out -translate-y-1/2 wizard-progress-bar"
				/>

				<div className="relative flex justify-between">
					{steps.map((step, index) => {
						const isCompleted = index < currentStepIndex;
						const isActive = index === currentStepIndex;

						return (
							<div
								key={step.id}
								className="flex flex-col items-center gap-2 group"
							>
								<div
									className={cn(
										"w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10",
										isCompleted
											? "bg-primary border-primary text-primary-foreground"
											: isActive
												? "bg-black border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
												: "bg-black border-primary/20 text-primary/40",
									)}
								>
									{isCompleted ? (
										<ChevronRight className="w-4 h-4 translate-x-0.5" />
									) : (
										<span className="text-[10px] font-bold font-heading">
											{index + 1}
										</span>
									)}
								</div>
								<span
									className={cn(
										"text-[9px] uppercase tracking-widest font-heading transition-colors",
										isActive
											? "text-primary font-bold"
											: isCompleted
												? "text-primary/60"
												: "text-muted-foreground/40",
									)}
								>
									{step.name}
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Active Step Content */}
			<div className="min-h-[500px]">{children}</div>

			{/* Sticky/Floating Navigation Controls */}
			<div className="flex justify-between items-center pt-8 border-t border-primary/5">
				<Button
					variant="ghost"
					onClick={onBack}
					disabled={currentStepIndex === 0 || isSubmitting}
					className="gap-2 h-11 px-6 hover:bg-primary/5 hover:text-primary transition-colors disabled:opacity-30"
				>
					<ChevronLeft className="w-4 h-4" />
					<span className="uppercase tracking-widest text-[10px] font-bold">
						Reverse Sequence
					</span>
				</Button>

				{!showFinish ? (
					<Button
						onClick={onNext}
						disabled={!canNext || isSubmitting}
						className="gap-2 h-11 px-8 shadow-[0_4px_12px_rgba(var(--primary),0.2)] hover:shadow-[0_4px_24px_rgba(var(--primary),0.3)] transition-all"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span className="uppercase tracking-widest text-[10px] font-bold">
									Processing...
								</span>
							</>
						) : (
							<>
								<span className="uppercase tracking-widest text-[10px] font-bold">
									Advance Protocol
								</span>
								<ChevronRight className="w-4 h-4" />
							</>
						)}
					</Button>
				) : (
					<Button
						onClick={onFinish}
						disabled={isSubmitting}
						className="gap-2 h-11 px-8 bg-primary/20 border-primary/40 hover:bg-primary/30 text-primary transition-all animate-pulse"
					>
						<span className="uppercase tracking-widest text-[10px] font-bold italic">
							Execute Awakening Protocol
						</span>
					</Button>
				)}
			</div>
		</div>
	);
};
