function vaultsGearDepthGuide() {
	return proseBlock(`
### Gear Rarity and Legality
In the Rift Age, gear rarity is not just a measure of drop chance—it represents Bureau legal classification. 
* **Common:** Unrestricted. Can be purchased at any sporting goods or surplus store.
* **Uncommon:** Restricted. Requires a Class-C Ascendant License to purchase legally. Includes basic Essence-reinforced armor and weaponry.
* **Rare:** Heavily Restricted. Requires a Class-B License and Guild sponsorship. Includes military-grade anomalous tech.
* **Epic / Legendary:** Illegal for civilian or independent ownership. Classified as Bureau property or high-threat Relics. Possession without a Class-A / Directorate Zero exemption carries a mandatory quarantine sentence.

### The Black Market
Ascendants operating without Bureau licenses must rely on the black market to acquire Uncommon or Rare gear. Prices on the black market are typically 200–300% higher than the Bureau-subsidized Guild rates, and the equipment often comes with compromised durability or tracking enchantments meant for previous owners.

### Attunement and Essence Saturation
An Ascendant can safely attune to a maximum of three Essence-bearing items (Relics, advanced armor, specific weapons). Attempting to attune to a fourth item causes *Essence Saturation*. The Ascendant takes severe psychic damage, and all currently attuned items forcefully break attunement, often damaging the items in the process.

### Destruction in the Rift
When a character dies inside a Rift, or if an item is left behind when a Rift collapses, the gear is subjected to extreme metaphysical pressure. Non-anomalous gear is instantly annihilated. Anomalous gear (Uncommon and above) has a 50% chance to survive but will be violently ejected into the material world when the Rift closes, often miles away from the original entry point.
	`);
}

function vaultsRelicCampaignNotes() {
	return proseBlock(`
### Introducing Relics to the Campaign
Relics are not mere treasure; they are plot devices. A Relic should never be found sitting quietly in a chest. They are the focal points of conflict, the goals of Guild contracts, or the dangerous burdens thrust upon the players. Below are campaign integration notes for notable Relics.

#### The Aegis of the First Warden (Legendary Shield)
* **History:** Wielded by the founder of the Bureau during the Tokyo S-Rank Event. Lost when they were swallowed by a Domain.
* **Known Owners:** Currently missing. Rumored to be held by a rogue faction of the AFA.
* **Bureau Status:** Code Red retrieval. The Bureau will execute any independent Ascendant found possessing it.
* **Introduction:** The players are hired to raid an AFA safehouse. They expect to find stolen Essence reserves, but instead find the Aegis hooked up to a massive jury-rigged generator, keeping a localized Rift from expanding.

#### The Whisper Blade (Rare Dagger)
* **History:** Forged from the crystallized vocal cords of a Rank-B telepathic Anomaly.
* **Known Owners:** A notorious Guild assassin known only as "Vex" (Quicksilver).
* **Bureau Status:** Unregistered.
* **Introduction:** The players find the dagger embedded in the chest of a Bureau informant. Pulling it out triggers a telepathic recording of the assassin's final conversation with the victim, pointing the players toward a larger conspiracy.

#### The Chronos Engine (Artifact)
* **History:** A mechanized heart recovered from a Rank-A temporal Anomaly. It allows localized time reversal but ages the user aggressively.
* **Known Owners:** Kept in Directorate Zero's deepest vault.
* **Bureau Status:** Classified Level 1.
* **Introduction:** The players are caught in a temporal loop during a botched Rift clear. They realize a desperate Bureau agent used a shard of the Chronos Engine to try and save their squad, and the players must find the agent to break the loop.
	`);
}

function vaultsLootGeneration() {
	return proseBlock(`
### Reward Parcels by Rank
Unlike traditional dungeon crawls, Ascendants are paid via Guild contracts and salvage rights. The Warden should use the following guidelines to generate reward parcels for clearing a Rift or completing a major operation.

#### Rank-D Operations
* **Payout:** 1,000 to 2,500 Credits per Ascendant.
* **Salvage:** 1d4 Common items, 10% chance of a single Uncommon item.
* **Intangibles:** Minor favor with a local Guild branch or a low-level Bureau contact.

#### Rank-C Operations
* **Payout:** 5,000 to 10,000 Credits per Ascendant.
* **Salvage:** 2d4 Common items, 1d4 Uncommon items, 25% chance of a single Rare item.
* **Intangibles:** A piece of actionable intelligence on a rival faction, or a Class-C License fast-track.

#### Rank-B Operations
* **Payout:** 25,000 to 50,000 Credits per Ascendant.
* **Salvage:** 1d4 Uncommon items, 1d2 Rare items, 10% chance of a single Epic item or minor Relic.
* **Intangibles:** A major favor from a Guild CEO, or access to restricted Bureau archives.

#### Rank-A Operations
* **Payout:** 100,000+ Credits per Ascendant (often paid in corporate stock or real estate).
* **Salvage:** 1d4 Rare items, 1d2 Epic items, 50% chance of a Legendary item or major Relic.
* **Intangibles:** Directorate Zero attention, a seat on a Guild board, or an audience with an Eternal.

### Substituting Salvage
Not all rewards must be physical. Wardens are encouraged to substitute rolled salvage for intangible rewards of equivalent value. For example, instead of a Rare item, the players might receive the security codes to a rival Guild's Essence refinery, or a pardon for a previous crime from a Bureau Director.
	`);
}
