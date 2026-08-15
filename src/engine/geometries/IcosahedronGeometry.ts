/**
 * @file IcosahedronGeometry.ts
 * @description Geodesic 20-faced crystal icosahedron geometry based on the golden ratio.
 * Part of Luxarion Engine - Single Responsibility: Icosahedral Polyhedron Mesh Generation.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class IcosahedronGeometry extends BufferGeometry {
  public parameters: { radius: number };

  constructor(radius: number = 1) {
    super();
    this.parameters = { radius };
    this._build(radius);
  }

  private _build(radius: number): void {
    const t = (1 + Math.sqrt(5)) / 2;

    const vertices = [
      -1,  t,  0,   1,  t,  0,  -1, -t,  0,   1, -t,  0,
       0, -1,  t,   0,  1,  t,   0, -1, -t,   0,  1, -t,
       t,  0, -1,   t,  0,  1,  -t,  0, -1,  -t,  0,  1
    ];

    const indices = [
       0, 11,  5,   0,  5,  1,   0,  1,  7,   0,  7, 10,   0, 10, 11,
       1,  5,  9,   5, 11,  4,  11, 10,  2,  10,  7,  6,   7,  1,  8,
       3,  9,  4,   3,  4,  2,   3,  2,  6,   3,  6,  8,   3,  8,  9,
       4,  9,  5,   2,  4, 11,   6,  2, 10,   8,  6,  7,   9,  8,  1
    ];

    // Normalize vertices to sphere radius
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];

    for (let i = 0; i < vertices.length; i += 3) {
      let x = vertices[i];
      let y = vertices[i + 1];
      let z = vertices[i + 2];
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      positions.push(nx * radius, ny * radius, nz * radius);
      normals.push(nx, ny, nz);

      const u = 0.5 + Math.atan2(nz, nx) / (2 * Math.PI);
      const v = 0.5 - Math.asin(ny) / Math.PI;
      uvs.push(u, v);
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
  }
}
