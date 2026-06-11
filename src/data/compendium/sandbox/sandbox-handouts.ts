import type { SandboxHandout } from "../ascendant-sandbox-module";

/**
 * SANDBOX HANDOUTS - The Shadow of the Regent
 */

const rawSandboxHandouts = [
	{
		title: "Emergency Writ: S-Rank Rift Entry",
		content: `# EMERGENCY WRIT

You are cleared for entry into the Gloamreach Rift Interior under crisis authority.

Return conditions: Anchor broken, Anchor sealed, Anchor transformed, or Rift Break evacuation.

The Bureau accepts no liability for Domain law, Anomaly exposure, Essence contamination, Relic corruption, or failed extraction after threshold closure.`,
	},
	{
		title: "AFA Alert: Rift Interior Scale",
		content: `# AFA ALERT

Rift threshold stabilized.

Interior mapping exceeds standard bounded Rift parameters.

Domain estimate: country-scale interior realm.

Anchor classification: sovereign intelligence.

Recommendation: do not enter without S-Rank command approval.

Override: emergency entry authorized.`,
	},
	{
		title: "Oracle Scan Sheet: The Fortune of the Domain",
		content: `# ORACLE SCAN

The Spark:

The Chain:

The Crown:

The Pulse:

The Oathbreaker:

The scan output is unstable. Re-run attempts may alert the Anchor.`,
	},
	{
		title: "Map Fragment: Road of Writs",
		content: `# ROAD OF WRITS FRAGMENT

The road bends toward the Citadel no matter how it is drawn.

Marked stops: Rift Threshold, Writ-Bound Hamlet, Vermillion Outpost, Drowned Ledgerfen, Remembering Orchard, Bastion Golemfall, Obsidian Spire.

Unmarked warning written in red pencil: "If the Bailiff reads your name, do not answer until you know the charge."`,
	},
	{
		title: "Writ-Bound Hamlet Tribute Notice",
		content: `# NOTICE OF TRIBUTE

By grace of the Regent, this settlement remains sheltered under lawful weather and bounded hunger.

Tribute is due by the second bell after dusk.

Acceptable forms: Essence, labor, living service, Relic metal, memory, or sworn betrayal.

Failure voids shelter.`,
	},
	{
		title: "Vermillion Outpost Price Board",
		content: `# VERMILLION OUTPOST PRICE BOARD

Soup: 1 clean core shaving.

Surgery: 3 clean Essence ampoules or future salvage share.

AFA battery: market rate plus oath.

Relic appraisal: free if we keep first refusal.

Rescue party: negotiable. Not cheap. Never free.`,
	},
	{
		title: "Bureau Annex Last Order",
		content: `# LAST ORDER

All teams will hold assigned corridors until command updates the retreat route.

Do not abandon sealed supply rooms.

Do not negotiate with Domain officers.

Do not deviate from Rank doctrine.

Addendum, unsent: there is no retreat route.`,
	},
	{
		title: "Bureau Casualty Tag",
		content: `# CASUALTY TAG

Name: unreadable due to ash damage.

Rank: C provisional.

Cause: court patrol.

Notes: subject remained combat-effective after fatal wound for forty-seven seconds. Recommend commendation if remains recoverable.`,
	},
	{
		title: "Tithe Mill Work Token",
		content: `# TITHE MILL TOKEN

Bearer is permitted through the outer wheelhouse for one shift.

No weapons beyond the red line.

No questions in the rendering room.

No refunds for partial processing.`,
	},
	{
		title: "Remembering Orchard Harvest Instructions",
		content: `# REMEMBERING ORCHARD HARVEST

Cut only white-veined fruit.

Do not bleed near open flowers.

If fruit speaks, destroy it.

If fruit cries, leave the row immediately.

If the orchard turns toward you, kneel until it loses interest.`,
	},
	{
		title: "Aegis Oath Plate",
		content: `# AEGIS OATH

Hold the line.

Hold the door.

Hold the wounded.

Hold when command fails.

Hold when law becomes teeth.

Hold until holding becomes the only part of you left.`,
	},
	{
		title: "Awoko Inheritance Hymn",
		content: `# HYMN OF INHERITANCE

The road is cruel because roads must choose.

The bell is kind because bells must answer.

The crown is heavy because someone must carry law.

Give grief and be held.

Give blood and be named.

Give all and awaken.`,
	},
	{
		title: "Awoko Defector's Mark",
		content: `# DEFECTOR MARK

A copper mask split down the mouth.

Anyone wearing this inside the Sanctum is marked for capture, not immediate execution.

The Hollow Mother wants defectors to sing apology before they die.`,
	},
	{
		title: "Unseated Law Consent Form",
		content: `# CONSENT FORM

State the desired effect.

State the acceptable cost.

State whether the cost may be collected later.

Silence will be interpreted as consent to delayed collection.`,
	},
	{
		title: "Unseated Law Bargain Record",
		content: `# BARGAIN RECORD

The offer worked.

That is the problem.

Effect granted:

Precedent established:

Visible consequence:

Ending consequence:`,
	},
	{
		title: "Predator Woods Trail Sign",
		content: `# TRAIL SIGN

Three cuts in black bark: pack road.

Four cuts: breeding ground.

Five cuts: turn back.

Six cuts: you are already being tested.`,
	},
	{
		title: "White Heron Seal Notes",
		content: `# WHITE HERON SEAL

The Anchor does not need to die for the Rift to close.

Requirements:

- Anchor made vulnerable.
- One Anchor Relic inverted.
- A willing Ascendant to bear the seal backlash.
- A declared law stronger than the Regent's claim.

Failure feeds the Citadel.`,
	},
	{
		title: "Dinner Invitation from the Regent",
		content: `# INVITATION

Honored Ascendants,

You have crossed my road with admirable persistence.

Come to the Citadel under guest law. Bring your weapons if they comfort you. Bring questions if they sharpen you. Bring manners if you wish to leave with both.

- The Regent`,
	},
	{
		title: "Court Patrol Pass",
		content: `# COURT PASS

The bearers may cross one patrol boundary without bloodshed.

Invalid if copied, burned, mocked, blessed, folded into a weapon, or presented without eye contact.`,
	},
	{
		title: "Citadel Approach Sketch",
		content: `# CITADEL APPROACHES

Road of Final Writs: formal, watched, survivable.

Bastion Tunnel: mapped, collapsed, full of old orders.

Awoko Breach: hidden, grief-choked, unstable.

Obsidian Spire Route: high, reflective, costly.

Forbidden Descent: immediate, never free.`,
	},
	{
		title: "Regent Law Fragment",
		content: `# LAW FRAGMENT

No guest may be harmed before bread is broken.

No tribute may refuse its own naming as tribute.

No road may deny its lord.

No beast may hunt the crowned hand.

No oath may die before its bearer.`,
	},
	{
		title: "Rift Break Warning",
		content: `# RIFT BREAK WARNING

Containment thinning.

Domain weather detected at threshold.

Anomaly migration probable.

Anchor law crossing material boundary.

Clear state required immediately.`,
	},
	{
		title: "Ending Ledger",
		content: `# ENDING LEDGER

Anchor state:

Survivors extracted:

Settlements saved:

Settlements lost:

Unseated Law consequences:

Bureau public report:

Truth known to the party:`,
	},
	{
		title: "Warden Quick Reference",
		content: `# QUICK REFERENCE

Show the Citadel every session.

Every safe place has a cost.

Every Relic has a desire.

Every bargain leaves its mark.

The Regent is not waiting at the end. He is watching from the beginning.`,
	},
];

export const sandboxHandoutsExpanded: SandboxHandout[] = rawSandboxHandouts.map(
	(handout) => ({
		...handout,
		visibleToPlayers: !handout.title.startsWith("Warden"),
		category: handout.title.startsWith("Warden") ? "lore" : "handout",
	}),
);
