'use strict';

// Adversarial stress tests for: averagePool2d, l2Pool2d, maxPool2d

for (const opName of ['averagePool2d', 'l2Pool2d', 'maxPool2d']) {
  registerStressTests(opName, [
    {
      name: 'all NaN input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            filledFloat32([1, 1, 8, 8], NaN));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'all +Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            filledFloat32([1, 1, 8, 8], Infinity));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'mixed special values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            adversarialFloat32([1, 1, 8, 8]));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'subnormal input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            filledFloat32([1, 1, 8, 8], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'window equals input size (global pooling)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 16, 16] },
            adversarialFloat32([1, 1, 16, 16]));
          return builder[opName](input, { windowDimensions: [16, 16] });
        });
      },
    },
    {
      name: 'large strides',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 64, 64] },
            filledFloat32([1, 1, 64, 64], 1.0));
          return builder[opName](input, { windowDimensions: [3, 3], strides: [32, 32] });
        });
      },
    },
    {
      name: 'large dilations',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 32, 32] },
            filledFloat32([1, 1, 32, 32], 1.0));
          return builder[opName](input, { windowDimensions: [3, 3], dilations: [8, 8] });
        });
      },
    },
    {
      name: 'large padding',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          return builder[opName](input, {
            windowDimensions: [3, 3],
            padding: [50, 50, 50, 50],
          });
        });
      },
    },
    {
      name: 'nhwc layout',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 8, 8, 1] },
            adversarialFloat32([1, 8, 8, 1]));
          return builder[opName](input, {
            windowDimensions: [3, 3],
            layout: 'nhwc',
          });
        });
      },
    },
    {
      name: 'FLOAT32_MAX input (overflow in average/l2)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], FLOAT32_MAX));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    // expanded pooling tests
    {
      name: 'all zeros input (average=0? l2=0?)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            filledFloat32([1, 1, 8, 8], 0));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'interleaved subnormal/normal values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 16, 16] },
            interleavedSubnormalFloat32([1, 1, 16, 16]));
          return builder[opName](input, { windowDimensions: [3, 3] });
        });
      },
    },
    {
      name: 'window larger than input (should error or pad)',
      run: async (ctx) => {
        try {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant(
              { dataType: 'float32', shape: [1, 1, 2, 2] },
              filledFloat32([1, 1, 2, 2], 1.0));
            return builder[opName](input, { windowDimensions: [10, 10] });
          });
        } catch (e) { /* expected */ }
      },
    },
  ]);
}
