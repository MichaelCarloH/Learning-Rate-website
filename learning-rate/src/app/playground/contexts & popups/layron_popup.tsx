import React from 'react';
import { useContext } from 'react'
import { TrainingFields } from './training_fields_ctx';

interface PopupProps {
  data: {
    weight: number,
    bias: number,
    selectedNodeId: number,
    input_width?: number, // New prop for input width
    output_width?: number // New prop for output width
  }
}

// Popup that shows information on weights,biases, input and output width of the selected neuron/layer
function LayronPopup({ data }: PopupProps) {
  const trainingFields = useContext(TrainingFields);

  return (
    <div className="bg-white border-2 border-black z-10 rounded-xl p-4">

      {data.input_width !== undefined ? (
        <h1 className="text-lg font-semibold">LAYER DETAILS</h1>
      ) : (
        <h1 className="text-lg font-semibold">NEURON DETAILS</h1>
      )}

      {data.output_width !== undefined && (
      <p>{data.output_width} Neurons that take {data.input_width} inputs each</p>)}
      <p>Weights: {trainingFields.isNewModel ? 'Uninitialized' : data.weight}</p>
      <p>Bias: {trainingFields.isNewModel ? 'Uninitialized' : data.bias}</p>
      
    </div>
  );
};

export default LayronPopup;
