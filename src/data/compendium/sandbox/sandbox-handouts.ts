import type { SandboxHandout } from "../ascendant-sandbox-module";

/**
 * SANDBOX HANDOUTS - Run Silent
 */

const rawSandboxHandouts = [
	{
		title: "Emergency Clearance: S-Rank Rift Entry",
		content: `# EMERGENCY CLEARANCE

You are cleared for entry into the Gloamreach Rift Interior under crisis authority.

Return conditions: hostile neutralized, threshold re-secured, or emergency evacuation. (The interior may permit none of these.)

The Bureau accepts no liability for Anomaly exposure, Essence contamination, Relic corruption, psychological casualty, or failed extraction after threshold closure.`,
	},
	{
		title: "AFA Alert: Rift Interior Scale",
		content: `# AFA ALERT

Rift threshold stabilized.

Interior mapping exceeds standard bounded Rift parameters.

Interior estimate: country-scale realm, old and inhabited.

Apex classification: a single intelligence that owns the dark; uncleared, likely unclearable.

Recommendation: do not enter without S-Rank command approval.

Override: emergency entry authorized.`,
	},
	{
		title: "Native Survival Card",
		content: `# WHAT THE NATIVES TELL YOU

Stay quiet. Stay dark. Never use the power if you can help it.

Do not answer a voice you know after dark.

Do not speak your true name where the walls can hear.

Be behind a wardline before the grey light fails.

If it offers you something, it has already decided to take you.`,
	},
	{
		title: "Map Fragment: The Old Roads",
		content: `# OLD ROADS FRAGMENT

The roads are the fast way and the exposed way. Walk them by grey light, in silence, never alone.

Marked safe-holds: Rift Threshold, Warded Hamlet, Vermillion Outpost, Drowned Ledgerfen, Remembering Orchard, Bastion Golemfall, Obsidian Spire.

Warning written in red pencil: "If you hear your name from off the road, do not answer. Do not even look."`,
	},
	{
		title: "Warded Hamlet House Rules",
		content: `# HOUSE RULES

This community keeps the dark out by keeping these rules. Guests keep them too, or leave before dusk.

Bar every door at the second bell after dusk.

Burn no open light the dark can see. Use no Essence within the wards.

Speak no sleeper's name aloud after dark.

Break a rule and the wards will not protect you — and may not protect the rest of us either.`,
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

Do not answer anything that wears a face you know.

Do not deviate from Rank doctrine.

Addendum, unsent: there is no retreat route.`,
	},
	{
		title: "Bureau Casualty Tag",
		content: `# CASUALTY TAG

Name: unreadable due to ash damage.

Rank: C provisional.

Cause: taken, then recovered by chance.

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
		title: "Awoko Becoming Hymn",
		content: `# HYMN OF BECOMING

The prey runs because prey must run.

The hunter waits because hunters can.

Why stay the hunted, the Mother asks, when the dark has shown the way?

Give grief and be spared.

Give blood and be remade.

Give all, and become.`,
	},
	{
		title: "Awoko Defector's Mark",
		content: `# DEFECTOR MARK

A copper mask split down the mouth.

Anyone wearing this inside the Sanctum is marked for capture, not immediate execution.

The Hollow Mother wants defectors to sing apology before they die.`,
	},
	{
		title: "The Old Power — Consent Form",
		content: `# CONSENT FORM

State the desired effect.

State the acceptable cost.

State whether the cost may be collected later.

Silence will be interpreted as consent to delayed collection.`,
	},
	{
		title: "The Old Power — Bargain Record",
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

The Quiet does not need to die for the way out to open — but it must be held.

Requirements:

- The Quiet forced into a silence and dark it cannot slip.
- The Means assembled: a truth, a way to hold it, a way to make it stay.
- A willing Ascendant to bear the backlash at the Threshold.
- A native ward-circle, built once, that the dark cannot cross.

Failure feeds the dark, and the door stays shut.`,
	},
	{
		title: "A Note in a Familiar Hand",
		content: `# A NOTE, IN A HAND YOU KNOW

I have been waiting for you. It has been so long.

The way is just a little further in. Come and rest — you are so tired, and I have kept everything exactly the way you remember it.

Bring the others. But come.

(There is no signature. There does not need to be. You know the handwriting.)`,
	},
	{
		title: "Safe-Passage Token",
		content: `# SAFE-PASSAGE TOKEN

A native ward-token. The bearers may pass one community's wardline once, in peace, by its keepers' leave.

Invalid if copied, burned, mocked, bloodied, folded into a weapon, or shown without the keeper's name.`,
	},
	{
		title: "The Final Crossing — Routes",
		content: `# THE FINAL CROSSING — ROUTES

The Last Road: open, watched by the worn dead, survivable if silent.

Bastion Tunnel: mapped, collapsed, full of old oaths.

Awoko Breach: hidden, grief-choked, unstable.

Obsidian Spire Route: high, reflective, costly.

The Old Power Below: immediate, never free.`,
	},
	{
		title: "The Old Wards Fragment",
		content: `# THE OLD WARDS (a native fragment)

What is loud is found. What is bright is found. What is strong is loudest of all.

A name spoken is a name given.

A door left open after dark is an invitation, whether you meant it or not.

The dead do not knock. They are simply, suddenly, inside.

A ward kept is a life kept. A ward broken is everyone's.`,
	},
	{
		title: "Rift Break Warning",
		content: `# RIFT BREAK WARNING

Containment thinning.

Interior conditions detected at the threshold.

Anomaly migration probable.

Something inside is pressing on the boundary from the dark side.

Clear state required immediately.`,
	},
	{
		title: "Ending Ledger",
		content: `# ENDING LEDGER

The Quiet's fate (escaped / killed / a new hunter rose):

Survivors extracted:

Communities saved:

Communities lost:

What the Old Power Below was owed:

Bureau public report:

Truth known to the party:`,
	},
	{
		title: "Warden Quick Reference",
		content: `# QUICK REFERENCE

Fill the Hunt Clock, visibly, every time they live loud.

Every safe place has a cost and a rule.

Every Relic has a desire.

Every bargain leaves its mark.

The Quiet is not waiting at the end. It has been listening since the door closed.`,
	},
];

export const sandboxHandoutsExpanded: SandboxHandout[] = rawSandboxHandouts.map(
	(handout) => ({
		...handout,
		visibleToPlayers: !handout.title.startsWith("Warden"),
		category: handout.title.startsWith("Warden") ? "lore" : "handout",
	}),
);
