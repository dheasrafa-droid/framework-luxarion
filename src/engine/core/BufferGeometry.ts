/**
 * @file BufferGeometry.ts
 * @description Master geometry container holding vertex attributes (position, normal, uv, color) and element index buffers.
 * Part of Luxarion Engine - Single Responsibility: Geometric Mesh Representation & Vertex Data Management.
 */

import { BufferAttribute } from './BufferAttribute';
import { EventDispatcher } from './EventDispatcher';
import { MathUtils } from '../math/MathUtils';

export class BufferGeometry extends EventDispatcher {
  public readonly id: string;
  public attributes: Map<string, BufferAttribute> = new Map();
  public index: BufferAttribute | null = null;
  public drawRange: { start: number; count: number } = { start: 0, count: Infinity };

  constructor() {
    super();
    this.id = MathUtils.generateUUID();
  }

  public setAttribute(name: string, attribute: BufferAttribute): this {
    this.attributes.set(name, attribute);
    return this;
  }

  public getAttribute(name: string): BufferAttribute | undefined {
    return this.attributes.get(name);
  }

  public hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  public setIndex(index: BufferAttribute | number[] | Uint16Array | Uint32Array): this {
    if (index instanceof BufferAttribute) {
      this.index = index;
    } else if (Array.isArray(index)) {
      this.index = new BufferAttribute(new Uint16Array(index), 1);
    } else {
      this.index = new BufferAttribute(index, 1);
    }
    return this;
  }

  public getVertexCount(): number {
    const position = this.getAttribute('position');
    return position ? position.count : 0;
  }

  public computeVertexNormals(): this {
    const position = this.getAttribute('position');
    if (!position) return this;

    let normal = this.getAttribute('normal');
    if (!normal || normal.count !== position.count) {
      normal = new BufferAttribute(new Float32Array(position.count * 3), 3);
      this.setAttribute('normal', normal);
    } else {
      for (let i = 0; i < normal.data.length; i++) {
        normal.data[i] = 0;
      }
    }

    const posData = position.data;
    const normData = normal.data;

    if (this.index) {
      const indices = this.index.data;
      for (let i = 0; i < indices.length; i += 3) {
        const vA = indices[i] * 3;
        const vB = indices[i + 1] * 3;
        const vC = indices[i + 2] * 3;

        const ax = posData[vA], ay = posData[vA + 1], az = posData[vA + 2];
        const bx = posData[vB], by = posData[vB + 1], bz = posData[vB + 2];
        const cx = posData[vC], cy = posData[vC + 1], cz = posData[vC + 2];

        const cbx = cx - bx, cby = cz - by, cbz = cz - bz;
        const abx = ax - bx, aby = ay - by, abz = az - bz;

        // Cross product
        const nx = cby * abz - cbz * aby;
        const ny = cbz * abx - cbx * abz;
        const nz = cbx * aby - cby * abx;

        normData[vA] += nx; normData[vA + 1] += ny; normData[vA + 2] += nz;
        normData[vB] += nx; normData[vB + 1] += ny; normData[vB + 2] += nz;
        normData[vC] += nx; normData[vC + 1] += ny; normData[vC + 2] += nz;
      }
    }

    // Normalize
    for (let i = 0; i < normData.length; i += 3) {
      const nx = normData[i], ny = normData[i + 1], nz = normData[i + 2];
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (len > 0.000001) {
        normData[i] /= len;
        normData[i + 1] /= len;
        normData[i + 2] /= len;
      }
    }

    normal.setNeedsUpdate();
    return this;
  }

  public dispose(gl?: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.attributes.forEach(attr => attr.dispose(gl));
    if (this.index) this.index.dispose(gl);
    this.dispatchEvent({ type: 'dispose' });
  }
}
