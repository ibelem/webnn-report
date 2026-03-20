'use strict';

// Adversarial stress tests for: gather, gatherElements, gatherND,
// scatterElements, scatterND

// --- gather ---
registerStressTests('gather', [
  {
    name: 'gather with adversarial input values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        const indices = builder.constant({ dataType: 'int32', shape: [4] }, new Int32Array([0, 7, 14, 0]));
        return builder.gather(input, indices);
      });
    },
  },
  {
    name: 'gather with max index boundary',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const size = 1024;
        const input = builder.constant({ dataType: 'float32', shape: [size] }, randomFloat32([size]));
        const indices = builder.constant({ dataType: 'int32', shape: [4] }, new Int32Array([0, size - 1, size - 1, 0]));
        return builder.gather(input, indices);
      });
    },
  },
  {
    name: 'gather with negative indices',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [16] }, randomFloat32([16]));
          const indices = builder.constant({ dataType: 'int32', shape: [4] }, new Int32Array([-1, -2, -16, 0]));
          return builder.gather(input, indices);
        });
      } catch (e) { /* expected - should not crash */ }
    },
  },
  {
    name: 'gather with out-of-bounds indices',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
          const indices = builder.constant({ dataType: 'int32', shape: [3] }, new Int32Array([100, INT32_MAX, -INT32_MAX]));
          return builder.gather(input, indices);
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'gather large number of indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [16] }, randomFloat32([16]));
        const size = 65536;
        const idxData = new Int32Array(size);
        for (let i = 0; i < size; i++) idxData[i] = i % 16;
        const indices = builder.constant({ dataType: 'int32', shape: [size] }, idxData);
        return builder.gather(input, indices);
      });
    },
  },
  {
    name: 'gather along axis with 2D input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 8] }, adversarialFloat32([4, 8]));
        const indices = builder.constant({ dataType: 'int32', shape: [3] }, new Int32Array([0, 3, 7]));
        return builder.gather(input, indices, { axis: 1 });
      });
    },
  },
]);

// --- gatherElements ---
registerStressTests('gatherElements', [
  {
    name: 'gatherElements adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [3, 5] }, adversarialFloat32([3, 5]));
        const indices = builder.constant({ dataType: 'int32', shape: [3, 2] }, new Int32Array([0, 4, 0, 4, 0, 4]));
        return builder.gatherElements(input, indices, { axis: 1 });
      });
    },
  },
  {
    name: 'gatherElements boundary indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        const indices = builder.constant({ dataType: 'int32', shape: [4, 4] },
          new Int32Array([3, 3, 3, 3, 0, 0, 0, 0, 3, 0, 3, 0, 0, 3, 0, 3]));
        return builder.gatherElements(input, indices, { axis: 0 });
      });
    },
  },
]);

// --- gatherND ---
registerStressTests('gatherND', [
  {
    name: 'gatherND adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, adversarialFloat32([2, 3, 4]));
        const indices = builder.constant({ dataType: 'int32', shape: [2, 2] }, new Int32Array([0, 0, 1, 2]));
        return builder.gatherND(input, indices);
      });
    },
  },
  {
    name: 'gatherND boundary indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        const indices = builder.constant({ dataType: 'int32', shape: [4, 2] },
          new Int32Array([0, 0, 3, 3, 0, 3, 3, 0]));
        return builder.gatherND(input, indices);
      });
    },
  },
]);

// --- scatterElements ---
registerStressTests('scatterElements', [
  {
    name: 'scatterElements adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        const indices = builder.constant({ dataType: 'int32', shape: [4, 2] },
          new Int32Array([0, 3, 0, 3, 0, 3, 0, 3]));
        const updates = builder.constant({ dataType: 'float32', shape: [4, 2] },
          new Float32Array([NaN, Infinity, -Infinity, 0, FLOAT32_MAX, -FLOAT32_MAX, FLOAT32_MIN_SUBNORMAL, -0]));
        return builder.scatterElements(input, indices, updates, { axis: 1 });
      });
    },
  },
  {
    name: 'scatterElements overlapping indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, filledFloat32([8], 0));
        const indices = builder.constant({ dataType: 'int32', shape: [8] },
          new Int32Array([0, 0, 0, 0, 0, 0, 0, 0]));
        const updates = builder.constant({ dataType: 'float32', shape: [8] }, randomFloat32([8]));
        return builder.scatterElements(input, indices, updates);
      });
    },
  },
]);

// --- scatterND ---
registerStressTests('scatterND', [
  {
    name: 'scatterND adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        const indices = builder.constant({ dataType: 'int32', shape: [2, 2] },
          new Int32Array([0, 0, 3, 3]));
        const updates = builder.constant({ dataType: 'float32', shape: [2] },
          new Float32Array([NaN, Infinity]));
        return builder.scatterND(input, indices, updates);
      });
    },
  },
  {
    name: 'scatterND overlapping indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 0));
        const indices = builder.constant({ dataType: 'int32', shape: [4, 1] },
          new Int32Array([0, 0, 0, 0]));
        const updates = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        return builder.scatterND(input, indices, updates);
      });
    },
  },
]);

// --- New: expanded gather/scatter edge cases ---
registerStressTests('gather', [
  {
    name: 'INT32_MIN as index (sign extension bug)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [10] }, randomFloat32([10]));
          const indices = builder.constant({ dataType: 'int32', shape: [1] }, new Int32Array([-2147483648]));
          return builder.gather(input, indices, { axis: 0 });
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'large indices array (1M) indexing small input',
    run: async (ctx) => {
      try {
        const indicesData = new Int32Array(1024 * 1024);
        for (let i = 0; i < indicesData.length; i++) indicesData[i] = i % 10;
        await buildAndExecuteWithInputs(ctx, {
          input: { dataType: 'float32', shape: [10], data: randomFloat32([10]) },
        }, (builder, inputs) => {
          const indices = builder.constant({ dataType: 'int32', shape: [1024 * 1024] }, indicesData);
          return builder.gather(inputs.input, indices, { axis: 0 });
        });
      } catch (e) { /* expected if too large */ }
    },
    timeout: 30000,
  },
  {
    name: 'all indices identical (stress cache)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
        const indices = builder.constant({ dataType: 'int32', shape: [1000] }, filledInt32([1000], 0));
        return builder.gather(input, indices, { axis: 0 });
      });
    },
  },
]);

registerStressTests('scatterElements', [
  {
    name: '1000 writes to same index (collision semantics)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [10] }, filledFloat32([10], 0));
        const indices = builder.constant({ dataType: 'int32', shape: [1000] }, filledInt32([1000], 0));
        const updates = builder.constant({ dataType: 'float32', shape: [1000] }, randomFloat32([1000]));
        return builder.scatterElements(input, indices, updates, { axis: 0 });
      });
    },
  },
  {
    name: 'NaN in updates with overlapping indices',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0));
        const indices = builder.constant({ dataType: 'int32', shape: [4] }, new Int32Array([0, 0, 1, 1]));
        const updates = builder.constant({ dataType: 'float32', shape: [4] },
          new Float32Array([NaN, 1.0, Infinity, -Infinity]));
        return builder.scatterElements(input, indices, updates, { axis: 0 });
      });
    },
  },
]);

registerStressTests('gatherND', [
  {
    name: 'out of bounds partial index',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [10, 10, 10] }, randomFloat32([10, 10, 10]));
          const indices = builder.constant({ dataType: 'int32', shape: [1, 1] }, new Int32Array([100]));
          return builder.gatherND(input, indices);
        });
      } catch (e) { /* expected */ }
    },
  },
]);
