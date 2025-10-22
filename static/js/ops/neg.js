(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-58.34375, 94.25, -67.6875, -36.0625, 17.109375, 59.25,
					-43.78125, -14.875, 22.515625, 98.6875, 2.31640625, -89.875,
					-14.2890625, 16.21875, -4.6875, -44.46875, -52.125, 24.171875,
					-66.4375, -11.171875, -25.03125, 22.265625, 35.28125, -86.1875
				]
			}
		},
		build: (builder, { input }) => builder.neg(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				58.34375, -94.25, 67.6875, 36.0625, -17.109375, -59.25,
				43.78125, 14.875, -22.515625, -98.6875, -2.31640625, 89.875,
				14.2890625, -16.21875, 4.6875, 44.46875, 52.125, -24.171875,
				66.4375, 11.171875, 25.03125, -22.265625, -35.28125, 86.1875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('neg', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.neg = spec;
})();