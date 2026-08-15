/**
 * @file Demo3DCyberHexSphere.ts
 * @description Sci-Fi Cybernetic Energy Core with Hexagonal Carbon texture mapping, normal bump relief, and dynamic orbital shields.
 * Part of Luxarion Engine - Texture & Material Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  IcosahedronGeometry,
  TorusGeometry,
  TextureMaterial,
  HologramMaterial,
  WireframeMaterial,
  TextureGenerator,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DCyberHexSphere: LuxarionDemo = {
  id: '3d-cyber-hex-sphere',
  name: '3D Cyber Hex Energy Core',
  category: 'hologram',
  is2D: false,
  description: 'Cybernetic spherical energy core combining procedural Hexagonal Carbon texture, normal bump relief grooves, and dual holographic shields.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('CyberHexSphereScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;

    // Lights
    const ambientLight = new AmbientLight('#0f172a', 0.6);
    scene.add(ambientLight);

    const coreLight = new PointLight('#06b6d4', 3.0, 15);
    scene.add(coreLight);

    const rimLight = new PointLight('#ec4899', 2.0, 15);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // 1. Procedural Hex Texture & Normal Map
    const hexTex = TextureGenerator.createHexagonPattern(512, 20, '#06b6d4', '#040d21', '#38bdf8');
    const normalMap = TextureGenerator.createNormalMapFromHeight(256, 256, (u, v) => {
      const gx = Math.sin(u * Math.PI * 12);
      const gy = Math.sin(v * Math.PI * 12);
      return Math.sin(gx * 2.0) * Math.cos(gy * 2.0);
    }, 2.0);

    // 2. Central Core Hex Sphere
    const coreMat = new TextureMaterial({
      map: hexTex,
      normalMap: normalMap,
      normalScale: 1.5,
      shininess: 90,
      specular: '#38bdf8',
      uvScale: [3, 2]
    });
    const coreMesh = new Object3D(new SphereGeometry(1.3, 40, 40), coreMat);
    scene.add(coreMesh);

    // 3. Middle Hologram Shield
    const shieldMat = new HologramMaterial({
      color: '#06b6d4',
      fresnelPower: 2.2,
      scanlineDensity: 40.0
    });
    const shieldMesh = new Object3D(new IcosahedronGeometry(1.8), shieldMat);
    scene.add(shieldMesh);

    // 4. Outer Meridian Rings
    const ringMat = new WireframeMaterial({ color: '#ec4899', opacity: 0.6 });
    const ringGeo = new TorusGeometry(2.3, 0.02, 16, 64);

    const ringA = new Object3D(ringGeo, ringMat);
    ringA.rotation.x = Math.PI / 4;
    scene.add(ringA);

    const ringB = new Object3D(ringGeo, ringMat);
    ringB.rotation.y = Math.PI / 3;
    scene.add(ringB);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Rotate Core & UV offset stream
        coreMesh.rotateY(delta * 0.4);
        coreMat.uvOffset.x = (time * 0.05) % 1.0;

        // Rotate Shields & Rings
        shieldMesh.rotateY(delta * -0.2);
        shieldMesh.rotateX(delta * 0.1);

        ringA.rotateZ(delta * 0.3);
        ringB.rotateX(delta * -0.25);

        // Pulsing light
        coreLight.intensity = 2.5 + Math.sin(time * 4.0) * 0.8;
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
        hexTex.dispose(glRenderer.gl);
        normalMap.dispose(glRenderer.gl);
        scene.clear();
      }
    };
  }
};
