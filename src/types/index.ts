/**
 * @file index.ts
 * @description Global TypeScript definitions and interfaces for Luxarion Engine.
 */

export type Nullable<T> = T | null;
export type ArrayLikeNumber = number[] | Float32Array | Uint16Array | Uint32Array | Uint8Array;

export interface RenderStats {
  fps: number;
  drawCalls: number;
  triangles: number;
  points: number;
  lines: number;
  frameTime: number;
}

export interface IDisposable {
  dispose(): void;
}

export interface ICloneable<T> {
  clone(): T;
}

export interface IUpdatable {
  update(delta: number, time: number): void;
}
