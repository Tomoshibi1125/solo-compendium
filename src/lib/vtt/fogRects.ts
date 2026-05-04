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
	let activeRects = new Map<string, VttFogRect>();
	for (let ry = 0; ry < fogData.length; ry += 1) {
		const row = fogData[ry] ?? [];
		const nextActiveRects = new Map<string, VttFogRect>();
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
			const width = rx - start;
			const key = `${start}:${width}`;
			const activeRect = activeRects.get(key);
			if (activeRect && activeRect.ry + activeRect.height === ry) {
				activeRect.height += 1;
				nextActiveRects.set(key, activeRect);
			} else {
				const rect = { rx: start, ry, width, height: 1 };
				rects.push(rect);
				nextActiveRects.set(key, rect);
			}
		}
		activeRects = nextActiveRects;
	}

	return rects;
}
