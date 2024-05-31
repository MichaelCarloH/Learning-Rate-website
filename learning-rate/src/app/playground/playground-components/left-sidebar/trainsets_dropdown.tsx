import React from 'react';
import { Dropdown } from 'flowbite-react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';
import { useContext } from 'react';
import { TrainingSets } from '../../contexts & popups/trainingset_ctx';


const TrainingSetsDropdown = () => {

    const trainingFields = useContext(TrainingFields);

    const trainingsets = useContext(TrainingSets);

    const setList = trainingsets.datasets.map((dataset) => dataset.setName);

    // Function that handles change of training set, each set provides training data to train the model
    const handleSetChange = (set: number) => {
        
       
        
        
        fetch(`/api/webinfo/trainingdata/${set}`)
        .then(r => r.json())
        .then((r: {
            inputs: number[][];
            outputs: number[][];
            }) => {
            const td: {
                Inputs: number[][]
                Outputs: number[][]
            } = { Inputs:r.inputs, Outputs: r.outputs};

            trainingFields.setTrainingData(td);
            trainingFields.setDatasetId(set);
            trainingFields.setTrainingState('reset');
        })
        
    };

    
    return (
        <div id="trainingSetSelector" className="flex flex-col bg-white gap-4 border-2 border-black rounded-xl p-2 shadow-xl relative z-10">
            <h1 className="text-center mt-2 text">TRAINING SETS</h1>
            <div className="relative bg-blue-950 rounded-lg mb-2 hover:cursor-pointer hover:shadow-xl hover:bg-blue-900 hover:scale-105">
                <Dropdown label={trainingFields.DatasetId === 0 ? 'Select a training set':trainingsets.datasets.find(dataset => dataset.trainingSetID === trainingFields.DatasetId )?.setName} theme={{ floating: { target: 'w-full' } }}>
                    {trainingsets.datasets.map((set) => (
                        <Dropdown.Item key={set.trainingSetID} onClick={() => {
                                    handleSetChange(set.trainingSetID);
                                }}>
                            {set.setName}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>
        </div>
    );
};

export default TrainingSetsDropdown;
