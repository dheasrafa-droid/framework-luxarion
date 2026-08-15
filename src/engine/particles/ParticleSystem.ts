/**
 * @file ParticleSystem.ts
 * @description Dynamic 2D/3D Particle System simulator managing life cycles, kinetic forces, velocity, and color ramps.
 * Part of Luxarion Engine - Single Responsibility: Particle Simulation Engine.
 */

import { Vector3 } from '../math/Vector3';
import { Color } from '../math/Color';
import { MathUtils } from '../math/MathUtils';

export interface Particle {
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
  color: Color;
  startColor: Color;
  endColor: Color;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
}

export class ParticleSystem {
  public particles: Particle[] = [];
  public maxParticles: number = 600;
  public emitterPosition: Vector3 = new Vector3(0, 0, 0);
  public gravity: Vector3 = new Vector3(0, -0.2, 0);
  public swirlForce: number = 1.2;
  public baseSpeed: number = 2.0;

  constructor(maxParticles: number = 600) {
    this.maxParticles = maxParticles;
  }

  public emit(count: number = 5, startColor?: Color, endColor?: Color): void {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const speed = this.baseSpeed * (0.5 + Math.random() * 0.8);

      const vx = Math.cos(theta) * Math.cos(phi) * speed;
      const vy = Math.sin(phi) * speed + 0.5;
      const vz = Math.sin(theta) * Math.cos(phi) * speed;

      const sc = startColor ? startColor.clone() : new Color(0.2, 0.8, 1.0, 1.0);
      const ec = endColor ? endColor.clone() : new Color(1.0, 0.2, 0.6, 0.0);

      this.particles.push({
        position: this.emitterPosition.clone(),
        velocity: new Vector3(vx, vy, vz),
        acceleration: new Vector3(0, 0, 0),
        color: sc.clone(),
        startColor: sc,
        endColor: ec,
        size: MathUtils.randFloat(2.5, 6.0),
        life: 0,
        maxLife: MathUtils.randFloat(1.2, 2.5),
        alpha: 1.0
      });
    }
  }

  public update(delta: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.life / p.maxLife;

      // Swirl force around Y axis
      const radius = Math.sqrt(p.position.x * p.position.x + p.position.z * p.position.z) + 0.1;
      const swirlX = -p.position.z / radius * this.swirlForce;
      const swirlZ = p.position.x / radius * this.swirlForce;

      p.velocity.x += (swirlX + this.gravity.x) * delta;
      p.velocity.y += this.gravity.y * delta;
      p.velocity.z += (swirlZ + this.gravity.z) * delta;

      p.position.x += p.velocity.x * delta;
      p.position.y += p.velocity.y * delta;
      p.position.z += p.velocity.z * delta;

      // Interpolate color & alpha
      p.color.r = MathUtils.lerp(p.startColor.r, p.endColor.r, t);
      p.color.g = MathUtils.lerp(p.startColor.g, p.endColor.g, t);
      p.color.b = MathUtils.lerp(p.startColor.b, p.endColor.b, t);
      p.alpha = MathUtils.lerp(1.0, 0.0, t);
    }
  }

  public clear(): void {
    this.particles = [];
  }
}
