import type { StaticBackground } from "@/types/character";

export const backgrounds: StaticBackground[] = [
  {
    "id": "b-01",
    "name": "Rift-Displaced Contractor",
    "type": "background",
    "rank": "A",
    "description": "A former civilian drafted by an A-Rank guild during a catastrophic gate break. You were pulled into a rift and survived purely by sticking close to the combat teams and carrying their gear. You've seen the horrors of the dungeons and the brutal corporate reality of the guilds.",
    "skill_proficiencies": [
      "Survival",
      "Athletics"
    ],
    "tool_proficiencies": [
      "Vehicles (Land)"
    ],
    "languages": [
      "One additional language of your choice"
    ],
    "equipment": [
      "Reinforced uniform",
      "50 ft rope",
      "Survival ration pack",
      "A set of dark common clothes",
      "A sturdy backpack"
    ],
    "starting_credits": 500,
    "feature_name": "Hazard Instinct",
    "feature_description": "You have advantage on perception checks related to environmental traps inside a gate. Additionally, you can always find safe passage through non-magical difficult terrain.",
    "features": [{
      "name": "Hazard Instinct",
      "description": "You have advantage on perception checks related to environmental traps inside a gate. Additionally, you can always find safe passage through non-magical difficult terrain."
    }],
    "personality_traits": [
      "I always pack twice as much water as I think I'll need.",
      "I'm deeply cynical about guild politics and PR statements.",
      "I react to loud noises with immediate evasive action.",
      "I constantly check exits and structural integrity when entering a room.",
      "I have a dark sense of humor regarding death and dismemberment.",
      "I prefer the company of support staff over 'heroic' A-Rankers."
    ],
    "ideals": [
      "Survival. The only victory is coming out alive. (Any)",
      "Solidarity. The grunts at the bottom need to stick together. (Good)",
      "Wealth. I didn't go through hell for free. I want my cut. (Evil)",
      "Caution. Fools rush in and get eaten. (Lawful)",
      "Independence. I never want to be helpless again. (Chaotic)",
      "Preparedness. Proper planning prevents poor performance. (Lawful)"
    ],
    "bonds": [
      "I owe my life to a veteran Hunter who dragged me out of my first gate.",
      "My family thinks I work a safe desk job at the Guild.",
      "I lost someone close to me in the gate break that drafted me.",
      "I kept a strange, unregistered mana crystal from my first dive.",
      "My old neighborhood is in the shadow of an active, volatile gate.",
      "I have a deep loyalty to my fellow contractors who survived with me."
    ],
    "flaws": [
      "I hoard supplies obsessively.",
      "I freeze or panic when surrounded by too many people.",
      "I hold a deep grudge against higher-ranked Hunters.",
      "I will abandon the mission if I feel the risk is too high.",
      "I have night terrors about the things I saw in the dark.",
      "I secretly believe the Sovereigns are right and humanity is doomed."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-02",
    "name": "Rift Survivor",
    "type": "background",
    "rank": "A",
    "description": "You are one of the few who survived a dungeon break before you even awakened. You spent days trapped in a collapsed building or a transformed subway station, hiding from monsters. The trauma awakened you, and now you hunt the things that once hunted you.",
    "skill_proficiencies": [
      "Stealth",
      "Perception"
    ],
    "tool_proficiencies": [
      "Thieves' Tools"
    ],
    "languages": [
      "One language spoken by monsters (e.g., Abyssal, Goblin)"
    ],
    "equipment": [
      "A token of someone you lost",
      "A makeshift weapon you kept",
      "Dark common clothes",
      "A flashlight with extra batteries"
    ],
    "starting_credits": 300,
    "feature_name": "Survivor's Fortitude",
    "feature_description": "You can go twice as long without food and water before suffering exhaustion. In urban environments, you can always find a hidden place to rest where monsters or patrols are unlikely to find you.",
    "features": [{
      "name": "Survivor's Fortitude",
      "description": "You can go twice as long without food and water before suffering exhaustion. In urban environments, you can always find a hidden place to rest where monsters or patrols are unlikely to find you."
    }],
    "personality_traits": [
      "I never sleep with my back to a door or window.",
      "I speak in whispers out of habit.",
      "I am incredibly protective of civilians caught in the crossfire.",
      "I view modern conveniences as fragile illusions.",
      "I hoard food and hide it in various stashes.",
      "I stare intensely at shadows, convinced something is moving."
    ],
    "ideals": [
      "Vengeance. I will exterminate the monsters that destroyed my life. (Evil)",
      "Protection. No one else should have to go through what I did. (Good)",
      "Resilience. What doesn't kill me makes me an apex predator. (Chaotic)",
      "Vigilance. The next break is always coming. We must be ready. (Lawful)",
      "Apathy. Everything ends in ruin eventually; why care? (Neutral)",
      "Strength. Only the strong survive the new world. (Any)"
    ],
    "bonds": [
      "I am searching for another survivor who was separated from me.",
      "The site of my survival is sacred to me; I visit it often.",
      "I owe everything to the rescue team that finally dug me out.",
      "I kept the journal of someone who didn't make it out.",
      "My family was wiped out; my guild is my only family now.",
      "I am terrified of the specific type of monster that trapped me."
    ],
    "flaws": [
      "I am severely claustrophobic.",
      "I suffer from debilitating flashbacks when cornered.",
      "I am overly aggressive toward anyone who dismisses the danger of gates.",
      "I refuse to retreat, even when heavily outmatched.",
      "I mistrust Authority and official Hunter Association protocols.",
      "I rely heavily on sedatives or alcohol to sleep."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-03",
    "name": "Ascendant Academy Graduate",
    "type": "background",
    "rank": "B",
    "description": "You were identified as an Awakened early and sent to a prestigious academy funded by the mega-guilds. You have been trained in magical theory, gate mechanics, and PR. You are polished, educated, and expected to be a star.",
    "skill_proficiencies": [
      "Arcana",
      "History"
    ],
    "tool_proficiencies": [
      "Calligrapher's Supplies"
    ],
    "languages": [
      "Two additional languages of your choice"
    ],
    "equipment": [
      "A diploma or signet ring from the Academy",
      "A high-end tablet with gate data",
      "Fine clothes",
      "A stylish pen"
    ],
    "starting_credits": 1500,
    "feature_name": "Academy Credentials",
    "feature_description": "Your alumni status grants you access to restricted Hunter Association archives, high-society guild galas, and an audience with local guild masters. Other alumni are generally disposed to help you.",
    "features": [{
      "name": "Academy Credentials",
      "description": "Your alumni status grants you access to restricted Hunter Association archives, high-society guild galas, and an audience with local guild masters. Other alumni are generally disposed to help you."
    }],
    "personality_traits": [
      "I quote textbooks and theory in the middle of combat.",
      "I look down on self-taught or 'street' hunters.",
      "I care deeply about my public image and ranking.",
      "I treat gate diving like a graded exam.",
      "I am overly formal and polite, even to my enemies.",
      "I name my attacks based on classic magical theory."
    ],
    "ideals": [
      "Excellence. I must live up to the legacy of my academy. (Lawful)",
      "Knowledge. Understanding the rifts is the key to closing them. (Neutral)",
      "Elitism. The educated should lead the unwashed masses. (Evil)",
      "Duty. My training obligates me to protect society. (Good)",
      "Fame. I want to be the valedictorian of the Hunter rankings. (Any)",
      "Innovation. Theory is useless unless applied in new ways. (Chaotic)"
    ],
    "bonds": [
      "My favorite professor went missing in an S-Rank gate.",
      "I have a fierce rivalry with the top student of my graduating class.",
      "My tuition was paid by a shadowy corporate sponsor I must repay.",
      "I want to make my mundane parents proud of my magical talents.",
      "I carry a prototype weapon developed by the academy's tech lab.",
      "I am secretly in love with my former combat instructor."
    ],
    "flaws": [
      "I panic when theory doesn't match reality.",
      "I am incredibly arrogant and underestimate opponents.",
      "I am easily manipulated by flattery regarding my intellect.",
      "I refuse to get my hands dirty if I can avoid it.",
      "I prioritize saving data and research over saving lives.",
      "I have massive impostor syndrome despite my high grades."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-04",
    "name": "Guild Master",
    "type": "background",
    "rank": "S",
    "description": "You are the founder or inherited leader of a Hunter Guild. Whether it's a massive corporate entity or a struggling indie startup, you are responsible for managing contracts, paying out shares, and leading raids.",
    "skill_proficiencies": [
      "Persuasion",
      "Insight"
    ],
    "tool_proficiencies": [
      "Forgery Kit"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A bespoke business suit",
      "Guild master seal or keycard",
      "A high-end comms earpiece",
      "A ledger of debts"
    ],
    "starting_credits": 2500,
    "feature_name": "Guild Authority",
    "feature_description": "You can leverage your guild's name to secure loans, bypass standard Association bureaucracy, and requisition basic mundane gear from affiliated businesses. You also command the loyalty of low-rank guild employees.",
    "features": [{
      "name": "Guild Authority",
      "description": "You can leverage your guild's name to secure loans, bypass standard Association bureaucracy, and requisition basic mundane gear from affiliated businesses. You also command the loyalty of low-rank guild employees."
    }],
    "personality_traits": [
      "I view every interaction as a negotiation.",
      "I am incredibly protective of my guild members.",
      "I speak in corporate buzzwords and synergy jargon.",
      "I always dress impeccably, even in a dungeon.",
      "I delegate tasks constantly, rarely doing grunt work.",
      "I calculate the monetary value of monster corpses mid-fight."
    ],
    "ideals": [
      "Power. A strong guild dictates the laws of the new world. (Evil)",
      "Responsibility. Heavy is the head that wears the crown. (Lawful)",
      "Wealth. The rifts are the greatest gold rush in history. (Neutral)",
      "Family. My guild is my family, and I will die for them. (Good)",
      "Freedom. I built my own guild so I'd answer to no one. (Chaotic)",
      "Legacy. I want my guild's name to live forever. (Any)"
    ],
    "bonds": [
      "My guild is heavily in debt to a dangerous cartel.",
      "I founded the guild to honor a fallen comrade.",
      "I am fiercely protective of the guild's youngest recruit.",
      "My former co-founder betrayed me and started a rival guild.",
      "The guild's headquarters is my true home.",
      "I am trying to buyout a legendary S-Ranker to join us."
    ],
    "flaws": [
      "I value profit margins over the safety of my B-Team.",
      "I am a workaholic who cannot relax.",
      "I am incredibly paranoid about corporate espionage.",
      "I will lie to my team if I think it will boost morale.",
      "I refuse to show weakness, even when mortally wounded.",
      "I micromanage everything to a detrimental degree."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-05",
    "name": "Rift-Scout",
    "type": "background",
    "rank": "B",
    "description": "Before the raid team goes in, you go in. You are a specialist in stealth and reconnaissance, tasked with mapping the gate, identifying the boss room, and slipping out before the monsters notice you.",
    "skill_proficiencies": [
      "Stealth",
      "Investigation"
    ],
    "tool_proficiencies": [
      "Cartographer's Tools",
      "Navigators Tools"
    ],
    "languages": [],
    "equipment": [
      "Night-vision goggles",
      "A bundle of glow sticks",
      "A specialized digital mapping device",
      "Dark tactical gear",
      "A grappling hook"
    ],
    "starting_credits": 800,
    "feature_name": "Aether-Pathfinder",
    "feature_description": "You have a flawless memory for dungeon layouts. You can always retrace your steps in a gate, and you can accurately estimate the rank and type of monsters in an area based on ambient mana traces.",
    "features": [{
      "name": "Aether-Pathfinder",
      "description": "You have a flawless memory for dungeon layouts. You can always retrace your steps in a gate, and you can accurately estimate the rank and type of monsters in an area based on ambient mana traces."
    }],
    "personality_traits": [
      "I prefer being alone in the dark.",
      "I map every room I enter in my head.",
      "I speak quickly and concisely, reporting only facts.",
      "I am deeply uncomfortable in open, brightly lit spaces.",
      "I collect a small souvenir from every gate I map.",
      "I am always looking for the quickest exit."
    ],
    "ideals": [
      "Information. Knowledge is the difference between a successful raid and a wipe. (Neutral)",
      "Thrill. There is no high like sneaking past a sleeping dragon. (Chaotic)",
      "Duty. My maps keep the strike teams alive. (Good)",
      "Professionalism. I do the job, I get paid, I leave. (Lawful)",
      "Secrecy. The best hunters are the ones no one knows exist. (Any)",
      "Greed. I map the boss room, but I pocket the loose crystals on the way. (Evil)"
    ],
    "bonds": [
      "I once mapped a gate that I swore I would never return to.",
      "I owe my career to a mentor who didn't make it back from a scouting run.",
      "My maps are my legacy; I fiercely protect my digital archives.",
      "I am trying to find a gate that swallowed my hometown.",
      "I have a strange, sympathetic bond with a monster I watched for days.",
      "I work to pay for my sibling's expensive medical care."
    ],
    "flaws": [
      "I am overly risk-averse and will flee at the first sign of trouble.",
      "I struggle to work in a team; I'm a lone wolf.",
      "I am hyper-vigilant to the point of severe anxiety.",
      "I hoard information and refuse to share it without payment.",
      "I sometimes intentionally misdirect rival guilds.",
      "I am addicted to the adrenaline of near-misses."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-06",
    "name": "Aetheric Pulse",
    "type": "background",
    "rank": "A",
    "description": "You are highly sensitive to mana, capable of feeling the fluctuations of aether in the air. You might have been a radar operator, a meteorologist, or just someone with extreme migraines before awakening.",
    "skill_proficiencies": [
      "Perception",
      "Nature"
    ],
    "tool_proficiencies": [
      "Alchemist's Supplies"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A portable mana-density meter",
      "A set of sensory-dampening earplugs",
      "Common clothes",
      "A journal of mana fluctuations"
    ],
    "starting_credits": 600,
    "feature_name": "Natural Resonance",
    "feature_description": "You can accurately predict when and where a gate will open up to 24 hours in advance within your city, and you can sense if an Awakened individual is actively concealing their true rank.",
    "features": [{
      "name": "Natural Resonance",
      "description": "You can accurately predict when and where a gate will open up to 24 hours in advance within your city, and you can sense if an Awakened individual is actively concealing their true rank."
    }],
    "personality_traits": [
      "I frequently complain about the 'noise' of high-mana areas.",
      "I am deeply spiritual about the flow of energy.",
      "I get headaches before major events.",
      "I speak in metaphors related to weather and waves.",
      "I am incredibly observant of minor details.",
      "I avoid crowded places due to sensory overload."
    ],
    "ideals": [
      "Harmony. We must balance our world with the mana leaking into it. (Neutral)",
      "Warning. I must use my gift to evacuate people before breaks happen. (Good)",
      "Exploitation. Knowing where gates open first means I get the best loot. (Evil)",
      "Understanding. The rifts are a puzzle I must solve. (Lawful)",
      "Flow. Go where the energy takes you. (Chaotic)",
      "Adaptation. Humanity must evolve to survive the aether. (Any)"
    ],
    "bonds": [
      "I predicted a gate break but no one believed me, resulting in tragedy.",
      "I am tracking a specific, massive mana signature that haunts my dreams.",
      "I work for the Association's early-warning division.",
      "My mentor taught me how to filter the noise; I owe them everything.",
      "I have a piece of a core that hums a specific frequency to me.",
      "I am trying to find a cure for the physical toll my sensitivity takes on me."
    ],
    "flaws": [
      "I am physically crippled by sudden spikes in mana.",
      "I am arrogant, believing my senses make me superior.",
      "I frequently ignore mundane threats because I'm distracted by magical ones.",
      "I am addicted to mana-dense environments.",
      "I am deeply superstitious.",
      "I panic when I am in a 'dead zone' with no ambient mana."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-07",
    "name": "Regent's Chosen",
    "type": "background",
    "rank": "S",
    "description": "You were directly spoken to by a Sovereign or a high-ranking entity of the rifts when you awakened. You bear a mark, a burden, and a destiny that you barely understand.",
    "skill_proficiencies": [
      "Religion",
      "Intimidation"
    ],
    "tool_proficiencies": [],
    "languages": [
      "Two exotic languages (e.g., Celestial, Infernal)"
    ],
    "equipment": [
      "A strange glowing brand or tattoo",
      "A relic from the entity",
      "Vestments or imposing clothes",
      "A pouch of strange coins"
    ],
    "starting_credits": 1000,
    "feature_name": "Regent's Mark",
    "feature_description": "Lesser monsters of your Regent's type will not attack you unless provoked. Cultists and scholars of the rifts will recognize your mark and offer you shelter, information, or terrifying reverence.",
    "features": [{
      "name": "Regent's Mark",
      "description": "Lesser monsters of your Regent's type will not attack you unless provoked. Cultists and scholars of the rifts will recognize your mark and offer you shelter, information, or terrifying reverence."
    }],
    "personality_traits": [
      "I speak with unwavering, terrifying conviction.",
      "I often stare into space, listening to voices no one else hears.",
      "I believe I am destined for something greater than mortal concerns.",
      "I treat common people with patronizing pity.",
      "I am intensely curious about the deep lore of the gates.",
      "I bear physical signs of my patron's influence (e.g., glowing eyes)."
    ],
    "ideals": [
      "Destiny. I am the instrument of a higher power. (Any)",
      "Dominion. My patron will rule this world, and I will be its vanguard. (Evil)",
      "Rebellion. I will use the power given to me to destroy the one who gave it. (Chaotic)",
      "Order. The Sovereigns bring a necessary hierarchy to the cosmos. (Lawful)",
      "Protection. I use this dark power as a shield for humanity. (Good)",
      "Ascension. I will become a Sovereign myself. (Neutral)"
    ],
    "bonds": [
      "I am terrified of the entity that chose me, and I seek to appease it.",
      "I am hunting another Chosen who serves a rival Regent.",
      "My family was taken by the entity; I serve to keep them safe.",
      "I am fiercely loyal to the cult that raised me after my awakening.",
      "I carry a weapon forged in the entity's realm.",
      "I am trying to sever my connection without losing my powers."
    ],
    "flaws": [
      "I suffer from terrifying hallucinations of my patron.",
      "I am incredibly arrogant, believing myself untouchable.",
      "I will obey orders from my patron, even if they harm my friends.",
      "I struggle to relate to mundane human emotions.",
      "I am hunted by the Hunter Association as a potential threat.",
      "I occasionally lose control of my body to the entity."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-08",
    "name": "Guardian Legionnaire",
    "type": "background",
    "rank": "B",
    "description": "You were part of a specialized mundane military unit designed to hold the line against gate breaks before Hunters became common. You survived through extreme discipline and heavy firepower.",
    "skill_proficiencies": [
      "Athletics",
      "Medicine"
    ],
    "tool_proficiencies": [
      "Land Vehicles",
      "Smith's Tools"
    ],
    "languages": [],
    "equipment": [
      "A piece of battered military armor",
      "Dog tags of your fallen squad",
      "A tactical medkit",
      "A military-issue radio"
    ],
    "starting_credits": 700,
    "feature_name": "Gate-Line Stance",
    "feature_description": "You have an encyclopedic knowledge of military logistics and barricade construction. You can requisition supplies from military outposts, and mundane soldiers will follow your tactical commands in a crisis.",
    "features": [{
      "name": "Gate-Line Stance",
      "description": "You have an encyclopedic knowledge of military logistics and barricade construction. You can requisition supplies from military outposts, and mundane soldiers will follow your tactical commands in a crisis."
    }],
    "personality_traits": [
      "I bark orders in high-stress situations.",
      "I maintain my gear with obsessive precision.",
      "I am fiercely loyal to the chain of command.",
      "I use military slang constantly.",
      "I stand at attention when speaking to superiors.",
      "I judge people entirely by their performance under fire."
    ],
    "ideals": [
      "Duty. The line must be held at all costs. (Lawful)",
      "Sacrifice. We bleed so the civilians don't have to. (Good)",
      "Order. Chaos is the enemy; discipline is survival. (Lawful)",
      "Camaraderie. I never leave a man behind. (Any)",
      "Might. Superior firepower solves all problems. (Evil)",
      "Survival. Adapt, overcome, survive. (Neutral)"
    ],
    "bonds": [
      "I am the last survivor of my original unit.",
      "I owe my life to a Hunter who saved my squad.",
      "I carry the dog tags of my commanding officer.",
      "My military pension was cut, so I hunt to survive.",
      "I am fiercely protective of my new raid team, treating them like my old squad.",
      "I harbor a deep hatred for the specific monster type that wiped out my base."
    ],
    "flaws": [
      "I suffer from severe PTSD triggered by loud alarms.",
      "I am incredibly rigid and struggle to adapt to magical solutions.",
      "I despise Hunters who act like celebrities.",
      "I will blindly follow orders from a recognized authority figure.",
      "I am overly aggressive toward insubordination.",
      "I drink heavily to forget the faces of the men I lost."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-09",
    "name": "Order Inscriber",
    "type": "background",
    "rank": "A",
    "description": "You are a master of runic technology, blending modern computer science with ancient magical sigils. You design the containment fields that keep gates from breaking and craft the magical gear Hunters rely on.",
    "skill_proficiencies": [
      "Arcana",
      "Investigation"
    ],
    "tool_proficiencies": [
      "Tinker's Tools",
      "Jeweler's Tools"
    ],
    "languages": [
      "One exotic language"
    ],
    "equipment": [
      "A set of precision engraving tools",
      "A tablet filled with runic code",
      "Safety goggles",
      "A pouch of low-grade mana crystals"
    ],
    "starting_credits": 1200,
    "feature_name": "Master Technician",
    "feature_description": "You can identify the function and creator of any runic or magical device. You can also bypass magical locks and containment fields given enough time and your tools.",
    "features": [{
      "name": "Master Technician",
      "description": "You can identify the function and creator of any runic or magical device. You can also bypass magical locks and containment fields given enough time and your tools."
    }],
    "personality_traits": [
      "I treat magical spells like poorly optimized code.",
      "I am constantly tinkering with my gear, even during downtime.",
      "I speak in technical jargon that confuses laymen.",
      "I am fascinated by the architecture of ancient ruins.",
      "I view combat as an equation to be solved.",
      "I am incredibly dismissive of 'brute force' hunters."
    ],
    "ideals": [
      "Knowledge. The universe is a machine we just haven't reverse-engineered yet. (Neutral)",
      "Innovation. We must build better tools to survive the rifts. (Chaotic)",
      "Perfection. A flawed rune is a fatal flaw. (Lawful)",
      "Profit. Good tech is expensive, and I am very good. (Evil)",
      "Protection. My wards keep the cities safe. (Good)",
      "Curiosity. I must know how the Sovereigns' magic works. (Any)"
    ],
    "bonds": [
      "I created a weapon that caused a catastrophic accident; I seek to destroy it.",
      "My masterpiece was stolen by a rival guild.",
      "I am deeply indebted to the corporation that funds my lab.",
      "I am obsessed with deciphering a specific, ancient tablet.",
      "My former assistant was lost in a gate we were studying.",
      "I want to build an ultimate weapon to close all gates permanently."
    ],
    "flaws": [
      "I am oblivious to social cues and emotional needs.",
      "I will risk the lives of my team to study a rare artifact.",
      "I am deeply arrogant about my intellect.",
      "I refuse to use gear I didn't personally inspect or create.",
      "I become violently angry if my work is interrupted.",
      "I am physically weak and rely entirely on my tech."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-10",
    "name": "Vault Warden",
    "type": "background",
    "rank": "S",
    "description": "You are a trusted guardian of the Hunter Association's deepest vaults, where S-Rank artifacts, cursed items, and high-value prisoner cores are kept. You have been exposed to extreme magical radiation.",
    "skill_proficiencies": [
      "Insight",
      "History"
    ],
    "tool_proficiencies": [
      "Thieves' Tools",
      "Tinker's Tools"
    ],
    "languages": [],
    "equipment": [
      "A heavy ring of master keys",
      "A lead-lined containment box",
      "A uniform of the Vault Guard",
      "A high-security ID badge"
    ],
    "starting_credits": 2000,
    "feature_name": "Containment Mandates",
    "feature_description": "Your Association clearance allows you to confiscate 'dangerous' artifacts from other Hunters legally. You have access to the Association's black-site databases and secure transport networks.",
    "features": [{
      "name": "Containment Mandates",
      "description": "Your Association clearance allows you to confiscate 'dangerous' artifacts from other Hunters legally. You have access to the Association's black-site databases and secure transport networks."
    }],
    "personality_traits": [
      "I am intensely paranoid about security.",
      "I never take off my gloves.",
      "I speak in a low, monotone voice.",
      "I am deeply suspicious of anyone showing interest in artifacts.",
      "I meticulously log everything I do.",
      "I have a habit of checking locks repeatedly."
    ],
    "ideals": [
      "Containment. Some things were not meant for human hands. (Lawful)",
      "Duty. The vault must be protected at all costs. (Lawful)",
      "Power. I guard the greatest weapons in the world; perhaps I should use them. (Evil)",
      "Safety. I keep the darkness locked away so the innocent can sleep. (Good)",
      "Knowledge. The artifacts sing to me; I must understand them. (Neutral)",
      "Freedom. The artifacts want to be free, and so do I. (Chaotic)"
    ],
    "bonds": [
      "I am guarding an artifact that holds the soul of someone I love.",
      "I failed to stop a heist that cost the Association a Sovereign core.",
      "My mentor went mad guarding the deep vaults.",
      "I am secretly hoarding confiscated artifacts for my own use.",
      "I am fiercely loyal to the Director of the Association.",
      "I hear a specific cursed sword whispering to me in my dreams."
    ],
    "flaws": [
      "I am corrupted by the magical radiation, suffering strange sicknesses.",
      "I am highly possessive of magical items and reluctant to part with them.",
      "I am deeply distrustful of all other Hunters.",
      "I rigidly adhere to protocol, even when it costs lives.",
      "I secretly desire the power of the things I guard.",
      "I suffer from extreme agoraphobia after years underground."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-11",
    "name": "Elite Breach-Tactician",
    "type": "background",
    "rank": "A",
    "description": "You are the chess master of the raid team. You don't just fight; you analyze boss patterns, coordinate cooldowns, and direct the flow of battle. You are highly sought after by top guilds.",
    "skill_proficiencies": [
      "Perception",
      "Insight"
    ],
    "tool_proficiencies": [
      "Dragonchess Set (or similar gaming set)",
      "Calligrapher's Supplies"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A tactical headset",
      "A holographic command tablet",
      "A sharp suit or sleek armor",
      "A clipboard with raid plans"
    ],
    "starting_credits": 1500,
    "feature_name": "Boss-Sense",
    "feature_description": "By observing a monster for 1 minute, you can deduce its relative threat level, its primary damage type, and its most obvious vulnerability or resistance.",
    "features": [{
      "name": "Boss-Sense",
      "description": "By observing a monster for 1 minute, you can deduce its relative threat level, its primary damage type, and its most obvious vulnerability or resistance."
    }],
    "personality_traits": [
      "I refer to people by their designated roles (Tank, DPS, Healer).",
      "I am incredibly calm under pressure.",
      "I click a pen or tap my fingers when analyzing a situation.",
      "I view casualties as 'acceptable losses' in a spreadsheet.",
      "I am brutally honest about people's flaws and weaknesses.",
      "I plan every conversation like a military campaign."
    ],
    "ideals": [
      "Efficiency. The goal is maximum yield with minimum loss. (Lawful)",
      "Victory. I play to win, no matter the cost. (Evil)",
      "Protection. My plans ensure everyone comes home. (Good)",
      "Ego. I am the smartest person in the room, and I know it. (Chaotic)",
      "Logic. Emotion has no place in the dungeon. (Neutral)",
      "Glory. A flawless raid is a work of art. (Any)"
    ],
    "bonds": [
      "I orchestrated a raid that resulted in a total wipe; I seek redemption.",
      "My sibling is a reckless front-liner I must protect.",
      "I am the protégé of a legendary S-Rank tactician.",
      "I am heavily invested in the success of my specific guild.",
      "I carry the broken weapon of a tank who died following my orders.",
      "I am trying to solve the 'unbeatable' pattern of a specific S-Rank boss."
    ],
    "flaws": [
      "I view my teammates as disposable pawns.",
      "I freeze if my plan goes off the rails.",
      "I am incredibly arrogant and refuse to admit when I'm wrong.",
      "I overcomplicate simple situations.",
      "I struggle to show empathy or emotional support.",
      "I will abandon the mission if the math says we can't win."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-12",
    "name": "Occult Investigator",
    "type": "background",
    "rank": "B",
    "description": "Before the gates, you investigated the paranormal. After the gates, you got a massive budget. You track down rogue Hunters, illegal artifact smuggling, and cults worshipping the Sovereigns.",
    "skill_proficiencies": [
      "Investigation",
      "Insight"
    ],
    "tool_proficiencies": [
      "Disguise Kit",
      "Thieves' Tools"
    ],
    "languages": [],
    "equipment": [
      "A trench coat",
      "A UV flashlight",
      "A badge (real or fake)",
      "A notebook filled with crazed sketches",
      "A flask"
    ],
    "starting_credits": 800,
    "feature_name": "Detection Mandate",
    "feature_description": "You have a network of informants in the criminal underworld and the Hunter Association. You can always find a contact who knows something about illegal magical activities in any major city.",
    "features": [{
      "name": "Detection Mandate",
      "description": "You have a network of informants in the criminal underworld and the Hunter Association. You can always find a contact who knows something about illegal magical activities in any major city."
    }],
    "personality_traits": [
      "I am deeply cynical and expect the worst of everyone.",
      "I chain-smoke or constantly chew gum.",
      "I ask pointed, uncomfortable questions.",
      "I document everything with photographs.",
      "I speak in a gruff, hardboiled cadence.",
      "I trust my gut over official reports."
    ],
    "ideals": [
      "Truth. The public deserves to know what's really happening. (Lawful)",
      "Justice. Rogue Hunters must be put down. (Good)",
      "Profit. Blackmail is a lucrative business. (Evil)",
      "Curiosity. I must uncover the deepest secrets of the rifts. (Neutral)",
      "Freedom. The Association's lies must be exposed. (Chaotic)",
      "Vengeance. I will find the cult that took my family. (Any)"
    ],
    "bonds": [
      "My former partner was corrupted by an artifact and I have to hunt them.",
      "I am protecting a witness who knows too much about a mega-guild.",
      "I owe a massive debt to a crime boss who feeds me intel.",
      "My office is my sanctuary; I protect it fiercely.",
      "I am obsessed with a cold case involving a vanished S-Ranker.",
      "I have a daughter I keep hidden from my dangerous life."
    ],
    "flaws": [
      "I am a functional alcoholic.",
      "I push away anyone who gets too close.",
      "I frequently break the law to solve a case.",
      "I am paranoid and trust no one, not even my team.",
      "I will take foolish risks to get a lead.",
      "I hold deep grudges against authority figures."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-13",
    "name": "Rift Porter (Logistics)",
    "type": "background",
    "rank": "C",
    "description": "You are the unsung hero of the dungeon raids. A non-combatant Awakened (or incredibly brave civilian) hired to carry heavy gear, harvest mana crystals from corpses, and haul the loot out. You have unparalleled endurance and a knack for avoiding aggro.",
    "skill_proficiencies": [
      "Athletics",
      "Survival"
    ],
    "tool_proficiencies": [
      "Weaver's Tools",
      "Vehicles (Land)"
    ],
    "languages": [],
    "equipment": [
      "A massive, reinforced expedition backpack",
      "Mining pick",
      "A set of durable coveralls",
      "A heavy-duty flashlight",
      "A ledger of current market prices for crystals"
    ],
    "starting_credits": 400,
    "feature_name": "Loot Appraiser",
    "feature_description": "You instantly know the exact market value of any monster part, mana crystal, or magical artifact you find. Furthermore, merchants and guilds will always buy your salvaged goods at a 10% premium because of your reputation for quality extraction.",
    "features": [{
      "name": "Loot Appraiser",
      "description": "You instantly know the exact market value of any monster part, mana crystal, or magical artifact you find. Furthermore, merchants and guilds will always buy your salvaged goods at a 10% premium because of your reputation for quality extraction."
    }],
    "personality_traits": [
      "I complain about my back constantly.",
      "I have an uncanny ability to fade into the background when danger appears.",
      "I appraise everything people wear in terms of credit value.",
      "I am fiercely protective of my backpack.",
      "I eat constantly to fuel my metabolism.",
      "I offer unsolicited advice on how to butcher monsters properly."
    ],
    "ideals": [
      "Wealth. I am doing this to get rich and retire early. (Neutral)",
      "Support. The heroes can't win without someone carrying the load. (Good)",
      "Exploitation. I skim off the top of every haul; they never notice. (Evil)",
      "Reliability. A contract signed is a contract honored. (Lawful)",
      "Survival. Drop the bag and run if the boss looks at you. (Chaotic)",
      "Family. Every crystal mined pays for my mother's hospital bills. (Any)"
    ],
    "bonds": [
      "I am deeply indebted to the Guild Master who gave me a chance.",
      "I am saving up to buy a resurrection artifact for my dead spouse.",
      "I carry a lucky charm from my first successful D-Rank raid.",
      "I have a bitter rivalry with another porter over scavenging rights.",
      "My younger sibling is a hotshot A-Ranker; I keep them grounded.",
      "I found an incredibly rare artifact and I'm hiding it from the Association."
    ],
    "flaws": [
      "I am a coward and will flee if not directly protected.",
      "I am incredibly greedy and will risk my life for a shiny core.",
      "I resent the combat hunters who treat me like a pack mule.",
      "I constantly complain about the conditions of the dungeon.",
      "I have a gambling addiction that drains my hard-earned credits.",
      "I hoard useless junk 'just in case it's valuable later.'"
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-14",
    "name": "Association Bureaucrat",
    "type": "background",
    "rank": "C",
    "description": "You worked a desk job for the Hunter Association. You measured gate mana waves, issued Hunter licenses, processed compensation claims for property damage, and dealt with the massive red tape of the Awakened world.",
    "skill_proficiencies": [
      "Investigation",
      "Persuasion"
    ],
    "tool_proficiencies": [
      "Calligrapher's Supplies",
      "Forgery Kit"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A stack of official Association forms",
      "A high-end smartphone",
      "A tailored business suit",
      "An Association ID badge",
      "A voice recorder"
    ],
    "starting_credits": 1000,
    "feature_name": "Red Tape Cutter",
    "feature_description": "You know exactly how to navigate the Hunter Association's bureaucracy. You can expedite gate clearances, secure meetings with high-ranking officials, and legally bypass standard quarantine protocols for your party.",
    "features": [{
      "name": "Red Tape Cutter",
      "description": "You know exactly how to navigate the Hunter Association's bureaucracy. You can expedite gate clearances, secure meetings with high-ranking officials, and legally bypass standard quarantine protocols for your party."
    }],
    "personality_traits": [
      "I cite Association bylaws in casual conversation.",
      "I am obsessively organized and neat.",
      "I treat life-or-death situations as paperwork issues.",
      "I always read the fine print before doing anything.",
      "I am extremely polite, even when threatening someone.",
      "I drink copious amounts of coffee."
    ],
    "ideals": [
      "Order. The Association is the only thing keeping society from collapsing. (Lawful)",
      "Corruption. The system is rigged, so I might as well get mine. (Evil)",
      "Service. I do the boring work so the Hunters can save lives. (Good)",
      "Efficiency. Time is money, and bureaucracy wastes both. (Chaotic)",
      "Neutrality. I just stamp the forms; I don't make the rules. (Neutral)",
      "Ambition. I will climb the corporate ladder to the Director's seat. (Any)"
    ],
    "bonds": [
      "I covered up a massive scandal for a major Guild, and they owe me.",
      "My mentor in the Association was assassinated; I seek the truth.",
      "I am secretly leaking Association data to a whistle-blowing journalist.",
      "I am fiercely loyal to the current Chairman of the Association.",
      "I have a stack of rejected compensation claims from victims I want to help.",
      "I lost my desk job because of a Hunter's mistake, and now I'm forced to dive."
    ],
    "flaws": [
      "I am paralyzed by indecision if there isn't a protocol for the situation.",
      "I am incredibly arrogant toward 'uneducated' combat Hunters.",
      "I will accept bribes to look the other way.",
      "I am physically unfit and complain about manual labor.",
      "I prioritize the Association's reputation over human lives.",
      "I am a stickler for rules to a highly detrimental degree."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-15",
    "name": "Black Market Relic Dealer",
    "type": "background",
    "rank": "B",
    "description": "Not all artifacts get registered. Not all cores get taxed. You operate in the criminal underworld, fencing illegal gate drops, cursed weapons, and untraceable mana potions to rogues, villains, and desperate heroes alike.",
    "skill_proficiencies": [
      "Deception",
      "Sleight of Hand"
    ],
    "tool_proficiencies": [
      "Thieves' Tools",
      "Jeweler's Tools"
    ],
    "languages": [
      "Thieves' Cant (or Underworld Slang)"
    ],
    "equipment": [
      "A set of dark clothes with hidden pockets",
      "A magnifying loupe",
      "A digital scale for cores",
      "A burner phone",
      "A forged Hunter License"
    ],
    "starting_credits": 1500,
    "feature_name": "Underworld Connections",
    "feature_description": "You know the hidden hubs of the black market in every major city. You can find buyers for illegal goods, locate untraceable medical care, and secure meetings with crime bosses without being killed on sight.",
    "features": [{
      "name": "Underworld Connections",
      "description": "You know the hidden hubs of the black market in every major city. You can find buyers for illegal goods, locate untraceable medical care, and secure meetings with crime bosses without being killed on sight."
    }],
    "personality_traits": [
      "I never give my real name.",
      "I constantly evaluate the price of everything I see.",
      "I speak in euphemisms and slang.",
      "I am extremely paranoid about surveillance and wiretaps.",
      "I always have an exit strategy.",
      "I am overly friendly to people I plan to scam."
    ],
    "ideals": [
      "Greed. Everything and everyone has a price. (Evil)",
      "Freedom. The Association's taxes are theft; I operate outside their control. (Chaotic)",
      "Honor. I am a crook, but I never betray a business partner. (Lawful)",
      "Survival. I sell to whoever pays because I need to eat. (Neutral)",
      "Redemption. I use my illicit funds to support a good cause. (Good)",
      "Power. Controlling the flow of artifacts means controlling the Hunters. (Any)"
    ],
    "bonds": [
      "I owe a massive debt to a dangerous Yakuza/Cartel boss.",
      "I am trying to buy back a family heirloom I was forced to sell.",
      "My sibling is an honest Association investigator; we pretend not to know each other.",
      "I have a trusted fence who is the only person I consider a friend.",
      "I sold a cursed artifact that killed a town; I must retrieve it.",
      "I am secretly gathering funds to buy a cure for my magical illness."
    ],
    "flaws": [
      "I will betray my friends if the payout is high enough.",
      "I am addicted to the thrill of the deal.",
      "I cannot resist stealing small, valuable items.",
      "I am deeply distrustful of any lawful authority.",
      "I am a compulsive liar.",
      "I hoard wealth but refuse to spend it on improving my life."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-16",
    "name": "Gate-Site Scavenger",
    "type": "background",
    "rank": "C",
    "description": "When the big guilds clear an A-Rank gate, they leave the small stuff behind. You are a 'hyena', illegally sneaking into uncleared or recently cleared gates to mine overlooked crystals or scavenge gear from dead Hunters.",
    "skill_proficiencies": [
      "Stealth",
      "Survival"
    ],
    "tool_proficiencies": [
      "Thieves' Tools",
      "Cobbler's Tools"
    ],
    "languages": [],
    "equipment": [
      "A crowbar",
      "A stained, patched-up backpack",
      "A gas mask",
      "A set of dark, durable clothes",
      "A half-empty mana potion"
    ],
    "starting_credits": 300,
    "feature_name": "Hyena's Path",
    "feature_description": "You know how to bypass Association police barricades and security perimeters around active gates. You can also identify areas in a dungeon where loot is likely to be hidden or overlooked by main raid teams.",
    "features": [{
      "name": "Hyena's Path",
      "description": "You know how to bypass Association police barricades and security perimeters around active gates. You can also identify areas in a dungeon where loot is likely to be hidden or overlooked by main raid teams."
    }],
    "personality_traits": [
      "I am incredibly scrappy and resourceful.",
      "I have a morbid sense of humor about death.",
      "I move quietly and stay close to the walls.",
      "I despise the wealthy elites of the mega-guilds.",
      "I am fiercely territorial over my 'finds'.",
      "I smell faintly of dungeon rot and ozone."
    ],
    "ideals": [
      "Survival. The scraps of the rich are the feasts of the poor. (Neutral)",
      "Rebellion. The guilds don't own the gates; the gates belong to everyone. (Chaotic)",
      "Greed. I'll pick the gold off a corpse before it gets cold. (Evil)",
      "Family. I scavenge to feed the orphans in my slum. (Good)",
      "Code. I never steal from a living Hunter, only the dead. (Lawful)",
      "Ambition. One big score and I'm out of the gutters forever. (Any)"
    ],
    "bonds": [
      "I scavenged the signature weapon of a famous dead Hunter, and now people are looking for it.",
      "I am fiercely protective of my fellow street hyenas.",
      "I owe my life to a guild team that caught me but let me go.",
      "I am looking for the body of my parent who died in a gate.",
      "I know a secret entrance to a permanent gate that no one else knows.",
      "I have a pet monster cub I rescued from a cleared dungeon."
    ],
    "flaws": [
      "I am a kleptomaniac.",
      "I have a deep-seated inferiority complex regarding high-ranking Hunters.",
      "I will flee at the first sign of a boss-level threat.",
      "I am incredibly stingy and refuse to share resources.",
      "I hold onto grudges forever.",
      "I lack formal education and struggle with complex technology or magic."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-17",
    "name": "Private Military Operator (PMC)",
    "type": "background",
    "rank": "B",
    "description": "You are an ex-military operative who transitioned into the lucrative private sector. You are hired by mega-guilds and corporations to provide security outside the gates, protect VIPs, or handle 'wetwork' against rival guilds.",
    "skill_proficiencies": [
      "Intimidation",
      "Athletics"
    ],
    "tool_proficiencies": [
      "Land Vehicles",
      "Smith's Tools"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "Tactical body armor",
      "A high-end earpiece",
      "A military ID",
      "A pair of dark sunglasses",
      "A combat knife"
    ],
    "starting_credits": 1200,
    "feature_name": "Corporate Security Clearance",
    "feature_description": "Your PMC credentials grant you access to secure corporate buildings, VIP lounges, and restricted airspace. You also know how to acquire military-grade mundane weaponry on short notice.",
    "features": [{
      "name": "Corporate Security Clearance",
      "description": "Your PMC credentials grant you access to secure corporate buildings, VIP lounges, and restricted airspace. You also know how to acquire military-grade mundane weaponry on short notice."
    }],
    "personality_traits": [
      "I speak in military acronyms and brevity codes.",
      "I am constantly scanning the perimeter for threats.",
      "I maintain a stoic, emotionless facade.",
      "I treat my weapon better than I treat people.",
      "I am fiercely loyal to the client who pays me.",
      "I wake up at the exact same time every morning."
    ],
    "ideals": [
      "Professionalism. A job is a job; I execute it flawlessly. (Lawful)",
      "Wealth. I kill things for money; it's a simple life. (Neutral)",
      "Loyalty. My squad is my life. (Good)",
      "Power. Might makes right in the corporate wars. (Evil)",
      "Independence. I am a gun for hire, answering to no state. (Chaotic)",
      "Efficiency. Why use magic when a bullet works fine? (Any)"
    ],
    "bonds": [
      "My PMC squad was wiped out by a rogue S-Rank Hunter; I seek revenge.",
      "I am secretly acting as a bodyguard for someone who doesn't know it.",
      "I am fiercely loyal to my former commanding officer, now a Guild Master.",
      "I carry a bullet that was surgically removed from my chest.",
      "I am trying to clear my name after being framed for a war crime.",
      "I send all my earnings back to my family in another country."
    ],
    "flaws": [
      "I am trigger-happy and escalate situations to violence quickly.",
      "I am incredibly cynical and trust no one's motives.",
      "I struggle with severe PTSD from my deployments.",
      "I despise magic users and consider them undisciplined.",
      "I will ruthlessly betray an ally if my contract demands it.",
      "I rely heavily on combat stimulants."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-18",
    "name": "Aether-Scientist",
    "type": "background",
    "rank": "A",
    "description": "You are a brilliant researcher employed by a mega-corporation or the government. You study mana, reverse-engineer alien biology, and develop the potions and gear that keep Hunters alive. You were likely awakened during a lab accident.",
    "skill_proficiencies": [
      "Arcana",
      "Medicine"
    ],
    "tool_proficiencies": [
      "Alchemist's Supplies",
      "Poisoner's Kit"
    ],
    "languages": [
      "Two additional languages"
    ],
    "equipment": [
      "A pristine lab coat",
      "A datapad with sensitive research",
      "A set of protective goggles",
      "Several empty sample vials",
      "A badge to a high-tech lab"
    ],
    "starting_credits": 1400,
    "feature_name": "Lab Access & Analysis",
    "feature_description": "You have access to state-of-the-art corporate laboratories. By spending an hour in a lab, you can identify the exact properties, weaknesses, and biological functions of any monster corpse or mana crystal.",
    "features": [{
      "name": "Lab Access & Analysis",
      "description": "You have access to state-of-the-art corporate laboratories. By spending an hour in a lab, you can identify the exact properties, weaknesses, and biological functions of any monster corpse or mana crystal."
    }],
    "personality_traits": [
      "I view everything as a fascinating scientific specimen.",
      "I take notes constantly during combat.",
      "I use overly complex terminology to describe simple things.",
      "I lack basic self-preservation instincts when presented with a new discovery.",
      "I am easily distracted by glowing objects.",
      "I am highly condescending to those without a PhD."
    ],
    "ideals": [
      "Knowledge. The rifts are the greatest scientific puzzle in history. (Neutral)",
      "Progress. We must harness this energy to advance humanity. (Lawful)",
      "Power. My research will create the ultimate weapon. (Evil)",
      "Cure. I will find a way to stop the magical diseases plaguing the world. (Good)",
      "Innovation. Rules are meant to be broken in the name of science. (Chaotic)",
      "Legacy. I want a new species of monster named after me. (Any)"
    ],
    "bonds": [
      "My revolutionary research was stolen by my mentor.",
      "I am trying to cure a loved one infected by a rare gate-disease.",
      "I am bonded to a symbiotic alien organism I kept as a pet.",
      "I owe my life to the Hunter who pulled me from my ruined lab.",
      "I am obsessed with dissecting a specific Sovereign.",
      "I carry the only prototype of a world-changing invention."
    ],
    "flaws": [
      "I will conduct unethical experiments if the data is worth it.",
      "I am physically frail and complain about fieldwork.",
      "I am intensely arrogant and ignore the advice of 'grunts'.",
      "I am oblivious to social cues.",
      "I have a dangerous addiction to experimental mana-potions.",
      "I will endanger the party to secure a rare specimen."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-19",
    "name": "Awakened Delinquent",
    "type": "background",
    "rank": "C",
    "description": "Before the awakening, you were a street punk, a gang member, or a petty criminal. When you got your powers, you used them to rule the streets—until the Association or a major Guild forced you into legitimate hunting as an alternative to prison.",
    "skill_proficiencies": [
      "Intimidation",
      "Sleight of Hand"
    ],
    "tool_proficiencies": [
      "Thieves' Tools",
      "Vehicles (Land)"
    ],
    "languages": [
      "Underworld Slang"
    ],
    "equipment": [
      "A leather jacket with gang colors",
      "A customized motorcycle key",
      "A crowbar",
      "A burner phone",
      "A lighter"
    ],
    "starting_credits": 200,
    "feature_name": "Street Cred",
    "feature_description": "You are known in the slums and the underworld. Street gangs, petty thieves, and low-level fences will not mess with you, and you can easily secure safehouses or local rumors in impoverished districts.",
    "features": [{
      "name": "Street Cred",
      "description": "You are known in the slums and the underworld. Street gangs, petty thieves, and low-level fences will not mess with you, and you can easily secure safehouses or local rumors in impoverished districts."
    }],
    "personality_traits": [
      "I am loud, brash, and easily provoked.",
      "I spit on the ground to show disrespect.",
      "I am fiercely loyal to my 'crew'.",
      "I have zero respect for authority figures.",
      "I am constantly posturing to look tough.",
      "I have a soft spot for street kids and strays."
    ],
    "ideals": [
      "Freedom. No one tells me what to do. (Chaotic)",
      "Power. The strong rule the streets. (Evil)",
      "Loyalty. You don't turn your back on your family. (Lawful)",
      "Protection. I look out for the people the Association ignores. (Good)",
      "Survival. It's a dog-eat-dog world. (Neutral)",
      "Respect. I will make sure everyone knows my name. (Any)"
    ],
    "bonds": [
      "My old gang leader is now a powerful villain I must stop.",
      "I am hunting to pay off a massive debt to keep my family safe.",
      "I am fiercely protective of the neighborhood I grew up in.",
      "I have a parole officer (an Association agent) I must appease.",
      "I carry a weapon that belonged to my murdered best friend.",
      "I am secretly in love with a high-society Academy graduate."
    ],
    "flaws": [
      "I have a severe anger management problem.",
      "I am incredibly impulsive and hate planning.",
      "I am deeply insecure about my lack of education.",
      "I will pick a fight with anyone who disrespects me.",
      "I am prone to substance abuse.",
      "I refuse to cooperate with police or investigators."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-20",
    "name": "Hunter Crimes Detective",
    "type": "background",
    "rank": "B",
    "description": "When a Hunter murders someone inside a gate, the normal police can't do anything. You are a specialized detective working for the government or the Association, tasked with solving crimes committed by gods among men.",
    "skill_proficiencies": [
      "Investigation",
      "Insight"
    ],
    "tool_proficiencies": [
      "Disguise Kit",
      "Forgery Kit"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A detective's badge",
      "A concealed holster",
      "A datapad with criminal records",
      "A trench coat",
      "A pair of handcuffs"
    ],
    "starting_credits": 1000,
    "feature_name": "Jurisdiction",
    "feature_description": "You have the legal authority to enter crime scenes, demand cooperation from local police, and request access to a Hunter's public dungeon-dive records from the Association.",
    "features": [{
      "name": "Jurisdiction",
      "description": "You have the legal authority to enter crime scenes, demand cooperation from local police, and request access to a Hunter's public dungeon-dive records from the Association."
    }],
    "personality_traits": [
      "I am deeply cynical and expect everyone to lie to me.",
      "I narrate my thoughts out loud like a noir detective.",
      "I drink too much coffee and sleep too little.",
      "I am unfazed by gore or horrific crime scenes.",
      "I constantly play with a coin or lighter when thinking.",
      "I am intensely protective of innocent bystanders."
    ],
    "ideals": [
      "Justice. Even S-Rankers must answer for their crimes. (Lawful)",
      "Truth. The truth must be uncovered, no matter who it hurts. (Neutral)",
      "Protection. I am the shield between the gods and the mortals. (Good)",
      "Corruption. I use my badge to extort the guilty. (Evil)",
      "Vengeance. I use the law as a weapon against those I hate. (Chaotic)",
      "Duty. I do the job because no one else will. (Any)"
    ],
    "bonds": [
      "I am hunting a serial killer who uses gates to dispose of bodies.",
      "My former partner was murdered by a Guild Master who got away with it.",
      "I have an informant in the underworld I would die to protect.",
      "I am deeply devoted to my family, whom I keep isolated from my work.",
      "I carry the badge of my father, who was also a detective.",
      "I am secretly investigating the Chairman of the Hunter Association."
    ],
    "flaws": [
      "I am a functional alcoholic.",
      "I am obsessed with my cases to the detriment of my health.",
      "I am deeply paranoid and trust no one.",
      "I will break the law to catch a criminal.",
      "I push away anyone who tries to get close to me.",
      "I hold deep-seated prejudices against high-ranking Hunters."
    ],
    "source": "Rift Compendium"
  }
,

  {
    "id": "b-21",
    "name": "Mega-Guild Heir (Chaebol)",
    "type": "background",
    "rank": "A",
    "description": "You are the scion of a massive corporate conglomerate that runs a top-tier Hunter Guild. You were born with a silver spoon and awakened with an S-Rank or A-Rank potential. The world expects you to lead, but you have yet to prove you're more than just nepotism.",
    "skill_proficiencies": [
      "Persuasion",
      "History"
    ],
    "tool_proficiencies": [
      "Vehicles (Land)",
      "Gaming Set"
    ],
    "languages": [
      "Two additional languages"
    ],
    "equipment": [
      "Designer clothes",
      "A high-end sports car key (flavor)",
      "A gold-plated guild signet",
      "A flagship smartphone",
      "An expensive watch"
    ],
    "starting_credits": 5000,
    "feature_name": "Corporate Nepotism",
    "feature_description": "You have a massive trust fund and corporate backing. Once per week, you can requisition a piece of mundane equipment, a vehicle, or secure a meeting with any high-ranking official by dropping your family's name.",
    "features": [{
      "name": "Corporate Nepotism",
      "description": "You have a massive trust fund and corporate backing. Once per week, you can requisition a piece of mundane equipment, a vehicle, or secure a meeting with any high-ranking official by dropping your family's name."
    }],
    "personality_traits": [
      "I expect people to open doors for me.",
      "I complain about the quality of food and accommodations.",
      "I am secretly terrified of failing my family.",
      "I throw money at problems to make them go away.",
      "I am incredibly charismatic and used to the camera.",
      "I am deeply naive about how the 'real world' works."
    ],
    "ideals": [
      "Legacy. I must uphold the honor of my family's name. (Lawful)",
      "Power. My family rules the world; I am just taking my throne. (Evil)",
      "Responsibility. With great wealth comes a duty to protect the weak. (Good)",
      "Freedom. I want to escape my family's shadow and be my own person. (Chaotic)",
      "Success. The only metric that matters is the bottom line. (Neutral)",
      "Ego. I will prove I am the best, not just the richest. (Any)"
    ],
    "bonds": [
      "I am fiercely loyal to my personal bodyguard/butler.",
      "I am trying to earn the respect of my cold, distant parent.",
      "I have a bitter rivalry with the heir of a competing mega-guild.",
      "I am secretly funding an illegal underground guild.",
      "I am engaged to someone for purely political/corporate reasons.",
      "I am desperately searching for a cure for my sibling's magical illness."
    ],
    "flaws": [
      "I am incredibly arrogant and entitled.",
      "I have no concept of the value of money.",
      "I will throw a tantrum if I am publicly humiliated.",
      "I am easily manipulated by flattery.",
      "I am secretly a coward when my life is actually in danger.",
      "I rely completely on my gear and connections, not my skills."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-22",
    "name": "Gate-Worshipping Cultist",
    "type": "background",
    "rank": "D",
    "description": "You were a member of a doomsday cult that believes the Sovereigns and the rifts are divine judgments. You either escaped the cult when you awakened, or you are secretly still a member acting as a sleeper agent among the Hunters.",
    "skill_proficiencies": [
      "Religion",
      "Deception"
    ],
    "tool_proficiencies": [
      "Disguise Kit",
      "Poisoner's Kit"
    ],
    "languages": [
      "One exotic language"
    ],
    "equipment": [
      "A hidden cult symbol",
      "Dark robes",
      "A sacrificial dagger",
      "A strange, humming piece of a gate",
      "A book of prophecies"
    ],
    "starting_credits": 200,
    "feature_name": "Cult Sympathizers",
    "feature_description": "You know the secret signs and phrases of the gate-cults. You can find safehouses, secure black-market healing, or gather rumors from cultists in any major city without being attacked.",
    "features": [{
      "name": "Cult Sympathizers",
      "description": "You know the secret signs and phrases of the gate-cults. You can find safehouses, secure black-market healing, or gather rumors from cultists in any major city without being attacked."
    }],
    "personality_traits": [
      "I speak in apocalyptic prophecies and metaphors.",
      "I am intensely charismatic and persuasive.",
      "I stare unblinkingly at people.",
      "I am calm, even joyful, in the face of terrifying monsters.",
      "I constantly recite silent prayers.",
      "I am deeply secretive about my past."
    ],
    "ideals": [
      "Devotion. The Sovereigns are gods; we must prepare for their arrival. (Evil)",
      "Redemption. I must atone for the horrific things I did in the cult. (Good)",
      "Nihilism. The world is ending; nothing matters but the rifts. (Chaotic)",
      "Order. The cult provides the only true structure in a broken world. (Lawful)",
      "Survival. I play whatever role keeps me alive. (Neutral)",
      "Truth. I must uncover the true nature of the Sovereigns. (Any)"
    ],
    "bonds": [
      "I am hunting the cult leader who brainwashed me.",
      "I am trying to rescue my family who is still in the cult.",
      "I carry a prophecy that names me as the harbinger of the end.",
      "I am fiercely protective of another escapee.",
      "I owe my life to the Hunter who raided our compound.",
      "I am secretly preparing a ritual to summon a Sovereign."
    ],
    "flaws": [
      "I suffer from severe delusions and hallucinations.",
      "I am completely devoid of empathy for non-believers.",
      "I will obey orders from high-ranking cultists instinctively.",
      "I am deeply paranoid that the cult is hunting me.",
      "I enjoy the suffering of others.",
      "I refuse to use modern medicine, relying only on mana."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-23",
    "name": "Viral Streamer",
    "type": "background",
    "rank": "C",
    "description": "You make your living broadcasting your life to millions. When the gates opened, you didn't run; you turned the camera on. You are an Awakened influencer who live-streams dungeon dives for superchats and sponsorships.",
    "skill_proficiencies": [
      "Performance",
      "Acrobatics"
    ],
    "tool_proficiencies": [
      "Disguise Kit"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A high-end floating drone camera",
      "A smartphone",
      "Flashy, branded combat gear",
      "A portable ring light",
      "A selfie stick"
    ],
    "starting_credits": 1000,
    "feature_name": "Sponsored Content",
    "feature_description": "You have a massive online following. Once per city, you can leverage your fanbase to secure free lodging, a distraction, or gather localized information via social media crowdsourcing.",
    "features": [{
      "name": "Sponsored Content",
      "description": "You have a massive online following. Once per city, you can leverage your fanbase to secure free lodging, a distraction, or gather localized information via social media crowdsourcing."
    }],
    "personality_traits": [
      "I narrate my actions as if speaking to an audience.",
      "I am obsessed with my follower count and engagement metrics.",
      "I always prioritize getting a good angle over safety.",
      "I use internet slang constantly.",
      "I am incredibly chipper and energetic, even when exhausted.",
      "I view other Hunters as 'collabs' rather than teammates."
    ],
    "ideals": [
      "Fame. The only thing worse than dying is being forgotten. (Any)",
      "Wealth. I am here for the sponsorships and superchats. (Neutral)",
      "Entertainment. The world is dark; I bring the light. (Good)",
      "Ego. I am the main character of reality. (Chaotic)",
      "Influence. With a million viewers, I can change the world. (Lawful)",
      "Exploitation. I will use my fans for whatever I need. (Evil)"
    ],
    "bonds": [
      "I am trying to out-stream a bitter rival influencer.",
      "I owe everything to a dedicated mod who manages my life.",
      "I am hiding a dark secret that would ruin my career if exposed.",
      "I am desperately seeking a sponsor to pay off a massive debt.",
      "I want to document the ultimate S-Rank boss fight.",
      "I am trying to find a missing fan who disappeared in a gate."
    ],
    "flaws": [
      "I will risk the lives of my party for a viral clip.",
      "I am deeply insecure and need constant validation.",
      "I am a narcissist who cannot handle criticism.",
      "I will leak sensitive guild information if it gets views.",
      "I am terrified of being 'canceled' or losing relevance.",
      "I struggle to distinguish my online persona from my real self."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-24",
    "name": "K-Pop Idol",
    "type": "background",
    "rank": "B",
    "description": "You were a manufactured pop star, trained for years to be perfect. Your awakening was a PR nightmare—or a PR miracle. Now, your agency manages your Hunter career, and you fight monsters while maintaining perfect choreography.",
    "skill_proficiencies": [
      "Performance",
      "Persuasion"
    ],
    "tool_proficiencies": [
      "Musical Instrument",
      "Disguise Kit"
    ],
    "languages": [
      "Korean",
      "One additional language"
    ],
    "equipment": [
      "A microphone (can be a focus)",
      "Designer combat outfits",
      "A fan letter",
      "A compact mirror and makeup",
      "A pair of sunglasses"
    ],
    "starting_credits": 1500,
    "feature_name": "Idol Aura",
    "feature_description": "You are universally recognizable and adored. You can easily bypass security at clubs, hotels, and events, and fans will eagerly do small favors for you (like providing a disguise, a ride, or a distraction).",
    "features": [{
      "name": "Idol Aura",
      "description": "You are universally recognizable and adored. You can easily bypass security at clubs, hotels, and events, and fans will eagerly do small favors for you (like providing a disguise, a ride, or a distraction)."
    }],
    "personality_traits": [
      "I strike a pose when I land a finishing blow.",
      "I am intensely disciplined and practice my 'routines' daily.",
      "I always smile, even when I am furious or in pain.",
      "I am deeply concerned with my diet and appearance.",
      "I treat my teammates like backup dancers.",
      "I speak to fans with rehearsed, syrupy sweetness."
    ],
    "ideals": [
      "Perfection. I must be flawless in every aspect of my life. (Lawful)",
      "Inspiration. I fight to give my fans hope in a dark world. (Good)",
      "Fame. I want to be the most famous person on the planet. (Any)",
      "Control. I will break free from my agency's iron grip. (Chaotic)",
      "Wealth. I am a brand, and my brand is expensive. (Neutral)",
      "Manipulation. I use my charm to get exactly what I want. (Evil)"
    ],
    "bonds": [
      "I am secretly dating a member of a rival idol group/guild.",
      "I am trapped in an abusive contract with my entertainment agency.",
      "I am fiercely protective of my sasaeng (obsessive) fans.",
      "I am trying to protect my younger sibling from the industry.",
      "I want to avenge a former bandmate who died in a gate.",
      "I carry a specific song lyric that holds the key to my awakening."
    ],
    "flaws": [
      "I suffer from severe burnout and depression.",
      "I am anorexic or have severe body image issues.",
      "I will compromise a mission if it threatens my physical appearance.",
      "I am completely dependent on my manager for basic life skills.",
      "I am secretly incredibly cruel and vindictive behind closed doors.",
      "I panic if I lose my voice or damage my face."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-25",
    "name": "Movie Star",
    "type": "background",
    "rank": "A",
    "description": "You were an A-list celebrity, known across the globe for your blockbuster films. When you awakened, your studio immediately pivoted to funding your Hunter raids as live-action reality movies. You are the ultimate action star.",
    "skill_proficiencies": [
      "Deception",
      "Performance"
    ],
    "tool_proficiencies": [
      "Disguise Kit",
      "Vehicles (Land)"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A prop from your most famous movie",
      "A tailored suit or dress",
      "A pair of dark sunglasses",
      "A contract with a major studio",
      "A bottle of expensive champagne"
    ],
    "starting_credits": 2000,
    "feature_name": "Star Power",
    "feature_description": "Your fame opens doors that money cannot. You can secure VIP access, private transportation, and high-level meetings simply by virtue of being famous. People naturally defer to you in social situations.",
    "features": [{
      "name": "Star Power",
      "description": "Your fame opens doors that money cannot. You can secure VIP access, private transportation, and high-level meetings simply by virtue of being famous. People naturally defer to you in social situations."
    }],
    "personality_traits": [
      "I treat everything as a movie set and everyone as an extra.",
      "I demand a 'stunt double' for dangerous non-combat tasks.",
      "I speak in dramatic, rehearsed monologues.",
      "I am deeply concerned with my 'lighting' and angles.",
      "I name-drop famous people constantly.",
      "I am incredibly charming and charismatic."
    ],
    "ideals": [
      "Legacy. I want to be remembered forever. (Any)",
      "Art. Combat is just another form of expression. (Chaotic)",
      "Image. My public perception is more important than reality. (Lawful)",
      "Heroism. I want to be the hero I play in the movies. (Good)",
      "Ego. I am the greatest talent of my generation. (Evil)",
      "Wealth. Blockbusters pay well, but S-Rank cores pay better. (Neutral)"
    ],
    "bonds": [
      "I am trying to win an Oscar for 'Best Live-Action Raid'.",
      "I am fiercely protective of my long-suffering personal assistant.",
      "I am hiding a massive scandal that a tabloid journalist is blackmailing me with.",
      "I want to prove I'm a real Hunter, not just a studio plant.",
      "I am deeply in love with my co-star from a previous film.",
      "I carry a script for a movie I want to direct someday."
    ],
    "flaws": [
      "I am incredibly vain and shallow.",
      "I am a diva who demands constant pampering.",
      "I will freeze if I don't know my 'lines'.",
      "I struggle to distinguish reality from fiction.",
      "I am addicted to painkillers or alcohol.",
      "I am terrified of aging or losing my looks."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-26",
    "name": "Pro Athlete",
    "type": "background",
    "rank": "B",
    "description": "You were at the peak of human physical performance before the awakening. You were an Olympian, a martial arts champion, or a star quarterback. Your awakening simply pushed your already superhuman body past the limits of physics.",
    "skill_proficiencies": [
      "Athletics",
      "Acrobatics"
    ],
    "tool_proficiencies": [
      "Vehicles (Land)"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A gold medal or championship ring",
      "High-end athletic wear",
      "A duffel bag",
      "A water bottle and protein supplements",
      "A jump rope"
    ],
    "starting_credits": 1000,
    "feature_name": "Physical Specimen",
    "feature_description": "Your athletic background gives you an intuitive understanding of physical limits. You can accurately gauge the physical strength and agility of any humanoid or monster by observing them move for 1 minute.",
    "features": [{
      "name": "Physical Specimen",
      "description": "Your athletic background gives you an intuitive understanding of physical limits. You can accurately gauge the physical strength and agility of any humanoid or monster by observing them move for 1 minute."
    }],
    "personality_traits": [
      "I stretch constantly and do calisthenics during downtime.",
      "I view combat purely as a sport with rules and scores.",
      "I am highly competitive and turn everything into a race.",
      "I speak in sports cliches and motivational quotes.",
      "I am intensely disciplined about my diet and training.",
      "I respect anyone who puts in the physical work."
    ],
    "ideals": [
      "Competition. I want to test myself against the strongest monsters. (Chaotic)",
      "Discipline. Hard work beats talent when talent doesn't work hard. (Lawful)",
      "Victory. Winning isn't everything; it's the only thing. (Evil)",
      "Teamwork. There is no 'I' in 'Raid'. (Good)",
      "Glory. I want to be the #1 ranked Hunter in the world. (Any)",
      "Health. My body is a temple; I must protect it. (Neutral)"
    ],
    "bonds": [
      "I am trying to win the 'Hunter Olympics' against rival guilds.",
      "I owe my success to a harsh but fair coach.",
      "I suffered a career-ending injury that my awakening healed; I must prove I'm still the best.",
      "I am fiercely loyal to my hometown team.",
      "I want to avenge a teammate who was killed in a gate.",
      "I carry the jersey of my childhood idol."
    ],
    "flaws": [
      "I am an adrenaline junkie who takes unnecessary risks.",
      "I am incredibly arrogant about my physical superiority.",
      "I struggle to understand strategy or magic, relying purely on brawn.",
      "I am a sore loser who throws tantrums.",
      "I have a secret gambling debt.",
      "I will ignore injuries to stay in the game, endangering myself."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-27",
    "name": "Corporate Executive",
    "type": "background",
    "rank": "S",
    "description": "You are a shark in a tailored suit. You ran a Fortune 500 company before the gates, and when you awakened, you realized the true profit lay in mana crystals and guild acquisitions. You are a CEO, a board member, or a ruthless venture capitalist.",
    "skill_proficiencies": [
      "Persuasion",
      "Insight"
    ],
    "tool_proficiencies": [
      "Calligrapher's Supplies",
      "Forgery Kit"
    ],
    "languages": [
      "Two additional languages"
    ],
    "equipment": [
      "A tailored Armani suit",
      "A platinum credit card",
      "A high-end smartwatch",
      "A briefcase of contracts",
      "A pen worth more than a car"
    ],
    "starting_credits": 3000,
    "feature_name": "Hostile Takeover",
    "feature_description": "You have massive financial leverage. You can secure vast loans, hire elite mercenary teams, or acquire properties and businesses instantly by throwing your corporate weight around.",
    "features": [{
      "name": "Hostile Takeover",
      "description": "You have massive financial leverage. You can secure vast loans, hire elite mercenary teams, or acquire properties and businesses instantly by throwing your corporate weight around."
    }],
    "personality_traits": [
      "I view people as assets or liabilities.",
      "I speak in calm, measured tones, even when threatening someone.",
      "I delegate all physical labor to subordinates.",
      "I am constantly checking the stock market and crystal prices.",
      "I negotiate aggressively for every single advantage.",
      "I dress impeccably in all situations."
    ],
    "ideals": [
      "Profit. The bottom line is the only thing that matters. (Evil)",
      "Order. The corporate structure is the pinnacle of human achievement. (Lawful)",
      "Efficiency. Waste is a sin; I optimize everything. (Neutral)",
      "Power. I want to own the Hunter Association itself. (Any)",
      "Philanthropy. I use my wealth to rebuild cities destroyed by gates. (Good)",
      "Disruption. I break established markets to create new opportunities. (Chaotic)"
    ],
    "bonds": [
      "I am trying to orchestrate a hostile takeover of a rival mega-guild.",
      "I am fiercely protective of my company's proprietary technology.",
      "I owe a massive debt to a shadowy cabal of investors.",
      "I want to secure a monopoly on S-Rank mana crystals.",
      "I am secretly funding a rogue research lab.",
      "I am trying to groom my disappointing child to take over the company."
    ],
    "flaws": [
      "I am a ruthless sociopath who cares nothing for human life.",
      "I am physically cowardly and will flee if my bodyguards fall.",
      "I am obsessed with accumulating wealth.",
      "I will betray my closest allies for a 1% increase in profit.",
      "I am deeply paranoid about assassination attempts.",
      "I view myself as fundamentally superior to the working class."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-28",
    "name": "Underground Hacker",
    "type": "background",
    "rank": "B",
    "description": "You are a ghost in the machine. You grew up in the dark web, breaching corporate firewalls and stealing Association data. Your awakening enhanced your mind, allowing you to interface with technology and magic simultaneously.",
    "skill_proficiencies": [
      "Investigation",
      "Sleight of Hand"
    ],
    "tool_proficiencies": [
      "Thieves' Tools",
      "Tinker's Tools"
    ],
    "languages": [
      "Machine Code (or one exotic language)"
    ],
    "equipment": [
      "A heavily modified laptop",
      "A set of lockpicks",
      "A burner phone",
      "A flash drive with encrypted blackmail",
      "A dark hoodie"
    ],
    "starting_credits": 800,
    "feature_name": "Backdoor Access",
    "feature_description": "You can bypass any mundane or low-level magical security system given time. You also have access to the dark web, allowing you to buy illegal goods or information anonymously.",
    "features": [{
      "name": "Backdoor Access",
      "description": "You can bypass any mundane or low-level magical security system given time. You also have access to the dark web, allowing you to buy illegal goods or information anonymously."
    }],
    "personality_traits": [
      "I speak in internet slang and l33tspeak.",
      "I am intensely paranoid about surveillance.",
      "I prefer the company of machines to people.",
      "I am incredibly arrogant about my intellect.",
      "I tap my fingers rhythmically as if typing.",
      "I rarely make eye contact, preferring to look at a screen."
    ],
    "ideals": [
      "Information. All data wants to be free. (Chaotic)",
      "Truth. I expose the lies of the mega-guilds. (Good)",
      "Profit. I sell corporate secrets to the highest bidder. (Evil)",
      "Logic. The world is just a system waiting to be optimized. (Lawful)",
      "Anonymity. I am a ghost; I exist only in the code. (Neutral)",
      "Power. Controlling the flow of information is true power. (Any)"
    ],
    "bonds": [
      "I am trying to hack the Hunter Association's deepest database.",
      "I am fiercely loyal to my online hacker collective.",
      "I am blackmailing a corrupt Guild Master.",
      "I am running from a corporate hit squad I stole from.",
      "I want to find the true origin of the gates hidden in the code.",
      "I am searching for my sibling who was 'deleted' by the government."
    ],
    "flaws": [
      "I am deeply anti-social and struggle to communicate.",
      "I am incredibly physically unfit.",
      "I suffer from a severe superiority complex.",
      "I will risk the mission to steal valuable data.",
      "I am intensely paranoid and trust no one.",
      "I view people as NPCs in my game."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-29",
    "name": "Social Media Influencer",
    "type": "background",
    "rank": "C",
    "description": "You are famous for being famous. You don't necessarily have a specific talent like singing or sports, but you have millions of followers who hang on your every word. Your awakening was the ultimate content opportunity.",
    "skill_proficiencies": [
      "Persuasion",
      "Deception"
    ],
    "tool_proficiencies": [
      "Disguise Kit",
      "Calligrapher's Supplies"
    ],
    "languages": [
      "One additional language"
    ],
    "equipment": [
      "A high-end smartphone",
      "A portable makeup kit",
      "Fashionable, impractical clothes",
      "A ring light",
      "A business card for a PR firm"
    ],
    "starting_credits": 1000,
    "feature_name": "Cancel Culture",
    "feature_description": "You know how to manipulate public perception. You can easily start a viral rumor or trend that will sway public opinion against a specific person or guild within a day, causing them social or bureaucratic difficulties.",
    "features": [{
      "name": "Cancel Culture",
      "description": "You know how to manipulate public perception. You can easily start a viral rumor or trend that will sway public opinion against a specific person or guild within a day, causing them social or bureaucratic difficulties."
    }],
    "personality_traits": [
      "I refer to everything in terms of 'aesthetics' and 'vibes'.",
      "I am constantly taking selfies.",
      "I am incredibly superficial.",
      "I speak in hashtags and buzzwords.",
      "I am fiercely protective of my 'brand'.",
      "I treat everyone as a potential networking opportunity."
    ],
    "ideals": [
      "Fame. I want everyone to know my name. (Any)",
      "Influence. I want to dictate what is popular and what is not. (Evil)",
      "Positivity. I want to spread good vibes and happiness. (Good)",
      "Wealth. I am here for the sponsorships. (Neutral)",
      "Drama. I thrive on conflict and tea. (Chaotic)",
      "Image. I must maintain a flawless public persona. (Lawful)"
    ],
    "bonds": [
      "I am trying to secure a sponsorship from the largest mega-guild.",
      "I am fiercely loyal to my core group of followers.",
      "I am engaged in a bitter feud with a rival influencer.",
      "I am hiding a massive scandal that would ruin my career.",
      "I want to prove I am more than just a pretty face.",
      "I am secretly funding a charity for victims of gate breaks."
    ],
    "flaws": [
      "I am incredibly vain and shallow.",
      "I will betray anyone for a boost in followers.",
      "I am completely dependent on the approval of strangers.",
      "I am a compulsive liar who exaggerates everything.",
      "I panic if I don't have internet access.",
      "I am terrified of being irrelevant."
    ],
    "source": "Rift Compendium"
  },
  {
    "id": "b-30",
    "name": "E-Sports Champion",
    "type": "background",
    "rank": "B",
    "description": "You were a professional gamer with inhuman reaction times and APM (Actions Per Minute). When you awakened, those skills translated perfectly to dodging monster attacks and managing cooldowns. You treat dungeon dives like an MMORPG raid.",
    "skill_proficiencies": [
      "Insight",
      "Perception"
    ],
    "tool_proficiencies": [
      "Gaming Set",
      "Tinker's Tools"
    ],
    "languages": [
      "Korean (or another language common in E-Sports)"
    ],
    "equipment": [
      "A high-end gaming headset",
      "A mechanical keyboard (modified into a weapon or focus)",
      "A team jersey",
      "Energy drinks",
      "A mousepad"
    ],
    "starting_credits": 800,
    "feature_name": "APM Mastery",
    "feature_description": "Your hand-eye coordination is legendary. You excel at fine motor tasks under extreme pressure, and you can instantly memorize the precise layout of any digital or physical interface you see.",
    "features": [{
      "name": "APM Mastery",
      "description": "Your hand-eye coordination is legendary. You excel at fine motor tasks under extreme pressure, and you can instantly memorize the precise layout of any digital or physical interface you see."
    }],
    "personality_traits": [
      "I refer to combat situations using gaming terms (aggro, DPS, wiping).",
      "I am highly competitive and hate losing.",
      "I drink copious amounts of energy drinks.",
      "I have incredibly fast, twitchy reflexes.",
      "I trash-talk enemies during combat.",
      "I am analytical, calculating probabilities in my head."
    ],
    "ideals": [
      "Victory. I play to win, and I am the best. (Any)",
      "Teamwork. A well-coordinated team can defeat any boss. (Lawful)",
      "Glory. I want my name on the top of the leaderboards. (Chaotic)",
      "Wealth. The prize money is what matters. (Neutral)",
      "Protection. I will 'carry' my weaker teammates to safety. (Good)",
      "Dominance. I want to crush my opponents and humiliate them. (Evil)"
    ],
    "bonds": [
      "I am trying to lead my team to the World Championship of Guilds.",
      "I am fiercely loyal to my former E-Sports teammates.",
      "I have a bitter rivalry with another top-ranked Hunter/Gamer.",
      "I am trying to secure a massive sponsorship deal.",
      "I want to prove that gamers make the best Hunters.",
      "I am searching for a 'glitch' or exploit in the gate system."
    ],
    "flaws": [
      "I am incredibly arrogant and rage when things go wrong.",
      "I view people as NPCs or 'noobs'.",
      "I struggle to take the danger of the rifts seriously.",
      "I have a terrible diet and sleep schedule.",
      "I will ignore the plan if I think I can make a 'big play'.",
      "I am highly susceptible to bait and taunts."
    ],
    "source": "Rift Compendium"
  }
];
