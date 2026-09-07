# Supabase Security Hardening Rollout Runbook

## Scope and approval boundary

This runbook deploys `supabase/migrations/20260906000000_supabase_security_hardening.sql` after local validation. The migration is forward-only and changes function ACLs/bodies, RLS policy behavior, anonymous DTOs, storage listing policies, and supporting constraints.

Do **not** link a project, run linked tests, query a live catalog, apply migrations, change Supabase Advisor state, modify Dashboard Auth settings, provision account admins, restore data, or touch staging/production until the environment owner explicitly approves that action and project reference.

Roll out staging first, collect fresh evidence, soak, obtain sign-off, then repeat the complete process for production. A staging pass is not production evidence.

## Risk and recovery model

- The migration runs in one transaction. A statement failure before `COMMIT` should leave the prior catalog intact.
- There is no down migration. Never edit migration history or manually reverse individual grants/policies in a deployed environment.
- Before first deployment, confirm a restorable backup or point-in-time recovery window and record who can execute recovery.
- If a committed deployment must be reversed, use database restore/PITR or ship a separately reviewed forward-fix migration. Choose with the incident commander based on data written after deployment.
- Once this migration has reached any shared environment, its file is immutable. Subsequent corrections require a new forward migration.

## Required artifacts

- Migration: `supabase/migrations/20260906000000_supabase_security_hardening.sql`
- Database contract tests: `supabase/tests/security_hardening.sql`
- Read-only inventory: `supabase/snippets/security_surface_inventory.sql`
- Exception register: `docs/supabase-security-exception-register.md`
- This runbook

Inventory output may contain complete function definitions and ACL details. Store it only in approved restricted deployment evidence; do not commit it to Git or attach raw output to a public ticket.

## Gate 1: local validation

### 1. Start and identify local Supabase

On this Windows workstation, Docker CLI may require temporary PATH injection:

```powershell
$dockerBin = "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin"
$env:PATH = "$dockerBin;" + $env:PATH
npx supabase status
```

Do not use `supabase db reset` when local data must be preserved.

For a fresh local catalog, apply pending migrations normally:

```powershell
npx supabase migration up --local
```

If this still-unreleased migration was already applied locally and its file changed during review, replay only that local history entry:

```powershell
npx supabase migration repair 20260906000000 --status reverted --local
npx supabase migration up --local
```

This repair sequence is for the disposable/local migration ledger only. Never use it against staging or production to rewrite a successfully deployed migration.

### 2. Run database security contracts

```powershell
npm run test:db:security
```

Required result: all pgTAP assertions pass, including exact anonymous surface, no `PUBLIC` execution, fixed definer search paths, exact overloads, internal-wrapper denial, actor mismatch denial, storage non-enumerability, sourcebook actor binding, and reward-log compatibility.

### 3. Run application checks

```powershell
npm run typecheck
npm run lint:check
npm run test:run
npm run build
git diff --check
```

All commands must pass. Review any warning rather than treating exit code alone as evidence. Build-time environment output must not contain secrets.

### 4. Reconcile generated types without accepting unrelated drift

Generate the migrated local catalog to a temporary file first:

```powershell
npx supabase gen types typescript --db-url postgresql://postgres:postgres@127.0.0.1:54322/postgres --schema public > "$env:TEMP\solo-compendium-supabase-types.ts"
```

Compare the temporary output with `src/integrations/supabase/types.ts`. Confirm the two anonymous DTOs, removed `exec_sql`, exact argument names, and changed RPC signatures. Do not overwrite the checked-in type file wholesale when the local baseline contains unrelated stale schema drift; apply only verified migration deltas and require `npm run typecheck` afterward.

### 5. Review local evidence

Confirm:

- only the intended migration, frontend, tests, snippets, and docs changed;
- no secrets, inventory output, generated build output, or local Supabase state is staged;
- `git diff --check` is clean apart from understood line-ending warnings;
- the security exception register matches the migrated local catalog;
- the migration has not been applied to any linked project.

## Gate 2: staging preflight — explicit approval required

Record the approved staging project reference and operator. Abort if the CLI's linked reference or Dashboard project name does not exactly match.

### 1. Establish change controls

- Approved change window and incident lead.
- Confirmed backup/PITR coverage and restore operator.
- Current application release/commit and migration checksum recorded.
- No unreviewed concurrent database, Auth, Storage, or Edge Function changes.
- Application release containing compatible frontend DTO/auth changes is ready to deploy with the database change.

### 2. Verify migration history

After explicit authorization to use the staging project:

```powershell
npx supabase migration list --linked
```

Expected pending database change: `20260906000000` only, unless every additional pending migration is separately reviewed and included in the change. Abort on missing, duplicate, reverted, out-of-order, or unexpected migrations. Do not use `migration repair` to make the list look correct.

