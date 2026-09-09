# Supabase Security Exception Register

## Purpose and authority

This register documents every reviewed application `SECURITY DEFINER` function that remains executable by an API role after `supabase/migrations/20260906000000_supabase_security_hardening.sql` and `supabase/migrations/20260908000000_campaign_roster_security.sql`. The migrations' **final exact-signature grant reset** is authoritative; the earlier name-based grant loop is transitional only.

The migrated local catalog is the implementation baseline. It is not evidence that staging or production has the same objects, owners, overloads, ACLs, policies, or Auth settings. Reconcile each live environment with `supabase/snippets/security_surface_inventory.sql` before and after rollout. Keep inventory output in restricted deployment evidence, not in Git.

## Boundary invariants

1. `PUBLIC`, `anon`, and `authenticated` lose execution on all application functions before exact signatures are re-granted.
2. `anon` can execute exactly two narrow preview RPCs. Every other application RPC requires `authenticated` or remains internal.
3. Every application definer has a fixed `search_path`; privileged bodies use qualified object names and disable RLS only where required.
4. Browser identity comes from `auth.uid()`. A legacy actor UUID parameter is an equality assertion, never delegated authority.
5. Account administration is derived only from `auth.users.raw_app_meta_data ->> 'account_role' = 'admin'`. Gameplay roles, `profiles.role`, and user-editable metadata are not account-admin authority.
6. Checked wrappers own the API contract. Renamed `*_unchecked` bodies and helper routines are not executable by API roles.
7. Grants identify an exact `regprocedure`. Adding an overload never inherits approval.
8. This register does not assert `service_role` behavior. Verify its effective privileges from each environment's inventory and use it only from trusted server-side administration paths.

## Anonymous exceptions

These are the complete anonymous function surface. Both signatures are also executable by authenticated callers.

| Exact signature | Caller | Authorization and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.get_campaign_by_share_code(text)` | Campaign join preview in `src/hooks/useCampaigns.ts` | Treats a normalized active share code as a bearer capability. Returns only `id`, `name`, `description`, `share_code`, and `is_active`; at most one row. | Reads a campaign hidden by RLS while exposing a deliberately minimal DTO. |
| `public.get_campaign_invite_by_token(text)` | Invite landing preview in `src/hooks/useCampaignInvites.ts` | Accepts a join code or raw token, hashes token input, requires an active campaign, and returns only campaign name/description, normalized role, expiry, and computed status. It never returns hashes, email, use counters, or join code. | Reads invite and campaign state hidden by RLS through a constrained bearer-capability projection. |

No other `public` or `app_private` function may be executable by `anon`.

## RLS-only account-admin helper

| Exact signature | Caller | Authorization and contract | Why definer is retained |
| --- | --- | --- | --- |
| `app_private.is_account_admin()` | RLS policies and guarded account-admin/homebrew functions; no frontend RPC | Binds to `auth.uid()` and returns whether that Auth user has `app_metadata.account_role = 'admin'`. `anon` has neither schema usage nor execution. `authenticated` receives schema usage and execution only so policies can evaluate it. `app_private` is not a PostgREST-exposed schema. | Must read `auth.users.raw_app_meta_data`, which ordinary users cannot query, without exposing an account-directory RPC. |
| `app_private.can_read_campaign_character(uuid,uuid)` | Character-sheet RLS policies; no frontend RPC | Requires the asserted actor to equal `auth.uid()`, requires primary/co-Warden authority, and confirms the character is actually linked or shared with that campaign. It has no `anon` grant. | Lets sheet tables check a campaign relationship without recursive policy reads or exposing a raw-character lookup routine. |

## Authenticated exceptions

All signatures in this section are granted to `authenticated` only unless they also appear in the anonymous table.

### Account and gameplay authority

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.admin_set_user_role(uuid,text)` | `src/hooks/useAdminUsers.ts` | Canonical account-admin claim required. Locks the target, accepts only gameplay roles `warden` or `ascendant`, updates the profile, and atomically records an admin audit event. It cannot grant account-admin status. | Controlled cross-user profile update and audit insert. |
| `public.admin_set_user_ban(uuid,boolean)` | `src/hooks/useAdminUsers.ts` | Canonical account-admin claim required; self-suspension is rejected. Sets or clears `profiles.banned_at` and writes an audit event. This is application suspension, not an Auth Admin API ban. | Controlled cross-user profile update and audit insert. |
| `public.is_warden_or_admin(uuid)` | Legacy SQL/RLS helper | Returns whether the queried profile carries a gameplay/content role. It accepts a queried UUID and is not account-admin authority. | Avoids recursive profile-policy evaluation across legacy profile tables. |
| `public.is_dm_or_admin(uuid)` | Legacy SQL/RLS compatibility helper | Delegates to `is_warden_or_admin`; the same arbitrary-UUID and gameplay-authority caveats apply. | Preserves old policy/function dependencies while avoiding RLS recursion. |

