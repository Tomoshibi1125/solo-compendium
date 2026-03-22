import re
import os

FILES = [
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\items-part1.ts",
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\items-part2.ts",
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\items-part3.ts",
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\items-part4.ts",
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\items-part5.ts",
    r"c:\Users\jjcal\Documents\solo-compendium\src\data\compendium\relics-comprehensive.ts"
]

def align_item(content):
    # 1. Vernacular alignment
    content = content.replace("Monarch", "Regent")
    content = re.sub(r'\bSovereign\b', "Elite", content)
    content = re.sub(r'\bMagic\b', "Protocol", content)
    content = re.sub(r'\bmagic\b', "protocol", content)
    content = re.sub(r'\bmagical\b', "protocol-enhanced", content)
    return content

def item_replacer(match):
    indent = match.group(1)
    item_block = match.group(2)
    
    # Extract name, description, type
    name_match = re.search(r'name:\s*"(.*?)"', item_block)
    desc_match = re.search(r'description:\s*"(.*?)"', item_block)
    type_match = re.search(r'type:\s*"(.*?)"', item_block)
    
    if not name_match: return match.group(0)
    
    name = name_match.group(1)
    desc = desc_match.group(1) if desc_match else ""
    current_type = type_match.group(1) if type_match else ""
    
    new_type = current_type
    
    # Logical Consistency Rules
    weapons = ["Blade", "Saber", "Sword", "Dagger", "Axe", "Hammer", "Bow", "Spear", "Glaive", "Katana", "Gauntlet"]
    armors = ["Vest", "Plate", "Armor", "Shield", "Mail", "Suit", "Coat", "Cloak", "Robe"]
    stims = ["Stim", "Injector", "Potion", "Vial", "Serum", "Drug"]
    scripts = ["Script", "Scroll", "Data", "Disk", "Cipher"]
    runes = ["Rune"]
    sigils = ["Sigil"]
    augments = ["Augment", "Link", "Implant", "Neural", "Cyber", "Eye", "Arm", "Leg"]
    hardware = ["Lens", "Scanner", "Tool", "Gadget", "Device", "Box", "Module"]
    foci = ["Staff", "Wand", "Rod", "Focus", "Emitter"]
    rings = ["Ring"]

    found_type = False
    for r in runes:
        if r.lower() in name.lower():
            new_type = "rune"
            found_type = True
            break
    if not found_type:
        for s in sigils:
            if s.lower() in name.lower():
                new_type = "sigil"
                found_type = True
                break
    if not found_type:
        for w in weapons:
            if w.lower() in name.lower():
                new_type = "weapon"
                found_type = True
                break
    if not found_type:
        for a in armors:
            if a.lower() in name.lower():
                new_type = "armor"
                found_type = True
                break
    if not found_type:
        for s in stims:
            if s.lower() in name.lower():
                new_type = "stim"
                found_type = True
                break
    if not found_type:
        for s in scripts:
            if s.lower() in name.lower():
                new_type = "script"
                found_type = True
                break
    if not found_type:
        for a in augments:
            if a.lower() in name.lower():
                new_type = "augment"
                found_type = True
                break
    if not found_type:
        for h in hardware:
            if h.lower() in name.lower():
                new_type = "hardware"
                found_type = True
                break
    if not found_type:
        for f in foci:
            if f.lower() in name.lower():
                new_type = "focus"
                found_type = True
                break
    if not found_type:
        for r in rings:
            if r.lower() in name.lower():
                new_type = "ring"
                found_type = True
                break
                
    # Replace type if found better
    if new_type != current_type and current_type in ["wondrous", "misc", "accessory", "wondrous item", "artifact"]:
        item_block = item_block.replace(f'type: "{current_type}"', f'type: "{new_type}"')
    
    # RULE: Sigils and Runes never require attunement
    if new_type in ["sigil", "rune"] or "sigil" in name.lower() or "rune" in name.lower():
        item_block = item_block.replace('requires_attunement: true', 'requires_attunement: false')
        item_block = item_block.replace('attunement: true', 'attunement: false')

    # Description cleanup for "Umbral"
    if "Umbral" in name and "icy" in desc.lower():
        item_block = re.sub(r'icy power', "shadow power", item_block, flags=re.IGNORECASE)
        item_block = re.sub(r'cold damage', "necrotic damage", item_block, flags=re.IGNORECASE)
        item_block = re.sub(r'frost', "void", item_block, flags=re.IGNORECASE)

    return indent + item_block

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = align_item(content)
    
    # This pattern matches { ... } objects starting with id:
    # We use a non-greedy .*? and a lookahead for the next id or end of array
    # Pattern: \s+\{\s+id:.*?\n\s+\} - wait, the previous was a bit too simple.
    # Let's try to match balanced braces or just up to the closing brace that isn't followed by a property.
    
    # Updated pattern for item objects in TypeScript files
    # Matches: { id: "...", ... }
    item_pattern = re.compile(r'(\s+)(\{\s+id:.*?\n\s+\}(?=,|\s+\]|\s+;))', re.DOTALL)
    
    content = re.sub(item_pattern, item_replacer, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for f in FILES:
    if os.path.exists(f):
        print(f"Processing {f}...")
        process_file(f)
    else:
        print(f"File not found: {f}")
