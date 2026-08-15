/**
 * @file MathUtils.ts
 * @description General mathematical utility functions, clamped conversions, and randomizers.
 * Part of Luxarion Engine - Single Responsibility: Mathematical Utility Functions.
 */

export class MathUtils {
  public static readonly DEG2RAD: number = Math.PI / 180;
  public static readonly RAD2DEG: number = 180 / Math.PI;
  public static readonly TWO_PI: number = Math.PI * 2;
  public static readonly HALF_PI: number = Math.PI * 0.5;

  public static degToRad(degrees: number): number {
    return degrees * MathUtils.DEG2RAD;
  }

  public static radToDeg(radians: number): number {
    return radians * MathUtils.RAD2DEG;
  }

  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public static lerp(x: number, y: number, t: number): number {
    return (1 - t) * x + t * y;
  }

  public static smoothstep(x: number, min: number, max: number): number {
    if (x <= min) return 0;
    if (x >= max) return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
  }

  public static mapLinear(x: number, a1: number, a2: number, b1: number, b2: number): number {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
  }

  public static randFloat(low: number, high: number): number {
    return low + Math.random() * (high - low);
  }

  public static randInt(low: number, high: number): number {
    return low + Math.floor(Math.random() * (high - low + 1));
  }

  public static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
