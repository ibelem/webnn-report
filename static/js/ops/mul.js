(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					49.125, 11.90625, -21.109375, 70.75, -94.5, -93.8125,
					11.1796875, -32.8125, 83.3125, 91.125, -0.11236572265625,
					15.3984375, -13.4609375, -50.625, -31.171875, -6.6171875,
					21.734375, 22.03125, -84, -94.0625, 58.8125, -63.0625,
					3.30859375, 9.8828125
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					74.9375, -34.53125, -33.3125, 53.90625, -83.6875, 19.78125,
					36.28125, -34.3125, 49.09375, -54.53125, 70.75, -55.1875,
					-93.9375, 60.09375, -92.75, 87.625, -8.8828125, 71.8125,
					-26.15625, -18.9375, 34.65625, -60.96875, -11.1171875, 77.5
				]
			}
		},
		build: (builder, { a, b }) => builder.mul(a, b),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				3682, -411.25, 703, 3814, 7908, -1856, 405.5, 1126, 4090,
				-4968, -7.94921875, -850, 1264, -3042, 2892, -580, -193, 1582,
				2198, 1781, 2038, 3844, -36.78125, 766
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('mul', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.mul = spec;
})();