import { AlertCircle, CheckCircle, Crown, Lock } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { regents } from "@/data/compendium/monarchs";
import { cn } from "@/lib/utils";

interface RegentSelectionProps {
	selectedRegent: string;
	selectedLevel: number;
	onRegentChange: (regentId: string) => void;
	onLevelChange: (level: number) => void;
	disabled?: boolean;
	className?: string;
}

export function RegentSelection({
	selectedRegent,
	selectedLevel,
	onRegentChange,
	onLevelChange,
	disabled = false,
	className,
}: RegentSelectionProps) {
	const [_showRequirements, _setShowRequirements] = useState(false);

	const selectedRegentData = regents.find((r) => r.id === selectedRegent);

	const isRegentAvailable = (_regentId: string) => {
		// In a real implementation, this would check quest completion and DM approval
		// For now, we'll assume all regents are available for selection
		return true;
	};

	const getRegentStatus = (regentId: string) => {
		if (!isRegentAvailable(regentId)) {
			return {
				status: "locked",
				icon: Lock,
				color: "text-gray-500",
				message: "Quest completion required",
			};
		}
		if (regentId === selectedRegent) {
			return {
				status: "selected",
				icon: CheckCircle,
				color: "text-green-500",
				message: "Currently selected",
			};
		}
		return {
			status: "available",
			icon: Crown,
			color: "text-blue-500",
			message: "Available for selection",
		};
	};

	const getLevelFeatures = (regentId: string, level: number) => {
		const regent = regents.find((r) => r.id === regentId);
		if (!regent) return [];

		return (regent.class_features ?? [])
			.filter((f) => f.level <= level)
			.map((f) => ({
				name: f.name,
				description: f.description,
				type: f.type,
				frequency: f.frequency,
			}));
	};

	const _getSpellSlots = (regentId: string, level: number) => {
		const regent = regents.find((r) => r.id === regentId);
		if (!regent || !regent.spellcasting) return null;

		return regent.spellcasting.spell_slots[`1st`]?.[level - 1] || 0;
	};

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Crown className="w-5 h-5" />
					Regent Selection
				</CardTitle>
				<CardDescription>
					Choose a regent class overlay to enhance your character abilities
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Regent Selection */}
				<div className="space-y-3">
					<label className="text-sm font-medium">Select Regent</label>
					<Select
						value={selectedRegent}
						onValueChange={onRegentChange}
						disabled={disabled}
					>
						<SelectTrigger>
							<SelectValue placeholder="Choose a regent..." />
						</SelectTrigger>
						<SelectContent>
							{regents.map((regent) => {
								const status = getRegentStatus(regent.id);
								return (
									<SelectItem
										key={regent.id}
										value={regent.id}
										disabled={status.status === "locked"}
									>
										<div className="flex items-center gap-2">
											<status.icon className={cn("w-4 h-4", status.color)} />
											<span>{regent.name}</span>
											<Badge variant="outline" className="text-xs">
												{regent.rank}
											</Badge>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Level Selection */}
				<div className="space-y-3">
					<label className="text-sm font-medium">Regent Level</label>
					<Select
						value={selectedLevel.toString()}
						onValueChange={(value: string) =>
							onLevelChange(parseInt(value, 10))
						}
						disabled={disabled || !selectedRegent}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select level..." />
						</SelectTrigger>
						<SelectContent>
							{Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
								<SelectItem key={level} value={level.toString()}>
									Level {level}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Selected Regent Info */}
				{selectedRegentData && (
					<div className="space-y-4">
						<div className="p-4 border rounded-lg bg-muted/50">
							<div className="flex items-center gap-2 mb-2">
								<h3 className="font-semibold">{selectedRegentData.name}</h3>
								<Badge variant="secondary">{selectedRegentData.rank}</Badge>
							</div>
							<p className="text-sm text-muted-foreground mb-3">
								{selectedRegentData.description}
							</p>

							{/* Requirements */}
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm">
									<AlertCircle className="w-4 h-4 text-yellow-500" />
									<span>Quest completion required</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<AlertCircle className="w-4 h-4 text-blue-500" />
									<span>DM approval required</span>
								</div>
								{selectedRegentData.regent_requirements && (
									<div className="text-sm text-muted-foreground">
										Minimum character level:{" "}
										{selectedRegentData.regent_requirements.level}
									</div>
								)}
							</div>
						</div>

						{/* Features at Selected Level */}
						<div className="space-y-3">
							<h4 className="font-medium">Features at Level {selectedLevel}</h4>
							<div className="space-y-2">
								{getLevelFeatures(selectedRegent, selectedLevel).map(
									(feature, index) => (
										<div
											key={index}
											className="p-3 border rounded-lg bg-background"
										>
											<div className="flex items-center gap-2 mb-1">
												<span className="font-medium text-sm">
													{feature.name}
												</span>
												<Badge variant="outline" className="text-xs">
													{feature.type}
												</Badge>
												{feature.frequency && (
													<Badge variant="secondary" className="text-xs">
														{feature.frequency}
													</Badge>
												)}
											</div>
											<p className="text-xs text-muted-foreground">
												{feature.description}
											</p>
										</div>
									),
								)}
								{getLevelFeatures(selectedRegent, selectedLevel).length ===
									0 && (
									<p className="text-sm text-muted-foreground italic">
										No features at this level
									</p>
								)}
							</div>
						</div>

						{/* Spell Slots */}
						{selectedRegentData.spellcasting && (
							<div className="space-y-3">
								<h4 className="font-medium">
									Spell Slots at Level {selectedLevel}
								</h4>
								<div className="grid grid-cols-9 gap-2 text-center">
									{Array.from({ length: 9 }, (_, i) => i + 1).map((level) => {
										const slotKey =
											`${level}${level === 1 ? "st" : level === 2 ? "nd" : level === 3 ? "rd" : "th"}` as keyof typeof selectedRegentData.spellcasting.spell_slots;
										const slots =
											selectedRegentData.spellcasting.spell_slots[slotKey]?.[
												selectedLevel - 1
											] || 0;
										return (
											<div key={level} className="p-2 border rounded">
												<div className="text-xs font-medium">Lvl {level}</div>
												<div className="text-sm font-bold">{slots}</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Requirements Info */}
				<div className="text-xs text-muted-foreground border-t pt-4">
					<p>
						<strong>Note:</strong> Regent selection requires quest completion
						and DM approval. Once unlocked, regent abilities progress with your
						character level.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
