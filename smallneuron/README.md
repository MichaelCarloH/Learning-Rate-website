### SmallNeuron Library

SmallNeuron is a TypeScript library for building simple neural networks and performing basic tensor operations. It provides classes for tensors, neurons, and layers, along with methods for mathematical operations and activations commonly used in neural networks.

### Installation

To use SmallNeuron in your TypeScript project, you can install it via npm:

```bash
npm install smallneuron
```

### Usage

Here's how you can use SmallNeuron to create a simple neural network:

```typescript
import { tensor, neuron, layer } from 'smallneuron';

// Create a tensor
const inputTensor = tensor(3.0);

// Create a neuron
const singleNeuron = neuron(1);

// Create a layer with 1 input and 1 output neuron
const singleLayer = layer(1, 1);

// Call the layer with input tensor
const output = singleLayer.call([inputTensor]);

console.log(output); // Output will be an array of tensors with single value
```

### Classes

#### `Tensor`

Represents a tensor object with data, gradient, children, and operation.

**Constructor:**
- `data: number`: Initial data value of the tensor.
- `children: Tensor[] = []`: Array of child tensors (default empty).
- `operation: Operation = 'leaf'`: Operation used to create the tensor (default 'leaf').

**Methods:**
- `clear_gradients(): void`: Clears gradients of the tensor and its children.
- `backward(): void`: Performs backward propagation to calculate gradients.
- Operations:
  - `add(other: Tensorable): Tensor`: Addition operation.
  - `neg(): Tensor`: Negation operation.
  - `sub(other: Tensorable): Tensor`: Subtraction operation.
  - `mul(other: Tensorable): Tensor`: Multiplication operation.
  - `pow(other: number): Tensor`: Power operation.
  - `exp(): Tensor`: Exponential operation.
  - `inv(): Tensor`: Inverse operation.
  - `div(other: Tensorable): Tensor`: Division operation.
  - `tanh(): Tensor`: Hyperbolic tangent operation.
  - `relu(): Tensor`: Rectified Linear Unit (ReLU) operation.

#### `Neuron`

Represents a neuron with weights, bias, and activation function.

**Constructor:**
- `input_width: number`: Width of the input.
- `activation: 'relu' | 'tanh' = 'relu'`: Activation function type (default 'relu').
- `nobias: boolean = false`: Indicates whether the neuron has bias (default false).

**Methods:**
- `call(inputs: Tensorable | Tensorable[]): Tensor`: Calls the neuron with input tensor(s) and returns the output tensor.

#### `Layer`

Represents a layer of neurons.

**Constructor:**
- `input_width: number`: Width of the input.
- `output_width: number`: Width of the output.
- `activation: 'relu' | 'tanh' = 'relu'`: Activation function type (default 'relu').
- `nobias: boolean = false`: Indicates whether the layer has bias (default false).

**Methods:**
- `call(inputs: Tensorable[]): Tensor[]`: Calls the layer with input tensors and returns an array of output tensors.

### Creator Functions

- `tensor(data: number, children: Tensor[] = [], operation: Operation = 'leaf'): Tensor`: Creates a tensor object.
- `neuron(input_width: number, activation: 'relu' | 'tanh' = 'relu', nobias: boolean = false): Neuron`: Creates a neuron object.
- `layer(input_width: number, output_width: number, activation: 'relu' | 'tanh' = 'relu', nobias: boolean = false): Layer`: Creates a layer object.

### SmallNeuron-Graph Extension

SmallNeuron-Graph is an extension of the SmallNeuron library that enables the creation and training of neural network models directly from graph data structures. This extension leverages the capabilities of the SmallNeuron library and the graphology library to dynamically construct neural network architectures from directed acyclic graphs (DAGs).

### Usage with Graph Data

Here's how you can use SmallNeuron-Graph to create and train a neural network model from a directed acyclic graph:

```typescript
import * as sn from 'smallneuron';
import { DirectedGraph } from 'graphology';
import { ModelMetadata, TrainingData, GraphModel } from 'smallneuron-graph';

// Define model metadata
const metadata = new ModelMetadata(2, 1, 0.01, 'relu', 'meanSquaredError', 100, 32);

// Create a directed acyclic graph representing the neural network architecture
const graph = new DirectedGraph();
graph.addNode('input1', { type: 'Input', output_ids: ['neuron1'], input_index: 0 });
graph.addNode('input2', { type: 'Input', output_ids: ['neuron1'], input_index: 1 });
graph.addNode('neuron1', {
	type: 'Neuron',
	input_width: 2, 
	input_ids: ['input1', 'input2'], 
	output_ids: ['output'], 
	activation: 'relu' 
	});
graph.addNode('output', {
	type: 'Neuron', 
	input_width: 1, 
	input_ids: ['neuron1'], 
	output_ids: [], 
	activation: 'relu' 
});
graph.addDirectedEdge('input1', 'neuron1');
graph.addDirectedEdge('input2', 'neuron1');
graph.addDirectedEdge('neuron1', 'output');

// Create training data
const trainingData: TrainingData = {
    inputs: [[0, 0], [0, 1], [1, 0], [1, 1]],
    outputs: [[0], [1], [1], [0]]
};

// Create and train the model
const model = new GraphModel(metadata, graph);
const losses = model.train(trainingData, true);

console.log(losses); // Array of losses during training
```

### Classes and Interfaces

#### `ModelMetadata`

Metadata defining the model externally, including input and output widths, hyperparameters, and activation type.

#### `TrainingData`

Interface representing training data containing inputs and corresponding outputs.

#### `GraphModel`

Class representing a neural network model constructed from a directed acyclic graph. It provides methods for forward pass, training, and evaluation.
