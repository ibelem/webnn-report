const opSupportLimitsDefinedInSpec = {
  "abs": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "int64",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "int64",
        "int8"
      ]
    }
  },
  "add": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "argMax": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "int32",
        "int64"
      ]
    }
  },
  "argMin": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "int32",
        "int64"
      ]
    }
  },
  "averagePool2d": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "batchNormalization": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "mean": {
      "dataTypes": [
        "float32",
        "float16"
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
    "variance": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "cast": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "ceil": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "clamp": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "concat": {
    "inputs": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "constant": {
    "dataTypes": [
      "float32",
      "float16",
      "int32",
      "uint32",
      "int64",
      "int8",
      "int4",
      "uint64",
      "uint8",
      "uint4"
    ]
  },
  "conv2d": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "filter": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "convTranspose2d": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "filter": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "cos": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "cumulativeSum": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
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
  "div": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "elu": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "equal": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "int8",
        "uint8"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "int8",
        "uint8"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "erf": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "exp": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "expand": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "floor": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "gather": {
    "indices": {
      "dataTypes": [
        "int32",
        "uint32",
        "int64"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "gatherElements": {
    "indices": {
      "dataTypes": [
        "int32",
        "uint32",
        "int64"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "gatherND": {
    "indices": {
      "dataTypes": [
        "int32",
        "uint32",
        "int64"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "gelu": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "gemm": {
    "a": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "c": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "greater": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "greaterOrEqual": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "gru": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "initialHiddenState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output0": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output1": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentBias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "weight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "gruCell": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "hiddenState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentBias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "weight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "hardSigmoid": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "hardSwish": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "identity": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "int8",
        "int4",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64",
        "int8",
        "int4",
        "uint8",
        "uint4"
      ]
    }
  },
  "input": {
    "dataTypes": [
      "float32",
      "float16",
      "int32",
      "uint32",
      "int64",
      "uint64",
      "int8",
      "uint8",
      "int4",
      "uint4"
    ]
  },
  "instanceNormalization": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
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
    }
  },
  "isInfinite": {
    "a": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "isNaN": {
    "a": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "l2Pool2d": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "layerNormalization": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
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
    }
  },
  "leakyRelu": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "lesser": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "lesserOrEqual": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "linear": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "log": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "logicalAnd": {
    "a": {
      "dataTypes": [
        "uint8"
      ]
    },
    "b": {
      "dataTypes": [
        "uint8"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "logicalNot": {
    "a": {
      "dataTypes": [
        "uint8"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "logicalOr": {
    "a": {
      "dataTypes": [
        "uint8"
      ]
    },
    "b": {
      "dataTypes": [
        "uint8"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "logicalXor": {
    "a": {
      "dataTypes": [
        "uint8"
      ]
    },
    "b": {
      "dataTypes": [
        "uint8"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "lstm": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "initialCellState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "initialHiddenState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output0": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output1": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output2": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "peepholeWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentBias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "weight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "lstmCell": {
    "bias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "cellState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "hiddenState": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output0": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output1": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "peepholeWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentBias": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "recurrentWeight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "weight": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "matmul": {
    "a": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "max": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "maxPool2d": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "maxTensorByteLength": 4294967295,
  "min": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "mul": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "neg": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    }
  },
  "notEqual": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "uint8"
      ]
    }
  },
  "output": {
    "dataTypes": [
      "float32",
      "float16",
      "int32",
      "uint32",
      "int64",
      "int8",
      "int4",
      "uint64",
      "uint8",
      "uint4"
    ]
  },
  "pad": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "pow": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "preferredInputLayout": "nchw",
  "prelu": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    },
    "slope": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
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
  },
  "reciprocal": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "reduceL1": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    }
  },
  "reduceL2": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "reduceLogSum": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "reduceLogSumExp": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "reduceMax": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "reduceMean": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "reduceMin": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "reduceProduct": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    }
  },
  "reduceSum": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    }
  },
  "reduceSumSquare": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "uint64"
      ]
    }
  },
  "relu": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int64",
        "int32",
        "int8"
      ]
    }
  },
  "resample2d": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "uint8",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "uint8",
        "int8"
      ]
    }
  },
  "reshape": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "reverse": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "roundEven": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "scatterElements": {
    "indices": {
      "dataTypes": [
        "int32",
        "uint32",
        "int64"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "updates": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "scatterND": {
    "indices": {
      "dataTypes": [
        "int32",
        "uint32",
        "int64"
      ]
    },
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "updates": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "sigmoid": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "sign": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "int64",
        "int8"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "int64",
        "int8"
      ]
    }
  },
  "sin": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "slice": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "softmax": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "softplus": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "softsign": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "split": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "outputs": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "sqrt": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "sub": {
    "a": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "b": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "tan": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "tanh": {
    "input": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16"
      ]
    }
  },
  "tile": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "transpose": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "triangular": {
    "input": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  },
  "where": {
    "condition": {
      "dataTypes": [
        "uint8"
      ]
    },
    "falseValue": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "output": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    },
    "trueValue": {
      "dataTypes": [
        "float32",
        "float16",
        "int32",
        "uint32",
        "int64",
        "int8",
        "int4",
        "uint64",
        "uint8",
        "uint4"
      ]
    }
  }
};

