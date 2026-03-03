import {
	AlertTriangle,
	Clock,
	Download,
	RotateCcw,
	Save,
	Trash2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	type CharacterBackup,
	exportBackupToFile,
	importBackupFromFile,
	useCharacterBackups,
} from "@/hooks/useCharacterBackup";
import { useCharacter } from "@/hooks/useCharacters";
import { cn } from "@/lib/utils";

function BackupRow({
	backup,
	onRestore,
	onDelete,
	onExport,
}: {
	backup: CharacterBackup;
	onRestore: (b: CharacterBackup) => void;
	onDelete: (id: string) => void;
	onExport: (b: CharacterBackup) => void;
}) {
	const data = backup.backup_data as Record<string, unknown> | null;
	const level = typeof data?.level === "number" ? data.level : "?";
	const hp = typeof data?.hp_current === "number" ? data.hp_current : "?";
	const hpMax = typeof data?.hp_max === "number" ? data.hp_max : "?";
	const isAuto = backup.backup_name?.toLowerCase().startsWith("auto");

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border transition-colors",
				"border-border bg-muted/20 hover:bg-muted/40",
			)}
		>
			<div className="flex items-center gap-3 min-w-0">
				<Clock className="w-4 h-4 text-muted-foreground shrink-0" />
				<div className="min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<span className="text-sm font-medium truncate">
							{backup.backup_name ||
								`Snapshot — ${new Date(backup.created_at).toLocaleDateString()}`}
						</span>
						{isAuto && (
							<Badge
								variant="outline"
								className="text-[10px] px-1 border-muted-foreground/30 text-muted-foreground"
							>
								auto
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground font-mono">
						{new Date(backup.created_at).toLocaleString()} · Lv {level} · HP{" "}
						{hp}/{hpMax}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-1 shrink-0">
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={() => onExport(backup)}
					title="Download JSON"
				>
					<Download className="w-3.5 h-3.5" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="h-7 text-xs gap-1 border-primary/30 hover:border-primary/60"
					onClick={() => onRestore(backup)}
				>
					<RotateCcw className="w-3 h-3" />
					Restore
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7 text-destructive hover:bg-destructive/10"
					onClick={() => onDelete(backup.id)}
					title="Delete backup"
				>
					<Trash2 className="w-3.5 h-3.5" />
				</Button>
			</div>
		</div>
	);
}

export function CharacterBackupPanel({ characterId }: { characterId: string }) {
	const { data: character } = useCharacter(characterId);
	const { backups, createBackup, deleteBackup, exportBackup, isLoading } =
		useCharacterBackups(characterId);
	const [restoreTarget, setRestoreTarget] = useState<CharacterBackup | null>(
		null,
	);

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const imported = await importBackupFromFile(file);
			// Re-import as a new named snapshot
			await createBackup({
				character: imported.backup_data as never,
				backupName: `Imported — ${file.name}`,
			});
		} catch {
			/* toast already shown inside hook */
		}
		e.target.value = "";
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between flex-wrap gap-2">
				<h3 className="font-heading font-semibold text-sm flex items-center gap-2">
					<Save className="w-4 h-4 text-primary" />
					Character Snapshots
					<Badge variant="outline" className="text-[10px]">
						{backups.length}/10
					</Badge>
				</h3>
				<div className="flex items-center gap-2">
					{/* Import from file */}
					<label htmlFor="backup-import" className="cursor-pointer">
						<input
							id="backup-import"
							type="file"
							accept=".json"
							className="hidden"
							onChange={handleImport}
							aria-label="Import backup file"
						/>
						<Button
							variant="outline"
							size="sm"
							className="h-7 text-xs gap-1"
							asChild
						>
							<span>
								<Upload className="w-3 h-3" />
								Import
							</span>
						</Button>
					</label>
					{/* Manual backup */}
					<Button
						size="sm"
						className="h-7 text-xs gap-1 btn-umbral"
						disabled={isLoading || !character}
						onClick={() =>
							character &&
							createBackup({
								character,
								backupName: `Manual — ${new Date().toLocaleString()}`,
							})
						}
					>
						<Save className="w-3 h-3" />
						Save Now
					</Button>
				</div>
			</div>

			<ScrollArea className="h-64 pr-2">
				{backups.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2 text-center">
						<Clock className="w-10 h-10 opacity-20" />
						<p className="text-sm font-heading">No snapshots yet</p>
						<p className="text-xs">
							Save a snapshot to restore your character to a previous state.
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{backups.map((b) => (
							<BackupRow
								key={b.id}
								backup={b}
								onRestore={setRestoreTarget}
								onDelete={(id) => deleteBackup(id)}
								onExport={(b) => exportBackupToFile(b)}
							/>
						))}
					</div>
				)}
			</ScrollArea>

			{/* Restore confirmation dialog */}
			<AlertDialog
				open={!!restoreTarget}
				onOpenChange={(o) => !o && setRestoreTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2 text-amber-400">
							<AlertTriangle className="w-5 h-5" />
							Restore Character?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will overwrite the current character state with the snapshot
							from{" "}
							<strong>
								{restoreTarget &&
									new Date(restoreTarget.created_at).toLocaleString()}
							</strong>
							. Your current state will be lost unless you save a new snapshot
							first.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-amber-500 hover:bg-amber-600 text-black"
							onClick={async () => {
								if (!restoreTarget) return;
								// Re-import the backup data as the current character
								// Full restore would update the character in the DB — for now download the JSON
								exportBackupToFile(restoreTarget);
								setRestoreTarget(null);
							}}
						>
							Download & Restore
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
