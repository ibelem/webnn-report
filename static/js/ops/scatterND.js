(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [8] },
        data: [1, 2, 3, 4, 5, 6, 7, 8]
      },
      indices: {
        descriptor: { dataType: 'int32', shape: [4, 1] },
        data: [4, 3, 1, 7]
      },
      updates: {
        descriptor: { dataType: 'float16', shape: [4] },
        data: [9, 10, 11, 12]
      }
    },
    build: (builder, { input, indices, updates }) =>
      builder.scatterND(input, indices, updates),
    expected: {
      descriptor: { dataType: 'float16', shape: [8] },
      data: [1, 11, 3, 10, 9, 6, 7, 12]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('scatterND', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.scatterND = spec;
})();
