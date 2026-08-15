/**
 * @file WebGLRenderer.ts
 * @description Master WebGL 3D Engine Orchestrator. Coordinates pipeline execution, shader programs, buffer bindings, lighting injection, and draw calls.
 * Part of Luxarion Engine - Single Responsibility: Core WebGL Rendering Orchestration.
 */

import { Scene } from '../scene/Scene';
import { Camera } from '../cameras/Camera';
import { Object3D } from '../core/Object3D';
import { ShaderProgram } from '../shaders/ShaderProgram';
import { GLState } from '../shaders/GLState';
import { Matrix3 } from '../math/Matrix3';
import { Color } from '../math/Color';
import { DirectionalLight } from '../lights/DirectionalLight';
import { PointLight } from '../lights/PointLight';
import { AmbientLight } from '../lights/AmbientLight';

export interface RenderStats {
  drawCalls: number;
  triangles: number;
  vertices: number;
  fps: number;
}

export class WebGLRenderer {
  public canvas: HTMLCanvasElement;
  public gl: WebGLRenderingContext | WebGL2RenderingContext;
  public state: GLState;

  public width: number = 800;
  public height: number = 600;
  public pixelRatio: number = 1;

  public clearColor: Color = new Color(0.03, 0.04, 0.08, 1);
  public autoClear: boolean = true;

  public stats: RenderStats = {
    drawCalls: 0,
    triangles: 0,
    vertices: 0,
    fps: 60
  };

  private _programCache: Map<string, ShaderProgram> = new Map();
  private _normalMatrix: Matrix3 = new Matrix3();

  constructor(canvas: HTMLCanvasElement, options: WebGLContextAttributes = { antialias: true, alpha: true, depth: true }) {
    this.canvas = canvas;

    const gl = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
    if (!gl) {
      throw new Error('Luxarion: WebGL not supported on this device/browser.');
    }

    this.gl = gl as (WebGLRenderingContext | WebGL2RenderingContext);
    this.state = new GLState(this.gl);
    this.pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    this._initGL();
  }

