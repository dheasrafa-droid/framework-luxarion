/**
 * @file WebGLMock.ts
 * @description Lightweight WebGL context mock for headless unit testing environments.
 */

export class WebGLMock {
  public static createMockContext(): any {
    return {
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      createProgram: () => ({}),
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      attachShader: () => {},
      linkProgram: () => {},
      useProgram: () => {},
      getProgramParameter: () => true,
      getShaderParameter: () => true,
      getUniformLocation: () => ({}),
      getAttribLocation: () => 0,
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      uniformMatrix4fv: () => {},
      uniform3fv: () => {},
      uniform1f: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      generateMipmap: () => {},
      viewport: () => {},
      clearColor: () => {},
      clear: () => {},
      enable: () => {},
      disable: () => {},
      depthFunc: () => {},
      blendFunc: () => {},
      cullFace: () => {},
      drawArrays: () => {},
      drawElements: () => {},
      COLOR_BUFFER_BIT: 0x00004000,
      DEPTH_BUFFER_BIT: 0x00000100,
      ARRAY_BUFFER: 0x8892,
      ELEMENT_ARRAY_BUFFER: 0x8893,
      STATIC_DRAW: 0x88e4,
      FLOAT: 0x1406,
      UNSIGNED_SHORT: 0x1403,
      TRIANGLES: 0x0004,
      TEXTURE_2D: 0x0de1,
      RGBA: 0x1908,
      UNSIGNED_BYTE: 0x1401,
      LINEAR: 0x2601,
      REPEAT: 0x2901
    };
  }
}
