import { Plug, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { type ModuleManifest, moduleHost } from "@/lib/modules/host";

/**
 * Misty Pearl G3 — Bureau Directive Extensions install panel.
 *
 * Per-campaign module loader. Wardens upload a module manifest JSON
 * file referencing a same-origin bundle URL; the host validates the
 * shape, sandboxes the bundle in a Web Worker, and surfaces an opt-in
 * toggle that the Warden can flip without uninstalling. No remote
 * registry — every bundle is Warden-vetted before it touches the
 * campaign (per the plan's safety policy).
 *
 * RA theming: "Bureau Directive Extensions" — sandboxed protocol
 * overrides the Warden authorizes for their campaign.
 */
export interface BureauDirectiveExtensionsPanelProps {
	campaignId: string;
}

const VALID_HOOKS: ReadonlyArray<string> = [
	"token:created",
	"token:moved",
	"token:removed",
	"scene:loaded",
	"scene:changed",
	"combat:turnStart",
	"combat:turnEnd",
	"combat:roundStart",
	"combat:roundEnd",
	"roll:submitted",
	"effect:applied",
	"effect:expired",
];

const VALID_ACTIONS: ReadonlyArray<string> = [
	"chat:send",
	"toast:show",
	"log:append",
	"scene:fog-toggle",
];

const VALID_UI_SLOTS: ReadonlyArray<string> = [
	"right-rail-tab",
	"left-rail-section",
];

interface InstalledRow {
	manifest: ModuleManifest;
	enabled: boolean;
}

function validateManifest(raw: unknown): ModuleManifest {
	if (!raw || typeof raw !== "object") {
		throw new Error("Manifest must be a JSON object.");
	}
	const m = raw as Partial<ModuleManifest>;
	if (typeof m.id !== "string" || !m.id)
		throw new Error("Manifest missing id.");
	if (typeof m.name !== "string" || !m.name)
		throw new Error("Manifest missing name.");
	if (typeof m.version !== "string" || !m.version)
		throw new Error("Manifest missing version.");
	if (typeof m.author !== "string" || !m.author)
		throw new Error("Manifest missing author.");
	if (typeof m.bundleUrl !== "string" || !m.bundleUrl)
		throw new Error("Manifest missing bundleUrl.");
	if (!Array.isArray(m.hooks))
		throw new Error("Manifest hooks must be an array.");
	if (!Array.isArray(m.actions))
		throw new Error("Manifest actions must be an array.");
	for (const hook of m.hooks) {
		if (typeof hook !== "string" || !VALID_HOOKS.includes(hook)) {
			throw new Error(`Unknown hook: ${String(hook)}`);
		}
	}
	for (const action of m.actions) {
		if (typeof action !== "string" || !VALID_ACTIONS.includes(action)) {
			throw new Error(`Unknown action: ${String(action)}`);
		}
	}
	if (m.uiSlots) {
		if (!Array.isArray(m.uiSlots))
			throw new Error("Manifest uiSlots must be an array.");
		for (const slot of m.uiSlots) {
			if (typeof slot !== "string" || !VALID_UI_SLOTS.includes(slot)) {
				throw new Error(`Unknown UI slot: ${String(slot)}`);
			}
		}
	}
	return m as ModuleManifest;
}

const STORAGE_PREFIX = "bureau.modules";
const storageKey = (campaignId: string) => `${STORAGE_PREFIX}.${campaignId}.v1`;

function readPersisted(campaignId: string): InstalledRow[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(storageKey(campaignId));
		if (!raw) return [];
		const parsed = JSON.parse(raw) as InstalledRow[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writePersisted(campaignId: string, rows: InstalledRow[]) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(storageKey(campaignId), JSON.stringify(rows));
	} catch {
		/* quota exceeded etc. — swallow */
	}
}

export function BureauDirectiveExtensionsPanel({
	campaignId,
}: BureauDirectiveExtensionsPanelProps) {
	const { toast } = useToast();
	const [rows, setRows] = useState<InstalledRow[]>(() =>
		readPersisted(campaignId),
	);
	const fileRef = useRef<HTMLInputElement | null>(null);

	// Hydrate the Worker host on mount for already-enabled modules.
	useEffect(() => {
		for (const row of rows) {
			if (!row.enabled) continue;
			moduleHost.install(row.manifest).catch((err) => {
				console.warn("[BureauDirectiveExtensions] install failed:", err);
			});
		}
		return () => {
			moduleHost.uninstallAll();
		};
		// Only on mount/unmount — subsequent state changes route through
		// the toggle handlers below.
	}, [rows]);

	const handleFile = async (file: File) => {
		try {
			const text = await file.text();
			const json = JSON.parse(text);
			const manifest = validateManifest(json);
			setRows((prev) => {
				const exists = prev.find((r) => r.manifest.id === manifest.id);
				const next: InstalledRow[] = exists
					? prev.map((r) =>
							r.manifest.id === manifest.id ? { ...r, manifest } : r,
						)
					: [...prev, { manifest, enabled: false }];
				writePersisted(campaignId, next);
				return next;
			});
			toast({
				title: "Directive Extension staged",
				description: `${manifest.name} v${manifest.version} added. Toggle it on to load into the worker sandbox.`,
			});
		} catch (err) {
			toast({
				title: "Invalid manifest",
				description: err instanceof Error ? err.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			if (fileRef.current) fileRef.current.value = "";
		}
	};

	const setEnabled = async (moduleId: string, enabled: boolean) => {
		const row = rows.find((r) => r.manifest.id === moduleId);
		if (!row) return;
		try {
			if (enabled) {
				await moduleHost.install(row.manifest);
			} else {
				moduleHost.uninstall(moduleId);
			}
		} catch (err) {
			toast({
				title: "Bureau sandbox refused the extension",
				description: err instanceof Error ? err.message : "Unknown error",
				variant: "destructive",
			});
			return;
		}
		setRows((prev) => {
			const next = prev.map((r) =>
				r.manifest.id === moduleId ? { ...r, enabled } : r,
			);
			writePersisted(campaignId, next);
			return next;
		});
	};

	const remove = (moduleId: string) => {
		moduleHost.uninstall(moduleId);
		setRows((prev) => {
			const next = prev.filter((r) => r.manifest.id !== moduleId);
			writePersisted(campaignId, next);
			return next;
		});
	};

	return (
		<AscendantWindow title="BUREAU DIRECTIVE EXTENSIONS">
			<section
				className="space-y-3"
				data-testid="bureau-directive-extensions-panel"
				aria-label="Bureau Directive Extensions"
			>
				<p className="text-xs text-muted-foreground">
					Sandboxed Worker-based extensions you authorize per campaign. Drop in
					a manifest JSON that references a same-origin bundle. No remote
					registry — every extension is Warden-vetted.
				</p>

				<div>
					<input
						ref={fileRef}
						type="file"
						accept="application/json,.json"
						className="hidden"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) void handleFile(file);
						}}
					/>
					<Button
						size="sm"
						variant="outline"
						onClick={() => fileRef.current?.click()}
						data-testid="bureau-directive-extensions-add"
					>
						<Upload className="w-3.5 h-3.5 mr-1" />
						Stage Extension manifest
					</Button>
				</div>

				<div className="space-y-1.5">
					{rows.length === 0 && (
						<p className="text-[10px] text-muted-foreground italic">
							No extensions staged.
						</p>
					)}
					{rows.map((row) => (
						<div
							key={row.manifest.id}
							className="rounded-md border border-border/60 bg-muted/30 p-2 space-y-1"
							data-testid={`bureau-module-${row.manifest.id}`}
						>
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 flex-1 min-w-0">
									<Plug className="w-3.5 h-3.5 text-primary/70" aria-hidden />
									<div className="min-w-0">
										<p className="text-xs font-medium truncate">
											{row.manifest.name}{" "}
											<span className="font-mono text-[10px] text-muted-foreground">
												v{row.manifest.version}
											</span>
										</p>
										<p className="text-[10px] text-muted-foreground truncate">
											by {row.manifest.author}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-1.5">
									<Switch
										checked={row.enabled}
										onCheckedChange={(checked) =>
											void setEnabled(row.manifest.id, checked)
										}
										aria-label={`Enable ${row.manifest.name}`}
									/>
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7 text-destructive"
										onClick={() => remove(row.manifest.id)}
										aria-label={`Remove ${row.manifest.name}`}
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								</div>
							</div>
							{row.manifest.description && (
								<p className="text-[10px] text-muted-foreground">
									{row.manifest.description}
								</p>
							)}
							<p className="text-[9px] text-muted-foreground">
								Hooks: {row.manifest.hooks.join(", ") || "none"} · Actions:{" "}
								{row.manifest.actions.join(", ") || "none"}
							</p>
						</div>
					))}
				</div>
			</section>
		</AscendantWindow>
	);
}