### Campaign predicates, creation, joining, and invites

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.is_campaign_member(uuid,uuid)` | RLS and SQL helpers | Returns whether the queried user has a campaign membership. It is a membership oracle and must not authorize unrelated account operations. | Avoids recursive `campaign_members` policy evaluation. |
| `public.is_campaign_active(uuid)` | Join and invite functions | Returns whether a campaign exists and is active; it has no actor parameter. | Capability-bearing join flows must validate a campaign hidden by RLS. |
| `public.is_campaign_warden(uuid,uuid)` | RLS and SQL helpers | Returns whether the queried user is the campaign's primary Warden. | Avoids recursive campaign-policy evaluation. |
| `public.is_campaign_dm(uuid,uuid)` | Legacy RLS/SQL compatibility helper | Delegates to `is_campaign_warden`; it does not include co-Wardens. | Preserves legacy dependencies without duplicating policy reads. |
| `public.is_campaign_system(uuid,uuid)` | Campaign RPCs and RLS | Returns true only for the primary Warden or a `co-warden` member. | Central recursion-safe campaign-management predicate. |
| `public.create_campaign_with_code(text,text,uuid)` | `src/hooks/useCampaigns.ts` | Requires authentication and requires the supplied Warden UUID to equal `auth.uid()`. Validates the name, allocates a unique share code, and atomically creates the campaign plus Warden membership. | Atomic creation across campaign and membership RLS. |
| `public.join_campaign_by_code(text,uuid)` | `src/hooks/useCampaigns.ts` | Resolves an active normalized share code, then invokes the internal ID join. Optional character must belong to the actor; membership and character linking are idempotent. Returns campaign UUID. | The share code is the capability for a campaign hidden by RLS; membership/link writes must be atomic. |
| `public.create_campaign_invite(uuid,text,timestamptz,integer,text)` | `src/hooks/useCampaignInvites.ts` and trusted invite-email API route | Primary/co-Warden required. Normalizes role, validates max uses, applies the per-actor/campaign rate limit, stores only token hashes, records audit data, and returns the raw token once with invite metadata. | Atomic token, invite, and audit work across RLS. |
| `public.redeem_campaign_invite(text,uuid)` | `src/hooks/useCampaignInvites.ts` | Requires auth, locks the invite, validates lifecycle and exhaustion, permits only prior acceptors to reuse an exhausted invite, checks optional character ownership, updates membership/link/use count, audits, and returns campaign UUID. | Serialized bearer redemption and atomic cross-table membership work. |
| `public.revoke_campaign_invite(uuid,text)` | `src/hooks/useCampaignInvites.ts` | Primary/co-Warden required. Returns false when absent/already revoked; otherwise stamps revocation metadata and writes an audit event. | Controlled invite and audit updates through RLS. |
| `public.add_ascendant_character_to_campaign(uuid,uuid,text)` | `src/hooks/useCampaigns.ts` and `src/hooks/useCampaignInvites.ts` | Character ownership and existing membership required; an optional invite may establish membership only for the same campaign. Links the character and returns member UUID. | Controlled membership/link writes across character and campaign RLS. |
| `public.add_player_character_to_campaign(uuid,uuid,text)` | Backward-compatibility wrapper; no current direct caller found | Delegates to `add_ascendant_character_to_campaign` and inherits all checks and return behavior. | Temporary compatibility contract for older clients. |
| `public.get_campaign_linked_characters(uuid)` | Compatibility/read model; no current direct caller found | Caller must be a campaign member or primary Warden. Returns a curated member/character combat projection, not arbitrary character rows. | Membership-scoped read of other users' linked characters through RLS. |
| `public.get_campaign_roster(uuid)` | `src/hooks/useCampaigns.ts` and `src/hooks/useCampaignCharacters.ts` | Requires campaign membership or primary/co-Warden authority. Returns only member IDs, account display name, role, join time, and linked-character summary fields; it excludes email, profile metadata, notes, tokens, and full character rows. | Provides the member-visible campaign roster without widening `profiles` or raw-character access. |
| `public.set_campaign_member_role(uuid,uuid,text)` | `src/hooks/useCampaigns.ts` | Primary/co-Warden required. Limits roles to `ascendant` and `co-warden`, locks the campaign/member, and rejects any primary-Warden change. Writes an audit record. | Controlled cross-user membership-role update through a precise capability. |
| `public.remove_campaign_member(uuid,uuid)` | `src/hooks/useCampaigns.ts` | Primary/co-Warden required. Locks the campaign/member, rejects removal of the primary Warden, clears member links and member-created campaign shares, and writes an audit record. | Controlled cross-user membership removal with related-access cleanup. |
| `public.detach_campaign_member_character(uuid,uuid,uuid)` | `src/hooks/useCampaigns.ts` | The link owner may detach their own character; otherwise primary/co-Warden authority is required. The primary Warden may not be detached by another manager. It only removes the specified campaign-character relationship and writes an audit record. | Controlled unlinking without granting broad membership or character writes. |

### Campaign sessions, encounters, rewards, and equipment

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.add_campaign_session_log(uuid,uuid,text,text,text,jsonb,boolean)` | `src/hooks/useCampaignSessions.ts` and sync manager | Requires campaign membership or primary Warden, validates log fields and optional session ownership, forces `author_id = auth.uid()`, and returns log UUID. | Controlled campaign-log insert across session RLS. |
| `public.upsert_campaign_session(uuid,uuid,text,text,timestamptz,text,text,text,uuid)` | `src/hooks/useCampaignSessions.ts` and sync manager | Checked wrapper requires primary/co-Warden before invoking the internal legacy body. Validates status and campaign ownership and creates or updates a session atomically. | Guarded campaign-session writes through RLS. |
| `public.save_campaign_encounter(uuid,uuid,text,text,jsonb,jsonb,jsonb)` | Compatibility surface; no current direct caller found | Primary/co-Warden required. Creates or updates an encounter, replaces entries, optionally records loot, and returns encounter UUID. | Atomic encounter, entry, and loot writes. |
| `public.deploy_campaign_encounter(uuid)` | `src/hooks/useCampaignEncounters.ts` | Resolves the encounter, requires primary/co-Warden, creates combat session/combatants, emits a rule event, and returns session UUID. | Atomic multi-table deployment through combat RLS. |
| `public.export_campaign_bundle(uuid)` | `src/hooks/useCampaignExport.ts` | Primary/co-Warden required. Returns the campaign's multi-table export bundle. | One authorized aggregate read across otherwise independent RLS policies. |
| `public.assign_campaign_loot(uuid,jsonb,uuid,uuid,uuid)` | `src/hooks/useCampaignRewards.ts` | Primary/co-Warden required. Requires a valid item array with positive quantities/nonnegative values and campaign-owned optional references; applies economy caps, writes loot and rule event, and returns loot UUID. | Validated atomic campaign ledger/event update. |
| `public.assign_campaign_relic(uuid,uuid,text,text,jsonb,numeric,uuid,boolean)` | Compatibility surface; no current direct caller found | Primary/co-Warden required. Rejects negative values and cross-campaign member bindings; validates name/economy cap in the internal body, writes relic and rule event, and returns instance UUID. | Validated atomic campaign ledger/event update. |
| `public.update_character_xp(uuid,integer,uuid,text)` | `src/hooks/useEncounterRewards.ts` | Requires positive XP and locks the character. With campaign context, requires primary/co-Warden and a campaign-linked target; without campaign context, requires character ownership. Updates XP and writes a `reward` campaign log when applicable; returns success, total, and message. | Serialized character update and campaign audit write, including controlled cross-user awards. |
| `public.warden_grant_character_equipment(uuid,jsonb)` | `src/hooks/useWardenItemDelivery.ts` | Primary/co-Warden required; every target character must be linked to the campaign. Stacks or inserts validated equipment and returns processed count. | Controlled cross-user inventory mutation in one transaction. |
| `public.create_session_quest(uuid,text,text,text[],jsonb)` | `src/hooks/useSessionQuests.ts` | Authenticated primary Warden required. Creates a campaign quest with objectives/rewards and returns quest UUID. | Privileged quest insert through campaign RLS. |
| `public.complete_session_quest(uuid,text)` | `src/hooks/useSessionQuests.ts` | Authenticated primary Warden of the quest campaign required. Marks the quest complete and stores optional notes. | Privileged quest state transition. |
| `public.claim_quest_rewards(uuid,uuid)` | `src/hooks/useSessionQuests.ts` | Completed quest, campaign membership/Warden status, owned character, and explicit character-campaign link are all required. The internal body prevents duplicate claims and awards configured rewards atomically. | Cross-table reward issuance through quest and character RLS. |

