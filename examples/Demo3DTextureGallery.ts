/**
 * @file Demo3DTextureGallery.ts
 * @description Interactive 3D Procedural Texture Showcase with Cyber Grid, Nebula Noise, Hexagonal Carbon, and Voronoi Crystal mapping.
 * Part of Luxarion Engine - Texture Showcase Module.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  BoxGeometry,
  SphereGeometry,
  TorusGeometry,
  TorusKnotGeometry,
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

export const Demo3DTextureGallery: LuxarionDemo = {
  id: '3d-texture-gallery',
  name: '3D Procedural Texture Showcase',
  category: '3d',
  is2D: false,
  description: 'Interactive exhibition of 4 procedural texture algorithms: Cyber Grid, Deep Nebula Noise, Hexagonal Carbon, and Voronoi Crystals with UV transforms.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('TextureGalleryScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 4, 11);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 25;

    // Lighting
    const ambientLight = new AmbientLight('#0f172a', 0.8);
    scene.add(ambientLight);

    const sunLight = new DirectionalLight('#ffffff', 1.2);
    sunLight.position.set(5, 10, 7);
    scene.add(sunLight);

    const pointLight = new PointLight('#38bdf8', 2.0, 20);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // 1. Procedural Textures
    const cyberGridTex = TextureGenerator.createCyberGrid(512, 16, '#06b6d4', '#050714');
    const nebulaTex = TextureGenerator.createNebulaNoise(512, 0.01, [6, 182, 212], [236, 72, 153], [99, 102, 241]);
    const hexTex = TextureGenerator.createHexagonPattern(512, 24, '#f59e0b', '#090d1f', '#d97706');
    const voronoiTex = TextureGenerator.createVoronoiCrystals(512, 24, '#38bdf8');

    // 2. Pedestal 1: Cyber Grid Box
    const boxMat = new TextureMaterial({
      map: cyberGridTex,
      shininess: 64,
      uvScale: [2, 2]
    });
    const boxMesh = new Object3D(new BoxGeometry(1.8, 1.8, 1.8), boxMat);
    boxMesh.position.set(-4.5, 0, 0);
    scene.add(boxMesh);

    // 3. Pedestal 2: Deep Nebula Sphere
    const sphereMat = new TextureMaterial({
      map: nebulaTex,
      shininess: 90,
      specular: '#ffffff'
    });
    const sphereMesh = new Object3D(new SphereGeometry(1.2, 36, 36), sphereMat);
    sphereMesh.position.set(-1.5, 0, 0);
    scene.add(sphereMesh);

    // 4. Pedestal 3: Hexagonal Carbon Torus
    const torusMat = new TextureMaterial({
      map: hexTex,
      shininess: 48,
      uvScale: [4, 1]
    });
    const torusMesh = new Object3D(new TorusGeometry(1.1, 0.4, 24, 48), torusMat);
    torusMesh.position.set(1.5, 0, 0);
    scene.add(torusMesh);

    // 5. Pedestal 4: Voronoi Crystal Torus Knot
    const knotMat = new TextureMaterial({
      map: voronoiTex,
      shininess: 120,
      specular: '#38bdf8',
      uvScale: [6, 1]
    });
    const knotMesh = new Object3D(new TorusKnotGeometry(1.0, 0.3, 96, 24, 2, 3), knotMat);
    knotMesh.position.set(4.5, 0, 0);
    scene.add(knotMesh);

    const meshes = [boxMesh, sphereMesh, torusMesh, knotMesh];

    return {
      scene,
      camera,
      controls,
      update: (delta: number, time: number) => {
        controls.update();

        // Rotate individual meshes
        boxMesh.rotateY(delta * 0.4);
        boxMesh.rotateX(delta * 0.2);

        sphereMesh.rotateY(delta * 0.3);

        torusMesh.rotateX(delta * 0.3);
        torusMesh.rotateY(delta * 0.5);

        knotMesh.rotateY(delta * 0.5);
        knotMesh.rotateZ(delta * 0.2);

        // Animated UV offset translation for live streaming effect
        boxMat.uvOffset.x = (time * 0.05) % 1.0;
        torusMat.uvOffset.x = (time * 0.1) % 1.0;
        knotMat.uvOffset.x = (time * 0.08) % 1.0;

        // Orbit Point Light
        pointLight.position.x = Math.sin(time * 0.8) * 5;
        pointLight.position.z = Math.cos(time * 0.8) * 4 + 2;
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
        cyberGridTex.dispose(glRenderer.gl);
        nebulaTex.dispose(glRenderer.gl);
        hexTex.dispose(glRenderer.gl);
        voronoiTex.dispose(glRenderer.gl);
        scene.clear();
      }
    };
  }
};
