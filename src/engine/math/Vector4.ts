/**
 * @file Vector4.ts
 * @description 4D Homogeneous Coordinate Vector representation.
 * Part of Luxarion Engine - Single Responsibility: 4D Vector Math.
 */

export class Vector4 {
  public x: number;
  public y: number;
  public z: number;
  public w: number;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  public set(x: number, y: number, z: number, w: number = 1): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  public clone(): Vector4 {
    return new Vector4(this.x, this.y, this.z, this.w);
  }

  public copy(v: Vector4): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
    return this;
  }

  public toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }
}
