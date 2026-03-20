'use strict';

// Adversarial stress tests for: gru, gruCell, lstm, lstmCell

// --- gru ---
registerStressTests('gru', [
  {
    name: 'NaN input data',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 8;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], NaN));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, inputSize] },
          filledFloat32([1, 3 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, hiddenSize] },
          filledFloat32([1, 3 * hiddenSize, hiddenSize], 0.1));
        const outputs = builder.gru(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'Infinity weights',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, inputSize] },
          filledFloat32([1, 3 * hiddenSize, inputSize], Infinity));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, hiddenSize] },
          filledFloat32([1, 3 * hiddenSize, hiddenSize], 0.1));
        const outputs = builder.gru(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'subnormal weights',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, inputSize] },
          filledFloat32([1, 3 * hiddenSize, inputSize], FLOAT32_MIN_SUBNORMAL));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, hiddenSize] },
          filledFloat32([1, 3 * hiddenSize, hiddenSize], FLOAT32_MIN_SUBNORMAL));
        const outputs = builder.gru(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'NaN bias and recurrentBias',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, inputSize] },
          filledFloat32([1, 3 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, hiddenSize] },
          filledFloat32([1, 3 * hiddenSize, hiddenSize], 0.1));
        const bias = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize] },
          filledFloat32([1, 3 * hiddenSize], NaN));
        const recurrentBias = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize] },
          filledFloat32([1, 3 * hiddenSize], NaN));
        const outputs = builder.gru(input, weight, recurrentWeight, steps, hiddenSize, {
          bias, recurrentBias
        });
        return outputs[0];
      });
    },
  },
]);

// --- gruCell ---
registerStressTests('gruCell', [
  {
    name: 'NaN input and hidden state',
    run: async (ctx) => {
      const batchSize = 1, inputSize = 4, hiddenSize = 8;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [batchSize, inputSize] },
          filledFloat32([batchSize, inputSize], NaN));
        const weight = builder.constant(
          { dataType: 'float32', shape: [3 * hiddenSize, inputSize] },
          filledFloat32([3 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [3 * hiddenSize, hiddenSize] },
          filledFloat32([3 * hiddenSize, hiddenSize], 0.1));
        const hiddenState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], NaN));
        return builder.gruCell(input, weight, recurrentWeight, hiddenState, hiddenSize);
      });
    },
  },
  {
    name: 'Infinity hidden state',
    run: async (ctx) => {
      const batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [batchSize, inputSize] },
          filledFloat32([batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [3 * hiddenSize, inputSize] },
          filledFloat32([3 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [3 * hiddenSize, hiddenSize] },
          filledFloat32([3 * hiddenSize, hiddenSize], 0.1));
        const hiddenState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], Infinity));
        return builder.gruCell(input, weight, recurrentWeight, hiddenState, hiddenSize);
      });
    },
  },
]);

// --- lstm ---
registerStressTests('lstm', [
  {
    name: 'NaN input data',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 8;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], NaN));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, inputSize] },
          filledFloat32([1, 4 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, hiddenSize] },
          filledFloat32([1, 4 * hiddenSize, hiddenSize], 0.1));
        const outputs = builder.lstm(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'Infinity weights causing tanh saturation',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, inputSize] },
          filledFloat32([1, 4 * hiddenSize, inputSize], Infinity));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, hiddenSize] },
          filledFloat32([1, 4 * hiddenSize, hiddenSize], 0.1));
        const outputs = builder.lstm(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'NaN initialHiddenState and initialCellState',
    run: async (ctx) => {
      const steps = 2, batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, inputSize] },
          filledFloat32([1, 4 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, hiddenSize] },
          filledFloat32([1, 4 * hiddenSize, hiddenSize], 0.1));
        const initialHiddenState = builder.constant(
          { dataType: 'float32', shape: [1, batchSize, hiddenSize] },
          filledFloat32([1, batchSize, hiddenSize], NaN));
        const initialCellState = builder.constant(
          { dataType: 'float32', shape: [1, batchSize, hiddenSize] },
          filledFloat32([1, batchSize, hiddenSize], NaN));
        const outputs = builder.lstm(input, weight, recurrentWeight, steps, hiddenSize, {
          initialHiddenState, initialCellState
        });
        return outputs[0];
      });
    },
  },
]);

// --- lstmCell ---
registerStressTests('lstmCell', [
  {
    name: 'NaN input hidden and cell state',
    run: async (ctx) => {
      const batchSize = 1, inputSize = 4, hiddenSize = 8;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [batchSize, inputSize] },
          filledFloat32([batchSize, inputSize], NaN));
        const weight = builder.constant(
          { dataType: 'float32', shape: [4 * hiddenSize, inputSize] },
          filledFloat32([4 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [4 * hiddenSize, hiddenSize] },
          filledFloat32([4 * hiddenSize, hiddenSize], 0.1));
        const hiddenState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], NaN));
        const cellState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], NaN));
        const outputs = builder.lstmCell(input, weight, recurrentWeight, hiddenState, cellState, hiddenSize);
        return outputs[0];
      });
    },
  },
  {
    name: 'FLOAT32_MAX cell state (cell state explosion)',
    run: async (ctx) => {
      const batchSize = 1, inputSize = 4, hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [batchSize, inputSize] },
          filledFloat32([batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [4 * hiddenSize, inputSize] },
          filledFloat32([4 * hiddenSize, inputSize], 0.1));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [4 * hiddenSize, hiddenSize] },
          filledFloat32([4 * hiddenSize, hiddenSize], 0.1));
        const hiddenState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], 0));
        const cellState = builder.constant(
          { dataType: 'float32', shape: [batchSize, hiddenSize] },
          filledFloat32([batchSize, hiddenSize], FLOAT32_MAX));
        const outputs = builder.lstmCell(input, weight, recurrentWeight, hiddenState, cellState, hiddenSize);
        return outputs[0];
      });
    },
  },
]);

// --- New: expanded recurrent edge cases ---
registerStressTests('lstm', [
  {
    name: 'LSTM all-subnormal weights (vanishing activations)',
    run: async (ctx) => {
      const steps = 4;
      const batchSize = 2;
      const inputSize = 4;
      const hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, inputSize] },
          filledFloat32([1, 4 * hiddenSize, inputSize], FLOAT32_MIN_SUBNORMAL));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 4 * hiddenSize, hiddenSize] },
          filledFloat32([1, 4 * hiddenSize, hiddenSize], FLOAT32_MIN_SUBNORMAL));
        const outputs = builder.lstm(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
]);

registerStressTests('gru', [
  {
    name: 'GRU all-subnormal weights',
    run: async (ctx) => {
      const steps = 4;
      const batchSize = 2;
      const inputSize = 4;
      const hiddenSize = 4;
      await buildAndExecute(ctx, (builder) => {
        const input = builder.constant(
          { dataType: 'float32', shape: [steps, batchSize, inputSize] },
          filledFloat32([steps, batchSize, inputSize], 1.0));
        const weight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, inputSize] },
          filledFloat32([1, 3 * hiddenSize, inputSize], FLOAT32_MIN_SUBNORMAL));
        const recurrentWeight = builder.constant(
          { dataType: 'float32', shape: [1, 3 * hiddenSize, hiddenSize] },
          filledFloat32([1, 3 * hiddenSize, hiddenSize], FLOAT32_MIN_SUBNORMAL));
        const outputs = builder.gru(input, weight, recurrentWeight, steps, hiddenSize);
        return outputs[0];
      });
    },
  },
]);
