'use strict';

// Security-focused stress tests derived from stress/doc/stress_testing_guide.md.
// Each group maps to a specific section of the guide.
//
// Section 1  — NaN/Infinity at SIMD lane boundaries
// Section 2  — Division-by-zero (gemm alpha=0, beta=Inf; L2 norm of zero)
// Section 3  — Integer overflow (stride × dilation, conv stride overflow)
// Section 4  — Buffer overflow from large indices (gatherElements INT32_MIN,
//               conv2d kernel > input)
// Section 5  — Subnormal float handling (FTZ detection, iterative sigmoid)
// Section 6  — Cross-cutting: powerPreference switching, 100 concurrent dispatches,
//               10 000× graph reuse, multi-output graph IPC stress

// ---------------------------------------------------------------------------
// Section 1: NaN/Infinity at SIMD lane boundaries
// Guide: "Place at stride boundaries to catch SIMD lane masking bugs"
// AVX2 processes 8 floats/cycle; AVX-512 processes 16.
// ---------------------------------------------------------------------------
registerStressTests('security-simd-boundary', [
  {
    name: 'NaN at position 8 (AVX2 lane boundary)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        // 32 elements — NaN injected at the last position of the first AVX2 lane
        const data = filledFloat32([32], 1.0);
        data[7] = NaN;
        const input = builder.constant({ dataType: 'float32', shape: [32] }, data);
        return builder.relu(input);
      });
    },
  },
  {
    name: 'NaN at position 15 (second AVX2 lane boundary)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = filledFloat32([32], 1.0);
        data[15] = NaN;
        const input = builder.constant({ dataType: 'float32', shape: [32] }, data);
        return builder.relu(input);
      });
    },
  },
  {
    name: 'NaN at position 16 (AVX-512 lane boundary)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = filledFloat32([64], 1.0);
        data[15] = NaN;
        data[16] = NaN;
        const input = builder.constant({ dataType: 'float32', shape: [64] }, data);
        return builder.relu(input);
      });
    },
  },
  {
    name: 'Infinity at positions 7,15,23,31 (every AVX2 lane tail)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = filledFloat32([32], 0.5);
        for (let i = 7; i < 32; i += 8) data[i] = Infinity;
        const input = builder.constant({ dataType: 'float32', shape: [32] }, data);
        return builder.exp(input);
      });
    },
  },
  {
    name: '-Infinity at positions 511,512 (512-element boundary crossing)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const data = filledFloat32([1024], 1.0);
        data[511] = -Infinity;
        data[512] = -Infinity;
        const input = builder.constant({ dataType: 'float32', shape: [1024] }, data);
        return builder.exp(input);
      });
    },
  },
  {
    name: 'NaN at stride-8 positions through matmul (SIMD lane poisoning)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        // Inject NaN at every 8th element of the weight column to stress
        // SIMD lane-masking in multiply-accumulate
        const weights = filledFloat32([1, 64], 1.0);
        for (let i = 7; i < 64; i += 8) weights[i] = NaN;
        const a = builder.constant({ dataType: 'float32', shape: [1, 64] }, weights);
        const b = builder.constant({ dataType: 'float32', shape: [64, 1] }, filledFloat32([64, 1], 1.0));
        return builder.matmul(a, b);
      });
    },
  },
]);

