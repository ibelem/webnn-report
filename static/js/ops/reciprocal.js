(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-1.0107421875, 4.62109375, 2.41796875, -8.9375, -3.34765625,
					-8.8046875, 8.828125, 6.57421875, 6.640625, 2.68359375,
					-4.62890625, -6.875, -1.185546875, 0.95751953125,
					0.0213165283203125, 0.3564453125, 4.828125, 1.3125, 8.25,
					-0.203857421875, -9.0390625, 9.9453125, -9.5390625,
					-0.0802001953125
				]
			}
		},
		build: (builder, { input }) => builder.reciprocal(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-0.9892578125, 0.2164306640625, 0.41357421875,
				-0.11187744140625, -0.298828125, -0.11358642578125, 0.11328125,
				0.152099609375, 0.150634765625, 0.37255859375, -0.216064453125,
				-0.1455078125, -0.84326171875, 1.0439453125, 46.90625, 2.8046875,
				0.2071533203125, 0.76171875, 0.1212158203125, -4.90625,
				-0.11065673828125, 0.10052490234375, -0.1048583984375, -12.46875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('reciprocal', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.reciprocal = spec;
})();