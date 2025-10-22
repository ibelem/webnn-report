const $ = selector => document.querySelector(selector);

function getBrowserInfo() {
	const browser = $("#browser");
	const chromium = $("#chromium");
	if (navigator.userAgentData && browser && chromium) {
		navigator.userAgentData.getHighEntropyValues(["fullVersionList"]).then(ua => {
			for (const entry of ua.fullVersionList) {
				if (entry.brand.toLowerCase().includes("brand")) continue;
				const brand = entry.brand
					.replace('Google ', '')
					.replace('Microsoft ', '')
					.replace('Mozilla ', '')
					.replace('Apple ', '');
				if (entry.brand.toLowerCase().includes("chromium")) {
					chromium.textContent = `${brand} ${entry.version}`;
				} else {
					browser.textContent = `${brand} ${entry.version}`;
				}
			}
		}).catch(error => console.warn('Failed to read browser info:', error));
	}
}

const float16Ctor = typeof Float16Array === 'function' ? Float16Array : Uint16Array;
const usesFloat16BitPacking = float16Ctor === Uint16Array;

const typedArrayConstructors = {
	float32: Float32Array,
	float64: Float64Array,
	float16: float16Ctor,
	int32: Int32Array,
	int16: Int16Array,
	int8: Int8Array,
	uint32: Uint32Array,
	uint16: Uint16Array,
	uint8: Uint8Array
};

function toFloat16Bits(value) {
	const floatView = new Float32Array(1);
	const intView = new Int32Array(floatView.buffer);
	floatView[0] = value;
	const x = intView[0];

	const sign = (x >>> 16) & 0x8000;
	let exponent = (x >>> 23) & 0xff;
	let mantissa = x & 0x7fffff;

	if (exponent === 0xff) {
		if (mantissa) {
			return sign | 0x7c00 | (mantissa ? 1 : 0);
		}
		return sign | 0x7c00;
	}

	if (exponent <= 112) {
		if (exponent < 103) {
			return sign;
		}
		mantissa |= 0x800000;
		const shift = 125 - exponent;
		mantissa = mantissa >>> shift;
		return sign | ((mantissa + 0x00001000) >>> 13);
	}

	if (exponent >= 143) {
		return sign | 0x7c00;
	}

	exponent = exponent - 112;
	mantissa = mantissa + 0x00001000;
	if (mantissa & 0x00800000) {
		mantissa = 0;
		exponent += 1;
	}
	return sign | (exponent << 10) | (mantissa >>> 13);
}

function float16BitsToNumber(bits) {
	const sign = (bits & 0x8000) ? -1 : 1;
	const exponent = (bits & 0x7c00) >>> 10;
	const fraction = bits & 0x03ff;

	if (exponent === 0) {
		if (fraction === 0) {
			return sign * 0;
		}
		return sign * Math.pow(2, -14) * (fraction / 0x0400);
	}

	if (exponent === 0x1f) {
		return fraction ? NaN : sign * Infinity;
	}

	return sign * Math.pow(2, exponent - 15) * (1 + fraction / 0x0400);
}

function normalizeDescriptor(spec = {}) {
	const descriptor = spec.descriptor ?? {};
	const dataType = spec.dataType ?? spec.type ?? descriptor.dataType;
	const shape = spec.shape ?? spec.dimensions ?? descriptor.shape;
	if (!dataType) {
		throw new Error('Missing dataType in descriptor.');
	}
	if (!Array.isArray(shape)) {
		throw new Error('Missing shape in descriptor.');
	}
	return { dataType, shape };
}

function getTypedArrayConstructor(dataType) {
	const ctor = typedArrayConstructors[dataType];
	if (!ctor) {
		throw new Error(`Unsupported dataType: ${dataType}`);
	}
	return ctor;
}

function createTypedArrayFromSpec(spec) {
	const { dataType } = normalizeDescriptor(spec);
	const ctor = getTypedArrayConstructor(dataType);
	let values = spec.values ?? spec.data ?? [];
	if (ArrayBuffer.isView(values)) {
		values = Array.from(values);
	} else if (!Array.isArray(values)) {
		values = [values];
	}
	if (dataType === 'float16') {
		if (usesFloat16BitPacking) {
			const result = new ctor(values.length);
			for (let i = 0; i < values.length; i += 1) {
				result[i] = toFloat16Bits(values[i]);
			}
			return result;
		}
		return new ctor(values);
	}
	return new ctor(values);
}

function product(shape) {
	return shape.reduce((total, dim) => total * dim, 1);
}

function compareWithTolerance(actual, expected, dataType) {
	if (actual.length !== expected.length) {
		return { pass: false, message: `Length mismatch (${actual.length} vs ${expected.length})` };
	}
	const isFloat = dataType.startsWith('float');
	const tolerance = dataType === 'float16' ? 1e-2 : 1e-3;
	const decodeFloat16 = value => (usesFloat16BitPacking ? float16BitsToNumber(value) : value);
	for (let i = 0; i < actual.length; i += 1) {
		const lhs = dataType === 'float16' ? decodeFloat16(actual[i]) : actual[i];
		const rhs = dataType === 'float16' ? decodeFloat16(expected[i]) : expected[i];
		if (isFloat) {
			if (!Number.isFinite(lhs) || !Number.isFinite(rhs)) {
				if (lhs !== rhs) {
					return { pass: false, message: `Non-finite mismatch at ${i}: expected ${rhs}, got ${lhs}` };
				}
			} else if (Math.abs(lhs - rhs) > tolerance) {
				return { pass: false, message: `Mismatch at ${i}: expected ${rhs}, got ${lhs}` };
			}
		} else if (lhs !== rhs) {
			return { pass: false, message: `Mismatch at ${i}: expected ${rhs}, got ${lhs}` };
		}
	}
	return { pass: true };
}

async function readGraphOutput(context, graph, outputDescriptor, outputName = 'output') {
	const tensorDescriptor = {
		dataType: outputDescriptor.dataType,
		shape: outputDescriptor.shape,
		readable: true
	};

	if (typeof context.dispatch === 'function' && typeof context.createTensor === 'function') {
		const outputTensor = await context.createTensor(tensorDescriptor);
		await context.dispatch(graph, {}, { [outputName]: outputTensor });
		const raw = await context.readTensor(outputTensor);
		if (ArrayBuffer.isView(raw)) {
			return new (getTypedArrayConstructor(outputDescriptor.dataType))(raw.buffer);
		}
		if (raw instanceof ArrayBuffer) {
			return new (getTypedArrayConstructor(outputDescriptor.dataType))(raw);
		}
		throw new Error('Unsupported tensor read result.');
	}

	if (typeof context.compute === 'function') {
		const result = await context.compute(graph, {});
		const candidate = result?.outputs?.[outputName] ?? result?.outputs?.output ?? result?.[outputName] ?? result?.output;
		if (!candidate) {
			throw new Error('Unable to read outputs from compute result.');
		}
		if (ArrayBuffer.isView(candidate)) {
			return new (getTypedArrayConstructor(outputDescriptor.dataType))(candidate.buffer);
		}
		if (candidate instanceof ArrayBuffer) {
			return new (getTypedArrayConstructor(outputDescriptor.dataType))(candidate);
		}
		throw new Error('Unsupported compute result type.');
	}

	throw new Error('No supported WebNN execution method on this context.');
}