### Character lifecycle and tamed anomalies

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.assign_daily_quests(uuid)` | `src/hooks/useDailyQuests.ts` | Character must belong to `auth.uid()`. Internal deterministic generation inserts idempotent level/difficulty-scaled daily quests. | Owner-bound server-side generation across quest tables. |
| `public.on_long_rest_assign_quests(uuid)` | `src/lib/restSystem.ts` | Character must belong to `auth.uid()`. Expires old daily quests, applies configured penalties, and assigns the next set atomically. | Owner-bound multi-table long-rest transition. |
| `public.generate_character_share_token_for_character(uuid)` | `src/hooks/useCharacters.ts` | Character ownership required. Rotates a persisted unique token and returns it. | Owner-bound token rotation and collision checks across RLS. |
| `public.get_character_by_share_token(uuid,text)` | `src/hooks/useCharacters.ts` | Authenticated bearer must supply both exact character UUID and persisted nonblank token. Returns the matching full character row or no row. | Bearer-controlled read of a character hidden by owner RLS. |
| `public.attempt_taming(uuid,uuid,text,integer,integer,integer,integer,text)` | `src/hooks/useTamedAnomalies.ts` | Requires owned character, valid input ranges, canonical anomaly ID, exact server-derived DC/HP, and campaign link when scoped. Returns null on failed roll or created anomaly UUID on success. | Validated write to owner/shared anomaly tables. |
| `public.claim_anomaly_controller(uuid,uuid)` | `src/hooks/useTamedAnomalies.ts` | Owned character and link to the anomaly's campaign required. Claims only an empty, same, or stale controller slot; returns whether update occurred. | Atomic mutation of shared party state. |
| `public.release_anomaly_controller(uuid)` | `src/hooks/useTamedAnomalies.ts` | Clears only when the actor owns the controlling character or is primary campaign Warden; otherwise no-ops. | Controlled update of shared party state. |

### Guild and Bureau

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.create_guild_with_code(text,text,text,uuid,uuid,uuid)` | `src/hooks/useGuilds.ts` | Supplied leader must equal `auth.uid()`; validates name, optional character ownership, and optional campaign membership. Atomically creates guild and leader membership and returns guild UUID. | Atomic guild/member creation across RLS. |
| `public.guild_member_role(uuid,uuid)` | Guild RLS and SQL helpers | Returns the queried member role or null. It accepts arbitrary queried UUIDs and is a role oracle. | Avoids recursive guild-members policy evaluation. |
| `public.request_to_join_guild(text,uuid,text)` | `src/hooks/useJoinRequests.ts` | Share code is the lookup capability; rejects existing membership, validates optional owned character, creates a pending request, and returns request UUID. | Code-based lookup and request insert across member-only RLS. |
| `public.approve_guild_join_request(uuid,text)` | `src/hooks/useJoinRequests.ts` | Pending request plus leader/vice-master authority required; role is constrained. Atomically creates membership, resolves request, and returns member UUID. | Controlled cross-user membership creation. |
| `public.resolve_guild_quest(uuid,boolean)` | `src/hooks/useGuildQuests.ts` | Locks an active quest, requires leader/vice-master/officer, rejects negative rewards, and atomically records failure or credits treasury/contribution/NPC progress. | Serialized guild treasury and quest state update. |
| `public.accept_bureau_contract(uuid,uuid)` | `src/hooks/useBureauContracts.ts` | Guild leader/vice-master/officer required; locks a published contract, creates the rank-scaled quest, marks acceptance, and returns quest UUID. | Atomic cross-table contract acceptance. |
| `public.bureau_guild_leaderboard()` | `src/hooks/useBureauContracts.ts` | Any authenticated caller receives only the top 50 active guild projection: ID, name, rank, contribution, and member count. | Intentional minimal global projection across member-scoped guild RLS. |

