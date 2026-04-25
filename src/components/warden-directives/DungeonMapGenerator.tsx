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
import type { WardenLinkedEntry } from "@/lib/wardenGenerationContext";
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
	notes?: RoomNotes;
}

export interface DungeonMap {
	width: number;
	height: number;
	cells: Map<string, Cell>;
	rooms: Room[];
	seed: number;
	options: DungeonMapOptions;
}

export interface RoomNotes {
	summary: string;
	encounter?: string;
	hazard?: string;
	loot?: string;
	lore?: string;
	sourceRefs?: Array<{
		id: string;
		type: string;
		name: string;
	}>;
}

export interface DungeonMapOptions {
	roomCount: number;
	minRoomSize: number;
	maxRoomSize: number;
	treasureRooms: number;
	trapRooms: number;
	puzzleRooms: number;
	secretRooms: number;
	encounterRooms: number;
	branching: number;
}

const DEFAULT_DUNGEON_OPTIONS: DungeonMapOptions = {
	roomCount: 7,
	minRoomSize: 2,
	maxRoomSize: 5,
	treasureRooms: 1,
	trapRooms: 1,
	puzzleRooms: 1,
	secretRooms: 1,
	encounterRooms: 3,
	branching: 25,
};

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
	options?: DungeonMapOptions;
};

export type DungeonMapGeneratorState = {
	selectedRank: string;
	mapSize: { width: number; height: number };
	dungeonMap: SerializedDungeonMap | null;
	selectedCellType: CellType;
	zoom: number;
	options: DungeonMapOptions;
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
		options: map.options,
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
		options: map.options ?? DEFAULT_DUNGEON_OPTIONS,
	};
};

// --- Constants ---

const GATE_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

export interface DungeonRiftContext {
	rank: string;
	theme: string;
	biome: string;
	boss: string;
	complications?: string[];
	hazards?: string[];
	rewards?: string[];
	linkedContent?: {
		boss?: WardenLinkedEntry | null;
		encounters?: WardenLinkedEntry[];
		hazards?: WardenLinkedEntry[];
		loot?: WardenLinkedEntry[];
		lore?: WardenLinkedEntry[];
	};
}

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

function normalizeDungeonOptions(
	options: DungeonMapOptions,
	width: number,
	height: number,
): DungeonMapOptions {
	const maxRoomSize = Math.max(
		2,
		Math.min(options.maxRoomSize, Math.max(2, Math.min(width, height) - 2)),
	);
	const minRoomSize = Math.max(2, Math.min(options.minRoomSize, maxRoomSize));
	const roomCount = Math.max(2, Math.min(options.roomCount, 40));

	return {
		roomCount,
		minRoomSize,
		maxRoomSize,
		treasureRooms: Math.max(0, Math.min(options.treasureRooms, roomCount - 2)),
		trapRooms: Math.max(0, Math.min(options.trapRooms, roomCount - 2)),
		puzzleRooms: Math.max(0, Math.min(options.puzzleRooms, roomCount - 2)),
		secretRooms: Math.max(0, Math.min(options.secretRooms, roomCount - 2)),
		encounterRooms: Math.max(0, Math.min(options.encounterRooms, roomCount)),
		branching: Math.max(0, Math.min(options.branching, 100)),
	};
}

function pickLinkedEntry(
	entries: WardenLinkedEntry[] | undefined,
	index: number,
): WardenLinkedEntry | null {
	if (!entries || entries.length === 0) return null;
	return entries[index % entries.length];
}

function toSourceRef(entry: WardenLinkedEntry | null) {
	if (!entry) return undefined;
	return {
		id: entry.id,
		type: entry.type,
		name: entry.name,
	};
}

