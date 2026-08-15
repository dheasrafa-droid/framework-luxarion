/**
 * @file SphereGeometry.ts
 * @description Procedural UV Sphere geometry with latitude/longitude tesselation, vertex normals, and spherical UV maps.
 * Part of Luxarion Engine - Single Responsibility: Sphere Mesh Geometry Generation.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class SphereGeometry extends BufferGeometry {
  public parameters: { radius: number; widthSegments: number; heightSegments: number };

  constructor(radius: number = 1, widthSegments: number = 24, heightSegments: number = 16) {
    super();
    this.parameters = { radius, widthSegments, heightSegments };
    this._build(radius, widthSegments, heightSegments);
  }

  private _build(radius: number, widthSegments: number, heightSegments: number): void {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let iy = 0; iy <= heightSegments; iy++) {
      const v = iy / heightSegments;
      const phi = v * Math.PI;

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;
        const theta = u * Math.PI * 2;

        const x = -radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(theta) * Math.sin(phi);

        positions.push(x, y, z);

        const nx = -Math.cos(theta) * Math.sin(phi);
        const ny = Math.cos(phi);
        const nz = Math.sin(theta) * Math.sin(phi);
        normals.push(nx, ny, nz);

        uvs.push(u, 1 - v);
      }
    }

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = (widthSegments + 1) * iy + ix;
        const b = (widthSegments + 1) * (iy + 1) + ix;
        const c = (widthSegments + 1) * (iy + 1) + (ix + 1);
        const d = (widthSegments + 1) * iy + (ix + 1);

        if (iy !== 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1) indices.push(b, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
  }
}