### Notifications, marketplace, homebrew, and sourcebooks

| Exact signature | Caller | Authorization invariant and contract | Why definer is retained |
| --- | --- | --- | --- |
| `public.add_user_notification(uuid,text,text,text,text,text,jsonb,text,timestamptz)` | `src/lib/notify.ts` and sync manager | Self-targeting is allowed. Cross-user delivery is limited to `mention` or `campaign_invite`, requires a UUID `payload.campaign_id`, verifies actor relationship, and verifies the target is a member or the campaign's primary Warden as appropriate. Returns notification UUID. | Narrowly controlled cross-user inbox write. |
| `public.mark_user_notification_read(uuid)` | `src/hooks/useUserNotifications.ts` | Updates only an unread notification owned by `auth.uid()` and returns whether a row changed. | Self-bound update retained for compatibility; candidate for conversion to invoker. |
| `public.record_marketplace_download(uuid,uuid)` | `src/hooks/useMarketplaceData.ts` and sync manager | Supplied/default user must equal `auth.uid()`. Requires entitlement, inserts idempotent download, and recomputes item count. | Self-bound ledger plus aggregate update in one transaction. |
| `public.upsert_marketplace_review(uuid,integer,text,uuid)` | `src/hooks/useMarketplaceData.ts` and sync manager | Supplied/default user must equal `auth.uid()`; rating is 1–5. Upserts review and recomputes item rating aggregates; returns review UUID. | Self-bound review plus aggregate update in one transaction. |
| `public.gift_marketplace_item(uuid,uuid,text)` | `src/hooks/useMarketplaceData.ts` | Authenticated entitled giver and distinct existing recipient required. Copies primary and bundle-child entitlements idempotently. | Intentional, contract-limited cross-user entitlement write. |
| `public.set_homebrew_content_status(uuid,text,text,uuid)` | `src/hooks/useHomebrewContent.ts` and sync manager | Actor must be owner, canonical account admin, or Warden/co-Warden of the content's existing campaign. Validates status/scope; campaign visibility also requires target-campaign authority. Returns content UUID. | Controlled moderation beyond owner RLS. |
| `public.get_accessible_sourcebooks(uuid,uuid)` | `src/lib/sourcebookAccess.ts` | Requires auth, supplied user must equal `auth.uid()`, and optional campaign requires actor membership or primary-Warden status. Returns only free, current owned, and current campaign-shared entitlement projections. The broader legacy helper remains revoked. | Actor-bound entitlement projection must verify a sharer's current entitlement across RLS without exposing an arbitrary-user oracle. |

