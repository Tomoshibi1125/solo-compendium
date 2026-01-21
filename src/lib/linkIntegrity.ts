/**
 * Link Integrity Checker
 * 
 * Crawls character data to find compendium references and verifies they resolve.
 * Detects broken links (references to non-existent compendium entities).
 */

import { supabase } from '@/integrations/supabase/client';
import { resolveRef, type EntryType } from './compendiumResolver';
import type { Database } from '@/integrations/supabase/types';

export interface BrokenLink {
  characterId: string;
  characterName: string;
  referenceType: 'rune' | 'job' | 'path' | 'background' | 'feature' | 'power';
  referenceId?: string;
  referenceName?: string;
  location: string; // e.g., "character_rune_inscriptions", "character.job"
  severity: 'error' | 'warning';
  message: string;
}

/**
 * Check link integrity for a single character
 * 
 * @param characterId - The character ID to check
 * @returns Array of broken links found
 */
export async function checkLinkIntegrity(characterId: string): Promise<BrokenLink[]> {
  const brokenLinks: BrokenLink[] = [];

  // Fetch character data
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('id, name, job, path, background')
    .eq('id', characterId)
    .single();

  if (charError || !character) {
    return [{
      characterId,
      characterName: 'Unknown',
      referenceType: 'job',
      location: 'characters',
      severity: 'error',
      message: `Character not found: ${characterId}`,
    }];
  }

  // Check job reference (name-based)
  if (character.job) {
    const { data: job } = await supabase
      .from('compendium_jobs')
      .select('id, name')
      .eq('name', character.job)
      .maybeSingle();
    
    if (!job) {
      brokenLinks.push({
        characterId: character.id,
        characterName: character.name,
        referenceType: 'job',
        referenceName: character.job,
        location: 'characters.job',
        severity: 'error',
        message: `Job "${character.job}" not found in compendium`,
      });
    }
  }

  // Check path reference (name-based)
  if (character.path) {
    const { data: path } = await supabase
      .from('compendium_job_paths')
      .select('id, name')
      .eq('name', character.path)
      .maybeSingle();
    
    if (!path) {
      brokenLinks.push({
        characterId: character.id,
        characterName: character.name,
        referenceType: 'path',
        referenceName: character.path,
        location: 'characters.path',
        severity: 'error',
        message: `Path "${character.path}" not found in compendium`,
      });
    }
  }

  // Check background reference (name-based)
  if (character.background) {
    const { data: background } = await supabase
      .from('compendium_backgrounds')
      .select('id, name')
      .eq('name', character.background)
      .maybeSingle();
    
    if (!background) {
      brokenLinks.push({
        characterId: character.id,
        characterName: character.name,
        referenceType: 'background',
        referenceName: character.background,
        location: 'characters.background',
        severity: 'error',
        message: `Background "${character.background}" not found in compendium`,
      });
    }
  }

  // Check rune inscriptions (explicit FK)
  const { data: runeInscriptions } = await supabase
    .from('character_rune_inscriptions')
    .select('id, rune_id')
    .eq('character_id', characterId);

  if (runeInscriptions) {
    for (const inscription of runeInscriptions) {
      const rune = await resolveRef('runes', inscription.rune_id);
      if (!rune) {
        brokenLinks.push({
          characterId: character.id,
          characterName: character.name,
          referenceType: 'rune',
          referenceId: inscription.rune_id,
          location: 'character_rune_inscriptions',
          severity: 'error',
          message: `Rune inscription references non-existent rune: ${inscription.rune_id}`,
        });
      }
    }
  }

  // Check rune knowledge (explicit FK)
  const { data: runeKnowledge } = await supabase
    .from('character_rune_knowledge')
    .select('id, rune_id')
    .eq('character_id', characterId);

  if (runeKnowledge) {
    for (const knowledge of runeKnowledge) {
      const rune = await resolveRef('runes', knowledge.rune_id);
      if (!rune) {
        brokenLinks.push({
          characterId: character.id,
          characterName: character.name,
          referenceType: 'rune',
          referenceId: knowledge.rune_id,
          location: 'character_rune_knowledge',
          severity: 'error',
          message: `Rune knowledge references non-existent rune: ${knowledge.rune_id}`,
        });
      }
    }
  }

  // Check features for source references (if source contains compendium IDs)
  // Note: Features store data directly, but source field might reference compendium
  // This is a best-effort check based on source field format
  const { data: features } = await supabase
    .from('character_features')
    .select('id, name, source')
    .eq('character_id', characterId);

  if (features) {
    for (const feature of features) {
      // Check if source looks like a compendium reference
      // Format might be "Job: Feature Name" or "Path: Feature Name"
      // We can't reliably parse this without more structure, so skip for now
      // This could be enhanced if source field is standardized
    }
  }

  return brokenLinks;
}

/**
 * Check link integrity for all characters (Warden function)
 * 
 * @returns Summary of broken links across all characters
 */
export async function checkAllLinkIntegrity(): Promise<{
  totalCharacters: number;
  charactersWithBrokenLinks: number;
  totalBrokenLinks: number;
  brokenLinksByType: Record<string, number>;
  brokenLinks: BrokenLink[];
}> {
  const { data: characters } = await supabase
    .from('characters')
    .select('id');

  if (!characters) {
    return {
      totalCharacters: 0,
      charactersWithBrokenLinks: 0,
      totalBrokenLinks: 0,
      brokenLinksByType: {},
      brokenLinks: [],
    };
  }

  const allBrokenLinks: BrokenLink[] = [];

  // Check each character (limit to avoid timeout)
  for (const character of characters.slice(0, 100)) { // Limit to first 100 for performance
    const brokenLinks = await checkLinkIntegrity(character.id);
    allBrokenLinks.push(...brokenLinks);
  }

  // Count broken links by type
  const brokenLinksByType: Record<string, number> = {};
  for (const link of allBrokenLinks) {
    brokenLinksByType[link.referenceType] = (brokenLinksByType[link.referenceType] || 0) + 1;
  }

  // Count characters with broken links
  const charactersWithBrokenLinks = new Set(allBrokenLinks.map(link => link.characterId)).size;

  return {
    totalCharacters: characters.length,
    charactersWithBrokenLinks,
    totalBrokenLinks: allBrokenLinks.length,
    brokenLinksByType,
    brokenLinks: allBrokenLinks,
  };
}

