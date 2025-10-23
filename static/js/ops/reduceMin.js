(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          -58.75, -87.9375, -70.125, -53.625, -39.5, 76.5,
          -18.703125, 44.78125, 30.703125, 61.46875, 77.8125, -53.75,
          -31.71875, -9.734375, 77.9375, 99, 73.375, 92.0625,
          -59.40625, -84.4375, 75.875, 96, -55.96875, -1.791015625
        ]
      }
    },
    build: (builder, { input }) => builder.reduceMin(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [-58.75, -87.9375, -70.125, -59.40625, -84.4375, -53.75]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceMin', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceMin = spec;
})();
