import React, { useState, useEffect } from 'react';
import { Character } from '../types/character';
import { RegentQuestManager, RegentQuest } from '../lib/regentGeminiSystem';

interface ProtocolWardenProps {
  wardenId: string;
  characters: Character[];
  onQuestCompleted: (questId: string, characterId: string) => void;
}

export const ProtocolWarden: React.FC<ProtocolWardenProps> = ({
  wardenId,
  characters,
  onQuestCompleted
}) => {
  const [availableQuests, setAvailableQuests] = useState<RegentQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<RegentQuest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<RegentQuest | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuests();
  }, [wardenId]);

  const loadQuests = () => {
    const allQuests = (RegentQuestManager as any).QUEST_DATABASE as RegentQuest[];
    const completed = allQuests.filter(quest => quest.completed);
    const available = allQuests.filter(quest => !quest.completed);
    
    setCompletedQuests(completed);
    setAvailableQuests(available);
  };

  const handleQuestComplete = (questId: string) => {
    if (!selectedCharacter) {
      alert('Please select a character to complete this quest for.');
      return;
    }

    setLoading(true);
    
    // Mark quest as completed by this warden for this character
    RegentQuestManager.completeQuest(questId, `${wardenId}_${selectedCharacter}`);
    
    // Notify parent component
    onQuestCompleted(questId, selectedCharacter);
    
    // Refresh quest lists
    loadQuests();
    
    // Reset selection
    setSelectedQuest(null);
    setSelectedCharacter('');
    setLoading(false);
  };

  const canCompleteQuest = (quest: RegentQuest): boolean => {
    if (!selectedCharacter) return false;
    
    const character = characters.find(c => c.id === selectedCharacter);
    if (!character) return false;
    
    return character.level >= quest.requirements.level;
  };

  const getQuestStatusColor = (quest: RegentQuest): string => {
    if (quest.completed) return 'bg-green-900 border-green-400';
    if (selectedQuest?.id === quest.id) return 'bg-yellow-900 border-yellow-400';
    return 'bg-purple-900 border-purple-400';
  };

  const getCharacterEligibility = (character: Character, quest: RegentQuest): boolean => {
    return character.level >= quest.requirements.level;
  };

  return (
    <div className="protocol-warden p-6 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
          <span className="mr-2">🛡️</span>
          Protocol Warden Interface
        </h2>
        <p className="text-indigo-200">
          Manage regent quests and unlock sovereign powers for worthy characters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Quests */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Available Quests ({availableQuests.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {availableQuests.map(quest => (
              <div
                key={quest.id}
                className={`quest-card p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-102 ${getQuestStatusColor(quest)}`}
                onClick={() => setSelectedQuest(quest)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-white">{quest.name}</h4>
                  <div className="text-sm text-purple-300">
                    Level {quest.requirements.level}
                  </div>
                </div>
                
                <p className="text-purple-200 text-sm mb-3">{quest.description}</p>
                
                <div className="mb-3">
                  <div className="text-xs text-purple-300 mb-1">Unlocks:</div>
                  <div className="text-sm text-yellow-400 font-semibold">
                    {quest.regentUnlock.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-purple-300 mb-1">Prerequisites:</div>
                  <div className="flex flex-wrap gap-1">
                    {quest.requirements.prerequisites.map(prereq => (
                      <span key={prereq} className="text-xs bg-purple-800 text-purple-200 px-2 py-1 rounded">
                        {prereq.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {quest.completed && (
                  <div className="text-green-400 text-sm">
                    ✅ Completed by {quest.completedBy} on {quest.completionDate?.toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            
            {availableQuests.length === 0 && (
              <div className="text-center py-8 text-purple-300">
                <div className="text-6xl mb-4">🎯</div>
                <p>All available quests have been completed!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quest Completion Interface */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">✅</span>
            Complete Quest
          </h3>
          
          {selectedQuest && (
            <div className="bg-purple-800 bg-opacity-50 rounded-lg p-4 border-2 border-yellow-400">
              <h4 className="text-lg font-bold text-yellow-400 mb-2">
                {selectedQuest.name}
              </h4>
              <p className="text-purple-200 text-sm mb-4">
                {selectedQuest.description}
              </p>
              
              <div className="mb-4">
                <label
                  htmlFor="protocolwarden-complete-quest-character"
                  className="block text-sm font-medium text-purple-300 mb-2"
                >
                  Select Character to Complete Quest For:
                </label>
                <select
                  id="protocolwarden-complete-quest-character"
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  aria-label="Select character to complete quest for"
                  className="w-full p-2 bg-purple-700 text-white rounded border border-purple-600 focus:border-yellow-400 focus:outline-none"
                >
                  <option value="">Choose a character...</option>
                  {characters
                    .filter(char => getCharacterEligibility(char, selectedQuest))
                    .map(character => (
                      <option key={character.id} value={character.id}>
                        {character.name} (Level {character.level})
                        {getCharacterEligibility(character, selectedQuest) ? ' ✅' : ' ❌'}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mb-4">
                <div className="text-sm text-purple-300 mb-2">Quest Requirements:</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-400">Required Level:</span>
                    <span className={`font-semibold ${
                      selectedCharacter && getCharacterEligibility(characters.find(c => c.id === selectedCharacter)!, selectedQuest)
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {selectedQuest.requirements.level}
                    </span>
                  </div>
                  <div className="text-sm text-purple-400">
                    Prerequisites: {selectedQuest.requirements.prerequisites.join(', ')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuestComplete(selectedQuest.id)}
                disabled={!canCompleteQuest(selectedQuest) || loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-purple-900 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-purple-900 mr-2"></div>
                    Completing Quest...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🎯</span>
                    Complete Quest & Unlock Regent
                  </span>
                )}
              </button>
            </div>
          )}

          {!selectedQuest && (
            <div className="text-center py-8 text-purple-300">
              <div className="text-6xl mb-4">📋</div>
              <p>Select a quest from the left to complete</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Quests Summary */}
      <div className="mt-6 pt-6 border-t border-purple-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Quest Completion History
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {completedQuests.map(quest => (
            <div
              key={quest.id}
              className="bg-green-800 bg-opacity-30 rounded-lg p-3 border border-green-600"
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-sm font-bold text-green-300">{quest.name}</h5>
                <div className="text-xs text-green-400">
                  {quest.completionDate?.toLocaleDateString()}
                </div>
              </div>
              
              <div className="text-xs text-green-200">
                Completed for: {quest.completedBy}
              </div>
              
              <div className="text-xs text-yellow-400 mt-1">
                Unlocked: {quest.regentUnlock.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
              </div>
            </div>
          ))}
        </div>
        
        {completedQuests.length === 0 && (
          <div className="text-center py-4 text-purple-300">
            <p>No quests have been completed yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
