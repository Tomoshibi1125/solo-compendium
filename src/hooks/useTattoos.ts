import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { listCanonicalEntries } from "@/lib/canonicalCompendium";
import { isLocalCharacterId } from "@/lib/guestStore";
import type { CompendiumTattoo } from "@/types/compendium";

export interface CharacterTattooRow {
	id: string;
	character_id: string;
	tattoo_id: string | null;
	name: string;
	body_part: string | null;
	is_active: boolean;
	is_attuned: boolean;
	requires_attunement: boolean;
	source: string | null;
	custom_effects: Json | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export type CharacterTattooInsert = Omit<
	CharacterTattooRow,
	"id" | "created_at" | "updated_at"
> & {
	id?: string;
	created_at?: string;
	updated_at?: string;
};

export type CharacterTattooUpdate = Partial<
	Omit<CharacterTattooRow, "id" | "character_id" | "created_at">
>;

type CharacterTattooQueryResult<T> = {
	data: T | null;
	error: unknown;
};

type CharacterTattooMutationBuilder = PromiseLike<
	CharacterTattooQueryResult<CharacterTattooRow[]>
> & {
	eq: (column: string, value: unknown) => CharacterTattooMutationBuilder;
	select: (columns?: string) => CharacterTattooMutationBuilder;
	single: () => PromiseLike<CharacterTattooQueryResult<CharacterTattooRow>>;
};

type CharacterTattooQueryBuilder = PromiseLike<
	CharacterTattooQueryResult<CharacterTattooRow[]>
> & {
	delete: () => CharacterTattooMutationBuilder;
	eq: (column: string, value: unknown) => CharacterTattooQueryBuilder;
	insert: (
		value: CharacterTattooInsert & { character_id: string },
	) => CharacterTattooMutationBuilder;
	order: (
		column: string,
		options?: { ascending?: boolean },
	) => CharacterTattooQueryBuilder;
	select: (columns?: string) => CharacterTattooQueryBuilder;
	update: (value: CharacterTattooUpdate) => CharacterTattooMutationBuilder;
};

type CharacterTattooSupabase = {
	from: (table: "character_tattoos") => CharacterTattooQueryBuilder;
};

const tattooSupabase = supabase as unknown as CharacterTattooSupabase;

export interface CharacterTattoo extends CharacterTattooRow {
	tattoo?: CompendiumTattoo | null;
}

const localTattooKey = (characterId: string) =>
	`solo-compendium.local-tattoos.character:${characterId}.v1`;

const nowIso = () => new Date().toISOString();

const readLocalTattoos = (characterId: string): CharacterTattooRow[] => {
	try {
		if (typeof window === "undefined") return [];
		const raw = window.localStorage.getItem(localTattooKey(characterId));
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as CharacterTattooRow[]) : [];
	} catch {
		return [];
	}
};

const writeLocalTattoos = (
	characterId: string,
	tattoos: CharacterTattooRow[],
) => {
	try {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(
			localTattooKey(characterId),
			JSON.stringify(tattoos),
		);
	} catch {}
};

const hydrateTattoos = async (
	rows: CharacterTattooRow[],
): Promise<CharacterTattoo[]> => {
	if (rows.length === 0) return [];
	const entries = (await listCanonicalEntries(
		"tattoos",
	)) as unknown as CompendiumTattoo[];
	const byId = new Map(entries.map((entry) => [entry.id, entry]));
	return rows.map((row) => ({
		...row,
		tattoo: row.tattoo_id ? (byId.get(row.tattoo_id) ?? null) : null,
	}));
};

export const useTattoos = (characterId: string) => {
	const queryClient = useQueryClient();

	const { data: tattoos = [], isLoading } = useQuery({
		queryKey: ["character-tattoos", characterId],
		queryFn: async (): Promise<CharacterTattoo[]> => {
			if (!characterId) return [];
			if (isLocalCharacterId(characterId)) {
				return hydrateTattoos(readLocalTattoos(characterId));
			}

			const { data, error } = await tattooSupabase
				.from("character_tattoos")
				.select("*")
				.eq("character_id", characterId)
				.order("created_at", { ascending: true });

			if (error) throw error;
			return hydrateTattoos((data || []) as CharacterTattooRow[]);
		},
		enabled: !!characterId,
	});

	const addTattoo = useMutation({
		mutationFn: async (tattoo: CharacterTattooInsert) => {
			if (isLocalCharacterId(characterId)) {
				const now = nowIso();
				const next: CharacterTattooRow = {
					id: tattoo.id ?? `local_tattoo_${crypto.randomUUID()}`,
					character_id: characterId,
					tattoo_id: tattoo.tattoo_id ?? null,
					name: tattoo.name,
					body_part: tattoo.body_part ?? null,
					is_active: tattoo.is_active ?? true,
					is_attuned: tattoo.is_attuned ?? false,
					requires_attunement: tattoo.requires_attunement ?? false,
					source: tattoo.source ?? null,
					custom_effects: tattoo.custom_effects ?? null,
					notes: tattoo.notes ?? null,
					created_at: tattoo.created_at ?? now,
					updated_at: tattoo.updated_at ?? now,
				};
				writeLocalTattoos(characterId, [
					...readLocalTattoos(characterId),
					next,
				]);
				return next;
			}

			const { data, error } = await tattooSupabase
				.from("character_tattoos")
				.insert({ ...tattoo, character_id: characterId })
				.select("*")
				.single();
			if (error) throw error;
			return data as CharacterTattooRow;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-tattoos", characterId],
			});
		},
	});

	const updateTattoo = useMutation({
		mutationFn: async ({
			id,
			updates,
		}: {
			id: string;
			updates: CharacterTattooUpdate;
		}) => {
			if (isLocalCharacterId(characterId)) {
				const rows = readLocalTattoos(characterId).map((row) =>
					row.id === id ? { ...row, ...updates, updated_at: nowIso() } : row,
				);
				writeLocalTattoos(characterId, rows);
				return rows.find((row) => row.id === id) ?? null;
			}

			const { data, error } = await tattooSupabase
				.from("character_tattoos")
				.update(updates)
				.eq("id", id)
				.eq("character_id", characterId)
				.select("*")
				.single();
			if (error) throw error;
			return data as CharacterTattooRow;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-tattoos", characterId],
			});
		},
	});

	const removeTattoo = useMutation({
		mutationFn: async (id: string) => {
			if (isLocalCharacterId(characterId)) {
				writeLocalTattoos(
					characterId,
					readLocalTattoos(characterId).filter((row) => row.id !== id),
				);
				return;
			}

			const { error } = await tattooSupabase
				.from("character_tattoos")
				.delete()
				.eq("id", id)
				.eq("character_id", characterId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["character-tattoos", characterId],
			});
		},
	});

	return {
		tattoos,
		isLoading,
		addTattoo: addTattoo.mutateAsync,
		updateTattoo: updateTattoo.mutateAsync,
		removeTattoo: removeTattoo.mutateAsync,
	};
};
