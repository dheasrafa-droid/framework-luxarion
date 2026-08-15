/**
 * @file Demo3DDevGridLevel.ts
 * @description Interactive Graybox Level Design Arena replicating Quake/Source/Unreal Engine dev-texture blocking, sunken pits, stairways, Roman vault arches, and FPS walkthrough controls (Matching Screenshots 2 & 3).
 * Part of Luxarion Engine - Level Design & Modular Architecture Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  ModularLevelBuilder,
  PointLight,
  HemisphereLight,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DDevGridLevel: LuxarionDemo = {
  id: '3d-devgrid-level',
  name: '3D Dev-Texture Graybox Level',
  category: '3d',
  is2D: false,
  description: 'Realistic Level Design Graybox Arena with Triplanar DLEdTk Dev-Textures (WALL 8x, 1.0m metrics, 0.8m floor tiles), sunken arena pit, mezzanine stairs, Roman vault archway, and realistic studio lighting.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('DevGridLevelScene');
    // High-clarity Slate Studio backdrop
    glRenderer.clearColor.setHex('#182234');

    const camera = new PerspectiveCamera(60, glRenderer.width / glRenderer.height, 0.1, 120);
    // Position camera cleanly inside the arena looking toward the grand stairs and archway
    camera.position.set(0, 3.2, 9.0);

    const orbitControls = new OrbitControls(camera, glRenderer.canvas);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.08;
    orbitControls.target.set(0, 1.4, -0.5);

    // ==========================================
    // 1. REALISTIC NATURAL GAME ENGINE LIGHTING
    // ==========================================
    // Hemisphere Light (Sky bounce from above + Dark floor bounce from below)
    const hemiLight = new HemisphereLight('#f1f5f9', '#334155', 0.85);
    scene.add(hemiLight);

    // Soft Ambient fill
    const ambientLight = new AmbientLight('#64748b', 0.25);
    scene.add(ambientLight);

    // Directional Sun Light casting clear dimensional forms
    const sun = new DirectionalLight('#ffffff', 0.95);
    sun.position.set(12, 22, 10);
    scene.add(sun);

    // Warm Interior Point Light inside the Vault Portal
    const vaultLantern = new PointLight('#f97316', 2.8, 14);
    vaultLantern.position.set(0, 2.6, -11.5);
    scene.add(vaultLantern);

    // Cool Accent Fill in the Sunken Pit
    const pitGlow = new PointLight('#38bdf8', 1.6, 10);
    pitGlow.position.set(2.0, 0.5, 0.5);
    scene.add(pitGlow);

    const builder = new ModularLevelBuilder(scene);

    // ==========================================
    // 2. MAIN ENCLOSED ARENA FLOOR (18m x 18m)
    // ==========================================
    builder.addFloor(0, 0, 0, 18, 18, 'floor', 1.0);

    // ==========================================
    // 3. WATERTIGHT PERIMETER ENCLOSING WALLS (4.5m High)
    // ==========================================
    const wallH = 4.5;
    const wallT = 0.4;

    // North Wall with central doorway opening
    builder.addWall(-5.5, 0, -9, 7.0, wallH, wallT, 0, 'orange', 1.0);
    builder.addWall(5.5, 0, -9, 7.0, wallH, wallT, 0, 'orange', 1.0);
    builder.addWall(0, 3.4, -9, 4.0, 1.1, wallT, 0, 'orange', 1.0); // Top lintel

    // South Wall
    builder.addWall(0, 0, 9, 18, wallH, wallT, 0, 'orange', 1.0);

    // West Wall
    builder.addWall(-9, 0, 0, 18, wallH, wallT, Math.PI / 2, 'orange', 1.0);

    // East Wall
    builder.addWall(9, 0, 0, 18, wallH, wallT, Math.PI / 2, 'orange', 1.0);

    // ==========================================
    // 4. BACK VAULTED PORTAL CHAMBER (Through North Arch)
    // ==========================================
    // Archway portal frame at door gap
    builder.addArchDoorway(0, 0, -9, 3.6, 3.8, 0.8, 0, 'orange');

    // Back Chamber Floor & Walls
    builder.addFloor(0, 0, -12.5, 7.0, 7.0, 'floor', 1.0);
    builder.addWall(0, 0, -16, 7.0, wallH, wallT, 0, 'dark', 1.0);
    builder.addWall(-3.5, 0, -12.5, 7.0, wallH, wallT, Math.PI / 2, 'dark', 1.0);
    builder.addWall(3.5, 0, -12.5, 7.0, wallH, wallT, Math.PI / 2, 'dark', 1.0);
    builder.addArchDoorway(0, 0, -13.5, 2.8, 3.2, 0.6, 0, 'orange');

    // ==========================================
    // 5. GRAND STAIRCASE & MEZZANINE (Left Side)
    // ==========================================
    // Elevated Balcony Deck (y = 2.0m, x = -6, z = -4.5)
    builder.addFloor(-6.0, 2.0, -4.5, 5.2, 7.0, 'floor', 1.0);

    // 8-step Grand Staircase leading from ground (z=1.5) up to Mezzanine (z=-1.0)
    builder.addStaircase(-6.0, 0, 1.2, 3.2, 2.0, 4.4, 8, 0, 'step');

    // Mezzanine Protective Balustrade Walls
    builder.addWall(-3.4, 2.0, -4.5, 7.0, 0.9, 0.2, Math.PI / 2, 'dark', 1.0);
    builder.addWall(-6.0, 2.0, -1.0, 5.2, 0.9, 0.2, 0, 'dark', 1.0);

    // Support Pillars under Mezzanine
    builder.addPillar(-3.6, 0, -4.5, 0.4, 2.0, 'pillar');
    builder.addPillar(-3.6, 0, -7.5, 0.4, 2.0, 'pillar');

    // ==========================================
    // 6. SUNKEN COMBAT ARENA PIT (Center Right)
    // ==========================================
    const pitDepth = 1.2;
    const pitW = 5.0;
    const pitD = 5.0;
    const pitX = 2.2;
    const pitZ = 0.5;

    // Sunken Pit Floor
    builder.addFloor(pitX, -pitDepth, pitZ, pitW, pitD, 'floor', 1.0);

    // Pit Retaining Side Walls
    builder.addWall(pitX, -pitDepth, pitZ - pitD / 2, pitW, pitDepth, 0.2, 0, 'dark', 1.0);
    builder.addWall(pitX, -pitDepth, pitZ + pitD / 2, pitW, pitDepth, 0.2, 0, 'dark', 1.0);
    builder.addWall(pitX - pitW / 2, -pitDepth, pitZ, pitD, pitDepth, 0.2, Math.PI / 2, 'dark', 1.0);
    builder.addWall(pitX + pitW / 2, -pitDepth, pitZ, pitD, pitDepth, 0.2, Math.PI / 2, 'dark', 1.0);

    // Descending Stairs into Pit from South
    builder.addStaircase(pitX, -pitDepth, pitZ + pitD / 2 - 0.8, 2.2, pitDepth, 1.6, 4, 0, 'step');

    // Center Pedestal inside Pit
    builder.addHazardCrate(pitX, -pitDepth, pitZ - 0.6, 1.2);

    // ==========================================
    // 7. ANGLED ACCESS RAMP & SNIPER LEDGE (Right Side)
    // ==========================================
    builder.addRamp(6.8, 0, 1.0, 2.4, 1.8, 4.0, Math.PI, 'ramp');
    builder.addFloor(6.8, 1.8, -2.5, 3.2, 3.0, 'floor', 1.0);
    builder.addWall(6.8, 1.8, -4.0, 3.2, 0.9, 0.2, 0, 'dark', 1.0);

    // ==========================================
    // 8. ARCHITECTURAL MONUMENT PILLARS & TEST CRATES
    // ==========================================
    // Cylindrical Column Pillars framing the central arch
    builder.addPillar(-2.2, 0, -4.0, 0.5, wallH, 'pillar');
    builder.addPillar(2.2, 0, -4.0, 0.5, wallH, 'pillar');

    // Stacked Hazard Caution Crates (Tactical cover props)
    builder.addHazardCrate(-2.0, 0, 5.0, 1.2);
    builder.addHazardCrate(-2.0, 1.2, 5.0, 0.9);
    builder.addHazardCrate(5.5, 0, 5.5, 1.0);

    return {
      scene,
      camera,
      controls: orbitControls,
      update: (delta: number, time: number) => {
        orbitControls.update();

        // Subtle atmospheric breathing in the portal lantern
        vaultLantern.intensity = 2.6 + Math.sin(time * 2.5) * 0.4;
        pitGlow.intensity = 1.5 + Math.cos(time * 2.0) * 0.3;

        glRenderer.render(scene, camera);
      },
      onResize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        orbitControls.dispose();
      }
    };
  }
};
