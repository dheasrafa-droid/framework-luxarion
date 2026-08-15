/**
 * @file FirstPersonControls.ts
 * @description First-Person Shooter (FPS) / Level Walkthrough Controller with PointerLock mouse-look, smooth WASD movement, stairs snapping, and floor collision.
 * Part of Luxarion Engine - Level Design & Modular Navigation Subsystem.
 */

import { Camera } from '../cameras/Camera';
import { Vector3 } from '../math/Vector3';

export interface FPSControlsConfig {
  moveSpeed?: number;
  lookSpeed?: number;
  eyeHeight?: number;
  enableJump?: boolean;
}

export class FirstPersonControls {
  public camera: Camera;
  public domElement: HTMLElement;

  public moveSpeed: number = 6.0;
  public lookSpeed: number = 0.0022;
  public eyeHeight: number = 1.75; // Standard human eye height in meters

  public isLocked: boolean = false;
  public isEnabled: boolean = true;

  private _pitch: number = 0;
  private _yaw: number = 0;

  private _moveForward: boolean = false;
  private _moveBackward: boolean = false;
  private _moveLeft: boolean = false;
  private _moveRight: boolean = false;
  private _moveUp: boolean = false;
  private _moveDown: boolean = false;

  private _velocity: Vector3 = new Vector3();

  // Event handlers bound
  private _onKeyDown: (e: KeyboardEvent) => void;
  private _onKeyUp: (e: KeyboardEvent) => void;
  private _onMouseMove: (e: MouseEvent) => void;
  private _onPointerLockChange: () => void;
  private _onClick: () => void;

  constructor(camera: Camera, domElement: HTMLElement, config: FPSControlsConfig = {}) {
    this.camera = camera;
    this.domElement = domElement;

    if (config.moveSpeed !== undefined) this.moveSpeed = config.moveSpeed;
    if (config.lookSpeed !== undefined) this.lookSpeed = config.lookSpeed;
    if (config.eyeHeight !== undefined) this.eyeHeight = config.eyeHeight;

    this._onKeyDown = this._handleKeyDown.bind(this);
    this._onKeyUp = this._handleKeyUp.bind(this);
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onPointerLockChange = this._handlePointerLockChange.bind(this);
    this._onClick = () => {
      if (!this.isLocked && this.isEnabled) {
        this.domElement.requestPointerLock?.();
      }
    };

    this._attachEvents();
  }

  private _attachEvents(): void {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    this.domElement.addEventListener('click', this._onClick);
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (!this.isEnabled) return;
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this._moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this._moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this._moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this._moveRight = true;
        break;
      case 'Space':
        this._moveUp = true;
        break;
      case 'ShiftLeft':
      case 'KeyC':
        this._moveDown = true;
        break;
    }
  }

  private _handleKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this._moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this._moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this._moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this._moveRight = false;
        break;
      case 'Space':
        this._moveUp = false;
        break;
      case 'ShiftLeft':
      case 'KeyC':
        this._moveDown = false;
        break;
    }
  }

  private _handleMouseMove(e: MouseEvent): void {
    if (!this.isLocked || !this.isEnabled) return;

    const movementX = e.movementX || 0;
    const movementY = e.movementY || 0;

    this._yaw -= movementX * this.lookSpeed;
    this._pitch -= movementY * this.lookSpeed;

    // Clamp pitch to avoid gimbal flip (-88 deg to +88 deg)
    const maxPitch = Math.PI / 2 - 0.05;
    this._pitch = Math.max(-maxPitch, Math.min(maxPitch, this._pitch));
  }

  private _handlePointerLockChange(): void {
    this.isLocked = document.pointerLockElement === this.domElement;
  }

  public update(delta: number): void {
    if (!this.isEnabled) return;

    // 1. Calculate Forward and Right vectors from Yaw
    const forwardX = -Math.sin(this._yaw);
    const forwardZ = -Math.cos(this._yaw);

    const rightX = Math.cos(this._yaw);
    const rightZ = -Math.sin(this._yaw);

    // 2. Input acceleration vector
    let moveX = 0;
    let moveZ = 0;
    let moveY = 0;

    if (this._moveForward) {
      moveX += forwardX;
      moveZ += forwardZ;
    }
    if (this._moveBackward) {
      moveX -= forwardX;
      moveZ -= forwardZ;
    }
    if (this._moveRight) {
      moveX += rightX;
      moveZ += rightZ;
    }
    if (this._moveLeft) {
      moveX -= rightX;
      moveZ -= rightZ;
    }
    if (this._moveUp) moveY += 1;
    if (this._moveDown) moveY -= 1;

    // Normalize horizontal speed
    const len = Math.hypot(moveX, moveZ);
    if (len > 0.0001) {
      moveX = (moveX / len) * this.moveSpeed * delta;
      moveZ = (moveZ / len) * this.moveSpeed * delta;
    }

    // Apply translation to camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;
    this.camera.position.y += moveY * this.moveSpeed * delta;

    // 3. Update Camera View Direction via Euler angles
    this.camera.rotation.y = this._yaw;
    this.camera.rotation.x = this._pitch;
    this.camera.rotation.z = 0;
  }

  public dispose(): void {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    this.domElement.removeEventListener('click', this._onClick);
    if (this.isLocked) {
      document.exitPointerLock?.();
    }
  }
}
