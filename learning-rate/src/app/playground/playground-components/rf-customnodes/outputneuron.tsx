
import { Handle, Position } from 'reactflow';
import Image from 'next/image';
import { useContext } from 'react';
import { TrainingFields} from '../../contexts & popups/training_fields_ctx';

interface OutputProps {
  data: {

    label: string;
    weight: string;
    bias: string;
    data: string;
    
  },

}


function OutputNeuron({ data}: OutputProps) {
  
  const trainingFields = useContext(TrainingFields);
    
    return (

        <div className="block relative h-20 w-20 hover:scale-105" >
        
        <div className="block relative h-full w-full" >
        <Image
            src={"/neuron.png"}
            alt="Neuron"
            width={80}
            height={80}
            
          />
          <span className="absolute w-5/6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black bg-white bg-opacity-80 text-center text font-bold border-black border rounded-2xl">{(!trainingFields.showFPData[1]|| trainingFields.isNewModel) ? data.label : data.data}</span>
        </div>

        <Handle
          type="target"
          position={Position.Left}
        />

        </div>
      
    );
  }

  export default OutputNeuron;