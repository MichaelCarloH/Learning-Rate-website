
import React from 'react';
import { Node, Edge } from 'react-flow-renderer';
import * as sn from 'smallneuron/smallneuron';
import * as sng from 'smallneuron/smallneuron-graph';
import { DirectedGraph } from 'graphology';
import { TrainingFields } from '../contexts & popups/training_fields_ctx';
import { useContext } from 'react';
import { Position } from 'reactflow';

//Define model, metafata and graph objects
let model: sng.GraphModel;
let metadata:sng.ModelMetadata; 
let graph:DirectedGraph = new DirectedGraph();

interface NodeArrays {

  nodes: Node[];
  edges: Edge[];
  setNodes: (node: Node<any>[]) => void;
  setEdges: (edge: Edge<any>[]) => void;
  
}


// Converts GUI graph to Graphology DAG. Called every time training data | hyperparameters change
const GUItoGraphology = ( nodes: Node[], edges: Edge[], graph: DirectedGraph) => {

  graph.clear();

  nodes.forEach((node) => {
    if (node.type === 'inputnode') {
      graph.addNode(node.id, { type: 'Input', output_ids: [], input_index: node.data.index });

    } else if (node.type === 'neuron') {
      graph.addNode(node.id, {
        type: 'Neuron',
        input_width: 0,
        input_ids: [],
        output_ids: [],
        activation: 'relu',
        component: undefined
      });

    } else if (node.type === 'layer') {
      graph.addNode(node.id, {
        type: 'Layer',
        input_width: 1,
        output_width: 1,
        input_ids: [],
        output_ids: [],
        activation: 'relu',
        component: undefined
      });

    } else if (node.type === 'outputNeuron') {
      graph.addNode(node.id, {
        type: 'Neuron',
        input_width: 0,
        input_ids: [],
        activation: 'relu',
        component: undefined
      });
    }

  });


  // Add edges to the Graphology DAG
  edges.forEach((edge) => {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.addDirectedEdge(edge.source, edge.target);
    }
  });


  // Connect set the input_ids and output_ids of each Graphology DAG node
  nodes.filter(node => (node.type !== 'popup')).forEach((node) => {
    let outputIds = graph.outNeighbors(node.id);
    graph.mergeNodeAttributes(node.id, { output_ids: outputIds });

    let inputIds = graph.inNeighbors(node.id);
    graph.mergeNodeAttributes(node.id, { input_ids: inputIds });
  });


  
  // Assign inputWidth and outputWidth of each Graphology DAG node based on input_ids and output_ids
  nodes.filter(node => node.type !== 'popup').forEach((node) => {

    const nodeAttributes = graph.getNodeAttributes(node.id);
    let inputWidth:number; 
    let outputWidth:number; 


    if (node.type == 'outputNeuron' || node.type == 'neuron'){
      inputWidth = nodeAttributes.input_ids.length;
      outputWidth = nodeAttributes.output_ids.length;
      
    }

    else{
      inputWidth = node.data.input_width;
      outputWidth = node.data.output_width;
    }


    graph.mergeNodeAttributes(node.id, { input_width: inputWidth, output_width: outputWidth });
    
  });

};


