/**
 * @file EngineViewport.tsx
 * @description Primary Interactive Viewport hosting the WebGLRenderer / Canvas2DRenderer with reactive resize observer and demo selector.
 * Part of Luxarion UI Components.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Maximize2, Sparkles, Layers, Info } from 'lucide-react';
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
  const [showControlsHint, setShowControlsHint] = useState<boolean>(true);

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

  // Initialize or switch demo
  useEffect(() => {
    if (!containerRef.current || !glCanvasRef.current || !canvas2dRef.current) return;

    // Clean up previous instance
    if (currentDemoInstanceRef.current?.dispose) {
      currentDemoInstanceRef.current.dispose();
      currentDemoInstanceRef.current = null;
    }

    const is2D = activeDemo.category === '2d';
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

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex flex-col overflow-hidden select-none">
      {/* Demo Selector Floating Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-[90vw]">
        {ALL_DEMOS.map(demo => {
          const isActive = demo.id === activeDemo.id;
          return (
            <button
              key={demo.id}
              id={`demo-btn-${demo.id}`}
              onClick={() => setActiveDemo(demo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg ${
                isActive
                  ? 'bg-white/20 text-white border-cyan-400/80 shadow-cyan-500/20'
                  : 'bg-black/50 text-slate-300 border-white/10 hover:border-white/30 hover:bg-black/70'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'opacity-60'}`} />
              <span>{demo.name}</span>
            </button>
          );
        })}
      </div>

      {/* Viewport Action Controls (Play/Pause, Reset, Info) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          id="btn-toggle-play"
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white transition-colors shadow-lg"
          title={isPlaying ? 'Pause Animation' : 'Resume Animation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        <button
          id="btn-toggle-hint"
          onClick={() => setShowControlsHint(!showControlsHint)}
          className="p-2.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 text-white transition-colors shadow-lg"
          title="Toggle Controls Guide"
        >
          <Info className="w-4 h-4 text-sky-400" />
        </button>
      </div>

      {/* Floating Interactive Guide */}
      {showControlsHint && (
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs text-slate-300 max-w-xs shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-1 font-semibold text-white">
            <span>{activeDemo.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 uppercase font-mono">
              {activeDemo.category}
            </span>
          </div>
          <p className="text-[11px] opacity-80 mb-2 leading-relaxed">
            {activeDemo.description}
          </p>
          <div className="text-[10px] font-mono text-cyan-300/80 border-t border-white/10 pt-1.5 flex flex-col gap-0.5">
            {activeDemo.category === '2d' ? (
              <>
                <span>• Move Mouse: Attract particle vortex</span>
                <span>• Click & Hold: High-density particle burst</span>
              </>
            ) : (
              <>
                <span>• Left Click + Drag: Orbit Camera</span>
                <span>• Scroll Wheel: Smooth Zoom In/Out</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Canvases Container */}
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
          className={`absolute inset-0 w-full h-full block ${activeDemo.category === '2d' ? 'hidden' : ''}`}
        />

        {/* 2D Canvas */}
        <canvas
          ref={canvas2dRef}
          id="luxarion-canvas2d"
          className={`absolute inset-0 w-full h-full block ${activeDemo.category !== '2d' ? 'hidden' : ''}`}
        />
      </div>
    </div>
  );
};
