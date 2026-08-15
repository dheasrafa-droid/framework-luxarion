/**
 * @file StaircaseGeometry.ts
 * @description Parametric Architectural Staircase geometry generator with custom step count, rise, run, width, and optional solid backing.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class StaircaseGeometry extends BufferGeometry {
  constructor(
    width: number = 3.0,
    height: number = 2.0,
    depth: number = 4.0,
    steps: number = 8,
    solidSides: boolean = true
  ) {
    super();

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const stepHeight = height / steps;
    const stepDepth = depth / steps;
    const halfWidth = width / 2;

    let vertexOffset = 0;

    // Helper to add a quad
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

    // Generate Steps (Treads and Risers)
    for (let i = 0; i < steps; i++) {
      const y0 = i * stepHeight;
      const y1 = (i + 1) * stepHeight;
      const z0 = i * stepDepth - depth / 2;
      const z1 = (i + 1) * stepDepth - depth / 2;

      // 1. Riser (Vertical face)
      addQuad(
        [-halfWidth, y0, z0],
        [halfWidth, y0, z0],
        [halfWidth, y1, z0],
        [-halfWidth, y1, z0],
        [0, 0, -1]
      );

      // 2. Tread (Horizontal step face)
      addQuad(
        [-halfWidth, y1, z0],
        [halfWidth, y1, z0],
        [halfWidth, y1, z1],
        [-halfWidth, y1, z1],
        [0, 1, 0]
      );

      // 3. Side Walls (if solidSides)
      if (solidSides) {
        // Left side quad for this step slice
        addQuad(
          [-halfWidth, 0, z0],
          [-halfWidth, 0, z1],
          [-halfWidth, y1, z1],
          [-halfWidth, y1, z0],
          [-1, 0, 0]
        );

        // Right side quad for this step slice
        addQuad(
          [halfWidth, 0, z1],
          [halfWidth, 0, z0],
          [halfWidth, y1, z0],
          [halfWidth, y1, z1],
          [1, 0, 0]
        );
      }
    }

    // 4. Back Wall
    addQuad(
      [halfWidth, 0, depth / 2],
      [-halfWidth, 0, depth / 2],
      [-halfWidth, height, depth / 2],
      [halfWidth, height, depth / 2],
      [0, 0, 1]
    );

    // 5. Bottom Floor Base
    addQuad(
      [-halfWidth, 0, depth / 2],
      [halfWidth, 0, depth / 2],
      [halfWidth, 0, -depth / 2],
      [-halfWidth, 0, -depth / 2],
      [0, -1, 0]
    );

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
}
