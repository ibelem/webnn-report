# WebNN Stress Testing Guide
## Finding Security & Vulnerability Issues in Chromium/Chrome via WebNN API

> **Goal:** Trigger undefined behaviour in native kernel code from a sandboxed JS context via WebNN operator graph construction and tensor data injection across CPU, GPU, and NPU backends. Each test verifies: no crash · no UB · graceful error OR spec-compliant NaN propagation.

---

## Attack Surface Overview

```
JS / WPT Test Layer
  └─ MLContext · MLGraph · MLOperand · tensor inputs
       │
       ▼
Operator Dispatch Layer
  └─ Shape inference · type validation · index/stride math
       │
  ┌────┼────────────┐
  ▼    ▼            ▼
CPU   GPU          NPU
Backend  Backend   Backend
(XNNPACK/ (WebGPU/ (DirectML/
 Eigen)   Metal/   CoreML/
          D3D12)   NNAPI)
```

**Primary injection points:**
- NaN / Infinity — unguarded `isnan` checks
- Div-by-zero — softmax · layernorm · batchnorm
- Integer overflow — shape · stride · index math
- Buffer overflow — large indices · OOB tensor access
- Subnormal floats — denorm → microcode slow path → hang

---

## 1. NaN / Infinity Handling

The attack surface is any operator that feeds into a native kernel without a pre-flight `isnan` / `isinf` guard. The goal is to verify whether NaN or Infinity propagates silently, crashes a backend thread, or triggers an access violation in a SIMD fast path.

### Test Cases

**Case A — NaN-poisoned weight tensor through matmul**

Based on `wpt/webnn/conformance_tests/matmul.https.any.js`

```javascript
const nanWeights = new Float32Array(4).fill(NaN);
const builder = new MLGraphBuilder(context);
const a = builder.input('a', { type: 'float32', dimensions: [1, 4] });
const b = builder.constant({ type: 'float32', dimensions: [4, 1] }, nanWeights);
const out = builder.matmul(a, b);
// Expected: result is NaN (IEEE 754), no crash, no UB
// Watch for: renderer hang, GPU device lost, incorrect non-NaN output
```

**Case B — Infinity through softmax**

Triggers `exp(Infinity) = Infinity / Infinity = NaN`

```javascript
const infInput = new Float32Array([Infinity, 1, 2, 3]);
// softmax(Infinity, ...) → exp(Inf) / sum → Inf/Inf → NaN
// Watch for: backend divide-by-zero trap, unguarded isnan in argmax downstream
```

**Case C — Mixed NaN/normal in batch**

Tests per-element vs bulk kernel paths.

```javascript
const mixed = new Float32Array(1024);
mixed[0] = NaN;
mixed[511] = -Infinity;
mixed[512] = Infinity;
// Place at stride boundaries to catch SIMD lane masking bugs
```

**Case D — NaN through relu → downstream layernorm**

```javascript
// relu(NaN) must stay NaN
// layernorm must not divide by NaN variance
```

### Crash Signatures to Watch

| Symptom | Likely Root Cause |
|---|---|
| `GPU DEVICE LOST` | Shader UB or OOB GPU buffer access |
| Result silently becomes `0` | Unguarded `isnan(x) ? 0 : x` clamp hiding the bug |
| `D3D device removed` | Driver-level fault from invalid FP op |
| Renderer process OOM kill | Unbounded allocation triggered by propagated NaN |

---

## 2. Division-by-Zero in Normalization / Softmax

Every normalization op divides by a computed statistic (variance, sum-of-exp, L2 norm). A zero or near-zero denominator is the trigger.

### Test Cases

**Case A — layerNorm with zero-variance input**

All elements identical → `variance = E[x²] - E[x]² = 0` → division by zero in native kernel.

```javascript
const uniformInput = new Float32Array(128).fill(42.0);
// epsilon=0 forces the issue
// epsilon=1e-45 (minimum subnormal) tests rounding path
```

**Case B — softmax with all -Infinity logits**

```javascript
const allNegInf = new Float32Array(10).fill(-Infinity);
// exp(-Inf) = 0 for all elements → sum = 0 → 0/0
```

**Case C — instanceNorm / batchNorm on a 1-element spatial dimension**

Variance computed over a single sample = 0 by definition.

```javascript
const b = builder.batchNormalization(
  builder.input('x', { type: 'float32', dimensions: [1, 1, 1, 512] }),
  meanConst, varConst,  // provide pre-computed var=0
  { epsilon: 0 }        // force no epsilon guard
);
```

**Case D — L2 normalization of the zero vector**

```javascript
const zeroVec = new Float32Array(512).fill(0);
// ||x||₂ = 0 → x / 0
```

