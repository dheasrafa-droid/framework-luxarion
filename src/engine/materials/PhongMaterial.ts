/**
 * @file PhongMaterial.ts
 * @description Blinn-Phong lighting material with ambient, diffuse, specular, and shininess coefficients.
 * Part of Luxarion Engine - Single Responsibility: Lit Specular Material.
 */

import { Material } from './Material';
import { Color } from '../math/Color';
import { ShaderSource } from '../shaders/ShaderSource';

export interface PhongMaterialOptions {
  color?: Color | string | number;
  specular?: Color | string | number;
  shininess?: number;
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
}

export class PhongMaterial extends Material {
  public color: Color = new Color(0.8, 0.8, 0.8, 1);
  public specular: Color = new Color(1, 1, 1, 1);
  public shininess: number = 32.0;

  constructor(options: PhongMaterialOptions = {}) {
    super('PhongMaterial');

    if (options.color) {
      if (options.color instanceof Color) this.color.copy(options.color);
      else this.color.setHex(options.color);
    }

    if (options.specular) {
      if (options.specular instanceof Color) this.specular.copy(options.specular);
      else this.specular.setHex(options.specular);
    }

    if (options.shininess !== undefined) this.shininess = options.shininess;
    if (options.opacity !== undefined) this.opacity = options.opacity;
    if (options.transparent !== undefined) this.transparent = options.transparent;
    if (options.wireframe !== undefined) this.wireframe = options.wireframe;

    this.vertexShaderSource = ShaderSource.PHONG_VERTEX;
    this.fragmentShaderSource = ShaderSource.PHONG_FRAGMENT;

    this.updateUniforms();
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.color.toArray());
    this.setUniform('specularColor', '3f', this.specular.toRGBArray());
    this.setUniform('shininess', '1f', this.shininess);
    this.setUniform('opacity', '1f', this.opacity);
  }
}
