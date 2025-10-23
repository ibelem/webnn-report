(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          79.0625, 2.25, 80.75, 63.90625, 77.6875, -71.0625,
          -82.75, -26.8125, -99.1875, -35.71875, 18.359375, -37.375,
          -52.84375, -10.40625, 60.59375, -13.640625, -76.5625, -8.1328125,
          51.5, -51.625, -64.5625, -5.09375, 15.3515625, 90.0625
        ]
      }
    },
    build: (builder, { input }) => builder.relu(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
      data: [
        79.0625, 2.25, 80.75, 63.90625, 77.6875, 0,
        0, 0, 0, 0, 18.359375, 0,
        0, 0, 60.59375, 0, 0, 0,
        51.5, 0, 0, 0, 15.3515625, 90.0625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('relu', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.relu = spec;
})();
