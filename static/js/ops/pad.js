(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [3, 3] },
        data: [
          22.765625, -21.171875, -91.6875,
          16.859375, 60.5, -70.5625,
          -60.65625, -47.875, 68.75
        ]
      }
    },
    build: (builder, { input }) => builder.pad(input, [1, 1], [1, 1]),
    expected: {
      descriptor: { dataType: 'float16', shape: [5, 5] },
      data: [
        0, 0, 0, 0, 0,
        0, 22.765625, -21.171875, -91.6875, 0,
        0, 16.859375, 60.5, -70.5625, 0,
        0, -60.65625, -47.875, 68.75, 0,
        0, 0, 0, 0, 0
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('pad', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.pad = spec;
})();
