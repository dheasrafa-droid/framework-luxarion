/**
 * @file DevGridMaterial.ts
 * @description Specialized Level Design Dev-Texture / Grayboxing material supporting high-visibility orange/dark grids, meter ticks, and triplanar UV scaling.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { Material } from './Material';
import { ShaderSource } from '../shaders/ShaderSource';
import { Color } from '../math/Color';
import { CanvasTexture } from '../textures/CanvasTexture';

export type DevGridStyle = 'orange' | 'dark' | 'neon' | 'checker' | 'measure';

export interface DevGridMaterialConfig {
  style?: DevGridStyle;
  baseColor?: Color | string | number;
  gridColor?: Color | string | number;
  gridScale?: number;
  lineWidth?: number;
  roughness?: number;
  metalness?: number;
  emissiveGlow?: boolean;
}

export class DevGridMaterial extends Material {
  public baseColor: Color = new Color(0.95, 0.45, 0.05, 1.0); // Dev Orange default (#f97316)
  public gridColor: Color = new Color(1.0, 1.0, 1.0, 1.0); // White gridlines
  public gridScale: number = 1.0;
  public lineWidth: number = 0.04;
  public roughness: number = 0.5;

  private _devTexture: CanvasTexture | null = null;

  constructor(config: DevGridMaterialConfig = {}) {
    super('DevGridMaterial');

    this.vertexShaderSource = ShaderSource.TEXTURED_PHONG_VERTEX;
    this.fragmentShaderSource = ShaderSource.TEXTURED_PHONG_FRAGMENT;

    if (config.style) {
      this.setStyle(config.style);
    } else {
      if (config.baseColor) {
        if (config.baseColor instanceof Color) this.baseColor.copy(config.baseColor);
        else this.baseColor.setHex(config.baseColor);
      }
      if (config.gridColor) {
        if (config.gridColor instanceof Color) this.gridColor.copy(config.gridColor);
        else this.gridColor.setHex(config.gridColor);
      }
    }

    if (config.gridScale !== undefined) this.gridScale = config.gridScale;
    if (config.lineWidth !== undefined) this.lineWidth = config.lineWidth;
    if (config.roughness !== undefined) this.roughness = config.roughness;

    this._generateProceduralTexture(config.style || 'orange');
    this.updateUniforms();
  }

  public setStyle(style: DevGridStyle): this {
    switch (style) {
      case 'orange':
        this.baseColor.setHex('#ea580c'); // Dev-texture vibrant orange
        this.gridColor.setHex('#ffffff');
        break;
      case 'dark':
        this.baseColor.setHex('#1e293b'); // Dark graybox slate
        this.gridColor.setHex('#64748b');
        break;
      case 'neon':
        this.baseColor.setHex('#090d16'); // Dark void with cyan/yellow glowing contour
        this.gridColor.setHex('#38bdf8');
        break;
      case 'measure':
        this.baseColor.setHex('#f59e0b');
        this.gridColor.setHex('#ffffff');
        break;
      case 'checker':
        this.baseColor.setHex('#334155');
        this.gridColor.setHex('#e2e8f0');
        break;
    }
    this._generateProceduralTexture(style);
    this.updateUniforms();
    return this;
  }

  private _generateProceduralTexture(style: DevGridStyle): void {
    if (typeof document === 'undefined') return;

    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = this.baseColor.toCSSString();
    ctx.fillRect(0, 0, size, size);

    // Inner subtle tile grid
    ctx.strokeStyle = style === 'neon' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    const divisions = 4;
    const step = size / divisions;

    for (let i = 1; i < divisions; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // Outer bold border
    ctx.strokeStyle = this.gridColor.toCSSString();
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // Corner alignment crosshairs & meter text
    ctx.fillStyle = this.gridColor.toCSSString();
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (style === 'orange' || style === 'measure') {
      ctx.fillText('1.0m', size / 2, size / 2);
      ctx.font = '14px monospace';
      ctx.fillText('+ WALL +', size / 2, size / 2 + 30);
    } else if (style === 'neon') {
      ctx.fillText('⚡ GRID', size / 2, size / 2);
    }

    this._devTexture = new CanvasTexture(canvas);
    this._devTexture.wrapS = 'repeat';
    this._devTexture.wrapT = 'repeat';
  }

  public updateUniforms(): void {
    this.setUniform('diffuseColor', '4f', this.baseColor.toArray());
    this.setUniform('specularColor', '3f', [0.3, 0.3, 0.3]);
    this.setUniform('shininess', '1f', (1.0 - this.roughness) * 64.0);
    this.setUniform('opacity', '1f', 1.0);

    this.setUniform('uUvScale', '2f', [this.gridScale, this.gridScale]);
    this.setUniform('uUvOffset', '2f', [0, 0]);

    this.setUniform('uHasMap', '1f', this._devTexture ? 1.0 : 0.0);
    this.setUniform('uMap', 'sampler2D', 0);
    this.setUniform('uHasNormalMap', '1f', 0.0);
    this.setUniform('uHasEmissiveMap', '1f', 0.0);
  }

  public getTexture(): CanvasTexture | null {
    return this._devTexture;
  }
}
