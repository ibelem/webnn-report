(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [1, 2, 3, 4] },
        data: [
          5.625, 5.16796875, 4.015625, 9.4765625, 9.9921875, 7.06640625,
          2.1328125, 8.1875, 5.171875, 2.10546875, 3.5234375, 4.13671875,
          1.7421875, 5.14453125, 5.015625, 0.0458984375, 2.95703125, 3.958984375,
          5.51953125, 7.19140625, 8.765625, 1.373046875, 8.9296875, 8.6640625
        ]
      }
    },
    build: (builder, { input }) => builder.softplus(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [1, 2, 3, 4] },
      data: [
        5.62890625, 5.171875, 4.03515625, 9.4765625, 9.9921875, 7.06640625,
        2.244140625, 8.1875, 5.17578125, 2.220703125, 3.552734375, 4.15234375,
        1.9033203125, 5.1484375, 5.0234375, 0.71630859375, 3.0078125, 3.978515625,
        5.5234375, 7.19140625, 8.765625, 1.5986328125, 8.9296875, 8.6640625
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('softplus', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.softplus = spec;
})();
