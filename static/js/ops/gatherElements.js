(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [3, 3] },
				data: [
					-66.0625, -68.9375, -77, -26.15625, 89.0625, -45.90625, 43.84375, 48.8125, 51.8125
				]
			},
			indices: {
				descriptor: { dataType: 'int32', shape: [3, 2] },
				data: [1, 0, 2, 2, 1, 0]
			}
		},
		build: (builder, { input, indices }) => builder.gatherElements(input, indices, { axis: 1 }),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 2] },
			data: [
				-68.9375, -66.0625, -45.90625, -45.90625, 48.8125, 43.84375
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('gatherElements', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.gatherElements = spec;
})();