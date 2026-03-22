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
    # Avoid replacing Sovereign if it's in a comment about Gemini Protocol (rare in data files)
    # But Sovereign should be removed from items.
    content = re.sub(r'\bSovereign\b', "Elite", content)
    
    # "Magic" -> "Protocol" or "System-tech"
    # Be careful not to break code like "magic-bonus" -> "protocol-bonus" is fine if we update the interface (which we did for magical_bonus? no, i left that but i can change it)
    # Actually, user said replace "Magic" with "Protocol", "System-tech", or "Aura".
    content = re.sub(r'\bMagic\b', "Protocol", content)
    content = re.sub(r'\bmagic\b', "protocol", content)
    content = re.sub(r'\bmagical\b', "protocol-enhanced", content)
    
    # 2. Logic fixes (Name vs Type)
    # If type is armor but name has "Blade", "Sword", etc.
    # We find whole items and process them.
    
    return content

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split into items
    # Items are usually defined as objects in an array.
    # { id: "...", ... }
    
    # Simple replacement first for vernacular
    content = align_item(content)
    
    # Granular Classification & Logical Consistency
    # I'll use a regex to find each item block
    # This is tricky in TS files with nested objects, but let's try a heuristic.
    
    item_pattern = re.compile(r'(\s+)(\{\s+id:.*?\n\s+\})', re.DOTALL)
    
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
        
        # Heuristic for type adjustment
        found_type = False
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
        if new_type != current_type and current_type in ["wondrous", "misc", "accessory", "wondrous item"]:
            item_block = item_block.replace(f'type: "{current_type}"', f'type: "{new_type}"')
            
        # Description cleanup for "Umbral"
        if "Umbral" in name and "icy" in desc.lower():
            item_block = re.sub(r'icy power', "shadow power", item_block, flags=re.IGNORECASE)
            item_block = re.sub(r'cold damage', "necrotic damage", item_block, flags=re.IGNORECASE)
            item_block = re.sub(r'frost', "void", item_block, flags=re.IGNORECASE)

        return indent + item_block

    # Note: re.sub with function is more robust for this
    # But because our pattern might match multiple things, let's be careful.
    # Actually, the item blocks are pretty standard.
    
    # For now, I'll do a simpler full-block regex for item objects
    # This regex is a bit risky but let's try.
    content = re.sub(r'\{\s+id:.*?\n\s+\}', item_replacer, content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for f in FILES:
    if os.path.exists(f):
        print(f"Processing {f}...")
        process_file(f)
    else:
        print(f"File not found: {f}")
