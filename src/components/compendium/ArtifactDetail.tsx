import { Crown, Shield, Sparkles, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

interface ArtifactAbility {
	name: string;
	description?: string;
	type: string;
	frequency?: string;
	action?: string;
}

export interface ArtifactData {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	artifact_type?: string | null;
	rarity?: string | null;
	attunement?: boolean | null;
	requirements?: {
		class?: string;
		ability?: string;
		score?: number;
		alignment?: string;
		quest?: string;
	} | null;
	properties?: {
		magical?: boolean;
		unique?: boolean;
		sentient?: boolean;
		cursed?: boolean;
		legendary?: boolean;
	} | null;
	abilities?: {
		primary?: ArtifactAbility;
		secondary?: ArtifactAbility;
		tertiary?: ArtifactAbility;
		ultimate?: ArtifactAbility;
	} | null;
	lore?: {
		origin?: string;
		history?: string;
		curse?: string;
		personality?: string;
	} | null;
	mechanics?: {
		bonus?: {
			type?: string;
			value?: number;
			ability?: string;
			skills?: string[];
		};
		immunity?: string[];
		resistance?: string[];
		vulnerability?: string[];
		special?: string[];
	} | null;
	source_book?: string | null;
	image_url?: string | null;
	image?: string | null;
}

const rarityStyles: Record<string, string> = {
	legendary: "text-amber-400 border-amber-500/40 bg-amber-500/10",
	mythic: "text-purple-400 border-purple-500/40 bg-purple-500/10",
	divine: "text-rose-400 border-rose-500/40 bg-rose-500/10",
};

export const ArtifactDetail = ({ data }: { data: ArtifactData }) => {
	const artifact = data;
	const navigate = useNavigate();
	const displayName = formatRegentVernacular(
		artifact.display_name || artifact.name,
	);
	const imageSrc = artifact.image_url || artifact.image || undefined;
	const rarityStyle = artifact.rarity
		? rarityStyles[artifact.rarity]
		: undefined;

	const abilities = artifact.abilities || undefined;
	const abilityList: Array<{
		label: string;
		ability: ArtifactAbility | undefined;
	}> = [
		{ label: "Primary", ability: abilities?.primary },
		{ label: "Secondary", ability: abilities?.secondary },
		{ label: "Tertiary", ability: abilities?.tertiary },
		{ label: "Ultimate", ability: abilities?.ultimate },
	];

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
		ability: ArtifactAbility,
	): ActionResolutionPayload | null => {
		const description = ability.description || "";
		const dice = parseDiceFromText(description);
		const dc = parseDcFromText(description);
		const payloadName = `${displayName}: ${formatRegentVernacular(ability.name)}`;

		if (dc !== null) {
			return {
				version: 1,
				id: crypto.randomUUID(),
				name: payloadName,
				source: { type: "artifact", entryId: artifact.id },
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
				source: { type: "artifact", entryId: artifact.id },
				kind: "healing",
				healing: { roll: dice },
			};
		}

		return {
			version: 1,
			id: crypto.randomUUID(),
			name: payloadName,
			source: { type: "artifact", entryId: artifact.id },
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
			{imageSrc && (
				<div className="w-full flex justify-center">
					<CompendiumImage
						src={imageSrc}
						alt={displayName}
						size="large"
						aspectRatio="square"
						className="max-w-md"
						fallbackIcon={<Crown className="w-32 h-32 text-muted-foreground" />}
					/>
				</div>
			)}

			<AscendantWindow title={displayName.toUpperCase()}>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{artifact.artifact_type && (
							<Badge variant="secondary">
								{formatRegentVernacular(artifact.artifact_type)}
							</Badge>
						)}
						{artifact.rarity && (
							<Badge variant="outline" className={rarityStyle}>
								{formatRegentVernacular(artifact.rarity)}
							</Badge>
						)}
						{artifact.attunement && (
							<Badge variant="destructive">Requires Attunement</Badge>
						)}
						{artifact.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(artifact.source_book)}
							</Badge>
						)}
					</div>
					{artifact.description && (
						<p className="text-muted-foreground leading-relaxed">
							<AutoLinkText text={artifact.description || ""} />
						</p>
					)}
				</div>
			</AscendantWindow>

			{artifact.requirements && (
				<AscendantWindow title="REQUIREMENTS">
					<ul className="space-y-2 text-sm">
						{artifact.requirements.class && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Class: {formatRegentVernacular(artifact.requirements.class)}
								</span>
							</li>
						)}
						{artifact.requirements.ability &&
							artifact.requirements.score !== undefined && (
								<li className="flex items-center gap-2">
									<Shield className="w-4 h-4 text-muted-foreground" />
									<span>
										{formatRegentVernacular(artifact.requirements.ability)}{" "}
										{artifact.requirements.score}+
									</span>
								</li>
							)}
						{artifact.requirements.alignment && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Alignment:{" "}
									{formatRegentVernacular(artifact.requirements.alignment)}
								</span>
							</li>
						)}
						{artifact.requirements.quest && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									{formatRegentVernacular(artifact.requirements.quest)}
								</span>
							</li>
						)}
					</ul>
				</AscendantWindow>
			)}

			{artifact.properties && (
				<AscendantWindow id="artifact-properties" title="PROPERTIES">
					<div className="flex flex-wrap gap-2">
						{artifact.properties.magical && (
							<Badge variant="secondary">Magical</Badge>
						)}
						{artifact.properties.unique && (
							<Badge variant="secondary">Unique</Badge>
						)}
						{artifact.properties.sentient && (
							<Badge variant="secondary">Sentient</Badge>
						)}
						{artifact.properties.cursed && (
							<Badge variant="destructive">Cursed</Badge>
						)}
						{artifact.properties.legendary && (
							<Badge variant="outline">Legendary</Badge>
						)}
					</div>
				</AscendantWindow>
			)}

			{abilities && (
				<AscendantWindow id="artifact-abilities" title="ABILITIES">
					<div className="space-y-4">
						{abilityList.map(({ label, ability }) => {
							if (!ability) return null;
							const payload = buildAbilityPayload(ability);

							return (
								<div
									key={label}
									className="space-y-1 border-l-2 border-primary/40 pl-3"
								>
									<div className="flex flex-wrap items-center gap-2">
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="font-heading font-semibold">
											{formatRegentVernacular(ability.name)}
										</span>
										<Badge variant="outline" className="text-xs">
											{label}
										</Badge>
										<Badge variant="secondary" className="text-xs">
											{formatRegentVernacular(ability.type)}
										</Badge>
										{ability.frequency && (
											<Badge variant="outline" className="text-xs">
												{formatRegentVernacular(ability.frequency)}
											</Badge>
										)}
										{ability.action && (
											<Badge variant="outline" className="text-xs">
												{formatRegentVernacular(ability.action)}
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground">
										<AutoLinkText text={ability.description || ""} />
									</p>

									{payload && (
										<div className="flex flex-wrap gap-2 pt-1">
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
														"/warden-directives/initiative-tracker",
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
				</AscendantWindow>
			)}

			{artifact.lore && (
				<AscendantWindow id="artifact-lore" title="LORE">
					<div className="space-y-3">
						{artifact.lore.origin && (
							<p className="text-sm text-muted-foreground">
								<span className="text-foreground">Origin:</span>{" "}
								<AutoLinkText text={artifact.lore.origin} />
							</p>
						)}
						{artifact.lore.history && (
							<p className="text-sm text-muted-foreground">
								<span className="text-foreground">History:</span>{" "}
								<AutoLinkText text={artifact.lore.history} />
							</p>
						)}
						{artifact.lore.curse && (
							<p className="text-sm text-muted-foreground">
								<span className="text-foreground">Curse:</span>{" "}
								<AutoLinkText text={artifact.lore.curse} />
							</p>
						)}
						{artifact.lore.personality && (
							<p className="text-sm text-muted-foreground">
								<span className="text-foreground">Personality:</span>{" "}
								<AutoLinkText text={artifact.lore.personality} />
							</p>
						)}
					</div>
				</AscendantWindow>
			)}

			{artifact.mechanics && (
				<AscendantWindow id="artifact-mechanics" title="MECHANICS">
					<div className="space-y-3 text-sm">
						{artifact.mechanics.bonus && (
							<div className="flex items-start gap-2">
								<Swords className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
								<div>
									<p className="text-foreground">
										Bonus:{" "}
										{formatRegentVernacular(
											artifact.mechanics.bonus.type || "",
										)}{" "}
										+{artifact.mechanics.bonus.value}
									</p>
									{artifact.mechanics.bonus.ability && (
										<p className="text-muted-foreground">
											Ability:{" "}
											{formatRegentVernacular(artifact.mechanics.bonus.ability)}
										</p>
									)}
									{artifact.mechanics.bonus.skills &&
										artifact.mechanics.bonus.skills.length > 0 && (
											<p className="text-muted-foreground">
												Skills:{" "}
												{artifact.mechanics.bonus.skills
													.map(formatRegentVernacular)
													.join(", ")}
											</p>
										)}
								</div>
							</div>
						)}
						{artifact.mechanics.immunity &&
							artifact.mechanics.immunity.length > 0 && (
								<p>
									<span className="text-foreground">Immunity:</span>{" "}
									{artifact.mechanics.immunity
										.map(formatRegentVernacular)
										.join(", ")}
								</p>
							)}
						{artifact.mechanics.resistance &&
							artifact.mechanics.resistance.length > 0 && (
								<p>
									<span className="text-foreground">Resistance:</span>{" "}
									{artifact.mechanics.resistance
										.map(formatRegentVernacular)
										.join(", ")}
								</p>
							)}
						{artifact.mechanics.vulnerability &&
							artifact.mechanics.vulnerability.length > 0 && (
								<p>
									<span className="text-foreground">Vulnerability:</span>{" "}
									{artifact.mechanics.vulnerability
										.map(formatRegentVernacular)
										.join(", ")}
								</p>
							)}
						{artifact.mechanics.special &&
							artifact.mechanics.special.length > 0 && (
								<div>
									<p className="text-foreground">Special:</p>
									<ul className="list-disc list-inside text-muted-foreground">
										{artifact.mechanics.special.map((entry: string) => (
											<li key={entry}>{formatRegentVernacular(entry)}</li>
										))}
									</ul>
								</div>
							)}
					</div>
				</AscendantWindow>
			)}
		</div>
	);
};
