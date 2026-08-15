/**
 * @file Demo2DVectorFlowField.ts
 * @description 2D Simplex Vector Flow Field particle simulation with dynamic force vector interpolation and chromatic trail persistence.
 * Built using pure Luxarion barrel export.
 */

import {
  Canvas2DRenderer,
  Vector2,
  Noise,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

interface FlowParticle {
  pos: Vector2;
  vel: Vector2;
  acc: Vector2;
  maxSpeed: number;
  prevPos: Vector2;
  hue: number;
  alpha: number;
}

export const Demo2DVectorFlowField: LuxarionDemo = {
  id: '2d-vector-flow-field',
  name: '2D Simplex Vector Flow Field',
  category: 'simulation',
  is2D: true,
  description: 'Multi-octave Simplex Noise vector flow field simulating 1,200 organic fluid streamlines with chromatic color gradients and trail decay.',
  init: (_, canvas2dRenderer: Canvas2DRenderer | null, themeManager: ThemeManager) => {
    if (!canvas2dRenderer) throw new Error('Canvas2D Renderer required');

    let w = canvas2dRenderer.width;
    let h = canvas2dRenderer.height;

    const PARTICLE_COUNT = 900;
    const particles: FlowParticle[] = [];
    const scale = 0.0035;

    const initParticle = (p?: FlowParticle): FlowParticle => {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (p) {
        p.pos.set(x, y);
        p.prevPos.set(x, y);
        p.vel.set(0, 0);
        p.acc.set(0, 0);
        p.maxSpeed = 2.0 + Math.random() * 2.5;
        p.hue = (x / w) * 120 + 160;
        p.alpha = 0.6 + Math.random() * 0.4;
        return p;
      }

      return {
        pos: new Vector2(x, y),
        prevPos: new Vector2(x, y),
        vel: new Vector2(0, 0),
        acc: new Vector2(0, 0),
        maxSpeed: 2.0 + Math.random() * 2.5,
        hue: (x / w) * 120 + 160,
        alpha: 0.6 + Math.random() * 0.4
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(initParticle());
    }

    let isDisposed = false;

    return {
      update: (delta: number, time: number) => {
        if (isDisposed) return;
        const ctx = canvas2dRenderer.ctx;

        // Subtle dark translucent background clear for long glowing streaks
        ctx.fillStyle = 'rgba(6, 9, 20, 0.06)';
        ctx.fillRect(0, 0, w, h);

        ctx.lineWidth = 1.4;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Compute angle from 3D Simplex Noise (time forms the Z axis)
          const angle = Noise.noise3D(p.pos.x * scale, p.pos.y * scale, time * 0.2) * Math.PI * 4;

          p.acc.x = Math.cos(angle) * 0.6;
          p.acc.y = Math.sin(angle) * 0.6;

          p.vel.add(p.acc);

          // Clamp speed
          const speedSq = p.vel.lengthSq();
          if (speedSq > p.maxSpeed * p.maxSpeed) {
            p.vel.normalize().multiplyScalar(p.maxSpeed);
          }

          p.pos.add(p.vel);
          p.acc.set(0, 0);

          // Draw Streamline Segment
          ctx.strokeStyle = `hsla(${p.hue + (time * 15) % 80}, 90%, 60%, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.moveTo(p.prevPos.x, p.prevPos.y);
          ctx.lineTo(p.pos.x, p.pos.y);
          ctx.stroke();

          p.prevPos.copy(p.pos);

          // Respawn on bounds exit
          if (p.pos.x < 0 || p.pos.x > w || p.pos.y < 0 || p.pos.y > h) {
            initParticle(p);
          }
        }
      },
      onResize: (newW: number, newH: number) => {
        w = newW;
        h = newH;
      },
      dispose: () => {
        isDisposed = true;
        particles.length = 0;
      }
    };
  }
};
