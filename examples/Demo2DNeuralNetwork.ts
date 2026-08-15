/**
 * @file Demo2DNeuralNetwork.ts
 * @description 2D Interactive Neural Synapse Web with proximity-connected nodes, traveling action potential pulses, and mouse synaptic triggers.
 * Built using pure Luxarion barrel export.
 */

import {
  Canvas2DRenderer,
  Vector2,
  Color,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

interface Node2D {
  pos: Vector2;
  vel: Vector2;
  radius: number;
  baseColor: string;
  pulseTimer: number;
  activity: number;
}

interface SynapseSignal {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const Demo2DNeuralNetwork: LuxarionDemo = {
  id: '2d-neural-network',
  name: '2D Neural Synapse Constellation',
  category: '2d',
  is2D: true,
  description: 'Interactive neural network simulation featuring proximity-gated synaptic axon lines, high-speed action potential wave pulses, and mouse forcefield excitation.',
  init: (_, canvas2dRenderer: Canvas2DRenderer | null, themeManager: ThemeManager) => {
    if (!canvas2dRenderer) throw new Error('Canvas2D Renderer required');

    const NODE_COUNT = 90;
    const CONNECTION_DIST = 120;
    const nodes: Node2D[] = [];
    const signals: SynapseSignal[] = [];

    const w = canvas2dRenderer.width;
    const h = canvas2dRenderer.height;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        pos: new Vector2(Math.random() * w, Math.random() * h),
        vel: new Vector2((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2),
        radius: 2.0 + Math.random() * 2.5,
        baseColor: i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#818cf8' : '#ec4899',
        pulseTimer: Math.random() * 5,
        activity: 0.2
      });
    }

    let mousePos = new Vector2(w / 2, h / 2);
    let isMouseDown = false;
    let mouseRadius = 180;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas2dRenderer.canvas.getBoundingClientRect();
      mousePos.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onMouseDown = () => {
      isMouseDown = true;
      // Trigger mass excitation cascade
      nodes.forEach((n, idx) => {
        const d = mousePos.distanceTo(n.pos);
        if (d < mouseRadius * 1.5) {
          n.activity = 1.0;
          for (let j = 0; j < nodes.length; j++) {
            if (idx !== j && n.pos.distanceTo(nodes[j].pos) < CONNECTION_DIST) {
              signals.push({
                fromNode: idx,
                toNode: j,
                progress: 0,
                speed: 2.5 + Math.random() * 2,
                color: themeManager.currentTheme.accent
              });
            }
          }
        }
      });
    };

    const onMouseUp = () => { isMouseDown = false; };

    canvas2dRenderer.canvas.addEventListener('mousemove', onMouseMove);
    canvas2dRenderer.canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return {
      update: (delta: number, time: number) => {
        const theme = themeManager.currentTheme;
        canvas2dRenderer.clearColor.setHex(theme.background);
        canvas2dRenderer.clear();

        const ctx = canvas2dRenderer.ctx;
        const width = canvas2dRenderer.width;
        const height = canvas2dRenderer.height;

        // Ambient Hexagonal/Cartesian grid
        canvas2dRenderer.drawGrid(48, 'rgba(255, 255, 255, 0.03)');

        // 1. Update and integrate node physics
        nodes.forEach((n, i) => {
          n.pos.add(n.vel);

          // Bounce off boundaries
          if (n.pos.x < 10 || n.pos.x > width - 10) n.vel.x *= -1;
          if (n.pos.y < 10 || n.pos.y > height - 10) n.vel.y *= -1;

          // Mouse gravity interaction
          const dMouse = mousePos.distanceTo(n.pos);
          if (dMouse < mouseRadius) {
            const force = (1 - dMouse / mouseRadius) * (isMouseDown ? 4.0 : 1.2);
            const dirX = (mousePos.x - n.pos.x) / dMouse;
            const dirY = (mousePos.y - n.pos.y) / dMouse;
            n.pos.x += dirX * force;
            n.pos.y += dirY * force;
            n.activity = Math.min(1.0, n.activity + force * 0.1);
          }

          // Decay activity
          n.activity = Math.max(0.1, n.activity - delta * 0.8);

          // Spontaneous signal firing
          n.pulseTimer -= delta;
          if (n.pulseTimer <= 0) {
            n.pulseTimer = 3.0 + Math.random() * 4.0;
            n.activity = 0.9;
            // Find closest neighbor
            for (let j = 0; j < nodes.length; j++) {
              if (i !== j && n.pos.distanceTo(nodes[j].pos) < CONNECTION_DIST) {
                signals.push({
                  fromNode: i,
                  toNode: j,
                  progress: 0,
                  speed: 1.8 + Math.random() * 1.5,
                  color: theme.accent
                });
                break;
              }
            }
          }
        });

        // 2. Draw Synaptic Axon Connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = nodes[i].pos.distanceTo(nodes[j].pos);
            if (dist < CONNECTION_DIST) {
              const alpha = (1 - dist / CONNECTION_DIST) * 0.45;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1.0;
              ctx.beginPath();
              ctx.moveTo(nodes[i].pos.x, nodes[i].pos.y);
              ctx.lineTo(nodes[j].pos.x, nodes[j].pos.y);
              ctx.stroke();
            }
          }
        }

        // 3. Update & Draw Action Potential Pulse Signals
        for (let k = signals.length - 1; k >= 0; k--) {
          const sig = signals[k];
          sig.progress += sig.speed * delta;

          if (sig.progress >= 1.0) {
            // Signal reached target! Excite target node
            nodes[sig.toNode].activity = 1.0;
            signals.splice(k, 1);
            continue;
          }

          const from = nodes[sig.fromNode].pos;
          const to = nodes[sig.toNode].pos;
          const curX = from.x + (to.x - from.x) * sig.progress;
          const curY = from.y + (to.y - from.y) * sig.progress;

          ctx.save();
          ctx.fillStyle = theme.accent;
          ctx.shadowColor = theme.accent;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 4. Draw Nodes
        nodes.forEach(n => {
          ctx.save();
          const curRadius = n.radius + n.activity * 3;
          ctx.fillStyle = n.activity > 0.6 ? theme.accent : theme.secondary;
          ctx.shadowColor = theme.accent;
          ctx.shadowBlur = n.activity * 12;

          ctx.beginPath();
          ctx.arc(n.pos.x, n.pos.y, curRadius, 0, Math.PI * 2);
          ctx.fill();

          // Outer halo ring if excited
          if (n.activity > 0.4) {
            ctx.strokeStyle = theme.accent;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(n.pos.x, n.pos.y, curRadius * 1.8, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        });

        // 5. Mouse Interaction Beacon
        ctx.save();
        ctx.strokeStyle = `rgba(56, 189, 248, ${isMouseDown ? '0.8' : '0.3'})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, mouseRadius * (0.8 + Math.sin(time * 3) * 0.05), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      },
      onResize: (newW: number, newH: number) => {
        canvas2dRenderer.setSize(newW, newH);
      },
      dispose: () => {
        canvas2dRenderer.canvas.removeEventListener('mousemove', onMouseMove);
        canvas2dRenderer.canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
      }
    };
  }
};
