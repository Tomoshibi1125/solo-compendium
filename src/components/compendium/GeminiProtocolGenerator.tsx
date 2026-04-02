import { useQuery } from "@tanstack/react-query";
import {
	Crown,
	Dna,
	Link2,
	Loader2,
	RefreshCw,
	Save,
	Shield,
	Sparkles,
	Swords,
	Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useActiveCharacter } from "@/hooks/useActiveCharacter";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { useAscendantTools } from "@/hooks/useGlobalDDBeyondIntegration";
import { useRegentUnlocks } from "@/hooks/useRegentUnlocks";
import { useRecordRoll } from "@/hooks/useRollHistory";
import {
	useCharacterSovereign,
	useSaveSovereign,
} from "@/hooks/useSavedSovereigns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	calculateTotalCombinations,
	type GeneratedSovereign,
	generateSovereign,
	generateSovereignWithAI,
} from "@/lib/geminiProtocol";
import { filterRowsBySourcebookAccess } from "@/lib/sourcebookAccess";
import {
	formatRegentVernacular,
	REGENT_LABEL,
	REGENT_LABEL_PLURAL,
} from "@/lib/vernacular";

type RegentOption = {
	id: string;
	name: string;
	title?: string | null;
	theme?: string | null;
	source_book?: string | null;
	[key: string]: unknown;
};

