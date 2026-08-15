/**
 * @file TorusKnotGeometry.ts
 * @description Parametric Torus Knot (p, q) 3D mesh geometry with Frenet-Serret normal frame orientation.
 * Part of Luxarion Engine - Geometric Mesh Module.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
import { Vector3 } from '../math/Vector3';

export class TorusKnotGeometry extends BufferGeometry {
  public parameters: {
    radius: number;
    tube: number;
    tubularSegments: number;
    radialSegments: number;
    p: number;
    q: number;
  };

  constructor(
    radius: number = 1.2,
    tube: number = 0.35,
    tubularSegments: number = 96,
    radialSegments: number = 24,
    p: number = 2,
    q: number = 3
  ) {
    super();
    this.parameters = { radius, tube, tubularSegments, radialSegments, p, q };
    this._build();
  }

  private _calculatePositionOnCurve(u: number, p: number, q: number, radius: number, target: Vector3): Vector3 {
    const cu = Math.cos(u);
    const su = Math.sin(u);
    const quOverP = (q / p) * u;
    const cs = Math.cos(quOverP);

    const r0 = radius * (2 + cs) * 0.5;
    target.x = r0 * Math.cos(u);
    target.y = r0 * Math.sin(u);
    target.z = radius * Math.sin(quOverP) * 0.7;
    return target;
  }

  private _build(): void {
    const { radius, tube, tubularSegments, radialSegments, p, q } = this.parameters;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const p1 = new Vector3();
    const p2 = new Vector3();
    const T = new Vector3();
    const N = new Vector3();
    const B = new Vector3();
    const vertex = new Vector3();
    const normal = new Vector3();

    for (let i = 0; i <= tubularSegments; ++i) {
      const u = (i / tubularSegments) * p * Math.PI * 2;
      this._calculatePositionOnCurve(u, p, q, radius, p1);
      this._calculatePositionOnCurve(u + 0.01, p, q, radius, p2);

      // Tangent vector
      T.subVectors(p2, p1).normalize();

      // Normal vector approximation
      N.copy(p2).add(p1).normalize();

      // Binormal vector
      B.crossVectors(T, N).normalize();
      N.crossVectors(B, T).normalize();

      for (let j = 0; j <= radialSegments; ++j) {
        const v = (j / radialSegments) * Math.PI * 2;
        const cx = -tube * Math.cos(v);
        const cy = tube * Math.sin(v);

        vertex.x = p1.x + (cx * N.x + cy * B.x);
        vertex.y = p1.y + (cx * N.y + cy * B.y);
        vertex.z = p1.z + (cx * N.z + cy * B.z);
        positions.push(vertex.x, vertex.y, vertex.z);

        normal.subVectors(vertex, p1).normalize();
        normals.push(normal.x, normal.y, normal.z);

        uvs.push(i / tubularSegments, j / radialSegments);
      }
    }

    for (let j = 1; j <= tubularSegments; j++) {
      for (let i = 1; i <= radialSegments; i++) {
        const a = (radialSegments + 1) * (j - 1) + (i - 1);
        const b = (radialSegments + 1) * j + (i - 1);
        const c = (radialSegments + 1) * j + i;
        const d = (radialSegments + 1) * (j - 1) + i;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
}
