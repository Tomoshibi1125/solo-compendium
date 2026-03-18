import { Plus, RefreshCw, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCampaignExtras } from "@/hooks/useCampaignExtras";
import type { Database } from "@/integrations/supabase/types";
import { formatRegentVernacular } from "@/lib/vernacular";

type CampaignExtra = Database["public"]["Tables"]["campaign_extras"]["Row"];

interface CampaignExtrasPanelProps {
	campaignId: string;
	isDM: boolean;
}

export function CampaignExtrasPanel({
	campaignId,
	isDM,
}: CampaignExtrasPanelProps) {
	const { extras, addExtra, updateExtra, removeExtra, isLoading } =
		useCampaignExtras(campaignId);

	const [draftName, setDraftName] = useState("");
	const [draftType, setDraftType] = useState("vehicle");
	const [draftHp, setDraftHp] = useState("");
	const [draftAc, setDraftAc] = useState("");
	const [draftSpeed, setDraftSpeed] = useState("");

	const handleAdd = async () => {
		if (!draftName.trim() || !isDM) return;

		await addExtra({
			name: draftName.trim(),
			extra_type: draftType,
			hp_current: Number(draftHp) || 1,
			hp_max: Number(draftHp) || 1,
			ac: Number(draftAc) || 10,
			speed: Number(draftSpeed) || 0,
			notes: null,
		});

		setDraftName("");
		setDraftHp("");
		setDraftAc("");
		setDraftSpeed("");
	};

	const handleHpChange = async (extra: CampaignExtra, delta: number) => {
		const nextHp = Math.max(
			0,
			Math.min(extra.hp_max, extra.hp_current + delta),
		);
		await updateExtra({ id: extra.id, updates: { hp_current: nextHp } });
	};

	return (
		<div className="space-y-4">
			{/* Add New Section */}
			{isDM && (
				<SystemWindow title="ADD CAMPAIGN EXTRA" compact variant="alert">
					<div className="grid grid-cols-2 md:grid-cols-[2fr_120px_60px_60px_70px_auto] gap-2 items-end">
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase text-muted-foreground">
								Name
							</span>
							<Input
								placeholder="e.g. The Drunken Sailor (Ship)"
								value={draftName}
								onChange={(e) => setDraftName(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase text-muted-foreground">
								Type
							</span>
							<Select value={draftType} onValueChange={setDraftType}>
								<SelectTrigger className="h-8 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="vehicle">Vehicle</SelectItem>
									<SelectItem value="stronghold">Stronghold</SelectItem>
									<SelectItem value="mount">Mount (Shared)</SelectItem>
									<SelectItem value="companion">Companion (Shared)</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase text-muted-foreground">
								HP
							</span>
							<Input
								type="number"
								placeholder="HP"
								value={draftHp}
								onChange={(e) => setDraftHp(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase text-muted-foreground">
								AC
							</span>
							<Input
								type="number"
								placeholder="AC"
								value={draftAc}
								onChange={(e) => setDraftAc(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[10px] uppercase text-muted-foreground">
								Speed
							</span>
							<Input
								type="number"
								placeholder="Ft"
								value={draftSpeed}
								onChange={(e) => setDraftSpeed(e.target.value)}
								className="h-8 text-xs"
							/>
						</div>
						<Button
							size="sm"
							onClick={handleAdd}
							disabled={!draftName.trim()}
							className="h-8 mb-px"
						>
							<Plus className="w-4 h-4" /> Add
						</Button>
					</div>
				</SystemWindow>
			)}

			{/* List of Extras */}
			<div className="space-y-3">
				{isLoading ? (
					<div className="text-center p-4 text-muted-foreground whitespace-pre">
						<RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
						Loading...
					</div>
				) : extras.length === 0 ? (
					<div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
						No campaign extras tracked.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{extras.map((extra) => (
							<SystemWindow
								key={extra.id}
								title={extra.name.toUpperCase()}
								compact
							>
								<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
									{/* Info */}
									<div className="space-y-1">
										<Badge variant="outline" className="text-[10px] uppercase">
											{formatRegentVernacular(extra.extra_type)}
										</Badge>
										<div className="flex gap-2 text-xs text-muted-foreground mt-1">
											<span className="flex items-center gap-1">
												<Shield className="w-3 h-3" /> AC {extra.ac}
											</span>
											<span>•</span>
											<span>Speed {extra.speed}ft</span>
										</div>
									</div>

									{/* HP Tracker & Actions */}
									<div className="flex items-center gap-3">
										<div className="flex flex-col items-center">
											<span className="text-[10px] font-mono text-muted-foreground">
												HP
											</span>
											<div className="flex items-center gap-1">
												<Button
													variant="outline"
													size="sm"
													className="h-6 w-6 p-0"
													onClick={() => handleHpChange(extra, -1)}
													disabled={extra.hp_current <= 0}
												>
													-
												</Button>
												<span className="font-display text-lg w-12 text-center">
													{extra.hp_current}/{extra.hp_max}
												</span>
												<Button
													variant="outline"
													size="sm"
													className="h-6 w-6 p-0"
													onClick={() => handleHpChange(extra, 1)}
													disabled={extra.hp_current >= extra.hp_max}
												>
													+
												</Button>
											</div>
										</div>

										{/* Actions */}
										{isDM && (
											<div className="flex items-center gap-2 border-l pl-3 ml-2">
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
													onClick={() => {
														if (confirm(`Remove ${extra.name}?`))
															removeExtra(extra.id);
													}}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										)}
									</div>
								</div>
							</SystemWindow>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
