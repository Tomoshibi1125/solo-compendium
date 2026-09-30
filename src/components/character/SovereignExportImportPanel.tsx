import {
	CheckCircle2,
	Copy,
	Download,
	Loader2,
	Save,
	Upload,
	Wand2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSaveSovereign } from "@/hooks/useSavedSovereigns";
import type {
	GeneratedSovereign,
	Job,
	Path,
	Regent,
} from "@/lib/geminiProtocol";
import {
	type SovereignV2Definition,
	validateGeneratedSovereignBudget,
	validateSovereignV2Definition,
} from "@/lib/sovereign/sovereignV2Contract";
import { formatRegentVernacular } from "@/lib/vernacular";
import sovereignV2Schema from "../../../supabase/sovereign_v2.schema.json";

interface SovereignExportImportPanelProps {
	job: Job;
	path: Path;
	regentA: Regent;
	regentB: Regent;
	characterId?: string;
	/** Block applying when the character already has a locked-in Sovereign. */
	alreadyLockedIn?: boolean;
}

function parseJsonObject(text: string): unknown {
	const trimmed = text
		.trim()
		.replace(/^```(?:json)?\s*/i, "")
		.replace(/\s*```$/i, "");
	try {
		return JSON.parse(trimmed);
	} catch {
		const start = trimmed.indexOf("{");
		const end = trimmed.lastIndexOf("}");
		if (start < 0 || end <= start) throw new Error("No JSON object found");
		return JSON.parse(trimmed.slice(start, end + 1));
	}
}

function toPreview(
	definition: SovereignV2Definition,
	job: Job,
	path: Path,
	regentA: Regent,
	regentB: Regent,
): GeneratedSovereign {
	return {
		name: definition.identity.name,
		title: definition.identity.title,
		description: definition.description,
		fusion_theme: definition.fusion_theme,
		fusion_description: definition.combat_doctrine,
		fusion_method: "Gemini Protocol (outside AI)",
		power_multiplier: "Versioned v2 mechanics",
		fusion_stability: "Validated v2 definition",
		abilities: definition.abilities.map((ability) => ({
			name: ability.name,
			description: ability.description,
			level: ability.level,
			action_type: ability.action_type,
			recharge: ability.recharge,
			is_capstone: ability.is_capstone,
			origin_sources: ability.ancestry,
			fusion_type: "unified",
		})),
		job,
		path,
		regentA,
		regentB,
		schema_version: 2,
		definition,
	} as GeneratedSovereign;
}

