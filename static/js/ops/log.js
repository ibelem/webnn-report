(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					63.8125, 25.3125, 96.4375, 40.90625, 36.59375, 57.8125,
					10.0546875, 17.84375, 50.78125, 83.875, 12.0625, 22.703125,
					47.5625, 17.546875, 32.65625, 20.359375, 52.53125, 45.59375,
					30.390625, 13.7109375, 10.3984375, 50.84375, 5.68359375, 94
				]
			}
		},
		build: (builder, { input }) => builder.log(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				4.15625, 3.23046875, 4.5703125, 3.7109375, 3.599609375, 4.05859375,
				2.30859375, 2.880859375, 3.927734375, 4.4296875, 2.490234375,
				3.123046875, 3.861328125, 2.865234375, 3.486328125, 3.013671875,
				3.9609375, 3.8203125, 3.4140625, 2.619140625, 2.341796875, 3.9296875,
				1.7373046875, 4.54296875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('log', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.log = spec;
})();