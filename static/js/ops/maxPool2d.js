(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [1, 2, 5, 5] },
        data: [
          89, -45.71875, -61.3125, -4.015625, -94.5625, 46.28125, 99.3125,
          -10.0546875, 9.7421875, -39.03125, 75.0625, 12.8203125, -33, 38.6875,
          66.0625, 97.875, -8.734375, -53.40625, 72.125, -40.4375, -35.6875,
          -87.625, 38.875, 39.375, 7.4296875, -76.75, 50.21875, -52.90625,
          -44.65625, -97.875, 81.75, 5.4296875, -29.234375, 72.4375, -59.34375,
          39.1875, -66, -4.203125, -60.53125, 55.875, 80.3125, 72.875, -46.59375,
          20.5, -31.125, -57.28125, -26.625, 15.9375, -78.75, 72.3125
        ]
      }
    },
    build: (builder, { input }) => builder.maxPool2d(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [1, 2, 1, 1] },
      data: [99.3125, 81.75]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('maxPool2d', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.maxPool2d = spec;
})();
