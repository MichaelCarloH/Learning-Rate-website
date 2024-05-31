import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background, 
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Neuron from './rf-customnodes/neuron';
import NeuronLayer from './rf-customnodes/layer';
import OutputNeuron from './rf-customnodes/outputneuron';
import Input from './rf-customnodes/input';
import NodeContainer from '../smallneuron-integration/sn_integration';
import LayronPopup from '../contexts & popups/layron_popup';

import { useContext } from 'react';
import { TrainingFields } from '../contexts & popups/training_fields_ctx';
import LayerSelectionPopup from '../contexts & popups/layer_selection_popup';



// Custom node types defined by us
const nodeTypes = { neuron: Neuron, layer: NeuronLayer, outputNeuron: OutputNeuron, inputnode: Input, popup: LayronPopup };


// Sets the canvas default view zoomed out
const Viewport = {
  x: 315,
  y: 125,
  zoom: 0.9
};


// ID of the nodes, at every input/output node generated or neuron/layer dropped it increases by 1
let id = 0;


type ReactFlowInstance = {
  screenToFlowPosition: (position: { x: number; y: number }) => { x: number; y: number };
  getZoom: ()=> number;
  
};


const Canvas = () => {

  const trainingFields = useContext(TrainingFields)

  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]); // nodes array
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // edges array
  const [reactFlowInstance, setReactFlowInstance] = useState< ReactFlowInstance | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null); // stores layer popup position
                                                                                              


  // At every connection between two nodes, the edges list is updated with the new edge
  // In addition, at every connection the model is re-initialized
  const onConnect = useCallback( (params:any) => {

    setEdges((eds) => addEdge(params, eds))

    trainingFields.setIsNewModel(true);
    closeInfoPopup();
  
  },[]
  );


  // Even when an edge is deleted, we re-initialize the model
  const onEdgesDeleteHandler = useCallback((changes:any) => {

    const removedEdges = changes.filter((change:any) => change.type === 'remove');

    if (removedEdges.length > 0) {
      trainingFields.setIsNewModel(true);
    }

    onEdgesChange(changes);
  }, [onEdgesChange]);



  // Function that allows to drag and drop neurons/layers from sidebar to canvas
  const onDragOver = useCallback((event:any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  // Function that adds the popup node to "nodes" and displays it when a neuron/layer only is selected
  const openInfoPopUp = useCallback((event:any, node: any) => {
    event.preventDefault();
    let data = {};

    // we pass the info of the selected node to the popup node that will display it
    if (node.type == 'neuron' || node.type == 'outputNeuron') {
      data = {
        weight: node.data.weight,
        bias: node.data.bias,
        selectedNodeId: node.id,
      };
    }

      // If the selected node is a layer, add input and output width to the data
      if (node.type === 'layer') {
        data = {
          weight: node.data.weight,
          bias: node.data.bias,
          selectedNodeId: node.id,
          input_width: node.data.input_width,
          output_width: node.data.output_width,

        };
      }
  
      // we create the new popup node with the appropriate data and add it to the nodes
      const newNode = { 
        id: `popup`, 
        type: 'popup', 
        data: data,
        position: { x: node.position.x + 100, y: node.position.y - 100}, 
        draggable: false 
      };
  
      if (node.type != 'inputnode')
      setNodes((nds) => [...nds.filter(n => n.type !== 'popup'), newNode]);
    }
  , []);
  

  
  // Function that closes the popup (removes the node from the list) when the background is clicked
  const closeInfoPopup = useCallback(() => {
    
    setNodes((nds) => nds.filter(n => n.type !== 'popup'));
    
  }, []);


  // Function for the popup that allows you to select input and output width of the layer
  // When the confirm button is pressed, the widths are passed to the dropped layer
  const handlePopupConfirm = useCallback((inputWidth: number, outputWidth: number) => {
    const layerNode = nodes.find((node) => node.type === 'layer' && node.position.x === popupPosition?.x && node.position.y === popupPosition?.y);
    if (layerNode) {
      const updatedNode = {
        ...layerNode,
        data: {
          ...layerNode.data,
          input_width: inputWidth,
          output_width: outputWidth,
        },
      };
      setNodes((nds) => nds.map((node) => (node.id === updatedNode.id ? updatedNode : node)));
    }
    setPopupPosition(null); // Close the popup after confirmation
  }, [nodes, popupPosition]);


 // Every node dropped is added to "nodes"
 const onDrop = useCallback(
  (event:any) => {

    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    // Check if the dropped element is valid
    if (typeof type === 'undefined' || !type || !reactFlowInstance) {
      return;
    }

     const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Checks if the element dropped is a Neuron or a Layer
    if (type === 'neuron') {

      const newNode = {
        id: `n${id++}`,
        type: 'neuron',
        position,
        data: { label: `${type} node`,
                weight: 'uninitialized',
                bias: 'uninitialized' },
      };
      setNodes((nds) => nds.concat(newNode));

    } 
    
    else { // Layer node
      const newNode = {
        id: `l${id++}`,
        type: 'layer',
        position,
        data: { label: `${type} node`,
                weight:'Uninitialized',
                bias: 'Uninitialized',
                input_width: 1,
                output_width: 1},
      };

      // adds the nez node
      setNodes((nds) => nds.concat(newNode));
      setPopupPosition(position); // displays the popup that allows you to choose input and output width of layer
    }

  },
  [reactFlowInstance],
);


  return (
    <div id='playgroundCanvas' className=" w-full h-full">
      
      
        <div className="w-full h-full " ref={reactFlowWrapper}>
        
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesDeleteHandler}
            onConnect={onConnect}
            
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultViewport= {Viewport} 
            onNodeClick={openInfoPopUp}
            onPaneClick={closeInfoPopup}
            onNodesDelete={closeInfoPopup} >

              {/**Container with the code that integrates the reacflow UI with the smallneuron library */}
              <NodeContainer 
                nodes = {nodes}
                edges = {edges} 
                setNodes={setNodes}
                setEdges = {setEdges}
                />
            
            <Background color="#000" variant={BackgroundVariant.Dots} />

          </ReactFlow>
        </div>

        {/* Popup to select input and output width of popup, only displayed if its position is defined */}
        {popupPosition && (
        <LayerSelectionPopup xPos={popupPosition.x} yPos={popupPosition.y} onConfirm={handlePopupConfirm} />)}
        
      

    </div>
  );
};

export default Canvas;
