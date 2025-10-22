(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [7] },
				data: [Infinity, -Infinity, NaN, 0.0, -0.0, 1.0, -1.0]
			}
		},
		build: (builder, { input }) => builder.isInfinite(input),
		expected: {
			descriptor: { dataType: 'uint8', shape: [7] },
			data: [1, 1, 0, 0, 0, 0, 0]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('isInfinite', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.isInfinite = spec;
})();