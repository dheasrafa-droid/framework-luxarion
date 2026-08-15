/**
 * @file AmbientLight.ts
 * @description Omnidirectional ambient lighting illuminating all surfaces equally.
 * Part of Luxarion Engine - Single Responsibility: Ambient Lighting Representation.
 */

import { Light } from './Light';
import { Color } from '../math/Color';

export class AmbientLight extends Light {
  constructor(color?: Color | string | number, intensity: number = 0.2) {
    super(color, intensity, 'AmbientLight');
  }
}
