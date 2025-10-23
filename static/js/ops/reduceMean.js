(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          95.875, 75.6875, 1.5419921875, 8.7890625, 70.0625, 13.78125,
          20, 94.8125, 25.828125, 94.125, 67.75, 16.09375,
          92.1875, 11.5703125, 52.71875, 22.46875, 3.662109375, 20.203125,
          58.5625, 28.671875, 42.125, 21.640625, 14.1640625, 15.125
        ]
      }
    },
    build: (builder, { input }) => builder.reduceMean(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [54.84375, 40.25, 22.0625, 48.59375, 51.34375, 24.796875]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceMean', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceMean = spec;
})();
