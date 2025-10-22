(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			castInput: {
				descriptor: { dataType: 'float16', shape: [2, 2, 2, 3] },
				data: [
					3.103515625, 32.40625, 62.15625, 51.75, 87.0625, 106.25,
					125.375, 112.9375, 70.8125, 39.1875, 10.3515625, 21.234375,
					99.75, 16.125, 115.625, 66, 49.375, 115.75,
					77, 57.15625, 61.6875, 12.9296875, 101.25, 123.9375
				]
			}
		},
		build: (builder, { castInput }) => builder.cast(castInput, 'float32'),
		expected: {
			descriptor: { dataType: 'float32', shape: [2, 2, 2, 3] },
			data: [
				3.103515625, 32.40625, 62.15625, 51.75, 87.0625, 106.25,
				125.375, 112.9375, 70.8125, 39.1875, 10.3515625, 21.234375,
				99.75, 16.125, 115.625, 66, 49.375, 115.75,
				77, 57.15625, 61.6875, 12.9296875, 101.25, 123.9375
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('cast', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.cast = spec;
})();