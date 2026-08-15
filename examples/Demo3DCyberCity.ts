/**
 * @file Demo3DCyberCity.ts
 * @description Holographic 3D Cyber Grid with procedural scanline torus, floating monoliths, and neon pulses.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  TorusGeometry,
  BoxGeometry,
  PlaneGeometry,
  HologramMaterial,
  WireframeMaterial,
  Object3D,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DCyberCity: LuxarionDemo = {
  id: '3d-cyber-grid',
  name: '3D Holographic Cyber Grid',
  category: 'hologram',
  description: 'Cybernetic holographic lattice with dynamic scanlines, Fresnel rim luminescence, glitch pulses, and wireframe city monoliths.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('CyberGridScene');
    const theme = themeManager.currentTheme;

    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(60, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 3, 8);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 2;
    controls.maxDistance = 25;

    // Ambient & Point Light
    const amb = new AmbientLight(theme.ambientLight, 0.5);
    scene.add(amb);

    const ptLight = new PointLight(theme.pointLight, 2.5, 20);
    ptLight.position.set(0, 5, 0);
    scene.add(ptLight);

    // Ground Cyber Grid
    const planeGeo = new PlaneGeometry(20, 20, 20, 20);
    const planeMat = new WireframeMaterial({
      color: theme.accent,
      opacity: 0.4
    });
    const gridPlane = new Object3D(planeGeo, planeMat, 'GridPlane');
    gridPlane.rotation.x = -Math.PI / 2;
    gridPlane.position.y = -2;
    scene.add(gridPlane);

    // Centerpiece: Hologram Torus
    const holoGeo = new TorusGeometry(2.0, 0.6, 24, 48);
    const holoMat = new HologramMaterial({
      color: theme.hologramColor,
      fresnelPower: theme.fresnelPower,
      scanlineDensity: theme.scanlineDensity,
      glitchIntensity: 0.8
    });
    const holoTorus = new Object3D(holoGeo, holoMat, 'HoloTorus');
    scene.add(holoTorus);

    // Neon Monolith Towers
    const towers: Object3D[] = [];
    const towerGeo = new BoxGeometry(0.8, 4.0, 0.8);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dist = 5.5 + (i % 3) * 1.5;
      const heightScale = 0.5 + Math.random() * 1.5;

      const tMat = new HologramMaterial({
        color: i % 2 === 0 ? theme.accent : theme.secondary,
        fresnelPower: 2.0,
        scanlineDensity: 25.0,
        opacity: 0.85
      });

      const tower = new Object3D(towerGeo, tMat, `Tower_${i}`);
      tower.position.set(Math.cos(angle) * dist, heightScale * 2 - 2, Math.sin(angle) * dist);
      tower.scale.set(1, heightScale, 1);
      towers.push(tower);
      scene.add(tower);
    }

    return {
      scene,
      camera,
      update: (_delta: number, time: number) => {
        controls.update();

        // Update Hologram Shader Uniforms
        holoMat.updateUniforms(time);
        holoTorus.rotation.x = time * 0.5;
        holoTorus.rotation.y = time * 0.7;

        // Towers bobbing pulse
        towers.forEach((tower, i) => {
          (tower.material as HologramMaterial).updateUniforms(time + i * 0.5);
          tower.position.y = Math.sin(time * 1.5 + i) * 0.2 + (tower.scale.y * 2 - 2);
        });

        // Grid scan animation
        gridPlane.position.z = (time * 2) % 1;

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
