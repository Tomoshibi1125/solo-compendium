import {
	ArrowLeft,
	BookOpen,
	Dice6,
	FlaskConical,
	ScrollText,
	Sparkles,
	Store,
} from "lucide-react";
import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ActionsList } from "@/components/character/ActionsList";
import { CharacterArtPanel } from "@/components/character/CharacterArtPanel";
import { CurrencyManager } from "@/components/character/CurrencyManager";
import { EquipmentList } from "@/components/character/EquipmentList";
import { FeaturesList } from "@/components/character/FeaturesList";
import { PowersList } from "@/components/character/PowersList";
import { RunesList } from "@/components/character/RunesList";
import { Layout } from "@/components/layout/Layout";
import { ManaFlowText, RiftHeading } from "@/components/ui/AscendantText";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useActiveCharacter } from "@/hooks/useActiveCharacter";
import { useCampaignByCharacterId } from "@/hooks/useCampaigns";
import { formatRegentVernacular } from "@/lib/vernacular";
import { QuestLog } from "@/pages/player-tools/QuestLog";

const TOOL_TITLES: Record<string, { title: string; subtitle: string }> = {
	"character-sheet": {
		title: "Character Sheet",
		subtitle: "Review stats, abilities, and full ascendant details.",
	},
	inventory: {
		title: "Inventory",
		subtitle: "Manage equipment, currency, and relic resources.",
	},
	abilities: {
		title: "Abilities & Skills",
		subtitle: "Track actions, powers, and feature uses.",
	},
	"character-art": {
		title: "Character Art Generator",
		subtitle: "Create portrait art for your ascendant.",
	},
	"compendium-viewer": {
		title: "Compendium Viewer",
		subtitle: "Browse the complete compendium.",
	},
	"quest-log": {
		title: "Quest Log",
		subtitle: "Track daily quests, rewards, and progress.",
	},
	"dice-roller": {
		title: "Dice Roller",
		subtitle: "Roll checks, attacks, and saves.",
	},
	"homebrew-studio": {
		title: "Homebrew Studio",
		subtitle: "Create and publish custom content for your campaigns.",
	},
	marketplace: {
		title: "Marketplace",
		subtitle: "Browse, download, and review community listings.",
	},
	"party-view": {
		title: "Party View",
		subtitle: "View party members, their status, and shared information.",
	},
	potions: {
		title: "Potions & Consumables",
		subtitle: "Manage your potions, elixirs, and consumable items.",
	},
	achievements: {
		title: "Achievements",
		subtitle: "View your accomplishments and unlock rewards.",
	},
	"regent-status": {
		title: "Regent Status",
		subtitle: "Manage your regent domains and powers.",
	},
};

const requiresCharacter = (toolId: string) =>
	[
		"character-sheet",
		"inventory",
		"abilities",
		"character-art",
		"quest-log",
		"potions",
		"achievements",
		"regent-status",
	].includes(toolId);

