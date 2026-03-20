'use strict';

// Adversarial stress tests for quantization roundtrip fidelity,
// saturation, and boundary conditions.

registerStressTests('quantization-roundtrip', [
  // --- quantize → dequantize roundtrip ---
  {
    name: 'quantize → dequantize roundtrip (should approximate input)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] },
          new Float32Array([0, 0.5, 1.0, -1.0, -0.5, 0.25, -0.25, 0.125]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.01]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        const quantized = builder.quantizeLinear(input, scale, zp);
        const scaleF = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.01]));
        const zpF = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.dequantizeLinear(quantized, scaleF, zpF);
      });
    },
  },
  // --- Saturation at int8 boundaries ---
  {
    name: 'quantizeLinear: FLOAT32_MAX → int8 (saturate to 127)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MAX));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'quantizeLinear: -FLOAT32_MAX → int8 (saturate to -128)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -FLOAT32_MAX));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'quantizeLinear: values at int8 boundary (127.5)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] },
          new Float32Array([127.4, 127.5, 127.6, 128.0]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zp);
      });
    },
  },
  // --- uint8 saturation ---
  {
    name: 'quantizeLinear: negative → uint8 (saturate to 0)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], -100));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'uint8', shape: [] }, new Uint8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'quantizeLinear: 300 → uint8 (saturate to 255)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], 300));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'uint8', shape: [] }, new Uint8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Scale edge cases ---
  {
    name: 'quantizeLinear: scale = subnormal',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
        const scale = builder.constant({ dataType: 'float32', shape: [] },
          new Float32Array([FLOAT32_MIN_SUBNORMAL]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
        return builder.quantizeLinear(input, scale, zp);
      });
    },
  },
  {
    name: 'dequantizeLinear: scale = NaN',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'int8', shape: [4] }, new Int8Array([1, 2, 3, 4]));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
          const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
          return builder.dequantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  // --- Zero point edge cases ---
  {
    name: 'quantizeLinear: zeroPoint = 127 (int8 max)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] },
          new Float32Array([0, 1, -1, 0.5]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.01]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([127]));
        return builder.quantizeLinear(input, scale, zp);
      });
    },
  },
  {
    name: 'quantizeLinear: zeroPoint = -128 (int8 min)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] },
          new Float32Array([0, 1, -1, 0.5]));
        const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([0.01]));
        const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([-128]));
        return builder.quantizeLinear(input, scale, zp);
      });
    },
  },
  // --- NaN / Infinity in quantize input ---
  {
    name: 'quantizeLinear: NaN input',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], NaN));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
  {
    name: 'quantizeLinear: Infinity input',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
          const scale = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([1.0]));
          const zp = builder.constant({ dataType: 'int8', shape: [] }, new Int8Array([0]));
          return builder.quantizeLinear(input, scale, zp);
        });
      } catch (e) { /* implementation-defined */ }
    },
  },
]);