export function GeminiProtocolGenerator() {
	const { isPlayer } = useAuth();
	const { activeCharacter } = useActiveCharacter();
	const { data: characterCampaign } = useCampaignByCharacterId(
		activeCharacter?.id || "",
	);
	const campaignId = characterCampaign?.id ?? null;
	const characterId = activeCharacter?.id;
	const { unlocks: regentUnlocks = [], isLoading: regentUnlocksLoading } =
		useRegentUnlocks(characterId || "");
	const [selectedJob, setSelectedJob] = useState<string>("");
	const [selectedPath, setSelectedPath] = useState<string>("");
	const [selectedRegentA, setSelectedRegentA] = useState<string>("");
	const [selectedRegentB, setSelectedRegentB] = useState<string>("");
	const [generatedSovereign, setGeneratedSovereign] =
		useState<GeneratedSovereign | null>(null);

	const saveSovereign = useSaveSovereign();
	const { data: existingSovereign } = useCharacterSovereign(characterId);
	const { toast } = useToast();
	const recordRoll = useRecordRoll();
	const ascendantTools = useAscendantTools();

	// Fetch all jobs
	const { data: jobs = [], isLoading: jobsLoading } = useQuery({
		queryKey: ["gemini-jobs", campaignId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("compendium_jobs")
				.select("*")
				.order("name");
			if (error) throw error;

			return filterRowsBySourcebookAccess(
				data || [],
				(job) => job.source_book,
				{ campaignId },
			);
		},
	});

	// Fetch paths for selected job
	const { data: paths = [], isLoading: pathsLoading } = useQuery({
		queryKey: ["gemini-paths", selectedJob, campaignId],
		queryFn: async () => {
			if (!selectedJob) return [];
			const { data, error } = await supabase
				.from("compendium_job_paths")
				.select("*")
				.eq("job_id", selectedJob)
				.order("name");
			if (error) throw error;

			return filterRowsBySourcebookAccess(
				data || [],
				(path) => path.source_book,
				{ campaignId },
			);
		},
		enabled: !!selectedJob,
	});

	const { data: allPaths = [], isLoading: allPathsLoading } = useQuery({
		queryKey: ["gemini-paths-all", campaignId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("compendium_job_paths")
				.select("*")
				.order("name");
			if (error) throw error;

			return filterRowsBySourcebookAccess(
				data || [],
				(path) => path.source_book,
				{ campaignId },
			);
		},
	});

	// Fetch all regents
	const { data: regents = [], isLoading: regentsLoading } = useQuery<
		RegentOption[]
	>({
		queryKey: ["gemini-regents", campaignId],
		queryFn: async () => {
			const canonicalResult = await supabase
				.from("compendium_regents")
				.select("*")
				.order("name");

			let data = (canonicalResult.data as RegentOption[] | null) || [];
			if (canonicalResult.error) {
				const fallbackResult = await supabase
					.from("compendium_regents")
					.select("*")
					.order("name");
				if (fallbackResult.error) throw fallbackResult.error;
				data = (fallbackResult.data as unknown as RegentOption[]) || [];
			}

			return filterRowsBySourcebookAccess(
				data,
				(regent) => regent.source_book,
				{ campaignId },
			);
		},
	});

	const totalCombinations = useMemo(() => {
		if (!jobs.length || !regents.length) return 0;
		const avgPathsPerJob = 4;
		return calculateTotalCombinations(
			jobs.length,
			jobs.length * avgPathsPerJob,
			regents.length,
		);
	}, [jobs.length, regents.length]);

	const autoMode = isPlayer() && !!activeCharacter;

	const canRandomize =
		!jobsLoading &&
		!regentsLoading &&
		!allPathsLoading &&
		jobs.length > 0 &&
		regents.length > 1 &&
		(allPaths.length > 0 || paths.length > 0) &&
		!autoMode;
	const canGenerate =
		selectedJob &&
		selectedPath &&
		selectedRegentA &&
		selectedRegentB &&
		selectedRegentA !== selectedRegentB;

	useEffect(() => {
		if (autoMode) {
			if (!activeCharacter) return;
			if (!selectedJob && jobs.length > 0 && activeCharacter.job) {
				const target = activeCharacter.job.trim().toLowerCase();
				const match = jobs.find(
					(job) => job.name.trim().toLowerCase() === target,
				);
				if (match) {
					setSelectedJob(match.id);
				}
			}
			return;
		}

		if (!selectedJob && jobs.length > 0) {
			setSelectedJob(jobs[0].id);
		}
	}, [activeCharacter, autoMode, jobs, selectedJob]);

	useEffect(() => {
		if (autoMode) {
			if (!activeCharacter?.path) return;
			const normalize = (value: string) => value.trim().toLowerCase();
			const normalizePath = (value: string) =>
				normalize(value.replace(/^path of the\s+/i, ""));
			const desired = normalizePath(activeCharacter.path);
			const match = allPaths.find(
				(path) => normalizePath(path.name) === desired,
			);
			if (match) {
				if (selectedJob !== match.job_id) {
					setSelectedJob(match.job_id);
				}
				if (selectedPath !== match.id) {
					setSelectedPath(match.id);
				}
			}
			return;
		}

		if (selectedJob && !selectedPath && paths.length > 0) {
			setSelectedPath(paths[0].id);
		}
	}, [activeCharacter, allPaths, autoMode, paths, selectedJob, selectedPath]);

	const selectedJobEntry = useMemo(
		() => jobs.find((job) => job.id === selectedJob) || null,
		[jobs, selectedJob],
	);
	const selectedPathEntry = useMemo(
		() =>
			paths.find((path) => path.id === selectedPath) ||
			allPaths.find((path) => path.id === selectedPath) ||
			null,
		[paths, allPaths, selectedPath],
	);
	const selectedRegentAEntry = useMemo(
		() => regents.find((regent) => regent.id === selectedRegentA) || null,
		[regents, selectedRegentA],
	);
	const selectedRegentBEntry = useMemo(
		() => regents.find((regent) => regent.id === selectedRegentB) || null,
		[regents, selectedRegentB],
	);

	const primaryUnlockRegentId = useMemo(() => {
		if (regentUnlocksLoading || regentUnlocks.length === 0) return null;
		const primary =
			regentUnlocks.find(
				(unlock: unknown) => (unlock as { is_primary?: boolean }).is_primary,
			) || regentUnlocks[0];
		return (primary as { regent_id: string }).regent_id;
	}, [regentUnlocks, regentUnlocksLoading]);

	const secondaryUnlockRegentId = useMemo(() => {
		if (regentUnlocksLoading || regentUnlocks.length < 2) return null;
		const secondary = regentUnlocks.find(
			(unlock: unknown) =>
				(unlock as { regent_id: string }).regent_id !== primaryUnlockRegentId,
		);
		return (secondary as { regent_id: string })?.regent_id || null;
	}, [regentUnlocks, regentUnlocksLoading, primaryUnlockRegentId]);

	useEffect(() => {
		if (autoMode) {
			if (primaryUnlockRegentId && selectedRegentA !== primaryUnlockRegentId) {
				setSelectedRegentA(primaryUnlockRegentId);
			}
			if (
				secondaryUnlockRegentId &&
				selectedRegentB !== secondaryUnlockRegentId
			) {
				setSelectedRegentB(secondaryUnlockRegentId);
			}
			return;
		}

		if (!selectedRegentA && regents.length > 0) {
			setSelectedRegentA(regents[0].id);
		}
		if (
			(!selectedRegentB || selectedRegentB === selectedRegentA) &&
			regents.length > 1
		) {
			const fallback =
				regents.find((regent) => regent.id !== selectedRegentA) || regents[1];
			if (fallback) {
				setSelectedRegentB(fallback.id);
			}
		}
	}, [
		autoMode,
		primaryUnlockRegentId,
		secondaryUnlockRegentId,
		regents,
		selectedRegentA,
		selectedRegentB,
	]);

	const [isGenerating, setIsGenerating] = useState(false);

	const handleGenerate = useCallback(async () => {
		// Block if the character already has a Sovereign overlay
		if (autoMode && existingSovereign) return;

		if (
			selectedJobEntry &&
			selectedPathEntry &&
			selectedRegentAEntry &&
			selectedRegentBEntry
		) {
			setIsGenerating(true);

			const broadcastGeneration = (sovereign: GeneratedSovereign) => {
				const title = formatRegentVernacular(sovereign.title);
				const name = formatRegentVernacular(sovereign.name);
				const contextMsg = `System Ascendant Gemini Protocol: Generated Sovereign [${name} - ${title}]`;

				if (campaignId && characterId) {
					ascendantTools.rollInCampaign(campaignId, {
						dice_formula: "0",
						result: 0,
						rolls: [],
						roll_type: "ability",
						context: contextMsg,
						character_id: characterId,
					});
				}

				if (characterId) {
					recordRoll.mutate({
						dice_formula: "0",
						result: 0,
						rolls: [],
						roll_type: "ability",
						context: contextMsg,
						campaign_id: campaignId ?? null,
						character_id: characterId,
					});
				}

				toast({
					title: "Sovereign Generated!",
					description: `The Gemini Protocol has fused ${name}.`,
					duration: 4000,
				});
			};

			try {
				const sovereign = await generateSovereignWithAI(
					selectedJobEntry as never,
					selectedPathEntry as never,
					selectedRegentAEntry as never,
					selectedRegentBEntry as never,
				);
				setGeneratedSovereign(sovereign);
				broadcastGeneration(sovereign);
			} catch {
				const sovereign = generateSovereign(
					selectedJobEntry as never,
					selectedPathEntry as never,
					selectedRegentAEntry as never,
					selectedRegentBEntry as never,
				);
				setGeneratedSovereign(sovereign);
				broadcastGeneration(sovereign);
			} finally {
				setIsGenerating(false);
			}
		}
	}, [
		selectedJobEntry,
		selectedPathEntry,
		selectedRegentAEntry,
		selectedRegentBEntry,
		autoMode,
		campaignId,
		characterId,
		existingSovereign,
		recordRoll,
		ascendantTools,
		toast,
	]);

	const handleRandomize = async () => {
		if (jobs.length === 0 || regents.length < 2) return;

		const pathPool = allPaths.length > 0 ? allPaths : paths;
		if (pathPool.length === 0) return;

		const randomPath = pathPool[Math.floor(Math.random() * pathPool.length)];
		if (!randomPath) return;

		const jobId =
			(randomPath as { job_id?: string }).job_id ||
			jobs[Math.floor(Math.random() * jobs.length)].id;
		setSelectedJob(jobId);
		setSelectedPath(randomPath.id);

		const shuffledRegents = [...regents].sort(() => Math.random() - 0.5);
		const primaryRegent = shuffledRegents[0];
		const secondaryRegent = shuffledRegents.find(
			(regent) => regent.id !== primaryRegent?.id,
		);
		if (!primaryRegent || !secondaryRegent) return;
		setSelectedRegentA(primaryRegent.id);
		setSelectedRegentB(secondaryRegent.id);
	};

	const getActionIcon = (actionType: string | null) => {
		if (!actionType) return <Zap className="h-4 w-4" />;
		if (actionType.toLowerCase().includes("bonus"))
			return <Sparkles className="h-4 w-4" />;
		if (actionType.toLowerCase().includes("reaction"))
			return <Shield className="h-4 w-4" />;
		if (actionType.toLowerCase().includes("passive"))
			return <Crown className="h-4 w-4" />;
		return <Swords className="h-4 w-4" />;
	};

	const dataReady = !jobsLoading && !regentsLoading && !allPathsLoading;
	const templateReady = Boolean(
		selectedJobEntry &&
			selectedPathEntry &&
			selectedRegentAEntry &&
			selectedRegentBEntry &&
			selectedRegentA !== selectedRegentB,
	);
	const autoKey = `${selectedJobEntry?.id || ""}:${selectedPathEntry?.id || ""}:${selectedRegentAEntry?.id || ""}:${selectedRegentBEntry?.id || ""}`;
	const lastAutoKey = useRef<string>("");
	const displaySovereign = generatedSovereign
		? {
				name: formatRegentVernacular(generatedSovereign.name),
				title: formatRegentVernacular(generatedSovereign.title),
				jobName: formatRegentVernacular(generatedSovereign.job.name),
				pathName: formatRegentVernacular(
					generatedSovereign.path.name.replace("Path of the ", ""),
				),
				regentATheme: formatRegentVernacular(
					(generatedSovereign as unknown as { regentA?: { theme?: string } })
						.regentA?.theme,
				),
				regentBTheme: formatRegentVernacular(
					(generatedSovereign as unknown as { regentB?: { theme?: string } })
						.regentB?.theme,
				),
				fusionTheme: formatRegentVernacular(generatedSovereign.fusion_theme),
				powerMultiplier: formatRegentVernacular(
					generatedSovereign.power_multiplier,
				),
				fusionStability: formatRegentVernacular(
					generatedSovereign.fusion_stability,
				),
				description: formatRegentVernacular(generatedSovereign.description),
				fusionDescription: formatRegentVernacular(
					generatedSovereign.fusion_description,
				),
				abilities: generatedSovereign.abilities.map((ability) => ({
					...ability,
					name: formatRegentVernacular(ability.name),
					description: formatRegentVernacular(ability.description),
					action_type: ability.action_type
						? formatRegentVernacular(ability.action_type)
						: null,
					recharge: ability.recharge
						? formatRegentVernacular(ability.recharge)
						: null,
					origin_sources: ability.origin_sources.map(formatRegentVernacular),
				})),
			}
		: null;

	const autoIssues: string[] = [];
	if (autoMode) {
		if (!activeCharacter?.job)
			autoIssues.push("Active character is missing a Job.");
		if (!activeCharacter?.path)
			autoIssues.push("Active character is missing a Path.");
		if (regentUnlocks.length < 2)
			autoIssues.push(
				`Unlock two ${REGENT_LABEL_PLURAL} to auto-generate a Sovereign.`,
			);
		if (activeCharacter?.job && !selectedJobEntry)
			autoIssues.push("No matching Job found in the compendium.");
		if (activeCharacter?.path && !selectedPathEntry)
			autoIssues.push("No matching Path found in the compendium.");
	}

	useEffect(() => {
		if (!autoMode || !dataReady || !templateReady) return;
		// Don't auto-generate if the character already has a locked-in Sovereign
		if (existingSovereign) return;
		if (autoKey === lastAutoKey.current) return;
		handleGenerate();
		lastAutoKey.current = autoKey;
	}, [
		autoKey,
		autoMode,
		dataReady,
		existingSovereign,
		handleGenerate,
		templateReady,
	]);

	return (
		<div className="space-y-6">
			{/* Existing Sovereign Notice (auto player mode only) */}
			{autoMode && existingSovereign && (
				<Card className="border-arise-violet/50 bg-arise-violet/5">
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-arise-violet">
							<Crown className="h-5 w-5" />
							Sovereign Overlay: {existingSovereign.name}
						</CardTitle>
						<p className="text-sm text-muted-foreground italic">
							{existingSovereign.title}
						</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Your character's Sovereign overlay has already been locked in via
							the Gemini Protocol. A Sovereign is a{" "}
							<strong>permanent, once-per-character</strong> subclass fusion —
							it cannot be regenerated or replaced.
						</p>
						<div className="flex flex-wrap gap-2 mt-3">
							{existingSovereign.fusion_theme && (
								<span className="text-xs bg-arise-violet/20 text-arise-violet border border-arise-violet/30 rounded-full px-2 py-0.5">
									{existingSovereign.fusion_theme}
								</span>
							)}
							<span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
								Fusion Stability: {existingSovereign.fusion_stability}
							</span>
							<span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
								Power: {existingSovereign.power_multiplier}
							</span>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Header */}
			<div className="text-center space-y-2">
				<div className="flex items-center justify-center gap-2">
					<Dna className="h-8 w-8 text-primary" />
					<h3 className="text-2xl font-bold">Fusion Console</h3>
				</div>
				<p className="text-muted-foreground">
					Permanent subclass overlays - {totalCombinations.toLocaleString()}+
					combinations available
				</p>
				<p className="text-sm text-muted-foreground italic">
					Any Job + Path + {REGENT_LABEL} A + {REGENT_LABEL} B template
					qualifies for a Sovereign overlay.
				</p>
				<p className="text-xs text-muted-foreground">
					Fusion cues are thematic guides, not literal procedures.
				</p>
				<p className="text-xs text-muted-foreground">
					Gemini Protocol is this world&apos;s sovereign fusion system name and
					is separate from external AI providers.
				</p>
			</div>

			{/* Selection Panel */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>Fusion Components</span>
						{!autoMode && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleRandomize}
								disabled={!canRandomize}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								{jobsLoading || regentsLoading || pathsLoading
									? "Loading..."
									: "Randomize"}
							</Button>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{autoMode ? (
						<div className="space-y-4">
							<div className="text-sm text-muted-foreground">
								Sovereign fusion auto-syncs from your active character. The
								protocol triggers automatically once your Job, Path, and{" "}
								{REGENT_LABEL} pair are complete.
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-1">
									<div className="text-xs uppercase tracking-wide text-muted-foreground">
										Job
									</div>
									<div className="font-medium">
										{selectedJobEntry?.name || "Not set"}
									</div>
								</div>
								<div className="space-y-1">
									<div className="text-xs uppercase tracking-wide text-muted-foreground">
										Path
									</div>
									<div className="font-medium">
										{selectedPathEntry?.name?.replace("Path of the ", "") ||
											"Not set"}
									</div>
								</div>
								<div className="space-y-1">
									<div className="text-xs uppercase tracking-wide text-muted-foreground">
										Primary {REGENT_LABEL}
									</div>
									<div className="font-medium">
										{selectedRegentAEntry
											? `${formatRegentVernacular(selectedRegentAEntry.title || selectedRegentAEntry.name)} (${selectedRegentAEntry.theme})`
											: "Not set"}
									</div>
								</div>
								<div className="space-y-1">
									<div className="text-xs uppercase tracking-wide text-muted-foreground">
										Secondary {REGENT_LABEL}
									</div>
									<div className="font-medium">
										{selectedRegentBEntry
											? `${formatRegentVernacular(selectedRegentBEntry.title || selectedRegentBEntry.name)} (${selectedRegentBEntry.theme})`
											: "Not set"}
									</div>
								</div>
							</div>
							{autoIssues.length > 0 && (
								<Alert>
									<AlertDescription>{autoIssues.join(" ")}</AlertDescription>
								</Alert>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Job Selection */}
							<div className="space-y-2">
								<p className="text-sm font-medium">Job Class</p>
								<Select
									value={selectedJob}
									onValueChange={(v) => {
										setSelectedJob(v);
										setSelectedPath("");
									}}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a Job..." />
									</SelectTrigger>
									<SelectContent>
										{jobs.map((job) => (
											<SelectItem key={job.id} value={job.id}>
												{job.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Path Selection */}
							<div className="space-y-2">
								<p className="text-sm font-medium">Path Specialization</p>
								<Select
									value={selectedPath}
									onValueChange={setSelectedPath}
									disabled={!selectedJob}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={
												selectedJob ? "Select a Path..." : "Select Job first"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{paths.map((path) => (
											<SelectItem key={path.id} value={path.id}>
												{path.name.replace("Path of the ", "")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Regent A Selection */}
							<div className="space-y-2">
								<p className="text-sm font-medium">
									Primary {REGENT_LABEL} (Dominant)
								</p>
								<Select
									value={selectedRegentA}
									onValueChange={setSelectedRegentA}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={`Select Primary ${REGENT_LABEL}...`}
										/>
									</SelectTrigger>
									<SelectContent>
										{regents.map((regent) => (
											<SelectItem
												key={regent.id}
												value={regent.id}
												disabled={regent.id === selectedRegentB}
											>
												{formatRegentVernacular(regent.title || regent.name)} (
												{regent.theme})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Regent B Selection */}
							<div className="space-y-2">
								<p className="text-sm font-medium">
									Secondary {REGENT_LABEL} (Merged)
								</p>
								<Select
									value={selectedRegentB}
									onValueChange={setSelectedRegentB}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={`Select Secondary ${REGENT_LABEL}...`}
										/>
									</SelectTrigger>
									<SelectContent>
										{regents.map((regent) => (
											<SelectItem
												key={regent.id}
												value={regent.id}
												disabled={regent.id === selectedRegentA}
											>
												{formatRegentVernacular(regent.title || regent.name)} (
												{regent.theme})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					<Button
						onClick={handleGenerate}
						disabled={
							!canGenerate || (autoMode && !templateReady) || isGenerating
						}
						className="w-full"
					>
						{isGenerating ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Dna className="h-4 w-4 mr-2" />
						)}
						{isGenerating
							? "Fusing with AI..."
							: autoMode
								? "Generate Sovereign Overlay"
								: "Initiate Gemini Protocol Fusion"}
					</Button>
				</CardContent>
			</Card>

			{/* Generated Sovereign Display */}
			{generatedSovereign && displaySovereign && (
				<Card className="border-primary/50">
					<CardHeader className="bg-primary/5">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Crown className="h-6 w-6 text-primary" />
									<CardTitle className="text-xl">
										{displaySovereign.name}
									</CardTitle>
								</div>
								{/* Only show save if not already saved to this character */}
								{!existingSovereign && (
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											saveSovereign.mutate({
												sovereign: generatedSovereign,
												characterId,
											})
										}
										disabled={saveSovereign.isPending}
									>
										{saveSovereign.isPending ? (
											<Loader2 className="h-4 w-4 mr-2 animate-spin" />
										) : (
											<Save className="h-4 w-4 mr-2" />
										)}
										{characterId ? "Lock In Sovereign" : "Save to Archive"}
									</Button>
								)}
							</div>
							{/* Share button — always shown when sovereign is displayed */}
							<Button
								variant="ghost"
								size="sm"
								onClick={async () => {
									const shareUrl = `${window.location.origin}/compendium?tab=sovereign&name=${encodeURIComponent(displaySovereign.name)}`;
									if (navigator.share) {
										await navigator
											.share({ title: displaySovereign.name, url: shareUrl })
											.catch(() => {});
									} else {
										await navigator.clipboard
											.writeText(shareUrl)
											.catch(() => {});
										toast({
											title: "Link copied",
											description: "Sovereign link copied to clipboard.",
										});
									}
								}}
							>
								<Link2 className="h-4 w-4 mr-1" />
								Share
							</Button>
							<p className="text-lg text-muted-foreground italic">
								{displaySovereign.title}
							</p>

							{/* Component Badges */}
							<div className="flex flex-wrap gap-2">
								<Badge variant="outline">{displaySovereign.jobName}</Badge>
								<Badge variant="outline">{displaySovereign.pathName}</Badge>
								<Badge variant="secondary">
									{displaySovereign.regentATheme}
								</Badge>
								<Badge variant="secondary">
									{displaySovereign.regentBTheme}
								</Badge>
								<Badge className="bg-primary/20 text-primary">
									{displaySovereign.fusionTheme}
								</Badge>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-4 space-y-4">
						{/* Power Stats */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-3 rounded-lg bg-muted/50">
								<h4 className="font-semibold text-sm mb-1">Power Multiplier</h4>
								<p className="text-xs text-muted-foreground">
									{displaySovereign.powerMultiplier}
								</p>
							</div>
							<div className="p-3 rounded-lg bg-muted/50">
								<h4 className="font-semibold text-sm mb-1">Fusion Stability</h4>
								<p className="text-xs text-muted-foreground">
									{displaySovereign.fusionStability}
								</p>
							</div>
						</div>

						<Separator />

						<div>
							<h4 className="font-semibold mb-2">Fusion Origin</h4>
							<p className="text-sm text-muted-foreground whitespace-pre-line">
								{displaySovereign.description}
							</p>
						</div>

						<div>
							<h4 className="font-semibold mb-2">Combat Doctrine</h4>
							<p className="text-sm text-muted-foreground whitespace-pre-line">
								{displaySovereign.fusionDescription}
							</p>
						</div>

						<Separator />

						<div>
							<h4 className="font-semibold mb-3">Fusion Abilities (8 Total)</h4>
							<ScrollArea className="h-[500px] pr-4">
								<div className="space-y-3">
									{displaySovereign.abilities.map((ability, _index) => (
										<div
											key={ability.name}
											data-testid="fusion-ability-card"
											className={`p-3 rounded-lg border ${
												ability.is_capstone
													? "border-primary bg-primary/5"
													: "border-border"
											}`}
										>
											<div className="flex items-start justify-between gap-2 flex-wrap">
												<div className="flex items-center gap-2 flex-wrap">
													{getActionIcon(ability.action_type)}
													<span className="font-medium">{ability.name}</span>
													{ability.is_capstone && (
														<Badge variant="default" className="text-xs">
															CAPSTONE
														</Badge>
													)}
												</div>
												<div className="flex items-center gap-2 text-sm">
													<Badge variant="outline">Level {ability.level}</Badge>
													{ability.action_type && (
														<Badge variant="secondary" className="text-xs">
															{ability.action_type}
														</Badge>
													)}
													{ability.recharge && (
														<Badge variant="secondary" className="text-xs">
															{ability.recharge}
														</Badge>
													)}
												</div>
											</div>
											<p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
												{ability.description}
											</p>
											<div className="flex flex-wrap gap-1 mt-2">
												{ability.origin_sources.map((source, _i) => (
													<span
														key={source}
														className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
													>
														{source}
													</span>
												))}
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
