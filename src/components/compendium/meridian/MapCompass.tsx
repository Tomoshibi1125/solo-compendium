/**
 * North-up compass rose, drawn inside a parent SVG whose viewBox is 0–1000 on
 * both axes. Meridian's maps are oriented north-up (consistent with the canon
 * "northwest borough", "across the river", "South Harbor").
 */
export function MapCompass({
	cx = 920,
	cy = 906,
	r = 40,
}: {
	cx?: number;
	cy?: number;
	r?: number;
}) {
	return (
		<g>
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="rgba(8,12,20,0.62)"
				stroke="rgba(255,255,255,0.55)"
				strokeWidth={2}
			/>
			{/* N arrow */}
			<polygon
				points={`${cx},${cy - r + 6} ${cx - 8},${cy + 2} ${cx + 8},${cy + 2}`}
				fill="#fb7185"
			/>
			{/* S tail */}
			<polygon
				points={`${cx},${cy + r - 6} ${cx - 8},${cy - 2} ${cx + 8},${cy - 2}`}
				fill="rgba(255,255,255,0.7)"
			/>
			<text
				x={cx}
				y={cy - r - 6}
				textAnchor="middle"
				fontSize={20}
				fontWeight={700}
				fill="#fb7185"
			>
				N
			</text>
		</g>
	);
}
