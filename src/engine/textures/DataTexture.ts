/**
 * @file DataTexture.ts
 * @description Creates a WebGL texture from raw typed byte or float data buffers.
 * Part of Luxarion Engine - Texture Subsystem.
 */

import { Texture, TextureFormat, TextureDataType } from './Texture';

export class DataTexture extends Texture {
  public data: ArrayBufferView;
  public width: number;
  public height: number;

  constructor(
    data: ArrayBufferView,
    width: number,
    height: number,
    format: TextureFormat = 'rgba',
    type: TextureDataType = 'unsigned_byte'
  ) {
    super({ data, width, height });
    this.data = data;
    this.width = width;
    this.height = height;
    this.format = format;
    this.type = type;
    this.generateMipmaps = false;
    this.minFilter = 'nearest';
    this.magFilter = 'nearest';
  }
}