**Case E — gemm with zero-filled B and alpha=0, beta=Infinity**

Tests whether `fma(alpha*A*B + beta*C)` handles `0 * Inf` correctly per IEEE 754.

```javascript
// alpha=0, B=zeros, C=any, beta=Infinity
// 0 * Inf is NaN per IEEE — backend must not produce a finite result
```

---

## 3. Integer Overflow in Shape / Stride Computations

Shape arithmetic in C++ often uses `int32_t` or `size_t`. A crafted set of dimensions can overflow before the bounds check fires.

### Test Cases

**Case A — Product overflow: dimensions whose product overflows int32**

`46341 × 46342 = 2,147,488,281 > INT32_MAX (2,147,483,647)`

```javascript
const hugeShape = { type: 'float32', dimensions: [46341, 46342] };
// Watch: shape inference allocates wrong buffer size → later OOB write
```

**Case B — Stride overflow in a reshape + slice chain**

```javascript
const reshape = builder.reshape(input, [1, 2147483647]);
// Reshape to [1, INT32_MAX] then slice
// stride calculation wraps
```

**Case C — Cumulative stride in stridedSlice**

```javascript
// axes=[0,1,2,3], strides=[1,1,1,2147483647]
// begin=[0,0,0,0], end=[2,2,2,2]
// offset arithmetic overflows
```

**Case D — Transpose with large perm on high-rank tensor**

`output_stride[i] = product of remaining dims` — overflows for rank ≥ 6 with large dims.

```javascript
// dims like [128, 128, 128, 128, 128, 128]
// Transpose with perm=[5,4,3,2,1,0]
```

**Case E — Dilated convolution stride × dilation overflow**

```javascript
// stride=[65536], dilation=[65536]
// effective stride = 65536² = 4 GB
// kernel should reject, not allocate
```

---

## 4. Buffer Overflow from Large Index Values

These probe whether index-based ops validate that indices stay within tensor bounds before issuing memory reads in native code.

### Test Cases

**Case A — Gather with out-of-bounds indices (core OOB read test)**

Based on `wpt/webnn/conformance_tests/gather.https.any.js`

```javascript
const inputTensor = builder.constant(
  { type: 'float32', dimensions: [4, 4] }, smallData);
const oobIndices  = builder.constant(
  { type: 'int32', dimensions: [3] },
  new Int32Array([0, 3, 2147483647]));  // last index is OOB

const gathered = builder.gather(inputTensor, oobIndices, { axis: 0 });
// Expected: validation error at graph build OR bounded output (index clamped)
// Forbidden: native heap read at offset = 2147483647 * 4 * sizeof(float)
```

**Case B — GatherElements with negative indices**

```javascript
new Int32Array([-1, -2147483648, 0]);
// Test signed vs unsigned handling in index arithmetic
```

**Case C — ScatterND with overlapping/conflicting write indices**

```javascript
// Same output cell written from multiple source values
// Watch: race condition in parallel scatter kernel
```

**Case D — Slice with begin + size > dim**

```javascript
const b2 = builder.slice(input, [0], [2147483647]);
// begin=0, size=INT32_MAX
```

**Case E — Conv2D with padding that makes effective input size negative**

`input=3, kernel=5, padding=0 → output_size = (3 - 5 + 0)/1 + 1 = -1`  
Shape inference must reject before allocation.

```javascript
const tinyInput  = builder.input('x', { type: 'float32', dimensions: [1, 1, 3, 3] });
const hugeKernel = builder.constant(
  { type: 'float32', dimensions: [1, 1, 7, 7] }, new Float32Array(49));

builder.conv2d(tinyInput, hugeKernel, { padding: [0, 0, 0, 0] });
```

---

## 5. Subnormal Float Handling

Subnormal (denormalized) floats are values between 0 and `Float.MIN_NORMAL` (~1.18e-38). On x86, these trigger a microcode assist ~100× slower than normal FP ops. On some GPU backends they are silently flushed to zero (FTZ), creating a behavioral divergence from CPU.

### Test Cases

**Case A — Fill entire tensor with minimum positive subnormal**

Minimum positive Float32 subnormal ≈ `1.4e-45`

```javascript
const subnormals = new Float32Array(65536).fill(1.4e-45);
// Run through a long chain: matmul → relu → layerNorm → softmax
// Watch: process hang (CPU MITE slow path), total execution time > 30s
```

**Case B — Subnormal gradient in a multiplication chain**

```javascript
// x * x where x = 1.4e-45 → x² underflows to 0 → kills gradient
// Test whether the backend uses FTZ mode silently
```

**Case C — Convolution with subnormal weights AND subnormal input**

Every multiply underflows → FP denorm assist for every MAC unit.  
CPU backends: triggers per-operation microcode. GPU FTZ: silent zeroing.

