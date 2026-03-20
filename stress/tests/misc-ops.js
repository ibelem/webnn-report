'use strict';

// Adversarial stress tests for: cast, dequantizeLinear, quantizeLinear, prelu, where,
// resample2d, cumulativeSum

// --- cast ---
registerStressTests('cast', [
  {
    name: 'cast NaN float32 to int32',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.cast(input, 'int32');
      });
    },
  },
  {
    name: 'cast Infinity float32 to int32',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.cast(input, 'int32');
      });
    },
  },
  {
    name: 'cast -Infinity float32 to int32',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -Infinity));
        return builder.cast(input, 'int32');
      });
    },
  },
  {
    name: 'cast FLOAT32_MAX to int32 (overflow)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
        return builder.cast(input, 'int32');
      });
    },
  },
  {
    name: 'cast subnormal float32 to int32',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.cast(input, 'int32');
      });
    },
  },
  {
    name: 'cast float32 to uint8 (negative values)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -100.0));
        return builder.cast(input, 'uint8');
      });
    },
  },
  {
    name: 'cast int32 max to float32',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'int32', shape: [4] }, new Int32Array([INT32_MAX, -INT32_MAX, 0, 1]));
        return builder.cast(input, 'float32');
      });
    },
  },
]);

// --- dequantizeLinear ---
registerStressTests('dequantizeLinear', [
  {
    name: 'NaN scale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'int8', shape: [8] }, new Int8Array([0, 1, -1, 127, -128, 64, -64, 0]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.dequantizeLinear(input, scale, zeroPoint);
      });
    },
  },
  {
    name: 'Infinity scale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'int8', shape: [8] }, new Int8Array([0, 1, -1, 127, -128, 64, -64, 0]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([Infinity]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.dequantizeLinear(input, scale, zeroPoint);
      });
    },
  },
  {
    name: 'zero scale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'int8', shape: [8] }, new Int8Array([0, 1, -1, 127, -128, 64, -64, 0]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.dequantizeLinear(input, scale, zeroPoint);
      });
    },
  },
]);

// --- quantizeLinear ---
registerStressTests('quantizeLinear', [
  {
    name: 'NaN input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, filledFloat32([8], NaN));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.5]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zeroPoint);
      });
    },
  },
  {
    name: 'Infinity input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, filledFloat32([8], Infinity));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.5]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zeroPoint);
      });
    },
  },
  {
    name: 'zero scale (division by zero)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, randomFloat32([8]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zeroPoint);
      });
    },
  },
  {
    name: 'subnormal scale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, randomFloat32([8]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([FLOAT32_MIN_SUBNORMAL]));
        const zeroPoint = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zeroPoint);
      });
    },
  },
]);

// --- prelu ---
registerStressTests('prelu', [
  {
    name: 'NaN input with normal slope',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const slope = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], 0.1));
        return builder.prelu(input, slope);
      });
    },
  },
  {
    name: 'normal input with NaN slope',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
        const slope = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.prelu(input, slope);
      });
    },
  },
  {
    name: 'Infinity slope',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], -1.0));
        const slope = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.prelu(input, slope);
      });
    },
  },
  {
    name: 'broadcast scalar slope',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        const slope = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
        return builder.prelu(input, slope);
      });
    },
  },
]);

// --- where ---
registerStressTests('where', [
  {
    name: 'where with NaN trueValue and falseValue',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const condition = builder.constant({ dataType: 'uint8', shape: [4] }, new Uint8Array([1, 0, 1, 0]));
        const trueValue = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
        const falseValue = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
        return builder.where(condition, trueValue, falseValue);
      });
    },
  },
  {
    name: 'where broadcast condition scalar',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const condition = builder.constant({ dataType: 'uint8', shape: [] }, new Uint8Array([1]));
        const trueValue = builder.constant({ dataType: 'float32', shape: [1024] }, adversarialFloat32([1024]));
        const falseValue = builder.constant({ dataType: 'float32', shape: [1024] }, filledFloat32([1024], -Infinity));
        return builder.where(condition, trueValue, falseValue);
      });
    },
  },
  {
    name: 'where all-false condition',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const condition = builder.constant({ dataType: 'uint8', shape: [64] }, new Uint8Array(64).fill(0));
        const trueValue = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        const falseValue = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], FLOAT32_MAX));
        return builder.where(condition, trueValue, falseValue);
      });
    },
  },
]);

