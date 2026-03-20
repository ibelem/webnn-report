'use strict';

// Adversarial stress tests for race conditions in parallel dispatch,
// concurrent tensor access, and resource lifecycle edge cases.

registerStressTests('race-conditions', [
  {
    name: 'parallel dispatch with separate output tensors',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [64] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      const inputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [64], writable: true });
      ctx.writeTensor(inputTensor, randomFloat32([64]));
      // Create separate output tensors for parallel dispatches
      const outputs = [];
      for (let i = 0; i < 10; i++) {
        outputs.push(await ctx.createTensor({
          dataType: 'float32', shape: [64], readable: true }));
      }
      const promises = outputs.map(async (outT) => {
        ctx.dispatch(graph, { input: inputTensor }, { output: outT });
        return ctx.readTensor(outT);
      });
      await Promise.allSettled(promises);
    },
    timeout: 30000,
  },
  {
    name: 'writeTensor during dispatch (race on input)',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', { dataType: 'float32', shape: [256] });
        const output = builder.relu(input);
        const graph = await builder.build({ output });
        const inputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], writable: true });
        const outputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], readable: true });
        ctx.writeTensor(inputTensor, randomFloat32([256]));
        ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        // Write again immediately — race with in-flight dispatch
        ctx.writeTensor(inputTensor, filledFloat32([256], NaN));
        await ctx.readTensor(outputTensor);
      } catch (e) { /* should not crash */ }
    },
  },
  {
    name: 'readTensor during dispatch (race on output)',
    run: async (ctx) => {
      try {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.input('input', { dataType: 'float32', shape: [256] });
        const output = builder.relu(input);
        const graph = await builder.build({ output });
        const inputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], writable: true });
        const outputTensor = await ctx.createTensor({
          dataType: 'float32', shape: [256], readable: true, writable: true });
        ctx.writeTensor(inputTensor, randomFloat32([256]));
        ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        // Attempt to read output immediately without await
        const p = ctx.readTensor(outputTensor);
        await p;
      } catch (e) { /* should not crash */ }
    },
  },
  {
    name: 'destroy tensor during dispatch',
    run: async (ctx) => {
      try {
        const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
        const builder = new MLGraphBuilder(ctx2);
        const input = builder.input('input', { dataType: 'float32', shape: [256] });
        const output = builder.relu(input);
        const graph = await builder.build({ output });
        const inputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [256], writable: true });
        const outputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [256], readable: true });
        ctx2.writeTensor(inputTensor, randomFloat32([256]));
        ctx2.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        // Destroy context immediately
        ctx2.destroy();
      } catch (e) { /* should not crash */ }
    },
  },
  {
    name: 'rapid dispatch+read cycles (100 iterations)',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [64] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      const inputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [64], writable: true });
      const outputTensor = await ctx.createTensor({
        dataType: 'float32', shape: [64], readable: true });
      for (let i = 0; i < 100; i++) {
        ctx.writeTensor(inputTensor, filledFloat32([64], i * 0.01));
        ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        await ctx.readTensor(outputTensor);
      }
    },
    timeout: 30000,
  },
  {
    name: 'multiple graphs sharing same input tensor',
    run: async (ctx) => {
      const builder1 = new MLGraphBuilder(ctx);
      const in1 = builder1.input('input', { dataType: 'float32', shape: [64] });
      const graph1 = await builder1.build({ output: builder1.relu(in1) });

      const builder2 = new MLGraphBuilder(ctx);
      const in2 = builder2.input('input', { dataType: 'float32', shape: [64] });
      const graph2 = await builder2.build({ output: builder2.sigmoid(in2) });

      const sharedInput = await ctx.createTensor({
        dataType: 'float32', shape: [64], writable: true });
      const out1 = await ctx.createTensor({
        dataType: 'float32', shape: [64], readable: true });
      const out2 = await ctx.createTensor({
        dataType: 'float32', shape: [64], readable: true });
      ctx.writeTensor(sharedInput, randomFloat32([64]));
      ctx.dispatch(graph1, { input: sharedInput }, { output: out1 });
      ctx.dispatch(graph2, { input: sharedInput }, { output: out2 });
      await Promise.all([ctx.readTensor(out1), ctx.readTensor(out2)]);
    },
  },
  {
    name: 'dispatch after context.destroy should throw',
    run: async (ctx) => {
      try {
        const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
        const builder = new MLGraphBuilder(ctx2);
        const input = builder.input('input', { dataType: 'float32', shape: [4] });
        const graph = await builder.build({ output: builder.relu(input) });
        const inputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [4], writable: true });
        const outputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [4], readable: true });
        ctx2.destroy();
        ctx2.dispatch(graph, { input: inputTensor }, { output: outputTensor });
      } catch (e) { /* expected: should throw, not crash */ }
    },
  },
  {
    name: 'multiple contexts interleaved dispatch',
    run: async (ctx) => {
      const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
      try {
        const b1 = new MLGraphBuilder(ctx);
        const b2 = new MLGraphBuilder(ctx2);
        const g1 = await b1.build({ output: b1.relu(b1.input('x', { dataType: 'float32', shape: [8] })) });
        const g2 = await b2.build({ output: b2.relu(b2.input('x', { dataType: 'float32', shape: [8] })) });
        const in1 = await ctx.createTensor({ dataType: 'float32', shape: [8], writable: true });
        const out1 = await ctx.createTensor({ dataType: 'float32', shape: [8], readable: true });
        const in2 = await ctx2.createTensor({ dataType: 'float32', shape: [8], writable: true });
        const out2 = await ctx2.createTensor({ dataType: 'float32', shape: [8], readable: true });
        ctx.writeTensor(in1, randomFloat32([8]));
        ctx2.writeTensor(in2, randomFloat32([8]));
        ctx.dispatch(g1, { x: in1 }, { output: out1 });
        ctx2.dispatch(g2, { x: in2 }, { output: out2 });
        await Promise.all([ctx.readTensor(out1), ctx2.readTensor(out2)]);
      } finally {
        ctx2.destroy();
      }
    },
  },
]);
