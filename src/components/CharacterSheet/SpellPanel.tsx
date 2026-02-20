import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, BookOpen, Focus, Flame, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scaleCantripDamage, COMMON_CANTRIP_DICE } from '@/lib/cantripScaling';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpellSlotDisplay {
  level: number;
  current: number;
  max: number;
}

export interface SpellEntry {
  id: string;
  name: string;
  level: number;
  isRitual: boolean;
  isConcentration: boolean;
  isPrepared: boolean;
  castingTime: string | null;
  range: string | null;
  duration: string | null;
  description: string | null;
  higherLevels: string | null;
  school: string | null;
  damage?: string | null;
}

interface SpellPanelProps {
  characterLevel: number;
  spellSlots: SpellSlotDisplay[];
  spells: SpellEntry[];
  spellSaveDC: number;
  spellAttackBonus: number;
  maxPrepared: number | null;
  canPrepare: boolean;
  onCastSpell: (spellId: string, atLevel: number, asRitual: boolean) => void;
  onTogglePrepared: (spellId: string, prepared: boolean) => void;
  onRestoreSlot?: (level: number) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SpellPanel({
  characterLevel,
  spellSlots,
  spells,
  spellSaveDC,
  spellAttackBonus,
  maxPrepared,
  canPrepare,
  onCastSpell,
  onTogglePrepared,
  onRestoreSlot,
}: SpellPanelProps) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [castDialog, setCastDialog] = useState<{ spell: SpellEntry; open: boolean } | null>(null);
  const [castLevel, setCastLevel] = useState<number>(0);

  const preparedCount = spells.filter((s) => s.isPrepared && s.level > 0).length;

  // Group spells by level
  const cantrips = spells.filter((s) => s.level === 0);
  const byLevel: Record<number, SpellEntry[]> = {};
  spells
    .filter((s) => s.level > 0)
    .forEach((s) => {
      if (!byLevel[s.level]) byLevel[s.level] = [];
      byLevel[s.level].push(s);
    });

  const openCastDialog = (spell: SpellEntry) => {
    setCastLevel(spell.level);
    setCastDialog({ spell, open: true });
  };

  const confirmCast = (asRitual: boolean) => {
    if (!castDialog) return;
    onCastSpell(castDialog.spell.id, asRitual ? castDialog.spell.level : castLevel, asRitual);
    setCastDialog(null);
  };

  const availableUpcastLevels = (baseLevel: number) =>
    spellSlots.filter((s) => s.level >= baseLevel && s.current > 0).map((s) => s.level);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" /> Powers &amp; Spells
        </h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Save DC <span className="font-bold text-foreground">{spellSaveDC}</span></span>
          <span className="text-muted-foreground">Attack <span className="font-bold text-foreground">+{spellAttackBonus}</span></span>
        </div>
      </div>

