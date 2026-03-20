'use strict';

// Adversarial stress tests for graph-level / context-level issues:
// context lifecycle, parallel dispatch, resource exhaustion, destroy semantics

registerStressTests('context', [
  {
    name: 'destroy context then attempt dispatch',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [4] }, new Float32Array([1, 2, 3, 4]));
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      const outputTensor = await ctx.createTensor({ dataType: 'float32', shape: [4], readable: true });

      try {
        // Destroy then dispatch — the ctx2 graph/tensors are freed by ctx2.destroy()
        const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
        const builder2 = new MLGraphBuilder(ctx2);
        const in2 = builder2.constant({ dataType: 'float32', shape: [4] }, new Float32Array([1, 2, 3, 4]));
        const out2 = builder2.relu(in2);
        const graph2 = await builder2.build({ output: out2 });
        const ot2 = await ctx2.createTensor({ dataType: 'float32', shape: [4], readable: true });
        ctx2.destroy();
        try {
          ctx2.dispatch(graph2, {}, { output: ot2 });
          await ctx2.readTensor(ot2);
        } catch (e) { /* expected */ }
      } finally {
        outputTensor.destroy();
        graph.destroy();
      }
    },
  },
  {
    name: 'destroy graph then attempt dispatch',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [4] }, new Float32Array([1, 2, 3, 4]));
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      graph.destroy();
      const outputTensor = await ctx.createTensor({ dataType: 'float32', shape: [4], readable: true });
      try {
        ctx.dispatch(graph, {}, { output: outputTensor });
        await ctx.readTensor(outputTensor);
      } catch (e) { /* expected */ }
      finally {
        outputTensor.destroy();
      }
    },
  },
  {
    name: 'destroy tensor then attempt readTensor',
    run: async (ctx) => {
      const tensor = await ctx.createTensor({ dataType: 'float32', shape: [4], readable: true });
      tensor.destroy();
      try {
        await ctx.readTensor(tensor);
      } catch (e) { /* expected */ }
    },
  },
  {
    name: 'double destroy context',
    run: async (ctx) => {
      const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
      ctx2.destroy();
      try {
        ctx2.destroy();
      } catch (e) { /* expected or no-op */ }
    },
  },
  {
    name: 'double destroy graph',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [4] }, new Float32Array([1, 2, 3, 4]));
      const output = builder.relu(input);
      const graph = await builder.build({ output });
      graph.destroy();
      try {
        graph.destroy();
      } catch (e) { /* expected or no-op */ }
    },
  },
  {
    name: 'double destroy tensor',
    run: async (ctx) => {
      const tensor = await ctx.createTensor({ dataType: 'float32', shape: [4], readable: true });
      tensor.destroy();
      try {
        tensor.destroy();
      } catch (e) { /* expected or no-op */ }
    },
  },
  {
    name: 'rapid create+destroy context cycles (50x)',
    run: async (ctx) => {
      for (let i = 0; i < 50; i++) {
        try {
          const c = await navigator.ml.createContext({ deviceType: DEVICE });
          c.destroy();
        } catch (e) { break; }
      }
    },
    timeout: 30000,
  },
  {
    name: 'rapid create+destroy tensor cycles (100x)',
    run: async (ctx) => {
      for (let i = 0; i < 100; i++) {
        const t = await ctx.createTensor({ dataType: 'float32', shape: [1024], readable: true });
        t.destroy();
      }
    },
    timeout: 30000,
  },
  {
    name: 'create many tensors without destroy (leak detection)',
    run: async (ctx) => {
      const tensors = [];
      for (let i = 0; i < 200; i++) {
        tensors.push(await ctx.createTensor({ dataType: 'float32', shape: [1024], readable: true }));
      }
      // Now destroy all
      for (const t of tensors) t.destroy();
    },
    timeout: 30000,
  },
  {
    name: 'build many graphs without destroy (leak detection)',
    run: async (ctx) => {
      const graphs = [];
      for (let i = 0; i < 100; i++) {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.constant({ dataType: 'float32', shape: [16] }, randomFloat32([16]));
        const output = builder.relu(input);
        graphs.push(await builder.build({ output }));
      }
      for (const g of graphs) g.destroy();
    },
    timeout: 30000,
  },
  {
    name: 'parallel dispatch on same graph',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.input('input', { dataType: 'float32', shape: [256] });
      const output = builder.relu(input);
      const graph = await builder.build({ output });

      const inTensors = [];
      const outTensors = [];
      const promises = [];
      try {
        for (let i = 0; i < 10; i++) {
          const inT = await ctx.createTensor({ dataType: 'float32', shape: [256], writable: true });
          const outT = await ctx.createTensor({ dataType: 'float32', shape: [256], readable: true });
          inTensors.push(inT);
          outTensors.push(outT);
          ctx.writeTensor(inT, filledFloat32([256], i));
          ctx.dispatch(graph, { input: inT }, { output: outT });
          promises.push(ctx.readTensor(outT));
        }
        await Promise.all(promises);
      } finally {
        for (const t of inTensors) t.destroy();
        for (const t of outTensors) t.destroy();
        graph.destroy();
      }
    },
    timeout: 30000,
  },
  {
    name: 'context.lost promise should not reject unexpectedly',
    run: async (ctx) => {
      // Just check that context.lost is a promise and doesn't reject immediately
      if (ctx.lost) {
        const raceResult = await Promise.race([
          ctx.lost.then(() => 'lost'),
          new Promise(r => setTimeout(() => r('ok'), 500)),
        ]);
        if (raceResult === 'lost') {
          throw new Error('Context was unexpectedly lost');
        }
      }
    },
  },
]);

