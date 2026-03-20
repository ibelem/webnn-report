'use strict';

// Adversarial stress tests for: reduceL1, reduceL2, reduceLogSum, reduceLogSumExp,
// reduceMax, reduceMean, reduceMin, reduceProduct, reduceSum, reduceSumSquare

const kReduceOps = [
  'reduceL1', 'reduceL2', 'reduceLogSum', 'reduceLogSumExp',
  'reduceMax', 'reduceMean', 'reduceMin', 'reduceProduct',
  'reduceSum', 'reduceSumSquare',
];

for (const opName of kReduceOps) {
  registerStressTests(opName, [
    {
      name: 'all NaN input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 16] }, filledFloat32([4, 16], NaN));
          return builder[opName](input, { axes: [1] });
        });
      },
    },
    {
      name: 'all +Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 16] }, filledFloat32([4, 16], Infinity));
          return builder[opName](input, { axes: [1] });
        });
      },
    },
    {
      name: 'mixed adversarial values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 15] }, adversarialFloat32([4, 15]));
          return builder[opName](input, { axes: [1] });
        });
      },
    },
    {
      name: 'FLOAT32_MAX input (overflow in sum)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1024] }, filledFloat32([1024], FLOAT32_MAX));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'subnormal input values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'reduce all axes (keepDimensions=true)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, adversarialFloat32([2, 3, 4]));
          return builder[opName](input, { axes: [0, 1, 2], keepDimensions: true });
        });
      },
    },
    {
      name: 'reduce all axes (keepDimensions=false)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, adversarialFloat32([2, 3, 4]));
          return builder[opName](input, { axes: [0, 1, 2], keepDimensions: false });
        });
      },
    },
    {
      name: '0D scalar input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'large reduction axis 16384 elements',
      run: async (ctx) => {
        const shape = [1, 16384];
        await buildAndExecuteWithInputs(ctx, {
          input: { dataType: 'float32', shape, data: filledFloat32(shape, 1.0) }
        }, (builder, inputs) => builder[opName](inputs.input, { axes: [1] }));
      },
      timeout: 30000,
    },
    // --- New: expanded reduction edge cases ---
    {
      name: 'all zeros input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], 0));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'subnormal accumulation chain (1000 values)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1000] },
            filledFloat32([1000], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'interleaved subnormal/normal reduce',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [256] },
            interleavedSubnormalFloat32([256]));
          return builder[opName](input);
        });
      },
    },
    {
      name: '-FLOAT32_MAX input (negative overflow)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1024] },
            filledFloat32([1024], -FLOAT32_MAX));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'single element reduce',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([NaN]));
          return builder[opName](input);
        });
      },
    },
  ]);
}
