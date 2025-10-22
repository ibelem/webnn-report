(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					73.5625, 14.484375, -69.375, -52.03125, -75.8125, -2.2734375,
					-83.3125, 15.578125, -62.6875, 32.96875, 82.5625, -74.9375,
					78.25, 48.40625, -19.15625, -85.9375, 89.125, 22.875, 80.5625,
					97.625, 52.75, 89.1875, -20.5, 99.5
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-49.125, 40.1875, 7.2265625, 89.25, -81.4375, 59.625,
					11.234375, 48.875, 85.25, 27.6875, 30.984375, -38.125,
					-83.125, -86.1875, 16.765625, 46.125, -28.4375, 28.234375,
					35.25, -77.0625, -57.875, -58.15625, 27.484375, 32
				]
			}
		},
		build: (builder, { a, b }) => builder.sub(a, b),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				122.6875, -25.703125, -76.625, -141.25, 5.625, -61.90625,
				-94.5625, -33.3125, -148, 5.28125, 51.5625, -36.8125, 161.375,
				134.625, -35.9375, -132, 117.5625, -5.359375, 45.3125, 174.75,
				110.625, 147.375, -48, 67.5
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('sub', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.sub = spec;
})();