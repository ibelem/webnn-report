(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [3, 2] },
				data: [1, 2, 2, 1, 1, 1]
			},
			weight: {
				descriptor: { dataType: 'float16', shape: [12, 2] },
				data: [
					1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375,
					1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375,
					1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375
				]
			},
			recurrentWeight: {
				descriptor: { dataType: 'float16', shape: [12, 4] },
				data: [
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
					0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375
				]
			},
			hiddenState: {
				descriptor: { dataType: 'float16', shape: [3, 4] },
				data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			},
			bias: {
				descriptor: { dataType: 'float16', shape: [12] },
				data: [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5]
			},
			recurrentBias: {
				descriptor: { dataType: 'float16', shape: [12] },
				data: [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5]
			}
		},
		build: (builder, { input, weight, recurrentWeight, hiddenState, bias, recurrentBias }) => {
			return builder.gruCell(
				input,
				weight,
				recurrentWeight,
				hiddenState,
				4,
				{
					bias,
					recurrentBias,
					resetAfter: false,
					layout: 'zrn',
					activations: ['relu', 'relu']
				}
			);
		},
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 4] },
			data: [
				0, 0, -0.25, -3.83984375,
				-4, -15, -2.25, -3.41015625,
				-1, -3, -1, -3.41015625
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('gruCell', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.gruCell = spec;
})();
