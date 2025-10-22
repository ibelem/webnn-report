(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [4] },
				data: [-2.5, -1.5, 0.5, 1.5]
			}
		},
		build: (builder, { input }) => builder.roundEven(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [4] },
			data: [-2, -2, 0, 2]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('roundEven', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.roundEven = spec;
})();