import * as sn from './smallneuron';
import { DirectedGraph } from 'graphology';
import * as dag from 'graphology-dag';

// Metadata defining the model externally
export class ModelMetadata {
    inputWidth: number;
    outputWidth: number;
  
    // Hyperparameters
    learningRate: number;
    lossFunction: 'meanSquaredError';
    epochCount: number;
    activationType: 'relu'|'tanh';
    batch_size: number;
  
    constructor(inputWidth: number, outputWidth: number, learningRate: number, activationType: 'relu'|'tanh', lossFunction: 'meanSquaredError', epochCount: number, batch_size: number) {
      this.inputWidth = inputWidth;
      this.outputWidth = outputWidth;
      this.learningRate = learningRate;
      this.lossFunction = lossFunction;
      this.epochCount = epochCount;
      this.activationType = activationType;
      this.batch_size = batch_size;
    }
  }


export interface TrainingData {
    inputs: sn.Tensorable[][];
    outputs: sn.Tensorable[][];
}
  
export class GraphModel {

    metadata: ModelMetadata;
    graph: DirectedGraph;

    inputs: sn.Tensorable[];
    outputs: sn.Tensor[];

    parameters: sn.Tensor[];



    constructor(md: ModelMetadata, graph: DirectedGraph) {
        this.metadata = md;

        // validate graph
        if(dag.hasCycle(graph)) throw new Error("GraphModel Creation Error: Provided DAG is not acyclic (cycles found).");
        this.graph = graph;

        this.parameters = [];

          
        // parse nodes into neurons and layers
        dag.forEachNodeInTopologicalOrder(this.graph, (node, attributes) => {
            // node attributes should be in the format
            // {
            //  type: "Neuron" | "Layer" | "Input"
            //  ?input_width: number
            //  ?output_width: number
            //  input_ids: string[]
            //  output_ids: string[]
            //  ?component: sn.Neuron | sn.Layer
            //  ?input_index: number
            //  ?nobias: boolean
            // }

            // if its a neuron or layer node get dependencies and add to model
            if(attributes.type == "Neuron") {
                const neuron = sn.neuron(attributes.input_width, attributes.activation, attributes.nobias);

                // add parameters to model
                if(neuron.weights instanceof Array) neuron.weights.forEach(weight => this.parameters.push(weight));
                else this.parameters.push(neuron.weights);
                if(!neuron.nobias) this.parameters.push(neuron.bias);

                this.graph.setNodeAttribute(node, "component", neuron);
            } else if(attributes.type == "Layer") {
                const layer = sn.layer(attributes.input_width, attributes.output_width, attributes.activation, attributes.nobias);

                // add parameters to model
                layer.neurons.forEach(neuron => {
                    if(neuron.weights instanceof Array) neuron.weights.forEach(weight => this.parameters.push(weight));
                    else this.parameters.push(neuron.weights);
                    this.parameters.push(neuron.bias);
                });

                this.graph.setNodeAttribute(node, "component", layer);
            }

        });

    }

    forward(inputs: sn.Tensorable[]): sn.Tensor[] {
        // validate input tensors
        if(inputs.length != this.metadata.inputWidth) throw new Error("Forward Pass Error: inputs don't match expected width.")
        this.inputs = inputs;

        // map out graph nodes to tf layers
        const nodeToTensorMap = new Map<string, sn.Tensor | sn.Tensor[]>();

        // parse nodes into neurons and layers
        dag.forEachNodeInTopologicalOrder(this.graph, (node, attributes) => {
            // if its a neuron or layer node get dependencies and add to model
            if((attributes.type == "Input")) {
                const input = inputs[attributes.input_index];
                nodeToTensorMap.set(node, input instanceof sn.Tensor ? input : sn.tensor(input));
            } else {
                
                const srcs: sn.Tensor[] = [];

                attributes.input_ids.forEach((srcNode: string) => {
                    // get node from node to layer map or from inputs
                    const src = nodeToTensorMap.get(srcNode);

                    // nullcheck
                    if(src == undefined) {
                        throw new Error("GraphModel Creation Error: Neuron dependency undefined, DAG neuron requested before creation.");
                    } else {
                        src instanceof Array ? src.forEach(n => srcs.push(n)) : srcs.push(src);
                    }
                
                });

                // call neuron/layer and get output tensor
                nodeToTensorMap.set(node, attributes.component.call(srcs));

            }

        });

        // after parsing all neurons and layers filter to nodes without edges starting from them i.e. output nodes
        const outputNodes = this.graph.nodes().filter(node =>
            this.graph.getNodeAttributes(node).output_ids.length == 0
        );

        // assign output tensors
        this.outputs = outputNodes.flatMap(outputNode => {
            return nodeToTensorMap.get(outputNode) ?? sn.tensor(0);
        });

        return this.outputs;
    }

    train(training_data: TrainingData, log: boolean = false, num_epochs: number = this.metadata.epochCount): number[] {

        if(log) console.log(`training ${this.parameters.length} parameters for ${num_epochs} epochs.`);

        let losses: number[] = [];

        for(let epoch = 0; epoch < num_epochs; epoch++) {
            // create batch
            const batch_indices: number[] = [];
            for(let i = 0; i < this.metadata.batch_size; i++) {
                batch_indices.push(Math.floor(Math.random()*(training_data.inputs.length)));
            }

            const batch_in: sn.Tensorable[][] = batch_indices.map(ix => training_data.inputs[ix]);
            const batch_out: sn.Tensorable[][] = batch_indices.map(ix => training_data.outputs[ix]);
            
            // forward model
            const outputs: sn.Tensor[][] = batch_in.map(inputs => this.forward(inputs));

            // evaluate loss on batch
            let loss = sn.tensor(0);
            batch_out.forEach((output_set, i) => {
                // loss
                loss = loss.add(this.eval_loss(
                    output_set.map(output => output instanceof sn.Tensor ? output : sn.tensor(output)), 
                    outputs[i]
                ));

            });
            loss = loss.div(batch_out.length);

            losses.push(loss.data);

            // backward pass
            this.parameters.forEach(parameter => {
                parameter.grad = 0;
            });

            loss.backward();

            // update parameters
            this.parameters.forEach(parameter => {
                parameter.data -= parameter.grad * this.metadata.learningRate;
            });

            if(log  && ((epoch-1) % (Math.floor(num_epochs/10)) == 0) ) {
                // evaluate accuracy on batch
                let accuracy: number = 0;
                const flat_expected = batch_out.flat();
                const flat_real = outputs.flat();
                flat_expected.forEach((output, i) => {
                    accuracy += Math.round((output instanceof sn.Tensor ? output.data : output) - flat_real[i].data) == 0 ? 1 : 0;
                })
                accuracy /= flat_expected.length;

                // log epoch and measured loss and accuracy
                console.log(`Epoch ${epoch} [evaluated loss: ${loss.data}, accuracy: ${accuracy}]`);
            }

        }

        return losses;
    }

    eval_loss(expected_outputs: sn.Tensor[], real_outputs: sn.Tensor[]): sn.Tensor {
        if(expected_outputs.length != real_outputs.length) throw new Error("Loss Evaluation Error: lengths of expected result doesn't real length.");
        let loss = sn.tensor(0);

        if(this.metadata.lossFunction == "meanSquaredError") {
            expected_outputs.forEach((expected, i) => {
                loss = loss.add((expected.sub(real_outputs[i])).pow(2));
            });
            loss = loss.div(expected_outputs.length);
        }


        return loss;
    }
}
