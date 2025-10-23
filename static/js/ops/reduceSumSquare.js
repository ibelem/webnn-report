(() => {
  if (typeof window === 'undefined') return;
  const spec = {
    inputs: {
      input: {
        descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
        data: [
          1.3935546875, 1.20703125, 1.18359375, 0.3759765625,
          0.69677734375, 0.75244140625, 1.068359375, 1.455078125,
          0.87890625, 0.2149658203125, 0.7998046875, 0.135986328125,
          1.099609375, 0.77685546875, 1.1025390625, 0.65625,
          1.703125, 1.6025390625, 1.5185546875, 1.892578125,
          0.8408203125, 1.2294921875, 1.529296875, 0.64404296875
        ]
      }
    },
    build: (builder, { input }) =>
      builder.reduceSumSquare(input, { axes: [0, 2] }),
    expected: {
      descriptor: { dataType: 'float16', shape: [2, 3] },
      data: [3.72265625, 5.4453125, 5.75, 5.00390625, 8.6796875, 1.9130859375]
    }
  };
  const register = window.registerOperationTest;
  if (typeof register === 'function') {
    register('reduceSumSquare', spec);
    return;
  }
  const store = window.operationTests = window.operationTests || {};
  store.reduceSumSquare = spec;
})();
