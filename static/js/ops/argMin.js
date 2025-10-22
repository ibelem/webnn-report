(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			argMinInput: {
				descriptor: { dataType: 'float16', shape: [4, 6] },
				data: [
					3.830078125, -24.984375, 5.30078125, -48.5625, 40.3125, 60.1875,
					-82.8125, -96.5, 71.875, 38.875, -39.15625, 31.4375,
					-82.8125, -96.5, -25.53125, -16.140625, 66.625, 82.5,
					-82.8125, -96.5, 39.78125, 42.15625, 82.6875, 85.4375
				]
			}
		},
		build: (builder, { argMinInput }) => builder.argMin(argMinInput, 0),
		expected: {
			descriptor: { dataType: 'int32', shape: [6] },
			data: [1, 1, 2, 0, 1, 1]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('argMin', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.argMin = spec;
})();