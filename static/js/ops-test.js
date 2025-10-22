const operationTests = {
	matmul: {
		inputs: {
			inputA: {
				descriptor: { dataType: 'float16', shape: [3, 4] },
				data: [
					10.4296875, 24.46875, 55.875, 3.240234375, 87.5625, 22.40625,
					79.875, 99.625, 24.734375, 65.9375, 38.125, 87.125
				]
			},
			inputB: {
				descriptor: { dataType: 'float16', shape: [4, 5] },
				data: [
					88.1875, 78.375, 14.8203125, 3.69140625, 45.90625,
					43.09375, 47.1875, 60.9375, 8.1640625, 20.328125,
					20.4375, 27.015625, 15.6015625, 87.5, 65.8125,
					69.3125, 31.984375, 12.2890625, 13.3046875, 85.25
				]
			}
		},
		build: (builder, { inputA, inputB }) => builder.matmul(inputA, inputB),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 5] },
			data: [
				3340, 3586, 2558, 5172, 4928,
				17232, 13264, 5132, 8824, 18224,
				11840, 8864, 6052, 5124, 12416
			]
		}
	},
	gemm: {
		inputs: {
			inputA: {
				descriptor: { dataType: 'float16', shape: [3, 4] },
				data: [
					0.0216827392578125, 0.85888671875, 0.48095703125, 0.487548828125,
					0.91064453125, 0.86328125, 0.8046875, 0.224853515625, 0.50341796875,
					0.5478515625, 0.67724609375, 0.66015625
				]
			},
			inputB: {
				descriptor: { dataType: 'float16', shape: [4, 5] },
				data: [
					0.83642578125, 0.473876953125, 0.363037109375, 0.5498046875,
					0.4609375, 0.281982421875, 0.421142578125, 0.2330322265625,
					0.80419921875, 0.1865234375, 0.383056640625, 0.2454833984375,
					0.038421630859375, 0.35302734375, 0.431640625, 0.82177734375,
					0.8759765625, 0.34716796875, 0.47119140625, 0.58154296875
				]
			},
			inputC: {
				descriptor: { dataType: 'float16', shape: [5] },
				data: [
					0.7314453125, 0.0292816162109375, 0.8896484375, 0.424072265625,
					0.09136962890625
				]
			}
		},
		build: (builder, { inputA, inputB, inputC }) => builder.gemm(inputA, inputB, { c: inputC }),
		expected: {
			descriptor: { dataType: 'float16', shape: [3, 5] },
			data: [
				1.5771484375, 0.9462890625, 1.28515625, 1.5263671875, 0.7529296875,
				2.23046875, 1.21875, 1.5302734375, 2.009765625, 1.150390625,
				2.109375, 1.2431640625, 1.455078125, 1.69140625, 1.1015625
			]
		}
	},
	conv2d: {
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
	},
	softmax: {
		inputs: {
			input: {
				descriptor: { dataType: 'float16', shape: [4, 6] },
				data: [
					-3.3125, -3.33984375, -3.41015625, -6.6953125, -7.89453125,
					-3.30859375, -3.23046875, -4.31640625, -9.3125, -3.923828125,
					-3.78125, -6.03515625, -3.919921875, -2.22265625, -9.328125,
					-1.48828125, -6.3046875, -5.53125, -1.841796875, -4.99609375,
					-9.5234375, -4.984375, -8.421875, -6.234375
				]
			}
		},
		build: (builder, { input }) => builder.softmax(input, 1),
		expected: {
			descriptor: { dataType: 'float16', shape: [4, 6] },
			data: [
				0.254638671875, 0.2476806640625, 0.2308349609375,
				0.00864410400390625, 0.002605438232421875, 0.255615234375,
				0.40380859375, 0.1363525390625, 0.0009222030639648438,
				0.2017822265625, 0.2327880859375, 0.024444580078125,
				0.055145263671875, 0.301025390625, 0.00024700164794921875,
				0.62744140625, 0.0050811767578125, 0.01100921630859375,
				0.9091796875, 0.038787841796875, 0.00041937828063964844,
				0.03924560546875, 0.0012617111206054688, 0.0112457275390625
			]
		}
	}
};

function setOperationStatus(device, op, status, message = '') {
	const el = document.getElementById(`${device}-op-${op}`);
	if (!el) return;
	el.classList.remove('na');
	if (!message) {
		el.removeAttribute('title');
	} else {
		el.setAttribute('title', message);
	}
	if (status === 'pass') {
		el.innerHTML = '<span class="pass"></span>';
	} else if (status === 'fail') {
		el.innerHTML = '<span class="fail"></span>';
	} else {
		el.textContent = 'n/a';
		el.classList.add('na');
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
	for (const device of devices) {
		const context = contextMap[device];
		for (const op of Object.keys(operationTests)) {
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
