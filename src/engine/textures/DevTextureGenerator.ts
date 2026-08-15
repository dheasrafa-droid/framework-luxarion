/**
 * @file DevTextureGenerator.ts
 * @description Procedural Generator for High-Resolution Level Design Dev-Textures (DLEdTk), Graybox Metric Maps, Hazard Trims, and Cyber Neon Grids.
 * Part of Luxarion Engine - Level Design & Modular Texture Subsystem.
 */

import { CanvasTexture } from './CanvasTexture';

export type DevTextureType =
  | 'wall_orange_8x'
  | 'wall_dark_4x'
  | 'floor_charcoal_08'
  | 'floor_orange_step'
  | 'trim_caution_hazard'
  | 'accent_cyan_ramp'
  | 'pillar_cylinder_grid'
  | 'cyber_neon_yellow'
  | 'cyber_neon_lanes'
  | 'cyber_neon_arch';

export class DevTextureGenerator {
  private static _cache: Map<string, CanvasTexture> = new Map();

  public static getTexture(type: DevTextureType, size: number = 512): CanvasTexture {
    const key = `${type}_${size}`;
    if (this._cache.has(key)) {
      return this._cache.get(key)!;
    }

    if (typeof document === 'undefined') {
      const empty = new CanvasTexture({} as any);
      return empty;
    }

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      const fallback = new CanvasTexture(canvas);
      return fallback;
    }

    switch (type) {
      case 'wall_orange_8x':
        this._renderWallOrange8x(ctx, size);
        break;
      case 'wall_dark_4x':
        this._renderWallDark4x(ctx, size);
        break;
      case 'floor_charcoal_08':
        this._renderFloorCharcoal08(ctx, size);
        break;
      case 'floor_orange_step':
        this._renderFloorOrangeStep(ctx, size);
        break;
      case 'trim_caution_hazard':
        this._renderTrimCautionHazard(ctx, size);
        break;
      case 'accent_cyan_ramp':
        this._renderAccentCyanRamp(ctx, size);
        break;
      case 'pillar_cylinder_grid':
        this._renderPillarGrid(ctx, size);
        break;
      case 'cyber_neon_yellow':
        this._renderCyberNeonYellow(ctx, size);
        break;
      case 'cyber_neon_lanes':
        this._renderCyberNeonLanes(ctx, size);
        break;
      case 'cyber_neon_arch':
        this._renderCyberNeonArch(ctx, size);
        break;
      default:
        this._renderWallOrange8x(ctx, size);
        break;
    }

