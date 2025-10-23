(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [3, 4] },
        data: [
          -30.0625, 99.5625, 88.0625, -91.875,
          -23.796875, -91.3125, -63.15625, 12.0703125,
          -96.125, -44.78125, -80.0625, -64.4375
        ]
      }
    },
    build: (builder, { input }) => builder.reverse(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [3, 4] },
      data: [
        -64.4375, -80.0625, -44.78125, -96.125,
        12.0703125, -63.15625, -91.3125, -23.796875,
        -91.875, 88.0625, 99.5625, -30.0625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reverse', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reverse = spec;
})();
