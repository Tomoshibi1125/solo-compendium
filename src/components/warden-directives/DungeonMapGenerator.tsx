import {
	AlertTriangle,
	Copy,
	Crown,
	DoorOpen,
	Download,
	Gem,
	LayoutGrid,
	Loader2,
	Minus,
	Plus,
	RefreshCw,
	Sparkles,
	Square,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AscendantWindow } from "@/components/ui/AscendantWindow";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// --- Types ---

export type CellType =
	| "empty"
	| "room"
	| "corridor"
	| "entrance"
	| "boss"
	| "treasure"
	| "trap"
	| "puzzle"
	| "secret";

export interface Cell {
	type: CellType;
	label?: string;
	connections: Set<string>;
}

export interface Room {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	type: CellType;
	label: string;
}

export interface DungeonMap {
	width: number;
	height: number;
	cells: Map<string, Cell>;
	rooms: Room[];
	seed: number;
}

export type SerializedCell = {
	type: CellType;
	label?: string;
	connections: string[];
};

export type SerializedDungeonMap = {
	width: number;
	height: number;
	cells: Array<[string, SerializedCell]>;
	rooms: Room[];
	seed: number;
};

export type DungeonMapGeneratorState = {
	selectedRank: string;
	mapSize: { width: number; height: number };
	dungeonMap: SerializedDungeonMap | null;
	selectedCellType: CellType;
	zoom: number;
};

// --- Serialization ---

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

// --- Constants ---

const GATE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

interface CellTypeConfig {
	type: CellType;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	label: string;
}

const CELL_TYPES: CellTypeConfig[] = [
	{
		type: "empty",
		icon: Square,
		color: "bg-background border-border",
		label: "Empty",
	},
	{
		type: "room",
		icon: LayoutGrid,
		color: "bg-blue-500/20 border-blue-500/50",
		label: "Room",
	},
	{
		type: "corridor",
		icon: LayoutGrid,
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
		icon: LayoutGrid,
		color: "bg-purple-500/40 border-purple-500/70",
		label: "Puzzle Room",
	},
	{
		type: "secret",
		icon: LayoutGrid,
		color: "bg-indigo-500/40 border-indigo-500/70",
		label: "Secret Room",
	},
];

