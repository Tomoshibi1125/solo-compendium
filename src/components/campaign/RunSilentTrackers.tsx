import {
	ChevronDown,
	Minus,
	Plus,
	RotateCcw,
	Skull,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// "Run Silent" Warden trackers — the Hunt Clock (party-wide, 6 segments) and a
// per-character Dread track (0-6). Numbers and effects mirror the frozen
// "Running This Horror" chapter. State persists per-campaign in localStorage so
// it survives reloads without round-tripping the backend.
// ---------------------------------------------------------------------------

const HUNT_MAX = 6;
const DREAD_MAX = 6;
const HUNT_RESET = 2; // after a strike, the clock resets to 2 — it is closer now.

const DREAD_EFFECTS: Record<number, string> = {
	0: "Steady",
	1: "Unsettled",
	2: "Unsettled",
	3: "Shaken — disadv. on the first fear/uncanny save each scene",
	4: "Fraying — once/scene may mis-see an ally as the Quiet",
	5: "Breaking — disadv. near any familiar face; one hallucination",
	6: "Unmade — does the thing that gets someone taken",
};

interface DreadTrack {
	id: string;
	name: string;
	value: number;
}

function useStored<T>(
	key: string,
	initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
	const [value, setValue] = useState<T>(() => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? (JSON.parse(raw) as T) : initial;
		} catch {
			return initial;
		}
	});
	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			// ignore quota / serialization failures — trackers are best-effort
		}
	}, [key, value]);
	return [value, setValue];
}

function clamp(n: number, max: number) {
	return Math.max(0, Math.min(max, n));
}

