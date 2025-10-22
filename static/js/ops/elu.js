(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					4.72265625, 0.376953125, 1.4189453125, -3.8671875, 1.359375,
					-3.86328125, 7.83984375, -6.69140625, 0.54541015625, 5.77734375,
					7.26171875, -7.421875, 5.6640625, -6.71484375, -3.333984375,
					-1.2099609375, 7.25390625, 8.90625, -4.01953125, 7.11328125,
					-0.11212158203125, -3.689453125, 6.13671875, -9.8984375
				]
			}
		},
		build: (builder, { input }) => builder.elu(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				4.72265625, 0.376953125, 1.4189453125, -0.97900390625, 1.359375,
				-0.97900390625, 7.83984375, -0.99853515625, 0.54541015625,
				5.77734375, 7.26171875, -0.99951171875, 5.6640625, -0.9990234375,
				-0.96435546875, -0.70166015625, 7.25390625, 8.90625,
				-0.98193359375, 7.11328125, -0.1060791015625, -0.97509765625,
				6.13671875, -1
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('elu', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.elu = spec;
})();
