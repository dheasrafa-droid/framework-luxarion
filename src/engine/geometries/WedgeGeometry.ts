/**
 * @file WedgeGeometry.ts
 * @description Parametric Triangular Wedge / Slope Ramp geometry for architectural transitions, roofs, and inclines.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class WedgeGeometry extends BufferGeometry {
  constructor(
    width: number = 2.0,
    height: number = 2.0,
    depth: number = 4.0
  ) {
    super();

    const hw = width / 2;
    const hd = depth / 2;

    // 6 Vertices of a triangular prism
    // v0: [-hw, 0, -hd]  (bottom back left)
    // v1: [ hw, 0, -hd]  (bottom back right)
    // v2: [ hw, 0,  hd]  (bottom front right)
    // v3: [-hw, 0,  hd]  (bottom front left)
    // v4: [-hw, height, -hd] (top back left)
    // v5: [ hw, height, -hd] (top back right)

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    let offset = 0;

    const addTriangle = (
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      n: [number, number, number]
    ) => {
      positions.push(...p1, ...p2, ...p3);
      normals.push(...n, ...n, ...n);
      uvs.push(0, 0, 1, 0, 0.5, 1);
      indices.push(offset, offset + 1, offset + 2);
      offset += 3;
    };

    const addQuad = (
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      p4: [number, number, number],
      n: [number, number, number]
    ) => {
      positions.push(...p1, ...p2, ...p3, ...p4);
      normals.push(...n, ...n, ...n, ...n);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
      offset += 4;
    };

    // 1. Bottom Base Quad
    addQuad([-hw, 0, hd], [hw, 0, hd], [hw, 0, -hd], [-hw, 0, -hd], [0, -1, 0]);

    // 2. Back Vertical Wall Quad
    addQuad([hw, 0, -hd], [-hw, 0, -hd], [-hw, height, -hd], [hw, height, -hd], [0, 0, -1]);

    // 3. Incline Slanted Ramp Quad
    const rampNormal: [number, number, number] = [0, depth, height];
    const len = Math.hypot(depth, height);
    rampNormal[1] /= len;
    rampNormal[2] /= len;
    addQuad([-hw, 0, hd], [-hw, height, -hd], [hw, height, -hd], [hw, 0, hd], rampNormal);

    // 4. Left Triangle Side
    addTriangle([-hw, 0, -hd], [-hw, 0, hd], [-hw, height, -hd], [-1, 0, 0]);

    // 5. Right Triangle Side
    addTriangle([hw, 0, hd], [hw, 0, -hd], [hw, height, -hd], [1, 0, 0]);

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
}
