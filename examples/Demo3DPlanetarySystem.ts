/**
 * @file Demo3DPlanetarySystem.ts
 * @description 3D Solar Celestial Orrery with hierarchical planetary orbits, nested moon anchors, Saturn ring geometry, and central stellar point light.
 * Built using pure Luxarion barrel export.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  TorusGeometry,
  PhongMaterial,
  HologramMaterial,
  WireframeMaterial,
  Object3D,
  Node,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DPlanetarySystem: LuxarionDemo = {
  id: '3d-planetary-system',
  name: '3D Celestial Solar Orrery',
  category: 'space',
  description: 'Multi-tiered hierarchical planetary orrery demonstrating deep scenegraph transform matrix nesting, orbiting moons, Saturn rings, and central stellar luminescence.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('SolarOrreryScene');
    const theme = themeManager.currentTheme;
    glRenderer.clearColor.setHex(theme.background);

    const camera = new PerspectiveCamera(50, glRenderer.width / glRenderer.height, 0.1, 150);
    camera.position.set(0, 10, 18);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.minDistance = 3;
    controls.maxDistance = 45;

    // Ambient Lighting for deep space
    const ambientLight = new AmbientLight(theme.ambientLight, 0.35);
    scene.add(ambientLight);

    // Stellar Core Light (The Sun radiates light throughout the system)
    const sunLight = new PointLight(theme.pointLight, 2.8, 40);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 1. Central Sun Core
    const sunGeo = new SphereGeometry(1.6, 24, 24);
    const sunMat = new HologramMaterial({
      color: theme.accent,
      fresnelPower: 1.4,
      scanlineDensity: 18.0,
      opacity: 0.95
    });
    const sunMesh = new Object3D(sunGeo, sunMat, 'SunCore');
    scene.add(sunMesh);

    // Planets Config
    interface PlanetData {
      name: string;
      radius: number;
      orbitRadius: number;
      orbitSpeed: number;
      rotSpeed: number;
      color: string;
      shininess: number;
      hasRings?: boolean;
      ringInner?: number;
      ringOuter?: number;
      moons?: { name: string; radius: number; dist: number; speed: number; color: string }[];
    }

    const planetsConfig: PlanetData[] = [
      {
        name: 'Mercury',
        radius: 0.25,
        orbitRadius: 3.2,
        orbitSpeed: 1.8,
        rotSpeed: 0.8,
        color: '#94a3b8',
        shininess: 40
      },
      {
        name: 'Venus',
        radius: 0.45,
        orbitRadius: 4.8,
        orbitSpeed: 1.2,
        rotSpeed: -0.4,
        color: '#fbbf24',
        shininess: 60
      },
      {
        name: 'Earth',
        radius: 0.52,
        orbitRadius: 6.8,
        orbitSpeed: 0.9,
        rotSpeed: 1.5,
        color: '#38bdf8',
        shininess: 80,
        moons: [
          { name: 'Moon', radius: 0.14, dist: 1.1, speed: 3.2, color: '#e2e8f0' }
        ]
      },
      {
        name: 'Mars',
        radius: 0.38,
        orbitRadius: 8.8,
        orbitSpeed: 0.7,
        rotSpeed: 1.3,
        color: '#f87171',
        shininess: 50
      },
      {
        name: 'Jupiter',
        radius: 1.1,
        orbitRadius: 11.8,
        orbitSpeed: 0.45,
        rotSpeed: 2.2,
        color: '#f59e0b',
        shininess: 90,
        moons: [
          { name: 'Io', radius: 0.12, dist: 1.8, speed: 4.0, color: '#fde047' },
          { name: 'Europa', radius: 0.10, dist: 2.3, speed: 2.8, color: '#bae6fd' },
          { name: 'Ganymede', radius: 0.16, dist: 2.9, speed: 1.9, color: '#cbd5e1' }
        ]
      },
      {
        name: 'Saturn',
        radius: 0.9,
        orbitRadius: 15.2,
        orbitSpeed: 0.3,
        rotSpeed: 1.8,
        color: '#fde68a',
        shininess: 85,
        hasRings: true,
        ringInner: 1.4,
        ringOuter: 2.2,
        moons: [
          { name: 'Titan', radius: 0.15, dist: 2.7, speed: 2.2, color: '#fdba74' }
        ]
      }
    ];

    // Build hierarchical Scenegraph nodes for each planet
    const planetInstances: {
      orbitNode: Node;
      planetMesh: Object3D;
      config: PlanetData;
      moonNodes: { orbitNode: Node; mesh: Object3D; speed: number }[];
    }[] = [];

    const sphereGeometriesCache = new Map<number, SphereGeometry>();
    const getSphereGeo = (r: number) => {
      if (!sphereGeometriesCache.has(r)) {
        sphereGeometriesCache.set(r, new SphereGeometry(r, 18, 18));
      }
      return sphereGeometriesCache.get(r)!;
    };

    planetsConfig.forEach(pData => {
      // 1. Orbital Ring Guide Line
      const orbitRingGeo = new TorusGeometry(pData.orbitRadius, 0.015, 8, 64);
      const orbitRingMat = new WireframeMaterial({
        color: theme.accent,
        opacity: 0.2
      });
      const orbitRingMesh = new Object3D(orbitRingGeo, orbitRingMat, `${pData.name}_OrbitLine`);
      orbitRingMesh.rotation.x = Math.PI / 2;
      scene.add(orbitRingMesh);

      // 2. Planet Orbit Pivot Node
      const orbitNode = new Node(`${pData.name}_OrbitAnchor`);
      scene.add(orbitNode);

      // 3. Planet Mesh Entity
      const pGeo = getSphereGeo(pData.radius);
      const pMat = new PhongMaterial({
        color: pData.color,
        specular: '#ffffff',
        shininess: pData.shininess,
        opacity: 1.0
      });
      const planetMesh = new Object3D(pGeo, pMat, `${pData.name}_Body`);
      planetMesh.position.x = pData.orbitRadius;
      orbitNode.add(planetMesh);

      // 4. Saturn Rings
      if (pData.hasRings) {
        const ringGeo = new TorusGeometry(1.8, 0.35, 8, 36);
        const ringMat = new WireframeMaterial({
          color: theme.secondary,
          opacity: 0.6
        });
        const ringMesh = new Object3D(ringGeo, ringMat, `${pData.name}_Rings`);
        ringMesh.rotation.x = Math.PI / 2.8;
        ringMesh.scale.z = 0.05; // flatten ring
        planetMesh.add(ringMesh);
      }

      // 5. Nested Moons (Parent-Child Hierarchy)
      const moonNodes: { orbitNode: Node; mesh: Object3D; speed: number }[] = [];
      if (pData.moons) {
        pData.moons.forEach(m => {
          const moonOrbit = new Node(`${m.name}_OrbitAnchor`);
          planetMesh.add(moonOrbit); // Nested directly under planet!

          const mGeo = getSphereGeo(m.radius);
          const mMat = new PhongMaterial({
            color: m.color,
            specular: '#ffffff',
            shininess: 30
          });
          const mMesh = new Object3D(mGeo, mMat, m.name);
          mMesh.position.x = m.dist;
          moonOrbit.add(mMesh);

          moonNodes.push({ orbitNode: moonOrbit, mesh: mMesh, speed: m.speed });
        });
      }

      planetInstances.push({
        orbitNode,
        planetMesh,
        config: pData,
        moonNodes
      });
    });

    return {
      scene,
      camera,
      update: (_delta: number, time: number) => {
        controls.update();

        // Animate Sun Core
        sunMat.updateUniforms(time);
        sunMesh.rotation.y = time * 0.2;

        // Animate Planets and Moons
        planetInstances.forEach(({ orbitNode, planetMesh, config, moonNodes }) => {
          // Orbit around sun
          orbitNode.rotation.y = time * config.orbitSpeed * 0.3;
          // Self-axial rotation
          planetMesh.rotation.y = time * config.rotSpeed;

          // Orbit moons around their host planet
          moonNodes.forEach(m => {
            m.orbitNode.rotation.y = time * m.speed * 0.5;
            m.mesh.rotation.y = time * 2.0;
          });
        });

        // Dynamic theme background sync
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
