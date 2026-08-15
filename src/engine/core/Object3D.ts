/**
 * @file Object3D.ts
 * @description 3D Renderable Mesh object holding geometry, material, and custom uniforms.
 * Part of Luxarion Engine - Single Responsibility: 3D Spatial Entity Representation.
 */

import { Node } from './Node';
import { BufferGeometry } from './BufferGeometry';
import { Material } from '../materials/Material';

export class Object3D extends Node {
  public geometry: BufferGeometry | null = null;
  public material: Material | null = null;
  public isMesh: boolean = true;
  public castShadow: boolean = true;
  public receiveShadow: boolean = true;

  constructor(geometry?: BufferGeometry, material?: Material, name: string = 'Mesh3D') {
    super(name);
    if (geometry) this.geometry = geometry;
    if (material) this.material = material;
  }

  public dispose(gl?: WebGLRenderingContext | WebGL2RenderingContext): void {
    if (this.geometry) this.geometry.dispose(gl);
    if (this.material) this.material.dispose(gl);
    this.dispatchEvent({ type: 'dispose' });
  }
}
