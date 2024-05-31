import { createContext } from 'react';

// Context use to pass around values and functions to components, without having to pass props
export interface TrainingFields {

    Activation: 'relu'|'tanh';
    Epochs: number;
    LearningRate: number;
    BatchSize: number;

    setActivation: (state: 'relu'|'tanh') => void;
    setEpochs: (state: number) => void;
    setLearningRate: (state: number) => void;
    setBatchSize: (state: number) => void;

    TrainingState: string;
    setTrainingState: (state: 'idle'|'reinit'|'reset'|'train'|'forpass'|'backprop') => void;

    Losses: number[];
    setLosses: (state: number[]) => void;

    TrainingData:{
        Inputs: number[][]
        Outputs: number[][]
    };
    setTrainingData: (state: { Inputs: number[][]; Outputs: number[][] }) => void;

    isNewModel: boolean;
    setIsNewModel: (state:boolean) => void;

    showFPData: boolean[];
    setShowFPData: (state:boolean[]) => void;

    DatasetId: number;
    setDatasetId: (set: number) => void;

  }



  export const TrainingFields = createContext<TrainingFields>({

    
    Activation: 'relu',
    Epochs:50,
    LearningRate: 0.01,
    BatchSize: 1,

    setActivation(state) {},
    setEpochs(state) {},
    setLearningRate(state) {},
    setBatchSize(state) {},

    TrainingState: 'idle',
    setTrainingState(state) {},

    Losses:[],
    setLosses(state) {},
    
    TrainingData: {
        Inputs : [],
        Outputs : []
    },
    setTrainingData(state) {},

    isNewModel:true,
    setIsNewModel(state) {},

    showFPData: [],
    setShowFPData(state) {},

    DatasetId: 0,
    setDatasetId(state) {},

  });

  