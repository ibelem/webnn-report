const opSupportLimitsDefinedInSpec = {
	"dequantizeLinear": {
		"input": {
			"dataTypes": [
				"int32",
				"uint32",
				"int8",
				"uint8"
			]
		},
		"output": {
			"dataTypes": [
				"float32",
				"float16"
			]
		},
		"scale": {
			"dataTypes": [
				"float32",
				"float16"
			]
		},
		"zeroPoint": {
			"dataTypes": [
				"int32",
				"uint32",
				"int8",
				"uint8"
			]
		}
	},
	"quantizeLinear": {
		"input": {
			"dataTypes": [
				"float32",
				"float16"
			]
		},
		"output": {
			"dataTypes": [
				"int8",
				"uint8",
				"int32",
				"uint32"
			]
		},
		"scale": {
			"dataTypes": [
				"float32",
				"float16"
			]
		},
		"zeroPoint": {
			"dataTypes": [
				"int8",
				"uint8",
				"int32",
				"uint32"
			]
		}
	}
};

function fillDeviceFeatures(device, json) {
	if (json.preferredInputLayout !== undefined) {
		const el = document.getElementById(`${device}-preferredInputLayout`);
		if (el) el.textContent = json.preferredInputLayout;
	}
	if (json.maxTensorByteLength !== undefined) {
		const el = document.getElementById(`${device}-maxTensorByteLength`);
		if (el) el.textContent = json.maxTensorByteLength;
	}
}

function markSupportStates(prefix, specEntry, implEntry) {
	const specTypes = Array.isArray(specEntry?.dataTypes) ? specEntry.dataTypes : [];
	const implTypes = Array.isArray(implEntry?.dataTypes) ? implEntry.dataTypes : [];
	const implTypeSet = new Set(implTypes);

	specTypes.forEach(type => {
		const el = document.getElementById(`${prefix}-dataType-${type}`);
		if (!el) return;
		el.innerHTML = implTypeSet.has(type) ? '<span class="pass"></span>' : '<span class="fail"></span>';
	});

	if (implEntry?.rankRange) {
		if ('min' in implEntry.rankRange) {
			const el = document.getElementById(`${prefix}-rankRange-min`);
			if (el) el.textContent = implEntry.rankRange.min;
		}
		if ('max' in implEntry.rankRange) {
			const el = document.getElementById(`${prefix}-rankRange-max`);
			if (el) el.textContent = implEntry.rankRange.max;
		}
	}
}

function fillSpecialRows(prefix, specEntry, implEntry) {
	markSupportStates(prefix, specEntry, implEntry);
}

function updateOpSupportLimits(device, json) {
	fillDeviceFeatures(device, json);

	const fillCell = id => {
		const el = $("#" + id);
		if (el) el.innerHTML = '<span class="pass"></span>';
	};

	const fillRank = (id, value) => {
		const el = $("#" + id);
		if (el) el.textContent = value;
	};

	if (json.constant) fillSpecialRows(`${device}-constant`, null, json.constant);
	if (json.input) fillSpecialRows(`${device}-input`, null, json.input);
	if (json.output) fillSpecialRows(`${device}-output`, null, json.output);

	for (const [opName, opValue] of Object.entries(json)) {
		if (
			typeof opValue !== 'object' ||
			Array.isArray(opValue) ||
			['constant', 'input', 'output', 'preferredInputLayout', 'maxTensorByteLength'].includes(opName)
		) {
			continue;
		}
		const specOpEntry = opSupportLimitsDefinedInSpec[opName] ?? {};

		if (Array.isArray(opValue.dataTypes)) {
			markSupportStates(`${device}-${opName}`, specOpEntry, opValue);
			continue;
		}

		const specOpSubEntries = typeof specOpEntry === 'object' && !Array.isArray(specOpEntry) ? specOpEntry : {};

		for (const [subName, subValue] of Object.entries(opValue)) {
			if (!subValue || typeof subValue !== 'object') continue;
			const specSubEntry = specOpSubEntries[subName] ?? null;
			markSupportStates(`${device}-${opName}-${subName}`, specSubEntry, subValue);
		}
	}
}

async function runOpSupportLimitsTests() {
	const cpuDiv = $('#cpu');
	const gpuDiv = $('#gpu');
	const npuDiv = $('#npu');
	const nextNpuDiv = $('#next-npu');
	const contexts = {};

	if (!navigator.ml?.createContext) {
		const message = 'WebNN is not available in this browser.';
		if (cpuDiv) {
			cpuDiv.textContent = message;
			cpuDiv.setAttribute('class', 'cpu fail');
		}
		if (gpuDiv) {
			gpuDiv.textContent = message;
			gpuDiv.setAttribute('class', 'gpu fail');
		}
		if (npuDiv) {
			npuDiv.textContent = message;
			npuDiv.setAttribute('class', 'npufail');
		}
		if (nextNpuDiv) {
			nextNpuDiv.textContent = message;
			nextNpuDiv.setAttribute('class', 'npufail');
		}
		return contexts;
	}

	try {
		const cpuContext = await navigator.ml.createContext({ deviceType: 'cpu' });
		contexts.cpu = cpuContext;
		try {
			const cpuJson = cpuContext.opSupportLimits();
			console.log('-- cpu --');
			console.log(cpuJson);
			updateOpSupportLimits('cpu', cpuJson);
		} catch (error) {
			console.warn('Failed to read CPU op support limits:', error);
		}
	} catch (error) {
		if (cpuDiv) {
			cpuDiv.textContent = 'Failed to create CPU device context';
			cpuDiv.setAttribute('class', 'cpu fail');
		}
		contexts.cpu = null;
	}

	try {
		const gpuContext = await navigator.ml.createContext({ deviceType: 'gpu' });
		contexts.gpu = gpuContext;
		try {
			const gpuJson = gpuContext.opSupportLimits();
			console.log('-- gpu --');
			console.log(gpuJson);
			updateOpSupportLimits('gpu', gpuJson);
		} catch (error) {
			console.warn('Failed to read GPU op support limits:', error);
		}
	} catch (error) {
		if (gpuDiv) {
			gpuDiv.textContent = 'Failed to create GPU device context';
			gpuDiv.setAttribute('class', 'gpu fail');
		}
		contexts.gpu = null;
	}

	try {
		const npuContext = await navigator.ml.createContext({ deviceType: 'npu' });
		contexts.npu = npuContext;
		try {
			const npuJson = npuContext.opSupportLimits();
			console.log('-- npu --');
			console.log(npuJson);
			updateOpSupportLimits('npu', npuJson);
		} catch (error) {
			console.warn('Failed to read NPU op support limits:', error);
		}
	} catch (error) {
		if (npuDiv) {
			npuDiv.textContent = 'NPU device is not supported';
			npuDiv.setAttribute('class', 'npufail');
		}
		if (nextNpuDiv) {
			nextNpuDiv.textContent = 'NPU device is not supported';
			nextNpuDiv.setAttribute('class', 'npufail');
		}
		contexts.npu = null;
	}

	return contexts;
}
