/**
 * @file cli-test.ts
 * @description Node/CLI Test Execution Runner for verifying Luxarion unit and integration tests.
 */

import { runMathUnitTests } from './unit/MathUtils.test';
import { runGeometryUnitTests } from './unit/Geometries.test';
import { runSceneGraphIntegrationTests } from './integration/SceneGraph.test';

console.log('\n🧪 Running Luxarion Test Suite...\n');

const allTests = [
  ...runMathUnitTests(),
  ...runGeometryUnitTests(),
  ...runSceneGraphIntegrationTests()
];

let passed = 0;
let failed = 0;

for (const t of allTests) {
  if (t.passed) {
    console.log(`  ✅ [PASS] ${t.name}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${t.name} - ${t.error || 'Assertion failed'}`);
    failed++;
  }
}

console.log(`\n📊 Summary: ${passed} passed, ${failed} failed (${allTests.length} total)\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
