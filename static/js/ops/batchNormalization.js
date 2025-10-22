(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			bnInput: {
				descriptor: { dataType: 'float16', shape: [4, 6] },
				data: [
					-41.3125, 64.0625, -63.375, -46.78125, 83,
					-80.0625, -62.15625, -0.10009765625, -40.90625, 56.96875,
					37.375, 57.03125, 82.0625, -86.125, 76.875,
					97.0625, -21.34375, -96.9375, -9.359375, 80.1875,
					-85.375, 62.34375, -68.5, -12.109375
				]
			},
			bnMean: {
				descriptor: { dataType: 'float16', shape: [6] },
				data: [-7.8125, -95.625, 38.15625, -55.9375, -87.875, -41.625]
			},
			bnVariance: {
				descriptor: { dataType: 'float16', shape: [6] },
				data: [60.3125, 26.4375, 53.28125, 40.15625, 59.40625, 36]
			}
		},
		build: (builder, { bnInput, bnMean, bnVariance }) =>
			builder.batchNormalization(bnInput, bnMean, bnVariance),
		expected: {
			descriptor: { dataType: 'float16', shape: [4, 6] },
			data: [
				-4.3125, 31.0625, -13.90625, 1.4453125, 22.171875,
				-6.40625, -6.99609375, 18.578125, -10.828125, 17.8125,
				16.25, 16.4375, 11.5703125, 1.84765625, 5.3046875,
				24.140625, 8.6328125, -9.21875, -0.19921875, 34.1875,
				-16.921875, 18.671875, 2.513671875, 4.91796875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('batchNormalization', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.batchNormalization = spec;
})();