/**
 * @file Demo2DParticleVortex.ts
 * @description 2D Kinetic Particle Vortex and Fluid Grid simulation powered by Canvas2DRenderer & ParticleSystem.
 * Built using pure Luxarion barrel export.
 */

import {
  Canvas2DRenderer,
  ParticleSystem,
  Vector2,
  Color,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo2DParticleVortex: LuxarionDemo = {
  id: '2d-particle-vortex',
  name: '2D Kinetic Particle Vortex',
  category: '2d',
  description: 'High-performance 2D fluid particle vortex with gravitational attractor, radial color grading, and mouse-reactive velocity fields.',
  init: (_, canvas2dRenderer: Canvas2DRenderer | null, themeManager: ThemeManager) => {
    if (!canvas2dRenderer) throw new Error('Canvas2D Renderer required');

    const particleSystem = new ParticleSystem(800);
    particleSystem.baseSpeed = 3.5;
    particleSystem.swirlForce = 2.0;

    let mousePos = new Vector2(canvas2dRenderer.width / 2, canvas2dRenderer.height / 2);
    let isMouseDown = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas2dRenderer.canvas.getBoundingClientRect();
      mousePos.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseDown = () => { isMouseDown = true; };
    const onMouseUp = () => { isMouseDown = false; };

    canvas2dRenderer.canvas.addEventListener('mousemove', onMouseMove);
    canvas2dRenderer.canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return {
      update: (delta: number, _time: number) => {
        const theme = themeManager.currentTheme;
        canvas2dRenderer.clearColor.setHex(theme.background);
        canvas2dRenderer.clear();

        // Draw Ambient Technical Grid
        canvas2dRenderer.drawGrid(40, 'rgba(255, 255, 255, 0.04)');

        // Emitter follows mouse or center
        particleSystem.emitterPosition.set(mousePos.x, mousePos.y, 0);

        const startColor = new Color().setHex(theme.accent);
        const endColor = new Color().setHex(theme.secondary);

        const emitRate = isMouseDown ? 12 : 5;
        particleSystem.emit(emitRate, startColor, endColor);
        particleSystem.update(delta);

        // Render Particles
        canvas2dRenderer.renderParticles2D(particleSystem);

        // Draw Interactive Central Forcefield Reticle
        const ctx = canvas2dRenderer.ctx;
        ctx.save();
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = theme.secondary;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      },
      onResize: (w: number, h: number) => {
        canvas2dRenderer.setSize(w, h);
      },
      dispose: () => {
        canvas2dRenderer.canvas.removeEventListener('mousemove', onMouseMove);
        canvas2dRenderer.canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        particleSystem.clear();
      }
    };
  }
};
