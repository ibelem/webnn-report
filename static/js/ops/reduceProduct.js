(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          1.578125, 0.8291015625, 0.81640625, -0.35205078125,
          -1.390625, -1.892578125, -1.466796875, 1.2734375,
          -0.8349609375, -1.912109375, 0.5244140625, -0.3974609375,
          -1.90625, 1.4794921875, 1.134765625, 1.203125,
          -0.9755859375, 0.68212890625, -0.6015625, -1.3427734375,
          -1.41015625, 1.16015625, 0.0347900390625, -1.72265625
        ]
      }
    },
    build: (builder, { input }) =>
      builder.reduceProduct(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [
        1.2744140625, 1.6640625, -1.1962890625, -1.95703125,
        -0.0312042236328125, 0.80615234375
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceProduct', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceProduct = spec;
})();
