'use strict';

// Adversarial stress tests for: clamp, elu, gelu, hardSigmoid, hardSwish,
// leakyRelu, linear, relu, sigmoid, softplus, softsign, tanh

const kActivationOps = [
  'clamp', 'elu', 'gelu', 'hardSigmoid', 'hardSwish',
  'leakyRelu', 'linear', 'relu', 'sigmoid', 'softplus', 'softsign', 'tanh',
];

for (const opName of kActivationOps) {
  const tests = [
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
      name: 'all +Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'all -Infinity input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -Infinity));
          return builder[opName](input);
        });
      },
    },
    {
      name: 'mixed special values',
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
      name: 'FLOAT32_MAX input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
          return builder[opName](input);
        });
      },
    },
    {
      name: '-FLOAT32_MAX input',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -FLOAT32_MAX));
          return builder[opName](input);
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
      name: 'large 1D tensor 4M elements',
      run: async (ctx) => {
        const shape = [4 * 1024 * 1024];
        await buildAndExecuteWithInputs(ctx, {
          input: { dataType: 'float32', shape, data: filledFloat32(shape, 1.0) }
        }, (builder, inputs) => builder[opName](inputs.input));
      },
      timeout: 30000,
    },
    {
      name: 'repeated dispatch x50',
      run: async (ctx) => {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', { dataType: 'float32', shape: [256] });
        const output = builder[opName](input);
        const graph = await builder.build({ output });
        const tI = await ctx.createTensor({ dataType: 'float32', shape: [256], writable: true });
        const tO = await ctx.createTensor({ dataType: 'float32', shape: [256], readable: true });
        for (let i = 0; i < 50; i++) {
          ctx.writeTensor(tI, adversarialFloat32([256]));
          ctx.dispatch(graph, { input: tI }, { output: tO });
          await ctx.readTensor(tO);
        }
      },
      timeout: 30000,
    },
  ];

  // clamp-specific: NaN min/max values
  if (opName === 'clamp') {
    tests.push(
      {
        name: 'clamp with NaN minValue',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, randomFloat32([64]));
            return builder.clamp(input, { minValue: NaN, maxValue: 1.0 });
          });
        },
      },
      {
        name: 'clamp with Infinity maxValue',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, randomFloat32([64]));
            return builder.clamp(input, { minValue: -Infinity, maxValue: Infinity });
          });
        },
      },
      {
        name: 'clamp minValue > maxValue',
        run: async (ctx) => {
          try {
            await buildAndExecute(ctx, (builder) => {
              const input = builder.constant({ dataType: 'float32', shape: [64] }, randomFloat32([64]));
              return builder.clamp(input, { minValue: 10.0, maxValue: 1.0 });
            });
          } catch (e) { /* expected */ }
        },
      },
    );
  }

  // elu-specific: adversarial alpha
  if (opName === 'elu') {
    tests.push(
      {
        name: 'elu with alpha = Infinity',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
            return builder.elu(input, { alpha: Infinity });
          });
        },
      },
      {
        name: 'elu with alpha = NaN',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
            return builder.elu(input, { alpha: NaN });
          });
        },
      },
      {
        name: 'elu with alpha = 0',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
            return builder.elu(input, { alpha: 0 });
          });
        },
      },
    );
  }

  // leakyRelu-specific
  if (opName === 'leakyRelu') {
    tests.push(
      {
        name: 'leakyRelu with alpha = Infinity',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
            return builder.leakyRelu(input, { alpha: Infinity });
          });
        },
      },
      {
        name: 'leakyRelu with alpha = FLOAT32_MAX',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
            return builder.leakyRelu(input, { alpha: FLOAT32_MAX });
          });
        },
      },
    );
  }

  registerStressTests(opName, tests);
}

// --- New: expanded activation edge cases ---

// softsign boundary: x/(1+|x|) near zero
registerStressTests('softsign', [
  {
    name: 'softsign with subnormal input (x/(1+|subnormal|))',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [256] },
          filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        return builder.softsign(input);
      });
    },
  },
  {
    name: 'softsign with -0 input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], -0));
        return builder.softsign(input);
      });
    },
  },
]);

// softplus boundary: log(1+exp(x)) for extreme values
registerStressTests('softplus', [
  {
    name: 'softplus with very large negative (log(1+exp(-1000)) → log(1) = 0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], -1000));
        return builder.softplus(input);
      });
    },
  },
  {
    name: 'softplus at exp overflow boundary (x=89)',
    run: async (ctx) => {
      const data = new Float32Array(64);
      for (let i = 0; i < 64; i++) data[i] = 88 + i * 0.1;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, data);
        return builder.softplus(input);
      });
    },
  },
]);

// sigmoid boundary at subnormals
registerStressTests('sigmoid', [
  {
    name: 'sigmoid with subnormal input (1/(1+exp(-subnormal)))',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [256] },
          filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        return builder.sigmoid(input);
      });
    },
  },
]);

// clamp expanded: edge parameter combinations
registerStressTests('clamp', [
  {
    name: 'clamp with NaN maxValue',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, randomFloat32([64]));
          return builder.clamp(input, { minValue: 0.0, maxValue: NaN });
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'clamp with both NaN min and max',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [64] }, randomFloat32([64]));
          return builder.clamp(input, { minValue: NaN, maxValue: NaN });
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'clamp with subnormal boundaries',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [256] },
          interleavedSubnormalFloat32([256]));
        return builder.clamp(input, { minValue: FLOAT32_MIN_SUBNORMAL, maxValue: FLOAT32_MIN_NORMAL });
      });
    },
  },
]);

// linear: alpha * x + beta edge cases
registerStressTests('linear', [
  {
    name: 'linear with alpha=Infinity, beta=-Infinity',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
        return builder.linear(input, { alpha: Infinity, beta: -Infinity });
      });
    },
  },
  {
    name: 'linear with alpha=0 and NaN input (0*NaN=NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.linear(input, { alpha: 0, beta: 0 });
      });
    },
  },
]);
