import { Shield, Sword, Target, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ShadowSoldierDetailProps {
  data: {
    id: string;
    name: string;
    description: string;
    gate_rank?: string;
    role?: string;
    tags?: string[];
    source_book?: string;
  };
}

export const ShadowSoldierDetail = ({ data }: ShadowSoldierDetailProps) => {
  const entry = data;
  const getRoleIcon = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'tank':
        return <Shield className="w-5 h-5" />;
      case 'assassin':
        return <Target className="w-5 h-5" />;
      case 'scout':
        return <Eye className="w-5 h-5" />;
      default:
        return <Sword className="w-5 h-5" />;
    }
  };

  const getRankColor = (rank?: string) => {
    switch (rank) {
      case 'A':
        return 'text-gate-a border-gate-a/40 bg-gate-a/10';
      case 'B':
        return 'text-gate-b border-gate-b/40 bg-gate-b/10';
      case 'C':
        return 'text-gate-c border-gate-c/40 bg-gate-c/10';
      default:
        return 'text-muted-foreground border-border bg-card';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold font-heading">{entry.name}</h2>
          {entry.role && (
            <div className="flex items-center gap-2 mt-2">
              {getRoleIcon(entry.role)}
              <span className="text-lg text-muted-foreground capitalize">{entry.role}</span>
            </div>
          )}
        </div>
        {entry.gate_rank && (
          <Badge className={getRankColor(entry.gate_rank)}>
            {entry.gate_rank}-Rank
          </Badge>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div id="soldier-description" className="scroll-mt-4">
        <h3 className="text-lg font-semibold mb-3 font-heading">Overview</h3>
        <p className="text-muted-foreground leading-relaxed">{entry.description}</p>
      </div>

      {/* Combat Role Details */}
      {entry.role && (
        <div id="soldier-role" className="scroll-mt-4">
          <h3 className="text-lg font-semibold mb-3 font-heading">Combat Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-card border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getRoleIcon(entry.role)}
                <span className="font-medium capitalize">{entry.role}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {entry.role === 'Tank' && 'Specialized in defense, crowd control, and protecting allies. High durability and threat generation.'}
                {entry.role === 'Assassin' && 'Specialized in stealth, reconnaissance, and eliminating high-value targets. High burst damage.'}
                {entry.role === 'Mage' && 'Specialized in shadow magic and ranged spellcasting. Area control and debuff capabilities.'}
                {entry.role === 'Archer' && 'Specialized in precise long-range attacks and reconnaissance. High accuracy and mobility.'}
                {entry.role === 'Warrior' && 'Balanced melee combatant with good offense and defense capabilities. Versatile frontline fighter.'}
                {entry.role === 'Scout' && 'Specialized in reconnaissance, scouting, and rapid movement. High speed and detection abilities.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div id="soldier-tags" className="scroll-mt-4">
          <h3 className="text-lg font-semibold mb-3 font-heading">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="capitalize">
                {tag.replace('-', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Source */}
      {entry.source_book && (
        <div className="text-sm text-muted-foreground">
          Source: {entry.source_book}
        </div>
      )}
    </div>
  );
};
