(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					89.6875, -79.6875, -66.8125, -71.875, 86.3125, 6.82421875,
					24.90625, 0.9736328125, 19.953125, 0.84375, -24.75, 77.75,
					-33.65625, 80.75, 44.46875, -37.65625, -83.8125, 65.8125,
					-39.84375, 32.53125, -21.21875, -80.3125, 16.671875, -72.875
				]
			}
		},
		build: (builder, { input }) => builder.floor(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				89, -80, -67, -72, 86, 6, 24, 0, 19, 0, -25, 77,
				-34, 80, 44, -38, -84, 65, -40, 32, -22, -81, 16, -73
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('floor', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.floor = spec;
})();