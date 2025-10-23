(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          28.84375, 97.9375, -68.1875, 14.9765625, 90.25, 76.5625,
          -24.5625, 79.5625, 65.1875, 57.4375, 74.4375, -4.51171875,
          0.54248046875, 80.4375, 28.328125, 74, -74.5625, -27.3125,
          -70.4375, 59.8125, -58.46875, 79.8125, -9.859375, 42.65625
        ]
      }
    },
    build: (builder, { input }) => builder.slice(input, [2, 2], [2, 4]),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 4] },
      data: [
        28.328125, 74, -74.5625, -27.3125,
        -58.46875, 79.8125, -9.859375, 42.65625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('slice', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.slice = spec;
})();
