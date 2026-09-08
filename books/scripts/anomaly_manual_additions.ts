function anomalyManualBeginning() {
	return proseBlock(`
### The Nature of the Enemy
Anomalies are not animals. They do not possess a traditional biological imperative—they do not need to eat to survive, they do not reproduce, and they do not sleep. They are manifestations of raw, chaotic Essence given form by the metaphysical pressure of the Rift. 

When an Anomaly crosses into our world, it is actively resisting Earth's physics. Their physical forms often glitch, shudder, or warp reality around them. Their singular, unified drive is to expand the Rift that birthed them, terraforming Earth's atmosphere into an environment saturated with lethal levels of Essence.
	`);
}

function anomalyRankBandTable() {
	return proseBlock(`
### Rank Scaling Guide
The following table provides baseline statistics for Anomalies across the Rank spectrum. Wardens can use these numbers to quickly generate custom threats.

| Rank | Target Player Level | Base AC | Avg HP | Damage Output / Turn |
|:---:|:---:|:---:|:---:|:---:|
| **F/E** | 1–3 | 12 | 25 | 1d6 + 2 (5) |
| **D** | 4–6 | 14 | 60 | 2d6 + 4 (11) |
| **C** | 7–10 | 16 | 120 | 3d8 + 5 (18) |
| **B** | 11–14 | 18 | 200 | 4d10 + 6 (28) |
| **A** | 15–18 | 20 | 350 | 6d12 + 8 (47) |
| **S** | 19–20 | 22+ | 500+ | 8d12 + 10 (62+) |
	`);
}

function anomalyVariantTemplates() {
	return proseBlock(`
### Variant Templates
To keep encounters unpredictable, a Warden can apply the following quick-templates to any base Anomaly.

#### 1. Elite (The Apex)
* **Mechanics:** Double maximum HP. Add +2 to AC and Attack Rolls. The Anomaly gains one additional action per turn.
* **Lore:** This Anomaly has successfully consumed the Essence of an Ascendant, causing a rapid, violent evolution.

#### 2. Corrupted (The Rotting)
* **Mechanics:** Reduce movement speed by 10 ft. All melee attacks deal an additional 1d6 necrotic damage. Upon death, the Anomaly violently detonates in a 15-foot radius (DC 14 Dexterity save or take 3d6 necrotic damage).
* **Lore:** The Anomaly's internal Essence core has destabilized. It is dying, but highly volatile.

#### 3. Rift-Touched (The Phasing)
* **Mechanics:** The Anomaly gains a teleport speed of 30 feet. Ranged attacks against it have disadvantage.
* **Lore:** The Anomaly exists partially within the Rift and partially in the material world, glitching in and out of reality.
	`);
}

function noncombatAnomalies() {
	return proseBlock(`
### Non-Combat Anomalies
Not every Anomaly is a combat threat. The Rift frequently produces entities that are bizarre, unsettling, but ultimately pacifistic.

#### The Echo
A humanoid figure made of static and ash. It wanders aimlessly through ruined quarantine zones. If approached, it does not attack, but simply repeats the final, desperate words of the last person who died within 100 feet of it.

#### The Architect
A massive, multi-limbed construct of floating geometric shapes. It ignores humans entirely. Its sole purpose is to build impossible, M.C. Escher-style structures out of local materials (cars, asphalt, rebar) to expand the metaphysical footprint of a Domain. 

#### The Observer
A floating, crystalline eye the size of a minivan. It appears in the sky above major Guild conflicts or S-Rank events. It records the carnage, vibrating softly, and simply folds itself out of reality if any Ascendant attempts to attack it.
	`);
}

function anomalyHarvestingGuide() {
	return proseBlock(`
### Harvesting Essence
When an Anomaly is killed, its physical form begins to rapidly sublimate back into raw energy. Ascendants have a brief window to harvest its crystallized Essence core.

#### The Procedure
* **Time:** 1 minute of uninterrupted work.
* **Tools:** A Bureau-certified Harvesting Kit (hazmat gauntlets, core-stabilizers, extraction forceps).
* **The Check:** The harvester makes a DC 15 Intelligence (Medicine or Survival) check. 

#### Outcomes
* **Success:** The core is safely extracted and placed into a stabilization flask. It can be sold or used for crafting.
* **Failure:** The core degrades before extraction, sublimating into useless ash.
* **Critical Failure:** The harvester punctures the core's containment shell. The core triggers an *Essence Detonation*, dealing force damage equal to the Anomaly's average damage output to everyone within 10 feet, and the core is destroyed.
	`);
}
