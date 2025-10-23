async function runTests() {
  if (typeof getBrowserInfo === 'function') {
    getBrowserInfo();
  }

  if (typeof runIdlTests === 'function') {
    await runIdlTests();
  }

  let contexts = {};
  if (typeof runOpSupportLimitsTests === 'function') {
    contexts = (await runOpSupportLimitsTests()) ?? {};
  }

  if (typeof runOperationTests === 'function') {
    await runOperationTests(contexts);
  }
}

const ops = [
  'abs', 'add', 'argMax', 'argMin', 'averagePool2d', 'batchNormalization', 'cast', 'ceil', 'clamp', 'concat',
  'conv2d', 'convTranspose2d', 'cos', 'cumulativeSum', 'dequantizeLinear', 'div', 'elu', 'equal', 'erf', 'expand',
  'exp', 'floor', 'gatherElements', 'gather', 'gatherND', 'gelu', 'gemm', 'greater', 'greaterOrEqual', 'gruCell',
  'gru', 'hardSigmoid', 'hardSwish', 'identity', 'instanceNormalization', 'isInfinite', 'isNaN', 'l2Pool2d',
  'layerNormalization', 'leakyRelu', 'lesser', 'lesserOrEqual', 'linear', 'logicalAnd', 'logicalNot', 'logicalOr',
  'logicalXor', 'log', 'lstmCell', 'lstm', 'matmul', 'max', 'maxPool2d', 'min', 'mul', 'neg', 'notEqual', 'pad',
  'pow', 'prelu', 'quantizeLinear', 'reciprocal', 'reduceL1', 'reduceL2', 'reduceLogSumExp', 'reduceLogSum',
  'reduceMax', 'reduceMean', 'reduceMin', 'reduceProduct', 'reduceSum', 'reduceSumSquare', 'relu', 'resample2d',
  'reshape', 'reverse', 'roundEven', 'scatterElements', 'scatterND', 'sigmoid', 'sign', 'sin', 'slice', 'softmax',
  'softplus', 'softsign', 'split', 'sqrt', 'sub', 'tanh', 'tan', 'tile', 'transpose', 'triangular', 'where'
];

function loadOpScripts() {
  const basePath = 'static/js/ops';
  const loadedScripts = new Set(
    Array.from(document.querySelectorAll('script[src]'), script => script.getAttribute('src') ?? '')
  );

  const loaders = ops.map(op => {
    const src = `${basePath}/${op}.js`;
    if(op !='tan') {
      // Chrome blocks tan.js fetch
      // The tan op function was merged in the sqrt.js
      if (loadedScripts.has(src)) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load operation script: ${src}`));
        document.body.appendChild(script);
      });
    }
  });

  return Promise.all(loaders);
}

function addOpsList() {
  const opsList = $('#op-list');
  if (!opsList) {
    return;
  }

  opsList.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const devices = ['gpu', 'cpu', 'npu'];

  ops.forEach(op => {
    const list = document.createElement('div');
    list.className = 'list';

    const opLabel = document.createElement('div');
    opLabel.className = 'op';
    opLabel.textContent = op;
    list.appendChild(opLabel);

    devices.forEach(device => {
      const result = document.createElement('div');
      result.title = device;
      result.className = `result ${device}`;
      result.id = `${device}-op-${op}`;
      list.appendChild(result);
    });

    fragment.appendChild(list);
  });

  opsList.appendChild(fragment);
}

function addSvgForOps() {
  const opsSection = document.getElementById('ops');
  if (!opsSection) {
    return;
  }
  const iconMap = {
    gpu: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="#d1d5db" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M2 21V3m0 2h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.26M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3"/><circle cx="16" cy="11" r="2"/><circle cx="8" cy="11" r="2"/></g></svg>',
    cpu: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><g fill="none" stroke="#d1d5db" stroke-linejoin="round" stroke-width="2"><path d="M4 12c0-3.771 0-5.657 1.172-6.828S8.229 4 12 4s5.657 0 6.828 1.172S20 8.229 20 12s0 5.657-1.172 6.828S15.771 20 12 20s-5.657 0-6.828-1.172S4 15.771 4 12Z"/><path stroke-linecap="round" d="M9.5 2v2m5-2v2m-5 16v2m5-2v2M13 9l-4 4m6 0l-2 2m9-.5h-2m-16-5H2m2 5H2m20-5h-2"/></g></svg>',
    npu: '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24"><path fill="#d1d5db" d="M21 11V9h-2V7a2.006 2.006 0 0 0-2-2h-2V3h-2v2h-2V3H9v2H7a2.006 2.006 0 0 0-2 2v2H3v2h2v2H3v2h2v2a2.006 2.006 0 0 0 2 2h2v2h2v-2h2v2h2v-2h2a2.006 2.006 0 0 0 2-2v-2h2v-2h-2v-2Zm-4 6H7V7h10Z"/><path fill="#d1d5db" d="M11.361 8h-1.345l-2.01 8h1.027l.464-1.875h2.316L12.265 16h1.062Zm-1.729 5.324L10.65 8.95h.046l.983 4.374ZM14.244 8h1v8h-1z"/></svg>'
  };
  const results = opsSection.querySelectorAll('.result');
  results.forEach(result => {
    if (result.querySelector('.device-icon')) {
      return;
    }
    const deviceType = ['gpu', 'cpu', 'npu'].find(type => result.classList.contains(type));
    if (!deviceType) {
      return;
    }
    const svgMarkup = iconMap[deviceType];
    if (!svgMarkup) {
      return;
    }

    result.innerHTML = svgMarkup;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addOpsList();
  addSvgForOps();
  loadOpScripts()
    .then(() => runTests())
    .catch(error => console.error('WebNN report initialisation failed:', error));
});