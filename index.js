// Comprehensive WebNN IDL feature tests
const tests = [
  // NavigatorML
  {
    interface: 'navigator.ml',
    name: 'navigator.ml',
    test: () => 'ml' in navigator
  },
  // ML interface
  {
    interface: 'ML',
    name: 'powerPreference: default',
    test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext({ powerPreference: "default" });
        return !!ctx;
      } catch { return false; }
    }
  },
  {
    interface: 'ML',
    name: 'powerPreference: high-performance',
    test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext({ powerPreference: "high-performance" });
        return !!ctx;
      } catch { return false; }
    }
  },
  {
    interface: 'ML',
    name: 'powerPreference: low-power',
    test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext({ powerPreference: "low-power" });
        return !!ctx;
      } catch { return false; }
    }
  },
  {
    interface: 'ML',
    name: 'createContext',
    test: () => navigator.ml && typeof navigator.ml.createContext === 'function'
  },
  // MLContext interface
  {
    interface: 'MLContext',
    name: 'dispatch', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.dispatch === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'createTensor', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.createTensor === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'createConstantTensor', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.createConstantTensor === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'readTensor', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.readTensor === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'writeTensor', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.writeTensor === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'opSupportLimits', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.opSupportLimits === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'destroy', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return typeof ctx.destroy === 'function';
      } catch { return false; }
    }
  },
  {
    interface: 'MLContext',
    name: 'lost', test: async () => {
      if (!navigator.ml) return false;
      try {
        const ctx = await navigator.ml.createContext();
        return 'lost' in ctx;
      } catch { return false; }
    }
  },
  // MLGraph interface
  {
    interface: 'MLGraph',
    name: 'destroy', test: () => typeof window.MLGraph?.prototype?.destroy === 'function'
  },
  // MLOperand interface
  {
    interface: 'MLOperand',
    name: 'dataType', test: () => 'dataType' in window.MLOperand?.prototype
  },
  {
    interface: 'MLOperand',
    name: 'shape', test: () => 'shape' in window.MLOperand?.prototype
  },
  // MLTensor interface
  {
    interface: 'MLTensor',
    name: 'dataType', test: () => 'dataType' in window.MLTensor?.prototype
  },
  {
    interface: 'MLTensor',
    name: 'shape', test: () => 'shape' in window.MLTensor?.prototype
  },
  {
    interface: 'MLTensor',
    name: 'readable', test: () => 'readable' in window.MLTensor?.prototype
  },
  {
    interface: 'MLTensor',
    name: 'writable', test: () => 'writable' in window.MLTensor?.prototype
  },
  {
    interface: 'MLTensor',
    name: 'constant', test: () => 'constant' in window.MLTensor?.prototype
  },
  {
    interface: 'MLTensor',
    name: 'destroy', test: () => typeof window.MLTensor?.prototype?.destroy === 'function'
  },
  // MLGraphBuilder interface
  {
    interface: 'MLGraphBuilder',
    name: 'input', test: () => typeof window.MLGraphBuilder?.prototype?.input === 'function'
  },
  {
    interface: 'MLGraphBuilder',
    name: 'constant', test: () => typeof window.MLGraphBuilder?.prototype?.constant === 'function'
  },
  {
    interface: 'MLGraphBuilder',
    name: 'build', test: () => typeof window.MLGraphBuilder?.prototype?.build === 'function'
  },
  // MLGraphBuilder operations
  { interface: 'MLGraphBuilder 1', name: 'argMax', test: () => typeof window.MLGraphBuilder?.prototype?.argMax === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'argMin', test: () => typeof window.MLGraphBuilder?.prototype?.argMin === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'batchNormalization', test: () => typeof window.MLGraphBuilder?.prototype?.batchNormalization === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'cast', test: () => typeof window.MLGraphBuilder?.prototype?.cast === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'clamp', test: () => typeof window.MLGraphBuilder?.prototype?.clamp === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'concat', test: () => typeof window.MLGraphBuilder?.prototype?.concat === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'conv2d', test: () => typeof window.MLGraphBuilder?.prototype?.conv2d === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'convTranspose2d', test: () => typeof window.MLGraphBuilder?.prototype?.convTranspose2d === 'function' },
  { interface: 'MLGraphBuilder 1', name: 'cumulativeSum', test: () => typeof window.MLGraphBuilder?.prototype?.cumulativeSum === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · add', test: () => typeof window.MLGraphBuilder?.prototype?.add === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · div', test: () => typeof window.MLGraphBuilder?.prototype?.div === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · max', test: () => typeof window.MLGraphBuilder?.prototype?.max === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · min', test: () => typeof window.MLGraphBuilder?.prototype?.min === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · mul', test: () => typeof window.MLGraphBuilder?.prototype?.mul === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · pow', test: () => typeof window.MLGraphBuilder?.prototype?.pow === 'function' },
  { interface: 'MLGraphBuilder 2', name: 'element-wise binary · sub', test: () => typeof window.MLGraphBuilder?.prototype?.sub === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · equal', test: () => typeof window.MLGraphBuilder?.prototype?.equal === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · notEqual', test: () => typeof window.MLGraphBuilder?.prototype?.notEqual === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · greater', test: () => typeof window.MLGraphBuilder?.prototype?.greater === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · greaterOrEqual', test: () => typeof window.MLGraphBuilder?.prototype?.greaterOrEqual === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · lesser', test: () => typeof window.MLGraphBuilder?.prototype?.lesser === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · lesserOrEqual', test: () => typeof window.MLGraphBuilder?.prototype?.lesserOrEqual === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · logicalAnd', test: () => typeof window.MLGraphBuilder?.prototype?.logicalAnd === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · logicalNot', test: () => typeof window.MLGraphBuilder?.prototype?.logicalNot === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · logicalOr', test: () => typeof window.MLGraphBuilder?.prototype?.logicalOr === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · logicalXor', test: () => typeof window.MLGraphBuilder?.prototype?.logicalXor === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · isInfinite', test: () => typeof window.MLGraphBuilder?.prototype?.isInfinite === 'function' },
  { interface: 'MLGraphBuilder 3', name: 'element-wise logical · isNaN', test: () => typeof window.MLGraphBuilder?.prototype?.isNaN === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · abs', test: () => typeof window.MLGraphBuilder?.prototype?.abs === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · ceil', test: () => typeof window.MLGraphBuilder?.prototype?.ceil === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · cos', test: () => typeof window.MLGraphBuilder?.prototype?.cos === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · erf', test: () => typeof window.MLGraphBuilder?.prototype?.erf === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · exp', test: () => typeof window.MLGraphBuilder?.prototype?.exp === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · floor', test: () => typeof window.MLGraphBuilder?.prototype?.floor === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · identity', test: () => typeof window.MLGraphBuilder?.prototype?.identity === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · log', test: () => typeof window.MLGraphBuilder?.prototype?.log === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · neg', test: () => typeof window.MLGraphBuilder?.prototype?.neg === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · reciprocal', test: () => typeof window.MLGraphBuilder?.prototype?.reciprocal === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · roundEven', test: () => typeof window.MLGraphBuilder?.prototype?.roundEven === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · sign', test: () => typeof window.MLGraphBuilder?.prototype?.sign === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · sin', test: () => typeof window.MLGraphBuilder?.prototype?.sin === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · sqrt', test: () => typeof window.MLGraphBuilder?.prototype?.sqrt === 'function' },
  { interface: 'MLGraphBuilder 4', name: 'element-wise unary · tan', test: () => typeof window.MLGraphBuilder?.prototype?.tan === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'dequantizeLinear', test: () => typeof window.MLGraphBuilder?.prototype?.dequantizeLinear === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'quantizeLinear', test: () => typeof window.MLGraphBuilder?.prototype?.quantizeLinear === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'elu', test: () => typeof window.MLGraphBuilder?.prototype?.elu === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'expand', test: () => typeof window.MLGraphBuilder?.prototype?.expand === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gather', test: () => typeof window.MLGraphBuilder?.prototype?.gather === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gatherElements', test: () => typeof window.MLGraphBuilder?.prototype?.gatherElements === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gatherND', test: () => typeof window.MLGraphBuilder?.prototype?.gatherND === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gelu', test: () => typeof window.MLGraphBuilder?.prototype?.gelu === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gemm', test: () => typeof window.MLGraphBuilder?.prototype?.gemm === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gru', test: () => typeof window.MLGraphBuilder?.prototype?.gru === 'function' },
  { interface: 'MLGraphBuilder 5', name: 'gruCell', test: () => typeof window.MLGraphBuilder?.prototype?.gruCell === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'hardSigmoid', test: () => typeof window.MLGraphBuilder?.prototype?.hardSigmoid === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'hardSwish', test: () => typeof window.MLGraphBuilder?.prototype?.hardSwish === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'instanceNormalization', test: () => typeof window.MLGraphBuilder?.prototype?.instanceNormalization === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'layerNormalization', test: () => typeof window.MLGraphBuilder?.prototype?.layerNormalization === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'leakyRelu', test: () => typeof window.MLGraphBuilder?.prototype?.leakyRelu === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'linear', test: () => typeof window.MLGraphBuilder?.prototype?.linear === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'lstm', test: () => typeof window.MLGraphBuilder?.prototype?.lstm === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'lstmCell', test: () => typeof window.MLGraphBuilder?.prototype?.lstmCell === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'matmul', test: () => typeof window.MLGraphBuilder?.prototype?.matmul === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'pad', test: () => typeof window.MLGraphBuilder?.prototype?.pad === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'pooling · averagePool2d', test: () => typeof window.MLGraphBuilder?.prototype?.averagePool2d === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'pooling · l2Pool2d', test: () => typeof window.MLGraphBuilder?.prototype?.l2Pool2d === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'pooling · maxPool2d', test: () => typeof window.MLGraphBuilder?.prototype?.maxPool2d === 'function' },
  { interface: 'MLGraphBuilder 6', name: 'prelu', test: () => typeof window.MLGraphBuilder?.prototype?.prelu === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceL1', test: () => typeof window.MLGraphBuilder?.prototype?.reduceL1 === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceL2', test: () => typeof window.MLGraphBuilder?.prototype?.reduceL2 === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceLogSum', test: () => typeof window.MLGraphBuilder?.prototype?.reduceLogSum === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceLogSumExp', test: () => typeof window.MLGraphBuilder?.prototype?.reduceLogSumExp === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceMax', test: () => typeof window.MLGraphBuilder?.prototype?.reduceMax === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceMean', test: () => typeof window.MLGraphBuilder?.prototype?.reduceMean === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceMin', test: () => typeof window.MLGraphBuilder?.prototype?.reduceMin === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceProduct', test: () => typeof window.MLGraphBuilder?.prototype?.reduceProduct === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceSum', test: () => typeof window.MLGraphBuilder?.prototype?.reduceSum === 'function' },
  { interface: 'MLGraphBuilder 7', name: 'reduction · reduceSumSquare', test: () => typeof window.MLGraphBuilder?.prototype?.reduceSumSquare === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'relu', test: () => typeof window.MLGraphBuilder?.prototype?.relu === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'resample2d', test: () => typeof window.MLGraphBuilder?.prototype?.resample2d === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'reshape', test: () => typeof window.MLGraphBuilder?.prototype?.reshape === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'reverse', test: () => typeof window.MLGraphBuilder?.prototype?.reverse === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'scatterElements', test: () => typeof window.MLGraphBuilder?.prototype?.scatterElements === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'scatterND', test: () => typeof window.MLGraphBuilder?.prototype?.scatterND === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'sigmoid', test: () => typeof window.MLGraphBuilder?.prototype?.sigmoid === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'slice', test: () => typeof window.MLGraphBuilder?.prototype?.slice === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'softmax', test: () => typeof window.MLGraphBuilder?.prototype?.softmax === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'softplus', test: () => typeof window.MLGraphBuilder?.prototype?.softplus === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'softsign', test: () => typeof window.MLGraphBuilder?.prototype?.softsign === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'split', test: () => typeof window.MLGraphBuilder?.prototype?.split === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'tanh', test: () => typeof window.MLGraphBuilder?.prototype?.tanh === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'tile', test: () => typeof window.MLGraphBuilder?.prototype?.tile === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'transpose', test: () => typeof window.MLGraphBuilder?.prototype?.transpose === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'triangular', test: () => typeof window.MLGraphBuilder?.prototype?.triangular === 'function' },
  { interface: 'MLGraphBuilder 8', name: 'where', test: () => typeof window.MLGraphBuilder?.prototype?.where === 'function' },

];

const $ = s => document.querySelector(s);

async function runIdlTests() {
  const idlDiv = $('#idl');

  const grouped = {};
  for (const t of tests) {
    if (!grouped[t.interface]) grouped[t.interface] = [];
    grouped[t.interface].push(t);
  }

  for (const [iface, ifaceTests] of Object.entries(grouped)) {
    const div = document.createElement('div');
    div.setAttribute('class', iface.toLowerCase());
    div.innerHTML = `<div class="interface title">${iface}</div><div></div>`;
    for (const t of ifaceTests) {
      let supported;
      try {
        supported = t.test.constructor.name === 'AsyncFunction' ? await t.test() : t.test();
      } catch {
        supported = false;
      }
      let resultElement = `<span class="na"></span>`;
      if (supported) {
        resultElement = `<span class="pass"></span>`;
      }
      if (!supported) {
        resultElement = `<span class="fail"></span>`;
      }
      let testName = t.name;
      if (testName.indexOf('element-wise binary') > -1) {
        testName = testName.replaceAll('element-wise binary', 'ewb');
      }
      if (testName.indexOf('element-wise unary') > -1) {
        testName = testName.replaceAll('element-wise unary', 'ewu');
      }
      if (testName.indexOf('element-wise logical') > -1) {
        testName = testName.replaceAll('element-wise logical', 'ewl');
      }
      if (testName.indexOf('reduction') > -1) {
        testName = testName.replaceAll('reduction', 'red');
      }
      div.innerHTML += `<div title="${t.name}">${testName}</div><div>${resultElement}</div>`;
    }
    idlDiv.appendChild(div);
  }
}

// Fill preferredInputLayout and maxTensorByteLength in the #next section
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
  // Fill dataTypes
  if (Array.isArray(data.dataTypes)) {
    for (const dt of data.dataTypes) {
      const el = document.getElementById(`${prefix}-dataType-${dt}`);
      if (el) el.innerHTML = '<span class="pass"></span>';
    }
  }
  // Fill rankRange
  if (data.rankRange) {
    if ('min' in data.rankRange) {
      const el = document.getElementById(`${prefix}-rankRange-min`);
      if (el) el.innerHTML = data.rankRange.min;
    }
    if ('max' in data.rankRange) {
      const el = document.getElementById(`${prefix}-rankRange-max`);
      if (el) el.innerHTML = data.rankRange.max;
    }
  }
}

