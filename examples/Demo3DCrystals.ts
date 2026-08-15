/**
 * @file Demo3DCrystals.ts
 * @description 3D Crystal Monolith Field demo showcasing Icosahedron, Torus, Phong lighting, and specular shines.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  IcosahedronGeometry,
  TorusGeometry,
  BoxGeometry,
  PhongMaterial,
  WireframeMaterial,
  Object3D,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Color,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DCrystals: LuxarionDemo = {
  id: '3d-crystals',
  name: '3D Crystal Monolith Field',
  category: '3d',
  description: 'Procedural crystal monolith with orbiting torus halos, multi-point specular highlights, and real-time Blinn-Phong lighting.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('CrystalsScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 2, 7);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 2;
    controls.maxDistance = 20;

    // Lights
    const ambientLight = new AmbientLight(theme.ambientLight, 0.4);
    scene.add(ambientLight);

    const dirLight = new DirectionalLight(theme.dirLight, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new PointLight(theme.pointLight, 2.0, 15);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    // Center Crystal: Icosahedron
    const crystalGeo = new IcosahedronGeometry(1.6);
    const crystalMat = new PhongMaterial({
      color: theme.accent,
      specular: '#ffffff',
      shininess: 64,
      opacity: 0.95
    });
    const crystalMesh = new Object3D(crystalGeo, crystalMat, 'MainCrystal');
    scene.add(crystalMesh);

    // Wireframe Outer Shell
    const wireMat = new WireframeMaterial({
      color: theme.secondary,
      opacity: 0.6
    });
    const wireMesh = new Object3D(crystalGeo, wireMat, 'WireShell');
    wireMesh.scale.set(1.15, 1.15, 1.15);
    scene.add(wireMesh);

    // Orbiting Torus Rings
    const torusGeo = new TorusGeometry(2.6, 0.08, 16, 48);
    const torusMat = new PhongMaterial({
      color: theme.secondary,
      specular: '#ffffff',
      shininess: 90
    });
    const torus1 = new Object3D(torusGeo, torusMat, 'TorusRing1');
    const torus2 = new Object3D(torusGeo, torusMat, 'TorusRing2');
    scene.add(torus1);
    scene.add(torus2);

    // Floating Satellite Cubes
    const satellites: Object3D[] = [];
    const cubeGeo = new BoxGeometry(0.3, 0.3, 0.3);
    for (let i = 0; i < 8; i++) {
      const satMat = new PhongMaterial({
        color: i % 2 === 0 ? theme.accent : theme.secondary,
        specular: '#ffffff',
        shininess: 50
      });
      const sat = new Object3D(cubeGeo, satMat, `Satellite_${i}`);
      satellites.push(sat);
      scene.add(sat);
    }

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Animate Crystal & Rings via Real-time Quaternion Rotation
        if (delta > 0) {
          crystalMesh.rotateY(delta * 0.5);
          crystalMesh.rotateX(delta * 0.25);
          wireMesh.rotateY(-delta * 0.4);
          wireMesh.rotateZ(delta * 0.3);

          // Animate Torus Gyroscopic Rings
          torus1.rotateY(delta * 0.8);
          torus2.rotateZ(delta * 0.6);
        }

        // Animate Point Light
        pointLight.position.x = Math.sin(time * 1.2) * 4;
        pointLight.position.z = Math.cos(time * 1.2) * 4;

        // Animate Satellites
        satellites.forEach((sat, idx) => {
          const angle = (idx / satellites.length) * Math.PI * 2 + time * 0.8;
          const radius = 3.5 + Math.sin(time * 2 + idx) * 0.4;
          sat.position.x = Math.cos(angle) * radius;
          sat.position.y = Math.sin(time * 1.5 + idx) * 0.8;
          sat.position.z = Math.sin(angle) * radius;
          if (delta > 0) {
            sat.rotateX(delta * 2);
            sat.rotateY(delta * 1.5);
          }
        });

        // Sync colors with Theme
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
