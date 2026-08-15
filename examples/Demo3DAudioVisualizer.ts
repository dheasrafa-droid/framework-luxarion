/**
 * @file Demo3DAudioVisualizer.ts
 * @description 3D Frequency Matrix Audio Visualizer with 81 procedural monolith columns, harmonic wave resonance, and central bass pulsar.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  BoxGeometry,
  IcosahedronGeometry,
  TorusGeometry,
  PhongMaterial,
  HologramMaterial,
  WireframeMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  DirectionalLight,
  Color,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DAudioVisualizer: LuxarionDemo = {
  id: '3d-audio-visualizer',
  name: '3D Harmonic Frequency Equalizer',
  category: 'audio',
  description: '81-monolith parametric equalizer lattice responding to multi-band harmonic frequencies, ripple wave propagation, and a central holographic sub-bass pulsar.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('AudioVisualizerScene');
    const theme = themeManager.currentTheme;
    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(10, 9, 12);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 4;
    controls.maxDistance = 30;

    // Lighting
    const amb = new AmbientLight(theme.ambientLight, 0.4);
    scene.add(amb);

    const dirLight = new DirectionalLight(theme.dirLight, 0.9);
    dirLight.position.set(5, 12, 6);
    scene.add(dirLight);

    const pointLight = new PointLight(theme.pointLight, 2.5, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    // Central Hologram Sub-bass Orb
    const coreGeo = new IcosahedronGeometry(1.2);
    const coreMat = new HologramMaterial({
      color: theme.accent,
      fresnelPower: 1.6,
      scanlineDensity: 28.0,
      glitchIntensity: 0.6
    });
    const coreMesh = new Object3D(coreGeo, coreMat, 'AudioCorePulsar');
    coreMesh.position.y = 2.5;
    scene.add(coreMesh);

    // Bass Ring Halo
    const ringGeo = new TorusGeometry(2.0, 0.05, 16, 48);
    const ringMat = new WireframeMaterial({
      color: theme.secondary,
      opacity: 0.8
    });
    const ringMesh = new Object3D(ringGeo, ringMat, 'PulsarHaloRing');
    ringMesh.position.y = 2.5;
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);

    // 9x9 Monolith Column Grid
    const GRID_SIZE = 9;
    const SPACING = 0.9;
    const OFFSET = ((GRID_SIZE - 1) * SPACING) / 2;

    const columnGeo = new BoxGeometry(0.65, 1.0, 0.65);
    const columns: {
      mesh: Object3D;
      mat: PhongMaterial;
      gridX: number;
      gridZ: number;
      distFromCenter: number;
    }[] = [];

    const baseColor = new Color().setHex(theme.accent);
    const peakColor = new Color().setHex(theme.secondary);

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const posX = x * SPACING - OFFSET;
        const posZ = z * SPACING - OFFSET;
        const dist = Math.sqrt(posX * posX + posZ * posZ);

        const colMat = new PhongMaterial({
          color: theme.accent,
          specular: '#ffffff',
          shininess: 70
        });

        const mesh = new Object3D(columnGeo, colMat, `Column_${x}_${z}`);
        mesh.position.set(posX, 0, posZ);
        scene.add(mesh);

        columns.push({
          mesh,
          mat: colMat,
          gridX: x,
          gridZ: z,
          distFromCenter: dist
        });
      }
    }

    return {
      scene,
      camera,
      controls,
      update: (_delta: number, time: number) => {
        controls.update();

        // 1. Compute multi-harmonic synthetic audio signals
        const bassFreq = Math.sin(time * 3.5) * 0.5 + 0.5; // low bass kick
        const midFreq = Math.sin(time * 6.0) * 0.35 + 0.35; // snare & mids
        const highFreq = Math.cos(time * 12.0) * 0.2 + 0.2; // hi-hat / trebles

        // 2. Animate central pulsar
        coreMat.updateUniforms(time);
        const coreScale = 1.0 + bassFreq * 0.6;
        coreMesh.scale.set(coreScale, coreScale, coreScale);
        coreMesh.rotation.y = time * 1.5;
        coreMesh.rotation.x = time * 0.8;

        ringMesh.scale.set(1.0 + midFreq * 0.8, 1.0 + midFreq * 0.8, 1.0);
        ringMesh.rotation.z = time * 2.0;

        // Point light moves in rhythm
        pointLight.position.y = 2.5 + Math.sin(time * 4.0) * 1.5;

        // 3. Update columns based on synthetic frequency spectrum & circular wave ripples
        columns.forEach(({ mesh, mat, distFromCenter }, idx) => {
          // Circular wave propagation from center + cross-cutting high frequency ripples
          const wavePhase = time * 4.0 - distFromCenter * 1.4;
          const ripple = Math.sin(wavePhase);

          const harmonicHeight =
            0.2 +
            bassFreq * Math.max(0, 1 - distFromCenter / 4.0) * 3.5 +
            Math.max(0, ripple) * (1.8 + midFreq * 1.5) +
            highFreq * Math.sin(time * 8.0 + idx) * 0.5;

          const finalHeight = Math.max(0.1, harmonicHeight);

          mesh.scale.y = finalHeight;
          mesh.position.y = finalHeight / 2; // Keep base anchored on floor

          // Color interpolation based on height peak
          const heightRatio = Math.min(1.0, finalHeight / 4.0);
          mat.color.copy(baseColor).lerp(peakColor, heightRatio);
        });

        const curTheme = themeManager.currentTheme;
        glRenderer.clearColor.setHex(curTheme.background);
      },
      onResize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        controls.dispose();
        scene.clear();
      }
    };
  }
};