const updateOpSupportLimits = (device, json) => {
  // Fill device features in #next section
  fillDeviceFeatures(device, json);
  // Supported data types for columns
  const floatTypes = ['float16', 'float32'];
  const intTypes = ['int32', 'int4', 'int64', 'int8'];
  const uintTypes = ['uint32', 'uint4', 'uint64', 'uint8'];
  // Helper to fill a cell by id
  function fillCell(id) {
    const el = $("#" + id);
    if (el) el.innerHTML = '<span class="pass"></span>';
  }
  // Helper to fill min/max
  function fillRank(id, value) {
    const el = $("#" + id);
    if (el) el.innerHTML = value;
  }

  // Fill constant, input, output rows (special case)
  if (json.constant) fillSpecialRows(`${device}-constant`, json.constant);
  if (json.input) fillSpecialRows(`${device}-input`, json.input);
  if (json.output) fillSpecialRows(`${device}-output`, json.output);

  for (const op in json) {
    // skip non-op keys (e.g. maxTensorByteLength, preferredInputLayout, constant, input, output)
    if (typeof json[op] !== 'object' || Array.isArray(json[op]) || ['constant', 'input', 'output'].includes(op)) continue;
    const opVal = json[op];
    // If opVal has dataTypes directly, it's a leaf
    if (Array.isArray(opVal.dataTypes)) {
      // Fill dataTypes
      for (const dt of opVal.dataTypes) {
        fillCell(`${device}-${op}-dataType-${dt}`);
      }
      // Fill rankRange
      if (opVal.rankRange) {
        if ('min' in opVal.rankRange) fillRank(`${device}-${op}-rankRange-min`, opVal.rankRange.min);
        if ('max' in opVal.rankRange) fillRank(`${device}-${op}-rankRange-max`, opVal.rankRange.max);
      }
      continue;
    }
    // Otherwise, opVal is an object of subitems
    for (const sub in opVal) {
      const subVal = opVal[sub];
      if (!subVal || typeof subVal !== 'object') continue;
      // Fill dataTypes
      if (Array.isArray(subVal.dataTypes)) {
        for (const dt of subVal.dataTypes) {
          fillCell(`${device}-${op}-${sub}-dataType-${dt}`);
        }
      }
      // Fill rankRange
      if (subVal.rankRange) {
        if ('min' in subVal.rankRange) fillRank(`${device}-${op}-${sub}-rankRange-min`, subVal.rankRange.min);
        if ('max' in subVal.rankRange) fillRank(`${device}-${op}-${sub}-rankRange-max`, subVal.rankRange.max);
      }
    }
  }
}

