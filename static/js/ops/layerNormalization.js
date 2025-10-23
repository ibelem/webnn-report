(() => {
  if (typeof window === 'undefined') {
    return;
  }
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          -5.7109375, 1.4677734375, 6.14453125, 9.4296875, 2.052734375, -8.828125,
          9.140625, -7.64453125, -2.033203125, 6.0625, 4.09375, 0.89111328125,
          8.7109375, -0.0006122589111328125, 5.50390625, -9.15625, -9.890625,
          1.0478515625, -5.92578125, 7.7421875, 0.70068359375, -5.66015625,
          1.3203125, 2.78515625
        ]
      }
    },
    build: (builder, { input }) => builder.layerNormalization(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 6] },
      data: [
        -1.0224609375, 0.11199951171875, 0.85107421875, 1.3701171875,
        0.2044677734375, -1.515625, 1.341796875, -1.7060546875,
        -0.68701171875, 0.78271484375, 0.42529296875, -0.15625,
        1.3515625, 0.0911865234375, 0.8876953125, -1.2333984375,
        -1.33984375, 0.242919921875, -1.2744140625, 1.5869140625,
        0.11309814453125, -1.21875, 0.2427978515625, 0.54931640625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('layerNormalization', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.layerNormalization = spec;
})();
