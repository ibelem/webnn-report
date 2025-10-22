(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-8.046875, -5.5234375, -2.09765625, -7.45703125, -5.44921875,
					9.8046875, -3.60546875, 4.08984375, -5.06640625, 1.58203125,
					5.67578125, -4.33984375, 1.6943359375, 2.92578125, -7,
					-2.52734375, 1.443359375, 7.86328125, 5.78125, 1.87109375,
					-0.5234375, 0.434326171875, 8.9375, 1.6572265625
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-7.02734375, 1.9111328125, 3.576171875, 1.716796875,
					2.845703125, -2.3125, -6.0859375, -3.4375, -3.4765625,
					-2.1953125, 2.99609375, -5.5390625, 5.09765625, 6.77734375,
					2.451171875, 5.2109375, -9.7109375, -2.412109375, 8.6796875,
					-9.453125, 0.77001953125, -1.5185546875, -9.15625, -4.9921875
				]
			}
		},
		build: (builder, { a, b }) => builder.greaterOrEqual(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [24] },
			data: [
				0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
				0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('greaterOrEqual', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.greaterOrEqual = spec;
})();