'use strict';

// Adversarial stress tests for element count / tensor size limits
// Inspired by Chromium bug 492421926: "webnn: Limit element count to INT_MAX"
// TFLite has implicit element count limit of int32 max because
// RuntimeShape::FlatSize returns int.

registerStressTests('tensorLimits', [
  {
    name: 'tensor element count near INT_MAX (2^31-1)',
    run: async (ctx) => {
      // Try to create a tensor with element count = INT32_MAX
      // This should be rejected or handled gracefully, not crash
      try {
        const builder = new MLGraphBuilder(ctx);
        // 2^31 - 1 = 2147483647 float32 elements = ~8GB
        // We cannot allocate this much memory in JS, but we can try to
        // create an input descriptor with this shape to test validation
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [INT32_MAX],
        });
        const output = builder.abs(input);
        // If we get here, builder accepted it. Try to build.
        await builder.build({ output });
      } catch (e) {
        // Expected: should throw, not crash
      }
    },
    timeout: 15000,
  },
  {
    name: 'tensor shape with dimensions multiplying to > INT_MAX',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        // 65536 * 65536 = 4294967296 > INT32_MAX
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [65536, 65536],
        });
        const output = builder.relu(input);
        await builder.build({ output });
      } catch (e) {
        // Expected: should throw
      }
    },
    timeout: 15000,
  },
  {
    name: 'tensor shape overflow via high-dim product',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        // 256^4 = 4294967296 > INT32_MAX
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [256, 256, 256, 256],
        });
        const output = builder.neg(input);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'tensor byte length near max (float32 INT_MAX elements)',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        // INT_MAX float32 elements = INT_MAX * 4 bytes ≈ 8GB
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [INT32_MAX],
        });
        const output = builder.identity(input);
        await builder.build({ output });
      } catch (e) {
        // Expected: validation should reject
      }
    },
    timeout: 15000,
  },
  {
    name: 'createTensor near INT_MAX element count',
    run: async (ctx) => {
      try {
        await ctx.createTensor({
          dataType: 'float32',
          shape: [INT32_MAX],
          readable: true,
        });
      } catch (e) {
        // Expected: should be rejected
      }
    },
    timeout: 15000,
  },
  {
    name: 'createTensor shape product overflow',
    run: async (ctx) => {
      try {
        await ctx.createTensor({
          dataType: 'float32',
          shape: [65536, 65536],
          readable: true,
        });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'conv2d output shape causing INT_MAX overflow',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        // Large spatial dims + padding can cause output shape overflow
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1, 1, 46341, 46341], // 46341^2 > INT_MAX
        });
        const filter = builder.input('filter', {
          dataType: 'float32',
          shape: [1, 1, 1, 1],
        });
        const output = builder.conv2d(input, filter);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'matmul output shape near INT_MAX',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        // [1, 46341] x [46341, 46341] → output [1, 46341] (ok)
        // but [46341, 1] x [1, 46341] → output [46341, 46341] > INT_MAX
        const a = builder.input('a', {
          dataType: 'float32',
          shape: [46341, 1],
        });
        const b = builder.input('b', {
          dataType: 'float32',
          shape: [1, 46341],
        });
        const output = builder.matmul(a, b);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'expand to shape near INT_MAX elements',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1],
        });
        const output = builder.expand(input, [INT32_MAX]);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'tile repetitions causing element count > INT_MAX',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1024],
        });
        // 1024 * 2097152 = 2^31 = exceeds INT_MAX
        const output = builder.tile(input, [2097152]);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'concat producing output > INT_MAX elements',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const inputs = [];
        // 65536 tensors of [32768] = 2^31 total elements
        for (let i = 0; i < 65536; i++) {
          inputs.push(builder.input(`in${i}`, {
            dataType: 'float32',
            shape: [32768],
          }));
        }
        const output = builder.concat(inputs, 0);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 30000,
  },
  {
    name: 'pad producing output > INT_MAX elements',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1],
        });
        const output = builder.pad(input, [INT32_MAX - 1], [0]);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  {
    name: 'reshape to shape with product > INT_MAX',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1],
        });
        const output = builder.reshape(input, [INT32_MAX, 2]);
        await builder.build({ output });
      } catch (e) {
        // Expected
      }
    },
    timeout: 15000,
  },
  // --- New: integer overflow in stride/address computation ---
  {
    name: 'transpose 8D tensor (stride computation overflow)',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [2, 3, 4, 5, 6, 7, 8, 9],
        });
        const output = builder.transpose(input, { permutation: [7, 6, 5, 4, 3, 2, 1, 0] });
        await builder.build({ output });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  {
    name: 'conv2d dilation causing output shape overflow',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [1, 1, 10000, 10000],
        });
        const filter = builder.constant(
          { dataType: 'float32', shape: [1, 1, 3, 3] },
          filledFloat32([1, 1, 3, 3], 1.0));
        const output = builder.conv2d(input, filter, {
          dilations: [100000, 100000],
        });
        await builder.build({ output });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  {
    name: 'broadcast stride overflow ([1, 65536] → [65536, 65536])',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const a = builder.input('a', { dataType: 'float32', shape: [1, 65536] });
        const b = builder.input('b', { dataType: 'float32', shape: [65536, 1] });
        const output = builder.add(a, b);
        await builder.build({ output });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  {
    name: 'slice with stride that overflows element address',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [INT32_MAX],
        });
        const output = builder.slice(input, [0], [INT32_MAX]);
        await builder.build({ output });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  {
    name: 'GRU weight shape near INT_MAX',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const steps = 1;
        const batchSize = 1;
        const hiddenSize = 46341;
        const inputSize = 1;
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [steps, batchSize, inputSize],
        });
        const weight = builder.input('weight', {
          dataType: 'float32',
          shape: [1, 3 * hiddenSize, inputSize],
        });
        const recurrentWeight = builder.input('recurrentWeight', {
          dataType: 'float32',
          shape: [1, 3 * hiddenSize, hiddenSize],
        });
        const output = builder.gru(input, weight, recurrentWeight, steps, hiddenSize);
        await builder.build({ output: output[0] });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  {
    name: 'gather index linearization overflow on large shape',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', {
          dataType: 'float32',
          shape: [65536, 65536],
        });
        const indices = builder.constant({ dataType: 'int32', shape: [1] }, new Int32Array([0]));
        const output = builder.gather(input, indices, { axis: 0 });
        await builder.build({ output });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
]);
