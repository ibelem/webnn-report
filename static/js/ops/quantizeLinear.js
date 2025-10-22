(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [4] },
				data: [-2.548828125, -4.79296875, 8.4140625, 6.109375]
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
			builder.quantizeLinear(input, scale, zeroPoint),
		expected: {
			descriptor: { dataType: 'uint8', shape: [4] },
			data: [128, 111, 130, 133]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('quantizeLinear', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.quantizeLinear = spec;
})();