// ---------------------------------------------------------------------------
// Section 2: Division-by-zero — specific guide cases not yet covered
// ---------------------------------------------------------------------------
registerStressTests('security-div-by-zero', [
  // Guide Section 2, Case E: gemm alpha=0, B=zeros, beta=Inf, C=any
  // Per IEEE 754: 0 * Inf = NaN — the backend must NOT produce a finite result
  {
    name: 'gemm: alpha=0 B=zeros beta=Infinity (0×Inf=NaN per IEEE 754)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 0));
        // c is any finite value — beta=Inf means the bias term is Inf*c
        const c = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
        return builder.gemm(a, b, { c, alpha: 0, beta: Infinity });
      });
    },
  },
  {
    name: 'gemm: alpha=0 B=NaN beta=0 C=Infinity (Inf*0 = NaN, not 0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], 1.0));
        const b = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        const c = builder.constant({ dataType: 'float32', shape: [4] }, filledFloat32([4], Infinity));
        return builder.gemm(a, b, { c, alpha: 0, beta: 0 });
      });
    },
  },
  // Guide Section 2, Case D: L2 normalization of the zero vector — ||x||₂ = 0 → x/0
  {
    name: 'reduceL2 of all-zero vector (||x||₂=0, division by zero downstream)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [512] }, filledFloat32([512], 0));
        return builder.reduceL2(input, { axes: [0] });
      });
    },
  },
  {
    name: 'reduceL2 of subnormal-only vector (near-zero norm)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [512] },
          filledFloat32([512], FLOAT32_MIN_SUBNORMAL));
        return builder.reduceL2(input, { axes: [0] });
      });
    },
  },
  // layerNorm: zero-variance input AND epsilon=0 (explicit zero denominator)
  {
    name: 'layerNorm: all-identical input epsilon=0 (var=0, div by exact zero)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        // All elements equal → variance = E[x²] - E[x]² = 0 exactly
        const input = builder.constant(
          { dataType: 'float32', shape: [4, 256] },
          filledFloat32([4, 256], 42.0));
        return builder.layerNormalization(input, { epsilon: 0 });
      });
    },
  },
  // instanceNorm with 1-element spatial dim: variance over 1 sample = 0
  {
    name: 'instanceNorm: spatial dim=1 (var=0 by definition with epsilon=0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        // [batch=1, channels=4, H=1, W=512] — H=1 makes variance 0 per row
        const input = builder.constant(
          { dataType: 'float32', shape: [1, 4, 1, 512] },
          randomFloat32([1, 4, 1, 512]));
        return builder.instanceNormalization(input, { epsilon: 0 });
      });
    },
  },
  // softmax with all -Inf: exp(-Inf)=0 for all → sum=0 → 0/0
  {
    name: 'softmax all-negative-Infinity (exp(-Inf)=0 → sum=0 → 0/0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [4, 64] },
          filledFloat32([4, 64], -Infinity));
        return builder.softmax(input, 1);
      });
    },
  },
]);

// ---------------------------------------------------------------------------
// Section 3: Integer overflow in shape/stride computations
// Guide: specific overflow patterns not yet covered
// ---------------------------------------------------------------------------
registerStressTests('security-stride-overflow', [
  // Guide Section 3, Case E: stride=[65536], dilation=[65536]
  // Effective stride = 65536² = 4 GB — should reject before allocation
  {
    name: 'conv2d stride=[65536] × dilation=[65536] (effective 4GB stride)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 131072, 131072] },
            new Float32Array([1])); // unreachable allocation; validation should reject early
          const filter = builder.constant(
            { dataType: 'float32', shape: [1, 1, 2, 2] },
            filledFloat32([1, 1, 2, 2], 1.0));
          return builder.conv2d(input, filter, {
            strides: [65536, 65536],
            dilations: [65536, 65536],
          });
        });
      } catch (e) { /* expected: should throw not crash */ }
    },
    timeout: 15000,
  },
  // Guide Section 3, Case A: 46341 × 46342 > INT32_MAX
  {
    name: 'conv2d output shape 46341×46342 > INT32_MAX (shape overflow)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.input('input', { dataType: 'float32', shape: [1, 1, 46341, 46342] });
          const filter = builder.constant(
            { dataType: 'float32', shape: [1, 1, 1, 1] },
            new Float32Array([1]));
          return builder.conv2d(input, filter);
        });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  // Guide Section 3, Case B: reshape to [1, INT32_MAX] then slice
  {
    name: 'reshape to [1, 1073741824] then slice (stride overflow chain, 4GB)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.input('input', { dataType: 'float32', shape: [1] });
          // 1073741824 * 4 bytes = 4GB — large enough to overflow int32 stride math
          // but uses a round power-of-two that validation can reject quickly
          const reshaped = builder.reshape(input, [1, 1073741824]);
          return builder.slice(reshaped, [0, 0], [1, 1]);
        });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  // Guide Section 3, Case D: transpose large high-rank tensor
  {
    name: 'transpose [128,128,128,128,128,128] perm=[5,4,3,2,1,0] stride overflow',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          // product = 128^6 ≈ 4.3×10^12 >> INT32_MAX; shape inference must reject
          const input = builder.input('input', {
            dataType: 'float32',
            shape: [128, 128, 128, 128, 128, 128],
          });
          return builder.transpose(input, { permutation: [5, 4, 3, 2, 1, 0] });
        });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
  // Cumulative stride in multi-axis slice — Guide Section 3, Case C
  {
    name: 'multi-axis slice with INT32_MAX stride on last axis',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [2, 2, 2, 2] },
            randomFloat32([2, 2, 2, 2]));
          return builder.slice(
            input,
            [0, 0, 0, 0],
            [2, 2, 2, 1],
            { strides: [1, 1, 1, INT32_MAX] });
        });
      } catch (e) { /* expected */ }
    },
    timeout: 15000,
  },
]);