function buildRoomNotes(
	roomType: CellType,
	index: number,
	rank: string,
	context?: DungeonRiftContext,
): RoomNotes {
	const encounter =
		roomType === "boss"
			? (context?.linkedContent?.boss ?? null)
			: pickLinkedEntry(context?.linkedContent?.encounters, index);
	const hazard =
		roomType === "trap"
			? pickLinkedEntry(context?.linkedContent?.hazards, index)
			: null;
	const loot =
		roomType === "treasure" || roomType === "secret"
			? pickLinkedEntry(context?.linkedContent?.loot, index)
			: null;
	const lore = pickLinkedEntry(context?.linkedContent?.lore, index);
	const refs = [encounter, hazard, loot, lore]
		.map(toSourceRef)
		.filter(Boolean) as RoomNotes["sourceRefs"];

	return {
		summary: `${roomType === "room" ? "Rift chamber" : CELL_TYPES.find((cellType) => cellType.type === roomType)?.label || "Rift chamber"} tuned for Rank ${rank}${context ? ` within ${context.biome}` : ""}.`,
		encounter:
			roomType === "boss"
				? encounter?.name || context?.boss
				: encounter?.name || undefined,
		hazard:
			hazard?.name || context?.hazards?.[index % (context.hazards.length || 1)],
		loot:
			loot?.name || context?.rewards?.[index % (context.rewards.length || 1)],
		lore: lore?.name || context?.theme,
		sourceRefs: refs && refs.length > 0 ? refs : undefined,
	};
}

