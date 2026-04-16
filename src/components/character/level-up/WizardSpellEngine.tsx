import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Book, Search, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { formatRegentVernacular } from "@/lib/vernacular";
import type { CompendiumPower, CompendiumSpell } from "@/types/compendium";

interface SpellChoicePayload {
	powers: number;
	spells: number;
}

interface WizardSpellEngineProps {
	characterId: string;
	characterJob: string;
	characterPath?: string;
	newLevel: number;
	availableChoices: SpellChoicePayload;
	onSelectionsUpdate: (
		isReady: boolean,
		selectedPowers: CompendiumPower[],
		selectedSpells: CompendiumSpell[],
	) => void;
}

export const WizardSpellEngine = ({
	characterId,
	characterJob,
	characterPath,
	newLevel,
	availableChoices,
	onSelectionsUpdate,
}: WizardSpellEngineProps) => {
	const [selectedPowerIds, setSelectedPowerIds] = useState<string[]>([]);
	const [selectedSpellIds, setSelectedSpellIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	const needsSelection =
		availableChoices.powers > 0 || availableChoices.spells > 0;

	const { data: dbData, isLoading } = useQuery({
		queryKey: [
			"wizard-spells-powers",
			characterJob,
			characterPath,
			newLevel,
			needsSelection,
		],
		queryFn: async () => {
			if (!needsSelection)
				return { powers: [], spells: [], existingNames: new Set() };

			// Get character's existing powers/spells so we don't present them again
			const { data: existing } = await supabase
				.from("character_powers")
				.select("name")
				.eq("character_id", characterId);
			const existingNames = new Set((existing || []).map((e) => e.name));

			// Fetch Powers if needed
			let powers: CompendiumPower[] = [];
			if (availableChoices.powers > 0) {
				const maxPowerLevel = Math.ceil(newLevel / 2); // Approximate standard caster level math
				const orParts = [`job_names.cs.{"${characterJob}"}`];
				if (characterPath) orParts.push(`path_names.cs.{"${characterPath}"}`);

				const { data: pData } = await supabase
					.from("compendium_powers")
					.select("*")
					.or(orParts.join(","))
					.lte("power_level", maxPowerLevel);
				powers = ((pData as unknown as CompendiumPower[]) || []).filter(
					(p) => !existingNames.has(p.name),
				);
			}

			// Fetch Spells if needed
			let spells: CompendiumSpell[] = [];
			if (availableChoices.spells > 0) {
				const maxSpellLevel = Math.ceil(newLevel / 2);
				const { data: sData } = await supabase
					.from("compendium_spells")
					.select("*")
					.contains("classes", [characterJob])
					.lte("power_level", maxSpellLevel);
				spells = ((sData as unknown as CompendiumSpell[]) || []).filter(
					(s) => !existingNames.has(s.name),
				);
			}

			return { powers, spells, existingNames };
		},
		enabled: !!characterJob && needsSelection,
	});

	const powers = dbData?.powers ?? [];
	const spells = dbData?.spells ?? [];

	const filteredPowers = useMemo(() => {
		if (!searchQuery) return powers;
		return powers.filter((p) =>
			p.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [powers, searchQuery]);

	const filteredSpells = useMemo(() => {
		if (!searchQuery) return spells;
		return spells.filter((s) =>
			s.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [spells, searchQuery]);

	const powersReady = selectedPowerIds.length === availableChoices.powers;
	const spellsReady = selectedSpellIds.length === availableChoices.spells;
	const isReady = !needsSelection || (powersReady && spellsReady);

	useEffect(() => {
		if (!needsSelection) {
			onSelectionsUpdate(true, [], []);
			return;
		}
		const pSelected = powers.filter((p) => selectedPowerIds.includes(p.id));
		const sSelected = spells.filter((s) => selectedSpellIds.includes(s.id));
		onSelectionsUpdate(isReady, pSelected, sSelected);
	}, [
		isReady,
		selectedPowerIds,
		selectedSpellIds,
		powers,
		spells,
		onSelectionsUpdate,
		needsSelection,
	]);

	if (!needsSelection) return null;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-12 space-y-4">
				<div className="relative w-16 h-16">
					<motion.div
						animate={{
							rotate: 360,
							scale: [1, 1.1, 1],
						}}
						transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
						className="absolute inset-0 border-2 border-purple-500/30 rounded-full"
					/>
					<motion.div
						animate={{
							rotate: -360,
							scale: [1, 1.2, 1],
						}}
						transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
						className="absolute inset-2 border-2 border-blue-400/20 rounded-full border-t-blue-400"
					/>
					<Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-400 animate-pulse" />
				</div>
				<div className="text-sm text-purple-300 font-resurge tracking-widest animate-pulse">
					INITIATING MAGICAL DISCOVERY PROTOCOL...
				</div>
			</div>
		);
	}

	const toggleSelection = (id: string, type: "power" | "spell") => {
		if (type === "power") {
			if (selectedPowerIds.includes(id)) {
				setSelectedPowerIds((prev) => prev.filter((i) => i !== id));
			} else if (selectedPowerIds.length < availableChoices.powers) {
				setSelectedPowerIds((prev) => [...prev, id]);
			}
		} else {
			if (selectedSpellIds.includes(id)) {
				setSelectedSpellIds((prev) => prev.filter((i) => i !== id));
			} else if (selectedSpellIds.length < availableChoices.spells) {
				setSelectedSpellIds((prev) => [...prev, id]);
			}
		}
	};

	return (
		<div className="space-y-6 mt-6 border-t border-purple-500/20 pt-6">
			<h4 className="font-heading font-semibold text-purple-400 mb-2 flex items-center gap-2">
				<Sparkles className="w-5 h-5 text-purple-400" />
				MAGICAL DISCOVERY PROTOCOL
			</h4>

			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search abilities by name..."
					className="pl-9 border-purple-500/30 focus:border-purple-400 bg-background/50"
				/>
			</div>

			{availableChoices.powers > 0 && (
				<div className="space-y-3">
					<div className="flex justify-between items-center text-sm font-heading mb-2">
						<span className="text-purple-300">Powers Available to Learn</span>
						<span
							className={cn(
								"font-bold",
								powersReady ? "text-green-400" : "text-amber-400",
							)}
						>
							{selectedPowerIds.length} / {availableChoices.powers}
						</span>
					</div>
					<div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
						<AnimatePresence>
							{filteredPowers.length === 0 ? (
								<div className="text-xs text-muted-foreground italic">
									No powers found in query.
								</div>
							) : (
								filteredPowers.map((p, idx) => {
									const isSelected = selectedPowerIds.includes(p.id);
									const isDisabled = !isSelected && powersReady;
									return (
										<motion.div
											key={p.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.03 }}
											whileHover={{ scale: isDisabled ? 1 : 1.01 }}
											whileTap={{ scale: isDisabled ? 1 : 0.98 }}
										>
											<Button
												variant="outline"
												disabled={isDisabled}
												onClick={() => toggleSelection(p.id, "power")}
												className={cn(
													"h-auto w-full py-3 px-4 justify-start text-left items-start flex flex-col font-normal transition-all duration-300",
													isSelected
														? "border-purple-400 bg-purple-500/20 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
														: "border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-foreground",
												)}
											>
												<div className="flex justify-between w-full mb-1">
													<span className="font-resurge tracking-wide flex items-center gap-2">
														<Wand2
															className={cn(
																"w-3 h-3",
																isSelected
																	? "text-purple-400"
																	: "text-muted-foreground",
															)}
														/>
														{formatRegentVernacular(p.name)}
													</span>
													<span className="text-xs text-muted-foreground font-heading">
														Level {p.power_level}
													</span>
												</div>
												<p className="text-xs text-muted-foreground/80 line-clamp-2 leading-tight">
													{p.description}
												</p>
											</Button>
										</motion.div>
									);
								})
							)}
						</AnimatePresence>
					</div>
				</div>
			)}

			{availableChoices.spells > 0 && (
				<div className="space-y-3">
					<div className="flex justify-between items-center text-sm font-heading mb-2">
						<span className="text-blue-300">Spells Available to Scribe</span>
						<span
							className={cn(
								"font-bold",
								spellsReady ? "text-green-400" : "text-amber-400",
							)}
						>
							{selectedSpellIds.length} / {availableChoices.spells}
						</span>
					</div>
					<div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
						<AnimatePresence>
							{filteredSpells.length === 0 ? (
								<div className="text-xs text-muted-foreground italic">
									No spells found in query.
								</div>
							) : (
								filteredSpells.map((s, idx) => {
									const isSelected = selectedSpellIds.includes(s.id);
									const isDisabled = !isSelected && spellsReady;
									return (
										<motion.div
											key={s.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.03 }}
											whileHover={{ scale: isDisabled ? 1 : 1.01 }}
											whileTap={{ scale: isDisabled ? 1 : 0.98 }}
										>
											<Button
												key={s.id}
												variant="outline"
												disabled={isDisabled}
												onClick={() => toggleSelection(s.id, "spell")}
												className={cn(
													"h-auto w-full py-3 px-4 justify-start text-left flex-col items-start font-normal transition-all duration-300",
													isSelected
														? "border-blue-400 bg-blue-500/20 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
														: "border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/5 text-foreground",
												)}
											>
												<div className="flex justify-between w-full mb-1">
													<span className="font-resurge tracking-wide flex items-center gap-2">
														<Book
															className={cn(
																"w-3 h-3",
																isSelected
																	? "text-blue-400"
																	: "text-muted-foreground",
															)}
														/>
														{formatRegentVernacular(s.name)}
													</span>
													<span className="text-xs text-muted-foreground font-heading italic opacity-80">
														Level {s.power_level} • {s.school}
													</span>
												</div>
												<p className="text-xs text-muted-foreground/80 line-clamp-2 leading-tight">
													{s.description}
												</p>
											</Button>
										</motion.div>
									);
								})
							)}
						</AnimatePresence>
					</div>
				</div>
			)}
		</div>
	);
};