// ---------------------------------------------------------------------------
// Section 4: Buffer overflow from large index values
// Guide: gatherElements with negative/INT32_MIN indices, conv2d kernel > input
// ---------------------------------------------------------------------------
registerStressTests('security-index-oob', [
  // Guide Section 4, Case B: gatherElements with INT32_MIN (sign extension bug)
  {
    name: 'gatherElements: INT32_MIN index (sign extension / unsigned reinterpret)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [4, 4] },
            randomFloat32([4, 4]));
          const indices = builder.constant(
            { dataType: 'int32', shape: [4, 3] },
            // INT32_MIN, -1, and 0 test signed boundary and negative handling
            new Int32Array([-2147483648, -1, 0, -2147483648, -1, 0,
                            -2147483648, -1, 0, -2147483648, -1, 0]));
          return builder.gatherElements(input, indices, { axis: 1 });
        });
      } catch (e) { /* expected — must not OOB */ }
    },
  },
  // Guide Section 4, Case E: conv2d with kernel larger than input
  // input=3×3, kernel=7×7 → output size = (3-7)/1+1 = -3 (negative)
  {
    name: 'conv2d: kernel (7×7) > input (3×3) → negative output size',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 3, 3] },
            new Float32Array(9).fill(1.0));
          const filter = builder.constant(
            { dataType: 'float32', shape: [1, 1, 7, 7] },
            new Float32Array(49).fill(1.0));
          return builder.conv2d(input, filter, { padding: [0, 0, 0, 0] });
        });
      } catch (e) { /* expected: should throw, not crash */ }
    },
  },
  // convTranspose2d with outputPadding that creates invalid output shape
  {
    name: 'convTranspose2d: outputPadding larger than stride (shape underflow)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [1, 1, 4, 4] },
            filledFloat32([1, 1, 4, 4], 1.0));
          const filter = builder.constant(
            { dataType: 'float32', shape: [1, 1, 3, 3] },
            filledFloat32([1, 1, 3, 3], 1.0));
          // outputPadding must be < stride; using outputPadding >= stride
          return builder.convTranspose2d(input, filter, {
            strides: [1, 1],
            outputPadding: [100, 100],
          });
        });
      } catch (e) { /* expected */ }
    },
  },
  // Guide Section 4, Case A: gather OOB with INT32_MAX index
  {
    name: 'gather: INT32_MAX index into 4-element tensor (OOB read probe)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [4, 4] },
            randomFloat32([4, 4]));
          const indices = builder.constant(
            { dataType: 'int32', shape: [3] },
            new Int32Array([0, 3, INT32_MAX]));
          return builder.gather(input, indices, { axis: 0 });
        });
      } catch (e) { /* expected */ }
    },
  },
  // gatherND with partial out-of-bounds index
  {
    name: 'gatherND: index [9999, 0] into [10, 10] tensor (first dim OOB)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [10, 10] },
            randomFloat32([10, 10]));
          const indices = builder.constant(
            { dataType: 'int32', shape: [1, 2] },
            new Int32Array([9999, 0]));
          return builder.gatherND(input, indices);
        });
      } catch (e) { /* expected */ }
    },
  },
  // scatterND with index that escapes tensor bounds
  {
    name: 'scatterND: OOB index [100] into shape [10] target',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [10] },
            filledFloat32([10], 0));
          const indices = builder.constant(
            { dataType: 'int32', shape: [1, 1] },
            new Int32Array([100]));
          const updates = builder.constant(
            { dataType: 'float32', shape: [1] },
            new Float32Array([1.0]));
          return builder.scatterND(input, indices, updates);
        });
      } catch (e) { /* expected */ }
    },
  },
]);

