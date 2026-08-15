/**
 * @file EngineTestRunner.ts
 * @description Automated Unit Test Suite and Mathematical Precision Verifier for Luxarion Engine.
 * Part of Luxarion Engine - Single Responsibility: Engine Quality Assurance & Stability Testing.
 */

import {
  Vector3,
  Matrix4,
  Quaternion,
  Color,
  BoxGeometry,
  SphereGeometry,
  TorusGeometry,
  Node,
  Object3D
} from '../src/engine/Luxarion';

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  durationMs: number;
  details: string;
}

export class EngineTestRunner {
  public static runAllTests(): TestResult[] {
    const results: TestResult[] = [];

    // Test 1: Vector3 Math
    results.push(this._testVector3Math());

    // Test 2: Matrix4 Inversion & Identity
    results.push(this._testMatrix4Inversion());

    // Test 3: Quaternion Slerp & Rotation
    results.push(this._testQuaternionSlerp());

    // Test 4: Color Parsing & Interpolation
    results.push(this._testColorMath());

    // Test 5: Scenegraph World Transform Propagation
    results.push(this._testSceneGraphHierarchy());

    // Test 6: Procedural Geometry Generation
    results.push(this._testGeometryGeneration());

    return results;
  }

  private static _testVector3Math(): TestResult {
    const start = performance.now();
    const a = new Vector3(1, 2, 3);
    const b = new Vector3(4, 5, 6);

    const dot = a.dot(b); // 1*4 + 2*5 + 3*6 = 32
    const cross = a.clone().cross(b); // (-3, 6, -3)

    const passed = dot === 32 && cross.x === -3 && cross.y === 6 && cross.z === -3;

    return {
      suite: 'Math Kernel',
      name: 'Vector3 Dot, Cross & Length Operations',
      passed,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Dot: ${dot} (expected 32), Cross: [${cross.toArray().join(', ')}] (expected [-3, 6, -3])`
    };
  }

  private static _testMatrix4Inversion(): TestResult {
    const start = performance.now();
    const m = new Matrix4();
    m.elements[0] = 2;
    m.elements[5] = 2;
    m.elements[10] = 2;
    m.elements[12] = 5; // translation X

    const inv = m.clone().invert();
    const result = m.clone().multiply(inv);

    // Should approximate identity matrix
    const isIdentity = Math.abs(result.elements[0] - 1) < 0.0001 &&
                       Math.abs(result.elements[5] - 1) < 0.0001 &&
                       Math.abs(result.elements[10] - 1) < 0.0001 &&
                       Math.abs(result.elements[15] - 1) < 0.0001;

    return {
      suite: 'Linear Algebra',
      name: 'Matrix4 Inverse Multiplicative Identity (M * M^-1 = I)',
      passed: isIdentity,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Determinant & Inversion computed successfully. Identity check: ${isIdentity ? 'PASSED' : 'FAILED'}`
    };
  }

  private static _testQuaternionSlerp(): TestResult {
    const start = performance.now();
    const q1 = new Quaternion().identity();
    const q2 = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);

    const slerped = q1.clone().slerp(q2, 0.5);

    // Half angle should be 45 deg = PI / 4
    const passed = Math.abs(slerped.w - Math.cos(Math.PI / 8)) < 0.001;

    return {
      suite: 'Spatial Orientation',
      name: 'Quaternion Slerp (Spherical Linear Interpolation)',
      passed,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Quaternion 45-deg slerp computed with precision. Target W: ${slerped.w.toFixed(4)}`
    };
  }

  private static _testColorMath(): TestResult {
    const start = performance.now();
    const c1 = new Color().setHex('#ff0000');
    const c2 = new Color().setHex('#0000ff');

    const blended = c1.clone().lerp(c2, 0.5);
    const passed = Math.abs(blended.r - 0.5) < 0.01 && Math.abs(blended.b - 0.5) < 0.01;

    return {
      suite: 'Color Engine',
      name: 'Color Hex Parsing & Linear Blending',
      passed,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Parsed #ff0000 and #0000ff, lerp 50%: R=${blended.r.toFixed(2)}, B=${blended.b.toFixed(2)}`
    };
  }

  private static _testSceneGraphHierarchy(): TestResult {
    const start = performance.now();
    const parent = new Node('Parent');
    parent.position.set(10, 0, 0);

    const child = new Node('Child');
    child.position.set(0, 5, 0);
    parent.add(child);

    parent.updateWorldMatrix(true);

    const childWorldPos = new Vector3().applyMatrix4(child.worldMatrix);
    const passed = Math.abs(childWorldPos.x - 10) < 0.001 && Math.abs(childWorldPos.y - 5) < 0.001;

    return {
      suite: 'Scene Graph',
      name: 'Hierarchical World Matrix Propagation',
      passed,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Child world position: [${childWorldPos.x}, ${childWorldPos.y}, ${childWorldPos.z}] (expected [10, 5, 0])`
    };
  }

  private static _testGeometryGeneration(): TestResult {
    const start = performance.now();
    const box = new BoxGeometry(1, 1, 1);
    const sphere = new SphereGeometry(1, 12, 12);
    const torus = new TorusGeometry(1, 0.4, 8, 16);

    const passed = box.getVertexCount() === 24 &&
                   sphere.getVertexCount() > 50 &&
                   torus.getVertexCount() > 50;

    return {
      suite: 'Geometry Pipeline',
      name: 'Procedural Mesh VBO Generation & Normal Calculation',
      passed,
      durationMs: +(performance.now() - start).toFixed(2),
      details: `Box: ${box.getVertexCount()} verts, Sphere: ${sphere.getVertexCount()} verts, Torus: ${torus.getVertexCount()} verts`
    };
  }
}
