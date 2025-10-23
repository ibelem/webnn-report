(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2] },
        data: [1, 2, 3, 4],
        constant: true
      }
    },
    build: (builder, { input }) => builder.tile(input, [2, 3]),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 6] },
      data: [
        1, 2, 1, 2, 1, 2,
        3, 4, 3, 4, 3, 4,
        1, 2, 1, 2, 1, 2,
        3, 4, 3, 4, 3, 4
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('tile', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.tile = spec;
})();