if (typeof window !== 'undefined') {
  window.opSupportLimitsDefinedInSpec = opSupportLimitsDefinedInSpec;
  window.dispatchEvent(new CustomEvent('opSupportLimitsSpecReady'));
}

function getOSandVersion() {

}

let lastOpSupportLimits = null;

let osInfoPromise = null;

function versionStringToArray(version) {
  if (!version || typeof version !== 'string') {
    return null;
  }
  const sanitized = version.replace(/_/g, '.');
  const parts = sanitized.split('.').map(part => {
    const parsed = Number.parseInt(part, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  return parts.length ? parts : null;
}

function versionAtLeast(version, target) {
  const currentParts = versionStringToArray(version);
  const targetParts = versionStringToArray(target);
  if (!currentParts || !targetParts) {
    return false;
  }
  const maxLength = Math.max(currentParts.length, targetParts.length);
  for (let i = 0; i < maxLength; i += 1) {
    const current = currentParts[i] ?? 0;
    const expected = targetParts[i] ?? 0;
    if (current > expected) return true;
    if (current < expected) return false;
  }
  return true;
}

async function getOSandVersion() {
  if (osInfoPromise) {
    return osInfoPromise;
  }

  osInfoPromise = (async () => {
    if (typeof navigator === 'undefined') {
      return {
        name: 'unknown',
        version: 'unknown',
        confidence: 'low',
        detail: 'Navigator API unavailable',
        architecture: null,
        platformVersion: null,
        platformVersionMajor: null
      };
    }

    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    let highEntropy = null;
    if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      try {
        highEntropy = await navigator.userAgentData.getHighEntropyValues([
          'platformVersion',
          'architecture',
          'model'
        ]);
      } catch (error) {
        console.warn('Failed to read UA high entropy values:', error);
      }
    }

    const platformVersion = typeof highEntropy?.platformVersion === 'string'
      ? highEntropy.platformVersion
      : null;
    const platformVersionMajor = platformVersion
      ? Number.parseInt(platformVersion.split('.')[0], 10) || null
      : null;
    const architecture = highEntropy?.architecture || '';
    const model = highEntropy?.model || '';

    const info = {
      name: 'unknown',
      version: 'unknown',
      confidence: 'low',
      detail: '',
      architecture,
      platformVersion,
      platformVersionMajor
    };

    const setResult = (name, version, confidence, detail) => {
      info.name = name;
      info.version = version || 'unknown';
      info.confidence = confidence;
      info.detail = detail;
    };

    if (/cros/i.test(ua) || /chrome os/i.test(platform) || /chromebook/i.test(model)) {
      const match = ua.match(/CrOS [^\s]+ ([\d\.]+)/i);
      setResult('ChromeOS', match ? match[1].replace(/_/g, '.') : platformVersion || 'unknown', 'medium', 'Detected CrOS signature');
      return info;
    }

    if (/android/i.test(ua)) {
      const match = ua.match(/Android\s+([\d\.]+)/i);
      setResult('Android', match ? match[1] : platformVersion || 'unknown', 'high', 'Android UA');
      return info;
    }

    if (/iphone|ipad|ipod/i.test(ua)) {
      const match = ua.match(/OS\s([\d_]+)/i);
      setResult('iOS', match ? match[1].replace(/_/g, '.') : 'unknown', 'medium', 'iOS device UA');
      return info;
    }

    if (/mac os x/i.test(ua) || /macintosh/i.test(platform)) {
      const match = ua.match(/Mac OS X\s([\d_]+)/i);
      setResult('macOS', match ? match[1].replace(/_/g, '.') : platformVersion || 'unknown', match ? 'high' : 'medium', 'macOS UA detected');
      return info;
    }

    if (/windows/i.test(ua) || /win/i.test(platform)) {
      const versionMatch = ua.match(/Windows NT\s([\d\.]+)/i);
      const derivedVersion = versionMatch ? versionMatch[1] : platformVersion || 'unknown';
      setResult('Windows', derivedVersion, platformVersion ? 'medium' : 'low', 'Windows UA');
      return info;
    }

    if (/linux/i.test(ua)) {
      setResult('Linux', platformVersion || 'unknown', 'low', 'Linux UA');
      return info;
    }

    if (platform) {
      setResult(platform, platformVersion || 'unknown', 'low', 'Derived from platform field');
      return info;
    }

    return info;
  })();

  return osInfoPromise;
}

const backendLabels = {
  tflite: 'TensorFlow Lite',
  coreml: 'Core ML',
  onnx: 'ONNX Runtime (Windows ML)',
  directml: 'DirectML',
  unknown: 'unknown'
};

function determineCandidateBackends(osInfo) {
  const order = [];
  switch ((osInfo.name || '').toLowerCase()) {
    case 'chromeos':
      order.push('tflite');
      break;
    case 'linux':
      order.push('tflite');
      break;
    case 'android':
      order.push('tflite');
      break;
    case 'ios':
      order.push('tflite');
      break;
    case 'macos': {
      const isAppleSilicon = (osInfo.architecture || '').toLowerCase().includes('arm');
      if (isAppleSilicon && versionAtLeast(osInfo.version, '14.4')) {
        order.push('coreml');
      }
      order.push('tflite');
      break;
    }
    case 'windows': {
      const major = osInfo.platformVersionMajor;
      if (typeof major === 'number' && major >= 15) {
        order.push('onnx');
      }
      order.push('directml');
      order.push('tflite');
      break;
    }
    default:
      order.push('tflite');
      break;
  }
  return order;
}

async function backendDetection(limits) {
  const data = limits ?? lastOpSupportLimits;
  const osInfo = await getOSandVersion();

  if (!data || typeof data !== 'object') {
    return {
      backend: backendLabels.unknown,
      confidence: 'low',
      reason: 'No op support limits data available.',
      candidates: [],
      os: {
        name: osInfo.name,
        version: osInfo.version,
        detail: osInfo.detail
      }
    };
  }

  const layout = typeof data.preferredInputLayout === 'string'
    ? data.preferredInputLayout.toLowerCase()
    : '';
  const inputTypes = new Set(Array.isArray(data.input?.dataTypes) ? data.input.dataTypes : []);
  const constantTypes = new Set(Array.isArray(data.constant?.dataTypes) ? data.constant.dataTypes : []);
  const inputRankMax = data.input?.rankRange?.max;

  const candidateOrder = determineCandidateBackends(osInfo);

  const heuristics = [];

  if (layout === 'nhwc') {
    heuristics.push({
      id: 'tflite',
      reason: 'preferredInputLayout is NHWC (channels-last), matching the TensorFlow Lite backend defaults.',
      confidence: 'high'
    });
  }

  const coremlAllowed = ['float32', 'float16', 'int32'];
  const onlyCoremlTypes = inputTypes.size > 0 && Array.from(inputTypes).every(type => coremlAllowed.includes(type));
  if (onlyCoremlTypes && (inputRankMax === undefined || inputRankMax <= 5)) {
    heuristics.push({
      id: 'coreml',
      reason: 'Input tensors are limited to float16/float32/int32 with max rank <= 5, consistent with Core ML limits.',
      confidence: 'medium'
    });
  }

  if (inputTypes.has('uint4') || inputTypes.has('int4') || constantTypes.has('uint4') || constantTypes.has('int4')) {
    heuristics.push({
      id: 'onnx',
      reason: '4-bit tensor data types are exposed, which is characteristic of the ONNX Runtime backend.',
      confidence: 'medium'
    });
  }

  if (!heuristics.length && layout === 'nchw' && inputTypes.size > 0) {
    heuristics.push({
      id: 'directml',
      reason: 'Channels-first layout with broad tensor support and no 4-bit types points to DirectML.',
      confidence: 'low'
    });
  }

  const matchedHeuristic = heuristics.find(h => candidateOrder.includes(h.id));
  const backendId = matchedHeuristic?.id ?? candidateOrder[0] ?? 'unknown';
  const backendName = backendLabels[backendId] ?? backendId;

  let confidence = matchedHeuristic?.confidence ?? 'low';
  let reason = matchedHeuristic?.reason ?? 'Selected from OS-specific fallback order.';

  if (!matchedHeuristic && backendId === 'unknown') {
    reason = 'Unable to determine backend from available limits and OS hints.';
  }

  if (matchedHeuristic && heuristics.filter(h => h.id === matchedHeuristic.id).length > 1) {
    confidence = 'medium';
  }

  const result = {
    backend: backendName,
    confidence,
    reason,
    candidates: candidateOrder.map(id => backendLabels[id] ?? id),
    os: {
      name: osInfo.name,
      version: osInfo.version,
      detail: osInfo.detail
    }
  };

  return result;
}

if (typeof window !== 'undefined') {
  window.backendDetection = backendDetection;
  window.getOSandVersion = getOSandVersion;
}

function fillFeatures(json) {
	if (json.preferredInputLayout !== undefined) {
		const el = document.getElementById(`preferredInputLayout`);
		if (el) el.textContent = json.preferredInputLayout;
	}
	if (json.maxTensorByteLength !== undefined) {
		const el = document.getElementById(`maxTensorByteLength`);
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

function updateOpSupportLimits(json) {
  const spec = typeof opSupportLimitsDefinedInSpec === 'object' ? opSupportLimitsDefinedInSpec : {};
  fillFeatures(json);

  if (json.constant) fillSpecialRows(`constant`, spec.constant ?? null, json.constant);
  if (json.input) fillSpecialRows(`input`, spec.input ?? null, json.input);
  if (json.output) fillSpecialRows(`output`, spec.output ?? null, json.output);

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
			markSupportStates(`${opName}`, specOpEntry, opValue);
			continue;
		}

		const specOpSubEntries = typeof specOpEntry === 'object' && !Array.isArray(specOpEntry) ? specOpEntry : {};

		for (const [subName, subValue] of Object.entries(opValue)) {
			if (!subValue || typeof subValue !== 'object') continue;
			const specSubEntry = specOpSubEntries[subName] ?? null;
			markSupportStates(`${opName}-${subName}`, specSubEntry, subValue);
		}
	}
}

function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === null || b === null) {
    return a === b;
  }
  if (typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

async function runOpSupportLimitsTests() {
  const legend = $('#legend');
  const backend = $('#backend');
  const backendStatus = $('#backend-status');
	const opSupportLimits = $('#op-support-limits');
	const contexts = {};

  function capitalizeFirstLetter(str) {
    if (str.length === 0) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

	if (!navigator.ml?.createContext) {
		const message = 'WebNN is not available in this browser.';
		if (opSupportLimits) {
			opSupportLimits.textContent = message;
			opSupportLimits.setAttribute('class', 'fail');
		}
		return contexts;
	}

	try {
		const context = await navigator.ml.createContext({ deviceType: 'gpu' });
		try {
            const opSupport = context.opSupportLimits();
            lastOpSupportLimits = opSupport;
            if (typeof window !== 'undefined') {
              window.lastOpSupportLimits = opSupport;
            }
            console.log(opSupport);
            const backendInfo = await backendDetection(opSupport);
            if (typeof window !== 'undefined') {
              window.lastBackendDetection = backendInfo;
            }
            console.log('WebNN backend detection:', backendInfo);
            if(backendInfo.backend) {
              legend.setAttribute('class', 'legend');
            }
            backend.innerHTML = `${backendInfo.os.name} ${backendInfo.backend}`;
            backendStatus.setAttribute('title', `Confidence: ${capitalizeFirstLetter(backendInfo.confidence)}`);
            backendStatus.setAttribute('class', backendInfo.confidence);
            updateOpSupportLimits(opSupport);
		} catch (error) {
			console.warn('Failed to read op support limits:', error);
		}
	} catch (error) {
		if (opSupportLimits) {
			opSupportLimits.textContent = 'Failed to create context';
			opSupportLimits.setAttribute('class', 'fail');
		}
	}

  try {
		const cpuContext = await navigator.ml.createContext({ deviceType: 'cpu' });
		contexts.cpu = cpuContext;
  } catch (error) {
    contexts.cpu = null;
  }

  try {
		const gpuContext = await navigator.ml.createContext({ deviceType: 'gpu' });
		contexts.gpu = gpuContext;
  } catch (error) {
    contexts.gpu = null;
  }

  try {
		const npuContext = await navigator.ml.createContext({ deviceType: 'npu' });
		contexts.npu = npuContext;
  } catch (error) {
    contexts.npu = null;
  }

	return contexts;
}
