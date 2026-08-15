/**
 * @file Demo3DQuantumSuperposition.ts
 * @description Quantum Superposition & Qubit Bloch Sphere visualization with wavefunction interference shaders and orbital harmonics.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  IcosahedronGeometry,
  TorusGeometry,
  QuantumMaterial,
  NormalMaterial,
  WireframeMaterial,
  PhongMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DQuantumSuperposition: LuxarionDemo = {
  id: '3d-quantum-superposition',
  name: '3D Quantum Superposition & Wavefunction',
  category: 'quantum',
  is2D: false,
  description: 'Interactive quantum Bloch sphere showcasing wavefunction superposition, quantum interference shaders, and orbital harmonic shells.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('QuantumSuperpositionScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 2, 6.5);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;

    // Lights
    const ambientLight = new AmbientLight('#090d1f', 0.5);
    scene.add(ambientLight);

    const pointLight = new PointLight('#a855f7', 2.0, 20);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    // 1. Quantum Wave Core (Sphere with custom GLSL Quantum wavefunction shader)
    const quantumMat = new QuantumMaterial({
      colorA: '#06b6d4',
      colorB: '#ec4899',
      phase: 0.0,
      opacity: 0.95
    });
    const coreGeo = new SphereGeometry(1.3, 40, 40);
    const coreMesh = new Object3D(coreGeo, quantumMat);
    scene.add(coreMesh);

    // 2. Bloch Sphere Equatorial & Polar Meridian Rings
    const ringMat = new WireframeMaterial({ color: '#a855f7', opacity: 0.5 });
    const ringGeo = new TorusGeometry(1.8, 0.02, 16, 64);

    const ringEquator = new Object3D(ringGeo, ringMat);
    ringEquator.rotation.x = Math.PI / 2;
    scene.add(ringEquator);

    const ringMeridianA = new Object3D(ringGeo, ringMat);
    scene.add(ringMeridianA);

    const ringMeridianB = new Object3D(ringGeo, ringMat);
    ringMeridianB.rotation.y = Math.PI / 2;
    scene.add(ringMeridianB);

    // 3. Normal Vector Diagnostic Shell (Outer orbital)
    const normMat = new NormalMaterial(0.35);
    const outerGeo = new IcosahedronGeometry(2.3);
    const outerMesh = new Object3D(outerGeo, normMat);
    scene.add(outerMesh);

    // 4. Pole State Markers (|0> and |1>)
    const markerGeo = new SphereGeometry(0.12, 16, 16);
    const mat0 = new PhongMaterial({ color: '#06b6d4' });
    const mat1 = new PhongMaterial({ color: '#ec4899' });

    const state0 = new Object3D(markerGeo, mat0);
    state0.position.set(0, 1.8, 0);
    scene.add(state0);

    const state1 = new Object3D(markerGeo, mat1);
    state1.position.set(0, -1.8, 0);
    scene.add(state1);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Update Quantum Material wavefunction shader uniform
        quantumMat.updateUniforms(time);
        quantumMat.phase = Math.sin(time * 0.8) * Math.PI;

        // Rotate quantum orbital structures
        coreMesh.rotateY(delta * 0.6);
        outerMesh.rotateY(delta * -0.2);
        outerMesh.rotateX(delta * 0.15);

        ringEquator.rotateZ(delta * 0.3);
        ringMeridianA.rotateY(delta * 0.2);
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
