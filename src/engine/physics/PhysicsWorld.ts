/**
 * @file PhysicsWorld.ts
 * @description 3D Physics Simulation World with symplectic Euler integrator, gravity, sphere/plane collision resolution, and restitution.
 * Part of Luxarion Engine - Physics Subsystem.
 */

import { RigidBody } from './RigidBody';
import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';

export interface PhysicsWorldConfig {
  gravity?: Vector3;
  subSteps?: number;
  damping?: number;
}

export class PhysicsWorld {
  public gravity: Vector3 = new Vector3(0, -9.81, 0);
  public bodies: RigidBody[] = [];
  public subSteps: number = 2;

  // Collision ground planes: normal and elevation
  public groundY: number = -2.0;
  public bounds: { minX: number; maxX: number; minZ: number; maxZ: number } = {
    minX: -8,
    maxX: 8,
    minZ: -8,
    maxZ: 8
  };

  constructor(config: PhysicsWorldConfig = {}) {
    if (config.gravity) this.gravity.copy(config.gravity);
    if (config.subSteps !== undefined) this.subSteps = config.subSteps;
  }

  public addBody(body: RigidBody): this {
    if (!this.bodies.includes(body)) {
      this.bodies.push(body);
    }
    return this;
  }

  public removeBody(body: RigidBody): this {
    const idx = this.bodies.indexOf(body);
    if (idx !== -1) {
      this.bodies.splice(idx, 1);
    }
    return this;
  }

  public clear(): void {
    this.bodies = [];
  }

  public step(dt: number): void {
    const subDt = dt / this.subSteps;

    for (let step = 0; step < this.subSteps; step++) {
      this._subStep(subDt);
    }

    // Sync back to Object3D visual transforms
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].syncToObject();
    }
  }

  private _subStep(dt: number): void {
    // 1. Integrate forces & velocities (Symplectic Euler)
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      if (b.type !== 'dynamic') continue;

      // Apply Gravity
      if (b.useGravity) {
        b.velocity.x += this.gravity.x * dt;
        b.velocity.y += this.gravity.y * dt;
        b.velocity.z += this.gravity.z * dt;
      }

      // Apply Accumulated Forces
      b.velocity.x += b.force.x * b.invMass * dt;
      b.velocity.y += b.force.y * b.invMass * dt;
      b.velocity.z += b.force.z * b.invMass * dt;
      b.force.set(0, 0, 0);

      // Linear Damping
      const linDamp = Math.max(0, 1.0 - b.linearDamping * dt);
      b.velocity.multiplyScalar(linDamp);

      // Integrate Position
      b.position.x += b.velocity.x * dt;
      b.position.y += b.velocity.y * dt;
      b.position.z += b.velocity.z * dt;

      // Angular Damping & Rotation update
      const angDamp = Math.max(0, 1.0 - b.angularDamping * dt);
      b.angularVelocity.multiplyScalar(angDamp);

      // Simple angular integration
      if (b.angularVelocity.lengthSq() > 0.00001) {
        const angle = b.angularVelocity.length() * dt;
        const axis = b.angularVelocity.clone().normalize();
        const deltaQ = new Quaternion().setFromAxisAngle(axis, angle);
        b.rotation.multiply(deltaQ).normalize();
      }
    }

    // 2. Collision Detection & Resolution
    this._resolveCollisions();
  }

  private _resolveCollisions(): void {
    const bodies = this.bodies;
    const len = bodies.length;

    // A. Body vs Ground Plane & Lateral Bounding Walls
    for (let i = 0; i < len; i++) {
      const b = bodies[i];
      if (b.type !== 'dynamic') continue;

      // Ground Plane Collision (Y = groundY + radius)
      const floorY = this.groundY + b.radius;
      if (b.position.y < floorY) {
        b.position.y = floorY;
        if (b.velocity.y < 0) {
          b.velocity.y = -b.velocity.y * b.restitution;
          // Lateral surface friction
          b.velocity.x *= (1.0 - b.friction);
          b.velocity.z *= (1.0 - b.friction);
        }
      }

      // Lateral Wall Bounces
      if (b.position.x < this.bounds.minX + b.radius) {
        b.position.x = this.bounds.minX + b.radius;
        b.velocity.x = Math.abs(b.velocity.x) * b.restitution;
      } else if (b.position.x > this.bounds.maxX - b.radius) {
        b.position.x = this.bounds.maxX - b.radius;
        b.velocity.x = -Math.abs(b.velocity.x) * b.restitution;
      }

      if (b.position.z < this.bounds.minZ + b.radius) {
        b.position.z = this.bounds.minZ + b.radius;
        b.velocity.z = Math.abs(b.velocity.z) * b.restitution;
      } else if (b.position.z > this.bounds.maxZ - b.radius) {
        b.position.z = this.bounds.maxZ - b.radius;
        b.velocity.z = -Math.abs(b.velocity.z) * b.restitution;
      }
    }

    // B. Sphere vs Sphere Inter-body Collisions
    for (let i = 0; i < len; i++) {
      const bA = bodies[i];
      for (let j = i + 1; j < len; j++) {
        const bB = bodies[j];

        if (bA.type === 'static' && bB.type === 'static') continue;

        const dx = bB.position.x - bA.position.x;
        const dy = bB.position.y - bA.position.y;
        const dz = bB.position.z - bA.position.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const minDist = bA.radius + bB.radius;

        if (distSq < minDist * minDist && distSq > 0.00001) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;

          // Penetration resolution
          const penetration = minDist - dist;
          const totalInvMass = bA.invMass + bB.invMass;
          if (totalInvMass > 0) {
            const sepA = (penetration * (bA.invMass / totalInvMass));
            const sepB = (penetration * (bB.invMass / totalInvMass));

            if (bA.type === 'dynamic') {
              bA.position.x -= nx * sepA;
              bA.position.y -= ny * sepA;
              bA.position.z -= nz * sepA;
            }
            if (bB.type === 'dynamic') {
              bB.position.x += nx * sepB;
              bB.position.y += ny * sepB;
              bB.position.z += nz * sepB;
            }
          }

          // Relative velocity along normal
          const rvx = bB.velocity.x - bA.velocity.x;
          const rvy = bB.velocity.y - bA.velocity.y;
          const rvz = bB.velocity.z - bA.velocity.z;
          const velAlongNormal = rvx * nx + rvy * ny + rvz * nz;

          if (velAlongNormal < 0) {
            // Impulse scalar with restitution
            const e = Math.min(bA.restitution, bB.restitution);
            const impulseMag = -(1.0 + e) * velAlongNormal / totalInvMass;

            const ix = nx * impulseMag;
            const iy = ny * impulseMag;
            const iz = nz * impulseMag;

            if (bA.type === 'dynamic') {
              bA.velocity.x -= ix * bA.invMass;
              bA.velocity.y -= iy * bA.invMass;
              bA.velocity.z -= iz * bA.invMass;
            }
            if (bB.type === 'dynamic') {
              bB.velocity.x += ix * bB.invMass;
              bB.velocity.y += iy * bB.invMass;
              bB.velocity.z += iz * bB.invMass;
            }
          }
        }
      }
    }
  }
}
