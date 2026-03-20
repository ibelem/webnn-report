'use strict';

// Adversarial stress tests for: concat, expand, pad, reshape, reverse,
// slice, split, tile, transpose, triangular

// --- concat ---
registerStressTests('concat', [
  {
    name: 'concat many tensors (100)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const tensors = [];
        for (let i = 0; i < 100; i++) {
          tensors.push(builder.constant(
            { dataType: 'float32', shape: [1, 4] },
            filledFloat32([1, 4], i % 2 === 0 ? NaN : Infinity)));
        }
        return builder.concat(tensors, 0);
      });
    },
  },
  {
    name: 'concat single tensor',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4] }, adversarialFloat32([4]));
        return builder.concat([input], 0);
      });
    },
  },
  {
    name: 'concat with adversarial float values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        const b = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.concat([a, b], 0);
      });
    },
  },
  {
    name: 'concat along high axis',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const a = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, randomFloat32([2, 3, 4]));
        const b = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, randomFloat32([2, 3, 4]));
        return builder.concat([a, b], 2);
      });
    },
  },
]);

// --- expand ---
registerStressTests('expand', [
  {
    name: 'expand 0D to large shape',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
        return builder.expand(input, [256, 256]);
      });
    },
  },
  {
    name: 'expand with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 15] }, adversarialFloat32([1, 15]));
        return builder.expand(input, [64, 15]);
      });
    },
  },
  {
    name: 'expand large broadcast',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([Infinity]));
        return builder.expand(input, [1024 * 1024]);
      });
    },
    timeout: 20000,
  },
]);

// --- pad ---
registerStressTests('pad', [
  {
    name: 'pad with large padding values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 2] }, adversarialFloat32([2, 2]));
        return builder.pad(input, [100, 100], [100, 100]);
      });
    },
  },
  {
    name: 'pad constant mode with NaN value',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        return builder.pad(input, [1, 1], [1, 1], { mode: 'constant', value: NaN });
      });
    },
  },
  {
    name: 'pad constant mode with Infinity value',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        return builder.pad(input, [1, 1], [1, 1], { mode: 'constant', value: Infinity });
      });
    },
  },
  {
    name: 'pad edge mode with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.pad(input, [50], [50], { mode: 'edge' });
      });
    },
  },
  {
    name: 'pad reflection mode',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8] }, adversarialFloat32([8]));
        return builder.pad(input, [7], [7], { mode: 'reflection' });
      });
    },
  },
]);

// --- reshape ---
registerStressTests('reshape', [
  {
    name: 'reshape 1D to high-rank',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [32] }, adversarialFloat32([32]));
        return builder.reshape(input, [2, 2, 2, 2, 2]);
      });
    },
  },
  {
    name: 'reshape to 0D scalar',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([NaN]));
        return builder.reshape(input, []);
      });
    },
  },
  {
    name: 'reshape from 0D scalar',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([Infinity]));
        return builder.reshape(input, [1, 1, 1]);
      });
    },
  },
  {
    name: 'repeated reshape to same shape',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let current = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, randomFloat32([2, 3, 4]));
        for (let i = 0; i < 50; i++) {
          current = builder.reshape(current, [24]);
          current = builder.reshape(current, [2, 3, 4]);
        }
        return current;
      });
    },
  },
]);

// --- reverse ---
registerStressTests('reverse', [
  {
    name: 'reverse with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.reverse(input, { axes: [0] });
      });
    },
  },
  {
    name: 'reverse all axes of 4D tensor',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4, 5] }, randomFloat32([2, 3, 4, 5]));
        return builder.reverse(input, { axes: [0, 1, 2, 3] });
      });
    },
  },
  {
    name: 'reverse 0D scalar',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
        return builder.reverse(input);
      });
    },
  },
]);

// --- slice ---
registerStressTests('slice', [
  {
    name: 'slice with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.slice(input, [5], [10]);
      });
    },
  },
  {
    name: 'slice single element',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1024] }, randomFloat32([1024]));
        return builder.slice(input, [512], [1]);
      });
    },
  },
  {
    name: 'slice with large strides',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 1024] }, randomFloat32([2, 3, 1024]));
        return builder.slice(input, [0, 0, 0], [2, 3, 512], { strides: [1, 1, 2] });
      });
    },
  },
]);

// --- split ---
registerStressTests('split', [
  {
    name: 'split into many pieces',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [256] }, randomFloat32([256]));
      const outputs = builder.split(input, 256);
      const named = {};
      for (let i = 0; i < outputs.length; i++) named[`o${i}`] = outputs[i];
      const graph = await builder.build(named);
      const tensors = {};
      for (const key of Object.keys(named)) {
        tensors[key] = await ctx.createTensor({ dataType: 'float32', shape: [1], readable: true });
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
  {
    name: 'split with adversarial values',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [30] }, adversarialFloat32([30]));
      const outputs = builder.split(input, 2);
      const graph = await builder.build({ o0: outputs[0], o1: outputs[1] });
      const t0 = await ctx.createTensor({ dataType: 'float32', shape: [15], readable: true });
      const t1 = await ctx.createTensor({ dataType: 'float32', shape: [15], readable: true });
      try {
        ctx.dispatch(graph, {}, { o0: t0, o1: t1 });
        await ctx.readTensor(t0);
      } finally {
        t0.destroy();
        t1.destroy();
        graph.destroy();
      }
    },
  },
]);

