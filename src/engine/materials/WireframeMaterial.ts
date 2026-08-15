/**
 * @file WireframeMaterial.ts
 * @description Vector grid wireframe shader material for techno-industrial architectural render aesthetics.
 * Part of Luxarion Engine - Single Responsibility: Procedural Wireframe Material.
 */

import { Material } from './Material';
import { Color } from '../math/Color';
import { ShaderSource } from '../shaders/ShaderSource';

export class WireframeMaterial extends Material {
  public lineColor: Color = new Color(0.2, 0.8, 1.0, 1.0);

  constructor(options: { color?: Color | string | number; opacity?: number } = {}) {
    super('WireframeMaterial');

    if (options.color) {
      if (options.color instanceof Color) this.lineColor.copy(options.color);
      else this.lineColor.setHex(options.color);
    }

    if (options.opacity !== undefined) this.opacity = options.opacity;

    this.transparent = true;
    this.depthWrite = true;
    this.wireframe = true;

    this.vertexShaderSource = ShaderSource.WIREFRAME_VERTEX;
    this.fragmentShaderSource = ShaderSource.WIREFRAME_FRAGMENT;

    this.updateUniforms(0);
  }

  public updateUniforms(time: number = 0): void {
    this.setUniform('uLineColor', '4f', this.lineColor.toArray());
    this.setUniform('uTime', '1f', time);
  }
}
