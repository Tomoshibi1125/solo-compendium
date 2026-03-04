import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	Crown,
	DoorOpen,
	Download,
	Gem,
	Grid,
	Loader2,
	Minus,
	Plus,
	RefreshCw,
	Sparkles,
	Square,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DataStreamText,
	SystemHeading,
	SystemText,
} from "@/components/ui/SystemText";
import { SystemWindow } from "@/components/ui/SystemWindow";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAIEnhance } from "@/hooks/useAIEnhance";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserToolState } from "@/hooks/useToolState";
import { cn } from "@/lib/utils";
import "./DungeonMapGenerator.css";

type CellType =
	| "empty"
	| "room"
	| "corridor"
	| "entrance"
	| "boss"
	| "treasure"
	| "trap"
	| "puzzle"
	| "secret";

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

type SerializedCell = {
	type: CellType;
	label?: string;
	connections: string[];
};

type SerializedDungeonMap = {
	width: number;
	height: number;
	cells: Array<[string, SerializedCell]>;
	rooms: Room[];
	seed: number;
};

type DungeonMapGeneratorState = {
	selectedRank: string;
	mapSize: { width: number; height: number };
	dungeonMap: SerializedDungeonMap | null;
	selectedCellType: CellType;
	zoom: number;
};

const serializeDungeonMap = (
	map: DungeonMap | null,
): SerializedDungeonMap | null => {
	if (!map) return null;

	return {
		width: map.width,
		height: map.height,
		seed: map.seed,
		rooms: map.rooms,
		cells: Array.from(map.cells.entries()).map(([key, cell]) => [
			key,
			{
				type: cell.type,
				label: cell.label,
				connections: Array.from(cell.connections),
			},
		]),
	};
};

const deserializeDungeonMap = (
	map: SerializedDungeonMap | null,
): DungeonMap | null => {
	if (!map) return null;

	const cells = new Map<string, Cell>();
	for (const [key, cell] of map.cells) {
		cells.set(key, {
			type: cell.type,
			label: cell.label,
			connections: new Set(cell.connections),
		});
	}

	return {
		width: map.width,
		height: map.height,
		seed: map.seed,
		rooms: map.rooms,
		cells,
	};
};

const GATE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

const CELL_TYPES: {
	type: CellType;
	icon: any;
	color: string;
	label: string;
}[] = [
	{
		type: "empty",
		icon: Square,
		color: "bg-background border-border",
		label: "Empty",
	},
	{
		type: "room",
		icon: Grid,
		color: "bg-blue-500/20 border-blue-500/50",
		label: "Room",
	},
	{
		type: "corridor",
		icon: Grid,
		color: "bg-gray-600/30 border-gray-600/50",
		label: "Corridor",
	},
	{
		type: "entrance",
		icon: DoorOpen,
		color: "bg-green-500/30 border-green-500/60",
		label: "Entrance",
	},
	{
		type: "boss",
		icon: Crown,
		color: "bg-red-500/40 border-red-500/70",
		label: "Boss Chamber",
	},
	{
		type: "treasure",
		icon: Gem,
		color: "bg-yellow-500/40 border-yellow-500/70",
		label: "Treasure Room",
	},
	{
		type: "trap",
		icon: AlertTriangle,
		color: "bg-orange-500/40 border-orange-500/70",
		label: "Trap Room",
	},
	{
		type: "puzzle",
		icon: Grid,
		color: "bg-purple-500/40 border-purple-500/70",
		label: "Puzzle Room",
	},
	{
		type: "secret",
		icon: Grid,
		color: "bg-indigo-500/40 border-indigo-500/70",
		label: "Secret Room",
	},
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
				type: "empty",
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
	const generatedRooms: {
		x: number;
		y: number;
		width: number;
		height: number;
	}[] = [];

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
		let roomType: CellType = "room";
		let label = `Room ${index + 1}`;

		if (index === 0) {
			roomType = "entrance";
			label = "Entrance";
		} else if (index === generatedRooms.length - 1) {
			roomType = "boss";
			label = "Boss Chamber";
		} else {
			const rand = Math.random();
			if (rand < 0.15 && rank >= "C") {
				roomType = "treasure";
				label = "Treasure Room";
			} else if (rand < 0.25 && rank >= "D") {
				roomType = "trap";
				label = "Trap Room";
			} else if (rand < 0.35 && rank >= "B") {
				roomType = "puzzle";
				label = "Puzzle Room";
			} else if (rand < 0.45 && rank >= "C") {
				roomType = "secret";
				label = "Secret Room";
			}
		}

		// Fill room cells with dungeon tiles
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
			if (cell && cell.type === "empty") {
				cell.type = "corridor";
			}
		}

		// Then vertical
		const startY = Math.min(room1CenterY, room2CenterY);
		const endY = Math.max(room1CenterY, room2CenterY);
		for (let y = startY; y <= endY; y++) {
			const key = `${room2CenterX},${y}`;
			const cell = cells.get(key);
			if (cell && cell.type === "empty") {
				cell.type = "corridor";
			}
		}
	}

	return { width, height, cells, rooms, seed };
}

