(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 3, 4] },
        data: [
          -30.0625, 99.5625, 88.0625, -91.875, -23.796875, -91.3125,
          -63.15625, 12.0703125, -96.125, -44.78125, -80.0625, -64.4375,
          27.640625, -96.875, 83.6875, 50.59375, -20.1875, -1.390625,
          -96.9375, 65.3125, 34.84375, 62, -2.869140625, 27.90625
        ]
      }
    },
    build: (builder, { input }) => builder.reshape(input, [4, 2, 3]),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 2, 3] },
      data: [
        -30.0625, 99.5625, 88.0625, -91.875, -23.796875, -91.3125,
        -63.15625, 12.0703125, -96.125, -44.78125, -80.0625, -64.4375,
        27.640625, -96.875, 83.6875, 50.59375, -20.1875, -1.390625,
        -96.9375, 65.3125, 34.84375, 62, -2.869140625, 27.90625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reshape', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reshape = spec;
})();
