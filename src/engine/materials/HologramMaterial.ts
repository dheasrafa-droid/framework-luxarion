/**
 * @file HologramMaterial.ts
 * @description Sci-Fi Hologram material featuring animated scanlines, Fresnel rim luminescence, and chromatic pulse.
 * Part of Luxarion Engine - Single Responsibility: Holographic Sci-Fi Shader Material.
 */

import { Material } from './Material';
import { Color } from '../math/Color';
import { ShaderSource } from '../shaders/ShaderSource';

export interface HologramMaterialOptions {
  color?: Color | string | number;
  fresnelPower?: number;
  scanlineDensity?: number;
  glitchIntensity?: number;
  opacity?: number;
}

export class HologramMaterial extends Material {
  public color: Color = new Color(0.1, 0.9, 1.0, 1.0);
  public fresnelPower: number = 2.5;
  public scanlineDensity: number = 40.0;
  public glitchIntensity: number = 0.5;

  constructor(options: HologramMaterialOptions = {}) {
    super('HologramMaterial');

    if (options.color) {
      if (options.color instanceof Color) this.color.copy(options.color);
      else this.color.setHex(options.color);
    }

    if (options.fresnelPower !== undefined) this.fresnelPower = options.fresnelPower;
    if (options.scanlineDensity !== undefined) this.scanlineDensity = options.scanlineDensity;
    if (options.glitchIntensity !== undefined) this.glitchIntensity = options.glitchIntensity;
    if (options.opacity !== undefined) this.opacity = options.opacity;

    this.transparent = true;
    this.depthWrite = false;
    this.blendMode = 'additive';
    this.side = 'double';

    this.vertexShaderSource = ShaderSource.HOLOGRAM_VERTEX;
    this.fragmentShaderSource = ShaderSource.HOLOGRAM_FRAGMENT;

    this.updateUniforms(0);
  }

  public updateUniforms(time: number = 0): void {
    this.setUniform('uColor', '3f', this.color.toRGBArray());
    this.setUniform('uFresnelPower', '1f', this.fresnelPower);
    this.setUniform('uScanlineDensity', '1f', this.scanlineDensity);
    this.setUniform('uGlitchIntensity', '1f', this.glitchIntensity);
    this.setUniform('uTime', '1f', time);
    this.setUniform('opacity', '1f', this.opacity);
  }
}
