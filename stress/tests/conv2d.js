'use strict';

// Adversarial stress tests for: conv2d, convTranspose2d

for (const opName of ['conv2d', 'convTranspose2d']) {
  registerStressTests(opName, [
    {
      name: 'NaN input data',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], NaN));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'NaN filter weights',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, NaN));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'Infinity input data',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], Infinity));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'subnormal input + filter',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 8, 8] },
            filledFloat32([1, 1, 8, 8], FLOAT32_MIN_SUBNORMAL));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'FLOAT32_MAX values (accumulation overflow)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], FLOAT32_MAX));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, FLOAT32_MAX));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'large number of groups',
      run: async (ctx) => {
        const groups = 64;
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, groups, 4, 4] },
            filledFloat32([1, groups, 4, 4], 1.0));
          const filterShape = opName === 'conv2d'
            ? [groups, 1, 3, 3]
            : [groups, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter, { groups });
        });
      },
    },
    {
      name: 'large dilation values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 32, 32] },
            filledFloat32([1, 1, 32, 32], 1.0));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter, { dilations: [8, 8] });
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
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter, { strides: [32, 32] });
        });
      },
    },
    {
      name: 'large padding values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter, { padding: [100, 100, 100, 100] });
        });
      },
    },
    {
      name: 'NaN bias',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          const bias = builder.constant(
            { dataType: 'float32', shape: [1] },
            new Float32Array([NaN]));
          return builder[opName](input, filter, { bias });
        });
      },
    },
    {
      name: 'nhwc layout with adversarial values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 4, 4, 1] },
            adversarialFloat32([1, 4, 4, 1]));
          const filterLayout = opName === 'conv2d' ? 'ohwi' : 'ohwi';
          const filterShape = opName === 'conv2d' ? [1, 3, 3, 1] : [1, 3, 3, 1];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter, {
            inputLayout: 'nhwc',
            filterLayout,
          });
        });
      },
    },
    // expanded conv2d tests
    {
      name: 'subnormal input + subnormal filter (accumulation underflow)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 16, 16] },
            filledFloat32([1, 1, 16, 16], FLOAT32_MIN_SUBNORMAL));
          const filterShape = opName === 'conv2d' ? [1, 1, 5, 5] : [1, 1, 5, 5];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'interleaved subnormal/normal input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 16, 16] },
            interleavedSubnormalFloat32([1, 1, 16, 16]));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          return builder[opName](input, filter);
        });
      },
    },
    {
      name: 'Infinity bias with normal input/filter',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          const filterShape = opName === 'conv2d' ? [1, 1, 3, 3] : [1, 1, 3, 3];
          const filter = builder.constant(
            { dataType: 'float32', shape: filterShape },
            filledFloat32(filterShape, 1.0));
          const bias = builder.constant(
            { dataType: 'float32', shape: [1] },
            new Float32Array([Infinity]));
          return builder[opName](input, filter, { bias });
        });
      },
    },
  ]);
}
