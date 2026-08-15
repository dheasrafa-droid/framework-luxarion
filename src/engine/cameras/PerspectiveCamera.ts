/**
 * @file PerspectiveCamera.ts
 * @description Perspective projection camera mimicking human optical perception with depth foreshortening.
 * Part of Luxarion Engine - Single Responsibility: Perspective Projection Camera.
 */

import { Camera } from './Camera';
import { MathUtils } from '../math/MathUtils';

export class PerspectiveCamera extends Camera {
  public fov: number; // in degrees
  public aspect: number;
  public near: number;
  public far: number;

  constructor(fov: number = 60, aspect: number = 1, near: number = 0.1, far: number = 1000) {
    super('PerspectiveCamera');
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    const fovRad = MathUtils.degToRad(this.fov);
    this.projectionMatrix.makePerspective(fovRad, this.aspect, this.near, this.far);
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
}
