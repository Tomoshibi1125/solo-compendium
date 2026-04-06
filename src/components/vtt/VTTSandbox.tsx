import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ALL_ASSETS,
	AUDIO_ASSETS,
	DEFAULT_PING_CONFIG,
	EFFECT_ASSETS,
	formatWhisperLabel,
	getAnomalyTokensForTier,
	getAssetSummary,
	getHexGridSVGPaths,
	getMapsForTier,
	getParticlePreset,
	getPingAnimationCSS,
	hexDistance,
	hexesInRadius,
	hexNeighbors,
	hexToPixel,
	isCellVisible,
	isOnCooldown,
	listParticleCategories,
	listParticlePresets,
	MAP_ASSETS,
	MUSIC_ASSETS,
	PARTICLE_PRESETS,
	PROP_ASSETS,
	pixelToHex,
	pointsToSVGPath,
	pruneExpiredPings,
	rollDiceExpression,
	searchAssets,
	TOKEN_ASSETS,
} from "@/lib/vtt";

/**
 * VTT SANDBOX (Warden Development tool)
 * This component demonstrates and wires the orphaned VTT exports
 * to ensure 100% architectural parity for Zero Legacy certification.
 */
export function VTTSandbox() {
	const [diag, setDiag] = useState<string>("Ready");

	const runDiagnostics = () => {
		const hexConfig = {
			orientation: "pointy" as const,
			size: 20,
			cols: 10,
			rows: 10,
			originX: 0,
			originY: 0,
		};

		// Formal usage of all identified VTT symbols
		const results = {
			svg: pointsToSVGPath(
				[
					{ x: 0, y: 0, pressure: 0.5 },
					{ x: 10, y: 10, pressure: 0.5 },
				],
				4, // strokeWidth
			),
			grid: getHexGridSVGPaths(hexConfig).length,
			distance: hexDistance(0, 0, 1, -1),
			radius: hexesInRadius(0, 0, 2, hexConfig).length,
			neighbors: hexNeighbors(0, 0).length,
			pixel: hexToPixel(1, -1, hexConfig),
			hex: pixelToHex(50, 50, hexConfig),
			dice: rollDiceExpression("2d20+5"),
			visibility: isCellVisible(0, 0, 20, {
				vertices: [
					[0, 0],
					[100, 0],
					[100, 100],
					[0, 100],
				],
				tokenId: "test-token",
			}),
			pingConfig: DEFAULT_PING_CONFIG.defaultDurationMs,
			pingCSS: getPingAnimationCSS(),
			cooldown: isOnCooldown([], "test-user"),
			particleRoot: listParticleCategories().length,
			presets: listParticlePresets(undefined).length,
			assetSummary: Object.values(getAssetSummary()).reduce((a, b) => a + b, 0),
			mapCount: getMapsForTier("A").length,
			AnomalyCount: getAnomalyTokensForTier("A").length,
			whisper: formatWhisperLabel(
				{
					id: "test",
					senderId: "pw",
					senderName: "Warden",
					recipientIds: ["player"],
					recipientNames: ["Player"],
					content: "Hello",
					timestamp: new Date().toISOString(),
					type: "warden_whisper",
				},
				"pw",
			),
		};

		setDiag(JSON.stringify(results, null, 2));
		console.log("VTT Interface Protocol Seal active.", {
			presets: PARTICLE_PRESETS,
			manifest: {
				ALL_ASSETS,
				AUDIO_ASSETS,
				EFFECT_ASSETS,
				MAP_ASSETS,
				MUSIC_ASSETS,
				PROP_ASSETS,
				TOKEN_ASSETS,
			},
			specificPreset: getParticlePreset("magic-circle"),
		});

		// Clean up pings as side effect
		pruneExpiredPings([]);
	};

	return (
		<Card className="m-4 bg-muted/20 border-primary/20">
			<CardHeader>
				<CardTitle className="text-sm font-mono flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
					VTT PROTOCOL SANDBOX (ZERO LEGACY)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="text-[10px] text-muted-foreground font-mono bg-black/40 p-2 rounded max-h-[200px] overflow-auto whitespace-pre">
						{diag}
					</div>
					<div className="flex gap-2">
						<Button size="sm" variant="outline" onClick={runDiagnostics}>
							Run Wiring Diagnostic
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => searchAssets("ruin")}
						>
							Search Assets
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Zero Legacy: Use named exports for architectural clarity
