'use strict';

// Adversarial stress tests for: softmax

registerStressTests('softmax', [
  {
    name: 'all NaN input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 64] }, filledFloat32([2, 64], NaN));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'all +Infinity input (division by Infinity)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 64] }, filledFloat32([2, 64], Infinity));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'all -Infinity input (exp(-Inf)=0, division by zero)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 64] }, filledFloat32([2, 64], -Infinity));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'FLOAT32_MAX input (exp overflow)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 64] }, filledFloat32([2, 64], FLOAT32_MAX));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'mixed adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = adversarialFloat32([2, 15]);
        const input = builder.constant({ dataType: 'float32', shape: [2, 15] }, data);
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'softmax axis 0 with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15, 2] }, adversarialFloat32([15, 2]));
        return builder.softmax(input, 0);
      });
    },
  },
  {
    name: 'single-element axis (degenerate softmax)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64, 1] }, filledFloat32([64, 1], NaN));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'subnormal input values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 256] }, filledFloat32([2, 256], FLOAT32_MIN_SUBNORMAL));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'large softmax dimension 8192',
    run: async (ctx) => {
      const shape = [1, 8192];
      await buildAndExecuteWithInputs(ctx, {
        input: { dataType: 'float32', shape, data: randomFloat32(shape) }
      }, (builder, inputs) => builder.softmax(inputs.input, 1));
    },
    timeout: 30000,
  },
  {
    name: 'all identical large values (numerical instability)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1024] }, filledFloat32([1, 1024], 1000.0));
        return builder.softmax(input, 1);
      });
    },
  },
  // --- New: expanded softmax edge cases ---
  {
    name: 'very large negative values (exp underflow → sum=0 → 0/0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 64] }, filledFloat32([1, 64], -1000.0));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'alternating +Inf/-Inf values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = new Float32Array(64);
        for (let i = 0; i < 64; i++) data[i] = i % 2 === 0 ? Infinity : -Infinity;
        const input = builder.constant({ dataType: 'float32', shape: [1, 64] }, data);
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'one +Inf rest -Inf (degenerate distribution)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = filledFloat32([1, 64], -Infinity);
        data[0] = Infinity;
        const input = builder.constant({ dataType: 'float32', shape: [1, 64] }, data);
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'exp overflow boundary (input = 89 near exp float32 limit)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = new Float32Array(64);
        for (let i = 0; i < 64; i++) data[i] = 88 + i * 0.1;
        const input = builder.constant({ dataType: 'float32', shape: [1, 64] }, data);
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'single element softmax axis (trivially 1.0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1024, 1] }, adversarialFloat32([1024, 1]));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: 'subnormal values only (exp(sub) ≈ 1)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [1, 256] },
          filledFloat32([1, 256], FLOAT32_MIN_SUBNORMAL));
        return builder.softmax(input, 1);
      });
    },
  },
  {
    name: '0D scalar softmax attempt',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([NaN]));
          return builder.softmax(input, 0);
        });
      } catch (e) { /* may throw for 1D input */ }
    },
  },
]);
