(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [24] },
        data: [
          -1.1220703125, -6.60546875, -1.955078125, -4.59765625, 4.234375,
          3.09765625, 3.74609375, -4.48828125, 6.40625, -4.35546875,
          -5.8203125, 3.720703125, -6.33203125, 8.578125, -6.765625,
          6.43359375, -9.7109375, 2.642578125, 5.21484375, 9.65625,
          -8.71875, -0.453369140625, 9.9921875, -6.46875
        ]
      }
    },
    build: (builder, { input }) => builder.linear(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [24] },
      data: [
        -1.1220703125, -6.60546875, -1.955078125, -4.59765625, 4.234375,
        3.09765625, 3.74609375, -4.48828125, 6.40625, -4.35546875,
        -5.8203125, 3.720703125, -6.33203125, 8.578125, -6.765625,
        6.43359375, -9.7109375, 2.642578125, 5.21484375, 9.65625,
        -8.71875, -0.453369140625, 9.9921875, -6.46875
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('linear', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.linear = spec;
})();