function generateMap(
	width: number,
	height: number,
	rank: string,
	options: DungeonMapOptions = DEFAULT_DUNGEON_OPTIONS,
	context?: DungeonRiftContext,
): DungeonMap {
	const seed = Date.now();
	const mapOptions = normalizeDungeonOptions(options, width, height);
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

	const numRooms = mapOptions.roomCount;

	// Generate rooms
	const generatedRooms: {
		x: number;
		y: number;
		width: number;
		height: number;
	}[] = [];

	for (let i = 0; i < numRooms * 8; i++) {
		const roomWidth =
			mapOptions.minRoomSize +
			Math.floor(
				Math.random() * (mapOptions.maxRoomSize - mapOptions.minRoomSize + 1),
			);
		const roomHeight =
			mapOptions.minRoomSize +
			Math.floor(
				Math.random() * (mapOptions.maxRoomSize - mapOptions.minRoomSize + 1),
			);
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

	const specialRoomQueue: CellType[] = [
		...Array.from(
			{ length: mapOptions.treasureRooms },
			() => "treasure" as const,
		),
		...Array.from({ length: mapOptions.trapRooms }, () => "trap" as const),
		...Array.from({ length: mapOptions.puzzleRooms }, () => "puzzle" as const),
		...Array.from({ length: mapOptions.secretRooms }, () => "secret" as const),
	].sort(() => Math.random() - 0.5);

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
			const nextSpecialType = specialRoomQueue.shift();
			if (nextSpecialType) {
				roomType = nextSpecialType;
				label =
					CELL_TYPES.find((cellType) => cellType.type === nextSpecialType)
						?.label || `Room ${index + 1}`;
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
			notes: buildRoomNotes(roomType, index, rank, context),
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

	return { width, height, cells, rooms, seed, options: mapOptions };
}

// --- Component ---

export interface DungeonMapGeneratorProps {
	entityId?: string;
	className?: string;
	riftContext?: DungeonRiftContext;
}

export function DungeonMapGenerator({
	entityId,
	className,
	riftContext,
}: DungeonMapGeneratorProps) {
	const { toast } = useToast();
	const [selectedRank, setSelectedRank] = useState<string>("C");
	const [mapSize, setMapSize] = useState({ width: 20, height: 20 });
	const [dungeonMap, setDungeonMap] = useState<DungeonMap | null>(null);
	const [selectedCellType, setSelectedCellType] = useState<CellType>("room");
	const [zoom, setZoom] = useState(1);
	const [options, setOptions] = useState<DungeonMapOptions>(
		DEFAULT_DUNGEON_OPTIONS,
	);

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
			options: DEFAULT_DUNGEON_OPTIONS,
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
			options: storedState.options ?? DEFAULT_DUNGEON_OPTIONS,
		};
	}, [storedState]);

	const hasHydratedRef = useRef(false);
	useEffect(() => {
		if (isLoading || hasHydratedRef.current) return;
		setSelectedRank(riftContext?.rank || hydratedState.selectedRank);
		setMapSize(hydratedState.mapSize);
		setDungeonMap(hydratedState.dungeonMap);
		setSelectedCellType(hydratedState.selectedCellType);
		setZoom(hydratedState.zoom);
		setOptions(hydratedState.options);
		hasHydratedRef.current = true;
	}, [hydratedState, isLoading, riftContext?.rank]);

	// Auto-update rank if context changes
	useEffect(() => {
		if (riftContext?.rank && hasHydratedRef.current) {
			setSelectedRank(riftContext.rank);
		}
	}, [riftContext?.rank]);

	const savePayload = useMemo(
		() =>
			({
				selectedRank,
				mapSize,
				dungeonMap: serializeDungeonMap(dungeonMap),
				selectedCellType,
				zoom,
				options,
			}) satisfies DungeonMapGeneratorState,
		[dungeonMap, mapSize, options, selectedCellType, selectedRank, zoom],
	);

	const debouncedSavePayload = useDebounce(savePayload, 500);
	useEffect(() => {
		if (isLoading || !hasHydratedRef.current) return;
		void saveNow(debouncedSavePayload);
	}, [debouncedSavePayload, isLoading, saveNow]);

	const { isEnhancing, enhance, clearEnhanced } = useAIEnhance();

	const handleGenerate = () => {
		clearEnhanced();
		const newMap = generateMap(
			mapSize.width,
			mapSize.height,
			selectedRank,
			options,
			riftContext,
		);
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
${riftContext ? `Theme: ${riftContext.theme}\nBiome: ${riftContext.biome}\nBoss: ${riftContext.boss}\n` : ""}Map Size: ${mapSize.width}x${mapSize.height}
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
			options: dungeonMap.options,
			riftContext,
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
		const roomLines = dungeonMap.rooms
			.map((room, index) => {
				const details = [
					room.notes?.encounter ? `Encounter: ${room.notes.encounter}` : null,
					room.notes?.hazard ? `Hazard: ${room.notes.hazard}` : null,
					room.notes?.loot ? `Loot: ${room.notes.loot}` : null,
					room.notes?.lore ? `Lore: ${room.notes.lore}` : null,
				]
					.filter(Boolean)
					.join("; ");
				return `${index + 1}. ${room.label} (${room.width}x${room.height})${details ? ` — ${details}` : ""}`;
			})
			.join("\n");
		const text = `RIFT DUNGEON MAP\nRank: ${selectedRank}\nSize: ${mapSize.width}x${mapSize.height}\nRooms: ${dungeonMap.rooms.length}\n\n${roomLines}`;
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

	const updateOption = <K extends keyof DungeonMapOptions>(
		key: K,
		value: number,
	) => {
		setOptions((current) =>
			normalizeDungeonOptions(
				{ ...current, [key]: value },
				mapSize.width,
				mapSize.height,
			),
		);
	};

	const cellSize = Math.max(
		16,
		Math.min(32, Math.floor(600 / Math.max(mapSize.width, mapSize.height))),
	);

	const dynamicStyles = `
		.map-zoom-wrapper {
			--zoom-scale: ${zoom};
			transform: scale(var(--zoom-scale));
			transform-origin: top left;
		}
		.map-grid-custom {
			--grid-cols: ${mapSize.width};
			--grid-rows: ${mapSize.height};
			--cell-size: ${cellSize}px;
			display: grid;
			grid-template-columns: repeat(var(--grid-cols), var(--cell-size));
			grid-template-rows: repeat(var(--grid-rows), var(--cell-size));
		}
		.map-cell-dimensions {
			--cell-dim: ${cellSize}px;
			width: var(--cell-dim);
			height: var(--cell-dim);
		}
	`;

	return (
		<div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-6", className)}>
			<style>{dynamicStyles}</style>
			<div className="lg:col-span-1 space-y-6">
				<AscendantWindow title="MAP SETTINGS">
					<div className="space-y-4">
						{!riftContext && (
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
						)}

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

						<div className="grid grid-cols-2 gap-2">
							<div>
								<Label htmlFor="room-count">Rooms</Label>
								<Input
									id="room-count"
									type="number"
									value={options.roomCount}
									onChange={(e) =>
										updateOption(
											"roomCount",
											Number.parseInt(e.target.value, 10) || 2,
										)
									}
									className="h-9"
									min={2}
									max={40}
								/>
							</div>
							<div>
								<Label htmlFor="encounter-rooms">Encounters</Label>
								<Input
									id="encounter-rooms"
									type="number"
									value={options.encounterRooms}
									onChange={(e) =>
										updateOption(
											"encounterRooms",
											Number.parseInt(e.target.value, 10) || 0,
										)
									}
									className="h-9"
									min={0}
									max={40}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<div>
								<Label htmlFor="room-min-size">Min Room</Label>
								<Input
									id="room-min-size"
									type="number"
									value={options.minRoomSize}
									onChange={(e) =>
										updateOption(
											"minRoomSize",
											Number.parseInt(e.target.value, 10) || 2,
										)
									}
									className="h-9"
									min={2}
									max={12}
								/>
							</div>
							<div>
								<Label htmlFor="room-max-size">Max Room</Label>
								<Input
									id="room-max-size"
									type="number"
									value={options.maxRoomSize}
									onChange={(e) =>
										updateOption(
											"maxRoomSize",
											Number.parseInt(e.target.value, 10) || 2,
										)
									}
									className="h-9"
									min={2}
									max={12}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-2">
							{(
								[
									["treasureRooms", "Treasure"],
									["trapRooms", "Hazards"],
									["puzzleRooms", "Puzzles"],
									["secretRooms", "Secrets"],
								] as Array<[keyof DungeonMapOptions, string]>
							).map(([key, label]) => (
								<div key={key}>
									<Label htmlFor={`option-${key}`}>{label}</Label>
									<Input
										id={`option-${key}`}
										type="number"
										value={options[key]}
										onChange={(e) =>
											updateOption(
												key,
												Number.parseInt(e.target.value, 10) || 0,
											)
										}
										className="h-9"
										min={0}
										max={20}
									/>
								</div>
							))}
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
						<div className="p-8 map-zoom-wrapper">
							<div className="map-grid border border-primary/10 map-grid-custom">
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
													"map-cell border-[0.5px] border-primary/5 relative group p-0 m-0 map-cell-dimensions",
													getCellColor(type),
												)}
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

				{dungeonMap && (
					<AscendantWindow title="ROOM KEY">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
							{dungeonMap.rooms.map((room, index) => (
								<div
									key={room.id}
									className="rounded border border-border/60 bg-muted/20 p-3 text-xs"
								>
									<div className="flex items-center justify-between gap-2 mb-1">
										<span className="font-heading font-semibold">
											{index + 1}. {room.label}
										</span>
										<span className="text-muted-foreground">
											{room.width}x{room.height}
										</span>
									</div>
									<p className="text-muted-foreground mb-2">
										{room.notes?.summary}
									</p>
									<div className="space-y-1 text-muted-foreground">
										{room.notes?.encounter && (
											<p>
												<span className="text-foreground">Encounter:</span>{" "}
												{room.notes.encounter}
											</p>
										)}
										{room.notes?.hazard && (
											<p>
												<span className="text-foreground">Hazard:</span>{" "}
												{room.notes.hazard}
											</p>
										)}
										{room.notes?.loot && (
											<p>
												<span className="text-foreground">Loot:</span>{" "}
												{room.notes.loot}
											</p>
										)}
										{room.notes?.lore && (
											<p>
												<span className="text-foreground">Lore:</span>{" "}
												{room.notes.lore}
											</p>
										)}
									</div>
								</div>
							))}
						</div>
					</AscendantWindow>
				)}

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
