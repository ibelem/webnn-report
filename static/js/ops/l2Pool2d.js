(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [1, 2, 5, 5] },
        data: [
          94.0625, 76.5625, 62.71875, 83.875, 73.125, 41.53125, 39.34375,
          86.625, 23.09375, 53.65625, 0.0090179443359375, 42.78125, 81.0625,
          33.5, 33.6875, 0.42822265625, 80.0625, 5.9296875, 48.90625, 15.28125,
          13.3359375, 39.0625, 97.0625, 83.6875, 21.796875, 52.03125, 6.3984375,
          84.5625, 18.625, 34.09375, 74, 36.15625, 60.75, 55.09375, 63.90625,
          59.375, 50.90625, 50.34375, 59.3125, 70.75, 35.5625, 82.5625,
          7.57421875, 61.90625, 14.0859375, 90.875, 39.5625, 67.75, 69.6875,
          89.5625
        ]
      }
    },
    build: (builder, { input }) => builder.l2Pool2d(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [1, 2, 1, 1] },
      data: [289, 292.75]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('l2Pool2d', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.l2Pool2d = spec;
})();
