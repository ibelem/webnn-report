'use strict';

// Adversarial stress tests for graph compilation/optimization bugs.
// Targets: constant folding with special values, algebraic simplification
// failures, dead code elimination side effects with NaN/Infinity.

registerStressTests('graph-optimization', [
  // --- Constant folding with NaN ---
  {
    name: 'constant folding: relu(NaN const) should still be NaN',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.relu(input);
      });
    },
  },
  {
    name: 'constant folding: abs(NaN const) should still be NaN',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.abs(input);
      });
    },
  },
  {
    name: 'constant folding: neg(Infinity const)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.neg(input);
      });
    },
  },
  // --- Algebraic simplification failures ---
  {
    name: '0 * Infinity should be NaN (not optimized to 0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.mul(a, b);
      });
    },
  },
  {
    name: '0 * NaN should be NaN (not optimized to 0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.mul(a, b);
      });
    },
  },
  {
    name: 'x + 0 where x is NaN (should not optimize to x)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.add(a, b);
      });
    },
  },
  {
    name: 'x * 1 where x is NaN (should remain NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
        return builder.mul(a, b);
      });
    },
  },
  {
    name: 'x - x where x is Infinity (should be NaN, not 0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.sub(x, x);
      });
    },
  },
  {
    name: 'x / x where x is 0 (should be NaN, not 1)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.div(x, x);
      });
    },
  },
  {
    name: 'x / x where x is NaN (should be NaN, not 1)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.div(x, x);
      });
    },
  },
  // --- exp(log(x)) chain: should not be optimized to identity ---
  {
    name: 'exp(log(x)) where x is NaN (not identity)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.exp(builder.log(x));
      });
    },
  },
  {
    name: 'exp(log(x)) where x is -1 (log(-1)=NaN → exp(NaN)=NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
        return builder.exp(builder.log(x));
      });
    },
  },
  {
    name: 'exp(log(x)) where x is 0 (log(0)=-Inf → exp(-Inf)=0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0));
        return builder.exp(builder.log(x));
      });
    },
  },
  // --- Dead code with side effects ---
  {
    name: 'unused NaN branch should not affect valid branch',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const valid = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1.0));
        // This NaN branch should be dead but must not corrupt the valid output
        const nanBranch = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const _unused = builder.relu(nanBranch);
        return builder.relu(valid);
      });
    },
  },
  // --- Repeated identity-like operations ---
  {
    name: 'chain of 100 reshapes (should not accumulate error)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, adversarialFloat32([2, 3, 4]));
        for (let i = 0; i < 100; i++) {
          x = builder.reshape(x, [24]);
          x = builder.reshape(x, [2, 3, 4]);
        }
        return x;
      });
    },
    timeout: 30000,
  },
  {
    name: 'double neg should equal original (neg(neg(x)))',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.neg(builder.neg(x));
      });
    },
  },
  {
    name: 'add then sub same value (x + a - a, precision test)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        const a = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 1e20));
        const added = builder.add(x, a);
        return builder.sub(added, a);
      });
    },
  },
]);