// --- resample2d ---
registerStressTests('resample2d', [
  {
    name: 'resample2d NaN input nearest-neighbor',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1, 4, 4] }, filledFloat32([1, 1, 4, 4], NaN));
        return builder.resample2d(input, { sizes: [8, 8] });
      });
    },
  },
  {
    name: 'resample2d Infinity input linear',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1, 4, 4] }, filledFloat32([1, 1, 4, 4], Infinity));
        return builder.resample2d(input, { mode: 'linear', sizes: [8, 8] });
      });
    },
  },
  {
    name: 'resample2d large upscale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1, 2, 2] }, adversarialFloat32([1, 1, 2, 2]));
        return builder.resample2d(input, { sizes: [256, 256] });
      });
    },
    timeout: 20000,
  },
  {
    name: 'resample2d downscale to 1x1',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1, 64, 64] }, adversarialFloat32([1, 1, 64, 64]));
        return builder.resample2d(input, { sizes: [1, 1] });
      });
    },
  },
]);

// --- cumulativeSum ---
registerStressTests('cumulativeSum', [
  {
    name: 'cumulativeSum NaN input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], NaN));
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum Infinity input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [64] }, filledFloat32([64], Infinity));
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum FLOAT32_MAX (accumulation overflow)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1024] }, filledFloat32([1024], FLOAT32_MAX));
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum exclusive + reversed',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.cumulativeSum(input, 0, { exclusive: true, reversed: true });
      });
    },
  },
  {
    name: 'cumulativeSum subnormal input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum NaN at position 0 (propagation test)',
    run: async (ctx) => {
      const data = new Float32Array([NaN, 1, 2, 3, 4, 5, 6, 7]);
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, data);
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum NaN in middle (propagation test)',
    run: async (ctx) => {
      const data = new Float32Array([1, 2, 3, NaN, 5, 6, 7, 8]);
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, data);
        return builder.cumulativeSum(input, 0);
      });
    },
  },
  {
    name: 'cumulativeSum Infinity accumulation',
    run: async (ctx) => {
      const data = new Float32Array([Infinity, 1, -Infinity, 2, Infinity]);
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [5] }, data);
        return builder.cumulativeSum(input, 0);
      });
    },
  },
]);

// --- where: NaN in condition ---
registerStressTests('where', [
  {
    name: 'where with NaN in condition (should it be true or false?)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const condition = builder.constant({ dataType: 'uint8', shape: [4] },
            new Uint8Array([2, 0, 255, 128]));
          const a = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 1.0));
          const b = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 0.0));
          return builder.where(condition, a, b);
        });
      } catch (e) { /* expected if invalid condition type */ }
    },
  },
  {
    name: 'where with NaN in both branches',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const condition = builder.constant({ dataType: 'uint8', shape: [4] },
          new Uint8Array([1, 0, 1, 0]));
        const a = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
        return builder.where(condition, a, b);
      });
    },
  },
  {
    name: 'where with subnormal in branches',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const condition = builder.constant({ dataType: 'uint8', shape: [256] },
          filledUint8([256], 1));
        const a = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], 0));
        return builder.where(condition, a, b);
      });
    },
  },
]);

// --- cast: expanded edge cases ---
registerStressTests('cast', [
  {
    name: 'cast NaN float32 to int8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'int8');
        });
      } catch (e) { /* may throw */ }
    },
  },
  {
    name: 'cast NaN float32 to uint8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* may throw */ }
    },
  },
  {
    name: 'cast Infinity float32 to uint32',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
          return builder.cast(input, 'uint32');
        });
      } catch (e) { /* may throw */ }
    },
  },
  {
    name: 'cast -1 float32 to uint8 (negative → unsigned)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -1));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* may throw */ }
    },
  },
  {
    name: 'cast float32 FLOAT32_MAX to int32 (overflow)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MAX));
          return builder.cast(input, 'int32');
        });
      } catch (e) { /* may throw */ }
    },
  },
  {
    name: 'cast subnormal float32 to float16 and back',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MIN_SUBNORMAL));
          const f16 = builder.cast(input, 'float16');
          return builder.cast(f16, 'float32');
        });
      } catch (e) { /* may throw */ }
    },
  },
]);

// --- dequantizeLinear expanded ---
registerStressTests('dequantizeLinear', [
  {
    name: 'dequantizeLinear with Infinity scale',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'int8', shape: [4] }, new Int8Array([1, 2, 3, 4]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([Infinity]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.dequantizeLinear(input, scale, zp);
      });
    },
  },
]);
