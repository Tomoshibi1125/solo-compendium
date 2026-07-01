import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { GUILD_FACILITIES } from "@/data/compendium/guild-base-mods";
import { GUILD_BASES } from "@/data/compendium/guild-bases";
import { GUILD_SKILLS } from "@/data/compendium/guild-skills";
import { useToast } from "@/hooks/use-toast";
import {
	type Guild,
	loadLocalGuilds,
	saveLocalGuilds,
} from "@/hooks/useGuilds";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { AppError } from "@/lib/appError";
import {
	type AggregatedGuildEffects,
	aggregateGuildEffects,
	type GuildBaseProperty,
	type GuildBasePropertyState,
	type GuildBaseState,
	type GuildFacilityId,
	type GuildSkillsState,
	grantFacilityTier,
	grantGuildBaseProperty,
	grantGuildSkill,
	purchaseFacilityUpgrade,
	purchaseGuildBaseProperty,
	purchaseGuildSkill,
} from "@/lib/guildBase";
import type { GuildFunds } from "@/lib/guildTreasury";

// Local (guest) store when Supabase isn't configured or under E2E.
const isGuestGuildStore = (): boolean =>
	!isSupabaseConfigured || import.meta.env.VITE_E2E === "true";

/**
 * Derive a guild's current Base state — built facilities, unlocked skills, and
 * the resolved guild-wide benefits (member-cap bonus, Forge recipes, real sheet
 * effects, narrative perks) — from the guild row's JSONB columns.
 */
export const useGuildBaseState = (guild: Guild | null | undefined) => {
	return useMemo(() => {
		const facilities: GuildBaseState = guild?.base_facilities ?? {};
		const skills: GuildSkillsState = guild?.guild_skills ?? [];
		const baseProperty: GuildBasePropertyState = guild?.base_property ?? null;
		const ownedBase: GuildBaseProperty | null =
			GUILD_BASES.find((b) => b.id === baseProperty) ?? null;
		const effects = aggregateGuildEffects({
			facilities: GUILD_FACILITIES,
			skills: GUILD_SKILLS,
			baseState: facilities,
			skillsState: skills,
			bases: GUILD_BASES,
			baseProperty,
		});
		return { facilities, skills, baseProperty, ownedBase, effects } as {
			facilities: GuildBaseState;
			skills: GuildSkillsState;
			baseProperty: GuildBasePropertyState;
			ownedBase: GuildBaseProperty | null;
			effects: AggregatedGuildEffects;
		};
	}, [guild?.base_facilities, guild?.guild_skills, guild?.base_property]);
};

/** Read a guild's {base_facilities, guild_skills, base_property, funds}. */
const readGuildBaseRow = async (
	guildId: string,
): Promise<{
	base_facilities: GuildBaseState;
	guild_skills: GuildSkillsState;
	base_property: GuildBasePropertyState;
	funds: GuildFunds;
}> => {
	if (isGuestGuildStore()) {
		const g = loadLocalGuilds().find((x) => x.id === guildId);
		if (!g) throw new AppError("Guild not found", "NOT_FOUND");
		return {
			base_facilities: g.base_facilities ?? {},
			guild_skills: g.guild_skills ?? [],
			base_property: g.base_property ?? null,
			funds: g.funds ?? {},
		};
	}
	const { data, error } = await supabase
		.from("guilds")
		.select("base_facilities, guild_skills, base_property, funds")
		.eq("id", guildId)
		.single();
	if (error) throw error;
	return {
		base_facilities: (data?.base_facilities as GuildBaseState | null) ?? {},
		guild_skills: (data?.guild_skills as GuildSkillsState | null) ?? [],
		base_property: (data?.base_property as GuildBasePropertyState) ?? null,
		funds: (data?.funds as GuildFunds | null) ?? {},
	};
};

