const operationTests = (() => {
	if (typeof window === 'undefined') {
		return {};
	}
	if (!window.operationTests) {
		window.operationTests = {};
	}
	const store = window.operationTests;
	if (typeof window.registerOperationTest !== 'function') {
		window.registerOperationTest = function registerOperationTest(name, spec) {
			if (!name) {
				throw new Error('Operation name is required.');
			}
			if (!spec || typeof spec !== 'object') {
				throw new Error('Operation spec must be an object.');
			}
			if (store[name]) {
				console.warn(`Operation test "${name}" is being overwritten.`);
			}
			store[name] = spec;
		};
	}
	return store;
})();

function setOperationStatus(device, op, status, message = '') {
	const el = document.getElementById(`${device}-op-${op}`);
	if (!el) return;
	el.classList.remove('na');
	if (!message) {
		el.removeAttribute('title');
	} else {
		el.setAttribute('title', message);
	}
  const elSvg = document.querySelector(`#${device}-op-${op} svg`);
	if (status === 'pass') {
		elSvg.setAttribute('class', 'pass');
	} else if (status === 'fail') {
		elSvg.setAttribute('class', 'fail');
	} else {
		elSvg.setAttribute('class', 'na');
	}
}

async function runSingleOperationTest(context, opName, testSpec) {
	const builder = new MLGraphBuilder(context);
	const operands = {};
	for (const [name, spec] of Object.entries(testSpec.inputs)) {
		const normalized = normalizeDescriptor(spec);
		const data = createTypedArrayFromSpec(spec);
		const expectedLength = product(normalized.shape);
		if (data.length !== expectedLength) {
			throw new Error(`Input ${name} for ${opName} expects ${expectedLength} values but received ${data.length}.`);
		}
		operands[name] = builder.constant(
			{ dataType: normalized.dataType, shape: normalized.shape },
			data
		);
	}

	const outputOperand = testSpec.build(builder, operands);
	const graph = await builder.build({ output: outputOperand });
	const outputDescriptor = normalizeDescriptor(testSpec.expected);
	const expectedLength = product(outputDescriptor.shape);
	const expected = createTypedArrayFromSpec(testSpec.expected);
	if (expected.length !== expectedLength) {
		throw new Error(`Expected data for ${opName} should contain ${expectedLength} values but has ${expected.length}.`);
	}

	const actual = await readGraphOutput(context, graph, outputDescriptor);
	return compareWithTolerance(actual, expected, outputDescriptor.dataType);
}

async function runOperationTests(contextMap = {}) {
	const devices = ['gpu', 'cpu', 'npu'];
	const operationNames = Object.keys(operationTests);
	if (operationNames.length === 0) {
		console.warn('No operation tests registered.');
		return;
	}
	for (const device of devices) {
		const context = contextMap[device];
		for (const op of operationNames) {
			if (!context) {
				setOperationStatus(device, op, 'na', 'Context not available.');
				continue;
			}
			try {
				const result = await runSingleOperationTest(context, op, operationTests[op]);
				if (result.pass) {
					setOperationStatus(device, op, 'pass');
				} else {
					setOperationStatus(device, op, 'fail', result.message);
				}
			} catch (error) {
				console.error(`Operation test failed for ${op} on ${device}:`, error);
				setOperationStatus(device, op, 'fail', error.message ?? 'Operation test failed.');
			}
		}
	}
}
