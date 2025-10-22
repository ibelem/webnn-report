(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			clampInput: {
				descriptor: { dataType: 'float16', shape: [2, 3, 4] },
				data: [
					-9.8203125, -6.0234375, -4.07421875, -6.57421875, -7.75390625,
					9.5234375, 3.728515625, 6.48046875, -1.537109375, -7.34375,
					7.87890625, -2.056640625, 6.34375, 5.52734375, 0.84326171875,
					-8.203125, -7.78515625, 9.28125, -2.3125, 9.546875,
					5.7890625, 5.55078125, 7.41015625, -2.123046875
				]
			}
		},
		build: (builder, { clampInput }) => builder.clamp(clampInput),
		expected: {
			descriptor: { dataType: 'float16', shape: [2, 3, 4] },
			data: [
				-9.8203125, -6.0234375, -4.07421875, -6.57421875, -7.75390625,
				9.5234375, 3.728515625, 6.48046875, -1.537109375, -7.34375,
				7.87890625, -2.056640625, 6.34375, 5.52734375, 0.84326171875,
				-8.203125, -7.78515625, 9.28125, -2.3125, 9.546875,
				5.7890625, 5.55078125, 7.41015625, -2.123046875
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('clamp', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.clamp = spec;
})();