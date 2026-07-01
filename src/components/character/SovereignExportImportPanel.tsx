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
	buildSovereignExport,
	parseImportedSovereign,
	type SovereignInputs,
} from "@/lib/sovereign/sovereignContract";
import { formatRegentVernacular } from "@/lib/vernacular";

interface SovereignExportImportPanelProps {
	job: Job;
	path: Path;
	regentA: Regent;
	regentB: Regent;
	characterId?: string;
	/** Block applying when the character already has a locked-in Sovereign. */
	alreadyLockedIn?: boolean;
}

/**
 * "Use an outside AI" flow for the Gemini Protocol fusion. Exports the exact
 * fusion inputs as a ready-to-paste prompt (or downloadable bundle), then
 * validates and applies the JSON the user brings back — so a Sovereign created
 * in ChatGPT/Claude/Gemini lands on the character exactly like an embedded one.
 */
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

	const inputs: SovereignInputs = useMemo(
		() => ({ job, path, regentA, regentB }),
		[job, path, regentA, regentB],
	);
	const exportData = useMemo(() => buildSovereignExport(inputs), [inputs]);

	const handleCopyPrompt = async () => {
		try {
			await navigator.clipboard.writeText(exportData.prompt);
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
		const blob = new Blob([JSON.stringify(exportData.bundle, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `sovereign-request-${regentA.id}-${regentB.id}.json`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	const runParse = (raw: string) => {
		const result = parseImportedSovereign(raw, inputs);
		if (result.ok) {
			setParsed(result.sovereign);
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
							Download request (.json)
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
						it and re-attach your canonical Job/Path/Regents automatically.
					</p>
					<Textarea
						value={importText}
						onChange={(event) => setImportText(event.target.value)}
						placeholder='Paste the AI response here, e.g. {"name": "...", "abilities": [ ... ]}'
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
