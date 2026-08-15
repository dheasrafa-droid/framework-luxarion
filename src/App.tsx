/**
 * @file App.tsx
 * @description Main Application root integrating Luxarion Engine Studio, Architecture Visualizer, Access & Encapsulation Rules, and Stability Test Runner.
 * Part of Luxarion Engine Platform.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeManager, THEME_PRESETS, LuxarionTheme } from './engine/Luxarion';
import { NavigationHeader } from './components/NavigationHeader';
import { EngineViewport } from './components/EngineViewport';
import { ArchitectureGraph } from './components/ArchitectureGraph';
import { AccessRulesPanel } from './components/AccessRulesPanel';
import { StabilityTestModal } from './components/StabilityTestModal';
import { ShaderEditorModal } from './components/ShaderEditorModal';
import { RenderStats } from './engine/renderers/WebGLRenderer';

export default function App() {
  const themeManager = useMemo(() => new ThemeManager('obsidian'), []);
  const [currentTheme, setCurrentTheme] = useState<LuxarionTheme>(themeManager.currentTheme);
  const [activeTab, setActiveTab] = useState<'engine' | 'architecture' | 'access-rules' | 'tests'>('engine');
  const [isShaderModalOpen, setIsShaderModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<RenderStats>({
    drawCalls: 0,
    triangles: 0,
    vertices: 0,
    fps: 60
  });

  const availableThemes = useMemo(() => themeManager.getAllThemes(), [themeManager]);

  const handleSelectTheme = (themeId: string) => {
    themeManager.setTheme(themeId);
    setCurrentTheme({ ...themeManager.currentTheme });
  };

  useEffect(() => {
    const onThemeChanged = (e: any) => {
      setCurrentTheme({ ...e.theme });
    };
    themeManager.addEventListener('themeChanged', onThemeChanged);
    return () => {
      themeManager.removeEventListener('themeChanged', onThemeChanged);
    };
  }, [themeManager]);

  return (
    <div
      id="luxarion-app-root"
      className="min-h-screen w-full flex flex-col font-sans transition-colors duration-300 select-none overflow-x-hidden"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.textColor
      }}
    >
      {/* Navigation & Telemetry Header */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        themes={availableThemes}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        stats={stats}
        onOpenShaderModal={() => setIsShaderModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main id="luxarion-main-content" className="flex-1 w-full relative flex flex-col">
        {activeTab === 'engine' && (
          <EngineViewport
            themeManager={themeManager}
            currentTheme={currentTheme}
            onUpdateStats={setStats}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureGraph currentTheme={currentTheme} />
        )}

        {activeTab === 'access-rules' && (
          <AccessRulesPanel currentTheme={currentTheme} />
        )}

        {activeTab === 'tests' && (
          <StabilityTestModal currentTheme={currentTheme} />
        )}
      </main>

      {/* GLSL Shader Inspector Modal */}
      <ShaderEditorModal
        isOpen={isShaderModalOpen}
        onClose={() => setIsShaderModalOpen(false)}
        currentTheme={currentTheme}
      />
    </div>
  );
}
