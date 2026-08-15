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
  IcosahedronGeometry,
  BoxGeometry,
  PlaneGeometry,
  HologramMaterial,
  WireframeMaterial,
  PhongMaterial,
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
  description: 'Avionic Sci-Fi holographic HUD featuring multi-axis gyroscopic gimbal rings, central targeting core, radar reticle vectors, and real-time telemetry scans.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('HUDScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 2.5;
    controls.maxDistance = 20;

    // Lights
    scene.add(new AmbientLight(theme.ambientLight, 0.8));
    const ptLight = new PointLight(theme.pointLight, 2.5, 20);
    ptLight.position.set(0, 0, 4);
    scene.add(ptLight);

    // 1. Central Hologram Targeting Gem / Reticle
    const coreGeo = new IcosahedronGeometry(0.65);
    const coreMat = new HologramMaterial({
      color: theme.accent,
      fresnelPower: 1.2,
      scanlineDensity: 24.0,
      glitchIntensity: 0.4,
      opacity: 0.95
    });
    const coreMesh = new Object3D(coreGeo, coreMat, 'HUDCore');
    scene.add(coreMesh);

    // 2. Inner Gyroscopic Pitch Ring (Cyan)
    const innerGeo = new TorusGeometry(1.35, 0.08, 16, 48);
    const innerMat = new HologramMaterial({
      color: theme.accent,
      fresnelPower: 1.5,
      scanlineDensity: 30.0,
      opacity: 0.9
    });
    const innerRing = new Object3D(innerGeo, innerMat, 'InnerRing');
    scene.add(innerRing);

    // 3. Middle Gyroscopic Roll Ring (Secondary Color)
    const midGeo = new TorusGeometry(2.0, 0.09, 16, 48);
    const midMat = new HologramMaterial({
      color: theme.secondary,
      fresnelPower: 1.6,
      scanlineDensity: 25.0,
      opacity: 0.9
    });
    const midRing = new Object3D(midGeo, midMat, 'MiddleRing');
    midRing.rotation.x = Math.PI / 2;
    scene.add(midRing);

    // 4. Outer Yaw Gimbal Ring (Hologram Color)
    const outerGeo = new TorusGeometry(2.65, 0.1, 16, 48);
    const outerMat = new HologramMaterial({
      color: theme.hologramColor,
      fresnelPower: 1.8,
      scanlineDensity: 20.0,
      opacity: 0.85
    });
    const outerRing = new Object3D(outerGeo, outerMat, 'OuterRing');
    scene.add(outerRing);

    // 5. Crosshair Reticle Brackets (4 Corners)
    const bracketGeo = new BoxGeometry(0.4, 0.04, 0.04);
    const bracketMat = new PhongMaterial({
      color: theme.accent,
      specular: '#ffffff',
      shininess: 90
    });

    const crosshairs: Object3D[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const dist = 3.2;
      const bracket = new Object3D(bracketGeo, bracketMat, `Crosshair_${i}`);
      bracket.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, 0);
      bracket.rotation.z = angle;
      scene.add(bracket);
      crosshairs.push(bracket);
    }

    // 6. Horizon Pitch Ladder Grid (Wireframe plane)
    const horizonGeo = new PlaneGeometry(4.5, 4.5, 8, 8);
    const horizonMat = new WireframeMaterial({
      color: theme.accent,
      opacity: 0.35
    });
    const horizonGrid = new Object3D(horizonGeo, horizonMat, 'HorizonGrid');
    horizonGrid.position.z = -0.5;
    scene.add(horizonGrid);

    // 7. Dynamic Hologram Radar Scanner Needle
    const needleGeo = new BoxGeometry(2.8, 0.03, 0.03);
    const needleMat = new HologramMaterial({
      color: theme.secondary,
      fresnelPower: 1.0,
      scanlineDensity: 15.0,
      opacity: 0.95
    });
    const scannerNeedle = new Object3D(needleGeo, needleMat, 'RadarNeedle');
    scene.add(scannerNeedle);

    return {
      scene,
      camera,
      update: (_delta: number, time: number) => {
        controls.update();

        // Update Shader Uniforms
        coreMat.updateUniforms(time);
        innerMat.updateUniforms(time);
        midMat.updateUniforms(time);
        outerMat.updateUniforms(time);
        needleMat.updateUniforms(time);

        // Core targeting animation
        coreMesh.rotation.x = time * 0.9;
        coreMesh.rotation.y = time * 1.3;

        // Multi-axis gyroscopic gimbal rotations
        innerRing.rotation.x = time * 1.1;
        innerRing.rotation.y = Math.sin(time * 0.8) * 0.6;

        midRing.rotation.x = Math.PI / 2 + Math.cos(time * 0.6) * 0.5;
        midRing.rotation.y = time * 0.9;

        outerRing.rotation.x = -time * 0.4;
        outerRing.rotation.z = time * 0.7;

        // Radar Needle sweep
        scannerNeedle.rotation.z = -time * 2.2;

        // Horizon Grid gentle wave
        horizonGrid.rotation.z = Math.sin(time * 0.5) * 0.1;

        // Crosshairs breathing pulse
        const chScale = 1.0 + Math.sin(time * 3.0) * 0.05;
        crosshairs.forEach(ch => ch.scale.set(chScale, chScale, chScale));

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
