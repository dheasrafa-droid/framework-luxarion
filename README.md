# Luxarion Engine ⚡

> Ultra-lightweight, zero-dependency 2D & 3D WebGL / Canvas graphics engine with dynamic procedural generation, shaders, custom materials, and interactive visual computing capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)

---

## 🌟 Features

- **Zero External Engine Dependencies**: Pure TypeScript vector/matrix math, WebGL state machine, shader compilation, and scene graphs.
- **Dual Pipeline Architecture**: Seamlessly switch between high-performance hardware-accelerated **3D WebGL** and **2D Canvas** rendering.
- **Procedural Texture Generation**: Mathematical synthesis of Cyber Grids, Simplex Nebula Noise, Hexagonal Carbon patterns, Voronoi Crystals, and Tangent-Space Normal Bump Maps.
- **Full 3D Scene Graph**: Hierarchical transformations with Vector3, Matrix4, Quaternion, Euler rotations, and automatic normal matrix calculation.
- **Parametric Geometries**: Box, Sphere, Cylinder, Plane, Torus, Torus Knot, Icosahedron, Particle Streams, and Custom Buffers.
- **Rich Material Subsystem**: Blinn-Phong, Hologram/Fresnel, Quantum Wavefunction, Tangent-Space Normal Relief, Wireframe, and Canvas-streaming textures.
- **Built-in OrbitControls**: Interactive viewport navigation with inertia damping, pinch-zoom, and boundary clamping.
- **Theme Orchestrator**: Dynamic switching between Cyberpunk, Dark Gold, Quantum Neon, Matrix Emerald, and Monolith palettes.
- **18 Production Demos**: From Galactic Singularities and Procedural Terrains to Matrix Glyph Rain and 3D Texture Galleries.

---

## 📦 Installation

```bash
# NPM
npm install framework-luxarion

# Yarn
yarn add framework-luxarion

# PNPM
pnpm add framework-luxarion
```

### CDN Direct Import

```html
<script src="https://cdn.jsdelivr.net/npm/framework-luxarion@latest/dist/luxarion.umd.js"></script>
```

---

## 🚀 Quick Start

```typescript
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  OrbitControls,
  BoxGeometry,
  TextureMaterial,
  TextureGenerator,
  Object3D,
  DirectionalLight,
  AmbientLight
} from 'framework-luxarion';

// 1. Setup Canvas & Renderer
const canvas = document.getElementById('lux-canvas') as HTMLCanvasElement;
const renderer = new WebGLRenderer(canvas, { antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 2. Setup Scene & Camera
const scene = new Scene('MainScene');
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 6);

// 3. Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// 4. Procedural Cyber Grid Material
const cyberGrid = TextureGenerator.createCyberGrid(512, 16, '#06b6d4', '#050714');
const material = new TextureMaterial({
  map: cyberGrid,
  shininess: 64,
  uvScale: [2, 2]
});

const cube = new Object3D(new BoxGeometry(1.5, 1.5, 1.5), material);
scene.add(cube);

// 5. Lighting
const sun = new DirectionalLight('#ffffff', 1.0);
sun.position.set(5, 10, 7);
scene.add(sun);
scene.add(new AmbientLight('#1e293b', 0.5));

// 6. Render Loop
function animate(time: number) {
  requestAnimationFrame(animate);
  controls.update();
  cube.rotateY(0.01);
  renderer.render(scene, camera);
}
animate(0);
```

---

## 📚 Documentation & Modules

- [API Reference](docs/API.md) — Comprehensive classes, interfaces, and methods.
- [Architecture Guide](docs/ARCHITECTURE.md) — Internal pipelines, math abstractions, and shader graphs.
- [Contributing Guide](CONTRIBUTING.md) — Development workflow, testing, and PR guidelines.
- [Changelog](CHANGELOG.md) — Version history and release notes.

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run TypeScript check
npm run lint

# Build library bundle
npm run build:lib
```

---

## 📄 License

MIT License. Copyright (c) 2026 Luxarion Engine Contributors.
