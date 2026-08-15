/**
 * @file ForceField.ts
 * @description Force Field physics operators for Luxarion particle dynamics and flow field simulations.
 * Part of Luxarion Engine - Particle & Simulation System.
 */

import { Vector3 } from '../math/Vector3';
import { Noise } from '../math/Noise';

export type ForceFieldType = 'vortex' | 'gravity' | 'turbulence' | 'drag';

export interface ForceFieldConfig {
  type: ForceFieldType;
  position?: Vector3;
  strength?: number;
  radius?: number;
  frequency?: number;
  decay?: number;
}

export class ForceField {
  public type: ForceFieldType;
  public position: Vector3;
  public strength: number;
  public radius: number;
  public frequency: number;
  public decay: number;

  constructor(config: ForceFieldConfig) {
    this.type = config.type;
    this.position = config.position || new Vector3(0, 0, 0);
    this.strength = config.strength !== undefined ? config.strength : 1.0;
    this.radius = config.radius !== undefined ? config.radius : 10.0;
    this.frequency = config.frequency !== undefined ? config.frequency : 0.1;
    this.decay = config.decay !== undefined ? config.decay : 1.0;
  }

  public apply(pos: Vector3, vel: Vector3, targetForce: Vector3, time: number = 0): Vector3 {
    targetForce.set(0, 0, 0);

    const dx = pos.x - this.position.x;
    const dy = pos.y - this.position.y;
    const dz = pos.z - this.position.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    const dist = Math.sqrt(distSq);

    if (dist > this.radius && this.radius > 0) return targetForce;

    const falloff = Math.max(0, 1.0 - dist / this.radius);

    switch (this.type) {
      case 'vortex': {
        // Tangential swirl around Y axis + slight inward pull
        const nx = -dz / (dist + 0.001);
        const nz = dx / (dist + 0.001);
        targetForce.x = (nx * this.strength - (dx / (dist + 0.001)) * 0.2 * this.strength) * falloff;
        targetForce.y = Math.sin(time * 2.0 + dist) * 0.1 * this.strength;
        targetForce.z = (nz * this.strength - (dz / (dist + 0.001)) * 0.2 * this.strength) * falloff;
        break;
      }

      case 'gravity': {
        if (dist > 0.01) {
          const forceMag = (this.strength * 10.0) / (distSq + 1.0);
          targetForce.x = (-dx / dist) * forceMag;
          targetForce.y = (-dy / dist) * forceMag;
          targetForce.z = (-dz / dist) * forceMag;
        }
        break;
      }

      case 'turbulence': {
        const nx = Noise.noise3D(pos.x * this.frequency, pos.y * this.frequency, time * 0.5);
        const ny = Noise.noise3D(pos.y * this.frequency, pos.z * this.frequency, time * 0.5 + 10.0);
        const nz = Noise.noise3D(pos.z * this.frequency, pos.x * this.frequency, time * 0.5 + 20.0);
        targetForce.x = nx * this.strength * falloff;
        targetForce.y = ny * this.strength * falloff;
        targetForce.z = nz * this.strength * falloff;
        break;
      }

      case 'drag': {
        targetForce.x = -vel.x * this.strength;
        targetForce.y = -vel.y * this.strength;
        targetForce.z = -vel.z * this.strength;
        break;
      }
    }

    return targetForce;
  }
}
