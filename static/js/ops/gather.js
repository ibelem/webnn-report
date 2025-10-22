(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-66.0625, -68.9375, -77, -26.15625, 89.0625, -45.90625, 43.84375, 48.8125,
					51.8125, 41.9375, -1.1298828125, -50.40625, 90.3125, 55.625, 44.90625, 56.84375,
					10.828125, -19.6875, -37.6875, 43.125, 0.9130859375, -7.69921875, 25.765625, 73.625
				]
			},
			indices: {
				descriptor: { dataType: 'int32', shape: [8] },
				data: [16, 20, 6, 11, 17, 19, 13, 17]
			}
		},
		build: (builder, { input, indices }) => builder.gather(input, indices),
		expected: {
			descriptor: { dataType: 'float16', shape: [8] },
			data: [
				10.828125, 0.9130859375, 43.84375, -50.40625, -19.6875, 43.125, 55.625, -19.6875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('gather', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.gather = spec;
})();