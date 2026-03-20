'use strict';

// Adversarial stress tests for: matmul, gemm

registerStressTests('matmul', [
  {
    name: 'NaN x NaN matmul',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'Infinity x Infinity matmul',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], Infinity));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], Infinity));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'FLOAT32_MAX accumulation overflow',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1, 1024] }, filledFloat32([1, 1024], FLOAT32_MAX));
        const b = builder.constant({ dataType: 'float32', shape: [1024, 1] }, filledFloat32([1024, 1], 2.0));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'subnormal matrix elements',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [16, 16] }, filledFloat32([16, 16], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [16, 16] }, filledFloat32([16, 16], FLOAT32_MIN_SUBNORMAL));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'mixed adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 15] }, adversarialFloat32([4, 15]));
        const b = builder.constant({ dataType: 'float32', shape: [15, 4] }, adversarialFloat32([15, 4]));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'large matrix multiplication 512x512',
    run: async (ctx) => {
      const shape = [512, 512];
      await buildAndExecuteWithInputs(ctx, {
        a: { dataType: 'float32', shape, data: randomFloat32(shape) },
        b: { dataType: 'float32', shape, data: randomFloat32(shape) },
      }, (builder, inputs) => builder.matmul(inputs.a, inputs.b));
    },
    timeout: 30000,
  },
  {
    name: 'batch matmul with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [8, 4, 4] }, adversarialFloat32([8, 4, 4]));
        const b = builder.constant({ dataType: 'float32', shape: [8, 4, 4] }, adversarialFloat32([8, 4, 4]));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: '1D x 1D (dot product)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MAX));
        const b = builder.constant({ dataType: 'float32', shape: [256] }, filledFloat32([256], FLOAT32_MAX));
        return builder.matmul(a, b);
      });
    },
  },
  // expanded matmul tests
  {
    name: 'subnormal dot product large K (underflow in accumulation)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1, 1024] }, filledFloat32([1, 1024], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [1024, 1] }, filledFloat32([1024, 1], FLOAT32_MIN_SUBNORMAL));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: '0 * Infinity in dot product (NaN propagation)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [1, 4] },
          new Float32Array([0, Infinity, 0, Infinity]));
        const b = builder.constant({ dataType: 'float32', shape: [4, 1] },
          new Float32Array([Infinity, 0, Infinity, 0]));
        return builder.matmul(a, b);
      });
    },
  },
  {
    name: 'interleaved subnormal/normal matrix multiply',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [16, 16] }, interleavedSubnormalFloat32([16, 16]));
        const b = builder.constant({ dataType: 'float32', shape: [16, 16] }, interleavedSubnormalFloat32([16, 16]));
        return builder.matmul(a, b);
      });
    },
  },
]);

registerStressTests('gemm', [
  {
    name: 'NaN inputs',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        return builder.gemm(a, b);
      });
    },
  },
  {
    name: 'alpha=Infinity, beta=NaN',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        const c = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        return builder.gemm(a, b, { c, alpha: Infinity, beta: NaN });
      });
    },
  },
  {
    name: 'alpha=0, beta=0 with NaN c',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        const c = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        return builder.gemm(a, b, { c, alpha: 0, beta: 0 });
      });
    },
  },
  {
    name: 'FLOAT32_MAX with transposed inputs',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 8] }, filledFloat32([4, 8], FLOAT32_MAX));
        const b = builder.constant({ dataType: 'float32', shape: [4, 8] }, filledFloat32([4, 8], FLOAT32_MAX));
        return builder.gemm(a, b, { aTranspose: true, bTranspose: false });
      });
    },
  },
  {
    name: 'subnormal inputs with c term',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], FLOAT32_MIN_SUBNORMAL));
        const c = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], FLOAT32_MIN_SUBNORMAL));
        return builder.gemm(a, b, { c });
      });
    },
  },
]);
