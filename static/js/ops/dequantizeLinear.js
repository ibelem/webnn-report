(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'uint8', shape: [4] },
				data: [12, 24, 35, 123]
			},
			scale: {
				descriptor: { dataType: 'float16', shape: [4] },
				data: [9.34375, 0.280029296875, 4.6171875, 1.1201171875]
			},
			zeroPoint: {
				descriptor: { dataType: 'uint8', shape: [4] },
				data: [128, 128, 128, 128]
			}
		},
		build: (builder, { input, scale, zeroPoint }) =>
			builder.dequantizeLinear(input, scale, zeroPoint),
		expected: {
			descriptor: { dataType: 'float16', shape: [4] },
			data: [-1084, -29.125, -429.5, -5.6015625]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('dequantizeLinear', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.dequantizeLinear = spec;
})();
