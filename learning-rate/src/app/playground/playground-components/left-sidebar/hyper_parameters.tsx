import React  from 'react';
import { Dropdown } from "flowbite-react";
import { useContext } from 'react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';


const Hyper = () =>{
  
  const activationOptions: ('relu' | 'tanh')[] = ['relu', 'tanh'];

  const trainingFields = useContext(TrainingFields);

  const uniqueActivationOptions = Array.from(new Set(activationOptions));

  return (
    <div id="hyperparamsBar" className="flex flex-col bg-white gap-4 border-2 border-black rounded-xl p-2 shadow-xl ">

      <h1 className='text-center mt-2 text'>HYPER PARAMETERS</h1>
      
      <div className="relative">
        <label htmlFor="Epochs" className="leading-7 text-sm text-gray-600">Epochs</label>
        <input 
        type="number" 
        id="Epochs" 
        name="Epochs" 
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        value={trainingFields.Epochs || ''} 
        onChange={(e) => {
          const numberValue = Number(e.target.value);
          if (!isNaN(numberValue) && Number.isInteger(numberValue)) {
            trainingFields.setEpochs(Number(e.target.value));
          }}}/>
        </div>

      <div className="relative">
        <label htmlFor= "Learning Rate" className="leading-7 text-sm text-gray-600">Learning Rate</label>
        <input 
        type="number" 
        id="Learning Rate" 
        name="Learning Rate" 
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        value={trainingFields.LearningRate} 
        onChange={(e) =>  trainingFields.setLearningRate(parseFloat(e.target.value))}/>
        </div>

      <div className="relative">
        <label htmlFor= "Batch Size" className="leading-7 text-sm text-gray-600">Batch Size</label>
        <input 
        type="number" 
        id="Batch Size" 
        name="Batch Size" 
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        value={trainingFields.BatchSize || ''} 
        onChange={(e) => {
          const numberValue = Number(e.target.value);
          if (!isNaN(numberValue) && Number.isInteger(numberValue)) {
            trainingFields.setBatchSize(numberValue);
          }}}/>        
      </div>

      <div id='activationSelector' className='relative bg-blue-950 rounded-lg mb-2 hover:cursor-pointer hover:bg-blue-900 hover:scale-105'>
      <Dropdown label={trainingFields.Activation ?? 'Activation Function'} theme={{ floating: { target: 'w-full' } }}>
                {uniqueActivationOptions.map((func) => (
                    <Dropdown.Item key={func} onClick={() => trainingFields.setActivation(func)}>
                        {func}
                    </Dropdown.Item>
                ))}
      </Dropdown>
      </div>
 
    </div>
  );
};

export default Hyper;
