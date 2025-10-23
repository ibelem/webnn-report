(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          5.47265625, -1.1533203125, 0.407470703125, 1.830078125, 2.869140625, -4.5703125,
          4.1484375, -4.06640625, -3.712890625, 0.90771484375, -0.11083984375, 5.95703125,
          1.783203125, 4.0234375, 5.5859375, -5.28125, 1.4150390625, -5.70703125,
          -1.4443359375, -1.9130859375, 2.75, -0.7421875, 4.85546875, -0.75634765625
        ]
      }
    },
    build: (builder, { input }) => builder.tanh(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
      data: [
        1, -0.81884765625, 0.38623046875, 0.94970703125, 0.99365234375, -1,
        0.99951171875, -0.99951171875, -0.9990234375, 0.72021484375, -0.11041259765625, 1,
        0.94482421875, 0.99951171875, 1, -1, 0.888671875, -1,
        -0.89453125, -0.95751953125, 0.99169921875, -0.63037109375, 1, -0.63916015625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('tanh', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.tanh = spec;
})();
