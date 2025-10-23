(() => {
  if (typeof window === 'undefined') return;
  // Example spec using float32 data from WPT conformance_tests
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float32', shape: [2, 3, 4] },
        data: [
          0.1, 0.2, 0.3, 0.4,
          0.5, 0.6, 0.7, 0.8,
          0.9, 1.0, 1.1, 1.2,
          1.3, 1.4, 1.5, 1.6,
          1.7, 1.8, 1.9, 2.0,
          2.1, 2.2, 2.3, 2.4
        ]
      },
      weight: {
        descriptor: { dataType: 'float32', shape: [4, 16] },
        data: new Array(64).fill(0.1)
      },
      recurrentWeight: {
        descriptor: { dataType: 'float32', shape: [4, 16] },
        data: new Array(64).fill(0.2)
      }
    },
    build: (builder, { input, weight, recurrentWeight }) => builder.lstm(input, weight, recurrentWeight, 3, 4),
    expected: {
      descriptor: { dataType: 'float32', shape: [2, 3, 4] },
      data: new Array(24).fill(0.5)
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('lstm', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.lstm = spec;
})();