### Compendium search projections

All six search RPCs require authentication, accept `(query, limit, offset)`, rank full-text matches, and return curated compendium rows. They have no additional identity predicate. Definer status is retained as a compatibility privilege bridge across compendium RLS; each should be converted to invoker or removed if live policy tests prove the bridge unnecessary. Add server-side limit caps before exposing these to less-trusted clients.

| Exact signature | Caller and return contract |
| --- | --- |
| `public.search_compendium_jobs(text,integer,integer)` | No current direct caller found; returns job projection and rank. |
| `public.search_compendium_monarchs(text,integer,integer)` | No current direct caller found; returns legacy monarch projection and rank. |
| `public.search_compendium_monsters(text,integer,integer)` | No current direct caller found; returns anomaly/monster projection and rank. |
| `public.search_compendium_paths(text,integer,integer)` | No current direct caller found; returns job-path projection and rank. |
| `public.search_compendium_powers(text,integer,integer)` | No current direct caller found; returns power projection and rank. |
| `public.search_compendium_relics(text,integer,integer)` | No current direct caller found; returns relic projection and rank. |

## Exact-granted SECURITY INVOKER helpers

These signatures are authenticated and exact-granted because RLS expressions depend on them, but they are **not definer exceptions**:

- `public.can_manage_homebrew_content(uuid,uuid)`
- `public.can_view_homebrew_content(uuid,uuid)`