```javascript
const subWeights = new Float32Array(3 * 3 * 64 * 64).fill(1.4e-45);
const subInput   = new Float32Array(1 * 64 * 32 * 32).fill(1.4e-45);
```

**Case D — Alternating subnormal / normal to stress SIMD lane-mixing**

AVX2 processes 8 floats/cycle; mixing causes partial stalls.

```javascript
const mixed = new Float32Array(256);
for (let i = 0; i < 256; i++)
  mixed[i] = (i % 2 === 0) ? 1.4e-45 : 1.0;
```

**Case E — Result that decays into subnormal range through iterative ops**

```javascript
// Recurrent-style: apply sigmoid 50× to a very small initial value
// sigmoid(x) ≈ 0.5 + x/4 near 0; chains can drift into denorm territory
```

> **Verification:** Compare CPU vs GPU result — FTZ divergence is a **spec violation**.

---

## 6. Cross-Cutting Stress Dimensions

Beyond the five primary categories, vary each test case along these axes to maximize backend code-path coverage:

| Axis | Values to Try |
|---|---|
| Backend hint | `{powerPreference: 'low-power'}` vs `'high-performance'` (forces CPU vs GPU) |
| Data type | `float32`, `float16`, `int32`, `uint8` — overflow points differ per type |
| Graph depth | 1 op vs 50-op chain — exposes compiler/JIT path differences |
| Batch size | 1, 2, 256 — SIMD vectorization kicks in at batch ≥ 8 on most backends |
| Async pressure | Fire 100 graph evaluations concurrently with `Promise.all` — race conditions in shared GPU command queue |
| Graph reuse | Build once, execute 10,000× — tests for accumulating state / memory leaks in native handles |

---

## 7. Observation Checklist Per Test Run

When running these under a Chromium debug build, watch for:

| Symptom | Interpretation |
|---|---|
| `GPU DEVICE LOST` | Shader UB or out-of-bounds GPU buffer access |
| `content::RenderProcessHostImpl::OnBadMessage` | IPC validation bypass |
| Renderer OOM kill (`chrome://crashes`) | Unbounded allocation from shape/stride overflow |
| `MLContext.compute()` never resolving | Deadlock or hang from subnormal slow path |
| Silent wrong output (NaN → 0, Inf → MAX_FLOAT) | Unguarded clamp masking exploitable state |
| ASAN/UBSAN reports | Run Chromium with `is_asan=true` in GN args |

### Running with Sanitizers

```bash
# Build Chromium with ASAN enabled
gn gen out/asan --args='is_asan=true is_debug=false'
ninja -C out/asan chrome

# Run a specific WPT test
python3 wpt run chromium webnn/conformance_tests/matmul.https.any.js
```

---

## 8. Reference Comparison Strategy

Pair each test case with a known-good reference output computed on CPU with a pure-JS fallback (e.g., `ort-web` in CPU mode) and diff the results — **divergence is as interesting as crashes**.

```javascript
// Pattern: run same inputs through WebNN and a reference JS implementation
async function compareWithReference(inputs, buildGraph, referenceImpl) {
  // Run via WebNN
  const context = await navigator.ml.createContext({ deviceType: 'gpu' });
  const builder  = new MLGraphBuilder(context);
  const graph    = await buildGraph(builder).build({output: outputOperand});
  const webnnResult = await context.compute(graph, inputs, outputs);

  // Run via reference (pure JS / ort-web CPU)
  const refResult = referenceImpl(inputs);

  // Compare — any divergence beyond float32 epsilon is a finding
  const maxDiff = Math.max(...Array.from(webnnResult.outputs.output).map(
    (v, i) => Math.abs(v - refResult[i])));

  if (maxDiff > 1e-5 || isNaN(maxDiff)) {
    console.error('DIVERGENCE DETECTED', { maxDiff, webnnResult, refResult });
  }
}
```

---

## Appendix: Quick Reference — Dangerous Input Values

| Type | Value | Hex | Trigger |
|---|---|---|---|
| Float32 | `NaN` | `0x7FC00000` | Propagation / isnan guards |
| Float32 | `+Infinity` | `0x7F800000` | exp(), softmax sum |
| Float32 | `-Infinity` | `0xFF800000` | log(), softmax all-neg |
| Float32 | Min subnormal | `0x00000001` | Microcode slow path |
| Float32 | Max subnormal | `0x007FFFFF` | FTZ flush boundary |
| Int32 | `2147483647` | `0x7FFFFFFF` | Stride/index overflow |
| Int32 | `-2147483648` | `0x80000000` | Signed/unsigned boundary |
| Int32 | `46341` | — | Product overflow with itself |
