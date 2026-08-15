/**
 * @file PhysicalMaterial.ts
 * @description Advanced Physical Material supporting diffuse, roughness, metalness, normal mapping, and multi-light interaction.
 * Part of Luxarion Engine - Advanced Material & Lighting Pipeline.
 */

import { Material } from './Material';
import { ShaderSource } from '../shaders/ShaderSource';
import { Color } from '../math/Color';
import { Vector2 } from '../math/Vector2';
import { Texture } from '../textures/Texture';

export interface PhysicalMaterialConfig {
  color?: Color | string | number;
  specular?: Color | string | number;
  roughness?: number;
  metalness?: number;
  map?: Texture | null;
  normalMap?: Texture | null;
  emissiveMap?: Texture | null;
  emissive?: Color | string | number;
  emissiveIntensity?: number;
  normalScale?: number;
  uvScale?: Vector2 | [number, number];
  uvOffset?: Vector2 | [number, number];
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
}

export class PhysicalMaterial extends Material {
  public color: Color = new Color(1, 1, 1, 1);
  public specular: Color = new Color(0.8, 0.8, 0.8, 1);
  public roughness: number = 0.4;
  public metalness: number = 0.1;
  public map: Texture | null = null;
  public normalMap: Texture | null = null;
  public emissiveMap: Texture | null = null;
  public emissive: Color = new Color(0, 0, 0, 1);
  public emissiveIntensity: number = 1.0;
  public normalScale: number = 1.0;
  public uvScale: Vector2 = new Vector2(1, 1);
  public uvOffset: Vector2 = new Vector2(0, 0);

  constructor(config: PhysicalMaterialConfig = {}) {
    super('PhysicalMaterial');

    this.vertexShaderSource = ShaderSource.TEXTURED_PHONG_VERTEX;
    this.fragmentShaderSource = ShaderSource.TEXTURED_PHONG_FRAGMENT;

    if (config.color) {
      if (config.color instanceof Color) this.color.copy(config.color);
      else this.color.setHex(config.color);
    }
    if (config.specular) {
      if (config.specular instanceof Color) this.specular.copy(config.specular);
      else this.specular.setHex(config.specular);
    }
    if (config.roughness !== undefined) this.roughness = config.roughness;
    if (config.metalness !== undefined) this.metalness = config.metalness;
    if (config.map !== undefined) this.map = config.map;
    if (config.normalMap !== undefined) this.normalMap = config.normalMap;
    if (config.emissiveMap !== undefined) this.emissiveMap = config.emissiveMap;
    if (config.emissive) {
      if (config.emissive instanceof Color) this.emissive.copy(config.emissive);
      else this.emissive.setHex(config.emissive);
    }
    if (config.emissiveIntensity !== undefined) this.emissiveIntensity = config.emissiveIntensity;
    if (config.normalScale !== undefined) this.normalScale = config.normalScale;
    if (config.uvScale) {
      if (config.uvScale instanceof Vector2) this.uvScale.copy(config.uvScale);
      else this.uvScale.set(config.uvScale[0], config.uvScale[1]);
    }
    if (config.uvOffset) {
      if (config.uvOffset instanceof Vector2) this.uvOffset.copy(config.uvOffset);
      else this.uvOffset.set(config.uvOffset[0], config.uvOffset[1]);
    }
    if (config.opacity !== undefined) this.opacity = config.opacity;
    if (config.transparent !== undefined) this.transparent = config.transparent;
    if (config.wireframe !== undefined) this.wireframe = config.wireframe;

    this.updateUniforms();
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.color.toArray());
    this.setUniform('specularColor', '3f', this.specular.toRGBArray());
    const shininess = Math.max(2.0, (1.0 - this.roughness) * 128.0);
    this.setUniform('shininess', '1f', shininess);
    this.setUniform('opacity', '1f', this.opacity);

    this.setUniform('uUvScale', '2f', [this.uvScale.x, this.uvScale.y]);
    this.setUniform('uUvOffset', '2f', [this.uvOffset.x, this.uvOffset.y]);

    this.setUniform('uHasMap', '1f', this.map ? 1.0 : 0.0);
    this.setUniform('uMap', 'sampler2D', 0);

    this.setUniform('uHasNormalMap', '1f', this.normalMap ? 1.0 : 0.0);
    this.setUniform('uNormalMap', 'sampler2D', 1);
    this.setUniform('uNormalScale', '1f', this.normalScale);

    this.setUniform('uHasEmissiveMap', '1f', this.emissiveMap ? 1.0 : 0.0);
    this.setUniform('uEmissiveMap', 'sampler2D', 2);
    const em = this.emissive.toRGBArray();
    this.setUniform('uEmissiveColor', '3f', [
      em[0] * this.emissiveIntensity,
      em[1] * this.emissiveIntensity,
      em[2] * this.emissiveIntensity
    ]);
  }
}
