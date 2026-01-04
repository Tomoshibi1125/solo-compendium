/**
 * Character export utilities
 * Supports JSON and PDF export
 */

import type { Database } from '@/integrations/supabase/types';

type Character = Database['public']['Tables']['characters']['Row'];
type CharacterWithAbilities = Character & {
  abilities: Record<string, number>;
};

/**
 * Export character as JSON
 */
export function exportCharacterJSON(character: CharacterWithAbilities): string {
  const exportData = {
    name: character.name,
    level: character.level,
    job: character.job,
    path: character.path,
    background: character.background,
    abilities: character.abilities,
    hitPoints: {
      current: character.hp_current,
      max: character.hp_max,
      temp: character.hp_temp || 0,
    },
    hitDice: {
      current: character.hit_dice_current,
      max: character.hit_dice_max,
      size: character.hit_dice_size,
    },
    systemFavor: {
      current: character.system_favor_current,
      max: character.system_favor_max,
      die: character.system_favor_die,
    },
    proficiencies: {
      savingThrows: character.saving_throw_proficiencies || [],
      skills: character.skill_proficiencies || [],
      expertise: character.skill_expertise || [],
      armor: character.armor_proficiencies || [],
      weapons: character.weapon_proficiencies || [],
      tools: character.tool_proficiencies || [],
    },
    conditions: character.conditions || [],
    exhaustion: character.exhaustion_level,
    notes: character.notes,
    appearance: character.appearance,
    backstory: character.backstory,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Download character as JSON file
 */
export function downloadCharacterJSON(character: CharacterWithAbilities, filename?: string): void {
  const json = exportCharacterJSON(character);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${character.name.replace(/\s+/g, '_')}_export.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate character sheet HTML for PDF export
 */
export function generateCharacterSheetHTML(character: CharacterWithAbilities): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${character.name} - Character Sheet</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #000;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      text-align: center;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .info-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 18px;
      font-weight: bold;
    }
    .abilities {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .ability {
      text-align: center;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .ability-name {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .ability-score {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .ability-modifier {
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 2px solid #000;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media print {
      body {
        padding: 10px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${character.name}</h1>
  </div>

  <div class="info-grid">
    <div class="info-item">
      <div class="info-label">Level</div>
      <div class="info-value">${character.level}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Job</div>
      <div class="info-value">${character.job || '—'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Path</div>
      <div class="info-value">${character.path || '—'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Background</div>
      <div class="info-value">${character.background || '—'}</div>
    </div>
  </div>

  <div class="abilities">
    ${Object.entries(character.abilities || {}).map(([ability, score]) => {
      const modifier = Math.floor((score - 10) / 2);
      return `
        <div class="ability">
          <div class="ability-name">${ability}</div>
          <div class="ability-score">${score}</div>
          <div class="ability-modifier">${modifier >= 0 ? '+' : ''}${modifier}</div>
        </div>
      `;
    }).join('')}
  </div>

  <div class="two-column">
    <div class="section">
      <div class="section-title">Hit Points</div>
      <p><strong>Current:</strong> ${character.hp_current} / <strong>Max:</strong> ${character.hp_max}</p>
      <p><strong>Temp:</strong> ${character.hp_temp || 0}</p>
      <p><strong>Hit Dice:</strong> ${character.hit_dice_current}/${character.hit_dice_max}d${character.hit_dice_size}</p>
    </div>

    <div class="section">
      <div class="section-title">System Favor</div>
      <p><strong>Current:</strong> ${character.system_favor_current} / <strong>Max:</strong> ${character.system_favor_max}</p>
      <p><strong>Die Size:</strong> d${character.system_favor_die}</p>
    </div>
  </div>

  ${character.notes ? `
    <div class="section">
      <div class="section-title">Notes</div>
      <p style="white-space: pre-wrap;">${character.notes}</p>
    </div>
  ` : ''}

  ${character.backstory ? `
    <div class="section">
      <div class="section-title">Backstory</div>
      <p style="white-space: pre-wrap;">${character.backstory}</p>
    </div>
  ` : ''}

  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 11px; color: #666; text-align: center;">
    Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>
  `;
}

/**
 * Export character as PDF (opens print dialog)
 */
export function exportCharacterPDF(character: CharacterWithAbilities): void {
  const html = generateCharacterSheetHTML(character);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

