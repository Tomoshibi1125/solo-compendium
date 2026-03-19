import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCombatActions } from "@/hooks/useCombatActions";
import { ActionCard } from "./ActionCard";

export function ActionsList({
	characterId,
	campaignId,
}: {
	characterId: string;
	campaignId?: string;
}) {
	const { actions, isLoading } = useCombatActions(characterId);

	if (isLoading) {
		return <div className="p-4 text-center">Loading actions...</div>;
	}

	const categorizedActions = {
		action: actions.filter(
			(a) =>
				a.activation.toLowerCase().includes("action") &&
				!a.activation.toLowerCase().includes("bonus"),
		),
		bonus: actions.filter((a) => a.activation.toLowerCase().includes("bonus")),
		reaction: actions.filter((a) =>
			a.activation.toLowerCase().includes("reaction"),
		),
		other: actions.filter(
			(a) =>
				!a.activation.toLowerCase().includes("action") &&
				!a.activation.toLowerCase().includes("reaction"),
		),
	};

	return (
		<div className="space-y-4">
			<Tabs defaultValue="all" className="w-full">
				<TabsList className="grid w-full grid-cols-5 h-10">
					<TabsTrigger value="all" className="text-xs">
						All
					</TabsTrigger>
					<TabsTrigger value="action" className="text-xs">
						Action
					</TabsTrigger>
					<TabsTrigger value="bonus" className="text-xs">
						Bonus
					</TabsTrigger>
					<TabsTrigger value="reaction" className="text-xs">
						Reaction
					</TabsTrigger>
					<TabsTrigger value="other" className="text-xs">
						Other
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-4 space-y-4">
					{actions.map((action) => (
						<ActionCard
							key={action.id}
							name={action.name}
							type={action.type}
							description={action.description || ""}
							attackBonus={action.attackBonus}
							damage={action.damageRoll}
							range={action.range}
							uses={
								action.resourceMax
									? {
											current: action.resourceCurrent || 0,
											max: action.resourceMax,
										}
									: undefined
							}
							characterId={characterId}
							campaignId={campaignId}
						/>
					))}
					{actions.length === 0 && (
						<div className="text-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
							No combat actions found.
						</div>
					)}
				</TabsContent>

				{Object.entries(categorizedActions).map(([key, list]) => (
					<TabsContent key={key} value={key} className="mt-4 space-y-4">
						{list.map((action) => (
							<ActionCard
								key={action.id}
								name={action.name}
								type={action.type}
								description={action.description || ""}
								attackBonus={action.attackBonus}
								damage={action.damageRoll}
								range={action.range}
								uses={
									action.resourceMax
										? {
												current: action.resourceCurrent || 0,
												max: action.resourceMax,
											}
										: undefined
								}
								characterId={characterId}
								campaignId={campaignId}
							/>
						))}
						{list.length === 0 && (
							<div className="text-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
								No {key} actions found.
							</div>
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
