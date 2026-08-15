/**
 * @file BoxGeometry.ts
 * @description Procedural 3D Box geometry with 6 quad faces, normalized surface normals, UV maps, and index buffer.
 * Part of Luxarion Engine - Single Responsibility: Box Mesh Geometry Generation.
 */

import { BufferGeometry } from '../core/BufferGeometry';
import { BufferAttribute } from '../core/BufferAttribute';

export class BoxGeometry extends BufferGeometry {
  public parameters: { width: number; height: number; depth: number };

  constructor(width: number = 1, height: number = 1, depth: number = 1) {
    super();
    this.parameters = { width, height, depth };
    this._build(width, height, depth);
  }

  private _build(width: number, height: number, depth: number): void {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    let vertexOffset = 0;

    const buildPlane = (
      u: number, v: number, wDir: number,
      udir: number, vdir: number,
      widthVal: number, heightVal: number, depthVal: number,
      gridX: number, gridY: number
    ) => {
      const segmentWidth = widthVal / gridX;
      const segmentHeight = heightVal / gridY;
      const widthHalf = widthVal / 2;
      const heightHalf = heightVal / 2;
      const offset = vertexOffset;

      const vector = [0, 0, 0];

      // generate vertices, normals and uvs
      for (let iy = 0; iy <= gridY; iy++) {
        const y = iy * segmentHeight - heightHalf;
        for (let ix = 0; ix <= gridX; ix++) {
          const x = ix * segmentWidth - widthHalf;

          vector[u] = x * udir;
          vector[v] = y * vdir;
          vector[wDir] = depthVal;

          positions.push(vector[0], vector[1], vector[2]);

          vector[u] = 0;
          vector[v] = 0;
          vector[wDir] = depthVal > 0 ? 1 : -1;
          normals.push(vector[0], vector[1], vector[2]);

          uvs.push(ix / gridX, 1 - (iy / gridY));
          vertexOffset++;
        }
      }

      // indices
      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {
          const a = offset + ix + (gridX + 1) * iy;
          const b = offset + ix + (gridX + 1) * (iy + 1);
          const c = offset + (ix + 1) + (gridX + 1) * (iy + 1);
          const d = offset + (ix + 1) + (gridX + 1) * iy;

          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }
    };

    // 6 faces
    buildPlane(2, 1, 0, -1, -1, depth, height, w, 1, 1); // +X (Right)
    buildPlane(2, 1, 0, 1, -1, depth, height, -w, 1, 1); // -X (Left)
    buildPlane(0, 2, 1, 1, 1, width, depth, h, 1, 1);    // +Y (Top)
    buildPlane(0, 2, 1, 1, -1, width, depth, -h, 1, 1);  // -Y (Bottom)
    buildPlane(0, 1, 2, 1, -1, width, height, d, 1, 1);  // +Z (Front)
    buildPlane(0, 1, 2, -1, -1, width, height, -d, 1, 1); // -Z (Back)

    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new BufferAttribute(new Uint16Array(indices), 1));
  }
}
