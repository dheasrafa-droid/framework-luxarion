/**
 * @file TextureMaterial.ts
 * @description PBR/Blinn-Phong Textured Material with Diffuse Map, Normal Map, Emissive Channel, and UV Transform parameters.
 * Part of Luxarion Engine - Texture & Material Subsystem.
 */

import { Material } from './Material';
import { Texture } from '../textures/Texture';
import { Color } from '../math/Color';
import { Vector2 } from '../math/Vector2';
import { ShaderSource } from '../shaders/ShaderSource';

export interface TextureMaterialOptions {
  map?: Texture | null;
  normalMap?: Texture | null;
  emissiveMap?: Texture | null;
  color?: Color | string | number;
  specular?: Color | string | number;
  emissive?: Color | string | number;
  shininess?: number;
  normalScale?: number;
  uvScale?: Vector2 | [number, number];
  uvOffset?: Vector2 | [number, number];
  opacity?: number;
  transparent?: boolean;
  wireframe?: boolean;
  side?: 'front' | 'back' | 'double';
  lit?: boolean;
}

export class TextureMaterial extends Material {
  public map: Texture | null = null;
  public normalMap: Texture | null = null;
  public emissiveMap: Texture | null = null;

  public color: Color = new Color(1, 1, 1, 1);
  public specular: Color = new Color(0.3, 0.3, 0.3, 1);
  public emissive: Color = new Color(0, 0, 0, 1);
  public shininess: number = 32;
  public normalScale: number = 1.0;

  public uvScale: Vector2 = new Vector2(1, 1);
  public uvOffset: Vector2 = new Vector2(0, 0);
  public lit: boolean = true;

  constructor(options: TextureMaterialOptions = {}) {
    super('TextureMaterial');

    if (options.map !== undefined) this.map = options.map;
    if (options.normalMap !== undefined) this.normalMap = options.normalMap;
    if (options.emissiveMap !== undefined) this.emissiveMap = options.emissiveMap;

    if (options.color) {
      if (options.color instanceof Color) this.color.copy(options.color);
      else this.color.setHex(options.color);
    }
    if (options.specular) {
      if (options.specular instanceof Color) this.specular.copy(options.specular);
      else this.specular.setHex(options.specular);
    }
    if (options.emissive) {
      if (options.emissive instanceof Color) this.emissive.copy(options.emissive);
      else this.emissive.setHex(options.emissive);
    }
    if (options.shininess !== undefined) this.shininess = options.shininess;
    if (options.normalScale !== undefined) this.normalScale = options.normalScale;

    if (options.uvScale) {
      if (options.uvScale instanceof Vector2) this.uvScale.copy(options.uvScale);
      else this.uvScale.set(options.uvScale[0], options.uvScale[1]);
    }
    if (options.uvOffset) {
      if (options.uvOffset instanceof Vector2) this.uvOffset.copy(options.uvOffset);
      else this.uvOffset.set(options.uvOffset[0], options.uvOffset[1]);
    }
    if (options.opacity !== undefined) this.opacity = options.opacity;
    if (options.transparent !== undefined) this.transparent = options.transparent;
    if (options.wireframe !== undefined) this.wireframe = options.wireframe;
    if (options.side !== undefined) this.side = options.side;
    if (options.lit !== undefined) this.lit = options.lit;

    this.updateShaders();
    this.updateUniforms();
  }

  public updateShaders(): void {
    if (this.lit) {
      this.vertexShaderSource = ShaderSource.TEXTURED_PHONG_VERTEX;
      this.fragmentShaderSource = ShaderSource.TEXTURED_PHONG_FRAGMENT;
    } else {
      this.vertexShaderSource = ShaderSource.TEXTURED_BASIC_VERTEX;
      this.fragmentShaderSource = ShaderSource.TEXTURED_BASIC_FRAGMENT;
    }
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.color.toArray());
    this.setUniform('specularColor', '3f', this.specular.toRGBArray());
    this.setUniform('shininess', '1f', this.shininess);
    this.setUniform('opacity', '1f', this.opacity);

    this.setUniform('uUvScale', '2f', [this.uvScale.x, this.uvScale.y]);
    this.setUniform('uUvOffset', '2f', [this.uvOffset.x, this.uvOffset.y]);

    // Map texture unit 0
    this.setUniform('uHasMap', '1f', this.map ? 1.0 : 0.0);
    this.setUniform('uMap', 'sampler2D', 0);

    // Normal map unit 1
    this.setUniform('uHasNormalMap', '1f', this.normalMap ? 1.0 : 0.0);
    this.setUniform('uNormalMap', 'sampler2D', 1);
    this.setUniform('uNormalScale', '1f', this.normalScale);

    // Emissive map unit 2
    this.setUniform('uHasEmissiveMap', '1f', this.emissiveMap ? 1.0 : 0.0);
    this.setUniform('uEmissiveMap', 'sampler2D', 2);
    this.setUniform('uEmissiveColor', '3f', this.emissive.toRGBArray());
  }
}
