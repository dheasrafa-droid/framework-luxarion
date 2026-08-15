/**
 * @file Demo3DCyberGridCorridor.ts
 * @description Neon Grid Wireframe Tunnel & Vault Corridor replicating glowing vector edge lanes and cybernetic pathway aesthetics (Matching Screenshot 1).
 * Part of Luxarion Engine - Level Design & Cyberpunk Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  ModularLevelBuilder,
  PointLight,
  HemisphereLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DCyberGridCorridor: LuxarionDemo = {
  id: '3d-cybergrid-corridor',
  name: '3D Cyber Neon Grid Corridor',
  category: '3d',
  is2D: false,
  description: 'Cyberpunk Wireframe Arch Tunnel inspired by vector display aesthetics. Features glowing neon yellow floor tracks, cyan & orange wall lanes, red vertical posts, and sequential arch rib portals.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('CyberGridCorridorScene');
    glRenderer.clearColor.setHex('#030509');

    const camera = new PerspectiveCamera(65, glRenderer.width / glRenderer.height, 0.1, 120);
    camera.position.set(0, 1.9, 12);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.9, 0);

    // Dynamic Multi-Color Neon Point Lights along the tunnel
    const hemiLight = new HemisphereLight('#0284c7', '#020617', 0.5);
    scene.add(hemiLight);

    const redLight = new PointLight('#ef4444', 3.5, 18);
    redLight.position.set(-2.8, 2.2, 4.0);
    scene.add(redLight);

    const cyanLight = new PointLight('#06b6d4', 3.5, 18);
    cyanLight.position.set(2.8, 2.2, -4.0);
    scene.add(cyanLight);

    const yellowLight = new PointLight('#eab308', 3.0, 16);
    yellowLight.position.set(0, 3.8, 0);
    scene.add(yellowLight);

    const builder = new ModularLevelBuilder(scene);

    // Build Sequential Long Vaulted Corridor (8 repeating segments)
    const corridorSegments = 10;
    const segmentLength = 3.6;
    const tunnelWidth = 5.6;
    const tunnelHeight = 4.2;

    for (let i = 0; i < corridorSegments; i++) {
      const z = (i - corridorSegments / 2) * segmentLength;

      // 1. Floor with Neon Yellow Border Contours
      builder.addFloor(0, 0, z, tunnelWidth, segmentLength, 'neon_yellow', 1);

      // 2. Left & Right Walls with Cyan & Orange Neon Glow Lanes
      builder.addWall(-tunnelWidth / 2, 0, z, segmentLength, tunnelHeight, 0.3, Math.PI / 2, 'neon_lanes', 1);
      builder.addWall(tunnelWidth / 2, 0, z, segmentLength, tunnelHeight, 0.3, Math.PI / 2, 'neon_lanes', 1);

      // 3. Vault Arch Rib Portals with Luminous Golden Edges
      builder.addArchDoorway(0, 0, z, tunnelWidth - 0.2, tunnelHeight, 0.6, 0, 'neon_arch');

      // 4. Ceiling Plafond
      builder.addFloor(0, tunnelHeight, z, tunnelWidth, segmentLength, 'neon_yellow', 1);
    }

    // End Portal Chamber
    const endZ = -(corridorSegments / 2 + 1) * segmentLength;
    builder.addWall(0, 0, endZ, tunnelWidth * 2, tunnelHeight * 1.5, 0.4, 0, 'neon_lanes', 2);
    builder.addArchDoorway(0, 0, endZ + 1, tunnelWidth, tunnelHeight * 1.2, 0.8, 0, 'neon_arch');

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Pulsing / Travelling glowing light pulses along the tunnel
        redLight.position.z = 6.0 + Math.sin(time * 1.5) * 8.0;
        cyanLight.position.z = -6.0 + Math.cos(time * 1.5) * 8.0;
        yellowLight.position.z = Math.sin(time * 2.0) * 10.0;

        redLight.intensity = 2.8 + Math.sin(time * 3.0) * 1.2;
        cyanLight.intensity = 2.8 + Math.cos(time * 3.0) * 1.2;

        glRenderer.render(scene, camera);
      },
      onResize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        controls.dispose();
      }
    };
  }
};
