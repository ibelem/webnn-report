(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					7.2578125, 7.78515625, 1.3681640625, 8.0546875, 9.1328125,
					8.5234375, 4.87109375, 7.625, 2.705078125, 8.7109375, 3.26953125,
					4.7109375, 8.671875, 8.828125, 0.552734375, 7.95703125,
					4.09765625, 7.91796875, 4.42578125, 0.09893798828125,
					4.69140625, 1.52734375, 5.9296875, 6.06640625
				]
			}
		},
		build: (builder, { input }) => builder.sqrt(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				2.693359375, 2.791015625, 1.169921875, 2.837890625,
				3.021484375, 2.919921875, 2.20703125, 2.76171875, 1.64453125,
				2.951171875, 1.80859375, 2.169921875, 2.9453125, 2.970703125,
				0.74365234375, 2.8203125, 2.0234375, 2.814453125, 2.103515625,
				0.314453125, 2.166015625, 1.236328125, 2.435546875, 2.462890625
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('sqrt', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.sqrt = spec;
})();

 
(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					52.6875, 70.0625, 90.5, 24.65625, 11.6640625, -50.9375,
					40.3125, -9.640625, -31.5625, 5.59375, -55.9375, -44.59375,
					80.4375, -2.314453125, -25.46875, 62.59375, -70.9375, 62.84375,
					84.8125, -95.5625, 15.5546875, -55.25, -26.890625,
					0.1593017578125
				]
			}
		},
		build: (builder, { input }) => builder.tan(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-0.87646484375, 1.390625, -0.693359375, -0.51611328125,
				-1.2666015625, -0.79541015625, -0.58349609375, -0.21923828125,
				-0.1475830078125, -0.82421875, 0.70068359375, -0.701171875,
				-2.94921875, 1.0869140625, -0.349365234375, -0.24267578125,
				3.888671875, 0.01189422607421875, -0.01050567626953125,
				-3.8203125, -0.154541015625, 3.583984375, 5.28125, 0.16064453125
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('tan', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.tan = spec;
})();
