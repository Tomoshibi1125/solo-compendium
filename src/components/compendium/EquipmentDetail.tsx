import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { Coins, Weight, Sword, Shield } from 'lucide-react';

interface EquipmentData {
  id: string;
  name: string;
  description?: string;
  equipment_type: string;
  cost_credits?: number;
  weight?: number;
  damage?: string;
  damage_type?: string;
  properties?: string[];
  armor_class?: number;
  source_book?: string;
}

const typeLabels: Record<string, string> = {
  simple_melee: 'Simple Melee Weapon',
  simple_ranged: 'Simple Ranged Weapon',
  martial_melee: 'Martial Melee Weapon',
  martial_ranged: 'Martial Ranged Weapon',
  light_armor: 'Light Armor',
  medium_armor: 'Medium Armor',
  heavy_armor: 'Heavy Armor',
  shield: 'Shield',
  gear: 'Adventuring Gear',
  tools: 'Tools',
  hunter_gear: 'Hunter Gear',
};

export const EquipmentDetail = ({ data }: { data: EquipmentData }) => {
  const isWeapon = data.equipment_type.includes('melee') || data.equipment_type.includes('ranged');
  const isArmor = data.equipment_type.includes('armor') || data.equipment_type === 'shield';

  return (
    <div className="space-y-6">
      {/* Header */}
      <SystemWindow title={data.name.toUpperCase()}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{typeLabels[data.equipment_type] || data.equipment_type}</Badge>
            {data.source_book && <Badge variant="outline">{data.source_book}</Badge>}
          </div>
          {data.description && (
            <p className="text-muted-foreground">{data.description}</p>
          )}
        </div>
      </SystemWindow>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SystemWindow title="COST" compact>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-display text-xl">
              {data.cost_credits?.toLocaleString() || '—'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">credits</span>
        </SystemWindow>
        
        <SystemWindow title="WEIGHT" compact>
          <div className="flex items-center gap-2">
            <Weight className="w-5 h-5 text-muted-foreground" />
            <span className="font-display text-xl">
              {data.weight || '—'}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">lbs</span>
        </SystemWindow>
        
        {isWeapon && (
          <SystemWindow title="DAMAGE" compact>
            <div className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400" />
              <span className="font-display text-xl">{data.damage || '—'}</span>
            </div>
            {data.damage_type && (
              <span className="text-xs text-muted-foreground">{data.damage_type}</span>
            )}
          </SystemWindow>
        )}
        
        {isArmor && (
          <SystemWindow title="ARMOR CLASS" compact>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="font-display text-xl">
                {data.armor_class ? `+${data.armor_class}` : '—'}
              </span>
            </div>
          </SystemWindow>
        )}
      </div>

      {/* Properties */}
      {data.properties && data.properties.length > 0 && (
        <SystemWindow title="PROPERTIES">
          <div className="flex flex-wrap gap-2">
            {data.properties.map((prop) => (
              <Badge key={prop} variant="outline" className="capitalize">{prop}</Badge>
            ))}
          </div>
        </SystemWindow>
      )}
    </div>
  );
};