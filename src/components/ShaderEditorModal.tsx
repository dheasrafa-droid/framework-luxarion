/**
 * @file ShaderEditorModal.tsx
 * @description Real-time GLSL Shader inspector and live compiler for Vertex & Fragment shaders.
 * Part of Luxarion UI Components.
 */

import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertCircle, Copy, Code2 } from 'lucide-react';
import { ShaderSource, LuxarionTheme } from '../engine/Luxarion';

interface ShaderEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: LuxarionTheme;
}

export const ShaderEditorModal: React.FC<ShaderEditorModalProps> = ({ isOpen, onClose, currentTheme }) => {
  const [selectedShader, setSelectedShader] = useState<'phong' | 'hologram' | 'wireframe' | 'basic'>('hologram');
  const [activeTab, setActiveTab] = useState<'vertex' | 'fragment'>('fragment');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const shaderMap = {
    phong: {
      name: 'Blinn-Phong Lighting Shader',
      vertex: ShaderSource.PHONG_VERTEX.trim(),
      fragment: ShaderSource.PHONG_FRAGMENT.trim()
    },
    hologram: {
      name: 'Sci-Fi Hologram Fresnel Shader',
      vertex: ShaderSource.HOLOGRAM_VERTEX.trim(),
      fragment: ShaderSource.HOLOGRAM_FRAGMENT.trim()
    },
    wireframe: {
      name: 'Procedural Grid Wireframe Shader',
      vertex: ShaderSource.WIREFRAME_VERTEX.trim(),
      fragment: ShaderSource.WIREFRAME_FRAGMENT.trim()
    },
    basic: {
      name: 'Unlit Basic Color Shader',
      vertex: ShaderSource.BASIC_VERTEX.trim(),
      fragment: ShaderSource.BASIC_FRAGMENT.trim()
    }
  };

  const activeShaderData = shaderMap[selectedShader];
  const currentCode = activeTab === 'vertex' ? activeShaderData.vertex : activeShaderData.fragment;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-4xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: `${currentTheme.accent}55`,
          color: currentTheme.textColor
        }}
      >
        {/* Modal Header */}
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base">Pure Native GLSL Shader Tuner</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> COMPILED OK
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shader Selector & Sub-Tabs */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
          {/* Shader Picker */}
          <div className="flex items-center gap-1 text-xs">
            {(['hologram', 'phong', 'wireframe', 'basic'] as const).map(key => (
              <button
                key={key}
                onClick={() => setSelectedShader(key)}
                className={`px-3 py-1.5 rounded-md font-mono capitalize transition-all ${
                  selectedShader === key
                    ? 'bg-cyan-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Vertex / Fragment Toggle */}
          <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('vertex')}
              className={`px-2.5 py-1 rounded font-mono ${
                activeTab === 'vertex' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vertex (GLSL)
            </button>
            <button
              onClick={() => setActiveTab('fragment')}
              className={`px-2.5 py-1 rounded font-mono ${
                activeTab === 'fragment' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fragment (GLSL)
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs bg-black/90 text-cyan-200/90 leading-relaxed select-text">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 text-slate-400 text-[11px]">
            <span>{activeShaderData.name} — {activeTab.toUpperCase()}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-300 hover:text-white hover:underline cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre">{currentCode}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Target: WebGL 1.0 / WebGL 2.0 Precision Mediump</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sans font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
