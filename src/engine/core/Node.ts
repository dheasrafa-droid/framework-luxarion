/**
 * @file Node.ts
 * @description Hierarchical Scenegraph Node managing tree structures, parenting, traversal, and coordinate propagation.
 * Part of Luxarion Engine - Single Responsibility: Hierarchical Scene Graph Structure.
 */

import { EventDispatcher } from './EventDispatcher';
import { Transform } from './Transform';
import { MathUtils } from '../math/MathUtils';
import { Vector3 } from '../math/Vector3';
import { Euler } from '../math/Euler';
import { Matrix4 } from '../math/Matrix4';

export class Node extends EventDispatcher {
  public readonly id: string;
  public name: string = '';
  public parent: Node | null = null;
  public children: Node[] = [];
  public transform: Transform = new Transform();
  public visible: boolean = true;
  public renderOrder: number = 0;

  constructor(name: string = '') {
    super();
    this.id = MathUtils.generateUUID();
    this.name = name;
  }

  public get position(): Vector3 {
    return this.transform.position;
  }

  public get rotation(): Euler {
    return this.transform.rotation;
  }

  public get scale(): Vector3 {
    return this.transform.scale;
  }

  public get worldMatrix(): Matrix4 {
    return this.transform.worldMatrix;
  }

  public add(child: Node): this {
    if (child === this) {
      console.error("Luxarion Node: An object cannot be added as a child of itself.");
      return this;
    }

    if (child.parent) {
      child.parent.remove(child);
    }

    child.parent = this;
    this.children.push(child);
    this.dispatchEvent({ type: 'added', child });
    return this;
  }

  public remove(child: Node): this {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      child.parent = null;
      this.children.splice(index, 1);
      this.dispatchEvent({ type: 'removed', child });
    }
    return this;
  }

  public traverse(callback: (node: Node) => void): void {
    callback(this);
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].traverse(callback);
    }
  }

  public updateWorldMatrix(force: boolean = false): void {
    if (this.transform.matrixWorldNeedsUpdate || force) {
      const parentMatrix = this.parent ? this.parent.transform.worldMatrix : undefined;
      this.transform.updateWorldMatrix(parentMatrix);
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateWorldMatrix(force);
    }
  }
}
