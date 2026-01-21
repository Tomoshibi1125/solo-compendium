import {
  BoxGeometry,
  BufferGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  Quaternion,
  TetrahedronGeometry,
  Vector3,
} from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

export type FaceData = {
  value: number;
  normal: Vector3;
  center: Vector3;
  quaternion: Quaternion;
};

export type DieModel = {
  geometry: BufferGeometry;
  faces: FaceData[];
  faceByValue: Map<number, FaceData>;
  colliderVertices: Float32Array;
};

type FaceGroup = {
  normal: Vector3;
  center: Vector3;
  count: number;
};

const FACE_COUNTS: Record<number, number> = {
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  20: 20,
  100: 10,
};

const SCALE_MAP: Record<number, number> = {
  4: 1,
  6: 1.2,
  8: 1,
  10: 1.05,
  12: 1,
  20: 1,
  100: 1.05,
};

const UP = new Vector3(0, 1, 0);
const geometryCache = new Map<number, DieModel>();

const buildFaceGroups = (geometry: BufferGeometry) => {
  const position = geometry.getAttribute('position');
  const index = geometry.index?.array as number[] | undefined;
  const groups: FaceGroup[] = [];
  const normalThreshold = 0.998;

  const readVector = (idx: number) =>
    new Vector3(position.getX(idx), position.getY(idx), position.getZ(idx));

  const addTriangle = (a: number, b: number, c: number) => {
    const v0 = readVector(a);
    const v1 = readVector(b);
    const v2 = readVector(c);
    const normal = new Vector3()
      .subVectors(v1, v0)
      .cross(new Vector3().subVectors(v2, v0))
      .normalize();
    const center = new Vector3().addVectors(v0, v1).add(v2).multiplyScalar(1 / 3);

    let target = groups.find((group) => group.normal.clone().normalize().dot(normal) > normalThreshold);
    if (!target) {
      target = { normal: normal.clone(), center: new Vector3(), count: 0 };
      groups.push(target);
    }
    target.normal.add(normal);
    target.center.add(center);
    target.count += 1;
  };

  if (index) {
    for (let i = 0; i < index.length; i += 3) {
      addTriangle(index[i], index[i + 1], index[i + 2]);
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      addTriangle(i, i + 1, i + 2);
    }
  }

  return groups.map((group) => ({
    normal: group.normal.normalize(),
    center: group.center.multiplyScalar(1 / Math.max(1, group.count)),
    count: group.count,
  }));
};

const assignFaceValues = (sides: number, groups: FaceGroup[]): FaceData[] => {
  const faces = groups.map((group) => ({
    normal: group.normal.clone(),
    center: group.center.clone(),
  }));
  const used = new Set<number>();
  const pairs: Array<Array<{ normal: Vector3; center: Vector3; index: number }>> = [];

  faces.forEach((face, index) => {
    if (used.has(index)) return;
    let bestIndex = -1;
    let bestDot = 1;
    faces.forEach((other, otherIndex) => {
      if (index === otherIndex || used.has(otherIndex)) return;
      const dot = face.normal.dot(other.normal);
      if (dot < bestDot) {
        bestDot = dot;
        bestIndex = otherIndex;
      }
    });
    if (bestIndex >= 0) {
      used.add(index);
      used.add(bestIndex);
      pairs.push([
        { ...faces[index], index },
        { ...faces[bestIndex], index: bestIndex },
      ]);
    } else {
      used.add(index);
      pairs.push([{ ...faces[index], index }]);
    }
  });

  pairs.sort((a, b) => {
    const aFace = a[0];
    const bFace = b[0];
    if (bFace.normal.y !== aFace.normal.y) return bFace.normal.y - aFace.normal.y;
    if (bFace.normal.z !== aFace.normal.z) return bFace.normal.z - aFace.normal.z;
    return bFace.normal.x - aFace.normal.x;
  });

  const totalFaces = faces.length;
  const data: FaceData[] = [];
  pairs.forEach((pair, idx) => {
    const lowValue = idx + 1;
    const highValue = totalFaces - idx;
    if (pair.length === 1) {
      const face = pair[0];
      data.push({
        value: lowValue,
        normal: face.normal,
        center: face.center,
        quaternion: new Quaternion().setFromUnitVectors(face.normal, UP),
      });
      return;
    }
    const [first, second] = pair[0].normal.y >= pair[1].normal.y ? pair : [pair[1], pair[0]];
    data.push({
      value: lowValue,
      normal: first.normal,
      center: first.center,
      quaternion: new Quaternion().setFromUnitVectors(first.normal, UP),
    });
    data.push({
      value: highValue,
      normal: second.normal,
      center: second.center,
      quaternion: new Quaternion().setFromUnitVectors(second.normal, UP),
    });
  });

  const expected = FACE_COUNTS[sides] ?? faces.length;
  if (data.length !== expected) {
    return data
      .slice(0, expected)
      .sort((a, b) => a.value - b.value);
  }

  return data.sort((a, b) => a.value - b.value);
};

