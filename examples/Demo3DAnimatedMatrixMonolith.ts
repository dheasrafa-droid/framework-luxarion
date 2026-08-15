/**
 * @file Demo3DAnimatedMatrixMonolith.ts
 * @description 3D Cyber Monolith with real-time dynamic animated CanvasTexture streaming Matrix digital rain glyphs.
 * Part of Luxarion Engine - Dynamic Texture Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  BoxGeometry,
  TorusGeometry,
  TextureMaterial,
  WireframeMaterial,
  TextureGenerator,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DAnimatedMatrixMonolith: LuxarionDemo = {
  id: '3d-animated-matrix-monolith',
  name: '3D Matrix Stream Monolith',
  category: 'matrix',
  is2D: false,
  description: 'Live real-time CanvasTexture stream generating falling Matrix green digital glyphs wrapped seamlessly across a 3D cyber monolith.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('MatrixMonolithScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 3, 7);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 15;

    // Lighting
    const ambientLight = new AmbientLight('#031f13', 0.8);
    scene.add(ambientLight);

    const glowLight = new PointLight('#22c55e', 2.5, 12);
    glowLight.position.set(0, 0, 3);
    scene.add(glowLight);

    // 1. Dynamic Animated Matrix Stream Texture
    const { texture: matrixTex, update: updateMatrixStream } = TextureGenerator.createAnimatedMatrixStream(512);

    // 2. Monolith Main Pillar
    const monolithMat = new TextureMaterial({
      map: matrixTex,
      color: '#ffffff',
      specular: '#22c55e',
      shininess: 90,
      uvScale: [1, 2]
    });
    const monolithGeo = new BoxGeometry(1.6, 3.8, 1.6);
    const monolithMesh = new Object3D(monolithGeo, monolithMat);
    scene.add(monolithMesh);

    // 3. Cyber Outer Wireframe Cage
    const wireMat = new WireframeMaterial({ color: '#4ade80', opacity: 0.5 });
    const wireCage = new Object3D(new BoxGeometry(1.75, 3.95, 1.75), wireMat);
    monolithMesh.add(wireCage);

    // 4. Orbiting Energy Rings
    const ringMat = new WireframeMaterial({ color: '#22c55e', opacity: 0.7 });
    const ringGeo = new TorusGeometry(2.4, 0.03, 16, 64);

    const ringA = new Object3D(ringGeo, ringMat);
    ringA.rotation.x = Math.PI / 3;
    scene.add(ringA);

    const ringB = new Object3D(ringGeo, ringMat);
    ringB.rotation.x = -Math.PI / 3;
    scene.add(ringB);

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // 1. Advance the live Matrix code rain animation on canvas texture
        updateMatrixStream();

        // 2. Rotate Monolith & Rings
        monolithMesh.rotateY(delta * 0.35);

        ringA.rotateZ(delta * 0.5);
        ringB.rotateZ(delta * -0.4);

        // 3. Pulsing light intensity
        glowLight.intensity = 2.0 + Math.sin(time * 3.0) * 0.8;
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
        matrixTex.dispose(glRenderer.gl);
        scene.clear();
      }
    };
  }
};
