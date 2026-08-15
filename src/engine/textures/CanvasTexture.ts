/**
 * @file CanvasTexture.ts
 * @description Creates a WebGL texture from a dynamic 2D HTMLCanvasElement.
 * Automatically marks needsUpdate on changes.
 * Part of Luxarion Engine - Texture Subsystem.
 */

import { Texture } from './Texture';

export class CanvasTexture extends Texture {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D | null;

  constructor(canvas?: HTMLCanvasElement) {
    const canvasEl = canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
    if (!canvasEl) {
      throw new Error('CanvasTexture: HTMLCanvasElement is required.');
    }
    super(canvasEl);
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.generateMipmaps = true;
    this.minFilter = 'linear-mipmap-linear';
    this.magFilter = 'linear';
  }

  public update(): void {
    this.setNeedsUpdate();
  }
}
