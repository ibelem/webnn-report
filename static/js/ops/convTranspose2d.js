(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			convTranspose2dInput: {
				descriptor: { dataType: 'float16', shape: [1, 1, 2, 2] },
				data: [
					0.58740234375, 0.60791015625, 0.0172882080078125, 0.261474609375
				]
			},
			convTranspose2dFilter: {
				descriptor: { dataType: 'float16', shape: [1, 1, 2, 2] },
				data: [
					0.329345703125, 0.5869140625, 0.297119140625, 0.003337860107421875
				]
			}
		},
		build: (builder, { convTranspose2dInput, convTranspose2dFilter }) =>
			builder.convTranspose2d(convTranspose2dInput, convTranspose2dFilter),
		expected: {
			descriptor: { dataType: 'float16', shape: [1, 1, 3, 3] },
			data: [
				0.1934814453125, 0.544921875, 0.356689453125,
				0.18017578125, 0.27880859375, 0.155517578125,
				0.005138397216796875, 0.0777587890625, 0.0008726119995117188
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('convTranspose2d', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.convTranspose2d = spec;
})();