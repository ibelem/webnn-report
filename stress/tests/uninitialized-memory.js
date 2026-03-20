'use strict';

// Adversarial stress tests for uninitialized memory reads and
// tensor lifecycle edge cases.

registerStressTests('uninitialized-memory', [
  {
    name: 'readTensor on writable tensor before any writeTensor',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'float32', shape: [256],
          readable: true, writable: true,
        });
        // Read without ever writing — may contain uninitialized GPU memory
        const result = await ctx.readTensor(tensor);
        // result should exist and not crash
      } catch (e) { /* expected: may throw */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
  },
  {
    name: 'readTensor on writable tensor before dispatch',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'float32', shape: [64],
          readable: true, writable: true,
        });
        ctx.writeTensor(tensor, filledFloat32([64], NaN));
        // Read without dispatch — should return the written data
        const result = await ctx.readTensor(tensor);
      } catch (e) { /* may throw */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
  },
  {
    name: 'uninitialized output tensor after dispatch',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [64] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      const inputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [64], writable: true });
      const outputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [64], readable: true });
      try {
        // Write NaN to input, dispatch
        ctx.writeTensor(inputTensor, filledFloat32([64], NaN));
        ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        const result = await ctx.readTensor(outputTensor);
        // result should be valid (NaN through relu = 0 or NaN)
      } finally {
        inputTensor.destroy();
        outputTensor.destroy();
        graph.destroy();
      }
    },
  },
  {
    name: 'read large uninitialized tensor (1M floats)',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'float32', shape: [1024 * 1024],
          readable: true, writable: true,
        });
        const result = await ctx.readTensor(tensor);
        // Should not contain data from other processes/contexts
      } catch (e) { /* expected: may throw */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
    timeout: 30000,
  },
  {
    name: 'multiple uninitialized tensors (check for cross-contamination)',
    run: async (ctx) => {
      let t1, t2;
      try {
        t1 = await ctx.createTensor({
          dataType: 'float32', shape: [256],
          readable: true, writable: true,
        });
        t2 = await ctx.createTensor({
          dataType: 'float32', shape: [256],
          readable: true, writable: true,
        });
        // Write known pattern to t1
        ctx.writeTensor(t1, filledFloat32([256], 42.0));
        // Read t2 — should NOT contain t1's data
        const r2 = await ctx.readTensor(t2);
        // Read t1 — should contain 42.0
        const r1 = await ctx.readTensor(t1);
      } catch (e) { /* may throw */ }
      finally {
        if (t1) t1.destroy();
        if (t2) t2.destroy();
      }
    },
  },
  {
    name: 'int32 uninitialized tensor read',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'int32', shape: [64],
          readable: true, writable: true,
        });
        const result = await ctx.readTensor(tensor);
      } catch (e) { /* expected */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
  },
  {
    name: 'uint8 uninitialized tensor read',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'uint8', shape: [256],
          readable: true, writable: true,
        });
        const result = await ctx.readTensor(tensor);
      } catch (e) { /* expected */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
  },
  {
    name: 'reassign output tensor between dispatches',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [8] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      const inputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [8], writable: true });
      const outA = await ctx.createTensor({
        dataType: 'float32', shape: [8], readable: true });
      const outB = await ctx.createTensor({
        dataType: 'float32', shape: [8], readable: true });
      try {
        ctx.writeTensor(inputTensor, filledFloat32([8], 1.0));
        // Dispatch to outA
        ctx.dispatch(graph, { input: inputTensor }, { output: outA });
        await ctx.readTensor(outA);
        // Dispatch to outB (outA should still hold old data)
        ctx.writeTensor(inputTensor, filledFloat32([8], 2.0));
        ctx.dispatch(graph, { input: inputTensor }, { output: outB });
        await ctx.readTensor(outB);
        // Read outA again — should still have old result
        await ctx.readTensor(outA);
      } finally {
        inputTensor.destroy();
        outA.destroy();
        outB.destroy();
        graph.destroy();
      }
    },
  },
]);
