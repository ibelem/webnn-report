(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          32.15625, 90.4375, -26.34375, -7.1484375, 75.875, -48.21875,
          -53.09375, 66.6875, -96.1875, -88.3125, 95, 37.28125,
          -42.21875, 96.5625, 0.880859375, 62.5, 36.65625, 99.75,
          -72.875, -46.03125, 20.25, -21.5625, -51.28125, -42.59375
        ]
      }
    },
    build: (builder, { input }) => builder.reduceMax(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [62.5, 96.5625, 99.75, -21.5625, 95, 37.28125]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceMax', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceMax = spec;
})();
