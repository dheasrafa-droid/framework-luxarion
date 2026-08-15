/**
 * @file OrthographicCamera.ts
 * @description Orthographic projection camera maintaining parallel scale without perspective distortion.
 * Part of Luxarion Engine - Single Responsibility: Orthographic Projection Camera.
 */

import { Camera } from './Camera';

export class OrthographicCamera extends Camera {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;
  public near: number;
  public far: number;

  constructor(left: number = -1, right: number = 1, top: number = 1, bottom: number = -1, near: number = 0.1, far: number = 1000) {
    super('OrthographicCamera');
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  public updateProjectionMatrix(): void {
    this.projectionMatrix.makeOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
    this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
}
