/**
 * @file RenderPipeline.ts
 * @description Coordinates multi-stage rendering passes (Shadow pass, Main geometry pass, Post-processing FX, UI overlays).
 * Part of Luxarion Engine - Single Responsibility: Multi-Pass Render Pipeline Orchestration.
 */

import { WebGLRenderer } from './WebGLRenderer';
import { Scene } from '../scene/Scene';
import { Camera } from '../cameras/Camera';
import { FrameBuffer } from './FrameBuffer';

export class RenderPipeline {
  public renderer: WebGLRenderer;
  public mainFBO: FrameBuffer | null = null;
  public enablePostProcessing: boolean = false;

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer;
  }

  public initOffscreenTargets(width: number, height: number): void {
    if (this.mainFBO) {
      this.mainFBO.dispose();
    }
    this.mainFBO = new FrameBuffer(this.renderer.gl, width, height);
  }

  public execute(scene: Scene, camera: Camera): void {
    if (this.enablePostProcessing && this.mainFBO) {
      this.mainFBO.bind();
      this.renderer.render(scene, camera);
      this.mainFBO.unbind(this.renderer.width, this.renderer.height);
      // Post FX would composite here
    } else {
      this.renderer.render(scene, camera);
    }
  }

  public dispose(): void {
    if (this.mainFBO) {
      this.mainFBO.dispose();
      this.mainFBO = null;
    }
  }
}
