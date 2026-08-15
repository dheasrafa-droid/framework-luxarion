/**
 * @file TorusGeometry.ts
 * @description Parametric Torus donut mesh geometry with radial and tubular segment tesselation.
 * Part of Luxarion Engine - Single Responsibility: Torus Mesh Geometry Generation.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class TorusGeometry extends BufferGeometry {
  public parameters: { radius: number; tube: number; radialSegments: number; tubularSegments: number };

  constructor(
    radius: number = 1,
    tube: number = 0.4,
    radialSegments: number = 16,
    tubularSegments: number = 32
  ) {
    super();
    this.parameters = { radius, tube, radialSegments, tubularSegments };
    this._build(radius, tube, radialSegments, tubularSegments);
  }

  private _build(radius: number, tube: number, radialSegments: number, tubularSegments: number): void {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++) {
        const u = (i / tubularSegments) * Math.PI * 2;
        const v = (j / radialSegments) * Math.PI * 2;

        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v);

        positions.push(x, y, z);

        // Center of the tube ring
        const cx = radius * Math.cos(u);
        const cy = radius * Math.sin(u);
        const cz = 0;

        let nx = x - cx;
        let ny = y - cy;
        let nz = z - cz;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len > 0.00001) {
          nx /= len;
          ny /= len;
          nz /= len;
        }
        normals.push(nx, ny, nz);

        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++) {
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
  }
}
