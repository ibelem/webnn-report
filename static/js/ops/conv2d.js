(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [1, 1, 5, 5] },
				data: [
					0.6123046875, 0.8857421875, 0.13671875,
					0.564453125, 0.896484375, 0.367919921875,
					0.68115234375, 0.047943115234375, 0.33349609375,
					0.1988525390625, 0.41162109375, 0.079345703125,
					0.42724609375, 0.53564453125, 0.59130859375,
					0.2841796875, 0.414794921875, 0.0269012451171875,
					0.362060546875, 0.99462890625, 0.07183837890625,
					0.1220703125, 0.84228515625, 0.453857421875,
					0.21533203125
				]
			},
			filter: {
				descriptor: { dataType: 'float16', shape: [1, 1, 3, 3] },
				data: [
					0.38037109375, 0.52783203125, 0.219482421875,
					0.366943359375, 0.33984375, 0.419921875,
					0.380615234375, 0.1944580078125, 0.56884765625
				]
			}
		},
		build: (builder, { input, filter }) => builder.conv2d(input, filter),
		expected: {
			descriptor: { dataType: 'float16', shape: [1, 1, 3, 3] },
			data: [
				1.5322265625, 1.357421875, 1.3642578125,
				1.0712890625, 1.1259765625, 1.4716796875,
				1.0791015625, 1.1552734375, 1.6572265625
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('conv2d', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.conv2d = spec;
})();