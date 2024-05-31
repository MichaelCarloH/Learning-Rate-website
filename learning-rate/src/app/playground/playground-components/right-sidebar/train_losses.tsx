import React from 'react';
import Image from "next/image";
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';
import { useContext } from 'react';

const Output = () => {

  const trainingFields = useContext(TrainingFields);

  return (
    <div id="lossesBar" className="w-full h-20 bg-white border-black border-2 p-4 rounded-xl shadow-xl">
            <div className="h-full flex items-center ">
            <Image src={"/big-data.png"} 
                    alt="Pause"
                    width = {70}
                    height = {20}
                    className='h-14 w-14'
                     />
            <div className="ml-4 flex-col ">
                <h2 className="w-full h-4 mt-4 ">TRAINING LOSS</h2>
                <p className="w-full h-10 mt-2 ml-4 text-black">{trainingFields.Losses[trainingFields.Losses.length-1]?.toFixed(2)}</p>
            </div>
            </div>
        </div>
  );
};

export default Output;
