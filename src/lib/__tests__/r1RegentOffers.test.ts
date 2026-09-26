import { describe, expect, it } from "vitest";
import migrationSource from "../../../supabase/migrations/20260926030000_r1_curated_regent_offers.sql?raw";
import playerPanelSource from "../../components/character/RegentUnlocksPanel.tsx?raw";
import wardenPanelSource from "../../components/campaign/CampaignRegentOversight.tsx?raw";
import readinessSource from "../../hooks/useSovereignReady.ts?raw";

const source = migrationSource.replace(/\r\n/g, "\n");

const between = (start: string, end: string) => {
	const from = source.indexOf(start);
	const to = source.indexOf(end, from + start.length);
	if (from < 0 || to < 0) throw new Error(`Missing migration block ${start}`);
	return source.slice(from, to);
};

const createOffer = between(
	"CREATE OR REPLACE FUNCTION public.create_regent_unlock_offer(",
	"CREATE OR REPLACE FUNCTION public.configure_regent_unlock_offer(",
);
const configureOffer = between(
	"CREATE OR REPLACE FUNCTION public.configure_regent_unlock_offer(",
	"CREATE OR REPLACE FUNCTION public.revoke_regent_unlock_offer(",
);
const consumeOffer = between(
	"CREATE OR REPLACE FUNCTION public.consume_regent_unlock_grant(",
	"REVOKE EXECUTE ON FUNCTION public.create_regent_unlock_offer",
);

const canonicalIds = [
	"umbral_regent",
	"radiant_regent",
	"steel_regent",
	"destruction_regent",
	"war_regent",
	"frost_regent",
	"beast_regent",
	"plague_regent",
	"spatial_regent",
	"mimic_regent",
	"blood_regent",
	"gravity_regent",
] as const;

describe("R1 curated Regent offers", () => {
	it("stores exactly three distinct canonical candidates", () => {
		expect(source).toContain("ADD COLUMN IF NOT EXISTS candidate_regent_ids TEXT[]");
		expect(source).toContain("cardinality(candidate_regent_ids) = 3");
		expect(source).toContain("candidate_regent_ids[1] <> candidate_regent_ids[2]");
		expect(source).toContain("candidate_regent_ids[1] <> candidate_regent_ids[3]");
		expect(source).toContain("candidate_regent_ids[2] <> candidate_regent_ids[3]");
		for (const id of canonicalIds) expect(source).toContain(`'${id}'`);
	});

	it("removes direct grant-write bypasses and exposes actor-bound RPCs only", () => {
		expect(source).toContain("DROP POLICY IF EXISTS regent_unlock_grants_insert");
		expect(source).toContain("DROP POLICY IF EXISTS regent_unlock_grants_delete");
		for (const block of [createOffer, configureOffer, consumeOffer]) {
			expect(block).toContain("SECURITY DEFINER");
			expect(block).toContain("v_actor UUID := auth.uid()");
		}
		expect(createOffer).toContain("CAMPAIGN_WARDEN_REQUIRED");
		expect(configureOffer).toContain("CAMPAIGN_WARDEN_REQUIRED");
	});

	it("makes creation idempotent and pending edits versioned", () => {
		expect(source).toContain("UNIQUE (request_id)");
		expect(createOffer).toContain("WHERE grant_row.request_id = p_request_id");
		expect(createOffer).toContain("RETURN v_existing.id;");
		expect(createOffer).toContain("REGENT_OFFER_REQUEST_CONFLICT");
		expect(configureOffer).toContain("offer_version = v_next_version");
		expect(configureOffer).toContain("REGENT_OFFER_CONSUMED_IMMUTABLE");
	});

	it("rejects legacy pending credits and forged/fourth choices", () => {
		expect(consumeOffer).toContain(
			"LEGACY_REGENT_OFFER_REQUIRES_WARDEN_CONFIGURATION",
		);
		expect(consumeOffer).toContain(
			"v_canonical_regent_id = ANY (v_grant.candidate_regent_ids)",
		);
		expect(consumeOffer).toContain("REGENT_NOT_IN_OFFER");
	});

	it("preserves exact retry and the existing two-unlock concurrency boundary", () => {
		const retryIndex = consumeOffer.indexOf("IF v_grant.consumed_unlock_id IS NOT NULL THEN");
		const configuredIndex = consumeOffer.indexOf("IF v_grant.candidate_regent_ids IS NULL THEN");
		expect(retryIndex).toBeGreaterThanOrEqual(0);
		expect(configuredIndex).toBeGreaterThan(retryIndex);
		expect(consumeOffer).toContain("RETURN v_existing_unlock.id;");
		expect(consumeOffer).toContain("IF v_unlock_count >= 2 THEN");
		expect(consumeOffer).toContain("REGENT_UNLOCK_LIMIT_REACHED");
		expect(consumeOffer).toContain("FOR UPDATE;");
	});

	it("does not introduce a Regent level gate", () => {
		expect(createOffer).not.toMatch(/character_row\.level|minimum_level|level\s*[>=]/i);
		expect(consumeOffer).not.toMatch(/character_row\.level|minimum_level|level\s*[>=]/i);
	});

	it("uses stored candidates in player UI and explicit three-candidate Warden UI", () => {
		expect(playerPanelSource).toContain("getStoredRegentOfferCandidates(activeOffer)");
		expect(playerPanelSource).not.toContain("adaptiveChoices");
		expect(playerPanelSource).toContain("Legacy offer needs Warden configuration");
		expect(wardenPanelSource).toContain("Choose exactly three distinct canonical Regents");
		expect(wardenPanelSource).toContain("candidateIds");
		expect(wardenPanelSource).toContain("crypto.randomUUID()");
	});

	it("enables Sovereign readiness only from resolved canonical unlocks", () => {
		expect(readinessSource).toContain("unlock.resolved_regent_id !== null");
		expect(readinessSource).toContain("const hasTwoRegents = regentCount >= 2");
	});
});
