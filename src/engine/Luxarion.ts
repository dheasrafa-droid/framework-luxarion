/**
 * ============================================================================
 * LUXARION ENGINE - MASTER BARREL EXPORT (ENTRY POINT)
 * ============================================================================
 * Pure, Zero-Dependency 2D & 3D WebGL / Canvas Graphics Engine.
 * 
 * Every file adheres strictly to the Single Responsibility Principle (1 file, 1 role),
 * interlinked hierarchically without logic duplication.
 * 
 * @module Luxarion
 * @license Apache-2.0
 */

// 1. Math Kernel
export { Vector2 } from './math/Vector2';
export { Vector3 } from './math/Vector3';
export { Vector4 } from './math/Vector4';
export { Matrix3 } from './math/Matrix3';
export { Matrix4 } from './math/Matrix4';
export { Quaternion } from './math/Quaternion';
export { Euler } from './math/Euler';
export { Color } from './math/Color';
export { MathUtils } from './math/MathUtils';

// 2. Core Architecture & Scenegraph
export { EventDispatcher } from './core/EventDispatcher';
export { Clock } from './core/Clock';
export { BufferAttribute } from './core/BufferAttribute';
export { BufferGeometry } from './core/BufferGeometry';
export { Transform } from './core/Transform';
export { Node } from './core/Node';
export { Object3D } from './core/Object3D';
export { Object2D } from './core/Object2D';

// 3. Shaders & WebGL Pipeline
export { ShaderSource } from './shaders/ShaderSource';
export { ShaderProgram } from './shaders/ShaderProgram';
export { UniformManager } from './shaders/UniformManager';
export { GLState } from './shaders/GLState';

// 4. Geometries
export { BoxGeometry } from './geometries/BoxGeometry';
export { SphereGeometry } from './geometries/SphereGeometry';
export { TorusGeometry } from './geometries/TorusGeometry';
export { CylinderGeometry } from './geometries/CylinderGeometry';
export { PlaneGeometry } from './geometries/PlaneGeometry';
export { IcosahedronGeometry } from './geometries/IcosahedronGeometry';

// 5. Materials
export { Material } from './materials/Material';
export { BasicMaterial } from './materials/BasicMaterial';
export { PhongMaterial } from './materials/PhongMaterial';
export { HologramMaterial } from './materials/HologramMaterial';
export { WireframeMaterial } from './materials/WireframeMaterial';

// 6. Lights
export { Light } from './lights/Light';
export { AmbientLight } from './lights/AmbientLight';
export { DirectionalLight } from './lights/DirectionalLight';
export { PointLight } from './lights/PointLight';

// 7. Cameras & Controls
export { Camera } from './cameras/Camera';
export { PerspectiveCamera } from './cameras/PerspectiveCamera';
export { OrthographicCamera } from './cameras/OrthographicCamera';
export { OrbitControls } from './cameras/OrbitControls';

// 8. Scene & Renderers (Master Orchestrators)
export { Scene } from './scene/Scene';
export { WebGLRenderer } from './renderers/WebGLRenderer';
export { RenderPipeline } from './renderers/RenderPipeline';
export { FrameBuffer } from './renderers/FrameBuffer';

// 9. 2D Engine & Particles
export { Canvas2DRenderer } from './renderer2d/Canvas2DRenderer';
export { ParticleSystem } from './particles/ParticleSystem';

// 10. Themes & Presets
export { ThemeManager } from './themes/ThemeManager';
export { THEME_PRESETS } from './themes/ThemePresets';
export type { LuxarionTheme } from './themes/ThemePresets';

// Package Meta
export const LUXARION_VERSION = '2.4.0-pure';
