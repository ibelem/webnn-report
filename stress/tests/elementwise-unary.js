'use strict';

// Adversarial stress tests for: abs, ceil, cos, erf, exp, floor, identity,
// log, neg, reciprocal, roundEven, sin, sign, sqrt, tan

const kElementwiseUnaryOps = [
  'abs', 'ceil', 'cos', 'erf', 'exp', 'floor', 'identity',
  'log', 'neg', 'reciprocal', 'roundEven', 'sin', 'sign', 'sqrt', 'tan',
];

for (const opName of kElementwiseUnaryOps) {
  registerStressTests(opName, [
    // --- NaN / Infinity handling ---
    {
      name: 'all NaN input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [64] },
            filledFloat32([64], NaN));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'all +Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [64] },
            filledFloat32([64], Infinity));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'all -Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [64] },
            filledFloat32([64], -Infinity));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'mixed special values (NaN, Inf, subnormals)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [15] },
            adversarialFloat32([15]));
          return builder[opName](input);
        });
      },
    },
    // --- Subnormal float handling (triggers slow microcode paths) ---
    {
      name: 'subnormal float32 input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [256] },
            filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'negative subnormal float32 input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [256] },
            filledFloat32([256], -FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input);
        });
      },
    },
    // --- Zero handling ---
    {
      name: 'all zeros input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [128] },
            filledFloat32([128], 0));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'negative zero input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [128] },
            filledFloat32([128], -0));
          return builder[opName](input);
        });
      },
    },
    // --- Extreme values ---
    {
      name: 'FLOAT32_MAX input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [64] },
            filledFloat32([64], FLOAT32_MAX));
          return builder[opName](input);
        });
      },
    },
    {
      name: '-FLOAT32_MAX input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [64] },
            filledFloat32([64], -FLOAT32_MAX));
          return builder[opName](input);
        });
      },
    },
    // --- Large tensor (shape overflow boundary) ---
    {
      name: 'large 1D tensor near element count limit',
      run: async (ctx) => {
        // Use a size that's large but won't OOM — 16M elements
        const shape = [16 * 1024 * 1024];
        await buildAndExecuteWithInputs(ctx, {
          input: { dataType: 'float32', shape, data: filledFloat32(shape, 1.0) }
        }, (builder, inputs) => builder[opName](inputs.input));
      },
      timeout: 30000,
    },
    // --- 0D scalar ---
    {
      name: '0D scalar input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [] },
            new Float32Array([42.0]));
          return builder[opName](input);
        });
      },
    },
    // --- High-rank tensor ---
    {
      name: '8D tensor input',
      run: async (ctx) => {
        const shape = [2, 1, 2, 1, 2, 1, 2, 1];
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape },
            adversarialFloat32(shape));
          return builder[opName](input);
        });
      },
    },
    // --- Dimension with size 0 ---
    {
      name: 'zero-sized dimension',
      run: async (ctx) => {
        try {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant(
              { dataType: 'float32', shape: [0] },
              new Float32Array(0));
            return builder[opName](input);
          });
        } catch (e) {
          // Expected: should throw, not crash
        }
      },
    },
    // --- Repeated dispatch (resource leak detection) ---
    {
      name: 'repeated dispatch x100 for leak detection',
      run: async (ctx) => {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', { dataType: 'float32', shape: [256] });
        const output = builder[opName](input);
        const graph = await builder.build({ output });
        const inputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], writable: true });
        const outputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], readable: true });
        try {
          for (let i = 0; i < 100; i++) {
            ctx.writeTensor(inputTensor, filledFloat32([256], i * 0.01));
            ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
            await ctx.readTensor(outputTensor);
          }
        } finally {
          inputTensor.destroy();
          outputTensor.destroy();
          graph.destroy();
        }
      },
      timeout: 30000,
    },
    // --- Gradual subnormal walk ---
    {
      name: 'gradual underflow through subnormal range',
      run: async (ctx) => {
        const data = new Float32Array(64);
        for (let i = 0; i < 64; i++) {
          data[i] = FLOAT32_MIN_NORMAL * Math.pow(0.5, i);
        }
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, data);
          return builder[opName](input);
        });
      },
    },
    // --- Interleaved subnormal/normal ---
    {
      name: 'interleaved subnormal and normal values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [256] },
            interleavedSubnormalFloat32([256]));
          return builder[opName](input);
        });
      },
    },
  ]);
}