export function RunSilentTrackers({ campaignId }: { campaignId: string }) {
	const [open, setOpen] = useStored(`rs-trackers-open-${campaignId}`, false);
	const [hunt, setHunt] = useStored(`rs-hunt-${campaignId}`, 0);
	const [dread, setDread] = useStored<DreadTrack[]>(
		`rs-dread-${campaignId}`,
		[],
	);
	const [newName, setNewName] = useState("");

	const peaked = hunt >= HUNT_MAX;

	const addDread = () => {
		const name = newName.trim();
		if (!name) return;
		setDread((prev) => [
			...prev,
			{
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				name,
				value: 0,
			},
		]);
		setNewName("");
	};

	const setDreadValue = (id: string, value: number) =>
		setDread((prev) =>
			prev.map((d) =>
				d.id === id ? { ...d, value: clamp(value, DREAD_MAX) } : d,
			),
		);

	const removeDread = (id: string) =>
		setDread((prev) => prev.filter((d) => d.id !== id));

	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={cn(
					"fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border px-4 py-2.5 font-display text-xs uppercase tracking-widest shadow-lg backdrop-blur-md transition-colors",
					peaked
						? "animate-pulse border-red-500/60 bg-red-950/70 text-red-300"
						: "border-resurge-violet/40 bg-black/70 text-resurge-violet hover:border-resurge-violet hover:text-white",
				)}
				aria-label="Open the Hunt and Dread trackers"
			>
				<Skull className="h-4 w-4" />
				Hunt {hunt}/{HUNT_MAX}
			</button>
		);
	}

	return (
		<div className="fixed bottom-5 right-5 z-50 w-80 max-w-[calc(100vw-2.5rem)] rounded-lg border border-resurge-violet/30 bg-black/85 p-4 shadow-2xl backdrop-blur-md">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.2em] text-resurge-violet">
					<Skull className="h-4 w-4" />
					Hunt &amp; Dread
				</h3>
				<button
					type="button"
					onClick={() => setOpen(false)}
					className="text-slate-500 hover:text-white"
					aria-label="Collapse trackers"
				>
					<ChevronDown className="h-4 w-4" />
				</button>
			</div>

			{/* Hunt Clock */}
			<div className="mb-4">
				<div className="mb-2 flex items-center justify-between">
					<span className="text-[11px] uppercase tracking-widest text-slate-400">
						The Hunt Clock
					</span>
					<button
						type="button"
						onClick={() => setHunt(0)}
						className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-resurge-violet"
						aria-label="Reset Hunt Clock to zero"
					>
						<RotateCcw className="h-3 w-3" />
						Reset
					</button>
				</div>
				<div className="flex gap-1.5">
					{Array.from({ length: HUNT_MAX }, (_, i) => i + 1).map((seg) => (
						<button
							key={seg}
							type="button"
							onClick={() => setHunt(hunt === seg ? seg - 1 : seg)}
							className={cn(
								"h-8 flex-1 rounded-sm border transition-colors",
								seg <= hunt
									? peaked
										? "border-red-400/70 bg-red-500/70"
										: "border-resurge-violet/70 bg-resurge-violet/60"
									: "border-slate-600/40 bg-slate-800/40 hover:bg-slate-700/50",
							)}
							aria-label={`Set Hunt Clock to ${seg}`}
						/>
					))}
				</div>
				{peaked ? (
					<div className="mt-2 rounded border border-red-500/50 bg-red-950/40 px-2 py-1.5 text-[11px] leading-snug text-red-300">
						<strong>The Quiet strikes.</strong> It takes the most exposed
						character (or forces a hide-or-flee beat), then the clock resets to{" "}
						{HUNT_RESET}.
						<Button
							variant="ghost"
							size="sm"
							className="mt-1 h-6 w-full gap-1 text-[11px] text-red-300 hover:bg-red-500/10"
							onClick={() => setHunt(HUNT_RESET)}
						>
							Resolve strike → reset to {HUNT_RESET}
						</Button>
					</div>
				) : (
					<p className="mt-1.5 text-[11px] leading-snug text-slate-500">
						+1 for noise, light, a broken ward, or resting exposed · +1 (or +2)
						for Essence · −1 in a warded safe-hold or a silent, dark scene.
					</p>
				)}
			</div>

			{/* Dread */}
			<div>
				<div className="mb-2 text-[11px] uppercase tracking-widest text-slate-400">
					Dread (per character)
				</div>
				<div className="space-y-2">
					{dread.map((d) => (
						<div
							key={d.id}
							className="rounded border border-slate-700/40 bg-slate-900/40 px-2 py-1.5"
						>
							<div className="flex items-center justify-between gap-2">
								<span className="truncate text-xs font-medium text-slate-200">
									{d.name}
								</span>
								<div className="flex items-center gap-1">
									<button
										type="button"
										onClick={() => setDreadValue(d.id, d.value - 1)}
										className="text-slate-500 hover:text-white"
										aria-label={`Lower ${d.name}'s Dread`}
									>
										<Minus className="h-3.5 w-3.5" />
									</button>
									<span
										className={cn(
											"w-6 text-center font-mono text-sm font-bold",
											d.value >= 5
												? "text-red-400"
												: d.value >= 3
													? "text-gate-s"
													: "text-slate-300",
										)}
									>
										{d.value}
									</span>
									<button
										type="button"
										onClick={() => setDreadValue(d.id, d.value + 1)}
										className="text-slate-500 hover:text-white"
										aria-label={`Raise ${d.name}'s Dread`}
									>
										<Plus className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={() => removeDread(d.id)}
										className="ml-1 text-slate-600 hover:text-red-400"
										aria-label={`Remove ${d.name}`}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</div>
							<div className="mt-1 text-[11px] leading-snug text-slate-500">
								{DREAD_EFFECTS[d.value]}
							</div>
						</div>
					))}
				</div>
				<div className="mt-2 flex gap-1.5">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") addDread();
						}}
						placeholder="Add character…"
						className="h-8 border-slate-700/50 bg-black/40 text-xs"
					/>
					<Button
						variant="outline"
						size="sm"
						className="h-8 gap-1 border-resurge-violet/30 px-2 text-xs"
						onClick={addDread}
						disabled={!newName.trim()}
					>
						<Plus className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>
		</div>
	);
}
