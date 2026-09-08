function awakenedArtsInscriptionGuide() {
	return proseBlock(`
### The Art of Inscription
Inscribing Sigils onto gear and tattooing the skin with anomalous ink are two of the oldest forms of human interaction with Essence, predating even the formal establishment of the Bureau. While anyone with the right materials and knowledge can attempt an inscription, only a trained Inscriber (typically a Guild specialist or a licensed Arcanist) can guarantee it won't violently reject the target surface.

### The Inscription Procedure
Inscribing a Sigil or Tattoo requires three things:
1. **Time:** 1 hour per rank of the inscription. 
2. **Materials:** Specific anomalous reagents. A Sigil requires etching acid distilled from Anomaly blood. A Tattoo requires anomalous ink derived from Essence-rich flora or fauna.
3. **The Check:** The Inscriber makes an Intelligence check using their Inscription tools. The DC is 10 + (2 x Rank of the Inscription). On a failure, the materials are ruined. On a critical failure, the target item is destroyed or the target creature takes unmitigable force damage.

### The Body Slot System
Tattoos are limited by the physical surface area and metaphysical tolerance of the human body. An Ascendant has the following slots available for Tattoos:
- **Head/Face:** 1 slot
- **Arms/Hands:** 2 slots (one per arm)
- **Torso (Front/Back):** 2 slots
- **Legs/Feet:** 2 slots (one per leg)

### Overfilling and Removal
Attempting to place a Tattoo in an already occupied slot triggers *Essence Rejection*. The new Tattoo immediately burns away, dealing severe necrotic damage to the host and permanently destroying the ink. 

To safely remove a Tattoo, an Inscriber must perform a grueling surgical procedure using a specialized counter-agent. This process takes 4 hours, destroys the Tattoo permanently, and leaves the host exhausted for 24 hours.

### Legal Status
Visible anomalous tattoos are highly regulated. The Bureau requires all Tattoos above Rank-D to be registered. Unregistered combat-grade Tattoos spotted on civilians or unlicensed Ascendants are grounds for immediate detention. In many quarantine zones, visible Tattoos are treated as gang affiliations, drawing the ire of both law enforcement and rival syndicates.
	`);
}

function awakenedArtsBuildCombos() {
	return proseBlock(`
### Synergy and Interaction
Ascendant abilities are designed to interact. When a player layers a Technique with a Power, or a Spell with a specific Sigil, the result is often greater than the sum of its parts. Below are notable, canonical ability combinations.

#### The "Thunder-Breach" (Technique + Power)
* **Components:** *Breach Step* (Stalker Technique) + *Thunderous Smite* (Paladin Power)
* **Mechanism:** The Ascendant activates *Thunderous Smite* just before using *Breach Step*. The teleportation bypasses the target's frontline defense, and the impact of the materialization triggers the smite's explosive force directly into the target's rear guard.
* **Tradeoff:** Extremely high resource cost for a single turn, leaving the Ascendant stranded behind enemy lines if the target survives.

#### The "Bleeding Ward" (Spell + Sigil)
* **Components:** *Vampiric Touch* (Spell) + *Sigil of the Blood-Bound*
* **Mechanism:** The Sigil stores excess healing as a temporary shield. When the Ascendant casts *Vampiric Touch*, every strike not only restores their health but continually regenerates the Sigil's warding barrier.
* **Tradeoff:** Requires the Ascendant to remain in prolonged melee combat while concentrating on a spell, risking immediate barrier collapse if concentration is broken.

#### The "Feedback Loop" (Rune Cross-Access)
* **Components:** *Rune of the Tempest* (Native) + *Rune of the Anchor* (Cross-Access)
* **Mechanism:** *Tempest* grants lightning-fast mobility but prevents the user from remaining stationary. *Anchor* roots the user in place to absorb kinetic damage. When activated simultaneously, the conflicting directives create a localized kinetic feedback loop, causing the Ascendant to vibrate with destructive energy that damages anything they grapple.
* **Tradeoff:** Deals continuous force damage to the Ascendant as long as both Runes are active. Requires Warden approval due to severe physiological strain.
	`);
}