`public.get_accessible_sourcebooks(uuid,uuid)` is intentionally not in this list: the hardening migration makes it an actor-bound definer so it can validate the current entitlement behind a campaign share. `public.user_has_sourcebook_access(text,uuid,uuid)` remains internal and revoked.

## Internal, revoked, and removed routines

| Category | Routines | Disposition |
| --- | --- | --- |
| Guarded legacy delegates | `upsert_campaign_session_unchecked`, `add_user_notification_unchecked`, `assign_daily_quests_unchecked`, `on_long_rest_assign_quests_unchecked`, `record_marketplace_download_unchecked`, `upsert_marketplace_review_unchecked`, `claim_quest_rewards_unchecked`, `attempt_taming_unchecked`, `redeem_campaign_invite_unchecked`, `resolve_guild_quest_unchecked`, `assign_campaign_loot_unchecked`, `assign_campaign_relic_unchecked` | Owner-internal only; no API execution. Call only from the checked wrappers. |
| Join and invite internals | `join_campaign_by_id(uuid,uuid)`, `attach_campaign_member_character`, `resolve_campaign_invite`, `normalize_campaign_invite_role`, token/code/hash generators, and invite audit logger | Retained as owner-internal dependencies; no direct API execution. ID-only joining is deliberately revoked. |
| Sourcebook internals | `user_has_sourcebook_access(text,uuid,uuid)` and any grant/share administration routine not in the final exact list | No browser execution. Use only through reviewed wrappers or trusted administration. |
| Legacy combat/session entry points | `advance_combat_turn(uuid)`, `start_active_session`, `end_active_session`, `start_session_combat`, `end_session_combat` | Revoked from API roles; application uses the campaign-combat/session model. |
| Trigger/event routines | Character-limit enforcement, timestamp/version triggers, `rls_auto_enable`, and other trigger-only functions | Trigger/event invocation only; no client execution. |
| Utilities and maintenance | `asset_exists(text)`, `get_campaign_member_count(uuid)`, `prepare_search_text(text)`, `hypopg_reset()`, `sync_compendium_data`, share-code/token helpers | Internal or revoked. `hypopg_reset` and maintenance helpers must never be browser RPCs. |
| Removed attack surface | `exec_sql(text)`, stale quest overloads, and `get_character_by_share_token(text)` | Dropped. Maintenance scripts must use trusted direct SQL rather than recreating `exec_sql`. |

