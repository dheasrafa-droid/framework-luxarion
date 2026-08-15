/**
 * @file GLState.ts
 * @description WebGL state cache manager to avoid redundant GPU state changes (depth, blend, culling).
 * Part of Luxarion Engine - Single Responsibility: Low-Level WebGL State Caching.
 */

export class GLState {
  private _gl: WebGLRenderingContext | WebGL2RenderingContext;
  private _depthTest: boolean = false;
  private _depthWrite: boolean = true;
  private _cullFace: boolean = false;
  private _blend: boolean = false;
  private _blendMode: string = 'normal';
  private _currentProgram: WebGLProgram | null = null;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    this._gl = gl;
  }

  public setDepthTest(enabled: boolean): void {
    if (this._depthTest !== enabled) {
      if (enabled) {
        this._gl.enable(this._gl.DEPTH_TEST);
      } else {
        this._gl.disable(this._gl.DEPTH_TEST);
      }
      this._depthTest = enabled;
    }
  }

  public setDepthWrite(enabled: boolean): void {
    if (this._depthWrite !== enabled) {
      this._gl.depthMask(enabled);
      this._depthWrite = enabled;
    }
  }

  public setCullFace(enabled: boolean): void {
    if (this._cullFace !== enabled) {
      if (enabled) {
        this._gl.enable(this._gl.CULL_FACE);
      } else {
        this._gl.disable(this._gl.CULL_FACE);
      }
      this._cullFace = enabled;
    }
  }

  public setBlend(enabled: boolean, mode: 'normal' | 'additive' | 'multiply' = 'normal'): void {
    if (this._blend !== enabled) {
      if (enabled) {
        this._gl.enable(this._gl.BLEND);
      } else {
        this._gl.disable(this._gl.BLEND);
      }
      this._blend = enabled;
    }

    if (enabled && this._blendMode !== mode) {
      const gl = this._gl;
      if (mode === 'additive') {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      } else if (mode === 'multiply') {
        gl.blendFunc(gl.DST_COLOR, gl.ZERO);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      }
      this._blendMode = mode;
    }
  }

  public useProgram(program: WebGLProgram): void {
    if (this._currentProgram !== program) {
      this._gl.useProgram(program);
      this._currentProgram = program;
    }
  }

  public reset(): void {
    this._depthTest = false;
    this._depthWrite = true;
    this._cullFace = false;
    this._blend = false;
    this._blendMode = '';
    this._currentProgram = null;
  }
}
