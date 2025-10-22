(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					79.75, 55, -28.046875, -31.640625, 56.28125, -96.1875, -73,
					-3.423828125, 84, 5.03125, -9.515625, 9.5390625, -25.265625,
					-20.828125, -32.03125, -55.6875, 15.9296875, -57.875, 31.015625,
					-94.875, -84.5625, 44.84375, -19, -48.03125
				]
			}
		},
		build: (builder, { input }) => builder.sin(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-0.935546875, -0.99951171875, -0.2254638671875,
				-0.2227783203125, -0.26416015625, -0.9326171875, 0.6767578125,
				0.278564453125, 0.7333984375, -0.94970703125, 0.0906982421875,
				-0.114013671875, -0.1324462890625, -0.91796875, -0.5771484375,
				0.7587890625, -0.219970703125, -0.97021484375, -0.3896484375,
				-0.5869140625, -0.257568359375, 0.7587890625, -0.14990234375,
				0.7880859375
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('sin', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.sin = spec;
})();