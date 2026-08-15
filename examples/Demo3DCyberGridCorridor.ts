/**
 * @file Demo3DCyberGridCorridor.ts
 * @description Neon Grid Wireframe Tunnel & Vault Corridor replicating glowing vector edge lanes and cybernetic pathway aesthetics (Image Reference 1).
 * Part of Luxarion Engine - Level Design Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  ModularLevelBuilder,
  DevGridMaterial,
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
  description: 'Cyberpunk Wireframe Arch Tunnel featuring glowing neon contour lines, multi-color grid levels, and volumetric corridor perspective.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('CyberGridCorridorScene');
    glRenderer.clearColor.setHex('#04060a');

    const camera = new PerspectiveCamera(65, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 1.8, 10);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.8, 0);

    // Glowing Neon lights along corridor
    const hemiLight = new HemisphereLight('#0284c7', '#0f172a', 0.4);
    scene.add(hemiLight);

    const redLight = new PointLight('#ef4444', 3.0, 15);
    redLight.position.set(-2.5, 2.0, 2.0);
    scene.add(redLight);

    const cyanLight = new PointLight('#06b6d4', 3.0, 15);
    cyanLight.position.set(2.5, 2.0, -2.0);
    scene.add(cyanLight);

    const builder = new ModularLevelBuilder(scene);
    builder.wallMaterial = new DevGridMaterial({ style: 'neon', gridScale: 1.0 });
    builder.floorMaterial = new DevGridMaterial({ style: 'neon', gridScale: 1.0 });
    builder.accentMaterial = new DevGridMaterial({ style: 'neon', gridScale: 1.0 });

    // Build Long Vaulted Corridor
    const corridorLength = 6;
    for (let i = 0; i < corridorLength; i++) {
      const z = (i - corridorLength / 2) * 3.5;

      // Floor section
      builder.addFloor(0, 0, z, 5.0, 3.5);

      // Left & Right Walls
      builder.addWall(-2.5, 0, z, 3.5, 3.8);
      builder.addWall(2.5, 0, z, 3.5, 3.8);

      // Arch Gateway Ribs
      builder.addArchDoorway(0, 0, z, 4.8, 3.8, 0.6);
    }

    return {
      update: (delta: number, time: number) => {
        controls.update();

        // Pulsing glowing lane lights
        redLight.intensity = 2.5 + Math.sin(time * 3.0) * 1.0;
        cyanLight.intensity = 2.5 + Math.cos(time * 3.0) * 1.0;

        glRenderer.render(scene, camera);
      },
      resize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        controls.dispose();
      }
    };
  }
};
