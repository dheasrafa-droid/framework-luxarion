/**
 * @file Canvas2DRenderer.ts
 * @description High-DPI 2D Canvas engine with vector primitives, glowing forcefields, grid lines, and particle trails.
 * Part of Luxarion Engine - Single Responsibility: 2D Canvas Graphics Pipeline.
 */

import { Object2D } from '../core/Object2D';
import { ParticleSystem } from '../particles/ParticleSystem';
import { Color } from '../math/Color';

export class Canvas2DRenderer {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public width: number = 800;
  public height: number = 600;
  public pixelRatio: number = 1;
  public clearColor: Color = new Color(0.03, 0.04, 0.07, 1);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Luxarion: Unable to get 2D Canvas context.');
    this.ctx = context;
    this.pixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
  }

  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  public clear(): void {
    this.ctx.fillStyle = this.clearColor.toCSSString();
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public drawGrid(spacing: number = 30, color: string = 'rgba(255,255,255,0.05)'): void {
    const ctx = this.ctx;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let x = 0; x <= this.width; x += spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  public renderObject2D(obj: Object2D): void {
    if (!obj.visible) return;

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = obj.opacity;
    ctx.translate(obj.position.x, obj.position.y);
    ctx.rotate(obj.rotation.z);
    ctx.scale(obj.scale.x, obj.scale.y);

    ctx.fillStyle = obj.fillStyle;
    ctx.strokeStyle = obj.strokeStyle;
    ctx.lineWidth = obj.lineWidth;

    if (obj.shapeType === 'rect') {
      const halfW = obj.size.x / 2;
      const halfH = obj.size.y / 2;
      ctx.fillRect(-halfW, -halfH, obj.size.x, obj.size.y);
      if (obj.lineWidth > 0) ctx.strokeRect(-halfW, -halfH, obj.size.x, obj.size.y);
    } else if (obj.shapeType === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, obj.size.x / 2, 0, Math.PI * 2);
      ctx.fill();
      if (obj.lineWidth > 0) ctx.stroke();
    } else if (obj.shapeType === 'polygon' && obj.points.length > 2) {
      ctx.beginPath();
      ctx.moveTo(obj.points[0].x, obj.points[0].y);
      for (let i = 1; i < obj.points.length; i++) {
        ctx.lineTo(obj.points[i].x, obj.points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      if (obj.lineWidth > 0) ctx.stroke();
    } else if (obj.shapeType === 'text') {
      ctx.font = obj.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.text, 0, 0);
    }

    ctx.restore();
  }

  public renderParticles2D(particleSystem: ParticleSystem): void {
    const ctx = this.ctx;
    const particles = particleSystem.particles;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.save();
      ctx.fillStyle = `rgba(${Math.round(p.color.r * 255)}, ${Math.round(p.color.g * 255)}, ${Math.round(p.color.b * 255)}, ${p.alpha})`;
      ctx.shadowColor = `rgba(${Math.round(p.color.r * 255)}, ${Math.round(p.color.g * 255)}, ${Math.round(p.color.b * 255)}, 0.8)`;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
