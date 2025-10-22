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

function fillSpecialRows(prefix, data) {
	if (Array.isArray(data.dataTypes)) {
		for (const type of data.dataTypes) {
			const el = document.getElementById(`${prefix}-dataType-${type}`);
			if (el) el.innerHTML = '<span class="pass"></span>';
		}
	}

	if (data.rankRange) {
		if ('min' in data.rankRange) {
			const el = document.getElementById(`${prefix}-rankRange-min`);
			if (el) el.textContent = data.rankRange.min;
		}
		if ('max' in data.rankRange) {
			const el = document.getElementById(`${prefix}-rankRange-max`);
			if (el) el.textContent = data.rankRange.max;
		}
	}
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

	if (json.constant) fillSpecialRows(`${device}-constant`, json.constant);
	if (json.input) fillSpecialRows(`${device}-input`, json.input);
	if (json.output) fillSpecialRows(`${device}-output`, json.output);

	for (const [opName, opValue] of Object.entries(json)) {
		if (
			typeof opValue !== 'object' ||
			Array.isArray(opValue) ||
			['constant', 'input', 'output', 'preferredInputLayout', 'maxTensorByteLength'].includes(opName)
		) {
			continue;
		}

		if (Array.isArray(opValue.dataTypes)) {
			for (const type of opValue.dataTypes) {
				fillCell(`${device}-${opName}-dataType-${type}`);
			}
			if (opValue.rankRange) {
				if ('min' in opValue.rankRange) fillRank(`${device}-${opName}-rankRange-min`, opValue.rankRange.min);
				if ('max' in opValue.rankRange) fillRank(`${device}-${opName}-rankRange-max`, opValue.rankRange.max);
			}
			continue;
		}

		for (const [subName, subValue] of Object.entries(opValue)) {
			if (!subValue || typeof subValue !== 'object') continue;
			if (Array.isArray(subValue.dataTypes)) {
				for (const type of subValue.dataTypes) {
					fillCell(`${device}-${opName}-${subName}-dataType-${type}`);
				}
			}
			if (subValue.rankRange) {
				if ('min' in subValue.rankRange) fillRank(`${device}-${opName}-${subName}-rankRange-min`, subValue.rankRange.min);
				if ('max' in subValue.rankRange) fillRank(`${device}-${opName}-${subName}-rankRange-max`, subValue.rankRange.max);
			}
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
