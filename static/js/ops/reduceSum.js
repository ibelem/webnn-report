(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          69.625, 99.1875, 32.78125, 8.8828125, 16.09375, 11.8046875,
          32.65625, 44, 77, 79.8125, 45, 24.390625,
          57.5, 57.59375, 80.25, 43.65625, 87.5, 94.5,
          35.53125, 42.84375, 88.5625, 98.875, 25.625, 60.1875
        ]
      }
    },
    build: (builder, { input }) => builder.reduceSum(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [179.625, 260.5, 219.375, 246.875, 157.5, 250.125]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceSum', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceSum = spec;
})();
