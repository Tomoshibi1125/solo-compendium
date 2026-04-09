// Expanded Backgrounds — Modern-Day Earth Careers (Pre-Awakening)

export const expandedBackgrounds = [
	{
		id: "paramedic",
		name: "Paramedic",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Medicine", "Athletics"],
		tool_proficiencies: ["Healer's Kit"],
		languages: ["English", "Spanish"],
		equipment: [
			"An emergency medical responder uniform",
			"A first-aid trauma kit",
			"A worn pager that still buzzes with phantom alerts",
			"A pouch containing 15 Credits",
		],
		features: [
			{
				name: "Triage Instinct",
				description:
					"You can assess the severity of a creature's injuries at a glance. As a bonus action, you can determine how many hit points a creature within 30 feet has remaining (above or below half). Additionally, when you stabilize a creature, they regain 1 hit point instead of 0.",
			},
			{
				name: "First on Scene",
				description:
					"You are accustomed to chaos and trauma. You have advantage on saving throws against being frightened, and you can administer a Healer's Kit as a bonus action instead of an action.",
			},
		],
		personalityTraits: [
			"I stay eerily calm when everyone else is panicking—I've seen worse.",
			"I assess everyone I meet for signs of injury or distress out of habit.",
			"I carry supplies for every possible emergency, even when it's impractical.",
			"I use dark humor to cope with the horrors I've witnessed.",
		],
		ideals: [
			"Compassion. Every life matters, regardless of who they are. (Good)",
			"Duty. Someone has to run toward the danger. Might as well be me. (Lawful)",
			"Pragmatism. Save who you can. Mourn later. (Neutral)",
			"Defiance. Death doesn't get to decide—I do. (Chaotic)",
		],
		bonds: [
			"I lost a partner in the ambulance during the first gate break—I carry their badge.",
			"A patient I saved turned out to be a high-rank ascendant who now looks out for me.",
			"I still feel responsible for the people I couldn't save at Seoul General Hospital.",
			"My old EMT crew still operates in the field—I check in on them when I can.",
		],
		flaws: [
			"I push myself past my limits and collapse when the adrenaline wears off.",
			"I can't walk away from someone in pain, even when it puts the mission at risk.",
			"I've started self-medicating to deal with the nightmares.",
			"I freeze momentarily when I hear sirens—it brings back the worst day.",
		],
		image: "/generated/compendium/backgrounds/paramedic.webp",
		description:
			"You spent years rushing toward emergencies while everyone else ran away. When gates started opening across the city, you were among the first responders on scene. The carnage was unlike anything in your training, but you adapted—you always do.",
		dangers: ["Compassion Fatigue", "Trauma Response", "Overextension"],
		source: "Rift Ascendant Canon",
		lore: "First responders were among the earliest non-combatant awakened, their survival instincts honed by years of life-or-death decisions under pressure.",
		flavor: "The steady hands that held the line when the world cracked open.",
		mechanics: {},
	},
	{
		id: "office-worker",
		name: "Office Worker",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Investigation", "Persuasion"],
		tool_proficiencies: ["Computers"],
		languages: ["English", "Korean"],
		equipment: [
			"A crumpled business suit",
			"A laptop with a cracked screen",
			"A company ID badge from a dissolved corporation",
			"A pouch containing 20 Credits",
		],
		features: [
			{
				name: "Bureaucratic Navigation",
				description:
					"You instinctively understand organizational hierarchies and paperwork. You have advantage on Intelligence checks to navigate bureaucratic systems, forge documents, or find loopholes in regulations. Government offices and guild administrative centers process your requests twice as fast.",
			},
			{
				name: "Corporate Survivor",
				description:
					"Years of office politics taught you to read people. You have advantage on Insight checks to determine if someone is lying or withholding information during formal negotiations or meetings.",
			},
		],
		personalityTraits: [
			"I make spreadsheets and checklists for everything, including dungeon raids.",
			"I still dress professionally, even when headed into a rift.",
			"I instinctively schedule meetings and create agendas for party planning sessions.",
			"I'm passive-aggressive when people don't follow the agreed-upon plan.",
		],
		ideals: [
			"Structure. A clear plan with defined roles gets results. (Lawful)",
			"Adaptability. The old world's rules are gone—time to write new ones. (Chaotic)",
			"Ambition. I was a nobody in a cubicle. Never again. (Neutral)",
			"Community. We survived the corporate collapse together—that means something. (Good)",
		],
		bonds: [
			"My entire floor was trapped when a gate opened in the parking garage. I got them out.",
			"My old boss awakened before I did and now leads a powerful guild. I want to prove I'm their equal.",
			"I keep my old employee handbook as a reminder of how small my world used to be.",
			"The severance package I never received could fund my ascendant career if I find the right lawyer.",
		],
		flaws: [
			"I overthink everything and miss opportunities while analyzing.",
			"I have a deep-seated need for external validation and approval.",
			"I'm terrified of physical confrontation—I spent my life avoiding it.",
			"I default to 'corporate speak' under stress, which confuses and annoys my allies.",
		],
		image: "/generated/compendium/backgrounds/office-worker.webp",
		description:
			"You spent your days in a climate-controlled office, navigating spreadsheets and email chains. Then the world broke open and your cubicle dissolved into aetheric fire. The skills that made you a reliable employee—attention to detail, pattern recognition, and sheer stubbornness—turned out to be exactly what the System values.",
		dangers: ["Analysis Paralysis", "Imposter Syndrome", "Physical Fragility"],
		source: "Rift Ascendant Canon",
		lore: "The System does not discriminate. Some of its most powerful ascendants emerged from the most mundane of origins.",
		flavor: "The pivot table that shattered reality.",
		mechanics: {},
	},
	{
		id: "construction-worker",
		name: "Construction Worker",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Athletics", "Perception"],
		tool_proficiencies: ["Mason's Tools"],
		languages: ["English", "Portuguese"],
		equipment: [
			"A high-visibility safety vest (reinforced)",
			"A well-worn hard hat with dents from falling debris",
			"A heavy-duty multi-tool",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Structural Awareness",
				description:
					"You can instinctively assess the structural integrity of a building, cave, or gate environment. You have advantage on Intelligence (Investigation) checks to identify weak points in structures, and you can determine if a floor, wall, or ceiling is at risk of collapse within 60 feet.",
			},
			{
				name: "Heavy Lifter",
				description:
					"Years of manual labor have hardened your body. Your carrying capacity is doubled, and you count as one size larger for the purposes of grappling and shoving.",
			},
		],
		personalityTraits: [
			"I size up every room for load-bearing walls and structural weaknesses.",
			"I work best with my hands—give me a tool and a problem, and I'm happy.",
			"I have zero patience for people who can't pull their own weight.",
			"I wake up at 5 AM no matter what. Decades of habit.",
		],
		ideals: [
			"Hard Work. Nothing worth having comes easy. (Neutral)",
			"Protection. I build things that keep people safe. (Good)",
			"Pride. I don't do half-measures. Everything I make is built to last. (Lawful)",
			"Opportunity. The rifts tore down the old world—now I get to build the new one. (Any)",
		],
		bonds: [
			"My crew from the construction site awakened together. We fight together now.",
			"I was building a high-rise when the first gate opened beneath the foundation. I still hear the screams.",
			"I promised my family I'd build them a safe place in this new world.",
			"My union rep turned out to be a guild recruiter. I owe them for the heads-up.",
		],
		flaws: [
			"I'm stubborn to a fault—once I start a task, I refuse to quit even when I should.",
			"I look down on people who've never done physical labor.",
			"I drink too much after a hard day and say things I regret.",
			"I trust tools and materials more than people.",
		],
		image: "/generated/compendium/backgrounds/construction-worker.webp",
		description:
			"You spent your career erecting buildings, pouring foundations, and working with heavy machinery. When the first gates opened and the city's infrastructure began to collapse, you were one of the few who understood how to navigate crumbling urban environments and improvise solutions under pressure.",
		dangers: [
			"Physical Overexertion",
			"Environmental Collapse",
			"Old Injuries",
		],
		source: "Rift Ascendant Canon",
		lore: "The city's reconstruction efforts after the early gate breaks relied heavily on awakened construction workers who could operate in aetherically unstable zones.",
		flavor: "Steel-toed boots on shattered asphalt. The foundation holds.",
		mechanics: {},
	},
	{
		id: "journalist",
		name: "Journalist",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Investigation", "Insight"],
		tool_proficiencies: ["Cameras & Recording Equipment"],
		languages: ["English", "Japanese"],
		equipment: [
			"A weathered press badge",
			"A digital voice recorder with hours of gate-break interviews",
			"A notebook filled with contacts and encrypted notes",
			"A pouch containing 15 Credits",
		],
		features: [
			{
				name: "Press Credentials",
				description:
					"Your reputation as a journalist grants you access to restricted areas and events that others cannot enter. Officials, guild leaders, and government personnel are more likely to speak with you, though they may guard their words. You have advantage on Charisma (Persuasion) checks when requesting access or information from authority figures.",
			},
			{
				name: "Nose for the Story",
				description:
					"You can sense when someone is hiding something. When you spend at least 1 minute observing or interacting with a creature, you can determine one of the following: whether they are lying, whether they are afraid, or whether they are concealing a specific object or piece of information.",
			},
		],
		personalityTraits: [
			"I record everything—conversations, combat encounters, even my dreams.",
			"I ask too many questions, especially when people clearly don't want to answer.",
			"I believe the truth matters more than anyone's feelings, including my own.",
			"I narrate events in my head as if writing an article.",
		],
		ideals: [
			"Truth. The public deserves to know what's really happening. (Good)",
			"Fame. The story of a lifetime is waiting in the next gate. (Chaotic)",
			"Accountability. The guilds and agencies must answer for their failures. (Lawful)",
			"Survival. You can't report the story if you're dead. (Neutral)",
		],
		bonds: [
			"My editor was killed during a gate-break broadcast. I continue their work.",
			"I have footage of a high-ranking guild leader committing a crime. It's my insurance.",
			"A hunter saved my life during a field report. I owe them a debt I can't repay.",
			"I'm writing the definitive account of the awakening. It has to be perfect.",
		],
		flaws: [
			"I put a good story above my personal safety.",
			"I can't resist provoking powerful people to see their honest reaction.",
			"I trust my own perception too much and dismiss others' warnings.",
			"I've burned bridges with sources by publishing things they told me in confidence.",
		],
		image: "/generated/compendium/backgrounds/journalist.webp",
		description:
			"You were there when the first gates opened, camera rolling, asking the questions no one else dared to ask. While most reporters fled the danger zones, you stayed, documenting the chaos that would reshape civilization. Your byline became synonymous with frontline reporting from the threshold of dimensional rifts.",
		dangers: [
			"Targeted by Powerful Interests",
			"Exposure Addiction",
			"Trust Issues",
		],
		source: "Rift Ascendant Canon",
		lore: "The first generation of 'Rift Journalists' became essential to public understanding of the awakening phenomenon, though many paid the ultimate price for their scoops.",
		flavor: "The camera doesn't lie. Neither do I.",
		mechanics: {},
	},
	{
		id: "street-vendor",
		name: "Street Vendor",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Persuasion", "Sleight of Hand"],
		tool_proficiencies: ["Cook's Utensils"],
		languages: ["English", "Mandarin"],
		equipment: [
			"A collapsible market stall frame",
			"A lucky coin from your first sale",
			"A dog-eared ledger of regular customers",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Market Instinct",
				description:
					"You have an innate sense of an item's value and can quickly appraise goods, including rift loot and rune materials. You have advantage on Intelligence checks to determine the value of objects, and you can find a buyer or seller for common goods in any settlement within 1 hour.",
			},
			{
				name: "Street Smarts",
				description:
					"You know the rhythm of the city. You cannot become lost in urban environments, and you have advantage on Survival checks to navigate cities, find shortcuts, or locate hidden market stalls and black-market dealers.",
			},
		],
		personalityTraits: [
			"I haggle over everything—it's not about the money, it's about the principle.",
			"I can spot a tourist or a mark from fifty meters away.",
			"I always carry snacks. Always. You never know when you'll need to bribe someone with food.",
			"I make friends with everyone—especially the people others overlook.",
		],
		ideals: [
			"Enterprise. Every crisis is an opportunity if you look at it right. (Neutral)",
			"Generosity. I feed the hungry and charge the wealthy double. (Good)",
			"Independence. I answer to no guild, no boss, no system. (Chaotic)",
			"Reliability. I show up every day, rain or rift-storm. (Lawful)",
		],
		bonds: [
			"The night market district was my home. I'll rebuild it no matter what.",
			"A regular customer turned out to be a guild recruiter who saw my potential.",
			"I owe money to someone dangerous, and the debt is growing.",
			"My grandmother's recipe book survived the gate-break. It's all I have of her.",
		],
		flaws: [
			"I hoard resources obsessively—old habits from lean times.",
			"I trust anyone who buys from me, even when I shouldn't.",
			"I can't resist a sale, even in life-threatening situations.",
			"I sometimes sell things that aren't strictly mine to sell.",
		],
		image: "/generated/compendium/backgrounds/street-vendor.webp",
		description:
			"You worked the markets and street corners, selling everything from hot food to knockoff electronics. When the gates opened and the economy collapsed, you adapted faster than anyone—because survival has always been about knowing what people need and getting it to them before anyone else.",
		dangers: [
			"Criminal Connections",
			"Debt Collectors",
			"Territorial Disputes",
		],
		source: "Rift Ascendant Canon",
		lore: "The post-gate economy created a massive demand for rift materials, and street vendors were among the first to establish the informal trade networks that would become the modern ascendant marketplace.",
		flavor: "Five Credits. Final offer. Take it or leave it.",
		mechanics: {},
	},
	{
		id: "security-guard",
		name: "Security Guard",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Perception", "Intimidation"],
		tool_proficiencies: ["Security Systems"],
		languages: ["English", "Korean"],
		equipment: [
			"A private security uniform (reinforced)",
			"A heavy-duty flashlight that doubles as a baton",
			"A worn security radio that picks up guild frequencies",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Watchful Eye",
				description:
					"You have advantage on Perception checks to detect hidden creatures or traps within 30 feet. Additionally, you cannot be surprised while you are conscious, as years of night shifts have trained you to always sleep with one eye open.",
			},
			{
				name: "Authority Presence",
				description:
					"Your bearing and uniform command a degree of respect. You have advantage on Intimidation checks against non-hostile NPCs, and common citizens will generally defer to your instructions during emergencies.",
			},
		],
		personalityTraits: [
			"I position myself with my back to the wall and a clear line of sight to exits.",
			"I patrol any location I stay in for more than an hour—old habits die hard.",
			"I challenge strangers who look out of place, even when it's not my job anymore.",
			"I keep a detailed mental log of everyone who enters and exits a room.",
		],
		ideals: [
			"Vigilance. Threats don't announce themselves. You have to be ready. (Lawful)",
			"Protection. I guard the people who can't guard themselves. (Good)",
			"Authority. People need someone to tell them what to do in a crisis. (Neutral)",
			"Justice. I've seen too many crimes go unpunished. Not on my watch. (Chaotic)",
		],
		bonds: [
			"I was guarding a corporate building when a gate opened inside. I held the line while civilians evacuated.",
			"My partner was killed by a rift creature on what should have been a routine shift.",
			"The company I worked for used me as expendable muscle. I'll never let anyone use me again.",
			"I still check in on the tenants of the building I used to guard.",
		],
		flaws: [
			"I'm hypervigilant to the point of paranoia.",
			"I have trouble distinguishing between actual threats and minor inconveniences.",
			"I enforce rules that no longer exist because structure keeps me sane.",
			"I sometimes use excessive force because I'm terrified of being too slow.",
		],
		image: "/generated/compendium/backgrounds/security-guard.webp",
		description:
			"You spent long nights watching cameras, walking perimeters, and dealing with minor disturbances. Then the gates opened and your cardboard-thin sense of security was destroyed. But the instincts you built—the watchfulness, the territorial awareness, the refusal to let anything get past you—those translated perfectly to a world under siege.",
		dangers: ["Hypervigilance Burnout", "Authority Conflicts", "PTSD"],
		source: "Rift Ascendant Canon",
		lore: "Post-gate, private security became one of the most dangerous and in-demand professions. Many guards who survived the early breaks were among the first to be recruited by hunter guilds.",
		flavor: "Nothing gets past me. Not anymore.",
		mechanics: {},
	},
	{
		id: "delivery-driver",
		name: "Delivery Driver",
		type: "Background",
		rank: "D",
		skill_proficiencies: ["Acrobatics", "Survival"],
		tool_proficiencies: ["Vehicles (Land)"],
		languages: ["English", "Hindi"],
		equipment: [
			"A battered delivery uniform with reflective strips",
			"A GPS device jury-rigged for gate-zone navigation",
			"A thermal bag that keeps rift potions cold",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Urban Navigator",
				description:
					"You know the city's roads, alleys, and shortcuts better than anyone. You have advantage on Survival checks to navigate urban environments, and you can find the fastest route between any two points in a city you've worked in, even through gate-damaged zones.",
			},
			{
				name: "Quick Drop",
				description:
					"You're used to making hand-offs under pressure. You can use a bonus action to give an item to an ally within 5 feet, or to retrieve a stored item from your pack.",
			},
		],
		personalityTraits: [
			"I know every shortcut, back alley, and rooftop path in the city.",
			"I talk to myself while navigating—narrating turns and landmarks.",
			"I get anxious when I'm standing still for too long.",
			"I rate every location on a five-star system, including dungeons.",
		],
		ideals: [
			"Speed. Getting there first is everything. (Chaotic)",
			"Reliability. People depend on me. I don't let them down. (Lawful)",
			"Freedom. The open road is the only place I feel alive. (Neutral)",
			"Service. Everyone deserves to have their needs met, no matter where they live. (Good)",
		],
		bonds: [
			"I was mid-delivery when the gate opened on my route. I finished the delivery anyway.",
			"A customer tipped me with a rift crystal that changed my life.",
			"My bike was destroyed by a rift creature. I'm still looking for a replacement worthy of it.",
			"I still deliver supplies to isolated communities that the guilds have forgotten.",
		],
		flaws: [
			"I take unnecessary risks to save time.",
			"I have no sense of personal space or boundaries—I'm used to cramped vehicles.",
			"I get lost in buildings because I only know the city from street level.",
			"I can't say no to a delivery request, no matter how dangerous the destination.",
		],
		image: "/generated/compendium/backgrounds/delivery-driver.webp",
		description:
			"You navigated gridlocked streets, hostile neighborhoods, and impossible deadlines for a living. When the gates shattered the city's infrastructure, you became one of the few people who could still move through the chaos. Your knowledge of every back route and service entrance makes you invaluable in urban rift operations.",
		dangers: ["Traffic Hazards", "Rift Zone Navigation", "Exhaustion"],
		source: "Rift Ascendant Canon",
		lore: "During the infrastructure collapse following the first major gate breaks, delivery drivers and couriers became critical to civilian survival, running supply lines through rift-damaged sectors.",
		flavor: "Rain, shine, or dimensional collapse. Package delivered.",
		mechanics: {},
	},
	{
		id: "teacher",
		name: "Teacher",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["History", "Persuasion"],
		tool_proficiencies: ["Calligrapher's Supplies"],
		languages: ["English", "French"],
		equipment: [
			"A leather satchel with a class roster from a school that no longer exists",
			"A red pen (habit)",
			"A worn textbook on world history, now painfully ironic",
			"A pouch containing 15 Credits",
		],
		features: [
			{
				name: "Educator's Patience",
				description:
					"You can teach a new tool proficiency or language to a willing creature during downtime in half the normal time. Additionally, when you use the Help action to assist an ally with an ability check, they gain a +3 bonus instead of advantage.",
			},
			{
				name: "Commanding Presence",
				description:
					"Years of controlling a classroom have given you a voice that cuts through chaos. Once per short rest, you can use a bonus action to shout a clear command, granting one ally within 60 feet advantage on their next saving throw against being charmed or frightened.",
			},
		],
		personalityTraits: [
			"I explain things as if everyone around me is a student. Most of them act like it.",
			"I grade threats on a curve—some anomalies are merely disappointing.",
			"I collect books compulsively. Knowledge is the only weapon that never breaks.",
			"I still give pop quizzes. Preparedness saves lives.",
		],
		ideals: [
			"Knowledge. Understanding the world is the only real power. (Neutral)",
			"Mentorship. The next generation needs guides, not just fighters. (Good)",
			"Discipline. Rules exist for a reason, especially in dangerous situations. (Lawful)",
			"Curiosity. The rifts contain knowledge humanity has never encountered. (Any)",
		],
		bonds: [
			"My students were trapped in the school when a gate opened. I got most of them out.",
			"I'm compiling a textbook on rift phenomena for the next generation of ascendants.",
			"A former student became a dangerous rogue ascendant. I feel responsible.",
			"The school system collapsed, but I still teach anyone willing to learn.",
		],
		flaws: [
			"I lecture people when they make mistakes instead of just helping.",
			"I have difficulty accepting that I don't have all the answers.",
			"I'm protective to the point of being controlling.",
			"I grade people silently in my head and it affects how I treat them.",
		],
		image: "/generated/compendium/backgrounds/teacher.webp",
		description:
			"You shaped young minds, managed chaos in a classroom, and made the mundane feel meaningful. When the System activated and your school became a gate zone, the same qualities that made you a great teacher—patience, authority, and the refusal to leave anyone behind—made you a natural leader in the new world.",
		dangers: ["Overprotectiveness", "Emotional Exhaustion", "Guilt"],
		source: "Rift Ascendant Canon",
		lore: "The Ascendant Academy's early curriculum was designed primarily by awakened teachers who recognized that combat training without education produced dangerous, unstable hunters.",
		flavor: "Class is in session. Today's lesson: survival.",
		mechanics: {},
	},
	{
		id: "mechanic",
		name: "Mechanic",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Investigation", "Athletics"],
		tool_proficiencies: ["Tinker's Tools"],
		languages: ["English", "German"],
		equipment: [
			"Oil-stained coveralls (surprisingly durable)",
			"A portable toolbox with rune-modified wrenches",
			"A diagnostic scanner that sometimes picks up aetheric frequencies",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Mechanical Intuition",
				description:
					"You can spend 10 minutes examining any mechanical device, construct, or magitech artifact to determine its purpose, how it works, and any flaws in its design. You have advantage on Intelligence checks to repair, disable, or jury-rig mechanical or technological devices.",
			},
			{
				name: "Improvised Engineering",
				description:
					"You can create temporary tools or devices from salvaged materials. During a short rest, you can construct one of the following: a simple trap (DC 12), a crude explosive (2d6 fire damage, 5-foot radius), or a barricade that provides half cover.",
			},
		],
		personalityTraits: [
			"I take things apart to understand them—sometimes without permission.",
			"I describe everything in terms of systems and components.",
			"My hands are never clean, and I'm proud of it.",
			"I trust machines more than people. Machines don't lie.",
		],
		ideals: [
			"Innovation. If it can be built, it can be built better. (Chaotic)",
			"Reliability. A machine that fails kills people. I don't build machines that fail. (Lawful)",
			"Self-Reliance. I fix my own problems. Everyone else should too. (Neutral)",
			"Progress. The fusion of technology and rift energy will change everything. (Any)",
		],
		bonds: [
			"My garage was destroyed by a gate break. My tools are all I have left.",
			"An ascendant guild hired me to maintain their equipment. Now I fight alongside them.",
			"I'm building something that could change how hunters interact with rifts—if I can finish it.",
			"My apprentice awakened before I did. I won't let them outpace me.",
		],
		flaws: [
			"I obsess over broken things and can't leave a problem unsolved.",
			"I hoard parts and materials like a dragon hoards gold.",
			"I dismiss anything that can't be explained mechanically.",
			"I neglect my own well-being when absorbed in a project.",
		],
		image: "/generated/compendium/backgrounds/mechanic.webp",
		description:
			"You kept the city running—fixing engines, rewiring circuits, and keeping machines alive past their expiration date. When gates started tearing through the infrastructure and magitech began proliferating, your skills became critical. You can repair anything, build anything, and break anything.",
		dangers: ["Obsessive Focus", "Explosive Materials", "Magitech Instability"],
		source: "Rift Ascendant Canon",
		lore: "As rift-infused technology became commonplace, mechanics who could work with both conventional and aetheric systems became some of the most valuable non-combat specialists in the ascendant world.",
		flavor: "Give me ten minutes and a wrench. I'll fix anything.",
		mechanics: {},
	},
	{
		id: "firefighter",
		name: "Firefighter",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Athletics", "Perception"],
		tool_proficiencies: ["Rescue Equipment"],
		languages: ["English", "Russian"],
		equipment: [
			"A fire-resistant tactical jacket (guild-reinforced)",
			"A halligan bar (improvised weapon, 1d8 bludgeoning)",
			"A department radio modified for gate-zone frequencies",
			"A pouch containing 10 Credits",
		],
		features: [
			{
				name: "Smoke Eater",
				description:
					"You have resistance to fire damage from non-magical sources, and you can hold your breath for twice as long as normal. You have advantage on Constitution saving throws against inhaled poisons, smoke, and airborne hazards.",
			},
			{
				name: "Breach and Clear",
				description:
					"You can force open locked or stuck doors and gates as a bonus action instead of an action, and you can break through non-magical barriers of wood, glass, or light stone without requiring a Strength check.",
			},
		],
		personalityTraits: [
			"I run toward fires—literal and metaphorical.",
			"I instinctively look for exits and fire escapes in every building.",
			"I check every room for occupants before moving on—no one gets left behind.",
			"I can't sit still. Idle time feels like wasted time.",
		],
		ideals: [
			"Courage. Fear is natural. Running toward it anyway is duty. (Good)",
			"Brotherhood. The crew is everything. You fight for the person next to you. (Lawful)",
			"Sacrifice. Someone has to bear the cost. I'd rather it be me. (Good)",
			"Adrenaline. The rush of the job is the only thing that makes me feel alive. (Chaotic)",
		],
		bonds: [
			"My station house was the first building reinforced against gate breaches. It's still standing.",
			"I carried a child out of a burning building that was also a gate threshold. They awakened that night.",
			"My captain died holding a gate creature back so the team could evacuate. I carry their helmet.",
			"The fire department disbanded, but the crew still answers when I call.",
		],
		flaws: [
			"I have a savior complex that puts me in unnecessary danger.",
			"I can't stand being in charge—I work best when someone else gives orders.",
			"I'm haunted by the calls I couldn't make in time.",
			"I sometimes confuse bravery with recklessness.",
		],
		image: "/generated/compendium/backgrounds/firefighter.webp",
		description:
			"You charged into burning buildings when everyone else ran out. When gates started opening across the city and spewing fire, acid, and worse, your department was on the front lines. The tools changed—halligan bars swapped for mana-reinforced axes—but the mission stayed the same: get people out alive.",
		dangers: ["Hero Complex", "Burn Scars", "Adrenaline Dependency"],
		source: "Rift Ascendant Canon",
		lore: "Fire departments across the globe were redesignated as first-response gate containment units. Those who survived the transition formed the backbone of civilian defense infrastructure.",
		flavor: "The fire doesn't scare me. What's behind it might.",
		mechanics: {},
	},
	{
		id: "social-worker",
		name: "Social Worker",
		type: "Background",
		rank: "C",
		skill_proficiencies: ["Insight", "Persuasion"],
		tool_proficiencies: ["Counseling Kit"],
		languages: ["English", "Arabic"],
		equipment: [
			"A worn case file binder (now used for anomaly reports)",
			"A government-issued ID that still opens some doors",
			"A pocket guide to crisis de-escalation",
			"A pouch containing 15 Credits",
		],
		features: [
			{
				name: "Crisis Counselor",
				description:
					"You can spend 10 minutes talking with a creature to remove the frightened condition from them, or to grant them advantage on their next Wisdom saving throw. This works once per creature per long rest.",
			},
			{
				name: "Community Network",
				description:
					"You have built an extensive network of contacts across all social strata. In any settlement, you can spend 1 hour to find a safe house, a trustworthy healer, or a reliable informant. You have advantage on Charisma checks to gain the trust of common folk and refugees.",
			},
		],
		personalityTraits: [
			"I listen more than I talk. People tell me things they wouldn't tell anyone else.",
			"I see the trauma behind every outburst and respond with understanding instead of anger.",
			"I keep immaculate case notes on everyone I encounter, including party members.",
			"I advocate for the voiceless, even when it makes me unpopular with the powerful.",
		],
		ideals: [
			"Empathy. Understanding someone's pain is the first step to helping them. (Good)",
			"Advocacy. The system fails people. I pick up the pieces. (Lawful)",
			"Pragmatism. You can't save everyone, but you can triage. (Neutral)",
			"Reform. The old institutions failed. We need new ones built on compassion. (Chaotic)",
		],
		bonds: [
			"I manage a refugee shelter in the gate-damaged quarter. Those people depend on me.",
			"A child I placed in foster care before the gates opened is now a powerful young ascendant.",
			"I carry a list of names—people I couldn't help in time.",
			"The bureaucrats who defunded my department are now running a guild. The irony isn't lost on me.",
		],
		flaws: [
			"I absorb other people's pain until it overwhelms me.",
			"I have trouble setting boundaries—I'll sacrifice my own needs for anyone.",
			"I am deeply cynical about institutions, even the ones trying to help.",
			"I sometimes manipulate people 'for their own good' without their consent.",
		],
		image: "/generated/compendium/backgrounds/social-worker.webp",
		description:
			"You spent your career navigating broken systems, advocating for the vulnerable, and holding people together through the worst moments of their lives. When the world broke open, the number of people who needed help skyrocketed—and you stepped up, just like you always have.",
		dangers: ["Compassion Fatigue", "Emotional Burnout", "Vicarious Trauma"],
		source: "Rift Ascendant Canon",
		lore: "In the aftermath of the first gate breaks, social workers and counselors were among the only professionals equipped to handle mass trauma response. Their skills proved essential to maintaining social cohesion.",
		flavor: "I see you. I hear you. Now let's get you somewhere safe.",
		mechanics: {},
	},
	{
		id: "police-officer",
		name: "Police Officer",
		type: "Background",
		rank: "B",
		skill_proficiencies: ["Investigation", "Athletics"],
		tool_proficiencies: ["Vehicles (Land)"],
		languages: ["English", "Spanish"],
		equipment: [
			"A reinforced tactical vest (department-issue, dented)",
			"A pair of mana-inert handcuffs",
			"A badge that carries weight with the Ascendant Bureau",
			"A pouch containing 15 Credits",
		],
		features: [
			{
				name: "Law Enforcement Training",
				description:
					"You have proficiency with improvised weapons and shields. When you take the Grapple action, you can use either Athletics or Acrobatics for the contest. Additionally, you have advantage on Intelligence checks to analyze crime scenes and track suspects.",
			},
			{
				name: "Miranda Protocol",
				description:
					"Your authoritative bearing compels cooperation. Once per short rest, you can issue a verbal command to a non-hostile creature that understands you. They must succeed on a Wisdom saving throw (DC 8 + your Proficiency bonus + your Presence modifier) or be compelled to stop what they're doing for 1 round.",
			},
		],
		personalityTraits: [
			"I introduce myself with my badge number before my name. Habit.",
			"I keep a mental profile of everyone I encounter—threat level, motivations, weaknesses.",
			"I de-escalate first. Violence is a last resort, not a first response.",
			"I write everything down. Documentation is accountability.",
		],
		ideals: [
			"Order. Society needs enforcers, now more than ever. (Lawful)",
			"Justice. The powerful can't be above the law—not even ascendants. (Good)",
			"Pragmatism. Sometimes you have to work outside the rules to get results. (Neutral)",
			"Redemption. I've seen the worst of human nature—and I still believe in second chances. (Good)",
		],
		bonds: [
			"My precinct was wiped out during the Seoul Gate Break. I'm the only survivor.",
			"I arrested an ascendant who turned out to be innocent. Finding the truth is my penance.",
			"My former partner became a corrupt guild enforcer. I'll bring them in someday.",
			"I swore an oath to protect and serve. Gates and monsters don't change that.",
		],
		flaws: [
			"I see the world in black and white—law-abiding or criminal. There's no middle ground.",
			"I have trust issues with authority after seeing corruption at every level.",
			"I use excessive force when I feel someone is threatening the innocent.",
			"I can't let go of unsolved cases, even when they're decades old.",
		],
		image: "/generated/compendium/backgrounds/police-officer.webp",
		description:
			"You walked a beat, responded to calls, and tried to keep order in a city slowly losing its grip on reality. When the gates opened and monsters poured into the streets, the thin blue line became even thinner. Most of your colleagues quit or died. You stayed, because someone had to.",
		dangers: ["Corruption Temptation", "PTSD", "Authority Conflicts"],
		source: "Rift Ascendant Canon",
		lore: "The traditional police force was largely absorbed into the Ascendant Bureau after the gate breaks, with awakened officers forming the core of the Bureau's enforcement division.",
		flavor: "Badge or no badge, the job doesn't change.",
		mechanics: {},
	},
];
