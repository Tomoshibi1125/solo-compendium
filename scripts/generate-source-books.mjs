import fs from "node:fs";
import path from "node:path";

const basePath = path.join(process.cwd(), "src/components/compendium");

const books = {
	"players-book": {
		dir: "players-book",
		chapters: [
			{
				name: "Introduction.tsx",
				title: "Introduction to the System",
				content: `
import React from 'react';

export const Introduction = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-amethyst tracking-tight uppercase border-b border-amethyst/20 pb-4 mb-8">
          Welcome to the Awakening
        </h1>
        
        <p className="text-lg">
          The world as humanity knew it ended the day the first Gate tore the sky open. From these swirling, ethereal rifts poured nightmares—entities we now classify as <strong>Anomalies</strong>. Conventional weapons were useless. Militaries collapsed. In our darkest hour, the <strong>System</strong> descended, selecting a fraction of humanity to undergo the Awakening. These chosen few became <strong>Ascendants</strong>.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">The Role of an Ascendant</h2>
        <p>
          As an Ascendant, you are a beacon of hope in a shattered modern world. Whether you operate in the neon-lit ruins of Tokyo, the fortified bastions of New York, or the wild, untamed territories reclaimed by the Anomaly threat, you wield power that defies the laws of physics. The System grants you abilities, tracks your progression, and guides your combat potential.
        </p>

        <h3 className="text-xl font-bold text-amethyst mt-6">How to Use This Protocol</h3>
        <p>
          The <em>Ascendant's Hand-Terminal</em> is your definitive guide to surviving and thriving in this new reality. Within these files, you will find:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-cyan/90">
          <li><strong>Step-by-Step Ascendant Creation:</strong> Define your origins, your Awakening event, and your starting capabilities.</li>
          <li><strong>The Paths:</strong> Choose your combat archetype, from the destructive Sovereign to the inventive Engineer.</li>
          <li><strong>Rules of the System:</strong> Master the mechanics of delving into Gates, engaging Anomalies, and navigating the political landscape of Ascendant Guilds.</li>
          <li><strong>System Protocols & Spells:</strong> Understand the magical framework dictated by the System.</li>
        </ul>

        <div className="bg-cyan/5 border-l-4 border-cyan p-4 mt-8 rounded-r-lg">
          <h4 className="font-bold text-cyan mb-2">The Golden Rule</h4>
          <p className="text-sm">
            The Protocol Warden (PW) guides the narrative and manages the world around you. While the System provides the rules, the Protocol Warden determines how the city breathes, how the Anomalies strike, and the ultimate consequences of your actions. Respect the PW's directive.
          </p>
        </div>
      </div>
    </div>
  );
};
`,
			},
			{
				name: "StepByStep.tsx",
				title: "Step-by-Step Ascendant",
				content: `
import React from 'react';

export const StepByStep = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-amethyst tracking-tight uppercase border-b border-amethyst/20 pb-4 mb-8">
          Step-by-Step Ascendant
        </h1>
        
        <p className="text-lg">
          Your Awakening is unique. Perhaps you survived a horrific Gate break, or the System chose you while you were sitting at a desk. Regardless of your past, you must now define the parameters of your newly forged Ascendant identity.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">1. Choose an Ancestry & Origin</h2>
        <p>
          What did you do before the Awakening? Were you a soldier, a student, or a criminal? Your background provides starting proficiencies, equipment, and a unique roleplaying hook. The System builds upon the foundation of your previous life.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">2. Select Your Path</h2>
        <p>
          The Path represents your combat classification. Are you a Vanguard, soaking up Anomaly strikes to protect your team? A Phantom, attacking from the shadows? Or an Engineer, crafting devastating technological relics to turn the tide? Your Path determines your Hit Points, saving throws, and primary abilities.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">3. Determine System Attributes</h2>
        <p>
          The System tracks six primary Attributes: Strength, Dexterity, Constitution, Intelligence, Wisdom, and Charisma. You will allocate your starting stats based on your Protocol Warden's chosen method (Standard Array, Point Buy, or Rolling). These numbers dictate everything from your lifting capacity to your ability to resist psychic Anomaly attacks.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">4. Describe Your Ascendant</h2>
        <p>
          Give your character a name, physical description, and psychological profile. How do they handle the trauma of the Gates? Do they fight for a Guild, for humanity, or for their own survival? Consider the manifestation of their powers—does their Aether glow azure blue, or crackle with crimson energy?
        </p>
        
        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">5. Equip Your Arsenal</h2>
        <p>
          Determine your starting equipment. Most Ascendants start with basic Guild-issued gear and a handful of mundane items. As you clear Gates, you will acquire immensely powerful Relics and System-generated weaponry.
        </p>
      </div>
    </div>
  );
};
`,
			},
			{
				name: "CombatRules.tsx",
				title: "Rules of the System",
				content: `
import React from 'react';

export const CombatRules = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-amethyst tracking-tight uppercase border-b border-amethyst/20 pb-4 mb-8">
          Rules of the System
        </h1>
        
        <p className="text-lg">
          The System operates on rigid, unyielding logic. Understanding the mechanics of combat, movement, and interaction is the difference between clearing a Gate and becoming another casualty.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">The Action Economy</h2>
        <p>
          During a combat encounter, time slows down to discrete six-second intervals known as Rounds. On your turn, you can take a variety of actions.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Action:</strong> Strike an Anomaly, channel a Protocol, or sprint.</li>
          <li><strong>Bonus Action:</strong> Execute rapid secondary abilities or swift attacks.</li>
          <li><strong>Reaction:</strong> Respond instantly to a trigger, such as dodging a blow or intercepting a strike.</li>
          <li><strong>Movement:</strong> Traverse the battlefield equal to your Speed.</li>
        </ul>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">Making an Attack</h2>
        <p>
          Whether swinging a heavily augmented greatsword or firing an Aether-infused rifle, attacks rely on two primary components: the Attack Roll and the Damage Roll.
        </p>
        <div className="bg-void border border-cyan/30 p-4 rounded-lg my-4">
          <code className="text-amethyst font-mono text-sm block mb-2">System Calculation: Attack Roll</code>
          <p className="font-mono text-xs text-slate-400">d20 + Attribute Modifier + Proficiency Bonus</p>
        </div>
        <p>
          If your total exceeds the target's Armor Class (AC), the strike connects. You then roll the weapon or Protocol's specified damage dice, adding the relevant Attribute modifier to the total.
        </p>

        <h2 className="text-2xl font-bold text-cyan mt-8 mb-4">Aether and Protocols</h2>
        <p>
          Many paths rely on Aether—the fundamental energy introduced by the System. Channeling Aether allows you to execute precise supernatural abilities, known as Protocols. Managing your Aether reserves is critical during extended Gate dives.
        </p>
      </div>
    </div>
  );
};
`,
			},
		],
	},
	"wardens-directive": {
		dir: "wardens-directive",
		chapters: [
			{
				name: "TheMaster.tsx",
				title: "The Master of the System",
				content: `
import React from 'react';

export const TheMaster = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-cyan tracking-tight uppercase border-b border-cyan/20 pb-4 mb-8">
          The Protocol Warden
        </h1>
        
        <p className="text-lg">
          As the Protocol Warden, you are the architect of the urban fantasy reality. You control the System interfaces, generate the Gates, pilot the Anomalies, and weave the intricate political web of the Ascendant Guilds. You are the referee, the storyteller, and the ultimate authority.
        </p>

        <h2 className="text-2xl font-bold text-amethyst mt-8 mb-4">Running the Game</h2>
        <p>
          Running a campaign in the System Ascendant setting requires balancing the mundane realities of a modern world with the cataclysmic scale of the Gates. Characters might spend the morning navigating rush hour traffic in London, and the afternoon fighting a multi-headed leviathan in a submerged pocket dimension.
        </p>

        <h3 className="text-xl font-bold text-cyan mt-6">The Core Loop</h3>
        <ul className="list-decimal pl-6 space-y-2 mt-4">
          <li><strong>The Warden describes the environment:</strong> "The Guild Hall's neon signs flicker as an emergency siren wails. A B-Rank Gate has materialized in the financial district."</li>
          <li><strong>The players declare what they want to do:</strong> "I rev up my motorcycle and check my Aether reserves. Let's move!"</li>
          <li><strong>The Warden narrates the results:</strong> The Warden determines if actions require rolls, calls for ability checks, and narrates the chaotic arrival at the Gate.</li>
        </ul>

        <h2 className="text-2xl font-bold text-amethyst mt-8 mb-4">The Rule of Cool vs. System Integrity</h2>
        <p>
          While the System has rigid rules, the "Rule of Cool" should prevail when an Ascendant attempts something spectacularly cinematic. Reward creativity while ensuring the threat of the Anomalies remains lethal. The tension in a Gate dive comes from the very real possibility of a squad wipe.
        </p>
      </div>
    </div>
  );
};
`,
			},
			{
				name: "GatesAndEncounters.tsx",
				title: "Creating Encounters & Gates",
				content: `
import React from 'react';

export const GatesAndEncounters = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-cyan tracking-tight uppercase border-b border-cyan/20 pb-4 mb-8">
          Creating Encounters & Gates
        </h1>
        
        <p className="text-lg">
          Gates are the primary source of conflict, wealth, and danger. A Gate is a spatial tear leading to an enclosed pocket dimension. Inside, the environment is radically different from the urban world outside—ranging from toxic swamps to frozen ancient cities.
        </p>

        <h2 className="text-2xl font-bold text-amethyst mt-8 mb-4">Gate Classification</h2>
        <p>
          Gates are ranked by the System according to the Aetheric density within. The rank indicates the threat level and the quality of Relics found inside.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>E and D-Rank:</strong> Weak Anomalies. Often cleared by low-level strike teams or rookie Ascendants.</li>
          <li><strong>C and B-Rank:</strong> Significant threats. Require coordinated Guild teams, tanks, and healers.</li>
          <li><strong>A-Rank:</strong> National emergencies. Anomalies capable of wiping out armored battalions. Require elite strike forces.</li>
          <li><strong>S-Rank:</strong> Cataclysmic events. If an S-Rank Gate breaks, it can destroy an entire country. Only the world's most powerful Ascendants can step inside.</li>
        </p>

        <h2 className="text-2xl font-bold text-amethyst mt-8 mb-4">Building a Gate Encounter</h2>
        <p>
          When designing a Gate, consider the ecology. A "Red Gate" might isolate the team in an arctic wasteland, preventing escape until the Boss Anomaly is slain. 
        </p>
        <p>
          Use the Anomaly Manifest to populate the Gate. Balance the encounters by calculating the Threat Level (TL) of the Anomalies against the average level of the Ascendant party. Include environmental hazards, traps born from the corrupted dimension, and a climactic Boss room.
        </p>

        <h3 className="text-xl font-bold text-cyan mt-6">Gate Breaks</h3>
        <p>
          If a Gate is not cleared within 7 days (168 hours), the barrier collapses in an event known as a "Gate Break." The Anomalies pour out into the city, resulting in mass casualties. The ticking clock of a Gate Break is a powerful narrative tool for the Protocol Warden.
        </p>
      </div>
    </div>
  );
};
`,
			},
		],
	},
	"anomaly-manifest": {
		dir: "anomaly-manifest",
		chapters: [
			{
				name: "ReadingAnomalies.tsx",
				title: "Reading an Anomaly Manifest",
				content: `
import React from 'react';

export const ReadingAnomalies = () => {
  return (
    <div className="space-y-6 text-slate-300 leading-relaxed font-body">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-4xl font-display font-bold text-red-500 tracking-tight uppercase border-b border-red-500/20 pb-4 mb-8">
          Reading the Manifest
        </h1>
        
        <p className="text-lg">
          Anomalies are the monstrous entities native to the Gates. They possess immense physical power, magical abilities, and an unyielding hatred for humanity. The Anomaly Manifest documents the known entities tracked by the System.
        </p>

        <h2 className="text-2xl font-bold text-red-400 mt-8 mb-4">The Stat Block</h2>
        <p>
          An Ascendant's survival depends on the Protocol Warden correctly adjudicating an Anomaly's capabilities. Every Anomaly has a Stat Block detailing its combat metrics.
        </p>

        <ul className="list-disc pl-6 space-y-4 mt-4">
          <li>
            <strong className="text-red-300">Size and Type:</strong> Ranks from Tiny (swarm units) to Gargantuan (S-Rank Bosses). Types include Beast, Undead, Construct, Elemental, and Fiend.
          </li>
          <li>
            <strong className="text-red-300">Armor Class (AC) and Hit Points (HP):</strong> How difficult the Anomaly is to hit, and how much damage it can sustain before dispersing into pure Aether.
          </li>
          <li>
            <strong className="text-red-300">Speed:</strong> Its movement profile across land, air, or water.
          </li>
          <li>
            <strong className="text-red-300">Attributes:</strong> The same six attributes Ascendants use: Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma.
          </li>
          <li>
            <strong className="text-red-300">Threat Level (TL):</strong> The numerical value indicating the danger of the Anomaly, used to calculate Encounter balance.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-red-400 mt-8 mb-4">Actions and Abilities</h2>
        <p>
          The core of an Anomaly's deadly nature lies in its Actions. 
        </p>
        <p>
          <strong>Passive Traits:</strong> Ongoing effects, such as a localized toxic aura or regeneration. <br/>
          <strong>Multiattack:</strong> High-ranking Anomalies can strike multiple times in a single blur of motion.<br/>
          <strong>Lethal Strikes:</strong> Attacks ranging from tearing claws to concentrated Aether beam breath weapons.<br/>
          <strong>Legendary Actions:</strong> Boss Anomalies operate outside the normal action economy, allowing them to react and strike at the end of an Ascendant's turn.
        </p>

        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mt-8 rounded-r-lg">
          <h4 className="font-bold text-red-400 mb-2">Aetheric Drop Rates</h4>
          <p className="text-sm">
            When an Anomaly is defeated, it drops Aether Cores—crystallized magic used as global currency and fuel. High-tier Bosses may also drop Relics, powerful equipment infused with their essence.
          </p>
        </div>
      </div>
    </div>
  );
};
`,
			},
		],
	},
};

// Ensure directories exist
Object.values(books).forEach((book) => {
	const dirPath = path.join(basePath, book.dir);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}

	book.chapters.forEach((chapter) => {
		fs.writeFileSync(path.join(dirPath, chapter.name), chapter.content);
	});
});

console.log("Source book lore dynamically generated.");
