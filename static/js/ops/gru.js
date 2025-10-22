(() => {
    if (typeof window === 'undefined') {
        return;
    }
    const spec = {
        inputs: {
            input: {
                descriptor: { dataType: 'float16', shape: [1, 3, 2] },
                data: [1, 2, 2, 1, 1, 1]
            },
            weight: {
                descriptor: { dataType: 'float16', shape: [1, 12, 2] },
                data: [
                    1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375,
                    1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375,
                    1, -1, 2, -2, 0.5, -0.5, 0, 0.0999755859375
                ]
            },
            recurrentWeight: {
                descriptor: { dataType: 'float16', shape: [1, 12, 4] },
                data: [
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375,
                    0.0999755859375, 0.0999755859375, 0.0999755859375, 0.0999755859375
                ]
            },
            bias: {
                descriptor: { dataType: 'float16', shape: [1, 12] },
                data: [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5]
            },
            recurrentBias: {
                descriptor: { dataType: 'float16', shape: [1, 12] },
                data: [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5]
            }
        },
        build: (builder, { input, weight, recurrentWeight, bias, recurrentBias }) => {
            // builder.gru returns an array; take the primary output.
            const [output] = builder.gru(
                input,
                weight,
                recurrentWeight,
                1,
                4,
                {
                    bias,
                    recurrentBias,
                    resetAfter: false,
                    activations: ['relu', 'relu']
                }
            );
            return output;
        },
        expected: {
            descriptor: { dataType: 'float16', shape: [1, 3, 4] },
            data: [
                0, 0, -0.25, -3.83984375,
                -4, -15, -2.25, -3.41015625,
                -1, -3, -1, -3.41015625
            ]
        }
    };
    const register = window.registerOperationTest;
    if (typeof register === 'function') {
        register('gru', spec);
        return;
    }
    const store = window.operationTests = window.operationTests || {};
    store.gru = spec;
})();
