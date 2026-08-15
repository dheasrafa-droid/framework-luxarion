/**
 * @file ShaderProgram.ts
 * @description Compiles GLSL shaders, links WebGL program, caches active attribute/uniform locations, and reports diagnostics.
 * Part of Luxarion Engine - Single Responsibility: WebGL Program Compilation & Resource Binding.
 */

import { UniformMap } from '../materials/Material';
import { UniformManager } from './UniformManager';

export class ShaderProgram {
  public gl: WebGLRenderingContext | WebGL2RenderingContext;
  public program: WebGLProgram | null = null;
  public vertexShader: WebGLShader | null = null;
  public fragmentShader: WebGLShader | null = null;
  public uniforms: Map<string, WebGLUniformLocation> = new Map();
  public attributes: Map<string, number> = new Map();
  public isCompiled: boolean = false;
  public errorLog: string | null = null;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexSrc: string,
    fragmentSrc: string
  ) {
    this.gl = gl;
    this.compile(vertexSrc, fragmentSrc);
  }

  public compile(vertexSrc: string, fragmentSrc: string): boolean {
    const gl = this.gl;
    this.dispose();

    // Compile Vertex Shader
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vShader) {
      this.errorLog = 'Failed to create vertex shader instance.';
      return false;
    }
    gl.shaderSource(vShader, vertexSrc);
    gl.compileShader(vShader);
    if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
      this.errorLog = `Vertex Shader Compilation Error: ${gl.getShaderInfoLog(vShader)}`;
      gl.deleteShader(vShader);
      return false;
    }

    // Compile Fragment Shader
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fShader) {
      this.errorLog = 'Failed to create fragment shader instance.';
      gl.deleteShader(vShader);
      return false;
    }
    gl.shaderSource(fShader, fragmentSrc);
    gl.compileShader(fShader);
    if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
      this.errorLog = `Fragment Shader Compilation Error: ${gl.getShaderInfoLog(fShader)}`;
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      return false;
    }

    // Link Program
    const prog = gl.createProgram();
    if (!prog) {
      this.errorLog = 'Failed to create shader program object.';
      return false;
    }

    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      this.errorLog = `Shader Program Link Error: ${gl.getProgramInfoLog(prog)}`;
      gl.deleteProgram(prog);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      return false;
    }

    this.program = prog;
    this.vertexShader = vShader;
    this.fragmentShader = fShader;
    this.isCompiled = true;
    this.errorLog = null;

    // Cache Uniforms & Attributes
    this._cacheLocations();

    return true;
  }

  private _cacheLocations(): void {
    const gl = this.gl;
    if (!this.program) return;

    this.uniforms.clear();
    this.attributes.clear();

    const activeUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < activeUniforms; i++) {
      const info = gl.getActiveUniform(this.program, i);
      if (info) {
        const loc = gl.getUniformLocation(this.program, info.name);
        if (loc) {
          this.uniforms.set(info.name, loc);
        }
      }
    }

    const activeAttributes = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < activeAttributes; i++) {
      const info = gl.getActiveAttrib(this.program, i);
      if (info) {
        const loc = gl.getAttribLocation(this.program, info.name);
        if (loc !== -1) {
          this.attributes.set(info.name, loc);
        }
      }
    }
  }

  public setUniforms(uniformMap: UniformMap): void {
    const gl = this.gl;
    for (const [name, uniform] of Object.entries(uniformMap)) {
      const loc = this.uniforms.get(name);
      if (loc) {
        UniformManager.upload(gl, loc, uniform);
      }
    }
  }

  public dispose(): void {
    const gl = this.gl;
    if (this.program) {
      if (this.vertexShader) gl.deleteShader(this.vertexShader);
      if (this.fragmentShader) gl.deleteShader(this.fragmentShader);
      gl.deleteProgram(this.program);
      this.program = null;
      this.vertexShader = null;
      this.fragmentShader = null;
      this.isCompiled = false;
    }
  }
}
