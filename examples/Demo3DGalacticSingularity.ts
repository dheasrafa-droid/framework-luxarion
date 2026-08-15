/**
 * @file Demo3DGalacticSingularity.ts
 * @description 3D Galactic Singularity & Torus Knot Accretion Vortex demo with dynamic orbit controls and dual-point light casting.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  TorusKnotGeometry,
  TorusGeometry,
  SphereGeometry,
  PhongMaterial,
  HologramMaterial,
  WireframeMaterial,
  NormalMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DGalacticSingularity: LuxarionDemo = {
  id: '3d-galactic-singularity',
  name: '3D Galactic Singularity & Torus Knot',
  category: '3d',
  is2D: false,
  description: 'Parametric Torus Knot accretion vortex with multi-tier orbital matter, normal vector field shading, and orbiting dual-star luminescence.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('GalacticSingularityScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(55, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 3, 9);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 25;

    // Lights
    const ambientLight = new AmbientLight('#0a0f24', 0.5);
    scene.add(ambientLight);

    const lightStarA = new PointLight('#38bdf8', 3.0, 30);
    scene.add(lightStarA);

    const lightStarB = new PointLight('#f43f5e', 2.5, 30);
    scene.add(lightStarB);

    // 1. Central Core Torus Knot (p=2, q=3)
    const knotGeo = new TorusKnotGeometry(1.5, 0.35, 128, 32, 2, 3);
    const knotMat = new PhongMaterial({
      color: '#06b6d4',
      specular: '#ffffff',
      shininess: 120,
      wireframe: false
    });
    const knotCore = new Object3D(knotGeo, knotMat);
    scene.add(knotCore);

    // 2. Wireframe Energy Shell
    const wireMat = new WireframeMaterial({ color: '#38bdf8', opacity: 0.6 });
    const knotWire = new Object3D(knotGeo, wireMat);
    knotWire.scale.set(1.03, 1.03, 1.03);
    knotCore.add(knotWire);

    // 3. Multi-tier Accretion Rings
    const rings: Object3D[] = [];
    const ringColors = ['#818cf8', '#ec4899', '#06b6d4'];

    for (let i = 0; i < 3; i++) {
      const ringGeo = new TorusGeometry(2.8 + i * 1.1, 0.04, 16, 64);
      const ringMat = new HologramMaterial({
        color: ringColors[i % ringColors.length],
        fresnelPower: 2.0,
        scanlineDensity: 30.0 + i * 10
      });
      const ring = new Object3D(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 4 + i * 0.25;
      ring.rotation.y = (i * Math.PI) / 3;
      scene.add(ring);
      rings.push(ring);
    }

    // 4. Orbiting Star Marker Spheres
    const starGeo = new SphereGeometry(0.12, 16, 16);
    const starMatA = new PhongMaterial({ color: '#38bdf8' });
    const starMatB = new PhongMaterial({ color: '#f43f5e' });

    const starMeshA = new Object3D(starGeo, starMatA);
    const starMeshB = new Object3D(starGeo, starMatB);
    scene.add(starMeshA);
    scene.add(starMeshB);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Rotate Singularity knot
        knotCore.rotateY(delta * 0.4);
        knotCore.rotateX(delta * 0.2);

        // Rotate Accretion Rings
        rings.forEach((ring, idx) => {
          ring.rotateZ(delta * (0.3 + idx * 0.15) * (idx % 2 === 0 ? 1 : -1));
          ring.rotateY(delta * 0.1);
        });

        // Orbit Lights & Spheres
        const rA = 4.2;
        const xA = Math.cos(time * 1.2) * rA;
        const zA = Math.sin(time * 1.2) * rA;
        const yA = Math.sin(time * 2.0) * 1.5;
        lightStarA.position.set(xA, yA, zA);
        starMeshA.position.set(xA, yA, zA);

        const rB = 3.6;
        const xB = Math.cos(time * -0.9 + Math.PI) * rB;
        const zB = Math.sin(time * -0.9 + Math.PI) * rB;
        const yB = Math.cos(time * 1.5) * 1.2;
        lightStarB.position.set(xB, yB, zB);
        starMeshB.position.set(xB, yB, zB);
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
