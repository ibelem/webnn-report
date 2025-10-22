(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'uint8', shape: [4] },
				data: [0, 1, 3, 0]
			}
		},
		build: (builder, { input }) => builder.logicalNot(input),
		expected: {
			descriptor: { dataType: 'uint8', shape: [4] },
			data: [1, 0, 0, 1]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('logicalNot', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.logicalNot = spec;
})();