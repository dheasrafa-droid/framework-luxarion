/**
 * @file CylinderGeometry.ts
 * @description Parametric Cylinder mesh geometry with top and bottom cap options.
 * Part of Luxarion Engine - Single Responsibility: Cylinder Mesh Geometry Generation.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class CylinderGeometry extends BufferGeometry {
  public parameters: { radiusTop: number; radiusBottom: number; height: number; radialSegments: number; heightSegments: number };

  constructor(
    radiusTop: number = 0.5,
    radiusBottom: number = 0.5,
    height: number = 1.5,
    radialSegments: number = 24,
    heightSegments: number = 1
  ) {
    super();
    this.parameters = { radiusTop, radiusBottom, height, radialSegments, heightSegments };
    this._build(radiusTop, radiusBottom, height, radialSegments, heightSegments);
  }

  private _build(radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number): void {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfHeight = height / 2;
    const tanTheta = (radiusBottom - radiusTop) / height;

    // Torso
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const radius = v * (radiusBottom - radiusTop) + radiusTop;
      const py = halfHeight - v * height;

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        positions.push(radius * sinTheta, py, radius * cosTheta);

        let nx = sinTheta;
        let ny = tanTheta;
        let nz = cosTheta;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        normals.push(nx / len, ny / len, nz / len);

        uvs.push(u, 1 - v);
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = (radialSegments + 1) * y + x;
        const b = (radialSegments + 1) * (y + 1) + x;
        const c = (radialSegments + 1) * (y + 1) + (x + 1);
        const d = (radialSegments + 1) * y + (x + 1);

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
