/**
 * @file Material.ts
 * @description Base Material abstract class managing WebGL render states, blend modes, depth testing, and uniform dictionaries.
 * Part of Luxarion Engine - Single Responsibility: WebGL Material Abstraction & State.
 */

import { EventDispatcher } from '../core/EventDispatcher';
import { MathUtils } from '../math/MathUtils';

export interface UniformMap {
  [key: string]: {
    type: '1f' | '2f' | '3f' | '4f' | '1i' | 'mat3' | 'mat4' | 'sampler2D';
    value: any;
  };
}

export class Material extends EventDispatcher {
  public readonly id: string;
  public name: string = 'Material';
  public transparent: boolean = false;
  public opacity: number = 1.0;
  public depthTest: boolean = true;
  public depthWrite: boolean = true;
  public wireframe: boolean = false;
  public side: 'front' | 'back' | 'double' = 'front';
  public blendMode: 'normal' | 'additive' | 'multiply' = 'normal';
  public uniforms: UniformMap = {};
  public vertexShaderSource: string = '';
  public fragmentShaderSource: string = '';
  public needsUpdate: boolean = true;

  constructor(name: string = 'Material') {
    super();
    this.id = MathUtils.generateUUID();
    this.name = name;
  }

  public setUniform(name: string, type: UniformMap[string]['type'], value: any): this {
    this.uniforms[name] = { type, value };
    return this;
  }

  public getUniform(name: string): any {
    return this.uniforms[name]?.value;
  }

  public clone(): Material {
    const mat = new Material(this.name);
    mat.transparent = this.transparent;
    mat.opacity = this.opacity;
    mat.depthTest = this.depthTest;
    mat.depthWrite = this.depthWrite;
    mat.wireframe = this.wireframe;
    mat.side = this.side;
    mat.blendMode = this.blendMode;
    mat.uniforms = JSON.parse(JSON.stringify(this.uniforms));
    mat.vertexShaderSource = this.vertexShaderSource;
    mat.fragmentShaderSource = this.fragmentShaderSource;
    return mat;
  }

  public dispose(gl?: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.dispatchEvent({ type: 'dispose' });
  }
}
