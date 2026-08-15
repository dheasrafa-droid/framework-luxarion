/**
 * @file UniformManager.ts
 * @description Uploads typed JavaScript values to WebGL shader uniform locations efficiently.
 * Part of Luxarion Engine - Single Responsibility: WebGL Uniform State Dispatcher.
 */

import { UniformMap } from '../materials/Material';

export class UniformManager {
  public static upload(gl: WebGLRenderingContext | WebGL2RenderingContext, location: WebGLUniformLocation, uniform: UniformMap[string]): void {
    const val = uniform.value;
    switch (uniform.type) {
      case '1f':
        gl.uniform1f(location, val);
        break;
      case '2f':
        gl.uniform2f(location, val[0], val[1]);
        break;
      case '3f':
        gl.uniform3f(location, val[0], val[1], val[2]);
        break;
      case '4f':
        gl.uniform4f(location, val[0], val[1], val[2], val[3]);
        break;
      case '1i':
      case 'sampler2D':
        gl.uniform1i(location, val);
        break;
      case 'mat3':
        gl.uniformMatrix3fv(location, false, val instanceof Float32Array ? val : new Float32Array(val));
        break;
      case 'mat4':
        gl.uniformMatrix4fv(location, false, val instanceof Float32Array ? val : new Float32Array(val));
        break;
      default:
        break;
    }
  }
}
