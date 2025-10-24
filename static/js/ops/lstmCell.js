(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [2, 2] },
				data: [1, 2, 2, 1]
			},
			weight: {
				descriptor: { dataType: 'float16', shape: [8, 2] },
				data: [
					1, -1, 2, -2, 1, -1, 2, -2,
					1, -1, 2, -2, 1, -1, 2, -2
				]
			},
			recurrentWeight: {
				descriptor: { dataType: 'float16', shape: [8, 2] },
				data: [
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375
				]
			},
			hiddenState: {
				descriptor: { dataType: 'float16', shape: [2, 2] },
				data: [0, 0, 0, 0]
			},
			cellState: {
				descriptor: { dataType: 'float16', shape: [2, 2] },
				data: [0, 0, 0, 0]
			},
			bias: {
				descriptor: { dataType: 'float16', shape: [8] },
				data: [1, 2, 1, 2, 1, 2, 1, 2]
			},
			recurrentBias: {
				descriptor: { dataType: 'float16', shape: [8] },
				data: [1, 2, 1, 2, 1, 2, 1, 2]
			}
		},
		build: (builder, { input, weight, recurrentWeight, hiddenState, cellState, bias, recurrentBias }) => {
			const [nextHidden] = builder.lstmCell(
				input,
				weight,
				recurrentWeight,
				hiddenState,
				cellState,
				2,
				{
					bias,
					recurrentBias,
					activations: ['relu', 'relu', 'relu']
				}
			);
			// builder.lstmCell returns [hidden, cell]; this spec checks the hidden state.
			return nextHidden;
		},
		expected: {
			descriptor: { dataType: 'float16', shape: [2, 2] },
			data: [1, 8, 27, 216]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('lstmCell', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.lstmCell = spec;
})();
