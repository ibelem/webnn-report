'use strict';

// Adversarial stress tests for slice stride semantics and edge cases.
// Targets: stride=0 (infinite loop), large strides, start > end,
// boundary conditions, high-dimensional slicing.

registerStressTests('slice-stride', [
  {
    name: 'slice with stride=1 (normal)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
        return builder.slice(input, [10], [20], { strides: [1] });
      });
    },
  },
  {
    name: 'slice with stride=2 (every other element)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
        return builder.slice(input, [0], [50], { strides: [2] });
      });
    },
  },
  {
    name: 'slice with very large stride (should return few elements)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1000] }, randomFloat32([1000]));
        return builder.slice(input, [0], [1], { strides: [999] });
      });
    },
  },
  {
    name: 'slice with stride=INT32_MAX',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
          return builder.slice(input, [0], [1], { strides: [INT32_MAX] });
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'slice size=0 (empty result)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
          return builder.slice(input, [50], [0]);
        });
      } catch (e) { /* expected: may error on zero-sized output */ }
    },
  },
  {
    name: 'slice start at boundary (last element)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [10] },
          adversarialFloat32([10]));
        return builder.slice(input, [9], [1]);
      });
    },
  },
  {
    name: 'slice start=0, size=full (identity slice)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.slice(input, [0], [15]);
      });
    },
  },
  {
    name: 'multi-dim slice with mixed strides',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8, 8, 8] }, randomFloat32([8, 8, 8]));
        return builder.slice(input, [0, 0, 0], [4, 4, 4], { strides: [2, 2, 2] });
      });
    },
  },
  {
    name: 'slice on 6D tensor',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4, 5, 6, 7] },
          randomFloat32([2, 3, 4, 5, 6, 7]));
        return builder.slice(input, [0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1]);
      });
    },
  },
  {
    name: 'slice with adversarial values in tensor',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.slice(input, [5], [5]);
      });
    },
  },
  {
    name: 'slice single element from large tensor',
    run: async (ctx) => {
      const shape = [1024, 1024];
      await buildAndExecuteWithInputs(ctx, {
        input: { dataType: 'float32', shape, data: filledFloat32(shape, 1.0) }
      }, (builder, inputs) => builder.slice(inputs.input, [512, 512], [1, 1]));
    },
    timeout: 30000,
  },
  {
    name: 'repeated slice of same tensor (100x)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
        let result = input;
        for (let i = 0; i < 50; i++) {
          result = builder.slice(input, [i], [1]);
          result = builder.reshape(result, [1]);
        }
        return result;
      });
    },
  },
]);
