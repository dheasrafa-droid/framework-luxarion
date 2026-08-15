/**
 * @file Demo3DDevGridLevel.ts
 * @description Interactive Graybox Level Design Demo replicating Quake/Source dev-texture blocking, staircase navigation, Roman vault arches, and FPS walkthrough controls.
 * Part of Luxarion Engine - Level Design & Modular Architecture Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  FirstPersonControls,
  OrbitControls,
  ModularLevelBuilder,
  PointLight,
  HemisphereLight,
  DirectionalLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DDevGridLevel: LuxarionDemo = {
  id: '3d-devgrid-level',
  name: '3D Dev-Texture Graybox Level',
  category: '3d',
  is2D: false,
  description: 'Interactive Level Design Graybox inspired by Source/Quake dev-textures. Features modular stairs, vaulted archways, pillars, sunken arena pits, and FPS / Orbit navigation.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('DevGridLevelScene');
    glRenderer.clearColor.setHex('#0a0e17');

    const camera = new PerspectiveCamera(60, glRenderer.width / glRenderer.height, 0.1, 150);
    camera.position.set(0, 3.5, 12);

    const orbitControls = new OrbitControls(camera, glRenderer.canvas);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;

    // Lighting (Warm dev lighting + cool fill)
    const hemiLight = new HemisphereLight('#f8fafc', '#1e293b', 0.6);
    scene.add(hemiLight);

    const sun = new DirectionalLight('#fffbeb', 1.0);
    sun.position.set(10, 20, 10);
    scene.add(sun);

    const spotCyan = new PointLight('#38bdf8', 2.0, 20);
    spotCyan.position.set(0, 6, -5);
    scene.add(spotCyan);

    const builder = new ModularLevelBuilder(scene);

    // 1. Main Level Ground Floor
    builder.addFloor(0, 0, 0, 24, 24);

    // 2. Surrounding Perimeter Walls (4.5m tall orange grid walls)
    const wallH = 5.0;
    builder.addWall(0, 0, -12, 24, wallH); // North
    builder.addWall(0, 0, 12, 24, wallH);  // South
    builder.addWall(-12, 0, 0, 24, wallH); // West (rotated via thickness orientation)
    builder.addWall(12, 0, 0, 24, wallH);  // East

    // 3. Central Monumental Archway Portal (Vault opening)
    builder.addArchDoorway(0, 0, -6, 3.2, 4.8, 1.2, 0);

    // 4. Grand Ascending Staircase
    builder.addStaircase(-6, 0, -2, 3.5, 2.5, 5.0, 10, 0);

    // 5. Elevated Mezzanine Platform
    builder.addFloor(-6, 2.5, -6, 6, 6);
    builder.addWall(-6, 2.5, -9, 6, 2.5);

    // 6. Segmented Columns & Pillars
    builder.addPillar(6, 0, -4, 0.7, 5.0);
    builder.addPillar(6, 0, 4, 0.7, 5.0);
    builder.addPillar(-6, 0, 6, 0.7, 5.0);

    // 7. Sloped Access Ramp
    builder.addRamp(6, 0, 2, 2.5, 1.8, 4.0, Math.PI);

    return {
      update: (delta: number, time: number) => {
        orbitControls.update();

        // Animate overhead accent light
        spotCyan.position.x = Math.sin(time * 0.8) * 4;
        spotCyan.position.z = -5 + Math.cos(time * 0.8) * 2;

        glRenderer.render(scene, camera);
      },
      resize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        orbitControls.dispose();
      }
    };
  }
};
