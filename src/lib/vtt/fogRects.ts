export type VttFogRect = {
	rx: number;
	ry: number;
	width: number;
	height: number;
};

export function buildVttFogRects(
	fogData: boolean[][] | null | undefined,
): VttFogRect[] {
	if (!fogData || fogData.length === 0) return [];

	const rects: VttFogRect[] = [];
	for (let ry = 0; ry < fogData.length; ry += 1) {
		const row = fogData[ry] ?? [];
		let rx = 0;
		while (rx < row.length) {
			if (row[rx]) {
				rx += 1;
				continue;
			}
			const start = rx;
			while (rx < row.length && !row[rx]) {
				rx += 1;
			}
			rects.push({ rx: start, ry, width: rx - start, height: 1 });
		}
	}

	return rects;
}
