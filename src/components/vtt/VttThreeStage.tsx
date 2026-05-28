import { Billboard, Image as DreiImage, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { sceneToThreeDescriptor } from "@/lib/vtt/threeAdapters";
import type { VTTScene } from "@/types/vtt";

interface ThreeToken {
	id: string;
	position: { x: number; y: number; z: number };
	width: number;
	height: number;
	color?: string | null;
	imageUrl?: string | null;
}

/**
 * D2: render each token as a sprite billboard — token art on a plane that
 * always faces the camera (true VTT "standee" look) when an image is
 * available, falling back to the colored box while the texture loads or
 * when the token has no art. Suspense keeps a slow/missing texture from
 * blocking the rest of the scene.
 */
function TokenBillboard({ token }: { token: ThreeToken }) {
	const fallbackColor = token.color || "#facc15";
	const box = (
		<mesh castShadow>
			<boxGeometry args={[token.width, token.height, token.width]} />
			<meshStandardMaterial
				color={fallbackColor}
				emissive={fallbackColor}
				emissiveIntensity={0.15}
			/>
		</mesh>
	);

	if (!token.imageUrl) {
		return (
			<group
				position={[token.position.x, token.position.y, token.position.z]}
			>
				{box}
			</group>
		);
	}

	return (
		<group position={[token.position.x, token.position.y, token.position.z]}>
			<Suspense fallback={box}>
				<Billboard>
					<DreiImage
						url={token.imageUrl}
						scale={[token.width, token.width] as [number, number]}
						transparent
					/>
				</Billboard>
			</Suspense>
		</group>
	);
}

/**
 * Misty Pearl C1 — Spatial Strata Viewer (Talespire-class 3D mode).
 *
 * Read-mostly 3D rendering of the active scene's walls / tokens /
 * lights / strata via `@react-three/fiber`. Tool modes (draw,
 * measure, light authoring) remain 2D-only — a future revision can
 * lift those into 3D once the read-side stabilizes.
 *
 * RA theming: "Bureau Cartography — Spatial Mode" — experimental
 * cartography overlay the Bureau ships behind a Labs flag.
 *
 * Scope guard: this is a **scaffold**. The Pixi renderer remains the
 * canonical path; the 3D viewer is a parallel renderer the Warden
 * can toggle into for spatial spelunking. Lazy-loaded so the bundle
 * cost only hits Wardens who opt in.
 */
export interface VttThreeStageProps {
	scene: VTTScene;
	isWarden?: boolean;
}

export function VttThreeStage({ scene }: VttThreeStageProps) {
	const descriptor = useMemo(() => sceneToThreeDescriptor(scene), [scene]);

	return (
		<Canvas
			data-engine="three"
			data-testid="vtt-three-stage"
			camera={{ position: [10, 12, 14], fov: 55 }}
			shadows
			gl={{ antialias: true, alpha: true }}
		>
			<color attach="background" args={["#070710"]} />
			<ambientLight intensity={0.25} />

			{/* Strata floors */}
			{descriptor.strata.map((stratum) => (
				<mesh
					key={stratum.id}
					position={[
						descriptor.sceneWidth / 2,
						stratum.groundY,
						descriptor.sceneHeight / 2,
					]}
					rotation={[-Math.PI / 2, 0, 0]}
					receiveShadow
				>
					<planeGeometry
						args={[descriptor.sceneWidth, descriptor.sceneHeight]}
					/>
					<meshStandardMaterial
						color="#1a1a2a"
						transparent
						opacity={stratum.visibleToPlayers ? 0.9 : 0.5}
					/>
				</mesh>
			))}

			{/* Walls as extruded boxes */}
			{descriptor.walls.map((wall) => {
				const dx = wall.to.x - wall.from.x;
				const dz = wall.to.z - wall.from.z;
				const length = Math.sqrt(dx * dx + dz * dz);
				const angle = Math.atan2(dz, dx);
				const stratum = descriptor.strata.find((s) => s.id === wall.level);
				const groundY = stratum?.groundY ?? 0;
				if (wall.type === "door" && wall.doorOpen) return null;
				return (
					<mesh
						key={wall.id}
						position={[
							(wall.from.x + wall.to.x) / 2,
							groundY + wall.height / 2,
							(wall.from.z + wall.to.z) / 2,
						]}
						rotation={[0, -angle, 0]}
						castShadow
						receiveShadow
					>
						<boxGeometry args={[length, wall.height, 0.15]} />
						<meshStandardMaterial
							color={wall.type === "window" ? "#9bb6d1" : "#3a3a5a"}
							transparent={wall.type === "window"}
							opacity={wall.type === "window" ? 0.4 : 1}
						/>
					</mesh>
				);
			})}

			{/* Lights as point lights */}
			{descriptor.lights.map((light) => (
				<pointLight
					key={light.id}
					position={[light.position.x, light.position.y, light.position.z]}
					color={light.color}
					intensity={light.intensity}
					distance={light.dimRadius}
					castShadow
				/>
			))}

			{/* D2: tokens as sprite billboards (token art when available, else
			    a colored box fallback). */}
			{descriptor.tokens.map((token) => (
				<TokenBillboard key={token.id} token={token as ThreeToken} />
			))}

			<OrbitControls
				makeDefault
				enableDamping
				dampingFactor={0.1}
				target={[descriptor.sceneWidth / 2, 0, descriptor.sceneHeight / 2]}
			/>
		</Canvas>
	);
}

export default VttThreeStage;
