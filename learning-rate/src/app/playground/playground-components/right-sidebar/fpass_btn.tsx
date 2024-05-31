import React from 'react';
import { TrainingFields } from '../../contexts & popups/training_fields_ctx';
import { useContext } from 'react';

// Button for the forward pass
const ForPassButton= () =>{

    const trainingFields = useContext(TrainingFields);

    return (

        <button
            id='forwardBtn'
            className={`w-full h-24 mb-2 bg-blue-950 border-black border-2 p-4 rounded-xl shadow-xl flex justify-center items-center hover:cursor-pointer hover:shadow-xl hover:bg-blue-900 hover:scale-105`}
            onClick={() => trainingFields.setTrainingState('forpass')}>
        
            <h1 className="text-white text-3xl title-font font-medium mr-6 ml-2">FORWARD PASS</h1>

        </button>
    );
};

export default ForPassButton;
