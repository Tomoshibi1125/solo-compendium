// Bureau dispatch board (Phase 2G) — local (guest-mode) store/operations.
// The Warden publishes gate contracts + dungeon-break alerts; guild officers
// accept a published contract onto their guild's quest board. The local accept
// mirrors the SQL `accept_bureau_contract` RPC (atomic flip + guild_quests
// insert via acceptGuildQuestLocal).

import { AppError } from "@/lib/appError";
import { acceptGuildQuestLocal, type GuildQuestRank } from "@/lib/guildQuests";

export type BureauContractKind = "contract" | "alert";
export type BureauContractStatus = "published" | "accepted" | "closed";

export interface BureauContract {
	id: string;
	publisher_user_id: string;
	kind: BureauContractKind;
	title: string;
	summary: string | null;
	rank: GuildQuestRank;
	source_quest_id: string | null;
	status: BureauContractStatus;
	accepted_by_guild_id: string | null;
	created_at: string | null;
	accepted_at: string | null;
}

const CONTRACTS_KEY = "solo-compendium.bureau.contracts.v1";

export const loadLocalBureauContracts = (): BureauContract[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(CONTRACTS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as BureauContract[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalBureauContracts = (contracts: BureauContract[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(CONTRACTS_KEY, JSON.stringify(contracts));
};

/** Publish a gate contract or dungeon-break alert to the dispatch board. */
export const publishBureauContractLocal = (params: {
	publisherUserId: string;
	kind: BureauContractKind;
	title: string;
	summary?: string | null;
	rank: GuildQuestRank;
	sourceQuestId?: string | null;
}): BureauContract => {
	const contract: BureauContract = {
		id: crypto.randomUUID(),
		publisher_user_id: params.publisherUserId,
		kind: params.kind,
		title: params.title,
		summary: params.summary ?? null,
		rank: params.rank,
		source_quest_id: params.sourceQuestId ?? null,
		status: "published",
		accepted_by_guild_id: null,
		created_at: new Date().toISOString(),
		accepted_at: null,
	};
	saveLocalBureauContracts([contract, ...loadLocalBureauContracts()]);
	return contract;
};

/**
 * Accept a published contract for a guild: flips the contract to accepted and
 * places it on the guild's board (guild_quests) in one step.
 */
export const acceptBureauContractLocal = (params: {
	contractId: string;
	guildId: string;
}): void => {
	const contracts = loadLocalBureauContracts();
	const contract = contracts.find((c) => c.id === params.contractId);
	if (!contract || contract.kind !== "contract") {
		throw new AppError("Contract not found", "NOT_FOUND");
	}
	if (contract.status !== "published") {
		throw new AppError("Contract is no longer available", "INVALID_INPUT");
	}

	acceptGuildQuestLocal({
		guildId: params.guildId,
		sourceQuestId: contract.source_quest_id ?? `bureau:${contract.id}`,
		title: contract.title,
		rank: contract.rank,
	});

	contract.status = "accepted";
	contract.accepted_by_guild_id = params.guildId;
	contract.accepted_at = new Date().toISOString();
	saveLocalBureauContracts(contracts);
};

/** Close (withdraw) a posting — publisher only in remote mode. */
export const closeBureauContractLocal = (contractId: string): void => {
	const contracts = loadLocalBureauContracts();
	const contract = contracts.find((c) => c.id === contractId);
	if (!contract) throw new AppError("Contract not found", "NOT_FOUND");
	contract.status = "closed";
	saveLocalBureauContracts(contracts);
};