## Review and removal candidates

- Remove `add_player_character_to_campaign` after old clients are retired.
- Confirm callers before retaining `save_campaign_encounter`, `assign_campaign_relic`, `get_campaign_linked_characters`, and the six compendium searches.
- Move `guild_member_role` and campaign/profile role predicates to a non-exposed schema when RLS dependencies can be migrated; today they are membership/role oracles.
- Convert `mark_user_notification_read` and other strictly self-bound routines to invoker when policy coverage is proven.
- Review `asset_exists`, `get_campaign_member_count`, `prepare_search_text`, `hypopg_reset`, `resolve_campaign_invite`, and timestamp-only definers for deletion or invoker conversion.
- `is_dm_or_admin` and `is_warden_or_admin` are gameplay/content compatibility helpers. They must never gate account administration.

## Reviewed residual caveats

- Share-code joining is intentionally separate from invite redemption and does not consume invite expiry/use limits.
- `guild_member_role` and campaign role predicates accept queried UUIDs and can reveal membership/role state; they remain for RLS recursion avoidance.
- The taming roll total remains client-supplied gameplay input but is range-checked; DC and HP are derived from canonical anomaly data.
- Marketplace gifting intentionally creates another user's entitlement. That is its exact business contract, not account administration.
- Cross-user notifications are limited to verified campaign mentions or notification of the campaign's primary Warden.
- Owner-scoped `update_character_xp` without campaign context permits self-awards by design; campaign-scoped cross-user awards require Warden authority and a linked character. Revisit if XP must become exclusively server-awarded.
- Character share lookup is authenticated-only and returns the full character row. If anonymous sharing is ever required, add a new minimal DTO instead of granting the current function to `anon`.
- Session quest creation/completion currently requires the primary Warden, while many other campaign operations include co-Wardens.
- Compendium search projections need future row-level entitlement and maximum-limit review.
- Supabase Auth leaked-password protection remains intentionally deferred as an operational follow-up; it is not an RLS or RPC exception and must be enabled/reviewed separately before a production security milestone.

## Inventory reconciliation

For each environment:

1. Run `supabase/snippets/security_surface_inventory.sql` before deployment and store output in restricted evidence.
2. Compare schema, exact identity arguments, result type, owner, `prosecdef`, fixed `search_path`, extension membership, and effective grants for `anon`, `authenticated`, and `service_role`.
3. Reconcile event triggers, table triggers, RLS policies, storage buckets/policies, and owner-specific default function ACLs.
4. Apply the migration only when unexpected overloads, missing signatures, owner drift, and policy drift have been resolved.
5. Run the same inventory after deployment and diff it against both preflight output and this register. Do not commit raw definitions, ACL output, secrets, tokens, emails, or user identifiers.

## Change control

Any new function, overload, result change, grant, or authorization change requires all of the following in the same reviewed change:

- exact schema and identity signature;
- API role matrix and explicit `PUBLIC` decision;
- caller and business contract;
- `SECURITY INVOKER` versus `SECURITY DEFINER` justification;
- fixed `search_path`, owner, and RLS behavior;
- actor-binding and object-relationship checks;
- minimal result DTO and side-effect inventory;
- exact-signature grant and default-ACL impact;
- pgTAP denial/allow assertions and relevant frontend tests;
- generated-type reconciliation;
- this register and rollout evidence updated.

Name-based allowlists are not approval. Do not expose an unchecked body, broad helper, maintenance routine, or new anonymous function for compatibility.
