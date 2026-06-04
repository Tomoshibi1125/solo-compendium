import { Coins, Shield, Sparkles, Swords, Weight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AutoLinkText } from "@/components/compendium/AutoLinkText";
import { CompendiumImage } from "@/components/compendium/CompendiumImage";
import { ShareToVTTButton } from "@/components/compendium/ShareToVTTButton";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	type ActionResolutionPayload,
	setPendingResolution,
} from "@/lib/actionResolution";
import { formatRegentVernacular } from "@/lib/vernacular";

export interface ItemData {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	item_type?: string | null;
	rarity?: string | null;
	value?: number | null;
	weight?: number | null;
	damage?: string | number | null;
	damage_type?: string | null;
	armor_class?: string | number | null;
	armor_type?: string | null;
	weapon_type?: string | null;
	activation?: Record<string, unknown> | string | null;
	limitations?: Record<string, unknown> | null;
	// weight matches CompendiumItem
	requirements?: {
		class?: string[];
		job?: string[];
		alignment?: string[];
	} | null;
	properties?: {
		weapon?: {
			damage?: string;
			damageType?: string;
			range?: number;
			versatile?: string;
			finesse?: boolean;
		};
		magical?: {
			bonus?: {
				attack?: number;
				damage?: number;
				armorClass?: number;
				savingThrows?: string[];
				abilityScores?: Record<string, number>;
			};
			resistance?: string[];
			immunity?: string[];
			vulnerability?: string[];
		};
	} | null;
	effects?: {
		passive?: string[];
		active?: {
			name: string;
			description: string;
			action?: string;
			frequency?: string;
			dc?: number;
		}[];
		value?: number;
	} | null;
	attunement?: boolean | null;
	cursed?: boolean | null;
	charges?: {
		max: number;
		current: number;
		recharge?: string;
	} | null;
	stats?: {
		attack?: number;
		defense?: number;
		health?: number;
		mana?: number;
	} | null;
	effect?: string | null;
	source_book?: string | null;
	image_url?: string | null;
	image?: string | null;
	flavor?: string | null;
	lore?: string | Record<string, unknown> | null;
	discovery_lore?: string | null;
	mechanics?: Record<string, unknown> | null;
}

type ActiveEffect = NonNullable<
	NonNullable<ItemData["effects"]>["active"]
>[number];

