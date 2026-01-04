import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Download, Copy, Grid, Plus, Minus, Save, Trash2, Square, Layout, DoorOpen, Crown, Gem, AlertTriangle } from 'lucide-react';
import { Layout as PageLayout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type CellType = 'empty' | 'room' | 'corridor' | 'entrance' | 'boss' | 'treasure' | 'trap' | 'puzzle' | 'secret';

interface Cell {
  type: CellType;
  label?: string;
  connections: Set<string>; // Neighbor positions
}

interface Room {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: CellType;
  label: string;
}

interface DungeonMap {
  width: number;
  height: number;
  cells: Map<string, Cell>;
  rooms: Room[];
  seed: number;
}

const GATE_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;
import type { LucideIcon } from 'lucide-react';

const CELL_TYPES: { type: CellType; icon: LucideIcon; color: string; label: string }[] = [
  { type: 'empty', icon: Square, color: 'bg-background border-border', label: 'Empty' },
  { type: 'room', icon: Layout, color: 'bg-blue-500/20 border-blue-500/50', label: 'Room' },
  { type: 'corridor', icon: Grid, color: 'bg-gray-600/30 border-gray-600/50', label: 'Corridor' },
  { type: 'entrance', icon: DoorOpen, color: 'bg-green-500/30 border-green-500/60', label: 'Entrance' },
  { type: 'boss', icon: Crown, color: 'bg-red-500/40 border-red-500/70', label: 'Boss Chamber' },
  { type: 'treasure', icon: Gem, color: 'bg-yellow-500/40 border-yellow-500/70', label: 'Treasure Room' },
  { type: 'trap', icon: AlertTriangle, color: 'bg-orange-500/40 border-orange-500/70', label: 'Trap Room' },
  { type: 'puzzle', icon: Square, color: 'bg-purple-500/40 border-purple-500/70', label: 'Puzzle Room' },
  { type: 'secret', icon: Square, color: 'bg-indigo-500/40 border-indigo-500/70', label: 'Secret Room' },
];

function generateMap(width: number, height: number, rank: string): DungeonMap {
  const seed = Date.now();
  const cells = new Map<string, Cell>();
  const rooms: Room[] = [];
  
  // Initialize all cells as empty
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      cells.set(key, {
        type: 'empty',
        connections: new Set(),
      });
    }
  }

  // Determine number of rooms based on rank
  const roomCounts: Record<string, number> = {
    E: 3 + Math.floor(Math.random() * 3),
    D: 4 + Math.floor(Math.random() * 4),
    C: 5 + Math.floor(Math.random() * 5),
    B: 6 + Math.floor(Math.random() * 6),
    A: 8 + Math.floor(Math.random() * 8),
    S: 10 + Math.floor(Math.random() * 10),
  };
  const numRooms = roomCounts[rank] || 5;

  // Generate rooms
  const generatedRooms: { x: number; y: number; width: number; height: number }[] = [];
  
  for (let i = 0; i < numRooms * 2; i++) {
    const roomWidth = 2 + Math.floor(Math.random() * 4);
    const roomHeight = 2 + Math.floor(Math.random() * 4);
    const x = Math.floor(Math.random() * (width - roomWidth - 1)) + 1;
    const y = Math.floor(Math.random() * (height - roomHeight - 1)) + 1;

    // Check for overlap
    let overlaps = false;
    for (const room of generatedRooms) {
      if (
        x < room.x + room.width + 2 &&
        x + roomWidth + 2 > room.x &&
        y < room.y + room.height + 2 &&
        y + roomHeight + 2 > room.y
      ) {
        overlaps = true;
        break;
      }
    }

    if (!overlaps) {
      generatedRooms.push({ x, y, width: roomWidth, height: roomHeight });
      if (generatedRooms.length >= numRooms) break;
    }
  }

  // Place rooms
  generatedRooms.forEach((room, index) => {
    let roomType: CellType = 'room';
    let label = `Room ${index + 1}`;

    if (index === 0) {
      roomType = 'entrance';
      label = 'Entrance';
    } else if (index === generatedRooms.length - 1) {
      roomType = 'boss';
      label = 'Boss Chamber';
    } else {
      const rand = Math.random();
      if (rand < 0.15 && rank >= 'C') {
        roomType = 'treasure';
        label = 'Treasure Room';
      } else if (rand < 0.25 && rank >= 'D') {
        roomType = 'trap';
        label = 'Trap Room';
      } else if (rand < 0.35 && rank >= 'B') {
        roomType = 'puzzle';
        label = 'Puzzle Room';
      } else if (rand < 0.45 && rank >= 'C') {
        roomType = 'secret';
        label = 'Secret Room';
      }
    }

    // Fill room cells
    for (let ry = room.y; ry < room.y + room.height; ry++) {
      for (let rx = room.x; rx < room.x + room.width; rx++) {
        const key = `${rx},${ry}`;
        const cell = cells.get(key);
        if (cell) {
          cell.type = roomType;
          if (rx === room.x && ry === room.y) {
            // Store label on top-left cell
            const cellWithLabel = cell as Cell & { label?: string };
            cellWithLabel.label = label;
          }
        }
      }
    }

    rooms.push({
      id: `room-${index}`,
      x: room.x,
      y: room.y,
      width: room.width,
      height: room.height,
      type: roomType,
      label,
    });
  });

  // Generate corridors connecting rooms
  for (let i = 0; i < rooms.length - 1; i++) {
    const room1 = rooms[i];
    const room2 = rooms[i + 1];
    
    const room1CenterX = room1.x + Math.floor(room1.width / 2);
    const room1CenterY = room1.y + Math.floor(room1.height / 2);
    const room2CenterX = room2.x + Math.floor(room2.width / 2);
    const room2CenterY = room2.y + Math.floor(room2.height / 2);

    // Create L-shaped corridor
    // Horizontal first
    const startX = Math.min(room1CenterX, room2CenterX);
    const endX = Math.max(room1CenterX, room2CenterX);
    for (let x = startX; x <= endX; x++) {
      const key = `${x},${room1CenterY}`;
      const cell = cells.get(key);
      if (cell && cell.type === 'empty') {
        cell.type = 'corridor';
      }
    }

    // Then vertical
    const startY = Math.min(room1CenterY, room2CenterY);
    const endY = Math.max(room1CenterY, room2CenterY);
    for (let y = startY; y <= endY; y++) {
      const key = `${room2CenterX},${y}`;
      const cell = cells.get(key);
      if (cell && cell.type === 'empty') {
        cell.type = 'corridor';
      }
    }
  }

  return { width, height, cells, rooms, seed };
}

const DungeonMapGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedRank, setSelectedRank] = useState<string>('C');
  const [mapSize, setMapSize] = useState({ width: 20, height: 20 });
  const [dungeonMap, setDungeonMap] = useState<DungeonMap | null>(null);
  const [selectedCellType, setSelectedCellType] = useState<CellType>('room');
  const [zoom, setZoom] = useState(1);

  const handleGenerate = () => {
    const newMap = generateMap(mapSize.width, mapSize.height, selectedRank);
    setDungeonMap(newMap);
    toast({
      title: 'Map Generated!',
      description: `Created a Rank ${selectedRank} Gate with ${newMap.rooms.length} rooms.`,
    });
  };

  const handleCellClick = (x: number, y: number) => {
    if (!dungeonMap) return;
    
    const key = `${x},${y}`;
    const cell = dungeonMap.cells.get(key);
    if (cell && selectedCellType !== 'empty') {
      cell.type = selectedCellType;
      const newMap = { ...dungeonMap };
      setDungeonMap(newMap);
    }
  };

  const handleExport = () => {
    if (!dungeonMap) return;
    
    const exportData = {
      rank: selectedRank,
      width: dungeonMap.width,
      height: dungeonMap.height,
      rooms: dungeonMap.rooms.map(r => ({
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        type: r.type,
        label: r.label,
      })),
      generated: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate-${selectedRank}-map-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported!',
      description: 'Map data exported as JSON.',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getCellColor = (type: CellType) => {
    const cellType = CELL_TYPES.find(ct => ct.type === type);
    return cellType?.color || 'bg-background border-border';
  };

  const cellSize = Math.max(16, Math.min(32, Math.floor(600 / Math.max(mapSize.width, mapSize.height))));

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            GATE MAP GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate full Gate/dungeon maps for VTT-style gameplay. Create visual layouts with rooms, corridors, and special chambers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SystemWindow title="MAP SETTINGS">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rank">Gate Rank</Label>
                  <Select value={selectedRank} onValueChange={setSelectedRank}>
                    <SelectTrigger id="rank">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GATE_RANKS.map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          Rank {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      type="number"
                      value={mapSize.width}
                      onChange={(e) => setMapSize({ ...mapSize, width: parseInt(e.target.value) || 20 })}
                      min={10}
                      max={50}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      value={mapSize.height}
                      onChange={(e) => setMapSize({ ...mapSize, height: parseInt(e.target.value) || 20 })}
                      min={10}
                      max={50}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  className="w-full btn-shadow-monarch"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Map
                </Button>
              </div>
            </SystemWindow>

            <SystemWindow title="CELL TYPES">
              <div className="space-y-2">
                {CELL_TYPES.filter(ct => ct.type !== 'empty').map((cellType) => {
                  const Icon = cellType.icon;
                  return (
                    <button
                      key={cellType.type}
                      onClick={() => setSelectedCellType(cellType.type)}
                      className={cn(
                        'w-full p-2 rounded-lg border text-left transition-all',
                        selectedCellType === cellType.type
                          ? cellType.color + ' border-current'
                          : 'border-border hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-heading">{cellType.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </SystemWindow>

            <SystemWindow title="ZOOM">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm font-heading flex-1 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </SystemWindow>

            {dungeonMap && (
              <SystemWindow title="ROOMS" variant="quest">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dungeonMap.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-2 rounded border border-border bg-muted/30 text-xs"
                    >
                      <div className="font-heading font-semibold">{room.label}</div>
                      <div className="text-muted-foreground">
                        {room.width}×{room.height} at ({room.x}, {room.y})
                      </div>
                    </div>
                  ))}
                </div>
              </SystemWindow>
            )}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {dungeonMap ? (
              <>
                <SystemWindow title={`RANK ${selectedRank} GATE MAP`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {dungeonMap.rooms.length} Rooms • {dungeonMap.width}×{dungeonMap.height} Grid
                      </Badge>
                      <div className="flex gap-2">
                        <Button onClick={handleExport} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export JSON
                        </Button>
                        <Button onClick={handlePrint} variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>

                    <div
                      ref={mapRef}
                      className="border-2 border-border rounded-lg p-4 bg-background overflow-auto max-h-[600px]"
                      style={{
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <div
                        className="grid gap-0 inline-grid"
                        style={{
                          gridTemplateColumns: `repeat(${dungeonMap.width}, ${cellSize}px)`,
                          gridTemplateRows: `repeat(${dungeonMap.height}, ${cellSize}px)`,
                        }}
                      >
                        {Array.from({ length: dungeonMap.height }, (_, y) =>
                          Array.from({ length: dungeonMap.width }, (_, x) => {
                            const key = `${x},${y}`;
                            const cell = dungeonMap.cells.get(key);
                            const type = cell?.type || 'empty';
                            const label = (cell as Cell & { label?: string })?.label;

                            return (
                              <div
                                key={key}
                                onClick={() => handleCellClick(x, y)}
                                className={cn(
                                  'border border-border cursor-pointer relative transition-all hover:opacity-80',
                                  getCellColor(type),
                                  cellSize < 20 && 'text-[8px]'
                                )}
                                style={{
                                  width: `${cellSize}px`,
                                  height: `${cellSize}px`,
                                  fontSize: `${Math.max(8, cellSize / 3)}px`,
                                }}
                                title={`${x},${y} - ${type}${label ? ` - ${label}` : ''}`}
                              >
                                {label && (
                                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold p-0.5 text-center leading-tight">
                                    {label}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Click on cells to manually edit them</p>
                      <p>• Select a cell type from the sidebar to paint</p>
                      <p>• Use zoom controls to adjust view</p>
                    </div>
                  </div>
                </SystemWindow>

                <SystemWindow title="LEGEND" variant="quest">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CELL_TYPES.filter(ct => ct.type !== 'empty').map((cellType) => {
                      const Icon = cellType.icon;
                      return (
                        <div
                          key={cellType.type}
                          className={cn('p-2 rounded border flex items-center gap-2', cellType.color)}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-heading">{cellType.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </SystemWindow>
              </>
            ) : (
              <SystemWindow title="NO MAP GENERATED">
                <div className="text-center py-12">
                  <Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-heading mb-4">
                    Configure map settings and click "Generate Map" to create a Gate layout.
                  </p>
                  <Button onClick={handleGenerate} className="btn-shadow-monarch">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Your First Map
                  </Button>
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DungeonMapGenerator;

