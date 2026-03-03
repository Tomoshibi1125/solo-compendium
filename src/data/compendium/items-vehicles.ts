// Vehicles Compendium - System Ascendant
// Land, water, and air vehicles for hunters
// Compatible with the Piloting skill and vehicle proficiencies

import type { Item } from './items';

export const vehicles: Item[] = [
    // ═══════════════════════════════════════════
    // LAND VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-hunter-motorcycle',
        name: 'Hunter Motorcycle',
        description: 'A mana-enhanced motorcycle used by the Hunter Bureau for rapid urban response. Top speed exceeds 200 mph. The onboard System HUD displays navigation, threat alerts, and traffic data. Standard issue for B-rank and above field agents.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-hunter-motorcycle.webp',
        weight: 450,
        value: 5000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 120 ft (land)',
                'AC: 15, HP: 80',
                'Passengers: 1 rider + 1 passenger',
                'Requires Piloting proficiency',
                'Mana-powered — no fuel required',
                'Built-in System HUD with GPS and threat scanner'
            ]
        }
    },
    {
        id: 'vehicle-armored-suv',
        name: 'Bureau Armored SUV',
        description: 'A heavily armored sport utility vehicle used by Hunter Bureau strike teams. Bulletproof glass, run-flat tires, and mana-reinforced chassis. Seats a full raid party. The trunk has a hidden weapons locker and emergency medical bay.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-armored-suv.webp',
        weight: 5000,
        value: 15000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 80 ft (land)',
                'AC: 18, HP: 200',
                'Passengers: 1 driver + 5 passengers',
                'Occupants have three-quarters cover',
                'Resistance to non-magical bludgeoning, piercing, slashing',
                'Built-in weapons locker and emergency med bay'
            ]
        }
    },
    {
        id: 'vehicle-mana-hoverbike',
        name: 'Mana Hoverbike',
        description: 'A sleek, hovering personal transport that floats 5 feet off the ground via mana repulsion. Silent, fast, and agile — preferred by Assassins and Strikers for infiltration. Folds into a backpack-sized cube for storage.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mana-hoverbike.webp',
        weight: 50,
        value: 12000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 100 ft (hover, 5 ft altitude)',
                'AC: 13, HP: 40',
                'Passengers: 1 rider',
                'Ignores difficult terrain',
                'Silent operation — no Stealth disadvantage',
                'Collapsible into carrying case (action)'
            ]
        }
    },
    {
        id: 'vehicle-war-rig',
        name: 'War Rig',
        description: 'A massive armored truck bristling with mounted weapons and mana shielding. Used by Destroyer-led gate assault teams as mobile command posts. The back houses a full workshop, sleeping quarters, and ammunition storage. Civilians call the police when they see one on the highway.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-war-rig.webp',
        weight: 15000,
        value: 75000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (land)',
                'AC: 20, HP: 400',
                'Passengers: 1 driver + 2 gunners + 8 passengers',
                'Occupants have full cover',
                'Resistance to all damage types',
                '2 mounted weapon platforms (turret: 2d10 force, 120 ft range)',
                'Built-in workshop, sleeping quarters, and supply storage'
            ]
        }
    },
    {
        id: 'vehicle-gate-crawler',
        name: 'Gate Crawler',
        description: 'An all-terrain tracked vehicle designed to operate inside gates. Sealed cabin protects against toxic atmospheres, extreme temperatures, and pressure changes. Massive treads handle any surface from lava flows to ice sheets. Standard issue for gate survey teams.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-gate-crawler.webp',
        weight: 8000,
        value: 35000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 40 ft (land, all-terrain)',
                'AC: 19, HP: 250',
                'Passengers: 1 driver + 4 passengers',
                'Sealed cabin: immune to environmental hazards',
                'Ignores difficult terrain',
                'Built-in System scanner: detect creatures within 300 ft',
                'Resistance to fire and cold damage'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // WATER VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-hunter-speedboat',
        name: 'Hunter Speedboat',
        description: 'A high-speed patrol boat used by the Hunter Bureau\'s coastal division. Mana-jet propulsion, reinforced hull, and a forward-mounted mana cannon. Required for water-gate operations and coastal defense.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-hunter-speedboat.webp',
        weight: 3000,
        value: 20000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 100 ft (water)',
                'AC: 16, HP: 150',
                'Passengers: 1 pilot + 4 passengers',
                'Forward mana cannon: 2d8 force, 120 ft range',
                'Mana-jet propulsion — no wake at low speed (Stealth viable)'
            ]
        }
    },
    {
        id: 'vehicle-submersible-pod',
        name: 'Submersible Pod',
        description: 'A two-person submersible designed for underwater gate exploration. Transparent mana-crystal dome, mechanical arms for specimen collection, and sonar with 1-mile range. The Hunter Bureau loans them for deep-water gate missions.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-submersible-pod.webp',
        weight: 4000,
        value: 40000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (water, surface and submerged)',
                'AC: 17, HP: 180',
                'Passengers: 1 pilot + 1 passenger',
                'Sealed cabin: breathable air for 24 hours',
                'Sonar: detect creatures within 1 mile underwater',
                'Mechanical arms for collection and manipulation',
                'Headlights: 120 ft bright, 120 ft dim'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // AIR VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-sky-skiff',
        name: 'Sky Skiff',
        description: 'A lightweight, open-top flying platform powered by mana sails. Seats two and moves silently through the air. Mages and Heralds use them for aerial patrol and rapid transport between gate sites. The view is incredible; the lack of seatbelts is less so.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-sky-skiff.webp',
        weight: 200,
        value: 25000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 90 ft (fly)',
                'AC: 14, HP: 60',
                'Passengers: 1 pilot + 1 passenger',
                'Open top: passengers have half cover',
                'Silent operation',
                'Max altitude: 1,000 ft'
            ]
        }
    },
    {
        id: 'vehicle-assault-helicopter',
        name: 'Bureau Assault Helicopter',
        description: 'A military-grade helicopter retrofitted with mana-enhanced weapons and shielding. Used by the Hunter Bureau for rapid deployment into S-rank gate breaches. Carries a full strike team and can provide air support with twin mana cannons.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-assault-helicopter.webp',
        weight: 12000,
        value: 100000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 120 ft (fly)',
                'AC: 18, HP: 300',
                'Passengers: 2 crew + 8 passengers',
                'Twin mana cannons: 3d10 force, 300 ft range',
                'Occupants have full cover',
                'Mana shielding: resistance to ranged spell damage'
            ]
        }
    },
    {
        id: 'vehicle-mana-glider',
        name: 'Mana Glider',
        description: 'A personal wing-suit augmented with mana-crystalline ribs that provide true powered flight. Strapped to the arms and back, it allows a hunter to soar over battlefields and dive with devastating speed. Deployed from rooftops, vehicles, or mounts.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mana-glider.webp',
        weight: 15,
        value: 8000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (fly, must end turn on solid surface or descend)',
                'AC: 12, HP: 20',
                'Passengers: 1 (worn)',
                'Hands free while gliding',
                'Dive Attack: if descending 30+ ft, first melee attack deals +1d6 damage',
                'Folds to forearm-size for storage'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // SPECIAL / MECH VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-mini-mech',
        name: 'Mini-Mech Frame',
        description: 'A 10-foot-tall bipedal mech suit powered by a mana core. Provides powered strength, armored protection, and mounted weapon hardpoints. Technomancers can interface directly; everyone else uses manual controls. Walking through the Bureau lobby in one of these is technically against regulations but nobody enforces it.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mini-mech.webp',
        weight: 2000,
        value: 60000,
        requires_attunement: true,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 40 ft (land)',
                'AC: 19, HP: 200',
                'Passengers: 1 pilot (enclosed)',
                'Pilot has full cover',
                'STR score becomes 22 while piloting',
                '1 weapon hardpoint: can mount any Heavy weapon',
                'Mana core: self-repairing (5 HP/round)',
                'Requires attunement by a character with Piloting proficiency'
            ]
        }
    },
    {
        id: 'vehicle-mobile-broadcast-stage',
        name: 'Mobile Broadcast Stage',
        description: 'A converted tour bus with a deployable concert stage, PA system, and holographic projectors. Used by Idols for mobile performances during gate events. The speakers are loud enough to buff allies in a 300-ft radius. The insurance policy on this thing is 47 pages long.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mobile-broadcast-stage.webp',
        weight: 10000,
        value: 45000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 50 ft (land)',
                'AC: 16, HP: 250',
                'Passengers: 1 driver + 6 passengers',
                'Deployable stage (1 minute setup)',
                'PA System: Idol performances reach 300 ft radius',
                'Holographic projectors for visual effects',
                'Sound-dampened cabin for rest between shows'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // NEW LAND VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-sand-skiff',
        name: 'Sand Skiff',
        description: 'A flat-bottomed hovercraft designed specifically for desert raids and traversing endless dunes. Propelled by rear-mounted wind-mana turbines. Sand worms hate the vibration.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-sand-skiff.webp',
        weight: 1200,
        value: 12000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 80 ft (hover over sand/dirt)',
                'AC: 14, HP: 100',
                'Passengers: 1 pilot + 3 passengers',
                'Ignores difficult terrain caused by sand or loose earth',
                'Open deck: passengers have half cover'
            ]
        }
    },
    {
        id: 'vehicle-subterranean-borer',
        name: 'Subterranean Borer',
        description: 'A cylindrical vehicle with a massive rotating drill head made of enchanted adamantine. Used to breach underground dungeon layers or bypass labyrinth walls entirely.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-subterranean-borer.webp',
        weight: 25000,
        value: 85000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 30 ft (land), 20 ft (burrow)',
                'AC: 20, HP: 300',
                'Passengers: 1 pilot + 5 passengers',
                'Leaves a stable 10-foot diameter tunnel behind it',
                'Drill attack: 4d12 piercing (siege properties)'
            ]
        }
    },
    {
        id: 'vehicle-monowheel-chariot',
        name: 'Monowheel Chariot',
        description: 'A terrifyingly fast vehicle consisting of a single massive wheel with the driver suspended in the center via gyroscopic stabilization. Favored by thrill-seeking Strikers.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-monowheel-chariot.webp',
        weight: 600,
        value: 18000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 140 ft (land)',
                'AC: 16, HP: 75',
                'Passengers: 1 pilot',
                'Extreme Agility: Advantage on Piloting checks for tight turns',
                'Vulnerable to tripping or localized difficult terrain'
            ]
        }
    },
    {
        id: 'vehicle-behemoth-transporter',
        name: 'Behemoth Transporter',
        description: 'An oversized, multi-jointed truck designed to haul captured giant monsters or massive amounts of dungeon loot. Requires two lanes of highway minimum.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-behemoth-transporter.webp',
        weight: 40000,
        value: 65000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 50 ft (land)',
                'AC: 18, HP: 500',
                'Passengers: 2 drivers + 4 guards',
                'Cargo Capacity: 50 tons or one Gargantuan creature',
                'Reinforced containment cage (DC 25 Strength to break)'
            ]
        }
    },
    {
        id: 'vehicle-mana-train-car',
        name: 'Mana Train Car',
        description: 'A self-propelled luxury train carriage that doesn\'t require tracks. It glides along natural or artificial ley lines, floating inches above the ground. Often used as a mobile guild headquarters.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mana-train-car.webp',
        weight: 30000,
        value: 120000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 100 ft (ley-line glide)',
                'AC: 19, HP: 400',
                'Passengers: Up to 20 comfortably',
                'Functions as a mobile safehouse with amenities',
                'Can link with other cars to form a train'
            ]
        }
    },
    {
        id: 'vehicle-scout-buggy',
        name: 'Scout Buggy',
        description: 'A very light, stripped-down off-road vehicle with roll-cages and high suspension. Perfect for rapid reconnaissance in rugged terrain.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-scout-buggy.webp',
        weight: 1500,
        value: 8000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 90 ft (land)',
                'AC: 14, HP: 120',
                'Passengers: 1 driver + 3 passengers',
                'Superior Suspension: Ignores difficult terrain penalties',
                'No cover provided for occupants'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // NEW WATER VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-abyssal-bathysphere',
        name: 'Abyssal Bathysphere',
        description: 'A heavy, tether-less diving bell forged from deep-sea leviathan bones and enchanted steel. Can withstand the crushing depths of the oceanic trenches.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-abyssal-bathysphere.webp',
        weight: 10000,
        value: 70000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 30 ft (sink/rise), 20 ft (omni-directional)',
                'AC: 22, HP: 300',
                'Passengers: Up to 4',
                'Immune to pressure damage down to 30,000 feet',
                'Exterior floodlights (1,000 ft range)'
            ]
        }
    },
    {
        id: 'vehicle-hydrofoil-interceptor',
        name: 'Hydrofoil Interceptor',
        description: 'When it hits top speed, the hull lifts entirely out of the water, resting on blade-like struts. Used to chase down aquatic beasts or smugglers.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-hydrofoil-interceptor.webp',
        weight: 4000,
        value: 28000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 120 ft (water)',
                'AC: 15, HP: 120',
                'Passengers: 1 pilot + 2 passengers',
                'At top speed, immune to underwater hazards/mines',
                'Vulnerable to high winds (disadvantage on Piloting checks)'
            ]
        }
    },
    {
        id: 'vehicle-amphibious-apc',
        name: 'Amphibious APC',
        description: 'An armored personnel carrier that transitions seamlessly from land to water. Its tires retract, and mana-propellers engage in seconds.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-amphibious-apc.webp',
        weight: 12000,
        value: 45000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (land), 40 ft (water)',
                'AC: 18, HP: 200',
                'Passengers: 1 driver + 8 passengers',
                'Takes 1 action to switch modes',
                'Occupants have full cover'
            ]
        }
    },
    {
        id: 'vehicle-mana-galleon',
        name: 'Mana Galleon',
        description: 'A massive wooden ship out of the age of sail, modernized with floating mana-crystal masts. It sails without wind and requires a dedicated crew.',
        rarity: 'legendary',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-mana-galleon.webp',
        weight: 200000,
        value: 500000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 50 ft (water)',
                'AC: 15, HP: 1000',
                'Passengers: Minimum crew 10, accommodates 100 passengers',
                '4 Broadside Mana-Cannons (crew required)',
                'Massive cargo capacity'
            ]
        }
    },
    {
        id: 'vehicle-hunter-jetski',
        name: 'Hunter Jetski',
        description: 'A highly maneuverable personal watercraft. Ideal for navigating treacherous swamps or debris-choked flooded ruins.',
        rarity: 'uncommon',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-hunter-jetski.webp',
        weight: 400,
        value: 6000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 90 ft (water)',
                'AC: 13, HP: 50',
                'Passengers: 1 rider + 1 passenger',
                'Can perform jumps over obstacles if ramp/wave is available'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // NEW AIR VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-cloud-cutter',
        name: 'Cloud Cutter',
        description: 'A swept-wing jet aircraft powered by dual high-density mana engines. Flies above the cloud layer, avoiding most aerial beasts.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-cloud-cutter.webp',
        weight: 8000,
        value: 150000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 300 ft (fly)',
                'AC: 18, HP: 150',
                'Passengers: 1 pilot + 3 passengers',
                'Pressurized cabin, radar stealth (invisible to normal radar)',
                'Requires a runway to take off/land'
            ]
        }
    },
    {
        id: 'vehicle-dirigible-base',
        name: 'Dirigible Base',
        description: 'A colossal, slow-moving zeppelin that functions as a mobile guild headquarters. Contains sleeping quarters, a dining hall, and a hangar for smaller vehicles.',
        rarity: 'legendary',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-dirigible-base.webp',
        weight: 500000,
        value: 1000000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 30 ft (fly)',
                'AC: 14, HP: 800',
                'Passengers: Up to 50',
                'Mobile Base: Fully equipped with amenities and storage',
                'Very slow acceleration, vulnerable to extreme weather'
            ]
        }
    },
    {
        id: 'vehicle-wyvern-chariot',
        name: 'Wyvern Chariot',
        description: 'A reinforced, lightweight aerodynamic chariot meant to be harnessed to 1 or 2 large flying mounts (like Wyverns or Griffons).',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-wyvern-chariot.webp',
        weight: 500,
        value: 15000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: Uses mount\'s fly speed (-10 ft)',
                'AC: 15, HP: 100',
                'Passengers: 1 driver + 2 passengers',
                'Takes 1 minute to harness mounts',
                'Provides half cover to occupants'
            ]
        }
    },
    {
        id: 'vehicle-orbital-drop-pod',
        name: 'Orbital Drop Pod',
        description: 'A single-use, ablative-shielded pod meant to be dropped from high-altitude aircraft or orbital stations. Slams into the ground like a meteor.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-orbital-drop-pod.webp',
        weight: 3000,
        value: 20000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 500 ft (descent only)',
                'AC: 20, HP: 150',
                'Passengers: Up to 4 (cramped)',
                'Impact Deal 8d10 bludgeoning damage to ground-zero',
                'Occupants take no falling damage on impact; pod is destroyed'
            ]
        }
    },
    {
        id: 'vehicle-aether-board',
        name: 'Aether Board',
        description: 'Essentially a magical snowboard that generates its own lift. Highly agile but requires intense core balance and Piloting skill to master.',
        rarity: 'rare',
        type: 'wondrous',
        item_type: 'misc',
        requires_attunement: true,
        image: '/generated/compendium/items/vehicle-aether-board.webp',
        weight: 10,
        value: 10000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (fly)',
                'AC: 14, HP: 30',
                'Passengers: 1 rider',
                'Requires attunement. Rider cannot be knocked prone while flying without also falling off.',
                'Can use as a focus for movement-based spells'
            ]
        }
    },

    // ═══════════════════════════════════════════
    // NEW SPECIAL / MECH VEHICLES
    // ═══════════════════════════════════════════
    {
        id: 'vehicle-heavy-siege-mech',
        name: 'Heavy Siege Mech',
        description: 'A massive 20-foot tall quadrupedal mech designed purely for breaking static defenses. Moves slowly but mounts a shoulder artillery cannon that uses raw mana.',
        rarity: 'legendary',
        type: 'wondrous',
        item_type: 'misc',
        requires_attunement: true,
        image: '/generated/compendium/items/vehicle-heavy-siege-mech.webp',
        weight: 15000,
        value: 120000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 20 ft (land)',
                'AC: 22, HP: 400',
                'Passengers: 1 pilot (enclosed), 1 gunner',
                'Siege Cannon: 8d10 force (1000 ft range) - 1/round',
                'Immune to critical hits. Vulnerable to lightning.'
            ]
        }
    },
    {
        id: 'vehicle-arachnid-walker',
        name: 'Arachnid Walker',
        description: 'A scout vehicle with eight articulated legs. Developed from the carapace of a giant dungeon spider, it can walk up vertical surfaces and ceilings.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-arachnid-walker.webp',
        weight: 4000,
        value: 55000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 40 ft (land/climb)',
                'AC: 17, HP: 150',
                'Passengers: 1 pilot + 2 passengers',
                'Spider Climb: Can freely traverse vertical walls and ceilings',
                'Web Launcher: Restrain targets (DC 15 Dex)'
            ]
        }
    },
    {
        id: 'vehicle-dimensional-skiff',
        name: 'Dimensional Skiff',
        description: 'A silver, teardrop-shaped pod that uses spatial distortion rather than traditional propulsion. Seems to flicker out of existence when moving fast.',
        rarity: 'legendary',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-dimensional-skiff.webp',
        weight: 2000,
        value: 300000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 60 ft (hover)',
                'AC: 20, HP: 100',
                'Passengers: 1 pilot + 1 passenger',
                'Phase Shift (Recharge 5-6): Teleport up to 120 ft',
                'While moving, attacks against it have disadvantage'
            ]
        }
    },
    {
        id: 'vehicle-temporal-stasis-pod',
        name: 'Temporal Stasis Pod',
        description: 'Not meant for travel, but for survival. This heavy metallic cylinder slows time inside to a crawl. Used to transport critically wounded VIPs or highly dangerous artifacts.',
        rarity: 'epic',
        type: 'wondrous',
        item_type: 'misc',
        image: '/generated/compendium/items/vehicle-temporal-stasis-pod.webp',
        weight: 1500,
        value: 90000,
        source: 'System Ascendant Canon',
        effects: {
            passive: [
                'Speed: 0',
                'AC: 25, HP: 500',
                'Passengers: 1 occupant',
                'Occupant experiences 1 minute for every 10 years outside',
                'Immune to all external magic or environmental effects'
            ]
        }
    }
];
