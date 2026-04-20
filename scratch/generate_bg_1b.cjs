const fs = require('fs');

const backgrounds = [
  {
    id: "b-21",
    name: "Mega-Guild Heir (Chaebol)",
    type: "background",
    rank: "A",
    description: "You are the scion of a massive corporate conglomerate that runs a top-tier Hunter Guild. You were born with a silver spoon and awakened with an S-Rank or A-Rank potential. The world expects you to lead, but you have yet to prove you're more than just nepotism.",
    skill_proficiencies: ["Persuasion", "History"],
    tool_proficiencies: ["Vehicles (Land)", "Gaming Set"],
    languages: ["Two additional languages"],
    equipment: ["Designer clothes", "A high-end sports car key (flavor)", "A gold-plated guild signet", "A flagship smartphone", "An expensive watch"],
    starting_credits: 5000,
    feature_name: "Corporate Nepotism",
    feature_description: "You have a massive trust fund and corporate backing. Once per week, you can requisition a piece of mundane equipment, a vehicle, or secure a meeting with any high-ranking official by dropping your family's name.",
    personality_traits: [
      "I expect people to open doors for me.",
      "I complain about the quality of food and accommodations.",
      "I am secretly terrified of failing my family.",
      "I throw money at problems to make them go away.",
      "I am incredibly charismatic and used to the camera.",
      "I am deeply naive about how the 'real world' works."
    ],
    ideals: [
      "Legacy. I must uphold the honor of my family's name. (Lawful)",
      "Power. My family rules the world; I am just taking my throne. (Evil)",
      "Responsibility. With great wealth comes a duty to protect the weak. (Good)",
      "Freedom. I want to escape my family's shadow and be my own person. (Chaotic)",
      "Success. The only metric that matters is the bottom line. (Neutral)",
      "Ego. I will prove I am the best, not just the richest. (Any)"
    ],
    bonds: [
      "I am fiercely loyal to my personal bodyguard/butler.",
      "I am trying to earn the respect of my cold, distant parent.",
      "I have a bitter rivalry with the heir of a competing mega-guild.",
      "I am secretly funding an illegal underground guild.",
      "I am engaged to someone for purely political/corporate reasons.",
      "I am desperately searching for a cure for my sibling's magical illness."
    ],
    flaws: [
      "I am incredibly arrogant and entitled.",
      "I have no concept of the value of money.",
      "I will throw a tantrum if I am publicly humiliated.",
      "I am easily manipulated by flattery.",
      "I am secretly a coward when my life is actually in danger.",
      "I rely completely on my gear and connections, not my skills."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-22",
    name: "Gate-Worshipping Cultist",
    type: "background",
    rank: "D",
    description: "You were a member of a doomsday cult that believes the Sovereigns and the rifts are divine judgments. You either escaped the cult when you awakened, or you are secretly still a member acting as a sleeper agent among the Hunters.",
    skill_proficiencies: ["Religion", "Deception"],
    tool_proficiencies: ["Disguise Kit", "Poisoner's Kit"],
    languages: ["One exotic language"],
    equipment: ["A hidden cult symbol", "Dark robes", "A sacrificial dagger", "A strange, humming piece of a gate", "A book of prophecies"],
    starting_credits: 200,
    feature_name: "Cult Sympathizers",
    feature_description: "You know the secret signs and phrases of the gate-cults. You can find safehouses, secure black-market healing, or gather rumors from cultists in any major city without being attacked.",
    personality_traits: [
      "I speak in apocalyptic prophecies and metaphors.",
      "I am intensely charismatic and persuasive.",
      "I stare unblinkingly at people.",
      "I am calm, even joyful, in the face of terrifying monsters.",
      "I constantly recite silent prayers.",
      "I am deeply secretive about my past."
    ],
    ideals: [
      "Devotion. The Sovereigns are gods; we must prepare for their arrival. (Evil)",
      "Redemption. I must atone for the horrific things I did in the cult. (Good)",
      "Nihilism. The world is ending; nothing matters but the rifts. (Chaotic)",
      "Order. The cult provides the only true structure in a broken world. (Lawful)",
      "Survival. I play whatever role keeps me alive. (Neutral)",
      "Truth. I must uncover the true nature of the Sovereigns. (Any)"
    ],
    bonds: [
      "I am hunting the cult leader who brainwashed me.",
      "I am trying to rescue my family who is still in the cult.",
      "I carry a prophecy that names me as the harbinger of the end.",
      "I am fiercely protective of another escapee.",
      "I owe my life to the Hunter who raided our compound.",
      "I am secretly preparing a ritual to summon a Sovereign."
    ],
    flaws: [
      "I suffer from severe delusions and hallucinations.",
      "I am completely devoid of empathy for non-believers.",
      "I will obey orders from high-ranking cultists instinctively.",
      "I am deeply paranoid that the cult is hunting me.",
      "I enjoy the suffering of others.",
      "I refuse to use modern medicine, relying only on mana."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-23",
    name: "Viral Streamer",
    type: "background",
    rank: "C",
    description: "You make your living broadcasting your life to millions. When the gates opened, you didn't run; you turned the camera on. You are an Awakened influencer who live-streams dungeon dives for superchats and sponsorships.",
    skill_proficiencies: ["Performance", "Acrobatics"],
    tool_proficiencies: ["Disguise Kit"],
    languages: ["One additional language"],
    equipment: ["A high-end floating drone camera", "A smartphone", "Flashy, branded combat gear", "A portable ring light", "A selfie stick"],
    starting_credits: 1000,
    feature_name: "Sponsored Content",
    feature_description: "You have a massive online following. Once per city, you can leverage your fanbase to secure free lodging, a distraction, or gather localized information via social media crowdsourcing.",
    personality_traits: [
      "I narrate my actions as if speaking to an audience.",
      "I am obsessed with my follower count and engagement metrics.",
      "I always prioritize getting a good angle over safety.",
      "I use internet slang constantly.",
      "I am incredibly chipper and energetic, even when exhausted.",
      "I view other Hunters as 'collabs' rather than teammates."
    ],
    ideals: [
      "Fame. The only thing worse than dying is being forgotten. (Any)",
      "Wealth. I am here for the sponsorships and superchats. (Neutral)",
      "Entertainment. The world is dark; I bring the light. (Good)",
      "Ego. I am the main character of reality. (Chaotic)",
      "Influence. With a million viewers, I can change the world. (Lawful)",
      "Exploitation. I will use my fans for whatever I need. (Evil)"
    ],
    bonds: [
      "I am trying to out-stream a bitter rival influencer.",
      "I owe everything to a dedicated mod who manages my life.",
      "I am hiding a dark secret that would ruin my career if exposed.",
      "I am desperately seeking a sponsor to pay off a massive debt.",
      "I want to document the ultimate S-Rank boss fight.",
      "I am trying to find a missing fan who disappeared in a gate."
    ],
    flaws: [
      "I will risk the lives of my party for a viral clip.",
      "I am deeply insecure and need constant validation.",
      "I am a narcissist who cannot handle criticism.",
      "I will leak sensitive guild information if it gets views.",
      "I am terrified of being 'canceled' or losing relevance.",
      "I struggle to distinguish my online persona from my real self."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-24",
    name: "K-Pop Idol",
    type: "background",
    rank: "B",
    description: "You were a manufactured pop star, trained for years to be perfect. Your awakening was a PR nightmare—or a PR miracle. Now, your agency manages your Hunter career, and you fight monsters while maintaining perfect choreography.",
    skill_proficiencies: ["Performance", "Persuasion"],
    tool_proficiencies: ["Musical Instrument", "Disguise Kit"],
    languages: ["Korean", "One additional language"],
    equipment: ["A microphone (can be a focus)", "Designer combat outfits", "A fan letter", "A compact mirror and makeup", "A pair of sunglasses"],
    starting_credits: 1500,
    feature_name: "Idol Aura",
    feature_description: "You are universally recognizable and adored. You can easily bypass security at clubs, hotels, and events, and fans will eagerly do small favors for you (like providing a disguise, a ride, or a distraction).",
    personality_traits: [
      "I strike a pose when I land a finishing blow.",
      "I am intensely disciplined and practice my 'routines' daily.",
      "I always smile, even when I am furious or in pain.",
      "I am deeply concerned with my diet and appearance.",
      "I treat my teammates like backup dancers.",
      "I speak to fans with rehearsed, syrupy sweetness."
    ],
    ideals: [
      "Perfection. I must be flawless in every aspect of my life. (Lawful)",
      "Inspiration. I fight to give my fans hope in a dark world. (Good)",
      "Fame. I want to be the most famous person on the planet. (Any)",
      "Control. I will break free from my agency's iron grip. (Chaotic)",
      "Wealth. I am a brand, and my brand is expensive. (Neutral)",
      "Manipulation. I use my charm to get exactly what I want. (Evil)"
    ],
    bonds: [
      "I am secretly dating a member of a rival idol group/guild.",
      "I am trapped in an abusive contract with my entertainment agency.",
      "I am fiercely protective of my sasaeng (obsessive) fans.",
      "I am trying to protect my younger sibling from the industry.",
      "I want to avenge a former bandmate who died in a gate.",
      "I carry a specific song lyric that holds the key to my awakening."
    ],
    flaws: [
      "I suffer from severe burnout and depression.",
      "I am anorexic or have severe body image issues.",
      "I will compromise a mission if it threatens my physical appearance.",
      "I am completely dependent on my manager for basic life skills.",
      "I am secretly incredibly cruel and vindictive behind closed doors.",
      "I panic if I lose my voice or damage my face."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-25",
    name: "Movie Star",
    type: "background",
    rank: "A",
    description: "You were an A-list celebrity, known across the globe for your blockbuster films. When you awakened, your studio immediately pivoted to funding your Hunter raids as live-action reality movies. You are the ultimate action star.",
    skill_proficiencies: ["Deception", "Performance"],
    tool_proficiencies: ["Disguise Kit", "Vehicles (Land)"],
    languages: ["One additional language"],
    equipment: ["A prop from your most famous movie", "A tailored suit or dress", "A pair of dark sunglasses", "A contract with a major studio", "A bottle of expensive champagne"],
    starting_credits: 2000,
    feature_name: "Star Power",
    feature_description: "Your fame opens doors that money cannot. You can secure VIP access, private transportation, and high-level meetings simply by virtue of being famous. People naturally defer to you in social situations.",
    personality_traits: [
      "I treat everything as a movie set and everyone as an extra.",
      "I demand a 'stunt double' for dangerous non-combat tasks.",
      "I speak in dramatic, rehearsed monologues.",
      "I am deeply concerned with my 'lighting' and angles.",
      "I name-drop famous people constantly.",
      "I am incredibly charming and charismatic."
    ],
    ideals: [
      "Legacy. I want to be remembered forever. (Any)",
      "Art. Combat is just another form of expression. (Chaotic)",
      "Image. My public perception is more important than reality. (Lawful)",
      "Heroism. I want to be the hero I play in the movies. (Good)",
      "Ego. I am the greatest talent of my generation. (Evil)",
      "Wealth. Blockbusters pay well, but S-Rank cores pay better. (Neutral)"
    ],
    bonds: [
      "I am trying to win an Oscar for 'Best Live-Action Raid'.",
      "I am fiercely protective of my long-suffering personal assistant.",
      "I am hiding a massive scandal that a tabloid journalist is blackmailing me with.",
      "I want to prove I'm a real Hunter, not just a studio plant.",
      "I am deeply in love with my co-star from a previous film.",
      "I carry a script for a movie I want to direct someday."
    ],
    flaws: [
      "I am incredibly vain and shallow.",
      "I am a diva who demands constant pampering.",
      "I will freeze if I don't know my 'lines'.",
      "I struggle to distinguish reality from fiction.",
      "I am addicted to painkillers or alcohol.",
      "I am terrified of aging or losing my looks."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-26",
    name: "Pro Athlete",
    type: "background",
    rank: "B",
    description: "You were at the peak of human physical performance before the awakening. You were an Olympian, a martial arts champion, or a star quarterback. Your awakening simply pushed your already superhuman body past the limits of physics.",
    skill_proficiencies: ["Athletics", "Acrobatics"],
    tool_proficiencies: ["Vehicles (Land)"],
    languages: ["One additional language"],
    equipment: ["A gold medal or championship ring", "High-end athletic wear", "A duffel bag", "A water bottle and protein supplements", "A jump rope"],
    starting_credits: 1000,
    feature_name: "Physical Specimen",
    feature_description: "Your athletic background gives you an intuitive understanding of physical limits. You can accurately gauge the physical strength and agility of any humanoid or monster by observing them move for 1 minute.",
    personality_traits: [
      "I stretch constantly and do calisthenics during downtime.",
      "I view combat purely as a sport with rules and scores.",
      "I am highly competitive and turn everything into a race.",
      "I speak in sports cliches and motivational quotes.",
      "I am intensely disciplined about my diet and training.",
      "I respect anyone who puts in the physical work."
    ],
    ideals: [
      "Competition. I want to test myself against the strongest monsters. (Chaotic)",
      "Discipline. Hard work beats talent when talent doesn't work hard. (Lawful)",
      "Victory. Winning isn't everything; it's the only thing. (Evil)",
      "Teamwork. There is no 'I' in 'Raid'. (Good)",
      "Glory. I want to be the #1 ranked Hunter in the world. (Any)",
      "Health. My body is a temple; I must protect it. (Neutral)"
    ],
    bonds: [
      "I am trying to win the 'Hunter Olympics' against rival guilds.",
      "I owe my success to a harsh but fair coach.",
      "I suffered a career-ending injury that my awakening healed; I must prove I'm still the best.",
      "I am fiercely loyal to my hometown team.",
      "I want to avenge a teammate who was killed in a gate.",
      "I carry the jersey of my childhood idol."
    ],
    flaws: [
      "I am an adrenaline junkie who takes unnecessary risks.",
      "I am incredibly arrogant about my physical superiority.",
      "I struggle to understand strategy or magic, relying purely on brawn.",
      "I am a sore loser who throws tantrums.",
      "I have a secret gambling debt.",
      "I will ignore injuries to stay in the game, endangering myself."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-27",
    name: "Corporate Executive",
    type: "background",
    rank: "S",
    description: "You are a shark in a tailored suit. You ran a Fortune 500 company before the gates, and when you awakened, you realized the true profit lay in mana crystals and guild acquisitions. You are a CEO, a board member, or a ruthless venture capitalist.",
    skill_proficiencies: ["Persuasion", "Insight"],
    tool_proficiencies: ["Calligrapher's Supplies", "Forgery Kit"],
    languages: ["Two additional languages"],
    equipment: ["A tailored Armani suit", "A platinum credit card", "A high-end smartwatch", "A briefcase of contracts", "A pen worth more than a car"],
    starting_credits: 3000,
    feature_name: "Hostile Takeover",
    feature_description: "You have massive financial leverage. You can secure vast loans, hire elite mercenary teams, or acquire properties and businesses instantly by throwing your corporate weight around.",
    personality_traits: [
      "I view people as assets or liabilities.",
      "I speak in calm, measured tones, even when threatening someone.",
      "I delegate all physical labor to subordinates.",
      "I am constantly checking the stock market and crystal prices.",
      "I negotiate aggressively for every single advantage.",
      "I dress impeccably in all situations."
    ],
    ideals: [
      "Profit. The bottom line is the only thing that matters. (Evil)",
      "Order. The corporate structure is the pinnacle of human achievement. (Lawful)",
      "Efficiency. Waste is a sin; I optimize everything. (Neutral)",
      "Power. I want to own the Hunter Association itself. (Any)",
      "Philanthropy. I use my wealth to rebuild cities destroyed by gates. (Good)",
      "Disruption. I break established markets to create new opportunities. (Chaotic)"
    ],
    bonds: [
      "I am trying to orchestrate a hostile takeover of a rival mega-guild.",
      "I am fiercely protective of my company's proprietary technology.",
      "I owe a massive debt to a shadowy cabal of investors.",
      "I want to secure a monopoly on S-Rank mana crystals.",
      "I am secretly funding a rogue research lab.",
      "I am trying to groom my disappointing child to take over the company."
    ],
    flaws: [
      "I am a ruthless sociopath who cares nothing for human life.",
      "I am physically cowardly and will flee if my bodyguards fall.",
      "I am obsessed with accumulating wealth.",
      "I will betray my closest allies for a 1% increase in profit.",
      "I am deeply paranoid about assassination attempts.",
      "I view myself as fundamentally superior to the working class."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-28",
    name: "Underground Hacker",
    type: "background",
    rank: "B",
    description: "You are a ghost in the machine. You grew up in the dark web, breaching corporate firewalls and stealing Association data. Your awakening enhanced your mind, allowing you to interface with technology and magic simultaneously.",
    skill_proficiencies: ["Investigation", "Sleight of Hand"],
    tool_proficiencies: ["Thieves' Tools", "Tinker's Tools"],
    languages: ["Machine Code (or one exotic language)"],
    equipment: ["A heavily modified laptop", "A set of lockpicks", "A burner phone", "A flash drive with encrypted blackmail", "A dark hoodie"],
    starting_credits: 800,
    feature_name: "Backdoor Access",
    feature_description: "You can bypass any mundane or low-level magical security system given time. You also have access to the dark web, allowing you to buy illegal goods or information anonymously.",
    personality_traits: [
      "I speak in internet slang and l33tspeak.",
      "I am intensely paranoid about surveillance.",
      "I prefer the company of machines to people.",
      "I am incredibly arrogant about my intellect.",
      "I tap my fingers rhythmically as if typing.",
      "I rarely make eye contact, preferring to look at a screen."
    ],
    ideals: [
      "Information. All data wants to be free. (Chaotic)",
      "Truth. I expose the lies of the mega-guilds. (Good)",
      "Profit. I sell corporate secrets to the highest bidder. (Evil)",
      "Logic. The world is just a system waiting to be optimized. (Lawful)",
      "Anonymity. I am a ghost; I exist only in the code. (Neutral)",
      "Power. Controlling the flow of information is true power. (Any)"
    ],
    bonds: [
      "I am trying to hack the Hunter Association's deepest database.",
      "I am fiercely loyal to my online hacker collective.",
      "I am blackmailing a corrupt Guild Master.",
      "I am running from a corporate hit squad I stole from.",
      "I want to find the true origin of the gates hidden in the code.",
      "I am searching for my sibling who was 'deleted' by the government."
    ],
    flaws: [
      "I am deeply anti-social and struggle to communicate.",
      "I am incredibly physically unfit.",
      "I suffer from a severe superiority complex.",
      "I will risk the mission to steal valuable data.",
      "I am intensely paranoid and trust no one.",
      "I view people as NPCs in my game."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-29",
    name: "Social Media Influencer",
    type: "background",
    rank: "C",
    description: "You are famous for being famous. You don't necessarily have a specific talent like singing or sports, but you have millions of followers who hang on your every word. Your awakening was the ultimate content opportunity.",
    skill_proficiencies: ["Persuasion", "Deception"],
    tool_proficiencies: ["Disguise Kit", "Calligrapher's Supplies"],
    languages: ["One additional language"],
    equipment: ["A high-end smartphone", "A portable makeup kit", "Fashionable, impractical clothes", "A ring light", "A business card for a PR firm"],
    starting_credits: 1000,
    feature_name: "Cancel Culture",
    feature_description: "You know how to manipulate public perception. You can easily start a viral rumor or trend that will sway public opinion against a specific person or guild within a day, causing them social or bureaucratic difficulties.",
    personality_traits: [
      "I refer to everything in terms of 'aesthetics' and 'vibes'.",
      "I am constantly taking selfies.",
      "I am incredibly superficial.",
      "I speak in hashtags and buzzwords.",
      "I am fiercely protective of my 'brand'.",
      "I treat everyone as a potential networking opportunity."
    ],
    ideals: [
      "Fame. I want everyone to know my name. (Any)",
      "Influence. I want to dictate what is popular and what is not. (Evil)",
      "Positivity. I want to spread good vibes and happiness. (Good)",
      "Wealth. I am here for the sponsorships. (Neutral)",
      "Drama. I thrive on conflict and tea. (Chaotic)",
      "Image. I must maintain a flawless public persona. (Lawful)"
    ],
    bonds: [
      "I am trying to secure a sponsorship from the largest mega-guild.",
      "I am fiercely loyal to my core group of followers.",
      "I am engaged in a bitter feud with a rival influencer.",
      "I am hiding a massive scandal that would ruin my career.",
      "I want to prove I am more than just a pretty face.",
      "I am secretly funding a charity for victims of gate breaks."
    ],
    flaws: [
      "I am incredibly vain and shallow.",
      "I will betray anyone for a boost in followers.",
      "I am completely dependent on the approval of strangers.",
      "I am a compulsive liar who exaggerates everything.",
      "I panic if I don't have internet access.",
      "I am terrified of being irrelevant."
    ],
    source_name: "Rift Compendium"
  },
  {
    id: "b-30",
    name: "E-Sports Champion",
    type: "background",
    rank: "B",
    description: "You were a professional gamer with inhuman reaction times and APM (Actions Per Minute). When you awakened, those skills translated perfectly to dodging monster attacks and managing cooldowns. You treat dungeon dives like an MMORPG raid.",
    skill_proficiencies: ["Insight", "Perception"],
    tool_proficiencies: ["Gaming Set", "Tinker's Tools"],
    languages: ["Korean (or another language common in E-Sports)"],
    equipment: ["A high-end gaming headset", "A mechanical keyboard (modified into a weapon or focus)", "A team jersey", "Energy drinks", "A mousepad"],
    starting_credits: 800,
    feature_name: "APM Mastery",
    feature_description: "Your hand-eye coordination is legendary. You excel at fine motor tasks under extreme pressure, and you can instantly memorize the precise layout of any digital or physical interface you see.",
    personality_traits: [
      "I refer to combat situations using gaming terms (aggro, DPS, wiping).",
      "I am highly competitive and hate losing.",
      "I drink copious amounts of energy drinks.",
      "I have incredibly fast, twitchy reflexes.",
      "I trash-talk enemies during combat.",
      "I am analytical, calculating probabilities in my head."
    ],
    ideals: [
      "Victory. I play to win, and I am the best. (Any)",
      "Teamwork. A well-coordinated team can defeat any boss. (Lawful)",
      "Glory. I want my name on the top of the leaderboards. (Chaotic)",
      "Wealth. The prize money is what matters. (Neutral)",
      "Protection. I will 'carry' my weaker teammates to safety. (Good)",
      "Dominance. I want to crush my opponents and humiliate them. (Evil)"
    ],
    bonds: [
      "I am trying to lead my team to the World Championship of Guilds.",
      "I am fiercely loyal to my former E-Sports teammates.",
      "I have a bitter rivalry with another top-ranked Hunter/Gamer.",
      "I am trying to secure a massive sponsorship deal.",
      "I want to prove that gamers make the best Hunters.",
      "I am searching for a 'glitch' or exploit in the gate system."
    ],
    flaws: [
      "I am incredibly arrogant and rage when things go wrong.",
      "I view people as NPCs or 'noobs'.",
      "I struggle to take the danger of the rifts seriously.",
      "I have a terrible diet and sleep schedule.",
      "I will ignore the plan if I think I can make a 'big play'.",
      "I am highly susceptible to bait and taunts."
    ],
    source_name: "Rift Compendium"
  }
];

const content = `\nexport const backgroundsPart1B = ${JSON.stringify(backgrounds, null, 2)};\n`;
fs.writeFileSync('src/data/compendium/backgrounds1b.ts', content);
console.log('backgrounds1b.ts written');
