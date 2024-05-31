import React from 'react';
import Image from 'next/image';

// Selection box from which you can pick up neurons and layers to drag into the sandbox
const SelectionBox: React.FC = () => {

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (

    <div id='playgroundDragNdrop' className="p-4 w-full bg-white border border-black border-2 rounded-xl shadow-xl">

    {/* Selection Box Title and Description */}
      <h1 className='text-center mb-2'>SELECTION BOX</h1>
      <p className="text-gray-500 text-xs tracking-widest mb-5">
        You can add a new element to your canvas by dragging and dropping it.
      </p>

    {/* Neuron Component */}
      <div className="flex justify-center items-center hover:scale-105">
        <div
          className="block relative h-20 rounded overflow-hidden mb-0"
          draggable
          onDragStart={(event) => onDragStart(event, 'neuron')}
        >
          <Image
            src={"/neuron.png"}
            alt="Neuron"
            width={80}
            height={80}
          />
        </div>
      </div>

    {/* Neuron Component Title*/}
      <div className="flex justify-center items-center mt-4">
        <h3 className="text-black-500 text-xs tracking-widest title-font mb-5">NEURON</h3>
      </div>


    {/* Neuron Layer Component */}
      <div className="flex justify-center items-center hover:scale-105">
        <div className="block relative h-20 rounded overflow-hidden mb-0"
          draggable
          onDragStart={(event) => onDragStart(event, 'layer')}
        >
          <Image
            src={"/NL.png"}
            alt="Neuron Layer"
            width={80}
            height={80}
            className="shadow-xl"
          />
        </div>
      </div>

    {/* Neuron Layer Component Title*/}
      <div className="flex justify-center items-center mt-4">
        <h3 className="text-black-500 text-xs tracking-widest title-font mb-5">NEURON LAYER</h3>
      </div>
    </div>
  );
};

export default SelectionBox;
