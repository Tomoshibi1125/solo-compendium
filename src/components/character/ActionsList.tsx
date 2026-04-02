import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCombatActions } from "@/hooks/useCombatActions";
import { useEquipment } from "@/hooks/useEquipment";
import type { DetailData } from "@/types/character";
import { ActionCard } from "./ActionCard";

export function ActionsList({
	characterId,
	campaignId,
	onSelectDetail,
}: {
	characterId: string;
	campaignId?: string;
	onSelectDetail?: (detail: DetailData) => void;
}) {
	const { actions, isLoading } = useCombatActions(characterId);
	const { updateEquipment } = useEquipment(characterId);

	const handleUseAction = async (actionId: string, equipmentId?: string) => {
		if (!equipmentId) return;

		const action = actions.find((a) => a.id === actionId);
		if (
			!action ||
			action.resourceCurrent === undefined ||
			action.resourceCurrent <= 0
		)
			return;

		try {
			await updateEquipment({
				id: equipmentId,
				updates: {
					charges_current: action.resourceCurrent - 1,
				},
			});
		} catch (error) {
			console.error("Failed to update resource charges:", error);
		}
	};

	if (isLoading) {
		return <div className="p-4 text-center">Loading actions...</div>;
	}

	const categorizedActions = {
		action: actions.filter(
			(a) =>
				(a.activation || "").toLowerCase().includes("action") &&
				!(a.activation || "").toLowerCase().includes("bonus"),
		),
		bonus: actions.filter((a) =>
			(a.activation || "").toLowerCase().includes("bonus"),
		),
		reaction: actions.filter((a) =>
			(a.activation || "").toLowerCase().includes("reaction"),
		),
		other: actions.filter(
			(a) =>
				!(a.activation || "").toLowerCase().includes("action") &&
				!(a.activation || "").toLowerCase().includes("reaction"),
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
							onUse={() => handleUseAction(action.id, action.equipmentId)}
							characterId={characterId}
							campaignId={campaignId}
							payload={action.payload}
							onSelect={() =>
								onSelectDetail?.({
									title: action.name,
									description: action.description || "",
									payload: action,
								})
							}
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
								onUse={() => handleUseAction(action.id, action.equipmentId)}
								characterId={characterId}
								campaignId={campaignId}
								payload={action.payload}
								onSelect={() =>
									onSelectDetail?.({
										title: action.name,
										description: action.description || "",
										payload: action,
									})
								}
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
