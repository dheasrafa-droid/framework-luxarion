# Luxarion Architecture Guide

This guide outlines the internal architecture, mathematical primitives, shader graphs, and rendering pipelines of **Luxarion Engine**.

---

## 🏛️ Pipeline Overview

Luxarion employs a clean decoupled architecture split across two primary rendering domains:

1. **WebGL 3D Pipeline (`src/engine/renderers/WebGLRenderer.ts`)**:
   - VBO/EBO hardware buffer caching.
   - Program & shader management with uniform tracking.
   - Forward rendering with ambient, directional, and point light models.
   - Multi-channel texture binding (`uMap`, `uNormalMap`, `uEmissiveMap`).

2. **Canvas 2D Pipeline (`src/engine/renderer2d/Canvas2DRenderer.ts`)**:
   - High-throughput particle dynamics.
   - Vector field and gravitational n-body simulations.
   - Path-based visual effects with alpha compositing and trail persistence.

---

## 📐 Mathematical Foundations

- **Transformation Hierarchy**: Every node has `position`, `rotation` (Euler & Quaternion), and `scale`. The local matrix is composed via:
  $$M_{local} = T \cdot R \cdot S$$
- **World Transform Propagation**: Parents recursively compute and pass down:
  $$M_{world}^{child} = M_{world}^{parent} \cdot M_{local}^{child}$$
- **Normal Matrix**: Computed dynamically as the inverse transpose of the model-view 3x3 block:
  $$N = (M_{view} \cdot M_{model})^{-T}$$

---

## 🔌 Plugin System (`src/plugins/index.ts`)

Luxarion supports custom extensions via the `PluginManager` interface:

```typescript
import { PluginManager, LuxarionPlugin } from 'framework-luxarion';

const MyPostProcessingPlugin: LuxarionPlugin = {
  name: 'bloom-post-process',
  install: (app) => {
    console.log('Installed Bloom plugin into App');
  }
};
```
