/**
 * @file Demo3DCyberTunnel.ts
 * @description 3D Infinite Warp Cyber Tunnel with concentric holographic energy gates, forward velocity flight, and chromatic horizon singularity.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  TorusGeometry,
  BoxGeometry,
  CylinderGeometry,
  HologramMaterial,
  WireframeMaterial,
  PhongMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DCyberTunnel: LuxarionDemo = {
  id: '3d-cyber-tunnel',
  name: '3D Hyperspace Warp Tunnel',
  category: 'matrix',
  description: 'High-speed infinite warp tunnel flight through 32 concentric holographic vector rings with dynamic horizon focal acceleration and glitch distortions.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('WarpTunnelScene');
    const theme = themeManager.currentTheme;
    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(65, glRenderer.width / glRenderer.height, 0.1, 120);
    camera.position.set(0, 0, 5);

    // Light
    const amb = new AmbientLight(theme.ambientLight, 0.5);
    scene.add(amb);

    const headLight = new PointLight(theme.accent, 2.5, 30);
    headLight.position.set(0, 0, 4);
    scene.add(headLight);

    // 32 Tunnel Rings
    const RING_COUNT = 32;
    const RING_SPACING = 2.5;
    const TUNNEL_LENGTH = RING_COUNT * RING_SPACING;

    const ringGeo = new TorusGeometry(3.0, 0.08, 16, 36);
    const ringMat = new HologramMaterial({
      color: theme.accent,
      fresnelPower: 1.8,
      scanlineDensity: 24.0,
      glitchIntensity: 0.5
    });

    const rings: Object3D[] = [];
    for (let i = 0; i < RING_COUNT; i++) {
      const ring = new Object3D(ringGeo, ringMat, `TunnelRing_${i}`);
      ring.position.z = -i * RING_SPACING;
      rings.push(ring);
      scene.add(ring);
    }

    // Outer Hexagonal Guide Struts
    const strutGeo = new CylinderGeometry(0.04, 0.04, TUNNEL_LENGTH, 8, 1);
    const strutMat = new WireframeMaterial({
      color: theme.secondary,
      opacity: 0.6
    });

    const STRUT_COUNT = 6;
    for (let i = 0; i < STRUT_COUNT; i++) {
      const angle = (i / STRUT_COUNT) * Math.PI * 2;
      const radius = 3.0;
      const strut = new Object3D(strutGeo, strutMat, `Strut_${i}`);
      strut.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -TUNNEL_LENGTH / 2 + 5);
      strut.rotation.x = Math.PI / 2;
      scene.add(strut);
    }

    // Floating Data Bit Cubes
    const bitGeo = new BoxGeometry(0.2, 0.2, 0.8);
    const bits: { mesh: Object3D; speed: number; rotSpeed: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const bMat = new PhongMaterial({
        color: i % 2 === 0 ? theme.accent : theme.pointLight,
        specular: '#ffffff',
        shininess: 90
      });
      const bit = new Object3D(bitGeo, bMat, `DataBit_${i}`);
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 1.5;
      bit.position.set(Math.cos(angle) * r, Math.sin(angle) * r, -Math.random() * TUNNEL_LENGTH);
      scene.add(bit);
      bits.push({
        mesh: bit,
        speed: 10 + Math.random() * 8,
        rotSpeed: 2 + Math.random() * 3
      });
    }

    let forwardVelocity = 12.0;

    return {
      scene,
      camera,
      update: (delta: number, time: number) => {
        ringMat.updateUniforms(time);

        // Camera banking and subtle corkscrew flight roll
        camera.position.x = Math.sin(time * 0.8) * 0.4;
        camera.position.y = Math.cos(time * 0.6) * 0.3;
        camera.rotation.z = Math.sin(time * 0.5) * 0.15;

        // Move rings towards camera and recycle
        rings.forEach((ring, idx) => {
          ring.position.z += forwardVelocity * delta;

          // Twisting wave on each ring
          ring.rotation.z = time * 0.8 + idx * 0.15;
          const pulse = 1.0 + Math.sin(time * 3 + idx * 0.3) * 0.08;
          ring.scale.set(pulse, pulse, 1);

          // Recycle ring to back when it passes camera
          if (ring.position.z > 6) {
            ring.position.z -= TUNNEL_LENGTH;
          }
        });

        // Animate Data Bits
        bits.forEach(({ mesh, speed, rotSpeed }) => {
          mesh.position.z += speed * delta;
          mesh.rotation.z += rotSpeed * delta;
          if (mesh.position.z > 6) {
            mesh.position.z -= TUNNEL_LENGTH;
          }
        });

        const curTheme = themeManager.currentTheme;
        glRenderer.clearColor.setHex(curTheme.background);
      },
      onResize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        scene.clear();
      }
    };
  }
};