const rarityStyles: Record<string, string> = {
	common: "text-muted-foreground border-border bg-card",
	uncommon: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
	rare: "text-blue-400 border-blue-500/40 bg-blue-500/10",
	// Data carries very-rare in both hyphen and underscore form — key on both
	// so sigils/runes (underscore) and sandbox loot (hyphen) both style.
	"very-rare": "text-violet-400 border-violet-500/40 bg-violet-500/10",
	very_rare: "text-violet-400 border-violet-500/40 bg-violet-500/10",
	epic: "text-purple-400 border-purple-500/40 bg-purple-500/10",
	legendary: "text-amber-400 border-amber-500/40 bg-amber-500/10",
	mythic: "text-pink-400 border-pink-500/40 bg-pink-500/10",
	artifact: "text-rose-400 border-rose-500/40 bg-rose-500/10",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	!!value && typeof value === "object" && !Array.isArray(value);

const stringifyRuleValue = (value: unknown): string | null => {
	if (value == null) return null;
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean")
		return String(value);
	if (Array.isArray(value)) {
		const parts = value.map(stringifyRuleValue).filter(Boolean);
		return parts.length > 0 ? parts.join(", ") : null;
	}
	if (isRecord(value)) {
		const parts = Object.entries(value)
			.map(([key, entryValue]) => {
				const rendered = stringifyRuleValue(entryValue);
				return rendered ? `${key}: ${rendered}` : null;
			})
			.filter(Boolean);
		return parts.length > 0 ? parts.join("; ") : null;
	}
	return null;
};

const getMechanicsRecord = (
	mechanics: Record<string, unknown> | null | undefined,
	key: string,
): Record<string, unknown> | null => {
	const value = mechanics?.[key];
	return isRecord(value) ? value : null;
};

const getMechanicsArray = (
	mechanics: Record<string, unknown> | null | undefined,
	key: string,
): unknown[] => {
	const value = mechanics?.[key];
	return Array.isArray(value) ? value : [];
};

export const ItemDetail = ({ data }: { data: ItemData }) => {
	const item = data;
	const navigate = useNavigate();
	const displayName = formatRegentVernacular(item.display_name || item.name);
	const imageSrc = item.image_url || item.image || undefined;
	const rarityStyle = item.rarity
		? rarityStyles[item.rarity.toLowerCase()]
		: undefined;
	// Static-data items expose combat stats as top-level canonical fields
	// (damage / damage_type / weapon_type / armor_class / armor_type), while
	// DB-shaped items nest them under properties.weapon / properties.magical.
	// Read both so authored data always renders instead of showing blanks.
	const nestedProperties =
		item.properties && !Array.isArray(item.properties) ? item.properties : null;
	const weaponDamage =
		nestedProperties?.weapon?.damage ??
		(item.damage !== null && item.damage !== undefined
			? String(item.damage)
			: undefined);
	const weaponDamageType =
		nestedProperties?.weapon?.damageType ?? item.damage_type ?? undefined;
	const weapon: NonNullable<ItemData["properties"]>["weapon"] =
		nestedProperties?.weapon ??
		(weaponDamage || item.weapon_type
			? { damage: weaponDamage, damageType: weaponDamageType }
			: undefined);
	const magical = nestedProperties?.magical;
	const rulesIdentity = getMechanicsRecord(item.mechanics, "identity");
	const rulesAction = getMechanicsRecord(item.mechanics, "action_economy");
	const rulesTargeting = getMechanicsRecord(item.mechanics, "targeting");
	const rulesResolution = getMechanicsRecord(item.mechanics, "resolution");
	const rulesAbilities = getMechanicsRecord(
		item.mechanics,
		"ability_modifiers",
	);
	const rulesFormulas = getMechanicsRecord(item.mechanics, "formulas");
	const passiveRules = getMechanicsArray(item.mechanics, "passive_rules");
	const activeRules = getMechanicsArray(item.mechanics, "active_rules");
	const loreText =
		typeof data.lore === "string"
			? data.lore
			: (stringifyRuleValue(data.lore) ?? null);
	const hasStructuredRules = Boolean(
		rulesIdentity ||
			rulesAction ||
			rulesTargeting ||
			rulesResolution ||
			rulesAbilities ||
			rulesFormulas ||
			passiveRules.length > 0 ||
			activeRules.length > 0,
	);

	const parseDiceFromText = (text: string): string | null => {
		const match = text.match(/\b(\d+d\d+(?:\s*[+-]\s*\d+)?)\b/i);
		return match ? match[1].replace(/\s+/g, "") : null;
	};

	const buildWeaponPayload = (): ActionResolutionPayload | null => {
		if (!weapon?.damage) return null;
		return {
			version: 1,
			id: crypto.randomUUID(),
			name: displayName,
			source: { type: "item", entryId: data.id },
			kind: "attack",
			attack: { roll: "1d20" },
			damage: { roll: weapon.damage },
		};
	};

	const buildActiveEffectPayload = (
		active: ActiveEffect,
	): ActionResolutionPayload | null => {
		const description = active.description || "";
		const dice = parseDiceFromText(description);

		if (typeof active.dc === "number") {
			return {
				version: 1,
				id: crypto.randomUUID(),
				name: `${displayName}: ${formatRegentVernacular(active.name)}`,
				source: { type: "item", entryId: data.id },
				kind: "save",
				save: { dc: active.dc, roll: "1d20" },
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
				name: `${displayName}: ${formatRegentVernacular(active.name)}`,
				source: { type: "item", entryId: data.id },
				kind: "healing",
				healing: { roll: dice },
			};
		}

		return {
			version: 1,
			id: crypto.randomUUID(),
			name: `${displayName}: ${formatRegentVernacular(active.name)}`,
			source: { type: "item", entryId: data.id },
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
						fallbackIcon={
							<Sparkles className="w-32 h-32 text-muted-foreground" />
						}
					/>
				</div>
			)}

			<AscendantWindow
				title={displayName.toUpperCase()}
				actions={<ShareToVTTButton itemType="Item" itemName={displayName} />}
			>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						{data.item_type && (
							<Badge variant="secondary">
								{formatRegentVernacular(data.item_type)}
							</Badge>
						)}
						{data.rarity && (
							<Badge variant="outline" className={rarityStyle}>
								{formatRegentVernacular(data.rarity)}
							</Badge>
						)}
						{(data.attunement ||
							(data as { requires_attunement?: boolean })
								.requires_attunement) && (
							<Badge variant="destructive">Requires Attunement</Badge>
						)}
						{(data as { stealth_disadvantage?: boolean })
							.stealth_disadvantage && (
							<Badge variant="outline">Stealth Disadvantage</Badge>
						)}
						{(data as { strength_requirement?: number })
							.strength_requirement ? (
							<Badge variant="outline">
								STR{" "}
								{
									(data as { strength_requirement?: number })
										.strength_requirement
								}
							</Badge>
						) : null}
						{data.cursed && <Badge variant="destructive">Cursed</Badge>}
						{data.source_book && (
							<Badge variant="outline">
								{formatRegentVernacular(data.source_book)}
							</Badge>
						)}
					</div>
					{Array.isArray((data as { tags?: string[] }).tags) &&
						((data as { tags?: string[] }).tags?.length ?? 0) > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{(data as { tags?: string[] }).tags?.map((tag) => (
									<Badge key={tag} variant="outline" className="text-[10px]">
										{formatRegentVernacular(tag)}
									</Badge>
								))}
							</div>
						)}

					{weapon?.damage && (
						<div className="flex flex-wrap gap-2">
							{weapon?.damage && (
								<>
									<Button
										variant="outline"
										onClick={() => {
											const payload = buildWeaponPayload();
											if (!payload) return;
											queueResolutionAndNavigate(payload, "/dice");
										}}
									>
										Roll
									</Button>
									<Button
										variant="outline"
										onClick={() => {
											const payload = buildWeaponPayload();
											if (!payload) return;
											queueResolutionAndNavigate(
												payload,
												"/warden-directives/initiative-tracker",
											);
										}}
									>
										Resolve in Initiative
									</Button>
								</>
							)}
						</div>
					)}
				</div>
			</AscendantWindow>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{(() => {
					const costCredits = (data as { cost_credits?: number }).cost_credits;
					const value = data.value;
					if (value === null || value === undefined) {
						return typeof costCredits === "number" ? (
							<AscendantWindow title="VALUE" compact>
								<div className="flex items-center gap-2">
									<Coins className="w-5 h-5 text-yellow-400" />
									<span className="font-heading">{costCredits} cr</span>
								</div>
							</AscendantWindow>
						) : null;
					}
					return (
						<AscendantWindow title="VALUE" compact>
							<div className="flex items-center gap-2">
								<Coins className="w-5 h-5 text-yellow-400" />
								<span className="font-heading">{value}</span>
							</div>
							{typeof costCredits === "number" && (
								<span className="text-xs text-muted-foreground">
									{costCredits} cr
								</span>
							)}
						</AscendantWindow>
					);
				})()}
				{data.weight !== null && data.weight !== undefined && (
					<AscendantWindow title="WEIGHT" compact>
						<div className="flex items-center gap-2">
							<Weight className="w-5 h-5 text-muted-foreground" />
							<span className="font-heading">{data.weight} lbs</span>
						</div>
					</AscendantWindow>
				)}
				{data.charges && (
					<AscendantWindow title="CHARGES" compact>
						<div className="flex items-center gap-2">
							<Zap className="w-5 h-5 text-blue-400" />
							<span className="font-heading">
								{data.charges.current}/{data.charges.max}
							</span>
						</div>
						{data.charges.recharge && (
							<span className="text-xs text-muted-foreground">
								{formatRegentVernacular(`${data.charges.recharge} recharge`)}
							</span>
						)}
					</AscendantWindow>
				)}
				{(item.armor_class !== null && item.armor_class !== undefined) ||
				item.armor_type ? (
					<AscendantWindow title="ARMOR CLASS" compact>
						<div className="flex items-center gap-2">
							<Shield className="w-5 h-5 text-blue-400" />
							<span className="font-heading">
								{item.armor_class !== null && item.armor_class !== undefined
									? String(item.armor_class)
									: "—"}
							</span>
						</div>
						{item.armor_type && (
							<span className="text-xs text-muted-foreground">
								{formatRegentVernacular(String(item.armor_type))}
							</span>
						)}
					</AscendantWindow>
				) : null}
			</div>

			{data.requirements && (
				<AscendantWindow title="REQUIREMENTS">
					<ul className="space-y-2 text-sm">
						{data.requirements.class && data.requirements.class.length > 0 && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Classes:{" "}
									{data.requirements.class
										.map(formatRegentVernacular)
										.join(", ")}
								</span>
							</li>
						)}
						{data.requirements.job && data.requirements.job.length > 0 && (
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-muted-foreground" />
								<span>
									Jobs:{" "}
									{data.requirements.job.map(formatRegentVernacular).join(", ")}
								</span>
							</li>
						)}
						{data.requirements.alignment &&
							data.requirements.alignment.length > 0 && (
								<li className="flex items-center gap-2">
									<Shield className="w-4 h-4 text-muted-foreground" />
									<span>
										Alignment:{" "}
										{data.requirements.alignment
											.map(formatRegentVernacular)
											.join(", ")}
									</span>
								</li>
							)}
					</ul>
				</AscendantWindow>
			)}

			{(weapon || magical) && (
				<AscendantWindow id="item-properties" title="PROPERTIES">
					<div className="space-y-4 text-sm">
						{weapon && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Swords className="w-4 h-4 text-rose-400" />
									<span className="font-heading">Weapon Profile</span>
								</div>
								<p className="text-muted-foreground">
									{weapon.damage
										? formatRegentVernacular(`Damage: ${weapon.damage}`)
										: "Damage varies"}
									{weapon.damageType
										? formatRegentVernacular(` (${weapon.damageType})`)
										: ""}
									{weapon.range ? ` | Range: ${weapon.range} ft` : ""}
								</p>
								{weapon.versatile && (
									<p className="text-muted-foreground">
										{formatRegentVernacular(`Versatile: ${weapon.versatile}`)}
									</p>
								)}
								{weapon.finesse && (
									<p className="text-muted-foreground">Finesse weapon</p>
								)}
							</div>
						)}
						{magical && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-purple-400" />
									<span className="font-heading">Magical Traits</span>
								</div>
								{magical.bonus && (
									<ul className="space-y-1 text-muted-foreground">
										{magical.bonus.attack !== undefined && (
											<li>Attack bonus: +{magical.bonus.attack}</li>
										)}
										{magical.bonus.damage !== undefined && (
											<li>Damage bonus: +{magical.bonus.damage}</li>
										)}
										{magical.bonus.armorClass !== undefined && (
											<li>Armor Class: +{magical.bonus.armorClass}</li>
										)}
										{magical.bonus.savingThrows &&
											magical.bonus.savingThrows.length > 0 && (
												<li>
													Saving throws:{" "}
													{magical.bonus.savingThrows
														.map(formatRegentVernacular)
														.join(", ")}
												</li>
											)}
										{magical.bonus.abilityScores && (
											<li>
												Ability boosts:{" "}
												{Object.entries(magical.bonus.abilityScores)
													.map(([key, value]) => `${key} +${value}`)
													.join(", ")}
											</li>
										)}
									</ul>
								)}
								{magical.resistance && magical.resistance.length > 0 && (
									<p className="text-muted-foreground">
										Resistance:{" "}
										{magical.resistance.map(formatRegentVernacular).join(", ")}
									</p>
								)}
								{magical.immunity && magical.immunity.length > 0 && (
									<p className="text-muted-foreground">
										Immunity:{" "}
										{magical.immunity.map(formatRegentVernacular).join(", ")}
									</p>
								)}
								{magical.vulnerability && magical.vulnerability.length > 0 && (
									<p className="text-muted-foreground">
										Vulnerability:{" "}
										{magical.vulnerability
											.map(formatRegentVernacular)
											.join(", ")}
									</p>
								)}
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{hasStructuredRules && (
				<AscendantWindow id="item-rules" title="RULES PAYLOAD">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
						{rulesIdentity && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Identity</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesIdentity).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												<AutoLinkText text={formatRegentVernacular(rendered)} />
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{rulesAction && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Activation</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesAction).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												{formatRegentVernacular(rendered)}
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{rulesTargeting && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Targeting</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesTargeting).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												{formatRegentVernacular(rendered)}
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{rulesResolution && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Resolution</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesResolution).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												<AutoLinkText text={formatRegentVernacular(rendered)} />
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{rulesAbilities && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Ability Modifiers</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesAbilities).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												{formatRegentVernacular(rendered)}
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{rulesFormulas && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Formulas</p>
								<ul className="space-y-1 text-muted-foreground">
									{Object.entries(rulesFormulas).map(([key, value]) => {
										const rendered = stringifyRuleValue(value);
										if (!rendered) return null;
										return (
											<li key={key}>
												<span className="text-foreground/80">
													{formatRegentVernacular(key.replace(/_/g, " "))}:{" "}
												</span>
												{formatRegentVernacular(rendered)}
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{passiveRules.length > 0 && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Passive Rules</p>
								<ul className="list-disc list-inside text-muted-foreground">
									{passiveRules.map((rule) => {
										const rendered = stringifyRuleValue(rule);
										if (!rendered) return null;
										return (
											<li key={rendered}>
												<AutoLinkText text={formatRegentVernacular(rendered)} />
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{activeRules.length > 0 && (
							<div className="space-y-2 rounded border border-primary/10 bg-black/30 p-3">
								<p className="font-heading text-primary">Active Rules</p>
								<div className="space-y-2 text-muted-foreground">
									{activeRules.map((rule, index) => {
										const record = isRecord(rule) ? rule : null;
										const label = record
											? stringifyRuleValue(record.name) ||
												`Active Rule ${index + 1}`
											: `Active Rule ${index + 1}`;
										const body = record
											? stringifyRuleValue(record.description)
											: stringifyRuleValue(rule);
										const ruleKey =
											(record
												? stringifyRuleValue(record.id) ||
													stringifyRuleValue(record.name) ||
													stringifyRuleValue(record.description) ||
													JSON.stringify(record)
												: body) || label;
										return (
											<div
												key={ruleKey}
												className="border-l-2 border-primary/30 pl-3"
											>
												<p className="font-heading text-foreground">
													{formatRegentVernacular(label)}
												</p>
												{body && (
													<p>
														<AutoLinkText text={formatRegentVernacular(body)} />
													</p>
												)}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</AscendantWindow>
			)}

			{(data.effects || data.effect) && (
				<AscendantWindow id="item-effects" title="EFFECTS">
					<div className="space-y-4 text-sm">
						{data.effects?.passive && data.effects.passive.length > 0 && (
							<div>
								<p className="font-heading text-foreground">Passive</p>
								<ul className="list-disc list-inside text-muted-foreground">
									{item.effects?.passive?.map((entry: string) => (
										<li key={entry}>
											<AutoLinkText text={entry || ""} />
										</li>
									))}
								</ul>
							</div>
						)}
						{data.effects?.active && data.effects.active.length > 0 && (
							<div className="space-y-3">
								<p className="font-heading text-foreground">Active</p>
								{item.effects?.active?.map((active) => {
									const payload = buildActiveEffectPayload(active);

									return (
										<div
											key={active.name}
											className="border-l-2 border-primary/40 pl-3"
										>
											<div className="flex flex-wrap items-center gap-2">
												<span className="font-heading">
													{formatRegentVernacular(active.name)}
												</span>
												{active.action && (
													<Badge variant="outline" className="text-xs">
														{formatRegentVernacular(active.action)}
													</Badge>
												)}
												{active.frequency && (
													<Badge variant="outline" className="text-xs">
														{formatRegentVernacular(active.frequency)}
													</Badge>
												)}
												{active.dc !== undefined && (
													<Badge variant="outline" className="text-xs">
														DC {active.dc}
													</Badge>
												)}
											</div>

											{payload && (
												<div className="flex flex-wrap gap-2 mt-2">
													<Button
														variant="outline"
														onClick={() => {
															if (!payload) return;
															queueResolutionAndNavigate(payload, "/dice");
														}}
													>
														Roll
													</Button>
													<Button
														variant="outline"
														onClick={() => {
															if (!payload) return;
															queueResolutionAndNavigate(
																payload,
																"/warden-directives/initiative-tracker",
															);
														}}
													>
														Resolve in Initiative
													</Button>
												</div>
											)}

											<p className="text-muted-foreground">
												<AutoLinkText text={active.description || ""} />
											</p>
										</div>
									);
								})}
							</div>
						)}
						{data.effect && (
							<p className="text-muted-foreground">
								<AutoLinkText text={data.effect || ""} />
							</p>
						)}
					</div>
				</AscendantWindow>
			)}

			{data.description && (
				<AscendantWindow id="item-description" title="DESCRIPTION">
					{data.flavor && (
						<p className="text-sm italic text-cyan/70 mb-4 border-l-2 border-cyan/30 pl-3 py-1 bg-cyan/5">
							<AutoLinkText text={data.flavor} />
						</p>
					)}
					<p className="text-foreground leading-relaxed">
						<AutoLinkText text={data.description || ""} />
					</p>
					{loreText && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-amethyst font-bold text-[10px] uppercase tracking-wider mb-2">
								Historical Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={loreText} />
							</p>
						</div>
					)}
					{data.discovery_lore && (
						<div className="mt-6 pt-4 border-t border-cyan/10">
							<h4 className="text-cyan font-bold text-[10px] uppercase tracking-wider mb-2">
								Discovery Record
							</h4>
							<p className="text-sm text-muted-foreground leading-relaxed">
								<AutoLinkText text={data.discovery_lore} />
							</p>
						</div>
					)}
				</AscendantWindow>
			)}
		</div>
	);
};
