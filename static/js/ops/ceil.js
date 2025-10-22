(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					67.375, 36.78125, 99.125, -22.59375, 32.6875, 17.6875,
					5.6328125, 12.96875, 83.125, -29.296875, 19.84375, 65.25,
					26.3125, 24.28125, -48.40625, -5.6171875, 61.53125,
					-87.8125, 69.6875, 5.00390625, 84.375, -9.390625,
					-27.859375, -34.90625
				]
			}
		},
		build: (builder, { input }) => builder.ceil(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				68, 37, 100, -22, 33, 18, 6, 13, 84, -29, 20, 66,
				27, 25, -48, -5, 62, -87, 70, 6, 85, -9, -27, -34
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('ceil', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.ceil = spec;
})();