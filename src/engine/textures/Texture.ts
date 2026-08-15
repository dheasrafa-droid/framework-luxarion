/**
 * @file Texture.ts
 * @description Core WebGL Texture abstraction supporting Image, Canvas, Data buffers, Mipmaps, and Filtering modes.
 * Part of Luxarion Engine - Texture Subsystem.
 */

import { EventDispatcher } from '../core/EventDispatcher';
import { MathUtils } from '../math/MathUtils';
import { Vector2 } from '../math/Vector2';

export type TextureWrapMode = 'repeat' | 'clamp-to-edge' | 'mirrored-repeat';
export type TextureFilterMode = 'nearest' | 'linear' | 'nearest-mipmap-nearest' | 'linear-mipmap-nearest' | 'nearest-mipmap-linear' | 'linear-mipmap-linear';
export type TextureFormat = 'rgba' | 'rgb' | 'luminance' | 'alpha';
export type TextureDataType = 'unsigned_byte' | 'float';

export interface TextureSourceData {
  data: ArrayBufferView;
  width: number;
  height: number;
}

export type TextureSource = HTMLImageElement | HTMLCanvasElement | ImageBitmap | ImageData | TextureSourceData | null;

export class Texture extends EventDispatcher {
  public readonly id: string;
  public name: string = 'Texture';

  public image: TextureSource = null;
  public wrapS: TextureWrapMode = 'repeat';
  public wrapT: TextureWrapMode = 'repeat';
  public magFilter: TextureFilterMode = 'linear';
  public minFilter: TextureFilterMode = 'linear-mipmap-linear';
  public format: TextureFormat = 'rgba';
  public type: TextureDataType = 'unsigned_byte';

  public repeat: Vector2 = new Vector2(1, 1);
  public offset: Vector2 = new Vector2(0, 0);

  public generateMipmaps: boolean = true;
  public flipY: boolean = true;
  public premultiplyAlpha: boolean = false;
  public unpackAlignment: number = 4;

  public needsUpdate: boolean = true;
  public version: number = 0;

  public glTexture: WebGLTexture | null = null;
  private _boundUnit: number = -1;

  constructor(image: TextureSource = null) {
    super();
    this.id = MathUtils.generateUUID();
    this.image = image;
  }

  public setNeedsUpdate(): void {
    this.needsUpdate = true;
    this.version++;
  }

  private _getGLWrap(gl: WebGLRenderingContext | WebGL2RenderingContext, mode: TextureWrapMode): number {
    switch (mode) {
      case 'clamp-to-edge': return gl.CLAMP_TO_EDGE;
      case 'mirrored-repeat': return gl.MIRRORED_REPEAT;
      case 'repeat':
      default: return gl.REPEAT;
    }
  }

  private _getGLFilter(gl: WebGLRenderingContext | WebGL2RenderingContext, filter: TextureFilterMode): number {
    switch (filter) {
      case 'nearest': return gl.NEAREST;
      case 'nearest-mipmap-nearest': return gl.NEAREST_MIPMAP_NEAREST;
      case 'linear-mipmap-nearest': return gl.LINEAR_MIPMAP_NEAREST;
      case 'nearest-mipmap-linear': return gl.NEAREST_MIPMAP_LINEAR;
      case 'linear-mipmap-linear': return gl.LINEAR_MIPMAP_LINEAR;
      case 'linear':
      default: return gl.LINEAR;
    }
  }

  private _getGLFormat(gl: WebGLRenderingContext | WebGL2RenderingContext, format: TextureFormat): number {
    switch (format) {
      case 'rgb': return gl.RGB;
      case 'luminance': return gl.LUMINANCE;
      case 'alpha': return gl.ALPHA;
      case 'rgba':
      default: return gl.RGBA;
    }
  }

  private _getGLType(gl: WebGLRenderingContext | WebGL2RenderingContext, type: TextureDataType): number {
    switch (type) {
      case 'float': return gl.FLOAT;
      case 'unsigned_byte':
      default: return gl.UNSIGNED_BYTE;
    }
  }

  private _isPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) === 0 && value !== 0;
  }

  public upload(gl: WebGLRenderingContext | WebGL2RenderingContext): WebGLTexture {
    if (!this.glTexture) {
      this.glTexture = gl.createTexture();
    }

    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.unpackAlignment);

    const glFormat = this._getGLFormat(gl, this.format);
    const glType = this._getGLType(gl, this.type);

    let isPOT = true;

    if (this.image) {
      if ('data' in this.image && 'width' in this.image && 'height' in this.image) {
        // Raw typed data buffer
        const raw = this.image as TextureSourceData;
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, raw.width, raw.height, 0, glFormat, glType, raw.data as ArrayBufferView);
        isPOT = this._isPowerOfTwo(raw.width) && this._isPowerOfTwo(raw.height);
      } else {
        // HTMLImageElement, HTMLCanvasElement, ImageData, ImageBitmap
        const elem = this.image as (HTMLImageElement | HTMLCanvasElement | ImageData | ImageBitmap);
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, glFormat, glType, elem as any);
        const w = (elem as any).width || (elem as any).videoWidth || 512;
        const h = (elem as any).height || (elem as any).videoHeight || 512;
        isPOT = this._isPowerOfTwo(w) && this._isPowerOfTwo(h);
      }
    } else {
      // 1x1 default placeholder pixel (opaque white)
      const whitePixel = new Uint8Array([255, 255, 255, 255]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);
      isPOT = true;
    }

    if (isPOT) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this._getGLWrap(gl, this.wrapS));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this._getGLWrap(gl, this.wrapT));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this._getGLFilter(gl, this.magFilter));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this._getGLFilter(gl, this.minFilter));

      if (this.generateMipmaps) {
        gl.generateMipmap(gl.TEXTURE_2D);
      }
    } else {
      // Non-power-of-two fallback
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    this.needsUpdate = false;
    return this.glTexture;
  }

  public bind(gl: WebGLRenderingContext | WebGL2RenderingContext, unit: number = 0): void {
    gl.activeTexture(gl.TEXTURE0 + unit);
    if (!this.glTexture || this.needsUpdate) {
      this.upload(gl);
    } else {
      gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    }
    this._boundUnit = unit;
  }

  public dispose(gl?: WebGLRenderingContext | WebGL2RenderingContext): void {
    if (gl && this.glTexture) {
      gl.deleteTexture(this.glTexture);
    }
    this.glTexture = null;
    this.dispatchEvent({ type: 'dispose' });
  }
}
