(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          4.859375, 88.25, 54.5, 64.75, 6.85546875, 91.375,
          41.875, 73.625, 35.3125, 48.34375, 82.375, 77.875,
          93.3125, 62.5, 60.28125, 13.234375, 20.53125, 53.4375,
          11.3203125, 64.75, 43.65625, 0.83740234375, 0.68505859375, 33.5
        ]
      }
    },
    build: (builder, { input }) => builder.reduceL2(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [114.4375, 110.3125, 133.5, 64.9375, 128, 101.6875]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceL2', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceL2 = spec;
})();
