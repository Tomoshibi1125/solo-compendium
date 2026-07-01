import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { GUILD_BASES } from "@/data/compendium/guild-bases";
import { GUILD_SKILLS } from "@/data/compendium/guild-skills";
import type { CharacterFeature } from "@/hooks/useCharacterFeatures";
import {
	type Guild,
	loadLocalGuildMembers,
	loadLocalGuilds,
} from "@/hooks/useGuilds";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	type AggregatedGuildEffects,
	aggregateGuildEffects,
	type GuildBasePropertyState,
	type GuildBaseState,
	type GuildSkillsState,
} from "@/lib/guildBase";
import type { FeatureEffect } from "@/types/featureEffects";

// Guild reads use the local store when Supabase isn't configured / under E2E —
// mirrors `isGuestGuildStore` in the other guild hooks.
const isGuestGuildStore = (): boolean =>
	!isSupabaseConfigured || import.meta.env.VITE_E2E === "true";

export interface CharacterGuildBenefits extends AggregatedGuildEffects {
	/** The guild this character belongs to, if any. */
	guildId: string | null;
	/**
	 * A synthetic "Guild Benefits" feature carrying the guild's real effects,
	 * ready to feed into `featureEffectsToCustomModifiers` so the bonuses apply
	 * to the sheet through the SAME pipeline as feats. Empty when no effects.
	 */
	syntheticFeatures: CharacterFeature[];
}

const EMPTY: AggregatedGuildEffects = {
	memberCapBonus: 0,
	craftingOptions: [],
	effects: [],
	benefits: [],
};

/** Resolve the base columns of the guild a character belongs to (or null). */
const resolveCharacterGuildBase = async (
	characterId: string,
): Promise<{
	guildId: string;
	baseState: GuildBaseState;
	skillsState: GuildSkillsState;
	baseProperty: GuildBasePropertyState;
} | null> => {
	if (isGuestGuildStore()) {
		const member = loadLocalGuildMembers().find(
			(m) => m.character_id === characterId,
		);
		if (!member) return null;
		const guild = loadLocalGuilds().find((g) => g.id === member.guild_id);
		if (!guild) return null;
		return {
			guildId: guild.id,
			baseState: guild.base_facilities ?? {},
			skillsState: guild.guild_skills ?? [],
			baseProperty: guild.base_property ?? null,
		};
	}

	const { data: member, error: memberError } = await supabase
		.from("guild_members")
		.select("guild_id")
		.eq("character_id", characterId)
		.maybeSingle();
	if (memberError) throw memberError;
	if (!member?.guild_id) return null;

	const { data: guild, error: guildError } = await supabase
		.from("guilds")
		.select("base_facilities, guild_skills, base_property")
		.eq("id", member.guild_id)
		.maybeSingle();
	if (guildError) throw guildError;
	if (!guild) return null;

	return {
		guildId: member.guild_id,
		baseState:
			((guild as Partial<Guild>).base_facilities as GuildBaseState | null) ??
			{},
		skillsState:
			((guild as Partial<Guild>).guild_skills as GuildSkillsState | null) ?? [],
		baseProperty:
			((guild as Partial<Guild>).base_property as GuildBasePropertyState) ??
			null,
	};
};

/**
 * The guild benefits that apply to a single character's sheet. One guild per
 * character keeps this bounded. Returns the resolved member-cap bonus, Forge
 * recipes, real `FeatureEffect`s, and narrative perks — plus a synthetic
 * feature the character page threads into its custom-modifier pipeline.
 */
export const useCharacterGuildBenefits = (
	characterId: string | null | undefined,
): CharacterGuildBenefits => {
	const { data } = useQuery({
		queryKey: ["character-guild-benefits", characterId],
		enabled: !!characterId,
		queryFn: async (): Promise<{
			guildId: string | null;
			aggregate: AggregatedGuildEffects;
		}> => {
			if (!characterId) return { guildId: null, aggregate: EMPTY };
			const resolved = await resolveCharacterGuildBase(characterId);
			if (!resolved) return { guildId: null, aggregate: EMPTY };
			return {
				guildId: resolved.guildId,
				aggregate: aggregateGuildEffects({
					facilities: GUILD_FACILITIES,
					skills: GUILD_SKILLS,
					baseState: resolved.baseState,
					skillsState: resolved.skillsState,
					bases: GUILD_BASES,
					baseProperty: resolved.baseProperty,
				}),
			};
		},
	});

	const guildId = data?.guildId ?? null;
	const aggregate = data?.aggregate ?? EMPTY;

	return useMemo<CharacterGuildBenefits>(() => {
		const syntheticFeatures: CharacterFeature[] =
			aggregate.effects.length > 0 && guildId
				? [
						{
							id: `guild-benefits-${guildId}`,
							character_id: characterId ?? "",
							name: "Guild Benefits",
							source: "guild",
							level_acquired: 0,
							description: null,
							uses_current: null,
							uses_max: null,
							recharge: null,
							action_type: null,
							is_active: true,
							modifiers: null,
							homebrew_id: null,
							created_at: new Date(0).toISOString(),
							// Extra field consumed by featureEffectsToCustomModifiers.
							effects: aggregate.effects,
						} as CharacterFeature & { effects: FeatureEffect[] },
					]
				: [];
		return { guildId, ...aggregate, syntheticFeatures };
	}, [guildId, aggregate, characterId]);
};
