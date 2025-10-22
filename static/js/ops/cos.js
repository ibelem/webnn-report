(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					85.5625, -45.09375, -94.6875, 83.5, -31.375, 70.1875,
					-90.375, -83, 61.53125, -32.53125, -48.375, -58.03125,
					89.8125, -84.5625, -58.21875, -76.125, -59.0625, 77.375,
					-98.6875, -63.625, 26.859375, 83.6875, 76.5625, -47.84375
				]
			}
		},
		build: (builder, { input }) => builder.cos(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-0.73876953125, 0.443359375, 0.90478515625, -0.2452392578125,
				0.9990234375, 0.47802734375, -0.744140625, 0.24951171875,
				0.266845703125, 0.43994140625, -0.314208984375, 0.08807373046875,
				-0.273681640625, -0.96630859375, -0.09912109375, 0.74755859375,
				-0.8095703125, -0.39501953125, -0.269287109375, 0.70166015625,
				-0.1551513671875, -0.421630859375, 0.3955078125, -0.751953125
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('cos', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.cos = spec;
})();