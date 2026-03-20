'use strict';

// This file is loaded by the HTML pages. It dynamically loads all per-operator
// test files from the tests/ subdirectory.

const stressTestFiles = [
  '../tests/elementwise-unary.js',
  '../tests/elementwise-binary.js',
  '../tests/elementwise-logical.js',
  '../tests/activation.js',
  '../tests/softmax.js',
  '../tests/reduction.js',
  '../tests/conv2d.js',
  '../tests/pooling.js',
  '../tests/normalization.js',
  '../tests/matmul-gemm.js',
  '../tests/data-movement.js',
  '../tests/gather-scatter.js',
  '../tests/recurrent.js',
  '../tests/argminmax.js',
  '../tests/misc-ops.js',
  '../tests/tensor-limits.js',
  '../tests/context-graph.js',
  '../tests/type-confusion.js',
  '../tests/graph-optimization.js',
  '../tests/race-conditions.js',
  '../tests/zero-dimensions.js',
  '../tests/uninitialized-memory.js',
  '../tests/slice-stride.js',
  '../tests/quantization-roundtrip.js',
  '../tests/precision-chains.js',
];

// Load all test scripts sequentially (order matters for registration).
// Resolves window.__stressTestsReady when done.
window.__stressTestsReady = (async () => {
  for (const src of stressTestFiles) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }
})();
