declare module 'robust-point-in-polygon' {
    function classifyPoint(polygon: [number, number][], point: [number, number]): -1 | 0 | 1;
    export default classifyPoint;
}
