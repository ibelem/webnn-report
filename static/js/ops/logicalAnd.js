(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'uint8', shape: [2, 2, 2, 3] },
				data: [
					0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 8, 8,
					0, 0, 8, 8, 0, 0, 255, 255, 0, 0, 255, 255
				]
			},
			b: {
				descriptor: { dataType: 'uint8', shape: [2, 2, 2, 3] },
				data: [
					0, 1, 0, 1, 0, 2, 0, 2, 0, 8, 0, 8,
					0, 2, 0, 2, 0, 255, 0, 255, 0, 8, 0, 8
				]
			}
		},
		build: (builder, { a, b }) => builder.logicalAnd(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [2, 2, 2, 3] },
			data: [
				0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
				0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('logicalAnd', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.logicalAnd = spec;
})();