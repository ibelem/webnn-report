
## WebNNReport.org
This is the source for [WebNNReport.org](https://webnnreport.org)

## Adversarial Stress Tests

The `stress/` folder contains **1,142 adversarial tests** targeting **95 WebNN operators** across **25 test files**. These tests are designed to find crashes, security vulnerabilities, buffer overflows, NaN/Infinity bugs, and other edge-case issues in browser WebNN implementations.

Separate test pages are provided per device backend:
- [stress/cpu](stress/cpu/)
- [stress/gpu](stress/gpu/)
- [stress/npu](stress/npu/)

### Test Breakdown

| # | Category | Operators | Ops | Tests |
|---|---|---|---|---|
| 1 | elementwise-unary | abs, ceil, cos, erf, exp, floor, identity, log, neg, reciprocal, roundEven, sin, sign, sqrt, tan | 15 | 255 |
| 2 | reduction | reduceL1, reduceL2, reduceLogSum, reduceLogSumExp, reduceMax, reduceMean, reduceMin, reduceProduct, reduceSum, reduceSumSquare | 10 | 140 |
| 3 | activation | clamp, elu, gelu, hardSigmoid, hardSwish, leakyRelu, linear, relu, sigmoid, softplus, softsign, tanh | 12 | 138 |
| 4 | elementwise-binary | add, sub, mul, div, max, min, pow | 7 | 102 |
| 5 | elementwise-logical | equal, notEqual, greater, greaterOrEqual, lesser, lesserOrEqual, logicalAnd, logicalOr, logicalXor, logicalNot, isNaN, isInfinite | 12 | 69 |
| 6 | data-movement | concat, expand, pad, reshape, reverse, slice, split, tile, transpose, triangular | 10 | 53 |
| 7 | misc-ops | cast, dequantizeLinear, quantizeLinear, prelu, where, resample2d, cumulativeSum | 7 | 43 |
| 8 | pooling | averagePool2d, l2Pool2d, maxPool2d | 3 | 39 |
| 9 | zero-dimensions | zero-sized dims across all major ops | — | 32 |
| 10 | conv2d | conv2d, convTranspose2d | 2 | 28 |
| 11 | normalization | batchNormalization, instanceNormalization, layerNormalization | 3 | 26 |
| 12 | context-graph | context lifecycle, graph stress, parallel dispatch, race hazards | — | 21 |
| 13 | type-confusion | NaN→int, Infinity→unsigned, float16 roundtrip, int overflow wrapping | — | 20 |
| 14 | argminmax | argMin, argMax | 2 | 20 |
| 15 | gather-scatter | gather, gatherElements, gatherND, scatterElements, scatterND | 5 | 20 |
| 16 | tensor-limits | INT_MAX element count, shape overflow, stride overflow, output size limits | — | 19 |
| 17 | softmax | softmax | 1 | 17 |
| 18 | graph-optimization | constant folding with NaN, algebraic simplification failures, dead code | — | 17 |
| 19 | matmul-gemm | matmul, gemm | 2 | 16 |
| 20 | precision-chains | associativity, catastrophic cancellation, gradual underflow/overflow | — | 14 |
| 21 | recurrent | gru, gruCell, lstm, lstmCell | 4 | 13 |
| 22 | quantization-roundtrip | quantize→dequantize fidelity, int8/uint8 saturation, scale edge cases | — | 12 |
| 23 | slice-stride | stride semantics, boundary conditions, high-dimensional slicing | — | 12 |
| 24 | race-conditions | concurrent dispatch, write-during-dispatch, destroy-during-dispatch | — | 8 |
| 25 | uninitialized-memory | read before write, cross-contamination, uninitialized tensor reads | — | 8 |
| | | **Total** | **95** | **1,142** |

### Adversarial Categories

- **NaN / Infinity handling** — inputs filled with NaN, ±Infinity, ±0, subnormals; NaN propagation through chains; optimizer NaN preservation
- **Division by zero** — zero-variance normalization, all-negative softmax inputs, epsilon=subnormal, reciprocal(0) chains
- **Integer overflow in shapes** — INT_MAX element counts, shape product overflow, stride computation overflow in 8D tensors, dilation overflow
- **Buffer overflows** — out-of-bounds gather indices, INT32_MIN/INT32_MAX index values, scatter collision semantics
- **Subnormal float handling** — gradual underflow chains, interleaved subnormal/normal, 10K-element subnormal accumulation, exp/log/sqrt of subnormals
- **Type confusion** — NaN/Infinity cast to int8/uint8/int32, negative→unsigned conversion, float16 roundtrip precision loss, int boundary wrapping
- **Graph optimization bugs** — constant folding NaN, 0*Infinity simplified to 0, x-x on Infinity, exp(log(NaN)) identity optimization
- **Race conditions** — concurrent dispatch to same tensor, write/read during in-flight dispatch, destroy during dispatch
- **Zero-sized dimensions** — [0,N] inputs across unary, binary, conv2d, matmul, softmax, gather, reduce, pooling ops
- **Uninitialized memory** — reading tensors before write/dispatch, cross-contamination checks between tensors
- **Precision chains** — associativity failures, catastrophic cancellation, cumulative drift in 500-op chains, gradual underflow/overflow
- **Quantization** — roundtrip fidelity, int8/uint8 saturation boundaries, NaN/Infinity quantization, subnormal scale values
- **Resource stress** — rapid context create/destroy cycles, 200-tensor leak checks, 500-op deep chains, 100-way fan-out graphs
