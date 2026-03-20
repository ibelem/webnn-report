'use strict';

// Adversarial stress tests for: batchNormalization, instanceNormalization, layerNormalization

for (const opName of ['batchNormalization', 'instanceNormalization', 'layerNormalization']) {
  const tests = [];

  if (opName === 'batchNormalization') {
    tests.push(
      {
        name: 'all NaN input',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 4, 2, 2] }, filledFloat32([1, 4, 2, 2], NaN));
            const mean = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 1));
            return builder.batchNormalization(input, mean, variance);
          });
        },
      },
      {
        name: 'zero variance (division by near-zero)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 4, 2, 2] }, filledFloat32([1, 4, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0));
            return builder.batchNormalization(input, mean, variance, { epsilon: 0 });
          });
        },
      },
      {
        name: 'epsilon = 0 with zero variance',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], 5.0));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 5.0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            return builder.batchNormalization(input, mean, variance, { epsilon: 0 });
          });
        },
      },
      {
        name: 'NaN in mean and variance',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 4, 2, 2] }, filledFloat32([1, 4, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
            const variance = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
            return builder.batchNormalization(input, mean, variance);
          });
        },
      },
      {
        name: 'Infinity scale and bias',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 4, 2, 2] }, filledFloat32([1, 4, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 1));
            const scale = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
            const bias = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -Infinity));
            return builder.batchNormalization(input, mean, variance, { scale, bias });
          });
        },
      },
      {
        name: 'negative variance',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], -1));
            return builder.batchNormalization(input, mean, variance);
          });
        },
      },
      {
        name: 'subnormal variance',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], FLOAT32_MIN_SUBNORMAL));
            return builder.batchNormalization(input, mean, variance);
          });
        },
      },
      // new expanded tests
      {
        name: 'NaN scale only (not in input)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 1));
            const scale = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], NaN));
            return builder.batchNormalization(input, mean, variance, { scale });
          });
        },
      },
      {
        name: 'epsilon = subnormal',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], 1.0));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            return builder.batchNormalization(input, mean, variance, { epsilon: FLOAT32_MIN_SUBNORMAL });
          });
        },
      },
      {
        name: 'subnormal input with zero variance + epsilon=0',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 2, 2] }, filledFloat32([1, 2, 2, 2], FLOAT32_MIN_SUBNORMAL));
            const mean = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            const variance = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], 0));
            return builder.batchNormalization(input, mean, variance, { epsilon: 0 });
          });
        },
      },
    );
  }

  if (opName === 'instanceNormalization') {
    tests.push(
      {
        name: 'all NaN input',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], NaN));
            return builder.instanceNormalization(input);
          });
        },
      },
      {
        name: 'all identical values (zero variance)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], 42.0));
            return builder.instanceNormalization(input, { epsilon: 0 });
          });
        },
      },
      {
        name: 'Infinity scale',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], 1.0));
            const scale = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], Infinity));
            return builder.instanceNormalization(input, { scale });
          });
        },
      },
      {
        name: 'subnormal input',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], FLOAT32_MIN_SUBNORMAL));
            return builder.instanceNormalization(input);
          });
        },
      },
      {
        name: 'nhwc layout with adversarial values',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 4, 4, 2] }, adversarialFloat32([1, 4, 4, 2]));
            return builder.instanceNormalization(input, { layout: 'nhwc' });
          });
        },
      },
      {
        name: 'epsilon = subnormal with zero variance',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], 42.0));
            return builder.instanceNormalization(input, { epsilon: FLOAT32_MIN_SUBNORMAL });
          });
        },
      },
      {
        name: 'NaN scale and bias',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [1, 2, 4, 4] }, filledFloat32([1, 2, 4, 4], 1.0));
            const scale = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], NaN));
            const bias = builder.constant({ dataType: 'float32', shape: [2] }, filledFloat32([2], NaN));
            return builder.instanceNormalization(input, { scale, bias });
          });
        },
      },
    );
  }

  if (opName === 'layerNormalization') {
    tests.push(
      {
        name: 'all NaN input',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], NaN));
            return builder.layerNormalization(input);
          });
        },
      },
      {
        name: 'all identical values (zero variance)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], 42.0));
            return builder.layerNormalization(input, { epsilon: 0 });
          });
        },
      },
      {
        name: 'Infinity scale and NaN bias',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], 1.0));
            const scale = builder.constant({ dataType: 'float32', shape: [3, 4] }, filledFloat32([3, 4], Infinity));
            const bias = builder.constant({ dataType: 'float32', shape: [3, 4] }, filledFloat32([3, 4], NaN));
            return builder.layerNormalization(input, { scale, bias });
          });
        },
      },
      {
        name: 'subnormal input',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], FLOAT32_MIN_SUBNORMAL));
            return builder.layerNormalization(input);
          });
        },
      },
      {
        name: 'mixed adversarial values',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 15] }, adversarialFloat32([2, 15]));
            return builder.layerNormalization(input);
          });
        },
      },
      {
        name: 'epsilon = subnormal with identical values',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], 42.0));
            return builder.layerNormalization(input, { epsilon: FLOAT32_MIN_SUBNORMAL });
          });
        },
      },
      {
        name: 'subnormal input with zero-variance path',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], FLOAT32_MIN_SUBNORMAL));
            return builder.layerNormalization(input, { epsilon: 0 });
          });
        },
      },
      {
        name: 'NaN scale only (parameter-only NaN)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, filledFloat32([2, 3, 4], 1.0));
            const scale = builder.constant({ dataType: 'float32', shape: [3, 4] }, filledFloat32([3, 4], NaN));
            return builder.layerNormalization(input, { scale });
          });
        },
      },
    );
  }

  registerStressTests(opName, tests);
}
