(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [24] },
        data: [
          -64.5, -84.625, -68, -23.453125, -85.625, 46.875,
          -68.125, 76, -61.0625, -90.9375, 53.90625, 84.1875,
          -95.5625, -52.40625, -29, 71.625, 50.65625, 21.359375,
          -27.125, 65.125, -30.40625, -6.8203125, 46.6875, -21.125
        ],
        constant: true
      }
    },
    build: (builder, { input }) => {
      const [first] = builder.split(input, 3);
      return first;
    },
    expected: {
      descriptor: { dataType: 'float16', shape: [8] },
      data: [-64.5, -84.625, -68, -23.453125, -85.625, 46.875, -68.125, 76]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('split', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.split = spec;
})();
