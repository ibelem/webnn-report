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

document.addEventListener('DOMContentLoaded', () => {
  runTests().catch(error => console.error('WebNN report initialisation failed:', error));
});