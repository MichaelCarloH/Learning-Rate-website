import Playground from "./playground";

import { TrainingSets } from "./contexts & popups/trainingset_ctx";

export default async function Home() {

    const datasetsJSON = await fetch(`${process.env.URL}/api/webinfo/datasets`, { next: { revalidate: 1 * 60 * 60 } });

    const datasets: {
        trainingSetID: number;
        setName: string;
        inputWidth: number;
        outputWidth: number;
    }[] = await datasetsJSON.json();

    return (
        <main >
       

            <Playground 
                isFPBtnVisible = {true}
                isHyperParamsVisible = {true}
                isSelectionBoxVisible = {true}
                isTrainBtnsVisible = {true}
                isTrainLossVisible = {true}
                isTrainingVisible = {true}
                trainingSets= {datasets}/>

        
            
        </main>
    );
}