      {/* Spell Slot Tracker */}
      <div className="flex flex-wrap gap-3">
        {spellSlots.map((slot) => (
          <TooltipProvider key={slot.level}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground mb-0.5">Lvl {slot.level}</div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: slot.max }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-3.5 w-3.5 rounded-full border transition-colors',
                          i < slot.current
                            ? 'bg-purple-500 border-purple-600'
                            : 'bg-gray-200 border-gray-300'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                Level {slot.level}: {slot.current}/{slot.max} slots
                {onRestoreSlot && slot.current < slot.max && (
                  <Button size="sm" variant="link" className="text-xs p-0 h-auto ml-2" onClick={() => onRestoreSlot(slot.level)}>
                    Restore
                  </Button>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Prepared count */}
      {canPrepare && maxPrepared !== null && (
        <div className="text-xs text-muted-foreground">
          <BookOpen className="inline h-3 w-3 mr-1" />
          Prepared: {preparedCount} / {maxPrepared}
        </div>
      )}

      {/* Cantrips */}
      {cantrips.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1.5">Cantrips</h3>
          <div className="flex flex-wrap gap-1.5">
            {cantrips.map((spell) => {
              const baseDie = COMMON_CANTRIP_DICE[spell.name];
              const scaled = baseDie ? scaleCantripDamage(`1d${baseDie}`, characterLevel) : null;

              return (
                <TooltipProvider key={spell.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1"
                        onClick={() => onCastSpell(spell.id, 0, false)}
                      >
                        <Flame className="h-3 w-3 text-orange-500" />
                        {spell.name}
                        {scaled && <span className="text-muted-foreground font-mono">({scaled})</span>}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs text-left">
                      <p className="font-semibold">{spell.name} <Badge variant="outline" className="text-[10px] ml-1">Cantrip</Badge></p>
                      {spell.castingTime && <p className="text-xs">Casting: {spell.castingTime}</p>}
                      {spell.range && <p className="text-xs">Range: {spell.range}</p>}
                      {spell.duration && <p className="text-xs">Duration: {spell.duration}</p>}
                      {scaled && <p className="text-xs font-mono text-orange-400">Damage: {scaled}</p>}
                      {spell.description && <p className="text-xs mt-1 text-muted-foreground">{spell.description}</p>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      )}

      {/* Leveled Spells */}
      {Object.entries(byLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, levelSpells]) => {
          const lvl = Number(level);
          const isExpanded = expandedLevel === lvl;
          const slot = spellSlots.find((s) => s.level === lvl);

          return (
            <div key={lvl} className="border rounded-md">
              <button
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedLevel(isExpanded ? null : lvl)}
              >
                <span>Level {lvl} ({levelSpells.length} spells)</span>
                <div className="flex items-center gap-2">
                  {slot && (
                    <span className="text-xs text-muted-foreground">{slot.current}/{slot.max} slots</span>
                  )}
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {isExpanded && (
                <div className="border-t px-3 py-2 space-y-1">
                  {levelSpells.map((spell) => (
                    <div key={spell.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {canPrepare && (
                          <button
                            onClick={() => onTogglePrepared(spell.id, !spell.isPrepared)}
                            className={cn(
                              'h-4 w-4 rounded border transition-colors',
                              spell.isPrepared
                                ? 'bg-purple-500 border-purple-600'
                                : 'bg-white border-gray-300'
                            )}
                            aria-label={spell.isPrepared ? `Unprepare ${spell.name}` : `Prepare ${spell.name}`}
                          />
                        )}
                        <span className={cn('text-sm', !spell.isPrepared && canPrepare && 'text-muted-foreground')}>
                          {spell.name}
                        </span>
                        {spell.isConcentration && (
                          <Focus className="h-3 w-3 text-violet-500" />
                        )}
                        {spell.isRitual && (
                          <Badge variant="outline" className="text-[9px] h-4 px-1">R</Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        disabled={!spell.isPrepared && canPrepare}
                        onClick={() => openCastDialog(spell)}
                      >
                        Cast
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      {/* Cast Dialog (upcast / ritual) */}
      {castDialog && (
        <Dialog open={castDialog.open} onOpenChange={(o) => !o && setCastDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cast {castDialog.spell.name}</DialogTitle>
              <DialogDescription>
                Level {castDialog.spell.level} spell
                {castDialog.spell.isConcentration && ' • Concentration'}
                {castDialog.spell.isRitual && ' • Ritual'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {/* Level selector for upcast */}
              <div>
                <label className="text-sm font-medium">Cast at level</label>
                <div className="flex gap-1.5 mt-1">
                  {availableUpcastLevels(castDialog.spell.level).map((lvl) => (
                    <Button
                      key={lvl}
                      size="sm"
                      variant={castLevel === lvl ? 'default' : 'outline'}
                      className="h-8 w-8 p-0"
                      onClick={() => setCastLevel(lvl)}
                    >
                      {lvl}
                    </Button>
                  ))}
                </div>
              </div>

              {castDialog.spell.higherLevels && castLevel > castDialog.spell.level && (
                <p className="text-xs text-muted-foreground rounded bg-muted p-2">
                  <strong>At Higher Levels:</strong> {castDialog.spell.higherLevels}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              {castDialog.spell.isRitual && (
                <Button variant="outline" onClick={() => confirmCast(true)}>
                  Cast as Ritual (no slot)
                </Button>
              )}
              <Button onClick={() => confirmCast(false)}>
                Cast at Level {castLevel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