const centerGeometry = (geometry: BufferGeometry) => {
  geometry.computeBoundingBox();
  geometry.center();
  geometry.computeBoundingSphere();
};

const buildColliderVertices = (geometry: BufferGeometry) => {
  const position = geometry.getAttribute('position');
  const vertices: number[] = [];
  const seen = new Set<string>();
  const precision = 4;

  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const key = `${x.toFixed(precision)}|${y.toFixed(precision)}|${z.toFixed(precision)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    vertices.push(x, y, z);
  }

  return new Float32Array(vertices);
};

const createTrapezohedronGeometry = () => {
  const sides = 5;
  const radius = 1;
  const height = 0.9;
  const angle = (Math.PI * 2) / sides;
  const topZ = height / 2;
  const bottomZ = -height / 2;
  const vertices: Vector3[] = [];

  for (let i = 0; i < sides; i += 1) {
    const theta = angle * i;
    vertices.push(new Vector3(radius * Math.cos(theta), radius * Math.sin(theta), topZ));
  }

  for (let i = 0; i < sides; i += 1) {
    const theta = angle * i + angle / 2;
    vertices.push(new Vector3(radius * Math.cos(theta), radius * Math.sin(theta), bottomZ));
  }

  const faces: number[][] = [];
  faces.push([0, 1, 2, 3, 4]);
  faces.push([9, 8, 7, 6, 5]);

  for (let i = 0; i < sides; i += 1) {
    const topA = i;
    const topB = (i + 1) % sides;
    const bottomA = i + sides;
    const bottomB = ((i + 1) % sides) + sides;
    faces.push([topA, bottomA, topB]);
    faces.push([topB, bottomA, bottomB]);
  }

  const dualVertices: Vector3[] = [];

  faces.forEach((face) => {
    const v0 = vertices[face[0]];
    const v1 = vertices[face[1]];
    const v2 = vertices[face[2]];
    const normal = new Vector3()
      .subVectors(v1, v0)
      .cross(new Vector3().subVectors(v2, v0))
      .normalize();
    const centroid = face.reduce((sum, idx) => sum.add(vertices[idx]), new Vector3()).multiplyScalar(1 / face.length);
    if (normal.dot(centroid) < 0) {
      normal.multiplyScalar(-1);
    }
    const distance = Math.max(0.001, normal.dot(v0));
    dualVertices.push(normal.multiplyScalar(1 / distance));
  });

  const geometry = new ConvexGeometry(dualVertices);
  centerGeometry(geometry);
  return geometry;
};

const createGeometry = (sides: number) => {
  switch (sides) {
    case 4:
      return new TetrahedronGeometry(1, 0);
    case 6:
      return new BoxGeometry(1.2, 1.2, 1.2);
    case 8:
      return new OctahedronGeometry(1, 0);
    case 10:
      return createTrapezohedronGeometry();
    case 12:
      return new DodecahedronGeometry(1, 0);
    case 20:
      return new IcosahedronGeometry(1, 0);
    case 100:
      return createTrapezohedronGeometry();
    default:
      return new BoxGeometry(1, 1, 1);
  }
};

export const getDieModel = (sides: number): DieModel => {
  const cached = geometryCache.get(sides);
  if (cached) return cached;

  const geometry = createGeometry(sides);
  centerGeometry(geometry);
  const scale = SCALE_MAP[sides] ?? 1;
  geometry.scale(scale, scale, scale);
  geometry.computeVertexNormals();

  const groups = buildFaceGroups(geometry);
  const faces = assignFaceValues(sides, groups);
  const faceByValue = new Map<number, FaceData>();
  faces.forEach((face) => {
    faceByValue.set(face.value, face);
  });
  const colliderVertices = buildColliderVertices(geometry);

  const model = { geometry, faces, faceByValue, colliderVertices };
  geometryCache.set(sides, model);
  return model;
};
