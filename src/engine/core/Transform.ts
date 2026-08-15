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

  public updateLocalMatrix(): void {
    this.quaternion.setFromEuler(this.rotation);
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