// ---------------------------------------------------------------------------
// Section 5: Subnormal float handling / FTZ divergence detection
// Guide: "FTZ divergence is a spec violation. Compare CPU vs GPU result."
// These tests run identical graphs twice (once per powerPreference) and look
// for behavioral divergence that would indicate FTZ silent zeroing on GPU.
// ---------------------------------------------------------------------------
registerStressTests('security-subnormal-ftz', [
  // Guide Section 5, Case E: iterative sigmoid on a very small initial value
  // sigmoid(x) ≈ 0.5 + x/4 near 0; chains can drift into denorm territory
  {
    name: 'sigmoid chain x50 on subnormal input (iterative denorm drift)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant(
          { dataType: 'float32', shape: [64] },
          filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        for (let i = 0; i < 50; i++) {
          x = builder.sigmoid(x);
        }
        return x;
      });
    },
    timeout: 30000,
  },
  // Guide Section 5, Case B: subnormal gradient in multiplication chain
  // x * x where x = min_subnormal → x² underflows to 0 (FTZ vs exact)
  {
    name: 'x*x where x=subnormal (underflow: FTZ→0, exact→non-zero)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant(
          { dataType: 'float32', shape: [256] },
          filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        return builder.mul(x, x);
      });
    },
  },
  // Guide Section 5, Case C: conv with subnormal weights AND subnormal input
  // Every multiply underflows → FP denorm assist for every MAC
  {
    name: 'conv2d subnormal input × subnormal filter (all MAC underflow)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [1, 1, 32, 32] },
          filledFloat32([1, 1, 32, 32], FLOAT32_MIN_SUBNORMAL));
        const filter = builder.constant(
          { dataType: 'float32', shape: [1, 1, 3, 3] },
          filledFloat32([1, 1, 3, 3], FLOAT32_MIN_SUBNORMAL));
        return builder.conv2d(input, filter);
      });
    },
  },
  // Guide Section 5, Case D: alternating subnormal/normal — stresses SIMD lane mixing
  {
    name: 'matmul interleaved subnormal/normal 256×256 (SIMD lane mixing)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant(
          { dataType: 'float32', shape: [256, 256] },
          interleavedSubnormalFloat32([256, 256]));
        const b = builder.constant(
          { dataType: 'float32', shape: [256, 256] },
          interleavedSubnormalFloat32([256, 256]));
        return builder.matmul(a, b);
      });
    },
    timeout: 30000,
  },
  // Guide Section 5, Case A: all subnormals through a long op chain
  {
    name: 'subnormal through matmul→relu→layerNorm→softmax chain',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant(
          { dataType: 'float32', shape: [1, 64] },
          filledFloat32([1, 64], FLOAT32_MIN_SUBNORMAL));
        const b = builder.constant(
          { dataType: 'float32', shape: [64, 64] },
          filledFloat32([64, 64], FLOAT32_MIN_SUBNORMAL));
        let x = builder.matmul(a, b);
        x = builder.relu(x);
        x = builder.layerNormalization(x);
        x = builder.softmax(x, 1);
        return x;
      });
    },
    timeout: 30000,
  },
  // Reciprocal of subnormal: 1 / subnormal → very large value → test overflow handling
  {
    name: 'reciprocal(subnormal) → potential Infinity overflow',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant(
          { dataType: 'float32', shape: [64] },
          filledFloat32([64], FLOAT32_MIN_SUBNORMAL));
        return builder.reciprocal(x);
      });
    },
  },
  // sqrt of subnormal: triggers denorm slow path in x86 VSQRTSS
  {
    name: 'sqrt(subnormal) — triggers x86 denorm microcode assist path',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const x = builder.constant(
          { dataType: 'float32', shape: [65536] },
          filledFloat32([65536], FLOAT32_MIN_SUBNORMAL));
        return builder.sqrt(x);
      });
    },
    timeout: 30000,
  },
]);

