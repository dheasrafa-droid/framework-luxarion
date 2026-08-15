/**
 * @file BasicMaterial.ts
 * @description Unlit flat color material unaffected by scene lighting calculations.
 * Part of Luxarion Engine - Single Responsibility: Basic Unlit Material.
 */

import { Material } from './Material';
import { Color } from '../math/Color';
import { ShaderSource } from '../shaders/ShaderSource';

export class BasicMaterial extends Material {
  public color: Color = new Color(1, 1, 1, 1);
  public useVertexColor: boolean = false;

  constructor(parameters: { color?: Color | string | number; opacity?: number; transparent?: boolean; wireframe?: boolean } = {}) {
    super('BasicMaterial');

    if (parameters.color) {
      if (parameters.color instanceof Color) {
        this.color.copy(parameters.color);
      } else {
        this.color.setHex(parameters.color);
      }
    }

    if (parameters.opacity !== undefined) this.opacity = parameters.opacity;
    if (parameters.transparent !== undefined) this.transparent = parameters.transparent;
    if (parameters.wireframe !== undefined) this.wireframe = parameters.wireframe;

    this.vertexShaderSource = ShaderSource.BASIC_VERTEX;
    this.fragmentShaderSource = ShaderSource.BASIC_FRAGMENT;

    this.updateUniforms();
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.color.toArray());
    this.setUniform('opacity', '1f', this.opacity);
    this.setUniform('useVertexColor', '1f', this.useVertexColor ? 1.0 : 0.0);
  }
}
