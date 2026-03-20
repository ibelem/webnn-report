'use strict';

// Adversarial stress tests for zero-sized dimensions.
// Many operations should either error gracefully or produce empty results,
// never crash or access invalid memory.

const kZeroDimUnaryOps = [
  'abs', 'ceil', 'cos', 'exp', 'floor', 'log', 'neg', 'reciprocal',
  'relu', 'sigmoid', 'sin', 'sqrt', 'tan', 'tanh', 'identity',
];

// --- Zero-sized dimension in unary ops ---
for (const opName of kZeroDimUnaryOps) {
  registerStressTests('zero-dim', [
    {
      name: `${opName} on [0, 4] input`,
      run: async (ctx) => {
        try {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
            return builder[opName](input);
          });
        } catch (e) { /* expected: should throw, not crash */ }
      },
    },
  ]);
}

registerStressTests('zero-dim', [
  // --- Zero-dim in binary ops ---
  {
    name: 'add [0, 4] + [0, 4]',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          const b = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          return builder.add(a, b);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim reshape ---
  {
    name: 'reshape [4] to [0, 4] (product mismatch)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
          return builder.reshape(input, [0, 4]);
        });
      } catch (e) { /* expected: element count mismatch */ }
    },
  },
  {
    name: 'reshape [0] to []',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0] }, new Float32Array(0));
          return builder.reshape(input, []);
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'reshape [0, 10, 0] (multiple zero dims)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0] }, new Float32Array(0));
          return builder.reshape(input, [0, 10, 0]);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim concat ---
  {
    name: 'concat [0, 4] with [3, 4]',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          const b = builder.constant({ dataType: 'float32', shape: [3, 4] }, randomFloat32([3, 4]));
          return builder.concat([a, b], 0);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim gather ---
  {
    name: 'gather from [0, 4] input',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          const indices = builder.constant({ dataType: 'int32', shape: [1] }, new Int32Array([0]));
          return builder.gather(input, indices, { axis: 0 });
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim reduce ---
  {
    name: 'reduceSum on [0, 4] input',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          return builder.reduceSum(input, { axes: [0] });
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim conv2d ---
  {
    name: 'conv2d with zero batch size',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0, 1, 4, 4] }, new Float32Array(0));
          const filter = builder.constant({ dataType: 'float32', shape: [1, 1, 3, 3] }, filledFloat32([1, 1, 3, 3], 1.0));
          return builder.conv2d(input, filter);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim matmul ---
  {
    name: 'matmul with [0, 4] x [4, 8]',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          const b = builder.constant({ dataType: 'float32', shape: [4, 8] }, randomFloat32([4, 8]));
          return builder.matmul(a, b);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim transpose ---
  {
    name: 'transpose [0, 4]',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          return builder.transpose(input);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim expand ---
  {
    name: 'expand [1, 4] to [0, 4]',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1, 4] }, randomFloat32([1, 4]));
          return builder.expand(input, [0, 4]);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim softmax ---
  {
    name: 'softmax on [0, 4] input',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          return builder.softmax(input, 1);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Zero-dim pooling ---
  {
    name: 'averagePool2d with zero-sized spatial dim',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1, 1, 0, 4] }, new Float32Array(0));
          return builder.averagePool2d(input, { windowDimensions: [1, 1] });
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- Broadcasting with zero dim ---
  {
    name: 'broadcast [0, 4] with [1, 4] (zero vs one)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [0, 4] }, new Float32Array(0));
          const b = builder.constant({ dataType: 'float32', shape: [1, 4] }, randomFloat32([1, 4]));
          return builder.add(a, b);
        });
      } catch (e) { /* expected */ }
    },
  },
  // --- createTensor with zero dim ---
  {
    name: 'createTensor with shape [0]',
    run: async (ctx) => {
      try {
        const tensor = await ctx.createTensor({
          dataType: 'float32', shape: [0],
          readable: true, writable: true,
        });
        ctx.writeTensor(tensor, new Float32Array(0));
        await ctx.readTensor(tensor);
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'createTensor with shape [4, 0, 4]',
    run: async (ctx) => {
      try {
        const tensor = await ctx.createTensor({
          dataType: 'float32', shape: [4, 0, 4],
          readable: true,
        });
        await ctx.readTensor(tensor);
      } catch (e) { /* expected */ }
    },
  },
]);