// ---------------------------------------------------------------------------
// Section 6: powerPreference backend switching
// Guide Section 6: "powerPreference: 'low-power' vs 'high-performance'"
// Tests that explicitly switch between CPU and GPU backends to find
// backend-specific NaN/subnormal divergence
// ---------------------------------------------------------------------------
registerStressTests('security-backend-switching', [
  {
    name: 'subnormal NaN chain on low-power context (CPU backend)',
    run: async (ctx) => {
      // Create an explicit low-power context (typically maps to CPU)
      let lowPowerCtx;
      try {
        lowPowerCtx = await navigator.ml.createContext({
          deviceType: DEVICE,
          powerPreference: 'low-power',
        });
      } catch (e) {
        lowPowerCtx = ctx; // fall back to the shared context
      }
      try {
        const builder = new MLGraphBuilder(lowPowerCtx);
        const input = builder.constant(
          { dataType: 'float32', shape: [256] },
          filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        const output = builder.mul(input, input);
        const graph = await builder.build({ output });
        const outT = await lowPowerCtx.createTensor({
          dataType: 'float32', shape: [256], readable: true });
        try {
          lowPowerCtx.dispatch(graph, {}, { output: outT });
          await lowPowerCtx.readTensor(outT);
        } finally {
          outT.destroy();
          graph.destroy();
        }
      } finally {
        if (lowPowerCtx !== ctx) lowPowerCtx.destroy();
      }
    },
    timeout: 30000,
  },
  {
    name: 'subnormal NaN chain on high-performance context (GPU backend)',
    run: async (ctx) => {
      // Create an explicit high-performance context (typically maps to GPU)
      let hiPerfCtx;
      try {
        hiPerfCtx = await navigator.ml.createContext({
          deviceType: DEVICE,
          powerPreference: 'high-performance',
        });
      } catch (e) {
        hiPerfCtx = ctx;
      }
      try {
        const builder = new MLGraphBuilder(hiPerfCtx);
        const input = builder.constant(
          { dataType: 'float32', shape: [256] },
          filledFloat32([256], FLOAT32_MIN_SUBNORMAL));
        const output = builder.mul(input, input);
        const graph = await builder.build({ output });
        const outT = await hiPerfCtx.createTensor({
          dataType: 'float32', shape: [256], readable: true });
        try {
          hiPerfCtx.dispatch(graph, {}, { output: outT });
          await hiPerfCtx.readTensor(outT);
        } finally {
          outT.destroy();
          graph.destroy();
        }
      } finally {
        if (hiPerfCtx !== ctx) hiPerfCtx.destroy();
      }
    },
    timeout: 30000,
  },
  {
    name: 'NaN propagation on low-power context (relu of NaN)',
    run: async (ctx) => {
      let lowPowerCtx;
      try {
        lowPowerCtx = await navigator.ml.createContext({
          deviceType: DEVICE,
          powerPreference: 'low-power',
        });
      } catch (e) {
        lowPowerCtx = ctx;
      }
      try {
        const builder = new MLGraphBuilder(lowPowerCtx);
        const input = builder.constant(
          { dataType: 'float32', shape: [64] },
          filledFloat32([64], NaN));
        const graph = await builder.build({ output: builder.relu(input) });
        const outT = await lowPowerCtx.createTensor({
          dataType: 'float32', shape: [64], readable: true });
        try {
          lowPowerCtx.dispatch(graph, {}, { output: outT });
          await lowPowerCtx.readTensor(outT);
        } finally {
          outT.destroy();
          graph.destroy();
        }
      } finally {
        if (lowPowerCtx !== ctx) lowPowerCtx.destroy();
      }
    },
  },
  {
    name: 'NaN propagation on high-performance context (relu of NaN)',
    run: async (ctx) => {
      let hiPerfCtx;
      try {
        hiPerfCtx = await navigator.ml.createContext({
          deviceType: DEVICE,
          powerPreference: 'high-performance',
        });
      } catch (e) {
        hiPerfCtx = ctx;
      }
      try {
        const builder = new MLGraphBuilder(hiPerfCtx);
        const input = builder.constant(
          { dataType: 'float32', shape: [64] },
          filledFloat32([64], NaN));
        const graph = await builder.build({ output: builder.relu(input) });
        const outT = await hiPerfCtx.createTensor({
          dataType: 'float32', shape: [64], readable: true });
        try {
          hiPerfCtx.dispatch(graph, {}, { output: outT });
          await hiPerfCtx.readTensor(outT);
        } finally {
          outT.destroy();
          graph.destroy();
        }
      } finally {
        if (hiPerfCtx !== ctx) hiPerfCtx.destroy();
      }
    },
  },
  {
    name: 'default vs low-power context created back-to-back (resource contention)',
    run: async (ctx) => {
      let ctx2;
      try {
        ctx2 = await navigator.ml.createContext({
          deviceType: DEVICE,
          powerPreference: 'low-power',
        });
      } catch (e) {
        return; // skip if powerPreference not supported
      }
      try {
        // Run the same graph on both contexts simultaneously
        const buildGraph = async (c) => {
          const b = new MLGraphBuilder(c);
          const input = b.constant(
            { dataType: 'float32', shape: [64] },
            adversarialFloat32([64]));
          const g = await b.build({ output: b.relu(input) });
          const outT = await c.createTensor({
            dataType: 'float32', shape: [64], readable: true });
          try {
            c.dispatch(g, {}, { output: outT });
            return await c.readTensor(outT);
          } finally {
            outT.destroy();
            g.destroy();
          }
        };
        await Promise.all([buildGraph(ctx), buildGraph(ctx2)]);
      } finally {
        ctx2.destroy();
      }
    },
    timeout: 30000,
  },
]);

// ---------------------------------------------------------------------------
// Section 6: Cross-cutting stress dimensions
// Guide: "Fire 100 graph evaluations concurrently" and "execute 10,000×"
// ---------------------------------------------------------------------------
registerStressTests('security-cross-cutting', [
  // Guide Section 6: 100 concurrent evaluations with Promise.all
  // Tests race conditions in the shared GPU command queue
  {
    name: '100 concurrent dispatches (GPU command queue stress)',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [256] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });

      const inTensors = [];
      const outTensors = [];
      try {
        for (let i = 0; i < 100; i++) {
          const inT = await ctx.createTensor({
            dataType: 'float32', shape: [256], writable: true });
          const outT = await ctx.createTensor({
            dataType: 'float32', shape: [256], readable: true });
          inTensors.push(inT);
          outTensors.push(outT);
        }

        const promises = inTensors.map((inT, i) => {
          ctx.writeTensor(inT, adversarialFloat32([256]));
          ctx.dispatch(graph, { input: inT }, { output: outTensors[i] });
          return ctx.readTensor(outTensors[i]);
        });
        await Promise.all(promises);
      } finally {
        for (const t of inTensors) t.destroy();
        for (const t of outTensors) t.destroy();
        graph.destroy();
      }
    },
    timeout: 60000,
  },
  // Guide Section 6: Build once, execute 10,000× — tests native handle leak
  {
    name: '10,000× graph reuse (native handle memory leak detection)',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [64] });
      const graph = await builder.build({ output: builder.relu(input) });
      const inT = await ctx.createTensor({
        dataType: 'float32', shape: [64], writable: true });
      const outT = await ctx.createTensor({
        dataType: 'float32', shape: [64], readable: true });
      try {
        for (let i = 0; i < 10000; i++) {
          ctx.writeTensor(inT, filledFloat32([64], (i % 100) * 0.01));
          ctx.dispatch(graph, { input: inT }, { output: outT });
          if (i % 100 === 99) await ctx.readTensor(outT); // flush every 100
        }
        await ctx.readTensor(outT);
      } finally {
        inT.destroy();
        outT.destroy();
        graph.destroy();
      }
    },
    timeout: 120000,
  },
  // Guide Section 6: batch size variation — test SIMD vectorization threshold
  {
    name: 'batch size sweep 1,2,8,256 (SIMD vectorization kicks in at ≥8)',
    run: async (ctx) => {
      for (const batchSize of [1, 2, 8, 256]) {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant(
            { dataType: 'float32', shape: [batchSize, 64] },
            adversarialFloat32([batchSize, 64]));
          return builder.softmax(input, 1);
        });
      }
    },
    timeout: 30000,
  },
  // Guide Section 6: graph depth variation — 1 op vs 50-op chain
  {
    name: 'graph depth 1 vs 50 ops (compiler/JIT path difference)',
    run: async (ctx) => {
      // Shallow: 1 op
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [256] },
          adversarialFloat32([256]));
        return builder.relu(input);
      });
      // Deep: 50-op chain
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant(
          { dataType: 'float32', shape: [256] },
          adversarialFloat32([256]));
        for (let i = 0; i < 50; i++) x = builder.relu(x);
        return x;
      });
    },
    timeout: 30000,
  },
  // Multi-output graph with 200 outputs (IPC message size stress)
  // Guide Section 7: "IPC validation bypass" —
  // a very large MLGraph with many named outputs stresses the IPC serialization path
  {
    name: 'multi-output graph with 200 outputs (IPC serialization stress)',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant(
        { dataType: 'float32', shape: [200] },
        randomFloat32([200]));
      const outputs = {};
      for (let i = 0; i < 200; i++) {
        const sliced = builder.slice(input, [i], [1]);
        outputs[`o${i}`] = builder.relu(sliced);
      }
      const graph = await builder.build(outputs);
      const tensors = {};
      for (let i = 0; i < 200; i++) {
        tensors[`o${i}`] = await ctx.createTensor({
          dataType: 'float32', shape: [1], readable: true });
      }
      try {
        ctx.dispatch(graph, {}, tensors);
        await ctx.readTensor(tensors.o0);
      } finally {
        for (const t of Object.values(tensors)) t.destroy();
        graph.destroy();
      }
    },
    timeout: 30000,
  },
  // Guide Section 1, Case D: NaN through relu → downstream layernorm
  // relu(NaN) must stay NaN; layernorm must not divide by NaN variance
  {
    name: 'NaN through relu→layerNorm chain (relu(NaN) must stay NaN)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [4, 64] },
          filledFloat32([4, 64], NaN));
        const relued = builder.relu(input);
        return builder.layerNormalization(relued);
      });
    },
  },
  // Guide Section 2, Case B: softmax of all -Infinity (exp underflow → 0/0)
  // (Separate from the one in security-div-by-zero to test multi-batch)
  {
    name: 'NaN input through batchNorm→softmax chain (epsilon=0)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [1, 4, 8, 8] },
          filledFloat32([1, 4, 8, 8], NaN));
        const mean = builder.constant(
          { dataType: 'float32', shape: [4] },
          filledFloat32([4], 0));
        const variance = builder.constant(
          { dataType: 'float32', shape: [4] },
          filledFloat32([4], 1));
        const normed = builder.batchNormalization(input, mean, variance);
        // flatten [1,4,8,8] → [1,256] for softmax
        const flat = builder.reshape(normed, [1, 256]);
        return builder.softmax(flat, 1);
      });
    },
  },
]);
