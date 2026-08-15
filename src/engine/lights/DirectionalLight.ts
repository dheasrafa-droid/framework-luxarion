/**
 * @file DirectionalLight.ts
 * @description Directional parallel light rays (e.g. sunlight) with target direction calculation.
 * Part of Luxarion Engine - Single Responsibility: Directional Lighting Representation.
 */

import { Light } from './Light';
import { Vector3 } from '../math/Vector3';
import { Color } from '../math/Color';

export class DirectionalLight extends Light {
  public target: Vector3 = new Vector3(0, 0, 0);
  public direction: Vector3 = new Vector3(0, -1, -0.5).normalize();

  constructor(color?: Color | string | number, intensity: number = 1.0) {
    super(color, intensity, 'DirectionalLight');
  }

  public updateDirection(): Vector3 {
    this.direction.subVectors(this.target, this.position).normalize();
    return this.direction;
  }
}
