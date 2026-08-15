/**
 * @file Transform.ts
 * @description Coordinate transformation state managing position, rotation, scale, local matrix, and world matrix caching.
 * Part of Luxarion Engine - Single Responsibility: Spatial Transformation Matrices.
 */

import { Vector3 } from '../math/Vector3';
import { Quaternion } from '../math/Quaternion';
import { Euler } from '../math/Euler';
import { Matrix4 } from '../math/Matrix4';

export class Transform {
  public position: Vector3 = new Vector3(0, 0, 0);
  public rotation: Euler = new Euler(0, 0, 0);
  public quaternion: Quaternion = new Quaternion(0, 0, 0, 1);
  public scale: Vector3 = new Vector3(1, 1, 1);

  public localMatrix: Matrix4 = new Matrix4();
  public worldMatrix: Matrix4 = new Matrix4();

  public autoUpdate: boolean = true;
  public matrixWorldNeedsUpdate: boolean = true;

  private _tempQuat: Quaternion = new Quaternion();

  public rotateOnAxis(axis: Vector3, angle: number): this {
    this._tempQuat.setFromAxisAngle(axis, angle);
    this.quaternion.multiply(this._tempQuat);
    this.rotation.setFromQuaternion(this.quaternion);
    this.matrixWorldNeedsUpdate = true;
    return this;
  }

  public rotateX(angle: number): this {
    const axis = new Vector3(1, 0, 0);
    return this.rotateOnAxis(axis, angle);
  }

  public rotateY(angle: number): this {
    const axis = new Vector3(0, 1, 0);
    return this.rotateOnAxis(axis, angle);
  }

  public rotateZ(angle: number): this {
    const axis = new Vector3(0, 0, 1);
    return this.rotateOnAxis(axis, angle);
  }

  public setRotationFromEuler(euler: Euler): this {
    this.rotation.copy(euler);
    this.quaternion.setFromEuler(this.rotation);
    this.matrixWorldNeedsUpdate = true;
    return this;
  }

  public setRotationFromQuaternion(q: Quaternion): this {
    this.quaternion.copy(q);
    this.rotation.setFromQuaternion(this.quaternion);
    this.matrixWorldNeedsUpdate = true;
    return this;
  }

  public updateLocalMatrix(): void {
    this.localMatrix.compose(this.position, this.quaternion, this.scale);
    this.matrixWorldNeedsUpdate = true;
  }

  public updateWorldMatrix(parentWorldMatrix?: Matrix4): void {
    if (this.autoUpdate) {
      this.updateLocalMatrix();
    }

    if (parentWorldMatrix) {
      this.worldMatrix.multiplyMatrices(parentWorldMatrix, this.localMatrix);
    } else {
      this.worldMatrix.copy(this.localMatrix);
    }

    this.matrixWorldNeedsUpdate = false;
  }
}
