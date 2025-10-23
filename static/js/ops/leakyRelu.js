(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [24] },
        data: [
          -19.046875, 50.78125, -69.5625, -80.5625, -90.375, 76,
          66.3125, -84.125, -17.1875, -87.5, -3.416015625, -22.765625,
          -2.509765625, 18.9375, 98.625, 55.34375, -33.1875, -46.03125,
          -61.46875, 64.25, 21.46875, -31.515625, -41.28125, -65.625
        ]
      }
    },
    build: (builder, { input }) => builder.leakyRelu(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [24] },
      data: [
        -0.1904296875, 50.78125, -0.69580078125, -0.8056640625,
        -0.90380859375, 76, 66.3125, -0.84130859375, -0.171875, -0.875,
        -0.034149169921875, -0.2276611328125, -0.0251007080078125,
        18.9375, 98.625, 55.34375, -0.331787109375, -0.460205078125,
        -0.61474609375, 64.25, 21.46875, -0.315185546875,
        -0.412841796875, -0.65625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('leakyRelu', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.leakyRelu = spec;
})();
