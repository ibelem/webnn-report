(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					52.6875, 70.0625, 90.5, 24.65625, 11.6640625, -50.9375,
					40.3125, -9.640625, -31.5625, 5.59375, -55.9375, -44.59375,
					80.4375, -2.314453125, -25.46875, 62.59375, -70.9375, 62.84375,
					84.8125, -95.5625, 15.5546875, -55.25, -26.890625,
					0.1593017578125
				]
			}
		},
		build: (builder, { input }) => builder.tan(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-0.87646484375, 1.390625, -0.693359375, -0.51611328125,
				-1.2666015625, -0.79541015625, -0.58349609375, -0.21923828125,
				-0.1475830078125, -0.82421875, 0.70068359375, -0.701171875,
				-2.94921875, 1.0869140625, -0.349365234375, -0.24267578125,
				3.888671875, 0.01189422607421875, -0.01050567626953125,
				-3.8203125, -0.154541015625, 3.583984375, 5.28125, 0.16064453125
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('tan', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.tan = spec;
})();