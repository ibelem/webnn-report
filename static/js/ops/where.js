(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      condition: {
        descriptor: { dataType: 'uint8', shape: [4, 6] },
        data: [
          241, 0, 85, 0, 227, 51,
          202, 0, 104, 227, 129, 129,
          175, 134, 130, 140, 103, 46,
          158, 17, 0, 41, 94, 0
        ]
      },
      trueValue: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          70.25, 90, -1.53515625, -83.75, 29.59375, -37.09375,
          -6.6640625, -83.125, -90.5, -45.46875, 50.375, 46.5,
          47.5, -21.953125, 42.90625, -76.8125, 67, 40.09375,
          -29.078125, -12.1875, -10.859375, -23.296875, 30.84375, -58.8125
        ]
      },
      falseValue: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          90.4375, 66.75, -39.8125, -21.6875, -67.375, -46.46875,
          -55.90625, 65.5625, 35.15625, 11.9609375, 76.625, 60.75,
          -93.9375, -30.390625, 34.3125, 7.70703125, -82.25, 91.125,
          22.9375, 75, 18.875, 62.3125, 48.875, -75.4375
        ]
      }
    },
    build: (builder, { condition, trueValue, falseValue }) =>
      builder.where(condition, trueValue, falseValue),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 6] },
      data: [
        70.25, 66.75, -1.53515625, -21.6875, 29.59375, -37.09375,
        -6.6640625, 65.5625, -90.5, -45.46875, 50.375, 46.5,
        47.5, -21.953125, 42.90625, -76.8125, 67, 40.09375,
        -29.078125, -12.1875, 18.875, -23.296875, 30.84375, -75.4375
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('where', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.where = spec;
})();
