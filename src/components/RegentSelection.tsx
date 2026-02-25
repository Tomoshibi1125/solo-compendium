import React, { useState, useEffect } from 'react';
import { error as logError } from '@/lib/logger';
import { Character } from '../types/character';
import {
  RegentGeminiSystem,
  RegentChoice,
  RegentPath,
  GeminiSovereign,
  RegentQuestManager
} from '../lib/regentGeminiSystem';

type AbilityScore = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

interface RegentSelectionProps {
  character: Character;
  onRegentSelected: (regent: RegentPath) => void;
  onGeminiActivated: (sovereign: GeminiSovereign) => void;
  currentRegents: RegentPath[];
  maxRegents: number;
}

export const RegentSelection: React.FC<RegentSelectionProps> = ({
  character,
  onRegentSelected,
  onGeminiActivated,
  currentRegents,
  maxRegents
}) => {
  const [regentChoices, setRegentChoices] = useState<RegentChoice[]>([]);
  const [selectedRegent, setSelectedRegent] = useState<RegentChoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState(false);
  const [geminiPreview, setGeminiPreview] = useState<GeminiSovereign | null>(null);

  useEffect(() => {
    generateRegentChoices();
  }, [character]);

  useEffect(() => {
    setGeminiAvailable(currentRegents.length >= 2 && currentRegents.length < maxRegents);
  }, [currentRegents, maxRegents]);

  const generateRegentChoices = async () => {
    setLoading(true);
    try {
      const choices = await RegentGeminiSystem.generateRegentChoices(character);
      setRegentChoices(choices);
    } catch (error) {
      logError('Failed to generate regent choices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegentSelect = async (choice: RegentChoice) => {
    setSelectedRegent(choice);

    // Preview Gemini fusion if this would be the second regent
    if (currentRegents.length === 1) {
      const preview = await RegentGeminiSystem.createGeminiFusion(
        character,
        currentRegents[0],
        choice.regent
      );
      setGeminiPreview(preview);
    }
  };

  const confirmRegentSelection = () => {
    if (selectedRegent) {
      onRegentSelected(selectedRegent.regent);
      setSelectedRegent(null);
      setGeminiPreview(null);
    }
  };

  const activateGeminiProtocol = async () => {
    if (currentRegents.length >= 2) {
      setLoading(true);
      try {
        const sovereign = await RegentGeminiSystem.createGeminiFusion(
          character,
          currentRegents[0],
          currentRegents[1]
        );
        onGeminiActivated(sovereign);
      } catch (error) {
        logError('Failed to activate Gemini Protocol:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatColor = (stat: AbilityScore): string => {
    const colors: Record<AbilityScore, string> = {
      'STR': 'text-red-600',
      'AGI': 'text-green-600',
      'VIT': 'text-orange-600',
      'INT': 'text-blue-600',
      'SENSE': 'text-purple-600',
      'PRE': 'text-pink-600'
    };
    return colors[stat];
  };

  const getStatIcon = (stat: AbilityScore): string => {
    const icons: Record<AbilityScore, string> = {
      'STR': '💪',
      'AGI': '🏃',
      'VIT': '🛡️',
      'INT': '🧠',
      'SENSE': '👁️',
      'PRE': '✨'
    };
    return icons[stat];
  };

  const abilities: Record<AbilityScore, number> = (character.abilities as Record<AbilityScore, number> | undefined) ?? {
    STR: 10,
    AGI: 10,
    VIT: 10,
    INT: 10,
    SENSE: 10,
    PRE: 10,
  };

  const highestStat = (Object.entries(abilities) as Array<[AbilityScore, number]>).reduce(
    (highest, [stat, value]) => (value > abilities[highest] ? stat : highest),
    'STR' as AbilityScore,
  );

  return (
    <div className="regent-selection p-6 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <span className="mr-2">👑</span>
          Regent Selection
        </h2>
        <div className="text-purple-200 mb-4">
          Based on your highest stat:
          <span className={`font-bold ml-2 ${getStatColor(highestStat)}`}>
            {getStatIcon(highestStat)} {highestStat} ({abilities[highestStat]})
          </span>
        </div>
        <div className="text-purple-300 text-sm">
          Current Regents: {currentRegents.length}/{maxRegents}
          {geminiAvailable && (
            <span className="ml-4 text-yellow-400 font-bold">
              🌟 Gemini Protocol Available!
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-purple-500 mx-auto"></div>
          <p className="text-purple-200 mt-4">Analyzing regent compatibility...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {regentChoices.map((choice, index) => (
            <div
              key={choice.regent.id}
              className={`regent-option bg-purple-800 bg-opacity-50 rounded-lg p-4 border-2 cursor-pointer transition-all hover:bg-opacity-80 hover:scale-105 ${selectedRegent?.regent.id === choice.regent.id
                  ? 'border-yellow-400 shadow-lg shadow-yellow-400/50'
                  : 'border-purple-600'
                }`}
              onClick={() => handleRegentSelect(choice)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{choice.regent.name}</h3>
                <div className="text-yellow-400 text-sm">
                  {choice.compatibilityScore}% Match
                </div>
              </div>

              <p className="text-purple-200 text-sm mb-3">{choice.regent.description}</p>

              <div className="mb-3">
                <div className="text-xs text-purple-300 mb-1">Requirements:</div>
                <div className="text-xs text-purple-400">
                  Quest / Warden Approval • {choice.regent.requirements.statThreshold} {choice.regent.type.split(' ')[0]}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-xs text-purple-300 mb-1">AI Analysis:</div>
                <div className="text-xs text-purple-200 italic">{choice.aiReasoning}</div>
              </div>

              <div className="flex flex-wrap gap-1">
                {choice.regent.abilities.slice(0, 3).map((ability, i) => (
                  <span key={i} className="text-xs bg-purple-700 text-purple-100 px-2 py-1 rounded">
                    {ability}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRegent && (
        <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4 mb-6 border-2 border-yellow-400">
          <h3 className="text-lg font-bold text-yellow-400 mb-2">Selected Regent</h3>
          <p className="text-purple-200 mb-4">{selectedRegent.regent.name}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-purple-300">Stat Alignment</div>
              <div className={`font-bold ${getStatColor(highestStat)}`}>
                {(abilities[highestStat] - selectedRegent.regent.requirements.statThreshold) > 0 ? '+' : ''}{abilities[highestStat] - selectedRegent.regent.requirements.statThreshold}
              </div>
            </div>
            <div>
              <div className="text-sm text-purple-300">Compatibility</div>
              <div className="font-bold text-green-400">{selectedRegent.compatibilityScore}%</div>
            </div>
          </div>

          <button
            onClick={confirmRegentSelection}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Confirm Regent Selection
          </button>
        </div>
      )}

      {geminiPreview && (
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 mb-6 border-2 border-yellow-400">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center">
            <span className="mr-2">🌟</span>
            Gemini Protocol Preview
          </h3>

          <div className="text-white mb-4">
            <div className="text-2xl font-bold mb-2">{geminiPreview.name}</div>
            <div className="text-sm opacity-90 mb-2">
              Fusion Type: <span className="font-bold">{geminiPreview.fusionType}</span>
            </div>
            <p className="text-sm">{geminiPreview.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-yellow-200">Base Job</div>
              <div className="font-bold text-white">{geminiPreview.baseJob}</div>
            </div>
            <div>
              <div className="text-sm text-yellow-200">Regents</div>
              <div className="text-white text-sm">
                {geminiPreview.regent1.name} + {geminiPreview.regent2.name}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-yellow-200 mb-2">Fusion Abilities</div>
            <div className="flex flex-wrap gap-1">
              {geminiPreview.abilities.slice(0, 6).map((ability, i) => (
                <span key={i} className="text-xs bg-yellow-700 text-yellow-100 px-2 py-1 rounded">
                  {ability}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-yellow-200">Features</div>
              <div className="text-white text-sm">{geminiPreview.features.length}</div>
            </div>
            <div>
              <div className="text-sm text-yellow-200">Spells</div>
              <div className="text-white text-sm">{geminiPreview.spells.length}</div>
            </div>
            <div>
              <div className="text-sm text-yellow-200">Techniques</div>
              <div className="text-white text-sm">{geminiPreview.techniques.length}</div>
            </div>
          </div>
        </div>
      )}

      {geminiAvailable && (
        <div className="text-center">
          <button
            onClick={activateGeminiProtocol}
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-purple-900 font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-purple-900 mr-2"></div>
                Activating Gemini Protocol...
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">🌟</span>
                Activate Gemini Protocol
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
