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
	const mobileBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const progress = (currentStepIndex / Math.max(1, steps.length - 1)) * 100;
		if (progressBarRef.current) {
			progressBarRef.current.style.width = `${progress}%`;
		}
		if (mobileBarRef.current) {
			mobileBarRef.current.style.width = `${progress}%`;
		}
	}, [currentStepIndex, steps.length]);

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			{/* Progress Indicator — compact on mobile, full stepper rail on desktop */}
			<div className="pt-4">
				{/* Mobile: legible "Step X of N" + current step + progress bar */}
				<div className="md:hidden space-y-2">
					<div className="flex items-baseline justify-between gap-2">
						<span className="ra-eyebrow text-primary">
							Step {currentStepIndex + 1} / {steps.length}
						</span>
						<span className="text-sm font-heading font-semibold text-primary">
							{steps[currentStepIndex]?.name}
						</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
						<div
							ref={mobileBarRef}
							className="h-full rounded-full bg-primary transition-all duration-500 wizard-progress-bar"
						/>
					</div>
				</div>

				{/* Desktop: full stepper rail */}
				<div className="relative hidden md:block">
					<div className="absolute top-4 left-0 w-full h-0.5 bg-primary/10" />
					<div
						ref={progressBarRef}
						className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 ease-in-out wizard-progress-bar"
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
											<span className="text-xs font-bold font-heading">
												{index + 1}
											</span>
										)}
									</div>
									<span
										className={cn(
											"text-[11px] uppercase tracking-widest font-heading transition-colors",
											isActive
												? "text-primary font-bold"
												: isCompleted
													? "text-primary/70"
													: "text-muted-foreground/50",
										)}
									>
										{step.name}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Active Step Content */}
			<div className="min-h-[500px]">{children}</div>

			{/* Sticky/Floating Navigation Controls */}
			<div className="flex justify-between items-center pt-8 border-t border-primary/5">
				<Button
					variant="outline"
					onClick={onBack}
					disabled={currentStepIndex === 0 || isSubmitting}
					className="gap-2 h-11 px-6 border-primary/20 text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-30"
				>
					<ChevronLeft className="w-4 h-4" />
					<span className="uppercase tracking-widest text-xs font-bold">
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
								<span className="uppercase tracking-widest text-xs font-bold">
									Processing...
								</span>
							</>
						) : (
							<>
								<span className="uppercase tracking-widest text-xs font-bold">
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
						<span className="uppercase tracking-widest text-xs font-bold italic">
							Execute Awakening Protocol
						</span>
					</Button>
				)}
			</div>
		</div>
	);
};
