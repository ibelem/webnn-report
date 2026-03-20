'use strict';

// Adversarial stress tests for: add, sub, mul, div, max, min, pow

const kElementwiseBinaryOps = ['add', 'sub', 'mul', 'div', 'max', 'min', 'pow'];

for (const opName of kElementwiseBinaryOps) {
  const tests = [
    // --- NaN / Infinity handling ---
    {
      name: 'NaN op NaN',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'Infinity op -Infinity',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -Infinity));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'NaN op Infinity',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: 'mixed adversarial special values both operands',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          const b = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
          return builder[opName](a, b);
        });
      },
    },
    // --- Zero handling ---
    {
      name: 'zero op zero',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
          return builder[opName](a, b);
        });
      },
    },
    // --- Subnormal handling ---
    {
      name: 'subnormal op subnormal',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          const b = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
          return builder[opName](a, b);
        });
      },
    },
    // --- Extreme value overflow ---
    {
      name: 'FLOAT32_MAX op FLOAT32_MAX',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
          return builder[opName](a, b);
        });
      },
    },
    {
      name: '-FLOAT32_MAX op FLOAT32_MAX',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -FLOAT32_MAX));
          const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
          return builder[opName](a, b);
        });
      },
    },
    // --- Broadcasting: scalar vs large tensor ---
    {
      name: 'broadcast scalar with large tensor',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
          const b = builder.constant({ dataType: 'float32', shape: [1024] }, randomFloat32([1024]));
          return builder[opName](a, b);
        });
      },
    },
    // --- 0D scalars ---
    {
      name: '0D scalar op 0D scalar',
      run: async (ctx) => {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([Infinity]));
          const b = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([-Infinity]));
          return builder[opName](a, b);
        });
      },
    },
    // --- Large tensor ---
    {
      name: 'large 1D tensor 4M elements',
      run: async (ctx) => {
        const shape = [4 * 1024 * 1024];
        await buildAndExecuteWithInputs(ctx, {
          a: { dataType: 'float32', shape, data: filledFloat32(shape, 1.0) },
          b: { dataType: 'float32', shape, data: filledFloat32(shape, 2.0) },
        }, (builder, inputs) => builder[opName](inputs.a, inputs.b));
      },
      timeout: 30000,
    },
    // --- Repeated dispatch ---
    {
      name: 'repeated dispatch x50',
      run: async (ctx) => {
        const shape = [256];
        const builder = new MLGraphBuilder(ctx);
        const a = builder.input('a', { dataType: 'float32', shape });
        const b = builder.input('b', { dataType: 'float32', shape });
        const output = builder[opName](a, b);
        const graph = await builder.build({ output });
        const tA = await ctx.createTensor({ dataType: 'float32', shape, writable: true });
        const tB = await ctx.createTensor({ dataType: 'float32', shape, writable: true });
        const tOut = await ctx.createTensor({ dataType: 'float32', shape, readable: true });
        for (let i = 0; i < 50; i++) {
          ctx.writeTensor(tA, filledFloat32(shape, i));
          ctx.writeTensor(tB, filledFloat32(shape, -i));
          ctx.dispatch(graph, { a: tA, b: tB }, { output: tOut });
          await ctx.readTensor(tOut);
        }
      },
      timeout: 30000,
    },
  ];

  // div-specific: division by zero
  if (opName === 'div') {
    tests.push(
      {
        name: 'division by zero (float32)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
            return builder.div(a, b);
          });
        },
      },
      {
        name: 'zero divided by zero',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
            return builder.div(a, b);
          });
        },
      },
      {
        name: 'Infinity divided by Infinity',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
            return builder.div(a, b);
          });
        },
      },
      {
        name: 'division by subnormal',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
            return builder.div(a, b);
          });
        },
      },
    );
  }

  // pow-specific
  if (opName === 'pow') {
    tests.push(
      {
        name: 'base 0 exponent -1 (1/0 = Inf)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1));
            return builder.pow(a, b);
          });
        },
      },
      {
        name: 'huge exponent causing overflow',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 2.0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 128));
            return builder.pow(a, b);
          });
        },
      },
      {
        name: 'negative base fractional exponent (NaN result)',
        run: async (ctx) => {
          await buildAndExecute(ctx, (builder) => {
            const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -2.0));
            const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0.5));
            return builder.pow(a, b);
          });
        },
      },
    );
  }

  registerStressTests(opName, tests);
}

// --- Additional cross-cutting binary tests ---
registerStressTests('div', [
  {
    name: 'division by negative zero',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -0));
        return builder.div(a, b);
      });
    },
  },
  {
    name: 'division by subnormal (result → huge)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.div(a, b);
      });
    },
  },
  {
    name: 'NaN divided by zero',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.div(a, b);
      });
    },
  },
]);

registerStressTests('pow', [
  {
    name: 'base NaN exponent 0 (should be 1 by IEEE)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.pow(a, b);
      });
    },
  },
  {
    name: 'base 1 exponent NaN (should be 1 by IEEE)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.pow(a, b);
      });
    },
  },
  {
    name: 'base 0 exponent 0 (implementation defined)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.pow(a, b);
      });
    },
  },
]);

registerStressTests('mul', [
  {
    name: '0 * Infinity (should be NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.mul(a, b);
      });
    },
  },
  {
    name: 'subnormal * subnormal → underflow to zero',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        return builder.mul(a, b);
      });
    },
  },
]);

registerStressTests('sub', [
  {
    name: 'Infinity - Infinity (should be NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.sub(a, b);
      });
    },
  },
]);

registerStressTests('add', [
  {
    name: '-Infinity + Infinity (should be NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -Infinity));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.add(a, b);
      });
    },
  },
  {
    name: 'large magnitude difference (precision loss)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1e20));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1e-20));
        return builder.add(a, b);
      });
    },
  },
]);
