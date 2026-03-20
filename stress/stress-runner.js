'use strict';

const stressTests = [];

function registerStressTests(opName, tests) {
  for (const t of tests) {
    stressTests.push({
      op: opName,
      name: `[${opName}] ${t.name}`,
      run: t.run,
      timeout: t.timeout || 10000,
    });
  }
}
