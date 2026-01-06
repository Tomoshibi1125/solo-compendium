/**
 * Enhanced export system
 * Export characters, compendium entries, campaigns, etc.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];

export interface ExportOptions {
  includeEquipment?: boolean;
  includeFeatures?: boolean;
  includePowers?: boolean;
  includeNotes?: boolean;
  format?: 'json' | 'pdf' | 'markdown' | 'html';
}

/**
 * Export character to JSON
 */
export async function exportCharacter(
  characterId: string,
  options: ExportOptions = {}
): Promise<string> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (!character) throw new Error('Character not found');

  const exportData: Record<string, unknown> = {
    name: character.name,
    level: character.level,
    job: character.job,
    path: character.path,
    background: character.background,
    stats: {
      hp: { current: character.hp_current, max: character.hp_max, temp: character.hp_temp },
      hitDice: { current: character.hit_dice_current, max: character.hit_dice_max, size: character.hit_dice_size },
      systemFavor: { current: character.system_favor_current, max: character.system_favor_max, die: character.system_favor_die },
      armorClass: character.armor_class,
      speed: character.speed,
      initiative: character.initiative,
      proficiencyBonus: character.proficiency_bonus,
    },
    conditions: character.conditions || [],
    exhaustionLevel: character.exhaustion_level,
  };

  if (options.includeNotes) {
    exportData.notes = character.notes;
    exportData.appearance = character.appearance;
    exportData.backstory = character.backstory;
  }

  if (options.includeEquipment) {
    const { data: equipment } = await supabase
      .from('character_equipment')
      .select('*, equipment:compendium_equipment(*)')
      .eq('character_id', characterId);
    exportData.equipment = equipment || [];
  }

  if (options.includeFeatures) {
    const { data: features } = await supabase
      .from('character_features')
      .select('*')
      .eq('character_id', characterId);
    exportData.features = features || [];
  }

  if (options.includePowers) {
    const { data: powers } = await supabase
      .from('character_powers')
      .select('*, power:compendium_powers(*)')
      .eq('character_id', characterId);
    exportData.powers = powers || [];
  }

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export character to PDF (markdown format for now)
 */
export function exportCharacterToMarkdown(character: Character): string {
  return `# ${character.name}

**Level ${character.level}** ${character.job}${character.path ? ` (${character.path})` : ''}

## Stats
- **HP**: ${character.hp_current}/${character.hp_max}${character.hp_temp > 0 ? ` (+${character.hp_temp} temp)` : ''}
- **Hit Dice**: ${character.hit_dice_current}/${character.hit_dice_max}d${character.hit_dice_size}
- **System Favor**: ${character.system_favor_current}/${character.system_favor_max} (d${character.system_favor_die})
- **AC**: ${character.armor_class}
- **Speed**: ${character.speed} ft.
- **Initiative**: ${character.initiative >= 0 ? '+' : ''}${character.initiative}

## Conditions
${character.conditions && character.conditions.length > 0 
  ? character.conditions.map(c => `- ${c}`).join('\n')
  : 'None'}

${character.notes ? `## Notes\n${character.notes}` : ''}
`;
}

/**
 * Export compendium entries
 */
export async function exportCompendiumEntries(
  entryIds: string[],
  entryType: string
): Promise<string> {
  const { supabase } = await import('@/integrations/supabase/client');
  const { getTableName, isValidEntryType } = await import('@/lib/compendiumResolver');
  
  // Validate entry type
  if (!isValidEntryType(entryType)) {
    throw new Error(`Unknown entry type: ${entryType}`);
  }

  const tableName = getTableName(entryType);

  const { data: entries } = await supabase
    .from(tableName as keyof Database['public']['Tables'])
    .select('*')
    .in('id', entryIds);

  return JSON.stringify(entries || [], null, 2);
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download character as JSON
 */
export async function downloadCharacterJSON(character: Character): Promise<void> {
  const json = await exportCharacter(character.id, {
    includeEquipment: true,
    includeFeatures: true,
    includePowers: true,
    includeNotes: true,
  });
  downloadFile(json, `${character.name.replace(/[^a-z0-9]/gi, '_')}_character.json`, 'application/json');
}

/**
 * Export character as PDF (using markdown for now, can be enhanced with PDF library)
 */
export function exportCharacterPDF(character: Character): void {
  const markdown = exportCharacterToMarkdown(character);
  downloadFile(markdown, `${character.name.replace(/[^a-z0-9]/gi, '_')}_character.md`, 'text/markdown');
  
  // For actual PDF, you would use a library like jsPDF or pdfkit
  // For now, we export as markdown which can be converted to PDF
}

/**
 * Print character sheet
 */
export function printCharacterSheet(characterId: string): void {
  // Open character sheet in new window for printing
  const printWindow = window.open(`/characters/${characterId}?print=true`, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
}
