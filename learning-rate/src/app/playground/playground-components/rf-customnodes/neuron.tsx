
import { Handle, Position } from 'reactflow';
import Image from 'next/image';

function Neuron() {
    
    return (
        <div className="block relative h-20 w-20 hover:scale-105"  >
        <Handle type="target" position={Position.Left} />

        <div className="block relative h-full w-full" >
        <Image
            src={"/neuron.png"}
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

  export default Neuron;