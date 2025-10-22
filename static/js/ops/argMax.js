(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			argMaxInput: {
				descriptor: { dataType: 'float16', shape: [4, 6] },
				data: [
					-51.09375, -6.5390625, 73.8125, 88.4375, -5.29296875, -79.1875,
					-41.6875, 73.8125, 88.4375, -84.9375, -61.5, -98.3125,
					-51.09375, -6.5390625, 73.8125, 88.4375, -5.29296875, -79.1875,
					-41.6875, 73.8125, 88.4375, -84.9375, -61.5, -98.3125
				]
			}
		},
		build: (builder, { argMaxInput }) => builder.argMax(argMaxInput, 0),
		expected: {
			descriptor: { dataType: 'int32', shape: [6] },
			data: [1, 1, 1, 0, 0, 0]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('argMax', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.argMax = spec;
})();
