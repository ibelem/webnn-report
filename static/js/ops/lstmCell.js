(() => {
  if (typeof window === 'undefined') return;
  // Example spec using float32 data from WPT conformance_tests
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float32', shape: [2, 4] },
        data: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
      },
      weight: {
        descriptor: { dataType: 'float32', shape: [4, 16] },
        data: new Array(64).fill(0.1)
      },
      recurrentWeight: {
        descriptor: { dataType: 'float32', shape: [4, 16] },
        data: new Array(64).fill(0.2)
      },
      hiddenState: {
        descriptor: { dataType: 'float32', shape: [2, 4] },
        data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
      },
      cellState: {
        descriptor: { dataType: 'float32', shape: [2, 4] },
        data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
      }
    },
    build: (builder, { input, weight, recurrentWeight, hiddenState, cellState }) => builder.lstmCell(input, weight, recurrentWeight, hiddenState, cellState, 4),
    expected: {
      descriptor: { dataType: 'float32', shape: [2, 4] },
      data: new Array(8).fill(0.5)
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('lstmCell', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.lstmCell = spec;
})();
