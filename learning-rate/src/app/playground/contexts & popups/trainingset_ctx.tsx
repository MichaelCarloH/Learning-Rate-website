import { createContext } from 'react';

// Context use to pass around values and functions to components, without having to pass props
export interface TrainingSetsType {

    datasets: {
        trainingSetID: number;
        setName: string;
        inputWidth: number;
        outputWidth: number;
    }[],

  }


export const TrainingSets = createContext<TrainingSetsType>({

    datasets: [],

});

  