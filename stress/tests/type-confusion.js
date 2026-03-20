'use strict';

// Adversarial stress tests for type confusion and cast edge cases.
// Targets: integer overflow wrapping, negative→unsigned, NaN→integer,
// float16 precision loss, cross-type interactions.

registerStressTests('type-confusion', [
  // --- NaN to integer types ---
  {
    name: 'cast float32 NaN → int32',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'int32');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 NaN → int8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'int8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 NaN → uint8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 NaN → uint32',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          return builder.cast(input, 'uint32');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Infinity to integer types ---
  {
    name: 'cast float32 +Infinity → int32',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
          return builder.cast(input, 'int32');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 -Infinity → int8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -Infinity));
          return builder.cast(input, 'int8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 +Infinity → uint8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Negative values to unsigned ---
  {
    name: 'cast float32 -1 → uint8 (wrapping?)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -1));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 -128 → uint8',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -128));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast int32 -100 → uint32 (sign extension)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'int32', shape: [4] }, filledInt32([4], -100));
          return builder.cast(input, 'uint32');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Integer overflow wrapping ---
  {
    name: 'cast float32 FLOAT32_MAX → int8 (should saturate to 127)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MAX));
          return builder.cast(input, 'int8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast float32 -FLOAT32_MAX → uint8 (should saturate to 0)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -FLOAT32_MAX));
          return builder.cast(input, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'cast int32 INT32_MAX → int8 (overflow wrapping)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'int32', shape: [4] }, filledInt32([4], INT32_MAX));
          return builder.cast(input, 'int8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Float16 roundtrip ---
  {
    name: 'float32 → float16 → float32 NaN payload preservation',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          const f16 = builder.cast(input, 'float16');
          return builder.cast(f16, 'float32');
        });
      } catch (e) { /* may not support float16 */ }
    },
  },
  {
    name: 'float32 → float16 → float32 Infinity preservation',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
          const f16 = builder.cast(input, 'float16');
          return builder.cast(f16, 'float32');
        });
      } catch (e) { /* may not support float16 */ }
    },
  },
  {
    name: 'float32 → float16 → float32 subnormal (precision loss)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MIN_SUBNORMAL));
          const f16 = builder.cast(input, 'float16');
          return builder.cast(f16, 'float32');
        });
      } catch (e) { /* may not support float16 */ }
    },
  },
  {
    name: 'float32 65504+ → float16 (overflow to Inf in float16)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 100000));
          const f16 = builder.cast(input, 'float16');
          return builder.cast(f16, 'float32');
        });
      } catch (e) { /* may not support float16 */ }
    },
  },
  // --- Mixed type binary operations ---
  {
    name: 'int32 boundary values through cast chain',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'int32', shape: [4] },
            new Int32Array([INT32_MAX, -INT32_MAX - 1, 0, -1]));
          const f32 = builder.cast(input, 'float32');
          return builder.cast(f32, 'int32');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'uint8 boundary values through float32 roundtrip',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'uint8', shape: [4] },
            new Uint8Array([0, 127, 128, 255]));
          const f32 = builder.cast(input, 'float32');
          return builder.cast(f32, 'uint8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'int8 boundary values through float32 roundtrip',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'int8', shape: [4] },
            new Int8Array([-128, -1, 0, 127]));
          const f32 = builder.cast(input, 'float32');
          return builder.cast(f32, 'int8');
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
]);
