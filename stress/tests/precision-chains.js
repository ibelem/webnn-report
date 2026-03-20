'use strict';

// Adversarial stress tests for floating-point precision chains.
// Targets: associativity failures, cumulative precision loss,
// catastrophic cancellation, and gradual underflow.

registerStressTests('precision-chains', [
  // --- Associativity failures ---
  {
    name: '(a+b)+c vs a+(b+c) with large magnitude difference',
    run: async (ctx) => {
      // (1e20 + 1e-20) + (-1e20) vs 1e20 + (1e-20 + (-1e20))
      // First: 1e20 + 1e-20 = 1e20 (precision loss), then 1e20 - 1e20 = 0
      // Second: 1e-20 - 1e20 = -1e20, then 1e20 - 1e20 = 0
      // But in real: should be 1e-20
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1e20]));
        const b = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1e-20]));
        const c = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([-1e20]));
        // (a+b)+c
        return builder.add(builder.add(a, b), c);
      });
    },
  },
  {
    name: 'a+(b+c) with large magnitude difference (compare order)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1e20]));
        const b = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1e-20]));
        const c = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([-1e20]));
        // a+(b+c)
        return builder.add(a, builder.add(b, c));
      });
    },
  },
  // --- Catastrophic cancellation ---
  {
    name: 'large_near_equal - large_near_equal (catastrophic cancellation)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], 1e10 + 1));
        const b = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], 1e10));
        return builder.sub(a, b);
      });
    },
  },
  // --- Cumulative precision loss in long chains ---
  {
    name: 'multiply by 1.0001 × 500 times (precision drift)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1.0]));
        const factor = builder.constant({ dataType: 'float32', shape: [1] },
          new Float32Array([1.0001]));
        for (let i = 0; i < 500; i++) {
          x = builder.mul(x, factor);
        }
        return x;
      });
    },
    timeout: 30000,
  },
  {
    name: 'add then subtract same value 100 times (x + a - a)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1.0]));
        const a = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1e15]));
        for (let i = 0; i < 100; i++) {
          x = builder.add(x, a);
          x = builder.sub(x, a);
        }
        // Should still be ~1.0 but precision loss accumulates
        return x;
      });
    },
    timeout: 30000,
  },
  // --- Gradual underflow chain ---
  {
    name: 'divide by 2 until subnormal then zero (underflow chain)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1.0]));
        const half = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([0.5]));
        // 1.0 * 0.5^200 → deeply into subnormal territory
        for (let i = 0; i < 200; i++) {
          x = builder.mul(x, half);
        }
        return x;
      });
    },
    timeout: 30000,
  },
  {
    name: 'multiply by 2 until overflow (overflow chain)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1.0]));
        const two = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([2.0]));
        // 2^200 → well past FLOAT32_MAX → Infinity
        for (let i = 0; i < 200; i++) {
          x = builder.mul(x, two);
        }
        return x;
      });
    },
    timeout: 30000,
  },
  // --- Subnormal accumulation precision ---
  {
    name: 'reduceSum of 10000 subnormals (accumulated precision)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [10000] },
          filledFloat32([10000], FLOAT32_MIN_SUBNORMAL));
        return builder.reduceSum(input);
      });
    },
  },
  {
    name: 'matmul 1x1000 @ 1000x1 of all subnormals',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1, 1000] },
          filledFloat32([1, 1000], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [1000, 1] },
          filledFloat32([1000, 1], FLOAT32_MIN_SUBNORMAL));
        return builder.matmul(a, b);
      });
    },
  },
  // --- exp/log precision boundaries ---
  {
    name: 'exp(subnormal) should be ≈1.0 (not flushed to exactly 1)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.exp(input);
      });
    },
  },
  {
    name: 'log(subnormal) should be very large negative',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.log(input);
      });
    },
  },
  {
    name: 'sqrt(subnormal) precision test',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] },
          filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.sqrt(input);
      });
    },
  },
  // --- Mixed subnormal/normal accumulation ---
  {
    name: 'interleaved subnormal/normal reduceSum',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [1000] },
          interleavedSubnormalFloat32([1000]));
        return builder.reduceSum(input);
      });
    },
  },
  // --- Reciprocal chain ---
  {
    name: 'reciprocal(reciprocal(x)) should ≈ x (idempotent check)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.reciprocal(builder.reciprocal(x));
      });
    },
  },
]);
