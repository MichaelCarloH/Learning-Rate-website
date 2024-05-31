import { tensor, neuron, layer, Tensor, Neuron, Layer } from './smallneuron';
import { randn } from './smallneuron_utils';

describe('Tensor Class Tests', () => {
    test('Test Addition (add method)', () => {
        // Add two positive numbers
        let result = tensor(3).add(4);
        expect(result.data).toBe(7);

        // Add a positive and a negative number
        result = tensor(5).add(-3);
        expect(result.data).toBe(2);

        // Add two negative numbers
        result = tensor(-2).add(-3);
        expect(result.data).toBe(-5);

        // Add zero to a positive/negative number
        result = tensor(5).add(0);
        expect(result.data).toBe(5);
        result = tensor(-3).add(0);
        expect(result.data).toBe(-3);

        // Add with one operand being zero
        result = tensor(0).add(5);
        expect(result.data).toBe(5);

        // adding 2 tensors
        let a = tensor(3);
        let b = tensor(7);
        result = a.add(b);
        expect(result.data).toBe(10);

    });

    test('Test Negation (neg method)', () => {
        // negate positive number
        let result = tensor(3).neg();
        expect(result.data).toBe(-3);

        // negate a negative number
        result = tensor(-5).neg();
        expect(result.data).toBe(5);

        // negate 0
        result = tensor(0).neg();
        expect(result.data).toBeCloseTo(0);
    });

    test('Test Subtraction (sub method)', () => {
        // Sub two positive numbers
        let result = tensor(5).sub(4);
        expect(result.data).toBe(1);

        // Sub a positive and a negative number
        result = tensor(5).sub(-3);
        expect(result.data).toBe(8);

        // Sub two negative numbers
        result = tensor(-2).sub(-3);
        expect(result.data).toBe(1);

        // Sub zero to a positive/negative number
        result = tensor(5).sub(0);
        expect(result.data).toBe(5);
        result = tensor(-3).sub(0);
        expect(result.data).toBe(-3);

        // Sub with one operand being zero
        result = tensor(0).sub(5);
        expect(result.data).toBe(-5);
    });

    test('Test Multiplication (mul method)', () => {
        // Mul two positive numbers
        let result = tensor(3).mul(4);
        expect(result.data).toBe(12);

        // Mul a positive and a negative number
        result = tensor(5).mul(-3);
        expect(result.data).toBe(-15);

        // Mul two negative numbers
        result = tensor(-2).mul(-3);
        expect(result.data).toBe(6);

        // Mul zero with a positive/negative number
        result = tensor(5).mul(0);
        expect(result.data).toBeCloseTo(0);
        result = tensor(-3).mul(0);
        expect(result.data).toBeCloseTo(0);

        // Mul with one operand being zero
        result = tensor(0).mul(5);
        expect(result.data).toBeCloseTo(0);
    });

    test('Test Exponentiation (pow method)', () => {
        // exponentiate two positive numbers
        let result = tensor(3).pow(4);
        expect(result.data).toBe(81);

        // exponentiate a positive and a negative number
        result = tensor(5).pow(-3);
        expect(result.data).toBe(1/125);

        // exponentiate two negative numbers
        result = tensor(-2).pow(-3);
        expect(result.data).toBe(-0.125);

        // exponentiate to 0
        result = tensor(5).pow(0);
        expect(result.data).toBe(1);
        result = tensor(-3).pow(0);
        expect(result.data).toBe(1);

        // exponentiate zero to a positive/negative number
        result = tensor(0).pow(5);
        expect(result.data).toBeCloseTo(0);
    });

    test('Test Euler\'s number Exponentiation (exp method)', () => {
        // e to the power of a positive number
        let result = tensor(3).exp();
        expect(result.data).toBeCloseTo(20.0855369232, 4);

        // e to the power of a negative number
        result = tensor(-5).exp();
        expect(result.data).toBeCloseTo(0.00673794699, 4);

        // e to the power of 0
        result = tensor(0).exp();
        expect(result.data).toBeCloseTo(1, 4);
    });

    test('Test Reciprocation (inv method)', () => {
        // reciprocate positive number
        let result = tensor(3).inv();
        expect(result.data).toBe(1/3);

        // reciprocate positive number
        result = tensor(-5).inv();
        expect(result.data).toBe(-0.2);

        // reciprocate 0
        result = tensor(0).inv();
        expect(result.data).toBe(Infinity);
    });

    test('Test Division (div method)', () => {
        // divide two positive numbers
        let result = tensor(3).div(4);
        expect(result.data).toBe(0.75);

        // divide a positive and a negative number
        result = tensor(5).div(-3);
        expect(result.data).toBeCloseTo(-5/3);

        // divide two negative numbers
        result = tensor(-2).div(-3);
        expect(result.data).toBeCloseTo(2/3);

        // divide by zero
        result = tensor(5).div(0);
        expect(result.data).toBe(Infinity);
        result = tensor(-3).div(0);
        expect(result.data).toBe(-Infinity);
    });

    test('Test Tanh (tanh method)', () => {
        // tanh positive number
        let result = tensor(3).tanh();
        expect(result.data).toBeCloseTo(0.995054754);

        // tanh negative number
        result = tensor(-0.4).tanh();
        expect(result.data).toBeCloseTo(-0.37994896225);

        // tanh 0
        result = tensor(0).tanh();
        expect(result.data).toBeCloseTo(0);
    });

    test('Test ReLU (relu method)', () => {
        // relu positive number
        let result = tensor(3).relu();
        expect(result.data).toBeCloseTo(3);

        // relu negative number
        result = tensor(-0.4).relu();
        expect(result.data).toBeCloseTo(0);

        // relu 0
        result = tensor(0).relu();
        expect(result.data).toBeCloseTo(0);
    });

    test('Test backpropagation (backward method and clear gradient method)', () => {
        // backprop through a first complex graph
        let a = tensor(2.7);
        let b = tensor(0);
        let c = tensor(-4);
        let d = tensor(5);
        let e = tensor(0.23);
        let f = tensor(3);

        // ((a + (((b-c)*d)/(e*d))) * (((-1/f).exp()).tanh()**3) * (a.relu().exp()/e)) / 1e2
        let result =  a.add(b.sub(c).mul(d).div(e.mul(d))).mul(f.inv().neg().exp().tanh().pow(3)).mul(a.relu().exp().div(e)).div(1e2) 
        // run backward pass
        result.backward();

        // check result validity
        expect(result.data).toBeCloseTo(3.0198);

        // check gradients (precalculated using torch)
        expect(a.grad).toBeCloseTo(3.1701);
        expect(b.grad).toBeCloseTo(0.6535);
        expect(c.grad).toBeCloseTo(-0.6535);
        expect(d.grad).toBeCloseTo(1.1102e-16);
        expect(e.grad).toBeCloseTo(-24.4950);
        expect(f.grad).toBeCloseTo(0.7299);

        // clear gradients and try another complex graph
        result.clear_gradients();

        // check gradients to be zerod out
        expect(a.grad).toBeCloseTo(0);
        expect(b.grad).toBeCloseTo(0);
        expect(c.grad).toBeCloseTo(0);
        expect(d.grad).toBeCloseTo(0);
        expect(e.grad).toBeCloseTo(0);
        expect(f.grad).toBeCloseTo(0);

        // ((-((-1/a**2).tanh()+((1/((-c).exp())))*d)).relu()**-3 - (-(f*(e+b))/(c*d)).exp()*1e4)/1e2
        result =  (a.pow(2).inv().neg().tanh().add(c.neg().exp().inv().mul(d))).neg().relu().pow(-3).sub((f.mul(e.add(b)).div(c.mul(d)).neg().exp()).mul(1e4)).div(1e2);

        // run backward pass
        result.backward();

        // check result validity
        expect(result.data).toBeCloseTo(8.1381);

        // check gradients (precalculated using torch)
        expect(a.grad).toBeCloseTo(746.5344);
        expect(b.grad).toBeCloseTo(-15.5265);
        expect(c.grad).toBeCloseTo(684.6740);
        expect(d.grad).toBeCloseTo(137.8276);
        expect(e.grad).toBeCloseTo(-15.5265);
        expect(f.grad).toBeCloseTo(-1.1904);
    });

    
});

