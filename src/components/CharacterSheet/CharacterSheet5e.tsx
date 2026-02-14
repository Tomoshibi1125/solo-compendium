/**
 * 5e Character Sheet Component with System Ascendant Flavor
 * Uses standard 5e mechanics while preserving homebrew terminology
 */

import React, { useState, useEffect } from 'react';
import type { Character } from '@/lib/5eRulesEngine';
import { createCharacterSheet, CharacterSheetSystem } from '@/lib/5eCharacterSheet';
import { Formatters } from '@/lib/5eUIIntegration';
import { SpellSystem } from '@/lib/5eSpellSystem';

interface CharacterSheet5eProps {
  characterId: string;
  character: Character;
  onUpdate?: (updates: Partial<Character>) => void;
}

export function CharacterSheet5e({ characterId, character, onUpdate }: CharacterSheet5eProps) {
  const [sheet, setSheet] = useState(() => createCharacterSheet(character));
  const [isEditing, setIsEditing] = useState(false);
  const [tempCharacter, setTempCharacter] = useState(character);

  // Update sheet when character changes
  useEffect(() => {
    const newSheet = createCharacterSheet(character);
    setSheet(newSheet);
    setTempCharacter(character);
  }, [character]);

  // Handle ability score changes
  const handleAbilityChange = (ability: string, value: number) => {
    const updated = {
      ...tempCharacter,
      abilities: {
        ...tempCharacter.abilities,
        [ability]: Math.max(1, Math.min(20, value))
      }
    };
    setTempCharacter(updated);
  };

  // Handle HP changes
  const handleHPChange = (type: 'current' | 'temp', value: number) => {
    const updated = {
      ...tempCharacter,
      hitPoints: {
        ...tempCharacter.hitPoints,
        [type]: Math.max(0, value)
      }
    };
    setTempCharacter(updated);
  };

  // Save changes
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(tempCharacter);
    }
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setTempCharacter(character);
    setIsEditing(false);
  };

  // Apply damage
  const handleApplyDamage = (damage: number) => {
    const updatedSheet = CharacterSheetSystem.applyDamage(sheet, damage);
    if (onUpdate) {
      onUpdate(updatedSheet.character);
    }
  };

  // Apply healing
  const handleApplyHealing = (healing: number) => {
    const updatedSheet = CharacterSheetSystem.applyHealing(sheet, healing);
    if (onUpdate) {
      onUpdate(updatedSheet.character);
    }
  };

  // Long rest
  const handleLongRest = () => {
    const updatedSheet = CharacterSheetSystem.longRest(sheet);
    if (onUpdate) {
      onUpdate(updatedSheet.character);
    }
  };

  // Get spell slots display
  const spellSlots = SpellSystem.getCharacterSpellSlots(character);
  const spellSlotDisplay = Object.entries(spellSlots)
    .filter(([_, count]) => count > 0)
    .map(([level, count]) => {
      const levelName = level === 'cantrips' ? 'Cantrips' : `Level ${level.replace('level', '')}`;
      return `${levelName}: ${count}`;
    });

  return (
    <div className="character-sheet-5e bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{character.name}</h1>
          <p className="text-gray-600">Level {character.level} {character.job}</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={handleLongRest}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Long Rest
              </button>
            </>
          )}
        </div>
      </div>

      {/* Ability Scores */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Ability Scores</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(sheet.character.abilities).map(([ability, score]) => (
            <div key={ability} className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">
                {Formatters.formatAbilityScore(ability as any, score)}
              </div>
              {isEditing && (
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={score}
                  onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value))}
                  className="mt-1 w-full px-2 py-1 border rounded"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Combat Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-3 rounded">
            <div className="font-medium text-red-700">{Formatters.hitPoints(sheet.character)}</div>
            {isEditing && (
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={sheet.character.hitPoints.current}
                  onChange={(e) => handleHPChange('current', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                  placeholder="Current"
                />
                <input
                  type="number"
                  min="0"
                  value={sheet.character.hitPoints.temp}
                  onChange={(e) => handleHPChange('temp', parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                  placeholder="Temp"
                />
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-medium text-blue-700">{Formatters.armorClass(sheet.character)}</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded">
            <div className="font-medium text-green-700">{Formatters.initiative(sheet.character)}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded">
            <div className="font-medium text-purple-700">{Formatters.speed(sheet.character)}</div>
          </div>
        </div>
      </div>

      {/* Proficiency Bonus */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Proficiency Bonus</h2>
        <div className="bg-yellow-50 p-3 rounded inline-block">
          <div className="font-medium text-yellow-700">
            Proficiency Bonus: +{sheet.calculated.proficiencyBonus}
          </div>
        </div>
      </div>

      {/* Saving Throws */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Saving Throws</h2>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(sheet.calculated.savingThrows).map(([ability, bonus]) => (
            <div key={ability} className="bg-gray-50 p-2 rounded text-sm">
              {Formatters.savingThrow(ability as any, bonus, sheet.character.savingThrowProficiencies.includes(ability as any))}
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Skills</h2>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(sheet.calculated.skills).map(([skill, bonus]) => (
            <div key={skill} className="bg-gray-50 p-2 rounded text-sm">
              {Formatters.skill(skill, bonus, sheet.character.skillProficiencies.includes(skill), sheet.character.skillExpertise.includes(skill))}
            </div>
          ))}
        </div>
      </div>

      {/* System Favor */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">System Favor</h2>
        <div className="bg-indigo-50 p-3 rounded">
          <div className="font-medium text-indigo-700">{Formatters.systemFavor(sheet.character)}</div>
        </div>
      </div>

      {/* Spellcasting */}
      {sheet.spellcasting.canCastSpells && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Spellcasting</h2>
          <div className="bg-purple-50 p-3 rounded">
            <div className="font-medium text-purple-700 mb-2">
              Spell Save DC: {sheet.spellcasting.spellSaveDC}
            </div>
            <div className="font-medium text-purple-700 mb-2">
              Spell Attack Bonus: +{sheet.spellcasting.spellAttackBonus}
            </div>
            <div className="text-sm text-purple-600">
              {spellSlotDisplay.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Conditions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Status</h2>
        <div className="bg-orange-50 p-3 rounded">
          <div className="font-medium text-orange-700 mb-1">
            {Formatters.conditions(sheet.character)}
          </div>
          <div className="text-sm text-orange-600">
            {Formatters.deathSaves(sheet.character)}
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Equipment</h2>
        <div className="bg-gray-50 p-3 rounded">
          <div className="font-medium text-gray-700">
            {Formatters.equipment(sheet.character)}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!isEditing && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleApplyDamage(10)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Take 10 Damage
            </button>
            <button
              onClick={() => handleApplyHealing(10)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Heal 10 HP
            </button>
            <button
              onClick={() => handleApplyDamage(sheet.character.hitPoints.current)}
              className="px-3 py-1 bg-red-800 text-white rounded hover:bg-red-900 text-sm"
            >
              Drop to 0 HP
            </button>
          </div>
        </div>
      )}

      {/* Character Summary */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Character Summary</h3>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">
          {Formatters.characterSummary(sheet.character)}
        </pre>
      </div>
    </div>
  );
}
