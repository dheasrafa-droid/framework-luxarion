/**
 * @file index.ts
 * @description Master Barrel Export for all Luxarion Engine Examples.
 * Part of Luxarion Engine - Single Responsibility: Example Registry Aggregation.
 */

import { LuxarionDemo } from './ExampleRegistry';
import { Demo3DCrystals } from './Demo3DCrystals';
import { Demo3DCyberCity } from './Demo3DCyberCity';
import { Demo2DParticleVortex } from './Demo2DParticleVortex';
import { DemoHolographicHUD } from './DemoHolographicHUD';

export const ALL_DEMOS: LuxarionDemo[] = [
  Demo3DCrystals,
  Demo3DCyberCity,
  Demo2DParticleVortex,
  DemoHolographicHUD
];

export {
  type LuxarionDemo,
  Demo3DCrystals,
  Demo3DCyberCity,
  Demo2DParticleVortex,
  DemoHolographicHUD
};
