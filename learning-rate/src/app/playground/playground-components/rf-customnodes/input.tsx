import React from 'react';
import { Handle, Position } from 'reactflow';
import { useContext } from 'react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';

function Input({ data }: { data: any; }) {
  
const trainingFields = useContext(TrainingFields);

  return (

    <div className="block relative h-14 w-20 border-2 bg-gray-100 border-black rounded-2xl hover:scale-105 flex justify-center items-center">

      {(trainingFields.showFPData[0] === false || trainingFields.isNewModel)? (
        <span className="block text-center font-bold">{String(data.label)}</span>

      ) : (

        <input
          placeholder='0'
          onChange={(e) => {
          data.data = e.target.value }}
          type = 'string'

          className="w-full h-full text-center  font-bold bg-transparent border-none outline-none"
        />

      )}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default Input;
