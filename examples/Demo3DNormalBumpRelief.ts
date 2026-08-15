/**
 * @file Demo3DNormalBumpRelief.ts
 * @description Tangent-Space Normal Bump Mapping Demo with procedural wave & micro-facet normal maps and dynamic orbit lighting.
 * Part of Luxarion Engine - Texture & Shader Module.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  PlaneGeometry,
  CylinderGeometry,
  TextureMaterial,
  TextureGenerator,
  Object3D,
  AmbientLight,
  PointLight,
  DirectionalLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DNormalBumpRelief: LuxarionDemo = {
  id: '3d-normal-bump-relief',
  name: '3D Tangent-Space Normal Bump Relief',
  category: '3d',
  is2D: false,
  description: 'Procedural normal bump map computation generating micro-surface geometric relief, physical grooves, and realistic optical light highlights.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('NormalBumpReliefScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 3, 7);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // Lighting
    const ambientLight = new AmbientLight('#090d1f', 0.4);
    scene.add(ambientLight);

    const dirLight = new DirectionalLight('#38bdf8', 0.6);
    dirLight.position.set(3, 5, 2);
    scene.add(dirLight);

    // Orbiting Point Lights
    const lightA = new PointLight('#f43f5e', 2.8, 15);
    scene.add(lightA);

    const lightB = new PointLight('#06b6d4', 2.8, 15);
    scene.add(lightB);

    // 1. Generate Procedural Normal Maps
    // A. Concentric ripples & micro-facet grooves
    const rippleNormalMap = TextureGenerator.createNormalMapFromHeight(256, 256, (u, v) => {
      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      return Math.sin(r * 3.0) * 0.5 + Math.cos(x * 6.0) * Math.sin(y * 6.0) * 0.3;
    }, 3.5);

    // B. Hexagonal tech grid normal map
    const gridNormalMap = TextureGenerator.createNormalMapFromHeight(256, 256, (u, v) => {
      const gx = Math.sin(u * Math.PI * 16);
      const gy = Math.sin(v * Math.PI * 16);
      return (Math.abs(gx) > 0.8 || Math.abs(gy) > 0.8) ? 0.8 : 0.0;
    }, 4.0);

    // 2. Center Relieved Sphere
    const sphereMat = new TextureMaterial({
      color: '#334155',
      specular: '#ffffff',
      shininess: 90,
      normalMap: rippleNormalMap,
      normalScale: 1.8,
      uvScale: [2, 2]
    });
    const sphereMesh = new Object3D(new SphereGeometry(1.4, 40, 40), sphereMat);
    scene.add(sphereMesh);

    // 3. Left Tech Cylinder
    const cylMat = new TextureMaterial({
      color: '#1e293b',
      specular: '#38bdf8',
      shininess: 120,
      normalMap: gridNormalMap,
      normalScale: 2.0,
      uvScale: [4, 2]
    });
    const cylMesh = new Object3D(new CylinderGeometry(0.8, 0.8, 2.0, 32), cylMat);
    cylMesh.position.set(-3.0, 0, 0);
    scene.add(cylMesh);

    // 4. Right Tech Cylinder
    const cylMat2 = new TextureMaterial({
      color: '#1e293b',
      specular: '#f43f5e',
      shininess: 120,
      normalMap: rippleNormalMap,
      normalScale: 2.5,
      uvScale: [3, 3]
    });
    const cylMesh2 = new Object3D(new CylinderGeometry(0.8, 0.8, 2.0, 32), cylMat2);
    cylMesh2.position.set(3.0, 0, 0);
    scene.add(cylMesh2);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Slow mesh rotations
        sphereMesh.rotateY(delta * 0.2);
        cylMesh.rotateY(delta * 0.3);
        cylMesh2.rotateY(delta * -0.3);

        // Orbit Point Lights to highlight normal bump shadows & specular highlights
        const rA = 3.2;
        lightA.position.set(Math.cos(time * 1.5) * rA, Math.sin(time * 2.0) * 1.5, Math.sin(time * 1.5) * rA);

        const rB = 3.0;
        lightB.position.set(Math.cos(time * -1.2 + Math.PI) * rB, Math.cos(time * 1.8) * 1.2, Math.sin(time * -1.2 + Math.PI) * rB);
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
        rippleNormalMap.dispose(glRenderer.gl);
        gridNormalMap.dispose(glRenderer.gl);
        scene.clear();
      }
    };
  }
};
