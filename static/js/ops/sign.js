(() => {
	if (typeof window === 'undefined') {
		return;
	}
	const spec = {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [4] },
				data: [
					-0.946033775806427, 0.9996118545532227,
					0.21998752653598785, -0.22639396786689758
				]
			}
		},
		build: (builder, { input }) => builder.sign(input),
		expected: {
			descriptor: { dataType: 'float16', shape: [4] },
			data: [-1, 1, 1, -1]
		}
	};
	const register = window.registerOperationTest;
	if (typeof register === 'function') {
		register('sign', spec);
		return;
	}
	const store = window.operationTests = window.operationTests || {};
	store.sign = spec;
})();