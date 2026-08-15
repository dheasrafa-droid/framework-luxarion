/**
 * @file Demo3DQuantumTopology.ts
 * @description 3D Quantum Topology with interlocking non-Euclidean Torus rings, dynamic resonance nodes, and iridescent Blinn-Phong specular fields.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  TorusGeometry,
  IcosahedronGeometry,
  SphereGeometry,
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

export const Demo3DQuantumTopology: LuxarionDemo = {
  id: '3d-quantum-topology',
  name: '3D Quantum Topology & Torus Knot',
  category: 'quantum',
  description: 'Interlocking multi-axis torus topology demonstrating golden ratio angular velocities, non-Euclidean gimbal rotations, and specular iridescent shaders.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('QuantumTopologyScene');
    const theme = themeManager.currentTheme;
    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 3, 9);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 2.5;
    controls.maxDistance = 22;

    // Lights
    const amb = new AmbientLight(theme.ambientLight, 0.45);
    scene.add(amb);

    const keyLight = new DirectionalLight(theme.dirLight, 1.3);
    keyLight.position.set(6, 8, 5);
    scene.add(keyLight);

    const pLight1 = new PointLight(theme.pointLight, 2.2, 18);
    pLight1.position.set(-4, 3, 2);
    scene.add(pLight1);

    const pLight2 = new PointLight(theme.accent, 1.8, 18);
    pLight2.position.set(4, -3, -2);
    scene.add(pLight2);

    // 1. Central Quantum Singularity (Icosahedron + Wireframe shell)
    const coreGeo = new IcosahedronGeometry(1.0);
    const coreMat = new HologramMaterial({
      color: theme.hologramColor,
      fresnelPower: 1.5,
      scanlineDensity: 32.0,
      glitchIntensity: 0.7
    });
    const coreMesh = new Object3D(coreGeo, coreMat, 'SingularityCore');
    scene.add(coreMesh);

    const shellMat = new WireframeMaterial({
      color: theme.accent,
      opacity: 0.85
    });
    const shellMesh = new Object3D(coreGeo, shellMat, 'SingularityShell');
    shellMesh.scale.set(1.25, 1.25, 1.25);
    scene.add(shellMesh);

    // 2. Interlocking Torus Rings (Gimbal System with 3 Orthogonal Orientations)
    const ringGeo = new TorusGeometry(2.3, 0.12, 24, 64);

    const ringMat1 = new PhongMaterial({
      color: theme.accent,
      specular: '#ffffff',
      shininess: 90
    });
    const ring1 = new Object3D(ringGeo, ringMat1, 'TopologyRing_XY');
    scene.add(ring1);

    const ringMat2 = new PhongMaterial({
      color: theme.secondary,
      specular: '#ffffff',
      shininess: 90
    });
    const ring2 = new Object3D(ringGeo, ringMat2, 'TopologyRing_YZ');
    ring2.rotation.x = Math.PI / 2;
    scene.add(ring2);

    const ringMat3 = new PhongMaterial({
      color: theme.pointLight,
      specular: '#ffffff',
      shininess: 90
    });
    const ring3 = new Object3D(ringGeo, ringMat3, 'TopologyRing_XZ');
    ring3.rotation.y = Math.PI / 2;
    scene.add(ring3);

    // 3. Outer Faraday Sphere Wireframe
    const faradayGeo = new SphereGeometry(3.5, 16, 16);
    const faradayMat = new WireframeMaterial({
      color: theme.secondary,
      opacity: 0.25
    });
    const faradayMesh = new Object3D(faradayGeo, faradayMat, 'FaradayCage');
    scene.add(faradayMesh);

    // 4. Quantum Electron Probability Wave (12 Orbiting Satellites)
    const electronGeo = new SphereGeometry(0.12, 12, 12);
    const electrons: Object3D[] = [];
    for (let i = 0; i < 12; i++) {
      const eMat = new PhongMaterial({
        color: i % 2 === 0 ? theme.accent : theme.secondary,
        specular: '#ffffff',
        shininess: 100
      });
      const electron = new Object3D(electronGeo, eMat, `Electron_${i}`);
      electrons.push(electron);
      scene.add(electron);
    }

    return {
      scene,
      camera,
      update: (delta: number, time: number) => {
        controls.update();

        // Singularity core animation
        coreMat.updateUniforms(time);
        if (delta > 0) {
          coreMesh.rotateX(delta * 0.8);
          coreMesh.rotateY(delta * 1.1);
          shellMesh.rotateY(-delta * 0.9);
          shellMesh.rotateZ(delta * 0.7);

          // Gimbal multi-axis rotation (Golden ratio based)
          const PHI = 1.6180339887;
          ring1.rotateZ(delta * 0.6);
          ring1.rotateX(delta * 0.4);

          ring2.rotateX(delta * 0.6 * PHI);
          ring2.rotateY(delta * 0.5);

          ring3.rotateY(delta * 0.4 * (PHI * PHI));
          ring3.rotateZ(delta * 0.3);

          faradayMesh.rotateY(delta * 0.08);
          faradayMesh.rotateX(delta * 0.05);
        }

        // Animate Quantum Electrons along orbital trajectories
        electrons.forEach((elec, idx) => {
          const u = (idx / electrons.length) * Math.PI * 2 + time * 1.2;
          const v = idx * 1.5 + time * 0.8;
          const r = 2.4;

          elec.position.x = r * Math.cos(u) * Math.cos(v);
          elec.position.y = r * Math.sin(u);
          elec.position.z = r * Math.cos(u) * Math.sin(v);
        });

        // Moving lights
        pLight1.position.x = Math.sin(time * 1.5) * 5;
        pLight1.position.z = Math.cos(time * 1.5) * 5;

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
