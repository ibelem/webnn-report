(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					0.37744140625, -0.88916015625, 9.96875, 7.96484375, -4.20703125,
					-3.748046875, -2.51171875, 5.77734375, -4.47265625, -8.40625,
					-3.857421875, 6.03515625, 9.078125, 7.1015625, 1.4169921875,
					-5.64453125, -2.599609375, -7.265625, -9.78125, 5.49609375,
					-9.96875, -6.90234375, -2.849609375, 3.279296875
				]
			}
		},
		build: (builder, { input }) => builder.identity(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				0.37744140625, -0.88916015625, 9.96875, 7.96484375, -4.20703125,
				-3.748046875, -2.51171875, 5.77734375, -4.47265625, -8.40625,
				-3.857421875, 6.03515625, 9.078125, 7.1015625, 1.4169921875,
				-5.64453125, -2.599609375, -7.265625, -9.78125, 5.49609375,
				-9.96875, -6.90234375, -2.849609375, 3.279296875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('identity', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.identity = spec;
})();