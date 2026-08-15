/**
 * @file TextureGenerator.ts
 * @description Zero-dependency procedural texture generator library.
 * Produces high-resolution Cyber Grids, Nebula Noise, Hexagonal Carbon, Normal Maps, Voronoi Cells, and Matrix glyph streams.
 * Part of Luxarion Engine - Procedural Texture Engine.
 */

import { CanvasTexture } from './CanvasTexture';
import { DataTexture } from './DataTexture';
import { Noise } from '../math/Noise';
import { Vector2 } from '../math/Vector2';

export class TextureGenerator {
  /**
   * Generates a high-tech glowing Cyber Grid canvas texture
   */
  public static createCyberGrid(
    size: number = 512,
    gridCount: number = 16,
    gridColor: string = '#06b6d4',
    bgColor: string = '#050714',
    subGridColor: string = '#1e293b'
  ): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    const step = size / gridCount;
    const subStep = step / 4;

    // Sub-grid lines
    ctx.strokeStyle = subGridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= size; x += subStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += subStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // Main grid lines with glow
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = gridColor;
    ctx.shadowBlur = 8;

    for (let x = 0; x <= size; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    // Intersection cross nodes
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x <= size; x += step) {
      for (let y = 0; y <= size; y += step) {
        ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    const tex = new CanvasTexture(canvas);
    tex.name = 'CyberGridTexture';
    return tex;
  }

  /**
   * Generates a smooth multi-color Simplex Nebula / Smoke noise canvas texture
   */
  public static createNebulaNoise(
    size: number = 512,
    scale: number = 0.008,
    colorA: [number, number, number] = [6, 182, 212], // cyan
    colorB: [number, number, number] = [236, 72, 153], // pink
    colorC: [number, number, number] = [99, 102, 241]  // indigo
  ): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    let ptr = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n1 = (Noise.fbm2D(x * scale, y * scale, 4) + 1.0) * 0.5;
        const n2 = (Noise.fbm2D(x * scale * 2.0 + 10.0, y * scale * 2.0 + 10.0, 3) + 1.0) * 0.5;

        // Tri-color blend based on octaves
        const r = Math.min(255, Math.floor(colorA[0] * (1 - n1) + colorB[0] * n1 * (1 - n2) + colorC[0] * n2));
        const g = Math.min(255, Math.floor(colorA[1] * (1 - n1) + colorB[1] * n1 * (1 - n2) + colorC[1] * n2));
        const b = Math.min(255, Math.floor(colorA[2] * (1 - n1) + colorB[2] * n1 * (1 - n2) + colorC[2] * n2));

        data[ptr] = r;
        data[ptr + 1] = g;
        data[ptr + 2] = b;
        data[ptr + 3] = 255;
        ptr += 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new CanvasTexture(canvas);
    tex.name = 'NebulaNoiseTexture';
    return tex;
  }

