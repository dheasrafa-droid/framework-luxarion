# Contributing to Luxarion Engine

Thank you for your interest in contributing to Luxarion Engine! We welcome contributions, bug reports, feature proposals, and optimizations.

---

## 🛠️ Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/luxarion.git
   cd luxarion
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Verify TypeScript & Linting**
   ```bash
   npm run lint
   ```

5. **Run Engine Unit & Integration Tests**
   ```bash
   npm test
   ```

---

## 📐 Coding Guidelines

- **Zero External Engine Dependencies**: All core math, matrix operations, WebGL bindings, and shaders must remain zero-dependency in standard TypeScript.
- **Strict Typing**: All APIs, parameters, options, and returns must be strongly typed. Avoid using `any` unless working with raw external canvas objects.
- **Modular Design**: Place new math primitives in `src/engine/math`, materials in `src/engine/materials`, geometries in `src/engine/geometries`, and procedural texture helpers in `src/engine/textures`.
- **Performance First**: Cache typed arrays, minimize garbage collection in the render loop, and optimize matrix multiplications.

---

## 🔀 Pull Request Process

1. Create a descriptive branch: `feature/cool-new-shader` or `fix/matrix-inversion`.
2. Commit your changes with clear, concise messages.
3. Ensure all tests pass (`npm test`) and types compile cleanly (`npm run lint`).
4. Submit your Pull Request detailing the changes, benchmarks, and screenshots/demos where applicable.

---

## 📜 Code of Conduct

We are committed to providing a welcoming, respectful, and inclusive environment for all contributors and community members.
