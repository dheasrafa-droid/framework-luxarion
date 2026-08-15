/**
 * @file DemoHolographicHUD.ts
 * @description 3D Sci-Fi Gyroscopic HUD with nested gimbal rings, holographic telemetry, and scanner vectors.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  TorusGeometry,
  CylinderGeometry,
  HologramMaterial,
  WireframeMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const DemoHolographicHUD: LuxarionDemo = {
  id: '3d-hologram-hud',
  name: '3D Gyroscopic Telemetry HUD',
  category: 'hologram',
  description: 'Multi-axis gyroscopic gimbal rings with holographic scanner beacons, angular velocity sensors, and coordinate tracking.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('HUDScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 2;
    controls.maxDistance = 15;

    // Lights
    scene.add(new AmbientLight(theme.ambientLight, 0.6));
    const ptLight = new PointLight(theme.pointLight, 2.0, 15);
    scene.add(ptLight);

    // Inner Gyro Ring
    const innerGeo = new TorusGeometry(1.2, 0.04, 16, 48);
    const innerMat = new HologramMaterial({ color: theme.accent, fresnelPower: 2.0, scanlineDensity: 40 });
    const innerRing = new Object3D(innerGeo, innerMat, 'InnerRing');
    scene.add(innerRing);

    // Middle Gyro Ring
    const midGeo = new TorusGeometry(1.8, 0.04, 16, 48);
    const midMat = new HologramMaterial({ color: theme.secondary, fresnelPower: 2.2, scanlineDensity: 30 });
    const midRing = new Object3D(midGeo, midMat, 'MiddleRing');
    scene.add(midRing);

    // Outer Gyro Ring
    const outerGeo = new TorusGeometry(2.4, 0.04, 16, 48);
    const outerMat = new HologramMaterial({ color: theme.hologramColor, fresnelPower: 2.5, scanlineDensity: 20 });
    const outerRing = new Object3D(outerGeo, outerMat, 'OuterRing');
    scene.add(outerRing);

    // Center Core Beacon
    const coreGeo = new CylinderGeometry(0.1, 0.1, 1.2, 16, 1);
    const coreMat = new WireframeMaterial({ color: theme.accent });
    const coreBeacon = new Object3D(coreGeo, coreMat, 'CoreBeacon');
    scene.add(coreBeacon);

    return {
      scene,
      camera,
      update: (_delta: number, time: number) => {
        controls.update();

        innerMat.updateUniforms(time);
        midMat.updateUniforms(time);
        outerMat.updateUniforms(time);

        innerRing.rotation.x = time * 1.2;
        innerRing.rotation.y = time * 0.8;

        midRing.rotation.y = time * 0.9;
        midRing.rotation.z = time * 0.7;

        outerRing.rotation.x = -time * 0.5;
        outerRing.rotation.z = time * 0.6;

        coreBeacon.rotation.y = time * 2;
        coreBeacon.rotation.z = Math.sin(time) * 0.5;

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
