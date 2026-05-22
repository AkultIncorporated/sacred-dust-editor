import type { DustConfig, GeometryBuffers, GeometryType } from "./types";

const BASE_PARTICLE_COUNT = 60000;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pushPoint(
  positions: Float32Array,
  normals: Float32Array,
  randoms: Float32Array,
  pointIndex: number,
  x: number,
  y: number,
  z: number,
  rand: number,
) {
  const idx = pointIndex * 3;
  const len = Math.sqrt(x * x + y * y + z * z) || 1;
  positions[idx] = x;
  positions[idx + 1] = y;
  positions[idx + 2] = z;
  normals[idx] = x / len;
  normals[idx + 1] = y / len;
  normals[idx + 2] = z / len;
  randoms[pointIndex] = rand;
}

export function generateFibonacciSphere(count: number, radius: number): GeometryBuffers {
  const rand = mulberry32(42);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const randoms = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const theta = (2 * Math.PI * i) / GOLDEN_RATIO;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    pushPoint(positions, normals, randoms, i, x, y, z, rand());
  }

  return { positions, normals, randoms, count };
}

function sampleTriangle(a: number[], b: number[], c: number[], r1: number, r2: number) {
  const sr1 = Math.sqrt(r1);
  const u = 1 - sr1;
  const v = sr1 * (1 - r2);
  const w = sr1 * r2;
  return [
    a[0] * u + b[0] * v + c[0] * w,
    a[1] * u + b[1] * v + c[1] * w,
    a[2] * u + b[2] * v + c[2] * w,
  ];
}

export function generateMerkaba(count: number, radius: number): GeometryBuffers {
  const rand = mulberry32(84);
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const s = radius;
  const up = [
    [0, s, 0],
    [-s * 0.94, -s * 0.33, s * 0.82],
    [s * 0.94, -s * 0.33, s * 0.82],
    [0, -s * 0.33, -s * 1.12],
  ];
  const down = up.map(([x, y, z]) => [x, -y, z]);
  const faces = [
    [up[0], up[1], up[2]],
    [up[0], up[2], up[3]],
    [up[0], up[3], up[1]],
    [up[1], up[3], up[2]],
    [down[0], down[2], down[1]],
    [down[0], down[3], down[2]],
    [down[0], down[1], down[3]],
    [down[1], down[2], down[3]],
  ];

  for (let i = 0; i < count; i += 1) {
    const face = faces[i % faces.length];
    const p = sampleTriangle(face[0], face[1], face[2], rand(), rand());
    const shell = 0.88 + rand() * 0.18;
    pushPoint(positions, normals, randoms, i, p[0] * shell, p[1] * shell, p[2] * shell, rand());
  }

  return { positions, normals, randoms, count };
}

export function generateGeometry(type: GeometryType, config: DustConfig): GeometryBuffers {
  const layers = Math.max(1, Math.round(config.layerCount));
  const count = Math.max(1000, Math.round(BASE_PARTICLE_COUNT * config.particleDensity));
  const base = type === "merkaba" ? generateMerkaba(count, 1.62) : generateFibonacciSphere(count, 1.78);

  if (layers === 1) {
    return base;
  }

  const total = base.count * layers;
  const positions = new Float32Array(total * 3);
  const normals = new Float32Array(total * 3);
  const randoms = new Float32Array(total);
  let target = 0;

  for (let i = 0; i < base.count; i += 1) {
    const source = i * 3;
    for (let layer = 0; layer < layers; layer += 1) {
      const offset = ((layer / (layers - 1)) - 0.5) * config.depthRange;
      const idx = target * 3;
      positions[idx] = base.positions[source] + base.normals[source] * offset;
      positions[idx + 1] = base.positions[source + 1] + base.normals[source + 1] * offset;
      positions[idx + 2] = base.positions[source + 2] + base.normals[source + 2] * offset;
      normals[idx] = base.normals[source];
      normals[idx + 1] = base.normals[source + 1];
      normals[idx + 2] = base.normals[source + 2];
      randoms[target] = (base.randoms[i] + layer / layers) % 1;
      target += 1;
    }
  }

  return { positions, normals, randoms, count: total };
}
