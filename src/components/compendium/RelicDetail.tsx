import { AlertTriangle, Coins, Gem, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatMonarchVernacular } from "@/lib/vernacular";

interface RelicData {
	id: string;
	name: string;
	display_name?: string | null;
	description: string;
	rarity: string;
	item_type?: string | null;
	equipment_type?: string | null;
	relic_tier?: string;
	requires_attunement?: boolean;
	attunement?: boolean | null;
	attunement_requirements?: string;
	requirements?: {
		level?: number;
		alignment?: string;
		class?: string;
		ability?: string;
		score?: number;
		job?: string;
		background?: string;
	} | null;
	properties?: string[] | Record<string, unknown> | null;
	abilities?:
		| {
				name?: string;
				description?: string;
				type?: string;
				frequency?: string;
				action?: string;
				dc?: number;
				charges?: number;
		  }[]
		| null;
	lore?: {
		origin?: string;
		history?: string;
		currentOwner?: string;
		previousOwners?: string[];
	} | null;
	mechanics?: {
		bonus?: {
			type?: string;
			value?: number;
			ability?: string;
			skills?: string[];
		};
		resistance?: string[];
		immunity?: string[];
		vulnerabilities?: string[];
	} | null;
	quirks?: string[];
	corruption_risk?: string;
	value_credits?: number;
	tags?: string[];
	source_book?: string;
	image_url?: string | null;
}

type RelicAbility = NonNullable<RelicData["abilities"]>[number];

const rarityColors: Record<string, string> = {
	common: "bg-gray-500",
	uncommon: "bg-green-500",
	rare: "bg-blue-500",
	very_rare: "bg-purple-500",
	legendary: "bg-amber-500",
};

const tierColors: Record<string, string> = {
	dormant: "text-gray-400 border-gray-500/30",
	awakened: "text-blue-400 border-blue-500/30",
	resonant: "text-purple-400 border-purple-500/30",
	E: "text-gray-400 border-gray-500/30",
	D: "text-gray-300 border-gray-400/30",
	C: "text-green-400 border-green-500/30",
	B: "text-blue-400 border-blue-500/30",
	A: "text-purple-400 border-purple-500/30",
	S: "text-amber-400 border-amber-500/30",
	SS: "text-red-400 border-red-500/30",
};

