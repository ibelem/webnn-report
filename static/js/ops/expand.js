(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [1] },
				data: [-6.4609375]
			}
		},
		build: (builder, { input }) => builder.expand(input, [24]),
		expected: {
			descriptor: { dataType: 'float16', shape: [24] },
			data: [
				-6.4609375, -6.4609375, -6.4609375, -6.4609375, -6.4609375,
				-6.4609375, -6.4609375, -6.4609375, -6.4609375, -6.4609375,
				-6.4609375, -6.4609375, -6.4609375, -6.4609375, -6.4609375,
				-6.4609375, -6.4609375, -6.4609375, -6.4609375, -6.4609375,
				-6.4609375, -6.4609375, -6.4609375, -6.4609375
			]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('expand', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.expand = spec;
})();
