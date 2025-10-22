(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [2, 2, 4] },
				data: [
					-66.0625, -68.9375, -77, -26.15625, 89.0625, -45.90625, 43.84375, 48.8125,
					51.8125, 41.9375, -1.1298828125, -50.40625, 90.3125, 55.625, 44.90625, 56.84375
				]
			},
			indices: {
				descriptor: { dataType: 'int32', shape: [3, 2] },
				data: [1, 0, 0, 1, 1, 1]
			}
		},
		build: (builder, { input, indices }) => builder.gatherND(input, indices),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 4] },
			data: [
				51.8125, 41.9375, -1.1298828125, -50.40625, 89.0625, -45.90625, 43.84375, 48.8125,
				90.3125, 55.625, 44.90625, 56.84375
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('gatherND', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.gatherND = spec;
})();