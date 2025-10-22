(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-8.28125, -3.21875, -6.54296875, -0.54052734375, -5.4140625,
					5.58203125, 1.501953125, 6.59375, -9.921875, -7.13671875,
					-4.9140625, -9.140625, 9.40625, -9.828125, -2.01171875,
					-6.59765625, -8.265625, 8.28125, 1.6455078125, -1.486328125,
					-5, -0.9208984375, -9.4375, 9.8125
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					5.5, 1.7666015625, -2.81640625, -6.046875, 9.5, -2.1015625,
					-4.078125, 5.3125, 0.038726806640625, -0.307373046875,
					4.9765625, 3.462890625, 8.609375, 1.513671875, 2.009765625,
					-0.310546875, -4.24609375, -3.55078125, -2.595703125, -5,
					3.119140625, 9.703125, 9.546875, -6.19140625
				]
			}
		},
		build: (builder, { a, b }) => builder.lesserOrEqual(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [24] },
			data: [
				1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1,
				0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('lesserOrEqual', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.lesserOrEqual = spec;
})();