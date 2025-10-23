(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [4, 6] },
        data: [
          -8.34375, -6.921875, 2.69921875, -8.6640625, -3.19140625, 7.65625,
          6.6484375, 6.05859375, 0.66357421875, 5.8046875, -0.328125, 1.2705078125,
          -9.9453125, 6.90625, -0.03106689453125, -3.96875, 6.26953125, -2.638671875,
          3.05078125, 7.42578125, -8.453125, 7.13671875, -4.984375, -7.859375
        ]
      }
    },
    build: (builder, { input }) => builder.softsign(input),
    expected: {
      descriptor: { dataType: 'float16', shape: [4, 6] },
      data: [
        -0.89306640625, -0.87353515625, 0.7294921875, -0.896484375, -0.76123046875, 0.88427734375,
        0.869140625, 0.8583984375, 0.39892578125, 0.85302734375, -0.2470703125, 0.5595703125,
        -0.90869140625, 0.87353515625, -0.0301361083984375, -0.798828125, 0.8623046875, -0.72509765625,
        0.7529296875, 0.88134765625, -0.89404296875, 0.876953125, -0.8330078125, -0.88720703125
      ]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('softsign', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.softsign = spec;
})();
