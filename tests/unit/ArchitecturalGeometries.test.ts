/**
 * @file ArchitecturalGeometries.test.ts
 * @description Unit tests for StaircaseGeometry, ArchGeometry, WedgeGeometry, and PillarGeometry vertex allocations.
 */

import { StaircaseGeometry } from '../../src/engine/geometries/StaircaseGeometry';
import { ArchGeometry } from '../../src/engine/geometries/ArchGeometry';
import { WedgeGeometry } from '../../src/engine/geometries/WedgeGeometry';
import { PillarGeometry } from '../../src/engine/geometries/PillarGeometry';

export function runArchitecturalUnitTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  // 1. StaircaseGeometry
  try {
    const stairs = new StaircaseGeometry(3.0, 2.0, 4.0, 8, true);
    const pos = stairs.getAttribute('position');
    const idx = stairs.index;
    const ok = !!pos && pos.count > 0 && !!idx && idx.count > 0;
    tests.push({ name: 'StaircaseGeometry Steps & Side Walls Vertex Generation', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'StaircaseGeometry Steps & Side Walls Vertex Generation', passed: false, error: e.message });
  }

  // 2. ArchGeometry
  try {
    const arch = new ArchGeometry(2.4, 3.6, 0.8, 16);
    const pos = arch.getAttribute('position');
    const idx = arch.index;
    const ok = !!pos && pos.count > 0 && !!idx && idx.count > 0;
    tests.push({ name: 'ArchGeometry Vault Ceiling Soffit Generation', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'ArchGeometry Vault Ceiling Soffit Generation', passed: false, error: e.message });
  }

  // 3. WedgeGeometry
  try {
    const wedge = new WedgeGeometry(2.0, 2.0, 4.0);
    const pos = wedge.getAttribute('position');
    const idx = wedge.index;
    // 3 quads (12 vertices, 18 indices) + 2 triangles (6 vertices, 6 indices) = 18 vertices, 24 indices
    const ok = !!pos && pos.count === 18 && !!idx && idx.count === 24;
    tests.push({ name: 'WedgeGeometry Incline Ramp & Triangular Sides', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'WedgeGeometry Incline Ramp & Triangular Sides', passed: false, error: e.message });
  }

  // 4. PillarGeometry
  try {
    const pillar = new PillarGeometry(0.6, 4.0, 16);
    const pos = pillar.getAttribute('position');
    const idx = pillar.index;
    const ok = !!pos && pos.count > 0 && !!idx && idx.count > 0;
    tests.push({ name: 'PillarGeometry Architectural Plinth & Collar Shaft', passed: ok });
  } catch (e: any) {
    tests.push({ name: 'PillarGeometry Architectural Plinth & Collar Shaft', passed: false, error: e.message });
  }

  return tests;
}