// --- tile ---
registerStressTests('tile', [
  {
    name: 'tile with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.tile(input, [64]);
      });
    },
  },
  {
    name: 'tile large repetition',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([NaN]));
        return builder.tile(input, [1024 * 1024]);
      });
    },
    timeout: 20000,
  },
  {
    name: 'tile multi-dim',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3] }, adversarialFloat32([2, 3]));
        return builder.tile(input, [32, 32]);
      });
    },
  },
]);

// --- transpose ---
registerStressTests('transpose', [
  {
    name: 'transpose with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [3, 5] }, adversarialFloat32([3, 5]));
        return builder.transpose(input);
      });
    },
  },
  {
    name: 'transpose 4D tensor all permutations',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4, 5] }, randomFloat32([2, 3, 4, 5]));
        return builder.transpose(input, { permutation: [3, 2, 1, 0] });
      });
    },
  },
  {
    name: 'transpose 0D scalar',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [] }, new Float32Array([NaN]));
        return builder.transpose(input);
      });
    },
  },
  {
    name: 'transpose identity (no shape change)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [2, 3, 4] }, adversarialFloat32([2, 3, 4]));
        return builder.transpose(input, { permutation: [0, 1, 2] });
      });
    },
  },
]);

// --- triangular ---
registerStressTests('triangular', [
  {
    name: 'triangular upper with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, adversarialFloat32([4, 4]));
        return builder.triangular(input, { upper: true });
      });
    },
  },
  {
    name: 'triangular lower with NaN fill',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, filledFloat32([4, 4], NaN));
        return builder.triangular(input, { upper: false });
      });
    },
  },
  {
    name: 'triangular with large diagonal offset',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8, 8] }, randomFloat32([8, 8]));
        return builder.triangular(input, { upper: true, diagonal: 100 });
      });
    },
  },
  {
    name: 'triangular with negative diagonal',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [8, 8] }, randomFloat32([8, 8]));
        return builder.triangular(input, { upper: true, diagonal: -100 });
      });
    },
  },
]);

// --- New: expanded data-movement edge cases ---

// Pad expanded
registerStressTests('pad', [
  {
    name: 'pad with subnormal constant value',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [4, 4] }, randomFloat32([4, 4]));
        return builder.pad(input, [1, 1], [1, 1], { mode: 'constant', value: FLOAT32_MIN_SUBNORMAL });
      });
    },
  },
  {
    name: 'pad larger than input',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1] }, new Float32Array([1.0]));
        return builder.pad(input, [500, 500], [500, 500]);
      });
    },
  },
  {
    name: 'pad reflection mode with adversarial values',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [15] }, adversarialFloat32([15]));
        return builder.pad(input, [14], [14], { mode: 'reflection' });
      });
    },
  },
]);

// Slice expanded
registerStressTests('slice', [
  {
    name: 'slice with start > end (should be empty or error)',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
          return builder.slice(input, [50], [0]);
        });
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'slice start at last element size=1',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, randomFloat32([100]));
        return builder.slice(input, [99], [1]);
      });
    },
  },
  {
    name: 'slice with strides',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [100] }, adversarialFloat32([100]));
        return builder.slice(input, [0], [50], { strides: [2] });
      });
    },
  },
]);

// Concat with zero-sized dims
registerStressTests('concat', [
  {
    name: 'concat empty tensor attempt',
    run: async (ctx) => {
      try {
        await buildAndExecute(ctx, (builder) => {
          const a = builder.constant({ dataType: 'float32', shape: [0] }, new Float32Array(0));
          const b = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
          return builder.concat([a, b], 0);
        });
      } catch (e) { /* expected */ }
    },
  },
]);

// Expand with subnormal
registerStressTests('expand', [
  {
    name: 'expand subnormal scalar to large shape',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [] },
          new Float32Array([FLOAT32_MIN_SUBNORMAL]));
        return builder.expand(input, [1024]);
      });
    },
  },
]);

// Transpose expanded
registerStressTests('transpose', [
  {
    name: 'transpose 6D tensor (high-rank stride computation)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [2, 3, 4, 5, 6, 7] },
          randomFloat32([2, 3, 4, 5, 6, 7]));
        return builder.transpose(input, { permutation: [5, 4, 3, 2, 1, 0] });
      });
    },
  },
]);
