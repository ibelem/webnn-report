(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					2.806640625, 5.58984375, 2.85546875, 4.99609375, 0.97265625,
					-4.7421875, 2.806640625, 5.58984375, -5.109375, 6.625,
					-2.3203125, -7.0546875, 2.806640625, 5.58984375, 4.98046875,
					-5.44140625, 1.1455078125, 7.7734375, 2.806640625, 5.58984375,
					-6.24609375, -2.849609375, -2.6953125, 5.81640625
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					2.806640625, 5.58984375, -4.83984375, 4.99609375, 0.97265625,
					-6.171875, 2.806640625, 5.58984375, 7.765625, -4.30859375,
					-5.89453125, -8.53125, 2.806640625, 5.58984375,
					0.1783447265625, -4.48046875, 0.68212890625, -6.6875,
					2.806640625, 5.58984375, -9.0390625, -1.97265625,
					-3.01171875, 3.626953125
				]
			}
		},
		build: (builder, { a, b }) => builder.equal(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [24] },
			data: [
				1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0,
				1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('equal', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.equal = spec;
})();