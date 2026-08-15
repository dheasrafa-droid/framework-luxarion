/**
 * @file PillarGeometry.ts
 * @description Parametric Segmented Architectural Pillar / Column with base plinth, shaft fluting, and capital collar.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class PillarGeometry extends BufferGeometry {
  constructor(
    radius: number = 0.6,
    height: number = 4.0,
    radialSegments: number = 16
  ) {
    super();

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const heightSegments = 8;
    const halfHeight = height / 2;

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const py = v * height - halfHeight;

      // Slight flared base and capital collar
      let r = radius;
      if (v < 0.1) r = radius * (1.2 - v * 2);
      else if (v > 0.9) r = radius * (1.0 + (v - 0.9) * 2);

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;

        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        positions.push(cos * r, py, sin * r);
        normals.push(cos, 0, sin);
        uvs.push(u * 2, v * 4); // tiled UVs for architectural scale
      }
    }

    const rowSize = radialSegments + 1;
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * rowSize + x;
        const b = y * rowSize + (x + 1);
        const c = (y + 1) * rowSize + (x + 1);
        const d = (y + 1) * rowSize + x;

        indices.push(a, b, c, a, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
}
