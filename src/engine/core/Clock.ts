/**
 * @file Clock.ts
 * @description Frame-rate independent animation timing, delta calculations, and real-time FPS tracking.
 * Part of Luxarion Engine - Single Responsibility: Core Animation Timing.
 */

export class Clock {
  private _startTime: number = 0;
  private _oldTime: number = 0;
  private _elapsedTime: number = 0;
  private _running: boolean = false;
  private _fps: number = 60;
  private _frameCount: number = 0;
  private _fpsLastUpdated: number = 0;

  constructor(autoStart: boolean = true) {
    if (autoStart) {
      this.start();
    }
  }

  public start(): void {
    this._startTime = (typeof performance !== 'undefined' ? performance : Date).now();
    this._oldTime = this._startTime;
    this._fpsLastUpdated = this._startTime;
    this._elapsedTime = 0;
    this._running = true;
    this._frameCount = 0;
  }

  public stop(): void {
    this.getElapsedTime();
    this._running = false;
  }

  public getElapsedTime(): number {
    this.getDelta();
    return this._elapsedTime;
  }

  public getDelta(): number {
    let diff = 0;

    if (this._running) {
      const newTime = (typeof performance !== 'undefined' ? performance : Date).now();
      diff = (newTime - this._oldTime) / 1000;
      this._oldTime = newTime;
      this._elapsedTime += diff;

      this._frameCount++;
      if (newTime - this._fpsLastUpdated >= 500) {
        this._fps = Math.round((this._frameCount * 1000) / (newTime - this._fpsLastUpdated));
        this._frameCount = 0;
        this._fpsLastUpdated = newTime;
      }
    }

    return diff;
  }

  public getFPS(): number {
    return this._fps;
  }

  public isRunning(): boolean {
    return this._running;
  }
}
