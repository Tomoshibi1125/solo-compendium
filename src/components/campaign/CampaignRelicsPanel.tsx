/**
 * CampaignRelicsPanel — the campaign's shared relic vault. Wardens add relics
 * from the catalog; the party sees them read-only. Wires the previously-orphaned
 * `campaign_relic_instances` table.
 */
import { Gem, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	campaignRelicCatalog,
	useAddCampaignRelic,
	useCampaignRelics,
	useDeleteCampaignRelic,
} from "@/hooks/useCampaignRelics";

interface Props {
	campaignId: string;
	isWarden: boolean;
}

export function CampaignRelicsPanel({ campaignId, isWarden }: Props) {
	const { data: relics = [], isLoading } = useCampaignRelics(campaignId);
	const addRelic = useAddCampaignRelic();
	const removeRelic = useDeleteCampaignRelic();
	const [pickId, setPickId] = useState("");

	const catalog = useMemo(
		() =>
			[...campaignRelicCatalog].sort((a, b) => a.name.localeCompare(b.name)),
		[],
	);

	const handleAdd = () => {
		if (!pickId) return;
		addRelic.mutate(
			{ campaignId, relicId: pickId },
			{ onSuccess: () => setPickId("") },
		);
	};

	return (
		<div className="space-y-4">
			{isWarden && (
				<Card className="p-4 border-primary/20 bg-black/40">
					<h3 className="font-heading text-sm uppercase tracking-widest text-primary mb-3">
						Add Relic to Vault
					</h3>
					<div className="flex flex-col sm:flex-row gap-2">
						<Select value={pickId} onValueChange={setPickId}>
							<SelectTrigger className="sm:flex-1">
								<SelectValue placeholder="Choose a relic…" />
							</SelectTrigger>
							<SelectContent>
								{catalog.map((r) => (
									<SelectItem key={r.id} value={r.id}>
										{r.name} · {r.rarity}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							onClick={handleAdd}
							disabled={!pickId || addRelic.isPending}
							className="gap-1"
						>
							<Plus className="w-4 h-4" /> Add
						</Button>
					</div>
				</Card>
			)}

			{isLoading ? (
				<div className="text-sm text-muted-foreground">Loading vault…</div>
			) : relics.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
					<Gem className="w-8 h-8 mb-2 opacity-50" />
					<p className="text-sm">
						No relics in the campaign vault yet.
						{isWarden ? " Add one above." : ""}
					</p>
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2">
					{relics.map((row) => (
						<Card
							key={row.id}
							className="p-4 border-border bg-black/40 flex items-start justify-between gap-2"
						>
							<div className="min-w-0">
								<div className="font-heading text-base truncate">
									{row.name}
								</div>
								<div className="text-xs text-muted-foreground truncate">
									{row.relic?.type ? `${row.relic.type} · ` : ""}
									{row.value_credits != null
										? `${row.value_credits.toLocaleString()} credits`
										: "—"}
								</div>
							</div>
							<div className="flex items-center gap-2 shrink-0">
								{row.rarity && (
									<Badge variant="outline" className="uppercase text-[10px]">
										{row.rarity}
									</Badge>
								)}
								{isWarden && (
									<Button
										size="icon"
										variant="ghost"
										className="h-7 w-7 text-destructive"
										aria-label="Remove relic from vault"
										onClick={() =>
											removeRelic.mutate({ campaignId, id: row.id })
										}
									>
										<Trash2 className="w-3 h-3" />
									</Button>
								)}
							</div>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
