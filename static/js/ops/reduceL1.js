(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          5.5078125, 50.625, 1.677734375, 84.1875, 15.6640625, 52.90625,
          9.125, 28.9375, 12.5703125, 11.3984375, 86.9375, 64.5,
          71.3125, 76.375, 41.53125, 97.5625, 31.796875, 6.08984375,
          61.71875, 69.75, 38.90625, 52.28125, 22.3125, 99.0625
        ]
      }
    },
    build: (builder, { input }) => builder.reduceL1(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [258.5, 174.5, 102.1875, 134.5, 208, 215]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceL1', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceL1 = spec;
})();
