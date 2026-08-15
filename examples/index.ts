/**
 * @file index.ts
 * @description Master Barrel Export for all Luxarion Engine Examples.
 * Part of Luxarion Engine - Single Responsibility: Example Registry Aggregation.
 */

import { LuxarionDemo } from './ExampleRegistry';
import { Demo3DCrystals } from './Demo3DCrystals';
import { Demo3DPlanetarySystem } from './Demo3DPlanetarySystem';
import { Demo3DAudioVisualizer } from './Demo3DAudioVisualizer';
import { Demo3DQuantumTopology } from './Demo3DQuantumTopology';
import { Demo3DCyberTunnel } from './Demo3DCyberTunnel';
import { Demo3DCyberCity } from './Demo3DCyberCity';
import { DemoHolographicHUD } from './DemoHolographicHUD';
import { Demo2DParticleVortex } from './Demo2DParticleVortex';
import { Demo2DNeuralNetwork } from './Demo2DNeuralNetwork';
import { Demo2DBlackHole } from './Demo2DBlackHole';

export const ALL_DEMOS: LuxarionDemo[] = [
  Demo3DCrystals,
  Demo3DPlanetarySystem,
  Demo3DAudioVisualizer,
  Demo3DQuantumTopology,
  Demo3DCyberTunnel,
  Demo3DCyberCity,
  DemoHolographicHUD,
  Demo2DParticleVortex,
  Demo2DNeuralNetwork,
  Demo2DBlackHole
];

export {
  type LuxarionDemo,
  Demo3DCrystals,
  Demo3DPlanetarySystem,
  Demo3DAudioVisualizer,
  Demo3DQuantumTopology,
  Demo3DCyberTunnel,
  Demo3DCyberCity,
  DemoHolographicHUD,
  Demo2DParticleVortex,
  Demo2DNeuralNetwork,
  Demo2DBlackHole
};