/** Write back any subset of {base_facilities, guild_skills, base_property, funds}. */
const writeGuildBaseRow = async (
	guildId: string,
	patch: Partial<{
		base_facilities: GuildBaseState;
		guild_skills: GuildSkillsState;
		base_property: GuildBasePropertyState;
		funds: GuildFunds;
	}>,
): Promise<void> => {
	if (isGuestGuildStore()) {
		const guilds = loadLocalGuilds();
		const idx = guilds.findIndex((g) => g.id === guildId);
		if (idx === -1) throw new AppError("Guild not found", "NOT_FOUND");
		guilds[idx] = { ...guilds[idx], ...patch };
		saveLocalGuilds(guilds);
		return;
	}
	const { error } = await supabase
		.from("guilds")
		.update(patch)
		.eq("id", guildId);
	if (error) throw error;
};

/** Buy the next tier of a facility with guild funds (ungated). */
export const usePurchaseFacility = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: { guildId: string; facilityId: string }) => {
			const facility = GUILD_FACILITIES.find((f) => f.id === params.facilityId);
			if (!facility) throw new AppError("Facility not found", "NOT_FOUND");
			const row = await readGuildBaseRow(params.guildId);
			const { baseState, funds } = purchaseFacilityUpgrade({
				baseState: row.base_facilities,
				funds: row.funds,
				facility,
			});
			await writeGuildBaseRow(params.guildId, {
				base_facilities: baseState,
				funds,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Facility upgraded",
				description: "The guild hall has been improved.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Upgrade failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Unlock a guild skill with guild funds (ungated). */
export const usePurchaseGuildSkill = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: { guildId: string; skillId: string }) => {
			const skill = GUILD_SKILLS.find((s) => s.id === params.skillId);
			if (!skill) throw new AppError("Skill not found", "NOT_FOUND");
			const row = await readGuildBaseRow(params.guildId);
			const { skillsState, funds } = purchaseGuildSkill({
				skillsState: row.guild_skills,
				funds: row.funds,
				skill,
			});
			await writeGuildBaseRow(params.guildId, {
				guild_skills: skillsState,
				funds,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Skill unlocked",
				description: "The guild has adopted a new doctrine.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Unlock failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Buy (or relocate to) a guild base property with guild funds (ungated). */
export const usePurchaseGuildBase = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: { guildId: string; baseId: string }) => {
			const base = GUILD_BASES.find((b) => b.id === params.baseId);
			if (!base) throw new AppError("Base not found", "NOT_FOUND");
			const row = await readGuildBaseRow(params.guildId);
			const { baseProperty, baseState, funds } = purchaseGuildBaseProperty({
				ownedBaseId: row.base_property,
				baseState: row.base_facilities,
				funds: row.funds,
				base,
			});
			await writeGuildBaseRow(params.guildId, {
				base_property: baseProperty,
				base_facilities: baseState,
				funds,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Base acquired",
				description: "The guild has a new home.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Purchase failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Warden-grant: set a facility tier / unlock a skill / grant a base at no cost. */
export const useGrantGuildBase = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (
			params:
				| {
						guildId: string;
						kind: "facility";
						facilityId: string;
						tier: number;
				  }
				| { guildId: string; kind: "skill"; skillId: string }
				| { guildId: string; kind: "base"; baseId: string },
		) => {
			const row = await readGuildBaseRow(params.guildId);
			if (params.kind === "facility") {
				await writeGuildBaseRow(params.guildId, {
					base_facilities: grantFacilityTier(
						row.base_facilities,
						params.facilityId as GuildFacilityId,
						params.tier,
					),
				});
			} else if (params.kind === "base") {
				const base = GUILD_BASES.find((b) => b.id === params.baseId);
				if (!base) throw new AppError("Base not found", "NOT_FOUND");
				const { baseProperty, baseState } = grantGuildBaseProperty({
					baseState: row.base_facilities,
					base,
				});
				await writeGuildBaseRow(params.guildId, {
					base_property: baseProperty,
					base_facilities: baseState,
				});
			} else {
				await writeGuildBaseRow(params.guildId, {
					guild_skills: grantGuildSkill(row.guild_skills, params.skillId),
				});
			}
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: "Granted by the Warden",
				description: "Bestowed at no cost.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Grant failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
