(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 3, 4] },
        data: [
          -45.6875, 53.46875, -60.125, 38.09375, 78.625, -69.25,
          1.84375, 92.8125, 56.09375, 77.0625, 57.46875, -84.75,
          46.375, -84.875, 56.71875, -25.6875, 5.62109375, -25.65625,
          99.4375, -87.5625, -65.375, -66, 38.46875, 2.19921875
        ]
      }
    },
    build: (builder, { input }) => builder.transpose(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 3, 2] },
      data: [
        -45.6875, 46.375, 78.625, 5.62109375, 56.09375, -65.375,
        53.46875, -84.875, -69.25, -25.65625, 77.0625, -66,
        -60.125, 56.71875, 1.84375, 99.4375, 57.46875, 38.46875,
        38.09375, -25.6875, 92.8125, -87.5625, -84.75, 2.19921875
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('transpose', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.transpose = spec;
})();
