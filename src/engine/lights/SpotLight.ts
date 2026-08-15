/**
 * @file SpotLight.ts
 * @description Conical spot light with position, target direction, cone angle (cutoff), and penumbra falloff.
 * Part of Luxarion Engine - Advanced Lighting Subsystem.
 */

import { Light } from './Light';
import { Vector3 } from '../math/Vector3';
import { Color } from '../math/Color';

export class SpotLight extends Light {
  public target: Vector3 = new Vector3(0, 0, 0);
  public direction: Vector3 = new Vector3(0, -1, 0);
  public angle: number = Math.PI / 4; // Cone angle in radians (cutoff)
  public penumbra: number = 0.2; // Soft edge exponent/factor (0 to 1)
  public distance: number = 20.0; // Max reach distance
  public decay: number = 2.0;

  constructor(
    color?: Color | string | number,
    intensity: number = 1.0,
    distance: number = 20.0,
    angle: number = Math.PI / 4,
    penumbra: number = 0.2
  ) {
    super(color, intensity, 'SpotLight');
    this.distance = distance;
    this.angle = angle;
    this.penumbra = penumbra;
  }

  public updateDirection(): Vector3 {
    this.direction.subVectors(this.target, this.position).normalize();
    return this.direction;
  }
}
