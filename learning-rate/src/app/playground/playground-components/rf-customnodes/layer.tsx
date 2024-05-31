import { Handle, Position } from 'reactflow';
import Image from 'next/image';

interface LayerProps {
  data: {

    label: string;
    input_width: number;
    output_width: number;
    weight: string;
    bias: string;
    data: string;
    
  },

}

function NeuronLayer() {
    
    return (
        <div className="block relative h-20 w-20 hover:scale-105" >
        <Handle type="target" position={Position.Left} />

        <div className="block relative h-full w-full" >
        <Image
            src={"/NL.png"}
            alt="Neuron"
            width={80}
            height={80}
          />
        </div>

        <Handle
          type="source"
          position={Position.Right}
        />
        </div>
      
    );
  }

  export default NeuronLayer;