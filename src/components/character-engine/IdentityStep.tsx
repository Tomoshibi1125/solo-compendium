import { Check } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SystemWindow } from "@/components/ui/SystemWindow";
import { Textarea } from "@/components/ui/textarea";
import type { CharacterTemplate } from "@/hooks/useCharacterTemplates";
import { cn } from "@/lib/utils";

interface IdentityStepProps {
	name: string;
	setName: (name: string) => void;
	appearance: string;
	setAppearance: (appearance: string) => void;
	backstory: string;
	setBackstory: (backstory: string) => void;
	templates?: CharacterTemplate[];
	onApplyTemplate: (template: CharacterTemplate) => void;
	selectedJobName?: string;
	selectedBackgroundName?: string;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
	name,
	setName,
	appearance,
	setAppearance,
	backstory,
	setBackstory,
	templates,
	onApplyTemplate,
	selectedJobName,
	selectedBackgroundName,
}) => {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<SystemWindow title="MODEL INITIALIZATION: IDENTITY BINDING">
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-6">
						<div className="space-y-2">
							<Label
								htmlFor="char-name"
								className="text-[10px] uppercase tracking-widest text-primary/60"
							>
								Designation / Primary Handle
							</Label>
							<Input
								id="char-name"
								placeholder="Enter entity designation..."
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="h-12 bg-black/40 border-primary/20 focus:border-primary/50 transition-colors text-lg font-heading"
							/>
						</div>

						{templates && templates.length > 0 && (
							<div className="space-y-3">
								<Label className="text-[10px] uppercase tracking-widest text-primary/60">
									Archetype Templates
								</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{templates.map((template) => {
										const isActive =
											selectedJobName === template.job &&
											selectedBackgroundName === template.background;

										return (
											<Button
												key={template.id}
												variant="outline"
												className={cn(
													"h-auto py-3 px-4 flex flex-col items-start gap-1 bg-black/40 border-primary/10 hover:border-primary/30 transition-all",
													isActive && "border-primary/60 bg-primary/5",
												)}
												onClick={() => onApplyTemplate(template)}
											>
												<div className="flex justify-between w-full items-center">
													<span className="font-heading text-sm text-primary/90">
														{template.name}
													</span>
													{isActive && (
														<Check className="w-3 h-3 text-primary" />
													)}
												</div>
												<span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
													{template.job} • {template.background}
												</span>
											</Button>
										);
									})}
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label
									htmlFor="char-appearance"
									className="text-[10px] uppercase tracking-widest text-primary/60"
								>
									Visual Manifestation
								</Label>
								<Textarea
									id="char-appearance"
									placeholder="Describe physical characteristics..."
									value={appearance}
									onChange={(e) => setAppearance(e.target.value)}
									className="min-h-[120px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="char-backstory"
									className="text-[10px] uppercase tracking-widest text-primary/60"
								>
									Historical Log / Origin
								</Label>
								<Textarea
									id="char-backstory"
									placeholder="Describe entity origins..."
									value={backstory}
									onChange={(e) => setBackstory(e.target.value)}
									className="min-h-[120px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
								/>
							</div>
						</div>
					</div>
				</div>
			</SystemWindow>
		</div>
	);
};
