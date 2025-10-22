(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			cumulativeSumInput: {
				descriptor: { dataType: 'float16', shape: [1, 1, 3, 4] },
				data: [
					60.4375, -86.9375, -19.5, -15.1484375, 13.453125, 45.4375, 61.09375,
					70.75, -31.28125, 56.09375, 39, -3.275390625
				]
			}
		},
		build: (builder, { cumulativeSumInput }) =>
			builder.cumulativeSum(cumulativeSumInput, 3),
		expected: {
			descriptor: { dataType: 'float16', shape: [1, 1, 3, 4] },
			data: [
				60.4375, -26.5, -46, -61.15625, 13.453125, 58.875, 120, 190.75,
				-31.28125, 24.8125, 63.8125, 60.53125
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('cumulativeSum', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.cumulativeSum = spec;
})();