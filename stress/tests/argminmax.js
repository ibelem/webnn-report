'use strict';

// Adversarial stress tests for: argMin, argMax

for (const opName of ['argMin', 'argMax']) {
  registerStressTests(opName, [
    {
      name: 'all NaN input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 16] }, filledFloat32([4, 16], NaN));
          return builder[opName](input, 1);
        });
      },
    },
    {
      name: 'all Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 16] }, filledFloat32([4, 16], Infinity));
          return builder[opName](input, 1);
        });
      },
    },
    {
      name: 'mixed adversarial values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          return builder[opName](input, 0);
        });
      },
    },
    {
      name: 'subnormal values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input, 0);
        });
      },
    },
    {
      name: '0D scalar input',
      run: async (ctx) => {
        try {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
            return builder[opName](input, 0);
          });
        } catch (e) { /* may not support 0D input for argMin/Max */ }
      },
    },
    {
      name: 'all identical values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1024] }, filledFloat32([1024], 42.0));
          return builder[opName](input, 0);
        });
      },
    },
    {
      name: 'keepDimensions with NaN',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4, 16] }, filledFloat32([4, 16], NaN));
          return builder[opName](input, 1, { keepDimensions: true });
        });
      },
    },
    // expanded argmin/max tests
    {
      name: 'mixed NaN and Infinity values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          return builder[opName](input, 0);
        });
      },
    },
    {
      name: 'subnormal values (distinction from zero)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const data = new Float32Array([
            0, FLOAT32_MIN_SUBNORMAL, -FLOAT32_MIN_SUBNORMAL,
            0, FLOAT32_MIN_SUBNORMAL, -FLOAT32_MIN_SUBNORMAL,
          ]);
          const input = builder.constant({ dataType: 'float32', shape: [6] }, data);
          return builder[opName](input, 0);
        });
      },
    },
    {
      name: 'positive zero vs negative zero',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const data = new Float32Array([0, -0, 0, -0]);
          const input = builder.constant({ dataType: 'float32', shape: [4] }, data);
          return builder[opName](input, 0);
        });
      },
    },
  ]);
}
