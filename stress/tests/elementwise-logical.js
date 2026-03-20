'use strict';

// Adversarial stress tests for: equal, notEqual, greater, greaterOrEqual,
// lesser, lesserOrEqual, logicalNot, logicalAnd, logicalOr, logicalXor,
// isNaN, isInfinite

const kLogicalBinaryOps = [
  'equal', 'notEqual', 'greater', 'greaterOrEqual', 'lesser', 'lesserOrEqual',
  'logicalAnd', 'logicalOr', 'logicalXor',
];

const kLogicalUnaryOps = ['logicalNot', 'isNaN', 'isInfinite'];

for (const opName of kLogicalBinaryOps) {
  registerStressTests(opName, [
    {
      name: 'NaN comparison (both NaN)',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'Infinity vs -Infinity',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -Infinity));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'mixed adversarial values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          const b = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'subnormal comparison',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          const b = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], -FLOAT32_MIN_SUBNORMAL));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: '0D scalar comparison',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
          const b = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0]));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'positive zero vs negative zero',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -0));
          return builder[opName](a, b);
        });
      },
    },
  ]);
}

for (const opName of kLogicalUnaryOps) {
  registerStressTests(opName, [
    {
      name: 'all NaN input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'all Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'mixed adversarial values',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'subnormal input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](input);
        });
      },
    },
    {
      name: '0D scalar',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
          return builder[opName](input);
        });
      },
    },
  ]);
}
