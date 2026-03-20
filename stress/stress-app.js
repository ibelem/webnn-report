'use strict';

(() => {
  let stopped = false;
  let running = false;
  let counts = { total: 0, pass: 0, fail: 0, skip: 0, running: 0 };
  let activeTab = null;

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  function updateSummary() {
    $('#count-total').textContent = counts.total;
    $('#count-pass').textContent = counts.pass;
    $('#count-fail').textContent = counts.fail;
    $('#count-skip').textContent = counts.skip;
    $('#count-running').textContent = counts.running;
    const done = counts.pass + counts.fail + counts.skip;
    const pct = counts.total > 0 ? (done / counts.total * 100) : 0;
    $('#progress-fill').style.width = `${pct}%`;
  }

  function switchTab(op) {
    activeTab = op;
    for (const g of $$('.op-group')) {
      g.classList.toggle('active', g.id === `op-${op}`);
    }
    for (const a of $$('#op-nav a')) {
      a.classList.toggle('active', a.dataset.op === op);
    }
    // Scroll active tab link into view within the nav
    const activeLink = $(`#op-nav a[data-op="${op}"]`);
    if (activeLink) activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }

  function updateTabBadge(op) {
    const link = $(`#op-nav a[data-op="${op}"]`);
    if (!link) return;
    const group = $(`#op-${op}`);
    if (!group) return;
    const rows = group.querySelectorAll('.test-row');
    let p = 0, f = 0;
    for (const r of rows) {
      if (r.classList.contains('pass')) p++;
      if (r.classList.contains('fail')) f++;
    }
    const total = rows.length;
    const badge = link.querySelector('.tab-badge');
    if (!badge) return;
    if (p + f === 0) {
      badge.textContent = total;
      badge.className = 'tab-badge';
    } else if (f > 0) {
      badge.textContent = `${p}/${total}`;
      badge.className = 'tab-badge has-fail';
    } else if (p === total) {
      badge.textContent = `${total}`;
      badge.className = 'tab-badge all-pass';
    } else {
      badge.textContent = `${p}/${total}`;
      badge.className = 'tab-badge';
    }
  }

  function buildUI() {
    const nav = $('#op-nav');
    const results = $('#results');
    const opSet = new Map();

    for (const t of stressTests) {
      if (!opSet.has(t.op)) opSet.set(t.op, []);
      opSet.get(t.op).push(t);
    }

    counts.total = stressTests.length;
    updateSummary();

    let first = true;
    for (const [op, tests] of opSet) {
      const link = document.createElement('a');
      link.href = 'javascript:void(0)';
      link.dataset.op = op;
      link.innerHTML = `<span class="tab-label">${op}</span><span class="tab-badge">${tests.length}</span>`;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab(op);
      });
      nav.appendChild(link);

      const group = document.createElement('div');
      group.className = 'op-group';
      group.id = `op-${op}`;

      const header = document.createElement('div');
      header.className = 'op-group-header';
      header.innerHTML = `<span>${op}</span><span class="op-count">${tests.length} tests</span>`;
      const runBtn = document.createElement('button');
      runBtn.textContent = 'Run';
      runBtn.addEventListener('click', () => runOpGroup(op));
      header.appendChild(runBtn);
      group.appendChild(header);

      for (let i = 0; i < tests.length; i++) {
        const row = document.createElement('div');
        row.className = 'test-row';
        row.id = `test-${tests[i].op}-${i}`;
        row.innerHTML = `
          <div class="test-status">pending</div>
          <div class="test-name" title="${escapeHtml(tests[i].name)}">${escapeHtml(tests[i].name)}</div>
          <div class="test-time"></div>`;
        group.appendChild(row);
      }

      results.appendChild(group);

      if (first) {
        switchTab(op);
        first = false;
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function setTestResult(testInfo, index, status, timeMs, error) {
    const row = $(`#test-${testInfo.op}-${index}`);
    if (!row) return;

    row.className = `test-row ${status}`;
    row.querySelector('.test-status').textContent = status;
    if (timeMs !== undefined) {
      row.querySelector('.test-time').textContent = `${timeMs}ms`;
    }
    if (error) {
      const errDiv = document.createElement('div');
      errDiv.className = 'test-error';
      errDiv.textContent = String(error).substring(0, 500);
      row.appendChild(errDiv);
    }

    updateTabBadge(testInfo.op);
  }

  async function createContext() {
    if (!navigator.ml) return null;
    try {
      return await navigator.ml.createContext({ deviceType: DEVICE });
    } catch (e) {
      // Retry once after brief delay (service may be restarting)
      await new Promise(r => setTimeout(r, 2000));
      try {
        return await navigator.ml.createContext({ deviceType: DEVICE });
      } catch (_) {
        console.warn(`Failed to create ${DEVICE} context after retry:`, _);
        return null;
      }
    }
  }

  async function runSingleTest(testInfo, localIndex, context) {
    if (stopped) {
      counts.skip++;
      updateSummary();
      setTestResult(testInfo, localIndex, 'skip');
      return;
    }

    counts.running++;
    updateSummary();
    setTestResult(testInfo, localIndex, 'running');

    const t0 = performance.now();
    try {
      await Promise.race([
        testInfo.run(context),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), testInfo.timeout)
        ),
      ]);
      const elapsed = Math.round(performance.now() - t0);
      counts.pass++;
      counts.running--;
      updateSummary();
      setTestResult(testInfo, localIndex, 'pass', elapsed);
    } catch (err) {
      const elapsed = Math.round(performance.now() - t0);
      counts.fail++;
      counts.running--;
      updateSummary();
      setTestResult(testInfo, localIndex, 'fail', elapsed, err);
    }
  }

  async function runTestSet(tests, context) {
    const opMap = new Map();
    for (const t of stressTests) {
      const op = t.op;
      if (!opMap.has(op)) opMap.set(op, []);
      opMap.get(op).push(t);
    }

    let lastOp = null;
    for (const t of tests) {
      if (stopped) break;
      // Auto-switch tab when moving to a new operator group
      if (t.op !== lastOp) {
        switchTab(t.op);
        lastOp = t.op;
      }
      const opTests = opMap.get(t.op);
      const localIndex = opTests ? opTests.indexOf(t) : 0;
      await runSingleTest(t, localIndex, context);
    }
  }

  async function runAll() {
    if (running) return;
    running = true;
    stopped = false;
    counts = { total: stressTests.length, pass: 0, fail: 0, skip: 0, running: 0 };
    updateSummary();

    // Reset all rows
    for (const row of $$('.test-row')) {
      row.className = 'test-row';
      row.querySelector('.test-status').textContent = 'pending';
      row.querySelector('.test-time').textContent = '';
      const err = row.querySelector('.test-error');
      if (err) err.remove();
    }

    const context = await createContext();
    if (!context) {
      for (const t of stressTests) {
        const opMap = new Map();
        for (const s of stressTests) {
          if (!opMap.has(s.op)) opMap.set(s.op, []);
          opMap.get(s.op).push(s);
        }
        const idx = opMap.get(t.op).indexOf(t);
        counts.skip++;
        updateSummary();
        setTestResult(t, idx, 'skip', undefined, `WebNN ${DEVICE.toUpperCase()} context not available`);
      }
      running = false;
      return;
    }

    await runTestSet(stressTests, context);
    context.destroy();
    running = false;
  }

  async function runOpGroup(op) {
    if (running) return;
    running = true;
    stopped = false;

    const tests = stressTests.filter(t => t.op === op);
    const opTests = stressTests.filter(t => t.op === op);

    // Reset counts for just this group
    counts = { total: tests.length, pass: 0, fail: 0, skip: 0, running: 0 };
    updateSummary();

    for (let i = 0; i < opTests.length; i++) {
      const row = $(`#test-${op}-${i}`);
      if (row) {
        row.className = 'test-row';
        row.querySelector('.test-status').textContent = 'pending';
        row.querySelector('.test-time').textContent = '';
        const err = row.querySelector('.test-error');
        if (err) err.remove();
      }
    }

    const context = await createContext();
    if (!context) {
      for (let i = 0; i < opTests.length; i++) {
        counts.skip++;
        updateSummary();
        setTestResult(opTests[i], i, 'skip', undefined, `WebNN ${DEVICE.toUpperCase()} context not available`);
      }
      running = false;
      return;
    }

    for (let i = 0; i < opTests.length; i++) {
      if (stopped) {
        counts.skip++;
        updateSummary();
        setTestResult(opTests[i], i, 'skip');
        continue;
      }
      await runSingleTest(opTests[i], i, context);
    }
    context.destroy();
    running = false;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (typeof getBrowserInfo === 'function') getBrowserInfo();
    // Wait for all test scripts to finish loading
    if (window.__stressTestsReady) await window.__stressTestsReady;
    buildUI();
    $('#btn-run-all').addEventListener('click', runAll);
    $('#btn-stop').addEventListener('click', () => { stopped = true; });
  });
})();
