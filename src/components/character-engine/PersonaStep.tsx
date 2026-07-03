import type React from "react";
import { AscendantText } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonaStepProps {
	alignment: string;
	onAlignmentChange: (value: string) => void;
	personalityTrait: string;
	onPersonalityTraitChange: (value: string) => void;
	ideal: string;
	onIdealChange: (value: string) => void;
	bond: string;
	onBondChange: (value: string) => void;
	flaw: string;
	onFlawChange: (value: string) => void;
	personalityOptions: string[];
	idealOptions: string[];
	bondOptions: string[];
	flawOptions: string[];
}

const renderOptionChips = (
	options: string[],
	value: string,
	onChange: (value: string) => void,
) => {
	if (options.length === 0) return null;
	return (
		<div className="flex flex-wrap gap-2">
			{options.slice(0, 6).map((option) => {
				const active = value === option;
				return (
					<Button
						key={option}
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onChange(active ? "" : option)}
						className={`h-auto min-h-8 text-left justify-start text-[11px] whitespace-normal ${
							active
								? "border-primary/70 bg-primary/10 text-primary"
								: "border-primary/10 bg-black/30"
						}`}
					>
						{option}
					</Button>
				);
			})}
		</div>
	);
};

export const PersonaStep: React.FC<PersonaStepProps> = ({
	alignment,
	onAlignmentChange,
	personalityTrait,
	onPersonalityTraitChange,
	ideal,
	onIdealChange,
	bond,
	onBondChange,
	flaw,
	onFlawChange,
	personalityOptions,
	idealOptions,
	bondOptions,
	flawOptions,
}) => {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
			<AscendantWindow title="PERSONA MATRIX: PROTOCOL ALIGNMENT">
				<div className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between gap-3">
							<Label
								htmlFor="protocol-alignment"
								className="text-[11px] uppercase tracking-widest text-primary/60"
							>
								Protocol Alignment
							</Label>
							<Badge variant="outline" className="text-[11px] uppercase">
								Optional
							</Badge>
						</div>
						<Input
							id="protocol-alignment"
							value={alignment}
							onChange={(event) => onAlignmentChange(event.target.value)}
							placeholder="How does this Ascendant align with Bureau protocol, civilians, rifts, or Regents?"
							className="h-12 bg-black/40 border-primary/20 focus:border-primary/50"
						/>
						<AscendantText className="block text-[11px] text-muted-foreground">
							Use RA-native terms here; this replaces legacy moral-axis
							alignment.
						</AscendantText>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-3">
							<Label
								htmlFor="personality-signal"
								className="text-[11px] uppercase tracking-widest text-primary/60"
							>
								Personality Signal
							</Label>
							{renderOptionChips(
								personalityOptions,
								personalityTrait,
								onPersonalityTraitChange,
							)}
							<Textarea
								id="personality-signal"
								value={personalityTrait}
								onChange={(event) =>
									onPersonalityTraitChange(event.target.value)
								}
								placeholder="How does the Ascendant present under pressure?"
								className="min-h-[96px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="core-drive"
								className="text-[11px] uppercase tracking-widest text-primary/60"
							>
								Core Drive
							</Label>
							{renderOptionChips(idealOptions, ideal, onIdealChange)}
							<Textarea
								id="core-drive"
								value={ideal}
								onChange={(event) => onIdealChange(event.target.value)}
								placeholder="What principle, hunger, oath, or need moves them forward?"
								className="min-h-[96px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="anchor-bond"
								className="text-[11px] uppercase tracking-widest text-primary/60"
							>
								Anchor / Bond
							</Label>
							{renderOptionChips(bondOptions, bond, onBondChange)}
							<Textarea
								id="anchor-bond"
								value={bond}
								onChange={(event) => onBondChange(event.target.value)}
								placeholder="Who, what, or where keeps them tethered?"
								className="min-h-[96px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
							/>
						</div>

						<div className="space-y-3">
							<Label
								htmlFor="fault-line"
								className="text-[11px] uppercase tracking-widest text-primary/60"
							>
								Fault Line
							</Label>
							{renderOptionChips(flawOptions, flaw, onFlawChange)}
							<Textarea
								id="fault-line"
								value={flaw}
								onChange={(event) => onFlawChange(event.target.value)}
								placeholder="What pressure point could fracture their judgment?"
								className="min-h-[96px] bg-black/40 border-primary/20 focus:border-primary/50 resize-none"
							/>
						</div>
					</div>
				</div>
			</AscendantWindow>
		</div>
	);
};
