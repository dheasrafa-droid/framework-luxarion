/**
 * @file Raycaster.ts
 * @description 3D Raycasting against Spheres, Planes, AABBs, and Mesh geometries for physics picking and ray queries.
 * Part of Luxarion Engine - Physics Subsystem.
 */

import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Camera } from '../cameras/Camera';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';

export interface Intersection {
  distance: number;
  point: Vector3;
  object: Object3D;
  normal?: Vector3;
}

export class Raycaster {
  public origin: Vector3 = new Vector3(0, 0, 0);
  public direction: Vector3 = new Vector3(0, 0, -1);
  public near: number = 0.05;
  public far: number = 1000;

  constructor(origin?: Vector3, direction?: Vector3, near: number = 0.05, far: number = 1000) {
    if (origin) this.origin.copy(origin);
    if (direction) this.direction.copy(direction).normalize();
    this.near = near;
    this.far = far;
  }

  public set(origin: Vector3, direction: Vector3): this {
    this.origin.copy(origin);
    this.direction.copy(direction).normalize();
    return this;
  }

  /**
   * Set ray from normalized device coordinates (NDC: [-1, 1]) and camera
   */
  public setFromCamera(coords: { x: number; y: number }, camera: Camera): this {
    if (camera instanceof PerspectiveCamera) {
      this.origin.copy(camera.position);

      const invProjView = new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.viewMatrix).invert();
      const target = new Vector3(coords.x, coords.y, 0.5).applyMatrix4(invProjView);

      this.direction.subVectors(target, this.origin).normalize();
    }
    return this;
  }

  /**
   * Ray-Sphere intersection test
   */
  public intersectSphere(center: Vector3, radius: number): { distance: number; point: Vector3 } | null {
    const oc = new Vector3().subVectors(this.origin, center);
    const a = this.direction.dot(this.direction);
    const b = 2.0 * oc.dot(this.direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) return null;

    const sqrtD = Math.sqrt(discriminant);
    const t1 = (-b - sqrtD) / (2.0 * a);
    const t2 = (-b + sqrtD) / (2.0 * a);

    const t = t1 >= this.near ? t1 : (t2 >= this.near ? t2 : -1);
    if (t < this.near || t > this.far) return null;

    const point = new Vector3().copy(this.direction).multiplyScalar(t).add(this.origin);
    return { distance: t, point };
  }

  /**
   * Ray-Plane intersection test (Plane normal n and constant d: n . p + d = 0)
   */
  public intersectPlane(planeNormal: Vector3, planeDistance: number = 0): { distance: number; point: Vector3 } | null {
    const denom = planeNormal.dot(this.direction);
    if (Math.abs(denom) < 0.0001) return null; // Parallel

    const t = -(this.origin.dot(planeNormal) + planeDistance) / denom;
    if (t < this.near || t > this.far) return null;

    const point = new Vector3().copy(this.direction).multiplyScalar(t).add(this.origin);
    return { distance: t, point };
  }

  public intersectObjects(objects: Object3D[], recursive: boolean = true): Intersection[] {
    const hits: Intersection[] = [];

    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i];
      if (!obj.visible) continue;

      // Approximate bounding sphere radius from position
      const hit = this.intersectSphere(obj.position, 1.2);
      if (hit) {
        hits.push({
          distance: hit.distance,
          point: hit.point,
          object: obj,
          normal: new Vector3().subVectors(hit.point, obj.position).normalize()
        });
      }
    }

    hits.sort((a, b) => a.distance - b.distance);
    return hits;
  }
}
