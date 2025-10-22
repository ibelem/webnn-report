(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			a: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					-1.1474609375, -8.40625, -2.275390625, -0.5771484375,
					8.171875, -0.9072265625, 5.2890625, -3.9140625, 9.828125,
					-8.9296875, -3.45703125, -7.33203125, 1.232421875, 4.3125,
					1.271484375, 4.18359375, -6.7109375, 3.076171875,
					1.0029296875, -9.078125, 8.90625, 4.234375, 2.1015625,
					-6.203125
				]
			},
			b: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					2.9453125, 3.73046875, 4.0234375, -4.71875, 6.7734375,
					-2.04296875, -6.52734375, 6.828125, -9.265625, 6.1171875,
					-2.001953125, 1.7802734375, 9.65625, -2.748046875,
					-3.43359375, -4.75, -6.09375, -0.43359375, -1.4072265625,
					-0.2374267578125, -9.109375, 6.8125, -6.76953125, -8.953125
				]
			}
		},
		build: (builder, { a, b }) => builder.lesser(a, b),
		expected: {
			descriptor: { dataType: 'uint8', shape: [24] },
			data: [
				1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1,
				1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('lesser', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.lesser = spec;
})();