describe('Neuron Class Tests', () => {
    test('Test Neuron Initialization', () => {
        // Initialize single-input neuron
        let n: Neuron = neuron(1);
        expect(n.input_width).toBe(1);
        expect(n.weights instanceof Tensor).toBe(true);
        expect(n.bias instanceof Tensor).toBe(true);

        n = neuron(1, "tanh", true);
        expect(n.activationType).toBe("tanh");
        expect(n.input_width).toBe(1);
        expect(n.weights instanceof Tensor).toBe(true);
        expect(n.bias instanceof Tensor).toBe(true);

        // Initialize multi-input neuron
        n = neuron(3);
        expect(n.input_width).toBe(3);
        expect(Array.isArray(n.weights)).toBe(true);
        expect(n.bias instanceof Tensor).toBe(true);

        if(n.weights instanceof Array) { // it will be if tests pass
            expect(n.weights.length).toBe(3);
        }
    });

    test('Test Individual Neuron', () => {
        // single input neuron
        let n: Neuron = neuron(1, 'tanh');

        const weight: Tensor = n.weights instanceof Tensor ? n.weights : tensor(0);
        let bias: Tensor = n.bias;

        expect(n.call(3.2).data).toBeCloseTo(tensor(3.2*weight.data + bias.data).tanh().data);
        
        // multi-input neuron
        n = neuron(3, "relu");

        const weights: Tensor[] = n.weights instanceof Array ? n.weights : [];
        bias = n.bias;

        expect(weights.length).toBe(3);

        const inputs = [3.2, 4.1, 0.75];
        const result = n.call(inputs);
        const expected = tensor(inputs.map((input, i) => input*weights[i].data).reduce((sum, current) => sum+current) + bias.data).relu().data;

        expect(result.data).toBeCloseTo(expected);

        // backpropagation
        result.backward();
        for(let i = 0; i < 3; i++) {
            expect(weights[i].grad).toBeCloseTo(expected > 0 ? inputs[i] : 0);
        }
        expect(bias.grad).toBeCloseTo(expected > 0 ? 1 : 0);
    });

    test('Test Network of Neurons', () => {
        // neuron network
        const ns: Neuron[] = [];
        ns.push(neuron(3));
        ns.push(neuron(3));
        ns.push(neuron(2));
        ns.push(neuron(2));
        ns.push(neuron(2));

        // put all weights into matrix
        const weights: Tensor[][] = ns[0].weights instanceof Array ? ns.map(n => n.weights instanceof Array ? n.weights : []) : [[]];
        const biases: Tensor[] = ns.map(n => n.bias);
        
        expect(weights.length).toBe(5);
        expect(biases.length).toBe(5);

        const inputs = [3.2, 4.1, 0.75];
        const l1 = [ns[0].call(inputs), ns[1].call(inputs)];
        const l2 = [ns[2].call(l1), ns[3].call(l1)];
        const result = ns[4].call(l2);
        const l1_expected = [
            tensor(inputs.map((input, i) => input*weights[0][i].data).reduce((sum, current) => sum+current)+biases[0].data).relu().data, 
            tensor(inputs.map((input, i) => input*weights[1][i].data).reduce((sum, current) => sum+current)+biases[1].data).relu().data
        ]
        const l2_expected = [
            tensor(l1_expected.map((input, i) => input*weights[2][i].data).reduce((sum, current) => sum+current)+biases[2].data).relu().data, 
            tensor(l1_expected.map((input, i) => input*weights[3][i].data).reduce((sum, current) => sum+current)+biases[3].data).relu().data
        ]
        let expected = tensor(l2_expected.map((input, i) => input*weights[4][i].data).reduce((sum, current) => sum+current)+biases[4].data).relu().data;

        expect(result.data).toBeCloseTo(expected);

        // backpropagation
        result.backward();

        const weights_expected: number[][] = [];
        const bias_expected: number[] = [];

        const n1_weights_expected: number[] = [];
        const n2_weights_expected: number[] = [];
        const n3_weights_expected: number[] = [];
        const n4_weights_expected: number[] = [];
        const n5_weights_expected: number[] = [];

        // layer 3
        for(let i = 0; i < 2; i++) {
            n5_weights_expected.push(expected > 0 ? l2_expected[i] : 0);
        }
        bias_expected.push(expected > 0 ? 1 : 0);

        // layer 2
        for(let i = 0; i < 2; i++) {
            n3_weights_expected.push((l2_expected[0] > 0 && expected > 0 ? l1_expected[i] : 0) * weights[4][0].data);
            n4_weights_expected.push((l2_expected[1] > 0 && expected > 0 ? l1_expected[i] : 0) * weights[4][1].data);
        }
        bias_expected.push((l2_expected[1] > 0 && expected > 0) ? weights[4][1].data : 0);
        bias_expected.push((l2_expected[0] > 0 && expected > 0) ? weights[4][0].data : 0);

        // layer 1
        for(let i = 0; i < 3; i++) {
            n1_weights_expected.push(
                (l1_expected[0] > 0 && l2_expected[0] > 0 && expected > 0 ? inputs[i] : 0) * 
                weights[2][0].data * weights[4][0].data + 
                (l1_expected[0] > 0 && l2_expected[1] > 0 && expected > 0 ? inputs[i] : 0) * 
                weights[3][0].data * weights[4][1].data
            );
            n2_weights_expected.push(
                (l1_expected[1] > 0 && l2_expected[0] > 0 && expected > 0 ? inputs[i] : 0) * 
                weights[2][1].data * weights[4][0].data +
                (l1_expected[1] > 0 && l2_expected[1] > 0 && expected > 0 ? inputs[i] : 0) * 
                weights[3][1].data * weights[4][1].data
            );
        }
        bias_expected.push(
            (l1_expected[1] > 0 && l2_expected[0] > 0 && expected > 0 ? 1 : 0) *
            weights[2][1].data * weights[4][0].data + 
            (l1_expected[1] > 0 && l2_expected[1] > 0 && expected > 0 ? 1 : 0) * 
            weights[3][1].data * weights[4][1].data
        );
        bias_expected.push(
            (l1_expected[0] > 0 && l2_expected[0] > 0 && expected > 0 ? 1 : 0) *
            weights[2][0].data * weights[4][0].data +
            (l1_expected[0] > 0 && l2_expected[1] > 0 && expected > 0 ? 1 : 0) *
            weights[3][0].data * weights[4][1].data
        );
        

        weights_expected.push(n1_weights_expected);
        weights_expected.push(n2_weights_expected);
        weights_expected.push(n3_weights_expected);
        weights_expected.push(n4_weights_expected);
        weights_expected.push(n5_weights_expected);

        bias_expected.reverse();

        [4,3,2,1,0].forEach(i => {
            [0,1].forEach(j => {
                expect(weights[i][j].grad).toBeCloseTo(weights_expected[i][j]);
            });
            expect(biases[i].grad).toBeCloseTo(bias_expected[i]);
        });
        
    });

});