async function runOpSupportLimitsTests() {
  const $ = s => document.querySelector(s);
  const cpuDiv = $('#cpu');
  const gpuDiv = $('#gpu');
  const npuDiv = $('#npu');
  const nextNpuDiv = $('#next-npu');

  try {
    const cpuContext = await navigator.ml?.createContext({ deviceType: 'cpu' });
    const cpuJson = cpuContext.opSupportLimits();
    console.log('-- cpu --');
    console.log(cpuJson);
    updateOpSupportLimits('cpu', cpuJson);
  } catch (e) {
    cpuDiv.innerHTML = 'Failed to create CPU device context';
    cpuDiv.setAttribute('class', 'cpu fail');
  }

  try {
    const gpuContext = await navigator.ml?.createContext({ deviceType: 'gpu' });
    const gpuJson = gpuContext.opSupportLimits();
    console.log('-- gpu --');
    console.log(gpuJson);
    updateOpSupportLimits('gpu', gpuJson);
  } catch (e) {
    gpuDiv.innerHTML = 'Failed to create GPU device context';
    gpuDiv.setAttribute('class', 'gpu fail');
  }

  try {
    const npuContext = await navigator.ml?.createContext({ deviceType: 'npu' });
    const npuJson = npuContext.opSupportLimits();
    console.log('-- npu --');
    console.log(npuJson);
    updateOpSupportLimits('npu', npuJson);
  } catch (e) {
    npuDiv.innerHTML = 'NPU device is not supported';
    npuDiv.setAttribute('class', 'npufail');
    nextNpuDiv.innerHTML = 'NPU device is not supported';
    nextNpuDiv.setAttribute('class', 'npufail');
  }

}

function getBrowserInfo() {
  const browser = $("#browser");
  const chromium = $("#chromium");
  if (navigator.userAgentData) {
    navigator.userAgentData.getHighEntropyValues(["fullVersionList"]).then(ua => {
      for (let i of ua.fullVersionList) {
        if (i.brand.toLowerCase().indexOf("brand") === -1) {
          let brand = i.brand.replace('Google ', '').replace('Microsoft ', '').replace('Mozilla ', '').replace('Apple ', '')
          if (i.brand.toLowerCase().indexOf("chromium") > -1) {
            chromium.innerHTML = `${brand} ${i.version}`;
          } else {
            browser.innerHTML = `${brand} ${i.version}`;
          }
        }
      }
    });
  }
}

async function runTests() {
  getBrowserInfo();
  await runIdlTests();
  await runOpSupportLimitsTests();
}

document.addEventListener('DOMContentLoaded', runTests);