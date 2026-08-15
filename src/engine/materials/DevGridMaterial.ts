/**
 * @file DevGridMaterial.ts
 * @description Specialized Level Design Dev-Texture / Grayboxing material supporting high-visibility orange/dark grids, meter ticks, and triplanar UV scaling.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { Material } from './Material';
import { ShaderSource } from '../shaders/ShaderSource';
import { Color } from '../math/Color';
import { CanvasTexture } from '../textures/CanvasTexture';
import { DevTextureGenerator, DevTextureType } from '../textures/DevTextureGenerator';

export type DevGridStyle =
  | 'orange'
  | 'dark'
  | 'floor'
  | 'step'
  | 'hazard'
  | 'ramp'
  | 'pillar'
  | 'neon_yellow'
  | 'neon_lanes'
  | 'neon_arch';

export interface DevGridMaterialConfig {
  style?: DevGridStyle;
  baseColor?: Color | string | number;
  gridScale?: number;
  roughness?: number;
  textureType?: DevTextureType;
  triplanar?: boolean;
}

export class DevGridMaterial extends Material {
  public baseColor: Color = new Color(1.0, 1.0, 1.0, 1.0);
  public gridScale: number = 1.0;
  public roughness: number = 0.4;
  public triplanar: boolean = true;
  public map: CanvasTexture | null = null;

  constructor(config: DevGridMaterialConfig = {}) {
    super('DevGridMaterial');

    this.vertexShaderSource = ShaderSource.DEV_TRIPLANAR_VERTEX;
    this.fragmentShaderSource = ShaderSource.DEV_TRIPLANAR_FRAGMENT;

    if (config.gridScale !== undefined) this.gridScale = config.gridScale;
    if (config.roughness !== undefined) this.roughness = config.roughness;
    if (config.triplanar !== undefined) this.triplanar = config.triplanar;

    if (config.style) {
      this.setStyle(config.style);
    } else if (config.textureType) {
      this.setTextureType(config.textureType);
    } else {
      this.setStyle('orange');
    }

    this.updateUniforms();
  }

  public setStyle(style: DevGridStyle): this {
    let texType: DevTextureType = 'wall_orange_8x';

    switch (style) {
      case 'orange':
        texType = 'wall_orange_8x';
        this.baseColor.setHex('#ffffff');
        break;
      case 'dark':
        texType = 'wall_dark_4x';
        this.baseColor.setHex('#ffffff');
        break;
      case 'floor':
        texType = 'floor_charcoal_08';
        this.baseColor.setHex('#ffffff');
        break;
      case 'step':
        texType = 'floor_orange_step';
        this.baseColor.setHex('#ffffff');
        break;
      case 'hazard':
        texType = 'trim_caution_hazard';
        this.baseColor.setHex('#ffffff');
        break;
      case 'ramp':
        texType = 'accent_cyan_ramp';
        this.baseColor.setHex('#ffffff');
        break;
      case 'pillar':
        texType = 'pillar_cylinder_grid';
        this.baseColor.setHex('#ffffff');
        break;
      case 'neon_yellow':
        texType = 'cyber_neon_yellow';
        this.baseColor.setHex('#ffffff');
        break;
      case 'neon_lanes':
        texType = 'cyber_neon_lanes';
        this.baseColor.setHex('#ffffff');
        break;
      case 'neon_arch':
        texType = 'cyber_neon_arch';
        this.baseColor.setHex('#ffffff');
        break;
    }

    return this.setTextureType(texType);
  }

  public setTextureType(type: DevTextureType): this {
    this.map = DevTextureGenerator.getTexture(type, 512);
    this.updateUniforms();
    return this;
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.baseColor.toArray());
    this.setUniform('specularColor', '3f', [0.25, 0.25, 0.25]);
    this.setUniform('shininess', '1f', (1.0 - this.roughness) * 48.0);
    this.setUniform('opacity', '1f', this.opacity);

    this.setUniform('uUvScale', '2f', [1.0, 1.0]);
    this.setUniform('uUvOffset', '2f', [0, 0]);
    this.setUniform('uTriplanarMode', '1f', this.triplanar ? 1.0 : 0.0);
    this.setUniform('uGridScale', '1f', this.gridScale);

    this.setUniform('uHasMap', '1f', this.map ? 1.0 : 0.0);
    this.setUniform('uMap', 'sampler2D', 0);
    this.setUniform('uHasNormalMap', '1f', 0.0);
    this.setUniform('uHasEmissiveMap', '1f', 0.0);
    this.setUniform('uEmissiveColor', '3f', [0, 0, 0]);
  }
}