### 3. Capture pre-deployment inventory

Run `supabase/snippets/security_surface_inventory.sql` through an approved SQL client against the explicit staging database. Capture:

- exact function signatures, result types, owners, security mode, configuration, and effective API grants;
- event/table triggers;
- RLS policies;
- storage bucket and object-policy state;
- default function ACLs by owner.

Diff against the local baseline and exception register. Resolve unexpected overloads, missing exact signatures, custom owners, permissive policies, or default ACLs before continuing.

### 4. Confirm backup/PITR

Record backup timestamp, retention window, latest recoverable point, restore procedure, and authorized restore operator. Do not continue on an assumption that backups exist.

## Gate 3: staging deployment — explicit approval required

### 1. Apply exactly the reviewed migration

Use the approved Supabase migration workflow only after reviewing the final pending list. For the repository's linked workflow:

```powershell
npx supabase db push --linked
```

Read the CLI's target and migration list before confirming. Abort if it names the wrong project or proposes any unreviewed migration.

### 2. Run linked database contracts

```powershell
npm run test:db:security:linked
```

A local pass is not a substitute. Save the summarized test result, CLI version, project reference, migration version, and timestamp in restricted evidence.

### 3. Capture and reconcile post-deployment inventory

Run the inventory script again. Compare pre/post and verify:

- `anon` executes exactly the two preview RPCs;
- no application function grants `PUBLIC` execution;
- `exec_sql(text)` is absent;
- stale overloads and unchecked wrappers are not API-executable;
- all retained definers have fixed search paths;
- exact authenticated grants match the exception register;
- `app_private.is_account_admin()` is not anonymous or PostgREST-exposed;
- the five public asset buckets remain public while broad object-listing policies are gone;
- owner-specific default function ACLs do not restore `PUBLIC` execution.

Investigate effective `service_role` access separately; do not infer it from `authenticated` grants.

### 4. Reconcile linked types and DTOs

Generate linked types to a temporary artifact, never directly over the checked-in file:

```powershell
npx supabase gen types typescript --linked --schema public > "$env:TEMP\solo-compendium-staging-types.ts"
```

Review only expected security-hardening deltas. The campaign preview must expose `id`, `name`, `description`, `share_code`, and `is_active`. The invite preview must expose `campaign_id`, `campaign_name`, `campaign_description`, `role`, `expires_at`, and `status`. `exec_sql` must be absent.

### 5. Run staging smoke matrix

Use dedicated non-production test identities and synthetic records. Do not include tokens, emails, user IDs, raw JWTs, or other PII in shared evidence.

| Area | Allow case | Deny/minimization case |
| --- | --- | --- |
| Anonymous RPCs | Active share code and invite token return their documented DTOs. | Every other application RPC is denied; DTOs contain no Warden ID, settings, token data, invite email, use counters, or audit data. |
| Removed SQL bridge | Normal application flows operate. | `exec_sql(text)` does not resolve and cannot be called by API roles. |
| Account admin | A deliberately provisioned account-admin can view account registry/audit and run guarded role/suspension operations. | Ordinary Ascendant and gameplay Warden cannot enumerate users, read admin audit data, or invoke successful account-admin mutations. |
| Actor binding | Campaign/guild creation succeeds when asserted actor equals the JWT subject. | A different supplied UUID fails with authorization error and creates no rows. |
| Campaign sharing | Share-code join creates only the actor's membership and optional owned-character link. | Direct `join_campaign_by_id` is unavailable; another user's character cannot be attached. |
| Invite lifecycle | Valid invite redemption is atomic; prior acceptor behavior is idempotent. | Revoked, expired, unknown, and newly exhausted-invite users are rejected; concurrent final-use attempts do not over-consume. |
| Notifications | Self notifications and valid campaign relationship notifications succeed. | Arbitrary cross-user fan-out, missing/invalid campaign payload, and unrelated targets are denied. |
| Rewards and quests | Warden awards linked-character XP/loot and eligible owner claims quest rewards. | Non-Warden cross-user award, unlinked target, duplicate claim, negative reward, and mismatched campaign references fail. Confirm XP writes a valid `reward` log. |
| Sourcebooks | Actor receives free, current owned, and authorized campaign-shared books. | Mismatched user UUID and unrelated campaign context are denied; legacy `user_has_sourcebook_access` is not a browser RPC. |
| Storage delivery | Existing known public URLs remain fetchable; owner-prefixed upload/delete succeeds. | Anonymous/broad bucket listing fails; a user cannot write/delete another owner's prefix; foreign-origin portrait URLs are rejected by the client. |
| Password change | Signed-in user completes reauthentication, nonce confirmation, and password update; recovery session completes once. | Weak/breached passwords, invalid/expired nonce, ordinary session on recovery page, and unsafe error detail are rejected or normalized. |
| Account-admin claim | JWT with trusted `app_metadata.account_role = admin` enables server and UI capability after refresh. | `profiles.role`, `user_metadata`, and gameplay Warden selection never grant account administration. |

