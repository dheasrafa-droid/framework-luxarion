/**
 * @file ArchGeometry.ts
 * @description Parametric Roman Arch / Vaulted Doorway geometry generator for dungeon portals, crypt openings, and corridor vaults.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class ArchGeometry extends BufferGeometry {
  constructor(
    width: number = 2.4,
    height: number = 3.6,
    depth: number = 0.8,
    segments: number = 16
  ) {
    super();

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const pillarHeight = height - halfWidth;
    const radius = halfWidth;

    let vertexOffset = 0;

    const addQuad = (
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      p4: [number, number, number],
      normal: [number, number, number]
    ) => {
      positions.push(...p1, ...p2, ...p3, ...p4);
      normals.push(...normal, ...normal, ...normal, ...normal);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);

      indices.push(
        vertexOffset,
        vertexOffset + 1,
        vertexOffset + 2,
        vertexOffset,
        vertexOffset + 2,
        vertexOffset + 3
      );
      vertexOffset += 4;
    };

    // 1. Left Vertical Jamb (Inner face)
    addQuad(
      [-halfWidth, 0, halfDepth],
      [-halfWidth, 0, -halfDepth],
      [-halfWidth, pillarHeight, -halfDepth],
      [-halfWidth, pillarHeight, halfDepth],
      [1, 0, 0]
    );

    // 2. Right Vertical Jamb (Inner face)
    addQuad(
      [halfWidth, 0, -halfDepth],
      [halfWidth, 0, halfDepth],
      [halfWidth, pillarHeight, halfDepth],
      [halfWidth, pillarHeight, -halfDepth],
      [-1, 0, 0]
    );

    // 3. Vaulted Curved Arch Ceiling (Soffit)
    for (let i = 0; i < segments; i++) {
      const a0 = Math.PI - (i / segments) * Math.PI;
      const a1 = Math.PI - ((i + 1) / segments) * Math.PI;

      const x0 = Math.cos(a0) * radius;
      const y0 = pillarHeight + Math.sin(a0) * radius;

      const x1 = Math.cos(a1) * radius;
      const y1 = pillarHeight + Math.sin(a1) * radius;

      // Normal points inward toward the center of arch
      const midAngle = (a0 + a1) / 2;
      const nx = -Math.cos(midAngle);
      const ny = -Math.sin(midAngle);

      addQuad(
        [x0, y0, halfDepth],
        [x0, y0, -halfDepth],
        [x1, y1, -halfDepth],
        [x1, y1, halfDepth],
        [nx, ny, 0]
      );
    }

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
}
