(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [1, 2, 2] },
				data: [1, 2, 2, 1]
			},
			weight: {
				descriptor: { dataType: 'float16', shape: [1, 8, 2] },
				data: [
					1, -1, 2, -2, 1, -1, 2, -2,
					1, -1, 2, -2, 1, -1, 2, -2
				]
			},
			recurrentWeight: {
				descriptor: { dataType: 'float16', shape: [1, 8, 2] },
				data: [
					0.1, 0.1, 0.1, 0.1,
					0.1, 0.1, 0.1, 0.1,
					0.1, 0.1, 0.1, 0.1,
					0.1, 0.1, 0.1, 0.1
				]
			},
			bias: {
				descriptor: { dataType: 'float16', shape: [1, 8] },
				data: [1, 2, 1, 2, 1, 2, 1, 2]
			},
			recurrentBias: {
				descriptor: { dataType: 'float16', shape: [1, 8] },
				data: [1, 2, 1, 2, 1, 2, 1, 2]
			}
		},
		build: (builder, { input, weight, recurrentWeight, bias, recurrentBias }) => {
			const [output] = builder.lstm(
				input,
				weight,
				recurrentWeight,
				1,
				2,
				{
					bias,
					recurrentBias,
					returnSequence: false,
					activations: ['relu', 'relu', 'relu']
				}
			);
			// builder.lstm returns [sequence, hidden, cell]; only validate the sequence here.
			return output;
		},
		expected: {
			descriptor: { dataType: 'float16', shape: [1, 2, 2] },
			data: [1, 8, 27, 216]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('lstm', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.lstm = spec;
})();
