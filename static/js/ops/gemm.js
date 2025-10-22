(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			inputA: {
				descriptor: { dataType: 'float16', shape: [3, 4] },
				data: [
					0.0216827392578125, 0.85888671875, 0.48095703125, 0.487548828125,
					0.91064453125, 0.86328125, 0.8046875, 0.224853515625, 0.50341796875,
					0.5478515625, 0.67724609375, 0.66015625
				]
			},
			inputB: {
				descriptor: { dataType: 'float16', shape: [4, 5] },
				data: [
					0.83642578125, 0.473876953125, 0.363037109375, 0.5498046875,
					0.4609375, 0.281982421875, 0.421142578125, 0.2330322265625,
					0.80419921875, 0.1865234375, 0.383056640625, 0.2454833984375,
					0.038421630859375, 0.35302734375, 0.431640625, 0.82177734375,
					0.8759765625, 0.34716796875, 0.47119140625, 0.58154296875
				]
			},
			inputC: {
				descriptor: { dataType: 'float16', shape: [5] },
				data: [
					0.7314453125, 0.0292816162109375, 0.8896484375, 0.424072265625,
					0.09136962890625
				]
			}
		},
		build: (builder, { inputA, inputB, inputC }) => builder.gemm(inputA, inputB, { c: inputC }),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 5] },
			data: [
				1.5771484375, 0.9462890625, 1.28515625, 1.5263671875, 0.7529296875,
				2.23046875, 1.21875, 1.5302734375, 2.009765625, 1.150390625,
				2.109375, 1.2431640625, 1.455078125, 1.69140625, 1.1015625
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('gemm', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.gemm = spec;
})();