export default function PlayerToolDetail() {
	const navigate = useNavigate();
	const { toolId } = useParams<{ toolId: string }>();
	const {
		characters,
		activeCharacter,
		activeCharacterId,
		setActiveCharacter,
		isLoading,
	} = useActiveCharacter();
	const { data: campaign } = useCampaignByCharacterId(activeCharacter?.id);
	const campaignId = campaign?.id;

	const tool = toolId ? TOOL_TITLES[toolId] : null;

	const shouldRedirect = useMemo(() => {
		if (!toolId) return null;
		if (toolId === "compendium-viewer") return "/compendium";
		if (toolId === "dice-roller") return "/dice";
		if (toolId === "homebrew-studio") return "/homebrew";
		if (toolId === "marketplace") return "/marketplace";
		if (toolId === "character-sheet" && activeCharacter?.id) {
			return `/characters/${activeCharacter.id}`;
		}
		return null;
	}, [activeCharacter?.id, toolId]);

	if (shouldRedirect) {
		return <Navigate to={shouldRedirect} replace />;
	}

	if (!tool || !toolId) {
		return <Navigate to="/player-tools" replace />;
	}

	const showCharacterSelector =
		requiresCharacter(toolId) && characters.length > 1;

	const renderCharacterGate = () => {
		if (!requiresCharacter(toolId)) return null;
		if (isLoading) {
			return (
				<div className="text-sm text-muted-foreground">
					Loading ascendant data...
				</div>
			);
		}
		if (!activeCharacter) {
			return (
				<AscendantWindow title="NO ACTIVE ASCENDANT">
					<div className="space-y-3 text-sm text-muted-foreground">
						<p>Create an ascendant to unlock player tools.</p>
						<Button onClick={() => navigate("/characters/new")}>
							Create Ascendant
						</Button>
					</div>
				</AscendantWindow>
			);
		}
		return null;
	};

	const renderToolContent = () => {
		if (!activeCharacter && requiresCharacter(toolId)) {
			return renderCharacterGate();
		}

		switch (toolId) {
			case "character-sheet":
				return (
					<AscendantWindow title="ACTIVE ASCENDANT">
						<div className="space-y-3">
							<div className="text-sm text-muted-foreground">
								{activeCharacter?.name} | Level {activeCharacter?.level}{" "}
								{formatRegentVernacular(activeCharacter?.job || "Unawakened")}
							</div>
							<Button
								onClick={() => navigate(`/characters/${activeCharacter?.id}`)}
								className="gap-2"
							>
								<ScrollText className="w-4 h-4" />
								Open Character Sheet
							</Button>
						</div>
					</AscendantWindow>
				);
			case "inventory":
				return activeCharacter ? (
					<div className="space-y-6">
						<CurrencyManager characterId={activeCharacter.id} />
						<EquipmentList characterId={activeCharacter.id} />
						<RunesList
							characterId={activeCharacter.id}
							campaignId={campaignId}
						/>
					</div>
				) : null;
			case "potions":
				return activeCharacter ? (
					<div className="space-y-6">
						<EquipmentList characterId={activeCharacter.id} />
					</div>
				) : null;
			case "abilities":
				return activeCharacter ? (
					<div className="space-y-6">
						<ActionsList
							characterId={activeCharacter.id}
							campaignId={campaignId ?? undefined}
						/>
						<PowersList
							characterId={activeCharacter.id}
							campaignId={campaignId}
						/>
						<FeaturesList characterId={activeCharacter.id} />
					</div>
				) : null;
			case "character-art":
				return activeCharacter ? (
					<CharacterArtPanel
						characterId={activeCharacter.id}
						characterData={{
							name: activeCharacter.name,
							appearance: activeCharacter.appearance || "",
							backstory: activeCharacter.backstory || "",
							job: activeCharacter.job || undefined,
							level: activeCharacter.level,
						}}
					/>
				) : null;
			case "quest-log":
				return activeCharacter ? (
					<QuestLog characterId={activeCharacter.id} />
				) : null;
			default:
				return (
					<AscendantWindow title="TOOL UNAVAILABLE">
						<div className="text-sm text-muted-foreground">
							This tool is not configured yet.
						</div>
					</AscendantWindow>
				);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 space-y-6">
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						onClick={() => navigate("/player-tools")}
						className="gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Player Tools
					</Button>
					<div className="flex-1">
						<RiftHeading
							level={1}
							variant="sovereign"
							dimensional
							className="text-2xl sm:text-3xl mb-1"
						>
							{tool.title}
						</RiftHeading>
						<ManaFlowText variant="rift" speed="slow">
							{tool.subtitle}
						</ManaFlowText>
					</div>
					{toolId === "compendium-viewer" && (
						<Button onClick={() => navigate("/compendium")} className="gap-2">
							<BookOpen className="w-4 h-4" />
							Open Compendium
						</Button>
					)}
					{toolId === "dice-roller" && (
						<Button onClick={() => navigate("/dice")} className="gap-2">
							<Dice6 className="w-4 h-4" />
							Open Dice Roller
						</Button>
					)}
					{toolId === "character-art" && (
						<Button
							onClick={() => navigate("/warden-directives/art-generator")}
							variant="outline"
							className="gap-2"
						>
							<Sparkles className="w-4 h-4" />
							Warden Art Tools
						</Button>
					)}
					{toolId === "homebrew-studio" && (
						<Button onClick={() => navigate("/homebrew")} className="gap-2">
							<FlaskConical className="w-4 h-4" />
							Open Homebrew Studio
						</Button>
					)}
					{toolId === "marketplace" && (
						<Button onClick={() => navigate("/marketplace")} className="gap-2">
							<Store className="w-4 h-4" />
							Open Marketplace
						</Button>
					)}
				</div>

				{showCharacterSelector && (
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">
							Active Ascendant
						</span>
						<Select
							value={activeCharacterId || ""}
							onValueChange={setActiveCharacter}
						>
							<SelectTrigger className="w-64">
								<SelectValue placeholder="Select an ascendant" />
							</SelectTrigger>
							<SelectContent>
								{characters.map((character) => (
									<SelectItem key={character.id} value={character.id}>
										{character.name} (Level {character.level})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}

				{renderToolContent()}
			</div>
		</Layout>
	);
}
