/**
 * @file TextureLoader.ts
 * @description Image loader creating WebGL Texture instances with promise & callback interfaces.
 * Part of Luxarion Engine - Texture Subsystem.
 */

import { Texture } from './Texture';

export class TextureLoader {
  public crossOrigin: string = 'anonymous';

  public load(
    url: string,
    onLoad?: (texture: Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent | any) => void
  ): Texture {
    const texture = new Texture();

    if (typeof document === 'undefined') {
      return texture;
    }

    const image = new Image();
    image.crossOrigin = this.crossOrigin;

    image.onload = () => {
      texture.image = image;
      texture.setNeedsUpdate();
      if (onLoad) onLoad(texture);
    };

    image.onerror = (err) => {
      console.warn(`Luxarion.TextureLoader: Failed to load texture from "${url}"`, err);
      if (onError) onError(err);
    };

    image.src = url;
    return texture;
  }

  public async loadAsync(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
      this.load(url, resolve, undefined, reject);
    });
  }
}
