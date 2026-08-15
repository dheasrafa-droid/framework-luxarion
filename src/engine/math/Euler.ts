/**
 * @file Euler.ts
 * @description Euler angles (pitch, yaw, roll) representation and ordering.
 * Part of Luxarion Engine - Single Responsibility: Euler Rotational Representation.
 */

export class Euler {
  public x: number;
  public y: number;
  public z: number;
  public order: string;

  constructor(x: number = 0, y: number = 0, z: number = 0, order: string = 'XYZ') {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  public set(x: number, y: number, z: number, order?: string): this {
    this.x = x;
    this.y = y;
    this.z = z;
    if (order) this.order = order;
    return this;
  }

  public clone(): Euler {
    return new Euler(this.x, this.y, this.z, this.order);
  }

  public copy(euler: Euler): this {
    this.x = euler.x;
    this.y = euler.y;
    this.z = euler.z;
    this.order = euler.order;
    return this;
  }
}
