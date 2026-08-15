/**
 * @file Demo2DBlackHole.ts
 * @description 2D Relativistic Black Hole & Accretion Disk Physics Simulation with Doppler beaming, photon sphere, and Keplerian orbital dynamics.
 * Built using pure Luxarion barrel export.
 */

import {
  Canvas2DRenderer,
  Vector2,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

interface AccretionParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  baseHue: number;
  alpha: number;
}

export const Demo2DBlackHole: LuxarionDemo = {
  id: '2d-black-hole',
  name: '2D Relativistic Black Hole & Accretion Disk',
  category: 'simulation',
  is2D: true,
  description: 'General relativistic gravitational singularity simulation featuring Keplerian orbital velocities, Doppler beaming chromatic shifts, and an interactive photon sphere horizon.',
  init: (_, canvas2dRenderer: Canvas2DRenderer | null, themeManager: ThemeManager) => {
    if (!canvas2dRenderer) throw new Error('Canvas2D Renderer required');

    const w = canvas2dRenderer.width;
    const h = canvas2dRenderer.height;

    let singularity = new Vector2(w / 2, h / 2);
    const EVENT_HORIZON_RADIUS = 36;
    const PHOTON_SPHERE_RADIUS = 54;
    const ACCRETION_OUTER_RADIUS = 280;
    const PARTICLE_COUNT = 380;

    const particles: AccretionParticle[] = [];

    const initParticle = (p?: AccretionParticle): AccretionParticle => {
      const r = EVENT_HORIZON_RADIUS * 1.2 + Math.random() * (ACCRETION_OUTER_RADIUS - EVENT_HORIZON_RADIUS);
      // Keplerian speed: v ~ 1 / sqrt(r)
      const orbitalSpeed = (32.0 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);

      if (p) {
        p.angle = Math.random() * Math.PI * 2;
        p.radius = r;
        p.speed = orbitalSpeed;
        p.size = 1.0 + Math.random() * 2.2;
        p.baseHue = 200 + Math.random() * 60;
        p.alpha = 0.4 + Math.random() * 0.6;
        return p;
      }

      return {
        angle: Math.random() * Math.PI * 2,
        radius: r,
        speed: orbitalSpeed,
        size: 1.0 + Math.random() * 2.2,
        baseHue: 200 + Math.random() * 60,
        alpha: 0.4 + Math.random() * 0.6
      };
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(initParticle());
    }

    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      const rect = canvas2dRenderer.canvas.getBoundingClientRect();
      singularity.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvas2dRenderer.canvas.getBoundingClientRect();
        singularity.set(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    const onMouseUp = () => { isDragging = false; };

    canvas2dRenderer.canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return {
      update: (delta: number, time: number) => {
        const theme = themeManager.currentTheme;
        canvas2dRenderer.clearColor.setHex(theme.background);
        canvas2dRenderer.clear();

        const ctx = canvas2dRenderer.ctx;

        // Draw Gravitational Lensing Grid Warping
        canvas2dRenderer.drawGrid(40, 'rgba(255, 255, 255, 0.02)');

        // 1. Draw Outer Gravitational Lensing Distortion Rings
        ctx.save();
        for (let ring = 1; ring <= 4; ring++) {
          const rRing = PHOTON_SPHERE_RADIUS * (1.2 + ring * 0.8);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 / ring})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(singularity.x, singularity.y, rRing, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();

        // 2. Update and Draw Accretion Disk Particles with Doppler Beaming
        particles.forEach(p => {
          // Relativistic acceleration as particle drifts inwards
          p.angle += p.speed * delta;
          p.radius -= delta * 3.5; // slow spiral into event horizon

          // Recycle particle if it crosses Event Horizon
          if (p.radius <= EVENT_HORIZON_RADIUS) {
            initParticle(p);
            p.radius = ACCRETION_OUTER_RADIUS;
          }

          // Convert polar coordinates to Cartesian
          // Elliptical inclination tilt for 3D accretion disk perspective
          const cosA = Math.cos(p.angle);
          const sinA = Math.sin(p.angle);
          const tiltY = 0.45; // 3D tilt factor

          const px = singularity.x + cosA * p.radius;
          const py = singularity.y + sinA * (p.radius * tiltY);

          // Doppler Beaming Effect:
          // Particles moving towards the observer (approaching on left side) are blueshifted and brighter
          // Particles moving away (receding on right side) are redshifted and dimmer
          const velocityTowardsObserver = -sinA;
          const dopplerShift = (velocityTowardsObserver + 1.0) / 2.0; // 0 to 1

          let colorStr: string;
          if (dopplerShift > 0.5) {
            // Blueshifted (Cyan -> Violet / White)
            const brightness = 0.6 + dopplerShift * 0.4;
            colorStr = `rgba(56, 189, 248, ${p.alpha * brightness})`;
          } else {
            // Redshifted (Amber -> Deep Orange)
            const brightness = 0.3 + dopplerShift * 0.5;
            colorStr = `rgba(249, 115, 22, ${p.alpha * brightness})`;
          }

          ctx.save();
          ctx.fillStyle = colorStr;
          ctx.shadowColor = dopplerShift > 0.5 ? '#38bdf8' : '#f97316';
          ctx.shadowBlur = p.size * (1.5 + dopplerShift * 3.0);

          ctx.beginPath();
          ctx.arc(px, py, p.size * (0.8 + dopplerShift * 0.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // 3. Draw Photon Sphere Glowing Halo
        ctx.save();
        const photonGradient = ctx.createRadialGradient(
          singularity.x,
          singularity.y,
          EVENT_HORIZON_RADIUS,
          singularity.x,
          singularity.y,
          PHOTON_SPHERE_RADIUS * 1.5
        );
        photonGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        photonGradient.addColorStop(0.2, 'rgba(56, 189, 248, 0.7)');
        photonGradient.addColorStop(0.6, 'rgba(236, 72, 153, 0.3)');
        photonGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = photonGradient;
        ctx.beginPath();
        ctx.arc(singularity.x, singularity.y, PHOTON_SPHERE_RADIUS * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Draw Event Horizon (Total Absolute Black Hole Singularity)
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(singularity.x, singularity.y, EVENT_HORIZON_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Inner shadow edge
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // 5. Relativistic Polar Jet Emission Flares
        ctx.save();
        const jetHeight = 140 + Math.sin(time * 8) * 20;
        const jetGradientTop = ctx.createLinearGradient(
          singularity.x,
          singularity.y,
          singularity.x,
          singularity.y - jetHeight
        );
        jetGradientTop.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
        jetGradientTop.addColorStop(0.7, 'rgba(129, 140, 248, 0.3)');
        jetGradientTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = jetGradientTop;
        ctx.beginPath();
        ctx.moveTo(singularity.x - 4, singularity.y - EVENT_HORIZON_RADIUS);
        ctx.lineTo(singularity.x + 4, singularity.y - EVENT_HORIZON_RADIUS);
        ctx.lineTo(singularity.x + 12, singularity.y - jetHeight);
        ctx.lineTo(singularity.x - 12, singularity.y - jetHeight);
        ctx.closePath();
        ctx.fill();

        const jetGradientBottom = ctx.createLinearGradient(
          singularity.x,
          singularity.y,
          singularity.x,
          singularity.y + jetHeight
        );
        jetGradientBottom.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
        jetGradientBottom.addColorStop(0.7, 'rgba(129, 140, 248, 0.3)');
        jetGradientBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = jetGradientBottom;
        ctx.beginPath();
        ctx.moveTo(singularity.x - 4, singularity.y + EVENT_HORIZON_RADIUS);
        ctx.lineTo(singularity.x + 4, singularity.y + EVENT_HORIZON_RADIUS);
        ctx.lineTo(singularity.x + 12, singularity.y + jetHeight);
        ctx.lineTo(singularity.x - 12, singularity.y + jetHeight);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
      onResize: (newW: number, newH: number) => {
        canvas2dRenderer.setSize(newW, newH);
        singularity.set(newW / 2, newH / 2);
      },
      dispose: () => {
        canvas2dRenderer.canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
    };
  }
};
