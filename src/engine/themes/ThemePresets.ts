/**
 * @file ThemePresets.ts
 * @description Theme configuration definitions specifying 2D/3D color palettes, lighting vectors, and material shaders.
 * Part of Luxarion Engine - Single Responsibility: Engine Theme Presets.
 */

export interface LuxarionTheme {
  id: string;
  name: string;
  category: '3d' | '2d' | 'hybrid';
  background: string;
  surface: string;
  accent: string;
  secondary: string;
  textColor: string;
  ambientLight: string;
  dirLight: string;
  pointLight: string;
  wireframeColor: string;
  hologramColor: string;
  scanlineDensity: number;
  fresnelPower: number;
  description: string;
}

export const THEME_PRESETS: Record<string, LuxarionTheme> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Void',
    category: '3d',
    background: '#090a0f',
    surface: '#12141e',
    accent: '#38bdf8',
    secondary: '#818cf8',
    textColor: '#f8fafc',
    ambientLight: '#1e293b',
    dirLight: '#38bdf8',
    pointLight: '#ec4899',
    wireframeColor: '#38bdf8',
    hologramColor: '#00f0ff',
    scanlineDensity: 30.0,
    fresnelPower: 2.2,
    description: 'Deep midnight obsidian atmosphere with sharp cyan specular reflections.'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'hybrid',
    background: '#07050d',
    surface: '#150d2a',
    accent: '#ff007f',
    secondary: '#00f0ff',
    textColor: '#ffffff',
    ambientLight: '#3b0764',
    dirLight: '#ff007f',
    pointLight: '#00f0ff',
    wireframeColor: '#ff007f',
    hologramColor: '#ff007f',
    scanlineDensity: 45.0,
    fresnelPower: 1.8,
    description: 'High-contrast neon magenta and cyan aesthetic with vibrant chromatic energy.'
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum Architectural',
    category: '3d',
    background: '#f1f5f9',
    surface: '#ffffff',
    accent: '#0f172a',
    secondary: '#475569',
    textColor: '#0f172a',
    ambientLight: '#cbd5e1',
    dirLight: '#ffffff',
    pointLight: '#3b82f6',
    wireframeColor: '#0f172a',
    hologramColor: '#3b82f6',
    scanlineDensity: 15.0,
    fresnelPower: 3.5,
    description: 'Sleek, minimalist studio lighting on a pristine high-contrast neutral canvas.'
  },
  hologram: {
    id: 'hologram',
    name: 'Holographic Matrix',
    category: 'hybrid',
    background: '#021319',
    surface: '#052935',
    accent: '#10b981',
    secondary: '#06b6d4',
    textColor: '#ecfdf5',
    ambientLight: '#064e3b',
    dirLight: '#10b981',
    pointLight: '#06b6d4',
    wireframeColor: '#10b981',
    hologramColor: '#10b981',
    scanlineDensity: 55.0,
    fresnelPower: 1.5,
    description: 'Matrix green terminal optics with intense Fresnel edge glow and digital scanlines.'
  },
  solaris: {
    id: 'solaris',
    name: 'Solaris Amber',
    category: '3d',
    background: '#0f0a04',
    surface: '#241407',
    accent: '#f59e0b',
    secondary: '#ef4444',
    textColor: '#fffbeb',
    ambientLight: '#451a03',
    dirLight: '#fbbf24',
    pointLight: '#f97316',
    wireframeColor: '#f59e0b',
    hologramColor: '#fbbf24',
    scanlineDensity: 35.0,
    fresnelPower: 2.0,
    description: 'Warm coronal solar atmosphere with golden amber specular highlights.'
  }
};
