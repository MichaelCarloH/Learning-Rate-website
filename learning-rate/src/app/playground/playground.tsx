'use client'

import React, { useState } from 'react';
import TrainButton from './playground-components/left-sidebar/train_btn';
import Hyper from './playground-components/left-sidebar/hyper_parameters';
import Output from './playground-components/right-sidebar/train_losses';
import Canvas from './playground-components/reactflow_sandbox';
import SelectionBox from './playground-components/right-sidebar/dragndrop_box';
import Training from './playground-components/left-sidebar/trainsets_dropdown';
import { ReactFlowProvider } from 'reactflow';
import ForPassButton from './playground-components/right-sidebar/fpass_btn';
import { TrainingFields} from './contexts & popups/training_fields_ctx'
import UninitBtn from './playground-components/left-sidebar/reinit_btn';
import { TrainingSets } from './contexts & popups/trainingset_ctx';


interface PlaygroundProps {

    isTrainingVisible:boolean,
    isHyperParamsVisible:boolean,
    isTrainBtnsVisible:boolean,
    isSelectionBoxVisible:boolean,
    isTrainLossVisible:boolean,
    isFPBtnVisible:boolean,

    trainingSets:{
        trainingSetID: number;
        setName: string;
        inputWidth: number;
        outputWidth: number;
    }[],
}

export const Playground:React.FC<PlaygroundProps> = ({isTrainingVisible,isHyperParamsVisible,isTrainBtnsVisible,isSelectionBoxVisible,
    isTrainLossVisible,isFPBtnVisible,trainingSets}) => {
        
    
    // Stores info on the training state of the model and its parameters
    const [TrainingState,setTrainingState] = useState<'idle'|'reset'|'reinit'|'train'|'forpass'|'backprop'>('idle'); 
    const [Losses, setLosses] = useState<number[]>([]);
    const [TrainingData, setTrainingData] = useState<{Inputs:number[][],Outputs:number[][]}>({ Inputs: [[]], Outputs: [[]] });
    const [DatasetId, setDatasetId] = useState<number>(0);
    const [isNewModel,setIsNewModel] = useState<boolean>(true); // set to false after first train, when true then model is reset
    const [showFPData,setShowFPData] = useState<boolean[]>([false,false]);

    // Stores the state of the Hyperparameters
    const [Epochs, setEpochs] = useState<number>(1);
    const [LearningRate, setLearningRate] = useState<number>(0.01);
    const [Activation, setActivation] = useState<'relu'|'tanh'>('relu'); 
    const [BatchSize, setBatchSize] = useState<number>(1);     

    return (
        
        <main className="h-screen relative border-2 border-gray">
            
        <TrainingFields.Provider 
        value = {{Activation,Epochs,LearningRate,BatchSize,setActivation,setEpochs,setLearningRate,setBatchSize,TrainingState,
            setTrainingState,Losses,setLosses,TrainingData,setTrainingData,isNewModel,setIsNewModel,showFPData,setShowFPData,
            DatasetId,setDatasetId}}>

            {/* Left Sidebar */}
            <div className="absolute top-0 left-0 flex flex-col gap-6 w-1/6 mt-8 ml-2 z-10">
                
                {isTrainingVisible && (<TrainingSets.Provider value = {{datasets:trainingSets}}> <Training/> </TrainingSets.Provider>)}
                {isHyperParamsVisible && <Hyper/>}

                <div className="flex flex-row gap-4 ml-4">
                    {isTrainBtnsVisible && 
                        <TrainButton/>}
                    {isTrainBtnsVisible && 
                        <UninitBtn/>}
                </div>

            </div>

            {/* Middle Column */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <ReactFlowProvider>
                <Canvas/>
                </ReactFlowProvider>
            </div>

            {/* Right Sidebar */}
            <div className="absolute top-0 right-0 flex flex-col gap-6 w-1/6 mt-8 mr-6 z-10">
                {isSelectionBoxVisible && <SelectionBox />}
                {isTrainLossVisible && <Output/>}
                {isFPBtnVisible && <ForPassButton/>}
            </div>

        </TrainingFields.Provider>
    </main>
        
    );
};

export default Playground;

export type { PlaygroundProps };



