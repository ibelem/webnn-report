(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          84.9375, -86.1875, 50.375, -98.5, -94.5, -21.421875,
          24.671875, -50.34375, -37.03125, 97.25, 73.375, -75.125,
          41.65625, 58.875, -29.921875, 67.5, 42.125, -70.25,
          20.890625, 71.375, -85, -89, 77.5625, 91.0625
        ]
      }
    },
    build: (builder, { input }) => builder.triangular(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 6] },
      data: [
        84.9375, -86.1875, 50.375, -98.5, -94.5, -21.421875,
        0, -50.34375, -37.03125, 97.25, 73.375, -75.125,
        0, 0, -29.921875, 67.5, 42.125, -70.25,
        0, 0, 0, -89, 77.5625, 91.0625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('triangular', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.triangular = spec;
})();