describe('Layer Class Tests', () => {
    test('Test Layer Initialization', () => {
        // Initialize layer with single neuron
        let l: Layer = layer(2, 1);
        expect(l.input_width).toBe(2);
        expect(l.output_width).toBe(1);
        expect(l.neurons.length).toBe(1);

        // Initialize layer with multiple neurons
        l = layer(2, 3, "relu", true);
        expect(l.input_width).toBe(2);
        expect(l.output_width).toBe(3);
        expect(l.neurons.length).toBe(3);
    });

    test('Test Individual Layer', () => {
        // initialize broken layer with width less than 1
        try {
            const bl: Layer = layer(4,0);
        } catch(e) {
            expect(e instanceof Error).toBe(true);
        }

        // Initialize layer with multiple neurons
        const l: Layer = layer(3, 2);
        expect(l.input_width).toBe(3);
        expect(l.output_width).toBe(2);
        expect(l.neurons.length).toBe(2);

        const weights: Tensor[][] = l.neurons.map(n => n.weights instanceof Array ? n.weights : []);
        const biases:  Tensor[] = l.neurons.map(n => n.bias);

        expect(weights.length).toBe(2);
        expect(biases.length).toBe(2);

        const inputs = [3.2, 4.1, 0.75];
        const results = l.call(inputs);
        const expecteds: number[] = l.neurons.map(neuron => 
            tensor(inputs.map((input, i) => input*neuron.weights[i].data).reduce((sum, current) => sum+current) + neuron.bias.data).relu().data
        );

        results.forEach((result, i) => expect(result.data).toBeCloseTo(expecteds[i]));

        // could test backprop, unnecessary
    });
});

describe('Utilities Tests', () => {
    test('Test Randn function', () => {
        // generate 10k values
        const n: number = 10_000;
        const nums: number[] = [];
        for(let i = 0; i < n; i++) {
            nums.push(randn());
        }
        const mean: number = nums.reduce((runningmean, current) => runningmean + current) / n;
        const variance: number = nums.reduce((runningvariance, current) => runningvariance + ((current-mean)**2)) / (n-1);
        const stdev: number = Math.sqrt(variance);

        expect(mean).toBeCloseTo(0, 1);
        expect(stdev).toBeCloseTo(1, 1);
    });

});