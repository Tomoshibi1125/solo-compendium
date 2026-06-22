import { Brain, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { aiService } from "@/lib/ai/aiService";
import type {
	AIFreeModel,
	AIUserProvider,
	AIUserSettings,
} from "@/lib/ai/userSettings";
import {
	DEFAULT_AI_USER_SETTINGS,
	loadAIUserSettings,
	saveAIUserSettings,
} from "@/lib/ai/userSettings";
import { cn } from "@/lib/utils";

interface AIProviderSettingsProps {
	className?: string;
}

const FREE_PROVIDER_LABEL = "Best Free AI (Integrated, 100% free)";
const FREE_PROVIDER_ENDPOINT = "Integrated Server-side Proxy";
const FREE_PROVIDER_MODEL = "gemini-2.5-flash";
const FREE_FALLBACK_LABEL = "OpenRouter free models, then keyless Pollinations";

const FREE_MODEL_OPTIONS: {
	value: AIFreeModel;
	label: string;
	hint: string;
}[] = [
	{
		value: "auto",
		label: "Auto — best free model (recommended)",
		hint: "Picks the best free model and falls back automatically if one is rate-limited or blocked.",
	},
	{
		value: "gemini",
		label: "Google Gemini 2.5 Flash",
		hint: "Best overall free model — ~1,500 requests/day, no card.",
	},
	{
		value: "openrouter",
		label: "OpenRouter (free models)",
		hint: "DeepSeek / Llama / Qwen free models — stricter limits, lots of variety.",
	},
	{
		value: "pollinations",
		label: "Pollinations (keyless)",
		hint: "Always-on and key-free — a reliable choice when others are limited.",
	},
];

export function AIProviderSettings({ className }: AIProviderSettingsProps) {
	const [settings, setSettings] = useState<AIUserSettings>(
		DEFAULT_AI_USER_SETTINGS,
	);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		setSettings(loadAIUserSettings());
	}, []);

	const setProvider = (provider: AIUserProvider) => {
		setSettings((prev) => ({ ...prev, provider }));
	};

	const handleSave = () => {
		saveAIUserSettings(settings);
		aiService.applyUserSettings(settings);
		setSaved(true);
		window.setTimeout(() => setSaved(false), 2000);
	};

	const handleUseFree = () => {
		const next = { ...DEFAULT_AI_USER_SETTINGS, provider: "free" as const };
		setSettings(next);
		saveAIUserSettings(next);
		aiService.applyUserSettings(next);
		setSaved(true);
		window.setTimeout(() => setSaved(false), 2000);
	};

	const showCustomWarning =
		settings.provider === "custom" && !settings.apiKey.trim();

	return (
		<Card className={cn("border-dashed", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Brain className="w-4 h-4" />
					AI Provider Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="text-sm text-muted-foreground">
					Default AI: {FREE_PROVIDER_LABEL} ({FREE_PROVIDER_ENDPOINT})
					<br />
					Best-in-class free chain:{" "}
					<code className="text-xs">{FREE_PROVIDER_MODEL}</code> (Gemini 2.5
					Flash) → {FREE_FALLBACK_LABEL}.
					<br />
					No setup or API key needed — it just works, on every device.
				</div>

				<RadioGroup
					value={settings.provider}
					onValueChange={(value) => setProvider(value as AIUserProvider)}
					className="grid gap-3"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem id="ai-provider-free" value="free" />
						<Label htmlFor="ai-provider-free">
							Use hosted free provider (recommended)
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem id="ai-provider-custom" value="custom" />
						<Label htmlFor="ai-provider-custom">Use my API key</Label>
					</div>
				</RadioGroup>

				{settings.provider === "free" && (
					<div className="grid gap-3 rounded-md border border-border/60 p-3">
						<div className="space-y-2">
							<Label htmlFor="ai-free-model">Free model</Label>
							<Select
								value={settings.freeModel}
								onValueChange={(value) =>
									setSettings((prev) => ({
										...prev,
										freeModel: value as AIFreeModel,
									}))
								}
							>
								<SelectTrigger id="ai-free-model">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{FREE_MODEL_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								{
									FREE_MODEL_OPTIONS.find((o) => o.value === settings.freeModel)
										?.hint
								}
								{settings.freeModel !== "auto" &&
									" If it's rate-limited or blocked, the app automatically falls back to the other free models."}
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ai-free-model-id">
								Specific model id (optional)
							</Label>
							<Input
								id="ai-free-model-id"
								value={settings.freeModelId}
								disabled={settings.freeModel === "auto"}
								onChange={(event) =>
									setSettings((prev) => ({
										...prev,
										freeModelId: event.target.value,
									}))
								}
								placeholder={
									settings.freeModel === "openrouter"
										? "e.g. meta-llama/llama-3.3-70b-instruct:free"
										: settings.freeModel === "gemini"
											? "e.g. gemini-2.5-flash"
											: "Leave blank for the default"
								}
							/>
							<p className="text-xs text-muted-foreground">
								Advanced — pin an exact free model for the provider above.
							</p>
						</div>
					</div>
				)}

				{settings.provider === "custom" && (
					<div className="grid gap-4">
						<div className="space-y-2">
							<Label htmlFor="ai-api-base">API base URL</Label>
							<Input
								id="ai-api-base"
								value={settings.apiBase}
								onChange={(event) =>
									setSettings((prev) => ({
										...prev,
										apiBase: event.target.value,
									}))
								}
								placeholder="https://api.openai.com/v1"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ai-model">Model</Label>
							<Input
								id="ai-model"
								value={settings.model}
								onChange={(event) =>
									setSettings((prev) => ({
										...prev,
										model: event.target.value,
									}))
								}
								placeholder="gpt-4o-mini"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="ai-api-key" className="flex items-center gap-2">
								<KeyRound className="w-4 h-4" />
								API key
							</Label>
							<Input
								id="ai-api-key"
								type="password"
								autoComplete="off"
								value={settings.apiKey}
								onChange={(event) =>
									setSettings((prev) => ({
										...prev,
										apiKey: event.target.value,
									}))
								}
								placeholder="Paste your API key"
							/>
							<p className="text-xs text-muted-foreground">
								Stored locally in this browser only.
							</p>
						</div>
					</div>
				)}

				{showCustomWarning && (
					<Alert variant="destructive">
						<AlertDescription>
							Custom provider selected but no API key is set.
						</AlertDescription>
					</Alert>
				)}

				<div className="flex flex-wrap gap-2">
					<Button type="button" onClick={handleSave}>
						Save settings
					</Button>
					<Button type="button" variant="outline" onClick={handleUseFree}>
						Use hosted free provider
					</Button>
					{saved && <span className="text-xs text-emerald-600">Saved.</span>}
				</div>
			</CardContent>
		</Card>
	);
}
