/**
 * @file HemisphereLight.ts
 * @description Dual-tone ambient lighting simulating sky color from above and ground bounce color from below.
 * Part of Luxarion Engine - Lighting Subsystem.
 */

import { Light } from './Light';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';

export class HemisphereLight extends Light {
  public groundColor: Color = new Color(0.2, 0.15, 0.1);
  public skyColor: Color = new Color(0.6, 0.8, 1.0);
  public direction: Vector3 = new Vector3(0, 1, 0);

  constructor(
    skyColor?: Color | string | number,
    groundColor?: Color | string | number,
    intensity: number = 1.0
  ) {
    super(skyColor || '#93c5fd', intensity, 'HemisphereLight');
    if (skyColor) {
      if (skyColor instanceof Color) this.skyColor.copy(skyColor);
      else this.skyColor.setHex(skyColor);
    }
    if (groundColor) {
      if (groundColor instanceof Color) this.groundColor.copy(groundColor);
      else this.groundColor.setHex(groundColor);
    }
  }
}
