/**
 * @file Scene.ts
 * @description Master Scene Graph Container holding active 3D entities, lights, camera references, and clear color.
 * Part of Luxarion Engine - Single Responsibility: Scene Container & Environment State.
 */

import { Node } from '../core/Node';
import { Color } from '../math/Color';
import { Light } from '../lights/Light';
import { Object3D } from '../core/Object3D';

export class Scene extends Node {
  public background: Color = new Color(0.04, 0.05, 0.08, 1.0);
  public lights: Light[] = [];
  public objects: Object3D[] = [];

  constructor(name: string = 'Scene') {
    super(name);
  }

  public override add(child: Node): this {
    super.add(child);
    this._categorizeNode(child, true);
    return this;
  }

  public override remove(child: Node): this {
    super.remove(child);
    this._categorizeNode(child, false);
    return this;
  }

  private _categorizeNode(node: Node, isAdding: boolean): void {
    node.traverse((n) => {
      if ((n as any).isLight) {
        const light = n as Light;
        const idx = this.lights.indexOf(light);
        if (isAdding && idx === -1) this.lights.push(light);
        else if (!isAdding && idx !== -1) this.lights.splice(idx, 1);
      }
      if ((n as any).isMesh) {
        const obj = n as Object3D;
        const idx = this.objects.indexOf(obj);
        if (isAdding && idx === -1) this.objects.push(obj);
        else if (!isAdding && idx !== -1) this.objects.splice(idx, 1);
      }
    });
  }

  public clear(): void {
    while (this.children.length > 0) {
      this.remove(this.children[0]);
    }
    this.lights = [];
    this.objects = [];
  }
}
