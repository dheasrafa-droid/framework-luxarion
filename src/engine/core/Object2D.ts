/**
 * @file Object2D.ts
 * @description 2D Renderable Entity for canvas/overlay graphics, sprites, vector primitives, and UI anchors.
 * Part of Luxarion Engine - Single Responsibility: 2D Planar Entity Representation.
 */

import { Node } from './Node';
import { Vector2 } from '../math/Vector2';
import { Color } from '../math/Color';

export class Object2D extends Node {
  public size: Vector2 = new Vector2(50, 50);
  public color: Color = new Color(1, 1, 1, 1);
  public fillStyle: string = '#ffffff';
  public strokeStyle: string = '#3b82f6';
  public lineWidth: number = 2;
  public shapeType: 'rect' | 'circle' | 'polygon' | 'text' | 'custom' = 'rect';
  public points: Vector2[] = [];
  public text: string = '';
  public font: string = '14px monospace';
  public opacity: number = 1.0;
  public velocity: Vector2 = new Vector2(0, 0);

  constructor(shapeType: 'rect' | 'circle' | 'polygon' | 'text' | 'custom' = 'rect', name: string = 'Entity2D') {
    super(name);
    this.shapeType = shapeType;
  }
}
