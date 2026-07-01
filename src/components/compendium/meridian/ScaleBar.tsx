/**
 * Cartographic scale bar, drawn inside a parent SVG whose viewBox is 0–1000 on
 * both axes. Given the map's real-world span (`kmAcross`), it picks a tidy round
 * distance and draws a bar of the matching fraction of the map width. The span
 * is an authored approximation — labelled as "approx" in the figure caption.
 */
const NICE_KM = [0.25, 0.5, 1, 2, 5, 10, 20, 50];

function niceDistance(kmAcross: number): number {
	const target = kmAcross / 4;
	let best = NICE_KM[0];
	for (const v of NICE_KM) {
		if (v <= target) best = v;
	}
	return best;
}

export function ScaleBar({
	kmAcross,
	x = 40,
	y = 952,
}: {
	kmAcross: number;
	x?: number;
	y?: number;
}) {
	const km = niceDistance(kmAcross);
	const len = (km / kmAcross) * 1000; // viewBox units
	const tick = 12;

	return (
		<g>
			<rect
				x={x - 10}
				y={y - 24}
				width={len + 64}
				height={42}
				rx={6}
				fill="rgba(8,12,20,0.62)"
			/>
			<line x1={x} y1={y} x2={x + len} y2={y} stroke="#fff" strokeWidth={3} />
			<line
				x1={x}
				y1={y - tick / 2}
				x2={x}
				y2={y + tick / 2}
				stroke="#fff"
				strokeWidth={3}
			/>
			<line
				x1={x + len}
				y1={y - tick / 2}
				x2={x + len}
				y2={y + tick / 2}
				stroke="#fff"
				strokeWidth={3}
			/>
			<text
				x={x + len + 10}
				y={y + 6}
				fontSize={20}
				fontWeight={600}
				fill="#fff"
			>
				{km < 1 ? `${km * 1000} m` : `${km} km`}
			</text>
		</g>
	);
}