const NodeContainer: React.FC<NodeArrays> = ({nodes, edges, setNodes,setEdges}) => {

    const trainingFields = useContext(TrainingFields);
    

    // If the train button is pressed, we train
    if(trainingFields.TrainingState === 'train'){

      let inputWidth: number = (trainingFields.TrainingData.Inputs[0] ?? []).length;
      let outputWidth: number = (trainingFields.TrainingData.Outputs[0] ?? []).length;

      let losses:number[];
      let trainingData: sng.TrainingData;

      trainingData = {
        inputs: trainingFields.TrainingData.Inputs,
        outputs: trainingFields.TrainingData.Outputs
      };

      metadata = new sng.ModelMetadata(inputWidth, outputWidth, trainingFields.LearningRate, trainingFields.Activation, "meanSquaredError", trainingFields.Epochs, trainingFields.BatchSize);

      // If it's the first time we train the model, we create a new one
      if (trainingFields.isNewModel){
    
        GUItoGraphology(nodes,edges,graph)
        model = new sng.GraphModel(metadata, graph);
        trainingFields.setIsNewModel(false);
        trainingFields.setShowFPData([true,false]) //state to hide outputs/inputs of neurons (aesthetics)
      }

      else { // we simply assign the metadata to the model in case the user changes it 

        model.metadata = metadata;
        trainingFields.setShowFPData([true,false]);

      }


      try { // train the model

        losses = model?.train(trainingData,false,trainingFields.Epochs);
        trainingFields.setLosses(losses);
        
      } catch (error) {
        trainingFields.setIsNewModel(true);
        
      }


      // After training, update the weights and biases of each reactflow node with the "trained values"
        const updatedNodes = nodes.map((node) => {

          if (node.type === 'popup') { // allows to dynamically update the popup while active when train is pressed
            const selectedNode = nodes.find((n) => n.id === node.data.selectedNodeId);

            if (selectedNode) {
              node.data.weight = selectedNode.data.weight;
              node.data.bias = selectedNode.data.bias;
            }
          } 
          

          else { // update the other Neurons/Layers

            const graphNode = graph.getNodeAttributes(node.id);

            if (graphNode.type === 'Neuron' ) { // each neuron has n weights and 1 bias
              const weights = graphNode.component.weights;
              node.data.weight = graphNode.input_width > 1 ? weights.map((weight:any) => weight.data.toFixed(2)).join(', ') : String(weights.data.toFixed(2));
              node.data.bias = String(graphNode.component.bias.data.toFixed(2));
            }

            if (graphNode.type === 'Layer') { // each layer has X * n weights and X biases, hence more functions involved
              const neurons = graphNode.component.neurons;
              const weightsAndBiases = neurons.map((neuron: any) => ({
                weights: Array.isArray(neuron.weights) ? neuron.weights.map((weight: any) => weight.data.toFixed(2)) : [neuron.weights.data?.toFixed(2)],
                bias: Array.isArray(neuron.bias) ? neuron.bias.map((bias: any) => bias.data.toFixed(2)) : [neuron.bias.data?.toFixed(2)]
              }));
  
              node.data.weight = weightsAndBiases.map((wb:any,i:number) => `W${i} = ${wb.weights.join(', ')},`).join('\n');
              node.data.bias = weightsAndBiases.map((wb:any, i:number) => `B${i} = ${wb.bias.join(', ')},`).join('\n');
            }
          }
          return node;
        });
        
        setNodes(updatedNodes); // set nodes with the updated nodes
        
      
      trainingFields.setTrainingState('idle');
    }
    
    

    if(trainingFields.TrainingState === 'forpass'){

      let outputs:sn.Tensor[]=[];
      let inputs:number[] = [];
      let outputsY:number[]=[];
      

      // takes inputs input by user and stores them in a list
      inputs = nodes.filter((node) => node.type == 'inputnode').map((node) => node.data.data);

      // calls forward pass function and updates output neurons to display the output
      try {
        outputs = model.forward(inputs);
        outputsY = outputs.map((o) => o.data);
        nodes.filter((n) => n.type === 'outputNeuron').forEach((n, i) => n.data.data = outputsY[i].toFixed(2));
      } catch (error) {
  
      }
    
      trainingFields.setShowFPData([true,true]);

      trainingFields.setTrainingState('idle');

    }



  // Generates input output nodes depending on the training_set chosen. The nodes and edges lists are emptied at the beginning.
  if (trainingFields.TrainingState==='reset'){

    trainingFields.setTrainingState('idle');
  
    trainingFields.setIsNewModel(true);
    trainingFields.setLosses([]);

    const newNodes: Node[] = [];
      
    // Add input nodes
    for (let i = 0; i < (trainingFields.TrainingData?.Inputs[0] ?? []).length; i++) {
      const newNode = {
        id: `i${i}`,
        type: 'inputnode',
        sourcePosition: Position.Right,
        draggable: false,
        data: { label: `IN ${i + 1}`, 
                data: 0, 
                index:i,
              },
        position: { x: 0, y: 12 + i * 100 },
        
      };

      newNodes.push(newNode);

      const state: boolean[] = [false,false]
      trainingFields.setShowFPData(state);
      
    }

    // Add output nodes
    for (let i = 0; i < (trainingFields.TrainingData?.Outputs[0] ?? []).length; i++) {
      const newNode = {
        id: `o${i}`,
        type: 'outputNeuron',
        targetPosition: Position.Left,
        draggable: true,
        selectable:false,
        data: { label: `OUT ${i + 1}`,
                data: 0,
                weight: 'uninitialized',
                bias: 'uninitialized',
                },
        position: { x: 800, y: i * 100 },
        
      };

      // Adds the generated nodes to the "reactflow nodes array"
      newNodes.push(newNode);
      
    }

    setNodes(newNodes);
    setEdges([]);
  }


  // Simply reinitializes the model without having to reset the network built by the user
  if (trainingFields.TrainingState == 'reinit'){

    trainingFields.setIsNewModel(true);
    trainingFields.setShowFPData([false,false]);
    trainingFields.setTrainingState('idle');
    
  }


  return (
    <div>
     
    </div>

  );
};

export default NodeContainer;
