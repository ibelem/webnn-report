(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          64.5625, 97.875, 26.53125, 79.8125, 50.40625, 14.578125,
          20.859375, 32.4375, 64.9375, 71.5625, 11.140625, 55.09375,
          43.78125, 13.828125, 97.375, 35.5, 52.28125, 82.8125,
          8.5703125, 0.83349609375, 69.25, 3.853515625, 70.5625, 72
        ]
      }
    },
    build: (builder, { input }) => builder.reduceLogSum(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [
        5.41015625, 5.3671875, 5.3984375, 4.65234375, 4.74609375, 5.56640625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceLogSum', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceLogSum = spec;
})();