    const texture = new CanvasTexture(canvas);
    texture.wrapS = 'repeat';
    texture.wrapT = 'repeat';
    this._cache.set(key, texture);
    return texture;
  }

  // 1. WALL ORANGE 8x (Matching Screenshot 2, 3, 4)
  private static _renderWallOrange8x(ctx: CanvasRenderingContext2D, size: number): void {
    // Vibrant safety orange background
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, size, size);

    // Subtle 4x4 inner subdivisions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    const div = 4;
    const step = size / div;
    for (let i = 1; i < div; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // 8x8 micro-tick grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    const microDiv = 8;
    const microStep = size / microDiv;
    for (let i = 1; i < microDiv; i++) {
      if (i % 2 !== 0) {
        ctx.beginPath();
        ctx.moveTo(i * microStep, 0);
        ctx.lineTo(i * microStep, size);
        ctx.moveTo(0, i * microStep);
        ctx.lineTo(size, i * microStep);
        ctx.stroke();
      }
    }

    // Outer bold border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, size - 8, size - 8);

    // Corner L-brackets
    const bLen = 32;
    ctx.lineWidth = 4;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(16, 16 + bLen); ctx.lineTo(16, 16); ctx.lineTo(16 + bLen, 16); ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(size - 16 - bLen, 16); ctx.lineTo(size - 16, 16); ctx.lineTo(size - 16, 16 + bLen); ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(16, size - 16 - bLen); ctx.lineTo(16, size - 16); ctx.lineTo(16 + bLen, size - 16); ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(size - 16 - bLen, size - 16); ctx.lineTo(size - 16, size - 16); ctx.lineTo(size - 16, size - 16 - bLen); ctx.stroke();

    // Crosshairs '+' at all 9 main intersections
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    const cSize = 12;
    for (let x = 0; x <= div; x++) {
      for (let y = 0; y <= div; y++) {
        const px = x * step;
        const py = y * step;
        ctx.beginPath();
        ctx.moveTo(px - cSize, py); ctx.lineTo(px + cSize, py);
        ctx.moveTo(px, py - cSize); ctx.lineTo(px, py + cSize);
        ctx.stroke();
      }
    }

    // Typography
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Main Center Label
    ctx.font = 'bold 36px "JetBrains Mono", monospace, sans-serif';
    ctx.fillText('WALL 8x', size / 2, size / 2 - 15);

    ctx.font = 'bold 18px "JetBrains Mono", monospace, sans-serif';
    ctx.fillText('1.0m DEV-GRID', size / 2, size / 2 + 25);

    // Corner Metric Numbers
    ctx.font = 'bold 20px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('8.8', 26, 36);
    ctx.fillText('4.8', 26, size - 32);

    ctx.textAlign = 'right';
    ctx.fillText('1.8', size - 26, 36);
    ctx.fillText('w.', size - 26, size - 32);
  }

  // 2. WALL DARK 4x (Slate gray dev-texture)
  private static _renderWallDark4x(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, size, size);

    // Subtle inner grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.lineWidth = 2;
    const div = 4;
    const step = size / div;
    for (let i = 1; i < div; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size);
      ctx.moveTo(0, i * step); ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    // Outer border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // Crosshairs
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    const cSize = 10;
    for (let x = 0; x <= div; x++) {
      for (let y = 0; y <= div; y++) {
        const px = x * step;
        const py = y * step;
        ctx.beginPath();
        ctx.moveTo(px - cSize, py); ctx.lineTo(px + cSize, py);
        ctx.moveTo(px, py - cSize); ctx.lineTo(px, py + cSize);
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 32px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WALL 4x', size / 2, size / 2 - 12);
    ctx.font = 'bold 16px "JetBrains Mono", monospace, sans-serif';
    ctx.fillText('DARK SLATE', size / 2, size / 2 + 22);

    ctx.font = 'bold 18px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('4.8', 20, 30);
    ctx.textAlign = 'right';
    ctx.fillText('0.8', size - 20, size - 28);
  }

  // 3. FLOOR CHARCOAL 08 (Matching Screenshot 2, 3)
  private static _renderFloorCharcoal08(ctx: CanvasRenderingContext2D, size: number): void {
    // 2x2 Checker pattern
    const half = size / 2;
    ctx.fillStyle = '#161e2e';
    ctx.fillRect(0, 0, half, half);
    ctx.fillRect(half, half, half, half);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(half, 0, half, half);
    ctx.fillRect(0, half, half, half);

    // Inner tile borders
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);
    ctx.beginPath();
    ctx.moveTo(half, 0); ctx.lineTo(half, size);
    ctx.moveTo(0, half); ctx.lineTo(size, half);
    ctx.stroke();

    // 4x4 sub-grid lines
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
    ctx.lineWidth = 1.5;
    const div = 4;
    const step = size / div;
    for (let i = 1; i < div; i++) {
      if (i !== 2) {
        ctx.beginPath();
        ctx.moveTo(i * step, 0); ctx.lineTo(i * step, size);
        ctx.moveTo(0, i * step); ctx.lineTo(size, i * step);
        ctx.stroke();
      }
    }

    // Corner metric labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('0.8m', 12, 12);
    ctx.fillText('0.8m', half + 12, half + 12);

    // Center circular floor crosshair
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(half, half, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(half - 26, half); ctx.lineTo(half + 26, half);
    ctx.moveTo(half, half - 26); ctx.lineTo(half, half + 26);
    ctx.stroke();
  }

  // 4. FLOOR ORANGE STEP / TREAD
  private static _renderFloorOrangeStep(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 0, size, size);

    // Grip lines
    ctx.fillStyle = '#ea580c';
    const barCount = 8;
    const barH = size / (barCount * 2);
    for (let i = 0; i < barCount; i++) {
      ctx.fillRect(0, i * barH * 2, size, barH);
    }

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('STEP 0.25m', size / 2, size / 2);
  }

  // 5. TRIM CAUTION HAZARD STRIPES
  private static _renderTrimCautionHazard(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#eab308'; // Bright safety yellow
    const stripeWidth = 48;
    for (let i = -size; i < size * 2; i += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + stripeWidth, 0);
      ctx.lineTo(i + stripeWidth - size, size);
      ctx.lineTo(i - size, size);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // Hazard text banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(20, size / 2 - 22, size - 40, 44);
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 22px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚠ CAUTION / EDGE', size / 2, size / 2);
  }

  // 6. ACCENT CYAN RAMP
  private static _renderAccentCyanRamp(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, size - 6, size - 6);

    // Directional chevron arrows
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const yOffsets = [size * 0.3, size * 0.5, size * 0.7];
    for (const y of yOffsets) {
      ctx.beginPath();
      ctx.moveTo(size * 0.3, y + 20);
      ctx.lineTo(size * 0.5, y - 15);
      ctx.lineTo(size * 0.7, y + 20);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RAMP 2x', size / 2, size * 0.88);
  }

  // 7. PILLAR CYLINDER GRID
  private static _renderPillarGrid(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 0, size, size);

    // Vertical column bands
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    const cols = 8;
    const stepX = size / cols;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * stepX, 0);
      ctx.lineTo(i * stepX, size);
      ctx.stroke();
    }

    // Horizontal height graduation marks
    const rows = 4;
    const stepY = size / rows;
    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * stepY);
      ctx.lineTo(size, j * stepY);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('COL 8x', size / 2, size / 2);
    ctx.font = 'bold 14px "JetBrains Mono", monospace, sans-serif';
    ctx.fillText('4.0m PILLAR', size / 2, size / 2 + 25);
  }

  // 8. CYBER NEON YELLOW (Screenshot 1 matching)
  private static _renderCyberNeonYellow(ctx: CanvasRenderingContext2D, size: number): void {
    // Deep obsidian
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, size, size);

    // Isometric / Hex dark pattern
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.lineWidth = 1.5;
    const gridDiv = 8;
    const gStep = size / gridDiv;
    for (let i = 1; i < gridDiv; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gStep, 0); ctx.lineTo(i * gStep, size);
      ctx.moveTo(0, i * gStep); ctx.lineTo(size, i * gStep);
      ctx.stroke();
    }

    // Glowing electric yellow outer contour
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, size - 8, size - 8);

    // Inner bright neon accent line
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, size - 20, size - 20);

    // Center laser tick
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    const half = size / 2;
    ctx.beginPath();
    ctx.moveTo(half - 20, half); ctx.lineTo(half + 20, half);
    ctx.moveTo(half, half - 20); ctx.lineTo(half, half + 20);
    ctx.stroke();
  }

  // 9. CYBER NEON LANES (Screenshot 1 matching - Horizontal orange/cyan glow bands)
  private static _renderCyberNeonLanes(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#070a14';
    ctx.fillRect(0, 0, size, size);

    // Top Cyan Glowing Lane
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, size * 0.18, size, 14);
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(0, size * 0.18 + 4, size, 6);

    // Mid Fiery Orange/Red Lane
    ctx.fillStyle = '#f97316';
    ctx.fillRect(0, size * 0.65, size, 16);
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(0, size * 0.65 + 5, size, 6);

    // Vertical red accent edge pillars
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, 10, size);
    ctx.fillRect(size - 10, 0, 10, size);

    // Outer contour
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, size - 4, size - 4);
  }

  // 10. CYBER NEON ARCH (Vault ribs with luminous golden edges)
  private static _renderCyberNeonArch(ctx: CanvasRenderingContext2D, size: number): void {
    ctx.fillStyle = '#040711';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, size - 10, size - 10);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, size - 32, size - 32);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 20px "JetBrains Mono", monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ VAULT RIB', size / 2, size / 2);
  }
}
