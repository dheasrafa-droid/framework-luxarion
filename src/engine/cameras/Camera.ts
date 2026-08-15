/**
 * @file Camera.ts
 * @description Base Camera class managing view and projection matrix transformations.
 * Part of Luxarion Engine - Single Responsibility: Camera Base Abstraction.
 */

import { Node } from '../core/Node';
import { Matrix4 } from '../math/Matrix4';

export class Camera extends Node {
  public projectionMatrix: Matrix4 = new Matrix4();
  public viewMatrix: Matrix4 = new Matrix4();
  public projectionMatrixInverse: Matrix4 = new Matrix4();
  public isCamera: boolean = true;

  constructor(name: string = 'Camera') {
    super(name);
  }

  public updateMatrixWorld(force?: boolean): void {
    super.updateWorldMatrix(force);
    this.viewMatrix.copy(this.worldMatrix).invert();
  }
}
