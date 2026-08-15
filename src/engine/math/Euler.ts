/**
 * @file Euler.ts
 * @description Euler angles (pitch, yaw, roll) representation and ordering.
 * Part of Luxarion Engine - Single Responsibility: Euler Rotational Representation.
 */

import { Quaternion } from './Quaternion';

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

  public setFromQuaternion(q: Quaternion, order: string = 'XYZ'): this {
    const x = q.x, y = q.y, z = q.z, w = q.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    const m11 = 1 - (yy + zz);
    const m12 = xy - wz;
    const m13 = xz + wy;
    const m21 = xy + wz;
    const m22 = 1 - (xx + zz);
    const m23 = yz - wx;
    const m31 = xz - wy;
    const m32 = yz + wx;
    const m33 = 1 - (xx + yy);

    this.order = order;

    if (order === 'XYZ') {
      this.y = Math.asin(Math.max(-1, Math.min(1, m13)));
      if (Math.abs(m13) < 0.9999999) {
        this.x = Math.atan2(-m23, m33);
        this.z = Math.atan2(-m12, m11);
      } else {
        this.x = Math.atan2(m32, m22);
        this.z = 0;
      }
    } else {
      // Default to standard XYZ
      this.y = Math.asin(Math.max(-1, Math.min(1, m13)));
      this.x = Math.atan2(-m23, m33);
      this.z = Math.atan2(-m12, m11);
    }

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
