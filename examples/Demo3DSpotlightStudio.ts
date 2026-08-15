/**
 * @file Demo3DSpotlightStudio.ts
 * @description Advanced 3D Multi-Light Studio showcasing Spotlights with penumbra, Hemisphere dual-tone bounce, orbiting Point lights, and specular highlights.
 * Part of Luxarion Engine - Advanced Lighting Showcase.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  BoxGeometry,
  TorusKnotGeometry,
  PlaneGeometry,
  Object3D,
  PhongMaterial,
  SpotLight,
  PointLight,
  HemisphereLight,
  DirectionalLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DSpotlightStudio: LuxarionDemo = {
  id: '3d-spotlight-studio',
  name: '3D Advanced Lighting Studio',
  category: '3d',
  is2D: false,
  description: 'Multi-light studio with dual conical Spotlights, soft penumbra falloff, Hemisphere sky/ground bounce, and orbital point lights.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('SpotlightStudioScene');
    const theme = themeManager.currentTheme;
    glRenderer.clearColor.setHex('#070913');

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 5, 12);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 1. Dual-Tone Hemisphere Sky/Ground Bounce Light
    const hemiLight = new HemisphereLight('#60a5fa', '#1e293b', 0.5);
    scene.add(hemiLight);

    // 2. Conical SpotLight 1 (Cyan Studio Key Light)
    const spotLight1 = new SpotLight('#06b6d4', 2.8, 30, Math.PI / 4, 0.3);
    spotLight1.position.set(-6, 8, 4);
    scene.add(spotLight1);

    // 3. Conical SpotLight 2 (Magenta Rim Light)
    const spotLight2 = new SpotLight('#ec4899', 2.8, 30, Math.PI / 4, 0.4);
    spotLight2.position.set(6, 8, -4);
    scene.add(spotLight2);

    // 4. Orbiting Warm Point Light
    const pointLightOrb = new PointLight('#f59e0b', 2.2, 15);
    pointLightOrb.position.set(0, 2, 3);
    scene.add(pointLightOrb);

    // 5. Studio Pedestal Floor
    const floorGeo = new PlaneGeometry(22, 22, 1, 1);
    const floorMat = new PhongMaterial({
      color: '#111827',
      specular: '#475569',
      shininess: 64
    });
    const floor = new Object3D(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.5;
    scene.add(floor);

    // 6. Central Complex Sculpture (Torus Knot)
    const torusKnotGeo = new TorusKnotGeometry(1.5, 0.4, 128, 32, 2, 3);
    const centerMat = new PhongMaterial({
      color: '#f8fafc',
      specular: '#ffffff',
      shininess: 128
    });
    const centerObject = new Object3D(torusKnotGeo, centerMat);
    centerObject.position.set(0, 1.2, 0);
    scene.add(centerObject);

    // 7. Satellite Spheres & Pedestals
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const sphereGeo = new SphereGeometry(0.5, 32, 32);
      const sphereMat = new PhongMaterial({
        color: i % 2 === 0 ? '#38bdf8' : '#a855f7',
        specular: '#ffffff',
        shininess: 90
      });
      const sphere = new Object3D(sphereGeo, sphereMat);
      sphere.position.set(Math.cos(angle) * 4, 0.2, Math.sin(angle) * 4);
      scene.add(sphere);
    }

    return {
      update: (delta: number, time: number) => {
        controls.update();

        // Rotate Sculpture
        centerObject.rotation.y += delta * 0.4;
        centerObject.rotation.x += delta * 0.2;

        // Orbiting Point Light
        const orbitR = 4.5;
        pointLightOrb.position.x = Math.cos(time * 1.5) * orbitR;
        pointLightOrb.position.z = Math.sin(time * 1.5) * orbitR;
        pointLightOrb.position.y = 1.5 + Math.sin(time * 3.0) * 0.8;

        // Swiveling Spotlights
        spotLight1.position.x = -6 + Math.sin(time * 0.8) * 2;
        spotLight1.position.z = 4 + Math.cos(time * 0.8) * 2;
        spotLight1.updateDirection();

        spotLight2.position.x = 6 + Math.cos(time * 0.7) * 2;
        spotLight2.position.z = -4 + Math.sin(time * 0.7) * 2;
        spotLight2.updateDirection();

        glRenderer.render(scene, camera);
      },
      resize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        controls.dispose();
      }
    };
  }
};
