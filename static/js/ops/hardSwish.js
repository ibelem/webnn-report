(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [24] },
        data: [
          0.734375, 9.1171875, 3.544921875, 2.62109375, -6.4453125,
          -1.68359375, 5.5234375, -5.95703125, -9.171875, 6.421875,
          -3.29296875, 1.041015625, -7.24609375, -0.947265625, -5.77734375,
          3.185546875, -7.26171875, 4.17578125, 3.779296875, -6.0703125,
          -9.90625, -7.74609375, -8.2890625, 8.0859375
        ]
      }
    },
    build: (builder, { input }) => builder.hardSwish(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [24] },
      data: [
        0.45703125, 9.1171875, 3.544921875, 2.455078125, 0,
        -0.369384765625, 5.5234375, 0, 0, 6.421875,
        0, 0.701171875, 0, -0.323974609375, 0,
        3.185546875, 0, 4.17578125, 3.779296875, 0,
        0, 0, 0, 8.0859375
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('hardSwish', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.hardSwish = spec;
})();
