/**
 * @file Demo3DProceduralTerrain.ts
 * @description Dynamic Procedural 3D Terrain mesh with real-time Simplex noise elevation, wave deformation, and surface normal recomputation.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  ProceduralTerrainGeometry,
  PhongMaterial,
  WireframeMaterial,
  Object3D,
  AmbientLight,
  DirectionalLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DProceduralTerrain: LuxarionDemo = {
  id: '3d-procedural-terrain',
  name: '3D Procedural Terrain & Wave Matrix',
  category: 'space',
  is2D: false,
  description: 'Infinite animated terrain elevation mesh generated via multi-octave Simplex Noise with real-time vertex normal recalculation and dual-layer wireframe grid.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('ProceduralTerrainScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 5, 8);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.minDistance = 3;
    controls.maxDistance = 20;

    // Lighting
    const ambientLight = new AmbientLight('#0f172a', 0.6);
    scene.add(ambientLight);

    const sunLight = new DirectionalLight('#38bdf8', 1.8);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    // 1. Procedural Terrain Grid (45 x 45 segments = 2116 vertices)
    const terrainGeo = new ProceduralTerrainGeometry(12, 12, 44, 44);
    const terrainMat = new PhongMaterial({
      color: '#0284c7',
      specular: '#38bdf8',
      shininess: 60
    });
    terrainMat.side = 'double';
    const terrainMesh = new Object3D(terrainGeo, terrainMat);
    scene.add(terrainMesh);

    // 2. Wireframe Overlay Mesh
    const wireMat = new WireframeMaterial({ color: '#38bdf8', opacity: 0.45 });
    const wireMesh = new Object3D(terrainGeo, wireMat);
    wireMesh.position.y = 0.02;
    scene.add(wireMesh);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Realtime Procedural Noise Displacement on vertex buffers
        terrainGeo.updateElevation(time, 0.35, 1.1);

        // Slow cinematic terrain rotation
        terrainMesh.rotateY(delta * 0.05);
        wireMesh.rotation.y = terrainMesh.rotation.y;

        // Dynamic Sun light orbit
        sunLight.position.x = Math.cos(time * 0.4) * 8;
        sunLight.position.z = Math.sin(time * 0.4) * 8;
      },
      onResize: (width: number, height: number) => {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      },
      onThemeChange: (theme) => {
        glRenderer.clearColor.setHex(theme.background);
      },
      dispose: () => {
        controls.dispose();
        scene.clear();
      }
    };
  }
};
