import React from 'react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';
import { useContext } from 'react';


//Reinitializes the model without resetting the network built by the user
const ReinitBtn = () =>{

    const trainingFields = useContext(TrainingFields);

    return (

        <button
            id='reinitBtn'
            className={`w-24 mb-2 bg-blue-950 border-black border-2 p-4 rounded-xl shadow-xl flex justify-center items-center hover:cursor-pointer hover:shadow-xl hover:bg-blue-900 hover:scale-105`}
            onClick={() => trainingFields.setTrainingState('reinit')}>
        
            <h1 className="text-white text-xl title-font font-medium mr-6 ml-2">RE-INIT</h1>

        </button>
    );
};

export default ReinitBtn;
