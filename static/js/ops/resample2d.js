(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [1, 1, 2, 3] },
        // Rounded from the WPT float32 dataset to the nearest float16 values.
        data: [59.9375, 42, 66.40625, 90.6875, 86.9375, 79.125]
      }
    },
    build: (builder, { input }) => builder.resample2d(input, { sizes: [4, 6] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [1, 1, 4, 6] },
      data: [
        59.9375, 59.9375, 42, 42, 66.40625, 66.40625,
        59.9375, 59.9375, 42, 42, 66.40625, 66.40625,
        90.6875, 90.6875, 86.9375, 86.9375, 79.125, 79.125,
        90.6875, 90.6875, 86.9375, 86.9375, 79.125, 79.125
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('resample2d', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.resample2d = spec;
})();
