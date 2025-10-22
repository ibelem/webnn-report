(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			inputA: {
				descriptor: { dataType: 'float16', shape: [3, 4] },
				data: [
					10.4296875, 24.46875, 55.875, 3.240234375, 87.5625, 22.40625,
					79.875, 99.625, 24.734375, 65.9375, 38.125, 87.125
				]
			},
			inputB: {
				descriptor: { dataType: 'float16', shape: [4, 5] },
				data: [
					88.1875, 78.375, 14.8203125, 3.69140625, 45.90625,
					43.09375, 47.1875, 60.9375, 8.1640625, 20.328125,
					20.4375, 27.015625, 15.6015625, 87.5, 65.8125,
					69.3125, 31.984375, 12.2890625, 13.3046875, 85.25
				]
			}
		},
		build: (builder, { inputA, inputB }) => builder.matmul(inputA, inputB),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 5] },
			data: [
				3340, 3586, 2558, 5172, 4928,
				17232, 13264, 5132, 8824, 18224,
				11840, 8864, 6052, 5124, 12416
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('matmul', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.matmul = spec;
})();