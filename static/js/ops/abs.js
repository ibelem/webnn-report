(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					49.84375, 82.0625, 3.19921875, 85.1875, 88.9375, -91.0625,
					31.453125, -29.3125, -92.4375, -15.5234375, 80.9375, -38.21875,
					53.0625, 99.625, -21.28125, 90, 18.328125, -33.0625,
					30.09375, -74.1875, 95.625, 6.61328125, 31.28125, -53.21875
				]
			}
		},
		build: (builder, { input }) => builder.abs(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				49.84375, 82.0625, 3.19921875, 85.1875, 88.9375, 91.0625,
				31.453125, 29.3125, 92.4375, 15.5234375, 80.9375, 38.21875,
				53.0625, 99.625, 21.28125, 90, 18.328125, 33.0625,
				30.09375, 74.1875, 95.625, 6.61328125, 31.28125, 53.21875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('abs', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.abs = spec;
})();