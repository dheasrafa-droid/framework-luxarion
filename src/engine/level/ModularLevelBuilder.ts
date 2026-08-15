/**
 * @file ModularLevelBuilder.ts
 * @description Fluent High-Level Level Architecture & Dungeon Builder for assembling graybox rooms, stairways, arch doorways, pillars, and corridors.
 * Part of Luxarion Engine - Level Design & Modular Architecture Subsystem.
 */

import { Scene } from '../scene/Scene';
import { Object3D } from '../core/Object3D';
import { BoxGeometry } from '../geometries/BoxGeometry';
import { PlaneGeometry } from '../geometries/PlaneGeometry';
import { StaircaseGeometry } from '../geometries/StaircaseGeometry';
import { ArchGeometry } from '../geometries/ArchGeometry';
import { PillarGeometry } from '../geometries/PillarGeometry';
import { WedgeGeometry } from '../geometries/WedgeGeometry';
import { DevGridMaterial } from '../materials/DevGridMaterial';

export class ModularLevelBuilder {
  public scene: Scene;
  public wallMaterial: DevGridMaterial;
  public floorMaterial: DevGridMaterial;
  public accentMaterial: DevGridMaterial;

  constructor(scene: Scene) {
    this.scene = scene;
    this.wallMaterial = new DevGridMaterial({ style: 'orange', gridScale: 1.0 });
    this.floorMaterial = new DevGridMaterial({ style: 'dark', gridScale: 1.0 });
    this.accentMaterial = new DevGridMaterial({ style: 'measure', gridScale: 1.0 });
  }

  public addFloor(x: number, y: number, z: number, width: number, depth: number): Object3D {
    const geo = new PlaneGeometry(width, depth, 1, 1);
    const obj = new Object3D(geo, this.floorMaterial);
    obj.rotation.x = -Math.PI / 2;
    obj.position.set(x, y, z);
    this.scene.add(obj);
    return obj;
  }

  public addWall(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    thickness: number = 0.4
  ): Object3D {
    const geo = new BoxGeometry(width, height, thickness);
    const obj = new Object3D(geo, this.wallMaterial);
    obj.position.set(x, y + height / 2, z);
    this.scene.add(obj);
    return obj;
  }

  public addStaircase(
    x: number,
    y: number,
    z: number,
    width: number = 3.0,
    height: number = 2.0,
    depth: number = 4.0,
    steps: number = 8,
    rotY: number = 0
  ): Object3D {
    const geo = new StaircaseGeometry(width, height, depth, steps, true);
    const obj = new Object3D(geo, this.wallMaterial);
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    this.scene.add(obj);
    return obj;
  }

  public addArchDoorway(
    x: number,
    y: number,
    z: number,
    width: number = 2.4,
    height: number = 3.6,
    depth: number = 0.8,
    rotY: number = 0
  ): Object3D {
    const geo = new ArchGeometry(width, height, depth, 16);
    const obj = new Object3D(geo, this.accentMaterial);
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    this.scene.add(obj);
    return obj;
  }

  public addPillar(
    x: number,
    y: number,
    z: number,
    radius: number = 0.6,
    height: number = 4.0
  ): Object3D {
    const geo = new PillarGeometry(radius, height, 16);
    const obj = new Object3D(geo, this.wallMaterial);
    obj.position.set(x, y + height / 2, z);
    this.scene.add(obj);
    return obj;
  }

  public addRamp(
    x: number,
    y: number,
    z: number,
    width: number = 2.0,
    height: number = 2.0,
    depth: number = 4.0,
    rotY: number = 0
  ): Object3D {
    const geo = new WedgeGeometry(width, height, depth);
    const obj = new Object3D(geo, this.wallMaterial);
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    this.scene.add(obj);
    return obj;
  }
}
