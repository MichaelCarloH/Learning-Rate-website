import React from 'react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';
import { useContext } from 'react';


// Button that trains the model
const TrainButton = () =>{

    const trainingFields = useContext(TrainingFields);

    return (

        <button
            id="trainBtn"
            className={`w-24 mb-2 bg-blue-950 border-black border-2 p-4 rounded-xl shadow-xl flex justify-center items-center hover:cursor-pointer hover:shadow-xl hover:bg-blue-900 hover:scale-105`}
            onClick={() => trainingFields.setTrainingState('train')}>
        
            <h1 className="text-white text-xl title-font font-medium mr-6 ml-6">{trainingFields.isNewModel ? 'TRAIN' : 'TRAIN FURTHER'}</h1>

        </button>
    );
};

export default TrainButton;