/** Outside-AI fusion must return the same complete v2 package as built-in AI. */
export function SovereignExportImportPanel({
	job,
	path,
	regentA,
	regentB,
	characterId,
	alreadyLockedIn,
}: SovereignExportImportPanelProps) {
	const { toast } = useToast();
	const saveSovereign = useSaveSovereign();
	const fileRef = useRef<HTMLInputElement>(null);
	const [importText, setImportText] = useState("");
	const [parsed, setParsed] = useState<GeneratedSovereign | null>(null);
	const [errors, setErrors] = useState<string[]>([]);

	const [importIdentity] = useState(() => ({
		id: `sovereign.external.${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`,
		operationId: `external-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`,
		generatedAt: new Date().toISOString(),
	}));
	const sourceIds = useMemo(
		() => ({
			job: String(job.id),
			path: String(path.id),
			regent_a: String(regentA.id),
			regent_b: String(regentB.id),
		}),
		[job.id, path.id, regentA.id, regentB.id],
	);
	const prompt = useMemo(
		() =>
			[
				"Create exactly one complete Rift Ascendant Sovereign v2 JSON object. Return JSON only, with no markdown.",
				"Every field required by the attached JSON schema must be present. Include exactly eight ordered abilities at levels 1, 3, 5, 7, 10, 14, 17, 20. Levels 17 and 20 are capstones.",
				"Use the schema's bounded mechanics. At least four active abilities need typed mechanics, including an attack and a save. Include exactly one PB/long-rest resource, one canonical skill proficiency modifier owned by a feature, and one or two typed level 10+ abilities spending one point from that resource.",
				`Set id to ${importIdentity.id}. Set generation to ${JSON.stringify({ contract_revision: 2, ruleset_revision: "rules.sovereign-v2.s5", canonical_source_revision: "external-v2", generator: "Outside AI import", generated_at: importIdentity.generatedAt, operation_id: importIdentity.operationId, source_ids: sourceIds })}.`,
				'Set schema_version to 2 and compatibility to {"status":"native","notes":[]}.',
				`Canonical sources: ${JSON.stringify({ job: { id: job.id, name: job.name }, path: { id: path.id, name: path.name }, regent_a: { id: regentA.id, name: regentA.name }, regent_b: { id: regentB.id, name: regentB.name } })}`,
				`JSON schema: ${JSON.stringify(sovereignV2Schema)}`,
			].join("\n\n"),
		[job, path, regentA, regentB, sourceIds, importIdentity],
	);

	const handleCopyPrompt = async () => {
		try {
			await navigator.clipboard.writeText(prompt);
			toast({
				title: "Prompt copied",
				description:
					"Paste it into any AI (ChatGPT, Claude, Gemini), then bring its JSON reply back here.",
			});
		} catch {
			toast({ title: "Copy failed", variant: "destructive" });
		}
	};

	const handleDownloadBundle = () => {
		const blob = new Blob([prompt], {
			type: "text/plain",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `sovereign-request-${regentA.id}-${regentB.id}.txt`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const runParse = (raw: string) => {
		let parsedJson: unknown;
		try {
			parsedJson = parseJsonObject(raw);
		} catch (error) {
			setParsed(null);
			setErrors([error instanceof Error ? error.message : "Invalid JSON"]);
			return;
		}
		const result = validateSovereignV2Definition(parsedJson, sourceIds);
		if (result.ok) {
			const budgetErrors = validateGeneratedSovereignBudget(result.definition);
			if (budgetErrors.length > 0) {
				setParsed(null);
				setErrors(budgetErrors);
				return;
			}
			setParsed(toPreview(result.definition, job, path, regentA, regentB));
			setErrors([]);
		} else {
			setParsed(null);
			setErrors(result.errors);
		}
	};

	const handleFile = async (file: File | undefined) => {
		if (!file) return;
		const text = await file.text();
		setImportText(text);
		runParse(text);
	};

	const handleLockIn = () => {
		if (!parsed) return;
		saveSovereign.mutate(
			{ sovereign: parsed, characterId },
			{
				onSuccess: () => {
					setParsed(null);
					setImportText("");
					setErrors([]);
				},
			},
		);
	};

	return (
		<div className="space-y-4">
			{/* Step 1 — export */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<Wand2 className="h-4 w-4" />
						1. Send the fusion to your AI
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-muted-foreground">
						Copy the ready-made prompt into any AI chat (ChatGPT, Claude,
						Gemini, …). It already contains this Job, Path, and both Regents and
						asks for a strict JSON Sovereign.
					</p>
					<div className="flex flex-wrap gap-2">
						<Button type="button" variant="outline" onClick={handleCopyPrompt}>
							<Copy className="h-4 w-4 mr-2" />
							Copy prompt
						</Button>
						<Button
							type="button"
							variant="ghost"
							onClick={handleDownloadBundle}
						>
							<Download className="h-4 w-4 mr-2" />
							Download request (.txt)
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Step 2 — import */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<Upload className="h-4 w-4" />
						2. Bring the result back
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-sm text-muted-foreground">
						Paste the AI's reply (the JSON, even with surrounding text) or
						upload its <code className="text-xs">.json</code> file. We validate
						it as a complete version 2 definition against your selected Job,
						Path, and Regents.
					</p>
					<Textarea
						value={importText}
						onChange={(event) => setImportText(event.target.value)}
						placeholder='Paste the complete v2 JSON response here, e.g. {"schema_version": 2, "abilities": [ ... ]}'
						className="min-h-[140px] font-mono text-xs"
					/>
					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							onClick={() => runParse(importText)}
							disabled={!importText.trim()}
						>
							<CheckCircle2 className="h-4 w-4 mr-2" />
							Validate &amp; preview
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => fileRef.current?.click()}
						>
							<Upload className="h-4 w-4 mr-2" />
							Upload .json
						</Button>
						<input
							ref={fileRef}
							type="file"
							accept="application/json,.json,.txt"
							className="hidden"
							onChange={(event) => {
								handleFile(event.target.files?.[0]);
								event.target.value = "";
							}}
						/>
					</div>

					{errors.length > 0 && (
						<Alert variant="destructive">
							<AlertDescription>
								<p className="font-medium mb-1">Couldn't apply this fusion:</p>
								<ul className="list-disc pl-4 space-y-0.5 text-xs">
									{errors.map((error) => (
										<li key={error}>{error}</li>
									))}
								</ul>
							</AlertDescription>
						</Alert>
					)}

					{parsed && (
						<div className="rounded-lg border border-primary/40 bg-primary/5 p-3 space-y-2">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4 text-success" />
								<span className="font-semibold">
									{formatRegentVernacular(parsed.name)}
								</span>
							</div>
							<p className="text-sm italic text-muted-foreground">
								{formatRegentVernacular(parsed.title)}
							</p>
							<div className="flex flex-wrap gap-2">
								<Badge variant="secondary">
									{formatRegentVernacular(parsed.fusion_theme)}
								</Badge>
								<Badge variant="outline">
									{parsed.abilities.length} abilities
								</Badge>
								<Badge variant="outline">{parsed.power_multiplier}</Badge>
							</div>
							{alreadyLockedIn ? (
								<Alert>
									<AlertDescription>
										This character already has a Sovereign overlay — it's
										permanent and can't be replaced.
									</AlertDescription>
								</Alert>
							) : (
								<Button
									type="button"
									onClick={handleLockIn}
									disabled={saveSovereign.isPending}
									className="w-full"
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
					)}
				</CardContent>
			</Card>
		</div>
	);
}
