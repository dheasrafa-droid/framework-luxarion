/**
 * @file Geometries.test.ts
 * @description Unit tests for Parametric Geometries: Box, Sphere, Torus, and Cylinder attribute buffers.
 */

import { BoxGeometry } from '../../src/engine/geometries/BoxGeometry';
import { SphereGeometry } from '../../src/engine/geometries/SphereGeometry';
import { TorusGeometry } from '../../src/engine/geometries/TorusGeometry';
import { CylinderGeometry } from '../../src/engine/geometries/CylinderGeometry';

export function runGeometryUnitTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  try {
    const box = new BoxGeometry(1, 1, 1);
    const pos = box.getAttribute('position');
    const norm = box.getAttribute('normal');
    const uv = box.getAttribute('uv');
    const idx = box.index;

    const okBox = !!pos && !!norm && !!uv && !!idx && pos.count === 24 && idx.count === 36;
    tests.push({ name: 'BoxGeometry Vertex & Index Counts', passed: okBox });
  } catch (e: any) {
    tests.push({ name: 'BoxGeometry Vertex & Index Counts', passed: false, error: e.message });
  }

  try {
    const sphere = new SphereGeometry(1, 16, 16);
    const pos = sphere.getAttribute('position');
    const idx = sphere.index;
    const okSphere = !!pos && !!idx && pos.count > 0 && idx.count > 0;
    tests.push({ name: 'SphereGeometry UV Sphere Generation', passed: okSphere });
  } catch (e: any) {
    tests.push({ name: 'SphereGeometry UV Sphere Generation', passed: false, error: e.message });
  }

  try {
    const torus = new TorusGeometry(1, 0.4, 16, 32);
    const pos = torus.getAttribute('position');
    const idx = torus.index;
    const okTorus = !!pos && !!idx && pos.count > 0;
    tests.push({ name: 'TorusGeometry Parametric Mesh Generation', passed: okTorus });
  } catch (e: any) {
    tests.push({ name: 'TorusGeometry Parametric Mesh Generation', passed: false, error: e.message });
  }

  try {
    const cyl = new CylinderGeometry(1, 1, 2, 16);
    const pos = cyl.getAttribute('position');
    const idx = cyl.index;
    const okCyl = !!pos && !!idx && pos.count > 0;
    tests.push({ name: 'CylinderGeometry Tube & Endcaps', passed: okCyl });
  } catch (e: any) {
    tests.push({ name: 'CylinderGeometry Tube & Endcaps', passed: false, error: e.message });
  }

  return tests;
}
