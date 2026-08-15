/**
 * @file PointLight.ts
 * @description Point light source emitting light in all directions with distance-based attenuation.
 * Part of Luxarion Engine - Single Responsibility: Point Light Source Representation.
 */

import { Light } from './Light';
import { Color } from '../math/Color';

export class PointLight extends Light {
  public distance: number = 10.0;
  public decay: number = 2.0;

  constructor(color?: Color | string | number, intensity: number = 1.0, distance: number = 10.0) {
    super(color, intensity, 'PointLight');
    this.distance = distance;
  }
}