registerStressTests('graphComplex', [
  {
    name: 'deeply chained ops (500 relu chain)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let current = builder.constant({ dataType: 'float32', shape: [16] }, randomFloat32([16]));
        for (let i = 0; i < 500; i++) {
          current = builder.relu(current);
        }
        return current;
      });
    },
    timeout: 30000,
  },
  {
    name: 'wide fan-out graph (100 parallel ops from one input)',
    run: async (ctx) => {
      const builder = new MLGraphBuilder(ctx);
      const input = builder.constant({ dataType: 'float32', shape: [16] }, randomFloat32([16]));
      const outputs = {};
      for (let i = 0; i < 100; i++) {
        outputs[`o${i}`] = builder.relu(input);
      }
      const graph = await builder.build(outputs);
      const tensors = {};
      for (const key of Object.keys(outputs)) {
        tensors[key] = await ctx.createTensor({ dataType: 'float32', shape: [16], readable: true });
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
    name: 'diamond graph pattern (shared intermediate)',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [16] }, adversarialFloat32([16]));
        const shared = builder.relu(input);
        const left = builder.abs(shared);
        const right = builder.neg(shared);
        return builder.add(left, right);
      });
    },
  },
  {
    name: 'mixed op types in chain',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        let x = builder.constant({ dataType: 'float32', shape: [4, 4] }, adversarialFloat32([4, 4]));
        x = builder.relu(x);
        x = builder.sigmoid(x);
        x = builder.tanh(x);
        x = builder.abs(x);
        x = builder.neg(x);
        x = builder.exp(x);
        x = builder.log(builder.abs(x));
        x = builder.softmax(x, 1);
        return x;
      });
    },
  },
  // --- New: expanded context/graph stress ---
  {
    name: 'NaN through conv → norm → activation chain',
    run: async (ctx) => {
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant({ dataType: 'float32', shape: [1, 1, 4, 4] }, filledFloat32([1, 1, 4, 4], NaN));
        const filter = builder.constant({ dataType: 'float32', shape: [1, 1, 3, 3] }, filledFloat32([1, 1, 3, 3], 1.0));
        let x = builder.conv2d(input, filter);
        const mean = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([0]));
        const variance = builder.constant({ dataType: 'float32', shape: [1] }, new Float32Array([1]));
        x = builder.batchNormalization(x, mean, variance);
        x = builder.relu(x);
        return x;
      });
    },
  },
  {
    name: 'readTensor on freshly created writable tensor (uninitialized)',
    run: async (ctx) => {
      let tensor;
      try {
        tensor = await ctx.createTensor({
          dataType: 'float32', shape: [256],
          readable: true, writable: true,
        });
        const result = await ctx.readTensor(tensor);
        // result may contain garbage — should not crash
      } catch (e) { /* expected if read before dispatch */ }
      finally {
        if (tensor) tensor.destroy();
      }
    },
  },
  {
    name: 'concurrent dispatch to same writable tensor',
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
        ctx.writeTensor(inputTensor, randomFloat32([64]));
        // Fire two dispatches simultaneously — potential race condition
        const p1 = (async () => {
          ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
          await ctx.readTensor(outputTensor);
        })();
        const p2 = (async () => {
          ctx.dispatch(graph, { input: inputTensor }, { output: outputTensor });
          await ctx.readTensor(outputTensor);
        })();
        await Promise.allSettled([p1, p2]);
      } catch (e) { /* race should not crash */ }
      finally {
        inputTensor.destroy();
        outputTensor.destroy();
        graph.destroy();
      }
    },
  },
  {
    name: 'destroy context during dispatch',
    run: async (ctx) => {
      try {
        const ctx2 = await navigator.ml.createContext({ deviceType: DEVICE });
        const builder = new MLGraphBuilder(ctx2);
        const input = builder.input('input', { dataType: 'float32', shape: [64] });
        const output = builder.relu(input);
        const graph = await builder.build({ output });
        const inputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [64], writable: true });
        const outputTensor = await ctx2.createTensor({
          dataType: 'float32', shape: [64], readable: true });
        ctx2.writeTensor(inputTensor, randomFloat32([64]));
        ctx2.dispatch(graph, { input: inputTensor }, { output: outputTensor });
        // Destroy immediately without waiting for dispatch
        ctx2.destroy();
      } catch (e) { /* should not crash */ }
    },
  },
  {
    name: 'graph build + destroy in rapid succession (100 cycles)',
    run: async (ctx) => {
      for (let i = 0; i < 100; i++) {
        const builder = new MLGraphBuilder(ctx);
        const input = builder.constant({ dataType: 'float32', shape: [4] }, randomFloat32([4]));
        const output = builder.relu(input);
        const graph = await builder.build({ output });
        graph.destroy();
      }
    },
    timeout: 30000,
  },
]);
