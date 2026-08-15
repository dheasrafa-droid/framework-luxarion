/**
 * @file App.ts
 * @description High-level convenience App wrapper for Luxarion Engine.
 * Quick bootstrap with scene, camera, lighting, renderer, and render loop.
 * Part of Luxarion Engine.
 */

import { Scene } from '../scene/Scene';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { WebGLRenderer } from '../renderers/WebGLRenderer';
import { OrbitControls } from '../cameras/OrbitControls';
import { AmbientLight } from '../lights/AmbientLight';
import { DirectionalLight } from '../lights/DirectionalLight';

export interface AppOptions {
  canvas?: HTMLCanvasElement | string;
  width?: number;
  height?: number;
  fov?: number;
  antialias?: boolean;
  autoResize?: boolean;
  enableControls?: boolean;
}

export class App {
  public canvas: HTMLCanvasElement;
  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public controls: OrbitControls | null = null;
  public isRunning: boolean = false;

  private _animationFrameId: number | null = null;
  private _updateCallbacks: ((delta: number, time: number) => void)[] = [];
  private _lastTime: number = 0;
  private _startTime: number = 0;

  constructor(options: AppOptions = {}) {
    let canvasEl: HTMLCanvasElement | null = null;
    if (typeof options.canvas === 'string') {
      canvasEl = document.querySelector(options.canvas) as HTMLCanvasElement;
    } else if (typeof document !== 'undefined' && options.canvas instanceof HTMLCanvasElement) {
      canvasEl = options.canvas;
    }

    if (!canvasEl && typeof document !== 'undefined') {
      canvasEl = document.createElement('canvas');
      canvasEl.id = 'luxarion-stage';
      canvasEl.style.width = '100vw';
      canvasEl.style.height = '100vh';
      canvasEl.style.display = 'block';
      document.body.appendChild(canvasEl);
    }

    if (!canvasEl) {
      throw new Error('Luxarion.App: No valid canvas element found or created.');
    }

    this.canvas = canvasEl;
    const w = options.width || (canvasEl.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800));
    const h = options.height || (canvasEl.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600));

    this.renderer = new WebGLRenderer(this.canvas, {
      antialias: options.antialias !== false,
      alpha: true,
      depth: true
    });
    this.renderer.setSize(w, h);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(options.fov || 60, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Default lighting
    const ambient = new AmbientLight('#ffffff', 0.5);
    const dirLight = new DirectionalLight('#ffffff', 0.8);
    dirLight.position.set(5, 10, 7);
    this.scene.add(ambient);
    this.scene.add(dirLight);

    if (options.enableControls !== false && typeof window !== 'undefined') {
      this.controls = new OrbitControls(this.camera, this.canvas);
    }

    if (options.autoResize !== false && typeof window !== 'undefined') {
      window.addEventListener('resize', this._onResize.bind(this));
    }
  }

  private _onResize(): void {
    const w = this.canvas.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const h = this.canvas.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600);
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  public onUpdate(callback: (delta: number, time: number) => void): this {
    this._updateCallbacks.push(callback);
    return this;
  }

  public start(): this {
    if (this.isRunning) return this;
    this.isRunning = true;
    this._startTime = performance.now() * 0.001;
    this._lastTime = performance.now();

    const loop = (now: number) => {
      if (!this.isRunning) return;
      const delta = Math.min((now - this._lastTime) * 0.001, 0.1);
      this._lastTime = now;
      const time = now * 0.001 - this._startTime;

      if (this.controls) {
        this.controls.update();
      }

      for (let i = 0; i < this._updateCallbacks.length; i++) {
        this._updateCallbacks[i](delta, time);
      }

      this.renderer.render(this.scene, this.camera);
      this._animationFrameId = requestAnimationFrame(loop);
    };

    this._animationFrameId = requestAnimationFrame(loop);
    return this;
  }

  public stop(): this {
    this.isRunning = false;
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    return this;
  }

  public destroy(): void {
    this.stop();
    if (this.controls) {
      this.controls.dispose();
    }
    this.scene.clear();
  }
}
