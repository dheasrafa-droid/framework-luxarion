/**
 * @file SceneGraph.test.ts
 * @description Integration tests for Scene Graph, Node hierarchy, and World Matrix calculation.
 */

import { Node } from '../../src/engine/core/Node';
import { Object3D } from '../../src/engine/core/Object3D';
import { BoxGeometry } from '../../src/engine/geometries/BoxGeometry';
import { BasicMaterial } from '../../src/engine/materials/BasicMaterial';
import { Vector3 } from '../../src/engine/math/Vector3';

export function runSceneGraphIntegrationTests(): { name: string; passed: boolean; error?: string }[] {
  const tests: { name: string; passed: boolean; error?: string }[] = [];

  try {
    const root = new Node('Root');
    root.position.set(10, 0, 0);

    const child = new Node('Child');
    child.position.set(0, 5, 0);
    root.add(child);

    const grandchild = new Object3D(new BoxGeometry(1, 1, 1), new BasicMaterial());
    grandchild.position.set(0, 0, 2);
    child.add(grandchild);

    root.updateWorldMatrix(true);

    const worldPos = new Vector3().applyMatrix4(grandchild.worldMatrix);
    const ok = Math.abs(worldPos.x - 10) < 0.001 && Math.abs(worldPos.y - 5) < 0.001 && Math.abs(worldPos.z - 2) < 0.001;

    tests.push({
      name: 'SceneGraph World Matrix Hierarchy Propagation',
      passed: ok
    });
  } catch (e: any) {
    tests.push({
      name: 'SceneGraph World Matrix Hierarchy Propagation',
      passed: false,
      error: e.message
    });
  }

  return tests;
}