const DungeonMapGenerator = () => {
	const navigate = useNavigate();
	const { toast } = useToast();
	const mapRef = useRef<HTMLDivElement>(null);
	const [selectedRank, setSelectedRank] = useState<string>("C");
	const [mapSize, setMapSize] = useState({ width: 20, height: 20 });
	const [dungeonMap, setDungeonMap] = useState<DungeonMap | null>(null);
	const [selectedCellType, setSelectedCellType] = useState<CellType>("room");
	const [zoom, setZoom] = useState(1);

	const {
		state: storedState,
		isLoading,
		saveNow,
	} = useUserToolState<DungeonMapGeneratorState>("dungeon_map_generator", {
		initialState: {
			selectedRank: "C",
			mapSize: { width: 20, height: 20 },
			dungeonMap: null,
			selectedCellType: "room",
			zoom: 1,
		},
		storageKey: "solo-compendium.dm-tools.dungeon-map-generator.v1",
	});

	const hydratedState = useMemo(() => {
		return {
			selectedRank:
				typeof storedState.selectedRank === "string"
					? storedState.selectedRank
					: "C",
			mapSize: storedState.mapSize ?? { width: 20, height: 20 },
			dungeonMap: deserializeDungeonMap(storedState.dungeonMap ?? null),
			selectedCellType: (storedState.selectedCellType as CellType) ?? "room",
			zoom: typeof storedState.zoom === "number" ? storedState.zoom : 1,
		};
	}, [storedState]);

	const hasHydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading) return;
		if (hasHydratedRef.current) return;
		setSelectedRank(hydratedState.selectedRank);
		setMapSize(hydratedState.mapSize);
		setDungeonMap(hydratedState.dungeonMap);
		setSelectedCellType(hydratedState.selectedCellType);
		setZoom(hydratedState.zoom);
		hasHydratedRef.current = true;
	}, [hydratedState, isLoading]);

	const savePayload = useMemo(
		() =>
			({
				selectedRank,
				mapSize,
				dungeonMap: serializeDungeonMap(dungeonMap),
				selectedCellType,
				zoom,
			}) satisfies DungeonMapGeneratorState,
		[dungeonMap, mapSize, selectedCellType, selectedRank, zoom],
	);

	const debouncedSavePayload = useDebounce(savePayload, 500);
	useEffect(() => {
		if (isLoading) return;
		if (!hasHydratedRef.current) return;
		void saveNow(debouncedSavePayload);
	}, [debouncedSavePayload, isLoading, saveNow]);

	const { isEnhancing, enhancedText, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = () => {
		clearEnhanced();
		const newMap = generateMap(mapSize.width, mapSize.height, selectedRank);
		setDungeonMap(newMap);
		toast({
			title: "Map Generated!",
			description: `Created a Rank ${selectedRank} Rift with ${newMap.rooms.length} rooms.`,
		});
	};

	const handleAIEnhance = async () => {
		if (!dungeonMap) return;
		const roomSummary = dungeonMap.rooms
			.map((r, i) => `Room ${i + 1}: ${r.type} (${r.width}x${r.height})`)
			.join("; ");
		const seed = `Generate a complete dungeon key for a System Ascendant TTRPG Rift dungeon.

SEED DATA:
- Rift Rank: ${selectedRank}
- Map Size: ${mapSize.width}x${mapSize.height}
- Rooms: ${dungeonMap.rooms.length}
- Room Layout: ${roomSummary}

Provide ALL of the following sections with full detail:

1. ROOM DESCRIPTIONS: Read-aloud text + DM notes for each room/area
2. TRAPS: Full trap stat blocks (trigger, DC, damage, reset, detection DC) for trap rooms
3. ENCOUNTERS: Monster placement per room with CR, type, HP, tactics
4. SECRETS: Hidden passages (Investigation DC), secret doors, hidden treasure
5. PUZZLES: Puzzle mechanics with solution, hints, failure consequences
6. BOSS ROOM: Final encounter with lair actions, legendary actions, full stat block
7. LORE: Dungeon history, builder, purpose, connection to Regent domains or System
8. TREASURE: Room-by-room loot with full item stats and GP values
9. ENVIRONMENTAL HAZARDS: Per-room environmental effects (lighting, terrain, hazards)`;
		await enhance("dungeon", seed);
	};

	const handleCellClick = (x: number, y: number) => {
		if (!dungeonMap) return;

		const key = `${x},${y}`;
		const cell = dungeonMap.cells.get(key);
		if (cell && selectedCellType !== "empty") {
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
			rooms: dungeonMap.rooms.map((r) => ({
				x: r.x,
				y: r.y,
				width: r.width,
				height: r.height,
				type: r.type,
				label: r.label,
			})),
			generated: new Date().toISOString(),
		};

		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `rift-${selectedRank}-map-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);

		toast({
			title: "Exported!",
			description: "Map data exported as JSON.",
		});
	};

	const handleCopy = () => {
		if (!dungeonMap) return;
		const roomSummary = dungeonMap.rooms
			.map((r, i) => `Room ${i + 1}: ${r.type} (${r.width}x${r.height})`)
			.join("; ");
		const text = `RIFT DUNGEON MAP
Rank: ${selectedRank}
Size: ${mapSize.width}x${mapSize.height}
Rooms: ${dungeonMap.rooms.length}
Layout: ${roomSummary}

---
D&D BEYOND STYLE DUNGEON KEY:

ROOM DESCRIPTIONS:
${dungeonMap.rooms
	.map(
		(room, i) => `ROOM ${i + 1}: ${room.type} (${room.width}x${room.height})
• READ-ALOUD: "[Sensory details when players enter this ${room.type}]"
• DM NOTES: [Hidden features, secret doors, environmental conditions]
• EXITS: [Connections to other rooms and corridors]
• FEATURES: [Notable architectural elements or furnishings]`,
	)
	.join("\n\n")}

TRAPS:
${
	dungeonMap.rooms
		.filter((r) => r.type === "trap")
		.map(
			(_trap, i) => `TRAP ${i + 1}:
• Type: [Mechanical, magical, or environmental trap]
• Trigger: [How the trap is activated]
• DC: [Difficulty class to detect or disable]
• Damage: [Damage type and amount]
• Reset: [How the trap resets after triggering]
• Detection: [Passive Perception DC to notice]`,
		)
		.join("\n\n") || "No traps in this dungeon"
}

ENCOUNTERS:
${
	dungeonMap.rooms
		.filter((r) => r.type === "boss" || r.type === "room")
		.map(
			(room, i) => `ENCOUNTER AREA ${i + 1}: ${room.type}
• Challenge Rating: [Appropriate to ${selectedRank} Rank]
• Monster Types: [2-3 monster types appropriate to Rift theme]
• Placement: [Strategic positioning in room]
• Tactics: [Combat behavior and strategy]
• Reinforcements: [Where additional monsters might come from]`,
		)
		.join("\n\n") || "No encounter areas in this dungeon"
}

SECRETS:
${
	dungeonMap.rooms
		.filter((r) => r.type === "secret")
		.map(
			(_secret, i) => `SECRET ${i + 1}:
• Location: [Hidden area or concealed object]
• Investigation DC: [Difficulty to discover]
• Nature: [What the secret is - passage, treasure, lore]
• Clues: [Hints that might lead players to discover it]
• Reward: [What players gain from finding it]`,
		)
		.join("\n\n") || "No secrets in this dungeon"
}

PUZZLES:
${
	dungeonMap.rooms
		.filter((r) => r.type === "puzzle")
		.map(
			(_puzzle, i) => `PUZZLE ${i + 1}:
• Type: [Mechanical, magical, or logic puzzle]
• Solution: [How to solve the puzzle]
• Hints: [3 progressive hints players can receive]
• Failure Consequences: [What happens if they fail]
• Reward: [What they gain for solving it]`,
		)
		.join("\n\n") || "No puzzles in this dungeon"
}

BOSS ROOM:
${
	dungeonMap.rooms
		.filter((r) => r.type === "boss")
		.map(
			(_boss, i) => `BOSS CHAMBER ${i + 1}:
• Boss: [Boss name and type]
• Stat Block: [AC, HP, abilities, attacks]
• Legendary Actions: [1-3 legendary actions]
• Lair Actions: [Environmental effects on initiative 20]
• Tactics: [How the boss fights]
• Weaknesses: [Exploitable vulnerabilities]
• Environment: [Terrain features and hazards]
• Treasure: [Boss loot and rewards]`,
		)
		.join("\n\n") || "No boss room in this dungeon"
}

LORE:
• Dungeon History: [How this dungeon was created and its past]
• Builder: [Who originally constructed this place]
• Purpose: [Why the dungeon exists - prison, temple, vault, etc.]
• Regent Connection: [Which Regent domain influenced its creation]
• System Significance: [Why the System created this dungeon]
• Current Inhabitants: [Who or what lives here now]

TREASURE:
${
	dungeonMap.rooms
		.filter((r) => r.type === "treasure")
		.map(
			(_treasure, i) => `TREASURE ROOM ${i + 1}:
• Contents: [Types and quantities of treasure]
• Protection: [Traps or guardians protecting the treasure]
• Value: [Total GP value of treasure]
• Special Items: [Any magical items or relics]
• History: [Story behind the treasure]`,
		)
		.join("\n\n") || "No treasure rooms in this dungeon"
}

ENVIRONMENTAL HAZARDS:
${dungeonMap.rooms
	.map(
		(room, i) => `ROOM ${i + 1} (${room.type}):
• Lighting: [Bright, dim, or darkness]
• Terrain: [Difficult terrain, obstacles, hazards]
• Atmosphere: [Temperature, air quality, special conditions]
• Acoustics: [Sound propagation and stealth implications]
• Special Conditions: [Any unique environmental effects]`,
	)
	.join("\n\n")}

READ-ALOUD ENTRANCE:
"[Detailed description of what players see, hear, and smell as they first enter this ${selectedRank} Rank Rift dungeon, including the atmosphere, immediate impressions, and any notable features of the entrance area]"`;

		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Complete dungeon key copied to clipboard.",
		});
	};

	const handlePrint = () => {
		window.print();
	};

	const getCellColor = (type: CellType) => {
		const cellType = CELL_TYPES.find((ct) => ct.type === type);
		return cellType?.color || "bg-background border-border";
	};

	const cellSize = Math.max(
		16,
		Math.min(32, Math.floor(600 / Math.max(mapSize.width, mapSize.height))),
	);

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => navigate("/dm-tools")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Warden Tools
					</Button>
					<SystemHeading
						level={1}
						variant="sovereign"
						dimensional
						className="mb-2"
					>
						Rift Topology Protocol
					</SystemHeading>
					<DataStreamText
						variant="system"
						speed="slow"
						className="font-heading"
					>
						Synthesize structural parameters for dimensional Rifts. Establish
						spatial grids defining chambers, pathways, and node singularities.
					</DataStreamText>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					<div className="lg:col-span-1 space-y-6">
						<SystemWindow title="MAP SETTINGS">
							<div className="space-y-4">
								<div>
									<Label htmlFor="rank">Rift Rank</Label>
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
											value={mapSize.width || 20}
											onChange={(e) =>
												setMapSize({
													...mapSize,
													width: parseInt(e.target.value, 10) || 20,
												})
											}
											min={10}
											max={50}
										/>
									</div>
									<div>
										<Label htmlFor="height">Height</Label>
										<Input
											id="height"
											type="number"
											value={mapSize.height || 20}
											onChange={(e) =>
												setMapSize({
													...mapSize,
													height: parseInt(e.target.value, 10) || 20,
												})
											}
											min={10}
											max={50}
										/>
									</div>
								</div>

								<Button
									onClick={handleGenerate}
									className="w-full btn-umbral"
									size="lg"
								>
									<RefreshCw className="w-4 h-4 mr-2" />
									Generate Map
								</Button>
								{dungeonMap && (
									<Button
										onClick={handleAIEnhance}
										className="w-full gap-2 mt-2"
										variant="outline"
										size="lg"
										disabled={isEnhancing}
									>
										{isEnhancing ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Sparkles className="w-4 h-4" />
										)}
										{isEnhancing ? "Generating Key..." : "AI Dungeon Key"}
									</Button>
								)}
							</div>
						</SystemWindow>

						<SystemWindow title="CELL TYPES">
							<div className="space-y-2">
								{CELL_TYPES.filter((ct) => ct.type !== "empty").map(
									(cellType) => {
										const Icon = cellType.icon;
										return (
											<button
												key={cellType.type}
												onClick={() => setSelectedCellType(cellType.type)}
												className={cn(
													"w-full p-2 rounded-lg border text-left transition-all",
													selectedCellType === cellType.type
														? `${cellType.color} border-current`
														: "border-border hover:bg-muted/50",
												)}
											>
												<div className="flex items-center gap-2">
													<Icon className="w-4 h-4" />
													<span className="text-sm font-heading">
														{cellType.label}
													</span>
												</div>
											</button>
										);
									},
								)}
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
											<div className="font-heading font-semibold">
												{room.label}
											</div>
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
								<SystemWindow title={`RANK ${selectedRank} RIFT MAP`}>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<Badge variant="outline">
												{dungeonMap.rooms.length} Rooms • {dungeonMap.width}×
												{dungeonMap.height} Grid
											</Badge>
											<div className="flex gap-2">
												<Button
													onClick={handleCopy}
													variant="outline"
													size="sm"
												>
													<Copy className="w-4 h-4 mr-2" />
													Copy Key
												</Button>
												<Button
													onClick={handleExport}
													variant="outline"
													size="sm"
												>
													<Download className="w-4 h-4 mr-2" />
													Export JSON
												</Button>
												<Button
													onClick={handlePrint}
													variant="outline"
													size="sm"
												>
													<Download className="w-4 h-4 mr-2" />
													Print
												</Button>
											</div>
										</div>

										<div
											ref={mapRef}
											className="map-container zoom-scale"
											style={{
												transform: `scale(${zoom})`,
											}}
										>
											<div
												className="map-grid dynamic-size"
												style={{
													gridTemplateColumns: `repeat(${dungeonMap.width}, ${cellSize}px)`,
													gridTemplateRows: `repeat(${dungeonMap.height}, ${cellSize}px)`,
												}}
											>
												{Array.from({ length: dungeonMap.height }, (_, y) =>
													Array.from({ length: dungeonMap.width }, (_, x) => {
														const key = `${x},${y}`;
														const cell = dungeonMap.cells.get(key);
														const type = cell?.type || "empty";
														const label = (cell as Cell & { label?: string })
															?.label;

														return (
															<button
																key={key}
																type="button"
																onClick={() => handleCellClick(x, y)}
																className={cn(
																	"map-cell dynamic-size",
																	getCellColor(type),
																	cellSize < 20 && "small-text",
																)}
																style={{
																	width: `${cellSize}px`,
																	height: `${cellSize}px`,
																	fontSize: `${Math.max(8, cellSize / 3)}px`,
																}}
																title={`${x},${y} - ${type}${label ? ` - ${label}` : ""}`}
																aria-label={`Cell ${x + 1}, ${y + 1} (${type})${label ? ` - ${label}` : ""}`}
															>
																{label && (
																	<div className="cell-label">{label}</div>
																)}
															</button>
														);
													}),
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
										{CELL_TYPES.filter((ct) => ct.type !== "empty").map(
											(cellType) => {
												const Icon = cellType.icon;
												return (
													<div
														key={cellType.type}
														className={cn(
															"p-2 rounded border flex items-center gap-2",
															cellType.color,
														)}
													>
														<Icon className="w-4 h-4" />
														<span className="text-xs font-heading">
															{cellType.label}
														</span>
													</div>
												);
											},
										)}
									</div>
								</SystemWindow>
							</>
						) : (
							<SystemWindow title="NO MAP GENERATED">
								<div className="text-center py-12">
									<Grid className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
									<SystemText className="block text-muted-foreground font-heading mb-4">
										Configure map settings and click "Generate Map" to create a
										Rift layout.
									</SystemText>
									<Button onClick={handleGenerate} className="btn-umbral">
										<RefreshCw className="w-4 h-4 mr-2" />
										Generate Your First Map
									</Button>
								</div>
							</SystemWindow>
						)}

						{enhancedText && (
							<SystemWindow title="AI DUNGEON KEY">
								<div className="flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									<span className="text-xs font-display text-primary">
										AI-GENERATED DUNGEON KEY
									</span>
								</div>
								<div className="text-sm text-muted-foreground whitespace-pre-line bg-primary/5 rounded-lg p-4 max-h-[600px] overflow-y-auto">
									{enhancedText}
								</div>
							</SystemWindow>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default DungeonMapGenerator;
