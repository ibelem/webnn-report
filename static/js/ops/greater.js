(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-5.39453125, -7.1875, -3.107421875, 4.9765625, 5.11328125,
					-1.5390625, 1.4140625, -0.93603515625, -6.03125,
					-3.013671875, 0.1708984375, 7.39453125, 7.1796875,
					-4.828125, -2.01953125, -3.267578125, 8.9453125,
					-5.93359375, 0.70703125, 2.77734375, 0.97900390625,
					-6.25390625, 4.41015625, -6.7734375
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-6.15625, -4.0234375, 5.953125, 2.306640625, -2.76953125,
					-0.97119140625, 1.22265625, 4.58984375, 9.1015625,
					-4.99609375, -4.80859375, 8.921875, 0.900390625,
					-2.841796875, -2.828125, 8.4765625, -7.83984375,
					9.2109375, 4.98046875, -2.5078125, -4.51953125, 8.3515625,
					-6.16015625, 0.736328125
				]
			}
		},
		build: (builder, { a, b }) => builder.greater(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [24] },
			data: [
				1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0,
				1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('greater', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.greater = spec;
})();