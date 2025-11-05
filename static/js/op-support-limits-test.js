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
	const opSupportLimits = $('#op-support-limits');
	const contexts = {};

	if (!navigator.ml?.createContext) {
		const message = 'WebNN is not available in this browser.';
		if (opSupportLimits) {
			opSupportLimits.textContent = message;
			opSupportLimits.setAttribute('class', 'fail');
		}
		return contexts;
	}

	try {
		const context = await navigator.ml.createContext({ powerPreference: 'default' });
		try {
			json = context.opSupportLimits();
			console.log(json);
			updateOpSupportLimits(json);
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
