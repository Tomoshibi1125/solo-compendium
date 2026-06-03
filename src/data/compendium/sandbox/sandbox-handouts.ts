import type { SandboxHandout } from "../ascendant-sandbox-module";

/**
 * SANDBOX HANDOUTS - The Shadow of the Regent
 */

const rawSandboxHandouts = [
	{
		title: "Emergency Writ: S-Rank Gate Entry",
		content: `# EMERGENCY WRIT

You are cleared for entry into the Gloamreach Gate Domain under crisis authority.

Return conditions: Anchor broken, Anchor sealed, Anchor transformed, or Red Phase evacuation.

The Bureau accepts no liability for Domain law, Anomaly exposure, Essence contamination, Relic corruption, or failed extraction after threshold closure.`,
	},
	{
		title: "AFA Alert: Gate Domain Scale",
		content: `# AFA ALERT

Rift threshold stabilized.

Interior mapping exceeds standard bounded Gate parameters.

Domain estimate: country-scale interior realm.

Anchor classification: sovereign intelligence.

Recommendation: do not enter without S-Rank command approval.

Override: emergency writ accepted.`,
	},
	{
		title: "Anchor Scan Sheet",
		content: `# ANCHOR SCAN

Relic One:

Relic Two:

Relic Three:

Strongest Ally:

Forbidden Bargain:

Final Vulnerability:

Citadel Chamber:

The scan output is unstable. Re-run attempts may alert the Anchor.`,
	},
	{
		title: "Map Fragment: Gallows Road",
		content: `# GALLOWS ROAD FRAGMENT

The road bends toward the Citadel no matter how it is drawn.

Marked stops: Rift Threshold, Thornwake, Vermillion Camp, Forward Bastion, Essence Mill, Glassvine Works.

Unmarked warning written in red pencil: "If the blue flame appears, answer politely."`,
	},
	{
		title: "Thornwake Tribute Notice",
		content: `# NOTICE OF TRIBUTE

By grace of the Regent, Thornwake remains sheltered under lawful weather and bounded hunger.

Tribute is due by the second bell after dusk.

Acceptable forms: Essence, labor, living service, Relic metal, or sworn betrayal.

Failure voids shelter.`,
	},
	{
		title: "Vermillion Camp Price Board",
		content: `# VERMILLION CAMP PRICE BOARD

Soup: 1 clean core shaving.

Surgery: 3 clean Essence ampoules or future salvage share.

AFA battery: market rate plus oath.

Relic appraisal: free if we keep first refusal.

Rescue party: negotiable. Not cheap. Never free.`,
	},
	{
		title: "Bureau Bastion Last Order",
		content: `# LAST ORDER

All teams will hold assigned corridors until command updates the retreat route.

Do not abandon sealed supply rooms.

Do not negotiate with Domain natives.

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
		title: "Mill Work Token",
		content: `# MILL TOKEN

Bearer is permitted through the outer wheelhouse for one shift.

No weapons beyond the red line.

No questions in the rendering room.

No refunds for partial processing.`,
	},
	{
		title: "Glassvine Harvest Instructions",
		content: `# GLASSVINE HARVEST

Cut only white-veined stems.

Do not bleed near open flowers.

If fruit speaks, destroy it.

If fruit cries, leave the row immediately.

If the greenhouse turns toward you, kneel until it loses interest.`,
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
		title: "Hollow Choir Hymn",
		content: `# HYMN OF ORDER

The road is cruel because roads must choose.

The bell is kind because bells must answer.

The crown is heavy because someone must carry law.

Give tribute and be held.`,
	},
	{
		title: "Choir Defector's Mark",
		content: `# DEFECTOR MARK

A copper mask split down the mouth.

Anyone wearing this inside the Warrens is marked for capture, not immediate execution.

The Choir wants defectors to sing apology before they die.`,
	},
	{
		title: "Black Vault Consent Form",
		content: `# CONSENT FORM

State the desired effect.

State the acceptable cost.

State whether the cost may be collected later.

Silence will be interpreted as consent to delayed collection.`,
	},
	{
		title: "Subject Zero Bargain Record",
		content: `# BARGAIN RECORD

The offer worked.

That is the problem.

Effect granted:

Pressure marked:

Visible consequence:

Ending consequence:`,
	},
	{
		title: "Beast Crown Trail Sign",
		content: `# TRAIL SIGN

Three cuts in black bark: pack road.

Four cuts: breeding ground.

Five cuts: turn back.

Six cuts: you are already being tested.`,
	},
	{
		title: "White Heron Seal Notes",
		content: `# WHITE HERON SEAL

The Anchor does not need to die for the Gate to close.

Requirements:

- Anchor made vulnerable.
- One Anchor Relic inverted.
- A willing Ascendant to bear the seal backlash.
- A declared law stronger than the Regent's claim.

Failure feeds the Citadel.`,
	},
	{
		title: "Dinner Invitation",
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

Gallows Road: formal, watched, survivable.

Beast Road: fast, hungry, not made for people.

Glassvine Climb: living, useful, jealous.

Bastion Tunnel: mapped, collapsed, full of old orders.

Black Vault Door: immediate, never free.`,
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
		title: "Red Phase Warning",
		content: `# RED PHASE WARNING

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

Subject Zero consequences:

Bureau public report:

Truth known to the party:`,
	},
	{
		title: "Warden Quick Reference",
		content: `# QUICK REFERENCE

Show the Citadel every session.

Make safety conditional.

Let bargains work.

Make Anomalies serve a Domain role.

Track Red Phase pressure.

Keep the Regent polite until violence matters.`,
	},
];

export const sandboxHandoutsExpanded: SandboxHandout[] = rawSandboxHandouts.map(
	(handout) => ({
		...handout,
		category: "gloamreach",
		visibleToPlayers: true,
	}),
);
