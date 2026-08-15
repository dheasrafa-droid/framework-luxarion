/**
 * @file ModularLevelBuilder.ts
 * @description Fluent High-Level Level Architecture & Dungeon Builder for assembling graybox rooms, stairways, arch doorways, pillars, sunken pits, and corridors.
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
import { DevGridMaterial, DevGridStyle } from '../materials/DevGridMaterial';

export class ModularLevelBuilder {
  public scene: Scene;
  private _materials: Map<DevGridStyle, DevGridMaterial> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public getMaterial(style: DevGridStyle, gridScale: number = 1.0): DevGridMaterial {
    const key = `${style}_${gridScale}`;
    let mat = this._materials.get(key as any);
    if (!mat) {
      mat = new DevGridMaterial({ style, gridScale });
      this._materials.set(key as any, mat);
    }
    return mat;
  }

  public addFloor(
    x: number,
    y: number,
    z: number,
    width: number,
    depth: number,
    style: DevGridStyle = 'floor',
    gridScale: number = 1.0
  ): Object3D {
    const thickness = 0.2;
    const geo = new BoxGeometry(width, thickness, depth);
    const mat = this.getMaterial(style, gridScale);
    const obj = new Object3D(geo, mat);
    obj.position.set(x, y - thickness / 2, z);
    this.scene.add(obj);
    return obj;
  }

  public addWall(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    thickness: number = 0.4,
    rotY: number = 0,
    style: DevGridStyle = 'orange',
    gridScale: number = 1.0
  ): Object3D {
    const geo = new BoxGeometry(width, height, thickness);
    const mat = this.getMaterial(style, gridScale);
    const obj = new Object3D(geo, mat);
    obj.position.set(x, y + height / 2, z);
    obj.rotation.y = rotY;
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
    rotY: number = 0,
    style: DevGridStyle = 'orange'
  ): Object3D {
    const geo = new StaircaseGeometry(width, height, depth, steps, true);
    const mat = this.getMaterial(style, 1.0);
    const obj = new Object3D(geo, mat);
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
    rotY: number = 0,
    style: DevGridStyle = 'orange'
  ): Object3D {
    const geo = new ArchGeometry(width, height, depth, 16);
    const mat = this.getMaterial(style, 1.0);
    const obj = new Object3D(geo, mat);
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
    height: number = 4.0,
    style: DevGridStyle = 'pillar'
  ): Object3D {
    const geo = new PillarGeometry(radius, height, 20);
    const mat = this.getMaterial(style, 1.0);
    const obj = new Object3D(geo, mat);
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
    rotY: number = 0,
    style: DevGridStyle = 'ramp'
  ): Object3D {
    const geo = new WedgeGeometry(width, height, depth);
    const mat = this.getMaterial(style, 1.0);
    const obj = new Object3D(geo, mat);
    obj.position.set(x, y, z);
    obj.rotation.y = rotY;
    this.scene.add(obj);
    return obj;
  }

  public addHazardCrate(
    x: number,
    y: number,
    z: number,
    size: number = 1.2
  ): Object3D {
    const geo = new BoxGeometry(size, size, size);
    const mat = this.getMaterial('hazard', 1.0);
    const obj = new Object3D(geo, mat);
    obj.position.set(x, y + size / 2, z);
    this.scene.add(obj);
    return obj;
  }

  public addSunkenPit(
    x: number,
    y: number,
    z: number,
    width: number,
    depth: number,
    pitDepth: number = 1.5
  ): { pitFloor: Object3D; northWall: Object3D; southWall: Object3D; westWall: Object3D; eastWall: Object3D } {
    const pitFloor = this.addFloor(x, y - pitDepth, z, width, depth, 'floor');
    const wallMat = this.getMaterial('dark', 1.0);

    const northWall = this.addWall(x, y - pitDepth, z - depth / 2, width, pitDepth, 0.2, 0, 'dark');
    const southWall = this.addWall(x, y - pitDepth, z + depth / 2, width, pitDepth, 0.2, 0, 'dark');
    const westWall = this.addWall(x - width / 2, y - pitDepth, z, pitDepth, depth, 0.2, 0, 'dark');
    const eastWall = this.addWall(x + width / 2, y - pitDepth, z, pitDepth, depth, 0.2, 0, 'dark');

    return { pitFloor, northWall, southWall, westWall, eastWall };
  }
}
