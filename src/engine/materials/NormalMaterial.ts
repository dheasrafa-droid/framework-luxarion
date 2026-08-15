/**
 * @file NormalMaterial.ts
 * @description Material rendering surface normal vectors as RGB colors for diagnostic & stylized rendering.
 * Part of Luxarion Engine - Material System.
 */

import { Material } from './Material';
import { ShaderSource } from '../shaders/ShaderSource';

export class NormalMaterial extends Material {
  constructor(opacity: number = 1.0) {
    super('NormalMaterial');
    this.opacity = opacity;
    this.transparent = opacity < 1.0;
    this.vertexShaderSource = ShaderSource.NORMAL_VERTEX;
    this.fragmentShaderSource = ShaderSource.NORMAL_FRAGMENT;
    this.setUniform('opacity', '1f', this.opacity);
  }
}
