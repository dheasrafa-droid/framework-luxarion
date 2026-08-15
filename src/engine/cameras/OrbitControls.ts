/**
 * @file OrbitControls.ts
 * @description Camera controller handling spherical orbit rotation, inertia damping, pan, and distance zooming.
 * Part of Luxarion Engine - Single Responsibility: Camera Orbital Interaction.
 */

import { Camera } from './Camera';
import { Vector3 } from '../math/Vector3';
import { MathUtils } from '../math/MathUtils';

export class OrbitControls {
  public camera: Camera;
  public domElement: HTMLElement;
  public target: Vector3 = new Vector3(0, 0, 0);

  public enableDamping: boolean = true;
  public dampingFactor: number = 0.08;
  public rotateSpeed: number = 0.8;
  public zoomSpeed: number = 1.0;

  public minDistance: number = 0.5;
  public maxDistance: number = 50.0;
  public minPolarAngle: number = 0.05; // radians
  public maxPolarAngle: number = Math.PI - 0.05; // radians

  private _isDragging: boolean = false;
  private _previousMousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private _spherical: { radius: number; theta: number; phi: number } = { radius: 5, theta: 0, phi: Math.PI / 3 };
  private _targetSpherical: { radius: number; theta: number; phi: number } = { radius: 5, theta: 0, phi: Math.PI / 3 };

  private _onMouseDownBound: (e: MouseEvent) => void;
  private _onMouseMoveBound: (e: MouseEvent) => void;
  private _onMouseUpBound: (e: MouseEvent) => void;
  private _onWheelBound: (e: WheelEvent) => void;
  private _onTouchStartBound: (e: TouchEvent) => void;
  private _onTouchMoveBound: (e: TouchEvent) => void;
  private _onTouchEndBound: (e: TouchEvent) => void;

  constructor(camera: Camera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this._onMouseDownBound = this._onMouseDown.bind(this);
    this._onMouseMoveBound = this._onMouseMove.bind(this);
    this._onMouseUpBound = this._onMouseUp.bind(this);
    this._onWheelBound = this._onWheel.bind(this);
    this._onTouchStartBound = this._onTouchStart.bind(this);
    this._onTouchMoveBound = this._onTouchMove.bind(this);
    this._onTouchEndBound = this._onTouchEnd.bind(this);

    this._initSphericalFromCamera();
    this._bindEvents();
  }

  private _initSphericalFromCamera(): void {
    const offset = new Vector3().copy(this.camera.position).sub(this.target);
    const radius = offset.length();
    if (radius > 0) {
      this._spherical.radius = radius;
      this._spherical.theta = Math.atan2(offset.x, offset.z);
      this._spherical.phi = Math.acos(MathUtils.clamp(offset.y / radius, -1, 1));
      this._targetSpherical = { ...this._spherical };
    }
  }

  private _bindEvents(): void {
    this.domElement.addEventListener('mousedown', this._onMouseDownBound);
    window.addEventListener('mousemove', this._onMouseMoveBound);
    window.addEventListener('mouseup', this._onMouseUpBound);
    this.domElement.addEventListener('wheel', this._onWheelBound, { passive: false });
    this.domElement.addEventListener('touchstart', this._onTouchStartBound, { passive: false });
    window.addEventListener('touchmove', this._onTouchMoveBound, { passive: false });
    window.addEventListener('touchend', this._onTouchEndBound);
  }

  private _onMouseDown(e: MouseEvent): void {
    this._isDragging = true;
    this._previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  private _onMouseMove(e: MouseEvent): void {
    if (!this._isDragging) return;

    const deltaX = e.clientX - this._previousMousePosition.x;
    const deltaY = e.clientY - this._previousMousePosition.y;

    this._targetSpherical.theta -= (deltaX * 0.005) * this.rotateSpeed;
    this._targetSpherical.phi -= (deltaY * 0.005) * this.rotateSpeed;
    this._targetSpherical.phi = MathUtils.clamp(this._targetSpherical.phi, this.minPolarAngle, this.maxPolarAngle);

    this._previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  private _onMouseUp(): void {
    this._isDragging = false;
  }

  private _onWheel(e: WheelEvent): void {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    this._targetSpherical.radius = MathUtils.clamp(
      this._targetSpherical.radius * factor,
      this.minDistance,
      this.maxDistance
    );
  }

  private _onTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      this._isDragging = true;
      this._previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  private _onTouchMove(e: TouchEvent): void {
    if (!this._isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - this._previousMousePosition.x;
    const deltaY = e.touches[0].clientY - this._previousMousePosition.y;

    this._targetSpherical.theta -= (deltaX * 0.005) * this.rotateSpeed;
    this._targetSpherical.phi -= (deltaY * 0.005) * this.rotateSpeed;
    this._targetSpherical.phi = MathUtils.clamp(this._targetSpherical.phi, this.minPolarAngle, this.maxPolarAngle);

    this._previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  private _onTouchEnd(): void {
    this._isDragging = false;
  }

  public update(): void {
    if (this.enableDamping) {
      this._spherical.theta += (this._targetSpherical.theta - this._spherical.theta) * this.dampingFactor;
      this._spherical.phi += (this._targetSpherical.phi - this._spherical.phi) * this.dampingFactor;
      this._spherical.radius += (this._targetSpherical.radius - this._spherical.radius) * this.dampingFactor;
    } else {
      this._spherical = { ...this._targetSpherical };
    }

    const sinPhiRadius = Math.sin(this._spherical.phi) * this._spherical.radius;
    this.camera.position.x = this.target.x + sinPhiRadius * Math.sin(this._spherical.theta);
    this.camera.position.y = this.target.y + Math.cos(this._spherical.phi) * this._spherical.radius;
    this.camera.position.z = this.target.z + sinPhiRadius * Math.cos(this._spherical.theta);

    this.camera.transform.worldMatrix.lookAt(this.camera.position, this.target, new Vector3(0, 1, 0));
    this.camera.viewMatrix.copy(this.camera.transform.worldMatrix).invert();
  }

  public dispose(): void {
    this.domElement.removeEventListener('mousedown', this._onMouseDownBound);
    window.removeEventListener('mousemove', this._onMouseMoveBound);
    window.removeEventListener('mouseup', this._onMouseUpBound);
    this.domElement.removeEventListener('wheel', this._onWheelBound);
    this.domElement.removeEventListener('touchstart', this._onTouchStartBound);
    window.removeEventListener('touchmove', this._onTouchMoveBound);
    window.removeEventListener('touchend', this._onTouchEndBound);
  }
}
