/**
 * @file ArchitectureGraph.tsx
 * @description Interactive visual architecture map displaying dependency flows, orchestrator connections, barrel exports, and module lifecycles.
 * Part of Luxarion UI Components.
 */

import React, { useState } from 'react';
import { Layers, ArrowRight, Box, Cpu, GitMerge, FileCode, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { LuxarionTheme } from '../engine/Luxarion';

interface ArchitectureGraphProps {
  currentTheme: LuxarionTheme;
}

interface ModuleNode {
  id: string;
  name: string;
  category: 'Math' | 'Core' | 'Shaders' | 'Geometries' | 'Materials' | 'Lights' | 'Cameras' | 'Orchestrator' | 'Barrel' | 'Examples';
  file: string;
  responsibility: string;
  dependencies: string[];
  publicApi: string[];
  privateDetails: string[];
}

const ENGINE_MODULES: ModuleNode[] = [
  // Math Kernel
  {
    id: 'vec3',
    name: 'Vector3',
    category: 'Math',
    file: 'src/engine/math/Vector3.ts',
    responsibility: 'Calculates 3D spatial points, cross products, dot products, vector normalization, and distance metrics.',
    dependencies: ['Matrix4', 'Quaternion'],
    publicApi: ['add()', 'sub()', 'cross()', 'dot()', 'normalize()', 'applyMatrix4()'],
    privateDetails: ['x, y, z floats directly stored without extra heap allocations.']
  },
  {
    id: 'mat4',
    name: 'Matrix4',
    category: 'Math',
    file: 'src/engine/math/Matrix4.ts',
    responsibility: 'Row/column-major 4x4 matrix for affine transformations, perspective projection, orthographic projection, and lookAt orientation.',
    dependencies: ['Vector3', 'Quaternion'],
    publicApi: ['multiply()', 'compose()', 'makePerspective()', 'invert()', 'lookAt()'],
    privateDetails: ['Float32Array(16) elements optimized for WebGL uniform uploads.']
  },
  {
    id: 'quat',
    name: 'Quaternion',
    category: 'Math',
    file: 'src/engine/math/Quaternion.ts',
    responsibility: 'Non-gimbal lock rotational representation with spherical linear interpolation (slerp) and Euler conversion.',
    dependencies: ['Euler', 'Vector3'],
    publicApi: ['setFromEuler()', 'setFromAxisAngle()', 'slerp()', 'multiply()'],
    privateDetails: ['Internal x,y,z,w normalized components preventing quaternion drift.']
  },

  // Core & Scenegraph
  {
    id: 'buffer_geom',
    name: 'BufferGeometry',
    category: 'Core',
    file: 'src/engine/core/BufferGeometry.ts',
    responsibility: 'Encapsulates VBO attributes (position, normal, uv, color) and element array index buffers.',
    dependencies: ['BufferAttribute', 'EventDispatcher', 'MathUtils'],
    publicApi: ['setAttribute()', 'getAttribute()', 'setIndex()', 'computeVertexNormals()', 'dispose()'],
    privateDetails: ['_id UUID generator, attributes Map, drawRange offset management.']
  },
  {
    id: 'node',
    name: 'Node',
    category: 'Core',
    file: 'src/engine/core/Node.ts',
    responsibility: 'Hierarchical tree node computing local and world transformation matrices across parent-child trees.',
    dependencies: ['Transform', 'EventDispatcher', 'Vector3', 'Euler', 'Matrix4'],
    publicApi: ['add()', 'remove()', 'traverse()', 'updateWorldMatrix()', 'position', 'rotation', 'scale'],
    privateDetails: ['parent backlink, children[] array, recursive updateWorldMatrix propagation.']
  },
  {
    id: 'obj3d',
    name: 'Object3D',
    category: 'Core',
    file: 'src/engine/core/Object3D.ts',
    responsibility: '3D Renderable Entity combining a BufferGeometry and a Material within the scene graph.',
    dependencies: ['Node', 'BufferGeometry', 'Material'],
    publicApi: ['geometry', 'material', 'isMesh', 'castShadow', 'dispose()'],
    privateDetails: ['Lifecycle event dispatching upon mesh deletion or disposal.']
  },

  // Shaders & Low-Level GL
  {
    id: 'shader_prog',
    name: 'ShaderProgram',
    category: 'Shaders',
    file: 'src/engine/shaders/ShaderProgram.ts',
    responsibility: 'Compiles GLSL vertex and fragment shaders, links WebGLProgram, and caches attribute/uniform locations.',
    dependencies: ['UniformManager'],
    publicApi: ['compile()', 'setUniforms()', 'dispose()', 'uniforms Map', 'attributes Map'],
    privateDetails: ['_cacheLocations() queries gl.ACTIVE_UNIFORMS to avoid runtime lookup penalties.']
  },
  {
    id: 'gl_state',
    name: 'GLState',
    category: 'Shaders',
    file: 'src/engine/shaders/GLState.ts',
    responsibility: 'Caches depth test, depth write, cull face, and blend mode states to eliminate redundant WebGL state transitions.',
    dependencies: [],
    publicApi: ['setDepthTest()', 'setDepthWrite()', 'setCullFace()', 'setBlend()', 'useProgram()'],
    privateDetails: ['_depthTest, _depthWrite, _blendMode internal cache flags.']
  },

  // Orchestrator
  {
    id: 'renderer',
    name: 'WebGLRenderer (Orchestrator)',
    category: 'Orchestrator',
    file: 'src/engine/renderers/WebGLRenderer.ts',
    responsibility: 'Master 3D Engine Orchestrator. Coordinates pipeline execution, shader programs, buffer bindings, lighting injection, and draw calls.',
    dependencies: ['Scene', 'Camera', 'Object3D', 'ShaderProgram', 'GLState', 'Matrix3', 'Color'],
    publicApi: ['render(scene, camera)', 'setSize(w, h)', 'clear()', 'dispose()', 'stats'],
    privateDetails: ['_programCache Map, _normalMatrix compute instance, _renderObject draw execution.']
  },

  // Master Entry Point Barrel Export
  {
    id: 'barrel',
    name: 'Luxarion.ts (Entry Point)',
    category: 'Barrel',
    file: 'src/engine/Luxarion.ts',
    responsibility: 'The Single Master Barrel Export exposing all public classes, math kernels, materials, lights, cameras, and renderers.',
    dependencies: ['All 25+ Engine Modules'],
    publicApi: ['export { Vector3, Matrix4, BufferGeometry, WebGLRenderer, ... }'],
    privateDetails: ['Zero implementation logic; strictly acts as the unified gateway contract.']
  },

  // Examples
  {
    id: 'examples_reg',
    name: 'examples/ (Global Demos)',
    category: 'Examples',
    file: 'examples/index.ts',
    responsibility: 'Showcases end-to-end interactive 2D/3D demos by consuming ONLY the master Luxarion entry point.',
    dependencies: ['Luxarion.ts'],
    publicApi: ['Demo3DCrystals', 'Demo3DCyberCity', 'Demo2DParticleVortex', 'DemoHolographicHUD'],
    privateDetails: ['Instantiates scenes, cameras, materials, and orbit controls via barrel import.']
  }
];

export const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({ currentTheme }) => {
  const [selectedModule, setSelectedModule] = useState<ModuleNode>(ENGINE_MODULES[8]); // Default to WebGLRenderer Orchestrator

  return (
    <div className="w-full min-h-[calc(100vh-65px)] p-6 flex flex-col gap-6 overflow-y-auto" style={{ backgroundColor: currentTheme.background }}>
      {/* Title & Architecture Principles Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: `${currentTheme.accent}33` }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5" style={{ color: currentTheme.accent }} />
            <h2 className="text-xl font-bold tracking-tight" style={{ color: currentTheme.textColor }}>
              Luxarion Engine Architectural Graph
            </h2>
          </div>
          <p className="text-sm opacity-80 max-w-3xl leading-relaxed" style={{ color: currentTheme.textColor }}>
            Visual representation of the <strong>Single Responsibility Principle (1 file, 1 role)</strong>. 
            All modules are strictly decoupled yet interconnected through explicit interfaces and unified under the <code className="font-mono px-1.5 py-0.5 rounded bg-black/40 text-cyan-400 font-bold">Luxarion.ts</code> entry point.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/10 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span style={{ color: currentTheme.textColor }}>Orchestrator: <strong>WebGLRenderer</strong></span>
        </div>
      </div>

      {/* Main Graph Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Graph Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-70" style={{ color: currentTheme.textColor }}>
            1. Module Registry & Dependency Matrix (Click to Inspect)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ENGINE_MODULES.map(mod => {
              const isSelected = mod.id === selectedModule.id;
              const isOrchestrator = mod.category === 'Orchestrator';
              const isBarrel = mod.category === 'Barrel';

              return (
                <div
                  key={mod.id}
                  id={`module-card-${mod.id}`}
                  onClick={() => setSelectedModule(mod)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'shadow-lg ring-2 scale-[1.02]'
                      : 'hover:border-white/40 hover:bg-white/5 opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${currentTheme.accent}20` : currentTheme.surface,
                    borderColor: isSelected ? currentTheme.accent : 'rgba(255,255,255,0.08)',
                    ringColor: currentTheme.accent
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/30 text-cyan-300 font-bold">
                        {mod.category}
                      </span>
                      {isOrchestrator && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                          ORCHESTRATOR
                        </span>
                      )}
                      {isBarrel && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                          ENTRY POINT
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-white mb-1">{mod.name}</h4>
                    <p className="text-[11px] opacity-75 font-mono text-slate-300 truncate">{mod.file}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="opacity-60 text-slate-400">Depends on:</span>
                    <span className="font-mono text-cyan-300 font-medium">{mod.dependencies.length} modules</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pipeline Flow Architecture Diagram */}
          <div className="mt-4 p-4 rounded-xl border bg-black/30" style={{ borderColor: `${currentTheme.accent}33` }}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-cyan-400">
              Execution & Rendering Flow Graph
            </h4>

            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-center w-full md:w-auto">
                <span className="text-amber-400 font-bold block">1. User / examples/</span>
                <span className="text-[10px] text-slate-400">Calls Barrel Entry Point</span>
              </div>

              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden md:block" />

              <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/50 text-center w-full md:w-auto">
                <span className="text-cyan-400 font-bold block">2. Luxarion.ts</span>
                <span className="text-[10px] text-slate-400">Unified Barrel Export</span>
              </div>

              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden md:block" />

              <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/50 text-center w-full md:w-auto">
                <span className="text-purple-400 font-bold block">3. WebGLRenderer</span>
                <span className="text-[10px] text-slate-400">Master 3D Orchestrator</span>
              </div>

              <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden md:block" />

              <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/50 text-center w-full md:w-auto">
                <span className="text-emerald-400 font-bold block">4. GPU Hardware</span>
                <span className="text-[10px] text-slate-400">WebGL VBO & Shaders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Deep Module Inspector */}
        <div
          className="p-5 rounded-xl border flex flex-col gap-4 shadow-xl"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: `${currentTheme.accent}44`
          }}
        >
          <div className="flex items-center justify-between border-b pb-3 border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                {selectedModule.category} Module
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedModule.name}</h3>
            </div>
            <FileCode className="w-6 h-6 text-cyan-400 opacity-80" />
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              File Path (Single Responsibility)
            </span>
            <code className="text-xs font-mono bg-black/40 px-2 py-1 rounded text-cyan-300 block break-all">
              {selectedModule.file}
            </code>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Core Responsibility
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
              {selectedModule.responsibility}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Dependencies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedModule.dependencies.length > 0 ? (
                selectedModule.dependencies.map(dep => (
                  <span key={dep} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/5">
                    {dep}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">Zero Dependencies (Pure Atomic Kernel)</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Public API Contract
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedModule.publicApi.map(api => (
                <span key={api} className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {api}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider block mb-1">
              Internal / Encapsulation Details
            </span>
            <div className="text-xs text-slate-300 bg-purple-950/20 p-2.5 rounded-lg border border-purple-500/20 font-mono text-[11px]">
              {selectedModule.privateDetails.map((det, idx) => (
                <p key={idx} className="mb-1 last:mb-0 leading-relaxed">• {det}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
