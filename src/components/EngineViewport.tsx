/**
 * @file EngineViewport.tsx
 * @description Primary Interactive Viewport hosting the WebGLRenderer / Canvas2DRenderer with reactive resize observer and demo selector.
 * Part of Luxarion UI Components.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Grid,
  X,
  Check
} from 'lucide-react';
import { WebGLRenderer, Canvas2DRenderer, ThemeManager, LuxarionTheme } from '../engine/Luxarion';
import { ALL_DEMOS, LuxarionDemo } from '../../examples/index';
import { RenderStats } from '../engine/renderers/WebGLRenderer';

interface EngineViewportProps {
  themeManager: ThemeManager;
  currentTheme: LuxarionTheme;
  onUpdateStats: (stats: RenderStats) => void;
}

export const EngineViewport: React.FC<EngineViewportProps> = ({
  themeManager,
  currentTheme,
  onUpdateStats
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvas2dRef = useRef<HTMLCanvasElement>(null);

  const [activeDemo, setActiveDemo] = useState<LuxarionDemo>(ALL_DEMOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showControlsHint, setShowControlsHint] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // References for live instances
  const rendererGLRef = useRef<WebGLRenderer | null>(null);
  const renderer2DRef = useRef<Canvas2DRenderer | null>(null);
  const currentDemoInstanceRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const categories = [
    { id: 'all', label: 'All (10)' },
    { id: '3d', label: '3D Spatial' },
    { id: 'space', label: 'Celestial' },
    { id: 'audio', label: 'Audio Matrix' },
    { id: 'quantum', label: 'Quantum' },
    { id: 'matrix', label: 'Hyperspace' },
    { id: 'hologram', label: 'Holographic' },
    { id: '2d', label: '2D Particles' },
    { id: 'simulation', label: 'Relativity' }
  ];

  const filteredDemos = ALL_DEMOS.filter(demo => {
    if (selectedCategory === 'all') return true;
    return demo.category === selectedCategory;
  });

  const currentIndex = ALL_DEMOS.findIndex(d => d.id === activeDemo.id);

  const handlePrevDemo = () => {
    const prevIdx = (currentIndex - 1 + ALL_DEMOS.length) % ALL_DEMOS.length;
    setActiveDemo(ALL_DEMOS[prevIdx]);
  };

  const handleNextDemo = () => {
    const nextIdx = (currentIndex + 1) % ALL_DEMOS.length;
    setActiveDemo(ALL_DEMOS[nextIdx]);
  };

  // Initialize or switch demo
  useEffect(() => {
    if (!containerRef.current || !glCanvasRef.current || !canvas2dRef.current) return;

    // Clean up previous instance
    if (currentDemoInstanceRef.current?.dispose) {
      currentDemoInstanceRef.current.dispose();
      currentDemoInstanceRef.current = null;
    }

    const is2D = !!activeDemo.is2D || activeDemo.category === '2d' || activeDemo.category === 'simulation';
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    if (!is2D) {
      if (!rendererGLRef.current) {
        try {
          rendererGLRef.current = new WebGLRenderer(glCanvasRef.current, {
            antialias: true,
            alpha: true,
            depth: true
          });
        } catch (e) {
          console.error("Failed to create WebGLRenderer:", e);
        }
      }
      if (rendererGLRef.current) {
        rendererGLRef.current.setSize(width, height);
      }
    } else {
      if (!renderer2DRef.current) {
        try {
          renderer2DRef.current = new Canvas2DRenderer(canvas2dRef.current);
        } catch (e) {
          console.error("Failed to create Canvas2DRenderer:", e);
        }
      }
      if (renderer2DRef.current) {
        renderer2DRef.current.setSize(width, height);
      }
    }

    // Initialize the selected demo
    try {
      currentDemoInstanceRef.current = activeDemo.init(
        rendererGLRef.current,
        renderer2DRef.current,
        themeManager
      );
    } catch (err) {
      console.error("Error initializing demo:", err);
    }

    // Main animation & render loop
    let frameCount = 0;
    let fpsTimer = performance.now();
    let calculatedFPS = 60;

    const renderLoop = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      frameCount++;
      if (now - fpsTimer >= 500) {
        calculatedFPS = Math.round((frameCount * 1000) / (now - fpsTimer));
        frameCount = 0;
        fpsTimer = now;
      }

      if (isPlayingRef.current && currentDemoInstanceRef.current) {
        const timeInSeconds = now / 1000;
        currentDemoInstanceRef.current.update(delta, timeInSeconds);

        if (!is2D && rendererGLRef.current && currentDemoInstanceRef.current.scene && currentDemoInstanceRef.current.camera) {
          rendererGLRef.current.render(
            currentDemoInstanceRef.current.scene,
            currentDemoInstanceRef.current.camera
          );

          onUpdateStats({
            drawCalls: rendererGLRef.current.stats.drawCalls,
            triangles: rendererGLRef.current.stats.triangles,
            vertices: rendererGLRef.current.stats.vertices,
            fps: calculatedFPS
          });
        } else if (is2D) {
          onUpdateStats({
            drawCalls: 1,
            triangles: 800,
            vertices: 800,
            fps: calculatedFPS
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (currentDemoInstanceRef.current?.dispose) {
        currentDemoInstanceRef.current.dispose();
      }
    };
  }, [activeDemo, themeManager]);

  // Handle Container Resizing
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      if (rendererGLRef.current) {
        rendererGLRef.current.setSize(width, height);
      }
      if (renderer2DRef.current) {
        renderer2DRef.current.setSize(width, height);
      }
      if (currentDemoInstanceRef.current?.onResize) {
        currentDemoInstanceRef.current.onResize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  const is2DActive = !!activeDemo.is2D || activeDemo.category === '2d' || activeDemo.category === 'simulation';

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex flex-col overflow-hidden select-none bg-black">
      {/* 1. Sleek Floating Top Experience Switcher (Unobtrusive) */}
      {!isZenMode && (
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 bg-black/65 hover:bg-black/85 backdrop-blur-xl border border-white/15 rounded-full shadow-2xl transition-all max-w-[95vw]">
          <button
            onClick={handlePrevDemo}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Previous Experience"
            aria-label="Previous Experience"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSelectorOpen(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs font-semibold text-white tracking-wide"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="truncate max-w-[170px] sm:max-w-[280px]">{activeDemo.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono uppercase tracking-wider">
              {activeDemo.category}
            </span>
            <Grid className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          <button
            onClick={handleNextDemo}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Next Experience"
            aria-label="Next Experience"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Floating Action Controls (Bottom Right - Clean & Minimal) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-xl border border-white/15 p-1 rounded-full shadow-2xl transition-opacity">
        <button
          id="btn-toggle-play"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          id="btn-toggle-hint"
          onClick={() => setShowControlsHint(!showControlsHint)}
          className={`p-2 rounded-full transition-colors ${
            showControlsHint ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-slate-300'
          }`}
          title="Toggle Experience Guide"
        >
          <Info className="w-4 h-4" />
        </button>

        <button
          id="btn-toggle-zen"
          onClick={() => setIsZenMode(!isZenMode)}
          className={`p-2 rounded-full transition-colors ${
            isZenMode ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-slate-300'
          }`}
          title={isZenMode ? 'Exit Zen Mode (Show Controls)' : 'Zen Mode (Hide All Controls for Pure View)'}
        >
          {isZenMode ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* 3. Collapsible Interactive Guide Card (Bottom Left - Non-intrusive) */}
      {!isZenMode && showControlsHint && (
        <div className="absolute bottom-16 sm:bottom-4 left-4 z-20 p-3.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-xs text-slate-300 max-w-[340px] shadow-2xl animate-fade-in transition-all">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-white">
            <span className="text-sm truncate">{activeDemo.name}</span>
            <button
              onClick={() => setShowControlsHint(false)}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] opacity-80 mb-2 leading-relaxed text-slate-300">
            {activeDemo.description}
          </p>
          <div className="text-[10px] font-mono text-cyan-300/90 border-t border-white/10 pt-2 flex flex-col gap-1">
            {activeDemo.id === '2d-black-hole' ? (
              <>
                <span>• Drag: Move Singularity Point</span>
                <span>• Doppler Beaming: Left = Blueshift, Right = Redshift</span>
              </>
            ) : activeDemo.id === '2d-neural-network' ? (
              <>
                <span>• Move Mouse: Synaptic attraction beacon</span>
                <span>• Click: Trigger action potential cascade</span>
              </>
            ) : activeDemo.id === '2d-particle-vortex' ? (
              <>
                <span>• Move Mouse: Vortex pull & torque</span>
                <span>• Click & Hold: Cosmic particle burst</span>
              </>
            ) : activeDemo.id === '3d-cyber-tunnel' ? (
              <>
                <span>• Hyperspace Velocity: Continuous forward flight</span>
                <span>• Corkscrew banking: Real-time dynamic camera roll</span>
              </>
            ) : activeDemo.id === '3d-planetary-system' ? (
              <>
                <span>• Left Drag: Orbit Celestial Orrery</span>
                <span>• Scroll: Zoom into Moon orbits & Saturn rings</span>
              </>
            ) : activeDemo.id === '3d-audio-visualizer' ? (
              <>
                <span>• Multi-Harmonic Spectrum: 81 monoliths respond to waves</span>
                <span>• Left Drag: Rotate 3D Equalizer view</span>
              </>
            ) : (
              <>
                <span>• Left Drag: 3D Camera Orbit</span>
                <span>• Scroll Wheel: Smooth Zoom In/Out</span>
                <span>• Right Drag: Pan Camera</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. Full Experience Catalog Modal / Drawer */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-950/95 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Visual Experience Catalog</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                  10 Demos
                </span>
              </div>
              <button
                onClick={() => setIsSelectorOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-black/40">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Experiences Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 scrollbar-thin">
              {filteredDemos.map(demo => {
                const isActive = demo.id === activeDemo.id;
                return (
                  <button
                    key={demo.id}
                    onClick={() => {
                      setActiveDemo(demo);
                      setIsSelectorOpen(false);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/30 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                        <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                        {demo.name}
                      </span>
                      {isActive ? (
                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 uppercase text-slate-300 font-mono">
                          {demo.category}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Canvases Container */}
      <div
        ref={containerRef}
        id="engine-canvas-container"
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        style={{ backgroundColor: currentTheme.background }}
      >
        {/* WebGL 3D Canvas */}
        <canvas
          ref={glCanvasRef}
          id="luxarion-webgl-canvas"
          className={`absolute inset-0 w-full h-full block ${is2DActive ? 'hidden' : ''}`}
        />

        {/* 2D Canvas */}
        <canvas
          ref={canvas2dRef}
          id="luxarion-canvas2d"
          className={`absolute inset-0 w-full h-full block ${!is2DActive ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
};
