/**
 * @file Color.ts
 * @description RGBA, Hex, and HSL color math with gamma correction and linear interpolations.
 * Part of Luxarion Engine - Single Responsibility: Color Representations & Conversions.
 */

export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  public setRGB(r: number, g: number, b: number, a: number = 1): this {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  public setHex(hex: number | string, a: number = 1): this {
    if (typeof hex === 'string') {
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
      }
      const num = parseInt(cleanHex, 16);
      this.r = ((num >> 16) & 255) / 255;
      this.g = ((num >> 8) & 255) / 255;
      this.b = (num & 255) / 255;
      this.a = a;
      return this;
    }

    this.r = ((hex >> 16) & 255) / 255;
    this.g = ((hex >> 8) & 255) / 255;
    this.b = (hex & 255) / 255;
    this.a = a;
    return this;
  }

  public setHSL(h: number, s: number, l: number, a: number = 1): this {
    h = ((h % 1) + 1) % 1;
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));

    if (s === 0) {
      this.r = this.g = this.b = l;
    } else {
      const p = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
      const q = (2 * l) - p;
      this.r = this._hue2rgb(q, p, h + 1 / 3);
      this.g = this._hue2rgb(q, p, h);
      this.b = this._hue2rgb(q, p, h - 1 / 3);
    }
    this.a = a;
    return this;
  }

  private _hue2rgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  public clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  public copy(c: Color): this {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    this.a = c.a;
    return this;
  }

  public lerp(target: Color, alpha: number): this {
    this.r += (target.r - this.r) * alpha;
    this.g += (target.g - this.g) * alpha;
    this.b += (target.b - this.b) * alpha;
    this.a += (target.a - this.a) * alpha;
    return this;
  }

  public multiplyScalar(scalar: number): this {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    return this;
  }

  public toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }

  public toRGBArray(): [number, number, number] {
    return [this.r, this.g, this.b];
  }

  public toCSSString(): string {
    return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
  }
}
