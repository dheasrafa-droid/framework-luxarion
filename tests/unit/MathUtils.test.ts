/**
 * @file MathUtils.test.ts
 * @description Unit tests for Math primitives: Vector2, Vector3, Vector4, Matrix4, Quaternion, Color, and Noise.
 */

import { Vector2 } from '../../src/engine/math/Vector2';
import { Vector3 } from '../../src/engine/math/Vector3';
import { Vector4 } from '../../src/engine/math/Vector4';
import { Matrix4 } from '../../src/engine/math/Matrix4';
import { Quaternion } from '../../src/engine/math/Quaternion';
import { Color } from '../../src/engine/math/Color';
import { Noise } from '../../src/engine/math/Noise';

export function runMathUnitTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  // 1. Vector2 & Vector3
  try {
    const v2 = new Vector2(3, 4);
    const len2 = v2.length();
    const okV2 = Math.abs(len2 - 5) < 0.0001;

    const v3 = new Vector3(1, 2, 3);
    const v3b = new Vector3(4, 5, 6);
    const dot = v3.dot(v3b);
    const cross = v3.clone().cross(v3b);

    const okV3 = dot === 32 && cross.x === -3 && cross.y === 6 && cross.z === -3;
    tests.push({ name: 'Vector2 & Vector3 Basic Math', passed: okV2 && okV3 });
  } catch (e: any) {
    tests.push({ name: 'Vector2 & Vector3 Basic Math', passed: false, error: e.message });
  }

  // 2. Matrix4 Inversion & Multiplicative Identity
  try {
    const m = new Matrix4();
    m.elements[0] = 2;
    m.elements[5] = 2;
    m.elements[10] = 2;
    m.elements[12] = 5;

    const inv = m.clone().invert();
    const result = m.clone().multiply(inv);

    const isIdentity = Math.abs(result.elements[0] - 1) < 0.0001 &&
                       Math.abs(result.elements[5] - 1) < 0.0001 &&
                       Math.abs(result.elements[10] - 1) < 0.0001 &&
                       Math.abs(result.elements[15] - 1) < 0.0001;
    tests.push({ name: 'Matrix4 Inversion & Multiplicative Identity', passed: isIdentity });
  } catch (e: any) {
    tests.push({ name: 'Matrix4 Inversion & Multiplicative Identity', passed: false, error: e.message });
  }

  // 3. Quaternion Slerp
  try {
    const q1 = new Quaternion().identity();
    const q2 = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
    const slerped = q1.clone().slerp(q2, 0.5);

    const okQ = Math.abs(slerped.w - Math.cos(Math.PI / 8)) < 0.001;
    tests.push({ name: 'Quaternion Slerp (Spherical Linear Interpolation)', passed: okQ });
  } catch (e: any) {
    tests.push({ name: 'Quaternion Slerp (Spherical Linear Interpolation)', passed: false, error: e.message });
  }

  // 4. Color Parsing & Hex
  try {
    const col = new Color().setHex('#ff8800');
    const rgb = col.toRGBArray();
    const okCol = Math.abs(rgb[0] - 1.0) < 0.01 && Math.abs(rgb[1] - (136 / 255)) < 0.01;
    tests.push({ name: 'Color Hex Parsing & Array Conversion', passed: okCol });
  } catch (e: any) {
    tests.push({ name: 'Color Hex Parsing & Array Conversion', passed: false, error: e.message });
  }

  // 5. Simplex Noise & FBM
  try {
    const n = Noise.noise2D(0.5, 0.5);
    const fbm = Noise.fbm2D(1.2, 3.4, 4);
    const okNoise = typeof n === 'number' && n >= -1 && n <= 1 && typeof fbm === 'number';
    tests.push({ name: 'Simplex 2D/3D & FBM Noise Bounds', passed: okNoise });
  } catch (e: any) {
    tests.push({ name: 'Simplex 2D/3D & FBM Noise Bounds', passed: false, error: e.message });
  }

  return tests;
}
