/**
 * @file QuantumMaterial.ts
 * @description Sci-fi Quantum wavefunction interference shader material with dynamic energy colors & phase oscillations.
 * Part of Luxarion Engine - Advanced Shader Materials.
 */

import { Material } from './Material';
import { Color } from '../math/Color';
import { ShaderSource } from '../shaders/ShaderSource';

export interface QuantumMaterialOptions {
  colorA?: Color | string | number;
  colorB?: Color | string | number;
  phase?: number;
  opacity?: number;
}

export class QuantumMaterial extends Material {
  public colorA: Color = new Color(0.05, 0.7, 1.0, 1.0);
  public colorB: Color = new Color(0.9, 0.1, 0.6, 1.0);
  public phase: number = 0.0;

  constructor(options: QuantumMaterialOptions = {}) {
    super('QuantumMaterial');

    if (options.colorA) {
      if (options.colorA instanceof Color) this.colorA.copy(options.colorA);
      else this.colorA.setHex(options.colorA);
    }
    if (options.colorB) {
      if (options.colorB instanceof Color) this.colorB.copy(options.colorB);
      else this.colorB.setHex(options.colorB);
    }
    if (options.phase !== undefined) this.phase = options.phase;
    if (options.opacity !== undefined) this.opacity = options.opacity;

    this.transparent = true;
    this.side = 'double';
    this.blendMode = 'additive';

    this.vertexShaderSource = ShaderSource.QUANTUM_VERTEX;
    this.fragmentShaderSource = ShaderSource.QUANTUM_FRAGMENT;

    this.updateUniforms(0);
  }

  public updateUniforms(time: number = 0): void {
    this.setUniform('uColorA', '3f', this.colorA.toRGBArray());
    this.setUniform('uColorB', '3f', this.colorB.toRGBArray());
    this.setUniform('uPhase', '1f', this.phase);
    this.setUniform('uTime', '1f', time);
    this.setUniform('opacity', '1f', this.opacity);
  }
}