// --- Generation Logic ---

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

		for (let ry = room.y; ry < room.y + room.height; ry++) {
			for (let rx = room.x; rx < room.x + room.width; rx++) {
				const key = `${rx},${ry}`;
				const cell = cells.get(key);
				if (cell) {
					cell.type = roomType;
					if (rx === room.x && ry === room.y) {
						cell.label = label;
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

		const startX = Math.min(room1CenterX, room2CenterX);
		const endX = Math.max(room1CenterX, room2CenterX);
		for (let x = startX; x <= endX; x++) {
			const key = `${x},${room1CenterY}`;
			const cell = cells.get(key);
			if (cell && cell.type === "empty") {
				cell.type = "corridor";
			}
		}

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

// --- Component ---

export interface DungeonMapGeneratorProps {
	entityId?: string;
	className?: string;
}

export function DungeonMapGenerator({
	entityId,
	className,
}: DungeonMapGeneratorProps) {
	const { toast } = useToast();
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
		storageKey: `solo-compendium.Warden-tools.dungeon-map-generator.v1${entityId ? `.${entityId}` : ""}`,
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
		if (isLoading || hasHydratedRef.current) return;
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
		if (isLoading || !hasHydratedRef.current) return;
		void saveNow(debouncedSavePayload);
	}, [debouncedSavePayload, isLoading, saveNow]);

	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();

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
		const seed = `Generate a complete dungeon key for a Rift Ascendant TTRPG Rift dungeon.
Rift Rank: ${selectedRank}
Map Size: ${mapSize.width}x${mapSize.height}
Rooms: ${dungeonMap.rooms.length}
Room Layout: ${roomSummary}`;
		await enhance("dungeon", seed);
	};

	const handleCellClick = (x: number, y: number) => {
		if (!dungeonMap) return;
		const key = `${x},${y}`;
		const cell = dungeonMap.cells.get(key);
		if (cell && selectedCellType !== "empty") {
			cell.type = selectedCellType;
			setDungeonMap({ ...dungeonMap });
		}
	};

	const handleExport = () => {
		if (!dungeonMap) return;
		const exportData = {
			rank: selectedRank,
			width: dungeonMap.width,
			height: dungeonMap.height,
			rooms: dungeonMap.rooms,
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
		toast({ title: "Exported!", description: "Map data exported as JSON." });
	};

	const handleCopy = () => {
		if (!dungeonMap) return;
		const text = `RIFT DUNGEON MAP\nRank: ${selectedRank}\nSize: ${mapSize.width}x${mapSize.height}\nRooms: ${dungeonMap.rooms.length}`;
		navigator.clipboard.writeText(text);
		toast({
			title: "Copied!",
			description: "Map summary copied to clipboard.",
		});
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
		<div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-6", className)}>
			<div className="lg:col-span-1 space-y-6">
				<AscendantWindow title="MAP SETTINGS">
					<div className="space-y-4">
						<div>
							<Label htmlFor="map-rank">Rift Rank</Label>
							<Select value={selectedRank} onValueChange={setSelectedRank}>
								<SelectTrigger id="map-rank" className="h-9">
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
								<Label htmlFor="map-width">Width</Label>
								<Input
									id="map-width"
									type="number"
									value={mapSize.width}
									onChange={(e) =>
										setMapSize({
											...mapSize,
											width: Number.parseInt(e.target.value, 10) || 20,
										})
									}
									className="h-9"
									min={10}
									max={50}
								/>
							</div>
							<div>
								<Label htmlFor="map-height">Height</Label>
								<Input
									id="map-height"
									type="number"
									value={mapSize.height}
									onChange={(e) =>
										setMapSize({
											...mapSize,
											height: Number.parseInt(e.target.value, 10) || 20,
										})
									}
									className="h-9"
									min={10}
									max={50}
								/>
							</div>
						</div>

						<Button
							type="button"
							onClick={handleGenerate}
							className="w-full h-11 gap-2"
							size="lg"
						>
							<RefreshCw className="w-4 h-4" />
							Generate Planar Grid
						</Button>

						{dungeonMap && (
							<Button
								type="button"
								onClick={handleAIEnhance}
								variant="outline"
								className="w-full h-11 gap-2"
								disabled={isEnhancing}
							>
								{isEnhancing ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Sparkles className="w-4 h-4" />
								)}
								Synthesize Key
							</Button>
						)}
					</div>
				</AscendantWindow>

				<AscendantWindow title="TOPOLOGY NODES">
					<div className="grid grid-cols-2 gap-2">
						{CELL_TYPES.filter((ct) => ct.type !== "empty").map((cellType) => (
							<Button
								key={cellType.type}
								type="button"
								variant={
									selectedCellType === cellType.type ? "default" : "outline"
								}
								size="sm"
								className="h-9 justify-start gap-2 px-2"
								onClick={() => setSelectedCellType(cellType.type)}
							>
								<div className={cn("w-3 h-3 rounded-sm", cellType.color)} />
								<span className="text-[10px] truncate">{cellType.label}</span>
							</Button>
						))}
					</div>
				</AscendantWindow>
			</div>

			<div className="lg:col-span-3 space-y-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
							className="h-8 w-8 p-0"
						>
							<Minus className="w-4 h-4" />
						</Button>
						<span className="flex items-center text-xs font-mono w-12 justify-center">
							{Math.round(zoom * 100)}%
						</span>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setZoom(Math.min(2, zoom + 0.1))}
							className="h-8 w-8 p-0"
						>
							<Plus className="w-4 h-4" />
						</Button>
					</div>

					<div className="flex gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleCopy}
							disabled={!dungeonMap}
							className="h-8 gap-2"
						>
							<Copy className="w-4 h-4" />
							Copy Summary
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleExport}
							disabled={!dungeonMap}
							className="h-8 gap-2"
						>
							<Download className="w-4 h-4" />
							Export Registry
						</Button>
					</div>
				</div>

				<div className="map-container relative min-h-[500px] border border-primary/20 bg-black/40 rounded-xl overflow-hidden">
					{!dungeonMap ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
							<LayoutGrid className="w-12 h-12 opacity-20" />
							<div className="text-center space-y-1">
								<p className="font-heading uppercase tracking-widest text-xs">
									Topology Lattice Offline
								</p>
								<p className="text-[10px] opacity-60">
									Initialize parameters to visualize Rift architecture.
								</p>
							</div>
						</div>
					) : (
						<div
							className="p-8"
							style={
								{
									"--zoom-scale": zoom.toString(),
									transform: "scale(var(--zoom-scale))",
									transformOrigin: "top left",
								} as React.CSSProperties
							}
						>
							<div
								className="map-grid border border-primary/10"
								style={
									{
										"--grid-cols": mapSize.width.toString(),
										"--grid-rows": mapSize.height.toString(),
										"--cell-size": `${cellSize}px`,
										display: "grid",
										gridTemplateColumns:
											"repeat(var(--grid-cols), var(--cell-size))",
										gridTemplateRows:
											"repeat(var(--grid-rows), var(--cell-size))",
									} as React.CSSProperties
								}
							>
								{Array.from({ length: mapSize.height }).map((_, y) =>
									Array.from({ length: mapSize.width }).map((_, x) => {
										const key = `${x},${y}`;
										const cell = dungeonMap.cells.get(key);
										const type = cell?.type || "empty";
										const label = cell?.label;

										return (
											<button
												key={key}
												type="button"
												className={cn(
													"map-cell border-[0.5px] border-primary/5 relative group p-0 m-0",
													getCellColor(type),
												)}
												style={
													{
														"--cell-dim": `${cellSize}px`,
														width: "var(--cell-dim)",
														height: "var(--cell-dim)",
													} as React.CSSProperties
												}
												onClick={() => handleCellClick(x, y)}
												aria-label={
													label ? `${label} at ${key}` : `Cell ${key}`
												}
											>
												{label && (
													<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
														<span className="text-[6px] font-bold text-white/80 text-center leading-[1] px-0.5">
															{label}
														</span>
													</div>
												)}
												<div className="absolute top-0 left-0 right-0 bottom-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
											</button>
										);
									}),
								)}
							</div>
						</div>
					)}
				</div>

				<Alert className="bg-primary/5 border-primary/10">
					<Sparkles className="w-4 h-4 text-primary" />
					<AlertDescription className="text-[10px] leading-relaxed">
						Each room node can be selected for individual refinement. Use AI
						Synthesis to generate structural lore, metabolic encounters, and
						calculated compensation registries for the active grid.
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
