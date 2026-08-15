/**
 * @file BufferAttribute.ts
 * @description Encapsulates WebGL vertex attribute array data, component size, stride, and normalization.
 * Part of Luxarion Engine - Single Responsibility: GPU Vertex Buffer Attribute Binding.
 */

export class BufferAttribute {
  public data: Float32Array | Uint16Array | Uint32Array | Int16Array | Uint8Array;
  public itemSize: number;
  public normalized: boolean;
  public usage: number; // e.g. gl.STATIC_DRAW or gl.DYNAMIC_DRAW
  public version: number = 0;
  public buffer: WebGLBuffer | null = null;

  constructor(
    data: Float32Array | Uint16Array | Uint32Array | Int16Array | Uint8Array,
    itemSize: number,
    normalized: boolean = false,
    usage: number = 0x88e4 // STATIC_DRAW
  ) {
    this.data = data;
    this.itemSize = itemSize;
    this.normalized = normalized;
    this.usage = usage;
  }

  public get count(): number {
    return this.data.length / this.itemSize;
  }

  public setNeedsUpdate(): void {
    this.version++;
  }

  public getX(index: number): number {
    return this.data[index * this.itemSize];
  }

  public setX(index: number, x: number): this {
    this.data[index * this.itemSize] = x;
    return this;
  }

  public getY(index: number): number {
    return this.data[index * this.itemSize + 1];
  }

  public setY(index: number, y: number): this {
    this.data[index * this.itemSize + 1] = y;
    return this;
  }

  public getZ(index: number): number {
    return this.data[index * this.itemSize + 2];
  }

  public setZ(index: number, z: number): this {
    this.data[index * this.itemSize + 2] = z;
    return this;
  }

  public dispose(gl?: WebGLRenderingContext | WebGL2RenderingContext): void {
    if (this.buffer && gl) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
  }
}
