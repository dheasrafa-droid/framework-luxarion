/**
 * @file ProceduralTerrainGeometry.ts
 * @description Dynamic procedural heightmap terrain grid geometry with realtime elevation and normal recomputation.
 * Part of Luxarion Engine - Procedural Mesh Module.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';
import { Noise } from '../math/Noise';
import { Vector3 } from '../math/Vector3';

export class ProceduralTerrainGeometry extends BufferGeometry {
  public width: number;
  public depth: number;
  public widthSegments: number;
  public depthSegments: number;
  private _positions: Float32Array;
  private _normals: Float32Array;

  constructor(
    width: number = 10,
    depth: number = 10,
    widthSegments: number = 40,
    depthSegments: number = 40
  ) {
    super();
    this.width = width;
    this.depth = depth;
    this.widthSegments = widthSegments;
    this.depthSegments = depthSegments;

    const vertexCount = (widthSegments + 1) * (depthSegments + 1);
    this._positions = new Float32Array(vertexCount * 3);
    this._normals = new Float32Array(vertexCount * 3);

    this._buildGrid();
  }

  private _buildGrid(): void {
    const { width, depth, widthSegments, depthSegments } = this;
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const gridX = widthSegments;
    const gridZ = depthSegments;
    const segmentWidth = width / gridX;
    const segmentDepth = depth / gridZ;

    let ptr = 0;
    for (let iz = 0; iz <= gridZ; iz++) {
      const z = iz * segmentDepth - halfDepth;
      for (let ix = 0; ix <= gridX; ix++) {
        const x = ix * segmentWidth - halfWidth;

        this._positions[ptr * 3] = x;
        this._positions[ptr * 3 + 1] = 0;
        this._positions[ptr * 3 + 2] = z;

        this._normals[ptr * 3] = 0;
        this._normals[ptr * 3 + 1] = 1;
        this._normals[ptr * 3 + 2] = 0;

        uvs.push(ix / gridX, iz / gridZ);
        ptr++;
      }
    }

    for (let iz = 0; iz < gridZ; iz++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + (gridX + 1) * iz;
        const b = ix + (gridX + 1) * (iz + 1);
        const c = (ix + 1) + (gridX + 1) * (iz + 1);
        const d = (ix + 1) + (gridX + 1) * iz;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    this.setAttribute('position', new BufferAttribute(this._positions, 3));
    this.setAttribute('normal', new BufferAttribute(this._normals, 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }

  /**
   * Apply animated procedural elevation displacement
   */
  public updateElevation(time: number, scale: number = 0.35, height: number = 1.2): void {
    const gridX = this.widthSegments;
    const gridZ = this.depthSegments;

    let ptr = 0;
    for (let iz = 0; iz <= gridZ; iz++) {
      for (let ix = 0; ix <= gridX; ix++) {
        const x = this._positions[ptr * 3];
        const z = this._positions[ptr * 3 + 2];

        // Multi-frequency wave & noise combination
        const n1 = Noise.noise2D(x * scale + time * 0.4, z * scale + time * 0.3);
        const n2 = Noise.noise2D(x * scale * 2.0 - time * 0.2, z * scale * 2.0 + time * 0.2) * 0.5;
        const wave = Math.sin(Math.sqrt(x * x + z * z) * 1.2 - time * 1.5) * 0.3;

        this._positions[ptr * 3 + 1] = (n1 + n2 + wave) * height;
        ptr++;
      }
    }

    // Recompute Normals for accurate light reflection
    this.computeVertexNormals();

    const posAttr = this.getAttribute('position');
    if (posAttr) posAttr.setNeedsUpdate();
    const normAttr = this.getAttribute('normal');
    if (normAttr) normAttr.setNeedsUpdate();
  }
}
