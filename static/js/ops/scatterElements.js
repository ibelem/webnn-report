(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [3, 3] },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      indices: {
        descriptor: { dataType: 'int32', shape: [2, 3] },
        data: [1, 0, 2, 0, 2, 1]
      },
      updates: {
        descriptor: { dataType: 'float16', shape: [2, 3] },
        data: [1, 1.099609375, 1.2001953125, 2, 2.099609375, 2.19921875]
      }
    },
    build: (builder, { input, indices, updates }) =>
      builder.scatterElements(input, indices, updates, { axis: 0 }),
    expected: {
      descriptor: { dataType: 'float16', shape: [3, 3] },
      data: [
        2, 1.099609375, 0,
        1, 0, 2.19921875,
        0, 2.099609375, 1.2001953125
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('scatterElements', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.scatterElements = spec;
})();
