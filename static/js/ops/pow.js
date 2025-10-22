(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			base: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					17.84375, -0.0631103515625, -9.8671875, 11.1796875, -17.34375,
					11.859375, -16.828125, 2.658203125, -2.783203125, -13.7578125,
					13.1328125, -0.437744140625, -15.6796875, 10.28125, 14.890625,
					-4.94140625, -14.234375, 3.263671875, 17.234375, -2.88671875,
					-1.4404296875, -5.7578125, 17.40625, 17.421875
				]
			},
			exponent: {
				descriptor: { dataType: 'float16', shape: [24] },
				data: [
					1, 3, -7, 2, -2, 1, 2, -10, -2, -5, -2, -10,
					-8, -7, -1, -3, -9, 2, -6, 3, -5, -5, 2, -6
				]
			}
		},
		build: (builder, { base, exponent }) => builder.pow(base, exponent),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				17.84375, -0.0002512931823730469, -1.1920928955078125e-7, 125,
				0.0033245086669921875, 11.859375, 283.25,
				0.000056743621826171875, 0.129150390625,
				-0.0000020265579223632812, 0.00579833984375, 3870, 0,
				5.960464477539063e-8, 0.067138671875, -0.0082855224609375, 0,
				10.6484375, 5.960464477539063e-8, -24.0625, -0.1612548828125,
				-0.00015807151794433594, 303, 5.960464477539063e-8
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('pow', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.pow = spec;
})();