'use strict';

// Shared adversarial test helpers for WebNN stress tests.
// Each test should NOT crash the browser — it should throw or complete gracefully.

const INT32_MAX = 2147483647;
const UINT32_MAX = 4294967295;
const FLOAT32_MAX = 3.4028235e+38;
const FLOAT32_MIN_SUBNORMAL = 1.401298464324817e-45;
const FLOAT32_MIN_NORMAL = 1.1754943508222875e-38;

// Helper to build, dispatch, and read a single-output graph.
// Throws on error, which is expected for adversarial tests.
async function buildAndExecute(context, buildFn) {
  const builder = new MLGraphBuilder(context);
  const outputOperand = buildFn(builder);
  const graph = await builder.build({ output: outputOperand });
  const outputDesc = { dataType: outputOperand.dataType, shape: Array.from(outputOperand.shape) };
  const size = outputDesc.shape.reduce((a, b) => a * b, 1);
  const outputTensor = await context.createTensor({
    dataType: outputDesc.dataType,
    shape: outputDesc.shape,
    readable: true,
  });
  context.dispatch(graph, {}, { output: outputTensor });
  const result = await context.readTensor(outputTensor);
  return { result, outputDesc };
}

// Build + dispatch with named inputs (writable tensors).
async function buildAndExecuteWithInputs(context, inputSpecs, buildFn) {
  const builder = new MLGraphBuilder(context);
  const inputs = {};
  const inputTensors = {};

  for (const [name, spec] of Object.entries(inputSpecs)) {
    inputs[name] = builder.input(name, { dataType: spec.dataType, shape: spec.shape });
  }

  const outputOperand = buildFn(builder, inputs);
  const graph = await builder.build({ output: outputOperand });

  for (const [name, spec] of Object.entries(inputSpecs)) {
    const tensor = await context.createTensor({
      dataType: spec.dataType,
      shape: spec.shape,
      writable: true,
    });
    context.writeTensor(tensor, spec.data);
    inputTensors[name] = tensor;
  }

  const outputDesc = { dataType: outputOperand.dataType, shape: Array.from(outputOperand.shape) };
  const outputTensor = await context.createTensor({
    dataType: outputDesc.dataType,
    shape: outputDesc.shape,
    readable: true,
  });

  context.dispatch(graph, inputTensors, { output: outputTensor });
  const result = await context.readTensor(outputTensor);
  return { result, outputDesc };
}

// Creates a Float32Array filled with a specific value.
function filledFloat32(shape, value) {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Float32Array(size).fill(value);
}

// Creates a Float32Array with random values.
function randomFloat32(shape) {
  const size = shape.reduce((a, b) => a * b, 1);
  const arr = new Float32Array(size);
  for (let i = 0; i < size; i++) arr[i] = Math.random() * 2 - 1;
  return arr;
}

// Creates a Float32Array with adversarial special values.
function adversarialFloat32(shape) {
  const size = shape.reduce((a, b) => a * b, 1);
  const specials = [
    NaN, Infinity, -Infinity, 0, -0,
    FLOAT32_MAX, -FLOAT32_MAX,
    FLOAT32_MIN_SUBNORMAL, -FLOAT32_MIN_SUBNORMAL,
    FLOAT32_MIN_NORMAL, -FLOAT32_MIN_NORMAL,
    1.0, -1.0, 0.5, -0.5,
  ];
  const arr = new Float32Array(size);
  for (let i = 0; i < size; i++) arr[i] = specials[i % specials.length];
  return arr;
}

// Creates an Int32Array filled with a value.
function filledInt32(shape, value) {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Int32Array(size).fill(value);
}

// Creates a Uint8Array filled with a value.
function filledUint8(shape, value) {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Uint8Array(size).fill(value);
}

// Creates an Int8Array filled with a value.
function filledInt8(shape, value) {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Int8Array(size).fill(value);
}

// Creates a Uint32Array filled with a value.
function filledUint32(shape, value) {
  const size = shape.reduce((a, b) => a * b, 1);
  return new Uint32Array(size).fill(value);
}

// Creates a Float32Array with interleaved subnormal and normal values.
function interleavedSubnormalFloat32(shape) {
  const size = shape.reduce((a, b) => a * b, 1);
  const arr = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = i % 2 === 0 ? 1.0 : FLOAT32_MIN_SUBNORMAL;
  }
  return arr;
}

// Creates a Float32Array from an explicit array of values, tiled to fill shape.
function tiledFloat32(shape, values) {
  const size = shape.reduce((a, b) => a * b, 1);
  const arr = new Float32Array(size);
  for (let i = 0; i < size; i++) arr[i] = values[i % values.length];
  return arr;
}

// All float32 data types for iteration.
const kStressDataTypes = ['float32', 'float16', 'int32', 'uint32', 'int8', 'uint8'];
const kFloatDataTypes = ['float32', 'float16'];
