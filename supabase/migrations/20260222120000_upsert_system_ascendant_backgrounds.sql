-- Upsert 22 System Ascendant canon backgrounds with full details
-- Replaces any generic/sparse backgrounds with richly detailed SA-flavored content

INSERT INTO compendium_backgrounds (
  name, description, feature_name, feature_description,
  skill_proficiencies, tool_proficiencies, starting_equipment, starting_credits,
  language_count, personality_traits, ideals, bonds, flaws,
  source_book, source_kind, tags, theme_tags
) VALUES
(
  'Shadow Realm Exile',
  'You survived exile in the shadow realm—a dimension of perpetual twilight where predators stalk the unwary. The experience scarred your mind and body, but you emerged with abilities others can only dream of.',
  'Shadow Affinity',
  'You have advantage on saving throws against being frightened and can see in dim light within 60 feet as if it were bright light. You can sense the presence of dimensional portals within 300 feet and know their general direction.',
  ARRAY['Stealth','Perception'],
  ARRAY['Thieves'' Tools'],
  'A set of dark clothes, a shadow-infused dagger, a small pouch containing 10 gp, a memento from the shadow realm, thieves'' tools',
  10,
  1,
  ARRAY[
    'I am constantly looking over my shoulder, expecting danger from the shadows.',
    'I speak in whispers and avoid drawing attention to myself.',
    'I trust no one completely, having learned betrayal in the shadow realm.',
    'I am fascinated by shadows and darkness, finding comfort in them.'
  ],
  ARRAY[
    'Survival. I will do whatever it takes to survive, no matter the cost. (Neutral)',
    'Freedom. No one should be trapped between worlds as I was. (Chaotic)',
    'Power. The shadows taught me that only the strong survive. (Evil)',
    'Knowledge. I seek to understand the mysteries of the shadow realm. (Neutral)'
  ],
  ARRAY[
    'I will protect anyone who is trapped between worlds.',
    'I seek revenge on those who exiled me to the shadow realm.',
    'I have a family member still trapped in the shadow realm.',
    'I owe my life to someone who helped me escape.'
  ],
  ARRAY[
    'I am paranoid and see threats everywhere.',
    'I have nightmares about the shadow realm that affect my judgment.',
    'I trust shadows more than people.',
    'I am willing to sacrifice others for my own survival.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['shadow','exile','dimensional','stealth'],
  ARRAY['dark','shadow','survival']
),
(
  'Rift Survivor',
  'You survived a catastrophic rift event that claimed the lives of countless others. The raw dimensional energy seared your body and mind, but you emerged changed—tougher, sharper, and haunted by the screams of those who weren''t so fortunate.',
  'Rift Sense',
  'You can feel vibrations that precede a dimensional rift opening. You have advantage on Wisdom (Perception) checks to detect planar disturbances, and you can sense when a rift will open within 1 mile up to 10 minutes before it manifests. You have resistance to force damage from dimensional sources.',
  ARRAY['Survival','Perception'],
  ARRAY['Herbalism Kit'],
  'A jagged shard of rift crystal, a set of tattered but serviceable clothes, a healer''s kit, a small pouch containing 15 gp, herbalism kit',
  15,
  1,
  ARRAY[
    'I compulsively count exits and escape routes in every room I enter.',
    'I flinch at sudden bursts of light or energy—they remind me of the rift.',
    'I carry a keepsake from someone who didn''t survive the rift event.',
    'I am eerily calm in disasters; I''ve already survived the worst.'
  ],
  ARRAY[
    'Preparedness. I will never be caught off guard again. (Lawful)',
    'Sacrifice. Those who survive owe a debt to those who didn''t. (Good)',
    'Resilience. What doesn''t kill you makes you stronger—literally. (Neutral)',
    'Revenge. I will find whatever caused the rift and destroy it. (Chaotic)'
  ],
  ARRAY[
    'I carry the names of everyone who died in the rift event, etched into my armor.',
    'A fellow survivor saved my life, and I will repay that debt.',
    'The rift took my home; I seek a new place to belong.',
    'I saw something inside the rift—something that''s still looking for me.'
  ],
  ARRAY[
    'I freeze up when I hear the sound of tearing reality.',
    'I push people away because everyone I''ve been close to has died.',
    'I take unnecessary risks because I feel I should have died in the rift.',
    'I hoard supplies obsessively, terrified of being unprepared.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['rift','survivor','dimensional','trauma'],
  ARRAY['survival','resilience','dimensional']
),
(
  'Ascendant Academy Graduate',
  'You graduated from the prestigious Ascendant Academy, receiving formal training in combat, magic, and dimensional theory. The Academy''s rigorous curriculum covered rift classification, monster taxonomy, essence manipulation, and tactical coordination.',
  'Academy Credentials',
  'You can gain access to ascendant organizations, libraries, and restricted archives by presenting your academy credentials. Fellow graduates offer you lodging and aid. You have advantage on Intelligence checks to recall lore about rifts, gates, and dimensional entities.',
  ARRAY['Investigation','Arcana'],
  ARRAY['Cartographer''s Tools'],
  'Academy uniform (fine clothes), academy signet ring, cartographer''s tools, a textbook on dimensional theory, a small pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I quote academy texts and instructors whenever the opportunity arises.',
    'I approach every problem methodically, as if writing a thesis.',
    'I''m competitive with other ascendants—my academy ranking still matters to me.',
    'I keep meticulous notes on everything I observe in the field.'
  ],
  ARRAY[
    'Knowledge. Understanding the system is the key to mastering it. (Neutral)',
    'Duty. The Academy trained me to protect the world, and I will. (Lawful)',
    'Excellence. I will prove I am the best graduate of my class. (Any)',
    'Innovation. Textbook methods aren''t enough—we need new approaches. (Chaotic)'
  ],
  ARRAY[
    'My academy mentor believed in me when no one else did.',
    'I made a promise to my graduating class to make a difference.',
    'The Academy library holds secrets I haven''t yet uncovered.',
    'A fellow graduate went missing on their first mission—I will find them.'
  ],
  ARRAY[
    'I look down on self-taught ascendants as undisciplined amateurs.',
    'I overthink situations instead of acting on instinct.',
    'I can''t resist showing off my knowledge, even when it''s inappropriate.',
    'I was sheltered at the academy and sometimes misjudge real-world dangers.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['academy','educated','formal','arcana'],
  ARRAY['academic','knowledge','formal']
),
(
  'Guild Master',
  'You have led or managed an ascendant guild, taking responsibility for organizing raids, managing resources, and training new ascendants. You''ve balanced budgets, mediated disputes, and sent people into rifts knowing some might not return.',
  'Guild Authority',
  'You can leverage your reputation as a guild leader to requisition supplies, recruit temporary help from ascendant guilds, and negotiate favorable contracts. Guild members and merchants in ascendant districts recognize your authority. Once per long rest, you can spend 10 minutes briefing allies on a battle plan, granting each a +1 bonus to initiative for the next encounter.',
  ARRAY['Persuasion','Insight'],
  ARRAY['Gaming Set (one of your choice)'],
  'A guild master''s signet ring, fine clothes, a ledger of guild accounts, a gaming set, a belt pouch containing 25 gp',
  25,
  1,
  ARRAY[
    'I evaluate everyone I meet as a potential recruit or rival.',
    'I delegate tasks naturally and expect my orders to be followed.',
    'I keep track of favors—both owed and owing.',
    'I have a story about how we used to do things in my guild for every situation.'
  ],
  ARRAY[
    'Leadership. A good leader serves their people, not the other way around. (Good)',
    'Profit. Resources win wars—I make sure we have plenty. (Neutral)',
    'Order. Structure and discipline keep people alive. (Lawful)',
    'Ambition. My guild was just the beginning of something greater. (Any)'
  ],
  ARRAY[
    'My former guild members still look to me for guidance.',
    'I disbanded my guild after a disastrous rift raid—I carry that weight.',
    'A rival guild master betrayed me, and I will settle that score.',
    'I promised my guild''s founder I would uphold their legacy.'
  ],
  ARRAY[
    'I have difficulty taking orders from others.',
    'I micromanage everything and everyone around me.',
    'I invested everything in my guild and lost it—I''m rebuilding from nothing.',
    'I judge people by their usefulness and discard those who aren''t productive.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['guild','leadership','management','social'],
  ARRAY['leadership','social','tactical']
),
(
  'Dimensional Traveler',
  'You have journeyed between dimensions, either by choice or necessity. You''ve seen worlds of fire and worlds of crystal silence. These experiences have given you a unique perspective on reality and the ability to navigate the spaces between worlds.',
  'Planar Pathfinder',
  'You cannot become lost by non-magical means while traveling between planes, and you have advantage on Wisdom (Survival) checks to navigate within rifts or pocket dimensions. Your body has adapted to dimensional travel—you are immune to disorientation effects of planar transitions and have advantage on Constitution saving throws against environmental hazards caused by dimensional instability.',
  ARRAY['Arcana','Survival'],
  ARRAY['Navigator''s Tools'],
  'A set of traveler''s clothes, navigator''s tools, a fragment of another dimension, a journal of dimensional coordinates, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I compare everything to places I''ve visited in other dimensions.',
    'I have an unsettling habit of knowing things about places I''ve never been.',
    'I collect small trinkets from every dimension I visit.',
    'I am remarkably unfazed by bizarre or alien phenomena.'
  ],
  ARRAY[
    'Discovery. There are infinite dimensions to explore, and I intend to see them all. (Chaotic)',
    'Balance. The dimensions must remain separate and stable. (Lawful)',
    'Wonder. Every new world is a gift to be cherished. (Good)',
    'Power. Each dimension holds secrets that can make me stronger. (Evil)'
  ],
  ARRAY[
    'I left part of myself in another dimension—literally or figuratively.',
    'A guide helped me navigate my first dimensional crossing; I owe them everything.',
    'I discovered a dimension in peril and feel compelled to save it.',
    'Something followed me back from a dimension, and I must deal with it.'
  ],
  ARRAY[
    'I sometimes forget which dimension I''m currently in.',
    'I have trouble forming attachments because I always want to move on.',
    'Dimensional travel has made me age unevenly—sometimes I lose time.',
    'I''m addicted to the sensation of crossing between worlds.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['dimensional','traveler','planar','explorer'],
  ARRAY['exploration','dimensional','wanderer']
),
(
  'Essence User',
  'You possess the rare ability to manipulate essence directly, without the need for complex spells or rituals. This natural talent makes you exceptionally powerful but also draws dangerous attention from those who would exploit or study your gift.',
  'Essence Sensitivity',
  'You can feel the flow of magical essence in your environment. You can detect the presence of magical essence in creatures and objects within 30 feet, allowing you to identify magical items and sense spellcasting without using a spell. Once per long rest, when you finish a short rest near high magical energy, you regain one expended spell slot of 1st level.',
  ARRAY['Arcana','Insight'],
  ARRAY['Alchemist''s Supplies'],
  'A set of common clothes with essence-stained cuffs, alchemist''s supplies, an essence focus crystal, a vial of concentrated essence, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'My eyes glow faintly when I''m concentrating on essence flows.',
    'I instinctively reach out to touch magical objects, feeling their resonance.',
    'I speak about essence as though it were alive—because to me, it is.',
    'I am deeply uncomfortable in areas devoid of magical energy.'
  ],
  ARRAY[
    'Harmony. Essence flows through all things; I seek to align with it. (Good)',
    'Mastery. Raw talent means nothing without discipline and control. (Lawful)',
    'Freedom. Essence should flow freely, not be bottled and sold. (Chaotic)',
    'Power. I was born with this gift, and I will use it to its fullest. (Neutral)'
  ],
  ARRAY[
    'My mentor helped me control my abilities before they destroyed me.',
    'I accidentally hurt someone with uncontrolled essence—I will make amends.',
    'An organization wants to study me; I must stay one step ahead.',
    'The source of my essence sensitivity holds answers I need.'
  ],
  ARRAY[
    'I sometimes lose control of my essence manipulation when emotional.',
    'I''m arrogant about my natural talent compared to trained mages.',
    'I crave magical energy and sometimes take risks to be near it.',
    'I underestimate conventional (non-magical) threats.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['essence','magic','natural','arcane'],
  ARRAY['magical','essence','innate']
),
(
  'Regent''s Chosen',
  'You have been selected by a regent—one of the immensely powerful dimensional entities that rule vast shadow domains. This connection grants you a fragment of their authority and insight, but it comes with expectations and obligations that weigh heavily on your soul.',
  'Regent''s Mark',
  'You bear the invisible mark of a regent. You have advantage on Charisma (Intimidation) checks against creatures of lower rank than your regent, and creatures that serve your regent will not attack you unless provoked. Once per long rest, you can meditate for 10 minutes to receive a cryptic vision or sensation from your regent''s domain.',
  ARRAY['Intimidation','Arcana'],
  ARRAY['Poisoner''s Kit'],
  'A dark cloak bearing your regent''s sigil, a set of fine clothes, a poisoner''s kit, a sealed letter of authority from your regent, a belt pouch containing 20 gp',
  20,
  1,
  ARRAY[
    'I speak of my regent with a mixture of reverence and fear.',
    'I carry myself with authority that I know is borrowed power.',
    'I test everyone I meet to determine their loyalty and usefulness.',
    'I am haunted by the things my regent has shown me.'
  ],
  ARRAY[
    'Loyalty. My regent chose me for a reason; I will not fail them. (Lawful)',
    'Power. My regent''s power flows through me, and I will wield it. (Evil)',
    'Independence. I serve my regent, but I am not their puppet. (Chaotic)',
    'Understanding. I must learn why I was chosen to fulfill my purpose. (Neutral)'
  ],
  ARRAY[
    'My regent saved my life, and I have pledged my service in return.',
    'I have a rival—another chosen servant of a different regent.',
    'My family doesn''t know about my connection to the regent.',
    'I am searching for something my regent lost or desires.'
  ],
  ARRAY[
    'I sometimes act on my regent''s commands without questioning their morality.',
    'I am paranoid that my regent will abandon me if I fail.',
    'The mark of the regent is slowly changing me, and I''m afraid of what I''m becoming.',
    'I look down on the unchosen as lesser beings.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['regent','chosen','shadow','authority'],
  ARRAY['regent','shadow','power']
),
(
  'Umbral Legionnaire',
  'You served as a legionnaire in the umbral legions, the disciplined military force that fights to hold the line against dimensional incursions. Your combat experience is extensive and you understand the art of warfare better than most.',
  'Legion Discipline',
  'When you are within 5 feet of an ally, you have advantage on saving throws against being frightened. You can use a bonus action to grant an adjacent ally +2 to their AC against the next attack that targets them before your next turn. You can march for up to 12 hours before suffering exhaustion.',
  ARRAY['Athletics','Intimidation'],
  ARRAY['Smith''s Tools'],
  'A legionnaire''s tabard (dark purple and black), a set of common clothes, smith''s tools, a rank insignia badge, a belt pouch containing 10 gp',
  10,
  0,
  ARRAY[
    'I stand at attention when addressed by authority figures.',
    'I eat quickly and efficiently—old habits from the mess hall.',
    'I unconsciously form tactical assessments of every room I enter.',
    'I use military jargon and speak in clipped, efficient sentences.'
  ],
  ARRAY[
    'Duty. Orders exist for a reason—follow them. (Lawful)',
    'Comradeship. The soldier next to you is more important than the mission. (Good)',
    'Survival. The mission is what matters, not the cost. (Neutral)',
    'Glory. I fight to be remembered, to make my name legendary. (Any)'
  ],
  ARRAY[
    'I lost my entire squad in a rift operation—I carry their dog tags.',
    'My commanding officer gave me a chance when no one else would.',
    'I deserted the legion and must avoid those who would bring me back.',
    'I made a vow to my fallen comrades that I would see the war through.'
  ],
  ARRAY[
    'I follow orders without question, even when I shouldn''t.',
    'I have nightmares about battles I''ve fought and comrades I''ve lost.',
    'I''m uncomfortable making decisions for myself.',
    'I solve problems with violence before considering other options.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['military','legion','umbral','combat'],
  ARRAY['military','combat','discipline']
),
(
  'Rune Master',
  'You have mastered the ancient art of rune crafting, able to inscribe magical symbols that produce powerful effects. Your knowledge of runes makes you invaluable for enchantment and protection work.',
  'Rune Lore',
  'You can identify and read runic inscriptions of any origin. When you encounter a rune, you automatically know its school of magic and general purpose. You have advantage on Intelligence (Arcana) checks to understand, activate, or disable runic traps and enchantments. During a long rest, you can inscribe a temporary protective rune that lasts 24 hours.',
  ARRAY['Arcana','History'],
  ARRAY['Calligrapher''s Supplies','Jeweler''s Tools'],
  'Calligrapher''s supplies, jeweler''s tools, a set of scholar''s clothes, a rune reference codex, a belt pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I absentmindedly trace runic symbols on surfaces with my finger.',
    'I examine every magical inscription I encounter, even in dangerous situations.',
    'I speak reverently about the ancient rune-smiths who created the first inscriptions.',
    'I become frustrated when people treat rune craft as simple enchanting.'
  ],
  ARRAY[
    'Preservation. Runic knowledge must be preserved for future generations. (Lawful)',
    'Discovery. Ancient runes hold secrets that could change the world. (Neutral)',
    'Sharing. Knowledge hoarded is knowledge wasted—I teach freely. (Good)',
    'Mastery. I will craft runes more powerful than any before. (Any)'
  ],
  ARRAY[
    'I am searching for a legendary rune said to grant dominion over a specific element.',
    'My master died before passing on their final secret—I must uncover it myself.',
    'A rune I inscribed malfunctioned and caused great harm; I seek to atone.',
    'I possess a rune codex that others would kill to obtain.'
  ],
  ARRAY[
    'I become obsessive when studying new runes, ignoring everything else.',
    'I''m possessive of rare runic knowledge and reluctant to share.',
    'I underestimate the danger of ancient runes, assuming I can handle anything.',
    'I''ve developed a dependence on rune-enhanced items and feel vulnerable without them.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['rune','crafting','inscription','arcane'],
  ARRAY['rune','crafting','knowledge']
),
(
  'Artifact Keeper',
  'You have been entrusted with the care and protection of powerful magical artifacts—relics of fallen civilizations, weapons of legendary heroes, and objects of terrible purpose. This sacred responsibility has given you deep knowledge of ancient items and the dangers they possess.',
  'Artifact Attunement',
  'Your long exposure to magical artifacts has made you sensitive to their auras. You can determine whether an object is magical by handling it for 1 minute (no spell required). You have advantage on Intelligence checks to identify magical item properties and history. You have advantage on saving throws against cursed items.',
  ARRAY['Arcana','History'],
  ARRAY['Tinker''s Tools'],
  'A set of scholar''s clothes, tinker''s tools, a leather-bound artifact registry, protective gloves woven with containment sigils, a belt pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I handle all objects—magical or not—with extreme care and reverence.',
    'I catalog everything obsessively, cross-referencing properties and histories.',
    'I get visibly distressed when someone mishandles a magical item.',
    'I speak about artifacts as if they have feelings and personalities.'
  ],
  ARRAY[
    'Stewardship. These artifacts are not ours to own—we merely protect them. (Good)',
    'Knowledge. Every artifact tells a story that must be understood. (Neutral)',
    'Security. Dangerous artifacts must be locked away from those who would misuse them. (Lawful)',
    'Power. The most powerful artifacts should be wielded, not hidden. (Evil)'
  ],
  ARRAY[
    'I am the last keeper of a collection that must never fall into the wrong hands.',
    'An artifact I was guarding was stolen, and I must recover it.',
    'My predecessor entrusted me with a secret about one of the artifacts.',
    'A particular artifact speaks to me in dreams.'
  ],
  ARRAY[
    'I trust artifacts more than people—they''re more predictable.',
    'I am tempted to use the artifacts I''m supposed to merely protect.',
    'I struggle to let go of items, even mundane ones.',
    'I am rigid about protocols and become unreasonable when others don''t follow them.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['artifact','keeper','guardian','relic'],
  ARRAY['artifact','guardian','knowledge']
),
(
  'Dragon Slayer',
  'You have successfully hunted and killed dragons—among the most feared entities that emerge from high-rank rifts. These legendary feats earned you both respect and enmity. You know where to strike, when to dodge, and how to use a dragon''s own elemental fury against it.',
  'Dragon Sense',
  'You can identify dragon species by their tracks, lairs, or territorial markings. You have advantage on Wisdom (Survival) checks to track dragons and on Intelligence (Nature) checks to recall information about draconic creatures. Common folk in settlements threatened by dragons treat you as a hero and offer free lodging and supplies.',
  ARRAY['Athletics','Nature'],
  ARRAY['Leatherworker''s Tools'],
  'A trophy from a slain dragon (scale, tooth, or claw), leatherworker''s tools, a set of traveler''s clothes, a hunting journal with dragon weaknesses annotated, a belt pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I speak of my kills in reverent detail—every scar tells a story.',
    'I instinctively look up and scan the sky when I''m in open terrain.',
    'I am calm and methodical in combat—panic is what gets you killed.',
    'I collect dragon parts and know the value of every scale and bone.'
  ],
  ARRAY[
    'Protection. I slay dragons to protect the people who cannot protect themselves. (Good)',
    'Challenge. The hunt is what gives life meaning—I seek the greatest prey. (Chaotic)',
    'Balance. Dragons are part of the natural order; I only kill those that threaten it. (Neutral)',
    'Glory. I want my name whispered with fear by every dragon alive. (Any)'
  ],
  ARRAY[
    'I hunt in honor of a loved one who was killed by a dragon.',
    'A dragon spared my life once—I need to understand why.',
    'I belong to a brotherhood of slayers bound by oath and tradition.',
    'I carry a weapon forged from dragon bone that was passed down to me.'
  ],
  ARRAY[
    'I am overconfident when facing draconic creatures.',
    'I see draconic corruption everywhere and can be paranoid about it.',
    'I disregard other threats as trivial compared to dragons.',
    'The thrill of the hunt has become an obsession I cannot control.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['dragon','slayer','hunter','combat'],
  ARRAY['combat','hunter','legendary']
),
(
  'Demon Slayer',
  'You specialize in hunting demonic entities, understanding their nature and knowing how to banish them permanently. Your expertise makes you the first line of defense against demonic incursions, but the work takes its toll on body and soul alike.',
  'Demon Lore',
  'You can identify demon types by their physical manifestations, auras, or the corruption they leave behind. You have advantage on Intelligence (Religion) checks related to demons, fiends, and abyssal entities. During a short or long rest, you can inscribe a protective circle in a 10-foot radius that gives fiends disadvantage on attack rolls against creatures within it.',
  ARRAY['Religion','Insight'],
  ARRAY['Herbalism Kit'],
  'A set of dark religious vestments, a vial of holy water, a silver holy symbol, a journal of demon true names (partial), a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I pray before every battle—habit from years of fighting fiends.',
    'I examine people''s eyes when I meet them, looking for signs of corruption.',
    'I carry blessed salt and scatter it on thresholds without thinking.',
    'I speak bluntly about evil—I''ve seen too much to sugarcoat anything.'
  ],
  ARRAY[
    'Purification. Demonic taint must be cleansed wherever it is found. (Good)',
    'Vigilance. Evil never rests, and neither can those who fight it. (Lawful)',
    'Knowledge. Understanding your enemy is the first step to destroying them. (Neutral)',
    'Vengeance. The demons took something from me, and I will repay them in kind. (Chaotic)'
  ],
  ARRAY[
    'A demon killed someone I loved, and I hunt their kind in memory of that person.',
    'My order of demon hunters was destroyed, and I am the last surviving member.',
    'I know the true name of a powerful demon and it knows I know.',
    'I was briefly possessed by a demon—its whispers still echo in my mind.'
  ],
  ARRAY[
    'I see demonic influence behind every misfortune and act of cruelty.',
    'I am ruthless in pursuit of demons, sometimes harming innocents in the crossfire.',
    'The horrors I''ve witnessed have made me cold and distant.',
    'I struggle to trust anyone, fearing they might be a demon in disguise.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['demon','slayer','fiend','holy'],
  ARRAY['combat','holy','demon']
),
(
  'Time Walker',
  'You have experienced temporal anomalies that shattered your linear perception of time. You''ve seen moments that haven''t happened yet, relived days that already passed, and occasionally lost weeks entirely. These experiences give you insights that others cannot comprehend.',
  'Temporal Intuition',
  'You always know the exact time of day and how much time has passed since any event you personally experienced. You have advantage on initiative rolls, as you unconsciously perceive events a split second before they occur. Once per long rest, when you fail an ability check or saving throw, you can reroll (you must use the new result).',
  ARRAY['Arcana','Perception'],
  ARRAY['Tinker''s Tools'],
  'A set of fine clothes from an indeterminate era, tinker''s tools, a broken pocket watch that occasionally ticks backward, a journal written in multiple hands—all your own, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I sometimes finish people''s sentences before they say them.',
    'I stare at clocks and hourglasses with uncomfortable intensity.',
    'I use past and future tense inconsistently, as if time is fluid to me.',
    'I pause before acting, as though consulting a memory that hasn''t happened yet.'
  ],
  ARRAY[
    'Preservation. The timeline must not be altered—the consequences are catastrophic. (Lawful)',
    'Curiosity. I want to understand time itself, even if it drives me mad. (Neutral)',
    'Correction. I''ve seen futures that must not come to pass, and I will prevent them. (Good)',
    'Control. Time is the ultimate power, and I seek to master it. (Evil)'
  ],
  ARRAY[
    'I carry a message from my future self that I don''t yet understand.',
    'Someone I loved exists in a timeline that no longer exists.',
    'A paradox I caused is slowly unraveling, and I must fix it.',
    'I owe a debt to a being that exists outside of time.'
  ],
  ARRAY[
    'I am plagued by visions of possible futures that may never occur.',
    'I have difficulty living in the present—my mind drifts to other times.',
    'I sometimes panic when events don''t match the timeline I remember.',
    'I''ve lived through the same traumatic event multiple times and can''t forget any version.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['time','temporal','anomaly','precognition'],
  ARRAY['temporal','mysterious','arcane']
),
(
  'Reality Bender',
  'You can perceive and manipulate the fundamental fabric of reality itself. This rare ability manifested after exposure to a rift event that tore the dimensional membrane, leaving you permanently attuned to the scaffolding beneath the world.',
  'Reality Sight',
  'You can see through mundane illusions automatically (no check required) and have advantage on saving throws against illusion spells. You can detect seams in reality—places where dimensional barriers are thin—within 60 feet. Once per long rest, you can make a minor alteration to local reality (change an object''s color, create a harmless sensory effect, etc.) lasting 1 hour.',
  ARRAY['Arcana','Investigation'],
  ARRAY['Glassblower''s Tools'],
  'A set of eccentric clothes that shimmer slightly, glassblower''s tools, a lens that shows things differently when looked through, a notebook of corrections to reality, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I question whether anything I see is real—including this conversation.',
    'I have an unnerving habit of staring at empty space as if something is there.',
    'I laugh at things no one else finds funny because I see layers others don''t.',
    'I correct people''s descriptions of reality with uncomfortable accuracy.'
  ],
  ARRAY[
    'Truth. Reality is a construct—I seek what lies beneath it. (Neutral)',
    'Stability. Reality must be maintained, not bent to anyone''s will. (Lawful)',
    'Freedom. If reality can be changed, why accept a version that causes suffering? (Good)',
    'Chaos. The rules of reality are arbitrary—I''ll rewrite them. (Chaotic)'
  ],
  ARRAY[
    'I accidentally erased something from reality and am trying to bring it back.',
    'A mentor taught me to control my abilities before they consumed me.',
    'Something that shouldn''t exist keeps appearing in my peripheral vision.',
    'I am connected to a place where reality is permanently fractured.'
  ],
  ARRAY[
    'I sometimes can''t distinguish between real memories and altered ones.',
    'My perception shifts make me seem unreliable or unhinged to others.',
    'I am tempted to fix things in reality that aren''t broken.',
    'I''ve lost fragments of my own existence—moments, relationships, even body parts that flicker.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['reality','illusion','dimensional','perception'],
  ARRAY['reality','perception','arcane']
),
(
  'Void Touched',
  'You have been exposed to the pure void between dimensions—the absolute nothingness that exists where reality ends. Most who touch the void are unmade entirely. You survived, but you were changed in fundamental ways.',
  'Void Touched',
  'You have darkvision out to 120 feet. Once per long rest, you can become invisible in dim light or darkness for 1 minute or until you attack or cast a spell. You emanate a subtle field that disrupts magical detection—you cannot be detected by divination magic unless the caster succeeds on a DC 15 ability check.',
  ARRAY['Arcana','Stealth'],
  ARRAY['Disguise Kit'],
  'A set of dark clothes that seem to absorb light, a disguise kit, a shard of crystallized void, a journal with entries in a language you don''t remember learning, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I cast no shadow when I''m not paying attention.',
    'I speak softly, as if sound itself is trying to avoid me.',
    'I am drawn to places of absolute darkness and silence.',
    'I sometimes forget I exist—I have to remind myself I''m real.'
  ],
  ARRAY[
    'Acceptance. I am what the void made me; I will not deny my nature. (Neutral)',
    'Protection. No one else should suffer what I suffered. (Good)',
    'Isolation. I am dangerous to be around, and I accept that. (Lawful)',
    'Hunger. The void showed me true power, and I want more. (Evil)'
  ],
  ARRAY[
    'I am searching for a way to reverse what the void did to me.',
    'Someone pulled me back from the void''s edge—I owe them everything.',
    'The void gave me a vision of something terrible that will happen—I must prevent it.',
    'Part of me is still in the void, and sometimes it calls me back.'
  ],
  ARRAY[
    'I feel disconnected from normal emotions and struggle to empathize.',
    'I am terrified of returning to the void but simultaneously drawn to it.',
    'My void-touched nature frightens people, and I''ve stopped trying to reassure them.',
    'I make decisions that prioritize the void''s interests over my companions''.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['void','shadow','darkness','stealth'],
  ARRAY['void','shadow','dark']
),
(
  'Star Born',
  'You were born under a cosmic alignment—or perhaps you came from beyond the stars entirely, a fragment of celestial intelligence given mortal form. You possess knowledge and abilities that transcend normal mortal understanding.',
  'Stellar Knowledge',
  'Once per long rest, you can meditate under an open sky for 10 minutes to gain advantage on one Intelligence check of your choice within the next 24 hours. You have resistance to radiant damage and advantage on saving throws against effects that would banish you to another plane of existence.',
  ARRAY['Arcana','Religion'],
  ARRAY['Navigator''s Tools'],
  'A set of fine clothes woven with star-thread, navigator''s tools, a star chart that updates itself at night, a small meteorite fragment that is always warm, a belt pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I look at the stars every night, as if reading messages from home.',
    'I experience the world with childlike wonder—everything here is new to me.',
    'I speak in cosmic metaphors that confuse and fascinate people.',
    'I have an aura of otherworldliness that makes people uneasy.'
  ],
  ARRAY[
    'Harmony. All worlds are connected by the stars; I seek universal balance. (Good)',
    'Understanding. I must learn what it means to be mortal before I can fulfill my purpose. (Neutral)',
    'Guidance. I was sent here to guide others, and I will not fail. (Lawful)',
    'Transcendence. This mortal form is temporary—I will ascend beyond it. (Any)'
  ],
  ARRAY[
    'I was sent here with a purpose I don''t fully understand yet.',
    'A mortal showed me kindness when I first arrived—I will protect them always.',
    'I am searching for others like me who may have fallen to this world.',
    'The stars are dimming, and I fear it means something terrible for my origin.'
  ],
  ARRAY[
    'I struggle with mortal concepts like hunger, fatigue, and attachment.',
    'I can be condescending about mortal concerns without meaning to be.',
    'I am homesick for a place I can barely remember.',
    'I sometimes prioritize cosmic concerns over immediate mortal ones.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['celestial','cosmic','star','divine'],
  ARRAY['celestial','cosmic','radiant']
),
(
  'Ancient Guardian',
  'You are an ancient being tasked with protecting something of immense importance. Your long life has given you wisdom and perspective that few can match, but it has also left you disconnected from the rapid pace of modern times.',
  'Ancient Vigil',
  'You cannot be surprised while you are conscious. You have advantage on Wisdom (Perception) checks to detect hidden creatures or objects in structures, ruins, or underground environments. You have advantage on Intelligence (History) checks, and the DM may provide additional information about ancient ruins, artifacts, or inscriptions.',
  ARRAY['History','Perception'],
  ARRAY['Mason''s Tools'],
  'A guardian''s medallion (ancient and weathered), mason''s tools, a set of traveler''s clothes from a bygone era, a scroll of protective wards, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I measure time in centuries and find mortal urgency amusing.',
    'I speak with archaic formality that confuses modern folk.',
    'I am fiercely protective of things under my care—sometimes irrationally so.',
    'I have a deep melancholy from watching civilizations rise and fall.'
  ],
  ARRAY[
    'Protection. I was entrusted with a sacred duty, and I will not abandon it. (Lawful)',
    'Legacy. The past must be preserved so future generations can learn from it. (Good)',
    'Patience. Time reveals all truths—rushing leads to ruin. (Neutral)',
    'Adaptation. The old ways must evolve, or they will be forgotten entirely. (Chaotic)'
  ],
  ARRAY[
    'I guard a site of immense power that must never be breached.',
    'The being that charged me with my vigil has not spoken to me in centuries.',
    'I remember a world before the rifts, and I mourn what was lost.',
    'A young mortal reminds me of someone I protected long ago.'
  ],
  ARRAY[
    'I am stubbornly set in my ways and resist change.',
    'I have difficulty relating to beings with mortal lifespans.',
    'I have lost pieces of my memory over the centuries and sometimes confuse eras.',
    'I am so focused on my duty that I neglect everything else.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['ancient','guardian','protector','history'],
  ARRAY['ancient','guardian','protective']
),
(
  'Forgotten King',
  'You once ruled a kingdom that has been lost to time—whether through conquest, catastrophe, or dimensional displacement. Your crown is gone, your subjects scattered or dead, and your palace exists only in your memory. But your royal bearing and leadership experience remain.',
  'Royal Bearing',
  'You have advantage on Charisma (Persuasion) checks when negotiating with nobles, officials, and leaders. Common folk instinctively defer to you, offering respectful treatment and accommodation. You have advantage on Intelligence checks related to politics, governance, military strategy, and heraldry.',
  ARRAY['Persuasion','History'],
  ARRAY['Gaming Set (Chess)'],
  'A crown fragment or royal signet ring, a set of fine clothes (faded but regal), a gaming set (chess), a partial map of a kingdom that no longer exists, a belt pouch containing 20 gp',
  20,
  1,
  ARRAY[
    'I instinctively command rooms and expect people to listen when I speak.',
    'I reference my former kingdom in conversation, even when no one recognizes it.',
    'I carry a quiet dignity that persists even in the worst circumstances.',
    'I judge people by their honor and integrity, not their station.'
  ],
  ARRAY[
    'Justice. A true ruler serves the people, not the other way around. (Good)',
    'Restoration. I will reclaim what was taken from me—my kingdom and my crown. (Any)',
    'Wisdom. The fall of my kingdom taught me humility I lacked as a ruler. (Neutral)',
    'Legacy. Though my kingdom is gone, its ideals must endure. (Lawful)'
  ],
  ARRAY[
    'Loyal subjects from my lost kingdom still search for me.',
    'The one who destroyed my kingdom still lives, and I will face them.',
    'I carry a relic of my kingdom that is the key to its restoration.',
    'A prophecy foretold the fall of my kingdom—and my rise from its ashes.'
  ],
  ARRAY[
    'I struggle to accept that I am no longer a king.',
    'I make promises I cannot keep, still thinking in terms of royal resources.',
    'I can be haughty and dismissive of those I perceive as beneath my station.',
    'I am haunted by the decisions I made as king that led to my kingdom''s fall.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['royalty','forgotten','leadership','noble'],
  ARRAY['noble','leadership','regal']
),
(
  'Champion of Light',
  'You have been chosen as a champion of radiant power—a beacon against the encroaching darkness of corrupted rifts and shadow entities. Whether anointed by a divine being, awakened through a near-death experience, or simply born with an inner light, you carry a responsibility that transcends personal ambition.',
  'Radiant Aura',
  'You can cause your body to emit bright light in a 10-foot radius and dim light for an additional 10 feet as a bonus action. Undead and fiends within this light have disadvantage on attack rolls against you. The light lasts for 1 minute. Once per long rest, you can grant an ally within 30 feet temporary HP equal to your level + PRE modifier and advantage on their next saving throw.',
  ARRAY['Religion','Medicine'],
  ARRAY['Herbalism Kit'],
  'A holy symbol of radiant gold, a set of fine white vestments, an herbalism kit, a vial of blessed water, a belt pouch containing 15 gp',
  15,
  1,
  ARRAY[
    'I believe in the good in every person, even when evidence suggests otherwise.',
    'I rise before dawn and greet each day as a gift.',
    'I cannot pass by suffering without trying to help.',
    'I speak with calm conviction that steadies those around me.'
  ],
  ARRAY[
    'Compassion. Every soul deserves mercy and a chance at redemption. (Good)',
    'Justice. The light reveals truth and burns away corruption. (Lawful)',
    'Hope. Even in the darkest times, light endures—I am proof of that. (Good)',
    'Sacrifice. I will lay down my life if it means others survive. (Any)'
  ],
  ARRAY[
    'I was chosen by a divine entity to carry the light into the world''s darkest places.',
    'I fight to honor a fallen champion whose mantle I now bear.',
    'A community depends on me as their protector and spiritual guide.',
    'I seek to purify a corrupted holy site and restore it to its former glory.'
  ],
  ARRAY[
    'I am naive about the depths of evil and am often blindsided.',
    'I hold myself to impossibly high standards and crumble under guilt when I fail.',
    'I can be self-righteous and dismissive of those who take a darker path.',
    'My devotion to the light makes me inflexible in moral gray areas.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['light','holy','champion','radiant'],
  ARRAY['radiant','holy','champion']
),
(
  'Bringer of Dawn',
  'You are a beacon of hope in a world increasingly consumed by shadow and dimensional horror. Whether through song, story, healing, or simply your unwavering presence, you bring light to dark places and courage to the despairing.',
  'Dawn''s Inspiration',
  'Your words and presence uplift those around you. Once per long rest, you can spend 10 minutes performing, speaking, or simply being present to remove the frightened condition from up to 6 friendly creatures who can hear or see you. When you take a long rest, one ally who rests within 30 feet of you regains one additional hit die.',
  ARRAY['Performance','Persuasion'],
  ARRAY['Musical Instrument (one of your choice)'],
  'A musical instrument of your choice, a set of traveler''s clothes, a lantern that never fully goes out, a collection of uplifting stories and songs, a belt pouch containing 10 gp',
  10,
  0,
  ARRAY[
    'I greet every morning with genuine enthusiasm, no matter how bad things are.',
    'I tell stories and sing songs to keep spirits high during dark times.',
    'I believe that small acts of kindness ripple outward to change the world.',
    'I light candles in dark places—literally and figuratively.'
  ],
  ARRAY[
    'Hope. Dawn always comes, no matter how long the night. (Good)',
    'Service. I exist to bring light to those who have lost their way. (Lawful)',
    'Joy. Life is precious and should be celebrated, not mourned. (Chaotic)',
    'Renewal. Every ending is a new beginning waiting to happen. (Neutral)'
  ],
  ARRAY[
    'I made a promise to someone in despair that I would bring them hope.',
    'A community in a dark place depends on my visits to sustain their morale.',
    'I carry a flame that was lit at the first dawn—it must never go out.',
    'I lost someone to darkness, and I swore no one else would suffer the same fate.'
  ],
  ARRAY[
    'I refuse to acknowledge how dire a situation truly is.',
    'My relentless optimism can be exhausting and dismissive of real pain.',
    'I neglect my own well-being in my drive to help others.',
    'I am terrified of the dark and what it represents.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['hope','dawn','inspiration','performance'],
  ARRAY['hope','inspiration','light']
),
(
  'Eternal Watcher',
  'You have been tasked with observing important events or places across time. This vigil has given you incredible perception and an unmatched understanding of patterns in history—but it has also isolated you from normal life.',
  'Vigilant Eye',
  'Your centuries of observation have honed your senses to supernatural sharpness. You have advantage on Wisdom (Perception) checks to notice hidden details, and you can read lips from up to 120 feet away. You have advantage on Intelligence (Investigation) checks to spot inconsistencies or forgeries. Once per long rest, when encountering something historically significant, you can recall a detail that provides advantage on your next related ability check.',
  ARRAY['Perception','Investigation'],
  ARRAY['Spyglass'],
  'A set of nondescript clothes, a spyglass, a journal of observations spanning decades, a brass compass that points to dimensional anomalies, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I observe everything and everyone, cataloging details others miss.',
    'I rarely speak first—I prefer to listen and watch.',
    'I have an encyclopedic memory for faces, names, and events.',
    'I struggle with the urge to intervene versus my duty to observe.'
  ],
  ARRAY[
    'Truth. I record what happens without bias or judgment. (Neutral)',
    'Duty. I was tasked with watching, and I will not abandon my post. (Lawful)',
    'Warning. I watch so that I can warn others of dangers to come. (Good)',
    'Knowledge. Everything I observe adds to the sum of understanding. (Any)'
  ],
  ARRAY[
    'I am compiling a chronicle that must survive even if I don''t.',
    'I watched a tragedy unfold and did nothing—I carry that guilt.',
    'There is one specific event or person I was assigned to watch.',
    'I discovered something during my vigil that could change everything.'
  ],
  ARRAY[
    'I am a passive observer by nature and hesitate to take direct action.',
    'I have trouble connecting emotionally after centuries of detached observation.',
    'I know secrets that make people uncomfortable around me.',
    'I sometimes forget that I''m allowed to participate in events, not just watch.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['watcher','observer','perception','eternal'],
  ARRAY['observation','eternal','perception']
),
(
  'Cosmic Wanderer',
  'You travel between worlds and dimensions as a wanderer, seeking knowledge, experience, and the ineffable something that drives you ever onward. Your journeys have given you cosmic perspective, diverse survival skills, and a collection of stories that would fill a library.',
  'Wanderer''s Wisdom',
  'Your travels have taught you to adapt to any environment. You can find food and fresh water for yourself and up to five other people each day in any environment. You have advantage on Wisdom (Survival) checks in unfamiliar terrain and advantage on Wisdom (Insight) checks to determine if someone is lying. You have advantage on saving throws against being frightened by creatures of CR 5 or lower.',
  ARRAY['Survival','Insight'],
  ARRAY['Cook''s Utensils'],
  'A set of well-worn traveler''s clothes, cook''s utensils, a walking staff carved with symbols from many worlds, a collection of souvenirs from different dimensions, a belt pouch containing 10 gp',
  10,
  1,
  ARRAY[
    'I have a story from another world for every situation.',
    'I taste everything—you never know when a local plant might be medicine.',
    'I am equally comfortable sleeping under alien stars as in a warm bed.',
    'I speak fragments of dozens of languages and mix them unconsciously.'
  ],
  ARRAY[
    'Freedom. The road is my home, and I answer to no one. (Chaotic)',
    'Connection. Every world I visit enriches my understanding of all of them. (Good)',
    'Wisdom. Travel teaches lessons that books never can. (Neutral)',
    'Purpose. I wander because I''m searching for something—I''ll know it when I find it. (Any)'
  ],
  ARRAY[
    'I carry a map to a place I''ve never been—I was told I''d know when to use it.',
    'A friend from another dimension asked me to deliver a message.',
    'I am running from something across dimensions, and it is catching up.',
    'I promised to return to a world I visited, and I always keep my promises.'
  ],
  ARRAY[
    'I can never stay in one place for long—wanderlust consumes me.',
    'I sometimes share knowledge from other worlds that causes unintended consequences.',
    'I have trouble remembering which customs belong to which world.',
    'I am lonely but afraid of putting down roots.'
  ],
  'System Ascendant Canon', 'official',
  ARRAY['wanderer','cosmic','traveler','survival'],
  ARRAY['wanderer','cosmic','survival']
)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  feature_name = EXCLUDED.feature_name,
  feature_description = EXCLUDED.feature_description,
  skill_proficiencies = EXCLUDED.skill_proficiencies,
  tool_proficiencies = EXCLUDED.tool_proficiencies,
  starting_equipment = EXCLUDED.starting_equipment,
  starting_credits = EXCLUDED.starting_credits,
  language_count = EXCLUDED.language_count,
  personality_traits = EXCLUDED.personality_traits,
  ideals = EXCLUDED.ideals,
  bonds = EXCLUDED.bonds,
  flaws = EXCLUDED.flaws,
  source_book = EXCLUDED.source_book,
  source_kind = EXCLUDED.source_kind,
  tags = EXCLUDED.tags,
  theme_tags = EXCLUDED.theme_tags;
