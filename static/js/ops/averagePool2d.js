(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [1, 2, 5, 5] },
        data: [
          22.96875, 78.125, 9.6875, 51.3125, 32.1875, 87.625, 87.25, 39.5, 80.125,
          10.21875, 52.59375, 1.4130859375, 11.953125, 85, 64.8125, 88.0625,
          11.3359375, 70.625, 84.875, 79.0625, 7.328125, 35.96875, 10.1796875,
          1.4140625, 78.125, 91.625, 65.625, 55.15625, 18.4375, 49.34375,
          15.6484375, 68, 20.34375, 26.734375, 64.875, 46.5625, 79.5625,
          4.33984375, 38.1875, 45.25, 81, 67.5625, 6.02734375, 29.78125, 58.59375,
          2.23828125, 14.5078125, 68.75, 76.4375, 23.53125
        ]
      }
    },
    build: (builder, { input }) => builder.averagePool2d(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [1, 2, 1, 1] },
      data: [47.28125, 44.71875]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('averagePool2d', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.averagePool2d = spec;
})();
