/**
 * @file FrameBuffer.ts
 * @description WebGL Framebuffer Object (FBO) managing color textures, depth attachments, and viewport targets.
 * Part of Luxarion Engine - Single Responsibility: Off-Screen Framebuffer Target.
 */

export class FrameBuffer {
  public gl: WebGLRenderingContext | WebGL2RenderingContext;
  public framebuffer: WebGLFramebuffer | null = null;
  public texture: WebGLTexture | null = null;
  public renderbuffer: WebGLRenderbuffer | null = null;
  public width: number;
  public height: number;

  constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, width: number = 512, height: number = 512) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this._init();
  }

  private _init(): void {
    const gl = this.gl;

    this.framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);

    // Color texture target
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    // Depth renderbuffer
    this.renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderbuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderbuffer);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  public bind(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, this.width, this.height);
  }

  public unbind(screenWidth: number, screenHeight: number): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, screenWidth, screenHeight);
  }

  public dispose(): void {
    const gl = this.gl;
    if (this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.renderbuffer) gl.deleteRenderbuffer(this.renderbuffer);
    this.framebuffer = null;
    this.texture = null;
    this.renderbuffer = null;
  }
}
