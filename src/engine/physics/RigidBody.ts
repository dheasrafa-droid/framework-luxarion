/**
 * @file RigidBody.ts
 * @description 3D Rigid Body physics entity with mass, inertia, linear/angular velocity, damping, and force accumulation.
 * Part of Luxarion Engine - Physics Subsystem.
 */

import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Object3D } from '../core/Object3D';

export type BodyType = 'dynamic' | 'static' | 'kinematic';

export interface RigidBodyConfig {
  mass?: number;
  type?: BodyType;
  linearDamping?: number;
  angularDamping?: number;
  restitution?: number;
  friction?: number;
  useGravity?: boolean;
}

export class RigidBody {
  public object: Object3D | null = null;
  public type: BodyType = 'dynamic';

  public mass: number = 1.0;
  public invMass: number = 1.0;

  public position: Vector3 = new Vector3(0, 0, 0);
  public velocity: Vector3 = new Vector3(0, 0, 0);
  public force: Vector3 = new Vector3(0, 0, 0);

  public rotation: Quaternion = new Quaternion();
  public angularVelocity: Vector3 = new Vector3(0, 0, 0);
  public torque: Vector3 = new Vector3(0, 0, 0);

  public linearDamping: number = 0.01;
  public angularDamping: number = 0.05;
  public restitution: number = 0.7; // Bounciness
  public friction: number = 0.3;
  public useGravity: boolean = true;

  // Collision bounding radius or half-extents
  public radius: number = 0.5;
  public halfExtents: Vector3 = new Vector3(0.5, 0.5, 0.5);

  constructor(object?: Object3D, config: RigidBodyConfig = {}) {
    if (object) {
      this.object = object;
      this.position.copy(object.position);
      this.rotation.copy(object.quaternion);
    }

    if (config.type) this.setType(config.type);
    if (config.mass !== undefined) this.setMass(config.mass);
    if (config.linearDamping !== undefined) this.linearDamping = config.linearDamping;
    if (config.angularDamping !== undefined) this.angularDamping = config.angularDamping;
    if (config.restitution !== undefined) this.restitution = config.restitution;
    if (config.friction !== undefined) this.friction = config.friction;
    if (config.useGravity !== undefined) this.useGravity = config.useGravity;
  }

  public setType(type: BodyType): this {
    this.type = type;
    if (type === 'static') {
      this.mass = 0;
      this.invMass = 0;
      this.velocity.set(0, 0, 0);
      this.angularVelocity.set(0, 0, 0);
    } else if (this.mass === 0) {
      this.setMass(1.0);
    }
    return this;
  }

  public setMass(mass: number): this {
    this.mass = mass;
    this.invMass = mass > 0 ? 1.0 / mass : 0;
    return this;
  }

  public applyForce(f: Vector3): this {
    if (this.type !== 'dynamic') return this;
    this.force.add(f);
    return this;
  }

  public applyImpulse(impulse: Vector3): this {
    if (this.type !== 'dynamic') return this;
    this.velocity.x += impulse.x * this.invMass;
    this.velocity.y += impulse.y * this.invMass;
    this.velocity.z += impulse.z * this.invMass;
    return this;
  }

  public applyTorque(t: Vector3): this {
    if (this.type !== 'dynamic') return this;
    this.torque.add(t);
    return this;
  }

  public syncToObject(): void {
    if (!this.object) return;
    this.object.position.copy(this.position);
    this.object.quaternion.copy(this.rotation);
  }

  public syncFromObject(): void {
    if (!this.object) return;
    this.position.copy(this.object.position);
    this.rotation.copy(this.object.quaternion);
  }
}