  private _initGL(): void {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public clear(color: boolean = true, depth: boolean = true): void {
    const gl = this.gl;
    let bits = 0;

    if (color) {
      gl.clearColor(this.clearColor.r, this.clearColor.g, this.clearColor.b, this.clearColor.a);
      bits |= gl.COLOR_BUFFER_BIT;
    }
    if (depth) {
      this.state.setDepthWrite(true);
      bits |= gl.DEPTH_BUFFER_BIT;
    }

    if (bits > 0) {
      gl.clear(bits);
    }
  }

  public render(scene: Scene, camera: Camera): void {
    const gl = this.gl;

    this.stats.drawCalls = 0;
    this.stats.triangles = 0;
    this.stats.vertices = 0;

    // 1. Update Scenegraph World Transforms
    scene.updateWorldMatrix();
    camera.updateMatrixWorld();

    // 2. Clear buffers if autoClear is enabled
    if (this.autoClear) {
      this.clear();
    }

    // 3. Collect Lights
    let ambientColor = new Color(0.1, 0.1, 0.1);
    let dirLightColor = new Color(0, 0, 0);
    let dirLightDir = [0, -1, 0];
    let ptLightColor = new Color(0, 0, 0);
    let ptLightPos = [0, 0, 0];
    let ptLightDist = 10;

    for (let i = 0; i < scene.lights.length; i++) {
      const light = scene.lights[i];
      if (light instanceof AmbientLight) {
        ambientColor.r += light.color.r * light.intensity;
        ambientColor.g += light.color.g * light.intensity;
        ambientColor.b += light.color.b * light.intensity;
      } else if (light instanceof DirectionalLight) {
        dirLightColor.copy(light.color).multiplyScalar(light.intensity);
        const dir = light.updateDirection();
        dirLightDir = dir.toArray();
      } else if (light instanceof PointLight) {
        ptLightColor.copy(light.color).multiplyScalar(light.intensity);
        ptLightPos = light.position.toArray();
        ptLightDist = light.distance;
      }
    }

    // 4. Render all renderable 3D Objects
    for (let i = 0; i < scene.objects.length; i++) {
      const object = scene.objects[i];
      if (!object.visible || !object.geometry || !object.material) continue;

      this._renderObject(object, camera, {
        ambientColor,
        dirLightColor,
        dirLightDir,
        ptLightColor,
        ptLightPos,
        ptLightDist
      });
    }
  }

  private _getOrCreateProgram(vSrc: string, fSrc: string): ShaderProgram {
    const key = vSrc + '|' + fSrc;
    let prog = this._programCache.get(key);
    if (!prog) {
      prog = new ShaderProgram(this.gl, vSrc, fSrc);
      this._programCache.set(key, prog);
    }
    return prog;
  }

  private _renderObject(object: Object3D, camera: Camera, lighting: any): void {
    const gl = this.gl;
    const geometry = object.geometry!;
    const material = object.material!;

    const program = this._getOrCreateProgram(material.vertexShaderSource, material.fragmentShaderSource);
    if (!program.isCompiled || !program.program) return;

    this.state.useProgram(program.program);

    // Apply Material GPU States
    this.state.setDepthTest(material.depthTest);
    this.state.setDepthWrite(material.depthWrite);
    this.state.setBlend(material.transparent || material.opacity < 1.0, material.blendMode);

    if (material.side === 'double') {
      this.state.setCullFace(false);
    } else {
      this.state.setCullFace(true);
    }

    // Bind Attributes
    for (const [name, attr] of geometry.attributes.entries()) {
      const loc = program.attributes.get(name);
      if (loc !== undefined && loc !== -1) {
        if (!attr.buffer) {
          attr.buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
          gl.bufferData(gl.ARRAY_BUFFER, attr.data, attr.usage);
        } else {
          gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
        }

        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, attr.itemSize, gl.FLOAT, attr.normalized, 0, 0);
      }
    }

    // Standard Uniforms
    const uModel = program.uniforms.get('modelMatrix');
    if (uModel) gl.uniformMatrix4fv(uModel, false, object.worldMatrix.elements);

    const uView = program.uniforms.get('viewMatrix');
    if (uView) gl.uniformMatrix4fv(uView, false, camera.viewMatrix.elements);

    const uProj = program.uniforms.get('projectionMatrix');
    if (uProj) gl.uniformMatrix4fv(uProj, false, camera.projectionMatrix.elements);

    const uNorm = program.uniforms.get('normalMatrix');
    if (uNorm) {
      this._normalMatrix.getNormalMatrix(object.worldMatrix);
      gl.uniformMatrix3fv(uNorm, false, this._normalMatrix.elements);
    }

    const uCamPos = program.uniforms.get('cameraPosition');
    if (uCamPos) gl.uniform3fv(uCamPos, camera.position.toArray());

    // Light Uniforms
    const uAmb = program.uniforms.get('ambientLightColor');
    if (uAmb) gl.uniform3fv(uAmb, lighting.ambientColor.toRGBArray());

    const uDirCol = program.uniforms.get('dirLightColor');
    if (uDirCol) gl.uniform3fv(uDirCol, lighting.dirLightColor.toRGBArray());

    const uDirDir = program.uniforms.get('dirLightDirection');
    if (uDirDir) gl.uniform3fv(uDirDir, lighting.dirLightDir);

    const uPtCol = program.uniforms.get('pointLightColor');
    if (uPtCol) gl.uniform3fv(uPtCol, lighting.ptLightColor.toRGBArray());

    const uPtPos = program.uniforms.get('pointLightPosition');
    if (uPtPos) gl.uniform3fv(uPtPos, lighting.ptLightPos);

    const uPtDist = program.uniforms.get('pointLightDistance');
    if (uPtDist) gl.uniform1f(uPtDist, lighting.ptLightDist);

    // Texture Unit Bindings
    const matAny = material as any;
    if (matAny.map && typeof matAny.map.bind === 'function') {
      matAny.map.bind(gl, 0);
    }
    if (matAny.normalMap && typeof matAny.normalMap.bind === 'function') {
      matAny.normalMap.bind(gl, 1);
    }
    if (matAny.emissiveMap && typeof matAny.emissiveMap.bind === 'function') {
      matAny.emissiveMap.bind(gl, 2);
    }

    // Custom Material Uniforms
    if (typeof matAny.updateUniforms === 'function') {
      matAny.updateUniforms();
    }
    program.setUniforms(material.uniforms);

    // Draw Calls
    this.stats.drawCalls++;
    const vCount = geometry.getVertexCount();
    this.stats.vertices += vCount;

    const drawMode = material.wireframe ? gl.LINES : gl.TRIANGLES;

    if (geometry.index) {
      const idxAttr = geometry.index;
      if (!idxAttr.buffer) {
        idxAttr.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxAttr.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idxAttr.data, idxAttr.usage);
      } else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxAttr.buffer);
      }

      const count = Math.min(geometry.drawRange.count, idxAttr.data.length);
      gl.drawElements(drawMode, count, gl.UNSIGNED_SHORT, geometry.drawRange.start * 2);
      this.stats.triangles += Math.floor(count / 3);
    } else {
      const count = Math.min(geometry.drawRange.count, vCount);
      gl.drawArrays(drawMode, geometry.drawRange.start, count);
      this.stats.triangles += Math.floor(count / 3);
    }
  }

  public dispose(): void {
    this._programCache.forEach(prog => prog.dispose());
    this._programCache.clear();
    this.state.reset();
  }
}
