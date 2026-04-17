import { Minus, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	addResource,
	consumeResource,
	createAmmunition,
	createClassFeatureResource,
	getDefaultSettings,
	type TrackedResource,
} from "@/lib/resourceTracking";

interface TrackedResourcesListProps {
	resources: TrackedResource[];
	onChange: (resources: TrackedResource[]) => void;
}

export function TrackedResourcesList({
	resources,
	onChange,
}: TrackedResourcesListProps) {
	const [newResourceName, setNewResourceName] = useState("");
	const [newResourceType, setNewResourceType] = useState<"ammo" | "feature">(
		"ammo",
	);
	const [newResourceMax, setNewResourceMax] = useState("");

	const handleAdd = () => {
		if (!newResourceName.trim()) return;

		let newResource: TrackedResource;
		const maxVal = parseInt(newResourceMax, 10) || 10;

		if (newResourceType === "ammo") {
			newResource = createAmmunition(newResourceName.trim(), maxVal);
		} else {
			newResource = createClassFeatureResource(
				newResourceName.trim(),
				maxVal,
				"long-rest",
			);
		}

		onChange([...resources, newResource]);
		setNewResourceName("");
		setNewResourceMax("");
	};

	const handleDelete = (id: string) => {
		onChange(resources.filter((r) => r.id !== id));
	};

	const handleAdjust = (id: string, delta: number) => {
		const resource = resources.find((r) => r.id === id);
		if (!resource) return;

		let updatedResource: TrackedResource;
		if (delta > 0) {
			updatedResource = addResource(resource, delta);
		} else {
			const result = consumeResource(
				resource,
				Math.abs(delta),
				getDefaultSettings(),
			);
			if (result.success) {
				updatedResource = result.updatedResource;
			} else {
				return;
			}
		}

		onChange(resources.map((r) => (r.id === id ? updatedResource : r)));
	};

	return (
		<Card className="bg-obsidian-charcoal/80 border border-fuchsia-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(217,70,239,0.1)]">
			<CardHeader className="pb-3 border-b border-fuchsia-500/20">
				<CardTitle className="text-lg flex items-center gap-2 text-fuchsia-400 font-display tracking-wide">
					<Sparkles className="w-4 h-4" />
					Tracked Resources
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-4 space-y-4">
				{resources.length === 0 ? (
					<div className="text-sm text-fuchsia-400/60 text-center py-6 border border-dashed border-fuchsia-500/30 rounded-md bg-fuchsia-500/5">
						No resources currently tracked.
					</div>
				) : (
					<div className="space-y-3">
						{resources.map((resource) => {
							const isLow =
								resource.warnAtLow && resource.current <= resource.lowThreshold;
							const isEmpty = resource.current === 0;

							return (
								<div
									key={resource.id}
									className="flex items-center justify-between p-3 rounded-md border border-fuchsia-500/20 bg-black/60 shadow-inner group transition-all hover:border-fuchsia-500/40 hover:bg-black/80"
								>
									<div>
										<div className="flex items-center gap-2">
											<span className="font-bold text-sm text-primary-foreground">
												{resource.name}
											</span>
											<Badge
												variant="outline"
												className="text-[9px] uppercase h-4 px-1"
											>
												{resource.category}
											</Badge>
										</div>
										<div className="text-[10px] text-muted-foreground mt-0.5">
											{resource.recovery !== "none"
												? `Recovers: ${resource.recovery}`
												: "Manual recovery"}
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="flex items-center gap-1 bg-black/80 rounded-md p-1 border border-fuchsia-500/20 shadow-inner">
											<button
												type="button"
												onClick={() => handleAdjust(resource.id, -1)}
												disabled={isEmpty}
												className="p-1 hover:bg-fuchsia-500/20 rounded disabled:opacity-50 text-red-400 transition-colors"
											>
												<Minus className="w-3.5 h-3.5" />
											</button>
											<span
												className={`w-12 text-center font-bold font-mono text-sm tracking-wider ${isEmpty ? "text-red-500" : isLow ? "text-amber-500" : "text-fuchsia-100"}`}
											>
												{resource.current}
												{resource.max !== null ? `/${resource.max}` : ""}
											</span>
											<button
												type="button"
												onClick={() => handleAdjust(resource.id, 1)}
												disabled={
													resource.max !== null &&
													resource.current >= resource.max
												}
												className="p-1 hover:bg-fuchsia-500/20 rounded disabled:opacity-50 text-emerald-400 transition-colors"
											>
												<Plus className="w-3.5 h-3.5" />
											</button>
										</div>
										<button
											type="button"
											onClick={() => handleDelete(resource.id)}
											className="p-2 hover:bg-red-500/20 text-red-500/50 hover:text-red-400 rounded-md transition-colors opacity-0 group-hover:opacity-100"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div className="pt-4 border-t border-fuchsia-500/20 flex flex-wrap sm:flex-nowrap items-center gap-2">
					<Input
						placeholder="New resource name..."
						value={newResourceName}
						onChange={(e) => setNewResourceName(e.target.value)}
						className="h-9 flex-1 min-w-[140px] text-xs bg-black/40 border-fuchsia-500/20 text-fuchsia-100 placeholder:text-fuchsia-500/30 focus-visible:ring-fuchsia-500/50"
					/>
					<Input
						type="number"
						placeholder="Max/Qty"
						value={newResourceMax}
						onChange={(e) => setNewResourceMax(e.target.value)}
						className="h-9 w-20 text-xs bg-black/40 border-fuchsia-500/20 text-fuchsia-100 placeholder:text-fuchsia-500/30 focus-visible:ring-fuchsia-500/50"
					/>
					<select
						value={newResourceType}
						onChange={(e) =>
							setNewResourceType(e.target.value as "ammo" | "feature")
						}
						className="h-9 text-xs bg-black/40 border border-fuchsia-500/20 rounded-md px-2 text-fuchsia-200 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50"
					>
						<option value="ammo">Ammo</option>
						<option value="feature">Feature</option>
					</select>
					<Button
						size="sm"
						onClick={handleAdd}
						className="h-9 px-4 whitespace-nowrap bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-bold tracking-wide"
					>
						<Plus className="w-4 h-4 mr-1.5" /> Add
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
