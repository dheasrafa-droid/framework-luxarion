/**
 * @file Light.ts
 * @description Base Light class extending Node with color, intensity, and light type attributes.
 * Part of Luxarion Engine - Single Responsibility: Light Entity Base.
 */

import { Node } from '../core/Node';
import { Color } from '../math/Color';

export class Light extends Node {
  public color: Color = new Color(1, 1, 1, 1);
  public intensity: number = 1.0;
  public isLight: boolean = true;

  constructor(color?: Color | string | number, intensity: number = 1.0, name: string = 'Light') {
    super(name);
    if (color) {
      if (color instanceof Color) this.color.copy(color);
      else this.color.setHex(color);
    }
    this.intensity = intensity;
  }
}
