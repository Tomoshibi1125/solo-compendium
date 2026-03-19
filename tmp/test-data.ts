
import { staticDataProvider } from './src/data/compendium/staticDataProvider';
import { logger } from './src/lib/logger';

async function test() {
    console.log("Testing staticDataProvider...");
    
    try {
        const runes = await staticDataProvider.getRunes();
        console.log(`Runes: ${runes.length}`);
        if (runes.length > 0) console.log(`First rune: ${runes[0].name}`);

        const sigils = await staticDataProvider.getSigils();
        console.log(`Sigils: ${sigils.length}`);
        if (sigils.length > 0) console.log(`First sigil: ${sigils[0].name}`);

        const items = await staticDataProvider.getItems();
        console.log(`Items: ${items.length}`);
        
        const equipment = items.filter(i => i.item_type === 'weapon' || i.item_type === 'armor' || i.item_type === 'shield');
        console.log(`Equipment (Weapons/Armor/Shields): ${equipment.length}`);
        
        const otherItems = items.filter(i => !(i.item_type === 'weapon' || i.item_type === 'armor' || i.item_type === 'shield'));
        console.log(`Other Items: ${otherItems.length}`);

    } catch (e) {
        console.error("Error testing staticDataProvider:", e);
    }
}

test();