### 6. Supabase Advisor and Auth settings

These are live-only manual gates and are not changed by the SQL migration:

1. Run Supabase Security Advisor after migration and triage every new or unresolved finding.
2. Run Performance Advisor where policy/function changes can affect plans.
3. In Dashboard Auth security settings, verify leaked-password protection is enabled according to the organization's policy.
4. Record setting state and Advisor summaries without copying secrets or user data.

Do not change Advisor remediations or Auth settings during this rollout unless separately approved.

### 7. Soak and sign-off

Monitor Auth failures, PostgREST 401/403/404/5xx rates, RPC errors, invite redemption conflicts, storage upload/list errors, and client error reporting for the agreed staging soak period. Obtain application owner, database owner, and security reviewer sign-off before production scheduling.

## Account-admin provisioning — separate trusted operation

Account-admin status must be provisioned only through a trusted Supabase Dashboard/Auth Admin API/service-role workflow after explicit approval.

Canonical metadata:

```json
{
  "account_role": "admin"
}
```

Rules:

- Set this under **app metadata**, preserving unrelated existing app-metadata keys.
- Never use `profiles.role`, `user_metadata`, client `updateUser`, or gameplay Warden status.
- Never place a service-role key in the browser, repository, terminal transcript, or deployment evidence.
- Provision only named approved operators and record approval separately from user PII.
- Force or request a JWT refresh after the update: sign out/in or use the approved session-refresh flow. Validate both server denial/allow and `AuthUser.isAccountAdmin` UI gating.
- To revoke, remove or change the app-metadata claim through the same trusted path and invalidate/refresh sessions according to incident policy.

## Gate 4: production rollout — fresh approval and evidence required

Repeat every staging step against the explicitly approved production project. Do not reuse staging inventory, Advisor output, backup confirmation, type generation, smoke results, or project-reference screenshots.

Minimum production sequence:

1. Confirm change window, incident lead, exact commit, migration checksum, and compatible application artifact.
2. Confirm production backup/PITR and restore operator.
3. Verify the linked production project and migration list; abort on any unexpected pending migration.
4. Capture restricted pre-inventory and reconcile drift.
5. Apply exactly the reviewed migration.
6. Run linked pgTAP against production only if explicitly approved by the database owner; otherwise execute the approved read-only contract subset and record the exception.
7. Capture and reconcile post-inventory.
8. Deploy/activate the compatible frontend in the approved order.
9. Execute the production-safe smoke matrix with designated test records.
10. Run Advisor and verify leaked-password protection state.
11. Monitor through the change window and obtain final sign-off.

## Abort criteria

Stop before deployment if any of these is true:

- project reference or database identity is ambiguous;
- backup/PITR cannot be demonstrated;
- migration history is unexpected or requires repair;
- pre-inventory contains an unexplained overload, owner, grant, policy, trigger, or default ACL;
- exact signatures expected by the migration are missing;
- compatible frontend/API artifacts are not ready;
- local validation or staging sign-off is incomplete;
- an unapproved concurrent database/Auth/Storage change is in progress.

Stop after deployment and enter incident handling if any of these is true:

- migration or linked pgTAP fails;
- anonymous access exceeds two RPCs or a DTO leaks extra fields;
- ordinary/gameplay users gain account-admin behavior;
- expected account-admin, invite, campaign, sourcebook, or storage owner flows fail materially;
- direct ID join, unchecked wrappers, `exec_sql`, or broad storage listing becomes reachable;
- error rates, authorization denials, latency, or data integrity indicators exceed the agreed threshold;
- pre/post inventory cannot be reconciled.

Do not improvise grants or Dashboard policy changes to keep the rollout moving. Pause, preserve evidence, and choose restore/PITR or a reviewed forward fix.

## Evidence template

Store this record in the approved restricted change system:

```text
Environment:
Project reference (non-secret):
Operator and approvers:
Application commit/artifact:
Migration version and SHA-256:
Supabase CLI version:
Change-window start/end:
Backup/PITR evidence and restore owner:
Pre-inventory location and reviewer:
Migration-list result:
Apply result:
Linked pgTAP result:
Post-inventory location and reconciliation:
Linked type/DTO diff result:
Smoke matrix result and synthetic test-record cleanup:
Security/Performance Advisor summary:
Leaked-password protection state:
Account-admin provisioning performed? approval reference only:
Monitoring/soak result:
Exceptions and follow-up owners:
Final sign-off:
```

Do not place database URLs, passwords, service-role keys, JWTs, invite/share tokens, raw function definitions, emails, user IDs, or unrestricted inventory output in Git or broadly visible evidence.