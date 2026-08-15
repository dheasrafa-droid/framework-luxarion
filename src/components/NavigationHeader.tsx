/**
 * @file NavigationHeader.tsx
 * @description Top navigation bar with theme selector, active mode tabs, and real-time engine telemetry HUD.
 * Part of Luxarion UI Components.
 */

import React from 'react';
import { Box, Layers, ShieldCheck, Activity, Cpu, Palette, Sparkles, Terminal } from 'lucide-react';
import { LuxarionTheme } from '../engine/Luxarion';
import { RenderStats } from '../engine/renderers/WebGLRenderer';

interface NavigationHeaderProps {
  activeTab: 'engine' | 'architecture' | 'access-rules' | 'tests';
  onSelectTab: (tab: 'engine' | 'architecture' | 'access-rules' | 'tests') => void;
  themes: LuxarionTheme[];
  currentTheme: LuxarionTheme;
  onSelectTheme: (themeId: string) => void;
  stats: RenderStats;
  onOpenShaderModal: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  themes,
  currentTheme,
  onSelectTheme,
  stats,
  onOpenShaderModal
}) => {
  return (
    <header
      id="luxarion-header"
      className="border-b transition-colors duration-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3 select-none"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: `${currentTheme.accent}33`,
        color: currentTheme.textColor
      }}
    >
      {/* Brand Identity & Architecture Tag */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-md transition-transform hover:scale-105"
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000'
          }}
        >
          LX
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg tracking-tight">Luxarion Engine</h1>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${currentTheme.accent}22`,
                color: currentTheme.accent,
                border: `1px solid ${currentTheme.accent}55`
              }}
            >
              Pure WebGL 2D/3D
            </span>
          </div>
          <p className="text-xs opacity-70">
            Single Responsibility Pattern • Entry Point <code className="font-mono text-[11px] font-bold">Luxarion.ts</code>
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5 text-sm">
        <button
          id="tab-btn-engine"
          onClick={() => onSelectTab('engine')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'engine'
              ? 'shadow-sm font-semibold'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'engine' ? currentTheme.accent : 'transparent',
            color: activeTab === 'engine' ? (currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000') : 'inherit'
          }}
        >
          <Box className="w-4 h-4" />
          <span>Live Studio</span>
        </button>

        <button
          id="tab-btn-architecture"
          onClick={() => onSelectTab('architecture')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'architecture'
              ? 'shadow-sm font-semibold'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'architecture' ? currentTheme.accent : 'transparent',
            color: activeTab === 'architecture' ? (currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000') : 'inherit'
          }}
        >
          <Layers className="w-4 h-4" />
          <span>Graph & Lifecycle</span>
        </button>

        <button
          id="tab-btn-access-rules"
          onClick={() => onSelectTab('access-rules')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'access-rules'
              ? 'shadow-sm font-semibold'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'access-rules' ? currentTheme.accent : 'transparent',
            color: activeTab === 'access-rules' ? (currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000') : 'inherit'
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Access & Encapsulation</span>
        </button>

        <button
          id="tab-btn-tests"
          onClick={() => onSelectTab('tests')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeTab === 'tests'
              ? 'shadow-sm font-semibold'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeTab === 'tests' ? currentTheme.accent : 'transparent',
            color: activeTab === 'tests' ? (currentTheme.background === '#f1f5f9' ? '#ffffff' : '#000000') : 'inherit'
          }}
        >
          <Activity className="w-4 h-4" />
          <span>Stability Tests</span>
        </button>
      </nav>

      {/* Theme Picker, Shader Tuner, & Performance Metrics */}
      <div className="flex items-center gap-3">
        {/* Live Shader Inspector Button */}
        <button
          id="btn-shader-inspector"
          onClick={onOpenShaderModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border border-white/10 hover:border-white/30 bg-black/20 transition-colors"
          title="Inspect and test compiled GLSL Shaders"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLSL Tuner</span>
        </button>

        {/* Theme Picker Dropdown */}
        <div className="flex items-center gap-2 bg-black/20 px-2.5 py-1.5 rounded-md border border-white/10 text-xs">
          <Palette className="w-3.5 h-3.5 opacity-70" />
          <select
            id="theme-select-dropdown"
            value={currentTheme.id}
            onChange={(e) => onSelectTheme(e.target.value)}
            aria-label="Select Theme Preset"
            className="bg-transparent font-medium outline-none cursor-pointer"
            style={{ color: currentTheme.textColor }}
          >
            {themes.map(t => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.name} ({t.category.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Real-time Telemetry Stats Pill */}
        <div
          id="engine-stats-pill"
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-md text-xs font-mono border border-white/10 bg-black/30"
        >
          <div className="flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{stats.fps}</span>
            <span className="opacity-60 text-[10px]">FPS</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-1">
            <span className="text-sky-400 font-bold">{stats.drawCalls}</span>
            <span className="opacity-60 text-[10px]">DRAWS</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-1">
            <span className="text-purple-400 font-bold">{stats.triangles}</span>
            <span className="opacity-60 text-[10px]">TRIS</span>
          </div>
        </div>
      </div>
    </header>
  );
};
