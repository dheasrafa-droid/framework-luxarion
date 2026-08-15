/**
 * @file Physics.test.ts
 * @description Unit tests for PhysicsWorld, RigidBody integration, and Raycasting intersections.
 */

import { PhysicsWorld } from '../../src/engine/physics/PhysicsWorld';
import { RigidBody } from '../../src/engine/physics/RigidBody';
import { Raycaster } from '../../src/engine/physics/Raycaster';
import { Vector3 } from '../../src/engine/math/Vector3';

export function runPhysicsUnitTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  // 1. RigidBody & Gravity Integration
  try {
    const world = new PhysicsWorld({ gravity: new Vector3(0, -10, 0), subSteps: 1 });
    const body = new RigidBody(undefined, { mass: 1, type: 'dynamic', useGravity: true });
    body.position.set(0, 10, 0);
    world.addBody(body);

    world.step(0.1); // v = -1, pos = 9.9
    const ok = body.velocity.y < 0 && body.position.y < 10;
    tests.push({ name: 'RigidBody Gravity & Symplectic Euler Step', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'RigidBody Gravity & Symplectic Euler Step', passed: false, error: e.message });
  }

  // 2. Ground Collision Resolution
  try {
    const world = new PhysicsWorld({ gravity: new Vector3(0, -10, 0), subSteps: 1 });
    world.groundY = 0;
    const body = new RigidBody(undefined, { mass: 1, type: 'dynamic', restitution: 0.5 });
    body.radius = 0.5;
    body.position.set(0, 0.2, 0); // Penetrating ground (floorY = 0.5)
    body.velocity.set(0, -5, 0);
    world.addBody(body);

    world.step(0.016);
    const ok = body.position.y >= 0.5 && body.velocity.y >= 0;
    tests.push({ name: 'PhysicsWorld Ground Collision & Restitution Bounce', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'PhysicsWorld Ground Collision & Restitution Bounce', passed: false, error: e.message });
  }

  // 3. Raycaster Sphere & Plane Intersections
  try {
    const ray = new Raycaster(new Vector3(0, 0, 10), new Vector3(0, 0, -1));
    const hitSphere = ray.intersectSphere(new Vector3(0, 0, 0), 2);
    const hitPlane = ray.intersectPlane(new Vector3(0, 0, 1), 0);

    const okSphere = !!hitSphere && Math.abs(hitSphere.distance - 8) < 0.001;
    const okPlane = !!hitPlane && Math.abs(hitPlane.distance - 10) < 0.001;

    tests.push({ name: 'Raycaster 3D Sphere & Plane Intersection Math', passed: okSphere && okPlane });
  } catch (e: any) {
    tests.push({ name: 'Raycaster 3D Sphere & Plane Intersection Math', passed: false, error: e.message });
  }

  return tests;
}
