(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 3, 2, 2] },
        data: [
          -97.9375, 29.4375, -73.9375, -38.125, 41.34375, -59.78125,
          -74.6875, -68.1875, 35.8125, -6.94921875, 54.4375, 47.53125,
          66.9375, 76.75, 5.67578125, 25.6875, 37.375, 56.25,
          -16.578125, 42.9375, 73.875, -99, -33.125, -17.375
        ]
      }
    },
    build: (builder, { input }) => builder.instanceNormalization(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3, 2, 2] },
      data: [
        -1.099609375, 1.552734375, -0.599609375, 0.1461181640625,
        1.7216796875, -0.409912109375, -0.72412109375, -0.5869140625,
        0.1302490234375, -1.6630859375, 0.9111328125, 0.62158203125,
        0.79443359375, 1.130859375, -1.3056640625, -0.61962890625,
        0.265869140625, 0.9462890625, -1.6787109375, 0.46630859375,
        1.50390625, -1.2978515625, -0.23046875, 0.024810791015625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('instanceNormalization', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.instanceNormalization = spec;
})();