  /**
   * Generates a Hexagonal Carbon Honeycomb pattern texture
   */
  public static createHexagonPattern(
    size: number = 512,
    hexRadius: number = 28,
    strokeColor: string = '#38bdf8',
    fillColor: string = '#090d1f',
    coreColor: string = '#0284c7'
  ): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, size, size);

    const a = (2 * Math.PI) / 6;
    const r = hexRadius;
    const dx = r * 1.5;
    const dy = r * Math.sqrt(3);

    const drawHex = (cx: number, cy: number, radius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const x = cx + radius * Math.cos(a * i);
        const y = cy + radius * Math.sin(a * i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = 6;

    for (let x = -r; x < size + r * 2; x += dx) {
      const isOdd = Math.round(x / dx) % 2 === 0;
      for (let y = -r; y < size + r * 2; y += dy) {
        const cx = x;
        const cy = isOdd ? y : y + dy / 2;

        drawHex(cx, cy, r - 3);
        ctx.stroke();

        // Inner glowing dot
        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new CanvasTexture(canvas);
    tex.name = 'HexagonPatternTexture';
    return tex;
  }

  /**
   * Generates a Voronoi / Cellular Crystal texture
   */
  public static createVoronoiCrystals(
    size: number = 512,
    pointCount: number = 24,
    borderColor: string = '#38bdf8'
  ): CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const points: Vector2[] = [];
    for (let i = 0; i < pointCount; i++) {
      points.push(new Vector2(Math.random() * size, Math.random() * size));
    }

    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    let ptr = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let d1 = Infinity;
        let d2 = Infinity;

        for (let i = 0; i < points.length; i++) {
          const dx = x - points[i].x;
          const dy = y - points[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < d1) {
            d2 = d1;
            d1 = d;
          } else if (d < d2) {
            d2 = d;
          }
        }

        const borderDist = d2 - d1;
        const edgeIntensity = Math.min(1.0, borderDist / 12);
        const cellShade = Math.floor(20 + (1.0 - Math.min(1.0, d1 / 80)) * 60);

        if (borderDist < 3.0) {
          data[ptr] = 56;
          data[ptr + 1] = 189;
          data[ptr + 2] = 248;
        } else {
          data[ptr] = Math.floor(cellShade * 0.3);
          data[ptr + 1] = Math.floor(cellShade * 0.7);
          data[ptr + 2] = cellShade;
        }
        data[ptr + 3] = 255;
        ptr += 4;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new CanvasTexture(canvas);
    tex.name = 'VoronoiCrystalsTexture';
    return tex;
  }

  /**
   * Generates a Tangent-Space Normal Map (RGB vector map where [128,128,255] = flat normal)
   * from any continuous mathematical height displacement function.
   */
  public static createNormalMapFromHeight(
    width: number = 256,
    height: number = 256,
    heightFn: (u: number, v: number) => number,
    strength: number = 2.5
  ): DataTexture {
    const data = new Uint8Array(width * height * 4);
    const du = 1.0 / width;
    const dv = 1.0 / height;

    let ptr = 0;
    for (let y = 0; y < height; y++) {
      const v = y / height;
      for (let x = 0; x < width; x++) {
        const u = x / width;

        // Central difference gradient
        const hL = heightFn(u - du, v);
        const hR = heightFn(u + du, v);
        const hD = heightFn(u, v - dv);
        const hU = heightFn(u, v + dv);

        const dX = (hR - hL) * strength;
        const dY = (hU - hD) * strength;
        const dZ = 1.0;

        // Normalize (dX, dY, dZ)
        const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ) || 1.0;
        const nx = -dX / len;
        const ny = -dY / len;
        const nz = dZ / len;

        // Map [-1, 1] to [0, 255]
        data[ptr] = Math.floor((nx * 0.5 + 0.5) * 255);
        data[ptr + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
        data[ptr + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
        data[ptr + 3] = 255;
        ptr += 4;
      }
    }

    const tex = new DataTexture(data, width, height, 'rgba', 'unsigned_byte');
    tex.name = 'ProceduralNormalMap';
    return tex;
  }

  /**
   * Generates a dynamic Animated Matrix Digital Rain Canvas Texture instance
   */
  public static createAnimatedMatrixStream(size: number = 512): {
    texture: CanvasTexture;
    update: () => void;
  } {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const fontSize = 16;
    const columns = Math.floor(size / fontSize);
    const drops: number[] = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));
    const chars = '0123456789ABCDEFλμψΩΞπΣ∇∞≈≠±√';

    // Initial background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    const update = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, size, size);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright tip
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, x, y);

        // Green tail
        ctx.fillStyle = '#22c55e';
        ctx.fillText(text, x, y - fontSize);

        if (y > size && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const texture = new CanvasTexture(canvas);
    texture.name = 'MatrixStreamTexture';

    return {
      texture,
      update: () => {
        update();
        texture.update();
      }
    };
  }
}