export const RelicDetail = ({ data }: { data: RelicData }) => {
	const navigate = useNavigate();
	const displayName = formatMonarchVernacular(data.display_name || data.name);
	const itemType = data.item_type || data.equipment_type || "";
	const requiresAttunement = data.requires_attunement ?? !!data.attunement;

	const propertiesList = Array.isArray(data.properties)
		? data.properties
		: data.properties && typeof data.properties === "object"
			? Object.entries(data.properties)
					.filter(([, v]) => Boolean(v))
					.map(([k]) => k)
			: [];

	const abilitiesList = Array.isArray(data.abilities) ? data.abilities : [];

	const parseDiceFromText = (text: string): string | null => {
		const match = text.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
		return match ? match[1].replace(/\s+/g, "") : null;
	};

	const parseDcFromText = (text: string): number | null => {
		const match = text.match(/\bDC\s*(\d{1,2})\b/i);
		if (!match) return null;
		const parsed = parseInt(match[1], 10);
		return Number.isFinite(parsed) ? parsed : null;
	};

	const buildAbilityPayload = (
		ability: RelicAbility,
	): ActionResolutionPayload | null => {
		const description = ability.description || "";
		const dc =
			typeof ability.dc === "number"
				? ability.dc
				: parseDcFromText(description);
		const dice = parseDiceFromText(description);
		const payloadName = `${displayName}: ${formatMonarchVernacular(ability.name || "Ability")}`;

		if (dc !== null) {
			return {
				version: 1,
				id: crypto.randomUUID(),
				name: payloadName,
				source: { type: "relic", entryId: data.id },
				kind: "save",
				save: { dc, roll: "1d20" },
				damage: dice ? { roll: dice } : undefined,
			};
		}

		if (!dice) return null;

		const healingHint = /\b(heal|heals|healing|regain|restore)\b/i.test(
			description,
		);
		if (healingHint) {
			return {
				version: 1,
				id: crypto.randomUUID(),
				name: payloadName,
				source: { type: "relic", entryId: data.id },
				kind: "healing",
				healing: { roll: dice },
			};
		}

		return {
			version: 1,
			id: crypto.randomUUID(),
			name: payloadName,
			source: { type: "relic", entryId: data.id },
			kind: "damage",
			damage: { roll: dice },
		};
	};

	const queueResolutionAndNavigate = (
		payload: ActionResolutionPayload,
		path: string,
	) => {
		setPendingResolution(payload);
		navigate(path);
	};

	return (
		<div className="space-y-6">
			{/* Relic Artwork */}
			{data.image_url && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={data.image_url}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={<Gem className="w-32 h-32 text-muted-foreground" />}
					/>
				</div>
			)}

			{/* Header */}
			<SystemWindow
				title={displayName.toUpperCase()}
				className={`border-2 ${tierColors[data.relic_tier || ""] || "border-primary/50"}`}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							className={`${rarityColors[data.rarity]} text-white capitalize`}
						>
							{formatMonarchVernacular(data.rarity.replace("_", " "))}
						</Badge>
						{itemType && (
							<Badge variant="secondary">
								{formatMonarchVernacular(itemType)}
							</Badge>
						)}
						{data.relic_tier && (
							<Badge variant="outline" className={tierColors[data.relic_tier]}>
								{formatMonarchVernacular(data.relic_tier)}
							</Badge>
						)}
						{requiresAttunement && (
							<Badge variant="destructive">Requires Attunement</Badge>
						)}
					</div>

					{data.attunement_requirements && (
						<p className="text-sm text-muted-foreground">
							<em>
								Attunement:{" "}
								{formatMonarchVernacular(data.attunement_requirements)}
							</em>
						</p>
					)}
				</div>
			</SystemWindow>

			{/* Stats */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				<SystemWindow title="RARITY" compact>
					<div className="flex items-center gap-2">
						<Gem
							className={`w-5 h-5 ${data.rarity === "legendary" ? "text-amber-500" : rarityColors[data.rarity] ? "text-white" : ""}`}
						/>
						<span className="font-heading capitalize">
							{formatMonarchVernacular(data.rarity.replace("_", " "))}
						</span>
					</div>
				</SystemWindow>

				{data.relic_tier && (
					<SystemWindow title="TIER" compact>
						<div className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							<span className="font-heading capitalize">
								{formatMonarchVernacular(data.relic_tier)}
							</span>
						</div>
					</SystemWindow>
				)}

				{data.value_credits && (
					<SystemWindow title="VALUE" compact>
						<div className="flex items-center gap-2">
							<Coins className="w-5 h-5 text-yellow-400" />
							<span className="font-heading">
								{data.value_credits.toLocaleString()} credits
							</span>
						</div>
					</SystemWindow>
				)}
			</div>

			{data.requirements && (
				<SystemWindow title="REQUIREMENTS">
					<ul className="space-y-2 text-sm">
						{data.requirements.level !== undefined && (
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>Level {data.requirements.level}</span>
							</li>
						)}
						{data.requirements.class && (
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Class: {formatMonarchVernacular(data.requirements.class)}
								</span>
							</li>
						)}
						{data.requirements.ability &&
							data.requirements.score !== undefined && (
								<li className="flex items-start gap-2">
									<span className="text-primary">•</span>
									<span>
										{formatMonarchVernacular(data.requirements.ability)}{" "}
										{data.requirements.score}+
									</span>
								</li>
							)}
						{data.requirements.alignment && (
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Alignment:{" "}
									{formatMonarchVernacular(data.requirements.alignment)}
								</span>
							</li>
						)}
						{data.requirements.job && (
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Job: {formatMonarchVernacular(data.requirements.job)}
								</span>
							</li>
						)}
						{data.requirements.background && (
							<li className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span>
									Background:{" "}
									{formatMonarchVernacular(data.requirements.background)}
								</span>
							</li>
						)}
					</ul>
				</SystemWindow>
			)}

			{/* Description */}
			<SystemWindow title="DESCRIPTION">
				<p className="text-foreground whitespace-pre-wrap leading-relaxed text-base">
					{formatMonarchVernacular(data.description)}
				</p>
			</SystemWindow>

			{/* Properties */}
			{propertiesList.length > 0 && (
				<SystemWindow title="PROPERTIES">
					<ul className="space-y-2">
						{propertiesList.map((prop, _i) => (
							<li key={prop} className="flex items-start gap-2">
								<span className="text-primary">•</span>
								<span className="text-foreground">
									{formatMonarchVernacular(prop)}
								</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}

			{abilitiesList.length > 0 && (
				<SystemWindow title="ABILITIES">
					<div className="space-y-4">
						{abilitiesList.map((ability, _i) => {
							const payload = buildAbilityPayload(ability);

							return (
								<div
									key={ability.name}
									className="border-l-2 border-primary/40 pl-3"
								>
									<div className="flex flex-wrap items-center gap-2">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="font-heading">
											{formatMonarchVernacular(ability.name || "Ability")}
										</span>
										{ability.type && (
											<Badge variant="secondary" className="text-xs">
												{formatMonarchVernacular(ability.type)}
											</Badge>
										)}
										{ability.frequency && (
											<Badge variant="outline" className="text-xs">
												{formatMonarchVernacular(ability.frequency)}
											</Badge>
										)}
										{ability.action && (
											<Badge variant="outline" className="text-xs">
												{formatMonarchVernacular(ability.action)}
											</Badge>
										)}
										{typeof ability.dc === "number" && (
											<Badge variant="outline" className="text-xs">
												DC {ability.dc}
											</Badge>
										)}
									</div>
									{ability.description && (
										<p className="text-sm text-muted-foreground mt-1">
											{formatMonarchVernacular(ability.description)}
										</p>
									)}

									{payload && (
										<div className="flex flex-wrap gap-2 pt-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													queueResolutionAndNavigate(payload, "/dice")
												}
											>
												Roll
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													queueResolutionAndNavigate(
														payload,
														"/dm-tools/initiative-tracker",
													)
												}
											>
												Resolve in Initiative
											</Button>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</SystemWindow>
			)}

			{data.lore && (
				<SystemWindow title="LORE">
					<div className="space-y-3 text-sm">
						{data.lore.origin && (
							<p className="text-muted-foreground">
								<span className="text-foreground">Origin:</span>{" "}
								{formatMonarchVernacular(data.lore.origin)}
							</p>
						)}
						{data.lore.history && (
							<p className="text-muted-foreground">
								<span className="text-foreground">History:</span>{" "}
								{formatMonarchVernacular(data.lore.history)}
							</p>
						)}
						{data.lore.currentOwner && (
							<p className="text-muted-foreground">
								<span className="text-foreground">Current Owner:</span>{" "}
								{formatMonarchVernacular(data.lore.currentOwner)}
							</p>
						)}
						{data.lore.previousOwners &&
							data.lore.previousOwners.length > 0 && (
								<p className="text-muted-foreground">
									<span className="text-foreground">Previous Owners:</span>{" "}
									{data.lore.previousOwners
										.map(formatMonarchVernacular)
										.join(", ")}
								</p>
							)}
					</div>
				</SystemWindow>
			)}

			{data.mechanics && (
				<SystemWindow title="MECHANICS">
					<div className="space-y-3 text-sm">
						{data.mechanics.bonus && (
							<p className="text-muted-foreground">
								<span className="text-foreground">Bonus:</span>{" "}
								{formatMonarchVernacular(data.mechanics.bonus.type || "")} +
								{data.mechanics.bonus.value}
							</p>
						)}
						{data.mechanics.resistance &&
							data.mechanics.resistance.length > 0 && (
								<p className="text-muted-foreground">
									<span className="text-foreground">Resistance:</span>{" "}
									{data.mechanics.resistance
										.map(formatMonarchVernacular)
										.join(", ")}
								</p>
							)}
						{data.mechanics.immunity && data.mechanics.immunity.length > 0 && (
							<p className="text-muted-foreground">
								<span className="text-foreground">Immunity:</span>{" "}
								{data.mechanics.immunity
									.map(formatMonarchVernacular)
									.join(", ")}
							</p>
						)}
						{data.mechanics.vulnerabilities &&
							data.mechanics.vulnerabilities.length > 0 && (
								<p className="text-muted-foreground">
									<span className="text-foreground">Vulnerabilities:</span>{" "}
									{data.mechanics.vulnerabilities
										.map(formatMonarchVernacular)
										.join(", ")}
								</p>
							)}
					</div>
				</SystemWindow>
			)}

			{/* Quirks */}
			{data.quirks && data.quirks.length > 0 && (
				<SystemWindow title="QUIRKS">
					<ul className="space-y-2">
						{data.quirks.map((quirk, _i) => (
							<li key={quirk} className="flex items-start gap-2">
								<Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
								<span className="text-muted-foreground">
									{formatMonarchVernacular(quirk)}
								</span>
							</li>
						))}
					</ul>
				</SystemWindow>
			)}

			{/* Corruption Risk */}
			{data.corruption_risk && (
				<SystemWindow title="CORRUPTION RISK" className="border-red-500/30">
					<div className="flex items-start gap-3">
						<AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
						<p className="text-foreground">
							{formatMonarchVernacular(data.corruption_risk)}
						</p>
					</div>
				</SystemWindow>
			)}

			{/* Tags */}
			{data.tags && data.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{data.tags.map((tag) => (
						<Badge key={tag} variant="outline" className="text-xs">
							{formatMonarchVernacular(tag)}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
};
