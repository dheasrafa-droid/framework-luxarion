/**
 * @file ExampleRegistry.ts
 * @description Registry and base contract for all Luxarion Engine example scenes.
 * Part of Luxarion Engine - Single Responsibility: Example Scene Orchestration.
 */

import { Scene, Camera, OrbitControls, WebGLRenderer, Canvas2DRenderer, ThemeManager } from '../src/engine/Luxarion';

export interface LuxarionDemoInstance {
  scene?: Scene;
  camera?: Camera;
  controls?: OrbitControls;
  onZoom?: (direction: 'in' | 'out' | 'reset') => void;
  update: (delta: number, time: number) => void;
  onResize?: (width: number, height: number) => void;
  dispose?: () => void;
}

export interface LuxarionDemo {
  id: string;
  name: string;
  category: '3d' | '2d' | 'hologram' | 'matrix' | 'space' | 'simulation' | 'audio' | 'quantum';
  is2D?: boolean;
  description: string;
  init: (
    glRenderer: WebGLRenderer | null,
    canvas2dRenderer: Canvas2DRenderer | null,
    themeManager: ThemeManager
  ) => LuxarionDemoInstance;
}
