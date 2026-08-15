# Luxarion Engine API Reference

Comprehensive documentation for classes, interfaces, and modules in **Luxarion Engine**.

---

## 📐 Math Subsystem (`src/engine/math`)

### `Vector3`
- `constructor(x?: number, y?: number, z?: number)`
- `set(x: number, y: number, z: number): this`
- `add(v: Vector3): this` / `addVectors(a: Vector3, b: Vector3): this`
- `sub(v: Vector3): this` / `subVectors(a: Vector3, b: Vector3): this`
- `multiplyScalar(s: number): this`
- `dot(v: Vector3): number`
- `cross(v: Vector3): this` / `crossVectors(a: Vector3, b: Vector3): this`
- `length(): number` / `lengthSq(): number`
- `normalize(): this`
- `distanceTo(v: Vector3): number`
- `applyMatrix4(m: Matrix4): this`
- `applyQuaternion(q: Quaternion): this`

### `Matrix4`
- `identity(): this`
- `multiply(m: Matrix4): this`
- `multiplyMatrices(a: Matrix4, b: Matrix4): this`
- `makeTranslation(x: number, y: number, z: number): this`
- `makeRotationX(theta: number): this`
- `makeRotationY(theta: number): this`
- `makeRotationZ(theta: number): this`
- `makeScale(x: number, y: number, z: number): this`
- `compose(position: Vector3, quaternion: Quaternion, scale: Vector3): this`
- `decompose(position: Vector3, quaternion: Quaternion, scale: Vector3): this`
- `lookAt(eye: Vector3, target: Vector3, up: Vector3): this`
- `perspective(fovY: number, aspect: number, near: number, far: number): this`
- `orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this`
- `invert(): this`
- `transpose(): this`

### `Quaternion`
- `setFromEuler(euler: Euler): this`
- `setFromAxisAngle(axis: Vector3, angle: number): this`
- `multiply(q: Quaternion): this`
- `slerp(qb: Quaternion, t: number): this`

### `Noise`
- `Noise.simplex2D(xin: number, yin: number): number`
- `Noise.simplex3D(xin: number, yin: number, zin: number): number`
- `Noise.fbm2D(x: number, y: number, octaves?: number): number`
- `Noise.fbm3D(x: number, y: number, z: number, octaves?: number): number`

---

## 🎨 Materials (`src/engine/materials`)

| Material | Description | Key Uniforms / Properties |
|---|---|---|
| `BasicMaterial` | Flat unlit color/wireframe | `color`, `opacity`, `wireframe` |
| `PhongMaterial` | Blinn-Phong lighting | `color`, `specular`, `shininess`, `opacity` |
| `HologramMaterial` | Fresnel glow & dynamic scanlines | `color`, `fresnelPower`, `scanlineDensity`, `scanlineSpeed` |
| `QuantumMaterial` | Quantum wavefunction shimmer | `color`, `phaseSpeed`, `noiseScale`, `displacement` |
| `NormalMaterial` | Surface normal visualizer | `wireframe`, `opacity` |
| `WireframeMaterial` | Pure vector wireframe mesh | `color`, `opacity` |
| `TextureMaterial` | 2D diffuse, normal bump, & emissive map | `map`, `normalMap`, `emissiveMap`, `uvScale`, `uvOffset`, `normalScale` |

---

## 🌐 Textures (`src/engine/textures`)

- `Texture`: Base 2D texture representation with filtering, wrapping, and mipmaps.
- `CanvasTexture`: Dynamic 2D canvas texture with auto-upload on update.
- `DataTexture`: Raw byte or float array buffer texture.
- `TextureGenerator`:
  - `createCyberGrid(size, gridCount, gridColor, bgColor)`
  - `createNebulaNoise(size, scale, colorA, colorB, colorC)`
  - `createHexagonPattern(size, hexRadius, strokeColor, fillColor, coreColor)`
  - `createVoronoiCrystals(size, pointCount, borderColor)`
  - `createNormalMapFromHeight(width, height, heightFn, strength)`
  - `createAnimatedMatrixStream(size)`

---

## 💡 Lights (`src/engine/lights`)

- `AmbientLight(color?: string, intensity?: number)`
- `DirectionalLight(color?: string, intensity?: number)`: Has `.position` target vector.
- `PointLight(color?: string, intensity?: number, distance?: number)`: Omnidirectional falloff.

---

## 📷 Cameras & Controls

- `PerspectiveCamera(fov: number, aspect: number, near: number, far: number)`
- `OrthographicCamera(left: number, right: number, top: number, bottom: number, near: number, far: number)`
- `OrbitControls(camera: Camera, domElement: HTMLElement)`: Pan, tilt, zoom, and damping inertia.
