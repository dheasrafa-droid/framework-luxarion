/**
 * @file Demo3DPhysicsBilliards.ts
 * @description Real-time 3D rigid body physics simulation featuring symplectic Euler integration, impulse collisions, raycasting, and bouncy sphere dynamics.
 * Part of Luxarion Engine - Physics Showcase Module.
 */

import {
  Scene,
  PerspectiveCamera,
  OrbitControls,
  SphereGeometry,
  BoxGeometry,
  PlaneGeometry,
  Object3D,
  PhongMaterial,
  DirectionalLight,
  AmbientLight,
  PointLight,
  PhysicsWorld,
  RigidBody,
  Raycaster,
  Vector3,
  WebGLRenderer,
  ThemeManager
} from '../src/engine/Luxarion';
import { LuxarionDemo } from './ExampleRegistry';

export const Demo3DPhysicsBilliards: LuxarionDemo = {
  id: '3d-physics-billiards',
  name: '3D Rigid Body Physics Arena',
  category: '3d',
  is2D: false,
  description: 'Interactive 3D Rigid Body physics engine with symplectic Euler integration, sphere-to-sphere impulse collisions, arena cushion bouncing, and click-to-launch impulse raycasting.',
  init: (glRenderer: WebGLRenderer | null, _, themeManager: ThemeManager) => {
    if (!glRenderer) throw new Error('WebGL Renderer required');

    const scene = new Scene('PhysicsBilliardsScene');
    glRenderer.clearColor.setHex('#090d16');

    const camera = new PerspectiveCamera(45, glRenderer.width / glRenderer.height, 0.1, 100);
    camera.position.set(0, 11, 13);

    const controls = new OrbitControls(camera, glRenderer.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Physics Engine Instance
    const physics = new PhysicsWorld({
      gravity: new Vector3(0, -12, 0),
      subSteps: 4
    });
    physics.groundY = 0;
    physics.bounds = { minX: -5, maxX: 5, minZ: -5, maxZ: 5 };

    const raycaster = new Raycaster();
    const bodies: RigidBody[] = [];

    // Lighting
    const amb = new AmbientLight('#ffffff', 0.3);
    scene.add(amb);

    const dir = new DirectionalLight('#ffffff', 1.2);
    dir.position.set(5, 15, 8);
    scene.add(dir);

    const pt = new PointLight('#38bdf8', 1.8, 25);
    pt.position.set(0, 8, 0);
    scene.add(pt);

    // Billiard / Arena Floor
    const floorGeo = new PlaneGeometry(10, 10, 1, 1);
    const floorMat = new PhongMaterial({
      color: '#0f172a',
      specular: '#334155',
      shininess: 32
    });
    const floor = new Object3D(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Arena Perimeter Cushions
    const cushionMat = new PhongMaterial({ color: '#1e293b', specular: '#475569', shininess: 16 });
    const wallThick = 0.4;
    const wallHeight = 0.8;

    const nsWallGeo = new BoxGeometry(10.8, wallHeight, wallThick);
    const wallN = new Object3D(nsWallGeo, cushionMat);
    wallN.position.set(0, wallHeight / 2, -5.2);
    scene.add(wallN);

    const wallS = new Object3D(nsWallGeo, cushionMat);
    wallS.position.set(0, wallHeight / 2, 5.2);
    scene.add(wallS);

    const ewWallGeo = new BoxGeometry(wallThick, wallHeight, 10.8);
    const wallE = new Object3D(ewWallGeo, cushionMat);
    wallE.position.set(5.2, wallHeight / 2, 0);
    scene.add(wallE);

    const wallW = new Object3D(ewWallGeo, cushionMat);
    wallW.position.set(-5.2, wallHeight / 2, 0);
    scene.add(wallW);

    // Spheres
    const colors = [
      '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
      '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#a855f7',
      '#14b8a6', '#6366f1', '#e11d48', '#84cc16', '#eab308'
    ];

    const sphereGeo = new SphereGeometry(0.4, 24, 24);

    let count = 0;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col <= row; col++) {
        const mat = new PhongMaterial({
          color: colors[count % colors.length],
          specular: '#ffffff',
          shininess: 90
        });

        const obj = new Object3D(sphereGeo, mat);
        const x = (col - row * 0.5) * 0.85 + (Math.random() - 0.5) * 0.1;
        const y = 2.5 + row * 0.6 + Math.random() * 0.5;
        const z = -2.0 + row * 0.75 + (Math.random() - 0.5) * 0.1;

        obj.position.set(x, y, z);
        scene.add(obj);

        const body = new RigidBody(obj, {
          mass: 1.0,
          type: 'dynamic',
          restitution: 0.82,
          friction: 0.1,
          linearDamping: 0.02,
          angularDamping: 0.05
        });
        body.radius = 0.4;
        body.velocity.set(
          (Math.random() - 0.5) * 2,
          Math.random() * 1,
          (Math.random() - 0.5) * 2
        );

        physics.addBody(body);
        bodies.push(body);
        count++;
      }
    }

    // Cue / White Striker Ball
    const cueMat = new PhongMaterial({ color: '#ffffff', specular: '#ffffff', shininess: 128 });
    const cueObj = new Object3D(sphereGeo, cueMat);
    cueObj.position.set(0, 0.4, 3.5);
    scene.add(cueObj);

    const cueBody = new RigidBody(cueObj, {
      mass: 1.5,
      type: 'dynamic',
      restitution: 0.85,
      friction: 0.08
    });
    cueBody.radius = 0.4;
    cueBody.velocity.set(0, 0, -14); // Break shot
    physics.addBody(cueBody);
    bodies.push(cueBody);

    // Interactive Impulse Click
    const onPointerDown = (e: MouseEvent) => {
      const rect = glRenderer.canvas.getBoundingClientRect();
      const coords = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      };

      raycaster.setFromCamera(coords, camera);
      const objects = bodies.map(b => b.object!).filter(Boolean);
      const hits = raycaster.intersectObjects(objects);

      if (hits.length > 0) {
        const hitObj = hits[0].object;
        const hitBody = bodies.find(b => b.object === hitObj);
        if (hitBody) {
          const impulse = raycaster.direction.clone().multiplyScalar(16);
          impulse.y = 8 + Math.random() * 5;
          hitBody.applyImpulse(impulse);
        }
      }
    };

    glRenderer.canvas.addEventListener('click', onPointerDown);

    return {
      update: (delta: number) => {
        controls.update();

        const dt = Math.min(delta, 0.05);
        physics.step(dt);

        glRenderer.render(scene, camera);
      },
      resize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      dispose: () => {
        glRenderer.canvas.removeEventListener('click', onPointerDown);
        controls.dispose();
      }
    };
  }
};
