(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          0.79736328125, 5.046875, 8.5234375, 1.40625,
          0.11883544921875, 0.285888671875, 1.9326171875, 3.794921875,
          2.603515625, 4.9375, 4.5703125, 0.78662109375,
          0.210205078125, 9.0625, 4.1015625, 4.59765625,
          0.2548828125, 1.1591796875, 6.8046875, 5.234375,
          8.9140625, 9.1640625, 5.71875, 0.325439453125
        ]
      }
    },
    build: (builder, { input }) =>
      builder.reduceLogSumExp(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [4.671875, 9.078125, 8.5390625, 9.265625, 6.44921875, 8.9140625]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceLogSumExp', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceLogSumExp = spec;
})();
